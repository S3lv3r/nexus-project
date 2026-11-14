import React from 'react'
import { clamp, sampleColor } from '../atlasData'
import { animVars } from '../animVars'
import { SceneFrame, ink } from './SceneFrame'

const HORIZON = 112
const ARC_R = 58
const SKY: Array<[number, string]> = [[0, '#56657d'], [45, '#5f97d8'], [100, '#2b9bf4']]
const CLOUD: Array<[number, string]> = [[0, '#64748b'], [60, '#a8b4c2'], [100, '#d5dde6']]
const CLOUDS = [
  { y: 44, w: 46, h: 11, t: 58, d: -12 },
  { y: 62, w: 32, h: 8, t: 44, d: -30 },
  { y: 82, w: 54, h: 12, t: 70, d: -46 },
]
const GROUND: Array<[number, string]> = [[0, '#6b7686'], [55, '#52bb6a'], [100, '#22b45e']]
const RAIN_X = [22, 40, 58, 76, 94, 112, 130, 148]

export const WeatherScene: React.FC<{ value: number }> = ({ value }) => {
  const v = value / 100
  const theta = Math.PI * (1 - 0.5 * v)
  const sx = 84 + ARC_R * Math.cos(theta)
  const sy = HORIZON - ARC_R * Math.sin(theta)
  const sun = clamp((value - 18) / 62)
  const cover = 1 - clamp(value / 90)
  const rain = clamp((36 - value) / 36)
  const sky = sampleColor(SKY, value)
  const cloud = sampleColor(CLOUD, value)
  const ground = sampleColor(GROUND, value)

  return (
    <SceneFrame
      id="wx"
      tone={sky}
      accent={ground}
      strength={0.55 + 0.45 * v}
      defs={
        <radialGradient id="wx-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb627" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffb627" stopOpacity="0" />
        </radialGradient>
      }
    >
      <path d={`M${84 - ARC_R} ${HORIZON} A${ARC_R} ${ARC_R} 0 0 1 ${84 + ARC_R} ${HORIZON}`} fill="none" stroke="var(--ax-line)" strokeDasharray="1.5 3.5" />

      <g opacity={0.2 + 0.8 * sun}>
        <circle cx={sx} cy={sy} r="24" fill="url(#wx-halo)" className="sc-breathe sc-fb sc-oc" style={animVars({ '--d': '7s', '--s': 1.08 })} />
        <circle cx={sx} cy={sy} r="8" fill="#ffc233" stroke={ink('#e09a1f', 80)} strokeWidth="0.9" />
      </g>

      <rect x="0" y={HORIZON} width="168" height={185 - HORIZON} fill={`color-mix(in oklab, ${ground} 34%, transparent)`} />
      <line x1="0" y1={HORIZON} x2="168" y2={HORIZON} stroke="var(--ax-line)" />

      <g opacity={0.25 + 0.7 * cover}>
        {CLOUDS.map((c) => (
          <g key={c.y} transform={`translate(0 ${c.y})`}>
            <g className="sc-cloud" style={{ ...animVars({ '--d': `${c.t}s` }), animationDelay: `${c.d}s` }}>
              <rect x={-c.w / 2} y={-c.h / 2} width={c.w} height={c.h} rx={c.h / 2} fill={`color-mix(in oklab, ${cloud} 55%, var(--surface))`} stroke={`color-mix(in oklab, ${cloud} 60%, transparent)`} strokeWidth="0.8" />
            </g>
          </g>
        ))}
      </g>

      {rain > 0.03 && (
        <g stroke={ink('#7c93b0', 70)} strokeWidth="1" strokeLinecap="round" opacity={rain * 0.75}>
          {RAIN_X.map((x, i) => (
            <line key={x} x1={x} y1={52} x2={x - 2} y2={58} className="sc-fall" style={{ ...animVars({ '--d': '1.6s', '--h': '56px' }), animationDelay: `${(i % 4) * 0.4}s` }} />
          ))}
        </g>
      )}
    </SceneFrame>
  )
}
