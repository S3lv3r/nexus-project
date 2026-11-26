import React from 'react'
import { Link } from 'react-router-dom'

interface LockedSectionProps {
  kicker?: string
  heading: string
  title: string
  message: string
  children: React.ReactNode
}

const LOCK_STYLES = `
.lk-preview{filter:blur(6px) saturate(1.05);transform:scale(1.02)}
.lk-card{animation:lk-rise .6s cubic-bezier(.23,1,.32,1) both}
@keyframes lk-rise{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
.lk-shackle{transform-origin:70% 100%;animation:lk-shackle 3.6s cubic-bezier(.45,0,.2,1) infinite}
@keyframes lk-shackle{0%,70%,100%{transform:rotate(0)}78%{transform:rotate(-9deg)}86%{transform:rotate(4deg)}92%{transform:rotate(-2deg)}}
.lk-ring{animation:lk-ring 3.6s ease-out infinite}
@keyframes lk-ring{0%,60%{opacity:0;transform:scale(.8)}70%{opacity:.55}100%{opacity:0;transform:scale(1.55)}}
@media (prefers-reduced-motion:reduce){.lk-card,.lk-shackle,.lk-ring{animation:none}}
`

export const LockedSection: React.FC<LockedSectionProps> = ({ kicker = 'PRÓXIMAMENTE', heading, title, message, children }) => (
  <div className="relative isolate mx-auto w-full max-w-7xl py-4">
    <style>{LOCK_STYLES}</style>
    <header className="mb-5 flex flex-wrap items-end justify-between gap-4 px-1">
      <div>
        <p className="mb-2 flex items-center gap-3 text-sm text-[var(--text-muted)]">
          <span aria-hidden="true" className="h-5 w-0.5 rounded-full bg-[var(--primary)]"></span>
          {kicker === 'PRÓXIMAMENTE' ? 'Próximamente' : kicker}
        </p>
        <h1 className="flex flex-wrap items-center gap-3 text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
          {heading}
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] font-bold text-[var(--text-muted)]">
            <i className="fa-solid fa-lock text-[11px] text-[var(--primary)]"></i>
            Bloqueado
          </span>
        </h1>
      </div>
    </header>

    <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-alt)]">
      <div className="lk-preview pointer-events-none absolute inset-0 select-none" aria-hidden="true" inert>
        {children}
      </div>
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--bg)_22%,transparent)]" aria-hidden="true"></div>

      <div className="relative flex min-h-[560px] items-center justify-center p-5 sm:p-8">
        <section
          role="status"
          className="lk-card w-full max-w-md rounded-[28px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-7 text-center shadow-[0_30px_80px_-40px_rgba(10,20,40,.7)] backdrop-blur-md sm:p-9"
        >
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <span className="lk-ring absolute inset-0 rounded-full border-2 border-[var(--primary)]" aria-hidden="true"></span>
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_14px_30px_-14px_var(--primary)]">
              <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
                <path className="lk-shackle" d="M15 22v-6a9 9 0 0 1 18 0v6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <rect x="10" y="21" width="28" height="20" rx="5" fill="currentColor" />
                <circle cx="24" cy="30" r="2.6" fill="var(--primary)" />
                <rect x="22.8" y="31" width="2.4" height="5" rx="1.2" fill="var(--primary)" />
              </svg>
            </span>
          </div>
          <div className="mt-6 text-[11px] font-extrabold tracking-[0.18em] text-[var(--primary)]">{kicker}</div>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-[var(--text)] sm:text-[1.7rem]">{title}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-muted)]">{message}</p>
          <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
            <Link to="/aprender" className="platform-btn-primary justify-center py-3 text-sm">
              <i className="fa-solid fa-road text-xs"></i>
              Ir a mis lecciones
            </Link>
            <Link to="/" className="platform-btn-secondary justify-center py-3 text-sm">
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    </div>
  </div>
)
