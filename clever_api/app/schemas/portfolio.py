from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.asset import AssetRead

class HoldingRead(BaseModel):
    id: int
    portfolio_id: str
    asset_id: int
    quantity: float
    average_buy_price: float
    current_value: float = 0.0
    unrealized_pnl: float = 0.0
    unrealized_pnl_percent: float = 0.0
    asset: Optional[AssetRead] = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TransactionRead(BaseModel):
    id: int
    portfolio_id: str
    asset_id: int
    transaction_type: Literal["BUY", "SELL"]
    quantity: float
    price_per_unit: float
    total_amount: float
    timestamp: datetime
    asset: Optional[AssetRead] = None

    model_config = ConfigDict(from_attributes=True)

class PortfolioRead(BaseModel):
    id: str
    cash_balance: float
    holdings_value: float
    total_net_worth: float
    total_pnl: float
    total_pnl_percent: float
    holdings: List[HoldingRead]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TradeRequest(BaseModel):
    portfolio_id: str = "default_user"
    asset_id: int
    action: Literal["BUY", "SELL"]
    quantity: float = Field(gt=0)

class TradeResponse(BaseModel):
    transaction: TransactionRead
    cash_balance: float
    holdings_value: float
    total_net_worth: float
    new_asset_price: float
