import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'

export const RegisterPage: React.FC = () => {
  const { register } = usePlatform()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMsg('Completa todos los campos.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.')
      return
    }

    const ok = register(name.trim(), username.trim(), email.trim(), password)
    if (ok) {
      navigate('/onboarding')
    }
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <div className="platform-card p-6 space-y-5">
        <div>
          <h1 className="text-lg font-bold text-[var(--text)]">
            Crear Cuenta
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Registra tus datos para guardar tus avances.
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Nombre
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="platform-input"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Usuario
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
              placeholder="usuario123"
              className="platform-input font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Correo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
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

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="platform-input"
            />
          </div>

          <button
            type="submit"
            className="w-full platform-btn-primary py-2 text-xs font-semibold justify-center pt-2"
          >
            Registrarse
          </button>
        </form>

        <div className="pt-2 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[var(--primary)] hover:underline font-medium">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
