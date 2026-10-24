import React, { useState } from 'react'
import type { HudRowItem } from './HudData'
import { HUD_ICONS, HUD_TONES } from './HudIcons'
import { useSlideState } from './HudSlide'

/**
 * Lista dinámica de filas (conceptos o mercados).
 * Las filas entran en cascada cuando su sección aparece y, al tocarlas, se enfocan y atenúan a las demás. Al pasar el mouse solo cambia el color.
 */
export const HudRows: React.FC<{ items: HudRowItem[]; label: string }> = ({ items, label }) => {
  const active = useSlideState() === 'active'
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <ul
      aria-label={label}
      className="-mr-1 flex min-h-0 flex-1 flex-col justify-between overflow-y-auto pr-1 [scrollbar-width:thin]"
    >
      {items.map((item, i) => {
        const Icon = HUD_ICONS[item.icon]
        const tone = HUD_TONES[item.tone]
        const on = selected === item.id
        const dim = selected !== null && !on

        return (
          <li
            key={item.id}
            style={{ transitionDelay: active ? `${420 + i * 80}ms` : '0ms' }}
            className={`border-b border-slate-200/70 transition duration-700 ease-out last:border-b-0 motion-reduce:transition-none ${
              active ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
            }`}
          >
            <button
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(on ? null : item.id)}
              className={`group flex w-full items-center gap-[clamp(0.6rem,1.4vh,1rem)] rounded-lg px-2 py-[clamp(0.3rem,0.9vh,0.7rem)] text-left transition-colors duration-200 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 motion-reduce:transition-none ${
                on ? 'bg-white shadow-sm ring-1 ring-indigo-200' : ''
              } ${dim ? 'opacity-55' : ''}`}
            >
              <span className={`flex h-[clamp(2.1rem,4.6vh,2.6rem)] w-[clamp(2.1rem,4.6vh,2.6rem)] shrink-0 items-center justify-center rounded-lg ${tone.box}`}>
                <Icon className="h-[55%] w-[55%]" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[clamp(0.85rem,1.9vh,1rem)] font-semibold leading-tight text-slate-900">{item.name}</span>
                <span className="block text-[clamp(0.75rem,1.6vh,0.875rem)] leading-snug text-slate-600">{item.text}</span>
              </span>

              {item.tag && (
                <span className={`hidden shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ring-1 sm:inline-block ${tone.chip}`}>{item.tag}</span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}