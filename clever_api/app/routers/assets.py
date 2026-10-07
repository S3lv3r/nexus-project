from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import asc, desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.asset import Asset
from app.models.snapshot import PriceSnapshot
from app.schemas.asset import AssetRead, AssetSyncRequest
from app.schemas.snapshot import SnapshotRead
from app.services.market_service import market_service

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.get("", response_model=List[AssetRead])
async def list_assets(
    skip: int = Query(0, ge=0),
    limit: int = Query(250, ge=1, le=500),
    sort_by: str = Query("volume_24h"),
    order: str = Query("desc"),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Asset)

    if search:
        stmt = stmt.where(Asset.name.ilike(f"%{search}%"))

    sort_column = getattr(Asset, sort_by, Asset.volume_24h)
    if order.lower() == "asc":
        stmt = stmt.order_by(asc(sort_column))
    else:
        stmt = stmt.order_by(desc(sort_column))

    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())

@router.get("/top10/compare", response_model=List[Dict[str, Any]])
async def get_top10_comparison(db: AsyncSession = Depends(get_db)):
    priority_slugs = [
        "grand-theft-auto-vi",
        "grand-theft-auto-v",
        "elden-ring",
        "minecraft",
        "counter-strike-2",
        "cyberpunk-2077",
        "the-witcher-3-wild-hunt",
        "league-of-legends",
        "valorant",
        "fortnite",
        "black-myth-wukong",
        "baldurs-gate-3",
        "hades-ii",
        "hollow-knight-silksong",
    ]

    top_assets = []
    for slug in priority_slugs:
        res = await db.execute(select(Asset).where(Asset.slug == slug))
        a = res.scalar_one_or_none()
        if a and a not in top_assets:
            top_assets.append(a)
        if len(top_assets) >= 10:
            break

    if len(top_assets) < 10:
        fill_res = await db.execute(
            select(Asset).order_by(desc(Asset.volume_24h)).limit(10)
        )
        for a in fill_res.scalars().all():
            if a not in top_assets:
                top_assets.append(a)
            if len(top_assets) >= 10:
                break

    result = []
    for asset in top_assets[:10]:
        snaps_res = await db.execute(
            select(PriceSnapshot)
            .where(PriceSnapshot.asset_id == asset.id)
            .order_by(PriceSnapshot.timestamp.asc())
            .limit(300)
        )
        snaps = snaps_res.scalars().all()

        result.append({
            "id": asset.id,
            "name": asset.name,
            "slug": asset.slug,
            "cover_url": asset.cover_url,
            "current_price": asset.current_price,
            "initial_price": asset.initial_price,
            "change_24h": asset.change_24h,
            "sentiment_score": asset.sentiment_score,
            "genres": asset.genres,
            "snapshots": [
                {
                    "timestamp": s.timestamp.isoformat(),
                    "price": s.price,
                    "sentiment_score": s.sentiment_score,
                }
                for s in snaps
            ],
        })

    return result

@router.get("/{asset_id}", response_model=AssetRead)
async def get_asset(asset_id: int, db: AsyncSession = Depends(get_db)):
    asset = await db.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    return asset

@router.get("/{asset_id}/history", response_model=List[SnapshotRead])
async def get_asset_history(
    asset_id: int,
    limit: int = Query(300, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
):
    asset = await db.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")

    stmt = (
        select(PriceSnapshot)
        .where(PriceSnapshot.asset_id == asset_id)
        .order_by(PriceSnapshot.timestamp.asc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())

@router.post("/sync", response_model=List[AssetRead])
async def sync_assets(
    payload: AssetSyncRequest = AssetSyncRequest(),
    db: AsyncSession = Depends(get_db),
):
    synced = await market_service.sync_assets(db, limit=payload.limit, query=payload.query)
    return synced

@router.post("/sync-massive", response_model=List[AssetRead])
async def sync_massive_catalog(
    db: AsyncSession = Depends(get_db),
):
    synced = await market_service.sync_massive_catalog(db, target_count=150)
    return synced
