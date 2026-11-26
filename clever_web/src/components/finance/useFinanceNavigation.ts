import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FINANCE_CATEGORIES, FINANCE_TOOLS_VIEW } from './financeNav'
import type { FinanceToolId } from './types'
import { TOOL_BY_ID } from './tools'

/**
 * Estado de navegación de Finanzas personales guardado en la URL:
 *   ?categoria=<id>&tema=<id>            → un subtema
 *   ?vista=herramientas&herramienta=<id> → la vista de herramientas
 * Así cada tema tiene un enlace propio y recargar la página no pierde la posición.
 */
export function useFinanceNavigation() {
  const [params, setParams] = useSearchParams()

  const view: 'topic' | 'tools' = params.get('vista') === FINANCE_TOOLS_VIEW ? 'tools' : 'topic'
  const categoryIndex = Math.max(0, FINANCE_CATEGORIES.findIndex((c) => c.id === params.get('categoria')))
  const category = FINANCE_CATEGORIES[categoryIndex]
  const subtopicIndex = Math.max(0, category.subtopics.findIndex((s) => s.id === params.get('tema')))
  const subtopic = category.subtopics[subtopicIndex]
  const rawTool = params.get('herramienta')
  const focusedTool = rawTool && rawTool in TOOL_BY_ID ? (rawTool as FinanceToolId) : null

  const goTo = useCallback(
    (c: number, s: number) => {
      const cat = FINANCE_CATEGORIES[c]
      setParams({ categoria: cat.id, tema: cat.subtopics[s].id }, { replace: true })
    },
    [setParams],
  )

  const openTools = useCallback(
    (tool?: FinanceToolId) => {
      setParams(
        {
          vista: FINANCE_TOOLS_VIEW,
          ...(tool ? { herramienta: tool } : {}),
          categoria: category.id,
          tema: subtopic.id,
        },
        { replace: true },
      )
    },
    [setParams, category.id, subtopic.id],
  )

  /** índice de la barra lateral: las categorías y, al final, Herramientas */
  const sidebarIndex = view === 'tools' ? FINANCE_CATEGORIES.length : categoryIndex
  const selectSidebar = useCallback(
    (i: number) => (i >= FINANCE_CATEGORIES.length ? openTools() : goTo(i, 0)),
    [goTo, openTools],
  )

  return {
    view,
    category,
    categoryIndex,
    subtopic,
    subtopicIndex,
    focusedTool,
    sidebarIndex,
    selectSidebar,
    selectSubtopic: (i: number) => goTo(categoryIndex, i),
    goTo,
    openTools,
  }
}
