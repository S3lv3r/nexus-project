from typing import Any, Dict, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.market_event import AssetCatalystRead, MarketEventRead, MarketEventTriggerRequest
from app.services.event_service import event_service

router = APIRouter(prefix="/events", tags=["Market Events & Pop Culture Catalysts"])

@router.get("", response_model=List[MarketEventRead])
async def list_events(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await event_service.get_active_events(db, limit=limit)

@router.get("/presets", response_model=List[Dict[str, Any]])
async def get_preset_catalysts():
    return await event_service.get_preset_catalysts()

@router.post("/trigger", response_model=Dict[str, Any])
async def trigger_market_event(
    payload: MarketEventTriggerRequest = MarketEventTriggerRequest(),
    db: AsyncSession = Depends(get_db),
):
    if payload.is_random or payload.catalyst_index is None:
        return await event_service.trigger_random_event(db)
    return await event_service.trigger_event_by_index(db, payload.catalyst_index)

@router.get("/asset/{asset_id}", response_model=List[AssetCatalystRead])
async def get_asset_events(
    asset_id: int,
    db: AsyncSession = Depends(get_db),
):
    return await event_service.get_asset_catalysts(db, asset_id=asset_id)
