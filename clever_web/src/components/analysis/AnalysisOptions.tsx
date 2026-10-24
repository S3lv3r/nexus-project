import React from 'react'
import type { AnalysisOptionTheme } from './AnalysisOptionCard'
import { StocksIllustration } from './StocksIllustration'
import { CryptoIllustration } from './CryptoIllustration'

export type AnalysisKind = 'acciones' | 'criptos'

export interface AnalysisOption {
  kind: AnalysisKind
  /** ruta registrada en App.tsx */
  path: string
  eyebrow: string
  title: string
  description: string
  theme: AnalysisOptionTheme
  Illustration: React.FC<{ active: boolean }>
  /** retraso de la animación de entrada, en ms */
  delay?: number
}

/**
 * Opciones que muestra la página de Análisis Técnico.
 * Para agregar una nueva (ej. "Forex"), añade un objeto aquí y su ilustración.
 */
export const ANALYSIS_OPTIONS: AnalysisOption[] = [
  {
    kind: 'acciones',
    path: '/analisis/acciones',
    eyebrow: 'Mercado bursátil',
    title: 'Análisis de acciones',
    description: 'Evalúa la evolución de empresas cotizadas mediante gráficos, tendencias y volumen.',
    delay: 0,
    theme: {
      surface: 'bg-gradient-to-br from-sky-50/80 via-white to-sky-100/50',
      blobA: 'bg-sky-200/50',
      blobB: 'bg-indigo-200/40',
      dots: 'text-sky-300/60',
      spotlight: 'rgba(125, 211, 252, 0.30)',
      border: 'border-sky-300 hover:border-sky-500',
      glow: 'hover:shadow-sky-200/70',
      chip: 'bg-white/70 text-sky-700 ring-sky-100',
      chipDot: 'bg-sky-400',
      cta: 'bg-white/80 text-sky-800 ring-sky-100 group-hover:bg-sky-50',
      ctaIcon: 'bg-sky-100 text-sky-700 group-hover:bg-sky-500 group-hover:text-white',
      ring: 'focus-visible:ring-sky-300',
      selected: 'ring-2 ring-sky-300',
    },
    Illustration: StocksIllustration,
  },
  {
    kind: 'criptos',
    path: '/analisis/criptos',
    eyebrow: 'Activos digitales',
    title: 'Análisis de criptos',
    description: 'Interpreta el comportamiento de criptomonedas y su estructura de mercado.',
    delay: 140,
    theme: {
      surface: 'bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-100/40',
      blobA: 'bg-violet-200/50',
      blobB: 'bg-amber-200/40',
      dots: 'text-violet-300/60',
      spotlight: 'rgba(196, 181, 253, 0.32)',
      border: 'border-violet-300 hover:border-violet-500',
      glow: 'hover:shadow-violet-200/70',
      chip: 'bg-white/70 text-violet-700 ring-violet-100',
      chipDot: 'bg-violet-400',
      cta: 'bg-white/80 text-violet-800 ring-violet-100 group-hover:bg-violet-50',
      ctaIcon: 'bg-violet-100 text-violet-700 group-hover:bg-violet-500 group-hover:text-white',
      ring: 'focus-visible:ring-violet-300',
      selected: 'ring-2 ring-violet-300',
    },
    Illustration: CryptoIllustration,
  },
]