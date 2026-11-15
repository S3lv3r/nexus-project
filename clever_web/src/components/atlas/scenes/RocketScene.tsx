import React, { useId } from 'react'
import { goodColor, lerp } from '../atlasData'
import { animVars } from '../animVars'
import { SceneFrame, ink, light, shade } from './SceneFrame'

const STREAKS = [
  { x: 16, d: 0, k: 1 }, { x: 32, d: -1.3, k: 0.7 }, { x: 46, d: -2.2, k: 1.2 }, { x: 60, d: -0.5, k: 0.8 },
  { x: 108, d: -1.8, k: 1 }, { x: 122, d: -2.9, k: 0.7 }, { x: 138, d: -0.9, k: 1.2 }, { x: 152, d: -2.4, k: 0.85 },
]
const STARS = [
  [22, 40], [48, 58], [30, 92], [140, 36], [126, 70], [150, 100], [70, 30], [100, 112],
]

export const RocketScene: React.FC<{ value: number }> = ({ value }) => {
  const t = value / 100
  const color = goodColor(value)
  const uid = `rk${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const plume = 8 + 30 * t
  const tilt = lerp(16, 0, t)
  const streak = 4 + 24 * t
  const fallDur = lerp(6.5, 1.3, t)

  return (
    <SceneFrame
      id={uid}
      tone={color}
      accent="#6d5cff"
      strength={0.4 + 0.6 * t}
      defs={
        <>
          <linearGradient id={`${uid}-plume`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff7d6" />
            <stop offset="40%" stopColor="#ffb21e" />
            <stop offset="100%" stopColor="#ff6a13" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${uid}-glow`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffb21e" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ff6a13" stopOpacity="0" />
          </radialGradient>
        </>
      }
    >
      <g fill="var(--ax-soft)">
        {STARS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" opacity="0.6" />
        ))}
      </g>
      <g stroke={ink(color, 55)} strokeOpacity="0.45" strokeWidth="1" strokeLinecap="round">
        {STREAKS.map((s) => (
          <line
            key={s.x}
            x1={s.x}
            y1={0}
            x2={s.x}
            y2={streak * s.k}
            className="sc-fall"
            style={{ ...animVars({ '--d': `${fallDur * (0.8 + s.k * 0.3)}s`, '--h': '200px' }), animationDelay: `${s.d}s` }}
          />
        ))}
      </g>

      <g transform={`translate(84 82) rotate(${tilt}) scale(1.1)`}>
        <g className="sc-hover" style={animVars({ '--d': `${lerp(5, 2.4, t)}s` })}>
          <ellipse cx="0" cy={26 + plume * 0.45} rx={7 + 5 * t} ry={plume * 0.7} fill={`url(#${uid}-glow)`} />
          <path
            d={`M-5 25 Q0 ${25 + plume} 5 25 Z`}
            fill={`url(#${uid}-plume)`}
            className="sc-thrust sc-fb"
            style={{ transformOrigin: '50% 0%', ...animVars({ '--d': `${lerp(1.6, 0.7, t)}s`, '--s': 1.12 }) }}
          />
          <path d={`M-2.6 25 Q0 ${25 + plume * 0.55} 2.6 25 Z`} fill="#fffbeb" opacity="0.9" />

          <polygon points="-8,6 -18,23 -8,18" fill={color} />
          <polygon points="8,6 18,23 8,18" fill={shade(color, 28)} />
          <polygon points="-6,20 6,20 4.5,25 -4.5,25" fill="#5b6576" />

          <polygon points="-9,-24 0,-24 0,20 -8,20" fill="#eef1f6" />
          <polygon points="0,-24 9,-24 8,20 0,20" fill="#c3ccd8" />
          <polygon points="0,-41 -9,-24 0,-24" fill={light(color, 25)} />
          <polygon points="0,-41 9,-24 0,-24" fill={shade(color, 18)} />
          <polygon points="-8.6,8 8.6,8 8.4,11 -8.4,11" fill={color} />

          <circle cx="0" cy="-9" r="4.6" fill="#1f3550" stroke="#94a3b8" strokeWidth="1.4" />
          <path d="M-2.4 -10.6 A2.8 2.8 0 0 1 0.6 -11.8" fill="none" stroke="#bfe3ff" strokeWidth="1" strokeLinecap="round" />
        </g>
      </g>
    </SceneFrame>
  )
}
