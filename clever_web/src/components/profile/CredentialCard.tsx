import React from 'react'
import { ROSETTE_B } from '../note/NoteKit'
import { ProfileCover } from './ProfileLayouts'
import { TOTAL_LESSONS, TOTAL_TOPICS, getCourseProgress } from '../../data/course'
import type { UserProfile } from '../../types/platform'
import type { ProfileCustomization } from '../../types/profileCustomization'

export const credentialFolio = (name: string) =>
  String(Array.from(name || 'clever').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 1000000, 7)).padStart(6, '0')

interface CredentialCardProps {
  user: UserProfile
  custom: ProfileCustomization
  displayName: string
  avatarUrl?: string
  email?: string
  footer?: React.ReactNode
  className?: string
}

export const CredentialCard: React.FC<CredentialCardProps> = ({ user, custom, displayName, avatarUrl, email, footer, className = '' }) => {
  const course = getCourseProgress(user.moduleProgress)
  const folio = credentialFolio(displayName)
  const labelTone = !custom.homeCredentialCover
    ? ''
    : custom.bannerStyle === 'guilloche'
      ? 'text-[var(--ink)]'
      : 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]'

  return (
    <div className={`note-card relative isolate overflow-hidden ${className}`}>
      <div className="relative h-24 overflow-hidden bg-[var(--ink)] text-[var(--bg)]">
        {custom.homeCredentialCover && <ProfileCover custom={custom} cover={user.cover} className="absolute inset-0 h-full" />}
        <svg viewBox="0 0 320 320" className={`absolute -right-10 -top-24 h-72 w-72 ${custom.homeCredentialCover ? 'hidden' : ''}`} aria-hidden="true">
          <path d={ROSETTE_B} fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.4" />
        </svg>
        <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full border border-white/30 bg-black/30"></div>
        <div className={`note-wide absolute left-4 top-3 text-[10px] font-extrabold opacity-90 ${labelTone}`}>CLEVER</div>
        <div className={`note-wide absolute right-4 top-3 text-[10px] font-semibold opacity-80 ${labelTone}`}>CREDENCIAL</div>
        <div className={`note-num absolute bottom-2 left-4 text-[11px] opacity-75 ${labelTone}`}>Folio {folio}</div>
      </div>

      <div className="-mt-12 flex justify-center">
        <div className="relative h-[104px] w-[104px]">
          <div className="note-ring absolute inset-0 rounded-full"></div>
          <div className="absolute inset-[4px] flex items-center justify-center overflow-hidden rounded-full bg-[var(--bg)]">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <i className="fa-solid fa-user text-4xl text-[var(--ink)]"></i>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1.5 px-5 pt-3 text-center">
        <div className="note-display truncate text-2xl font-extrabold text-[var(--text)]">{displayName}</div>
        {email && (
          <div className="flex items-center justify-center gap-1.5 text-[13px] text-[var(--text-muted)]">
            <i className="fa-regular fa-envelope text-[11px]"></i>
            <span className="truncate">{email}</span>
          </div>
        )}
        <span className="inline-block rounded-full border border-[var(--rule)] px-3 py-0.5 text-sm font-medium text-[var(--ink)]">
          {course.isDone ? 'Curso completado' : `Tema ${course.currentTopic.number} · ${course.currentTopic.shortTitle}`}
        </span>
      </div>

      <div className="mx-5 mt-4 grid grid-cols-3 divide-x divide-[var(--rule)] rounded-2xl border border-[var(--rule)]">
        {[
          { value: `${course.done}/${TOTAL_LESSONS}`, label: 'Lecciones' },
          { value: `${course.topicsDone}/${TOTAL_TOPICS}`, label: 'Temas' },
          { value: `${course.percent}%`, label: 'Avance' },
        ].map((stat) => (
          <div key={stat.label} className="py-2.5 text-center">
            <div className="note-display note-num text-xl font-extrabold text-[var(--text)]">{stat.value}</div>
            <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 px-5 pt-4">
        <div className="flex justify-between text-sm text-[var(--text-muted)]">
          <span>Avance del curso</span>
          <span className="note-num">{course.percent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--paper-2)]">
          <div className="h-full rounded-full bg-[var(--ink)] transition-[width] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ width: `${Math.max(course.percent, 2)}%` }}></div>
        </div>
      </div>

      {footer && <div className="px-5 pt-4">{footer}</div>}

      <div className="px-5 py-4">
        <div
          className="h-5 rounded-sm opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, var(--text) 0 2px, transparent 2px 4px, var(--text) 4px 5px, transparent 5px 8px, var(--text) 8px 11px, transparent 11px 13px)',
          }}
        ></div>
      </div>

      <div className="note-shine pointer-events-none absolute inset-0"></div>
    </div>
  )
}
