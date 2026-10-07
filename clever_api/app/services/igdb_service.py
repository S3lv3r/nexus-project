import time
from typing import Any, Dict, List, Optional
import httpx
from app.core.config import settings

class IGDBService:
    OAUTH_URL = "https://id.twitch.tv/oauth2/token"
    IGDB_BASE_URL = "https://api.igdb.com/v4"

    def __init__(self):
        self._access_token: Optional[str] = None
        self._token_expires_at: float = 0.0

    async def get_access_token(self) -> Optional[str]:
        if not settings.IGDB_CLIENT_ID or not settings.IGDB_CLIENT_SECRET:
            return None

        if self._access_token and time.time() < self._token_expires_at - 60:
            return self._access_token

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    self.OAUTH_URL,
                    params={
                        "client_id": settings.IGDB_CLIENT_ID,
                        "client_secret": settings.IGDB_CLIENT_SECRET,
                        "grant_type": "client_credentials",
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    self._access_token = data.get("access_token")
                    expires_in = data.get("expires_in", 3600)
                    self._token_expires_at = time.time() + expires_in
                    return self._access_token
        except Exception:
            return None

        return None

    async def fetch_popular_games(self, limit: int = 50, query: Optional[str] = None) -> List[Dict[str, Any]]:
        token = await self.get_access_token()
        if not token:
            return self._get_fallback_games()

        headers = {
            "Client-ID": settings.IGDB_CLIENT_ID,
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        }

        if query:
            apicalypse_query = (
                f'search "{query}"; '
                f'fields id, name, slug, summary, cover.url, cover.image_id, genres.name, '
                f'first_release_date, rating, rating_count, hypes, follows, aggregated_rating; '
                f'limit {min(limit, 50)};'
            )
        else:
            apicalypse_query = (
                f'fields id, name, slug, summary, cover.url, cover.image_id, genres.name, '
                f'first_release_date, rating, rating_count, hypes, follows, aggregated_rating; '
                f'where rating_count > 20 & cover != null; '
                f'sort rating_count desc; '
                f'limit {min(limit, 100)};'
            )

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{self.IGDB_BASE_URL}/games",
                    headers=headers,
                    content=apicalypse_query.encode("utf-8"),
                )

                if response.status_code == 200:
                    games = response.json()
                    formatted = self._format_games(games)
                    if formatted:
                        return formatted
        except Exception:
            pass

        return self._get_fallback_games()

    async def fetch_massive_catalog(self, target_count: int = 150) -> List[Dict[str, Any]]:
        token = await self.get_access_token()
        if not token:
            return self._get_fallback_games()

        headers = {
            "Client-ID": settings.IGDB_CLIENT_ID,
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        }

        queries = [
            'fields id, name, slug, summary, cover.url, cover.image_id, genres.name, first_release_date, rating, rating_count, hypes, follows, aggregated_rating; where rating_count > 40 & cover != null; sort rating_count desc; limit 100;',
            'fields id, name, slug, summary, cover.url, cover.image_id, genres.name, first_release_date, rating, rating_count, hypes, follows, aggregated_rating; where hypes > 50 & cover != null; sort hypes desc; limit 50;',
            'fields id, name, slug, summary, cover.url, cover.image_id, genres.name, first_release_date, rating, rating_count, hypes, follows, aggregated_rating; where follows > 300 & cover != null; sort follows desc; limit 50;',
            'search "Grand Theft Auto"; fields id, name, slug, summary, cover.url, cover.image_id, genres.name, first_release_date, rating, rating_count, hypes, follows, aggregated_rating; limit 15;',
            'search "Call of Duty"; fields id, name, slug, summary, cover.url, cover.image_id, genres.name, first_release_date, rating, rating_count, hypes, follows, aggregated_rating; limit 10;',
            'search "Zelda"; fields id, name, slug, summary, cover.url, cover.image_id, genres.name, first_release_date, rating, rating_count, hypes, follows, aggregated_rating; limit 10;',
            'search "Pokemon"; fields id, name, slug, summary, cover.url, cover.image_id, genres.name, first_release_date, rating, rating_count, hypes, follows, aggregated_rating; limit 10;',
            'search "Final Fantasy"; fields id, name, slug, summary, cover.url, cover.image_id, genres.name, first_release_date, rating, rating_count, hypes, follows, aggregated_rating; limit 10;',
            'search "Silksong"; fields id, name, slug, summary, cover.url, cover.image_id, genres.name, first_release_date, rating, rating_count, hypes, follows, aggregated_rating; limit 5;',
            'search "Witcher"; fields id, name, slug, summary, cover.url, cover.image_id, genres.name, first_release_date, rating, rating_count, hypes, follows, aggregated_rating; limit 10;',
        ]

        collected_dict: Dict[int, Dict[str, Any]] = {}

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                for q in queries:
                    try:
                        res = await client.post(
                            f"{self.IGDB_BASE_URL}/games",
                            headers=headers,
                            content=q.encode("utf-8"),
                        )
                        if res.status_code == 200:
                            for item in self._format_games(res.json()):
                                if item["igdb_id"] not in collected_dict:
                                    collected_dict[item["igdb_id"]] = item
                    except Exception:
                        continue
        except Exception:
            pass

        if len(collected_dict) < 30:
            for fallback in self._get_fallback_games():
                if fallback["igdb_id"] not in collected_dict:
                    collected_dict[fallback["igdb_id"]] = fallback

        return list(collected_dict.values())

    def _format_games(self, raw_games: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        formatted = []
        for g in raw_games:
            cover_url = None
            if g.get("cover"):
                raw_url = g["cover"].get("url", "")
                if raw_url:
                    if raw_url.startswith("//"):
                        cover_url = f"https:{raw_url}".replace("t_thumb", "t_cover_big")
                    else:
                        cover_url = raw_url.replace("t_thumb", "t_cover_big")
                elif g["cover"].get("image_id"):
                    cover_url = f"https://images.igdb.com/igdb/image/upload/t_cover_big/{g['cover']['image_id']}.jpg"

            genres_list = [genre.get("name") for genre in g.get("genres", []) if genre.get("name")]
            genres_str = ", ".join(genres_list) if genres_list else None

            formatted.append({
                "igdb_id": g.get("id"),
                "name": g.get("name"),
                "slug": g.get("slug") or g.get("name", "").lower().replace(" ", "-"),
                "summary": g.get("summary"),
                "cover_url": cover_url,
                "genres": genres_str,
                "release_date": g.get("first_release_date"),
                "rating": g.get("rating") or g.get("aggregated_rating"),
                "rating_count": g.get("rating_count", 0),
                "hypes": g.get("hypes", 0),
                "follows": g.get("follows", 0),
            })
        return formatted

    def _get_fallback_games(self) -> List[Dict[str, Any]]:
        return [
            {
                "igdb_id": 121,
                "name": "Minecraft",
                "slug": "minecraft",
                "summary": "Un juego de construcción y supervivencia sandbox en mundo abierto 3D desarrollado por Mojang Studios.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co3905.jpg",
                "genres": "Sandbox, Aventura, Supervivencia",
                "release_date": 1321574400,
                "rating": 85.0,
                "rating_count": 3200,
                "hypes": 150,
                "follows": 4500,
            },
            {
                "igdb_id": 1020,
                "name": "Grand Theft Auto V",
                "slug": "grand-theft-auto-v",
                "summary": "Mundo abierto de accion y aventura en la vibrante y caotica ciudad de Los Santos, desarrollado por Rockstar North.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
                "genres": "Accion, Mundo Abierto, Shooter",
                "release_date": 1379376000,
                "rating": 91.0,
                "rating_count": 4800,
                "hypes": 320,
                "follows": 7200,
            },
            {
                "igdb_id": 119133,
                "name": "Elden Ring",
                "slug": "elden-ring",
                "summary": "RPG de accion en las Tierras Intermedias desarrollado por FromSoftware y Hidetaka Miyazaki junto a George R.R. Martin.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
                "genres": "Accion, RPG, Fantasia Oscura",
                "release_date": 1645747200,
                "rating": 94.0,
                "rating_count": 2800,
                "hypes": 540,
                "follows": 6100,
            },
            {
                "igdb_id": 1905,
                "name": "Fortnite",
                "slug": "fortnite",
                "summary": "Fenomeno global battle royale y plataforma creativa multijugador desarrollada por Epic Games.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co204m.jpg",
                "genres": "Shooter, Battle Royale, Supervivencia",
                "release_date": 1500940800,
                "rating": 76.0,
                "rating_count": 1900,
                "hypes": 90,
                "follows": 3800,
            },
            {
                "igdb_id": 1877,
                "name": "Cyberpunk 2077",
                "slug": "cyberpunk-2077",
                "summary": "Aventura de rol y accion en mundo abierto ambientada en la megalopolis futurista de Night City.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co7la6.jpg",
                "genres": "Accion, RPG, Sci-Fi",
                "release_date": 1607558400,
                "rating": 82.0,
                "rating_count": 3100,
                "hypes": 410,
                "follows": 5200,
            },
            {
                "igdb_id": 115,
                "name": "League of Legends",
                "slug": "league-of-legends",
                "summary": "El MOBA competitivo mas jugado del planeta desarrollado y publicado por Riot Games.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg",
                "genres": "MOBA, Estrategia, Esports",
                "release_date": 1256601600,
                "rating": 78.0,
                "rating_count": 2400,
                "hypes": 110,
                "follows": 4100,
            },
            {
                "igdb_id": 246830,
                "name": "Counter-Strike 2",
                "slug": "counter-strike-2",
                "summary": "El mayor salto tecnologico y competitivo en la historia de la legendaria saga de FPS tacticos de Valve.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co6nn5.jpg",
                "genres": "FPS, Tactico, Competitivo",
                "release_date": 1695772800,
                "rating": 80.0,
                "rating_count": 1200,
                "hypes": 380,
                "follows": 3500,
            },
            {
                "igdb_id": 126454,
                "name": "Valorant",
                "slug": "valorant",
                "summary": "Shooter tactico en primera persona 5v5 impulsado por agentes con habilidades unicas de Riot Games.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.jpg",
                "genres": "FPS, Tactico, Hero Shooter",
                "release_date": 1591056000,
                "rating": 81.0,
                "rating_count": 1500,
                "hypes": 260,
                "follows": 3900,
            },
            {
                "igdb_id": 114795,
                "name": "Apex Legends",
                "slug": "apex-legends",
                "summary": "Battle royale frenetico de heroes con habilidades legendarias desarrollado por Respawn Entertainment.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x7e.jpg",
                "genres": "Battle Royale, FPS, Accion",
                "release_date": 1549238400,
                "rating": 83.0,
                "rating_count": 2100,
                "hypes": 180,
                "follows": 3600,
            },
            {
                "igdb_id": 1942,
                "name": "The Witcher 3: Wild Hunt",
                "slug": "the-witcher-3-wild-hunt",
                "summary": "Obra maestra del rol y la fantasia que narra la travesia del cazador de monstruos Geralt de Rivia.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/coaarl.jpg",
                "genres": "RPG, Mundo Abierto, Fantasia",
                "release_date": 1431993600,
                "rating": 95.0,
                "rating_count": 5200,
                "hypes": 480,
                "follows": 7800,
            },
            {
                "igdb_id": 26845,
                "name": "Grand Theft Auto VI",
                "slug": "grand-theft-auto-vi",
                "summary": "La esperadisima nueva entrega de Rockstar Games ambientada en el estado de Leonida y Vice City.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co7la4.jpg",
                "genres": "Accion, Mundo Abierto, Aventura",
                "release_date": 1748736000,
                "rating": 96.0,
                "rating_count": 8900,
                "hypes": 1200,
                "follows": 15000,
            },
            {
                "igdb_id": 115276,
                "name": "Hollow Knight: Silksong",
                "slug": "hollow-knight-silksong",
                "summary": "La aclamada secuela metroidvania desarrollada por Team Cherry protagonizada por Hornet en Pharloom.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.jpg",
                "genres": "Metroidvania, Plataformas, Indie",
                "release_date": 1735689600,
                "rating": 93.0,
                "rating_count": 2100,
                "hypes": 980,
                "follows": 9400,
            },
            {
                "igdb_id": 1009,
                "name": "The Last of Us Part I",
                "slug": "the-last-of-us-part-i",
                "summary": "Inolvidable relato postapocaliptico de supervivencia y vinculo humano entre Joel y Ellie de Naughty Dog.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5x6b.jpg",
                "genres": "Accion, Aventura, Supervivencia",
                "release_date": 1662076800,
                "rating": 92.0,
                "rating_count": 4200,
                "hypes": 310,
                "follows": 6300,
            },
            {
                "igdb_id": 25076,
                "name": "Red Dead Redemption 2",
                "slug": "red-dead-redemption-2",
                "summary": "Epica narrativa del declive de la era de los forajidos en el Salvaje Oeste americano junto a Arthur Morgan.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg",
                "genres": "Mundo Abierto, Accion, Western",
                "release_date": 1540512000,
                "rating": 95.0,
                "rating_count": 5100,
                "hypes": 620,
                "follows": 8200,
            },
            {
                "igdb_id": 19560,
                "name": "God of War Ragnarok",
                "slug": "god-of-war-ragnarok",
                "summary": "Viaje mitologico nordico de Kratos y Atreus a traves de los nueve reinos mientras se avecina el fin de los tiempos.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg",
                "genres": "Accion, Hack and Slash, Mitologia",
                "release_date": 1667952000,
                "rating": 93.0,
                "rating_count": 3400,
                "hypes": 430,
                "follows": 6700,
            },
            {
                "igdb_id": 7346,
                "name": "The Legend of Zelda: Tears of the Kingdom",
                "slug": "the-legend-of-zelda-tears-of-the-kingdom",
                "summary": "Aventura colosal por los cielos y profundidades de Hyrule con mecanicas de construccion revolucionarias.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.jpg",
                "genres": "Aventura, Mundo Abierto, Fantasia",
                "release_date": 1683849600,
                "rating": 94.0,
                "rating_count": 3100,
                "hypes": 580,
                "follows": 7100,
            },
            {
                "igdb_id": 113112,
                "name": "Hades II",
                "slug": "hades-ii",
                "summary": "Roguelike de accion mitologica griega desarrollado por Supergiant Games protagonizado por Melinoe.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co642w.jpg",
                "genres": "Roguelike, Accion, Mitologia",
                "release_date": 1715040000,
                "rating": 91.0,
                "rating_count": 1800,
                "hypes": 710,
                "follows": 5600,
            },
            {
                "igdb_id": 138547,
                "name": "Black Myth: Wukong",
                "slug": "black-myth-wukong",
                "summary": "RPG de accion basado en la mitologia china y la leyenda del Rey Mono desarrollado por Game Science.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co8356.jpg",
                "genres": "Accion, Soulslike, Fantasia",
                "release_date": 1724112000,
                "rating": 88.0,
                "rating_count": 2900,
                "hypes": 850,
                "follows": 8300,
            },
            {
                "igdb_id": 267590,
                "name": "Helldivers 2",
                "slug": "helldivers-2",
                "summary": "Shooter cooperativo galactico en tercera persona de Arrowhead y PlayStation en defensa de la Super Tierra.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co7d6l.jpg",
                "genres": "Shooter, Cooperativo, Sci-Fi",
                "release_date": 1707350400,
                "rating": 84.0,
                "rating_count": 2100,
                "hypes": 390,
                "follows": 4600,
            },
            {
                "igdb_id": 10565,
                "name": "Baldur's Gate 3",
                "slug": "baldurs-gate-3",
                "summary": "Juego del Ano aclamado mundialmente de rol de mesa D&D de nueva generacion creado por Larian Studios.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg",
                "genres": "RPG, Estrategia, D&D",
                "release_date": 1691020800,
                "rating": 96.0,
                "rating_count": 4900,
                "hypes": 640,
                "follows": 8700,
            },
            {
                "igdb_id": 234907,
                "name": "Palworld",
                "slug": "palworld",
                "summary": "Juego de supervivencia y domesticacion de monstruos con armas de fuego en un vasto mundo abierto.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co7f7h.jpg",
                "genres": "Supervivencia, Mundo Abierto, Crafteo",
                "release_date": 1705622400,
                "rating": 80.0,
                "rating_count": 2300,
                "hypes": 420,
                "follows": 5100,
            },
            {
                "igdb_id": 28540,
                "name": "Balatro",
                "slug": "balatro",
                "summary": "Revolucionario juego de cartas roguelike inspirado en el poker con sinergias ilimitadas e hipnoticas.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co7v21.jpg",
                "genres": "Cartas, Roguelike, Indie",
                "release_date": 1708387200,
                "rating": 90.0,
                "rating_count": 1600,
                "hypes": 290,
                "follows": 3700,
            },
            {
                "igdb_id": 1947,
                "name": "Dark Souls III",
                "slug": "dark-souls-iii",
                "summary": "Culminacion de la aclamada saga de accion de fantasia oscura de FromSoftware y Hidetaka Miyazaki.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x77.jpg",
                "genres": "Soulslike, Accion, RPG",
                "release_date": 1458777600,
                "rating": 90.0,
                "rating_count": 3800,
                "hypes": 340,
                "follows": 6200,
            },
            {
                "igdb_id": 472,
                "name": "The Elder Scrolls V: Skyrim",
                "slug": "the-elder-scrolls-v-skyrim",
                "summary": "El legendario RPG de fantasia en mundo abierto de Bethesda que marco a toda una generacion de jugadores.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/cobt0i.jpg",
                "genres": "RPG, Mundo Abierto, Fantasia",
                "release_date": 1320969600,
                "rating": 90.0,
                "rating_count": 5100,
                "hypes": 400,
                "follows": 7300,
            },
            {
                "igdb_id": 105601,
                "name": "The Elder Scrolls VI",
                "slug": "the-elder-scrolls-vi",
                "summary": "La anticipada proxima entrega principal de la saga The Elder Scrolls desarrollada por Bethesda Game Studios.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1w6k.jpg",
                "genres": "RPG, Mundo Abierto, Fantasia",
                "release_date": 1830297600,
                "rating": 94.0,
                "rating_count": 1500,
                "hypes": 1100,
                "follows": 12000,
            },
            {
                "igdb_id": 134585,
                "name": "Monster Hunter Wilds",
                "slug": "monster-hunter-wilds",
                "summary": "Proxima evolucion del ecosistema vivo y dinamico de caza de monstruos titanicos de Capcom.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co7ha2.jpg",
                "genres": "Accion, RPG, Cooperativo",
                "release_date": 1740700800,
                "rating": 92.0,
                "rating_count": 1800,
                "hypes": 890,
                "follows": 7800,
            },
            {
                "igdb_id": 1067,
                "name": "Super Mario Odyssey",
                "slug": "super-mario-odyssey",
                "summary": "Magica aventura de plataformas en 3D en la que Mario recorre increibles mundos con Cappy.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1m1d.jpg",
                "genres": "Plataformas, Aventura, Nintendo",
                "release_date": 1509062400,
                "rating": 92.0,
                "rating_count": 3100,
                "hypes": 320,
                "follows": 5400,
            },
            {
                "igdb_id": 26758,
                "name": "Super Smash Bros. Ultimate",
                "slug": "super-smash-bros-ultimate",
                "summary": "El mayor crossover de lucha de la historia de los videojuegos con mas de 80 combatientes iconicos.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1ncb.jpg",
                "genres": "Lucha, Multijugador, Fiesta",
                "release_date": 1544140800,
                "rating": 91.0,
                "rating_count": 2700,
                "hypes": 280,
                "follows": 4900,
            },
            {
                "igdb_id": 7331,
                "name": "Overwatch 2",
                "slug": "overwatch-2",
                "summary": "Hero shooter en primera persona 5v5 free-to-play competitivo desarrollado por Blizzard Entertainment.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5w3d.jpg",
                "genres": "Hero Shooter, FPS, Esports",
                "release_date": 1664841600,
                "rating": 74.0,
                "rating_count": 1700,
                "hypes": 210,
                "follows": 3400,
            },
            {
                "igdb_id": 242780,
                "name": "EA Sports FC 24",
                "slug": "ea-sports-fc-24",
                "summary": "La nueva era del futbol virtual de EA Sports impulsada por HyperMotionV y PlayStyles.",
                "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co6t8h.jpg",
                "genres": "Deportes, Futbol, Simulacion",
                "release_date": 1695945600,
                "rating": 76.0,
                "rating_count": 1200,
                "hypes": 310,
                "follows": 3200,
            }
        ]

igdb_service = IGDBService()
