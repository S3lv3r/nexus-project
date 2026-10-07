import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'

export const Navbar: React.FC = () => {
  const { user, isGuest, logout } = usePlatform()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsDropdownOpen(false)
    logout()
    navigate('/')
  }

  const initials = (user.name || user.username || 'U').slice(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-40 h-14 bg-[var(--bg-alt)] border-b border-[var(--border)] px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5 text-decoration-none">
          <div className="w-7 h-7 rounded bg-[var(--primary)] text-[var(--primary-text)] flex items-center justify-center font-bold text-xs">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm tracking-tight text-[var(--text)]">
              CLEVER
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              plataforma
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/aprender"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`
            }
          >
            Aprender
          </NavLink>

          <NavLink
            to="/experiencias"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`
            }
          >
            Desafíos
          </NavLink>

          <NavLink
            to="/exchange"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`
            }
          >
            <i className="fa-solid fa-chart-simple text-[10px]"></i>
            <span>Exchange Spot</span>
          </NavLink>

          <NavLink
            to="/comunidad"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`
            }
          >
            Comunidad
          </NavLink>

          <div className="relative">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="px-3 py-1.5 rounded text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer"
            >
              <span>Más</span>
              <i className={`fa-solid fa-chevron-down text-[8px] transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isMoreOpen && (
              <div
                className="absolute left-0 mt-1 w-48 bg-[var(--surface)] border border-[var(--border)] rounded shadow-lg py-1 z-50"
                onMouseLeave={() => setIsMoreOpen(false)}
              >
                <Link
                  to="/misiones"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--bg-alt)]"
                >
                  <i className="fa-solid fa-bullseye w-4 text-[var(--text-muted)]"></i>
                  <span>Misiones</span>
                </Link>

                <Link
                  to="/analisis"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--bg-alt)]"
                >
                  <i className="fa-solid fa-magnifying-glass-chart w-4 text-[var(--text-muted)]"></i>
                  <span>Análisis Técnico</span>
                </Link>

                <Link
                  to="/mentor"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--bg-alt)]"
                >
                  <i className="fa-solid fa-robot w-4 text-[var(--text-muted)]"></i>
                  <span>Mentor IA</span>
                </Link>

                <Link
                  to="/ranking"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--bg-alt)]"
                >
                  <i className="fa-solid fa-medal w-4 text-[var(--text-muted)]"></i>
                  <span>Ranking</span>
                </Link>

                <Link
                  to="/logros"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--bg-alt)]"
                >
                  <i className="fa-solid fa-trophy w-4 text-[var(--text-muted)]"></i>
                  <span>Logros</span>
                </Link>

                <Link
                  to="/explorar"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--bg-alt)]"
                >
                  <i className="fa-solid fa-compass w-4 text-[var(--text-muted)]"></i>
                  <span>Explorar Temas</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-[var(--text-muted)] border-r border-[var(--border)] pr-3">
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-fire text-orange-400 text-[10px]"></i>
            <span>{user.streak}D</span>
          </span>
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-star text-amber-400 text-[10px]"></i>
            <span>Nv. {user.level}</span>
          </span>
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-coins text-amber-500 text-[10px]"></i>
            <span>{user.coins}</span>
          </span>
        </div>

        {isGuest ? (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-2.5 py-1 text-xs font-medium text-[var(--text)] hover:text-[var(--primary)]"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="platform-btn-primary py-1 px-3 text-xs"
            >
              Registrarse
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-xs font-medium text-[var(--text)] hover:text-[var(--primary)] cursor-pointer"
            >
              <div className="w-7 h-7 rounded bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] flex items-center justify-center font-bold text-xs">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded" />
                ) : (
                  initials
                )}
              </div>
              <span className="hidden sm:inline font-mono">{user.username}</span>
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded shadow-lg py-1 z-50"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Link
                  to="/perfil"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--bg-alt)]"
                >
                  <i className="fa-solid fa-user w-4 text-[var(--text-muted)]"></i>
                  <span>Perfil</span>
                </Link>

                <Link
                  to="/progreso"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--bg-alt)]"
                >
                  <i className="fa-solid fa-chart-pie w-4 text-[var(--text-muted)]"></i>
                  <span>Mi Progreso</span>
                </Link>

                <Link
                  to="/portfolio"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--bg-alt)]"
                >
                  <i className="fa-solid fa-wallet w-4 text-[var(--text-muted)]"></i>
                  <span>Portafolio</span>
                </Link>

                <Link
                  to="/personalizacion"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--bg-alt)]"
                >
                  <i className="fa-solid fa-palette w-4 text-[var(--text-muted)]"></i>
                  <span>Personalización</span>
                </Link>

                <Link
                  to="/configuracion"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--bg-alt)]"
                >
                  <i className="fa-solid fa-gear w-4 text-[var(--text-muted)]"></i>
                  <span>Configuración</span>
                </Link>

                <div className="border-t border-[var(--border)] mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 text-left cursor-pointer"
                  >
                    <i className="fa-solid fa-right-from-bracket w-4"></i>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
