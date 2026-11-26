import type { UnlockRule } from '../types/profileCustomization'

export interface ThemePreview {
  background: string
  surface: string
  text: string
  muted: string
  accent: string
  border: string
  font: string
  pattern: string
}

export interface ThemeOption {
  id: string
  name: string
  desc: string
  accent: string | null
  group: 'bill' | 'market' | 'worlds'
  unlock?: UnlockRule
  preview: ThemePreview
}

export const DEFAULT_ACCENT = '#0284c7'

export const THEME_GROUPS: { id: ThemeOption['group']; label: string; description: string }[] = [
  { id: 'bill', label: 'Papel moneda', description: 'La identidad de Clever, de día y de noche' },
  { id: 'market', label: 'Mercado', description: 'Pantallas de bolsa y bóvedas de banco' },
  { id: 'worlds', label: 'Mundos de color', description: 'Atmósferas con textura propia' },
]

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'light',
    name: 'Billete',
    desc: 'Papel claro con guilloché azul',
    accent: null,
    group: 'bill',
    preview: {
      background: '#f3f6fa',
      surface: '#ffffff',
      text: '#0d1b2a',
      muted: '#56677c',
      accent: '#0284c7',
      border: '#dbe3ec',
      font: '"Archivo", sans-serif',
      pattern: 'repeating-radial-gradient(circle at 110% -10%, transparent 0 9px, rgba(2,132,199,.14) 9px 10px)',
    },
  },
  {
    id: 'dark',
    name: 'Billete nocturno',
    desc: 'Tinta azul marino y trazos de luz',
    accent: null,
    group: 'bill',
    preview: {
      background: '#070e1a',
      surface: '#0f1b2f',
      text: '#e8f0fb',
      muted: '#93a6c2',
      accent: '#5cb8ff',
      border: '#1f3150',
      font: '"Archivo", sans-serif',
      pattern: 'repeating-radial-gradient(circle at 110% -10%, transparent 0 9px, rgba(92,184,255,.18) 9px 10px)',
    },
  },
  {
    id: 'minimal',
    name: 'Grafito',
    desc: 'Monocromo condensado y preciso',
    accent: null,
    group: 'bill',
    preview: {
      background: '#f4f4f5',
      surface: '#ffffff',
      text: '#09090b',
      muted: '#52525b',
      accent: '#09090b',
      border: '#d4d4d8',
      font: '"Archivo", sans-serif',
      pattern: 'none',
    },
  },
  {
    id: 'terminal',
    name: 'Terminal de bolsa',
    desc: 'Negro, ámbar y verde fósforo',
    accent: null,
    group: 'market',
    preview: {
      background: '#050706',
      surface: '#0c100f',
      text: '#e6f2ea',
      muted: '#8fa89a',
      accent: '#ffb000',
      border: '#22302a',
      font: '"JetBrains Mono", monospace',
      pattern: 'linear-gradient(rgba(57,255,136,.12) 1px, transparent 1px) 0 0 / 10px 10px, linear-gradient(90deg, rgba(57,255,136,.12) 1px, transparent 1px) 0 0 / 10px 10px',
    },
  },
  {
    id: 'marble',
    name: 'Lingote',
    desc: 'Mármol crema con oro y serif',
    accent: null,
    group: 'market',
    preview: {
      background: '#f4efe4',
      surface: '#fffdf8',
      text: '#1d1a14',
      muted: '#6d6352',
      accent: '#8a6a1f',
      border: '#e2d6bd',
      font: '"Fraunces", serif',
      pattern: 'radial-gradient(120px 40px at 30% 20%, rgba(138,106,31,.18), transparent 70%), radial-gradient(160px 30px at 80% 80%, rgba(138,106,31,.14), transparent 70%)',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    desc: 'Noche estrellada verde agua y violeta',
    accent: null,
    group: 'worlds',
    preview: {
      background: 'radial-gradient(circle at 12% 0%, rgba(45,212,191,.6), transparent 55%), radial-gradient(circle at 92% 8%, rgba(139,92,246,.65), transparent 55%), #070b1a',
      surface: 'rgba(18,26,52,.85)',
      text: '#eef2ff',
      muted: '#a5b0e0',
      accent: '#2dd4bf',
      border: 'rgba(148,163,220,.25)',
      font: '"Archivo", sans-serif',
      pattern: 'radial-gradient(rgba(255,255,255,.6) 0.8px, transparent 1.2px) 0 0 / 14px 13px',
    },
  },
  {
    id: 'neon',
    name: 'Neón Tokio',
    desc: 'Cuadrícula rosa y cian, letra ancha',
    accent: null,
    group: 'worlds',
    preview: {
      background: 'radial-gradient(circle at 90% 0%, rgba(244,63,94,.6), transparent 55%), radial-gradient(circle at 0% 100%, rgba(34,211,238,.5), transparent 55%), #0d0618',
      surface: 'rgba(32,14,56,.85)',
      text: '#fdf2ff',
      muted: '#d8b4fe',
      accent: '#ff4ecd',
      border: 'rgba(244,114,182,.3)',
      font: '"Unbounded", sans-serif',
      pattern: 'linear-gradient(rgba(255,78,205,.2) 1px, transparent 1px) 0 0 / 12px 12px, linear-gradient(90deg, rgba(34,211,238,.18) 1px, transparent 1px) 0 0 / 12px 12px',
    },
  },
  {
    id: 'sunset',
    name: 'Atardecer',
    desc: 'Sol retro con franjas y serif cálida',
    accent: null,
    group: 'worlds',
    preview: {
      background: 'radial-gradient(circle at 50% 120%, rgba(251,146,60,.8), transparent 55%), radial-gradient(circle at 0% 0%, rgba(236,72,153,.5), transparent 55%), #1a0b12',
      surface: 'rgba(50,20,32,.85)',
      text: '#fff1e6',
      muted: '#f5b99a',
      accent: '#fb923c',
      border: 'rgba(251,146,60,.3)',
      font: '"Fraunces", serif',
      pattern: 'repeating-linear-gradient(180deg, transparent 0 6px, rgba(251,146,60,.14) 6px 7px)',
    },
  },
  {
    id: 'ocean',
    name: 'Océano',
    desc: 'Azul petróleo con oleaje turquesa',
    accent: null,
    group: 'worlds',
    preview: {
      background: 'radial-gradient(circle at 0% 0%, rgba(34,211,238,.6), transparent 55%), radial-gradient(circle at 100% 100%, rgba(37,99,235,.6), transparent 55%), #031a24',
      surface: 'rgba(6,42,58,.85)',
      text: '#e6fbff',
      muted: '#8fd3e0',
      accent: '#22d3ee',
      border: 'rgba(45,212,191,.3)',
      font: '"Archivo", sans-serif',
      pattern: 'repeating-radial-gradient(ellipse at 50% 140%, transparent 0 7px, rgba(34,211,238,.14) 7px 8px)',
    },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    desc: 'Pétalos rosas, lila y serif suave',
    accent: null,
    group: 'worlds',
    preview: {
      background: 'radial-gradient(circle at 0% 0%, rgba(244,114,182,.6), transparent 55%), radial-gradient(circle at 100% 10%, rgba(167,139,250,.6), transparent 55%), #fff5fa',
      surface: 'rgba(255,255,255,.9)',
      text: '#3b0a2a',
      muted: '#8a5775',
      accent: '#db2777',
      border: 'rgba(219,39,119,.22)',
      font: '"Fraunces", serif',
      pattern: 'radial-gradient(ellipse 3px 1.6px, rgba(244,114,182,.5), transparent) 0 0 / 16px 14px',
    },
  },
]

export const ACCENT_COLORS: string[] = ['#0284c7', '#06b6d4', '#14b8a6', '#22c55e', '#eab308', '#f97316', '#ef4444', '#ec4899', '#a855f7', '#6366f1']
