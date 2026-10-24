import React from 'react'
import { MAX_SUPPLY, clamp } from '../atlasData'
import { Backdrop, FONT, SVG_PROPS, f } from './SceneKit'

const X = 14
const WIDTH = 140
const Y = 70
const H = 22

/** Suministro → barra de llenado hasta el máximo de 21 millones, con una escala cada 3 millones y un reflejo suave que la cruza. */
export const SupplyScene: React.FC<{ value: number }> = ({ value }) => {
  const pct = clamp(value / MAX_SUPPLY)
  const fill = WIDTH * pct

  return (
    <svg {...SVG_PROPS}>
      <Backdrop id="su" from="#fffbeb" to="#fef3c7" />
      <defs>
        <linearGradient id="su-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="su-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <pattern id="su-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeOpacity="0.35" strokeWidth="1.4" />
        </pattern>
        <clipPath id="su-clip">
          <rect x={X} y={Y} width={Math.max(0, fill)} height={H} rx="11" />
        </clipPath>
      </defs>

      <g fontSize="8.5" fill="#64748b" style={FONT}>
        <circle cx={X + 6} cy="49" r="6" fill="#fcd34d" stroke="#d97706" strokeWidth="1" />
        <text x={X + 6} y="52" textAnchor="middle" fontSize="8" fontWeight="700" fill="#92400e">₿</text>
        <text x={X + 17} y="52">Emitido y máximo</text>
      </g>

      {/* pista: la parte sin emitir va rayada */}
      <rect x={X} y={Y} width={WIDTH} height={H} rx="11" fill="#fff" fillOpacity="0.7" stroke="#cbd5e1" />
      <rect x={X} y={Y} width={WIDTH} height={H} rx="11" fill="url(#su-hatch)" />

      <rect x={X} y={Y} width={Math.max(0, fill)} height={H} rx="11" fill="url(#su-gold)" stroke="#d97706" strokeOpacity="0.55" />
      <g clipPath="url(#su-clip)">
        <rect className="sc-sheen" x="0" y={Y} width="46" height={H} fill="url(#su-sheen)" />
      </g>

      {/* escala: cada 3 millones */}
      {Array.from({ length: 8 }, (_, i) => {
        const m = i * 3
        const x = X + (m / MAX_SUPPLY) * WIDTH
        return <line key={m} x1={f(x)} x2={f(x)} y1={Y + H + 3} y2={Y + H + (m % 7 === 0 ? 9 : 6)} stroke="#64748b" strokeOpacity="0.6" strokeWidth="1.2" />
      })}
      <g fontSize="8" fill="#64748b" style={FONT}>
        <text x={X} y={Y + H + 20}>0</text>
        <text x={X + (7 / MAX_SUPPLY) * WIDTH} y={Y + H + 20} textAnchor="middle">7</text>
        <text x={X + (14 / MAX_SUPPLY) * WIDTH} y={Y + H + 20} textAnchor="middle">14</text>
        <text x={X + WIDTH} y={Y + H + 20} textAnchor="end">21 M</text>
      </g>
    </svg>
  )
}
