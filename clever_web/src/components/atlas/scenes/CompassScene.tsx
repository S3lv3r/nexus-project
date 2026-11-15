import React from 'react'
import { clamp, goodColor, lerp } from '../atlasData'
import { animVars } from '../animVars'
import { SceneFrame, ink, tint } from './SceneFrame'

const CX = 84
const CY = 78
const R = 44
const TICKS = Array.from({ length: 36 }, (_, i) => i * 10)
const UP = '#16a96a'
const DOWN = '#e5484d'

const polar = (a: number, r: number): [number, number] => {
  const rad = (a * Math.PI) / 180
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)]
}
const arc = (a1: number, a2: number, r: number) => {
  const [x1, y1] = polar(a1, r)
  const [x2, y2] = polar(a2, r)
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

const CHEVRONS = [
  { x: 18, y: 50, d: 0 },
  { x: 150, y: 46, d: 1.4 },
  { x: 16, y: 104, d: 2.6 },
  { x: 152, y: 108, d: 0.7 },
]

export const CompassScene: React.FC<{ value: number }> = ({ value }) => {
  const t = (value - 50) / 50
  const strength = Math.abs(t)
  const angle = -t * 65
  const color = goodColor(value)
  const up = value >= 50
  const flow = strength < 0.12 ? 'sc-drift-x' : up ? 'sc-drift-up' : 'sc-drift-down'
  const chevron = strength < 0.12 ? 'M-2 -4 L2 0 L-2 4' : up ? 'M-4 2 L0 -2 L4 2' : 'M-4 -2 L0 2 L4 -2'

  return (
    <SceneFrame id="cp" tone={color} accent="#38bdf8" strength={0.35 + 0.65 * strength}>
      <g fill="none" stroke={ink(color, 88)} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {CHEVRONS.map((c) => (
          <g key={c.x + '-' + c.y} transform={`translate(${c.x} ${c.y})`}>
            <path d={chevron} className={flow} style={{ ...animVars({ '--d': `${lerp(7, 3.6, strength)}s` }), animationDelay: `${c.d}s` }} />
          </g>
        ))}
      </g>

      <circle cx={CX} cy={CY} r={R} fill={tint(color, 14)} stroke={ink(color, 45)} strokeOpacity="0.45" strokeWidth="1.2" />
      <circle cx={CX} cy={CY} r={R - 9} fill="none" stroke="var(--ax-faint)" strokeWidth="1" />

      {TICKS.map((a) => {
        const major = a % 90 === 0
        const mid = a % 30 === 0
        const [x1, y1] = polar(a, R - 2.5)
        const [x2, y2] = polar(a, R - (major ? 8 : mid ? 6 : 4.5))
        return (
          <line
            key={a}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={major ? 'var(--ax-soft)' : 'var(--ax-line)'}
            strokeWidth={major ? 1.3 : 0.9}
            strokeLinecap="round"
          />
        )
      })}

      <path d={arc(-68, -14, R - 14)} fill="none" stroke={ink(UP, 88)} strokeWidth="3.4" strokeLinecap="round" opacity={0.25 + 0.75 * clamp(t)} />
      <path d={arc(14, 68, R - 14)} fill="none" stroke={ink(DOWN, 88)} strokeWidth="3.4" strokeLinecap="round" opacity={0.25 + 0.75 * clamp(-t)} />

      <g transform={`rotate(${angle} ${CX} ${CY})`}>
        <g className="sc-settle" style={{ transformOrigin: `${CX}px ${CY}px`, ...animVars({ '--d': `${lerp(6, 4, strength)}s` }) }}>
          <line x1={CX} y1={CY} x2={CX - 15} y2={CY} stroke="var(--ax-soft)" strokeWidth="1.6" strokeLinecap="round" />
          <polygon points={`${CX + 34},${CY} ${CX},${CY - 2.6} ${CX},${CY + 2.6}`} fill={ink(color)} />
        </g>
      </g>
      <circle cx={CX} cy={CY} r="3.4" fill="var(--surface)" stroke="var(--ax-ink)" strokeWidth="1.3" />
    </SceneFrame>
  )
}
