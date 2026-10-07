from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.portfolio import PortfolioRead, TradeRequest, TradeResponse, TransactionRead
from app.services.trading_service import trading_service

router = APIRouter(prefix="", tags=["Trading & Portfolio"])

@router.get("/portfolio", response_model=PortfolioRead)
async def get_portfolio(
    portfolio_id: str = Query("default_user"),
    db: AsyncSession = Depends(get_db),
):
    return await trading_service.get_portfolio_summary(db, portfolio_id=portfolio_id)

@router.post("/trading/order", response_model=TradeResponse)
async def create_trade_order(
    payload: TradeRequest,
    db: AsyncSession = Depends(get_db),
):
    return await trading_service.execute_trade(db, trade=payload)

@router.get("/trading/transactions", response_model=List[TransactionRead])
async def list_transactions(
    portfolio_id: str = Query("default_user"),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    return await trading_service.get_transactions(db, portfolio_id=portfolio_id, limit=limit)
