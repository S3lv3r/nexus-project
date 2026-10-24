import React from 'react'
import { SceneCard } from '../SceneCard'
import { SentimentScene } from '../scenes/SentimentScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { goodColor, sentimentLabel } from '../atlasData'

/** Sentimiento → anillo de marcas (0 muy pesimista … 100 muy optimista) */
export const SentimentCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Sentimiento"
      tip="Resume el ánimo general de quienes operan. Cuanto más lleno y verde está el anillo, más optimista es la mayoría; casi vacío y rojo, predomina el miedo."
      tipMore={{
        note: 'Puedes guiarte con el tipo de mercado actual (bull market o bear market) y con las noticias del momento.',
      }}
      value={Math.round(v)}
      suffix="/100"
      label={sentimentLabel(v)}
      labelColor={goodColor(v)}
    >
      <SentimentScene value={v} />
    </SceneCard>
  )
}