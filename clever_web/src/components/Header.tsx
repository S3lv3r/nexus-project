import React from 'react'
import type { MarketOverview, Portfolio } from '../types'

interface HeaderProps {
  portfolio: Portfolio | null
  overview: MarketOverview | null
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export const Header: React.FC<HeaderProps> = ({
  portfolio,
  overview,
  searchTerm,
  setSearchTerm,
}) => {
  const sentiment = overview?.average_sentiment || 50
  const isBullish = sentiment >= 55
  const isBearish = sentiment <= 45

  return (
    <header className="h-14 bg-[var(--surface)] border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar videojuegos, sagas o tickers..."
            className="w-full platform-input pl-8 pr-10 py-1.5 text-xs text-[var(--text)] placeholder:text-[var(--text-dim)]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-[var(--surface-alt)] border border-[var(--border)] text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isBullish ? 'bg-emerald-500' : isBearish ? 'bg-rose-500' : 'bg-[var(--primary)]'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isBullish ? 'bg-emerald-500' : isBearish ? 'bg-rose-500' : 'bg-[var(--primary)]'
            }`}></span>
          </span>
          <span className="text-[var(--text-muted)] text-xs">Mercado</span>
          <span className={`font-mono font-semibold text-xs ${
            isBullish ? 'text-emerald-600' : isBearish ? 'text-rose-600' : 'text-[var(--text)]'
          }`}>
            {sentiment.toFixed(0)}/100
          </span>
        </div>

        {portfolio && (
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[var(--surface-alt)] border border-[var(--border)]">
            <div className="w-5 h-5 rounded bg-[var(--primary)] text-[var(--primary-text)] flex items-center justify-center text-[10px]">
              <i className="fa-solid fa-wallet text-[9px]"></i>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-[var(--text-muted)] font-medium">Disponible:</span>
              <span className="font-mono font-semibold text-xs text-[var(--text)] tabular-nums">
                ${portfolio.cash_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
