import React from 'react'

interface IllustrationProps {
  active: boolean
}

const BASE = 128
/** pilas de monedas que crecen de izquierda a derecha */
const STACKS = [2, 3, 4, 6, 8]
const CX = STACKS.map((_, i) => 46 + i * 34)
const COIN_H = 9

const vars = (v: Record<string, string | number>) => v as unknown as React.CSSProperties

const TREND = `M${CX[0]},${BASE - STACKS[0] * COIN_H - 16} C${CX[1]},${BASE - STACKS[1] * COIN_H - 18} ${CX[2]},${BASE - STACKS[2] * COIN_H - 18} ${CX[3]},${BASE - STACKS[3] * COIN_H - 18} S${CX[4] - 10},${BASE - STACKS[4] * COIN_H - 22} ${CX[4]},${BASE - STACKS[4] * COIN_H - 20}`

export const FinanceIllustration: React.FC<IllustrationProps> = () => (
  <svg viewBox="0 0 240 160" className="h-auto w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ao-fin-coin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d1fae5" />
        <stop offset="100%" stopColor="#6ee7b7" />
      </linearGradient>
      <linearGradient id="ao-fin-coin-hi" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
      <linearGradient id="ao-fin-line" gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="200" y2="0">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>

    <rect className="ao-panel" x="6" y="6" width="228" height="148" rx="20" fill="#fff" fillOpacity="0.6" stroke="#d1fae5" />

    <g stroke="#a7f3d0" strokeOpacity="0.7" strokeDasharray="3 5">
      <line x1="20" x2="220" y1="56" y2="56" />
      <line x1="20" x2="220" y1="92" y2="92" />
    </g>
    <line x1="20" x2="220" y1={BASE} y2={BASE} stroke="#d1fae5" />

    {STACKS.map((n, i) => (
      <g key={i} className="ao-bar ao-origin-b" style={vars({ '--i': i })}>
        {Array.from({ length: n }, (_, k) => (
          <rect
            key={k}
            x={CX[i] - 12}
            y={BASE - (k + 1) * COIN_H}
            width="24"
            height={COIN_H - 1.5}
            rx="3.5"
            fill={i === STACKS.length - 1 ? 'url(#ao-fin-coin-hi)' : 'url(#ao-fin-coin)'}
            stroke="#10b981"
            strokeOpacity="0.25"
          />
        ))}
      </g>
    ))}

    <path className="ao-line" d={TREND} pathLength={1} fill="none" stroke="url(#ao-fin-line)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1" />

    {/* brote: el dinero que crece */}
    <g className="ao-pop ao-origin-c">
      <circle cx="206" cy="34" r="14" fill="#ecfdf5" stroke="#6ee7b7" />
      <path d="M206 42v-9" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M206 35c0-4 3-6 7-6 0 4-3 6-7 6zM206 37c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" fill="#34d399" />
    </g>

    <g fill="none" stroke="#6ee7b7" strokeWidth="1.8" strokeLinecap="round">
      <path className="ao-twinkle ao-origin-c" style={vars({ '--i': 0 })} d="M28 30v8M24 34h8" />
      <path className="ao-twinkle ao-origin-c" style={vars({ '--i': 1 })} d="M112 22v6M109 25h6" />
      <path className="ao-twinkle ao-origin-c" style={vars({ '--i': 2 })} d="M218 74v6M215 77h6" />
    </g>
  </svg>
)
