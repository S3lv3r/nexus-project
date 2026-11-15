import React from 'react'
import { MAX_SUPPLY, clamp, wavePath } from '../atlasData'
import { animVars } from '../animVars'
import { SceneFrame, ink } from './SceneFrame'

const TOP = 46
const BOTTOM = 130
const TICKS = [0, 5, 10, 15, MAX_SUPPLY]
const GOLD = '#e8ad1c'

const levelY = (supply: number) => BOTTOM - clamp(supply / MAX_SUPPLY) * (BOTTOM - TOP)

export const GoldTankScene: React.FC<{ value: number }> = ({ value }) => {
  const level = levelY(value)
  const filled = clamp(value / MAX_SUPPLY)

  return (
    <SceneFrame
      id="gt"
      tone={GOLD}
      accent="#f59e0b"
      strength={0.35 + 0.5 * filled}
      defs={
        <>
          <linearGradient id="gt-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd666" stopOpacity="1" />
            <stop offset="100%" stopColor="#c98612" stopOpacity="0.95" />
          </linearGradient>
          <clipPath id="gt-clip">
            <rect x="40" y={TOP} width="88" height={BOTTOM - TOP} rx="8" />
          </clipPath>
        </>
      }
    >
      <g stroke="var(--ax-line)" strokeLinecap="round">
        {TICKS.map((k) => {
          const y = levelY(k)
          return <line key={k} x1="26" y1={y} x2={k % 10 === 0 || k === MAX_SUPPLY ? 33 : 30} y2={y} />
        })}
      </g>
      <g fontSize="7.5" fontWeight="600" fill="var(--ax-soft)" textAnchor="end">
        {TICKS.map((k) => (
          <text key={k} x="23" y={levelY(k) + 2.6}>
            {k === MAX_SUPPLY ? `${k}M` : k}
          </text>
        ))}
      </g>

      <rect x="36" y={TOP - 4} width="96" height={BOTTOM - TOP + 8} rx="12" fill="var(--ax-dial)" stroke="var(--ax-line)" strokeWidth="1.2" />
      <line x1="40" y1={TOP} x2="128" y2={TOP} stroke={ink(GOLD, 70)} strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />

      <g clipPath="url(#gt-clip)">
        <path d={wavePath(level, 1.4, -80, 260, 150)} fill="url(#gt-liquid)" className="sc-wave" style={animVars({ '--d': '10s' })} />
        <path
          d={wavePath(level, 1.4, -80, 260, 160).replace(/ L[^L]*L[^Z]*Z$/, '')}
          fill="none"
          stroke="#f3e3a6"
          strokeWidth="1"
          opacity="0.7"
          className="sc-wave"
          style={animVars({ '--d': '10s' })}
        />
      </g>

      <text x="84" y="98" textAnchor="middle" fontSize="22" fontWeight="600" fill="color-mix(in oklab, var(--text) 16%, transparent)">
        ₿
      </text>
    </SceneFrame>
  )
}
