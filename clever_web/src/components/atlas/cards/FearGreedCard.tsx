import React from 'react'
import { SceneCard } from '../SceneCard'
import { ThermoScene } from '../scenes/ThermoScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { fearGreedLabel, sampleColor } from '../atlasData'

const STOPS: Array<[number, string]> = [
  [0, '#2f6bff'],
  [30, '#12a8c9'],
  [50, '#f2a516'],
  [75, '#f2661c'],
  [100, '#e5383b'],
]
/** Fear & Greed → termómetro entre el hielo y el fuego (el mercurio sube y cambia de color) */
export const FearGreedCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)
  const color = sampleColor(STOPS, v)

  return (
    <SceneCard
      title="Miedo & Codicia"
      tip="Resume si el mercado actúa con miedo (cauteloso) o con codicia (confiado, a veces en exceso)."
      tipMore={{
        title: 'Indicadores que puedes usar',
        chips: ['VIX', 'Bandas de Bollinger', 'RSI'],
        note: 'El VIX sube cuando crece el miedo en el mercado; las Bandas de Bollinger (volatilidad) y el RSI (momentum) también ayudan a leer el ánimo.',
      }}
      value={Math.round(v)}
      suffix="/100"
      label={fearGreedLabel(v)}
      labelColor={color}
    >
      <ThermoScene value={v} />
    </SceneCard>
  )
}
