import React from 'react'
import { SceneCard } from '../SceneCard'
import { FearGreedScene } from '../scenes/FearGreedScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { fearGreedLabel, sampleColor } from '../atlasData'

const STOPS: Array<[number, string]> = [
  [0, '#2563eb'],
  [30, '#0891b2'],
  [50, '#d97706'],
  [75, '#ea580c'],
  [100, '#dc2626'],
]
/** Fear & Greed → medidor vertical segmentado (de miedo extremo a codicia extrema) */
export const FearGreedCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)
  const color = sampleColor(STOPS, v)

  return (
    <SceneCard
      title="Miedo & Codicia"
      tip="Resume si el mercado actúa con miedo (cauteloso) o con codicia (confiado, a veces en exceso)."
      tipMore={{
        note: 'Para tu propio análisis puedes apoyarte en indicadores de volatilidad (como las Bandas de Bollinger) y de momentum (como el RSI).',
      }}
      value={Math.round(v)}
      suffix="/100"
      label={fearGreedLabel(v)}
      labelColor={color}
    >
      <FearGreedScene value={v} />
    </SceneCard>
  )
}