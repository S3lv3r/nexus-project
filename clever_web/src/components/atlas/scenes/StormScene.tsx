import React from 'react'
import { lerp, riskColor } from '../atlasData'
import { animVars } from '../animVars'
import { SceneFrame, ink } from './SceneFrame'

const MID = 78
const NOISE = [0.1, -0.6, 0.9, -0.3, 0.5, -1, 0.7, -0.2, 0.3, -0.8, 1, -0.5, 0.2, -0.9, 0.6, -0.1, 0.8, -0.7, 0.4, -1, 0.9, -0.4, 0.1, -0.6, 0.7, -0.3, 0.5, -0.8]
const GRID_X = Array.from({ length: 8 }, (_, i) => 12 + i * 21)

const trace = (amp: number, shift = 0) => {
  let d = ''
  for (let i = 0; i <= 56; i++) {
    const y = MID + amp * NOISE[(i + shift) % 28]
    d += `${i === 0 ? 'M' : 'L'}${i * 6} ${y.toFixed(1)} `
  }
  return d
}

export const StormScene: React.FC<{ value: number }> = ({ value }) => {
  const t = value / 100
  const amp = 3 + 19 * t
  const color = riskColor(value)

  return (
    <SceneFrame id="st" tone={color} accent="#7357ff" strength={0.35 + 0.65 * t}>
      <g stroke="var(--ax-faint)" strokeWidth="1">
        {GRID_X.map((x) => (
          <line key={x} x1={x} y1="38" x2={x} y2="118" />
        ))}
        <line x1="0" y1={MID - 26} x2="168" y2={MID - 26} />
        <line x1="0" y1={MID + 26} x2="168" y2={MID + 26} />
      </g>
      <line x1="0" y1={MID} x2="168" y2={MID} stroke="var(--ax-line)" strokeDasharray="2 3" />

      <rect x="0" y={MID - amp} width="168" height={amp * 2} fill={color} opacity="0.2" />
      <g stroke={ink(color, 70)} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6">
        <line x1="0" y1={MID - amp} x2="168" y2={MID - amp} />
        <line x1="0" y1={MID + amp} x2="168" y2={MID + amp} />
      </g>

      <g className="sc-scroll" style={animVars({ '--d': `${lerp(16, 6, t)}s` })}>
        <path d={trace(amp * 0.55, 9)} fill="none" stroke="#7357ff" strokeWidth="1.2" strokeLinejoin="round" opacity="0.6" />
      </g>
      <g className="sc-scroll" style={animVars({ '--d': `${lerp(11, 3.4, t)}s` })}>
        <path d={trace(amp)} fill="none" stroke={ink(color, 92)} strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" />
      </g>
    </SceneFrame>
  )
}
