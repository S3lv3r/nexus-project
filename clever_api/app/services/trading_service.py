from datetime import datetime
from typing import List
from fastapi import HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.config import settings
from app.models.asset import Asset
from app.models.holding import Holding
from app.models.portfolio import Portfolio
from app.models.snapshot import PriceSnapshot
from app.models.transaction import Transaction
from app.schemas.asset import AssetRead
from app.schemas.portfolio import HoldingRead, PortfolioRead, TradeRequest, TradeResponse, TransactionRead
from app.services.pricing_engine import pricing_engine

class TradingService:
    async def get_or_create_portfolio(self, session: AsyncSession, portfolio_id: str = "default_user") -> Portfolio:
        stmt = (
            select(Portfolio)
            .where(Portfolio.id == portfolio_id)
            .options(selectinload(Portfolio.holdings).selectinload(Holding.asset))
        )
        result = await session.execute(stmt)
        portfolio = result.scalar_one_or_none()

        if not portfolio:
            portfolio = Portfolio(id=portfolio_id, cash_balance=settings.INITIAL_CASH_BALANCE)
            session.add(portfolio)
            await session.commit()
            stmt = (
                select(Portfolio)
                .where(Portfolio.id == portfolio_id)
                .options(selectinload(Portfolio.holdings).selectinload(Holding.asset))
            )
            result = await session.execute(stmt)
            portfolio = result.scalar_one()

        return portfolio

    async def get_portfolio_summary(self, session: AsyncSession, portfolio_id: str = "default_user") -> PortfolioRead:
        portfolio = await self.get_or_create_portfolio(session, portfolio_id)

        holdings_read = []
        total_holdings_value = 0.0

        for h in portfolio.holdings:
            if h.quantity <= 0:
                continue

            asset_read = AssetRead.model_validate(h.asset) if h.asset else None
            current_price = h.asset.current_price if h.asset else h.average_buy_price
            current_val = round(h.quantity * current_price, 2)
            cost_val = round(h.quantity * h.average_buy_price, 2)
            pnl = round(current_val - cost_val, 2)
            pnl_pct = round((pnl / cost_val * 100.0), 2) if cost_val > 0 else 0.0

            total_holdings_value += current_val

            holdings_read.append(
                HoldingRead(
                    id=h.id,
                    portfolio_id=h.portfolio_id,
                    asset_id=h.asset_id,
                    quantity=h.quantity,
                    average_buy_price=h.average_buy_price,
                    current_value=current_val,
                    unrealized_pnl=pnl,
                    unrealized_pnl_percent=pnl_pct,
                    asset=asset_read,
                    updated_at=h.updated_at,
                )
            )

        total_holdings_value = round(total_holdings_value, 2)
        total_net_worth = round(portfolio.cash_balance + total_holdings_value, 2)
        total_pnl = round(total_net_worth - settings.INITIAL_CASH_BALANCE, 2)
        total_pnl_pct = round((total_pnl / settings.INITIAL_CASH_BALANCE) * 100.0, 2)

        return PortfolioRead(
            id=portfolio.id,
            cash_balance=round(portfolio.cash_balance, 2),
            holdings_value=total_holdings_value,
            total_net_worth=total_net_worth,
            total_pnl=total_pnl,
            total_pnl_percent=total_pnl_pct,
            holdings=holdings_read,
            created_at=portfolio.created_at,
            updated_at=portfolio.updated_at,
        )

    async def execute_trade(self, session: AsyncSession, trade: TradeRequest) -> TradeResponse:
        portfolio = await self.get_or_create_portfolio(session, trade.portfolio_id)

        asset = await session.get(Asset, trade.asset_id)
        if not asset:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")

        is_buy = trade.action == "BUY"
        exec_price, new_price = pricing_engine.apply_trade_impact(
            current_price=asset.current_price,
            quantity=trade.quantity,
            is_buy=is_buy,
        )
        total_cost = round(exec_price * trade.quantity, 2)

        holding_stmt = select(Holding).where(Holding.portfolio_id == portfolio.id, Holding.asset_id == asset.id)
        holding_res = await session.execute(holding_stmt)
        holding = holding_res.scalar_one_or_none()

        if is_buy:
            if portfolio.cash_balance < total_cost:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient funds. Required: ${total_cost:.2f}, Available: ${portfolio.cash_balance:.2f}",
                )
            portfolio.cash_balance -= total_cost

            if holding:
                new_qty = holding.quantity + trade.quantity
                prev_cost = holding.quantity * holding.average_buy_price
                holding.average_buy_price = round((prev_cost + total_cost) / new_qty, 2)
                holding.quantity = new_qty
            else:
                holding = Holding(
                    portfolio_id=portfolio.id,
                    asset_id=asset.id,
                    quantity=trade.quantity,
                    average_buy_price=exec_price,
                )
                session.add(holding)
        else:
            if not holding or holding.quantity < trade.quantity:
                current_qty = holding.quantity if holding else 0.0
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient asset quantity. Available: {current_qty}, Requested to sell: {trade.quantity}",
                )
            portfolio.cash_balance += total_cost
            holding.quantity -= trade.quantity
            if holding.quantity <= 0:
                holding.quantity = 0.0
                holding.average_buy_price = 0.0

        asset.current_price = new_price
        asset.volume_24h += total_cost
        asset.high_24h = max(asset.high_24h, new_price)
        asset.low_24h = min(asset.low_24h, new_price)
        if asset.initial_price > 0:
            asset.change_24h = round(((new_price - asset.initial_price) / asset.initial_price) * 100.0, 2)

        asset.sentiment_score = pricing_engine.calculate_sentiment_score(
            rating=asset.rating or 75.0,
            hypes=asset.hypes or 0,
            change_24h=asset.change_24h,
        )

        now = datetime.utcnow()
        transaction = Transaction(
            portfolio_id=portfolio.id,
            asset_id=asset.id,
            transaction_type=trade.action,
            quantity=trade.quantity,
            price_per_unit=exec_price,
            total_amount=total_cost,
            timestamp=now,
        )
        session.add(transaction)

        snapshot = PriceSnapshot(
            asset_id=asset.id,
            price=new_price,
            volume=asset.volume_24h,
            rating=asset.rating,
            hypes=asset.hypes,
            sentiment_score=asset.sentiment_score,
            timestamp=now,
        )
        session.add(snapshot)

        await session.commit()
        await session.refresh(transaction)
        await session.refresh(asset)

        summary = await self.get_portfolio_summary(session, portfolio.id)

        tx_read = TransactionRead(
            id=transaction.id,
            portfolio_id=transaction.portfolio_id,
            asset_id=transaction.asset_id,
            transaction_type=transaction.transaction_type,
            quantity=transaction.quantity,
            price_per_unit=transaction.price_per_unit,
            total_amount=transaction.total_amount,
            timestamp=transaction.timestamp,
            asset=AssetRead.model_validate(asset),
        )

        return TradeResponse(
            transaction=tx_read,
            cash_balance=summary.cash_balance,
            holdings_value=summary.holdings_value,
            total_net_worth=summary.total_net_worth,
            new_asset_price=new_price,
        )

    async def get_transactions(self, session: AsyncSession, portfolio_id: str = "default_user", limit: int = 50) -> List[TransactionRead]:
        stmt = (
            select(Transaction)
            .where(Transaction.portfolio_id == portfolio_id)
            .options(selectinload(Transaction.asset))
            .order_by(desc(Transaction.timestamp))
            .limit(limit)
        )
        result = await session.execute(stmt)
        txs = result.scalars().all()

        return [
            TransactionRead(
                id=tx.id,
                portfolio_id=tx.portfolio_id,
                asset_id=tx.asset_id,
                transaction_type=tx.transaction_type,
                quantity=tx.quantity,
                price_per_unit=tx.price_per_unit,
                total_amount=tx.total_amount,
                timestamp=tx.timestamp,
                asset=AssetRead.model_validate(tx.asset) if tx.asset else None,
            )
            for tx in txs
        ]

trading_service = TradingService()
