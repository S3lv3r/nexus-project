from typing import List
from pydantic import BaseModel
from app.schemas.asset import AssetRead

class MarketOverview(BaseModel):
    total_assets: int
    total_market_cap: float
    total_24h_volume: float
    average_sentiment: float
    top_gainers: List[AssetRead]
    top_losers: List[AssetRead]
    most_active: List[AssetRead]

class MarketTickResponse(BaseModel):
    updated_assets_count: int
    snapshots_created: int
    message: str
