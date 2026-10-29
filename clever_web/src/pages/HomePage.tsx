import React, { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { MISSIONS_BY_CATEGORY, MODULES_BY_CATEGORY } from '../data/catalog'
import { CleverkorMascot3D } from '../components/CleverkorMascot3D'
import { DraggableMascot, type MascotSide } from '../components/DraggableMascot'
import { Microtext, NOTE_STYLES, ROSETTE_A, ROSETTE_B, Rosette, SmallRosette, WaveField } from '../components/note/NoteKit'
import { ProfileStudio, STUDIO_TAB_IDS } from '../components/profile/ProfileStudio'
import type { StudioTabId } from '../components/profile/ProfileStudio'
import { ProfileCover } from '../components/profile/ProfileLayouts'
import { PROFILE_STYLES } from '../components/profile/ProfileVisuals'
import { DEFAULT_BANNER_A, DEFAULT_BANNER_B, HOME_GREETINGS, HOME_LESSON_BACKGROUNDS } from '../data/profileCustomizationOptions'
import { ModernBanner } from '../components/profile/ProfileBanners'
import { resolveAvatarSrc } from '../data/avatarPresets'
import { useProfileCustomization } from '../services/profileCustomizationService'
import type { HomeLessonBg, HomeMainSection, HomeSideSection } from '../types/profileCustomization'

const LESSON_DARK_VARS = {
  '--text': '#ffffff',
  '--text-muted': 'rgba(255,255,255,.78)',
  '--ink': '#ffffff',
  '--bg': '#0b1226',
  '--paper-2': 'rgba(255,255,255,.22)',
  '--rule': 'rgba(255,255,255,.4)',
} as React.CSSProperties

const isSceneBg = (bg: HomeLessonBg): bg is 'aurora' | 'stars' | 'candles' | 'waves' | 'skyline' => ['aurora', 'stars', 'candles', 'waves', 'skyline'].includes(bg)

const TRADING_MODULES: string[] = MODULES_BY_CATEGORY.trading

const STEPS = [
  { icon: 'fa-solid fa-clipboard-question', title: 'Diagnóstico', text: 'Un examen corto detecta desde dónde empiezas.' },
  { icon: 'fa-solid fa-route', title: 'Tu ruta', text: 'Lecciones ordenadas según tu nivel, una a la vez.' },
  { icon: 'fa-solid fa-chart-line', title: 'Práctica real', text: 'Operas en el exchange spot simulado sin arriesgar dinero.' },
  { icon: 'fa-solid fa-medal', title: 'Sube de nivel', text: 'Ganas XP, monedas y rachas con cada misión diaria.' },
]




const STEP_X = 40
const CLOSES = [112, 98, 104, 84, 92, 70, 78, 58, 72, 96]
const WICKS = [8, 12, 7, 10, 9, 12, 8, 11, 7, 10]
const VOLUME = [14, 22, 12, 26, 16, 30, 18, 28, 20, 24]

const CANDLES = CLOSES.map((close, i) => {
  const open = CLOSES[(i + CLOSES.length - 1) % CLOSES.length]
  const top = Math.min(open, close)
  return { x: 20 + i * STEP_X, top, height: Math.max(Math.max(open, close) - top, 6), wick: WICKS[i], up: close < open }
})

const PRICE_LINE = (() => {
  const pts = [...CLOSES, CLOSES[0]].map((y, i) => ({ x: 20 + i * STEP_X, y }))
  let d = `M${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2
    const my = (pts[i].y + pts[i + 1].y) / 2
    d += ` Q${pts[i].x} ${pts[i].y} ${mx} ${my}`
  }
  d += ` L${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`
  return d
})()

const ChartTile: React.FC<{ dx: number }> = ({ dx }) => (
  <g transform={`translate(${dx} 0)`}>
    {CANDLES.map((c, i) => (
      <rect key={`v${i}`} x={c.x - 7} y={155 - VOLUME[i]} width="14" height={VOLUME[i]} rx="1.5" fill="var(--ink)" fillOpacity="0.14" />
    ))}
    {CANDLES.map((c) => (
      <g key={c.x}>
        <line x1={c.x} x2={c.x} y1={c.top - c.wick} y2={c.top + c.height + c.wick} stroke={c.up ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.6" />
        <rect x={c.x - 6} y={c.top} width="12" height={c.height} rx="1.5" fill={c.up ? 'var(--ink)' : 'var(--ink-3)'} fillOpacity={c.up ? 0.85 : 0.75} />
      </g>
    ))}
    <path d={PRICE_LINE} fill="none" stroke="var(--ink-2)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 5" />
  </g>
)

const ExchangeChart: React.FC = () => (
  <svg className="h-full w-full" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    {[40, 80, 120].map((y) => (
      <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="var(--rule)" strokeWidth="0.8" />
    ))}
    <g className="note-scroll">
      <ChartTile dx={0} />
      <ChartTile dx={400} />
    </g>
  </svg>
)

const SectionHeading: React.FC<{ title: string; text?: string; action?: React.ReactNode }> = ({ title, text, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--rule)] pb-5">
    <div className="max-w-2xl">
      <h2 className="note-display text-3xl font-extrabold leading-[1.05] text-[var(--text)] sm:text-[2.6rem]">{title}</h2>
      {text && <p className="mt-3 text-lg leading-relaxed text-[var(--text-muted)]">{text}</p>}
    </div>
    {action}
  </div>
)

const HeroBill: React.FC<{ onWave: () => void; wave: number }> = ({ onWave, wave }) => (
  <section className="note-bill note-paper note-enter relative isolate overflow-hidden rounded-[28px]">
    <Rosette className="pointer-events-none absolute -right-28 -top-36 -z-10 h-[520px] w-[520px] opacity-80" />
    <Rosette variant="b" className="pointer-events-none absolute -bottom-64 -left-40 -z-10 h-[520px] w-[520px] opacity-60" />
    <WaveField className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 w-full" />

    <div className="absolute inset-x-6 top-4 sm:inset-x-8">
      <Microtext />
    </div>
    <div className="absolute inset-x-6 bottom-4 sm:inset-x-8">
      <Microtext />
    </div>

    <div className="grid gap-10 px-6 pb-14 pt-12 sm:px-10 lg:grid-cols-[1fr_auto_minmax(300px,380px)] lg:gap-12 lg:px-14 lg:pb-16 lg:pt-14">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 text-[var(--ink)]">
          <span className="note-wide text-sm font-extrabold">CLEVER</span>
          <span className="h-px w-10 bg-[var(--rule)]"></span>
          <span className="note-num text-sm font-medium text-[var(--text-muted)]">Serie TF · 000001</span>
        </div>

        <h1 className="note-display mt-10 max-w-[15ch] pr-16 sm:pr-0 text-[clamp(2.6rem,5vw,4.6rem)] font-black leading-[0.98] [font-stretch:100%] text-[var(--text)] [text-wrap:balance]">
          Aprende trading y finanzas con práctica real.
        </h1>

        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-[var(--text-muted)] sm:text-xl">
          Domina el análisis técnico con <strong className="font-semibold text-[var(--text)]">Kor</strong>, evaluaciones adaptativas y operaciones prácticas en el exchange spot con cotizaciones en vivo.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link to="/register" className="note-btn note-btn-ink">
            Crear cuenta gratis
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
          <Link to="/diagnostico?cat=trading" className="note-btn note-btn-line">
            Hacer examen diagnóstico
          </Link>
        </div>

        <div className="mt-auto flex items-end gap-4 pt-12">
          <span className="note-display note-num text-6xl font-black leading-none text-[var(--ink)] opacity-90">01</span>
          <span className="pb-1 text-sm leading-snug text-[var(--text-muted)]">
            Emisión de práctica
            <br />
            Sin valor monetario
          </span>
        </div>
      </div>

      <div className="note-thread hidden w-1.5 rounded-full opacity-50 lg:block" aria-hidden="true"></div>

      <div className="relative mx-auto w-full max-w-[380px] self-center">
        <div className="relative aspect-[4/5] w-full">
          <div className="absolute inset-0 rounded-[50%] border border-[var(--rule)]"></div>
          <div className="absolute inset-3 rounded-[50%] border-2 border-[color-mix(in_srgb,var(--ink)_55%,transparent)]"></div>
          <div className="absolute inset-[22px] overflow-hidden rounded-[50%] bg-[var(--paper-2)]">
            <Rosette variant="b" className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-60" />
            <button
              type="button"
              onClick={onWave}
              className="relative block h-full w-full cursor-pointer focus-visible:outline-none"
              aria-label="Saludar a Kor"
            >
              <CleverkorMascot3D height="100%" className="h-full" waveTrigger={wave} />
            </button>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="note-wide text-xs font-bold text-[var(--ink)]">KOR</div>
          <div className="text-sm text-[var(--text-muted)]">Tu mentor en cada lección</div>
        </div>
      </div>
    </div>
  </section>
)

const FirstLessonSection: React.FC = () => (
  <section data-tour="home-learning" className="space-y-10">
    <SectionHeading title="Empieza tu primera lección" text="El camino de Trading y Finanzas está abierto. Entra, recórrelo y da el primer paso." />
    <Link
      to="/aprender?cat=trading"
      className="note-paper note-link group relative isolate grid overflow-hidden rounded-[24px] md:grid-cols-[1fr_auto]"
    >
      <SmallRosette className="pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64 opacity-60" />
      <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--ink)] text-2xl text-[var(--bg)]">
          <i className="fa-solid fa-chart-line"></i>
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
            <span className="note-wide text-xs font-extrabold text-[var(--ink)]">TRADING Y FINANZAS</span>
            <span className="h-px w-8 bg-[var(--rule)]"></span>
            <span className="note-num">{TRADING_MODULES.length} lecciones</span>
          </div>
          <h3 className="note-display mt-2 text-2xl font-black leading-tight text-[var(--text)] sm:text-3xl">
            Lección 01 · {TRADING_MODULES[0]}
          </h3>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-[var(--text-muted)]">
            Qué es un mercado, cómo funcionan las acciones y por qué se mueve un precio. La base para todo lo que sigue.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t border-[var(--rule)] p-7 sm:p-9 md:border-l md:border-t-0">
        <span className="note-btn note-btn-ink pointer-events-none">
          Ir a la lección
          <i className="fa-solid fa-arrow-right text-sm transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"></i>
        </span>
      </div>
    </Link>
  </section>
)

const CurriculumSection: React.FC = () => (
  <section className="space-y-10">
    <SectionHeading title="Lo que vas a dominar" text="Un solo camino, de tu primera vela japonesa a operar con disciplina." />
    <ol className="grid gap-x-12 sm:grid-cols-2">
      {TRADING_MODULES.map((title, i) => (
        <li key={title} className="group flex items-baseline gap-5 border-b border-[var(--rule)] py-5">
          <span className="note-display note-num w-10 shrink-0 text-2xl font-black text-[var(--ink)]">{String(i + 1).padStart(2, '0')}</span>
          <span className="note-display text-xl font-semibold leading-snug text-[var(--text)] sm:text-[1.35rem]">{title}</span>
        </li>
      ))}
    </ol>
  </section>
)

const StepsSection: React.FC = () => (
  <section className="space-y-10">
    <SectionHeading title="Cómo funciona" text="Cuatro pasos entre tu primera visita y tu primera operación." />
    <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {STEPS.map((step, i) => (
        <li key={step.title} className="space-y-4">
          <span className="relative flex h-16 w-16 items-center justify-center">
            <SmallRosette className="absolute inset-0 h-full w-full" />
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)]">
              <i className={`${step.icon} text-sm`}></i>
            </span>
          </span>
          <div>
            <h3 className="note-display flex items-baseline gap-2 text-xl font-extrabold text-[var(--text)]">
              <span className="note-num text-[var(--ink)]">{i + 1}.</span>
              {step.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-[var(--text-muted)]">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
)

const ExchangeShowcase: React.FC<{ includeMentor?: boolean }> = ({ includeMentor = true }) => (
  <section data-tour="home-tools" className="space-y-10">
    <SectionHeading title="Herramientas Prácticas" text="Entrena tus decisiones en el exchange spot simulado." />
    <Link to="/exchange" className={`note-paper note-link group relative isolate grid overflow-hidden rounded-[24px] ${includeMentor ? 'lg:grid-cols-[0.9fr_1.1fr]' : ''}`}>
      <div className="flex flex-col p-8 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)]">
          <i className="fa-solid fa-chart-line"></i>
        </span>
        <h3 className="note-display mt-6 text-3xl font-black text-[var(--text)] sm:text-4xl">Exchange Spot</h3>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-[var(--text-muted)]">
          Opera videojuegos reales de IGDB con fondos de portafolio y gráficas de volumen.
        </p>
        <span className="note-display mt-8 inline-flex items-center gap-2 text-lg font-bold text-[var(--ink)]">
          Abrir Exchange Spot
          <i className="fa-solid fa-arrow-right text-sm transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"></i>
        </span>
      </div>
      <div className={`relative min-h-[220px] border-t border-[var(--rule)] bg-[var(--surface)] ${includeMentor ? 'lg:border-l lg:border-t-0' : ''}`}>
        <ExchangeChart />
      </div>
    </Link>
    {includeMentor && (
      <Link to="/mentor" className="note-card note-link group flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] text-[var(--ink)]">
          <i className="fa-solid fa-robot"></i>
        </span>
        <span className="min-w-0 flex-1">
          <span className="note-display block text-xl font-bold text-[var(--text)]">Kor &middot; Mentor IA</span>
          <span className="mt-1 block text-base leading-relaxed text-[var(--text-muted)]">
            ¿Dudas sobre soportes, velas o gestión de riesgo? Kor te orienta en cualquier momento.
          </span>
        </span>
        <span className="note-display inline-flex items-center gap-2 text-base font-bold text-[var(--ink)]">
          Abrir chat con Kor
          <i className="fa-solid fa-arrow-right text-sm transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"></i>
        </span>
      </Link>
    )}
  </section>
)

const ClosingNote: React.FC = () => (
  <section className="note-bill relative isolate overflow-hidden rounded-[28px] bg-[var(--ink)] px-8 py-12 text-[var(--bg)] sm:px-14 sm:py-16">
    <svg viewBox="0 0 320 320" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[460px] w-[460px]" aria-hidden="true">
      <path d={ROSETTE_A} fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.35" className="note-rosette" />
    </svg>
    <div className="max-w-2xl">
      <h2 className="note-display text-4xl font-black leading-[1.02] sm:text-6xl">Tu primera emisión empieza con un diagnóstico.</h2>
      <p className="mt-5 max-w-xl text-lg leading-relaxed opacity-80">
        Crea tu cuenta, haz el examen y Kor arma tu ruta de Trading y Finanzas desde tu nivel real.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/register" className="note-btn bg-[var(--bg)] text-[var(--ink)] hover:opacity-90">
          Crear cuenta gratis
          <i className="fa-solid fa-arrow-right text-sm"></i>
        </Link>
        <Link to="/diagnostico?cat=trading" className="note-btn border-[1.5px] border-current/50 text-[var(--bg)] hover:border-current">
          Hacer examen diagnóstico
        </Link>
      </div>
    </div>
  </section>
)

export const HomePage: React.FC = () => {
  const { user, isGuest, completeMission } = usePlatform()
  const [custom] = useProfileCustomization(user.username)
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedStudio = searchParams.get('estudio') as StudioTabId | null
  const studioOpen = !isGuest && Boolean(requestedStudio && STUDIO_TAB_IDS.includes(requestedStudio))

  const [mascotSide, setMascotSide] = useState<MascotSide>('left')
  const [heroWave, setHeroWave] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const mission = MISSIONS_BY_CATEGORY.trading
  const today = new Date().toDateString()
  const isMissionDone = user._lastMissionDate === today

  const modulesDone = Math.min(TRADING_MODULES.length, (user.moduleProgress?.trading || []).length)
  const courseProgress = TRADING_MODULES.length ? Math.round((modulesDone / TRADING_MODULES.length) * 100) : 0
  const nextLesson: string | undefined = modulesDone < TRADING_MODULES.length ? TRADING_MODULES[modulesDone] : undefined
  const currentModule = TRADING_MODULES[Math.min(modulesDone, TRADING_MODULES.length - 1)]

  const displayName: string = (user as any).username || (user as any).name || 'Usuario'
  const firstName: string = (user.name || displayName).split(' ')[0]
  const avatarUrl: string | undefined = isGuest ? undefined : resolveAvatarSrc(user.avatar, user.username)
  const xpPct = Math.min(100, (user.xp / user.xpToNext) * 100)
  const folio = String(
    Array.from(displayName).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 1000000, 7),
  ).padStart(6, '0')

  if (isGuest) {
    return (
      <div ref={rootRef} className="note-home mx-auto max-w-6xl space-y-28 py-6 sm:space-y-36">
        <style>{NOTE_STYLES}</style>
        <HeroBill onWave={() => setHeroWave((w) => w + 1)} wave={heroWave} />
        <FirstLessonSection />
        <CurriculumSection />
        <StepsSection />
        <ExchangeShowcase />
        <ClosingNote />
      </div>
    )
  }

  const ProfileWidget = (
    <div data-tour="home-profile" className="note-card relative isolate overflow-hidden">
      <div className="relative h-24 overflow-hidden bg-[var(--ink)] text-[var(--bg)]">
        {custom.homeCredentialCover && <ProfileCover custom={custom} cover={user.cover} className="absolute inset-0 h-full" />}
        <svg viewBox="0 0 320 320" className={`absolute -right-10 -top-24 h-72 w-72 ${custom.homeCredentialCover ? 'hidden' : ''}`} aria-hidden="true">
          <path d={ROSETTE_B} fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.4" />
        </svg>
        <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full border border-white/30 bg-black/30"></div>
        <div className="note-wide absolute left-4 top-3 text-[10px] font-extrabold opacity-90">CLEVER</div>
        <div className="note-wide absolute right-4 top-3 text-[10px] font-semibold opacity-80">CREDENCIAL</div>
        <div className="note-num absolute bottom-2 left-4 text-[11px] opacity-75">Folio {folio}</div>
      </div>

      <div className="-mt-12 flex justify-center">
        <div className="relative h-[104px] w-[104px]">
          <div className="note-ring absolute inset-0 rounded-full"></div>
          <div className="absolute inset-[4px] flex items-center justify-center overflow-hidden rounded-full bg-[var(--bg)]">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <i className="fa-solid fa-user text-4xl text-[var(--ink)]"></i>
            )}
          </div>
          <div className="note-display note-num absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[var(--surface)] bg-[var(--ink)] text-sm font-extrabold text-[var(--bg)]">
            {user.level}
          </div>
        </div>
      </div>

      <div className="space-y-1.5 px-5 pt-3 text-center">
        <div className="note-display truncate text-2xl font-extrabold text-[var(--text)]">{displayName}</div>
        <span className="inline-block rounded-full border border-[var(--rule)] px-3 py-0.5 text-sm font-medium text-[var(--ink)]">
          Nivel {user.level} &middot; {user.levelLabel}
        </span>
      </div>

      <div className="mx-5 mt-4 grid grid-cols-3 divide-x divide-[var(--rule)] rounded-2xl border border-[var(--rule)]">
        {[
          { value: user.streak, label: 'Racha' },
          { value: user.level, label: 'Nivel' },
          { value: user.coins, label: 'Monedas' },
        ].map((stat) => (
          <div key={stat.label} className="py-2.5 text-center">
            <div className="note-display note-num text-xl font-extrabold text-[var(--text)]">{stat.value}</div>
            <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 px-5 pt-4">
        <div className="flex justify-between text-sm text-[var(--text-muted)]">
          <span>Experiencia</span>
          <span className="note-num">
            {user.xp} / {user.xpToNext} XP
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--paper-2)]">
          <div className="h-full rounded-full bg-[var(--ink)] transition-[width] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ width: `${xpPct}%` }}></div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <Link to="/perfil" className="note-btn note-btn-line !h-11 w-full">
          Ver perfil
        </Link>
      </div>

      <div className="px-5 py-4">
        <div
          className="h-5 rounded-sm opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, var(--text) 0 2px, transparent 2px 4px, var(--text) 4px 5px, transparent 5px 8px, var(--text) 8px 11px, transparent 11px 13px)',
          }}
        ></div>
      </div>

      <div className="note-shine pointer-events-none absolute inset-0"></div>
    </div>
  )

  const MissionWidget = (
    <div className="note-paper relative isolate overflow-hidden rounded-[20px] p-6">
      <SmallRosette className="pointer-events-none absolute -bottom-10 -right-10 -z-10 h-36 w-36 opacity-60" />
      <div className="flex items-center justify-between gap-3">
        <h2 className="note-display text-xl font-extrabold text-[var(--text)]">Misión Diaria</h2>
        <span className="note-display note-num rounded-full border-[1.5px] border-[var(--ink)] px-3 py-0.5 text-sm font-extrabold text-[var(--ink)]">+{mission.xp} XP</span>
      </div>
      <p className="mt-3 text-base leading-relaxed text-[var(--text)]">{mission.text}</p>
      <div className="pt-5">
        {isMissionDone ? (
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--success)] bg-[var(--success-bg)] px-4 py-3 text-base font-medium text-[var(--success)]">
            <i className="fa-solid fa-circle-check"></i>
            <span>Completada hoy. Vuelve mañana por otra.</span>
          </div>
        ) : (
          <button type="button" onClick={() => completeMission('trading')} className="note-btn note-btn-ink w-full">
            <i className="fa-solid fa-check text-sm"></i>
            Marcar como completada
          </button>
        )}
      </div>
    </div>
  )

  const MentorWidget = (
    <Link to="/mentor" className="note-card note-link group block space-y-2 p-5">
      <h2 className="note-display flex items-center gap-2 text-lg font-extrabold text-[var(--text)]">
        <i className="fa-solid fa-robot text-sm text-[var(--ink)]"></i>
        Kor &middot; Mentor IA
      </h2>
      <p className="text-[15px] leading-relaxed text-[var(--text-muted)]">
        ¿Dudas sobre soportes, velas o gestión de riesgo? Kor te orienta en cualquier momento.
      </p>
      <span className="note-display inline-flex items-center gap-1.5 pt-1 text-base font-bold text-[var(--ink)]">
        Abrir chat con Kor
        <i className="fa-solid fa-arrow-right text-xs transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"></i>
      </span>
    </Link>
  )

  const greetingText =
    custom.homeGreeting === 'custom' ? custom.homeGreetingText.trim() || 'Continúa donde lo dejaste.' : HOME_GREETINGS.find((item) => item.id === custom.homeGreeting)?.text || 'Continúa donde lo dejaste.'

  const lessonBg = custom.homeLessonBg
  const lessonIsDark = HOME_LESSON_BACKGROUNDS.find((item) => item.id === lessonBg)?.dark ?? false

  const mainBlocks: Record<HomeMainSection, React.ReactNode> = {
    lesson: (
    <section
      data-tour="home-learning"
      className={`note-bill relative isolate overflow-hidden rounded-[24px] ${lessonBg === 'bill' ? 'note-paper' : lessonBg === 'paper' ? 'border border-[var(--rule)] bg-[var(--surface)]' : 'border border-transparent'}`}
      style={lessonIsDark ? LESSON_DARK_VARS : undefined}
    >
      {lessonBg === 'ink' && <div className="absolute inset-0 -z-20" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 82%, #000), color-mix(in srgb, var(--primary) 55%, #0b1226))' }}></div>}
      {isSceneBg(lessonBg) && (
        <>
          <ModernBanner style={lessonBg} colorA={DEFAULT_BANNER_A} colorB={DEFAULT_BANNER_B} speed={1} className="absolute inset-0 -z-20 h-full" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,10,24,.78),rgba(5,10,24,.35)_75%)]"></div>
        </>
      )}
      {(lessonBg === 'bill' || lessonBg === 'ink') && <Rosette className={`pointer-events-none absolute -right-40 -top-44 -z-10 h-[440px] w-[440px] ${lessonBg === 'ink' ? 'opacity-40' : ''}`} />}
      {lessonBg !== 'paper' && (
        <div className="absolute inset-x-6 top-3">
          <Microtext />
        </div>
      )}
      <div className="p-6 pt-10 sm:p-9 sm:pt-12">
        <div className="flex items-center gap-3">
          <span className="note-wide text-xs font-extrabold text-[var(--ink)]">TRADING Y FINANZAS</span>
          <span className="h-px w-8 bg-[var(--rule)]"></span>
          <span className="note-num text-sm text-[var(--text-muted)]">
            Módulo {String(Math.min(modulesDone + 1, TRADING_MODULES.length)).padStart(2, '0')} de {String(TRADING_MODULES.length).padStart(2, '0')}
          </span>
        </div>
        <h2 className="note-display mt-4 max-w-[18ch] text-3xl font-black leading-[1.02] text-[var(--text)] hyphens-auto [overflow-wrap:break-word] sm:text-[2.6rem]">
          {nextLesson || currentModule}
        </h2>

        <div className="mt-7 grid grid-cols-8 gap-1.5" aria-label={`Progreso del curso: ${courseProgress}%`}>
          {TRADING_MODULES.map((title, i) => (
            <span
              key={title}
              title={title}
              className={`h-2.5 rounded-full ${i < modulesDone ? 'bg-[var(--ink)]' : i === modulesDone ? 'bg-[color-mix(in_srgb,var(--ink)_45%,transparent)]' : 'bg-[var(--paper-2)]'}`}
            ></span>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-sm text-[var(--text-muted)]">
          <span>
            {modulesDone} de {TRADING_MODULES.length} módulos completados
          </span>
          <span className="note-num">{courseProgress}%</span>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/aprender?cat=trading" className="note-btn note-btn-ink">
            <i className="fa-solid fa-play text-sm"></i>
            Seguir nivel
          </Link>
          <Link to="/aprender?cat=trading&view=path" className="note-btn note-btn-line">
            Ver camino completo
          </Link>
        </div>
      </div>
    </section>
    ),
    exchange: <ExchangeShowcase includeMentor={false} />,
  }

  const sideBlocks: Record<HomeSideSection, React.ReactNode> = {
    credential: ProfileWidget,
    mission: MissionWidget,
    mentor: MentorWidget,
  }

  const visibleMain = custom.homeMain.filter((id) => id === 'lesson' || !custom.homeHidden.includes(id))
  const visibleSide = custom.homeSide.filter((id) => !custom.homeHidden.includes(id))
  const mobileOrder = (column: 'main' | 'side', index: number) => (column === 'side' ? index + 1 : index === 0 ? 0 : visibleSide.length + index)

  return (
    <div ref={rootRef} className={`note-home mx-auto max-w-6xl py-6 transition-[padding] duration-300 ${custom.homeCompact ? 'space-y-6' : 'space-y-10'} ${studioOpen ? 'lg:pr-[452px]' : ''}`}>
      <style>{NOTE_STYLES}</style>
      {custom.homeCredentialCover && <style>{PROFILE_STYLES}</style>}
      {custom.homeMascot && <DraggableMascot side={mascotSide} onSideChange={setMascotSide} anchorRef={rootRef} />}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="note-display pr-20 text-4xl font-black leading-[1.02] text-[var(--text)] sm:text-[3.4rem] lg:pr-0">
          Hola, {firstName}.
          <span className="block text-[var(--text-muted)]">{greetingText}</span>
        </h1>
        <button
          type="button"
          onClick={() => setSearchParams({ estudio: 'inicio' })}
          className="note-btn note-btn-line !h-10 !px-4 text-[14px]"
        >
          <i className="fa-solid fa-wand-magic-sparkles text-[12px]"></i>
          Personalizar inicio
        </button>
      </div>

      <div className={`flex flex-col lg:grid lg:items-start ${custom.homeCompact ? 'gap-5' : 'gap-8'} ${custom.homeSidebarLeft ? 'lg:grid-cols-[340px_1fr]' : 'lg:grid-cols-[1fr_340px]'}`}>
        <div className={`contents lg:flex lg:min-w-0 lg:flex-col ${custom.homeCompact ? 'lg:gap-10' : 'lg:gap-16'} ${custom.homeSidebarLeft ? 'lg:order-2' : ''}`}>
          {visibleMain.map((id, index) => (
            <div key={id} className="min-w-0" style={{ order: mobileOrder('main', index) }}>
              {mainBlocks[id]}
            </div>
          ))}
        </div>

        <aside className={`contents lg:flex lg:flex-col lg:gap-5 ${custom.homeSidebarLeft ? 'lg:order-1' : ''}`}>
          {visibleSide.map((id, index) => (
            <div key={id} style={{ order: mobileOrder('side', index) }}>
              {sideBlocks[id]}
            </div>
          ))}
        </aside>
      </div>

      <ProfileStudio
        open={studioOpen}
        tab={studioOpen ? (requestedStudio as StudioTabId) : 'inicio'}
        onTabChange={(tab) => setSearchParams({ estudio: tab }, { replace: true })}
        onClose={() => setSearchParams({})}
      />
    </div>
  )
}
