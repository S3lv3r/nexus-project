import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Portfolio } from '../types'

export const PortfolioPage: React.FC<{
  portfolio: Portfolio | null
  isLoading: boolean
}> = ({ portfolio, isLoading }) => {
  const navigate = useNavigate()

  if (isLoading || !portfolio) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-[var(--text-muted)]">
        <i className="fa-solid fa-spinner animate-spin text-2xl text-[var(--primary)] mb-3"></i>
        <p className="text-xs uppercase font-medium tracking-wider text-[var(--text)]">Cargando portafolio...</p>
      </div>
    )
  }

  const isNetPositive = portfolio.total_pnl >= 0

  return (
    <div className="space-y-6">
      <div className="platform-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div>
            <span className="text-xs uppercase font-semibold text-[var(--text-muted)] tracking-wider">
              Mi Cuenta
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] mt-0.5 tracking-tight">
              Resumen de Portafolio
            </h1>
          </div>

          <div
            className={`px-3 py-1 rounded text-xs font-mono font-semibold flex items-center gap-1.5 self-start sm:self-auto ${
              isNetPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <i className={`fa-solid ${isNetPositive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
            <span>
              {isNetPositive ? 'P&L Total: +' : 'P&L Total: '}
              ${Math.abs(portfolio.total_pnl).toFixed(2)} USD ({isNetPositive ? '+' : ''}
              {portfolio.total_pnl_percent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-[var(--surface-alt)] border border-[var(--border)] p-4 rounded space-y-1">
            <div className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Patrimonio Total</div>
            <div className="text-2xl font-bold font-mono text-[var(--text)] tabular-nums">
              ${portfolio.total_net_worth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-[var(--surface-alt)] border border-[var(--border)] p-4 rounded space-y-1">
            <div className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Efectivo Disponible</div>
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              ${portfolio.cash_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-[var(--surface-alt)] border border-[var(--border)] p-4 rounded space-y-1">
            <div className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">En Videojuegos ({portfolio.holdings.length})</div>
            <div className="text-2xl font-bold font-mono text-[var(--primary)] tabular-nums">
              ${portfolio.holdings_value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      <div className="platform-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2 className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Posiciones Abiertas
          </h2>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[var(--surface-alt)] text-[var(--text-muted)] border border-[var(--border)]">
            {portfolio.holdings.length} activos
          </span>
        </div>

        {portfolio.holdings.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--surface-alt)] flex items-center justify-center text-[var(--text-dim)] text-xl border border-[var(--border)]">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <h3 className="text-sm font-semibold text-[var(--text)]">Sin posiciones abiertas</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Explora el mercado y adquiere acciones de tus títulos favoritos.
            </p>
            <button
              onClick={() => navigate('/exchange')}
              className="platform-btn-primary text-xs inline-flex items-center gap-1.5 mt-2"
            >
              <i className="fa-solid fa-cart-shopping text-xs"></i>
              <span>Explorar Mercado</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.holdings.map((h) => {
              const asset = h.asset
              const isHoldingPositive = h.unrealized_pnl >= 0

              return (
                <div
                  key={h.id}
                  className="bg-[var(--surface-alt)] border border-[var(--border)] rounded p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2.5">
                      {asset?.cover_url ? (
                        <img
                          src={asset.cover_url}
                          alt={asset.name}
                          className="w-10 h-13 object-cover rounded border border-[var(--border)] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-13 rounded bg-[var(--border)] flex items-center justify-center text-[var(--text-dim)]">
                          <i className="fa-solid fa-gamepad"></i>
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-[var(--text)] text-sm truncate">
                          {asset?.name || `Activo #${h.asset_id}`}
                        </h3>
                        <div className="text-[11px] text-[var(--text-muted)] truncate">
                          {asset?.genres ? asset.genres.split(',')[0] : 'Videojuego'}
                        </div>
                        <div className="text-xs font-mono font-semibold text-[var(--primary)] mt-0.5">
                          {h.quantity.toFixed(2)} acciones
                        </div>
                      </div>
                    </div>

                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-2.5 space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-[var(--text-muted)] text-[11px]">
                        <span>P. Compra:</span>
                        <span className="text-[var(--text)] font-semibold">${h.average_buy_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[var(--text-muted)] text-[11px]">
                        <span>P. Actual:</span>
                        <span className="text-[var(--text)] font-semibold">
                          ${(asset?.current_price || h.average_buy_price).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[11px]">
                        <span className="text-[var(--text-muted)] font-sans">Valor:</span>
                        <span className="text-[var(--text)] font-bold">${h.current_value.toFixed(2)}</span>
                      </div>
                    </div>

                    <div
                      className={`mt-2 p-2 rounded text-xs font-mono font-semibold flex items-center justify-between ${
                        isHoldingPositive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span>{isHoldingPositive ? 'Ganancia:' : 'Pérdida:'}</span>
                      <span>
                        {isHoldingPositive ? '+' : ''}${h.unrealized_pnl.toFixed(2)} ({isHoldingPositive ? '+' : ''}
                        {h.unrealized_pnl_percent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  {asset && (
                    <button
                      onClick={() => navigate(`/trade/${asset.id}`)}
                      className="w-full platform-btn-secondary text-xs py-1.5"
                    >
                      <i className="fa-solid fa-arrow-right-arrow-left text-xs"></i>
                      <span>Operar</span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
