import React from 'react'
import type { MarketEvent } from '../types'

interface BreakingNewsTickerProps {
  events: MarketEvent[]
  onOpenSimulator: () => void
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  events,
  onOpenSimulator,
}) => {
  if (!events || events.length === 0) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[var(--text-muted)] font-medium">
            Mercado operando con normalidad. Los lanzamientos e impactos de la industria afectan las cotizaciones.
          </span>
        </div>
        <button
          onClick={onOpenSimulator}
          className="platform-btn-secondary py-1 px-2.5 text-xs font-medium cursor-pointer"
        >
          <i className="fa-solid fa-wand-magic-sparkles text-[11px] text-[var(--primary)]"></i>
          <span>Simular</span>
        </button>
      </div>
    )
  }

  const latest = events[0]

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          Noticia Pop
        </span>

        <div className="flex items-center gap-2 overflow-x-auto text-xs min-w-0">
          <span className="font-medium text-[var(--text)] truncate">{latest.title}</span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {latest.impacts &&
              latest.impacts.map((imp, idx) => {
                const isPos = imp.change_pct >= 0
                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium ${
                      isPos
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <span>{imp.asset_name || imp.asset_slug}</span>
                    <i
                      className={`fa-solid ${isPos ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[8px]`}
                    ></i>
                    <span>
                      {isPos ? '+' : ''}
                      {imp.change_pct}%
                    </span>
                  </span>
                )
              })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
        <button
          onClick={onOpenSimulator}
          className="platform-btn-secondary py-1 px-2.5 text-xs font-medium cursor-pointer"
        >
          <i className="fa-solid fa-wand-magic-sparkles text-[11px] text-[var(--primary)]"></i>
          <span>Simular Noticia</span>
        </button>
      </div>
    </div>
  )
}
