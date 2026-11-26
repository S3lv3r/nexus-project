import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TermsContent } from '../components/legal/TermsContent'
import { NOTE_STYLES, SmallRosette } from '../components/note/NoteKit'

const TERMS_STYLES = `
.terms-body{color:var(--text-muted)}
.terms-body p,.terms-body li{font-size:15.5px;line-height:1.75}
.terms-body h3{font-size:18px;line-height:1.3;padding-top:1.4rem;color:var(--text)}
.terms-body ul{margin-top:.5rem}
.terms-body code{font-size:.92em}
`

export const TermsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  return (
    <div className="note-home mx-auto max-w-3xl space-y-6 py-6">
      <style>{NOTE_STYLES}</style>
      <style>{TERMS_STYLES}</style>
      <header className="note-paper relative isolate overflow-hidden rounded-[28px] p-7 sm:p-10">
        <SmallRosette className="pointer-events-none absolute -right-14 -top-14 -z-10 h-56 w-56 opacity-50" />
        <div className="note-wide text-xs font-extrabold text-[var(--ink)]">CLEVER · LEGAL</div>
        <h1 className="note-display mt-3 text-4xl font-black leading-tight text-[var(--text)] sm:text-5xl">Términos y condiciones</h1>
        <p className="mt-3 max-w-[56ch] text-lg leading-relaxed text-[var(--text-muted)]">
          Las reglas que aplican cuando usas Clever, con o sin cuenta. Son los mismos términos que aceptas al registrarte.
        </p>
      </header>
      <article className="terms-body note-card space-y-3 p-6 sm:p-10">
        <TermsContent />
      </article>
      <div className="flex flex-wrap gap-3">
        <Link to="/" className="note-btn note-btn-line">
          <i className="fa-solid fa-arrow-left text-sm"></i>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
