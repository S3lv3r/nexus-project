import React from 'react'
import { Link } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { ACHIEVEMENTS, CATEGORIES } from '../data/catalog'

export const ProfilePage: React.FC = () => {
  const { user } = usePlatform()

  const initials = (user.name || user.username || 'U').slice(0, 2).toUpperCase()
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => user.achievements.includes(a.id))

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-8">
      <div className="platform-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-16 h-16 rounded bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] font-bold text-lg flex items-center justify-center flex-shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded" />
          ) : (
            initials
          )}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-[var(--text)]">
                {user.name || user.username}
              </h1>
              <div className="text-xs font-mono text-[var(--text-muted)]">@{user.username}</div>
            </div>

            <Link
              to="/personalizacion"
              className="platform-btn-secondary py-1 px-3 text-xs self-center sm:self-auto"
            >
              Editar perfil
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs font-mono text-[var(--text-muted)]">
            <span>{user.levelLabel} (Nv. {user.level})</span>
            <span>&bull;</span>
            <span>{user.coins} Monedas</span>
            <span>&bull;</span>
            <span>{user.streak} Días de racha</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="platform-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs">
            <span className="font-bold text-[var(--text)]">Temas Activos</span>
            <Link to="/explorar" className="text-[var(--primary)] hover:underline">Explorar</Link>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {user.interests.map((catId) => {
              const cat = CATEGORIES.find((c) => c.id === catId)
              if (!cat) return null

              return (
                <span
                  key={cat.id}
                  className="px-2.5 py-1 rounded bg-[var(--bg-alt)] border border-[var(--border)] text-xs text-[var(--text-muted)] flex items-center gap-1.5"
                >
                  <i className={cat.icon}></i>
                  <span>{cat.name}</span>
                </span>
              )
            })}
          </div>
        </div>

        <div className="platform-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs">
            <span className="font-bold text-[var(--text)]">Logros ({unlockedAchievements.length})</span>
            <Link to="/logros" className="text-[var(--primary)] hover:underline">Ver todos</Link>
          </div>

          {unlockedAchievements.length > 0 ? (
            <div className="space-y-1.5 text-xs">
              {unlockedAchievements.slice(0, 4).map((ach) => (
                <div key={ach.id} className="flex items-center gap-2 text-[var(--text)]">
                  <i className="fa-solid fa-check text-[10px] text-emerald-400"></i>
                  <span>{ach.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">Sin logros desbloqueados.</p>
          )}
        </div>
      </div>
    </div>
  )
}
