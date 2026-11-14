import React from 'react'
import { MISTAKE_GROUPS } from './MistakeData'
import type { MistakeCategory } from './MistakeData'
import { MISTAKE_ICONS } from './MistakeIcons'
import { MistakeCard } from './MistakeCard'
import { SectionHeading } from './SectionHeading'
import { useReveal } from './useReveal'

export const GROUP_STYLES: Record<MistakeCategory, { dot: string; icon: string; glow: string }> = {
  analysis: { dot: 'bg-sky-300 ring-sky-100', icon: 'bg-sky-50 text-sky-500 ring-sky-100', glow: '#5b9cf0' },
  capital: { dot: 'bg-amber-300 ring-amber-100', icon: 'bg-amber-50 text-amber-500 ring-amber-100', glow: '#f2c230' },
  psychology: { dot: 'bg-violet-300 ring-violet-100', icon: 'bg-violet-50 text-violet-500 ring-violet-100', glow: '#a78bfa' },
}

/** Posición en la cuadrícula de 6 columnas: grupos de 3 en tres columnas, grupos de 2 en dos más anchas. */
const layoutFor = (count: number, index: number) =>
  count === 2 ? 'lg:col-span-3' : index === 2 ? 'sm:col-span-2 lg:col-span-2' : 'lg:col-span-2'

/** Parte 5: los ocho errores más comunes del trader, agrupados por tema. */
export const CommonMistakes: React.FC = () => {
  const { ref, shown } = useReveal<HTMLElement>(0.1)

  return (
    <section ref={ref} aria-label="Errores comunes del trader">
      <SectionHeading title="Errores comunes" subtitle="Los ocho errores más frecuentes del trader, agrupados por tema." />

      <div className="space-y-8">
        {MISTAKE_GROUPS.map((group) => {
          const style = GROUP_STYLES[group.category]
          return (
            <div key={group.category}>
              <h3 className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                <span className={`h-2.5 w-2.5 rounded-full ring-4 ${style.dot}`} />
                {group.title}
                <span className="h-px flex-1 bg-slate-100" />
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {group.mistakes.map((mistake, i) => {
                  const Icon = MISTAKE_ICONS[mistake.icon]
                  return (
                    <MistakeCard
                      key={mistake.id}
                      title={mistake.title}
                      text={mistake.text}
                      icon={<Icon />}
                      iconTone={style.icon}
                      glow={style.glow}
                      shown={shown}
                      index={i}
                      className={layoutFor(group.mistakes.length, i)}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}