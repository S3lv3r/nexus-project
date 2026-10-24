import React from 'react'
import { InfoTip } from './AtlasCard'
import type { TipMore } from './AtlasCard'

interface SceneCardProps {
  title: string
  tip: string
  tipMore?: TipMore
  /** número principal, sufijo y etiqueta de estado (se muestran en un panel de cristal abajo) */
  value: React.ReactNode
  suffix?: string
  label?: string
  labelColor?: string
  /** contenido extra bajo el número (barras, escalas…) */
  extra?: React.ReactNode
  className?: string
  /** la escena: un <svg> que llena toda la tarjeta */
  children: React.ReactNode
}

/**
 * Molde de las tarjetas del Atlas: el instrumento (un <svg> sobre un fondo pastel muy suave) ocupa toda la tarjeta,
 * el título va arriba (con su botón "?") y el valor abajo, en un panel con borde fino.
 */
export const SceneCard: React.FC<SceneCardProps> = ({
  title,
  tip,
  tipMore,
  value,
  suffix,
  label,
  labelColor,
  extra,
  className = '',
  children,
}) => (
  <section
    className={`group relative isolate flex min-h-[184px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70 transition-shadow duration-300 focus-within:z-20 hover:z-20 hover:shadow-md hover:shadow-slate-300/60 motion-reduce:transition-none ${className}`}
  >
    {/* instrumento de fondo */}
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {children}
    </div>

    <header className="relative z-10 flex items-start justify-between gap-2 px-3 pt-2.5">
      <h3 className="whitespace-nowrap text-[10.5px] font-semibold uppercase leading-none tracking-[0.12em] text-slate-600 sm:text-[11px]">{title}</h3>
      <InfoTip text={tip} more={tipMore} />
    </header>

    <div className="relative z-10 mt-auto p-2 pt-0">
      <div className="rounded-lg border border-slate-200/90 bg-white/85 px-2.5 py-1 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex shrink-0 items-baseline gap-1 leading-none">
            <span className="text-[25px] font-semibold tabular-nums tracking-tight text-slate-900">{value}</span>
            {suffix && <span className="text-[10px] text-slate-500">{suffix}</span>}
          </div>
          {label && (
            <div className="min-w-0 text-right text-[11.5px] font-semibold leading-tight" style={{ color: labelColor }}>
              {label}
            </div>
          )}
        </div>
        {extra}
      </div>
    </div>
  </section>
)