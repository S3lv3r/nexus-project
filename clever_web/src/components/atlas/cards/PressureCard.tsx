import React from 'react'
import { InfoTip } from '../AtlasCard'
import { RiskShield } from './RiskShield'
import { BearMascot, BullMascot } from '../scenes/BullBear'
import { useSmoothNumber } from '../useSmoothNumber'
import { riskColor, riskLabel } from '../atlasData'
import { BEAR_TONE, BULL_TONE } from '../scenes/BullBear'
import { ink } from '../scenes/SceneFrame'

/**
 * Presión del mercado (compra vs venta): el oso (bear market) empuja desde los vendedores y el toro (bull market)
 * desde los compradores; la moneda se desplaza hacia el lado que domina. Incluye el escudo de Riesgo.
 */
export const PressureCard: React.FC<{ buySell: number; risk: number }> = ({ buySell, risk }) => {
  const v = useSmoothNumber(buySell)
  const r = useSmoothNumber(risk)

  const buyers = Math.round(v)
  const sellers = 100 - buyers
  const buyPower = v / 100
  const sellPower = 1 - buyPower
  const buyDominant = v >= 50
  const strength = Math.abs(v - 50) / 50

  return (
    <section
      className="relative isolate overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
      style={{
        background: `linear-gradient(90deg, color-mix(in oklab, ${BEAR_TONE} ${Math.round(8 + 30 * sellPower)}%, var(--surface)) 0%, var(--surface) 34%, var(--surface) 66%, color-mix(in oklab, ${BULL_TONE} ${Math.round(8 + 30 * buyPower)}%, var(--surface)) 100%)`,
      }}
    >
      <div className="grid grid-cols-2 items-center gap-x-3 gap-y-2 px-3 py-1.5 sm:grid-cols-[auto_1fr_1fr_auto] lg:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto_auto]">
        {/* oso: vendedores */}
        <BearMascot power={sellPower} className="h-[88px] w-[96px] shrink-0 lg:order-1" />
        <div className="lg:order-2">
          <div className="text-[30px] font-semibold leading-none tabular-nums " style={{ color: ink(BEAR_TONE) }}>{sellers}%</div>
          <div className="mt-1 text-[12px] font-semibold text-[var(--text)]">Vendedores</div>
          <div className="text-[10.5px] text-[var(--text-muted)]">Mercado bajista · oso</div>
        </div>

        {/* compradores: toro */}
        <div className="text-right lg:order-4">
          <div className="text-[30px] font-semibold leading-none tabular-nums " style={{ color: ink(BULL_TONE) }}>{buyers}%</div>
          <div className="mt-1 text-[12px] font-semibold text-[var(--text)]">Compradores</div>
          <div className="text-[10.5px] text-[var(--text-muted)]">Mercado alcista · toro</div>
        </div>
        <BullMascot power={buyPower} className="h-[88px] w-[96px] shrink-0 lg:order-5" />

        {/* pista de presión */}
        <div className="col-span-2 sm:col-span-4 lg:order-3 lg:col-span-1">
          <div className="mb-0.5 flex items-center justify-center gap-2">
            <h3 className="text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-[var(--text-muted)]">
              Presión del mercado
            </h3>
            <InfoTip
              text="Compara cuánta gente quiere comprar frente a cuánta quiere vender en este momento."
              more={{
                title: 'Bull y bear market',
                note: (
                  <>
                    <strong className="text-emerald-700">Bull market (mercado alcista):</strong> dominan los compradores y los precios suben.{' '}
                    <strong className="text-rose-700">Bear market (mercado bajista):</strong> dominan los vendedores y los precios bajan.
                  </>
                ),
              }}
            />
          </div>

          <div className="relative mx-2 h-12" aria-hidden="true">
            <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full" style={{ background: `linear-gradient(90deg, color-mix(in oklab, ${BEAR_TONE} 30%, transparent), color-mix(in oklab, var(--text) 8%, transparent) 50%, color-mix(in oklab, ${BULL_TONE} 30%, transparent))` }} />
            <div
              className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full"
              style={{
                left: `${Math.min(50, v)}%`,
                width: `${Math.abs(v - 50)}%`,
                background: buyDominant
                  ? `linear-gradient(90deg, color-mix(in oklab, ${BULL_TONE} 55%, transparent), ${BULL_TONE})`
                  : `linear-gradient(90deg, ${BEAR_TONE}, color-mix(in oklab, ${BEAR_TONE} 55%, transparent))`,
                opacity: 0.7 + 0.3 * strength,
              }}
            />
            <div className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-[var(--text-muted)] opacity-60" />
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${v}%` }}>
              <svg viewBox="-20 -20 40 40" className="h-8 w-8">
                <circle r="15" fill="var(--surface)" stroke="#c9a23f" strokeWidth="1.6" />
                <text y="5.5" textAnchor="middle" fontSize="15" fontWeight="700" fill={ink('#b08a35', 80)}>
                  ₿
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* riesgo */}
        <div className="col-span-2 flex items-center justify-center gap-3 sm:col-span-4 lg:order-6 lg:col-span-1 lg:border-l lg:border-[var(--border)] lg:pl-4">
          <RiskShield value={r} className="h-[86px] w-[68px] shrink-0" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-muted)]">
              Riesgo
              <InfoTip text="Refleja qué tan expuesto está el activo a caídas bruscas. Más grietas en el escudo significa más riesgo." align="right" />
            </div>
            <div className="mt-0.5 text-[26px] font-semibold leading-none tabular-nums text-[var(--text)]">
              {Math.round(r)}
              <span className="ml-0.5 text-[10px] font-normal text-[var(--text-muted)]">/100</span>
            </div>
            <div className="mt-0.5 text-[12px] font-semibold" style={{ color: ink(riskColor(r)) }}>
              {riskLabel(r)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}