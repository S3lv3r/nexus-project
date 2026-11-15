import React, { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/** Comentario extra opcional para el botón "?": etiquetas (p. ej. indicadores) y/o una nota breve. */
export interface TipMore {
  /** título pequeño sobre las etiquetas */
  title?: string
  /** etiquetas, p. ej. indicadores que se pueden usar */
  chips?: string[]
  /** nota breve */
  note?: React.ReactNode
}

/**
 * Botón "?" con explicación sencilla (hover o clic).
 * El cuadro se dibuja en <body> con position: fixed y un z-index muy alto, así que
 * nunca queda recortado por la tarjeta ni tapado por otras tarjetas. Se coloca solo:
 * debajo del botón y, si no cabe, arriba; siempre dentro de la pantalla.
 */
export const InfoTip: React.FC<{
  text: string
  more?: TipMore
  /** Ya no se usa (la posición es automática); se conserva para no romper llamadas existentes. */
  align?: 'left' | 'right'
}> = ({ text, more }) => {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }

    const place = () => {
      const btn = btnRef.current
      const tip = tipRef.current
      if (!btn || !tip) return
      const r = btn.getBoundingClientRect()
      const margin = 10
      const w = tip.offsetWidth
      const h = tip.offsetHeight
      const left = Math.min(
        Math.max(margin, r.left + r.width / 2 - w / 2),
        window.innerWidth - w - margin,
      )
      let top = r.bottom + margin
      if (top + h > window.innerHeight - margin && r.top - margin - h > margin) {
        top = r.top - margin - h
      }
      setPos({ top, left })
    }

    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  return (
    <span
      className="inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={btnRef}
        type="button"
        aria-label="¿Qué significa?"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors duration-200 ${
          open
            ? 'border-[var(--text-muted)] bg-[var(--text)] text-[var(--bg-alt)]'
            : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text)]'
        }`}
      >
        ?
      </button>

      {open &&
        createPortal(
          <span
            ref={tipRef}
            role="tooltip"
            className={`pointer-events-none fixed z-[9999] rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] p-3.5 text-left text-[13px] font-normal leading-relaxed text-[var(--text)] shadow-[0_18px_40px_-20px_rgba(15,23,42,0.5)] ${
              more ? 'w-64' : 'w-60'
            }`}
            style={{
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              visibility: pos ? 'visible' : 'hidden',
            }}
          >
            {text}
            {more && (
              <span className="mt-2.5 block border-t border-[var(--border)] pt-2.5">
                {(more.title || more.chips) && (
                  <span className="block rounded-lg bg-[color-mix(in_oklab,#f5c542_16%,var(--bg-alt))] p-2.5 ring-1 ring-[color-mix(in_oklab,#f5c542_45%,var(--border))]">
                    {more.title && (
                      <span className="mb-1.5 block text-[10.5px] font-semibold uppercase tracking-wider text-[color-mix(in_oklab,#b7860b_75%,var(--text))]">
                        {more.title}
                      </span>
                    )}
                    {more.chips && (
                      <span className="flex flex-wrap gap-1.5">
                        {more.chips.map((c) => (
                          <span key={c} className="rounded-full bg-[var(--bg-alt)] px-2 py-0.5 text-[11.5px] font-medium text-[var(--text)] ring-1 ring-[color-mix(in_oklab,#f5c542_45%,var(--border))]">
                            {c}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                )}
                {more.note && <span className="mt-1.5 block text-[12px] leading-snug text-[var(--text-muted)]">{more.note}</span>}
              </span>
            )}
          </span>,
          document.body,
        )}
    </span>
  )
}

interface AtlasCardProps {
  title: string
  tip: string
  /** color del resplandor suave de la esquina (rgba) */
  tint?: string
  className?: string
  /** contenido extra a la derecha del título (ej. pestañas) */
  actions?: React.ReactNode
  /** comentario extra del botón "?" */
  tipMore?: TipMore
  children: React.ReactNode
}

export const AtlasCard: React.FC<AtlasCardProps> = ({
  title,
  tip,
  tint = 'rgba(251,191,36,0.08)',
  className = '',
  actions,
  tipMore,
  children,
}) => (
  <section
    className={`relative z-0 flex flex-col rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-alt)_35%,var(--surface))] p-4 transition-[border-color] duration-300 focus-within:z-20 hover:z-20 hover:border-[color-mix(in_oklab,var(--text)_22%,var(--border))] ${className}`}
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-2xl"
      style={{ background: `radial-gradient(120% 90% at 90% -10%, ${tint}, transparent 60%)` }}
    />
    <header className="relative z-10 mb-3 flex items-center justify-between gap-2">
      <h3 className="text-sm font-medium text-[var(--text)]">{title}</h3>
      <div className="flex items-center gap-2">
        {actions}
        <InfoTip text={tip} more={tipMore} />
      </div>
    </header>
    <div className="relative z-10 flex flex-1 flex-col">{children}</div>
  </section>
)

/* Número grande + etiqueta de estado */
export const Readout: React.FC<{
  value: React.ReactNode
  suffix?: string
  label?: string
  labelColor?: string
}> = ({ value, suffix, label, labelColor }) => (
  <div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-3xl font-semibold tabular-nums tracking-tight text-[var(--text)]">{value}</span>
      {suffix && <span className="text-xs text-[var(--text-muted)]">{suffix}</span>}
    </div>
    {label && (
      <div className="mt-0.5 text-sm font-medium" style={{ color: labelColor }}>
        {label}
      </div>
    )}
  </div>
)