import React from 'react'
import { sampleColor } from '../atlasData'
import { Backdrop, FONT, SVG_PROPS, f } from './SceneKit'

const STOPS: Array<[number, string]> = [
  [0, '#2563eb'],
  [30, '#0891b2'],
  [50, '#d97706'],
  [75, '#ea580c'],
  [100, '#dc2626'],
]
const SEG = 20
const PITCH = 4.5
const TOP = 31
const BAR_X = 42
const BAR_W = 22
const TOTAL = SEG * PITCH
const ZONES = [
  { pct: 90, name: 'Codicia extrema' },
  { pct: 70, name: 'Codicia' },
  { pct: 50, name: 'Neutral' },
  { pct: 30, name: 'Miedo' },
  { pct: 10, name: 'Miedo extremo' },
]

/** Miedo & Codicia → medidor vertical de 20 segmentos: se encienden de abajo arriba y cambian de azul (miedo) a rojo (codicia). */
export const FearGreedScene: React.FC<{ value: number }> = ({ value }) => {
  const lit = (value / 100) * SEG
  const y = TOP + TOTAL - (value / 100) * TOTAL
  const color = sampleColor(STOPS, value)

  return (
    <svg {...SVG_PROPS}>
      <Backdrop id="fg" from="#f8fafc" to="#e2e8f0" />

      {Array.from({ length: SEG }, (_, k) => {
        const on = k + 1 <= lit
        const partial = !on && k < lit
        const topSeg = on && k + 1 > lit - 1
        return (
          <rect
            key={k}
            className={topSeg ? 'sc-blink' : undefined}
            x={BAR_X}
            y={f(TOP + (SEG - 1 - k) * PITCH)}
            width={BAR_W}
            height="3.5"
            rx="1.2"
            fill={on || partial ? sampleColor(STOPS, ((k + 0.5) / SEG) * 100) : '#cbd5e1'}
            fillOpacity={on ? 1 : partial ? 0.55 : 0.5}
          />
        )
      })}

      {/* marcador del nivel actual */}
      <polygon points={`${BAR_X - 11},${f(y - 4.5)} ${BAR_X - 11},${f(y + 4.5)} ${BAR_X - 3},${f(y)}`} fill={color} />

      {/* zonas */}
      <g stroke="#94a3b8" strokeOpacity="0.6" strokeWidth="1">
        {[20, 40, 60, 80].map((p) => (
          <line key={p} x1={BAR_X + BAR_W + 3} x2={BAR_X + BAR_W + 9} y1={f(TOP + TOTAL - (p / 100) * TOTAL)} y2={f(TOP + TOTAL - (p / 100) * TOTAL)} />
        ))}
      </g>
      <g fontSize="8.6" fill="#475569" style={FONT}>
        {ZONES.map((z) => (
          <text key={z.name} x={BAR_X + BAR_W + 14} y={f(TOP + TOTAL - (z.pct / 100) * TOTAL + 2.8)}>
            {z.name}
          </text>
        ))}
      </g>
    </svg>
  )
}
