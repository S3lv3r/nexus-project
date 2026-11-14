import React from 'react'

export const ink = (color: string, amount = 82) => `color-mix(in oklab, ${color} ${amount}%, var(--text))`
export const tint = (color: string, amount = 14) => `color-mix(in oklab, ${color} ${amount}%, var(--surface))`
export const shade = (color: string, amount: number) => `color-mix(in oklab, ${color}, black ${amount}%)`
export const light = (color: string, amount: number) => `color-mix(in oklab, ${color}, white ${amount}%)`

interface SceneFrameProps {
  id: string
  tone: string
  accent?: string
  strength?: number
  children: React.ReactNode
  defs?: React.ReactNode
}

export const SceneFrame: React.FC<SceneFrameProps> = ({ id, tone, accent, strength = 0.5, defs, children }) => (
  <svg viewBox="0 0 168 185" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-base`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor={tone} stopOpacity={0.24 + 0.18 * strength} />
        <stop offset="100%" stopColor={accent ?? tone} stopOpacity={0.1 + 0.12 * strength} />
      </linearGradient>
      <radialGradient id={`${id}-wash`} cx="50%" cy="40%" r="62%">
        <stop offset="0%" stopColor={tone} stopOpacity={0.2 + 0.25 * strength} />
        <stop offset="100%" stopColor={tone} stopOpacity="0" />
      </radialGradient>
      <pattern id={`${id}-dots`} width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="0.7" fill="var(--ax-line)" />
      </pattern>
      {defs}
    </defs>
    <rect width="168" height="185" fill={`url(#${id}-base)`} />
    <rect width="168" height="185" fill={`url(#${id}-dots)`} opacity="0.6" />
    <rect width="168" height="185" fill={`url(#${id}-wash)`} />
    {children}
  </svg>
)
