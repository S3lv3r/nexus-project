import React, { useState } from 'react'
import { CATEGORIES } from './IndicatorData'
import type { CategoryKey, Indicator } from './IndicatorData'
import { INDICATOR_ICONS } from './IndicatorIcons'
import { ILLUSTRATIONS } from './IndicatorIllustrations'

/* ------------------------------------------------------------------ */
/* Colores por categoría (clases completas para que Tailwind las vea)  */
/* ------------------------------------------------------------------ */

export interface IndicatorTone {
  letter: string // insignia con la letra de la categoría
  icon: string // recuadro del icono
  panel: string // fondo de las ilustraciones
  border: string // borde de la tarjeta abierta
  ring: string // anillo de foco
}

export const INDICATOR_TONES: Record<CategoryKey, IndicatorTone> = {
  trend: {
    letter: 'bg-sky-50 text-sky-600 ring-sky-100',
    icon: 'bg-sky-50 text-sky-500 ring-sky-100',
    panel: 'bg-sky-50/60',
    border: 'border-sky-200',
    ring: 'focus-visible:ring-sky-300',
  },
  momentum: {
    letter: 'bg-violet-50 text-violet-600 ring-violet-100',
    icon: 'bg-violet-50 text-violet-500 ring-violet-100',
    panel: 'bg-violet-50/60',
    border: 'border-violet-200',
    ring: 'focus-visible:ring-violet-300',
  },
  volatility: {
    letter: 'bg-amber-50 text-amber-600 ring-amber-100',
    icon: 'bg-amber-50 text-amber-500 ring-amber-100',
    panel: 'bg-amber-50/60',
    border: 'border-amber-200',
    ring: 'focus-visible:ring-amber-300',
  },
  structure: {
    letter: 'bg-teal-50 text-teal-600 ring-teal-100',
    icon: 'bg-teal-50 text-teal-500 ring-teal-100',
    panel: 'bg-teal-50/60',
    border: 'border-teal-200',
    ring: 'focus-visible:ring-teal-300',
  },
}

/* ------------------------------------------------------------------ */
/* Piezas reutilizables                                                */
/* ------------------------------------------------------------------ */

/** Encabezado de una categoría: letra, título y una línea que orienta. */
export const CategoryHeader: React.FC<{ category: CategoryKey }> = ({ category }) => {
  const c = CATEGORIES[category]
  const tone = INDICATOR_TONES[category]
  return (
    <header className="mb-4">
      <h3 className="flex items-center gap-3 text-base font-semibold text-slate-800">
        <span
          aria-hidden="true"
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1 ${tone.letter}`}
        >
          {c.letter}
        </span>
        {c.title}
        <span className="h-px flex-1 bg-slate-100" />
      </h3>
      <p className="mt-1 pl-10 text-sm text-slate-500">{c.tagline}</p>
    </header>
  )
}

/** Entrada discreta y escalonada (el contenedor exterior anima; el interior se queda libre para el hover). */
export const Reveal: React.FC<{ shown: boolean; index?: number; className?: string; children: React.ReactNode }> = ({
  shown,
  index = 0,
  className = '',
  children,
}) => (
  <div
    style={{ transitionDelay: `${index * 80}ms` }}
    className={`transition duration-700 ease-out motion-reduce:transition-none ${
      shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
    } ${className}`}
  >
    {children}
  </div>
)

/** Panel que se despliega con suavidad. Cerrado, su contenido no es visible ni enfocable. */
export const Collapse: React.FC<{ open: boolean; id: string; labelledBy: string; children: React.ReactNode }> = ({
  open,
  id,
  labelledBy,
  children,
}) => (
  <div
    id={id}
    role="region"
    aria-labelledby={labelledBy}
    aria-hidden={!open}
    className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${
      open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
    }`}
  >
    <div className="overflow-hidden">{children}</div>
  </div>
)

export const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    viewBox="0 0 20 20"
    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 motion-reduce:transition-none ${
      open ? 'rotate-180' : ''
    }`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 8l5 5 5-5" />
  </svg>
)

export const ReadingList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map((text) => (
      <li key={text} className="flex gap-2 text-sm leading-relaxed text-slate-600">
        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-300" />
        {text}
      </li>
    ))}
  </ul>
)

export const CautionNote: React.FC<{ text: string }> = ({ text }) => (
  <p className="rounded-xl bg-amber-50/70 px-3 py-2 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-100">
    <span className="font-semibold">Ojo: </span>
    {text}
  </p>
)

/* ------------------------------------------------------------------ */
/* Lista de indicadores en acordeón (una tarjeta abierta a la vez)     */
/* ------------------------------------------------------------------ */

interface IndicatorAccordionProps {
  items: Indicator[]
  category: CategoryKey
  shown: boolean
  /** id del indicador que empieza abierto */
  defaultOpen?: string
  /** tarjeta amplia: la gráfica ocupa la mitad del ancho */
  large?: boolean
}

export const IndicatorAccordion: React.FC<IndicatorAccordionProps> = ({ items, category, shown, defaultOpen, large = false }) => {
  const tone = INDICATOR_TONES[category]
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? null)

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openId === item.id
        const Icon = INDICATOR_ICONS[item.icon]
        const Illustration = item.illustration ? ILLUSTRATIONS[item.illustration] : null
        const buttonId = `ind-${item.id}-button`
        const panelId = `ind-${item.id}-panel`

        return (
          <li key={item.id}>
            <Reveal shown={shown} index={i}>
              <div
                className={`rounded-2xl border bg-white shadow-sm shadow-slate-200/50 transition duration-300 hover:shadow-md hover:shadow-slate-200/70 motion-reduce:transition-none ${
                  isOpen ? tone.border : 'border-slate-200/70'
                }`}
              >
                <h4>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className={`group flex w-full items-center gap-3 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 ${large ? 'px-6 py-5' : 'px-4 py-3.5'} ${tone.ring}`}
                  >
                    <span
                      className={`flex shrink-0 items-center justify-center rounded-xl ring-1 transition duration-300 group-hover:scale-105 motion-reduce:transition-none ${large ? 'h-12 w-12' : 'h-10 w-10'} ${tone.icon}`}
                    >
                      <Icon className={large ? 'h-6 w-6' : 'h-5 w-5'} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className={`font-semibold text-slate-800 ${large ? 'text-xl' : 'text-base'}`}>{item.name}</span>
                        <span className={`text-slate-400 ${large ? 'text-sm' : 'text-xs'}`}>{item.subtitle}</span>
                      </span>
                      <span className={`mt-0.5 block text-slate-500 ${large ? 'text-[15px]' : 'text-sm'}`}>{item.measures}</span>
                    </span>
                    <Chevron open={isOpen} />
                  </button>
                </h4>

                <Collapse open={isOpen} id={panelId} labelledBy={buttonId}>
                  <div
                    className={`grid gap-4 md:items-start ${
                      large ? 'gap-6 px-6 pb-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center' : 'px-4 pb-4 md:grid-cols-[minmax(0,1fr)_17rem]'
                    }`}
                  >
                    <div className={large ? 'space-y-4' : 'space-y-3'}>
                      <p className={`leading-relaxed text-slate-600 ${large ? 'text-[15px]' : 'text-sm'}`}>{item.explanation}</p>
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Cómo leerlo</p>
                        <ReadingList items={item.reading} />
                      </div>
                      {item.caution && <CautionNote text={item.caution} />}
                    </div>
                    {Illustration && (
                      <div className={`${large ? 'rounded-2xl p-3 ring-1 ring-slate-100' : 'rounded-xl p-2'} ${tone.panel}`}>
                        <Illustration />
                      </div>
                    )}
                  </div>
                </Collapse>
              </div>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}
