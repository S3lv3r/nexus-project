import React, { useEffect, useRef } from 'react'
import { AnalysisThemeScope } from '../analysis/AnalysisThemeScope'
import { BackToAnalysisButton } from '../analysis/BackToAnalysisButton'
import { HudSidebar } from '../hud/HudSidebar'
import type { HudSection } from '../hud/HudSidebar'
import { HudStyles } from '../hud/HudStyles'
import { useMediaQuery, useViewportBreakout } from '../hud/hudHooks'
import { getTopicContent } from './content'
import { FinanceArticle } from './FinanceArticle'
import { FINANCE_CATEGORIES, FINANCE_TOOLS_VIEW } from './financeNav'
import { FinanceSubtopicBar } from './FinanceSubtopicBar'
import { FinanceTools } from './FinanceTools'
import { useFinanceNavigation } from './useFinanceNavigation'
import './financeTheme.css'

const SECTIONS: HudSection[] = [
  ...FINANCE_CATEGORIES.map(({ id, label, icon }) => ({ id, label, icon })),
  { id: FINANCE_TOOLS_VIEW, label: 'Herramientas', icon: 'calculator' },
]

/**
 * Finanzas personales.
 *  - Barra lateral: las 5 categorías y la vista de herramientas.
 *  - Barra inferior: los subtemas de la categoría actual (desplazamiento horizontal).
 *  - Centro: el contenido de lectura, con la página desplazándose de forma normal.
 */
export const FinanceHud: React.FC<{ header: React.ReactNode }> = ({ header }) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const naturalWidth = useViewportBreakout(rootRef, isDesktop)
  const nav = useFinanceNavigation()
  const { view, category, subtopic, subtopicIndex, categoryIndex } = nav

  // al cambiar de tema, vuelve al inicio del contenido si quedó arriba de la pantalla
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (view === 'tools' && nav.focusedTool) return
    const el = contentRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top
    if (top < 0) window.scrollTo({ top: window.scrollY + top - 96, behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, categoryIndex, subtopicIndex])

  // en móvil las categorías se desplazan de lado: deja visible la seleccionada
  useEffect(() => {
    if (isDesktop) return
    const tab = document.getElementById(`hud-tab-${SECTIONS[nav.sidebarIndex].id}`)
    const list = tab?.parentElement
    if (!tab || !list) return
    list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' })
  }, [isDesktop, nav.sidebarIndex])

  const lastSection = SECTIONS.length - 1

  return (
    <AnalysisThemeScope>
      <div
        ref={rootRef}
        role="region"
        aria-label="Finanzas personales"
        style={naturalWidth ? ({ '--hud-w': `calc(${naturalWidth}px - 16.5rem)` } as React.CSSProperties) : undefined}
        className="finance-scope relative isolate mx-auto w-full max-w-7xl py-4"
      >
        <HudStyles />
        <div aria-hidden="true" className="fin-backdrop" />

        <p aria-live="polite" className="sr-only">
          {view === 'tools'
            ? 'Herramientas'
            : `${category.label}. Tema ${subtopicIndex + 1} de ${category.subtopics.length}: ${subtopic.title}`}
        </p>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-5 lg:grid-cols-[minmax(15rem,1fr)_minmax(0,var(--hud-w,63.5rem))_1fr] lg:gap-y-6 lg:px-6">
          <header className="lg:col-start-2 lg:row-start-1">{header}</header>

          <HudSidebar
            sections={SECTIONS}
            index={nav.sidebarIndex}
            onSelect={nav.selectSidebar}
            onPrev={() => nav.selectSidebar(Math.max(0, nav.sidebarIndex - 1))}
            onNext={() => nav.selectSidebar(Math.min(lastSection, nav.sidebarIndex + 1))}
            className="min-w-0 lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start"
            hintTitle="Cambia de categoría"
            hintText="con la lista o con estas flechas"
            mobileGrid="grid-flow-col auto-cols-max overflow-x-auto [scrollbar-width:none] lg:grid-flow-row lg:auto-cols-auto lg:overflow-visible"
            topAction={<BackToAnalysisButton />}
          />

          <div ref={contentRef} className="min-w-0 scroll-mt-24 lg:col-start-2 lg:row-start-2">
            {view === 'tools' ? (
              <FinanceTools focusedTool={nav.focusedTool} />
            ) : (
              <>
                <FinanceArticle
                  category={category}
                  subtopic={subtopic}
                  subtopicIndex={subtopicIndex}
                  content={getTopicContent(category.id, subtopic.id)}
                />
                <FinanceSubtopicBar
                  categoryLabel={category.label}
                  subtopics={category.subtopics}
                  index={subtopicIndex}
                  onSelect={nav.selectSubtopic}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </AnalysisThemeScope>
  )
}
