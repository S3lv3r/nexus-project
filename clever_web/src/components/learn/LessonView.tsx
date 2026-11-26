import React, { useEffect, useState } from 'react'
import type { CourseLessonEntry } from '../../data/course'
import { COURSE_TOPICS, TOTAL_LESSONS } from '../../data/course'
import type { CourseLessonDetail } from '../../data/courseTypes'
import { Rosette, SmallRosette } from '../note/NoteKit'
import { LESSON_DIAGRAMS } from './LessonDiagrams'

interface LessonViewProps {
  lesson: CourseLessonEntry
  learningStyle?: string
  isDone: boolean
  onOpenPath: () => void
  onOpenStyle: () => void
  footer: React.ReactNode
}

type SectionId = 'intro' | 'content' | 'examples' | 'support' | 'activities' | 'summary'

const SECTION_LABELS: Record<SectionId, string> = {
  intro: 'Introducción',
  content: 'Contenido',
  examples: 'Ejemplos',
  support: 'Material de apoyo',
  activities: 'Actividades',
  summary: 'Resumen',
}

const INTRO_ICONS: Record<string, string> = {
  Presentación: 'fa-solid fa-bullhorn',
  Importancia: 'fa-solid fa-star',
  Situación: 'fa-solid fa-user-tie',
  'Pregunta inicial': 'fa-solid fa-circle-question',
}

let detailsCache: Record<string, CourseLessonDetail> | null = null

const useLessonDetail = (id: string) => {
  const [details, setDetails] = useState<Record<string, CourseLessonDetail> | null>(detailsCache)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (detailsCache) return
    let alive = true
    import('../../data/courseContent')
      .then((module) => {
        detailsCache = module.LESSON_DETAILS
        if (alive) setDetails(module.LESSON_DETAILS)
      })
      .catch(() => {
        if (alive) setFailed(true)
      })
    return () => {
      alive = false
    }
  }, [])
  return { detail: details ? details[id] : null, failed }
}

const SectionTitle: React.FC<{ id: SectionId; number: number; icon: string }> = ({ id, number, icon }) => (
  <div className="mb-5 flex items-center gap-3">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[14px] text-[var(--bg)]">
      <i className={icon}></i>
    </span>
    <div>
      <div className="note-num note-wide text-[10px] font-extrabold text-[var(--ink)]">{String(number).padStart(2, '0')}</div>
      <h2 className="note-display text-2xl font-black leading-tight text-[var(--text)]">{SECTION_LABELS[id]}</h2>
    </div>
  </div>
)

const TermText: React.FC<{ term: string; text: string }> = ({ term, text }) => (
  <p className="text-[16px] leading-relaxed text-[var(--text)]">
    {term && <strong className="font-bold text-[var(--text)]">{term}{text ? ': ' : ''}</strong>}
    {text}
  </p>
)

export const LessonView: React.FC<LessonViewProps> = ({ lesson, learningStyle, isDone, onOpenPath, onOpenStyle, footer }) => {
  const { detail, failed } = useLessonDetail(lesson.id)
  const topic = COURSE_TOPICS[lesson.topicIndex]
  const diagram = LESSON_DIAGRAMS[lesson.id]
  const practiceFirst = learningStyle === 'Quiero aprender haciendo'
  const examplesFirst = learningStyle === 'Explícamelo fácil'

  const available: SectionId[] = detail
    ? (
        [
          'intro',
          ...(practiceFirst ? (['activities'] as SectionId[]) : []),
          ...(examplesFirst ? (['examples', 'content'] as SectionId[]) : (['content', 'examples'] as SectionId[])),
          'support',
          ...(practiceFirst ? [] : (['activities'] as SectionId[])),
          'summary',
        ] as SectionId[]
      ).filter((id) => {
        if (id === 'intro') return detail.intro.length > 0
        if (id === 'content') return detail.content.length > 0
        if (id === 'examples') return detail.examples.length > 0
        if (id === 'support') return detail.tables.length > 0 || Boolean(diagram)
        if (id === 'activities') return detail.activities.length > 0
        return detail.summary.length > 0
      })
    : []

  const scrollTo = (id: SectionId) => document.getElementById(`leccion-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const renderSection = (id: SectionId, number: number) => {
    if (!detail) return null
    if (id === 'intro') {
      return (
        <section key={id} id={`leccion-${id}`} className="scroll-mt-28">
          <SectionTitle id={id} number={number} icon="fa-solid fa-door-open" />
          <div className="grid gap-3 sm:grid-cols-2">
            {detail.intro.map((item) => {
              const isQuestion = item.label === 'Pregunta inicial'
              const isWide = isQuestion || detail.intro.filter((entry) => entry.label !== 'Pregunta inicial').length % 2 === 1
              return (
                <div
                  key={item.label}
                  className={`rounded-[20px] border p-5 ${isWide ? 'sm:col-span-2' : ''} ${isQuestion ? 'border-[var(--ink)] bg-[color-mix(in_srgb,var(--ink)_7%,var(--surface))]' : 'border-[var(--rule)] bg-[var(--surface)]'}`}
                >
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--ink)]">
                    <i className={`${INTRO_ICONS[item.label] || 'fa-solid fa-circle-info'} text-[12px]`}></i>
                    {item.label}
                  </div>
                  <p className={`mt-2 leading-relaxed text-[var(--text)] ${isQuestion ? 'note-display text-lg font-bold' : 'text-[15.5px]'}`}>{item.text}</p>
                </div>
              )
            })}
          </div>
        </section>
      )
    }
    if (id === 'content') {
      return (
        <section key={id} id={`leccion-${id}`} className="scroll-mt-28">
          <SectionTitle id={id} number={number} icon="fa-solid fa-book-open" />
          <div className="space-y-4">
            {detail.content.map((block) => (
              <article key={block.term || block.text} className="note-card p-5 sm:p-6">
                {block.term && <h3 className="note-display text-[19px] font-extrabold leading-snug text-[var(--text)]">{block.term}</h3>}
                {block.text && <p className="mt-2 text-[16px] leading-relaxed text-[var(--text)]">{block.text}</p>}
                {block.points.length > 0 && (
                  <ul className="mt-3 space-y-2.5 border-l-2 border-[var(--rule)] pl-4">
                    {block.points.map((point) => (
                      <li key={point.term + point.text}>
                        <TermText term={point.term} text={point.text} />
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )
    }
    if (id === 'examples') {
      return (
        <section key={id} id={`leccion-${id}`} className="scroll-mt-28">
          <SectionTitle id={id} number={number} icon="fa-regular fa-lightbulb" />
          <div className="space-y-4">
            {detail.examples.map((example) => (
              <article key={example.term || example.text} className="note-paper relative isolate overflow-hidden rounded-[20px] p-5 sm:p-6">
                <SmallRosette className="pointer-events-none absolute -bottom-12 -right-12 -z-10 h-40 w-40 opacity-50" />
                {example.term && <h3 className="note-display text-[19px] font-extrabold text-[var(--text)]">{example.term}</h3>}
                {example.text && <p className="mt-2 text-[16px] leading-relaxed text-[var(--text)]">{example.text}</p>}
                {example.points.length > 0 && (
                  <ol className="mt-3 space-y-2">
                    {example.points.map((point, index) => (
                      <li key={point} className="flex gap-3 text-[15.5px] leading-relaxed text-[var(--text)]">
                        <span className="note-num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--surface)] text-[11px] font-bold text-[var(--ink)]">
                          {index + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            ))}
          </div>
        </section>
      )
    }
    if (id === 'support') {
      return (
        <section key={id} id={`leccion-${id}`} className="scroll-mt-28">
          <SectionTitle id={id} number={number} icon="fa-solid fa-table-list" />
          <div className="space-y-4">
            {diagram && (
              <figure className="note-card p-5 sm:p-6">
                <figcaption className="mb-4 text-[15px] font-bold text-[var(--text)]">{diagram.title}</figcaption>
                <div className="mx-auto max-w-[560px]">{diagram.render()}</div>
              </figure>
            )}
            {detail.tables.map((table) => (
              <div key={table.header.join('|')} className="note-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left text-[14.5px]">
                    <thead>
                      <tr className="bg-[var(--ink)] text-[var(--bg)]">
                        {table.header.map((cell) => (
                          <th key={cell} scope="col" className="px-4 py-3 font-bold">
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row) => (
                        <tr key={row.join('|')} className="border-t border-[var(--rule)] odd:bg-[var(--surface)] even:bg-[var(--paper)]">
                          {row.map((cell, index) =>
                            index === 0 ? (
                              <th key={index} scope="row" className="px-4 py-3 align-top font-bold text-[var(--text)]">
                                {cell}
                              </th>
                            ) : (
                              <td key={index} className="px-4 py-3 align-top leading-relaxed text-[var(--text)]">
                                {cell}
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      )
    }
    if (id === 'activities') {
      return (
        <section key={id} id={`leccion-${id}`} className="scroll-mt-28">
          <SectionTitle id={id} number={number} icon="fa-solid fa-pen-ruler" />
          <ol className="grid gap-3">
            {detail.activities.map((activity, index) => (
              <li key={activity} className="note-card flex gap-4 p-5">
                <span className="note-display note-num flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[var(--ink)] text-[15px] font-black text-[var(--ink)]">
                  {index + 1}
                </span>
                <p className="text-[15.5px] leading-relaxed text-[var(--text)]">{activity}</p>
              </li>
            ))}
          </ol>
        </section>
      )
    }
    return (
      <section key={id} id={`leccion-${id}`} className="scroll-mt-28">
        <SectionTitle id={id} number={number} icon="fa-solid fa-flag-checkered" />
        <div className="note-bill relative isolate overflow-hidden rounded-[20px] bg-[var(--ink)] p-6 text-[var(--bg)] sm:p-7">
          <div className="space-y-3">
            {detail.summary.map((paragraph) => {
              const parts = paragraph.match(/^([^:]{3,60}):\s*(.*)$/)
              return (
                <p key={paragraph} className="text-[16.5px] leading-relaxed">
                  {parts ? (
                    <>
                      <strong>{parts[1]}:</strong> {parts[2]}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="note-home mx-auto max-w-6xl space-y-8 py-6">
      <nav aria-label="Ruta" className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
        <button type="button" onClick={onOpenPath} className="font-semibold transition-colors hover:text-[var(--ink)]">
          Aprender
        </button>
        <i className="fa-solid fa-chevron-right text-[10px] text-[var(--text-dim)]"></i>
        <button type="button" onClick={onOpenPath} className="font-semibold transition-colors hover:text-[var(--ink)]">
          Tema {topic.number} · {topic.shortTitle}
        </button>
        <i className="fa-solid fa-chevron-right text-[10px] text-[var(--text-dim)]"></i>
        <span className="note-num">Lección {lesson.id}</span>
      </nav>

      <header className="note-bill note-paper relative isolate overflow-hidden rounded-[28px] p-7 sm:p-10">
        <Rosette className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[460px] w-[460px]" />
        <div className="flex flex-wrap items-center gap-3">
          <span className="note-wide text-xs font-extrabold text-[var(--ink)]">TEMA {topic.number} &middot; {topic.shortTitle.toUpperCase()}</span>
          <span className="h-px w-8 bg-[var(--rule)]"></span>
          <span className="note-num text-sm text-[var(--text-muted)]">
            Lección {lesson.id} &middot; {lesson.index + 1} de {TOTAL_LESSONS}
          </span>
          {isDone && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-2.5 py-0.5 text-xs font-bold text-[var(--bg)]">
              <i className="fa-solid fa-check text-[10px]"></i>
              Completada
            </span>
          )}
        </div>
        <h1 className="note-display mt-4 max-w-[24ch] text-[clamp(2rem,4.4vw,3.4rem)] font-black leading-[1.02] text-[var(--text)] [text-wrap:balance]">{lesson.title}</h1>
        <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-[var(--text-muted)]">{lesson.description}.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--surface)] px-3 py-1.5 text-sm font-semibold text-[var(--text)]">
            <i className="fa-solid fa-signal text-xs text-[var(--ink)]"></i>
            {lesson.level}
          </span>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="min-w-0 space-y-12">
          <section className="note-card flex gap-4 p-5 sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] text-[var(--ink)]">
              <i className="fa-solid fa-bullseye"></i>
            </span>
            <div>
              <h2 className="note-display text-lg font-extrabold text-[var(--text)]">Objetivo de la lección</h2>
              <p className="mt-1 text-[16px] leading-relaxed text-[var(--text)]">{lesson.objective}.</p>
            </div>
          </section>

          {!detail && !failed && (
            <div className="space-y-4" aria-busy="true" aria-label="Cargando lección">
              {[0, 1, 2].map((item) => (
                <div key={item} className="note-card h-32 animate-pulse bg-[var(--paper)]"></div>
              ))}
            </div>
          )}
          {failed && (
            <div className="note-card p-6 text-[15px] text-[var(--text)]">
              No pudimos cargar el contenido de esta lección. Revisa tu conexión y vuelve a intentarlo.
            </div>
          )}
          {available.map((id, index) => renderSection(id, index + 1))}
          {detail && footer}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          {available.length > 0 && (
            <nav aria-label="Secciones de la lección" className="note-card p-5">
              <div className="note-wide text-[10px] font-extrabold text-[var(--ink)]">EN ESTA LECCIÓN</div>
              <ol className="mt-3 space-y-1">
                {available.map((id, index) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(id)}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-[15px] font-medium text-[var(--text)] transition-colors hover:bg-[var(--paper)]"
                    >
                      <span className="note-num w-5 text-xs font-bold text-[var(--text-muted)]">{String(index + 1).padStart(2, '0')}</span>
                      {SECTION_LABELS[id]}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="note-card p-5">
            <div className="note-wide text-[10px] font-extrabold text-[var(--ink)]">PALABRAS CLAVE</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {lesson.keywords.map((keyword) => (
                <span key={keyword} className="rounded-full border border-[var(--rule)] bg-[var(--paper)] px-2.5 py-1 text-[13px] font-medium text-[var(--text)]">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <button type="button" onClick={onOpenStyle} className="note-card note-link group flex w-full items-center gap-4 p-5 text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] text-[var(--ink)]">
              <i className="fa-solid fa-sliders"></i>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-[var(--text-muted)]">Tu forma de aprender</span>
              <span className="note-display block text-base font-bold text-[var(--text)]">{learningStyle || 'Elegir estilo'}</span>
            </span>
            <i className="fa-solid fa-arrow-right text-sm text-[var(--text-dim)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--ink)]"></i>
          </button>
        </aside>
      </div>
    </div>
  )
}
