import React from 'react'
import { animVars } from '../animVars'
import { clamp, riskColor } from '../atlasData'

const SHIELD = 'M100 25 L155 45 V100 C155 135 130 160 100 175 C70 160 45 135 45 100 V45 Z'

/**
 * Escudo de riesgo: se llena de abajo arriba según el riesgo (y cambia de verde a rojo). Con riesgo alto, el contorno late
 * suavemente y aparece una marca de atención. `value` ya debe venir suavizado (lo hace PressureCard).
 */
export const RiskShield: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  const color = riskColor(value)
  const y = 175 - clamp(value / 100) * 150
  const high = value >= 67

  return (
    <svg viewBox="30 14 140 176" className={className} aria-hidden="true">
      <defs>
        <clipPath id="atlas-shield-clip">
          <path d={SHIELD} />
        </clipPath>
        <linearGradient id="atlas-shield-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <path d={SHIELD} fill="#f8fafc" />
      <g clipPath="url(#atlas-shield-clip)">
        <rect x="40" y={y} width="120" height={Math.max(0, 190 - y)} fill="url(#atlas-shield-fill)" />
        <g className="sc-bob" style={animVars({ '--d': '3s' })}>
          <line x1="40" x2="160" y1={y} y2={y} stroke={color} strokeWidth="2.6" />
        </g>
        {/* umbrales: riesgo bajo, moderado y alto */}
        {[33, 66].map((p) => (
          <line key={p} x1="40" x2="160" y1={175 - p * 1.5} y2={175 - p * 1.5} stroke="#64748b" strokeOpacity="0.4" strokeDasharray="3 4" strokeWidth="1.2" />
        ))}
      </g>
      <path d={SHIELD} fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round" className={high ? 'sc-pulse sc-fb sc-oc' : undefined} />

      {high && (
        <text x="100" y="118" textAnchor="middle" fontSize="48" fontWeight="700" fill="#fff" fillOpacity="0.92" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
          !
        </text>
      )}
    </svg>
  )
}