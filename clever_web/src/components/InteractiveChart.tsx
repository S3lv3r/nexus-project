import React, { useMemo, useState } from 'react'
import type { PriceSnapshot } from '../types'

interface InteractiveChartProps {
  snapshots: PriceSnapshot[]
  currentPrice: number
  change24h: number
  assetName?: string
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  snapshots,
  currentPrice,
  change24h,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [timeframe, setTimeframe] = useState<'JUL1' | '30D' | '7D' | '24H' | 'ALL'>('JUL1')

  const filteredSnapshots = useMemo(() => {
    if (!snapshots || snapshots.length === 0) return []

    const jul1Date = new Date('2026-07-01T00:00:00Z').getTime()
    const now = snapshots[snapshots.length - 1]?.timestamp
      ? new Date(snapshots[snapshots.length - 1].timestamp).getTime()
      : new Date('2026-08-27T21:00:00Z').getTime()

    if (timeframe === 'JUL1') {
      return snapshots.filter((s) => new Date(s.timestamp).getTime() >= jul1Date)
    } else if (timeframe === '30D') {
      const cut = now - 30 * 24 * 3600 * 1000
      return snapshots.filter((s) => new Date(s.timestamp).getTime() >= cut)
    } else if (timeframe === '7D') {
      const cut = now - 7 * 24 * 3600 * 1000
      return snapshots.filter((s) => new Date(s.timestamp).getTime() >= cut)
    } else if (timeframe === '24H') {
      return snapshots.slice(-4)
    }

    return snapshots
  }, [snapshots, timeframe])

  const activeList = filteredSnapshots.length > 0 ? filteredSnapshots : snapshots

  if (!activeList || activeList.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-[var(--text-muted)] platform-card">
        <i className="fa-solid fa-chart-area text-2xl mb-2 text-[var(--primary)]"></i>
        <p className="text-xs uppercase font-medium tracking-wider">Cargando gráfico...</p>
      </div>
    )
  }

  const prices = activeList.map((s) => s.price)
  const minPrice = Math.min(...prices) * 0.98
  const maxPrice = Math.max(...prices) * 1.02
  const priceRange = maxPrice - minPrice || 1

  const width = 850
  const height = 280
  const paddingX = 30
  const paddingY = 25
  const chartWidth = width - paddingX * 2
  const chartHeight = height - paddingY * 2

  const points = activeList.map((s, index) => {
    const x = paddingX + (index / Math.max(1, activeList.length - 1)) * chartWidth
    const y = height - paddingY - ((s.price - minPrice) / priceRange) * chartHeight
    return { x, y, snapshot: s }
  })

  const linePath = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`
  }, '')

  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  const areaPath = `${linePath} L ${lastPoint.x} ${height - paddingY} L ${firstPoint.x} ${height - paddingY} Z`

  const isPositive = change24h >= 0
  const strokeColor = isPositive ? '#16a34a' : '#dc2626'
  const activePoint = hoverIndex !== null ? points[hoverIndex] : lastPoint
  const activeSnapshot = activePoint ? activePoint.snapshot : activeList[activeList.length - 1]

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

  return (
    <div className="w-full platform-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--border)]">
        <div>
          <div className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
            <span>Histórico de Cotización</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-mono font-bold text-3xl text-[var(--text)] tabular-nums">
              ${(activeSnapshot?.price || currentPrice).toFixed(2)}
            </span>
            <span
              className={`flex items-center gap-1 font-mono font-semibold text-xs px-2 py-0.5 rounded ${
                isPositive
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-rose-700 bg-rose-50 border border-rose-200'
              }`}
            >
              <i className={`fa-solid ${isPositive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[9px]`}></i>
              <span>
                {isPositive ? '+' : ''}
                {change24h.toFixed(2)}%
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center bg-[var(--surface-alt)] p-0.5 rounded text-xs font-mono border border-[var(--border)]">
          <button
            onClick={() => setTimeframe('JUL1')}
            className={`px-3 py-1 rounded font-medium text-xs transition-colors cursor-pointer ${
              timeframe === 'JUL1'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Desde 1 Jul
          </button>
          <button
            onClick={() => setTimeframe('30D')}
            className={`px-3 py-1 rounded font-medium text-xs transition-colors cursor-pointer ${
              timeframe === '30D'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            30D
          </button>
          <button
            onClick={() => setTimeframe('7D')}
            className={`px-3 py-1 rounded font-medium text-xs transition-colors cursor-pointer ${
              timeframe === '7D'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setTimeframe('ALL')}
            className={`px-3 py-1 rounded font-medium text-xs transition-colors cursor-pointer ${
              timeframe === 'ALL'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Todo
          </button>
        </div>
      </div>

      <div className="relative w-full overflow-hidden bg-[var(--surface-alt)] rounded p-2 border border-[var(--border)]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--border)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="var(--border)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--border)" strokeWidth="1" />

          <path d={areaPath} fill={isPositive ? 'rgba(22, 163, 74, 0.08)' : 'rgba(220, 38, 38, 0.08)'} />
          <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((point, index) => {
            if (index % 7 !== 0 && index !== points.length - 1 && hoverIndex !== index) return null
            return (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={hoverIndex === index ? 5 : 2.5}
                fill={hoverIndex === index ? 'var(--text)' : strokeColor}
                stroke="#ffffff"
                strokeWidth={1.5}
                onMouseEnter={() => setHoverIndex(index)}
              />
            )
          })}

          {activePoint && (
            <>
              <line
                x1={activePoint.x}
                y1={paddingY}
                x2={activePoint.x}
                y2={height - paddingY}
                stroke="var(--text-dim)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="5"
                fill={strokeColor}
                stroke="#ffffff"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] px-1 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></span>
          <span className="text-[var(--text)] font-semibold">
            {activeSnapshot?.timestamp ? formatDate(activeSnapshot.timestamp) : '1 de Julio de 2026'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span>Mín: ${Math.min(...prices).toFixed(2)}</span>
          <span>Máx: ${Math.max(...prices).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
