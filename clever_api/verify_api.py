import asyncio
import httpx
from app.core.database import init_db
from app.main import app

async def run_verification():
    await init_db()
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        health_resp = await client.get("/health")
        assert health_resp.status_code == 200
        print("Health check OK:", health_resp.json())

        assets_resp = await client.get("/api/assets?limit=300")
        assert assets_resp.status_code == 200
        assets = assets_resp.json()
        print(f"Total listed assets in exchange: {len(assets)}")
        assert len(assets) >= 20

        first_asset = assets[0]
        first_id = first_asset["id"]
        print(f"First asset: {first_asset['name']}, Price: ${first_asset['current_price']}, ID: {first_id}")

        history_resp = await client.get(f"/api/assets/{first_id}/history")
        assert history_resp.status_code == 200
        print(f"Asset history snapshot count: {len(history_resp.json())}")

        overview_resp = await client.get("/api/market/overview")
        assert overview_resp.status_code == 200
        overview = overview_resp.json()
        print(f"Market Cap: ${overview['total_market_cap']}, Avg Sentiment: {overview['average_sentiment']}")

        presets_resp = await client.get("/api/events/presets")
        assert presets_resp.status_code == 200
        presets = presets_resp.json()
        print(f"Available Pop Culture Event Presets: {len(presets)}")
        assert len(presets) > 0

        trigger_resp = await client.post("/api/events/trigger", json={"catalyst_index": 0})
        assert trigger_resp.status_code == 200
        event_data = trigger_resp.json()
        print("Triggered Event:", event_data["title"])
        print(f"Affected assets: {len(event_data['affected_assets'])}")

        events_feed_resp = await client.get("/api/events")
        assert events_feed_resp.status_code == 200
        events_feed = events_feed_resp.json()
        print(f"Active events in newsfeed: {len(events_feed)}")

        portfolio_resp = await client.get("/api/portfolio?portfolio_id=default_user")
        assert portfolio_resp.status_code == 200
        portfolio = portfolio_resp.json()
        print(f"Portfolio Net Worth: ${portfolio['total_net_worth']}, Cash: ${portfolio['cash_balance']}")

        buy_order = {
            "portfolio_id": "default_user",
            "asset_id": first_id,
            "action": "BUY",
            "quantity": 1.0,
        }
        buy_resp = await client.post("/api/trading/order", json=buy_order)
        assert buy_resp.status_code == 200
        print("Trade order executed successfully. Remaining Cash:", buy_resp.json()["cash_balance"])

        tick_resp = await client.post("/api/market/tick")
        assert tick_resp.status_code == 200
        print("Market tick response:", tick_resp.json()["message"])

if __name__ == "__main__":
    asyncio.run(run_verification())
