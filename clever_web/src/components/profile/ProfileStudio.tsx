import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlatform } from '../../context/PlatformContext'
import { AVATAR_PRESETS } from '../../data/avatarPresets'
import {
  AVATAR_SHAPES,
  BANNER_PRESETS,
  BANNER_STYLES,
  FRAME_COLORS,
  FRAME_STYLES,
  HOME_GREETINGS,
  HOME_LESSON_BACKGROUNDS,
  HOME_MAIN_SECTIONS,
  HOME_SIDE_SECTIONS,
  LEARN_WORLDS,
  MAX_GREETING_LENGTH,
  MAX_STATUS_LENGTH,
  NAV_STYLES,
  PROFILE_LAYOUTS,
  STATUS_ICONS,
  unlockKey,
} from '../../data/profileCustomizationOptions'
import { ACCENT_COLORS, THEME_GROUPS, THEME_OPTIONS } from '../../data/themeOptions'
import type { ThemeOption } from '../../data/themeOptions'
import { getUnlockState, loadProfileCustomization, resetProfileCustomization, useProfileCustomization } from '../../services/profileCustomizationService'
import type { UnlockState } from '../../services/profileCustomizationService'
import type { HomeMainSection, HomeSideSection, LearnWorld, NavStyle, ProfileLayout, UnlockRule } from '../../types/profileCustomization'

export type StudioTabId = 'diseno' | 'inicio' | 'datos' | 'tema' | 'barra' | 'mundo'

export const STUDIO_TAB_IDS: StudioTabId[] = ['diseno', 'inicio', 'datos', 'tema', 'barra', 'mundo']

const TABS: { id: StudioTabId; label: string; icon: string }[] = [
  { id: 'diseno', label: 'Perfil', icon: 'fa-solid fa-swatchbook' },
  { id: 'inicio', label: 'Inicio', icon: 'fa-solid fa-house' },
  { id: 'datos', label: 'Datos', icon: 'fa-solid fa-user-pen' },
  { id: 'tema', label: 'Tema', icon: 'fa-solid fa-palette' },
  { id: 'barra', label: 'Barra', icon: 'fa-solid fa-bars' },
  { id: 'mundo', label: 'Mundo', icon: 'fa-solid fa-earth-americas' },
]

const STUDIO_STYLES = `
.st-panel{transition:transform .38s cubic-bezier(.23,1,.32,1),visibility .38s}
.st-panel[data-open="false"]{transform:translateX(104%);visibility:hidden}
@media (max-width:1023px){.st-panel[data-open="false"]{transform:translateY(104%)}}
.st-scrim{transition:opacity .25s,visibility .25s}
.st-scrim[data-open="false"]{opacity:0;visibility:hidden;pointer-events:none}
.st-tile{transition:border-color .2s,transform .25s cubic-bezier(.23,1,.32,1),box-shadow .2s}
.st-tile:not(:disabled):hover{transform:translateY(-2px)}
.st-tile:not(:disabled):active{transform:scale(.98)}
.st-tab-ind{transition:left .35s cubic-bezier(.23,1,.32,1)}
.st-section{animation:st-in .35s cubic-bezier(.23,1,.32,1) both}
@keyframes st-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.st-panel,.st-scrim,.st-tile,.st-tab-ind{transition:none!important}.st-section{animation:none}}
`

const BIO_MAX = 160
const GOAL_MAX = 120
const NAME_MAX = 40

const resizeImage = (file: File, maxWidth: number, quality = 0.82): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Imagen no válida'))
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas no disponible'))
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })

const SectionTitle: React.FC<{ icon: string; title: string; hint?: string }> = ({ icon, title, hint }) => (
  <div className="mb-3">
    <h3 className="flex items-center gap-2 text-[15px] font-bold text-[var(--text)]">
      <i className={`${icon} text-[13px] text-[var(--ink)]`}></i>
      {title}
    </h3>
    {hint && <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">{hint}</p>}
  </div>
)

const LockBadge: React.FC<{ state: UnlockState }> = ({ state }) => {
  if (state.unlocked) return null
  return state.reason === 'price' ? (
    <span className="note-num inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,#d99a1e_16%,var(--surface))] px-2 py-0.5 text-[11.5px] font-bold text-[#a8720f]">
      <i className="fa-solid fa-coins text-[10px]"></i>
      {state.price}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-alt)] px-2 py-0.5 text-[11.5px] font-bold text-[var(--text-muted)]">
      <i className="fa-solid fa-lock text-[9px]"></i>
      Nivel {state.level}
    </span>
  )
}

interface OptionTileProps {
  selected: boolean
  state: UnlockState
  pending: boolean
  coins: number
  title: string
  description?: string
  preview?: React.ReactNode
  onSelect: () => void
  onBuy: () => void
  onCancel: () => void
  compact?: boolean
}

const OptionTile: React.FC<OptionTileProps> = ({ selected, state, pending, coins, title, description, preview, onSelect, onBuy, onCancel, compact = false }) => {
  const isLevelLocked = !state.unlocked && state.reason === 'level'
  return (
    <div className="relative">
      <button
        type="button"
        disabled={isLevelLocked}
        onClick={onSelect}
        aria-pressed={selected}
        title={isLevelLocked && !state.unlocked && state.reason === 'level' ? `Se desbloquea en el nivel ${state.level}` : undefined}
        className={`st-tile group w-full overflow-hidden rounded-2xl border-2 bg-[var(--surface)] text-left disabled:cursor-not-allowed ${
          selected ? 'border-[var(--ink)] shadow-[0_10px_24px_-16px_var(--ink)]' : 'border-[var(--border)] hover:border-[color-mix(in_srgb,var(--ink)_45%,var(--border))]'
        }`}
      >
        {preview && <div className={`relative overflow-hidden border-b border-[var(--border)] ${compact ? 'h-20' : 'h-28'} ${isLevelLocked ? 'opacity-55 grayscale' : ''}`}>{preview}</div>}
        <div className="flex items-start justify-between gap-2 p-3">
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-[var(--text)]">{title}</div>
            {description && <div className="mt-0.5 text-[12.5px] leading-snug text-[var(--text-muted)]">{description}</div>}
          </div>
          {selected ? (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[11px] text-[var(--bg)]">
              <i className="fa-solid fa-check"></i>
            </span>
          ) : (
            <LockBadge state={state} />
          )}
        </div>
      </button>
      {pending && !state.unlocked && state.reason === 'price' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-3 text-center backdrop-blur-sm">
          <div className="text-[13px] font-semibold text-[var(--text)]">{title}</div>
          {coins >= state.price ? (
            <button type="button" onClick={onBuy} className="note-btn note-btn-ink h-10 px-4 text-[14px]">
              <i className="fa-solid fa-coins text-[12px]"></i>
              Comprar por {state.price} Kor
            </button>
          ) : (
            <div className="text-[13px] text-[var(--text-muted)]">
              Te faltan <span className="note-num font-bold text-[var(--ink-3)]">{state.price - coins}</span> Kor
            </div>
          )}
          <button type="button" onClick={onCancel} className="text-[13px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}

const ThemePreviewArt: React.FC<{ theme: ThemeOption }> = ({ theme }) => {
  const p = theme.preview
  return (
    <div className="absolute inset-0" style={{ background: p.background }}>
      <div className="absolute inset-0" style={{ background: p.pattern }}></div>
      <div className="absolute inset-x-0 top-0 flex h-5 items-center gap-1.5 px-2" style={{ background: p.surface, borderBottom: `1px solid ${p.border}` }}>
        <span className="h-2 w-2 rounded-full" style={{ background: p.accent }}></span>
        <span className="h-1 w-8 rounded-full" style={{ background: p.muted, opacity: 0.5 }}></span>
        <span className="h-1 w-6 rounded-full" style={{ background: p.accent }}></span>
      </div>
      <div className="absolute bottom-3 left-3 right-3 rounded-lg px-2.5 py-2" style={{ background: p.surface, border: `1px solid ${p.border}` }}>
        <div className="text-[18px] font-black leading-none" style={{ color: p.text, fontFamily: p.font }}>
          Aa 1,250
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="h-1.5 flex-1 rounded-full" style={{ background: p.accent }}></span>
          <span className="h-1.5 w-6 rounded-full" style={{ background: p.muted, opacity: 0.4 }}></span>
        </div>
      </div>
    </div>
  )
}

const NavPreviewArt: React.FC<{ style: NavStyle }> = ({ style }) => {
  const bar = 'bg-[var(--surface)] border border-[var(--border)]'
  const dot = <span className="h-2.5 w-2.5 rounded-full bg-[var(--ink)]"></span>
  const links = (
    <span className="flex gap-1.5">
      <span className="h-1.5 w-7 rounded-full bg-[var(--ink)]"></span>
      <span className="h-1.5 w-6 rounded-full bg-[var(--text-dim)]"></span>
      <span className="h-1.5 w-8 rounded-full bg-[var(--text-dim)]"></span>
    </span>
  )
  return (
    <div className="absolute inset-0 bg-[var(--bg)] p-2.5">
      {style === 'bill' && (
        <div className={`${bar} overflow-hidden rounded-md`}>
          <div className="h-1.5 bg-[var(--paper-2)]"></div>
          <div className="flex h-6 items-center gap-2 px-2">
            {dot}
            {links}
          </div>
          <div className="mx-[38px] -mt-0.5 h-0.5 w-7 rounded bg-[var(--ink)]"></div>
        </div>
      )}
      {style === 'island' && (
        <div className={`${bar} mx-3 mt-1.5 flex h-7 items-center gap-2 rounded-full px-2.5 shadow-md`}>
          {dot}
          <span className="h-4 w-9 rounded-full bg-[color-mix(in_srgb,var(--ink)_16%,transparent)]"></span>
          <span className="h-1.5 w-6 rounded-full bg-[var(--text-dim)]"></span>
        </div>
      )}
      {style === 'ticker' && (
        <div className={`${bar} overflow-hidden rounded-md`}>
          <div className="flex h-6 items-center gap-2 px-2">
            {dot}
            {links}
          </div>
          <div className="flex h-3.5 items-center gap-2 border-t border-[var(--border)] bg-[var(--paper)] px-1.5">
            <span className="h-2 w-6 rounded-sm bg-[var(--ink)]"></span>
            <span className="h-1 w-5 rounded-full bg-[var(--success)]"></span>
            <span className="h-1 w-5 rounded-full bg-[var(--danger)]"></span>
            <span className="h-1 w-5 rounded-full bg-[var(--success)]"></span>
          </div>
        </div>
      )}
      {style === 'sidebar' && (
        <div className="flex h-full gap-2">
          <div className={`${bar} flex w-7 flex-col items-center gap-1.5 rounded-md py-2`}>
            {dot}
            <span className="h-1.5 w-3 rounded-full bg-[var(--ink)]"></span>
            <span className="h-1.5 w-3 rounded-full bg-[var(--text-dim)]"></span>
            <span className="h-1.5 w-3 rounded-full bg-[var(--text-dim)]"></span>
          </div>
          <div className="flex-1 rounded-md border border-dashed border-[var(--border)]"></div>
        </div>
      )}
      {style !== 'sidebar' && <div className="mt-2 h-[calc(100%-44px)] rounded-md border border-dashed border-[var(--border)]"></div>}
    </div>
  )
}

const WorldPreviewArt: React.FC<{ world: LearnWorld }> = ({ world }) => {
  const palette = {
    city: { ground: '#c3e5b5', road: '#4b5563', lane: '#f6f1e4', a: '#fbf7ef', b: '#a9cbea' },
    candles: { ground: '#f1d9a8', road: '#b98a52', lane: '#fff3d6', a: '#2f9e66', b: '#d4574c' },
    island: { ground: '#2aa7c9', road: '#a0703f', lane: '#e6c79a', a: '#f2d48f', b: '#3f8b52' },
  }[world]
  return (
    <svg viewBox="0 0 200 110" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="200" height="110" fill={palette.ground} />
      {world === 'island' && <ellipse cx="100" cy="58" rx="86" ry="44" fill={palette.a} />}
      <path d="M100 -5 C150 25 50 45 100 70 S150 100 100 120" fill="none" stroke={palette.road} strokeWidth="16" strokeLinecap="round" />
      <path d="M100 -5 C150 25 50 45 100 70 S150 100 100 120" fill="none" stroke={palette.lane} strokeWidth="1.5" strokeDasharray="5 5" />
      {world === 'city' && (
        <>
          <rect x="18" y="18" width="26" height="34" rx="2" fill={palette.a} stroke="#e6dece" />
          <rect x="150" y="56" width="30" height="40" rx="2" fill={palette.a} stroke="#e6dece" />
          <rect x="22" y="24" width="7" height="5" fill={palette.b} />
          <rect x="33" y="24" width="7" height="5" fill="#ffd66b" />
          <circle cx="160" cy="24" r="10" fill="#55a564" />
        </>
      )}
      {world === 'candles' && (
        <>
          <rect x="22" y="20" width="14" height="40" rx="2" fill={palette.a} />
          <rect x="28" y="12" width="2" height="56" fill={palette.a} />
          <rect x="160" y="50" width="14" height="30" rx="2" fill={palette.b} />
          <rect x="166" y="42" width="2" height="46" fill={palette.b} />
          <ellipse cx="150" cy="22" rx="9" ry="11" fill="#e4572e" />
          <rect x="147" y="33" width="6" height="5" fill="#7a5230" />
        </>
      )}
      {world === 'island' && (
        <>
          <path d="M40 60 q-2 -20 4 -30" stroke="#7a5230" strokeWidth="3" fill="none" />
          <path d="M44 30 q-14 -2 -20 6 M44 30 q12 -6 20 2" stroke={palette.b} strokeWidth="4" fill="none" strokeLinecap="round" />
          <rect x="146" y="70" width="22" height="14" rx="2" fill="#8a5a3b" />
          <rect x="146" y="70" width="22" height="5" fill="#E3A92F" />
        </>
      )}
      <circle cx="100" cy="70" r="7" fill="var(--ink)" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}

const LayoutPreviewArt: React.FC<{ layout: ProfileLayout }> = ({ layout }) => (
  <div className="absolute inset-0 bg-[var(--paper)] p-2.5">
    {layout === 'credential' && (
      <div className="h-full overflow-hidden rounded-md border border-[var(--rule)] bg-[var(--surface)]">
        <div className="h-8 bg-[var(--paper-2)]" style={{ background: 'repeating-radial-gradient(circle at 90% 0%, transparent 0 5px, color-mix(in srgb, var(--ink) 25%, transparent) 5px 6px)' }}></div>
        <div className="-mt-3 flex items-end gap-1.5 px-2">
          <span className="h-7 w-7 rounded-full border-2 border-[var(--surface)] bg-[var(--ink)]"></span>
          <span className="mb-0.5 h-2 w-14 rounded-full bg-[var(--text)]"></span>
        </div>
        <div className="mx-2 mt-2 h-1.5 rounded-full bg-[var(--ink)] opacity-70"></div>
      </div>
    )}
    {layout === 'office' && (
      <svg viewBox="0 0 120 70" className="h-full w-full" aria-hidden="true">
        <rect width="120" height="70" rx="4" fill="var(--surface)" />
        <rect x="6" y="6" width="44" height="26" rx="2" fill="#bfe3ff" />
        <rect x="10" y="18" width="6" height="14" fill="#5b7aa0" />
        <rect x="19" y="12" width="7" height="20" fill="#5b7aa0" />
        <rect x="29" y="20" width="6" height="12" fill="#5b7aa0" />
        <rect x="54" y="34" width="24" height="16" rx="2" fill="#141a22" />
        <rect x="80" y="36" width="20" height="14" rx="2" fill="#141a22" />
        <path d="M57 46 l5 -4 l5 2 l6 -6" stroke="var(--primary)" strokeWidth="1.5" fill="none" />
        <rect x="40" y="52" width="74" height="4" rx="1" fill="#8a5a3b" />
        <rect x="92" y="6" width="20" height="22" rx="2" fill="#7a5230" />
        <circle cx="102" cy="16" r="6" fill="var(--ink)" />
      </svg>
    )}
    {layout === 'card' && (
      <div className="flex h-full items-center justify-center gap-3">
        <div className="h-full w-[52px] rounded-lg p-[3px]" style={{ background: 'linear-gradient(140deg,#38bdf8,#6366f1)', transform: 'rotate(-6deg)' }}>
          <div className="flex h-full flex-col gap-1 rounded-md bg-[#0e1420] p-1">
            <span className="h-6 rounded-sm" style={{ background: 'linear-gradient(120deg,#38bdf8,#a855f7)' }}></span>
            <span className="h-1 w-8 rounded-full bg-white/60"></span>
            <span className="h-1 w-6 rounded-full bg-white/40"></span>
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="block h-2.5 w-16 rounded-full bg-[var(--text)]"></span>
          <span className="block h-1.5 w-12 rounded-full bg-[var(--text-dim)]"></span>
        </div>
      </div>
    )}
  </div>
)

const moveItem = <T,>(list: T[], index: number, delta: number): T[] => {
  const next = [...list]
  const target = index + delta
  if (target < 0 || target >= next.length) return next
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

const SectionRow: React.FC<{
  icon: string
  label: string
  hidden: boolean
  locked?: boolean
  canUp: boolean
  canDown: boolean
  onUp: () => void
  onDown: () => void
  onToggle: () => void
}> = ({ icon, label, hidden, locked = false, canUp, canDown, onUp, onDown, onToggle }) => (
  <div className={`flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 ${hidden ? 'opacity-55' : ''}`}>
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--paper-2)] text-[13px] text-[var(--ink)]">
      <i className={icon}></i>
    </span>
    <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[var(--text)]">{label}</span>
    <button type="button" disabled={!canUp} onClick={onUp} aria-label={`Subir ${label}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--paper)] disabled:opacity-30">
      <i className="fa-solid fa-arrow-up text-[12px]"></i>
    </button>
    <button type="button" disabled={!canDown} onClick={onDown} aria-label={`Bajar ${label}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--paper)] disabled:opacity-30">
      <i className="fa-solid fa-arrow-down text-[12px]"></i>
    </button>
    <button
      type="button"
      disabled={locked}
      onClick={onToggle}
      aria-label={hidden ? `Mostrar ${label}` : `Ocultar ${label}`}
      title={locked ? 'Siempre visible' : hidden ? 'Mostrar' : 'Ocultar'}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--paper)] disabled:opacity-30"
    >
      <i className={`fa-solid ${locked ? 'fa-lock' : hidden ? 'fa-eye-slash' : 'fa-eye'} text-[12px]`}></i>
    </button>
  </div>
)

const Toggle: React.FC<{ checked: boolean; onChange: (value: boolean) => void; label: string; hint?: string }> = ({ checked, onChange, label, hint }) => (
  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3">
    <span>
      <span className="block text-[14px] font-semibold text-[var(--text)]">{label}</span>
      {hint && <span className="block text-[12.5px] text-[var(--text-muted)]">{hint}</span>}
    </span>
    <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-[var(--ink)]' : 'bg-[var(--border)]'}`}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0" />
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></span>
    </span>
  </label>
)

interface ProfileStudioProps {
  open: boolean
  tab: StudioTabId
  onTabChange: (tab: StudioTabId) => void
  onClose: () => void
}

export const ProfileStudio: React.FC<ProfileStudioProps> = ({ open, tab, onTabChange, onClose }) => {
  const { user, updateUserProfile, addCoins, showToast } = usePlatform()
  const [custom, update] = useProfileCustomization(user.username)
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [name, setName] = useState(user.name || '')
  const [bio, setBio] = useState(user.bio || '')
  const [goal, setGoal] = useState(user.goal || '')
  const [status, setStatus] = useState(custom.status)
  const [statusIcon, setStatusIcon] = useState(custom.statusIcon)
  const [isProcessing, setIsProcessing] = useState<'avatar' | 'cover' | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    setName(user.name || '')
    setBio(user.bio || '')
    setGoal(user.goal || '')
    setStatus(custom.status)
    setStatusIcon(custom.statusIcon)
    setPendingKey(null)
    panelRef.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    setPendingKey(null)
  }, [tab])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const stateOf = (group: string, id: string, rule?: UnlockRule) => getUnlockState(unlockKey(group, id), rule, custom.owned, user.level, custom.adminMode)

  const choose = (group: string, id: string, rule: UnlockRule | undefined, apply: () => void) => {
    const state = stateOf(group, id, rule)
    if (state.unlocked) {
      setPendingKey(null)
      apply()
      return
    }
    if (state.reason === 'price') setPendingKey(unlockKey(group, id))
  }

  const buy = (group: string, id: string, rule: UnlockRule | undefined, apply: () => void) => {
    const state = stateOf(group, id, rule)
    if (state.unlocked || state.reason !== 'price') return
    if (user.coins < state.price) {
      showToast('No tienes suficientes monedas Kor', 'error')
      return
    }
    addCoins(-state.price)
    update({ owned: [...custom.owned, unlockKey(group, id)] })
    setPendingKey(null)
    apply()
    showToast('Desbloqueado. Ya es tuyo.', 'success')
  }

  const tileProps = (group: string, id: string, rule: UnlockRule | undefined, selected: boolean, apply: () => void) => ({
    selected,
    state: stateOf(group, id, rule),
    pending: pendingKey === unlockKey(group, id),
    coins: user.coins,
    onSelect: () => choose(group, id, rule, apply),
    onBuy: () => buy(group, id, rule, apply),
    onCancel: () => setPendingKey(null),
  })

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>, kind: 'avatar' | 'cover') => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setIsProcessing(kind)
    try {
      const dataUrl = await resizeImage(file, kind === 'avatar' ? 512 : 1400)
      if (kind === 'avatar') {
        updateUserProfile({ avatar: dataUrl })
        showToast('Foto actualizada', 'success')
      } else {
        updateUserProfile({ cover: dataUrl })
        update({ bannerStyle: 'cover' })
        showToast('Portada actualizada', 'success')
      }
    } catch {
      showToast('No se pudo procesar la imagen', 'error')
    } finally {
      setIsProcessing(null)
    }
  }

  const saveData = () => {
    const cleanName = name.trim()
    if (!cleanName) {
      showToast('El nombre no puede estar vacío', 'error')
      return
    }
    updateUserProfile({ name: cleanName, bio: bio.trim(), goal: goal.trim() })
    update({ status: status.trim(), statusIcon })
    showToast('Datos guardados', 'success')
  }

  const dataDirty = name.trim() !== (user.name || '') || bio.trim() !== (user.bio || '') || goal.trim() !== (user.goal || '') || status.trim() !== custom.status || statusIcon !== custom.statusIcon

  const downloadData = () => {
    const safeUser = Object.fromEntries(Object.entries(user).filter(([key]) => !key.startsWith('_')))
    const payload = { exportedAt: new Date().toISOString(), profile: safeUser, customization: loadProfileCustomization(user.username) }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `clever-datos-${user.username || 'perfil'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('Datos descargados', 'success')
  }

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    resetProfileCustomization(user.username)
    setConfirmReset(false)
    showToast('Estilo restablecido', 'success')
  }

  const inputClass = 'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[14px] text-[var(--text)] outline-none transition-colors focus:border-[var(--ink)]'
  const tabIndex = TABS.findIndex((item) => item.id === tab)
  const activeAccent = (user.accentColor || '').toLowerCase()

  return (
    <>
      <style>{STUDIO_STYLES}</style>
      <div data-open={open} className="st-scrim fixed inset-0 z-[60] bg-[rgba(5,10,20,0.35)] lg:hidden" onClick={onClose} aria-hidden="true"></div>
      <section
        ref={panelRef}
        tabIndex={-1}
        data-open={open}
        role="dialog"
        aria-modal="false"
        aria-label="Estudio de personalización"
        className="note-home st-panel fixed inset-x-0 bottom-0 z-[61] flex h-[88vh] flex-col overflow-hidden rounded-t-[28px] border border-[var(--border)] bg-[var(--bg-alt)] shadow-[0_-20px_60px_-30px_rgba(10,20,40,.6)] outline-none lg:inset-y-3 lg:left-auto lg:right-3 lg:h-auto lg:w-[440px] lg:rounded-[28px]"
      >
        <header className="border-b border-[var(--border)] px-5 pb-3 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="min-w-[150px] flex-1 basis-0">
              <div className="note-wide text-[10px] font-bold text-[var(--ink)]">ESTUDIO</div>
              <h2 className="note-display text-[24px] font-black leading-tight text-[var(--text)]">Personaliza tu Clever</h2>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} aria-label="Cerrar estudio" className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-6 rounded-2xl bg-[var(--surface-alt)] p-1" role="tablist">
            <span className="st-tab-ind absolute bottom-1 top-1 rounded-xl bg-[var(--surface)] shadow-sm" style={{ left: `calc(${(tabIndex * 100) / 6}% + 3px)`, width: 'calc(16.666% - 6px)' }} aria-hidden="true"></span>
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative z-10 flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-bold transition-colors ${tab === item.id ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
              >
                <i className={`${item.icon} text-[14px]`}></i>
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <div key={tab} className="st-section min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-5">
          {tab === 'diseno' && (
            <>
              <div>
                <SectionTitle icon="fa-solid fa-table-cells-large" title="Diseño del perfil" hint="Cambia por completo cómo se ve tu perfil." />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {PROFILE_LAYOUTS.map((option) => (
                    <OptionTile
                      key={option.id}
                      title={option.label}
                      description={option.description}
                      compact
                      preview={<LayoutPreviewArt layout={option.id} />}
                      {...tileProps('layout', option.id, option.unlock, custom.profileLayout === option.id, () => update({ profileLayout: option.id }))}
                    />
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle icon="fa-solid fa-panorama" title="Portada" />
                <div className="grid grid-cols-4 gap-2">
                  {BANNER_STYLES.map((option) => {
                    const state = stateOf('banner', option.id, option.unlock)
                    const pending = pendingKey === unlockKey('banner', option.id)
                    const selected = custom.bannerStyle === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={!state.unlocked && state.reason === 'level'}
                        onClick={() => (pending ? buy('banner', option.id, option.unlock, () => update({ bannerStyle: option.id })) : choose('banner', option.id, option.unlock, () => update({ bannerStyle: option.id })))}
                        className={`st-tile relative flex flex-col items-center gap-1.5 rounded-xl border-2 px-1 py-2.5 text-[12px] font-semibold ${
                          selected ? 'border-[var(--ink)] text-[var(--ink)]' : pending ? 'border-[#d99a1e] text-[#a8720f]' : 'border-[var(--border)] text-[var(--text-muted)]'
                        }`}
                      >
                        <i className={`${option.icon} text-[16px]`}></i>
                        {pending && !state.unlocked && state.reason === 'price' ? `Pagar ${state.price}` : option.label}
                        {!state.unlocked && !pending && (
                          <span className="absolute -right-1.5 -top-1.5">
                            <LockBadge state={state} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {custom.bannerStyle === 'cover' && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label className="note-btn note-btn-line h-10 cursor-pointer px-4 text-[14px]">
                      {isProcessing === 'cover' ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-upload text-[12px]"></i>}
                      Subir imagen
                      <input type="file" accept="image/*" className="hidden" disabled={isProcessing !== null} onChange={(event) => handleFile(event, 'cover')} />
                    </label>
                    {user.cover && (
                      <button type="button" onClick={() => updateUserProfile({ cover: null })} className="h-10 px-3 text-[14px] font-semibold text-[var(--ink-3)]">
                        Quitar imagen
                      </button>
                    )}
                  </div>
                )}
                {custom.bannerStyle !== 'cover' && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {BANNER_PRESETS.map((preset) => {
                      const selected = custom.bannerColorA === preset.a && custom.bannerColorB === preset.b
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          title={preset.label}
                          aria-label={`Colores ${preset.label}`}
                          onClick={() => update({ bannerColorA: preset.a, bannerColorB: preset.b })}
                          className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${selected ? 'border-[var(--text)]' : 'border-transparent'}`}
                          style={{ background: preset.a ? `linear-gradient(135deg, ${preset.a}, ${preset.b})` : 'linear-gradient(135deg, var(--grad-a), var(--grad-b))' }}
                        ></button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div>
                <SectionTitle icon="fa-solid fa-user-circle" title="Avatar" />
                <div className="mb-3 grid grid-cols-3 gap-2">
                  {AVATAR_SHAPES.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => update({ avatarShape: option.id })}
                      className={`st-tile flex flex-col items-center justify-center gap-1 rounded-xl border-2 px-1 py-2.5 text-[13px] font-semibold min-[380px]:flex-row min-[380px]:gap-2 ${
                        custom.avatarShape === option.id ? 'border-[var(--ink)] text-[var(--ink)]' : 'border-[var(--border)] text-[var(--text-muted)]'
                      }`}
                    >
                      <i className={option.icon}></i>
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {FRAME_STYLES.map((option) => {
                    const state = stateOf('frame', option.id, option.unlock)
                    const pending = pendingKey === unlockKey('frame', option.id)
                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={!state.unlocked && state.reason === 'level'}
                        title={option.label}
                        onClick={() => (pending ? buy('frame', option.id, option.unlock, () => update({ frameStyle: option.id })) : choose('frame', option.id, option.unlock, () => update({ frameStyle: option.id })))}
                        className={`st-tile relative flex flex-col items-center gap-1 rounded-xl border-2 py-2.5 text-[11px] font-semibold disabled:opacity-50 ${
                          custom.frameStyle === option.id ? 'border-[var(--ink)] text-[var(--ink)]' : pending ? 'border-[#d99a1e] text-[#a8720f]' : 'border-[var(--border)] text-[var(--text-muted)]'
                        }`}
                      >
                        <i className={`${option.icon} text-[15px]`}></i>
                        {pending && !state.unlocked && state.reason === 'price' ? `Pagar ${state.price}` : option.label}
                        {!state.unlocked && !pending && (
                          <span className="absolute -right-1.5 -top-1.5">
                            <LockBadge state={state} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {FRAME_COLORS.map((color) => (
                    <button
                      key={color || 'theme'}
                      type="button"
                      aria-label={color ? `Marco ${color}` : 'Marco del tema'}
                      onClick={() => update({ frameColor: color })}
                      className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${custom.frameColor === color ? 'border-[var(--text)]' : 'border-transparent'}`}
                      style={{ background: color || 'var(--ink)' }}
                    ></button>
                  ))}
                </div>
                <div className="mt-3">
                  <Toggle checked={custom.showLevelRing} onChange={(value) => update({ showLevelRing: value })} label="Anillo de progreso" hint="Muestra tu avance del curso alrededor de la foto" />
                </div>
              </div>

              <div className="space-y-2">
                <SectionTitle icon="fa-solid fa-sliders" title="Efectos" />
                <Toggle checked={custom.glow} onChange={(value) => update({ glow: value })} label="Resplandor" hint="Sombra de color bajo tu tarjeta principal" />
                <Toggle checked={custom.tilt} onChange={(value) => update({ tilt: value })} label="Movimiento 3D" hint="Las tarjetas se inclinan al pasar el cursor" />
                <Toggle checked={custom.density === 'compact'} onChange={(value) => update({ density: value ? 'compact' : 'comfortable' })} label="Vista compacta" />
              </div>
            </>
          )}

          {tab === 'datos' && (
            <>
              <div className="space-y-3">
                <SectionTitle icon="fa-solid fa-id-card" title="Tu información" />
                <label className="block">
                  <span className="mb-1 block text-[13px] font-semibold text-[var(--text)]">Nombre</span>
                  <input value={name} maxLength={NAME_MAX} onChange={(event) => setName(event.target.value)} className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1 flex justify-between text-[13px] font-semibold text-[var(--text)]">
                    Bio
                    <span className="note-num font-normal text-[var(--text-muted)]">
                      {bio.length}/{BIO_MAX}
                    </span>
                  </span>
                  <textarea value={bio} maxLength={BIO_MAX} rows={3} onChange={(event) => setBio(event.target.value)} placeholder="Cuéntale a la comunidad quién eres" className={`${inputClass} resize-none`} />
                </label>
                <label className="block">
                  <span className="mb-1 flex justify-between text-[13px] font-semibold text-[var(--text)]">
                    Mi meta
                    <span className="note-num font-normal text-[var(--text-muted)]">
                      {goal.length}/{GOAL_MAX}
                    </span>
                  </span>
                  <input value={goal} maxLength={GOAL_MAX} onChange={(event) => setGoal(event.target.value)} className={inputClass} />
                </label>
                <div>
                  <span className="mb-1 flex justify-between text-[13px] font-semibold text-[var(--text)]">
                    Estado
                    <span className="note-num font-normal text-[var(--text-muted)]">
                      {status.length}/{MAX_STATUS_LENGTH}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <i className={`${statusIcon} w-6 text-center text-[var(--ink)]`}></i>
                    <input value={status} maxLength={MAX_STATUS_LENGTH} onChange={(event) => setStatus(event.target.value)} placeholder="Qué estás haciendo ahora" className={inputClass} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {STATUS_ICONS.map((item) => (
                      <button
                        key={item.icon}
                        type="button"
                        title={item.label}
                        aria-label={item.label}
                        onClick={() => setStatusIcon(item.icon)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-[13px] transition-colors ${
                          statusIcon === item.icon ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--ink)]'
                        }`}
                      >
                        <i className={item.icon}></i>
                      </button>
                    ))}
                  </div>
                </div>
                <button type="button" disabled={!dataDirty} onClick={saveData} className="note-btn note-btn-ink h-11 w-full text-[15px] disabled:cursor-not-allowed disabled:opacity-50">
                  <i className="fa-solid fa-check text-[13px]"></i>
                  Guardar datos
                </button>
              </div>

              <div>
                <SectionTitle icon="fa-solid fa-image-portrait" title="Foto" />
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      title={preset.name}
                      aria-label={`Avatar ${preset.name}`}
                      onClick={() => updateUserProfile({ avatar: preset.url })}
                      className={`aspect-square overflow-hidden rounded-xl border-2 transition-transform hover:scale-105 ${user.avatar === preset.url ? 'border-[var(--ink)]' : 'border-transparent'}`}
                    >
                      <img src={preset.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="note-btn note-btn-line h-10 cursor-pointer px-4 text-[14px]">
                    {isProcessing === 'avatar' ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-upload text-[12px]"></i>}
                    Subir foto
                    <input type="file" accept="image/*" className="hidden" disabled={isProcessing !== null} onChange={(event) => handleFile(event, 'avatar')} />
                  </label>
                  {user.avatar && (
                    <button type="button" onClick={() => updateUserProfile({ avatar: null })} className="h-10 px-3 text-[14px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">
                      Usar predeterminada
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <SectionTitle icon="fa-solid fa-shield-halved" title="Cuenta" hint={`@${user.username} · ${user.email}`} />
                <button type="button" onClick={downloadData} className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-left text-[14px] font-semibold text-[var(--text)] hover:border-[var(--ink)]">
                  <i className="fa-solid fa-download w-4 text-[var(--ink)]"></i>
                  Descargar mis datos
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  onBlur={() => setConfirmReset(false)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-left text-[14px] font-semibold text-[var(--ink-3)] hover:border-[var(--ink-3)]"
                >
                  <i className="fa-solid fa-rotate-left w-4"></i>
                  {confirmReset ? 'Toca otra vez para confirmar' : 'Restablecer estilo del perfil'}
                </button>
              </div>
            </>
          )}

          {tab === 'tema' && (
            <>
              {THEME_GROUPS.map((group) => (
                <div key={group.id}>
                  <SectionTitle icon={group.id === 'bill' ? 'fa-solid fa-money-bill-wave' : group.id === 'market' ? 'fa-solid fa-landmark' : 'fa-solid fa-wand-magic-sparkles'} title={group.label} hint={group.description} />
                  <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                    {THEME_OPTIONS.filter((theme) => theme.group === group.id).map((theme) => (
                      <OptionTile
                        key={theme.id}
                        title={theme.name}
                        description={theme.desc}
                        compact
                        preview={<ThemePreviewArt theme={theme} />}
                        {...tileProps('theme', theme.id, theme.unlock, (user.theme || 'light') === theme.id, () => updateUserProfile({ theme: theme.id, accentColor: '' }))}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <SectionTitle icon="fa-solid fa-droplet" title="Color de acento" hint="Cambia el color principal sin cambiar de tema." />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateUserProfile({ accentColor: '' })}
                    className={`inline-flex h-9 items-center gap-2 rounded-full border-2 px-3 text-[13px] font-semibold ${!activeAccent || activeAccent === '#0284c7' ? 'border-[var(--ink)] text-[var(--ink)]' : 'border-[var(--border)] text-[var(--text-muted)]'}`}
                  >
                    <i className="fa-solid fa-wand-magic-sparkles text-[11px]"></i>
                    Del tema
                  </button>
                  {ACCENT_COLORS.filter((color) => color !== '#0284c7').map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Acento ${color}`}
                      onClick={() => updateUserProfile({ accentColor: color })}
                      className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${activeAccent === color ? 'border-[var(--text)]' : 'border-transparent'}`}
                      style={{ background: color }}
                    ></button>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'barra' && (
            <div>
              <SectionTitle icon="fa-solid fa-bars" title="Estilo de la barra" hint="Se aplica en toda la plataforma en computadora. En celular siempre verás la barra inferior." />
              <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                {NAV_STYLES.map((option) => (
                  <OptionTile
                    key={option.id}
                    title={option.label}
                    description={option.description}
                    compact
                    preview={<NavPreviewArt style={option.id} />}
                    {...tileProps('nav', option.id, option.unlock, custom.navStyle === option.id, () => update({ navStyle: option.id }))}
                  />
                ))}
              </div>
            </div>
          )}

          {tab === 'inicio' && (
            <>
              <div>
                <SectionTitle icon="fa-solid fa-hand" title="Saludo" hint="La segunda línea del saludo en tu inicio." />
                <div className="flex flex-wrap gap-2">
                  {HOME_GREETINGS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={custom.homeGreeting === option.id}
                      onClick={() => update({ homeGreeting: option.id })}
                      className={`inline-flex h-10 items-center rounded-full border-2 px-3.5 text-[13px] font-semibold transition-colors ${
                        custom.homeGreeting === option.id ? 'border-[var(--ink)] bg-[color-mix(in_srgb,var(--ink)_10%,transparent)] text-[var(--ink)]' : 'border-[var(--border)] text-[var(--text-muted)]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {custom.homeGreeting === 'custom' ? (
                  <input
                    value={custom.homeGreetingText}
                    maxLength={MAX_GREETING_LENGTH}
                    onChange={(event) => update({ homeGreetingText: event.target.value })}
                    placeholder="Escribe tu frase"
                    className={`${inputClass} mt-3`}
                  />
                ) : (
                  <p className="note-display mt-3 text-[18px] font-bold text-[var(--text-muted)]">{HOME_GREETINGS.find((item) => item.id === custom.homeGreeting)?.text}</p>
                )}
              </div>

              <div>
                <SectionTitle icon="fa-solid fa-image" title="Fondo de tu lección actual" hint="La tarjeta grande con tu siguiente lección." />
                <div className="grid grid-cols-4 gap-2">
                  {HOME_LESSON_BACKGROUNDS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={custom.homeLessonBg === option.id}
                      onClick={() => update({ homeLessonBg: option.id })}
                      className={`st-tile flex flex-col items-center gap-1.5 rounded-xl border-2 px-1 py-2.5 text-[12px] font-semibold ${
                        custom.homeLessonBg === option.id ? 'border-[var(--ink)] text-[var(--ink)]' : 'border-[var(--border)] text-[var(--text-muted)]'
                      }`}
                    >
                      <i className={`${option.icon} text-[16px]`}></i>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle icon="fa-solid fa-table-columns" title="Columna principal" hint="Ordena y oculta las secciones grandes." />
                <div className="space-y-2">
                  {custom.homeMain.map((id, index) => {
                    const option = HOME_MAIN_SECTIONS.find((item) => item.id === id)
                    if (!option) return null
                    const hidden = custom.homeHidden.includes(id)
                    return (
                      <SectionRow
                        key={id}
                        icon={option.icon}
                        label={option.label}
                        hidden={hidden}
                        locked={id === 'lesson'}
                        canUp={index > 0}
                        canDown={index < custom.homeMain.length - 1}
                        onUp={() => update({ homeMain: moveItem(custom.homeMain, index, -1) as HomeMainSection[] })}
                        onDown={() => update({ homeMain: moveItem(custom.homeMain, index, 1) as HomeMainSection[] })}
                        onToggle={() => update({ homeHidden: hidden ? custom.homeHidden.filter((item) => item !== id) : [...custom.homeHidden, id] })}
                      />
                    )
                  })}
                </div>
              </div>

              <div>
                <SectionTitle icon="fa-solid fa-table-list" title="Columna lateral" />
                <div className="space-y-2">
                  {custom.homeSide.map((id, index) => {
                    const option = HOME_SIDE_SECTIONS.find((item) => item.id === id)
                    if (!option) return null
                    const hidden = custom.homeHidden.includes(id)
                    return (
                      <SectionRow
                        key={id}
                        icon={option.icon}
                        label={option.label}
                        hidden={hidden}
                        canUp={index > 0}
                        canDown={index < custom.homeSide.length - 1}
                        onUp={() => update({ homeSide: moveItem(custom.homeSide, index, -1) as HomeSideSection[] })}
                        onDown={() => update({ homeSide: moveItem(custom.homeSide, index, 1) as HomeSideSection[] })}
                        onToggle={() => update({ homeHidden: hidden ? custom.homeHidden.filter((item) => item !== id) : [...custom.homeHidden, id] })}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <SectionTitle icon="fa-solid fa-sliders" title="Más opciones" />
                <Toggle checked={custom.homeSidebarLeft} onChange={(value) => update({ homeSidebarLeft: value })} label="Columna lateral a la izquierda" hint="Solo en computadora" />
                <Toggle checked={custom.homeCredentialCover} onChange={(value) => update({ homeCredentialCover: value })} label="Usar mi portada en la credencial" hint="La misma portada que elegiste para tu perfil" />
                <Toggle checked={custom.homeMascot} onChange={(value) => update({ homeMascot: value })} label="Mostrar a Kor en el inicio" />
                <Toggle checked={custom.homeCompact} onChange={(value) => update({ homeCompact: value })} label="Inicio compacto" hint="Menos espacio entre secciones" />
              </div>

              <Link to="/" className="note-btn note-btn-line h-11 w-full text-[15px]">
                Ver mi inicio
                <i className="fa-solid fa-arrow-right text-[12px]"></i>
              </Link>
            </>
          )}

          {tab === 'mundo' && (
            <div>
              <SectionTitle icon="fa-solid fa-earth-americas" title="Mundo de Aprender" hint="El escenario por el que avanzas en tu camino de lecciones." />
              <div className="grid grid-cols-1 gap-3">
                {LEARN_WORLDS.map((option) => (
                  <OptionTile
                    key={option.id}
                    title={option.label}
                    description={option.description}
                    preview={<WorldPreviewArt world={option.id} />}
                    {...tileProps('world', option.id, option.unlock, custom.learnWorld === option.id, () => update({ learnWorld: option.id }))}
                  />
                ))}
              </div>
              <Link to="/aprender" className="note-btn note-btn-line mt-4 h-11 w-full text-[15px]">
                Ver mi mundo en Aprender
                <i className="fa-solid fa-arrow-right text-[12px]"></i>
              </Link>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3">
          <span className="text-[12.5px] text-[var(--text-muted)]">
            <i className="fa-solid fa-circle-check mr-1.5 text-[var(--success)]"></i>
            Los cambios se guardan solos
          </span>
          <button type="button" onClick={onClose} className="note-btn note-btn-ink h-10 px-5 text-[14px]">
            Listo
          </button>
        </footer>
      </section>
    </>
  )
}
