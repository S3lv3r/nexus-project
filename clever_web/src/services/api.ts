import { ENDPOINTS } from '../config/api'
import type {
  Asset,
  AssetCatalyst,
  MarketEvent,
  MarketOverview,
  MarketTickResponse,
  Portfolio,
  PriceSnapshot,
  SyncRequest,
  Top10ComparisonItem,
  TradeRequest,
  TradeResponse,
  Transaction,
} from '../types'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    let errorDetail = 'Network request failed'
    try {
      const errorJson = await res.json()
      errorDetail = errorJson.detail || errorJson.message || errorDetail
    } catch {
      errorDetail = `${res.status} ${res.statusText}`
    }
    throw new Error(errorDetail)
  }

  return res.json()
}

export const api = {
  getAssets: async (params?: {
    skip?: number
    limit?: number
    sort_by?: string
    order?: string
    search?: string
  }): Promise<Asset[]> => {
    const searchParams = new URLSearchParams()
    if (params?.skip !== undefined) searchParams.append('skip', String(params.skip))
    if (params?.limit !== undefined) searchParams.append('limit', String(params.limit || 300))
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by)
    if (params?.order) searchParams.append('order', params.order)
    if (params?.search) searchParams.append('search', params.search)

    const url = `${ENDPOINTS.ASSETS}?${searchParams.toString()}`
    return request<Asset[]>(url)
  },

  getTop10Comparison: async (): Promise<Top10ComparisonItem[]> => {
    return request<Top10ComparisonItem[]>(ENDPOINTS.TOP10_COMPARE)
  },

  getAsset: async (id: number): Promise<Asset> => {
    return request<Asset>(ENDPOINTS.ASSET_DETAIL(id))
  },

  getAssetHistory: async (id: number, limit: number = 100): Promise<PriceSnapshot[]> => {
    return request<PriceSnapshot[]>(`${ENDPOINTS.ASSET_HISTORY(id)}?limit=${limit}`)
  },

  syncAssets: async (payload: SyncRequest = { limit: 50 }): Promise<Asset[]> => {
    return request<Asset[]>(ENDPOINTS.SYNC_ASSETS, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  syncMassiveCatalog: async (): Promise<Asset[]> => {
    return request<Asset[]>(ENDPOINTS.SYNC_MASSIVE, {
      method: 'POST',
    })
  },

  getMarketOverview: async (): Promise<MarketOverview> => {
    return request<MarketOverview>(ENDPOINTS.MARKET_OVERVIEW)
  },

  triggerMarketTick: async (): Promise<MarketTickResponse> => {
    return request<MarketTickResponse>(ENDPOINTS.MARKET_TICK, {
      method: 'POST',
    })
  },

  getPortfolio: async (portfolioId: string = 'default_user'): Promise<Portfolio> => {
    return request<Portfolio>(`${ENDPOINTS.PORTFOLIO}?portfolio_id=${portfolioId}`)
  },

  executeTrade: async (payload: TradeRequest): Promise<TradeResponse> => {
    return request<TradeResponse>(ENDPOINTS.TRADE_ORDER, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getTransactions: async (
    portfolioId: string = 'default_user',
    limit: number = 50,
  ): Promise<Transaction[]> => {
    return request<Transaction[]>(
      `${ENDPOINTS.TRANSACTIONS}?portfolio_id=${portfolioId}&limit=${limit}`,
    )
  },

  getEvents: async (limit: number = 20): Promise<MarketEvent[]> => {
    return request<MarketEvent[]>(`${ENDPOINTS.EVENTS}?limit=${limit}`)
  },

  getPresetCatalysts: async (): Promise<any[]> => {
    return request<any[]>(ENDPOINTS.EVENT_PRESETS)
  },

  triggerEvent: async (catalystIndex?: number, isRandom: boolean = false): Promise<any> => {
    return request<any>(ENDPOINTS.TRIGGER_EVENT, {
      method: 'POST',
      body: JSON.stringify({
        catalyst_index: catalystIndex,
        is_random: isRandom,
      }),
    })
  },

  getAssetCatalysts: async (assetId: number): Promise<AssetCatalyst[]> => {
    return request<AssetCatalyst[]>(ENDPOINTS.ASSET_EVENTS(assetId))
  },
}
