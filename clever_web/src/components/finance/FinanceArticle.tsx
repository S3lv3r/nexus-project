import React from 'react'
import { HUD_ICONS } from '../hud/HudIcons'
import { Bullets, DataTable, Section } from './FinanceBlocks'
import { FinanceVisual } from './FinanceVisuals'
import type { FinanceCategory, FinanceSubtopic, FinanceTopicContent } from './types'

interface FinanceArticleProps {
  category: FinanceCategory
  subtopic: FinanceSubtopic
  subtopicIndex: number
  content: FinanceTopicContent | null
}

const Info = HUD_ICONS.info
const Alert = HUD_ICONS.alert

/**
 * Artículo de un subtema, en cuatro partes:
 * introducción, explicación, ejemplo práctico y puntos importantes.
 */
export const FinanceArticle: React.FC<FinanceArticleProps> = ({ category, subtopic, subtopicIndex, content }) => {
  const total = category.subtopics.length

  return (
    <article id={`hud-panel-${category.id}`} aria-labelledby="fin-topic-title" className="fin-panel overflow-hidden">
      <span aria-hidden="true" className="fin-panel-top" />

      <div key={`${category.id}-${subtopic.id}`} className="hud-fade relative px-5 py-6 sm:px-8 sm:py-7 xl:px-10">
        {/* categoría y posición */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="fin-eyebrow">
            {category.number} · {category.label}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Tema <span className="font-semibold text-[var(--text)]">{subtopicIndex + 1}</span> de {total}
          </p>
        </div>
        <div aria-hidden="true" className="fin-steps mt-3">
          {category.subtopics.map((s, i) => (
            <span key={s.id} className="fin-step" data-on={i === subtopicIndex ? '' : undefined} data-done={i < subtopicIndex ? '' : undefined} />
          ))}
        </div>

        <div>
          <header className="mt-6">
            <h2 id="fin-topic-title" className="fin-title text-[1.625rem] font-semibold leading-tight sm:text-[1.875rem]">
              {subtopic.title}
            </h2>
            {content && <p className="fin-lead mt-3">{content.summary}</p>}

          </header>

          {content ? (
            <div className="mt-7 space-y-7">
              {/* 1. introducción */}
              <section aria-label="Introducción" className="fin-prose">
                {content.intro.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </section>

              {/* 2. explicación */}
              {content.visual && <FinanceVisual visual={content.visual} />}
              {content.sections.map((s) => (
                <Section key={s.heading} section={s} />
              ))}

              {/* 3. ejemplo práctico */}
              <section aria-labelledby="fin-example" className="fin-example p-5 sm:p-6">
                <p className="fin-section-label">Ejemplo práctico</p>
                <h3 id="fin-example" className="mt-1.5 text-base font-semibold text-[var(--text)]">
                  {content.example.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)]">{content.example.text}</p>
                {content.example.table && (
                  <div className="mt-4">
                    <DataTable table={content.example.table} />
                  </div>
                )}
                {content.example.steps && (
                  <div className="mt-4">
                    <Bullets items={content.example.steps} ordered />
                  </div>
                )}
                {content.example.conclusion && (
                  <p className="mt-4 text-[15px] font-medium leading-relaxed text-[var(--text)]">{content.example.conclusion}</p>
                )}
              </section>

              {/* 4. puntos importantes */}
              <section aria-labelledby="fin-key-points" className="fin-recap px-5 py-5 sm:px-6">
                <h3 id="fin-key-points" className="flex items-center gap-2 text-base font-semibold text-[var(--text)]">
                  <Alert className="h-[18px] w-[18px] text-[var(--fin)]" />
                  Puntos importantes
                </h3>
                <div className="fin-cols mt-3">
                  <Bullets items={content.keyPoints} />
                </div>
              </section>
            </div>
          ) : (
            <div className="fin-placeholder mt-10 px-6 py-8 text-center">
              <p className="text-sm font-semibold text-[var(--text)]">Contenido en preparación</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Este tema estará disponible próximamente.</p>
            </div>
          )}

          {content?.sources && content.sources.length > 0 && (
            <p className="mt-7 text-xs leading-relaxed text-[var(--text-dim)]">
              <span className="font-semibold text-[var(--text-muted)]">Fuentes: </span>
              {content.sources.map((s, i) => (
                <React.Fragment key={s.title}>
                  {i > 0 && ' · '}
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="fin-link">
                      {s.title}
                    </a>
                  ) : (
                    <span className="italic">{s.title}</span>
                  )}{' '}
                  ({s.publisher})
                </React.Fragment>
              ))}
            </p>
          )}

          <p className="mt-4 flex items-center gap-2 border-t border-[var(--border)] pt-5 text-xs text-[var(--text-dim)]">
            <Info className="h-3.5 w-3.5" />
            Contenido educativo. No constituye asesoría financiera personalizada.
          </p>
        </div>
      </div>
    </article>
  )
}
