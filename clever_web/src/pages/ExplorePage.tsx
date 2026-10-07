import React from 'react'
import { Link } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES } from '../data/catalog'

export const ExplorePage: React.FC = () => {
  const { user, updateUserProfile, unlockAchievement, showToast } = usePlatform()

  const handleAddInterest = (catId: string) => {
    if (user.interests.includes(catId)) return
    const updated = [...user.interests, catId]
    updateUserProfile({ interests: updated })
    if (updated.length >= 3) {
      unlockAchievement('explorer')
    }
    showToast('Categoría añadida', 'success')
  }

  const handleRemoveInterest = (catId: string) => {
    if (user.interests.length <= 1) {
      showToast('Debes mantener al menos una categoría activa.', 'info')
      return
    }
    const updated = user.interests.filter((id) => id !== catId)
    updateUserProfile({ interests: updated })
    showToast('Categoría removida', 'info')
  }

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
          Explorar Temas
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Añade o remueve áreas de conocimiento según tus intereses actuales.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const isSubscribed = user.interests.includes(cat.id)

          return (
            <div
              key={cat.id}
              className="platform-card p-5 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center text-xs text-[var(--text)]">
                    <i className={cat.icon}></i>
                  </div>

                  {isSubscribed ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      Activa
                    </span>
                  ) : null}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[var(--text)]">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <Link
                  to={`/diagnostico?cat=${cat.id}`}
                  className="text-[11px] text-[var(--text-muted)] hover:text-[var(--primary)]"
                >
                  Diagnóstico
                </Link>

                {isSubscribed ? (
                  <button
                    onClick={() => handleRemoveInterest(cat.id)}
                    className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Remover
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddInterest(cat.id)}
                    className="platform-btn-secondary py-1 px-2.5 text-[11px]"
                  >
                    Añadir
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
