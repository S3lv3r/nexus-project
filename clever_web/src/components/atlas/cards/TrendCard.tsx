import React from 'react'
import { SceneCard } from '../SceneCard'
import { TrendScene } from '../scenes/TrendScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { goodColor, trendLabel } from '../atlasData'

/** Tendencia → dial semicircular (la aguja va de bajista a alcista) */
export const TrendCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Tendencia"
      tip="Muestra hacia dónde apunta el mercado: hacia abajo (bajista), estable (neutral) o hacia arriba (alcista)."
      tipMore={{ title: 'Indicadores que puedes usar', chips: ['Medias móviles (SMA y EMA)', 'Nube de Ichimoku'] }}
      value={Math.round(v)}
      suffix="/100"
      label={trendLabel(v)}
      labelColor={goodColor(v)}
    >
      <TrendScene value={v} />
    </SceneCard>
  )
}