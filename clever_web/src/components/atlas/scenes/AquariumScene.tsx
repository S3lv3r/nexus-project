import React from 'react'
import { lerp, wavePath } from '../atlasData'
import { animVars } from '../animVars'
import { SceneFrame, ink } from './SceneFrame'

const WATER = '#1f8fe6'
const SCALE = Array.from({ length: 7 }, (_, i) => 44 + i * 14)
const MOTES = [
  { x: 40, d: 0, t: 6 },
  { x: 72, d: -2.4, t: 7.2 },
  { x: 104, d: -1.1, t: 6.6 },
  { x: 134, d: -3.6, t: 7.8 },
]

export const AquariumScene: React.FC<{ value: number }> = ({ value }) => {
  const level = 128 - (value / 100) * 84
  const unstable = (100 - value) / 100
  const amp = lerp(1.1, 5, unstable)
  const dur = lerp(9, 2.6, unstable)

  return (
    <SceneFrame
      id="aq"
      tone={WATER}
      accent="#14c4b0"
      strength={0.3 + 0.4 * (value / 100)}
      defs={
        <>
          <linearGradient id="aq-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2ec5f5" stopOpacity="0.42" />
            <stop offset="100%" stopColor={WATER} stopOpacity="0.74" />
          </linearGradient>
          <clipPath id="aq-clip">
            <rect width="168" height="185" />
          </clipPath>
        </>
      }
    >
      <g stroke="var(--ax-line)" strokeLinecap="round">
        {SCALE.map((y, i) => (
          <line key={y} x1="10" y1={y} x2={i % 2 === 0 ? 18 : 15} y2={y} />
        ))}
      </g>

      <g clipPath="url(#aq-clip)">
        <path d={wavePath(level, amp * 1.1, -80, 260, 190)} fill="url(#aq-water)" className="sc-wave" style={animVars({ '--d': `${dur * 1.4}s` })} />
        <path d={wavePath(level + 2, amp * 0.8, -80, 260, 190)} fill="#14c4b0" opacity="0.2" className="sc-wave" style={animVars({ '--d': `${dur}s` })} />
        <path
          d={wavePath(level, amp * 1.1, -80, 260, 200).replace(/ L[^L]*L[^Z]*Z$/, '')}
          fill="none"
          stroke={ink(WATER, 75)}
          strokeWidth="1.2"
          opacity="0.85"
          className="sc-wave"
          style={animVars({ '--d': `${dur * 1.4}s` })}
        />
        <g fill={ink(WATER, 65)}>
          {MOTES.map((m) => (
            <circle
              key={m.x}
              cx={m.x}
              cy="128"
              r="1.1"
              className="sc-rise"
              style={{ ...animVars({ '--d': `${m.t}s`, '--h': `${-Math.max(8, 124 - level)}px` }), animationDelay: `${m.d}s` }}
            />
          ))}
        </g>
      </g>

      <path d={`M158 ${level} l6 -3.5 v7 z`} fill={ink(WATER)} />
    </SceneFrame>
  )
}
