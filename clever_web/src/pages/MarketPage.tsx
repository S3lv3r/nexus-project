import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BreakingNewsTicker } from '../components/BreakingNewsTicker'
import { Top10MultiLineChart } from '../components/Top10MultiLineChart'
import type { Asset, MarketEvent, MarketOverview, Top10ComparisonItem } from '../types'

interface MarketPageProps {
  assets: Asset[]
  overview: MarketOverview | null
  events: MarketEvent[]
  top10Data?: Top10ComparisonItem[]
  isLoading: boolean
  searchTerm: string
  onOpenSync: () => void
  onOpenSimulator: () => void
}

export const MarketPage: React.FC<MarketPageProps> = ({
  assets,
  overview,
  events,
  top10Data = [],
  isLoading,
  searchTerm,
  onOpenSync,
  onOpenSimulator,
}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'catalog' | 'top10'>('catalog')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'volume' | 'price' | 'change' | 'rating' | 'name' | 'sentiment'>('volume')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const categoryPresets = [
    { label: 'Todos', value: 'ALL', icon: 'fa-gamepad' },
    { label: 'Hype', value: 'HYPE', icon: 'fa-fire' },
    { label: 'En Alza', value: 'GAINERS', icon: 'fa-arrow-trend-up' },
    { label: 'Acción', value: 'Action', icon: 'fa-shield-halved' },
    { label: 'RPGs', value: 'Role-playing', icon: 'fa-wand-magic-sparkles' },
    { label: 'Shooters', value: 'Shooter', icon: 'fa-crosshairs' },
    { label: 'Indies', value: 'Indie', icon: 'fa-cubes' },
  ]

  const activeCatalystMap = useMemo(() => {
    const map = new Map<number, { title: string; change_pct: number; reason: string }>()
    if (events && events.length > 0) {
      for (const ev of events) {
        if (ev.impacts) {
          for (const imp of ev.impacts) {
            if (imp.asset_id && !map.has(imp.asset_id)) {
              map.set(imp.asset_id, {
                title: ev.title,
                change_pct: imp.change_pct,
                reason: imp.reason || ev.title,
              })
            }
          }
        }
      }
    }
    return map
  }, [events])

  const filteredAssets = useMemo(() => {
    return assets
      .filter((a) => {
        const matchesSearch =
          a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (a.genres && a.genres.toLowerCase().includes(searchTerm.toLowerCase()))

        let matchesCategory = true
        if (selectedGenre === 'HYPE') {
          matchesCategory = (a.hypes || 0) > 300 || (a.release_date || 0) > 1735689600
        } else if (selectedGenre === 'GAINERS') {
          matchesCategory = a.change_24h > 0
        } else if (selectedGenre !== 'ALL') {
          matchesCategory = !!(a.genres && a.genres.toLowerCase().includes(selectedGenre.toLowerCase()))
        }

        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        let valA = 0
        let valB = 0

        if (sortBy === 'price') {
          valA = a.current_price
          valB = b.current_price
        } else if (sortBy === 'change') {
          valA = a.change_24h
          valB = b.change_24h
        } else if (sortBy === 'sentiment') {
          valA = a.sentiment_score
          valB = b.sentiment_score
        } else if (sortBy === 'rating') {
          valA = a.rating || 0
          valB = b.rating || 0
        } else if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        } else {
          valA = a.volume_24h
          valB = b.volume_24h
        }

        return sortOrder === 'asc' ? valA - valB : valB - valA
      })
  }, [assets, searchTerm, selectedGenre, sortBy, sortOrder])

  const toggleSort = (type: 'volume' | 'price' | 'change' | 'rating' | 'name' | 'sentiment') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(type)
      setSortOrder('desc')
    }
  }

  const getTicker = (name: string) => {
    return name
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 5)
  }

  const getComputedChange = (asset: Asset) => {
    if (Math.abs(asset.change_24h) > 0.001) {
      return asset.change_24h
    }
    if (asset.initial_price > 0 && asset.current_price > 0) {
      return ((asset.current_price - asset.initial_price) / asset.initial_price) * 100.0
    }
    return 0.0
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--surface-alt)] text-[var(--text-muted)] text-xs font-medium mb-1.5 border border-[var(--border)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Pop Culture Exchange</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
            Mercado de Videojuegos
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-normal mt-0.5">
            Cotizaciones y volumen de mercado con datos históricos desde el 1 de Julio de 2026.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-2 rounded bg-[var(--surface)] border border-[var(--border)]">
            <span className="text-[var(--text-muted)] font-sans text-xs">Cap. Mercado:</span>
            <span className="font-semibold text-[var(--text)] tabular-nums">
              ${overview ? overview.total_market_cap.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '150,000.00'}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded bg-[var(--surface)] border border-[var(--border)]">
            <span className="text-[var(--text-muted)] font-sans text-xs">Listados:</span>
            <span className="font-semibold text-[var(--text)] tabular-nums">{assets.length} activos</span>
          </div>
        </div>
      </div>

      <BreakingNewsTicker events={events} onOpenSimulator={onOpenSimulator} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border border-[var(--border)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <i className="fa-solid fa-layer-group text-xs mr-1.5 text-[var(--text-dim)]"></i>
            <span>Catálogo Completo ({assets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('top10')}
            className={`px-3.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'top10'
                ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border border-[var(--border)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <i className="fa-solid fa-chart-line text-xs mr-1.5 text-[var(--primary)]"></i>
            <span>Comparativa Top 10</span>
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[var(--surface-alt)] p-0.5 rounded border border-[var(--border)]">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 px-2.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
                title="Vista de Tabla"
              >
                <i className="fa-solid fa-table-list text-xs"></i>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 px-2.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
                title="Vista de Cuadrícula"
              >
                <i className="fa-solid fa-grip text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'top10' ? (
        <Top10MultiLineChart data={top10Data} isLoading={isLoading} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categoryPresets.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedGenre(cat.value)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedGenre === cat.value
                    ? 'bg-[var(--primary)] text-[var(--primary-text)] font-semibold'
                    : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                <i className={`fa-solid ${cat.icon} text-[10px] mr-1.5`}></i>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] rounded">
              <i className="fa-solid fa-spinner animate-spin text-2xl text-[var(--primary)] mb-2"></i>
              <p className="text-xs font-medium">Cargando cotizaciones...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-[var(--surface)] border border-[var(--border)] rounded p-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-[var(--surface-alt)] flex items-center justify-center text-[var(--text-dim)] text-xl">
                <i className="fa-solid fa-ghost"></i>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)]">No se encontraron videojuegos</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                Prueba con otro término de búsqueda o sincroniza títulos desde IGDB.
              </p>
              <button
                onClick={onOpenSync}
                className="platform-btn-primary text-xs font-medium inline-flex items-center gap-2 mt-2"
              >
                <i className="fa-solid fa-cloud-arrow-down text-xs"></i>
                <span>Importar de IGDB</span>
              </button>
            </div>
          ) : viewMode === 'table' ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-alt)] text-xs font-mono text-[var(--text-muted)]">
                      <th className="py-2.5 px-4 font-medium">#</th>
                      <th
                        onClick={() => toggleSort('name')}
                        className="py-2.5 px-4 font-medium cursor-pointer hover:text-[var(--text)] select-none font-sans"
                      >
                        Activo
                      </th>
                      <th
                        onClick={() => toggleSort('price')}
                        className="py-2.5 px-4 font-medium cursor-pointer hover:text-[var(--text)] select-none text-right font-mono"
                      >
                        Precio USD
                      </th>
                      <th
                        onClick={() => toggleSort('change')}
                        className="py-2.5 px-4 font-medium cursor-pointer hover:text-[var(--text)] select-none text-right font-mono"
                      >
                        24h %
                      </th>
                      <th className="py-2.5 px-4 font-medium hidden md:table-cell font-sans">
                        Catálisis Reciente
                      </th>
                      <th
                        onClick={() => toggleSort('sentiment')}
                        className="py-2.5 px-4 font-medium cursor-pointer hover:text-[var(--text)] select-none text-center font-sans hidden sm:table-cell"
                      >
                        Sentimiento
                      </th>
                      <th className="py-2.5 px-4 font-medium text-right font-sans">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-xs">
                    {filteredAssets.map((asset, index) => {
                      const catalyst = activeCatalystMap.get(asset.id)
                      const computedChange = getComputedChange(asset)
                      const isPositive = computedChange >= 0
                      const ticker = getTicker(asset.name)
                      const sentimentPct = Math.round(((asset.sentiment_score + 1) / 2) * 100)

                      return (
                        <tr
                          key={asset.id}
                          className="hover:bg-[var(--surface-alt)] transition-colors group"
                        >
                          <td className="py-3 px-4 font-mono text-[var(--text-dim)] text-[11px] tabular-nums">
                            {index + 1}
                          </td>
                          <td className="py-3 px-4">
                            <div
                              onClick={() => navigate(`/trade/${asset.id}`)}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              {asset.cover_url ? (
                                <img
                                  src={asset.cover_url}
                                  alt={asset.name}
                                  className="w-8 h-10 object-cover rounded border border-[var(--border)] flex-shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-10 rounded bg-[var(--surface-alt)] flex items-center justify-center text-[var(--text-dim)] text-xs flex-shrink-0">
                                  <i className="fa-solid fa-gamepad"></i>
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors truncate">
                                    {asset.name}
                                  </span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--surface-alt)] text-[var(--text-muted)] font-medium">
                                    {ticker}
                                  </span>
                                </div>
                                <div className="text-[11px] text-[var(--text-muted)] truncate">
                                  {asset.genres || 'Spot'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-[var(--text)] text-right tabular-nums">
                            ${asset.current_price.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-right tabular-nums">
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] ${
                                isPositive
                                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                                  : 'text-rose-700 bg-rose-50 border border-rose-200'
                              }`}
                            >
                              <i
                                className={`fa-solid ${
                                  isPositive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'
                                } text-[9px]`}
                              ></i>
                              <span>
                                {isPositive ? '+' : ''}
                                {computedChange.toFixed(2)}%
                              </span>
                            </span>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            {catalyst ? (
                              <div className="max-w-xs">
                                <div className="text-[11px] font-medium text-[var(--text)] truncate">
                                  {catalyst.title}
                                </div>
                                <div className="text-[10px] text-[var(--text-muted)] truncate">
                                  {catalyst.reason}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[11px] text-[var(--text-dim)]">Sin catalizadores</span>
                            )}
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <div className="w-12 bg-[var(--border)] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-emerald-500 h-full rounded-full"
                                  style={{ width: `${sentimentPct}%` }}
                                ></div>
                              </div>
                              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                                {sentimentPct}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => navigate(`/trade/${asset.id}`)}
                              className="platform-btn-secondary text-xs py-1 px-3"
                            >
                              <span>Operar</span>
                              <i className="fa-solid fa-arrow-right text-[9px]"></i>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const computedChange = getComputedChange(asset)
                const isPositive = computedChange >= 0
                const ticker = getTicker(asset.name)
                const sentimentPct = Math.round(((asset.sentiment_score + 1) / 2) * 100)

                return (
                  <div
                    key={asset.id}
                    className="platform-card platform-card-hover p-3 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded overflow-hidden bg-[var(--surface-alt)] border border-[var(--border)]">
                        {asset.cover_url ? (
                          <img
                            src={asset.cover_url}
                            alt={asset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--text-dim)] text-2xl">
                            <i className="fa-solid fa-gamepad"></i>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--text)] text-[10px] font-mono font-medium border border-[var(--border)] shadow-xs">
                            {ticker}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium shadow-xs ${
                              isPositive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <i
                              className={`fa-solid ${
                                isPositive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'
                              } text-[8px]`}
                            ></i>
                            <span>
                              {isPositive ? '+' : ''}
                              {computedChange.toFixed(1)}%
                            </span>
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-[var(--text)] truncate group-hover:text-[var(--primary)] transition-colors">
                          {asset.name}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                          {asset.genres || 'Spot Market'}
                        </p>
                      </div>

                      <div className="flex items-baseline justify-between pt-1 border-t border-[var(--border)]">
                        <span className="text-[11px] text-[var(--text-muted)]">Precio Spot</span>
                        <span className="font-mono font-bold text-sm text-[var(--text)] tabular-nums">
                          ${asset.current_price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                        <span>Sentimiento</span>
                        <span className="font-mono text-emerald-600 font-semibold">{sentimentPct}% Compra</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/trade/${asset.id}`)}
                      className="w-full mt-3 platform-btn-secondary text-xs py-1.5"
                    >
                      <i className="fa-solid fa-bolt text-[10px]"></i>
                      <span>Operar Título</span>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
