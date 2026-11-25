import React from 'react'
import type { AnalysisOptionTheme } from './AnalysisOptionCard'
import { StocksIllustration } from './StocksIllustration'
import { CryptoIllustration } from './CryptoIllustration'
import { FinanceIllustration } from './FinanceIllustration'

export type AnalysisKind = 'acciones' | 'criptos' | 'finanzas'

export interface AnalysisOption {
  kind: AnalysisKind
  path: string
  eyebrow: string
  title: string
  description: string
  theme: AnalysisOptionTheme
  Illustration: React.FC<{ active: boolean }>
  delay?: number
}

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
      border: 'border-[color-mix(in_srgb,#0ea5e9_22%,var(--border))] hover:border-[color-mix(in_srgb,#0ea5e9_45%,var(--border))]',
      glow: 'hover:shadow-sky-500/25',
      chip: 'bg-white/70 text-sky-700 ring-sky-100',
      chipDot: 'bg-sky-400',
      cta: 'bg-white/80 text-sky-800 ring-sky-100 group-hover:bg-sky-50',
      ctaIcon: 'bg-[color-mix(in_srgb,#0ea5e9_16%,var(--surface))] text-[color-mix(in_srgb,#0ea5e9_75%,var(--text))] group-hover:bg-sky-500 group-hover:text-white',
      ring: 'focus-visible:ring-sky-300',
      selected: 'ring-2 ring-sky-300',
      tint: '#0ea5e9',
    },
    Illustration: StocksIllustration,
  },
  {
    kind: 'criptos',
    path: '/analisis/criptos',
    eyebrow: 'Activos digitales',
    title: 'Análisis de Blockchain',
    description: 'Interpreta el comportamiento de criptomonedas y su estructura.',
    delay: 140,
    theme: {
      surface: 'bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-100/40',
      blobA: 'bg-violet-200/50',
      blobB: 'bg-amber-200/40',
      dots: 'text-violet-300/60',
      spotlight: 'rgba(196, 181, 253, 0.32)',
      border: 'border-[color-mix(in_srgb,#8b5cf6_22%,var(--border))] hover:border-[color-mix(in_srgb,#8b5cf6_45%,var(--border))]',
      glow: 'hover:shadow-violet-500/25',
      chip: 'bg-white/70 text-violet-700 ring-violet-100',
      chipDot: 'bg-violet-400',
      cta: 'bg-white/80 text-violet-800 ring-violet-100 group-hover:bg-violet-50',
      ctaIcon: 'bg-[color-mix(in_srgb,#8b5cf6_16%,var(--surface))] text-[color-mix(in_srgb,#8b5cf6_75%,var(--text))] group-hover:bg-violet-500 group-hover:text-white',
      ring: 'focus-visible:ring-violet-300',
      selected: 'ring-2 ring-violet-300',
      tint: '#8b5cf6',
    },
    Illustration: CryptoIllustration,
  },
  {
    kind: 'finanzas',
    path: '/analisis/finanzas-personales',
    eyebrow: 'Educación financiera',
    title: 'Finanzas personales',
    description: 'Aprende a administrar, proteger y hacer crecer tu dinero.',
    delay: 280,
    theme: {
      surface: 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-100/40',
      blobA: 'bg-emerald-200/50',
      blobB: 'bg-teal-200/40',
      dots: 'text-emerald-300/60',
      spotlight: 'rgba(110, 231, 183, 0.30)',
      border: 'border-[color-mix(in_srgb,#10b981_22%,var(--border))] hover:border-[color-mix(in_srgb,#10b981_45%,var(--border))]',
      glow: 'hover:shadow-emerald-500/25',
      chip: 'bg-white/70 text-emerald-700 ring-emerald-100',
      chipDot: 'bg-emerald-400',
      cta: 'bg-white/80 text-emerald-800 ring-emerald-100 group-hover:bg-emerald-50',
      ctaIcon: 'bg-[color-mix(in_srgb,#10b981_16%,var(--surface))] text-[color-mix(in_srgb,#10b981_75%,var(--text))] group-hover:bg-emerald-500 group-hover:text-white',
      ring: 'focus-visible:ring-emerald-300',
      selected: 'ring-2 ring-emerald-300',
      tint: '#10b981',
    },
    Illustration: FinanceIllustration,
  },
]