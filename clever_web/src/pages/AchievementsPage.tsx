import React from 'react'
import { usePlatform } from '../context/PlatformContext'
import { ACHIEVEMENTS } from '../data/catalog'

export const AchievementsPage: React.FC = () => {
  const { user } = usePlatform()

  const unlockedCount = user.achievements.length
  const totalCount = ACHIEVEMENTS.length

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
            Logros
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Insignias obtenidas por constancia y avances académicos.
          </p>
        </div>

        <span className="text-xs font-mono text-[var(--text-muted)]">
          {unlockedCount} de {totalCount} desbloqueados
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = user.achievements.includes(ach.id)

          return (
            <div
              key={ach.id}
              className={`platform-card p-4 space-y-2 border ${
                isUnlocked ? 'border-[var(--border)]' : 'opacity-40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center text-xs text-[var(--text)]">
                  <i className={ach.icon}></i>
                </div>

                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                  {isUnlocked ? 'Desbloqueado' : 'Pendiente'}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[var(--text)]">
                  {ach.name}
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">
                  {ach.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
