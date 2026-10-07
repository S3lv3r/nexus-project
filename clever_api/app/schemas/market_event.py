from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class EventImpactItem(BaseModel):
    asset_id: Optional[int] = None
    asset_name: Optional[str] = None
    asset_slug: Optional[str] = None
    old_price: Optional[float] = None
    new_price: Optional[float] = None
    change_pct: float
    new_sentiment: Optional[float] = None
    reason: Optional[str] = None

class MarketEventRead(BaseModel):
    id: int
    title: str
    description: str
    category: str
    impacts: List[Dict[str, Any]]
    is_active: bool
    created_at: Optional[str] = None

class MarketEventTriggerRequest(BaseModel):
    catalyst_index: Optional[int] = None
    is_random: bool = False

class PresetCatalystRead(BaseModel):
    title: str
    description: str
    category: str
    impacts: List[Dict[str, Any]]

class AssetCatalystRead(BaseModel):
    event_id: int
    title: str
    description: str
    category: str
    change_pct: float
    reason: str
    created_at: Optional[str] = None
