import React from 'react'
import { InfoTip } from '../AtlasCard'
import { RiskShield } from './RiskShield'
import { useSmoothNumber } from '../useSmoothNumber'
import { lerp, riskColor, riskLabel } from '../atlasData'
import { animVars } from '../animVars'

const HEIGHTS = [28, 40, 52, 64, 76]
const SELL = ['#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c']
const BUY = ['#6ee7b7', '#34d399', '#10b981', '#059669', '#047857']

/** Cinco barras de fuerza: se encienden según el poder de cada bando y crecen hacia afuera. */
const PowerBars: React.FC<{ power: number; side: 'sell' | 'buy'; className?: string }> = ({ power, side, className = '' }) => {
  const lit = Math.round(power * 5)
  const colors = side === 'sell' ? SELL : BUY
  const order = side === 'sell' ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4]
  return (
    <div aria-hidden="true" className={`flex items-end justify-center gap-1.5 ${className}`}>
      {order.map((i) => (
        <span
          key={i}
          className={`w-3 rounded-sm transition-colors duration-500 motion-reduce:transition-none ${i === lit - 1 ? 'sc-pulse' : ''}`}
          style={{ height: HEIGHTS[i], background: i < lit ? colors[i] : '#e2e8f0' }}
        />
      ))}
    </div>
  )
}

/**
 * Presión del mercado (compra vs venta): las barras de fuerza de los vendedores (mercado bajista) y de los compradores
 * (mercado alcista) se encienden según su poder, y el marcador se desplaza hacia el lado que domina. Incluye el escudo de Riesgo.
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
      className="relative isolate overflow-hidden rounded-xl border border-slate-200 shadow-sm shadow-slate-200/70"
      style={{
        background: `linear-gradient(90deg, rgba(254,202,202,${0.12 + 0.3 * sellPower}) 0%, #ffffff 36%, #ffffff 64%, rgba(187,247,208,${0.12 + 0.3 * buyPower}) 100%)`,
      }}
    >
      <div className="grid grid-cols-2 items-center gap-x-3 gap-y-2 px-3 py-1.5 sm:grid-cols-[auto_1fr_1fr_auto] lg:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto_auto]">
        {/* vendedores */}
        <PowerBars power={sellPower} side="sell" className="h-[88px] w-[96px] shrink-0 lg:order-1" />
        <div className="lg:order-2">
          <div className="text-[30px] font-semibold leading-none tabular-nums text-rose-600">{sellers}%</div>
          <div className="mt-1 text-[12px] font-semibold text-slate-700">Vendedores</div>
          <div className="text-[10.5px] text-rose-600">Mercado bajista · oso</div>
        </div>

        {/* compradores */}
        <div className="text-right lg:order-4">
          <div className="text-[30px] font-semibold leading-none tabular-nums text-emerald-600">{buyers}%</div>
          <div className="mt-1 text-[12px] font-semibold text-slate-700">Compradores</div>
          <div className="text-[10.5px] text-emerald-700">Mercado alcista · toro</div>
        </div>
        <PowerBars power={buyPower} side="buy" className="h-[88px] w-[96px] shrink-0 lg:order-5" />

        {/* pista de presión */}
        <div className="col-span-2 sm:col-span-4 lg:order-3 lg:col-span-1">
          <div className="mb-0.5 flex items-center justify-center gap-2">
            <h3 className="text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-slate-600">Presión del mercado</h3>
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
            <div className="absolute inset-x-0 top-1/2 h-3.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-rose-200 via-slate-100 to-emerald-200 ring-1 ring-slate-200" />

            {/* ventaja: del centro hasta el marcador, con franjas que avanzan hacia el lado que domina */}
            <div
              className={`absolute top-1/2 h-3.5 -translate-y-1/2 rounded-full ${buyDominant ? 'sc-stripes' : 'sc-stripes-l'}`}
              style={{
                left: `${Math.min(50, v)}%`,
                width: `${Math.abs(v - 50)}%`,
                backgroundColor: buyDominant ? '#34d399' : '#fb7185',
                backgroundImage: 'linear-gradient(115deg, rgba(255,255,255,.3) 25%, transparent 25% 50%, rgba(255,255,255,.3) 50% 75%, transparent 75%)',
                backgroundSize: '18px 18px',
                ...animVars({ '--d': `${lerp(2.2, 0.8, strength)}s` }),
              }}
            />
            <div className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-slate-400" />

            {/* marcador */}
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${v}%` }}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-[17px] font-bold text-amber-800 shadow-sm ring-2 ring-white">₿</div>
            </div>
          </div>
        </div>

        {/* riesgo */}
        <div className="col-span-2 flex items-center justify-center gap-3 sm:col-span-4 lg:order-6 lg:col-span-1 lg:border-l lg:border-slate-200 lg:pl-4">
          <RiskShield value={r} className="h-[86px] w-[68px] shrink-0" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-[12px] text-slate-600">
              Riesgo
              <InfoTip text="Refleja qué tan expuesto está el activo a caídas bruscas. Cuanto más se llena el escudo, mayor es el riesgo." align="right" />
            </div>
            <div className="mt-0.5 text-[26px] font-semibold leading-none tabular-nums text-slate-900">
              {Math.round(r)}
              <span className="ml-0.5 text-[10px] font-normal text-slate-500">/100</span>
            </div>
            <div className="mt-0.5 text-[12px] font-semibold" style={{ color: riskColor(r) }}>
              {riskLabel(r)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}