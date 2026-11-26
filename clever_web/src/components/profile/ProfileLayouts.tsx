import React, { useRef } from 'react'
import type { UserProfile } from '../../types/platform'
import type { LearnWorld, ProfileCustomization } from '../../types/profileCustomization'
import { DEFAULT_BANNER_A, DEFAULT_BANNER_B } from '../../data/profileCustomizationOptions'
import { Microtext, Rosette, SmallRosette, WaveField } from '../note/NoteKit'
import { AvatarFrame, ProfileBanner } from './ProfileVisuals'
import { ModernBanner } from './ProfileBanners'
import FitText from '../FitText'

export interface AchievementItem {
  id: string
  name: string
  desc?: string
  icon?: string
}

export interface TopicMark {
  number: number
  label: string
  icon: string
  done: number
  total: number
}

export interface HeroProps {
  user: UserProfile
  custom: ProfileCustomization
  avatarSrc: string
  initials: string
  displayName: string
  progress: number
  topics: TopicMark[]
  currentTopic: number
  currentTopicLabel: string
  folio: string
  lessonsDone: number
  lessonsTotal: number
  statusSlot: React.ReactNode
  actions: React.ReactNode
}

export const LAYOUT_STYLES = `
.pl-stamp{transition:transform .35s cubic-bezier(.23,1,.32,1)}
.pl-stamp:hover{transform:rotate(0deg) scale(1.06)!important}
.pl-seal-spin{animation:pl-spin 40s linear infinite;transform-origin:center;transform-box:fill-box}
@keyframes pl-spin{to{transform:rotate(360deg)}}
.pl-steam{animation:pl-steam 3s ease-in-out infinite;transform-box:fill-box;transform-origin:bottom}
@keyframes pl-steam{0%{opacity:0;transform:translateY(6px) scaleY(.8)}40%{opacity:.7}100%{opacity:0;transform:translateY(-14px) scaleY(1.1)}}
.pl-blink{animation:pl-blink 4s steps(1) infinite}
@keyframes pl-blink{0%,100%{opacity:1}50%{opacity:.35}}
.pl-draw{stroke-dasharray:1 1;animation:pl-draw 3.2s cubic-bezier(.23,1,.32,1) both}
@keyframes pl-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.pl-leaf{animation:pl-leaf 5s ease-in-out infinite;transform-box:fill-box;transform-origin:bottom center}
@keyframes pl-leaf{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
.pl-cursor{animation:pl-blink 1s steps(1) infinite}
.pl-card{transform-style:preserve-3d;transition:transform .2s ease-out}
.pl-card-holo{background:linear-gradient(115deg,transparent 20%,rgba(255,0,170,.18) 32%,rgba(0,220,255,.2) 44%,rgba(255,230,0,.18) 56%,rgba(120,255,140,.16) 68%,transparent 80%);background-size:300% 300%;background-position:var(--hx,50%) var(--hy,50%);mix-blend-mode:color-dodge;opacity:.75}
.pl-card-glare{background:radial-gradient(circle at var(--gx,50%) var(--gy,30%),rgba(255,255,255,.45),transparent 45%);mix-blend-mode:overlay}
.pl-card-idle{animation:pl-card-idle 6s ease-in-out infinite}
@keyframes pl-card-idle{0%,100%{transform:perspective(900px) rotateY(-6deg) rotateX(3deg)}50%{transform:perspective(900px) rotateY(6deg) rotateX(-2deg)}}
@media (prefers-reduced-motion:reduce){
.pl-seal-spin,.pl-steam,.pl-blink,.pl-leaf,.pl-cursor,.pl-card-idle,.pl-draw{animation:none!important}
.pl-stamp,.pl-card{transition:none}
}
`

export const nameSizeClass = (name: string, size: 'xl' | 'lg' = 'xl') => {
  const length = (name || '').length
  if (length > 26) return 'text-[26px] sm:text-[32px]'
  if (length > 16) return 'text-[30px] sm:text-[38px] lg:text-[42px]'
  return size === 'xl' ? 'text-[38px] sm:text-[52px]' : 'text-[34px] sm:text-[42px]'
}

export const hasLongWord = (text: string, limit = 12) => (text || '').split(/\s+/).some((word) => word.length > limit)

export const getFolio = (username: string) => {
  let hash = 7
  for (const char of username || 'clever') hash = (hash * 31 + char.charCodeAt(0)) % 999983
  return String(100000 + (hash % 900000))
}

export const memberSince = (createdAt: number) => new Date(createdAt || Date.now()).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })

const GuillocheCover: React.FC<{ ink?: string; className?: string }> = ({ ink, className = '' }) => (
  <div className={`relative overflow-hidden bg-[var(--paper-2)] ${className}`} style={ink ? ({ '--ink': ink } as React.CSSProperties) : undefined} aria-hidden="true">
    <Rosette className="absolute -right-24 -top-40 h-[440px] w-[440px] opacity-90" />
    <Rosette variant="b" className="absolute -left-28 -bottom-56 h-[420px] w-[420px] opacity-60" />
    <WaveField className="absolute inset-x-0 bottom-0 h-24 w-full opacity-70" />
    <Microtext className="absolute left-0 right-0 top-3" />
    <Microtext className="absolute left-0 right-0 top-6 opacity-40" />
    <div className="note-display absolute bottom-2 right-6 select-none text-[88px] font-black leading-none text-transparent opacity-50 [-webkit-text-stroke:1px_var(--ink)] sm:text-[120px]">
      CLEVER
    </div>
  </div>
)

export const ProfileCover: React.FC<{ custom: ProfileCustomization; cover?: string | null; className?: string }> = ({ custom, cover, className = '' }) => {
  if (custom.bannerStyle === 'guilloche') return <GuillocheCover ink={custom.bannerColorA || undefined} className={className} />
  if (custom.bannerStyle !== 'cover') {
    return (
      <ModernBanner
        style={custom.bannerStyle}
        colorA={custom.bannerColorA || DEFAULT_BANNER_A}
        colorB={custom.bannerColorB || DEFAULT_BANNER_B}
        speed={custom.bannerSpeed}
        className={className}
      />
    )
  }
  return (
    <ProfileBanner
      style={custom.bannerStyle}
      colorA={custom.bannerColorA || DEFAULT_BANNER_A}
      colorB={custom.bannerColorB || DEFAULT_BANNER_B}
      speed={custom.bannerSpeed}
      cover={cover || undefined}
      className={className}
    />
  )
}

const Avatar: React.FC<{ props: HeroProps; size: number }> = ({ props, size }) => (
  <AvatarFrame
    src={props.avatarSrc}
    initials={props.initials}
    alt={`Avatar de ${props.displayName}`}
    shape={props.custom.avatarShape}
    frame={props.custom.frameStyle}
    frameColor={props.custom.frameColor || 'var(--ink)'}
    showLevelRing={props.custom.showLevelRing}
    progress={props.progress}
    size={size}
  />
)

const CourseThread: React.FC<{ done: number; total: number; progress: number }> = ({ done, total, progress }) => (
  <div>
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <span className="note-wide text-[10px] font-bold text-[var(--ink)]">HILO DE SEGURIDAD · AVANCE DEL CURSO</span>
      <span className="note-num text-[13px] font-semibold text-[var(--text-muted)]">
        {done} / {total} lecciones
      </span>
    </div>
    <div
      className="relative h-3.5 overflow-hidden rounded-full border border-[var(--rule)] bg-[var(--paper)]"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Avance del curso"
    >
      <div className="note-thread h-full rounded-full transition-[width] duration-1000" style={{ width: `${Math.max(progress, 3)}%` }}></div>
      <div className="note-shine absolute inset-0"></div>
    </div>
  </div>
)

const TopicPips: React.FC<{ topics: TopicMark[]; tone?: 'ink' | 'light' }> = ({ topics, tone = 'ink' }) => (
  <div className="flex items-center gap-1.5">
    {topics.map((topic) => {
      const isDone = topic.done === topic.total
      const started = topic.done > 0
      return (
        <span
          key={topic.number}
          title={`Tema ${topic.number} · ${topic.label}: ${topic.done}/${topic.total}`}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] ${
            tone === 'light'
              ? isDone
                ? 'bg-white text-[#0e1420]'
                : 'border border-white/30 text-white/70'
              : isDone
                ? 'bg-[var(--ink)] text-[var(--bg)]'
                : started
                  ? 'border-2 border-[var(--ink)] text-[var(--ink)]'
                  : 'border border-dashed border-[var(--rule)] text-[var(--text-dim)]'
          }`}
        >
          <i className={isDone ? 'fa-solid fa-check' : topic.icon}></i>
        </span>
      )
    })}
  </div>
)

export const CredentialHero: React.FC<HeroProps> = (props) => {
  const { user, custom, displayName, folio, progress, topics, currentTopic, currentTopicLabel, lessonsDone, lessonsTotal, statusSlot, actions } = props
  return (
    <section
      className="note-bill relative overflow-hidden rounded-[28px] border border-[var(--rule)] bg-[var(--surface)]"
      style={custom.glow ? { boxShadow: '0 30px 70px -40px color-mix(in srgb, var(--ink) 70%, transparent)' } : undefined}
    >
      <div className="relative">
        <ProfileCover custom={custom} cover={user.cover} className="h-44 sm:h-56" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-3 py-1.5 backdrop-blur sm:left-6 sm:top-5">
          <i className="fa-solid fa-id-card text-[12px] text-[var(--ink)]"></i>
          <span className="note-wide text-[10px] font-bold text-[var(--ink)]"><span className="sm:hidden">CREDENCIAL</span><span className="hidden sm:inline">CREDENCIAL DE INVERSIONISTA</span></span>
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-3 py-1.5 backdrop-blur sm:right-6 sm:top-5">
          <span className="note-wide text-[10px] font-bold text-[var(--text-muted)]">FOLIO </span>
          <span className="note-num text-[13px] font-bold text-[var(--ink-3)]">{folio}</span>
        </div>
      </div>

      <div className="@container relative px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="flex flex-col items-center gap-x-6 gap-y-4 sm:flex-row sm:flex-wrap sm:items-start">
          <div className="-mt-16 shrink-0 sm:-mt-[72px]">
            <Avatar props={props} size={140} />
          </div>
          <div className="min-w-0 flex-1 text-center sm:pt-5 sm:text-left">
            <div className="note-wide text-[10px] font-bold text-[var(--text-muted)]">TITULAR</div>
            <FitText as="h1" className={`note-display mt-1 font-black leading-[0.98] text-[var(--text)] [overflow-wrap:break-word] [text-wrap:balance] ${nameSizeClass(displayName)}`}>{displayName}</FitText>
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[14px] text-[var(--text-muted)] sm:justify-start">
              <span className="font-semibold text-[var(--text)]">@{user.username}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--text-dim)]"></span>
              <span>{currentTopicLabel}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--text-dim)]"></span>
              <span>Desde {memberSince(user.createdAt)}</span>
            </div>
          </div>
          <div className={`flex shrink-0 flex-wrap justify-center gap-2 sm:basis-full sm:justify-start sm:pl-[164px] ${hasLongWord(displayName) ? '' : '@3xl:basis-auto @3xl:pl-0 @3xl:pt-7'}`}>{actions}</div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {statusSlot}
          {user.bio && <p className="text-center text-[15px] leading-relaxed text-[var(--text)] sm:text-left">{user.bio}</p>}
        </div>

        <div className="mt-7 grid gap-6 border-t border-dashed border-[var(--rule)] pt-6 @4xl:grid-cols-[1fr_auto_auto] @4xl:items-center">
          <CourseThread done={lessonsDone} total={lessonsTotal} progress={progress} />
          <div className="flex flex-wrap items-center justify-center gap-3 @4xl:justify-start">
            <span className="note-wide text-[10px] font-bold text-[var(--text-muted)]">TEMAS</span>
            <TopicPips topics={topics} />
          </div>
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center @4xl:mx-0">
            <SmallRosette className="pl-seal-spin absolute inset-0 h-full w-full" />
            <span className="relative flex h-14 w-14 flex-col items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)]">
              <span className="note-wide text-[7px] font-bold opacity-80">TEMA</span>
              <span className="note-display note-num text-[22px] font-black leading-none">{currentTopic}</span>
            </span>
          </div>
        </div>
      </div>
      <Microtext className="border-t border-[var(--rule)] py-1.5" />
    </section>
  )
}

const WINDOW_VIEWS: Record<LearnWorld, (seed: number) => React.ReactNode> = {
  city: () => (
    <g>
      {[
        [70, 120, 46],
        [122, 80, 40],
        [168, 140, 54],
        [228, 100, 36],
        [270, 60, 50],
        [326, 130, 44],
        [376, 92, 52],
        [434, 150, 30],
      ].map(([x, h, w], i) => (
        <g key={i}>
          <rect x={x} y={260 - h} width={w} height={h} fill="color-mix(in srgb, var(--ink) 55%, #1b2738)" opacity={0.55 + (i % 3) * 0.15} />
          {Array.from({ length: Math.floor(h / 22) }).map((_, r) =>
            [0, 1].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={x + 7 + c * (w / 2 - 4)}
                y={260 - h + 10 + r * 22}
                width={w / 2 - 12}
                height="8"
                fill="#ffd66b"
                opacity={(r + c + i) % 3 === 0 ? 0.95 : 0.25}
                className={(r + c + i) % 5 === 0 ? 'pl-blink' : undefined}
                style={{ animationDelay: `${(r + i) * 0.7}s` }}
              />
            )),
          )}
        </g>
      ))}
    </g>
  ),
  candles: () => (
    <g>
      <circle cx="380" cy="110" r="34" fill="#ffd66b" opacity="0.85" />
      {[
        [80, 90, 1],
        [150, 130, 0],
        [220, 70, 1],
        [290, 150, 1],
        [360, 100, 0],
        [430, 120, 1],
      ].map(([x, h, up], i) => (
        <g key={i}>
          <rect x={x + 20} y={240 - h - 24} width="4" height={h + 40} fill={up ? '#1f7a4d' : '#b23a3a'} opacity="0.7" />
          <rect x={x} y={240 - h} width="44" height={h} rx="5" fill={up ? '#2f9e66' : '#d4574c'} opacity="0.85" />
        </g>
      ))}
      <rect x="40" y="236" width="460" height="30" fill="#d9a35b" opacity="0.7" />
    </g>
  ),
  island: () => (
    <g>
      <circle cx="120" cy="120" r="30" fill="#ffd66b" opacity="0.9" />
      <rect x="40" y="190" width="460" height="80" fill="#2aa7c9" opacity="0.8" />
      <path d="M220 210 Q300 160 380 210 Z" fill="#f2d48f" />
      <path d="M300 200 Q296 150 306 120" stroke="#7a5230" strokeWidth="6" fill="none" />
      <path d="M306 120 q-30 -6 -44 12 M306 120 q26 -14 44 4 M306 120 q-6 -26 -26 -30 M306 120 q16 -22 36 -18" stroke="#2f8a4e" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M90 230 l30 0 l-6 10 l-18 0 Z M104 230 v-24 l14 18 Z" fill="#fff" opacity="0.9" />
    </g>
  ),
}

export const OfficeHero: React.FC<HeroProps> = (props) => {
  const { user, custom, displayName, progress, topics, currentTopic, currentTopicLabel, statusSlot, actions, avatarSrc, initials, lessonsDone, lessonsTotal } = props
  const chart = Array.from({ length: 9 }).map((_, i) => {
    const x = 492 + i * 18
    const y = 262 - Math.min(68, 10 + i * 5 + ((i * 37) % 13) + (progress / 100) * 18 * (i / 8))
    return `${i === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`
  })
  const topicsDone = topics.filter((topic) => topic.done === topic.total).length
  const BINDER_COLORS = ['#2e86ab', '#e4572e', '#7a9e3d', '#8a5cf6', '#f2a541', '#c0397a']
  return (
    <section
      className="relative overflow-hidden rounded-[28px] border border-[var(--rule)] bg-[var(--surface)]"
      style={custom.glow ? { boxShadow: '0 30px 70px -40px color-mix(in srgb, var(--ink) 70%, transparent)' } : undefined}
    >
      <svg viewBox="0 0 1200 420" className="block h-auto w-full" role="img" aria-label={`Oficina de ${displayName}`}>
        <defs>
          <linearGradient id="pl-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="color-mix(in srgb, var(--ink) 35%, #bfe3ff)" />
            <stop offset="1" stopColor="color-mix(in srgb, var(--ink) 10%, #fff4dc)" />
          </linearGradient>
          <clipPath id="pl-window">
            <rect x="40" y="46" width="460" height="214" rx="10" />
          </clipPath>
          <clipPath id="pl-photo">
            <rect x="962" y="74" width="132" height="132" rx="6" />
          </clipPath>
        </defs>
        <rect width="1200" height="420" fill="var(--paper)" />
        <rect y="0" width="1200" height="420" fill="url(#pl-sky)" opacity="0" />
        <rect y="300" width="1200" height="120" fill="var(--paper-2)" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1={i * 52} y1="300" x2={i * 52} y2="420" stroke="var(--rule)" strokeWidth="1" />
        ))}

        <rect x="30" y="36" width="480" height="234" rx="14" fill="var(--surface)" stroke="var(--rule)" strokeWidth="2" />
        <g clipPath="url(#pl-window)">
          <rect x="40" y="46" width="460" height="214" fill="url(#pl-sky)" />
          {WINDOW_VIEWS[custom.learnWorld](currentTopic)}
        </g>
        <line x1="270" y1="46" x2="270" y2="260" stroke="var(--surface)" strokeWidth="6" />
        <line x1="40" y1="150" x2="500" y2="150" stroke="var(--surface)" strokeWidth="6" />
        <rect x="24" y="266" width="492" height="12" rx="4" fill="var(--surface)" stroke="var(--rule)" />

        <rect x="560" y="146" width="320" height="10" rx="3" fill="#8a5a3b" />
        {topics.map((topic, i) => {
          const x = 572 + i * 50
          const isDone = topic.done === topic.total
          const fill = Math.round((topic.done / topic.total) * 52)
          return (
            <g key={topic.number}>
              <rect x={x} y={94} width="34" height="52" rx="4" fill={isDone ? BINDER_COLORS[i] : 'var(--surface)'} stroke={isDone ? 'none' : 'var(--rule)'} strokeDasharray={isDone ? undefined : '4 4'} />
              {!isDone && topic.done > 0 && <rect x={x} y={146 - fill} width="34" height={fill} rx="4" fill={BINDER_COLORS[i]} opacity="0.55" />}
              <rect x={x + 8} y={104} width="18" height="10" rx="2" fill={isDone ? 'rgba(255,255,255,.85)' : 'var(--paper-2)'} />
              <text x={x + 17} y={138} textAnchor="middle" fontSize="13" fontWeight="900" fill={isDone ? '#fff' : 'var(--text-muted)'} style={{ fontFamily: 'var(--font-display)' }}>
                {topic.number}
              </text>
            </g>
          )
        })}
        <text x="720" y="180" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text-muted)" style={{ fontFamily: 'var(--font-display)' }}>
          {topicsDone} DE {topics.length} TEMAS
        </text>

        <rect x="946" y="58" width="164" height="190" rx="8" fill="#7a5230" />
        <rect x="956" y="68" width="144" height="144" rx="6" fill="var(--surface)" />
        {avatarSrc ? (
          <image href={avatarSrc} x="962" y="74" width="132" height="132" preserveAspectRatio="xMidYMid slice" clipPath="url(#pl-photo)" />
        ) : (
          <text x="1028" y="152" textAnchor="middle" fontSize="44" fontWeight="900" fill="var(--ink)">
            {initials}
          </text>
        )}
        <rect x="976" y="220" width="104" height="20" rx="4" fill="#E3A92F" />
        <text x="1028" y="234.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#3d2a10" style={{ fontFamily: 'var(--font-display)' }}>
          TEMA {currentTopic}
        </text>

        <g>
          <rect x="470" y="186" width="190" height="112" rx="10" fill="#141a22" />
          <rect x="478" y="194" width="174" height="96" rx="5" fill="#0c1118" />
          <path d={chart.join(' ')} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="pl-draw" />
          <text x="488" y="212" fontSize="11" fontWeight="700" fill="#8fa3bd" style={{ fontFamily: 'var(--font-display)' }}>
            AVANCE {progress}%
          </text>
          <rect x="556" y="298" width="18" height="18" fill="#2a2f3a" />
        </g>
        <g>
          <rect x="676" y="200" width="160" height="98" rx="10" fill="#141a22" />
          <rect x="684" y="208" width="144" height="82" rx="5" fill="#0c1118" />
          <text x="756" y="246" textAnchor="middle" fontSize="28" fontWeight="900" fill="#ffd66b" style={{ fontFamily: 'var(--font-display)' }}>
            {lessonsDone}/{lessonsTotal}
          </text>
          <text x="756" y="268" textAnchor="middle" fontSize="11" fontWeight="700" fill="#8fa3bd">
            LECCIONES
          </text>
          <rect x="748" y="298" width="16" height="18" fill="#2a2f3a" />
        </g>
        <g>
          <rect x="852" y="222" width="96" height="76" rx="8" fill="#141a22" />
          <rect x="858" y="228" width="84" height="62" rx="4" fill="#0c1118" />
          <text x="900" y="258" textAnchor="middle" fontSize="20" fontWeight="900" fill="#ff8a5c" style={{ fontFamily: 'var(--font-display)' }}>
            {topicsDone}/{topics.length}
          </text>
          <text x="900" y="278" textAnchor="middle" fontSize="10" fontWeight="700" fill="#8fa3bd">
            TEMAS
          </text>
          <rect x="893" y="298" width="14" height="18" fill="#2a2f3a" />
        </g>

        <rect x="420" y="314" width="620" height="18" rx="4" fill="#8a5a3b" />
        <rect x="440" y="332" width="16" height="70" fill="#6d4529" />
        <rect x="1004" y="332" width="16" height="70" fill="#6d4529" />
        <rect x="600" y="300" width="120" height="14" rx="4" fill="#2a2f3a" />

        <g>
          <rect x="980" y="286" width="22" height="28" rx="4" fill="var(--surface)" stroke="var(--rule)" />
          <path d="M986 282 q-4 -10 2 -18" stroke="var(--text-dim)" strokeWidth="2" fill="none" className="pl-steam" />
          <path d="M994 282 q4 -10 -2 -18" stroke="var(--text-dim)" strokeWidth="2" fill="none" className="pl-steam" style={{ animationDelay: '1.2s' }} />
        </g>
        <g>
          <path d="M1120 300 l-14 -2 l4 -26 l20 0 l4 26 Z" fill="#c26a3d" transform="translate(0 102)" />
          <g className="pl-leaf">
            <path d="M1126 372 q-30 -40 -6 -86 q8 40 6 86 Z" fill="#3f8b52" />
            <path d="M1126 372 q26 -46 4 -96 q-14 50 -4 96 Z" fill="#55a564" />
            <path d="M1126 372 q-44 -20 -50 -56 q34 18 50 56 Z" fill="#2f7a44" />
          </g>
        </g>
        <g>
          <path d="M140 314 l0 -40 l26 -16" stroke="#2a2f3a" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M160 252 l26 6 l-6 20 Z" fill="var(--ink)" />
          <ellipse cx="185" cy="292" rx="40" ry="10" fill="#ffd66b" opacity="0.18" />
          <rect x="120" y="310" width="40" height="8" rx="3" fill="#2a2f3a" />
        </g>
        <g>
          <text x="40" y="372" fontSize="12" fontWeight="800" fill="var(--text-muted)" style={{ fontFamily: 'var(--font-display)' }}>
            LECCIONES {lessonsDone}/{lessonsTotal}
          </text>
          {Array.from({ length: lessonsTotal }).map((_, i) => (
            <rect key={i} x={40 + i * 15} y="382" width="11" height="10" rx="3" fill={i < lessonsDone ? 'var(--ink)' : 'var(--rule)'} />
          ))}
        </g>
      </svg>

      <div className="relative flex flex-col gap-5 border-t border-[var(--rule)] px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:px-8">
        <div className="-mt-16 shrink-0 self-center sm:self-auto">
          <Avatar props={props} size={112} />
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <FitText as="h1" className={`note-display font-black leading-[0.98] text-[var(--text)] [overflow-wrap:break-word] [text-wrap:balance] ${nameSizeClass(displayName, 'lg')}`}>{displayName}</FitText>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[14px] text-[var(--text-muted)] sm:justify-start">
            <span className="font-semibold text-[var(--text)]">@{user.username}</span>
            <span>{currentTopicLabel}</span>
            <span>Desde {memberSince(user.createdAt)}</span>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            {statusSlot}
            {user.bio && <p className="text-[15px] text-[var(--text)]">{user.bio}</p>}
          </div>
        </div>
        <div className={`flex shrink-0 flex-wrap justify-center gap-2 ${hasLongWord(displayName) ? 'sm:basis-full sm:justify-start sm:pl-[132px]' : ''}`}>{actions}</div>
      </div>
    </section>
  )
}

const RARITIES = [
  { min: 100, label: 'Legendaria', colors: ['#f6c453', '#e2771f', '#fff1b8'] },
  { min: 60, label: 'Épica', colors: ['#a855f7', '#ec4899', '#f5d0fe'] },
  { min: 25, label: 'Rara', colors: ['#38bdf8', '#6366f1', '#dbeafe'] },
  { min: 0, label: 'Común', colors: ['#94a3b8', '#475569', '#f1f5f9'] },
]

export const CardHero: React.FC<HeroProps> = (props) => {
  const { user, custom, displayName, folio, progress, topics, currentTopic, currentTopicLabel, statusSlot, actions, avatarSrc, initials, lessonsDone, lessonsTotal } = props
  const rarity = RARITIES.find((item) => progress >= item.min) || RARITIES[RARITIES.length - 1]
  const topicsDone = topics.filter((topic) => topic.done === topic.total).length
  const cardRef = useRef<HTMLDivElement>(null)

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el || !custom.tilt) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    el.classList.remove('pl-card-idle')
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 22}deg) rotateX(${(0.5 - py) * 18}deg) scale(1.02)`
    el.style.setProperty('--hx', `${px * 100}%`)
    el.style.setProperty('--hy', `${py * 100}%`)
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }

  const onLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = ''
    if (custom.tilt) el.classList.add('pl-card-idle')
  }

  const lines = [
    { icon: 'fa-solid fa-road', label: 'Lecciones', value: `${lessonsDone}/${lessonsTotal}` },
    { icon: 'fa-solid fa-layer-group', label: 'Temas', value: `${topicsDone}/${topics.length}` },
    { icon: 'fa-solid fa-chart-pie', label: 'Avance', value: `${progress}%` },
    { icon: 'fa-solid fa-location-dot', label: 'Tema actual', value: currentTopic },
  ]

  return (
    <section
      className="@container relative overflow-hidden rounded-[28px] border border-[var(--rule)] bg-[var(--surface)] px-5 py-8 sm:px-10"
      style={custom.glow ? { boxShadow: `0 30px 70px -40px ${rarity.colors[0]}` } : undefined}
    >
      <Rosette className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] opacity-40" />
      <div className="relative grid items-center gap-10 @2xl:grid-cols-[auto_1fr]">
        <div className="mx-auto" style={{ perspective: 900 }} onPointerMove={onMove} onPointerLeave={onLeave}>
          <div
            ref={cardRef}
            className={`pl-card relative w-[280px] rounded-[22px] p-[6px] ${custom.tilt ? 'pl-card-idle' : ''}`}
            style={{ aspectRatio: '63 / 88', background: `linear-gradient(140deg, ${rarity.colors[0]}, ${rarity.colors[1]})`, boxShadow: '0 30px 60px -28px rgba(10,20,40,.6)' }}
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-[17px] bg-[#0e1420] p-3 text-white">
              <div className="flex items-center justify-between">
                <span className="note-display truncate text-[17px] font-black">{displayName}</span>
                <span className="note-num rounded-full bg-white/15 px-2 py-0.5 text-[12px] font-bold">T{currentTopic}</span>
              </div>
              <div className="relative mt-2 h-[44%] overflow-hidden rounded-xl border-2" style={{ borderColor: rarity.colors[2] }}>
                <ProfileCover custom={custom} cover={user.cover} className="absolute inset-0 h-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-[#1c2534] text-2xl font-black">
                    {avatarSrc ? <img src={avatarSrc} alt="" className="h-full w-full object-cover" /> : initials}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold">
                <span className="truncate">Inversionista · Tema {currentTopic}</span>
                <span className="flex items-center gap-1" style={{ color: rarity.colors[2] }}>
                  <i className="fa-solid fa-star text-[9px]"></i>
                  {rarity.label}
                </span>
              </div>
              <div className="mt-2 flex-1 space-y-1.5">
                {lines.map((line) => (
                  <div key={line.label} className="flex items-center gap-2 text-[13px]">
                    <i className={`${line.icon} w-4 text-center text-[11px]`} style={{ color: rarity.colors[2] }}></i>
                    <span className="flex-1 font-semibold opacity-85">{line.label}</span>
                    <span className="note-num font-black">{line.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full" style={{ width: `${progress}%`, background: rarity.colors[0] }}></div>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] opacity-70">
                <span className="note-num">#{folio}</span>
                <span>CLEVER · SERIE KOR</span>
              </div>
              <div className="pl-card-holo pointer-events-none absolute inset-0"></div>
              <div className="pl-card-glare pointer-events-none absolute inset-0"></div>
            </div>
          </div>
        </div>

        <div className="min-w-0 text-center @2xl:text-left">
          <div className="note-wide text-[10px] font-bold" style={{ color: rarity.colors[1] }}>
            CARTA {rarity.label.toUpperCase()} · #{folio}
          </div>
          <FitText as="h1" className={`note-display mt-2 font-black leading-[0.98] text-[var(--text)] [overflow-wrap:break-word] [text-wrap:balance] ${nameSizeClass(displayName)}`}>{displayName}</FitText>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[14px] text-[var(--text-muted)] @2xl:justify-start">
            <span className="font-semibold text-[var(--text)]">@{user.username}</span>
            <span>{currentTopicLabel}</span>
            <span>Desde {memberSince(user.createdAt)}</span>
          </div>
          <div className="mt-4 flex flex-col items-center gap-2 @2xl:items-start">
            {statusSlot}
            {user.bio && <p className="max-w-xl text-[15px] leading-relaxed text-[var(--text)]">{user.bio}</p>}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2 @2xl:justify-start">{actions}</div>
          <div className="mt-7 flex items-center justify-center gap-3 @2xl:justify-start">
            <span className="note-wide text-[10px] font-bold text-[var(--text-muted)]">TEMAS</span>
            <TopicPips topics={topics} />
          </div>
        </div>
      </div>
    </section>
  )
}
