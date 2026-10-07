export interface Asset {
  id: number
  igdb_id: number
  name: string
  slug: string
  summary: string | null
  cover_url: string | null
  genres: string | null
  release_date: number | null
  initial_price: number
  current_price: number
  change_24h: number
  high_24h: number
  low_24h: number
  volume_24h: number
  rating: number | null
  rating_count: number | null
  hypes: number | null
  follows: number | null
  sentiment_score: number
  created_at: string
  updated_at: string
}

export interface PriceSnapshot {
  id: number
  asset_id: number
  price: number
  volume: number
  rating: number | null
  hypes: number | null
  sentiment_score: number | null
  timestamp: string
}

export interface Holding {
  id: number
  portfolio_id: string
  asset_id: number
  quantity: number
  average_buy_price: number
  current_value: number
  unrealized_pnl: number
  unrealized_pnl_percent: number
  asset?: Asset | null
  updated_at: string
}

export interface Transaction {
  id: number
  portfolio_id: string
  asset_id: number
  transaction_type: 'BUY' | 'SELL'
  quantity: number
  price_per_unit: number
  total_amount: number
  timestamp: string
  asset?: Asset | null
}

export interface Portfolio {
  id: string
  cash_balance: number
  holdings_value: number
  total_net_worth: number
  total_pnl: number
  total_pnl_percent: number
  holdings: Holding[]
  created_at: string
  updated_at: string
}

export interface MarketOverview {
  total_assets: number
  total_market_cap: number
  total_24h_volume: number
  average_sentiment: number
  top_gainers: Asset[]
  top_losers: Asset[]
  most_active: Asset[]
}

export interface TradeRequest {
  portfolio_id?: string
  asset_id: number
  action: 'BUY' | 'SELL'
  quantity: number
}

export interface TradeResponse {
  transaction: Transaction
  cash_balance: number
  holdings_value: number
  total_net_worth: number
  new_asset_price: number
}

export interface MarketTickResponse {
  updated_assets_count: number
  snapshots_created: number
  message: string
}

export interface SyncRequest {
  limit?: number
  query?: string
}

export interface EventImpactItem {
  asset_id?: number
  asset_name?: string
  asset_slug?: string
  old_price?: number
  new_price?: number
  change_pct: number
  new_sentiment?: number
  reason?: string
}

export interface MarketEvent {
  id: number
  title: string
  description: string
  category: string
  impacts: EventImpactItem[]
  is_active: boolean
  created_at: string | null
}

export interface PresetCatalyst {
  title: string
  description: string
  category: string
  impacts: EventImpactItem[]
}

export interface AssetCatalyst {
  event_id: number
  title: string
  description: string
  category: string
  change_pct: number
  reason: string
  created_at: string | null
}

export interface Top10ComparisonItem {
  id: number
  name: string
  slug: string
  cover_url: string | null
  current_price: number
  initial_price: number
  change_24h: number
  sentiment_score: number
  genres: string | null
  snapshots: {
    timestamp: string
    price: number
    sentiment_score?: number
  }[]
}
