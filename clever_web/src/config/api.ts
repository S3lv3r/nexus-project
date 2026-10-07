export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  ASSETS: `${API_BASE_URL}/api/assets`,
  TOP10_COMPARE: `${API_BASE_URL}/api/assets/top10/compare`,
  SYNC_MASSIVE: `${API_BASE_URL}/api/assets/sync-massive`,
  ASSET_DETAIL: (id: number) => `${API_BASE_URL}/api/assets/${id}`,
  ASSET_HISTORY: (id: number) => `${API_BASE_URL}/api/assets/${id}/history`,
  SYNC_ASSETS: `${API_BASE_URL}/api/assets/sync`,
  MARKET_OVERVIEW: `${API_BASE_URL}/api/market/overview`,
  MARKET_TICK: `${API_BASE_URL}/api/market/tick`,
  PORTFOLIO: `${API_BASE_URL}/api/portfolio`,
  TRADE_ORDER: `${API_BASE_URL}/api/trading/order`,
  TRANSACTIONS: `${API_BASE_URL}/api/trading/transactions`,
  EVENTS: `${API_BASE_URL}/api/events`,
  EVENT_PRESETS: `${API_BASE_URL}/api/events/presets`,
  TRIGGER_EVENT: `${API_BASE_URL}/api/events/trigger`,
  ASSET_EVENTS: (id: number) => `${API_BASE_URL}/api/events/asset/${id}`,
}
