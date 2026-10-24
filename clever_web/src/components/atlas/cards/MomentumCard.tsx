import React from 'react'
import { SceneCard } from '../SceneCard'
import { MomentumScene } from '../scenes/MomentumScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { goodColor, momentumLabel } from '../atlasData'

/** Momentum → histograma tipo MACD (barras bajo la línea … barras altas y crecientes) */
export const MomentumCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Momentum"
      tip="Mide la fuerza con la que se mueve el precio. Barras altas y crecientes sobre la línea indican un impulso fuerte; barras por debajo, un impulso a la baja."
      tipMore={{ title: 'Indicadores que puedes usar', chips: ['RSI', 'MACD', 'KDJ'] }}
      value={Math.round(v)}
      suffix="/100"
      label={momentumLabel(v)}
      labelColor={goodColor(v)}
    >
      <MomentumScene value={v} />
    </SceneCard>
  )
}