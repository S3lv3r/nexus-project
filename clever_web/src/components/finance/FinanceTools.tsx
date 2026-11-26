import React, { Suspense, useEffect } from 'react'
import { HUD_ICONS } from '../hud/HudIcons'
import { FINANCE_TOOLS, TOOL_COMPONENTS } from './tools'
import type { FinanceTool, FinanceToolId } from './types'


const ToolPanel: React.FC<{ tool: FinanceTool; focused: boolean }> = ({ tool, focused }) => {
  const Icon = HUD_ICONS[tool.icon]
  const Implementation = TOOL_COMPONENTS[tool.id]

  return (
    <section id={`fin-tool-${tool.id}`} aria-labelledby={`fin-tool-${tool.id}-title`} data-focus={focused ? '' : undefined} className="fin-tool scroll-mt-28 p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="fin-icon h-11 w-11">
          <Icon className="h-5 w-5" />
        </span>
        {!Implementation && <span className="fin-badge">En desarrollo</span>}
      </div>

      <h3 id={`fin-tool-${tool.id}-title`} className="mt-4 text-lg font-semibold tracking-tight text-[var(--text)]">
        {tool.name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{tool.description}</p>

      {Implementation ? (
        <div className="mt-5">
          <Suspense fallback={<p className="text-sm text-[var(--text-muted)]">Cargando herramienta…</p>}>
            <Implementation />
          </Suspense>
        </div>
      ) : (
        <>
          <div className="mt-auto pt-6">
            <button
              type="button"
              disabled
              className="flex h-10 w-full cursor-not-allowed items-center justify-center rounded-xl bg-[var(--surface-alt)] text-sm font-medium text-[var(--text-dim)]"
            >
              Próximamente
            </button>
          </div>
        </>
      )}
    </section>
  )
}

interface FinanceToolsProps {
  focusedTool: FinanceToolId | null
}

/** Espacio de herramientas interactivas. Cada una se activa al registrarla en TOOL_COMPONENTS. */
export const FinanceTools: React.FC<FinanceToolsProps> = ({ focusedTool }) => {
  useEffect(() => {
    if (!focusedTool) return
    document.getElementById(`fin-tool-${focusedTool}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [focusedTool])

  return (
    <div id="hud-panel-herramientas" className="fin-panel hud-fade overflow-hidden">
      <span aria-hidden="true" className="fin-panel-top" />
      <div className="relative px-5 py-7 sm:px-9 sm:py-9 xl:px-12">
        <header className="max-w-3xl">
          <p className="fin-eyebrow">Herramientas educativas</p>
          <h2 className="fin-title mt-2 text-[1.75rem] font-semibold leading-tight sm:text-[2.125rem]">Practica con tus propios números</h2>
          <p className="fin-lead mt-3">
            Calculadoras y simuladores para aplicar lo que aprendes. Funcionarán solo con los datos y supuestos que tú ingreses; no
            mostrarán tasas ni rendimientos reales.
          </p>
        </header>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FINANCE_TOOLS.map((tool) => (
            <ToolPanel key={tool.id} tool={tool} focused={tool.id === focusedTool} />
          ))}
        </div>
      </div>
    </div>
  )
}
