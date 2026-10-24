import React from 'react'
import { goodColor } from '../atlasData'
import { Backdrop, FONT, SVG_PROPS, f, polar } from './SceneKit'

const CX = 84
const CY = 112
const R = 57
const ZONES: Array<[number, number, string]> = [
  [180, 122, '#fda4af'],
  [118, 62, '#fde68a'],
  [58, 0, '#86efac'],
]

const arc = (a1: number, a2: number, r: number) => {
  const [x1, y1] = polar(CX, CY, a1, r)
  const [x2, y2] = polar(CX, CY, a2, r)
  return `M${f(x1)} ${f(y1)} A${r} ${r} 0 0 1 ${f(x2)} ${f(y2)}`
}

/** Tendencia → dial semicircular: la aguja va de bajista (izquierda) a alcista (derecha) y deja una estela de su dirección. */
export const TrendScene: React.FC<{ value: number }> = ({ value }) => {
  const angle = 180 - value * 1.8
  const color = goodColor(value)
  const [nx, ny] = polar(CX, CY, angle, 47)
  const [tx, ty] = polar(CX, CY, angle + 180, 8)
  const [t1x, t1y] = polar(CX, CY, 90, 39)
  const [t2x, t2y] = polar(CX, CY, angle, 39)

  return (
    <svg {...SVG_PROPS}>
      <Backdrop id="tr" from="#f0f9ff" to="#e0f2fe" />

      {ZONES.map(([a1, a2, c]) => (
        <path key={a1} d={arc(a1, a2, R)} fill="none" stroke={c} strokeWidth="9" />
      ))}
      {Array.from({ length: 11 }, (_, i) => {
        const a = 180 - i * 18
        const major = i % 5 === 0
        const [x1, y1] = polar(CX, CY, a, R + 7)
        const [x2, y2] = polar(CX, CY, a, R + (major ? 13 : 10))
        return <line key={i} x1={f(x1)} y1={f(y1)} x2={f(x2)} y2={f(y2)} stroke="#64748b" strokeOpacity={major ? 0.7 : 0.4} strokeWidth="1.2" strokeLinecap="round" />
      })}

      {/* estela entre el centro (neutral) y la aguja */}
      <path d={`M${CX} ${CY} L${f(t1x)} ${f(t1y)} A39 39 0 0 ${angle < 90 ? 1 : 0} ${f(t2x)} ${f(t2y)} Z`} fill={color} fillOpacity="0.13" />

      <g className="sc-needle" style={{ transformOrigin: `${CX}px ${CY}px` }}>
        <line x1={f(tx)} y1={f(ty)} x2={f(nx)} y2={f(ny)} stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      </g>
      <circle cx={CX} cy={CY} r="5.5" fill="#fff" stroke="#94a3b8" strokeWidth="1.6" />
      <circle cx={CX} cy={CY} r="2" fill={color} />

      <g fontSize="8.5" fill="#64748b" style={FONT}>
        <text x="12" y="130">Bajista</text>
        <text x="156" y="130" textAnchor="end">Alcista</text>
      </g>
    </svg>
  )
}
