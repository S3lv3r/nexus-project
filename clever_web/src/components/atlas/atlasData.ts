import type { CSSProperties } from 'react'

/* ------------------------------------------------------------------ */
/* Datos simulados de Bitcoin (todo es ficticio y editable)            */
/* ------------------------------------------------------------------ */

export interface AtlasData {
  price: number
  sentiment: number // 0-100
  volatility: number // 0-100
  momentum: number // 0-100
  liquidity: number // 0-100
  buySell: number // 0 = 100% vendedores, 100 = 100% compradores
  risk: number // 0-100
  trend: number // 0 = muy bajista, 100 = muy alcista
  fearGreed: number // 0-100
  supply: number // millones de BTC en circulación
  uncertainty: number // 0-100
}

export const MAX_SUPPLY = 21
export const REF_PRICE = 41660 // precio de referencia de hace 24 h

export const DEFAULT_DATA: AtlasData = {
  price: 42680.25,
  sentiment: 72,
  volatility: 58,
  momentum: 82,
  liquidity: 78,
  buySell: 72,
  risk: 54,
  trend: 76,
  fearGreed: 68,
  supply: 19.6,
  uncertainty: 42,
}

export type PresetKey = 'bull' | 'bear' | 'neutral'

export const PRESETS: Record<PresetKey, Partial<AtlasData>> = {
  bull: { sentiment: 88, volatility: 45, momentum: 90, liquidity: 90, buySell: 82, risk: 22, trend: 92, fearGreed: 84, uncertainty: 15 },
  bear: { sentiment: 14, volatility: 82, momentum: 12, liquidity: 22, buySell: 18, risk: 86, trend: 8, fearGreed: 12, uncertainty: 88 },
  neutral: { sentiment: 50, volatility: 34, momentum: 50, liquidity: 52, buySell: 50, risk: 44, trend: 50, fearGreed: 50, uncertainty: 48 },
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const formatPrice = (v: number) =>
  '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Permite pasar variables CSS (--d, --to...) en el atributo style. */
export const cssVars = (vars: Record<string, string | number>): CSSProperties =>
  vars as unknown as CSSProperties

/* ------------------------------------------------------------------ */
/* Etiquetas                                                           */
/* ------------------------------------------------------------------ */

export const sentimentLabel = (v: number) =>
  v <= 25 ? 'Muy pesimista' : v <= 45 ? 'Pesimista' : v <= 60 ? 'Neutral' : v <= 80 ? 'Optimista' : 'Muy optimista'
export const volatilityLabel = (v: number) => (v < 34 ? 'Baja' : v < 67 ? 'Moderada' : 'Alta')
export const uncertaintyLabel = volatilityLabel
export const trendLabel = (v: number) => (v < 34 ? 'Bajista' : v < 67 ? 'Neutral' : 'Alcista')
export const riskLabel = (v: number) => (v < 34 ? 'Bajo' : v < 67 ? 'Moderado' : 'Alto')
export const momentumLabel = (v: number) => (v < 34 ? 'Bajo' : v < 67 ? 'Medio' : 'Alto')
export const liquidityLabel = (v: number) => (v < 34 ? 'Baja' : v < 67 ? 'Media' : 'Alta')
export const fearGreedLabel = (v: number) =>
  v < 21 ? 'Miedo extremo' : v < 41 ? 'Miedo' : v < 61 ? 'Neutral' : v < 81 ? 'Codicia' : 'Codicia extrema'

/* ------------------------------------------------------------------ */
/* Color                                                               */
/* ------------------------------------------------------------------ */

function hexToRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  const m = (x: number, y: number) => Math.round(x + (y - x) * t)
  return `rgb(${m(ar, br)}, ${m(ag, bg)}, ${m(ab, bb)})`
}

/** Interpola un color a partir de paradas [valor, color]. */
export function sampleColor(stops: Array<[number, string]>, v: number): string {
  if (v <= stops[0][0]) return mixHex(stops[0][1], stops[0][1], 0)
  for (let i = 1; i < stops.length; i++) {
    const [x1, c1] = stops[i]
    if (v <= x1) {
      const [x0, c0] = stops[i - 1]
      return mixHex(c0, c1, (v - x0) / (x1 - x0))
    }
  }
  const last = stops[stops.length - 1][1]
  return mixHex(last, last, 0)
}

// con un tramo lima entre el ámbar y el verde: mezclarlos directamente da un olivo apagado
const GOOD_STOPS: Array<[number, string]> = [
  [0, '#dc2626'],
  [35, '#ea580c'],
  [50, '#d97706'],
  [68, '#65a30d'],
  [100, '#16a34a'],
]
/** Rojo → ámbar → verde (valor alto = bueno). */
export const goodColor = (v: number) => sampleColor(GOOD_STOPS, v)
/** Verde → ámbar → rojo (valor alto = peligroso). */
export const riskColor = (v: number) => sampleColor(GOOD_STOPS, 100 - v)

/* ------------------------------------------------------------------ */
/* Ola SVG (periodo de 40 unidades, se anima desplazando -80)          */
/* ------------------------------------------------------------------ */

export function wavePath(y: number, amp: number, from = -80, to = 200, bottom = 120): string {
  let d = `M${from} ${y}`
  let up = true
  for (let x = from; x < to; x += 20) {
    d += ` Q${x + 10} ${y + (up ? -amp : amp)} ${x + 20} ${y}`
    up = !up
  }
  return `${d} L${to} ${bottom} L${from} ${bottom} Z`
}