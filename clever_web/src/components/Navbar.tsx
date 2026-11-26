import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { resolveAvatarSrc } from '../data/avatarPresets'
import { useProfileCustomization } from '../services/profileCustomizationService'
import { COURSE_LESSONS, TOTAL_LESSONS, getCourseProgress, lessonPath } from '../data/course'
import type { NavStyle } from '../types/profileCustomization'
import { NOTE_STYLES, WaveField } from './note/NoteKit'

interface NavItem {
  to: string
  label: string
  shortLabel: string
  icon: string
  locked?: boolean
}

interface MoreItem {
  to: string
  label: string
  description: string
  icon: string
}

const MAIN_ITEMS: NavItem[] = [
  { to: '/', label: 'Inicio', shortLabel: 'Inicio', icon: 'fa-solid fa-house' },
  { to: '/aprender', label: 'Aprender', shortLabel: 'Aprender', icon: 'fa-solid fa-road' },
  { to: '/analisis', label: 'Análisis Técnico', shortLabel: 'Análisis', icon: 'fa-solid fa-magnifying-glass-chart', locked: true },
]

const MORE_ITEMS: MoreItem[] = [
  { to: '/conocenos', label: 'Conócenos', description: 'Quiénes somos', icon: 'fa-solid fa-circle-info' },
]

const PROFILE_ITEMS: MoreItem[] = [
  { to: '/perfil', label: 'Perfil', description: '', icon: 'fa-solid fa-user' },
  { to: '/perfil?estudio=diseno', label: 'Personalizar', description: '', icon: 'fa-solid fa-wand-magic-sparkles' },
  { to: '/progreso', label: 'Mi Progreso', description: '', icon: 'fa-solid fa-chart-pie' },
  { to: '/configuracion', label: 'Configuración', description: '', icon: 'fa-solid fa-gear' },
]

const ISLAND_MAX = 1240
const ISLAND_SCROLLED_MIN = 1000

const NAV_MICROTEXT = 'CLEVER · TRADING · BLOCKCHAIN · FINANZAS DIGITALES · SERIE KOR · '.repeat(10)

const NAV_STYLES = `
.nav-shell{--coin:#d99a1e}
.nav-shell .nav-font{font-family:var(--font-display);font-stretch:var(--display-stretch)}
.nav-marquee{animation:nav-marquee 60s linear infinite}
@keyframes nav-marquee{to{transform:translateX(-50%)}}
.nav-ticker{animation:nav-marquee var(--ticker-dur,70s) linear infinite}
.nav-ticker-wrap:hover .nav-ticker{animation-play-state:paused}
.nav-ink{transition:left .45s cubic-bezier(.23,1,.32,1),width .45s cubic-bezier(.23,1,.32,1),opacity .2s}
.nav-link{transition:color .2s}
.nav-flame{display:inline-block;transform-origin:50% 90%;animation:nav-flame 1.8s ease-in-out infinite}
@keyframes nav-flame{0%,100%{transform:scale(1) rotate(-4deg)}50%{transform:scale(1.1,1.16) rotate(4deg)}}
.nav-bump{animation:nav-bump .55s cubic-bezier(.23,1,.32,1)}
@keyframes nav-bump{0%{transform:scale(1)}35%{transform:scale(1.2)}100%{transform:scale(1)}}
.nav-delta{animation:nav-delta 1.2s cubic-bezier(.23,1,.32,1) forwards}
@keyframes nav-delta{0%{opacity:0;transform:translate(-50%,4px)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-18px)}}
.nav-pop{transition:opacity .18s,transform .24s cubic-bezier(.23,1,.32,1),visibility .24s}
.nav-pop[data-open="false"]{opacity:0;transform:translateY(-6px) scale(.97);visibility:hidden;pointer-events:none}
.nav-sheet{transition:transform .34s cubic-bezier(.23,1,.32,1),visibility .34s}
.nav-sheet[data-open="false"]{transform:translateY(105%);visibility:hidden}
.nav-scrim{transition:opacity .25s,visibility .25s}
.nav-scrim[data-open="false"]{opacity:0;visibility:hidden;pointer-events:none}
.nav-tab-ind{transition:left .42s cubic-bezier(.23,1,.32,1),opacity .2s}
.nav-tab:active .nav-tab-icon{transform:scale(.88)}
.nav-tab-icon{transition:transform .2s cubic-bezier(.23,1,.32,1),color .2s}
.nav-logo-ring{transition:transform 1.4s cubic-bezier(.23,1,.32,1);transform-origin:center}
.nav-logo:hover .nav-logo-ring{transform:rotate(120deg)}
.nav-chevron{transition:transform .25s cubic-bezier(.23,1,.32,1)}
.nav-item-row{transition:background-color .15s}
.nav-item-icon{transition:background-color .2s,color .2s}
.nav-item-row:hover .nav-item-icon{background:var(--ink);color:var(--bg)}
.nav-xp{transition:width .8s cubic-bezier(.23,1,.32,1)}
.nav-island{transition:height .4s cubic-bezier(.22,1,.36,1),box-shadow .4s ease,background-color .4s ease,max-width .5s cubic-bezier(.22,1,.36,1)}
.nav-rail{transition:width .32s cubic-bezier(.23,1,.32,1),box-shadow .32s}
.nav-rail-label{transition:opacity .2s .05s,transform .25s cubic-bezier(.23,1,.32,1)}
.nav-rail:not(:hover):not(:focus-within) .nav-rail-label{opacity:0;transform:translateX(-6px);pointer-events:none}
.nav-rail:not(:hover):not(:focus-within) .nav-rail-stats{display:none}
.nav-rail:hover,.nav-rail:focus-within{width:248px;box-shadow:18px 0 40px -30px rgba(10,20,40,.55)}
@media (prefers-reduced-motion:reduce){
.nav-marquee,.nav-ticker,.nav-flame,.nav-bump,.nav-delta{animation:none!important}
.nav-ink,.nav-pop,.nav-sheet,.nav-scrim,.nav-tab-ind,.nav-logo-ring,.nav-chevron,.nav-item-row,.nav-item-icon,.nav-xp,.nav-tab-icon,.nav-island,.nav-rail,.nav-rail-label{transition:none!important}
.nav-delta{display:none}
}
`

const useDismiss = (isOpen: boolean, close: () => void, ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!isOpen) return
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) close()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close, ref])
}

const matchesPath = (pathname: string, to: string) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`))

const Avatar: React.FC<{ src: string; initials: string; progress: number; size?: number }> = ({ src, initials, progress, size = 36 }) => (
  <span
    className="relative inline-flex shrink-0 items-center justify-center rounded-full p-[2.5px]"
    style={{ width: size, height: size, background: `conic-gradient(var(--ink) ${progress * 360}deg, color-mix(in srgb, var(--ink) 16%, transparent) 0deg)` }}
  >
    <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-[var(--bg-alt)] bg-[var(--surface)] text-[11px] font-bold text-[var(--text)]">
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : initials}
    </span>
  </span>
)

const LogoMark: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <Link to="/" className="nav-logo flex shrink-0 items-center gap-2.5" aria-label="Clever, ir a Inicio">
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
      <svg viewBox="0 0 40 40" className="nav-logo-ring absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="var(--ink)" strokeWidth="1" strokeDasharray="2 2.6" opacity="0.6" />
      </svg>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ink)] text-[12px] text-[var(--bg)]">
        <i className="fa-solid fa-graduation-cap"></i>
      </span>
    </span>
    <span className={`flex-col leading-none ${compact ? 'nav-rail-label flex' : 'hidden min-[430px]:flex'}`}>
      <span className="note-display text-[17px] font-black text-[var(--text)]">CLEVER</span>
      <span className="note-wide mt-0.5 text-[8px] font-bold text-[var(--ink)] opacity-80">PLATAFORMA</span>
    </span>
  </Link>
)

type TickerLesson = (typeof COURSE_LESSONS)[number]

const TickerStrip: React.FC<{ completed: Set<number>; resumeIndex: number }> = ({ completed, resumeIndex }) => {
  const statusIcon = (lesson: TickerLesson) =>
    completed.has(lesson.index) ? 'fa-solid fa-circle-check' : lesson.index === resumeIndex ? 'fa-solid fa-circle-play' : 'fa-solid fa-lock'
  const row = (copy: number) => (
    <span className="flex shrink-0 items-center" aria-hidden={copy > 0}>
      {COURSE_LESSONS.map((lesson) => {
        const isOpen = completed.has(lesson.index) || lesson.index === resumeIndex
        const isCurrent = lesson.index === resumeIndex
        return (
          <Link
            key={`${copy}-${lesson.id}`}
            to={isOpen ? lessonPath(lesson.index) : '/aprender'}
            tabIndex={copy > 0 ? -1 : undefined}
            className="flex items-center gap-2 border-r border-[var(--rule)] px-4 text-[12px] hover:bg-[var(--paper)]"
          >
            <i className={`${statusIcon(lesson)} text-[11px] ${isOpen ? 'text-[var(--ink)]' : 'text-[var(--text-dim)]'}`}></i>
            <span className="note-num font-bold text-[var(--ink)]">{lesson.id}</span>
            <span className={`nav-font max-w-[260px] truncate font-semibold ${isCurrent ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>{lesson.title}</span>
          </Link>
        )
      })}
    </span>
  )
  return (
    <div className="nav-ticker-wrap relative flex h-8 items-stretch overflow-hidden border-t border-[var(--rule)] bg-[var(--paper)]" aria-label="Lecciones del curso">
      <span className="note-wide relative z-10 flex shrink-0 items-center gap-1.5 bg-[var(--ink)] px-3 text-[9px] font-bold text-[var(--bg)]">
        <i className="fa-solid fa-road text-[10px]"></i>
        {completed.size}/{TOTAL_LESSONS}
      </span>
      <div className="nav-ticker flex w-max items-stretch" style={{ ['--ticker-dur' as string]: `${TOTAL_LESSONS * 6}s` } as React.CSSProperties}>
        {row(0)}
        {row(1)}
      </div>
    </div>
  )
}

export const Navbar: React.FC = () => {
  const { user, isGuest, logout } = usePlatform()
  const [customization] = useProfileCustomization(user.username)
  const navStyle: NavStyle = isGuest ? 'bill' : customization.navStyle
  const location = useLocation()
  const navigate = useNavigate()

  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [hoverKey, setHoverKey] = useState<string | null>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false })
  const [isScrolled, setIsScrolled] = useState(false)
  const [fitLevel, setFitLevel] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)
  const fitLevelRef = useRef(0)
  const neededRef = useRef<number[]>([0, 0, 0])
  const rowRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  const itemRefs = useRef(new Map<string, HTMLElement>())
  const linksRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const railProfileRef = useRef<HTMLDivElement>(null)

  const closeMore = useCallback(() => setIsMoreOpen(false), [])
  const closeProfile = useCallback(() => setIsProfileOpen(false), [])
  useDismiss(isMoreOpen, closeMore, moreRef)
  useDismiss(isProfileOpen && navStyle !== 'sidebar', closeProfile, profileRef)
  useDismiss(isProfileOpen && navStyle === 'sidebar', closeProfile, railProfileRef)

  const pathname = location.pathname
  const isMoreActive = MORE_ITEMS.some((item) => matchesPath(pathname, item.to))
  const activeKey = MAIN_ITEMS.find((item) => matchesPath(pathname, item.to))?.to ?? (isMoreActive ? 'more' : null)
  const targetKey = hoverKey ?? activeKey
  const activeTabIndex = MAIN_ITEMS.findIndex((item) => matchesPath(pathname, item.to))
  const tabIndex = isSheetOpen || (activeTabIndex < 0 && isMoreActive) ? MAIN_ITEMS.length : activeTabIndex
  const isIsland = navStyle === 'island'

  const course = getCourseProgress(user.moduleProgress)
  const courseRatio = course.percent / 100
  const initials = (user.name || user.username || 'U').slice(0, 2).toUpperCase()
  const avatarSrc = isGuest ? '' : resolveAvatarSrc(user.avatar, user.username)

  const measure = useCallback(() => {
    const element = targetKey ? itemRefs.current.get(targetKey) : null
    const container = linksRef.current
    if (!element || !container) {
      setIndicator((current) => ({ ...current, visible: false }))
      return
    }
    const box = element.getBoundingClientRect()
    const origin = container.getBoundingClientRect()
    setIndicator({ left: box.left - origin.left, width: box.width, visible: true })
  }, [targetKey])

  const measureFit = useCallback(() => {
    const row = rowRef.current
    const left = leftRef.current
    const right = rightRef.current
    if (!row || !left || !right) return
    const style = getComputedStyle(row)
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
    let available = row.clientWidth - padding
    if (row.dataset.island === 'true' && row.parentElement) {
      const parentStyle = getComputedStyle(row.parentElement)
      const outer = row.parentElement.clientWidth - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight)
      available = Math.min(outer, ISLAND_MAX) - padding - 2
    }
    const level = fitLevelRef.current
    const needed = left.scrollWidth + right.scrollWidth + 32
    neededRef.current[level] = needed
    setContentWidth((current) => (Math.abs(current - (needed + padding)) > 1 ? needed + padding : current))
    if (needed > available && level < 2) {
      fitLevelRef.current = level + 1
      setFitLevel(level + 1)
    } else if (level > 0 && neededRef.current[level - 1] && available >= neededRef.current[level - 1] + 12) {
      fitLevelRef.current = level - 1
      setFitLevel(level - 1)
    }
  }, [])

  useLayoutEffect(() => {
    measureFit()
  })

  useEffect(() => {
    const row = rowRef.current
    if (!row || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => measureFit())
    observer.observe(row)
    const resetFit = () => {
      fitLevelRef.current = 0
      neededRef.current = [0, 0, 0]
      setFitLevel(0)
    }
    document.fonts?.ready.then(resetFit)
    document.fonts?.addEventListener?.('loadingdone', resetFit)
    return () => {
      observer.disconnect()
      document.fonts?.removeEventListener?.('loadingdone', resetFit)
    }
  }, [measureFit, navStyle])

  useLayoutEffect(() => {
    measure()
  }, [measure, pathname, navStyle, isScrolled])

  useEffect(() => {
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    document.fonts?.addEventListener?.('loadingdone', measure)
    const container = linksRef.current
    const observer = typeof ResizeObserver !== 'undefined' && container ? new ResizeObserver(() => measure()) : null
    if (observer && container) {
      observer.observe(container)
      Array.from(container.children).forEach((child) => observer.observe(child))
    }
    return () => {
      window.removeEventListener('resize', measure)
      document.fonts?.removeEventListener?.('loadingdone', measure)
      observer?.disconnect()
    }
  }, [measure, navStyle])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMoreOpen(false)
    setIsProfileOpen(false)
    setIsSheetOpen(false)
  }, [pathname, location.search])

  useEffect(() => {
    if (!isSheetOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSheetOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isSheetOpen])

  const registerItem = (key: string) => (element: HTMLElement | null) => {
    if (element) itemRefs.current.set(key, element)
    else itemRefs.current.delete(key)
  }

  const handleLogout = () => {
    setIsProfileOpen(false)
    logout()
    navigate('/')
  }

  const renderProfilePanel = (placement: 'below' | 'side') => (
    <div
      data-open={isProfileOpen}
      className={`nav-pop absolute z-50 w-72 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_60px_-24px_rgba(10,20,40,.5)] ${
        placement === 'below' ? 'right-0 top-[calc(100%+10px)] origin-top-right' : 'bottom-0 left-[calc(100%+12px)] origin-bottom-left'
      }`}
    >
      <div className="note-paper flex items-center gap-3 border-x-0 border-t-0 p-4">
        <Avatar src={avatarSrc} initials={initials} progress={courseRatio} size={48} />
        <div className="min-w-0 flex-1">
          <div className="nav-font truncate text-[15px] font-bold text-[var(--text)]">{user.name}</div>
          <div className="truncate text-[13px] text-[var(--text-muted)]">@{user.username}</div>
          <div className="mt-2 flex items-center gap-2" title="Avance del curso">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]">
              <span className="nav-xp block h-full rounded-full bg-[var(--ink)]" style={{ width: `${course.percent}%` }}></span>
            </span>
            <span className="note-num shrink-0 text-[11.5px] font-semibold text-[var(--text-muted)]">
              {course.done}/{TOTAL_LESSONS} lecciones
            </span>
          </div>
        </div>
      </div>
      <div className="p-1.5">
        {PROFILE_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={closeProfile}
            className="nav-item-row flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-[var(--text)] hover:bg-[var(--paper)]"
          >
            <i className={`${item.icon} w-4 text-center text-[13px] text-[var(--ink)]`}></i>
            {item.label}
          </Link>
        ))}
        <div className="mx-2 my-1 border-t border-[var(--border)]"></div>
        <button
          type="button"
          onClick={handleLogout}
          className="nav-item-row flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-[var(--ink-3)] hover:bg-[color-mix(in_srgb,var(--ink-3)_10%,transparent)]"
        >
          <i className="fa-solid fa-right-from-bracket w-4 text-center text-[13px]"></i>
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  const renderAccount = () =>
    isGuest ? (
      <div className="flex items-center gap-1 sm:gap-2">
        <Link to="/login" className="nav-font hidden px-2 py-1.5 text-[14px] font-semibold text-[var(--text)] transition-colors hover:text-[var(--ink)] sm:inline">
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="nav-font inline-flex h-9 items-center gap-2 rounded-full bg-[var(--ink)] px-4 text-[13.5px] font-bold text-[var(--bg)] transition-transform active:scale-[.97]"
        >
          Registrarse
        </Link>
      </div>
    ) : (
      <div ref={profileRef} className="relative">
        <button
          type="button"
          onClick={() => setIsProfileOpen((open) => !open)}
          aria-haspopup="true"
          aria-expanded={isProfileOpen}
          aria-label="Abrir menú de perfil"
          className="flex cursor-pointer items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] xl:pr-3"
        >
          <Avatar src={avatarSrc} initials={initials} progress={courseRatio} />
          <span className={`nav-font hidden text-[14px] font-semibold text-[var(--text)] ${fitLevel >= 1 ? '' : 'xl:inline'}`}>{user.username}</span>
          <i className={`nav-chevron fa-solid fa-chevron-down hidden text-[9px] text-[var(--text-muted)] xl:inline ${isProfileOpen ? 'rotate-180' : ''}`}></i>
        </button>
        {renderProfilePanel('below')}
      </div>
    )

  const renderDesktopLinks = () => (
    <nav aria-label="Navegación principal" className="hidden md:block">
      <div ref={linksRef} className="relative flex items-center" onMouseLeave={() => setHoverKey(null)}>
        {isIsland && (
          <span
            className="nav-ink pointer-events-none absolute inset-y-1.5 rounded-full bg-[color-mix(in_srgb,var(--ink)_13%,transparent)]"
            style={{ left: indicator.left, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
            aria-hidden="true"
          ></span>
        )}
        {MAIN_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            ref={registerItem(item.to)}
            title={fitLevel >= 2 ? item.label : undefined}
            onMouseEnter={() => setHoverKey(item.to)}
            onFocus={() => setHoverKey(item.to)}
            onBlur={() => setHoverKey(null)}
            className={({ isActive }) =>
              `nav-link nav-font relative flex shrink-0 items-center gap-2 whitespace-nowrap px-2.5 text-[14px] font-semibold xl:px-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ink)] ${
                isIsland ? 'h-10 rounded-full' : 'h-14'
              } ${isActive ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`
            }
          >
            <i className={`${item.icon} text-[12px] opacity-80`}></i>
            <span className={fitLevel >= 2 ? 'sr-only' : fitLevel === 1 ? '' : 'xl:hidden'}>{item.shortLabel}</span>
            <span className={fitLevel >= 1 ? 'hidden' : 'hidden xl:inline'}>{item.label}</span>
            {item.locked && <i className="fa-solid fa-lock text-[9px] opacity-60" aria-label="Bloqueado"></i>}
          </NavLink>
        ))}

        <div ref={moreRef} className="relative" onMouseEnter={() => setHoverKey('more')}>
          <button
            type="button"
            ref={registerItem('more')}
            onClick={() => setIsMoreOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={isMoreOpen}
            className={`nav-link nav-font relative flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap px-2.5 text-[14px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ink)] xl:px-3.5 ${
              isIsland ? 'h-10 rounded-full' : 'h-14'
            } ${isMoreActive || isMoreOpen ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
          >
            Más
            <i className={`nav-chevron fa-solid fa-chevron-down text-[9px] ${isMoreOpen ? 'rotate-180' : ''}`}></i>
          </button>

          <div
            data-open={isMoreOpen}
            className={`nav-pop absolute left-1/2 ${MORE_ITEMS.length > 1 ? 'w-[440px]' : 'w-max min-w-[15rem]'} origin-top -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_24px_60px_-24px_rgba(10,20,40,.5)] ${
              isIsland ? 'top-[calc(100%+14px)]' : 'top-[calc(100%+6px)]'
            }`}
          >
            <div className={`grid gap-1 ${MORE_ITEMS.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {MORE_ITEMS.map((item) => {
                const isActive = matchesPath(pathname, item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMore}
                    className={`nav-item-row flex items-start gap-3 rounded-xl p-2.5 ${isActive ? 'bg-[var(--paper-2)]' : 'hover:bg-[var(--paper)]'}`}
                  >
                    <span className="nav-item-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--paper-2)] text-[13px] text-[var(--ink)]">
                      <i className={item.icon}></i>
                    </span>
                    <span className="min-w-0">
                      <span className="nav-font block text-[14px] font-bold text-[var(--text)]">{item.label}</span>
                      <span className="block text-[12.5px] leading-snug text-[var(--text-muted)]">{item.description}</span>
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {!isIsland && (
          <span
            className="nav-ink pointer-events-none absolute bottom-0 h-[3px] rounded-t-full bg-[var(--ink)]"
            style={{ left: indicator.left + 12, width: Math.max(0, indicator.width - 24), opacity: indicator.visible ? 1 : 0 }}
            aria-hidden="true"
          ></span>
        )}
      </div>
    </nav>
  )

  const renderBillHeader = () => (
    <header
      className={`note-home nav-shell sticky top-0 z-40 border-b border-[var(--rule)] bg-[var(--bg-alt)] transition-shadow duration-300 ${navStyle === 'sidebar' ? 'md:hidden' : ''} ${
        isScrolled ? 'shadow-[0_10px_30px_-18px_rgba(10,20,40,.45)]' : ''
      }`}
    >
      <div className="relative h-4 overflow-hidden border-b border-[var(--rule)] bg-[var(--paper-2)]" aria-hidden="true">
        <div className="nav-marquee note-wide flex w-max whitespace-nowrap pt-[4px] text-[7.5px] font-bold leading-none text-[var(--ink)] opacity-70">
          <span>{NAV_MICROTEXT}</span>
          <span>{NAV_MICROTEXT}</span>
        </div>
      </div>
      <div className="relative">
        <WaveField className="pointer-events-none absolute inset-y-0 right-0 h-full w-[46%] opacity-40 [mask-image:linear-gradient(to_right,transparent,#000_40%)]" />
        <div ref={rowRef} className="relative mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <div ref={leftRef} className="flex min-w-0 items-center gap-6 lg:gap-8">
            <LogoMark />
            {navStyle !== 'sidebar' && renderDesktopLinks()}
          </div>
          <div ref={rightRef} className="flex shrink-0 items-center gap-2 sm:gap-3">
            {renderAccount()}
          </div>
        </div>
      </div>
      {navStyle === 'ticker' && (
        <TickerStrip completed={course.completed} resumeIndex={course.resumeIndex} />
      )}
    </header>
  )

  const renderIslandHeader = () => (
    <header className="note-home nav-shell pointer-events-none sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div
        ref={rowRef}
        data-island="true"
        style={{ maxWidth: isScrolled ? Math.min(ISLAND_MAX, Math.max(ISLAND_SCROLLED_MIN, contentWidth + 48)) : ISLAND_MAX }}
        className={`nav-island pointer-events-auto mx-auto flex items-center justify-between gap-3 rounded-full border border-[var(--border)] pl-3 pr-2 backdrop-blur-xl ${
          isScrolled
            ? 'h-14 bg-[color-mix(in_srgb,var(--bg-alt)_92%,transparent)] shadow-[0_18px_40px_-22px_rgba(10,20,40,.55)]'
            : 'h-16 bg-[color-mix(in_srgb,var(--bg-alt)_84%,transparent)] shadow-[0_10px_30px_-24px_rgba(10,20,40,.4)]'
        }`}
      >
        <div ref={leftRef} className="flex min-w-0 items-center gap-4 lg:gap-6">
          <LogoMark />
          <span className="hidden h-6 w-px bg-[var(--border)] md:block" aria-hidden="true"></span>
          {renderDesktopLinks()}
        </div>
        <div ref={rightRef} className="flex shrink-0 items-center gap-2">
          {renderAccount()}
        </div>
      </div>
    </header>
  )

  const railLinkClass = (isActive: boolean) =>
    `nav-link relative flex h-11 items-center gap-3 rounded-xl px-[14px] text-[14px] font-semibold ${
      isActive ? 'bg-[color-mix(in_srgb,var(--ink)_13%,transparent)] text-[var(--ink)]' : 'text-[var(--text-muted)] hover:bg-[var(--paper)] hover:text-[var(--text)]'
    }`

  const renderRail = () => (
    <aside className="note-home nav-shell nav-rail fixed inset-y-0 left-0 z-40 hidden w-[76px] flex-col border-r border-[var(--rule)] bg-[var(--bg-alt)] md:flex" aria-label="Navegación principal">
      <div className="relative h-4 overflow-hidden border-b border-[var(--rule)] bg-[var(--paper-2)]" aria-hidden="true">
        <div className="nav-marquee note-wide flex w-max whitespace-nowrap pt-[4px] text-[7.5px] font-bold leading-none text-[var(--ink)] opacity-70">
          <span>{NAV_MICROTEXT}</span>
          <span>{NAV_MICROTEXT}</span>
        </div>
      </div>
      <div className="flex h-16 items-center px-[19px]">
        <LogoMark compact />
      </div>
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-2.5 pb-3">
        {MAIN_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => railLinkClass(isActive)} title={item.label}>
            <i className={`${item.icon} w-5 shrink-0 text-center text-[16px]`}></i>
            <span className="nav-rail-label nav-font flex items-center gap-2 whitespace-nowrap">
              {item.label}
              {item.locked && <i className="fa-solid fa-lock text-[10px] opacity-60"></i>}
            </span>
          </NavLink>
        ))}
        <div className="nav-rail-label note-wide mx-[14px] mb-1 mt-4 whitespace-nowrap text-[9px] font-bold text-[var(--ink)] opacity-80">MÁS SECCIONES</div>
        <div className="mx-auto my-2 h-px w-8 bg-[var(--border)]" aria-hidden="true"></div>
        {MORE_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => railLinkClass(isActive)} title={item.label}>
            <i className={`${item.icon} w-5 shrink-0 text-center text-[15px]`}></i>
            <span className="nav-rail-label nav-font whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-[var(--rule)] p-2.5">
        <div ref={railProfileRef} className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
            aria-label="Abrir menú de perfil"
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-[7px] text-left transition-colors hover:bg-[var(--paper)]"
          >
            <Avatar src={avatarSrc} initials={initials} progress={courseRatio} size={38} />
            <span className="nav-rail-label min-w-0 flex-1">
              <span className="nav-font block truncate text-[14px] font-bold text-[var(--text)]">{user.username}</span>
              <span className="block text-[12px] text-[var(--text-muted)]">
                {course.done}/{TOTAL_LESSONS} lecciones
              </span>
            </span>
          </button>
          {renderProfilePanel('side')}
        </div>
      </div>
    </aside>
  )

  return (
    <>
      <style>{NOTE_STYLES}</style>
      <style>{NAV_STYLES}</style>

      {navStyle === 'island' ? renderIslandHeader() : renderBillHeader()}
      {navStyle === 'sidebar' && renderRail()}

      <div className="note-home nav-shell md:hidden">
        <div
          data-open={isSheetOpen}
          className="nav-scrim fixed inset-0 z-[55] bg-[rgba(5,10,20,0.45)]"
          onClick={() => setIsSheetOpen(false)}
          aria-hidden="true"
        ></div>
        <section
          data-open={isSheetOpen}
          role="dialog"
          aria-modal="true"
          aria-label="Más secciones"
          className="nav-sheet fixed inset-x-0 bottom-0 z-[56] rounded-t-3xl border-t border-[var(--border)] bg-[var(--bg-alt)] px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3"
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--border)]"></div>
          <div className="note-wide mb-3 px-1 text-[10px] font-bold text-[var(--ink)]">MÁS SECCIONES</div>
          <div className="grid grid-cols-2 gap-2">
            {MORE_ITEMS.map((item) => {
              const isActive = matchesPath(pathname, item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsSheetOpen(false)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center ${isActive ? 'border-[var(--ink)] bg-[var(--paper-2)]' : 'border-[var(--border)] bg-[var(--surface)]'}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--paper-2)] text-[15px] text-[var(--ink)]">
                    <i className={item.icon}></i>
                  </span>
                  <span className="nav-font text-[12.5px] font-bold leading-tight text-[var(--text)]">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </section>

        <nav
          aria-label="Navegación principal"
          className="fixed inset-x-0 bottom-0 z-[57] border-t border-[var(--rule)] bg-[color-mix(in_srgb,var(--bg-alt)_94%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
        >
          <div className="relative grid h-16" style={{ gridTemplateColumns: `repeat(${MAIN_ITEMS.length + 1}, minmax(0, 1fr))` }}>
            <span
              className="nav-tab-ind pointer-events-none absolute top-2 h-8 w-14 -translate-x-1/2 rounded-full bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]"
              style={{ left: `${((tabIndex + 0.5) * 100) / (MAIN_ITEMS.length + 1)}%`, opacity: tabIndex >= 0 ? 1 : 0 }}
              aria-hidden="true"
            ></span>
            {MAIN_ITEMS.map((item, index) => {
              const isActive = index === tabIndex
              return (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className="nav-tab relative flex flex-col items-center justify-center gap-1">
                  <span className="relative">
                    <i className={`nav-tab-icon ${item.icon} flex h-8 items-center text-[17px] ${isActive ? 'text-[var(--ink)]' : 'text-[var(--text-muted)]'}`}></i>
                    {item.locked && (
                      <span className="absolute -right-2.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--bg-alt)] text-[8px] text-[var(--text-muted)]">
                        <i className="fa-solid fa-lock"></i>
                      </span>
                    )}
                  </span>
                  <span className={`nav-font text-[10.5px] font-bold leading-none ${isActive ? 'text-[var(--ink)]' : 'text-[var(--text-muted)]'}`}>{item.shortLabel}</span>
                </NavLink>
              )
            })}
            <button
              type="button"
              onClick={() => setIsSheetOpen((open) => !open)}
              aria-expanded={isSheetOpen}
              className="nav-tab relative flex cursor-pointer flex-col items-center justify-center gap-1"
            >
              <i className={`nav-tab-icon fa-solid ${isSheetOpen ? 'fa-xmark' : 'fa-grip'} flex h-8 items-center text-[17px] ${tabIndex === MAIN_ITEMS.length ? 'text-[var(--ink)]' : 'text-[var(--text-muted)]'}`}></i>
              <span className={`nav-font text-[10.5px] font-bold leading-none ${tabIndex === MAIN_ITEMS.length ? 'text-[var(--ink)]' : 'text-[var(--text-muted)]'}`}>Más</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}
