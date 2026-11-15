import React from 'react'
import type { IndicatorIconKey } from './IndicatorData'

/** Base común: iconos de trazo fino que heredan el color del texto. */
const Svg: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = 'h-5 w-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const INDICATOR_ICONS: Record<IndicatorIconKey, React.FC<{ className?: string }>> = {
  // barras iguales bajo una línea: todos los periodos pesan lo mismo
  sma: (p) => (
    <Svg {...p}>
      <path d="M5 19v-8M10 19v-8M15 19v-8M20 19v-8" />
      <path d="M3 7h18" strokeDasharray="2 3" />
    </Svg>
  ),
  // curva exponencial
  ema: (p) => (
    <Svg {...p}>
      <path d="M3 19c6 0 9-3 11-8s3-6 7-6" />
      <circle cx="21" cy="5" r="1" />
    </Svg>
  ),
  // onda suave
  smma: (p) => (
    <Svg {...p}>
      <path d="M3 12c3-5 6-5 9 0s6 5 9 0" />
    </Svg>
  ),
  // barras que crecen en escala lineal
  lwma: (p) => (
    <Svg {...p}>
      <path d="M6 19v-3M11 19v-6M16 19V7" />
      <path d="M3 19h18" />
    </Svg>
  ),
  // dos curvas
  dema: (p) => (
    <Svg {...p}>
      <path d="M3 18c6 0 9-3 11-8s3-5 7-5" />
      <path d="M3 13c5 0 8-2 10-5s4-3 8-3" opacity="0.55" />
    </Svg>
  ),
  // tres curvas
  tema: (p) => (
    <Svg {...p}>
      <path d="M3 19c6 0 9-3 11-8s3-6 7-6" />
      <path d="M3 15c5 0 8-2 10-5s4-4 8-4" opacity="0.65" />
      <path d="M3 11c5 0 8-2 10-4s4-3 8-3" opacity="0.4" />
    </Svg>
  ),
  // cinta: la nube
  ichimoku: (p) => (
    <Svg {...p}>
      <path d="M3 14l6-4 6 3 6-4v5l-6 4-6-3-6 4z" />
      <path d="M3 6l6 2 6-3 6 2" opacity="0.55" />
    </Svg>
  ),
  // dos líneas que se cruzan
  macd: (p) => (
    <Svg {...p}>
      <path d="M3 8c5 0 8 8 18 8" />
      <path d="M3 16c5 0 8-8 18-8" />
    </Svg>
  ),
  // oscilador entre dos límites
  rsi: (p) => (
    <Svg {...p}>
      <path d="M3 6h18M3 18h18" strokeDasharray="2 3" opacity="0.6" />
      <path d="M3 12c2-6 4-6 6 0s4 6 6 0 3-2 6-2" />
    </Svg>
  ),
  // tres líneas
  kdj: (p) => (
    <Svg {...p}>
      <path d="M3 8c4-3 6 3 10 0s5-2 8-1" />
      <path d="M3 12c4-3 6 3 10 0s5-2 8-1" opacity="0.65" />
      <path d="M3 16c4-3 6 3 10 0s5-2 8-1" opacity="0.4" />
    </Svg>
  ),
  // bandas alrededor de una línea
  bollinger: (p) => (
    <Svg {...p}>
      <path d="M3 7c6-3 12 0 18-3" />
      <path d="M3 17c6 3 12 0 18 3" />
      <path d="M3 12h18" strokeDasharray="2 3" />
    </Svg>
  ),
  // medidor
  adx: (p) => (
    <Svg {...p}>
      <path d="M4 17a8 8 0 0 1 16 0" />
      <path d="M12 17l4-5" />
      <circle cx="12" cy="17" r="1.2" />
    </Svg>
  ),
  vix: (p) => (
    <Svg {...p}>
      <path d="M3 19h18" opacity="0.5" />
      <path d="M3 15l4-1 3 1 3-9 2 6 3-2 3 1" />
    </Svg>
  ),
  // zigzag de ondas
  elliott: (p) => (
    <Svg {...p}>
      <path d="M3 18l4-9 3 4 5-11 3 7 4-3" />
    </Svg>
  ),
  // niveles y diagonal
  fibonacci: (p) => (
    <Svg {...p}>
      <path d="M4 6h16M4 10h16M4 14h16M4 18h16" opacity="0.5" />
      <path d="M5 19L19 5" />
    </Svg>
  ),
}
