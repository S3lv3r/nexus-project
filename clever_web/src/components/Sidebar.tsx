import React from 'react'
import { NavLink } from 'react-router-dom'
import type { Portfolio } from '../types'

interface SidebarProps {
  portfolio: Portfolio | null
  onOpenSync: () => void
  onOpenSimulator: () => void
  onTriggerTick: () => void
  isTickLoading: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({
  portfolio,
  onOpenSync,
  onOpenSimulator,
  onTriggerTick,
  isTickLoading,
}) => {
  return (
    <aside className="w-64 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col justify-between p-4 flex-shrink-0 min-h-screen">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-8 h-8 rounded bg-[var(--primary)] text-[var(--primary-text)] flex items-center justify-center font-bold text-sm">
            <i className="fa-solid fa-gamepad text-xs"></i>
          </div>
          <div>
            <div className="font-bold text-sm text-[var(--text)] tracking-tight flex items-center gap-1.5">
              <span>CLEVER</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)] font-normal">/ exchange</span>
            </div>
            <div className="text-xs text-[var(--text-muted)] font-normal">Bolsa de Videojuegos</div>
          </div>
        </div>

        <nav className="space-y-1">
          <NavLink
            to="/exchange"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium tracking-tight transition-colors ${
                isActive
                  ? 'bg-[var(--surface-alt)] text-[var(--text)] font-semibold border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)]'
              }`
            }
          >
            <i className="fa-solid fa-chart-simple text-xs w-4 text-center"></i>
            <span>Mercado Spot</span>
          </NavLink>

          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded text-xs font-medium tracking-tight transition-colors ${
                isActive
                  ? 'bg-[var(--surface-alt)] text-[var(--text)] font-semibold border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-wallet text-xs w-4 text-center"></i>
              <span>Portafolio</span>
            </div>
            {portfolio && portfolio.holdings.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-[var(--border)] text-[var(--text)] font-mono text-[10px] font-semibold">
                {portfolio.holdings.length}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium tracking-tight transition-colors ${
                isActive
                  ? 'bg-[var(--surface-alt)] text-[var(--text)] font-semibold border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)]'
              }`
            }
          >
            <i className="fa-solid fa-clock-rotate-left text-xs w-4 text-center"></i>
            <span>Historial</span>
          </NavLink>
        </nav>

        {portfolio && (
          <div className="p-3.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded space-y-2">
            <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)] tracking-wider flex items-center justify-between">
              <span>Patrimonio Total</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-lg font-bold font-mono text-[var(--text)] tabular-nums">
              ${portfolio.total_net_worth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-[var(--border)] text-xs font-mono">
              <span className="text-[var(--text-muted)] font-sans">En Juegos:</span>
              <span className="text-[var(--text)] font-semibold tabular-nums">${portfolio.holdings_value.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 pt-4 border-t border-[var(--border)]">
        <button
          onClick={onOpenSimulator}
          className="w-full platform-btn-secondary text-xs"
        >
          <i className="fa-solid fa-wand-magic-sparkles text-xs text-[var(--primary)]"></i>
          <span>Simular Noticia</span>
        </button>

        <button
          onClick={onTriggerTick}
          disabled={isTickLoading}
          className="w-full platform-btn-secondary text-xs disabled:opacity-50"
        >
          <i className={`fa-solid fa-bolt text-xs ${isTickLoading ? 'animate-spin' : ''}`}></i>
          <span>Avanzar Tiempo</span>
        </button>

        <button
          onClick={onOpenSync}
          className="w-full platform-btn-primary text-xs"
        >
          <i className="fa-solid fa-cloud-arrow-down text-xs"></i>
          <span>Base de Datos IGDB</span>
        </button>
      </div>
    </aside>
  )
}
