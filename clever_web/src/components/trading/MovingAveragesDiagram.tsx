import React, { useState } from 'react'
import { buildPrices, dema, ema, lwma, sma, smma, tema } from './indicatorMath'
import type { Series } from './indicatorMath'
import { useReveal } from './useReveal'

/* Un mismo movimiento de precio y las seis medias calculadas con el mismo periodo. */

const PERIOD = 9
const PRICES = buildPrices(21, [
  { len: 11, drift: 0, vol: 0.35 },
  { len: 12, drift: 2.3, vol: 0.6 },
  { len: 10, drift: 0, vol: 0.7 },
  { len: 10, drift: -1.5, vol: 0.6 },
  { len: 8, drift: 0, vol: 0.4 },
])

// tramos del movimiento: índice de inicio y fin de cada uno
const PHASES = [
  { label: 'Lateral', from: 0, to: 11 },
  { label: 'Subida', from: 11, to: 23 },
  { label: 'Pausa', from: 23, to: 33 },
  { label: 'Bajada', from: 33, to: 43 },
  { label: 'Lateral', from: 43, to: 51 },
]

type LineId = 'sma' | 'ema' | 'smma' | 'lwma' | 'dema' | 'tema'

interface LineDef {
  id: LineId
  label: string
  color: string
  width: number
  dot: string
  chip: string
  series: Series
}

// SMA y EMA llevan más protagonismo (trazo más grueso)
const LINES: LineDef[] = [
  { id: 'sma', label: 'SMA', color: '#4ba9dc', width: 3, dot: 'bg-sky-400', chip: 'bg-sky-50 text-sky-700 ring-sky-100', series: sma(PRICES, PERIOD) },
  { id: 'ema', label: 'EMA', color: '#9a86e6', width: 3, dot: 'bg-violet-400', chip: 'bg-violet-50 text-violet-700 ring-violet-100', series: ema(PRICES, PERIOD) },
  { id: 'smma', label: 'SMMA', color: '#34d399', width: 1.9, dot: 'bg-emerald-400', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-100', series: smma(PRICES, PERIOD) },
  { id: 'lwma', label: 'LWMA', color: '#fbbf24', width: 1.9, dot: 'bg-amber-400', chip: 'bg-amber-50 text-amber-700 ring-amber-100', series: lwma(PRICES, PERIOD) },
  { id: 'dema', label: 'DEMA', color: '#fb7185', width: 1.9, dot: 'bg-rose-400', chip: 'bg-rose-50 text-rose-700 ring-rose-100', series: dema(PRICES, PERIOD) },
  { id: 'tema', label: 'TEMA', color: '#2dd4bf', width: 1.9, dot: 'bg-teal-400', chip: 'bg-teal-50 text-teal-700 ring-teal-100', series: tema(PRICES, PERIOD) },
]

const W = 680
const H = 300
const PX = 18
const PR = 48
const PT = 34
const PB = 18
const PRICE_COLOR = 'var(--text)'
const GRID = 'color-mix(in oklab, var(--text) 8%, transparent)'
const LABEL = 'color-mix(in oklab, var(--text) 55%, transparent)'

const every = [...PRICES, ...LINES.flatMap((l) => l.series.filter((v): v is number => v !== null))]
const MIN = Math.min(...every)
const MAX = Math.max(...every)
const xOf = (i: number) => PX + (i / (PRICES.length - 1)) * (W - PX - PR)
const yOf = (v: number) => H - PB - ((v - MIN) / (MAX - MIN)) * (H - PT - PB)

function path(vals: Series): string {
  let d = ''
  let pen = false
  vals.forEach((v, i) => {
    if (v === null) {
      pen = false
      return
    }
    d += `${pen ? 'L' : 'M'}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)} `
    pen = true
  })
  return d.trim()
}

const PRICE_PATH = path(PRICES)
const PRICE_AREA = `${PRICE_PATH} L${xOf(PRICES.length - 1).toFixed(1)},${H - PB} L${xOf(0).toFixed(1)},${H - PB} Z`
const TICKS = [0.15, 0.5, 0.85].map((f) => MIN + f * (MAX - MIN))

/** Esquema comparativo: cómo responden las medias a un mismo movimiento. Las líneas se pueden mostrar u ocultar. */
export const MovingAveragesDiagram: React.FC = () => {
  const { ref, shown } = useReveal<HTMLElement>(0.2)
  const [visible, setVisible] = useState<Record<LineId, boolean>>({
    sma: true,
    ema: true,
    smma: false,
    lwma: false,
    dema: false,
    tema: false,
  })

  // las líneas finas se dibujan primero para que SMA y EMA queden encima
  const order = [...LINES].sort((a, b) => a.width - b.width)

  return (
    <section
      ref={ref}
      aria-label="Comparación de medias móviles"
      className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm shadow-slate-200/50 sm:p-5"
    >
      <h4 className="text-base font-semibold text-slate-800">Un mismo movimiento, distintas medias</h4>
      <p className="mt-1 text-sm text-slate-500">
        Misma serie de precios y mismo periodo ({PERIOD}) para todas las medias. Empiezan visibles el precio, la SMA y la EMA; toca
        otro nombre para agregar su línea.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Medias visibles">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          <span className="h-2 w-2 rounded-full" style={{ background: PRICE_COLOR }} />
          Precio
        </span>
        {LINES.map((l) => {
          const on = visible[l.id]
          return (
            <button
              key={l.id}
              type="button"
              aria-pressed={on}
              onClick={() => setVisible((v) => ({ ...v, [l.id]: !v[l.id] }))}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                on ? l.chip : 'bg-white text-slate-400 ring-slate-200 hover:text-slate-600'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${on ? l.dot : 'bg-slate-300'}`} />
              {l.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4 rounded-xl bg-slate-50/70 p-2 ring-1 ring-slate-100">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Una misma serie de precios con tramos laterales, de subida, de pausa y de bajada, y la respuesta de seis medias móviles"
          className={`h-auto w-full transition-[clip-path] duration-[1800ms] ease-out motion-reduce:transition-none ${
            shown ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_100%_0_0)]'
          }`}
        >
          <defs>
            <linearGradient id="ma-price-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--text)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--text)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {PHASES.map((p, i) => (
            <g key={`${p.label}-${i}`}>
              {i % 2 === 0 && (
                <rect x={xOf(p.from)} y={PT - 16} width={xOf(p.to) - xOf(p.from)} height={H - PB - PT + 16} fill="color-mix(in oklab, var(--text) 4%, transparent)" />
              )}
              <text x={(xOf(p.from) + xOf(p.to)) / 2} y={PT - 20 + 12} textAnchor="middle" fontSize="11" fontWeight="600" fill={LABEL} style={{ fontFamily: 'inherit' }}>
                {p.label}
              </text>
            </g>
          ))}
          {TICKS.map((v) => (
            <g key={v}>
              <line x1={PX} x2={W - PR} y1={yOf(v)} y2={yOf(v)} stroke={GRID} />
              <text x={W - 6} y={yOf(v) + 4} textAnchor="end" fontSize="11" fill={LABEL} style={{ fontFamily: 'inherit' }}>
                {v.toFixed(0)}
              </text>
            </g>
          ))}

          <path d={PRICE_AREA} fill="url(#ma-price-area)" />
          <path d={PRICE_PATH} fill="none" stroke={PRICE_COLOR} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />

          {order.map(
            (l) =>
              visible[l.id] && (
                <path
                  key={l.id}
                  d={path(l.series)}
                  fill="none"
                  stroke={l.color}
                  strokeWidth={l.width}
                  strokeOpacity={l.width > 2 ? 1 : 0.9}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ),
          )}
        </svg>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        La rapidez con que cada media responde depende del periodo elegido y de su fórmula. Este ejemplo solo muestra cómo
        se comporta con estos datos y estos parámetros; no establece un orden universal.
      </p>
    </section>
  )
}
