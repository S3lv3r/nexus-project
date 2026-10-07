from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.market import MarketOverview, MarketTickResponse
from app.services.market_service import market_service

router = APIRouter(prefix="/market", tags=["Market"])

@router.get("/overview", response_model=MarketOverview)
async def get_market_overview(db: AsyncSession = Depends(get_db)):
    return await market_service.get_market_overview(db)

@router.post("/tick", response_model=MarketTickResponse)
async def trigger_market_tick(db: AsyncSession = Depends(get_db)):
    return await market_service.execute_market_tick(db)
