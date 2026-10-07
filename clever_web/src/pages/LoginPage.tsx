import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'

export const LoginPage: React.FC = () => {
  const { login } = usePlatform()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password) return
    const ok = login(identifier.trim(), password)
    if (ok) {
      navigate('/')
    }
  }

  return (
    <div className="max-w-sm mx-auto py-16">
      <div className="platform-card p-6 space-y-6">
        <div>
          <h1 className="text-lg font-bold text-[var(--text)]">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Accede a tu cuenta y avances registrados.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Usuario o Correo
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="tu_usuario"
              className="platform-input"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="platform-input"
            />
          </div>

          <button
            type="submit"
            className="w-full platform-btn-primary py-2 text-xs font-semibold justify-center"
          >
            Entrar
          </button>
        </form>

        <div className="pt-2 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
          ¿Sin cuenta?{' '}
          <Link to="/register" className="text-[var(--primary)] hover:underline font-medium">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
