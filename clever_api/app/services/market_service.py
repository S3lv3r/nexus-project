from datetime import datetime
from typing import List, Optional
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.asset import Asset
from app.models.snapshot import PriceSnapshot
from app.schemas.market import MarketOverview, MarketTickResponse
from app.services.history_seeder import history_seeder
from app.services.igdb_service import igdb_service
from app.services.pricing_engine import pricing_engine

class MarketService:
    async def sync_assets(self, session: AsyncSession, limit: int = 50, query: Optional[str] = None) -> List[Asset]:
        games_data = await igdb_service.fetch_popular_games(limit=limit, query=query)
        assets = await self._persist_games(session, games_data)
        await history_seeder.seed_historical_snapshots_for_all(session)
        return assets

    async def sync_massive_catalog(self, session: AsyncSession, target_count: int = 150) -> List[Asset]:
        games_data = await igdb_service.fetch_massive_catalog(target_count=target_count)
        assets = await self._persist_games(session, games_data)
        await history_seeder.seed_historical_snapshots_for_all(session)
        return assets

    async def _persist_games(self, session: AsyncSession, games_data: List[dict]) -> List[Asset]:
        if not games_data:
            return []

        synced_assets = []
        now = datetime.utcnow()
        igdb_ids = [g["igdb_id"] for g in games_data if "igdb_id" in g]

        stmt = select(Asset).where(Asset.igdb_id.in_(igdb_ids))
        result = await session.execute(stmt)
        existing_map = {a.igdb_id: a for a in result.scalars().all()}

        for game in games_data:
            igdb_id = game.get("igdb_id")
            if not igdb_id:
                continue

            existing = existing_map.get(igdb_id)

            if existing:
                existing.rating = game.get("rating")
                existing.rating_count = game.get("rating_count")
                existing.hypes = game.get("hypes")
                existing.follows = game.get("follows")
                if game.get("cover_url"):
                    existing.cover_url = game.get("cover_url")
                if game.get("summary"):
                    existing.summary = game.get("summary")

                existing.sentiment_score = pricing_engine.calculate_sentiment_score(
                    rating=existing.rating or 75.0,
                    hypes=existing.hypes or 0,
                    change_24h=existing.change_24h,
                )
                synced_assets.append(existing)
            else:
                initial_price = pricing_engine.calculate_initial_price(
                    rating=game.get("rating") or 75.0,
                    hypes=game.get("hypes") or 0,
                    follows=game.get("follows") or 0,
                    rating_count=game.get("rating_count") or 0,
                )
                sentiment = pricing_engine.calculate_sentiment_score(
                    rating=game.get("rating") or 75.0,
                    hypes=game.get("hypes") or 0,
                    change_24h=0.0,
                )

                new_asset = Asset(
                    igdb_id=igdb_id,
                    name=game["name"],
                    slug=game["slug"],
                    summary=game.get("summary"),
                    cover_url=game.get("cover_url"),
                    genres=game.get("genres"),
                    release_date=game.get("release_date"),
                    initial_price=initial_price,
                    current_price=initial_price,
                    change_24h=0.0,
                    high_24h=initial_price,
                    low_24h=initial_price,
                    volume_24h=round((game.get("follows", 10) * 12.5) + 500.0, 2),
                    rating=game.get("rating"),
                    rating_count=game.get("rating_count"),
                    hypes=game.get("hypes"),
                    follows=game.get("follows"),
                    sentiment_score=sentiment,
                )
                session.add(new_asset)
                synced_assets.append(new_asset)

        await session.flush()
        await session.commit()
        return synced_assets

    async def execute_market_tick(self, session: AsyncSession) -> MarketTickResponse:
        stmt = select(Asset)
        result = await session.execute(stmt)
        assets = result.scalars().all()

        snapshots_count = 0
        now = datetime.utcnow()

        for asset in assets:
            new_price = pricing_engine.generate_market_tick_price(
                current_price=asset.current_price,
                sentiment_score=asset.sentiment_score,
                rating=asset.rating or 75.0,
                hypes=asset.hypes or 0,
            )

            asset.current_price = new_price
            asset.high_24h = max(asset.high_24h, new_price)
            asset.low_24h = min(asset.low_24h, new_price)
            if asset.initial_price > 0:
                asset.change_24h = round(((new_price - asset.initial_price) / asset.initial_price) * 100.0, 2)

            asset.sentiment_score = pricing_engine.calculate_sentiment_score(
                rating=asset.rating or 75.0,
                hypes=asset.hypes or 0,
                change_24h=asset.change_24h,
            )

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
            snapshots_count += 1

        await session.commit()
        return MarketTickResponse(
            updated_assets_count=len(assets),
            snapshots_created=snapshots_count,
            message="Market prices and snapshots updated successfully",
        )

    async def get_market_overview(self, session: AsyncSession) -> MarketOverview:
        assets_res = await session.execute(select(Asset))
        assets = assets_res.scalars().all()

        if not assets:
            return MarketOverview(
                total_assets=0,
                total_market_cap=0.0,
                total_24h_volume=0.0,
                average_sentiment=50.0,
                top_gainers=[],
                top_losers=[],
                most_active=[],
            )

        total_market_cap = round(sum(a.current_price for a in assets), 2)
        total_volume = round(sum(a.volume_24h for a in assets), 2)
        avg_sentiment = round(sum(a.sentiment_score for a in assets) / len(assets), 1)

        gainers_stmt = select(Asset).order_by(desc(Asset.change_24h)).limit(5)
        gainers_res = await session.execute(gainers_stmt)
        top_gainers = list(gainers_res.scalars().all())

        losers_stmt = select(Asset).order_by(Asset.change_24h.asc()).limit(5)
        losers_res = await session.execute(losers_stmt)
        top_losers = list(losers_res.scalars().all())

        active_stmt = select(Asset).order_by(desc(Asset.volume_24h)).limit(5)
        active_res = await session.execute(active_stmt)
        most_active = list(active_res.scalars().all())

        return MarketOverview(
            total_assets=len(assets),
            total_market_cap=total_market_cap,
            total_24h_volume=total_volume,
            average_sentiment=avg_sentiment,
            top_gainers=top_gainers,
            top_losers=top_losers,
            most_active=most_active,
        )

market_service = MarketService()
