import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Transaction } from '../types'

export const HistoryPage: React.FC<{
  transactions: Transaction[]
  isLoading: boolean
}> = ({ transactions, isLoading }) => {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-[var(--text-muted)]">
        <i className="fa-solid fa-spinner animate-spin text-2xl text-[var(--primary)] mb-3"></i>
        <p className="text-xs uppercase font-medium tracking-wider text-[var(--text)]">Cargando historial...</p>
      </div>
    )
  }

  return (
    <div className="platform-card p-5 space-y-4">
      <h2 className="font-semibold text-base text-[var(--text)] tracking-tight">
        Historial de Órdenes
      </h2>

      {transactions.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--surface-alt)] flex items-center justify-center text-[var(--text-dim)] text-xl border border-[var(--border)]">
            <i className="fa-solid fa-receipt"></i>
          </div>
          <h3 className="text-sm font-semibold text-[var(--text)]">Sin operaciones registradas</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Aún no has ejecutado órdenes en el mercado.
          </p>
          <button
            onClick={() => navigate('/exchange')}
            className="platform-btn-primary text-xs inline-flex items-center gap-1.5 mt-2"
          >
            <span>Ir al Mercado</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-alt)] text-xs font-mono text-[var(--text-muted)]">
                <th className="py-2.5 px-3 font-medium">Tipo</th>
                <th className="py-2.5 px-3 font-sans font-medium">Activo</th>
                <th className="py-2.5 px-3 font-medium">Cantidad</th>
                <th className="py-2.5 px-3 font-medium">Precio</th>
                <th className="py-2.5 px-3 font-medium">Total</th>
                <th className="py-2.5 px-3 text-right font-sans font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs">
              {transactions.map((tx) => {
                const isBuy = tx.transaction_type === 'BUY'
                return (
                  <tr key={tx.id} className="hover:bg-[var(--surface-alt)] transition-colors">
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold font-mono text-[11px] px-2 py-0.5 rounded ${
                          isBuy
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <i className={`fa-solid ${isBuy ? 'fa-arrow-down' : 'fa-arrow-up'} text-[8px]`}></i>
                        <span>{isBuy ? 'COMPRA' : 'VENTA'}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-[var(--text)] text-xs">
                        {tx.asset?.name || `Activo #${tx.asset_id}`}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-semibold text-[var(--text)] text-xs">
                      {tx.quantity.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 font-mono text-[var(--text-muted)] text-xs">
                      ${tx.price_per_unit.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 font-mono font-semibold text-[var(--text)] text-xs">
                      ${tx.total_amount.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 font-mono text-[var(--text-muted)] text-xs text-right">
                      {new Date(tx.timestamp).toLocaleString('es-ES', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
