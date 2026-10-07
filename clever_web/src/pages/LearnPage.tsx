import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES, MODULES_BY_CATEGORY } from '../data/catalog'

export const LearnPage: React.FC = () => {
  const { user, completeModule } = usePlatform()
  const [selectedCat, setSelectedCat] = useState<string>(
    user.interests.length > 0 ? user.interests[0] : 'trading',
  )

  const activeCategories = CATEGORIES.filter((c) => user.interests.includes(c.id))
  const displayCategories = activeCategories.length > 0 ? activeCategories : CATEGORIES

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCat) || CATEGORIES[0]
  const modules = MODULES_BY_CATEGORY[selectedCat] || []
  const completedList = user.moduleProgress[selectedCat] || []

  const completedCount = completedList.length
  const totalCount = modules.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
            Módulos de Aprendizaje
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Completa temas clave de análisis, finanzas y cultura digital para sumar experiencia.
          </p>
        </div>

        <Link
          to="/explorar"
          className="platform-btn-secondary py-1.5 px-3 text-xs self-start sm:self-auto"
        >
          <span>Añadir temas</span>
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {displayCategories.map((cat) => {
          const isSelected = cat.id === selectedCat
          const catCompleted = (user.moduleProgress[cat.id] || []).length
          const catTotal = (MODULES_BY_CATEGORY[cat.id] || []).length

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap flex items-center gap-2 border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border-[var(--primary)]'
                  : 'bg-[var(--bg-alt)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              <i className={cat.icon}></i>
              <span>{cat.name}</span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                {catCompleted}/{catTotal}
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="platform-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[var(--text)]">
                  {currentCategoryObj.name}
                </h2>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {currentCategoryObj.desc}
                </p>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-[var(--primary)] font-semibold">{progressPercent}%</span>
                <span className="text-[var(--text-muted)] text-[10px] block">{completedCount}/{totalCount}</span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-[var(--bg-alt)] rounded overflow-hidden">
              <div
                className="h-full bg-[var(--primary)]"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="divide-y divide-[var(--border)] pt-2">
              {modules.map((m, idx) => {
                const isDone = completedList.includes(idx)

                return (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-[var(--text-muted)] w-4 text-center">
                        {idx + 1}
                      </span>
                      <span className={isDone ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text)] font-medium'}>
                        {m}
                      </span>
                    </div>

                    {isDone ? (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-check text-[10px]"></i>
                        <span>Visto</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => completeModule(selectedCat, idx)}
                        className="platform-btn-secondary py-1 px-2.5 text-[11px] cursor-pointer"
                      >
                        Marcar visto
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)] rounded space-y-2">
            <h3 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
              <i className="fa-solid fa-chart-line text-[var(--primary)] text-[10px]"></i>
              <span>Poner en Práctica</span>
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Aplica los conceptos de análisis técnico y gestión de riesgo directamente en el mercado spot.
            </p>
            <Link
              to="/exchange"
              className="text-xs text-[var(--primary)] font-semibold hover:underline block pt-1"
            >
              Ir al Exchange Spot &rarr;
            </Link>
          </div>

          <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)] rounded space-y-2">
            <h3 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
              <i className="fa-solid fa-robot text-purple-400 text-[10px]"></i>
              <span>Mentor IA</span>
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              ¿Dudas sobre {currentCategoryObj.name}? Consulta con el tutor para explicaciones paso a paso.
            </p>
            <Link
              to="/mentor"
              className="text-xs text-[var(--primary)] font-semibold hover:underline block pt-1"
            >
              Consultar con Mentor &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
