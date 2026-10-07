import math
import random
from datetime import datetime, timedelta
from typing import List
from sqlalchemy import delete, func, insert, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.asset import Asset
from app.models.snapshot import PriceSnapshot

START_DATE = datetime(2026, 7, 1, 0, 0, 0)
CURRENT_DATE = datetime(2026, 8, 27, 21, 0, 0)

class HistorySeeder:
    async def seed_historical_snapshots_for_all(self, session: AsyncSession) -> int:
        assets_res = await session.execute(select(Asset))
        assets = list(assets_res.scalars().all())

        if not assets:
            return 0

        counts_res = await session.execute(
            select(PriceSnapshot.asset_id, func.count(PriceSnapshot.id)).group_by(PriceSnapshot.asset_id)
        )
        counts_map = {row[0]: row[1] for row in counts_res.all()}

        total_days = (CURRENT_DATE - START_DATE).days + 1
        needs_reseed_ids = []
        assets_to_seed = []

        for asset in assets:
            c = counts_map.get(asset.id, 0)
            if c < 40 or abs(asset.change_24h) < 0.001:
                if c > 0:
                    needs_reseed_ids.append(asset.id)
                assets_to_seed.append(asset)

        if needs_reseed_ids:
            await session.execute(
                delete(PriceSnapshot).where(PriceSnapshot.asset_id.in_(needs_reseed_ids))
            )
            await session.flush()

        all_snapshots = []
        for asset in assets_to_seed:
            asset_snapshots = self._generate_asset_timeline(asset, total_days)
            all_snapshots.extend(asset_snapshots)

            start_p = asset_snapshots[0]["price"]
            end_p = asset_snapshots[-1]["price"]
            high_p = max(s["price"] for s in asset_snapshots)
            low_p = min(s["price"] for s in asset_snapshots)

            asset.initial_price = start_p
            asset.current_price = end_p
            asset.high_24h = high_p
            asset.low_24h = low_p
            if start_p > 0:
                asset.change_24h = round(((end_p - start_p) / start_p) * 100.0, 2)

        if all_snapshots:
            chunk_size = 2000
            for i in range(0, len(all_snapshots), chunk_size):
                chunk = all_snapshots[i:i + chunk_size]
                await session.execute(insert(PriceSnapshot), chunk)

            await session.commit()

        return len(all_snapshots)

    def _generate_asset_timeline(self, asset: Asset, total_days: int) -> List[dict]:
        end_price = max(10.0, asset.current_price)
        rating = asset.rating or 75.0
        hypes = asset.hypes or 0

        base_volatility = max(0.018, min(0.055, 0.02 + (hypes / 8000.0)))
        seed_value = int(asset.id * 7919 + asset.igdb_id)
        rng = random.Random(seed_value)

        macro_drift = (rating - 75.0) / 250.0
        start_ratio = rng.uniform(0.78, 1.22)
        if abs(start_ratio - 1.0) < 0.04:
            start_ratio = 1.08 if rng.random() > 0.5 else 0.92

        start_price = max(8.0, round(end_price * start_ratio, 2))

        prices = [start_price]
        curr = start_price

        steam_sale_start = 10
        steam_sale_end = 22
        gamescom_day = 50

        for day in range(1, total_days):
            progress = day / float(total_days)
            target_trend = start_price + (end_price - start_price) * (progress ** 1.15)

            noise = rng.gauss(0.0, base_volatility)
            trend_pull = (target_trend - curr) * 0.14

            summer_factor = 0.0
            if steam_sale_start <= day <= steam_sale_end:
                summer_factor = rng.uniform(0.005, 0.025)
            elif day >= gamescom_day:
                summer_factor = rng.uniform(-0.01, 0.03)

            delta_pct = trend_pull / max(1.0, curr) + noise + macro_drift * 0.025 + summer_factor
            delta_pct = max(-0.07, min(0.07, delta_pct))

            curr = max(5.0, curr * (1.0 + delta_pct))
            prices.append(round(curr, 2))

        prices[-1] = end_price
        if total_days > 1:
            diff = end_price - prices[-2]
            prices[-2] = round(max(5.0, end_price - (diff * 0.4)), 2)

        snapshots = []
        for day in range(total_days):
            snap_time = START_DATE + timedelta(days=day, hours=12, minutes=rng.randint(0, 59))
            price_val = round(prices[day], 2)
            vol_val = round(max(50.0, (asset.volume_24h * rng.uniform(0.6, 1.4))), 2)
            sent_val = round(max(10.0, min(98.0, asset.sentiment_score + rng.uniform(-8.0, 8.0))), 1)

            snapshots.append({
                "asset_id": asset.id,
                "price": price_val,
                "volume": vol_val,
                "rating": asset.rating,
                "hypes": asset.hypes,
                "sentiment_score": sent_val,
                "timestamp": snap_time,
            })

        return snapshots

history_seeder = HistorySeeder()
