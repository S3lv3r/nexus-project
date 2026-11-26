import React, { useRef } from 'react'
import { HUD_ICONS } from '../hud/HudIcons'
import type { FinanceSubtopic } from './types'

interface FinanceSubtopicBarProps {
  categoryLabel: string
  subtopics: FinanceSubtopic[]
  index: number
  onSelect: (i: number) => void
}

const Left = HUD_ICONS.chevronLeft
const Right = HUD_ICONS.chevronRight

/**
 * Barra inferior de subtemas: solo puntos.
 * El punto del tema que se está leyendo se agranda; el nombre de cada tema aparece al pasar el mouse
 * y lo leen los lectores de pantalla.
 */
export const FinanceSubtopicBar: React.FC<FinanceSubtopicBarProps> = ({ categoryLabel, subtopics, index, onSelect }) => {
  const listRef = useRef<HTMLDivElement>(null)

  // ← → dentro de la lista de puntos
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const nextIndex = e.key === 'ArrowLeft' ? Math.max(0, index - 1) : Math.min(subtopics.length - 1, index + 1)
    onSelect(nextIndex)
    listRef.current?.querySelector<HTMLElement>(`[data-index="${nextIndex}"]`)?.focus()
  }

  return (
    <nav
      aria-label={`Subtemas de ${categoryLabel}`}
      className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-20 mt-5 flex justify-center md:bottom-3"
    >
      <div className="fin-subbar flex max-w-full items-center gap-1 rounded-full p-1.5">
        <button type="button" onClick={() => onSelect(index - 1)} disabled={index === 0} aria-label="Subtema anterior" className="fin-arrow">
          <Left className="h-[18px] w-[18px]" />
        </button>

        <div
          ref={listRef}
          role="tablist"
          aria-label={`Subtemas de ${categoryLabel}`}
          onKeyDown={onKeyDown}
          className="flex min-w-0 flex-wrap items-center justify-center px-1.5"
        >
          {subtopics.map((s, i) => {
            const on = i === index
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                data-index={i}
                aria-selected={on}
                aria-controls="fin-topic-title"
                aria-label={`${i + 1}. ${s.title}`}
                title={s.title}
                tabIndex={on ? 0 : -1}
                onClick={() => onSelect(i)}
                className="fin-dot"
              >
                <span className="fin-dot-mark" />
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onSelect(index + 1)}
          disabled={index === subtopics.length - 1}
          aria-label="Subtema siguiente"
          className="fin-arrow"
        >
          <Right className="h-[18px] w-[18px]" />
        </button>
      </div>
    </nav>
  )
}
