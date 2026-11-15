import React from 'react'
import { clamp, lerp, riskColor } from '../atlasData'
import { animVars } from '../animVars'
import { SceneFrame } from './SceneFrame'

const BANDS = [
  { cx: 30, rx: 64, d: 14, delay: 0 },
  { cx: 120, rx: 70, d: 18, delay: -5 },
  { cx: 80, rx: 60, d: 16, delay: -9 },
]

export const MountainScene: React.FC<{ value: number }> = ({ value }) => {
  const u = value / 100
  const fogTop = lerp(116, 50, u)
  const clear = clamp(1 - u * 1.3)

  return (
    <SceneFrame
      id="mt"
      tone={riskColor(value)}
      accent="#6274f0"
      strength={0.3 + 0.5 * u}
      defs={
        <>
          <linearGradient id="mt-fog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--surface)" stopOpacity="0" />
            <stop offset="30%" stopColor="var(--surface)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--surface)" stopOpacity="0.95" />
          </linearGradient>
          <filter id="mt-blur" x="-20%" y="-100%" width="140%" height="300%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </>
      }
    >
      <g transform="translate(0 -22)">
        <polygon points="0,170 0,100 24,80 44,96 74,66 98,92 124,74 150,94 168,82 168,170" fill="color-mix(in oklab, #8b9cf4 30%, transparent)" />
        <polygon points="0,170 0,114 26,96 50,112 108,64 134,98 150,88 168,108 168,170" fill="color-mix(in oklab, #6274f0 42%, transparent)" />
        <polyline points="0,114 26,96 50,112 108,64 134,98 150,88 168,108" fill="none" stroke="var(--ax-line)" strokeWidth="1" strokeLinejoin="round" />
        {clear > 0.03 && (
          <g opacity={clear}>
            <line x1="108" y1="64" x2="108" y2="48" stroke="var(--ax-soft)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M108 48 L117 51 L108 54 Z" fill="#16a96a" />
          </g>
        )}
        <polygon points="0,170 0,138 28,120 60,138 90,112 128,136 168,122 168,170" fill="color-mix(in oklab, #4453c9 54%, transparent)" />
      </g>

      <rect x="0" y={fogTop} width="168" height={185 - fogTop} fill="url(#mt-fog)" opacity={0.25 + 0.75 * u} />
      <g fill="var(--surface)" filter="url(#mt-blur)" opacity={0.2 + 0.7 * u}>
        {[0, 1].map((layer) =>
          BANDS.map((b) => (
            <g key={layer + '-' + b.cx} transform={`translate(0 ${fogTop + 6 + layer * 18})`}>
              <ellipse
                cx={(b.cx + layer * 40) % 180}
                cy="0"
                rx={b.rx}
                ry="7"
                className="sc-haze"
                style={{ ...animVars({ '--d': `${b.d + layer * 4}s` }), animationDelay: `${b.delay - layer * 3}s` }}
              />
            </g>
          )),
        )}
      </g>
    </SceneFrame>
  )
}
