import React, { useMemo, useState } from 'react'
import type { Top10ComparisonItem } from '../types'

interface Top10MultiLineChartProps {
  data: Top10ComparisonItem[]
  isLoading?: boolean
}

const LINE_COLORS = [
  '#0284c7',
  '#0d9488',
  '#16a34a',
  '#6366f1',
  '#d97706',
  '#db2777',
  '#0891b2',
  '#7c3aed',
  '#dc2626',
  '#475569',
]

export const Top10MultiLineChart: React.FC<Top10MultiLineChartProps> = ({
  data,
  isLoading,
}) => {
  const [mode, setMode] = useState<'percent' | 'price'>('percent')
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [activeIds, setActiveIds] = useState<Set<number>>(new Set())

  React.useEffect(() => {
    if (data && data.length > 0 && activeIds.size === 0) {
      setActiveIds(new Set(data.map((d) => d.id)))
    }
  }, [data])

  const toggleAsset = (id: number) => {
    const next = new Set(activeIds)
    if (next.has(id)) {
      if (next.size > 1) {
        next.delete(id)
      }
    } else {
      next.add(id)
    }
    setActiveIds(next)
  }

  const selectAll = () => {
    setActiveIds(new Set(data.map((d) => d.id)))
  }

  const isolateAsset = (id: number) => {
    setActiveIds(new Set([id]))
  }

  const dates = useMemo(() => {
    if (!data || data.length === 0) return []
    const longest = data.reduce(
      (max, item) => (item.snapshots.length > max.snapshots.length ? item : max),
      data[0]
    )
    return longest.snapshots.map((s) => s.timestamp)
  }, [data])

  const chartData = useMemo(() => {
    if (!data || data.length === 0 || dates.length === 0) return []

    return data.map((item, idx) => {
      const color = LINE_COLORS[idx % LINE_COLORS.length]
      const snaps = item.snapshots
      const startPrice = snaps.length > 0 ? snaps[0].price : item.initial_price || 1.0

      const series = snaps.map((s) => {
        const pct = startPrice > 0 ? ((s.price - startPrice) / startPrice) * 100.0 : 0.0
        return {
          timestamp: s.timestamp,
          price: s.price,
          percent: pct,
        }
      })

      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        cover_url: item.cover_url,
        color,
        current_price: item.current_price,
        initial_price: startPrice,
        change_24h: item.change_24h,
        series,
      }
    })
  }, [data, dates])

  const activeSeries = chartData.filter((item) => activeIds.has(item.id))

  const { minVal, maxVal, range } = useMemo(() => {
    if (activeSeries.length === 0) return { minVal: 0, maxVal: 100, range: 100 }

    let min = Infinity
    let max = -Infinity

    for (const item of activeSeries) {
      for (const pt of item.series) {
        const v = mode === 'percent' ? pt.percent : pt.price
        if (v < min) min = v
        if (v > max) max = v
      }
    }

    if (min === Infinity) min = 0
    if (max === -Infinity) max = 100

    const padding = (max - min) * 0.1 || 5
    const computedMin = mode === 'percent' ? Math.min(-5, min - padding) : Math.max(0, min - padding)
    const computedMax = max + padding
    return {
      minVal: computedMin,
      maxVal: computedMax,
      range: computedMax - computedMin || 1,
    }
  }, [activeSeries, mode])

  const width = 950
  const height = 340
  const paddingX = 35
  const paddingY = 25
  const chartWidth = width - paddingX * 2
  const chartHeight = height - paddingY * 2

  const computedLines = useMemo(() => {
    const totalPoints = dates.length || 1
    return activeSeries.map((item) => {
      const points = item.series.map((pt, idx) => {
        const x = paddingX + (idx / Math.max(1, totalPoints - 1)) * chartWidth
        const val = mode === 'percent' ? pt.percent : pt.price
        const y = height - paddingY - ((val - minVal) / range) * chartHeight
        return { x, y, pt }
      })

      const path = points.reduce((acc, p, idx) => {
        return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
      }, '')

      return {
        ...item,
        points,
        path,
      }
    })
  }, [activeSeries, dates, mode, minVal, range])

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr)
      return d.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return isoStr
    }
  }

  const activeDate = hoverIndex !== null && dates[hoverIndex] ? dates[hoverIndex] : dates[dates.length - 1]

  const hoverRankings = useMemo(() => {
    if (hoverIndex === null) return []
    return chartData
      .map((item) => {
        const pt = item.series[hoverIndex]
        const val = pt ? (mode === 'percent' ? pt.percent : pt.price) : 0
        return {
          id: item.id,
          name: item.name,
          color: item.color,
          value: val,
          price: pt ? pt.price : item.current_price,
          percent: pt ? pt.percent : 0,
          isActive: activeIds.has(item.id),
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [chartData, hoverIndex, mode, activeIds])

  if (isLoading) {
    return (
      <div className="platform-card p-8 h-96 flex flex-col items-center justify-center text-[var(--text-muted)]">
        <i className="fa-solid fa-spinner animate-spin text-2xl text-[var(--primary)] mb-3"></i>
        <p className="text-xs uppercase font-medium tracking-wider text-[var(--text)]">Cargando comparativa...</p>
      </div>
    )
  }

  return (
    <div className="platform-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              Comparativa Multi-Línea
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text)] tracking-tight">
            Top 10 Videojuegos del Mercado (10 Líneas)
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-normal mt-0.5">
            Evolución y rendimiento simultáneo desde el 1 de Julio de 2026.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[var(--surface-alt)] p-0.5 rounded text-xs font-mono border border-[var(--border)]">
          <button
            onClick={() => setMode('percent')}
            className={`px-3 py-1 rounded font-medium text-xs transition-colors cursor-pointer ${
              mode === 'percent'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Rendimiento %
          </button>
          <button
            onClick={() => setMode('price')}
            className={`px-3 py-1 rounded font-medium text-xs transition-colors cursor-pointer ${
              mode === 'price'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Precio USD
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 bg-[var(--surface-alt)] p-2 rounded border border-[var(--border)]">
        <span className="text-[11px] font-medium text-[var(--text-muted)] px-1">
          Activos:
        </span>

        {chartData.map((item) => {
          const isActive = activeIds.has(item.id)
          return (
            <button
              key={item.id}
              onClick={() => toggleAsset(item.id)}
              onDoubleClick={() => isolateAsset(item.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-xs'
                  : 'bg-transparent opacity-40 hover:opacity-80 text-[var(--text-muted)]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="truncate max-w-[120px]">{item.name}</span>
              <span
                className={`text-[10px] font-mono font-semibold ${
                  item.change_24h >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {item.change_24h >= 0 ? '+' : ''}
                {item.change_24h.toFixed(0)}%
              </span>
            </button>
          )
        })}

        <button
          onClick={selectAll}
          className="ml-auto px-2 py-0.5 text-[var(--text-muted)] hover:text-[var(--text)] text-xs font-medium transition-colors cursor-pointer"
        >
          Ver Todos
        </button>
      </div>

      <div className="relative w-full overflow-hidden bg-[var(--surface-alt)] rounded p-3 border border-[var(--border)]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair select-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const relX = mouseX / rect.width
            const totalPoints = dates.length || 1
            const index = Math.min(
              totalPoints - 1,
              Math.max(0, Math.round(relX * (totalPoints - 1)))
            )
            setHoverIndex(index)
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--border)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="var(--border)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--border)" strokeWidth="1" />

          {mode === 'percent' && minVal < 0 && maxVal > 0 && (
            <line
              x1={paddingX}
              y1={height - paddingY - ((0 - minVal) / range) * chartHeight}
              x2={width - paddingX}
              y2={height - paddingY - ((0 - minVal) / range) * chartHeight}
              stroke="var(--border)"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          )}

          {computedLines.map((line) => (
            <g key={line.id}>
              <path
                d={line.path}
                fill="none"
                stroke={line.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />

              {hoverIndex !== null && line.points[hoverIndex] && (
                <circle
                  cx={line.points[hoverIndex].x}
                  cy={line.points[hoverIndex].y}
                  r="3.5"
                  fill={line.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              )}
            </g>
          ))}

          {hoverIndex !== null && (
            <line
              x1={paddingX + (hoverIndex / Math.max(1, dates.length - 1)) * chartWidth}
              y1={paddingY}
              x2={paddingX + (hoverIndex / Math.max(1, dates.length - 1)) * chartWidth}
              y2={height - paddingY}
              stroke="var(--text-dim)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}
        </svg>

        {hoverIndex !== null && hoverRankings.length > 0 && (
          <div className="absolute top-3 right-3 bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] rounded p-3 max-w-xs pointer-events-none text-xs shadow-md">
            <div className="font-mono font-semibold text-[var(--text)] text-[11px] border-b border-[var(--border)] pb-1 mb-1.5 flex items-center justify-between gap-3 uppercase">
              <span>{formatDate(activeDate)}</span>
              <span className="text-[var(--primary)]">Ranking</span>
            </div>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {hoverRankings.slice(0, 8).map((item, rank) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-2 text-[11px] ${
                    item.isActive ? 'text-[var(--text)] font-medium' : 'text-[var(--text-muted)] opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-mono text-[9px] text-[var(--text-dim)]">#{rank + 1}</span>
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="truncate max-w-[100px]">{item.name}</span>
                  </div>
                  <div className="font-mono font-semibold flex-shrink-0">
                    {mode === 'percent' ? (
                      <span className={item.percent >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {item.percent >= 0 ? '+' : ''}
                        {item.percent.toFixed(1)}%
                      </span>
                    ) : (
                      <span>${item.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] px-1 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></span>
          <span>1 de Julio de 2026 &rarr; 27 de Agosto de 2026</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{activeSeries.length} Activas</span>
          <span>Escala: {mode === 'percent' ? '%' : 'USD'}</span>
        </div>
      </div>
    </div>
  )
}
