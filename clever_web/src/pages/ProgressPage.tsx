import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { COURSE_ID, COURSE_LESSONS, COURSE_TOPICS, TOTAL_LESSONS, getCourseProgress, lessonPath } from '../data/course'
import { Microtext, NOTE_STYLES, ROSETTE_SMALL, Rosette, SmallRosette } from '../components/note/NoteKit'

const PROGRESS_STYLES = `
.pg-ring{transition:stroke-dasharray 1s cubic-bezier(.23,1,.32,1)}
.pg-row{transition:background-color .15s}
.pg-chevron{transition:transform .25s cubic-bezier(.23,1,.32,1)}
.pg-open{animation:pg-open .35s cubic-bezier(.23,1,.32,1) both}
@keyframes pg-open{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.pg-ring,.pg-chevron{transition:none}.pg-open{animation:none}}
`

const formatDate = (value?: number) =>
  value ? new Date(value).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

const ProgressRing: React.FC<{ percent: number }> = ({ percent }) => {
  const radius = 64
  const circumference = 2 * Math.PI * radius
  return (
    <div className="relative h-52 w-52 shrink-0" role="img" aria-label={`${percent}% del curso completado`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={ROSETTE_SMALL} fill="none" stroke="var(--ink)" strokeWidth="0.35" strokeOpacity="0.55" />
      </svg>
      <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="80" cy="80" r={radius} fill="var(--surface)" stroke="var(--paper-2)" strokeWidth="7" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(circumference * percent) / 100} ${circumference}`}
          className="pg-ring"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="note-display note-num text-5xl font-black leading-none text-[var(--text)]">
          {percent}
          <span className="text-2xl text-[var(--text-muted)]">%</span>
        </span>
        <span className="mt-1 text-sm text-[var(--text-muted)]">del curso</span>
      </div>
    </div>
  )
}

const GuestProgress: React.FC = () => (
  <div className="note-home mx-auto max-w-3xl py-10">
    <style>{NOTE_STYLES}</style>
    <section className="note-paper relative overflow-hidden rounded-[28px] p-8 text-center sm:p-12">
      <Rosette className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 opacity-60" />
      <div className="relative">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ink)] text-2xl text-[var(--bg)]">
          <i className="fa-solid fa-chart-pie"></i>
        </span>
        <h1 className="note-display mt-6 text-[40px] font-black leading-[0.95] text-[var(--text)]">Tu progreso vive en tu cuenta</h1>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-[var(--text-muted)]">
          Crea tu cuenta para guardar cada lección que termines y ver tu avance tema por tema.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="note-btn note-btn-ink">
            Crear cuenta gratis
            <i className="fa-solid fa-arrow-right text-[13px]"></i>
          </Link>
          <Link to="/login" className="note-btn note-btn-line">
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </section>
  </div>
)

export const ProgressPage: React.FC = () => {
  const { user, isGuest } = usePlatform()
  const course = getCourseProgress(user.moduleProgress)
  const [openTopic, setOpenTopic] = useState<number | null>(course.isDone ? null : course.next.topicIndex)

  if (isGuest) return <GuestProgress />

  const surveys = user.lessonSurveys?.[COURSE_ID] || {}
  const ratings = Object.values(surveys)
    .map((survey) => survey.clarity)
    .filter((value): value is number => typeof value === 'number')
  const averageClarity = ratings.length ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1).replace('.', ',') : null
  const history = COURSE_LESSONS.filter((lesson) => course.completed.has(lesson.index))
    .map((lesson) => ({ lesson, at: surveys[lesson.index]?.completedAt }))
    .sort((a, b) => (b.at || 0) - (a.at || 0))
    .slice(0, 5)

  const facts = [
    { value: `${course.done}/${TOTAL_LESSONS}`, label: 'Lecciones completadas' },
    { value: `${course.topicsDone}/${COURSE_TOPICS.length}`, label: 'Temas terminados' },
    { value: `${course.percent}%`, label: 'Del curso completado' },
    { value: averageClarity ? `${averageClarity}/5` : 'Sin datos', label: 'Claridad promedio que reportaste' },
  ]

  return (
    <div className="note-home mx-auto max-w-6xl space-y-10 py-6">
      <style>{NOTE_STYLES}</style>
      <style>{PROGRESS_STYLES}</style>

      <header className="note-bill note-paper note-enter relative isolate overflow-hidden rounded-[28px]">
        <Rosette className="pointer-events-none absolute -right-36 -top-44 -z-10 h-[520px] w-[520px] opacity-80" />
        <div className="absolute inset-x-6 top-4 sm:inset-x-8">
          <Microtext />
        </div>
        <div className="grid items-center gap-10 px-6 pb-10 pt-12 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14 lg:pb-12 lg:pt-14">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="note-wide text-sm font-extrabold text-[var(--ink)]">MI PROGRESO</span>
              <span className="h-px w-10 bg-[var(--rule)]"></span>
              <span className="note-num text-sm text-[var(--text-muted)]">{course.isDone ? 'Curso completado' : `Tema ${course.currentTopic.number} en curso`}</span>
            </div>
            <h1 className="note-display mt-6 text-[clamp(2.4rem,5vw,4.2rem)] font-black leading-[0.98] text-[var(--text)] [text-wrap:balance]">
              {course.isDone ? 'Terminaste el curso completo.' : course.done ? 'Vas por buen camino.' : 'Tu camino empieza aquí.'}
            </h1>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-[var(--text-muted)]">
              {course.isDone
                ? 'Repasa cualquier lección cuando lo necesites. Todo tu avance queda guardado.'
                : `Llevas ${course.done} de ${TOTAL_LESSONS} lecciones. Lo siguiente es la lección ${course.next.id}: ${course.next.title}.`}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={lessonPath(course.resumeIndex)} className="note-btn note-btn-ink">
                <i className="fa-solid fa-play text-sm"></i>
                {course.isDone ? 'Repasar' : course.done ? 'Continuar' : 'Empezar'}
              </Link>
              <Link to="/aprender" className="note-btn note-btn-line">
                Ver el mapa
              </Link>
            </div>
          </div>
          <div className="mx-auto">
            <ProgressRing percent={course.percent} />
          </div>
        </div>
      </header>

      <dl className="grid grid-cols-2 overflow-hidden rounded-[24px] border border-[var(--rule)] bg-[var(--surface)] lg:grid-cols-4">
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={`p-5 sm:p-6 ${index % 2 === 1 ? 'border-l border-dashed border-[var(--rule)]' : ''} ${index >= 2 ? 'border-t border-dashed border-[var(--rule)] lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}
          >
            <dd className="note-display note-num text-3xl font-black leading-none text-[var(--text)] sm:text-4xl">{fact.value}</dd>
            <dt className="mt-2 text-sm leading-snug text-[var(--text-muted)]">{fact.label}</dt>
          </div>
        ))}
      </dl>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3 border-b border-[var(--rule)] pb-4">
            <h2 className="note-display text-3xl font-black leading-tight text-[var(--text)]">Tema por tema</h2>
            <span className="note-num text-sm text-[var(--text-muted)]">Toca un tema para ver sus lecciones</span>
          </div>
          {course.topicStats.map(({ topic, done, total }, topicIndex) => {
            const isOpen = openTopic === topicIndex
            const isComplete = done === total
            const isCurrent = !course.isDone && topicIndex === course.next.topicIndex
            const lessons = COURSE_LESSONS.filter((lesson) => lesson.topicIndex === topicIndex)
            return (
              <article key={topic.number} className={`note-card overflow-hidden ${isCurrent ? 'ring-2 ring-[var(--ink)]' : ''}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenTopic(isOpen ? null : topicIndex)}
                  className="pg-row flex w-full items-center gap-4 p-5 text-left hover:bg-[var(--paper)]"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg ${
                      isComplete || isCurrent ? 'bg-[var(--ink)] text-[var(--bg)]' : 'bg-[var(--paper-2)] text-[var(--ink)]'
                    }`}
                  >
                    <i className={isComplete ? 'fa-solid fa-check' : topic.icon}></i>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="note-wide block text-[10px] font-extrabold text-[var(--ink)]">
                      TEMA {topic.number}
                      {isCurrent ? ' · EN CURSO' : isComplete ? ' · TERMINADO' : ''}
                    </span>
                    <span className="note-display block text-lg font-bold leading-snug text-[var(--text)]">{topic.title}</span>
                    <span className="mt-2 flex items-center gap-3">
                      <span className="flex flex-1 gap-1">
                        {lessons.map((lesson) => (
                          <span key={lesson.id} className={`h-1.5 flex-1 rounded-full ${course.completed.has(lesson.index) ? 'bg-[var(--ink)]' : 'bg-[var(--rule)]'}`}></span>
                        ))}
                      </span>
                      <span className="note-num shrink-0 text-[13px] text-[var(--text-muted)]">
                        {done}/{total}
                      </span>
                    </span>
                  </span>
                  <i className={`pg-chevron fa-solid fa-chevron-down text-xs text-[var(--text-muted)] ${isOpen ? 'rotate-180' : ''}`}></i>
                </button>
                {isOpen && (
                  <ol className="pg-open divide-y divide-[var(--rule)] border-t border-[var(--rule)]">
                    {lessons.map((lesson) => {
                      const isDone = course.completed.has(lesson.index)
                      const isNext = !course.isDone && lesson.index === course.resumeIndex
                      const canOpen = isDone || isNext
                      const survey = surveys[lesson.index]
                      const content = (
                        <>
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] ${
                              isDone ? 'bg-[var(--ink)] text-[var(--bg)]' : isNext ? 'border-2 border-[var(--ink)] text-[var(--ink)]' : 'border border-dashed border-[var(--rule)] text-[var(--text-dim)]'
                            }`}
                          >
                            <i className={isDone ? 'fa-solid fa-check' : isNext ? 'fa-solid fa-play' : 'fa-solid fa-lock'}></i>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-baseline gap-x-2">
                              <span className="note-num text-sm font-bold text-[var(--ink)]">{lesson.id}</span>
                              <span className={`text-[15px] font-semibold leading-snug ${canOpen ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>{lesson.title}</span>
                            </span>
                            <span className="mt-0.5 block text-[13px] text-[var(--text-muted)]">
                              {lesson.level}
                              {isDone && survey?.completedAt ? ` · Completada el ${formatDate(survey.completedAt)}` : ''}
                              {isDone && typeof survey?.clarity === 'number' ? ` · Claridad ${survey.clarity}/5` : ''}
                            </span>
                          </span>
                          {canOpen && <i className="fa-solid fa-arrow-right text-xs text-[var(--text-dim)]"></i>}
                        </>
                      )
                      return (
                        <li key={lesson.id}>
                          {canOpen ? (
                            <Link to={lessonPath(lesson.index)} className="pg-row flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--paper)]">
                              {content}
                            </Link>
                          ) : (
                            <div className="flex items-center gap-4 px-5 py-3.5">{content}</div>
                          )}
                        </li>
                      )
                    })}
                  </ol>
                )}
              </article>
            )
          })}
        </section>

        <aside className="space-y-5 lg:sticky lg:top-24">
          {!course.isDone && (
            <section className="note-paper relative isolate overflow-hidden rounded-[20px] p-6">
              <SmallRosette className="pointer-events-none absolute -bottom-10 -right-10 -z-10 h-36 w-36 opacity-60" />
              <div className="note-wide text-[11px] font-extrabold text-[var(--ink)]">TU SIGUIENTE PASO</div>
              <h2 className="note-display mt-2 text-xl font-extrabold leading-snug text-[var(--text)]">
                {course.next.id} &middot; {course.next.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)]">{course.next.objective}.</p>
              <Link to={lessonPath(course.resumeIndex)} className="note-btn note-btn-ink mt-5 w-full">
                Ir a la lección
                <i className="fa-solid fa-arrow-right text-sm"></i>
              </Link>
            </section>
          )}

          <section className="note-card p-6">
            <h2 className="note-display text-xl font-extrabold text-[var(--text)]">Últimas lecciones</h2>
            {history.length ? (
              <ol className="mt-4 space-y-3">
                {history.map(({ lesson, at }) => (
                  <li key={lesson.id} className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-check mt-1 text-sm text-[var(--ink)]"></i>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold leading-snug text-[var(--text)]">
                        {lesson.id} {lesson.title}
                      </span>
                      {at && <span className="note-num text-xs text-[var(--text-muted)]">{formatDate(at)}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-muted)]">Aún no completas lecciones. Cuando termines la primera, aparecerá aquí.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
