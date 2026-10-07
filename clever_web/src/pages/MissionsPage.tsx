import React from 'react'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES, MISSIONS_BY_CATEGORY } from '../data/catalog'

export const MissionsPage: React.FC = () => {
  const { user, completeMission } = usePlatform()

  const today = new Date().toDateString()
  const isCompletedToday = user._lastMissionDate === today

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
            Misiones Diarias
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Completa objetivos periódicos para mantener tu racha y ganar puntos de experiencia.
          </p>
        </div>

        <div className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
          <i className="fa-solid fa-fire text-orange-400"></i>
          <span>Racha activa: {user.streak} días</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.interests.map((catId) => {
          const m = MISSIONS_BY_CATEGORY[catId] || MISSIONS_BY_CATEGORY.trading
          const cat = CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0]

          return (
            <div
              key={catId}
              className="platform-card p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)]">{cat.name}</span>
                  <span className="text-[var(--primary)]">+{m.xp} XP</span>
                </div>

                <p className="text-xs text-[var(--text)] font-medium leading-relaxed">
                  {m.text}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  +{m.coins} Monedas
                </span>

                {isCompletedToday ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <i className="fa-solid fa-check text-[10px]"></i>
                    <span>Completada</span>
                  </span>
                ) : (
                  <button
                    onClick={() => completeMission(catId)}
                    className="platform-btn-primary py-1 px-3 text-xs"
                  >
                    Completar
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
