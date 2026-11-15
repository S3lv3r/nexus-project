import React from 'react'

interface MistakeCardProps {
  title: string
  text: string
  icon: React.ReactNode
  iconTone: string // colores pastel del icono
  glow?: string
  shown: boolean // la sección ya entró en pantalla
  index: number // orden dentro del grupo, para la entrada escalonada
  className?: string
}

/** Tarjeta de un error común: icono discreto, título breve y explicación concisa. */
export const MistakeCard: React.FC<MistakeCardProps> = ({
  title,
  text,
  icon,
  iconTone,
  glow,
  shown,
  index,
  className = '',
}) => (
  // el contenedor exterior hace la entrada; el interior, el hover (así no se mezclan los retrasos)
  <article
    style={{ transitionDelay: `${index * 80}ms` }}
    className={`transition duration-700 ease-out motion-reduce:transition-none ${
      shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
    } ${className}`}
  >
    <div
      style={glow ? ({ '--glow': glow } as React.CSSProperties) : undefined}
      className={`group h-full rounded-2xl border bg-white p-4 transition duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        glow
          ? 'border-[color-mix(in_oklab,var(--glow)_45%,var(--border))] shadow-[0_0_0_1px_color-mix(in_oklab,var(--glow)_14%,transparent),0_0_22px_-6px_color-mix(in_oklab,var(--glow)_55%,transparent)] hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--glow)_24%,transparent),0_0_30px_-4px_color-mix(in_oklab,var(--glow)_65%,transparent)]'
          : 'border-slate-200/70 shadow-sm shadow-slate-200/50 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/70'
      }`}
    >
      <span
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition duration-300 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transition-none ${iconTone}`}
      >
        {icon}
      </span>
      <h4 className="text-base font-semibold leading-snug text-slate-800">{title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{text}</p>
    </div>
  </article>
)
