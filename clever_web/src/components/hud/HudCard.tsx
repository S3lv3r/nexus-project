import React from 'react'
import { pastelGlow } from './Hudglow'
import { HUD_ICONS } from './HudIcons'
import type { HudIconKey } from './HudIcons'

interface HudCardProps {
  title: string
  icon: HudIconKey
  /** valor CSS de `background` con manchas pastel difuminadas; por defecto, celeste, lila y menta */
  glow?: string
  className?: string
  children: React.ReactNode
}

const DEFAULT_GLOW = pastelGlow('sky', 'violet', 'mint')

/** Tarjeta del HUD: borde fino, recuadro de icono tintado, título sobrio y manchas pastel difuminadas de fondo. */
export const HudCard: React.FC<HudCardProps> = ({ title, icon, glow = DEFAULT_GLOW, className = '', children }) => {
  const Icon = HUD_ICONS[icon]
  return (
    <section
      aria-label={title}
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-[clamp(1rem,2.2vh,1.5rem)] shadow-sm shadow-slate-200/60 ${className}`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <header className="relative mb-[clamp(0.4rem,1.1vh,0.8rem)] flex items-center gap-3 border-b border-slate-100 pb-[clamp(0.35rem,1vh,0.65rem)]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="text-[clamp(1.05rem,2.4vh,1.4rem)] font-semibold leading-tight tracking-tight text-slate-900">{title}</h2>
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  )
}