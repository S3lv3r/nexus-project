import React from 'react'
import { SceneCard } from '../SceneCard'
import { StormScene } from '../scenes/StormScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { riskColor, volatilityLabel } from '../atlasData'

/** Volatilidad → tormenta (pequeña y calmada … grande, con rayos y turbulencia) */
export const VolatilityCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Volatilidad"
      tip="Indica qué tan fuertes son los movimientos del precio. Una volatilidad alta significa que el precio puede cambiar rápidamente."
      tipMore={{ title: 'Indicadores que puedes usar', chips: ['Bandas de Bollinger', 'ADX', 'VIX'] }}
      value={Math.round(v)}
      suffix="/100"
      label={volatilityLabel(v)}
      labelColor={riskColor(v)}
    >
      <StormScene value={v} />
    </SceneCard>
  )
}
