import React from 'react'
import { SceneCard } from '../SceneCard'
import { VolatilityScene } from '../scenes/VolatilityScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { riskColor, volatilityLabel } from '../atlasData'

/** Volatilidad → osciloscopio (onda tranquila … amplia, irregular y rápida) */
export const VolatilityCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Volatilidad"
      tip="Indica qué tan fuertes son los movimientos del precio. Con volatilidad alta la onda es más amplia, irregular y rápida: el precio puede cambiar rápidamente."
      tipMore={{ title: 'Indicadores que puedes usar', chips: ['Bandas de Bollinger', 'ADX'] }}
      value={Math.round(v)}
      suffix="/100"
      label={volatilityLabel(v)}
      labelColor={riskColor(v)}
    >
      <VolatilityScene value={v} />
    </SceneCard>
  )
}