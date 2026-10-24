import React from 'react'
import { lerp, riskColor } from '../atlasData'
import { Backdrop, FONT, SVG_PROPS, f } from './SceneKit'

const X0 = 62 // hoy
const X1 = 156
const Y0 = 76
const HISTORY: Array<[number, number]> = [[12, 104], [22, 98], [32, 101], [42, 90], [52, 93], [62, 76]]

/** Incertidumbre → gráfico de abanico: el cono del pronóstico se ensancha cuanto menos predecible es el panorama. */
export const UncertaintyScene: React.FC<{ value: number }> = ({ value }) => {
  const color = riskColor(value)
  const half = lerp(3, 36, value / 100)
  const med = (x: number) => Y0 - 0.2 * (x - X0)
  const steps = Array.from({ length: 12 }, (_, i) => X0 + ((X1 - X0) * i) / 11)
  const h = (x: number) => half * Math.pow((x - X0) / (X1 - X0), 0.9)
  const upper = steps.map((x) => `${f(x)} ${f(med(x) - h(x))}`)
  const lower = [...steps].reverse().map((x) => `${f(x)} ${f(med(x) + h(x))}`)

  return (
    <svg {...SVG_PROPS}>
      <Backdrop id="un" from="#faf5ff" to="#ede9fe" />

      <line x1={X0} x2={X0} y1="36" y2="118" stroke="#94a3b8" strokeOpacity="0.6" strokeDasharray="2 3" />
      <text x={X0 + 3} y="41" fontSize="7.5" fill="#64748b" style={FONT}>hoy</text>

      <polygon points={`${upper.join(' ')} ${lower.join(' ')}`} fill={color} fillOpacity="0.16" />
      <polyline points={upper.join(' ')} fill="none" stroke={color} strokeOpacity="0.5" strokeWidth="1.2" />
      <polyline points={[...lower].reverse().join(' ')} fill="none" stroke={color} strokeOpacity="0.5" strokeWidth="1.2" />

      <polyline points={HISTORY.map(([x, y]) => `${x} ${y}`).join(' ')} fill="none" stroke="#475569" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <line className="sc-dash" x1={X0} y1={Y0} x2={X1} y2={f(med(X1))} stroke="#334155" strokeWidth="1.6" strokeDasharray="4 4" strokeLinecap="round" />
      <circle cx={X0} cy={Y0} r="3.2" fill="#fff" stroke="#475569" strokeWidth="1.6" />
    </svg>
  )
}
