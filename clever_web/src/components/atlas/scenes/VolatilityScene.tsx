import React from 'react'
import { lerp, riskColor } from '../atlasData'
import { animVars } from '../animVars'
import { Backdrop, SVG_PROPS, W } from './SceneKit'

const MID = 80

/** Dos periodos de una onda: se desplaza uno entero y vuelve a empezar sin que se note el corte. */
function wave(v: number): string {
  const amp = lerp(3, 24, v / 100)
  const w2 = 0.3 + 0.2 * (v / 100)
  const w3 = 0.05 + 0.3 * (v / 100)
  let d = ''
  for (let x = 0; x <= 2 * W; x += 3) {
    const t = (x / W) * Math.PI * 2
    const y = MID - amp * (0.62 * Math.sin(3 * t + 0.6) + w2 * Math.sin(7 * t + 1.9) + w3 * Math.sin(13 * t))
    d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`
  }
  return d
}

/** Volatilidad → osciloscopio: la onda se hace más amplia, más irregular y más rápida cuanto mayor es el valor. */
export const VolatilityScene: React.FC<{ value: number }> = ({ value }) => {
  const color = riskColor(value)
  const amp = lerp(3, 24, value / 100)
  const d = wave(value)

  return (
    <svg {...SVG_PROPS}>
      <Backdrop id="vo" from="#f5f3ff" to="#eef2ff" />

      {/* banda de variación: entre más ancha, más volátil */}
      <rect x="0" y={MID - amp} width={W} height={amp * 2} fill={color} fillOpacity="0.08" />
      <g stroke={color} strokeOpacity="0.35" strokeDasharray="3 4" strokeWidth="1">
        <line x1="0" x2={W} y1={MID - amp} y2={MID - amp} />
        <line x1="0" x2={W} y1={MID + amp} y2={MID + amp} />
      </g>
      <line x1="0" x2={W} y1={MID} y2={MID} stroke="#94a3b8" strokeOpacity="0.5" strokeWidth="1" />

      <g className="sc-scroll" style={animVars({ '--d': `${lerp(9, 2.4, value / 100)}s` })}>
        <path d={d} fill="none" stroke={color} strokeOpacity="0.14" strokeWidth="6" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </g>
    </svg>
  )
}
