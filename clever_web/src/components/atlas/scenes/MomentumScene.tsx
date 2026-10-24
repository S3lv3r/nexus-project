import React from 'react'
import { animVars } from '../animVars'
import { lerp } from '../atlasData'
import { Backdrop, SVG_PROPS, W, f } from './SceneKit'

const N = 18
const BASE = 84
const X0 = 12
const STEP = 8.2
const BAR_W = 5.6

/** Momentum → histograma tipo MACD: con impulso alcista las barras crecen sobre la línea; con impulso bajista cuelgan debajo. */
export const MomentumScene: React.FC<{ value: number }> = ({ value }) => {
  const k = (value - 50) / 50 // -1 … 1
  const strength = Math.abs(k)
  const bars = Array.from({ length: N }, (_, i) => {
    const h = (k >= 0 ? 48 : 34) * k * (0.22 + 0.78 * (i / (N - 1))) * (1 + 0.16 * Math.sin(i * 1.7))
    return { x: X0 + i * STEP, h }
  })
  const top = bars.map((b) => `${f(b.x + BAR_W / 2)} ${f(BASE - b.h)}`)
  const last = bars[N - 1]

  return (
    <svg {...SVG_PROPS}>
      <Backdrop id="mo" from="#f0fdf4" to="#dcfce7" />

      <line x1="6" x2={W - 6} y1={BASE} y2={BASE} stroke="#94a3b8" strokeOpacity="0.6" strokeDasharray="3 3" />

      {bars.map((b, i) => {
        const up = b.h >= 0
        const t = i / (N - 1)
        return (
          <rect
            key={i}
            className={`sc-bar sc-fb ${up ? 'sc-ob' : 'sc-ot'}`}
            x={f(b.x)}
            y={f(up ? BASE - b.h : BASE)}
            width={BAR_W}
            height={Math.max(0.8, Math.abs(b.h))}
            rx="1.4"
            fill={up ? '#34d399' : '#fb7185'}
            fillOpacity={0.35 + 0.6 * t}
            style={{ ...animVars({ '--d': `${lerp(3.4, 1.3, strength)}s` }), animationDelay: `${(i * 0.12).toFixed(2)}s` }}
          />
        )
      })}

      <polyline points={top.join(' ')} fill="none" stroke="#334155" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={f(last.x + BAR_W / 2)} cy={f(BASE - last.h)} r="3" fill="#fff" stroke="#334155" strokeWidth="1.6" />
    </svg>
  )
}
