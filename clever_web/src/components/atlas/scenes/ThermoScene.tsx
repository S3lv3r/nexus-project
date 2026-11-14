import React from 'react'
import { clamp, sampleColor } from '../atlasData'
import { animVars } from '../animVars'
import { SceneFrame, ink } from './SceneFrame'

const STOPS: Array<[number, string]> = [[0, '#2f6bff'], [30, '#12a8c9'], [50, '#f2a516'], [75, '#f2661c'], [100, '#e5383b']]
const ZONES = ['#2f6bff', '#12a8c9', '#f2a516', '#f2661c', '#e5383b']
const TICKS = [104, 87.5, 71, 54.5, 38]
const COOL = '#2f7bff'
const WARM = '#f2661c'

export const ThermoScene: React.FC<{ value: number }> = ({ value }) => {
  const color = sampleColor(STOPS, value)
  const top = 104 - (value / 100) * 66
  const cold = clamp((55 - value) / 55)
  const hot = clamp((value - 45) / 55)

  return (
    <SceneFrame
      id="th"
      tone={color}
      strength={0.45}
      defs={
        <>
          <radialGradient id="th-cool" cx="15%" cy="60%" r="60%">
            <stop offset="0%" stopColor={COOL} stopOpacity="0.42" />
            <stop offset="100%" stopColor={COOL} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="th-warm" cx="88%" cy="55%" r="60%">
            <stop offset="0%" stopColor={WARM} stopOpacity="0.42" />
            <stop offset="100%" stopColor={WARM} stopOpacity="0" />
          </radialGradient>
        </>
      }
    >
      <rect width="168" height="185" fill="url(#th-cool)" opacity={cold} />
      <rect width="168" height="185" fill="url(#th-warm)" opacity={hot} />

      <g transform="translate(26 70)" fill="none" stroke={ink(COOL, 70)} strokeWidth="1.2" strokeLinecap="round" opacity={0.2 + 0.8 * cold}>
        <path d="M0 -9 V9 M-7.8 -4.5 L7.8 4.5 M-7.8 4.5 L7.8 -4.5" />
        <path d="M-2.5 -7 L0 -4.5 L2.5 -7 M-2.5 7 L0 4.5 L2.5 7" />
      </g>
      <g transform="translate(142 70)" fill="none" stroke={ink(WARM, 70)} strokeWidth="1.2" strokeLinejoin="round" opacity={0.2 + 0.8 * hot}>
        <path d="M0 10 C-6.5 7 -6 0 0 -10 C1.5 -3.5 6.5 -0.5 5.5 5 C4.8 8.5 2.5 10 0 10 Z" />
        <path d="M0 10 C-2.5 8 -2 4.5 0 1.5 C1.5 4.5 2.5 7.5 0 10 Z" />
      </g>

      <g transform="translate(-16 0)">
        <g strokeWidth="1.8" strokeLinecap="round">
          {TICKS.map((y, i) => (
            <line key={y} x1="98" y1={y} x2="104" y2={y} stroke={ink(ZONES[i], 80)} opacity="0.85" />
          ))}
        </g>
        <g fontSize="8" fontWeight="600">
          <text x="109" y="41" fill={ink('#dc2626', 72)}>Codicia</text>
          <text x="109" y="107" fill={ink('#2563eb', 72)}>Miedo</text>
        </g>

        <rect x="75" y="34" width="18" height="78" rx="9" fill="var(--ax-dial)" stroke="var(--ax-line)" strokeWidth="1.2" />
        <circle cx="84" cy="114" r="14" fill="var(--ax-dial)" stroke="var(--ax-line)" strokeWidth="1.2" />

        <circle cx="84" cy="114" r="13" fill={color} opacity="0.14" className="sc-breathe sc-fb sc-oc" style={animVars({ '--d': '6s', '--s': 1.06 })} />
        <rect x="79.5" y={top} width="9" height={112 - top} rx="4.5" fill={color} />
        <circle cx="84" cy="114" r="10" fill={color} />
        <rect x="81" y={top + 3} width="1.6" height={Math.max(0, 104 - top)} rx="0.8" fill="#fff" opacity="0.35" />
      </g>
    </SceneFrame>
  )
}
