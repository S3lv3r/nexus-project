import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { TermsContent } from '../components/legal/TermsContent'

export const RegisterPage: React.FC = () => {
  const { register } = usePlatform()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para el flujo de Términos y Condiciones
  const [isPreparingTerms, setIsPreparingTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const termsScrollRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()

  // Paso 1: Validar el formulario y lanzar la pantalla de carga previa al modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMsg('Completa todos los campos.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.')
      return
    }

    // Reiniciar estados del modal y mostrar pantalla de carga
    setHasScrolledToBottom(false)
    setIsPreparingTerms(true)

    setTimeout(() => {
      setIsPreparingTerms(false)
      setShowTermsModal(true)
    }, 650)
  }

  // Verificar si el contenedor requiere scroll al abrirse (por si la pantalla es muy alta)
  useEffect(() => {
    if (showTermsModal && termsScrollRef.current) {
      const el = termsScrollRef.current
      el.scrollTop = 0
      if (el.scrollHeight <= el.clientHeight + 10) {
        setHasScrolledToBottom(true)
      }
    }
  }, [showTermsModal])

  // Detector de scroll hasta el final del contrato
  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 12
    if (reachedBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true)
    }
  }

  const handleCancelTerms = () => {
    if (isSubmitting) return
    setShowTermsModal(false)
    setHasScrolledToBottom(false)
  }

  // Paso 2: Confirmar lectura y registrar en cleverkor_db
  const handleConfirmTermsAndRegister = async () => {
    if (!hasScrolledToBottom || isSubmitting) return

    setIsSubmitting(true)
    try {
      const ok = await register(name.trim(), username.trim(), email.trim(), password)
      if (ok) {
        setShowTermsModal(false)
        navigate('/onboarding')
      } else {
        setShowTermsModal(false)
      }
    } catch (err) {
      setShowTermsModal(false)
      setErrorMsg('Ocurrió un error al registrar la cuenta.')
    } finally {
      setIsSubmitting(false)
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
            Registra tus datos en cleverkor_db para guardar tus avances.
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
              disabled={isSubmitting || isPreparingTerms}
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
              disabled={isSubmitting || isPreparingTerms}
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
              disabled={isSubmitting || isPreparingTerms}
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
              disabled={isSubmitting || isPreparingTerms}
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
              disabled={isSubmitting || isPreparingTerms}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="platform-input"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isPreparingTerms}
            className="w-full platform-btn-primary py-2 text-xs font-semibold justify-center pt-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin mr-1.5"></i>
                Registrando...
              </>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[var(--primary)] hover:underline font-medium">
            Iniciar sesión
          </Link>
        </div>
      </div>

      {/* 1. PANTALLA DE CARGA PREVIA AL CONTRATO */}
      {isPreparingTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="platform-card p-6 flex flex-col items-center space-y-3 max-w-xs w-full text-center">
            <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[var(--primary)]"></i>
            <p className="text-xs text-[var(--text-muted)]">
              Preparando contrato de servicio...
            </p>
          </div>
        </div>
      )}

      {/* 2. MODAL AMPLIO DE TÉRMINOS Y CONDICIONES */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="platform-card w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-[var(--border)]">
            {/* Encabezado */}
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--text)]">
                Términos de Servicio de CLEVER
              </h2>
              <span className="text-[11px] text-[var(--text-muted)]">
                Desplázate hasta el final para aceptar
              </span>
            </div>

            {/* Cuerpo del contrato con detector de Scroll */}
            <div
              ref={termsScrollRef}
              onScroll={handleTermsScroll}
              className="px-6 py-5 overflow-y-auto space-y-3 text-xs leading-relaxed text-[var(--text-muted)] select-none"
            >
              <TermsContent />
            </div>

            {/* Pie del Modal con botones */}
            <div className="px-6 py-3.5 border-t border-[var(--border)] flex items-center justify-end gap-3 bg-black/20">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCancelTerms}
                className="px-4 py-2 rounded text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={!hasScrolledToBottom || isSubmitting}
                onClick={handleConfirmTermsAndRegister}
                className={`px-5 py-2 rounded text-xs font-semibold transition-all ${
                  hasScrolledToBottom
                    ? 'platform-btn-primary cursor-pointer'
                    : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-75'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin mr-1.5"></i>
                    Registrando...
                  </>
                ) : (
                  'Aceptar y crear cuenta'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}