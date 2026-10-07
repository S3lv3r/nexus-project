import React from 'react'
import { usePlatform } from '../context/PlatformContext'

const THEMES = [
  { id: 'light', name: 'Light Clean', desc: 'Fondo claro y espacioso' },
  { id: 'minimal', name: 'Minimal Mono', desc: 'Monocromo neutral y limpio' },
  { id: 'dark', name: 'Dark Slate', desc: 'Fondo oscuro pizarra' },
]

const ACCENT_COLORS = ['#0284c7', '#0f766e', '#6366f1', '#16a34a', '#d97706']

export const CustomizationPage: React.FC = () => {
  const { user, setTheme, setAccentColor, updateUserProfile, showToast } = usePlatform()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateUserProfile({ avatar: reader.result as string })
      showToast('Avatar actualizado', 'success')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    updateUserProfile({ avatar: null })
    showToast('Avatar eliminado', 'info')
  }

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
          Personalización
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Ajustes de tema visual y avatar de cuenta.
        </p>
      </div>

      <div className="platform-card p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Foto de Perfil
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text)] font-bold flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (user.name || user.username || 'U').slice(0, 2).toUpperCase()
            )}
          </div>

          <div className="flex gap-2">
            <label className="platform-btn-primary py-1.5 px-3 text-xs cursor-pointer">
              <span>Cambiar imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>

            {user.avatar && (
              <button
                onClick={handleRemoveAvatar}
                className="platform-btn-secondary py-1.5 px-3 text-xs text-rose-500"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="platform-card p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Tema Visual
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEMES.map((th) => {
            const isSelected = user.theme === th.id

            return (
              <button
                key={th.id}
                onClick={() => setTheme(th.id)}
                className={`p-3 rounded border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--surface-alt)] font-semibold'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-dim)]'
                }`}
              >
                <div className="text-xs text-[var(--text)]">{th.name}</div>
                <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{th.desc}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="platform-card p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Color de Acento
        </h2>

        <div className="flex gap-3">
          {ACCENT_COLORS.map((color) => {
            const isSelected = user.accentColor === color

            return (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                style={{ backgroundColor: color }}
                className={`w-7 h-7 rounded transition-transform cursor-pointer flex items-center justify-center ${
                  isSelected ? 'scale-110 ring-2 ring-[var(--text)]' : ''
                }`}
              >
                {isSelected && <i className="fa-solid fa-check text-white text-[10px]"></i>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
