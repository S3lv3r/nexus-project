import React from 'react'
import { Link } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES, MODULES_BY_CATEGORY } from '../data/catalog'

export const ProgressPage: React.FC = () => {
  const { user } = usePlatform()

  const xpPct = Math.min(100, Math.round((user.xp / user.xpToNext) * 100))

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
          Progreso Académico
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Resumen de nivel, experiencia y módulos completados.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 text-center font-mono">
        <div className="platform-card p-3.5">
          <div className="text-[10px] text-[var(--text-muted)] uppercase">Nivel</div>
          <div className="text-lg font-bold text-[var(--text)] mt-1">{user.level}</div>
          <div className="text-[10px] text-[var(--primary)] font-sans">{user.levelLabel}</div>
        </div>

        <div className="platform-card p-3.5">
          <div className="text-[10px] text-[var(--text-muted)] uppercase">XP</div>
          <div className="text-lg font-bold text-[var(--text)] mt-1">{user.xp}</div>
          <div className="text-[10px] text-[var(--text-muted)]">de {user.xpToNext}</div>
        </div>

        <div className="platform-card p-3.5">
          <div className="text-[10px] text-[var(--text-muted)] uppercase">Logros</div>
          <div className="text-lg font-bold text-[var(--text)] mt-1">{user.achievements.length}</div>
          <div className="text-[10px] text-[var(--text-muted)] font-sans">Insignias</div>
        </div>

        <div className="platform-card p-3.5">
          <div className="text-[10px] text-[var(--text-muted)] uppercase">Racha</div>
          <div className="text-lg font-bold text-[var(--text)] mt-1">{user.streak}D</div>
          <div className="text-[10px] text-[var(--text-muted)] font-sans">Días</div>
        </div>
      </div>

      <div className="platform-card p-5 space-y-2">
        <div className="flex justify-between text-xs font-mono text-[var(--text-muted)]">
          <span>Nivel {user.level} &rarr; {user.level + 1}</span>
          <span>{xpPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-[var(--bg-alt)] rounded overflow-hidden">
          <div
            className="h-full bg-[var(--primary)]"
            style={{ width: `${xpPct}%` }}
          ></div>
        </div>
      </div>

      <div className="platform-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
            Avance por Categoría
          </h2>
          <Link to="/aprender" className="text-xs text-[var(--primary)] hover:underline">
            Ver mapa de módulos
          </Link>
        </div>

        <div className="space-y-3">
          {user.interests.map((catId) => {
            const cat = CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0]
            const modules = MODULES_BY_CATEGORY[catId] || []
            const completed = (user.moduleProgress[catId] || []).length
            const pct = modules.length > 0 ? Math.round((completed / modules.length) * 100) : 0

            return (
              <div key={catId} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text)] font-medium">{cat.name}</span>
                  <span className="font-mono text-[var(--text-muted)]">{completed}/{modules.length} ({pct}%)</span>
                </div>
                <div className="w-full h-1 bg-[var(--bg-alt)] rounded overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)]"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="platform-card p-5 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Historial de Actividad
        </h2>

        {user.activity.length > 0 ? (
          <ul className="divide-y divide-[var(--border)] text-xs">
            {user.activity.map((act, i) => (
              <li key={i} className="py-2 flex items-center justify-between">
                <span className="text-[var(--text)]">{act.text}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  {new Date(act.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[var(--text-muted)]">Sin actividad registrada aún.</p>
        )}
      </div>
    </div>
  )
}
