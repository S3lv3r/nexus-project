import React, { useCallback, useState } from 'react'
import { AtlasHeader } from './AtlasHeader'
import { AtlasStyles } from './AtlasStyles'
import { SceneStyles } from './SceneStyles'
import { SimulatorPanel } from './SimulatorPanel'
import { useSmoothNumber } from './useSmoothNumber'
import { DEFAULT_DATA, PRESETS } from './atlasData'
import type { AtlasData, PresetKey } from './atlasData'
import { FearGreedCard } from './cards/FearGreedCard'
import { LiquidityCard } from './cards/LiquidityCard'
import { MomentumCard } from './cards/MomentumCard'
import { PressureCard } from './cards/PressureCard'
import { PriceChartCard } from './cards/PriceChartCard'
import { SentimentCard } from './cards/SentimentCard'
import { SupplyCard } from './cards/SupplyCard'
import { TrendCard } from './cards/TrendCard'
import { UncertaintyCard } from './cards/UncertaintyCard'
import { VolatilityCard } from './cards/VolatilityCard'

/**
 * Bitcoin Atlas: indicadores de Bitcoin convertidos en metáforas visuales.
 * Todos los datos son ficticios y se ajustan desde el panel "Simulador".
 */
export const BitcoinAtlas: React.FC = () => {
  const [data, setData] = useState<AtlasData>(DEFAULT_DATA)
  const [simOpen, setSimOpen] = useState(false)

  const update = useCallback((key: keyof AtlasData, value: number) => {
    setData((d) => ({ ...d, [key]: value }))
  }, [])
  const applyPreset = useCallback((key: PresetKey) => {
    setData((d) => ({ ...d, ...PRESETS[key] }))
  }, [])
  const reset = useCallback(() => setData(DEFAULT_DATA), [])
  const closeSim = useCallback(() => setSimOpen(false), [])

  // Ambiente general: el resplandor del fondo cambia con el ánimo del mercado
  const mood = useSmoothNumber((data.sentiment + data.fearGreed + (100 - data.risk)) / 3, 0.06)

  return (
    <div className="atlas-root relative isolate overflow-hidden rounded-3xl bg-[var(--surface)] p-3 text-[var(--text)] ring-1 ring-[var(--border)] shadow-[0_24px_48px_-36px_rgba(15,23,42,0.45)] lg:min-w-[1232px]">
      <AtlasStyles />
      <SceneStyles />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            `radial-gradient(60% 50% at 12% 0%, rgba(251,191,36,${0.05 + 0.14 * (mood / 100)}), transparent 60%),` +
            `radial-gradient(50% 45% at 92% 8%, rgba(45,212,191,${0.04 + 0.1 * (mood / 100)}), transparent 60%),` +
            `radial-gradient(70% 60% at 50% 100%, rgba(248,113,113,${0.04 + 0.12 * ((100 - mood) / 100)}), transparent 65%)`,
        }}
      />

      <AtlasHeader price={data.price} onOpenSimulator={() => setSimOpen(true)} />

      {/* Cuatro tarjetas a cada lado y el gráfico de precio ocupando todo el centro */}
      <div className="relative z-10 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.38fr)_minmax(0,1fr)]">
        <div className="order-2 grid grid-cols-2 gap-3 lg:order-1 lg:grid-rows-2">
          <TrendCard value={data.trend} />
          <VolatilityCard value={data.volatility} />
          <SentimentCard value={data.sentiment} />
          <UncertaintyCard value={data.uncertainty} />
        </div>

        <div className="order-1 min-h-[380px] lg:order-2">
          <PriceChartCard price={data.price} volatility={data.volatility} trend={data.trend} />
        </div>

        <div className="order-3 grid grid-cols-2 gap-3 lg:grid-rows-2">
          <MomentumCard value={data.momentum} />
          <LiquidityCard value={data.liquidity} />
          <SupplyCard value={data.supply} />
          <FearGreedCard value={data.fearGreed} />
        </div>
      </div>

      {/* Franja inferior: presión del mercado (oso contra toro) y riesgo */}
      <div className="relative z-10 mt-3">
        <PressureCard buySell={data.buySell} risk={data.risk} />
      </div>

      <SimulatorPanel
        open={simOpen}
        onClose={closeSim}
        data={data}
        onChange={update}
        onPreset={applyPreset}
        onReset={reset}
      />
    </div>
  )
}