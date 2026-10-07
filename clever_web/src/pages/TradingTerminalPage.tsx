import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { InteractiveChart } from '../components/InteractiveChart'
import { TradingWidget } from '../components/TradingWidget'
import { api } from '../services/api'
import type { Asset, AssetCatalyst, Portfolio, PriceSnapshot } from '../types'

export const TradingTerminalPage: React.FC<{
  portfolio: Portfolio | null
  onTrade: (assetId: number, action: 'BUY' | 'SELL', quantity: number) => Promise<void>
}> = ({ portfolio, onTrade }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [snapshots, setSnapshots] = useState<PriceSnapshot[]>([])
  const [catalysts, setCatalysts] = useState<AssetCatalyst[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!id) return
    const assetId = parseInt(id)
    setIsLoading(true)

    Promise.all([
      api.getAsset(assetId).catch(() => null),
      api.getAssetHistory(assetId, 300).catch(() => []),
      api.getAssetCatalysts(assetId).catch(() => []),
    ])
      .then(([assetData, historyData, catalystsData]) => {
        setAsset(assetData)
        setSnapshots(historyData)
        setCatalysts(catalystsData)
      })
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-[var(--text-muted)]">
        <i className="fa-solid fa-spinner animate-spin text-2xl text-[var(--primary)] mb-3"></i>
        <p className="text-xs uppercase font-medium tracking-wider text-[var(--text)]">Cargando videojuego...</p>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="py-24 text-center space-y-3 platform-card p-8">
        <i className="fa-solid fa-triangle-exclamation text-3xl text-rose-500"></i>
        <h3 className="text-sm font-semibold text-[var(--text)]">Videojuego no encontrado</h3>
        <button
          onClick={() => navigate('/exchange')}
          className="platform-btn-primary text-xs"
        >
          Volver al Mercado
        </button>
      </div>
    )
  }

  const isPositive = asset.change_24h >= 0
  const year = asset.release_date
    ? new Date(asset.release_date * 1000).getFullYear()
    : null

  const formatDate = (isoStr: string | null) => {
    if (!isoStr) return 'Agosto 2026'
    try {
      return new Date(isoStr).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return 'Julio / Agosto 2026'
    }
  }

  return (
    <div className="space-y-5">
      <div className="platform-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate('/exchange')}
              className="w-8 h-8 rounded bg-[var(--surface-alt)] hover:bg-[var(--border)] text-[var(--text)] flex items-center justify-center transition-colors cursor-pointer border border-[var(--border)]"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
            </button>

            {asset.cover_url ? (
              <img
                src={asset.cover_url}
                alt={asset.name}
                className="w-12 h-15 object-cover rounded border border-[var(--border)] flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-15 rounded bg-[var(--surface-alt)] flex items-center justify-center text-[var(--text-dim)] border border-[var(--border)]">
                <i className="fa-solid fa-gamepad text-xl"></i>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
                  {asset.name}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-alt)] text-[var(--text-muted)] font-medium border border-[var(--border)]">
                  SPOT
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)] font-normal flex items-center gap-2 mt-0.5">
                <span>{asset.genres || 'Videojuego'}</span>
                {year && (
                  <>
                    <span>&bull;</span>
                    <span className="font-mono">{year}</span>
                  </>
                )}
                {asset.rating && (
                  <>
                    <span>&bull;</span>
                    <span className="text-amber-600 font-semibold flex items-center gap-1">
                      <i className="fa-solid fa-star text-[10px] text-amber-500"></i>
                      {asset.rating.toFixed(1)} IGDB
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono bg-[var(--surface-alt)] p-2.5 rounded border border-[var(--border)]">
            <div className="px-2">
              <div className="text-[var(--text-muted)] text-[10px] uppercase font-sans font-medium">Precio</div>
              <div className="text-lg font-bold text-[var(--text)] tabular-nums">${asset.current_price.toFixed(2)}</div>
            </div>

            <div className="px-2 border-l border-[var(--border)]">
              <div className="text-[var(--text-muted)] text-[10px] uppercase font-sans font-medium">24h</div>
              <div className={`text-xs font-semibold tabular-nums ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isPositive ? '+' : ''}
                {asset.change_24h.toFixed(2)}%
              </div>
            </div>

            <div className="px-2 border-l border-[var(--border)] hidden sm:block">
              <div className="text-[var(--text-muted)] text-[10px] uppercase font-sans font-medium">Máx. Verano</div>
              <div className="text-xs font-semibold text-[var(--text)] tabular-nums">${asset.high_24h.toFixed(2)}</div>
            </div>

            <div className="px-2 border-l border-[var(--border)] hidden sm:block">
              <div className="text-[var(--text-muted)] text-[10px] uppercase font-sans font-medium">Mín. Verano</div>
              <div className="text-xs font-semibold text-[var(--text)] tabular-nums">${asset.low_24h.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <InteractiveChart
            snapshots={snapshots}
            currentPrice={asset.current_price}
            change24h={asset.change_24h}
          />

          <div className="platform-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Catalizadores y Noticias Pop
              </h3>
              <span className="text-[10px] font-mono text-[var(--text-muted)] font-medium">
                HISTÓRICO
              </span>
            </div>

            <div className="space-y-2.5">
              {catalysts.map((cat, idx) => {
                const isPos = cat.change_pct >= 0
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[var(--primary)] text-[var(--primary-text)] text-[10px] font-mono font-medium uppercase">
                          {cat.category}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] font-mono">
                          {formatDate(cat.created_at)}
                        </span>
                      </div>

                      <span
                        className={`font-mono text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 flex-shrink-0 ${
                          isPos
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <i
                          className={`fa-solid ${isPos ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[9px]`}
                        ></i>
                        {isPos ? '+' : ''}
                        {cat.change_pct}%
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-[var(--text)] leading-snug">
                      {cat.title}
                    </h4>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                      {cat.description}
                    </p>

                    {cat.reason && (
                      <div className="pt-1.5 border-t border-[var(--border)] text-[11px] text-[var(--text)] font-medium flex items-center gap-1.5">
                        <i className="fa-solid fa-arrow-right text-[9px] text-[var(--primary)]"></i>
                        <span>Efecto: {cat.reason}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {asset.summary && (
            <div className="platform-card p-4 space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Acerca de
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{asset.summary}</p>
            </div>
          )}
        </div>

        <div>
          <TradingWidget
            asset={asset}
            portfolio={portfolio}
            onTrade={async (assetId, action, quantity) => {
              await onTrade(assetId, action, quantity)
              const [updatedAsset, updatedHistory] = await Promise.all([
                api.getAsset(assetId),
                api.getAssetHistory(assetId, 300),
              ])
              setAsset(updatedAsset)
              setSnapshots(updatedHistory)
            }}
          />
        </div>
      </div>
    </div>
  )
}
