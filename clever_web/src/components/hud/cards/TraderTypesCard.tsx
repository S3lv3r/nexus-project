import React, { useState } from 'react'
import { TRADERS } from '../HudData'
import { HudCard } from '../HudCard'
import { HUD_ICONS, HUD_TONES } from '../HudIcons'
import { useSlideState } from '../HudSlide'
import { pastelGlow } from '../Hudglow'

const DOT = ['bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-sky-400']

/** Análisis: Tipos de trader — de los más rápidos a los más pacientes, y la pregunta final. */
export const TraderTypesCard: React.FC = () => {
  const active = useSlideState() === 'active'
  const [picked, setPicked] = useState<number | null>(null)
  const choice = picked !== null ? TRADERS[picked] : null

  return (
    <HudCard title="Tipos de trader" icon="users" glow={pastelGlow('violet', 'sky', 'peach')}>
      <p className="-mt-1 mb-[clamp(0.35rem,1.1vh,0.75rem)] text-[clamp(0.75rem,1.6vh,0.875rem)] text-slate-600">
        De las operaciones más rápidas a las más pacientes
      </p>

      {/* línea de tiempo */}
      {/* los cuatro puntos quedan sobre el centro de sus tarjetas; las etiquetas de los extremos van en el mismo renglón */}
      <div aria-hidden="true" className="relative mb-[clamp(0.4rem,1.2vh,0.75rem)] hidden sm:block">
        <div className="relative grid grid-cols-4">
          <span className="absolute inset-x-[12.5%] top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-slate-300" />
          {TRADERS.map((t, i) => (
            <span key={t.name} className="relative flex justify-center">
              <span className={`h-3 w-3 rounded-full ring-4 ring-white transition-colors duration-300 ${DOT[i]} ${picked === i ? 'ring-indigo-200' : ''}`} />
            </span>
          ))}
        </div>
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[11px] text-slate-500">Más rápido</span>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] text-slate-500">Más paciente</span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
        {TRADERS.map((t, i) => {
          const Icon = HUD_ICONS[t.icon]
          const tone = HUD_TONES[t.tone]
          const on = picked === i
          return (
            <button
              key={t.name}
              type="button"
              aria-pressed={on}
              onClick={() => setPicked(on ? null : i)}
              style={{ transitionDelay: active ? `${500 + i * 110}ms` : '0ms' }}
              className={`group flex min-h-0 flex-col items-center justify-center rounded-xl p-[clamp(0.6rem,1.6vh,1rem)] text-center transition duration-500 sm:flex-row sm:justify-start sm:gap-3 sm:text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 motion-reduce:transition-none ${
                active ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              } ${on ? 'bg-white shadow-sm ring-2 ring-indigo-300' : 'bg-white/70 ring-1 ring-slate-200 hover:bg-white'}`}
            >
              <span
                className={`mb-2 flex h-[clamp(2.4rem,5.5vh,3.1rem)] w-[clamp(2.4rem,5.5vh,3.1rem)] shrink-0 items-center justify-center rounded-lg sm:mb-0 ${tone.box}`}
              >
                <Icon className="h-1/2 w-1/2" />
              </span>
              <span className="min-w-0">
                <span className="block text-[clamp(0.8rem,1.8vh,0.95rem)] font-semibold leading-tight text-slate-900">{t.name}</span>
                <span className="mt-0.5 block text-[clamp(0.7rem,1.5vh,0.8rem)] leading-snug text-slate-600">{t.text}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-[clamp(0.5rem,1.4vh,1rem)] rounded-xl bg-white/70 px-4 py-[clamp(0.4rem,1.1vh,0.9rem)] text-center ring-1 ring-slate-200">
        <p className="text-[clamp(0.9rem,2vh,1.1rem)] font-semibold text-slate-900">Y tú, ¿qué tipo de trader quieres ser?</p>
        <p aria-live="polite" className="mt-1 min-h-[1.25rem] text-sm text-slate-700">
          {choice ? (
            <span key={choice.name} className="hud-fade inline-block">
              Te inclinas por ser <span className={`font-semibold ${HUD_TONES[choice.tone].text}`}>{choice.name}</span>: {choice.pitch}
            </span>
          ) : (
            'Toca una opción para elegir.'
          )}
        </p>
      </div>
    </HudCard>
  )
}