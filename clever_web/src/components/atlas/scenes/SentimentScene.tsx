import React from 'react'
import { Backdrop, FONT, SVG_PROPS, f } from './SceneKit'

const CX = 84
const CY = 80
const R = 35
const TICKS = 36

/** Colores por tramos: rojo, naranja, ámbar, verde y esmeralda. Sin mezclas, que dan un verde olivo poco agradable. */
const zoneColor = (p: number) => (p < 25 ? '#fb7185' : p < 45 ? '#fb923c' : p < 60 ? '#fbbf24' : p < 80 ? '#34d399' : '#10b981')

/** Sentimiento → anillo de 36 marcas que se encienden de rojo a verde según el ánimo del mercado. */
export const SentimentScene: React.FC<{ value: number }> = ({ value }) => {
  const color = zoneColor(value)
  const lit = (value / 100) * TICKS

  return (
    <svg {...SVG_PROPS}>
      <Backdrop id="se" from="#fffbeb" to="#fef9c3" />

      {Array.from({ length: TICKS }, (_, i) => {
        const a = ((-90 + (i * 360) / TICKS) * Math.PI) / 180
        const on = i < lit
        const last = on && i === Math.floor(lit)
        return (
          <line
            key={i}
            className={last ? 'sc-blink' : undefined}
            x1={f(CX + 43 * Math.cos(a))}
            y1={f(CY + 43 * Math.sin(a))}
            x2={f(CX + 50 * Math.cos(a))}
            y2={f(CY + 50 * Math.sin(a))}
            stroke={on ? zoneColor((i / (TICKS - 1)) * 100) : '#94a3b8'}
            strokeOpacity={on ? 1 : 0.3}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      })}

      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e2e8f0" strokeWidth="6" />
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" pathLength={100} strokeDasharray={`${Math.max(0.01, value)} 100`} transform={`rotate(-90 ${CX} ${CY})`} />

      <circle cx={CX} cy={CY} r="25" fill={color} fillOpacity="0.08" />
      <circle className="sc-pulse sc-fb sc-oc" style={{ ['--d' as string]: '3.4s' }} cx={CX} cy={CY} r="25" fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="1.2" />
      <text x={CX} y={CY + 3} textAnchor="middle" fontSize="8" fontWeight="600" letterSpacing="1.6" fill="#64748b" style={FONT}>
        ÁNIMO
      </text>
    </svg>
  )
}
