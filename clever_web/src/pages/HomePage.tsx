import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES, MISSIONS_BY_CATEGORY } from '../data/catalog'

export const HomePage: React.FC = () => {
  const { user, isGuest, completeMission } = usePlatform()
  const navigate = useNavigate()

  const missionCat = user.interests.includes('trading') ? 'trading' : user.interests[0] || 'trading'
  const mission = MISSIONS_BY_CATEGORY[missionCat] || MISSIONS_BY_CATEGORY.trading
  const today = new Date().toDateString()
  const isMissionDone = user._lastMissionDate === today

  const handleCategoryClick = (catId: string) => {
    if (isGuest) {
      navigate(`/diagnostico?cat=${catId}`)
    } else {
      if (!user.interests.includes(catId)) {
        user.interests.push(catId)
      }
      navigate('/aprender')
    }
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-4">
      {isGuest && (
        <section className="py-8 sm:py-12 border-b border-[var(--border)]">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-mono text-[var(--primary)] uppercase tracking-wider">
              Plataforma Educativa &middot; Mercado Financiero
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
              Aprende trading, finanzas y cultura digital con práctica real.
            </h1>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Domina el análisis técnico mediante lecciones estructuradas, evaluaciones adaptativas y operaciones prácticas en el exchange spot con cotizaciones en vivo.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/diagnostico?cat=trading"
                className="platform-btn-primary py-2 px-5 text-xs font-semibold"
              >
                <span>Hacer examen diagnóstico</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </Link>
              <Link
                to="/exchange"
                className="platform-btn-secondary py-2 px-5 text-xs font-semibold"
              >
                <span>Ver mercado spot</span>
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[var(--text)] tracking-tight">
                  Áreas de Conocimiento
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Selecciona una categoría para comenzar tu ruta de estudio.
                </p>
              </div>

              <Link
                to="/explorar"
                className="text-xs text-[var(--primary)] hover:underline font-medium"
              >
                Ver todas
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const isTrading = cat.id === 'trading'

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="platform-card platform-card-hover p-4 cursor-pointer flex flex-col justify-between space-y-3 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-8 h-8 rounded bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center text-xs text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:border-[var(--primary)]">
                        <i className={cat.icon}></i>
                      </div>

                      {isTrading && (
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--primary)]">
                          Principal
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--primary)]">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[var(--text)] tracking-tight">
                Herramientas Prácticas
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Entrena tus decisiones con el mercado spot y desafíos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/exchange"
                className="platform-card platform-card-hover p-5 space-y-2 block text-decoration-none"
              >
                <div className="w-8 h-8 rounded bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center text-xs text-[var(--primary)]">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <h3 className="text-xs font-bold text-[var(--text)]">
                  Exchange Spot
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Opera videojuegos reales de IGDB con fondos de portafolio y gráficas de volumen.
                </p>
              </Link>

              <Link
                to="/experiencias"
                className="platform-card platform-card-hover p-5 space-y-2 block text-decoration-none"
              >
                <div className="w-8 h-8 rounded bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center text-xs text-indigo-400">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <h3 className="text-xs font-bold text-[var(--text)]">
                  Desafíos y Quizzes
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Evalúa tus conocimientos técnicos con escenarios de mercado y análisis situacionales.
                </p>
              </Link>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="platform-card p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text)]">Misión Diaria</span>
              <span className="text-[10px] font-mono text-[var(--primary)]">+{mission.xp} XP</span>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {mission.text}
            </p>

            {isMissionDone ? (
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                <i className="fa-solid fa-check text-[10px]"></i>
                <span>Completada hoy</span>
              </div>
            ) : (
              <button
                onClick={() => completeMission(missionCat)}
                className="w-full platform-btn-primary py-1.5 text-xs font-semibold justify-center"
              >
                Marcar como completada
              </button>
            )}
          </div>

          <div className="platform-card p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text)]">Progreso de Usuario</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">{user.levelLabel}</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
                <span>Nivel {user.level}</span>
                <span>{user.xp} / {user.xpToNext} XP</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--bg-alt)] rounded overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)]"
                  style={{ width: `${Math.min(100, (user.xp / user.xpToNext) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)] text-xs text-center font-mono">
              <div className="p-2 bg-[var(--bg-alt)] rounded border border-[var(--border)]">
                <div className="text-[10px] text-[var(--text-muted)]">Racha</div>
                <div className="font-bold text-[var(--text)]">{user.streak} días</div>
              </div>
              <div className="p-2 bg-[var(--bg-alt)] rounded border border-[var(--border)]">
                <div className="text-[10px] text-[var(--text-muted)]">Monedas</div>
                <div className="font-bold text-[var(--text)]">{user.coins}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)] rounded space-y-2">
            <div className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
              <i className="fa-solid fa-robot text-[10px] text-[var(--primary)]"></i>
              <span>Mentor IA de Clever</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              ¿Dudas sobre soportes, velas o gestión de riesgo? Consulta al tutor en cualquier momento.
            </p>
            <Link
              to="/mentor"
              className="text-xs text-[var(--primary)] font-semibold hover:underline block pt-1"
            >
              Abrir chat con Mentor &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
