import React, { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { COURSE_LESSONS, COURSE_SHORT_NAME, COURSE_TOPICS, TOTAL_LESSONS, TOTAL_TOPICS, getCourseProgress, lessonPath } from '../data/course'
import { CleverkorMascot3D } from '../components/CleverkorMascot3D'
import { DraggableMascot, type MascotSide } from '../components/DraggableMascot'
import { Microtext, NOTE_STYLES, ROSETTE_A, ROSETTE_B, Rosette, SmallRosette, WaveField } from '../components/note/NoteKit'
import { ProfileStudio, STUDIO_TAB_IDS } from '../components/profile/ProfileStudio'
import type { StudioTabId } from '../components/profile/ProfileStudio'
import { ProfileCover } from '../components/profile/ProfileLayouts'
import { PROFILE_STYLES } from '../components/profile/ProfileVisuals'
import { DEFAULT_BANNER_A, DEFAULT_BANNER_B, HOME_GREETINGS, HOME_LESSON_BACKGROUNDS } from '../data/profileCustomizationOptions'
import { ModernBanner } from '../components/profile/ProfileBanners'
import FitText from '../components/FitText'
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

const lessonTitleSize = (title: string) => {
  const longest = Math.max(0, ...(title || '').split(/\s+/).map((word) => word.length))
  if ((title || '').length > 48) return 'max-w-[28ch] text-[26px] sm:text-[2.2rem]'
  if (longest > 16) return 'max-w-full text-[22px] sm:text-[2rem]'
  if (longest > 12) return 'max-w-[22ch] text-2xl sm:text-[2.2rem]'
  return 'max-w-[18ch] text-3xl sm:text-[2.6rem]'
}

const STEPS = [
  { icon: 'fa-solid fa-user-plus', title: 'Crea tu cuenta', text: 'Es gratis y guarda tu avance lección por lección.' },
  { icon: 'fa-solid fa-route', title: 'Sigue tu camino', text: 'Seis temas en orden, de lo esencial a lo avanzado.' },
  { icon: 'fa-solid fa-book-open-reader', title: 'Estudia con ejemplos', text: 'Cada lección trae conceptos, casos con números reales y tablas de apoyo.' },
  { icon: 'fa-solid fa-pen-ruler', title: 'Ponlo en práctica', text: 'Cierra cada lección con actividades para aplicar lo aprendido.' },
]

const LEVEL_STEPS = ['Principiante', 'Intermedio', 'Avanzado']

const topicLevels = (topicIndex: number) => {
  const found = new Set<string>()
  COURSE_LESSONS.filter((lesson) => lesson.topicIndex === topicIndex).forEach((lesson) =>
    lesson.level.split('·').forEach((level) => found.add(level.trim())),
  )
  const ordered = LEVEL_STEPS.filter((level) => found.has(level))
  if (ordered.length <= 1) return ordered[0] || ''
  return `${ordered[0]} a ${ordered[ordered.length - 1]}`
}

const FIRST_LESSON = COURSE_LESSONS[0]




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

        <h1 className="note-display mt-10 max-w-[17ch] pr-16 sm:pr-0 text-[clamp(2.4rem,4.4vw,4.1rem)] font-black leading-[0.98] [font-stretch:100%] text-[var(--text)] [text-wrap:balance]">
          Aprende trading, blockchain y finanzas digitales.
        </h1>

        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-[var(--text-muted)] sm:text-xl">
          Un curso de <strong className="font-semibold text-[var(--text)]">{TOTAL_TOPICS} temas y {TOTAL_LESSONS} lecciones</strong> que va de la inflación y el interés compuesto hasta las finanzas descentralizadas, con <strong className="font-semibold text-[var(--text)]">Kor</strong> a tu lado.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link to="/register" className="note-btn note-btn-ink">
            Crear cuenta gratis
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
          <a href="#temario" className="note-btn note-btn-line">
            Ver el temario
          </a>
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
          <div className="text-sm text-[var(--text-muted)]">Tu guía en cada lección</div>
        </div>
      </div>
    </div>
  </section>
)

const FirstLessonSection: React.FC = () => (
  <section className="space-y-10">
    <SectionHeading title="Empieza por la primera lección" text="El Tema 1 abre el camino. Crea tu cuenta y da el primer paso." />
    <Link to="/aprender" className="note-paper note-link group relative isolate grid overflow-hidden rounded-[24px] md:grid-cols-[1fr_auto]">
      <SmallRosette className="pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64 opacity-60" />
      <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--ink)] text-2xl text-[var(--bg)]">
          <i className={COURSE_TOPICS[0].icon}></i>
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
            <span className="note-wide text-xs font-extrabold text-[var(--ink)]">TEMA 1 · {COURSE_TOPICS[0].shortTitle.toUpperCase()}</span>
            <span className="h-px w-8 bg-[var(--rule)]"></span>
            <span className="note-num">
              {FIRST_LESSON.level}
            </span>
          </div>
          <h3 className="note-display mt-2 text-2xl font-black leading-tight text-[var(--text)] sm:text-3xl">
            Lección {FIRST_LESSON.id} · {FIRST_LESSON.title}
          </h3>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-[var(--text-muted)]">{FIRST_LESSON.description}.</p>
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

const CourseFacts: React.FC = () => (
  <dl className="grid grid-cols-2 border-y border-[var(--rule)] sm:grid-cols-4">
    {[
      { value: String(TOTAL_TOPICS), label: 'Temas' },
      { value: String(TOTAL_LESSONS), label: 'Lecciones' },
      { value: '100%', label: 'Gratis y a tu ritmo' },
      { value: '3', label: 'Niveles: principiante, intermedio y avanzado' },
    ].map((fact, index) => (
      <div key={fact.label} className={`px-4 py-6 sm:px-6 ${index % 2 === 1 ? 'border-l border-[var(--rule)]' : ''} ${index >= 2 ? 'border-t border-[var(--rule)] sm:border-t-0' : ''} ${index === 2 ? 'sm:border-l' : ''}`}>
        <dt className="sr-only">{fact.label}</dt>
        <dd className="note-display note-num text-4xl font-black leading-none text-[var(--ink)] sm:text-5xl">{fact.value}</dd>
        <dd className="mt-2 text-sm leading-snug text-[var(--text-muted)]">{fact.label}</dd>
      </div>
    ))}
  </dl>
)

const CurriculumSection: React.FC = () => (
  <section id="temario" data-tour="home-topics" className="scroll-mt-28 space-y-10">
    <SectionHeading title="Lo que vas a dominar" text="Seis temas en orden. Cada uno se apoya en el anterior, de tu primera vela japonesa a las finanzas descentralizadas." />
    <CourseFacts />
    <ol className="grid gap-5 md:grid-cols-2">
      {COURSE_TOPICS.map((topic, topicIndex) => {
        return (
          <li key={topic.number} className="note-card flex flex-col p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--ink)] text-lg text-[var(--bg)]">
                <i className={topic.icon}></i>
              </span>
              <div className="min-w-0">
                <div className="note-wide text-[11px] font-extrabold text-[var(--ink)]">
                  TEMA {topic.number} &middot; {topicLevels(topicIndex).toUpperCase()}
                </div>
                <h3 className="note-display mt-1 text-xl font-black leading-tight text-[var(--text)] sm:text-[1.4rem]">{topic.title}</h3>
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-muted)]">{topic.summary}</p>
            <ol className="mt-5 flex-1 divide-y divide-[var(--rule)] border-t border-[var(--rule)]">
              {topic.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-baseline gap-3 py-2.5">
                  <span className="note-num w-8 shrink-0 text-sm font-bold text-[var(--ink)]">{lesson.id}</span>
                  <span className="min-w-0 flex-1 text-[15px] leading-snug text-[var(--text)]">{lesson.title}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-muted)]">
              <span>{topic.lessons.length} lecciones</span>
              <span>{topicLevels(topicIndex)}</span>
            </div>
          </li>
        )
      })}
    </ol>
  </section>
)

const StepsSection: React.FC = () => (
  <section className="space-y-10">
    <SectionHeading title="Cómo funciona" text="Cuatro pasos entre tu primera visita y tu primer tema terminado." />
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

const ClosingNote: React.FC = () => (
  <section className="note-bill relative isolate overflow-hidden rounded-[28px] bg-[var(--ink)] px-8 py-12 text-[var(--bg)] sm:px-14 sm:py-16">
    <svg viewBox="0 0 320 320" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[460px] w-[460px]" aria-hidden="true">
      <path d={ROSETTE_A} fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.35" className="note-rosette" />
    </svg>
    <div className="max-w-2xl">
      <h2 className="note-display text-4xl font-black leading-[1.02] sm:text-6xl">Tu primera lección te está esperando.</h2>
      <p className="mt-5 max-w-xl text-lg leading-relaxed opacity-80">
        Crea tu cuenta gratis y empieza por el Tema 1: {COURSE_TOPICS[0].title.toLowerCase()}.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/register" className="note-btn bg-[var(--bg)] text-[var(--ink)] hover:opacity-90">
          Crear cuenta gratis
          <i className="fa-solid fa-arrow-right text-sm"></i>
        </Link>
        <Link to="/login" className="note-btn border-[1.5px] border-current/50 text-[var(--bg)] hover:border-current">
          Ya tengo cuenta
        </Link>
      </div>
    </div>
  </section>
)

export const HomePage: React.FC = () => {
  const { user, isGuest } = usePlatform()
  const [custom] = useProfileCustomization(user.username)
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedStudio = searchParams.get('estudio') as StudioTabId | null
  const studioOpen = !isGuest && Boolean(requestedStudio && STUDIO_TAB_IDS.includes(requestedStudio))

  const [mascotSide, setMascotSide] = useState<MascotSide>('left')
  const [heroWave, setHeroWave] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const course = getCourseProgress(user.moduleProgress)
  const nextLesson = course.next

  const displayName: string = (user as any).username || (user as any).name || 'Usuario'
  const firstName: string = (user.name || displayName).split(' ')[0]
  const avatarUrl: string | undefined = isGuest ? undefined : resolveAvatarSrc(user.avatar, user.username)
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
        <ClosingNote />
      </div>
    )
  }

  const ProfileWidget = (
    <div className="note-card relative isolate overflow-hidden">
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
        </div>
      </div>

      <div className="space-y-1.5 px-5 pt-3 text-center">
        <div className="note-display truncate text-2xl font-extrabold text-[var(--text)]">{displayName}</div>
        <span className="inline-block rounded-full border border-[var(--rule)] px-3 py-0.5 text-sm font-medium text-[var(--ink)]">
          {course.isDone ? 'Curso completado' : `Tema ${course.currentTopic.number} · ${course.currentTopic.shortTitle}`}
        </span>
      </div>

      <div className="mx-5 mt-4 grid grid-cols-3 divide-x divide-[var(--rule)] rounded-2xl border border-[var(--rule)]">
        {[
          { value: `${course.done}/${TOTAL_LESSONS}`, label: 'Lecciones' },
          { value: `${course.topicsDone}/${TOTAL_TOPICS}`, label: 'Temas' },
          { value: `${course.percent}%`, label: 'Avance' },
        ].map((stat) => (
          <div key={stat.label} className="py-2.5 text-center">
            <div className="note-display note-num text-xl font-extrabold text-[var(--text)]">{stat.value}</div>
            <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 px-5 pt-4">
        <div className="flex justify-between text-sm text-[var(--text-muted)]">
          <span>Avance del curso</span>
          <span className="note-num">{course.percent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--paper-2)]">
          <div className="h-full rounded-full bg-[var(--ink)] transition-[width] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ width: `${Math.max(course.percent, 2)}%` }}></div>
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

  const DetailsWidget = (
    <div className="note-paper relative isolate overflow-hidden rounded-[20px] p-6">
      <SmallRosette className="pointer-events-none absolute -bottom-10 -right-10 -z-10 h-36 w-36 opacity-60" />
      <div className="note-wide text-[11px] font-extrabold text-[var(--ink)]">FICHA DE LA LECCIÓN {nextLesson.id}</div>
      <h2 className="note-display mt-2 text-xl font-extrabold leading-snug text-[var(--text)]">Lo que vas a lograr</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-[var(--text)]">{nextLesson.objective}.</p>
      <dl className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-[var(--rule)] px-3 py-2">
          <dt className="text-xs text-[var(--text-muted)]">Tema</dt>
          <dd className="text-[14px] font-bold leading-tight text-[var(--text)]">{nextLesson.topicShortTitle}</dd>
        </div>
        <div className="rounded-2xl border border-[var(--rule)] px-3 py-2">
          <dt className="text-xs text-[var(--text-muted)]">Nivel</dt>
          <dd className="text-[14px] font-bold leading-tight text-[var(--text)]">{nextLesson.level}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {nextLesson.keywords.slice(0, 6).map((keyword) => (
          <span key={keyword} className="rounded-full border border-[var(--rule)] bg-[var(--surface)] px-2.5 py-1 text-[12.5px] font-medium text-[var(--text)]">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  )

  const TopicsBlock = (
    <section data-tour="home-topics" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--rule)] pb-4">
        <div>
          <h2 className="note-display text-3xl font-extrabold leading-tight text-[var(--text)] sm:text-[2.3rem]">Temas del curso</h2>
          <p className="mt-1 text-base text-[var(--text-muted)]">
            {course.topicsDone} de {TOTAL_TOPICS} temas terminados &middot; {COURSE_SHORT_NAME}
          </p>
        </div>
        <Link to="/aprender" className="note-display inline-flex items-center gap-1.5 text-base font-bold text-[var(--ink)]">
          Ver el mapa
          <i className="fa-solid fa-arrow-right text-xs"></i>
        </Link>
      </div>
      <ol className="grid gap-3 sm:grid-cols-2">
        {course.topicStats.map(({ topic, done, total }, topicIndex) => {
          const isCurrent = !course.isDone && topicIndex === course.next.topicIndex
          const isComplete = done === total
          return (
            <li key={topic.number}>
              <Link
                to="/aprender"
                className={`note-card note-link group flex h-full items-center gap-4 p-4 ${isCurrent ? 'ring-2 ring-[var(--ink)]' : ''}`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[15px] ${
                    isComplete || isCurrent ? 'bg-[var(--ink)] text-[var(--bg)]' : 'bg-[var(--paper-2)] text-[var(--ink)]'
                  }`}
                >
                  <i className={isComplete ? 'fa-solid fa-check' : topic.icon}></i>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="note-wide block text-[10px] font-extrabold text-[var(--ink)]">
                    TEMA {topic.number}
                    {isCurrent ? ' · EN CURSO' : ''}
                  </span>
                  <span className="note-display block truncate text-[17px] font-bold text-[var(--text)]">{topic.shortTitle}</span>
                  <span className="mt-1.5 flex items-center gap-2">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--paper-2)]">
                      <span className="block h-full rounded-full bg-[var(--ink)]" style={{ width: `${(done / total) * 100}%` }}></span>
                    </span>
                    <span className="note-num shrink-0 text-xs text-[var(--text-muted)]">
                      {done}/{total}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )

  const greetingText =
    custom.homeGreeting === 'custom' ? custom.homeGreetingText.trim() || 'Continúa donde lo dejaste.' : HOME_GREETINGS.find((item) => item.id === custom.homeGreeting)?.text || 'Continúa donde lo dejaste.'

  const lessonBg = custom.homeLessonBg
  const lessonIsDark = HOME_LESSON_BACKGROUNDS.find((item) => item.id === lessonBg)?.dark ?? false

  const mainBlocks: Record<HomeMainSection, React.ReactNode> = {
    lesson: (
    <section
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
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="note-wide text-xs font-extrabold text-[var(--ink)]">
            TEMA {nextLesson.topicNumber} &middot; {nextLesson.topicShortTitle.toUpperCase()}
          </span>
          <span className="h-px w-8 bg-[var(--rule)]"></span>
          <span className="note-num text-sm text-[var(--text-muted)]">
            Lección {nextLesson.id} &middot; {nextLesson.index + 1} de {TOTAL_LESSONS}
          </span>
        </div>
        <FitText as="h2" className={`note-display mt-4 font-black leading-[1.02] text-[var(--text)] [overflow-wrap:break-word] [text-wrap:balance] ${lessonTitleSize(nextLesson.title)}`}>
          {nextLesson.title}
        </FitText>
        <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-[var(--text-muted)]">{nextLesson.description}.</p>

        <div className="mt-7 flex gap-2" aria-label={`Progreso del curso: ${course.percent}%`}>
          {COURSE_TOPICS.map((topic, topicIndex) => (
            <div key={topic.number} className="flex flex-1 gap-[3px]" style={{ flexGrow: topic.lessons.length }}>
              {COURSE_LESSONS.filter((lesson) => lesson.topicIndex === topicIndex).map((lesson) => (
                <span
                  key={lesson.id}
                  title={`${lesson.id} ${lesson.title}`}
                  className={`h-2.5 flex-1 rounded-full ${
                    course.completed.has(lesson.index)
                      ? 'bg-[var(--ink)]'
                      : !course.isDone && lesson.index === course.resumeIndex
                        ? 'bg-[color-mix(in_srgb,var(--ink)_45%,transparent)]'
                        : 'bg-[var(--paper-2)]'
                  }`}
                ></span>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-sm text-[var(--text-muted)]">
          <span>
            {course.done} de {TOTAL_LESSONS} lecciones completadas
          </span>
          <span className="note-num">{course.percent}%</span>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to={lessonPath(course.resumeIndex)} className="note-btn note-btn-ink">
            <i className="fa-solid fa-play text-sm"></i>
            {course.isDone ? 'Repasar lección' : course.done ? 'Seguir lección' : 'Empezar lección'}
          </Link>
          <Link to="/aprender" className="note-btn note-btn-line">
            Ver camino completo
          </Link>
        </div>
      </div>
    </section>
    ),
    topics: TopicsBlock,
  }

  const sideBlocks: Record<HomeSideSection, React.ReactNode> = {
    credential: ProfileWidget,
    details: DetailsWidget,
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
        <FitText as="h1" className="note-display min-w-0 max-w-full pr-20 text-4xl font-black leading-[1.02] text-[var(--text)] sm:text-[3.4rem] lg:pr-0">
          Hola, {firstName}.
          <span className="block text-[var(--text-muted)]">{greetingText}</span>
        </FitText>
        <button
          type="button"
          onClick={() => setSearchParams({ estudio: 'inicio' })}
          className="note-btn note-btn-line !h-10 !px-4 text-[14px]"
        >
          <i className="fa-solid fa-wand-magic-sparkles text-[12px]"></i>
          Personalizar inicio
        </button>
      </div>

      <div className="@container">
        <div className={`flex flex-col @4xl:grid @4xl:items-start ${custom.homeCompact ? 'gap-5' : 'gap-8'} ${custom.homeSidebarLeft ? '@4xl:grid-cols-[340px_1fr]' : '@4xl:grid-cols-[1fr_340px]'}`}>
          <div className={`contents @4xl:flex @4xl:min-w-0 @4xl:flex-col ${custom.homeCompact ? '@4xl:gap-10' : '@4xl:gap-16'} ${custom.homeSidebarLeft ? '@4xl:order-2' : ''}`}>
            {visibleMain.map((id, index) => (
              <div key={id} className="min-w-0" style={{ order: mobileOrder('main', index) }}>
                {mainBlocks[id]}
              </div>
            ))}
          </div>

          <aside className={`contents @4xl:flex @4xl:flex-col @4xl:gap-5 ${custom.homeSidebarLeft ? '@4xl:order-1' : ''}`}>
            {visibleSide.map((id, index) => (
              <div key={id} style={{ order: mobileOrder('side', index) }}>
                {sideBlocks[id]}
              </div>
            ))}
          </aside>
        </div>
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
