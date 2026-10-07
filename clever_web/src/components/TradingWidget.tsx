import React, { useState } from 'react'
import type { Asset, Portfolio } from '../types'

interface TradingWidgetProps {
  asset: Asset
  portfolio: Portfolio | null
  onTrade: (assetId: number, action: 'BUY' | 'SELL', quantity: number) => Promise<void>
}

export const TradingWidget: React.FC<TradingWidgetProps> = ({
  asset,
  portfolio,
  onTrade,
}) => {
  const [action, setAction] = useState<'BUY' | 'SELL'>('BUY')
  const [dollarAmount, setDollarAmount] = useState<number>(100)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const holding = portfolio?.holdings.find((h) => h.asset_id === asset.id)
  const availableUnits = holding ? holding.quantity : 0
  const availableCash = portfolio?.cash_balance || 0
  const isBuy = action === 'BUY'

  const price = asset.current_price || 1.0
  const computedQuantity = dollarAmount / price

  const handleQuickDollar = (val: number) => {
    setErrorMsg(null)
    if (isBuy) {
      setDollarAmount(Math.min(availableCash, val))
    } else {
      const maxDollars = availableUnits * price
      setDollarAmount(Math.min(maxDollars, val))
    }
  }

  const handleAllIn = () => {
    setErrorMsg(null)
    if (isBuy) {
      setDollarAmount(availableCash)
    } else {
      setDollarAmount(availableUnits * price)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (computedQuantity <= 0 || dollarAmount <= 0) {
      setErrorMsg('Ingresa un monto válido mayor a $0.')
      return
    }

    if (isBuy && dollarAmount > availableCash) {
      setErrorMsg(`Saldo insuficiente. Tienes $${availableCash.toFixed(2)} disponibles.`)
      return
    }

    if (!isBuy && computedQuantity > availableUnits) {
      setErrorMsg(`No tienes suficientes acciones. Posees ${availableUnits.toFixed(2)} acciones.`)
      return
    }

    setIsLoading(true)
    try {
      await onTrade(asset.id, action, computedQuantity)
      setErrorMsg(null)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar la orden')
    } finally {
      setIsLoading(false)
    }
  }

  const sentimentPercent = Math.min(95, Math.max(50, Math.round(asset.sentiment_score || 75)))

  return (
    <div className="platform-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Operar Acciones
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-alt)] text-[var(--text-muted)] font-medium">
          SPOT
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--surface-alt)] rounded border border-[var(--border)]">
        <button
          type="button"
          onClick={() => {
            setAction('BUY')
            setErrorMsg(null)
          }}
          className={`py-2 rounded text-xs font-semibold tracking-tight transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            action === 'BUY'
              ? 'bg-[var(--surface)] text-emerald-700 shadow-xs border border-[var(--border)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <i className="fa-solid fa-plus text-[10px] text-emerald-600"></i>
          <span>Comprar</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAction('SELL')
            setErrorMsg(null)
            if (availableUnits > 0) {
              setDollarAmount(Math.min(dollarAmount, availableUnits * price))
            }
          }}
          className={`py-2 rounded text-xs font-semibold tracking-tight transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            action === 'SELL'
              ? 'bg-[var(--surface)] text-rose-700 shadow-xs border border-[var(--border)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <i className="fa-solid fa-minus text-[10px] text-rose-600"></i>
          <span>Vender</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono bg-[var(--surface-alt)] p-2.5 rounded border border-[var(--border)]">
          <span className="text-[var(--text-muted)] font-sans font-normal">
            {isBuy ? 'Disponible:' : 'Acciones:'}
          </span>
          <span className="font-semibold text-[var(--text)] tabular-nums">
            {isBuy
              ? `$${availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`
              : `${availableUnits.toFixed(2)} acciones`}
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
            Monto a {isBuy ? 'invertir' : 'retirar'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono font-medium text-[var(--text-muted)]">
              $
            </span>
            <input
              type="number"
              step="any"
              min="1"
              value={dollarAmount || ''}
              onChange={(e) => {
                setDollarAmount(parseFloat(e.target.value) || 0)
                setErrorMsg(null)
              }}
              className="w-full platform-input pl-7 pr-12 py-2 text-sm font-mono font-semibold text-[var(--text)]"
              placeholder="100.00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-normal text-[var(--text-muted)]">
              USD
            </span>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-4 gap-1.5 font-mono">
            {[25, 50, 100, 250].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickDollar(val)}
                className="py-1.5 bg-[var(--surface-alt)] hover:bg-[var(--border)] rounded text-xs font-medium text-[var(--text)] transition-colors cursor-pointer"
              >
                ${val}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAllIn}
            className="w-full mt-1.5 py-1 text-xs font-mono font-medium text-[var(--text-muted)] hover:text-[var(--text)] rounded transition-colors text-center cursor-pointer"
          >
            {isBuy ? 'Usar saldo máximo disponible' : 'Vender todo'}
          </button>
        </div>

        <div className="bg-[var(--surface-alt)] border border-[var(--border)] rounded p-3 space-y-1.5 text-xs font-normal">
          <div className="flex justify-between text-[var(--text-muted)]">
            <span>Precio unitario:</span>
            <span className="font-mono font-semibold text-[var(--text)]">${price.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between text-[var(--text-muted)]">
            <span>Acciones estimadas:</span>
            <span className="text-[var(--text)] font-mono font-semibold">
              {computedQuantity.toFixed(2)}
            </span>
          </div>
          <div className="border-t border-[var(--border)] pt-1.5 flex justify-between font-medium">
            <span className="text-[var(--text-muted)]">Total orden:</span>
            <span className="font-mono font-bold text-[var(--text)] text-sm tabular-nums">
              ${dollarAmount.toFixed(2)} USD
            </span>
          </div>
        </div>

        <div className="bg-[var(--surface-alt)] rounded p-2.5 space-y-1.5 border border-[var(--border)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)] flex items-center gap-1.5 font-normal">
              <i className="fa-solid fa-users text-[var(--text-dim)] text-xs"></i>
              Sentimiento
            </span>
            <span className="font-mono font-semibold text-emerald-600 text-xs">
              {sentimentPercent}% Comprando
            </span>
          </div>
          <div className="w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${sentimentPercent}%` }}
            ></div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-xs"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || dollarAmount <= 0}
          className={`w-full py-2.5 text-xs font-semibold rounded uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 transition-colors cursor-pointer ${
            isBuy
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
          }`}
        >
          {isLoading ? (
            <i className="fa-solid fa-spinner animate-spin"></i>
          ) : (
            <i className={`fa-solid ${isBuy ? 'fa-cart-shopping' : 'fa-hand-holding-dollar'} text-xs`}></i>
          )}
          <span>
            {isLoading
              ? 'Procesando...'
              : isBuy
              ? `Comprar por $${dollarAmount.toFixed(2)}`
              : `Vender por $${dollarAmount.toFixed(2)}`}
          </span>
        </button>
      </form>
    </div>
  )
}
