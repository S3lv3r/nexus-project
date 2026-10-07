import hashlib
import json
import random
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.asset import Asset
from app.models.market_event import MarketEvent
from app.models.snapshot import PriceSnapshot

DEFAULT_CATALYSTS = [
    {
        "title": "Rockstar Games confirma fecha de GTA VI: Liquidación preventiva en GTA V por recambio",
        "description": "El nuevo gameplay oficial y las reservas récord de GTA VI desatan euforia (+28.5%), provocando una venta preventiva en GTA V (-14.2%) ante la migración de jugadores a la nueva entrega.",
        "category": "SECUELA",
        "impacts": [
            {"slug": "grand-theft-auto-vi", "name": "Grand Theft Auto VI", "change_pct": 28.5, "sentiment_delta": 35.0, "reason": "Hype masivo por reservas históricas"},
            {"slug": "grand-theft-auto-v", "name": "Grand Theft Auto V", "change_pct": -14.2, "sentiment_delta": -25.0, "reason": "Canibalización de mercado por anuncio de GTA VI"}
        ]
    },
    {
        "title": "Shadow of the Erdtree bate récords globales de ventas y crítica en Steam",
        "description": "La expansión colosal de FromSoftware supera todas las expectativas de la industria, catapultando la cotización de Elden Ring (+18.4%) y consolidando la franquicia.",
        "category": "LANZAMIENTO",
        "impacts": [
            {"slug": "elden-ring", "name": "Elden Ring", "change_pct": 18.4, "sentiment_delta": 22.0, "reason": "Éxito histórico de la expansión Shadow of the Erdtree"}
        ]
    },
    {
        "title": "Trailer oficial de la película de Minecraft rompe récords mundiales de audiencia",
        "description": "El impacto mediático de la producción cinematográfica dispara la afluencia de jugadores y compras en el ecosistema sandbox de Minecraft (+16.5%).",
        "category": "ADAPTACION",
        "impacts": [
            {"slug": "minecraft", "name": "Minecraft", "change_pct": 16.5, "sentiment_delta": 20.0, "reason": "Impacto mediático viral de adaptación cinematográfica"}
        ]
    },
    {
        "title": "Controversia en economía de cajas y caídas de servidores en CS2",
        "description": "Críticas severas de la comunidad provocan liquidación de posiciones en Counter-Strike 2 (-11.8%), beneficiando a su rival táctico Valorant (+8.4%).",
        "category": "POLEMICA",
        "impacts": [
            {"slug": "counter-strike-2", "name": "Counter-Strike 2", "change_pct": -11.8, "sentiment_delta": -30.0, "reason": "Descontento comunitario y problemas de servidores"},
            {"slug": "valorant", "name": "Valorant", "change_pct": 8.4, "sentiment_delta": 15.0, "reason": "Captura de usuarios insatisfechos del rival"}
        ]
    },
    {
        "title": "Worlds de League of Legends supera 6.4 millones de espectadores concurrentes",
        "description": "El pico de audiencia en la gran final revitaliza el ecosistema competitivo de Riot Games y dispara el volumen de operaciones (+14.0%).",
        "category": "ESPORTS",
        "impacts": [
            {"slug": "league-of-legends", "name": "League of Legends", "change_pct": 14.0, "sentiment_delta": 18.0, "reason": "Récord mundial de audiencia en la final de Worlds"}
        ]
    },
    {
        "title": "Team Cherry anuncia nueva ventana postergada para Silksong",
        "description": "El aplazamiento genera una corrección en Hollow Knight: Silksong (-10.5%), desviando el flujo de capital hacia Hades II (+12.0%) y Balatro (+9.5%).",
        "category": "HYPE",
        "impacts": [
            {"slug": "hollow-knight-silksong", "name": "Hollow Knight: Silksong", "change_pct": -10.5, "sentiment_delta": -20.0, "reason": "Retraso en la ventana de lanzamiento"},
            {"slug": "hades-ii", "name": "Hades II", "change_pct": 12.0, "sentiment_delta": 16.0, "reason": "Absorción de demanda en el segmento indie"},
            {"slug": "balatro", "name": "Balatro", "change_pct": 9.5, "sentiment_delta": 14.0, "reason": "Rally alcista en títulos independientes"}
        ]
    },
    {
        "title": "CD Projekt RED anuncia expansión de universo Cyberpunk y parche definitivo",
        "description": "La culminación del arco de redención tecnológica de Cyberpunk 2077 reactiva el interés masivo de compradores institucionales (+15.2%).",
        "category": "ACTUALIZACION",
        "impacts": [
            {"slug": "cyberpunk-2077", "name": "Cyberpunk 2077", "change_pct": 15.2, "sentiment_delta": 25.0, "reason": "Redención total del título y confirmación de secuela"}
        ]
    },
    {
        "title": "Evento en vivo y nuevo pase de temporada de Fortnite reúne a 12 millones de usuarios",
        "description": "El crossover épico de franquicias satura las redes sociales e impulsa la facturación dentro del battle royale (+13.6%).",
        "category": "ACTUALIZACION",
        "impacts": [
            {"slug": "fortnite", "name": "Fortnite", "change_pct": 13.6, "sentiment_delta": 19.0, "reason": "Nuevo capítulo y colaboración internacional viral"}
        ]
    },
    {
        "title": "Estreno de la Temporada 2 de The Last of Us en HBO multiplica ventas del juego",
        "description": "La transmisión del primer episodio desata una ola de compras en PlayStation y PC, elevando su cotización (+17.8%).",
        "category": "ADAPTACION",
        "impacts": [
            {"slug": "the-last-of-us-part-i", "name": "The Last of Us Part I", "change_pct": 17.8, "sentiment_delta": 24.0, "reason": "Efecto llamada de la serie de televisión de HBO"}
        ]
    },
    {
        "title": "Black Myth: Wukong alcanza 2.4 millones de jugadores concurrentes en Steam",
        "description": "El título de Game Science marca un récord sin precedentes para un juego de un solo jugador, desatando un frenesí alcista (+21.5%).",
        "category": "LANZAMIENTO",
        "impacts": [
            {"slug": "black-myth-wukong", "name": "Black Myth: Wukong", "change_pct": 21.5, "sentiment_delta": 30.0, "reason": "Lanzamiento récord mundial de jugadores simultáneos"}
        ]
    }
]

class EventService:
    async def get_active_events(self, session: AsyncSession, limit: int = 20) -> List[Dict[str, Any]]:
        stmt = select(MarketEvent).order_by(desc(MarketEvent.created_at)).limit(limit)
        result = await session.execute(stmt)
        events = list(result.scalars().all())

        if not events:
            for cat in DEFAULT_CATALYSTS[:3]:
                await self.apply_market_catalyst(session, cat)
            events = list((await session.execute(stmt)).scalars().all())

        formatted = []
        for ev in events:
            try:
                impacts = json.loads(ev.impact_data)
            except Exception:
                impacts = []

            formatted.append({
                "id": ev.id,
                "title": ev.title,
                "description": ev.description,
                "category": ev.category,
                "impacts": impacts,
                "is_active": ev.is_active,
                "created_at": ev.created_at.isoformat() if ev.created_at else None,
            })
        return formatted

    async def get_preset_catalysts(self) -> List[Dict[str, Any]]:
        return DEFAULT_CATALYSTS

    async def trigger_event_by_index(self, session: AsyncSession, index: int) -> Dict[str, Any]:
        if 0 <= index < len(DEFAULT_CATALYSTS):
            catalyst = DEFAULT_CATALYSTS[index]
            return await self.apply_market_catalyst(session, catalyst)
        return await self.trigger_random_event(session)

    async def trigger_random_event(self, session: AsyncSession) -> Dict[str, Any]:
        catalyst = random.choice(DEFAULT_CATALYSTS)
        return await self.apply_market_catalyst(session, catalyst)

    async def apply_market_catalyst(self, session: AsyncSession, catalyst: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.utcnow()
        affected_summary = []

        all_assets_res = await session.execute(select(Asset))
        all_assets = {a.slug: a for a in all_assets_res.scalars().all()}

        for impact in catalyst.get("impacts", []):
            slug = impact.get("slug")
            target_asset = all_assets.get(slug)

            if not target_asset:
                name_query = impact.get("name", "").lower()
                for a in all_assets.values():
                    if name_query and (name_query in a.name.lower() or a.slug in name_query):
                        target_asset = a
                        break

            if target_asset:
                old_price = target_asset.current_price
                delta_pct = impact.get("change_pct", 0.0)
                sentiment_delta = impact.get("sentiment_delta", 0.0)

                new_price = round(max(1.0, old_price * (1.0 + (delta_pct / 100.0))), 2)
                target_asset.current_price = new_price
                target_asset.high_24h = max(target_asset.high_24h, new_price)
                target_asset.low_24h = min(target_asset.low_24h, new_price)
                target_asset.volume_24h = round(target_asset.volume_24h + abs(delta_pct * 150.0), 2)

                if target_asset.initial_price > 0:
                    target_asset.change_24h = round(((new_price - target_asset.initial_price) / target_asset.initial_price) * 100.0, 2)

                target_asset.sentiment_score = round(max(5.0, min(99.0, target_asset.sentiment_score + sentiment_delta)), 1)

                snapshot = PriceSnapshot(
                    asset_id=target_asset.id,
                    price=new_price,
                    volume=target_asset.volume_24h,
                    rating=target_asset.rating,
                    hypes=target_asset.hypes,
                    sentiment_score=target_asset.sentiment_score,
                    timestamp=now,
                )
                session.add(snapshot)

                affected_summary.append({
                    "asset_id": target_asset.id,
                    "asset_name": target_asset.name,
                    "asset_slug": target_asset.slug,
                    "old_price": old_price,
                    "new_price": new_price,
                    "change_pct": delta_pct,
                    "new_sentiment": target_asset.sentiment_score,
                    "reason": impact.get("reason", "")
                })

        new_event = MarketEvent(
            title=catalyst["title"],
            description=catalyst["description"],
            category=catalyst.get("category", "MERCADO"),
            impact_data=json.dumps(affected_summary),
            is_active=True,
            created_at=now,
        )
        session.add(new_event)
        await session.commit()

        return {
            "event_id": new_event.id,
            "title": new_event.title,
            "description": new_event.description,
            "category": new_event.category,
            "affected_assets": affected_summary,
            "timestamp": now.isoformat(),
        }

    async def get_asset_catalysts(self, session: AsyncSession, asset_id: int) -> List[Dict[str, Any]]:
        target_asset = await session.get(Asset, asset_id)
        if not target_asset:
            return []

        stmt = select(MarketEvent).order_by(desc(MarketEvent.created_at)).limit(50)
        result = await session.execute(stmt)
        events = result.scalars().all()

        matching = []
        for ev in events:
            try:
                impacts = json.loads(ev.impact_data)
                for item in impacts:
                    if (
                        item.get("asset_id") == asset_id
                        or item.get("asset_slug") == target_asset.slug
                        or target_asset.name.lower() in str(item).lower()
                    ):
                        matching.append({
                            "event_id": ev.id,
                            "title": ev.title,
                            "description": ev.description,
                            "category": ev.category,
                            "change_pct": item.get("change_pct", 0.0),
                            "reason": item.get("reason", ""),
                            "created_at": ev.created_at.isoformat() if ev.created_at else None,
                        })
                        break
            except Exception:
                continue

        if len(matching) < 2:
            synthetic_events = self._generate_contextual_events_for_asset(target_asset)
            matching.extend(synthetic_events)

        return matching

    def _generate_contextual_events_for_asset(self, asset: Asset) -> List[Dict[str, Any]]:
        name = asset.name
        genres = (asset.genres or "").lower()
        rating = asset.rating or 75.0
        hypes = asset.hypes or 0

        seed_int = int(hashlib.md5(f"{name}-{asset.id}".encode()).hexdigest()[:8], 16)
        rng = random.Random(seed_int)

        generated = []

        is_upcoming = (asset.release_date and asset.release_date > 1735689600) or hypes > 400
        is_shooter = "shooter" in genres or "fps" in genres or "battle royale" in genres
        is_rpg = "rpg" in genres or "role-playing" in genres or "adventure" in genres
        is_indie = "indie" in genres or "puzzle" in genres or "platform" in genres
        is_sports = "sport" in genres or "racing" in genres

        if is_upcoming:
            generated.append({
                "event_id": 1000 + asset.id * 3 + 1,
                "title": f"Revelación oficial de avance y reservas récord de {name}",
                "description": f"El nuevo trailer en resolución 4K y la apertura de pedidos anticipados de {name} desatan una oleada masiva de entusiasmo en la comunidad global de jugadores.",
                "category": "HYPE",
                "change_pct": round(rng.uniform(14.0, 26.0), 1),
                "reason": "Euforia de reservas anticipadas y cobertura mediática global",
                "created_at": (datetime(2026, 8, 15) - timedelta(days=rng.randint(2, 20))).isoformat(),
            })
            generated.append({
                "event_id": 1000 + asset.id * 3 + 2,
                "title": f"Confirmación de innovaciones tecnológicas y motor gráfico para {name}",
                "description": f"El equipo de desarrollo comparte detalles técnicos que posicionan a {name} como uno de los títulos más avanzados de la generación.",
                "category": "LANZAMIENTO",
                "change_pct": round(rng.uniform(8.0, 16.0), 1),
                "reason": "Expectativas técnicas y recepción favorable de la crítica",
                "created_at": (datetime(2026, 7, 20) - timedelta(days=rng.randint(2, 15))).isoformat(),
            })
        elif is_shooter:
            generated.append({
                "event_id": 1000 + asset.id * 3 + 1,
                "title": f"Lanzamiento de nueva temporada competitiva y pase de batalla en {name}",
                "description": f"La actualización masiva de verano introduce nuevos mapas y balance competitivo que incrementa en 40% las partidas clasificatorias de {name}.",
                "category": "ACTUALIZACION",
                "change_pct": round(rng.uniform(7.5, 18.0), 1),
                "reason": "Pico de actividad por nueva temporada y recompensas",
                "created_at": (datetime(2026, 8, 10) - timedelta(days=rng.randint(1, 15))).isoformat(),
            })
            generated.append({
                "event_id": 1000 + asset.id * 3 + 2,
                "title": f"Récord de audiencia en el torneo de mitad de temporada de {name}",
                "description": f"Las finales de la liga profesional alcanzan récords de visualización simultánea en streaming, elevando la visibilidad del título.",
                "category": "ESPORTS",
                "change_pct": round(rng.uniform(6.0, 14.0), 1),
                "reason": "Éxito de audiencia en torneo internacional",
                "created_at": (datetime(2026, 7, 18) - timedelta(days=rng.randint(1, 10))).isoformat(),
            })
        elif is_rpg:
            generated.append({
                "event_id": 1000 + asset.id * 3 + 1,
                "title": f"Anuncio de expansión de contenido y parche narrativo para {name}",
                "description": f"Los creadores confirman una expansión que agregará decenas de horas de misiones inéditas, despertando el interés de antiguos y nuevos jugadores.",
                "category": "ACTUALIZACION",
                "change_pct": round(rng.uniform(9.0, 19.5), 1),
                "reason": "Gran entusiasmo por anuncio de nuevo contenido narrativo",
                "created_at": (datetime(2026, 8, 12) - timedelta(days=rng.randint(2, 18))).isoformat(),
            })
            generated.append({
                "event_id": 1000 + asset.id * 3 + 2,
                "title": f"Éxito rotundo en la campaña de descuentos de verano de {name}",
                "description": f"El título se posiciona en el top de ventas globales de plataformas digitales durante el festival de ofertas de mitad de año.",
                "category": "MERCADO",
                "change_pct": round(rng.uniform(6.0, 13.0), 1),
                "reason": "Récord de ventas durante la campaña de verano",
                "created_at": (datetime(2026, 7, 14) - timedelta(days=rng.randint(1, 8))).isoformat(),
            })
        elif is_indie:
            generated.append({
                "event_id": 1000 + asset.id * 3 + 1,
                "title": f"Viralización masiva de {name} en redes sociales y plataformas de streaming",
                "description": f"Creadores de contenido de primer nivel comparten transmisiones de {name}, convirtiéndolo en tendencia viral mundial.",
                "category": "VIRAL",
                "change_pct": round(rng.uniform(11.0, 24.0), 1),
                "reason": "Efecto viral en redes sociales y streaming",
                "created_at": (datetime(2026, 8, 8) - timedelta(days=rng.randint(1, 12))).isoformat(),
            })
            generated.append({
                "event_id": 1000 + asset.id * 3 + 2,
                "title": f"Premio de la crítica y reconocimientos de la industria para {name}",
                "description": f"El diseño innovador y la dirección artística de {name} reciben los más altos galardones en festivales de videojuegos independientes.",
                "category": "PREMIOS",
                "change_pct": round(rng.uniform(7.0, 15.0), 1),
                "reason": "Aclamación de la crítica y premios del sector",
                "created_at": (datetime(2026, 7, 22) - timedelta(days=rng.randint(2, 14))).isoformat(),
            })
        else:
            generated.append({
                "event_id": 1000 + asset.id * 3 + 1,
                "title": f"Actualización de aniversario y eventos comunitarios en {name}",
                "description": f"La comunidad celebra el nuevo hito del juego con recompensas exclusivas y un aumento sostenido en jugadores activos.",
                "category": "ACTUALIZACION",
                "change_pct": round(rng.uniform(5.5, 14.0), 1),
                "reason": "Celebración de aniversario y fidelización de jugadores",
                "created_at": (datetime(2026, 8, 5) - timedelta(days=rng.randint(1, 15))).isoformat(),
            })
            generated.append({
                "event_id": 1000 + asset.id * 3 + 2,
                "title": f"Rumores sobre adaptación cinematográfica y expansión de franquicia de {name}",
                "description": f"Filtraciones sobre el interés de productoras de streaming en adaptar el universo de {name} impulsan el apetito de los inversores.",
                "category": "ADAPTACION",
                "change_pct": round(rng.uniform(6.5, 16.0), 1),
                "reason": "Especulación positiva sobre proyectos audiovisuales",
                "created_at": (datetime(2026, 7, 26) - timedelta(days=rng.randint(2, 12))).isoformat(),
            })

        return generated

event_service = EventService()
