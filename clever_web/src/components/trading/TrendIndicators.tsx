import React, { useState } from 'react'
import { EMA, ICHIMOKU, OTHER_AVERAGES, SMA } from './IndicatorData'
import type { Indicator } from './IndicatorData'
import { INDICATOR_ICONS } from './IndicatorIcons'
import { EMA_WEIGHTS, IchimokuIllustration, SMA_WEIGHTS, WeightBars } from './IndicatorIllustrations'
import {
  CategoryHeader,
  Chevron,
  Collapse,
  INDICATOR_TONES,
  ReadingList,
  Reveal,
} from './IndicatorParts'
import { MovingAveragesDiagram } from './MovingAveragesDiagram'
import { useReveal } from './useReveal'

const tone = INDICATOR_TONES.trend

/* ------------------------------------------------------------------ */
/* SMA y EMA: protagonistas de la categoría                            */
/* ------------------------------------------------------------------ */

interface AverageLook {
  surface: string
  icon: string
  bars: string
  weights: number[]
  caption: string
  label: string
}

export const LOOK: Record<'sma' | 'ema', AverageLook> = {
  sma: {
    surface: 'border-sky-100 from-sky-50/60',
    icon: 'bg-sky-50 text-sky-500 ring-sky-100',
    bars: '#38bdf8',
    weights: SMA_WEIGHTS,
    caption: 'Cada periodo pesa lo mismo.',
    label: 'Peso de cada periodo en la SMA: todos iguales',
  },
  ema: {
    surface: 'border-violet-100 from-violet-50/60',
    icon: 'bg-violet-50 text-violet-500 ring-violet-100',
    bars: '#a78bfa',
    weights: EMA_WEIGHTS,
    caption: 'Pesan más los periodos recientes.',
    label: 'Peso de cada periodo en la EMA: mayor en los más recientes',
  },
}

export const AverageCard: React.FC<{ indicator: Indicator; look: AverageLook }> = ({ indicator, look }) => {
  const Icon = INDICATOR_ICONS[indicator.icon]
  return (
    <article
      className={`h-full rounded-2xl border bg-gradient-to-b to-white p-5 shadow-sm shadow-slate-200/50 transition duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${look.surface}`}
    >
      <div className="mb-3 flex items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${look.icon}`}>
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h4 className="text-lg font-semibold leading-tight text-slate-800">{indicator.name}</h4>
          <p className="text-xs text-slate-400">{indicator.subtitle}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-slate-600">{indicator.explanation}</p>
      <p className="mt-2 text-sm text-slate-500">
        <span className="font-semibold text-slate-600">Mide: </span>
        {indicator.measures}
      </p>

      <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Cómo leerla</p>
      <ReadingList items={indicator.reading} />

      <div className="mt-4 rounded-xl bg-white/80 p-3 ring-1 ring-slate-100">
        <WeightBars weights={look.weights} color={look.bars} label={look.label} />
        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
          <span>antiguo</span>
          <span>reciente</span>
        </div>
        <p className="mt-1 text-center text-xs text-slate-500">{look.caption}</p>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* SMMA, LWMA, DEMA y TEMA: subsección secundaria expandible           */
/* ------------------------------------------------------------------ */

export const OtherAverages: React.FC<{ defaultOpen?: boolean }> = ({ defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-200/50">
      <h4>
        <button
          id="other-averages-button"
          type="button"
          aria-expanded={open}
          aria-controls="other-averages-panel"
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 ${tone.ring}`}
        >
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold text-slate-800">Otras medias móviles</span>
            <span className="block text-sm text-slate-500">Variantes con otras fórmulas de suavizado y ponderación.</span>
          </span>
          <span className="flex flex-wrap gap-1.5">
            {OTHER_AVERAGES.map((a) => (
              <span
                key={a.id}
                className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-100"
              >
                {a.name}
              </span>
            ))}
          </span>
          <Chevron open={open} />
        </button>
      </h4>

      <Collapse open={open} id="other-averages-panel" labelledBy="other-averages-button">
        <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2">
          {OTHER_AVERAGES.map((a) => {
            const Icon = INDICATOR_ICONS[a.icon]
            return (
              <article key={a.id} className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-3.5">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${tone.icon}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold leading-tight text-slate-800">{a.name}</h5>
                    <p className="text-[11px] text-slate-400">{a.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{a.explanation}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  <span className="font-semibold text-slate-600">Mide: </span>
                  {a.measures}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  <span className="font-semibold text-slate-600">Lectura: </span>
                  {a.reading[0]}
                </p>
              </article>
            )
          })}
        </div>
      </Collapse>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Ichimoku                                                            */
/* ------------------------------------------------------------------ */

export const IchimokuCard: React.FC<{ large?: boolean }> = ({ large = false }) => {
  const Icon = INDICATOR_ICONS[ICHIMOKU.icon]
  return (
    <article className={`rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/50 via-white to-white shadow-sm shadow-slate-200/50 ${large ? 'p-6' : 'p-5'}`}>
      <div className={`grid gap-5 md:items-center ${large ? 'gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]' : 'md:grid-cols-[minmax(0,1fr)_18rem]'}`}>
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${tone.icon}`}>
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h4 className={`font-semibold leading-tight text-slate-800 ${large ? 'text-xl' : 'text-lg'}`}>{ICHIMOKU.name}</h4>
              <p className="text-xs text-slate-400">{ICHIMOKU.subtitle}</p>
            </div>
          </div>
          <p className={`leading-relaxed text-slate-600 ${large ? 'text-[15px]' : 'text-sm'}`}>{ICHIMOKU.explanation}</p>
          <p className="mt-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-600">Mide: </span>
            {ICHIMOKU.measures}
          </p>
          <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Cómo leerlo</p>
          <ReadingList items={ICHIMOKU.reading} />
        </div>
        <div className={`bg-white/80 ring-1 ring-slate-100 ${large ? 'rounded-2xl p-3' : 'rounded-xl p-2'}`}>
          <IchimokuIllustration />
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Categoría A completa                                                */
/* ------------------------------------------------------------------ */

/** Categoría A: SMA y EMA destacadas, comparación visual, otras medias (expandible) e Ichimoku. */
export const TrendIndicators: React.FC = () => {
  const { ref, shown } = useReveal<HTMLDivElement>(0.08)

  return (
    <div ref={ref}>
      <CategoryHeader category="trend" />

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal shown={shown} index={0} className="h-full">
            <AverageCard indicator={SMA} look={LOOK.sma} />
          </Reveal>
          <Reveal shown={shown} index={1} className="h-full">
            <AverageCard indicator={EMA} look={LOOK.ema} />
          </Reveal>
        </div>

        <Reveal shown={shown} index={2}>
          <MovingAveragesDiagram />
        </Reveal>

        <Reveal shown={shown} index={3}>
          <OtherAverages />
        </Reveal>

        <Reveal shown={shown} index={4}>
          <IchimokuCard />
        </Reveal>
      </div>
    </div>
  )
}