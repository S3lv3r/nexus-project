import React from 'react'
import { SceneCard } from '../SceneCard'
import { UncertaintyScene } from '../scenes/UncertaintyScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { riskColor, uncertaintyLabel } from '../atlasData'

/** Incertidumbre → gráfico de abanico (el cono del pronóstico se ensancha) */
export const UncertaintyCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Incertidumbre"
      tip="Qué tan predecible se ve el panorama. Cuanto más ancho es el cono del pronóstico, más difícil es anticipar lo que viene."
      value={Math.round(v)}
      suffix="/100"
      label={uncertaintyLabel(v)}
      labelColor={riskColor(v)}
      extra={
        <div className="mt-1 flex items-center gap-1.5 text-[9.5px] text-slate-500" aria-hidden="true">
          <span>Baja</span>
          <div className="relative h-1.5 flex-1 rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-rose-300">
            <span
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-700 shadow"
              style={{ left: `${v}%` }}
            />
          </div>
          <span>Alta</span>
        </div>
      }
    >
      <UncertaintyScene value={v} />
    </SceneCard>
  )
}