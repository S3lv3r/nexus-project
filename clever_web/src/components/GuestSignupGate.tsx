import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

interface GuestSignupGateProps {
  onClose: () => void
}

export const GuestSignupGate: React.FC<GuestSignupGateProps> = ({ onClose }) => {
  const primaryRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    primaryRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(5,10,20,0.55)] p-4 backdrop-blur-[3px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-gate-title"
        className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--bg-alt)] p-7 text-[var(--text)] shadow-2xl sm:p-8"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-xl text-[var(--primary)]">
          <i className="fa-solid fa-lock"></i>
        </span>
        <h2 id="guest-gate-title" className="mt-5 text-2xl font-extrabold leading-tight tracking-tight">
          Crea tu cuenta para empezar el camino
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">
          Las 25 lecciones del curso son gratis, pero necesitas una cuenta para guardar tu avance y desbloquear cada tema.
        </p>
        <ul className="mt-5 space-y-2 text-[15px] text-[var(--text)]">
          <li className="flex items-center gap-3">
            <i className="fa-solid fa-check text-[var(--primary)]"></i>
            Tu progreso se guarda lección por lección
          </li>
          <li className="flex items-center gap-3">
            <i className="fa-solid fa-check text-[var(--primary)]"></i>
            Seis temas con ejemplos, tablas y actividades
          </li>
          <li className="flex items-center gap-3">
            <i className="fa-solid fa-check text-[var(--primary)]"></i>
            Kor te acompaña en cada tema
          </li>
        </ul>
        <div className="mt-7 grid gap-3">
          <Link ref={primaryRef} to="/register" className="platform-btn-primary justify-center py-3 text-sm">
            Crear cuenta gratis
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
          <Link to="/login" className="platform-btn-secondary justify-center py-3 text-sm">
            Ya tengo cuenta
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            Ver el camino primero
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}
