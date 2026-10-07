# Pop Culture Exchange API (clever_api)

API backend desarrollada en Python con FastAPI y SQLAlchemy para simular un mercado financiero donde los videojuegos actuan como activos bursatiles. Los precios fluctuan basados en metricas reales de IGDB (ratings, hypes, popularidad) y en la actividad de compra/venta simulada por los usuarios.

---

## Requisitos Previos

- Python 3.10 o superior
- Servidor MySQL (local o remoto)
- Cuenta de Twitch Developer con credenciales de IGDB API

---

## Instalacion y Configuracion

1. Clonar el repositorio y acceder a la carpeta:
```bash
cd clever_api
```

2. Crear y activar el entorno virtual:
```bash
python -m venv .venv
.\.venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar el archivo `.env`:
```env
IGDB_CLIENT_ID=tu_igdb_client_id
IGDB_CLIENT_SECRET=tu_igdb_client_secret

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=u576901639_exchangevg
DATABASE_URL=mysql+aiomysql://root:tu_password@localhost:3306/u576901639_exchangevg
```

5. Iniciar el servidor:
```bash
uvicorn main:app --reload
```

Documentacion interactiva Swagger disponible en: `http://127.0.0.1:8000/docs`

---

## Estructura de la Base de Datos

La carpeta `db/` contiene:
- `db/schema.sql`: Script DDL para crear la base de datos y todas las tablas requeridas (`assets`, `portfolios`, `holdings`, `transactions`, `price_snapshots`).
- `db/updates/`: Directorio para futuras migraciones y scripts incrementales.

---

## Catalogo de Endpoints

### 1. Sistema

#### `GET /health`
Verifica el estado del servicio.

- **Parametros**: Ninguno
- **Ejemplo de Respuesta** (`200 OK`):
```json
{
  "status": "ok",
  "service": "clever_api"
}
```

---

### 2. Activos (Videojuegos)

#### `GET /api/assets`
Obtiene la lista de activos disponibles en el mercado con soporte para ordenacion, paginacion y busqueda.

- **Metodo**: `GET`
- **Query Parameters**:
  - `skip` *(int, opcional, default: 0)*: Numero de registros a omitir.
  - `limit` *(int, opcional, default: 50)*: Cantidad maxima de registros a devolver.
  - `sort_by` *(str, opcional, default: "volume_24h")*: Campo de ordenamiento (`volume_24h`, `change_24h`, `current_price`, `rating`, `name`).
  - `order` *(str, opcional, default: "desc")*: Direccion (`asc` o `desc`).
  - `search` *(str, opcional)*: Texto para filtrar por nombre de juego.
- **Ejemplo de Solicitud**:
```
GET /api/assets?limit=2&sort_by=current_price&order=desc
```
- **Ejemplo de Respuesta** (`200 OK`):
```json
[
  {
    "id": 1,
    "igdb_id": 1020,
    "name": "Grand Theft Auto V",
    "slug": "grand-theft-auto-v",
    "summary": "An open world action-adventure game set in Los Santos.",
    "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
    "genres": "Shooter, Racing, Adventure",
    "release_date": 1379376000,
    "initial_price": 93.01,
    "current_price": 98.21,
    "change_24h": 5.59,
    "high_24h": 98.21,
    "low_24h": 93.01,
    "volume_24h": 284.8,
    "rating": 89.65,
    "rating_count": 5886,
    "hypes": 0,
    "follows": 0,
    "sentiment_score": 62.6,
    "created_at": "2026-08-23T05:08:33",
    "updated_at": "2026-08-23T05:08:34"
  },
  {
    "id": 2,
    "igdb_id": 1942,
    "name": "The Witcher 3: Wild Hunt",
    "slug": "the-witcher-3-wild-hunt",
    "summary": "An open-world action RPG developed by CD Projekt Red.",
    "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/coaarl.jpg",
    "genres": "Role-playing (RPG), Adventure",
    "release_date": 1431993600,
    "initial_price": 117.1,
    "current_price": 123.69,
    "change_24h": 5.63,
    "high_24h": 123.69,
    "low_24h": 117.1,
    "volume_24h": 0.0,
    "rating": 93.79,
    "rating_count": 5425,
    "hypes": 179,
    "follows": 0,
    "sentiment_score": 79.0,
    "created_at": "2026-08-23T05:08:33",
    "updated_at": "2026-08-23T05:08:34"
  }
]
```

---

#### `GET /api/assets/{asset_id}`
Obtiene la informacion detallada de un activo individual.

- **Metodo**: `GET`
- **Path Parameters**:
  - `asset_id` *(int, requerido)*: Identificador interno del activo.
- **Ejemplo de Solicitud**:
```
GET /api/assets/1
```
- **Ejemplo de Respuesta** (`200 OK`):
```json
{
  "id": 1,
  "igdb_id": 1020,
  "name": "Grand Theft Auto V",
  "slug": "grand-theft-auto-v",
  "summary": "An open world action-adventure game set in Los Santos.",
  "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
  "genres": "Shooter, Racing, Adventure",
  "release_date": 1379376000,
  "initial_price": 93.01,
  "current_price": 98.21,
  "change_24h": 5.59,
  "high_24h": 98.21,
  "low_24h": 93.01,
  "volume_24h": 284.8,
  "rating": 89.65,
  "rating_count": 5886,
  "hypes": 0,
  "follows": 0,
  "sentiment_score": 62.6,
  "created_at": "2026-08-23T05:08:33",
  "updated_at": "2026-08-23T05:08:34"
}
```

---

#### `GET /api/assets/{asset_id}/history`
Obtiene los registros historicos de precio y sentimiento para graficar la evolucion temporal.

- **Metodo**: `GET`
- **Path Parameters**:
  - `asset_id` *(int, requerido)*: Identificador del activo.
- **Query Parameters**:
  - `limit` *(int, opcional, default: 100)*: Numero maximo de snapshots.
- **Ejemplo de Solicitud**:
```
GET /api/assets/1/history?limit=3
```
- **Ejemplo de Respuesta** (`200 OK`):
```json
[
  {
    "id": 1,
    "asset_id": 1,
    "price": 93.01,
    "volume": 0.0,
    "rating": 89.65,
    "hypes": 0,
    "sentiment_score": 62.6,
    "timestamp": "2026-08-23T05:08:33"
  },
  {
    "id": 11,
    "asset_id": 1,
    "price": 96.35,
    "volume": 192.7,
    "rating": 89.65,
    "hypes": 0,
    "sentiment_score": 62.6,
    "timestamp": "2026-08-23T05:08:34"
  },
  {
    "id": 12,
    "asset_id": 1,
    "price": 98.21,
    "volume": 284.8,
    "rating": 89.65,
    "hypes": 0,
    "sentiment_score": 62.6,
    "timestamp": "2026-08-23T05:08:35"
  }
]
```

---

#### `POST /api/assets/sync`
Consulta la API de IGDB, obtiene los juegos populares o busquedas especificas, inicializa sus precios con el motor de valoracion y los registra en la base de datos.

- **Metodo**: `POST`
- **Content-Type**: `application/json`
- **Cuerpo de la Solicitud**:
```json
{
  "limit": 10,
  "query": "Elden Ring"
}
```
- **Ejemplo de Respuesta** (`200 OK`):
```json
[
  {
    "id": 3,
    "igdb_id": 119133,
    "name": "Elden Ring",
    "slug": "elden-ring",
    "summary": "An action RPG developed by FromSoftware.",
    "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
    "genres": "Action, RPG, Fantasy",
    "release_date": 1645747200,
    "initial_price": 108.45,
    "current_price": 108.45,
    "change_24h": 0.0,
    "high_24h": 108.45,
    "low_24h": 108.45,
    "volume_24h": 0.0,
    "rating": 94.0,
    "rating_count": 2800,
    "hypes": 540,
    "follows": 6100,
    "sentiment_score": 85.0,
    "created_at": "2026-08-23T05:08:33",
    "updated_at": "2026-08-23T05:08:33"
  }
]
```

---

### 3. Mercado Global

#### `GET /api/market/overview`
Proporciona el resumen macroeconomico del exchange: capitalizacion total, volumen transaccionado en 24h, sentimiento promedio y listas de mayores ganadores, perdedores y mas activos.

- **Metodo**: `GET`
- **Parametros**: Ninguno
- **Ejemplo de Solicitud**:
```
GET /api/market/overview
```
- **Ejemplo de Respuesta** (`200 OK`):
```json
{
  "total_assets": 10,
  "total_market_cap": 1045.5,
  "total_24h_volume": 450.2,
  "average_sentiment": 66.8,
  "top_gainers": [
    {
      "id": 7,
      "igdb_id": 25076,
      "name": "Red Dead Redemption 2",
      "slug": "red-dead-redemption-2",
      "summary": "The epic tale of outlaw Arthur Morgan.",
      "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg",
      "genres": "Shooter, Role-playing (RPG), Adventure",
      "release_date": 1540512000,
      "initial_price": 117.41,
      "current_price": 124.45,
      "change_24h": 6.0,
      "high_24h": 124.45,
      "low_24h": 117.41,
      "volume_24h": 0.0,
      "rating": 93.25,
      "rating_count": 3793,
      "hypes": 257,
      "follows": 0,
      "sentiment_score": 85.2,
      "created_at": "2026-08-23T05:08:33",
      "updated_at": "2026-08-23T05:08:34"
    }
  ],
  "top_losers": [
    {
      "id": 6,
      "igdb_id": 71,
      "name": "Portal",
      "slug": "portal",
      "summary": "Physics-based puzzle challenges.",
      "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/coay61.jpg",
      "genres": "Platform, Puzzle, Adventure",
      "release_date": 1191974400,
      "initial_price": 89.86,
      "current_price": 89.08,
      "change_24h": -0.87,
      "high_24h": 89.86,
      "low_24h": 89.08,
      "volume_24h": 0.0,
      "rating": 86.41,
      "rating_count": 3997,
      "hypes": 0,
      "follows": 0,
      "sentiment_score": 57.8,
      "created_at": "2026-08-23T05:08:33",
      "updated_at": "2026-08-23T05:08:34"
    }
  ],
  "most_active": [
    {
      "id": 1,
      "igdb_id": 1020,
      "name": "Grand Theft Auto V",
      "slug": "grand-theft-auto-v",
      "summary": "An open world action-adventure game.",
      "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
      "genres": "Shooter, Racing, Adventure",
      "release_date": 1379376000,
      "initial_price": 93.01,
      "current_price": 98.21,
      "change_24h": 5.59,
      "high_24h": 98.21,
      "low_24h": 93.01,
      "volume_24h": 284.8,
      "rating": 89.65,
      "rating_count": 5886,
      "hypes": 0,
      "follows": 0,
      "sentiment_score": 62.6,
      "created_at": "2026-08-23T05:08:33",
      "updated_at": "2026-08-23T05:08:34"
    }
  ]
}
```

---

#### `POST /api/market/tick`
Ejecuta un ciclo de fluctuacion de mercado donde los precios se actualizan de acuerdo al motor de valoracion y sentimiento, registrando snapshots historicos para cada activo.

- **Metodo**: `POST`
- **Cuerpo de la Solicitud**: Vacio
- **Ejemplo de Solicitud**:
```
POST /api/market/tick
```
- **Ejemplo de Respuesta** (`200 OK`):
```json
{
  "updated_assets_count": 10,
  "snapshots_created": 10,
  "message": "Market prices and snapshots updated successfully"
}
```

---

### 4. Cartera y Simulacion de Trading

#### `GET /api/portfolio`
Obtiene el estado financiero de la cartera: efectivo disponible, valorizacion actual de las posiciones, patrimonio neto y ganancias/perdidas no realizadas (PnL).

- **Metodo**: `GET`
- **Query Parameters**:
  - `portfolio_id` *(str, opcional, default: "default_user")*: Identificador del usuario o cartera.
- **Ejemplo de Solicitud**:
```
GET /api/portfolio?portfolio_id=default_user
```
- **Ejemplo de Respuesta** (`200 OK`):
```json
{
  "id": "default_user",
  "cash_balance": 9906.08,
  "holdings_value": 98.21,
  "total_net_worth": 10004.29,
  "total_pnl": 4.29,
  "total_pnl_percent": 0.04,
  "holdings": [
    {
      "id": 1,
      "portfolio_id": "default_user",
      "asset_id": 1,
      "quantity": 1.0,
      "average_buy_price": 96.35,
      "current_value": 98.21,
      "unrealized_pnl": 1.86,
      "unrealized_pnl_percent": 1.93,
      "asset": {
        "id": 1,
        "igdb_id": 1020,
        "name": "Grand Theft Auto V",
        "slug": "grand-theft-auto-v",
        "summary": "An open world action-adventure game.",
        "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
        "genres": "Shooter, Racing, Adventure",
        "release_date": 1379376000,
        "initial_price": 93.01,
        "current_price": 98.21,
        "change_24h": 5.59,
        "high_24h": 98.21,
        "low_24h": 93.01,
        "volume_24h": 284.8,
        "rating": 89.65,
        "rating_count": 5886,
        "hypes": 0,
        "follows": 0,
        "sentiment_score": 62.6,
        "created_at": "2026-08-23T05:08:33",
        "updated_at": "2026-08-23T05:08:34"
      },
      "updated_at": "2026-08-23T05:08:34"
    }
  ],
  "created_at": "2026-08-23T05:08:33",
  "updated_at": "2026-08-23T05:08:34"
}
```

---

#### `POST /api/trading/order`
Ejecuta una orden de compra (`BUY`) o venta (`SELL`). Aplica impacto de mercado sobre el precio del activo segun el volumen operado, debita o acredita saldo en efectivo y actualiza la posicion en cartera.

- **Metodo**: `POST`
- **Content-Type**: `application/json`
- **Cuerpo de la Solicitud (Compra)**:
```json
{
  "portfolio_id": "default_user",
  "asset_id": 1,
  "action": "BUY",
  "quantity": 2.0
}
```
- **Ejemplo de Respuesta** (`200 OK`):
```json
{
  "transaction": {
    "id": 1,
    "portfolio_id": "default_user",
    "asset_id": 1,
    "transaction_type": "BUY",
    "quantity": 2.0,
    "price_per_unit": 94.68,
    "total_amount": 189.36,
    "timestamp": "2026-08-23T05:08:34",
    "asset": {
      "id": 1,
      "igdb_id": 1020,
      "name": "Grand Theft Auto V",
      "slug": "grand-theft-auto-v",
      "summary": "An open world action-adventure game.",
      "cover_url": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
      "genres": "Shooter, Racing, Adventure",
      "release_date": 1379376000,
      "initial_price": 93.01,
      "current_price": 96.35,
      "change_24h": 3.59,
      "high_24h": 96.35,
      "low_24h": 93.01,
      "volume_24h": 189.36,
      "rating": 89.65,
      "rating_count": 5886,
      "hypes": 0,
      "follows": 0,
      "sentiment_score": 62.6,
      "created_at": "2026-08-23T05:08:33",
      "updated_at": "2026-08-23T05:08:34"
    }
  },
  "cash_balance": 9810.64,
  "holdings_value": 192.7,
  "total_net_worth": 10003.34,
  "new_asset_price": 96.35
}
```

- **Cuerpo de la Solicitud (Venta)**:
```json
{
  "portfolio_id": "default_user",
  "asset_id": 1,
  "action": "SELL",
  "quantity": 1.0
}
```

---

#### `GET /api/trading/transactions`
Obtiene el historial cronologico de todas las compras y ventas ejecutadas por el usuario.

- **Metodo**: `GET`
- **Query Parameters**:
  - `portfolio_id` *(str, opcional, default: "default_user")*: Identificador del usuario.
  - `limit` *(int, opcional, default: 50)*: Cantidad maxima de operaciones a devolver.
- **Ejemplo de Solicitud**:
```
GET /api/trading/transactions?portfolio_id=default_user&limit=10
```
- **Ejemplo de Respuesta** (`200 OK`):
```json
[
  {
    "id": 2,
    "portfolio_id": "default_user",
    "asset_id": 1,
    "transaction_type": "SELL",
    "quantity": 1.0,
    "price_per_unit": 95.44,
    "total_amount": 95.44,
    "timestamp": "2026-08-23T05:08:35",
    "asset": {
      "id": 1,
      "name": "Grand Theft Auto V",
      "slug": "grand-theft-auto-v",
      "current_price": 94.53
    }
  },
  {
    "id": 1,
    "portfolio_id": "default_user",
    "asset_id": 1,
    "transaction_type": "BUY",
    "quantity": 2.0,
    "price_per_unit": 94.68,
    "total_amount": 189.36,
    "timestamp": "2026-08-23T05:08:34",
    "asset": {
      "id": 1,
      "name": "Grand Theft Auto V",
      "slug": "grand-theft-auto-v",
      "current_price": 96.35
    }
  }
]
```
