import React from 'react'
import { Link } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES, MODULES_BY_CATEGORY } from '../data/catalog'
import type { DiagnosticResult } from '../types/platform'

export const ResultPage: React.FC = () => {
  const { user, isGuest } = usePlatform()

  let result: DiagnosticResult | null = user.diagnostico
  let isGuestReport = false

  if (!result && isGuest) {
    try {
      const stored = sessionStorage.getItem('edu_guest_diagnostico')
      if (stored) {
        result = JSON.parse(stored)
        isGuestReport = true
      }
    } catch {}
  }

  if (!result) {
    result = {
      category: 'trading',
      knowledge: 70,
      decisionMaking: 65,
      analyticalThinking: 75,
      level: 'Intermedio',
      date: Date.now(),
    }
  }

  const catObj = CATEGORIES.find((c) => c.id === result?.category) || CATEGORIES[0]
  const modules = MODULES_BY_CATEGORY[result.category] || []

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="space-y-2 text-center sm:text-left border-b border-[var(--border)] pb-6">
        <div className="text-xs font-mono text-[var(--primary)] uppercase">
          Resultado de Evaluación
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
          Nivel en {catObj.name}: {result.level}
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          Puntaje general obtenido: {result.knowledge}% de acierto conceptual.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="platform-card p-4 text-center">
          <div className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Conocimiento</div>
          <div className="text-xl font-bold font-mono text-[var(--text)] mt-1">{result.knowledge}%</div>
        </div>

        <div className="platform-card p-4 text-center">
          <div className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Decisión</div>
          <div className="text-xl font-bold font-mono text-[var(--text)] mt-1">{result.decisionMaking}%</div>
        </div>

        <div className="platform-card p-4 text-center">
          <div className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Análisis</div>
          <div className="text-xl font-bold font-mono text-[var(--text)] mt-1">{result.analyticalThinking}%</div>
        </div>
      </div>

      <div className="platform-card p-5 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Ruta Sugerida de Estudio
        </h2>

        <div className="divide-y divide-[var(--border)]">
          {modules.slice(0, 4).map((m, idx) => (
            <div key={idx} className="py-2.5 flex items-center gap-3 text-xs">
              <span className="font-mono text-[11px] text-[var(--text-muted)] w-4">
                {idx + 1}
              </span>
              <span className="text-[var(--text)] font-medium">{m}</span>
            </div>
          ))}
        </div>
      </div>

      {isGuestReport || isGuest ? (
        <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)] rounded space-y-3">
          <p className="text-xs text-[var(--text-muted)]">
            Crea una cuenta gratuita para guardar este diagnóstico y registrar tus avances en la plataforma.
          </p>
          <div className="flex gap-2">
            <Link
              to="/register"
              className="platform-btn-primary py-1.5 px-3 text-xs"
            >
              Registrar cuenta
            </Link>
            <Link
              to="/"
              className="platform-btn-secondary py-1.5 px-3 text-xs"
            >
              Seguir explorando
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            to="/aprender"
            className="platform-btn-primary py-2 px-4 text-xs font-semibold"
          >
            Ir a módulos de aprendizaje
          </Link>
          <Link
            to="/exchange"
            className="platform-btn-secondary py-2 px-4 text-xs font-semibold"
          >
            Abrir mercado spot
          </Link>
        </div>
      )}
    </div>
  )
}
