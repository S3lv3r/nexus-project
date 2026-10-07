import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'

export const SettingsPage: React.FC = () => {
  const { user, updateUserProfile, logout, showToast } = usePlatform()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const navigate = useNavigate()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserProfile({ name, email })
    showToast('Ajustes guardados', 'success')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
          Configuración
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Ajustes de cuenta y preferencias de sesión.
        </p>
      </div>

      <form onSubmit={handleSave} className="platform-card p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Datos de Usuario
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="platform-input"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="platform-input"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Usuario
            </label>
            <input
              type="text"
              disabled
              value={user.username}
              className="platform-input opacity-50 cursor-not-allowed font-mono"
            />
          </div>

          <div className="pt-2 text-right">
            <button type="submit" className="platform-btn-primary py-1.5 px-4 text-xs font-semibold">
              Guardar cambios
            </button>
          </div>
        </div>
      </form>

      <div className="platform-card p-6 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Sesión
        </h2>

        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">
            Cerrar la sesión actual en este navegador.
          </p>

          <button
            onClick={handleLogout}
            className="platform-btn-secondary py-1.5 px-3 text-xs text-rose-400 hover:bg-rose-500/10"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}
