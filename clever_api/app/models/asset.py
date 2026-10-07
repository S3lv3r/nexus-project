from datetime import datetime
from typing import List, Optional
from sqlalchemy import Float, Integer, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    igdb_id: Mapped[int] = mapped_column(Integer, unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cover_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    genres: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    release_date: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    initial_price: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    current_price: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    change_24h: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    high_24h: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    low_24h: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    volume_24h: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    rating: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    rating_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    hypes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    follows: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    sentiment_score: Mapped[float] = mapped_column(Float, default=50.0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    snapshots: Mapped[List["PriceSnapshot"]] = relationship("PriceSnapshot", back_populates="asset", cascade="all, delete-orphan", order_by="PriceSnapshot.timestamp.asc()")
    holdings: Mapped[List["Holding"]] = relationship("Holding", back_populates="asset", cascade="all, delete-orphan")
    transactions: Mapped[List["Transaction"]] = relationship("Transaction", back_populates="asset", cascade="all, delete-orphan")
