import React from 'react'
import { clamp, lerp, sampleColor } from '../atlasData'
import { animVars } from '../animVars'

const CRACKS = [
  { d: 'M100 60 L95 90 L108 100 L98 140', at: 25, w: 2.4 },
  { d: 'M75 70 L90 95 L70 120', at: 45, w: 1.9 },
  { d: 'M125 75 L112 100 L130 125', at: 65, w: 1.9 },
  { d: 'M100 60 L118 80', at: 85, w: 1.6 },
]
const SHIELD = 'M100 25 L155 45 V100 C155 135 130 160 100 175 C70 160 45 135 45 100 V45 Z'
const TOP: Array<[number, string]> = [[0, '#3d8bff'], [50, '#5b55d6'], [100, '#e5383b']]
const BOTTOM: Array<[number, string]> = [[0, '#1d4fd1'], [50, '#2c2580'], [100, '#7d1420']]

/**
 * Escudo de riesgo: firme y brillante con riesgo bajo; con riesgo alto se agrieta, vibra y emite ondas de alarma.
 * `value` ya debe venir suavizado (lo hace PressureCard).
 */
export const RiskShield: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  const danger = clamp((value - 55) / 45)
  const alarm = clamp((value - 50) / 50)
  const calm = 1 - danger

  return (
    <svg viewBox="30 14 140 176" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="atlas-shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sampleColor(TOP, value)} />
          <stop offset="100%" stopColor={sampleColor(BOTTOM, value)} />
        </linearGradient>
        <radialGradient id="atlas-shield-sheen" cx="35%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="atlas-shield-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={danger > 0.05 ? '#f04848' : '#3fb4ff'} stopOpacity="0.6" />
          <stop offset="100%" stopColor={danger > 0.05 ? '#f04848' : '#3fb4ff'} stopOpacity="0" />
        </radialGradient>
        <clipPath id="atlas-shield-clip">
          <path d={SHIELD} />
        </clipPath>
      </defs>

      {/* aura */}
      <ellipse cx="100" cy="100" rx="64" ry="78" fill="url(#atlas-shield-aura)" opacity={0.2 + 0.4 * Math.max(danger, 0.35 * calm)} className="sc-pulse sc-fb sc-oc" style={animVars({ '--d': `${lerp(3.4, 1.1, danger)}s`, '--s': 1.12 })} />

      {/* ondas de alarma */}
      {alarm > 0.1 && (
        <g fill="none" stroke="#f04848" strokeWidth="3" opacity={alarm}>
          {[0, 0.7].map((d) => (
            <path key={d} d={SHIELD} className="sc-alarm sc-fb sc-oc" style={{ ...animVars({ '--d': `${lerp(2.2, 1.1, alarm)}s` }), animationDelay: `${d}s` }} />
          ))}
        </g>
      )}

      <g className={value > 70 ? 'sc-shiver' : ''}>
        <path d={SHIELD} fill="url(#atlas-shield)" stroke="#99a4b3" strokeWidth="3.4" strokeLinejoin="round" />
        <path d={SHIELD} fill="url(#atlas-shield-sheen)" />
        {/* borde interior */}
        <path d={SHIELD} fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.6" transform="translate(100 100) scale(.84) translate(-100 -100)" />

        {/* emblema */}
        <g className="sc-breathe sc-fb sc-oc" style={animVars({ '--d': `${lerp(3.4, 1.2, danger)}s` })}>
          <circle cx="100" cy="98" r="23" fill="#c9a23f" fillOpacity="0.1" />
          <text x="100" y="116" textAnchor="middle" fontSize="50" fontWeight="800" fill="#ffd34d" stroke="#7a5a1a" strokeWidth="1.1" paintOrder="stroke">
            ₿
          </text>
        </g>

        {/* destello que cruza el escudo (con riesgo bajo) */}
        <g clipPath="url(#atlas-shield-clip)" opacity={0.2 + 0.8 * calm}>
          <polygon points="46,10 66,10 40,190 20,190" fill="#fff" opacity="0.16" className="sc-shine" />
        </g>

        {/* grietas progresivas */}
        {CRACKS.map((c) => {
          const progress = clamp((value - c.at) / 20)
          return (
            <path
              key={c.d}
              d={c.d}
              pathLength={100}
              fill="none"
              stroke="#ff8a8a"
              strokeWidth={c.w}
              strokeLinecap="round"
              strokeDasharray={100}
              strokeDashoffset={100 * (1 - progress)}
              opacity={progress}
            />
          )
        })}
      </g>
    </svg>
  )
}