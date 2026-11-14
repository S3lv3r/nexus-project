import React, { useId } from 'react'
import { lerp } from '../atlasData'
import { animVars } from '../animVars'
import { light, shade } from './SceneFrame'

interface MascotProps {
  power: number
  className?: string
}

export const BULL_TONE = '#13a865'
export const BEAR_TONE = '#e5485e'

const Emblem: React.FC<{ id: string; tone: string; power: number; push: string; children: React.ReactNode }> = ({ id, tone, power, push, children }) => {
  const dominant = power > 0.5
  const uid = `${id}${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-disc`} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor={light(tone, 55)} stopOpacity="0.55" />
          <stop offset="70%" stopColor={tone} stopOpacity="0.16" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={light(tone, 35)} />
          <stop offset="100%" stopColor={shade(tone, 25)} />
        </linearGradient>
      </defs>
      <circle cx="60" cy="58" r="52" fill={`url(#${uid}-disc)`} opacity={0.35 + 0.65 * power} />
      <circle
        cx="60"
        cy="58"
        r="47"
        fill="none"
        stroke={`url(#${uid}-ring)`}
        strokeWidth="1.6"
        strokeDasharray={dominant ? undefined : '2 5'}
        opacity={0.25 + 0.6 * power}
      />
      {dominant && (
        <circle cx="60" cy="58" r="47" fill="none" stroke={tone} strokeWidth="1.4" className="sc-ring sc-fb sc-oc" style={animVars({ '--d': `${lerp(4, 2.4, power)}s` })} />
      )}
      <g style={{ transform: `scale(${lerp(0.84, 1.02, power)})`, transformOrigin: '60px 104px', opacity: 0.5 + 0.5 * power, filter: dominant ? undefined : 'saturate(.55)' }}>
        <g className={dominant ? 'sc-push' : ''} style={animVars({ '--d': `${lerp(4.2, 2.4, power)}s`, '--px': push })}>
          {children}
        </g>
      </g>
    </>
  )
}

export const BullMascot: React.FC<MascotProps> = ({ power, className = '' }) => {
  const t = BULL_TONE
  const hi = light(t, 38)
  const mid = t
  const lo = shade(t, 28)
  const deep = shade(t, 52)
  const horn = '#efe3c6'
  const hornLo = '#c9b48a'
  return (
    <svg viewBox="0 0 120 112" className={className} aria-hidden="true">
      <Emblem id="bl" tone={t} power={power} push="-3px">
        <polygon points="42,36 24,32 13,16 18,14 30,24 46,30" fill={horn} />
        <polygon points="42,36 30,24 18,14 13,16 24,32" fill={hornLo} opacity="0.55" />
        <polygon points="78,36 96,32 107,16 102,14 90,24 74,30" fill={hornLo} />
        <polygon points="78,36 90,24 102,14 107,16 96,32" fill={horn} opacity="0.6" />
        <polygon points="40,44 20,48 32,58 42,54" fill={lo} />
        <polygon points="80,44 100,48 88,58 78,54" fill={deep} />
        <polygon points="42,32 60,27 78,32 80,48 60,53 40,48" fill={mid} />
        <polygon points="42,32 60,27 60,53 40,48" fill={hi} opacity="0.55" />
        <polygon points="40,48 60,53 52,82 42,70" fill={hi} />
        <polygon points="80,48 60,53 68,82 78,70" fill={lo} />
        <polygon points="60,53 52,82 60,90 68,82" fill={mid} />
        <polygon points="46,78 74,78 78,90 60,99 42,90" fill={light(t, 62)} />
        <polygon points="60,78 74,78 78,90 60,99" fill={light(t, 45)} />
        <g fill={deep}>
          <ellipse cx="53" cy="88" rx="2.6" ry="1.9" />
          <ellipse cx="67" cy="88" rx="2.6" ry="1.9" />
          <polygon points="44,58 54,56 53,61 46,61" />
          <polygon points="76,58 66,56 67,61 74,61" />
        </g>
        <path d="M54 96 Q60 99 66 96" fill="none" stroke="#d6b15a" strokeWidth="2" strokeLinecap="round" />
      </Emblem>
    </svg>
  )
}

export const BearMascot: React.FC<MascotProps> = ({ power, className = '' }) => {
  const t = BEAR_TONE
  const hi = light(t, 38)
  const mid = t
  const lo = shade(t, 28)
  const deep = shade(t, 55)
  return (
    <svg viewBox="0 0 120 112" className={className} aria-hidden="true">
      <Emblem id="br" tone={t} power={power} push="3px">
        <polygon points="27,36 31,22 44,23 48,35" fill={hi} />
        <polygon points="93,36 89,22 76,23 72,35" fill={lo} />
        <polygon points="32,32 34,26 41,27 43,33" fill={deep} opacity="0.55" />
        <polygon points="88,32 86,26 79,27 77,33" fill={deep} opacity="0.7" />
        <polygon points="46,32 60,29 74,32 79,48 60,52 41,48" fill={mid} />
        <polygon points="46,32 60,29 60,52 41,48" fill={hi} opacity="0.5" />
        <polygon points="41,48 34,46 30,64 40,82 50,72 60,52" fill={hi} />
        <polygon points="79,48 86,46 90,64 80,82 70,72 60,52" fill={lo} />
        <polygon points="40,82 60,92 80,82 70,72 60,52 50,72" fill={mid} />
        <polygon points="47,66 73,66 79,80 60,90 41,80" fill={light(t, 62)} />
        <polygon points="60,66 73,66 79,80 60,90" fill={light(t, 46)} />
        <polygon points="53,66 67,66 60,74" fill={deep} />
        <path d="M60 74 V79 M60 79 L54 83 M60 79 L66 83" fill="none" stroke={deep} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <g fill={deep}>
          <polygon points="45,56 53,55 52,60 46,60" />
          <polygon points="75,56 67,55 68,60 74,60" />
        </g>
      </Emblem>
    </svg>
  )
}
