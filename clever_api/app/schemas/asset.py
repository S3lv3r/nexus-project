from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class AssetBase(BaseModel):
    igdb_id: int
    name: str
    slug: str
    summary: Optional[str] = None
    cover_url: Optional[str] = None
    genres: Optional[str] = None
    release_date: Optional[int] = None
    initial_price: float
    current_price: float
    change_24h: float
    high_24h: float
    low_24h: float
    volume_24h: float
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    hypes: Optional[int] = None
    follows: Optional[int] = None
    sentiment_score: float

class AssetRead(AssetBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AssetSyncRequest(BaseModel):
    limit: int = 20
    query: Optional[str] = None
