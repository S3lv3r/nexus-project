from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class SnapshotRead(BaseModel):
    id: int
    asset_id: int
    price: float
    volume: float
    rating: Optional[float] = None
    hypes: Optional[int] = None
    sentiment_score: Optional[float] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class CandleRead(BaseModel):
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float
