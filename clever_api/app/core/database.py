from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

engine = create_async_engine(settings.async_database_url, pool_pre_ping=True, echo=False)
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session

async def init_db() -> None:
    from app.models.asset import Asset
    from app.models.snapshot import PriceSnapshot
    from app.models.portfolio import Portfolio
    from app.models.holding import Holding
    from app.models.transaction import Transaction
    from app.models.market_event import MarketEvent


    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with async_session_maker() as session:
            portfolio = await session.get(Portfolio, settings.DEFAULT_USER_ID)
            if not portfolio:
                portfolio = Portfolio(
                    id=settings.DEFAULT_USER_ID,
                    cash_balance=settings.INITIAL_CASH_BALANCE
                )
                session.add(portfolio)
                await session.commit()
    except Exception as exc:
        print(f"Database connection warning: {exc}")
