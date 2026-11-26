import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CleverkorMascot3D } from '../CleverkorMascot3D'
import type { LearnWorld } from '../../types/profileCustomization'
import { CANDLES_KIT, ISLAND_KIT, WORLD_STYLES } from './TrailWorlds'
import type { WorldKit } from './TrailWorlds'
import FitText from '../FitText'

export type TrailLessonStatus = 'completed' | 'current' | 'available' | 'locked'

export type TrailScene = 'company' | 'candles' | 'range' | 'stoploss' | 'emotions' | 'orders' | 'simulator' | 'backtest'

interface TrailLesson {
  title: string
  stageIndex: number
  scene?: TrailScene
  code?: string
  meta?: string
}

interface TrailStage {
  title: string
}

interface TradingTrailMapProps {
  lessons: TrailLesson[]
  stages: TrailStage[]
  statusOf: (index: number) => TrailLessonStatus
  onOpenLesson: (index: number) => void
  isCourseDone: boolean
  completedCount: number
  world?: LearnWorld
}

interface Point {
  x: number
  y: number
}

const W = 600
const FIRST_Y = 300
const STEP = 210
const STAGE_GAP = 190
const ROAD_X_AMPLITUDE = 140
const DISTRICT_NAMES = ['Barrio del Mercado', 'Avenida de las Velas', 'Distrito de Indicadores', 'Puerto Cripto', 'Torre del Riesgo', 'Muelle DeFi']
const STALL_COLORS = ['#e4572e', '#f2a541', '#2e86ab', '#7a9e3d', '#c0397a']
interface AdSkin {
  bg: string
  fg: string
  accent: string
  up: string
  down: string
}

const AD_SKINS: AdSkin[] = [
  { bg: '#0f4c81', fg: '#ffffff', accent: '#ffd66b', up: '#5ee08f', down: '#ff8a80' },
  { bg: '#ffd23f', fg: '#1b1b1b', accent: '#c2410c', up: '#15803d', down: '#b91c1c' },
  { bg: '#e4572e', fg: '#ffffff', accent: '#ffe08a', up: '#c7f9d4', down: '#3d0f08' },
  { bg: '#1f7a4d', fg: '#ffffff', accent: '#ffe08a', up: '#c7f9d4', down: '#ffb4a8' },
  { bg: '#2b2d42', fg: '#ffffff', accent: '#8ecae6', up: '#5ee08f', down: '#ff8a80' },
  { bg: '#7a5ea8', fg: '#ffffff', accent: '#ffe08a', up: '#9ff5bd', down: '#ffc2b8' },
]
const CAR_COLORS = ['#e4572e', '#2e86ab', '#f2c14e', '#7a5ea8', '#ffffff']
const ROOF_TONES = ['#f0b8a0', '#a9c4ea', '#f4d07a', '#c9b8e8', '#9fd3c7']

const CITY_STYLES = `
.city-map{--grass:#c3e5b5;--grass-2:#b0dba0;--walk:#efe9dd;--walk-edge:#d9cfbc;--asphalt:#4b5563;--asphalt-edge:#353d4a;--lane:#f6f1e4;--tree:#55a564;--tree-2:#3f8b52;--water:#7cc8ec;--wall:#fbf7ef;--wall-2:#e6dece;--window:#a9cbea;--window-lit:#ffd66b;--roof:#c9d3dd;--shade:rgba(20,30,40,.14)}
:root:is([data-theme="dark"],[data-theme="terminal"],[data-theme="aurora"],[data-theme="neon"],[data-theme="sunset"],[data-theme="ocean"]) .city-map{--grass:#1d3a2b;--grass-2:#183225;--walk:#2b3344;--walk-edge:#394357;--asphalt:#20252f;--asphalt-edge:#151920;--lane:#c8c2b2;--tree:#2b6643;--tree-2:#225636;--water:#24557a;--wall:#384157;--wall-2:#2d3547;--window:#2f4a70;--window-lit:#ffd66b;--roof:#2a3142;--shade:rgba(0,0,0,.3)}
.city-scroll{scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--ink) 40%,transparent) transparent}
.city-scroll.is-dragging{cursor:grabbing;user-select:none}
.city-dash{stroke-dasharray:14 14;animation:city-dash 2.4s linear infinite}
@keyframes city-dash{to{stroke-dashoffset:-28}}
.city-car-right{animation:city-car-right var(--car-dur,14s) linear infinite}
@keyframes city-car-right{from{transform:translateX(-80px)}to{transform:translateX(680px)}}
.city-car-left{animation:city-car-left var(--car-dur,16s) linear infinite}
@keyframes city-car-left{from{transform:translateX(680px) scaleX(-1)}to{transform:translateX(-80px) scaleX(-1)}}
.city-blink{animation:city-blink 5s steps(1) infinite}
@keyframes city-blink{0%,100%{fill:var(--window-lit)}45%{fill:var(--window)}75%{fill:var(--window-lit)}}
.city-sway{transform-box:fill-box;transform-origin:50% 0;animation:city-sway 2.8s ease-in-out infinite}
@keyframes city-sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
.city-ripple{transform-box:fill-box;transform-origin:center;animation:city-ripple 2.6s ease-out infinite}
@keyframes city-ripple{0%{transform:scale(.4);opacity:.9}100%{transform:scale(1.2);opacity:0}}
.city-board{animation:city-board 3s ease-in-out infinite;transform-box:fill-box;transform-origin:bottom}
@keyframes city-board{0%,100%{transform:scaleY(.7)}50%{transform:scaleY(1.05)}}
.city-pulse{animation:city-pulse 2.2s cubic-bezier(.23,1,.32,1) infinite}
@keyframes city-pulse{0%{transform:translate(-50%,-50%) scale(1);opacity:.55}100%{transform:translate(-50%,-50%) scale(1.9);opacity:0}}
.city-node{transition:transform .25s cubic-bezier(.23,1,.32,1)}
.city-node:not(:disabled):hover{transform:translate(-50%,-50%) scale(1.08)!important}
.city-node:not(:disabled):active{transform:translate(-50%,-50%) scale(.95)!important}
.city-bulb{animation:city-bulb 1.2s steps(1) infinite}
@keyframes city-bulb{0%,100%{opacity:1}50%{opacity:.25}}
.city-vault{transition:transform 1.4s cubic-bezier(.23,1,.32,1);transform-box:fill-box;transform-origin:center}
.city-vault-open .city-vault{transform:rotate(-120deg)}
.ad-draw{stroke-dasharray:1 1;animation:ad-draw 4.2s ease-in-out infinite}
@keyframes ad-draw{0%{stroke-dashoffset:1;opacity:1}55%{stroke-dashoffset:0}88%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
.ad-rewind{stroke-dasharray:1 1;animation:ad-rewind 4.2s ease-in-out infinite}
@keyframes ad-rewind{0%{stroke-dashoffset:-1;opacity:1}55%{stroke-dashoffset:0}88%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
.ad-dot{offset-rotate:0deg;offset-distance:100%;animation:ad-dot 4.2s ease-in-out infinite}
@keyframes ad-dot{0%{offset-distance:0%;opacity:1}55%{offset-distance:100%}88%{offset-distance:100%;opacity:1}100%{offset-distance:100%;opacity:0}}
.ad-pop{transform-box:fill-box;transform-origin:center;animation:ad-pop 4.2s cubic-bezier(.22,1,.36,1) infinite}
@keyframes ad-pop{0%,50%{transform:scale(0)}60%,88%{transform:scale(1)}100%{transform:scale(0)}}
.ad-grow{transform-box:fill-box;transform-origin:center;animation:ad-grow 4.2s cubic-bezier(.23,1,.32,1) infinite}
@keyframes ad-grow{0%{transform:scaleY(.05);opacity:0}12%,80%{transform:scaleY(1);opacity:1}92%,100%{transform:scaleY(.05);opacity:0}}
.ad-slice{animation:ad-slice 2.6s ease-in-out infinite}
@keyframes ad-slice{0%,100%{transform:translate(0,0)}50%{transform:translate(5px,-7px)}}
.ad-needle{transform-box:view-box;transform-origin:75px 70px;animation:ad-needle 5s cubic-bezier(.45,0,.2,1) infinite}
@keyframes ad-needle{0%{transform:rotate(0)}18%{transform:rotate(-68deg)}38%{transform:rotate(64deg)}56%{transform:rotate(-30deg)}70%,100%{transform:rotate(0)}}
.ad-spin-back{transform-box:view-box;transform-origin:36px 44px;animation:ad-spin-back 4.2s linear infinite}
@keyframes ad-spin-back{to{transform:rotate(-360deg)}}
.ad-blink{animation:ad-blink 1s steps(1) infinite}
@keyframes ad-blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){
.city-bulb,.city-dash,.city-car-right,.city-car-left,.city-blink,.city-sway,.city-ripple,.city-board,.city-pulse,.ad-draw,.ad-rewind,.ad-dot,.ad-pop,.ad-grow,.ad-slice,.ad-needle,.ad-spin-back,.ad-blink{animation:none!important}
.city-vault{transition:none}
}
`

const catmullRom = (points: Point[]): string => {
  if (points.length < 2) return ''
  let d = `M${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    d += ` C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(media.matches)
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return reduced
}

const Tree: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 16 }) => (
  <g>
    <ellipse cx={x + 3} cy={y + r * 0.7} rx={r * 0.9} ry={r * 0.35} fill="var(--shade)" />
    <circle cx={x} cy={y} r={r} fill="var(--tree-2)" />
    <circle cx={x - r * 0.25} cy={y - r * 0.25} r={r * 0.72} fill="var(--tree)" />
  </g>
)

const Lamp: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 1.5} y={y - 26} width="3" height="26" rx="1.5" fill="var(--asphalt-edge)" />
    <circle cx={x} cy={y - 28} r="5" fill="var(--window-lit)" />
    <circle cx={x} cy={y - 28} r="10" fill="var(--window-lit)" opacity="0.18" />
  </g>
)

const Building: React.FC<{ x: number; y: number; w: number; h: number; roof?: string; seed: number }> = ({ x, y, w, h, roof = 'var(--roof)', seed }) => {
  const cols = Math.max(2, Math.floor((w - 10) / 13))
  const rows = Math.max(2, Math.floor((h - 18) / 16))
  return (
    <g>
      <rect x={x + 5} y={y - h + 6} width={w} height={h} fill="var(--shade)" rx="3" />
      <rect x={x} y={y - h} width={w} height={h} fill="var(--wall)" stroke="var(--wall-2)" strokeWidth="2" rx="3" />
      <rect x={x - 2} y={y - h - 6} width={w + 4} height="8" rx="2" fill={roof} />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const lit = (r * 7 + c * 3 + seed) % 5 === 0
          return (
            <rect
              key={`${r}-${c}`}
              x={x + 6 + c * ((w - 12) / cols)}
              y={y - h + 8 + r * 16}
              width={(w - 12) / cols - 4}
              height="9"
              rx="1.5"
              fill={lit ? 'var(--window-lit)' : 'var(--window)'}
              className={(r + c + seed) % 6 === 0 ? 'city-blink' : undefined}
              style={{ animationDelay: `${(r + c) * 0.6}s` }}
            />
          )
        }),
      )}
      <rect x={x + w / 2 - 7} y={y - 14} width="14" height="14" rx="2" fill="var(--wall-2)" />
    </g>
  )
}

const Stall: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g>
    <rect x={x + 4} y={y - 30} width="54" height="34" fill="var(--shade)" rx="3" />
    <rect x={x} y={y - 34} width="54" height="34" fill="var(--wall)" stroke="var(--wall-2)" strokeWidth="2" rx="3" />
    <path d={`M${x - 4} ${y - 34} L${x + 58} ${y - 34} L${x + 52} ${y - 48} L${x + 2} ${y - 48} Z`} fill={color} />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${x + 4 + i * 14} ${y - 48} l-4 14 h8 l3 -14 Z`} fill="#fff" opacity="0.75" />
    ))}
    <rect x={x + 6} y={y - 20} width="42" height="8" rx="2" fill="var(--wall-2)" />
    {[0, 1, 2, 3, 4].map((i) => (
      <circle key={i} cx={x + 10 + i * 8.5} cy={y - 22} r="3.4" fill={['#e4572e', '#f2c14e', '#7a9e3d', '#f2a541', '#c0397a'][i]} />
    ))}
  </g>
)

const PriceBoard: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x + 22} y={y - 22} width="4" height="22" fill="var(--asphalt-edge)" />
    <rect x={x} y={y - 62} width="48" height="42" rx="4" fill="#1f2733" stroke="var(--asphalt-edge)" strokeWidth="2" />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect
        key={i}
        x={x + 6 + i * 8}
        y={y - 52}
        width="5"
        height="24"
        rx="1"
        fill={i % 2 === 0 ? '#4ade80' : '#f87171'}
        className="city-board"
        style={{ animationDelay: `${i * 0.5}s` }}
      />
    ))}
  </g>
)

const ExchangeHouse: React.FC<{ x: number; y: number; seed: number }> = ({ x, y, seed }) => (
  <g>
    <Building x={x} y={y} w={70} h={58} roof="#2e86ab" seed={seed} />
    <rect x={x + 6} y={y - 76} width="58" height="16" rx="3" fill="#2e86ab" />
    <text x={x + 35} y={y - 64.5} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Archivo, system-ui, sans-serif">
      CAMBIO
    </text>
  </g>
)

const Fountain: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y} r="44" fill="var(--walk)" stroke="var(--walk-edge)" strokeWidth="3" />
    <circle cx={x} cy={y} r="26" fill="var(--water)" stroke="var(--walk-edge)" strokeWidth="3" />
    <circle cx={x} cy={y} r="18" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" className="city-ripple" />
    <circle cx={x} cy={y} r="18" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" className="city-ripple" style={{ animationDelay: '1.3s' }} />
    <circle cx={x} cy={y} r="5" fill="var(--wall)" />
    {[0, 90, 180, 270].map((a) => (
      <Tree key={a} x={x + Math.cos((a * Math.PI) / 180) * 56} y={y + Math.sin((a * Math.PI) / 180) * 56} r={11} />
    ))}
  </g>
)

const Bolsa: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x + 5} y={y - 64} width="120" height="66" fill="var(--shade)" rx="3" />
    <rect x={x - 6} y={y - 8} width="132" height="10" rx="2" fill="var(--wall-2)" />
    <rect x={x} y={y - 60} width="120" height="52" fill="var(--wall)" stroke="var(--wall-2)" strokeWidth="2" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={x + 8 + i * 19} y={y - 56} width="8" height="46" rx="2" fill="var(--wall-2)" />
    ))}
    <path d={`M${x - 6} ${y - 60} L${x + 60} ${y - 92} L${x + 126} ${y - 60} Z`} fill="var(--wall)" stroke="var(--wall-2)" strokeWidth="2" />
    <text x={x + 60} y={y - 66} textAnchor="middle" fontSize="11" fontWeight="900" fill="var(--ink)" fontFamily="Archivo, system-ui, sans-serif">
      BOLSA
    </text>
  </g>
)

const Bank: React.FC<{ x: number; y: number; isOpen: boolean }> = ({ x, y, isOpen }) => (
  <g className={isOpen ? 'city-vault-open' : ''}>
    <rect x={x - 150} y={y - 8} width="300" height="14" rx="3" fill="var(--wall-2)" />
    <rect x={x - 140} y={y - 120} width="280" height="112" fill="var(--wall)" stroke="var(--wall-2)" strokeWidth="3" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <rect key={i} x={x - 130 + i * 35} y={y - 114} width="12" height="104" rx="3" fill="var(--wall-2)" />
    ))}
    <path d={`M${x - 156} ${y - 120} L${x} ${y - 172} L${x + 156} ${y - 120} Z`} fill="var(--wall)" stroke="var(--wall-2)" strokeWidth="3" />
    <text x={x} y={y - 128} textAnchor="middle" fontSize="15" fontWeight="900" fill="var(--ink)" fontFamily="Archivo, system-ui, sans-serif">
      BANCO CENTRAL
    </text>
    <circle cx={x} cy={y - 52} r="40" fill="var(--asphalt-edge)" />
    <g className="city-vault">
      <circle cx={x} cy={y - 52} r="34" fill="var(--ink)" />
      <circle cx={x} cy={y - 52} r="26" fill="none" stroke="var(--surface)" strokeOpacity="0.5" strokeWidth="2" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <rect key={a} x={x - 2.5} y={y - 80} width="5" height="16" rx="2.5" fill="var(--surface)" transform={`rotate(${a} ${x} ${y - 52})`} />
      ))}
      <circle cx={x} cy={y - 52} r="8" fill="#E3A92F" />
    </g>
  </g>
)

const PapelPicado: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <path d={`M0 ${y} Q${W / 2} ${y + 26} ${W} ${y}`} fill="none" stroke="var(--asphalt-edge)" strokeWidth="1.5" />
    {Array.from({ length: 14 }).map((_, i) => {
      const t = (i + 0.5) / 14
      const px = t * W
      const py = y + 26 * 4 * t * (1 - t) * 0.5 * 2
      return (
        <g key={i} className="city-sway" style={{ animationDelay: `${i * 0.2}s` }}>
          <path d={`M${px - 13} ${py} h26 v22 l-4 4 l-4 -4 l-5 4 l-4 -4 l-5 4 l-4 -4 Z`} fill={STALL_COLORS[i % STALL_COLORS.length]} />
          <circle cx={px} cy={py + 10} r="3" fill="#fff" opacity="0.6" />
        </g>
      )
    })}
  </g>
)

const Car: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <rect x="-17" y="-9" width="34" height="18" rx="6" fill={color} stroke="rgba(0,0,0,.25)" strokeWidth="1.2" />
    <rect x="-6" y="-7" width="13" height="14" rx="3" fill="rgba(20,30,45,.55)" />
    <rect x="13" y="-7" width="3" height="4" rx="1" fill="#fff6c2" />
    <rect x="13" y="3" width="3" height="4" rx="1" fill="#fff6c2" />
  </g>
)


const RANGE_PATH = 'M8 52 L28 20 L46 62 L66 22 L84 64 L104 20 L122 62 L142 34'

const lineProps = (color: string, width = 3) => ({
  fill: 'none',
  stroke: color,
  strokeWidth: width,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  pathLength: 1,
})

const CheckBadge: React.FC<{ x: number; y: number; skin: AdSkin }> = ({ x, y, skin }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className="ad-pop">
      <circle r="9" fill={skin.accent} />
      <path d="M-4 0 L-1 3 L4.5 -3.5" fill="none" stroke={skin.bg} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </g>
)

const AdScene: React.FC<{ scene: TrailScene; skin: AdSkin }> = ({ scene, skin }) => {
  const soft = { fill: skin.fg, opacity: 0.16 }
  switch (scene) {
    case 'company':
      return (
        <>
          <circle cx="44" cy="44" r="24" fill={skin.fg} opacity="0.16" stroke={skin.fg} strokeWidth="2" />
          <path d="M44 44 L44 20 A24 24 0 0 1 64.8 32 Z" fill={skin.fg} opacity="0.35" />
          <g className="ad-slice">
            <path d="M44 44 L44 20 A24 24 0 0 1 64.8 32 Z" fill={skin.accent} stroke={skin.bg} strokeWidth="1.5" />
          </g>
          <path d="M86 26 L109 11 L132 26 Z" fill={skin.fg} />
          <rect x="90" y="26" width="38" height="4" fill={skin.fg} opacity="0.7" />
          {[94, 104, 114, 124].map((x) => (
            <rect key={x} x={x - 2.5} y="32" width="5" height="32" rx="1" fill={skin.fg} />
          ))}
          <rect x="86" y="64" width="46" height="5" rx="1" fill={skin.fg} />
          <circle cx="109" cy="20" r="2.6" fill={skin.accent} className="ad-blink" />
        </>
      )
    case 'candles': {
      const candles = [
        { y: 46, h: 18, up: true },
        { y: 40, h: 14, up: false },
        { y: 34, h: 20, up: true },
        { y: 30, h: 12, up: true },
        { y: 32, h: 14, up: false },
        { y: 18, h: 22, up: true },
      ]
      return (
        <>
          <line x1="8" y1="72" x2="142" y2="72" stroke={skin.fg} strokeWidth="1.5" opacity="0.35" />
          {candles.map((c, i) => {
            const x = 22 + i * 21
            const color = c.up ? skin.up : skin.down
            return (
              <g key={i} className="ad-grow" style={{ animationDelay: `${i * 0.22}s` }}>
                <line x1={x} y1={c.y - 7} x2={x} y2={c.y + c.h + 7} stroke={color} strokeWidth="2" strokeLinecap="round" />
                <rect x={x - 6} y={c.y} width="12" height={c.h} rx="2" fill={color} />
              </g>
            )
          })}
        </>
      )
    }
    case 'range':
      return (
        <>
          <rect x="4" y="10" width="142" height="8" fill={skin.down} opacity="0.22" />
          <rect x="4" y="64" width="142" height="8" fill={skin.up} opacity="0.22" />
          <line x1="4" y1="18" x2="146" y2="18" stroke={skin.down} strokeWidth="2" strokeDasharray="5 4" />
          <line x1="4" y1="64" x2="146" y2="64" stroke={skin.up} strokeWidth="2" strokeDasharray="5 4" />
          <path d={RANGE_PATH} {...lineProps(skin.fg)} className="ad-draw" />
          <circle r="5" fill={skin.accent} stroke={skin.bg} strokeWidth="1.5" className="ad-dot" style={{ offsetPath: `path('${RANGE_PATH}')` }} />
        </>
      )
    case 'stoploss':
      return (
        <>
          <line x1="4" y1="60" x2="146" y2="60" stroke={skin.down} strokeWidth="2" strokeDasharray="5 4" />
          <path d="M98 60 L114 70 L128 66 L144 80" fill="none" stroke={skin.fg} strokeWidth="2" strokeDasharray="3 4" opacity="0.35" strokeLinecap="round" />
          <path d="M8 40 L26 28 L42 34 L60 18 L76 30 L98 60" {...lineProps(skin.fg)} className="ad-draw" />
          <g transform="translate(98 60)">
            <g className="ad-pop">
              <path d="M0 -13 L11 -8.5 V0 C11 7 6 11 0 14 C-6 11 -11 7 -11 0 V-8.5 Z" fill={skin.accent} stroke={skin.bg} strokeWidth="1.5" />
              <path d="M-4.5 0 L-1 3.5 L5 -3.5" fill="none" stroke={skin.bg} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        </>
      )
    case 'emotions':
      return (
        <>
          <path d="M29 70 A46 46 0 0 1 48.6 32.3" fill="none" stroke={skin.down} strokeWidth="10" strokeLinecap="round" />
          <path d="M52 30.2 A46 46 0 0 1 98 30.2" fill="none" stroke={skin.accent} strokeWidth="10" strokeLinecap="round" />
          <path d="M101.4 32.3 A46 46 0 0 1 121 70" fill="none" stroke={skin.up} strokeWidth="10" strokeLinecap="round" />
          <g className="ad-needle">
            <path d="M72.5 70 L75 30 L77.5 70 Z" fill={skin.fg} />
          </g>
          <circle cx="75" cy="70" r="6" fill={skin.fg} />
          <circle cx="75" cy="70" r="2.4" fill={skin.bg} />
        </>
      )
    case 'orders':
      return (
        <>
          <line x1="4" y1="52" x2="146" y2="52" stroke={skin.accent} strokeWidth="2" strokeDasharray="5 4" />
          <path d="M128 45 H144 V59 H128 L121 52 Z" fill={skin.accent} />
          <circle cx="128" cy="52" r="2" fill={skin.bg} />
          <path d="M8 22 L24 30 L38 24 L56 40 L72 34 L92 52 L106 38 L118 26" {...lineProps(skin.fg)} className="ad-draw" />
          <CheckBadge x={92} y={52} skin={skin} />
        </>
      )
    case 'simulator':
      return (
        <>
          <rect x="24" y="6" width="102" height="60" rx="5" fill={skin.fg} opacity="0.12" stroke={skin.fg} strokeWidth="2.5" />
          {[22, 36, 50].map((y) => (
            <line key={y} x1="30" y1={y} x2="120" y2={y} stroke={skin.fg} strokeWidth="1" opacity="0.2" />
          ))}
          <rect x="68" y="66" width="14" height="8" fill={skin.fg} />
          <rect x="56" y="74" width="38" height="4" rx="2" fill={skin.fg} />
          <path d="M32 56 L46 50 L58 53 L72 40 L84 44 L98 28 L110 31 L118 16" {...lineProps(skin.up)} className="ad-draw" />
          <circle cx="118" cy="16" r="3.5" fill={skin.accent} className="ad-blink" />
        </>
      )
    case 'backtest':
      return (
        <>
          <circle cx="36" cy="44" r="24" {...soft} />
          <circle cx="36" cy="44" r="24" fill="none" stroke={skin.fg} strokeWidth="2.5" />
          {[0, 90, 180, 270].map((deg) => (
            <line key={deg} x1="36" y1="23" x2="36" y2="27" stroke={skin.fg} strokeWidth="2" strokeLinecap="round" transform={`rotate(${deg} 36 44)`} />
          ))}
          <line x1="36" y1="44" x2="36" y2="32" stroke={skin.fg} strokeWidth="2.5" strokeLinecap="round" />
          <g className="ad-spin-back">
            <line x1="36" y1="44" x2="36" y2="26" stroke={skin.accent} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <circle cx="36" cy="44" r="3" fill={skin.fg} />
          <path d="M8 30 A30 30 0 0 1 22 16" fill="none" stroke={skin.accent} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4 26 L8 32 L14 27" fill="none" stroke={skin.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="70" y1="72" x2="146" y2="72" stroke={skin.fg} strokeWidth="1.5" opacity="0.35" />
          <path d="M72 60 L84 52 L94 56 L106 40 L118 46 L130 30 L142 22" {...lineProps(skin.fg)} className="ad-rewind" />
        </>
      )
  }
}

const Billboard: React.FC<{ scene: TrailScene; isLocked: boolean; skinIndex: number }> = ({ scene, isLocked, skinIndex }) => {
  const skin = AD_SKINS[skinIndex % AD_SKINS.length]
  return (
    <div className="flex w-[168px] flex-col items-center" aria-hidden="true">
      <div className="relative w-full rounded-lg p-1.5" style={{ background: '#2a2f3a', boxShadow: '0 14px 24px -14px rgba(0,0,0,.7)' }}>
        <div className="pointer-events-none absolute inset-x-2 -top-1 flex justify-between">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="city-bulb h-1.5 w-1.5 rounded-full" style={{ background: '#ffe9a8', animationDelay: `${(i % 2) * 0.6}s` }}></span>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-md" style={{ background: skin.bg }}>
          <svg viewBox="0 0 150 84" className="block h-auto w-full">
            <AdScene scene={scene} skin={skin} />
          </svg>
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'repeating-linear-gradient(135deg, rgba(20,24,32,.84) 0 10px, rgba(20,24,32,.72) 10px 20px)' }}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffd23f] text-[#1b1b1b] shadow-lg">
                <i className="fa-solid fa-lock text-sm"></i>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full justify-around">
        <span className="h-7 w-1.5 bg-[#4b5563]"></span>
        <span className="h-7 w-1.5 bg-[#4b5563]"></span>
      </div>
    </div>
  )
}

const CityStreet: React.FC<{ sy: number; index: number; reduced: boolean }> = ({ sy, index, reduced }) => (
  <g>
    <rect x="0" y={sy - 30} width={W} height="60" fill="var(--walk)" />
    <rect x="0" y={sy - 21} width={W} height="42" fill="var(--asphalt)" />
    <line x1="0" x2={W} y1={sy} y2={sy} stroke="var(--lane)" strokeWidth="2.5" strokeDasharray="16 14" />
    {!reduced && (
      <>
        <g className="city-car-right" style={{ ['--car-dur' as string]: `${12 + index * 3}s`, animationDelay: `${-index * 4}s` } as React.CSSProperties}>
          <g transform={`translate(0 ${sy + 10})`}>
            <Car color={CAR_COLORS[index % CAR_COLORS.length]} />
          </g>
        </g>
        <g className="city-car-left" style={{ ['--car-dur' as string]: `${15 + index * 2}s`, animationDelay: `${-index * 6 - 3}s` } as React.CSSProperties}>
          <g transform={`translate(0 ${sy - 10})`}>
            <Car color={CAR_COLORS[(index + 2) % CAR_COLORS.length]} />
          </g>
        </g>
      </>
    )}
  </g>
)

const CityCrossing: React.FC<{ rx: number; sy: number }> = ({ rx, sy }) => (
  <g>
    {[-1, 1].map((side) =>
      Array.from({ length: 6 }).map((_, k) => <rect key={`${side}-${k}`} x={rx + side * 42 - 3} y={sy - 18 + k * 7} width="12" height="4" fill="var(--lane)" opacity="0.85" />),
    )}
  </g>
)

const CITY_KIT: WorldKit = {
  districts: DISTRICT_NAMES,
  stageColor: '#0f5c3a',
  finaleLabel: 'La bóveda del Banco Central',
  lane: { width: 3.5, dash: '14 14', opacity: 1 },
  Tree,
  Stall,
  Plaza: Fountain,
  Duo: ({ x, base, seed }) => (
    <g>
      <ExchangeHouse x={x - 72} y={base} seed={seed} />
      <PriceBoard x={x + 14} y={base} />
    </g>
  ),
  Block: ({ x, base, seed }) => (
    <g>
      <Building x={x - 80} y={base} w={46} h={98} roof="#2e86ab" seed={seed} />
      <Building x={x - 28} y={base} w={56} h={118} seed={seed + 3} />
      <Building x={x + 34} y={base} w={44} h={84} roof="#7a5ea8" seed={seed + 5} />
    </g>
  ),
  Landmark: ({ x, base }) => <Bolsa x={x - 60} y={base} />,
  Finale: Bank,
  Garland: PapelPicado,
  Lamp,
  Filler: ({ cx, cy, seed }) => (
    <g>
      <rect x={cx - 34} y={cy - 28} width="68" height="56" rx="8" fill="var(--walk)" stroke="var(--walk-edge)" strokeWidth="2" />
      <rect x={cx - 24} y={cy - 18} width="26" height="22" rx="3" fill={ROOF_TONES[seed % ROOF_TONES.length]} opacity="0.85" />
      <rect x={cx + 4} y={cy - 18} width="20" height="30" rx="3" fill={ROOF_TONES[(seed + 2) % ROOF_TONES.length]} opacity="0.85" />
      <rect x={cx - 24} y={cy + 8} width="26" height="10" rx="2" fill="var(--grass-2)" />
    </g>
  ),
  Street: CityStreet,
  Crossing: CityCrossing,
  Vehicle: Car,
}

const WORLD_KITS: Record<LearnWorld, WorldKit> = { city: CITY_KIT, candles: CANDLES_KIT, island: ISLAND_KIT }

export const TradingTrailMap: React.FC<TradingTrailMapProps> = ({ lessons, stages, statusOf, onOpenLesson, isCourseDone, completedCount, world = 'city' }) => {
  const kit = WORLD_KITS[world] || CITY_KIT
  const reducedMotion = usePrefersReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startY: number; startTop: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const observer = new ResizeObserver(([entry]) => setIsCompact(entry.contentRect.width < 520))
    observer.observe(scroller)
    return () => observer.disconnect()
  }, [])

  const points: Point[] = lessons.map((lesson, i) => ({
    x: W / 2 + ROAD_X_AMPLITUDE * Math.sin(i * 1.1 + 0.15),
    y: FIRST_Y + i * STEP + lesson.stageIndex * STAGE_GAP,
  }))
  const lastY = points[points.length - 1]?.y ?? FIRST_Y
  const bankY = lastY + 330
  const H = bankY + 70
  const roadPoints = [{ x: W / 2, y: 40 }, { x: W / 2, y: 150 }, ...points, { x: W / 2, y: bankY - 60 }]
  const roadPath = catmullRom(roadPoints)

  const currentIndex = lessons.findIndex((_, i) => statusOf(i) === 'current')
  const reachedIndex = isCourseDone ? lessons.length - 1 : currentIndex
  const progressPath = reachedIndex >= 0 ? catmullRom([{ x: W / 2, y: 40 }, { x: W / 2, y: 150 }, ...points.slice(0, reachedIndex + 1)]) : ''

  const stageStarts = stages.map((_, s) => lessons.findIndex((lesson) => lesson.stageIndex === s))
  const streetYs = points.slice(0, -1).map((p, i) => (p.y + points[i + 1].y) / 2).filter((_, i) => i % 2 === 0)
  const stageTwoTop = (points[stageStarts[1]]?.y ?? H) - 160

  const roadXAt = (y: number) => {
    const all = roadPoints
    for (let i = 0; i < all.length - 1; i++) {
      if (y >= all[i].y && y <= all[i + 1].y) {
        const t = (y - all[i].y) / (all[i + 1].y - all[i].y || 1)
        return all[i].x + (all[i + 1].x - all[i].x) * t
      }
    }
    return W / 2
  }

  const pct = (value: number, total: number) => `${(value / total) * 100}%`

  useLayoutEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const target = reachedIndex >= 0 ? points[reachedIndex].y : FIRST_Y
    const ratio = target / H
    scroller.scrollTop = Math.max(0, ratio * scroller.scrollHeight - scroller.clientHeight / 2)
  }, [reachedIndex, H])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { startY: event.clientY, startTop: scrollRef.current?.scrollTop ?? 0, moved: false }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    const scroller = scrollRef.current
    if (!state || !scroller) return
    const delta = event.clientY - state.startY
    if (!state.moved && Math.abs(delta) > 5) {
      state.moved = true
      setIsDragging(true)
      setShowHint(false)
    }
    if (state.moved) scroller.scrollTop = state.startTop - delta
  }

  const endDrag = () => {
    if (drag.current?.moved) {
      suppressClick.current = true
      window.setTimeout(() => {
        suppressClick.current = false
      }, 0)
    }
    drag.current = null
    setIsDragging(false)
  }

  const handleOpen = (index: number) => {
    if (suppressClick.current) return
    onOpenLesson(index)
  }

  const scrollToCurrent = () => {
    const scroller = scrollRef.current
    if (!scroller) return
    const target = reachedIndex >= 0 ? points[reachedIndex].y : FIRST_Y
    scroller.scrollTo({ top: Math.max(0, (target / H) * scroller.scrollHeight - scroller.clientHeight / 2), behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  const scenery: React.ReactNode[] = []
  const occupied: { x1: number; y1: number; x2: number; y2: number }[] = []
  const occupy = (cx: number, cy1: number, cy2: number, halfWidth = 95) => occupied.push({ x1: cx - halfWidth, y1: cy1, x2: cx + halfWidth, y2: cy2 })
  points.forEach((point, i) => {
    const next = points[i + 1]
    const lampX = point.x < W / 2 ? point.x + 58 : point.x - 58
    scenery.push(<kit.Lamp key={`l${i}`} x={lampX} y={point.y + 52} />)
    if (!next) return
    const midY = (point.y + next.y) / 2
    const hasStreet = i % 2 === 0
    const roadX = roadXAt(midY)
    const leftSpace = roadX - 60
    const rightStart = roadX + 60
    const mainOnLeft = leftSpace > W - rightStart
    const mainCenter = mainOnLeft ? leftSpace / 2 : (rightStart + W) / 2
    const sideCenter = mainOnLeft ? (rightStart + W) / 2 : leftSpace / 2
    const sideWidth = mainOnLeft ? W - rightStart : leftSpace
    const isStageOne = lessons[i].stageIndex === 0
    const sameStage = next && lessons[i + 1].stageIndex === lessons[i].stageIndex
    if (!sameStage) return
    if (hasStreet) {
      const base = midY + 80
      occupy(mainCenter, base - 60, base + 6)
      if (isStageOne) {
        scenery.push(
          <g key={`s${i}`}>
            <kit.Stall x={mainCenter - 62} y={base} color={STALL_COLORS[i % 5]} />
            <kit.Stall x={mainCenter + 8} y={base} color={STALL_COLORS[(i + 2) % 5]} />
          </g>,
        )
      } else {
        scenery.push(
          <g key={`s${i}`}>
            <kit.Tree x={mainCenter - 40} y={base - 22} r={16} />
            <kit.Tree x={mainCenter} y={base - 18} r={13} />
            <kit.Tree x={mainCenter + 40} y={base - 22} r={16} />
          </g>,
        )
      }
      if (sideWidth > 90) scenery.push(<kit.Tree key={`t${i}`} x={sideCenter} y={midY - 52} r={14} />)
      return
    }
    const base = midY + 55
    const kind = Math.floor(i / 2) % 2
    occupy(mainCenter, midY - 75, base + 8)
    if (isStageOne) {
      if (kind === 0) {
        scenery.push(<kit.Plaza key={`s${i}`} x={mainCenter} y={midY - 6} />)
      } else {
        scenery.push(<kit.Duo key={`s${i}`} x={mainCenter} base={base} seed={i} />)
      }
    } else if (kind === 0) {
      scenery.push(<kit.Block key={`s${i}`} x={mainCenter} base={base} seed={i} />)
    } else {
      scenery.push(<kit.Landmark key={`s${i}`} x={mainCenter} base={base} />)
    }
    if (sideWidth > 90) {
      scenery.push(<kit.Tree key={`t${i}a`} x={sideCenter - 18} y={midY - 24} r={15} />)
      scenery.push(<kit.Tree key={`t${i}b`} x={sideCenter + 20} y={midY + 20} r={12} />)
    }
  })

  const fillers: React.ReactNode[] = []
  const CELL_W = 86
  const CELL_H = 84
  for (let row = 0; row * CELL_H < bankY - 200; row++) {
    for (let col = 0; col * CELL_W < W; col++) {
      const cx = col * CELL_W + CELL_W / 2 + (row % 2 ? 18 : 0)
      const cy = 210 + row * CELL_H
      if (cx > W - 20) continue
      if (Math.abs(cx - roadXAt(cy)) < 100) continue
      if (streetYs.some((sy) => Math.abs(sy - cy) < 62)) continue
      if (occupied.some((o) => cx > o.x1 - 30 && cx < o.x2 + 30 && cy > o.y1 - 40 && cy < o.y2 + 40)) continue
      if (points.some((p2) => Math.abs(p2.y - cy) < 46 && Math.abs(p2.x - cx) < 250)) continue
      const seed = row * 7 + col * 3
      if (seed % 5 === 0) {
        fillers.push(
          <g key={`f${row}-${col}`}>
            <kit.Tree x={cx - 14} y={cy - 8} r={13} />
            <kit.Tree x={cx + 16} y={cy + 10} r={11} />
          </g>,
        )
        continue
      }
      fillers.push(<kit.Filler key={`f${row}-${col}`} cx={cx} cy={cy} seed={seed} />)
    }
  }

  return (
    <div data-world={world} className="city-map relative h-full overflow-hidden rounded-[28px] border border-[var(--rule)] bg-[var(--grass)]">
      <style>{CITY_STYLES}</style>
      <style>{WORLD_STYLES}</style>
      <div
        ref={scrollRef}
        className={`city-scroll absolute inset-0 overflow-y-auto overscroll-contain ${isDragging ? 'is-dragging' : 'cursor-grab'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onScroll={() => setShowHint(false)}
      >
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <rect width={W} height={H} fill="var(--grass)" />
            <rect y={stageTwoTop} width={W} height={H - stageTwoTop} fill="var(--grass-2)" />
            {kit.Backdrop && <kit.Backdrop h={H} reduced={reducedMotion} />}
            {Array.from({ length: Math.ceil(H / 120) }).map((_, row) =>
              Array.from({ length: 6 }).map((__, col) => (
                <circle key={`g${row}-${col}`} cx={col * 110 + (row % 2) * 55 + 20} cy={row * 120 + 40} r="2" fill="var(--tree)" opacity="0.35" />
              )),
            )}
            {streetYs.map((sy, i) => (
              <kit.Street key={`street${i}`} sy={sy} index={i} reduced={reducedMotion} />
            ))}

            <path d={roadPath} fill="none" stroke="var(--walk)" strokeWidth="92" strokeLinecap="round" strokeLinejoin="round" />
            <path d={roadPath} fill="none" stroke="var(--walk-edge)" strokeWidth="70" strokeLinecap="round" strokeLinejoin="round" />
            <path d={roadPath} fill="none" stroke="var(--asphalt)" strokeWidth="64" strokeLinecap="round" strokeLinejoin="round" />
            {progressPath && <path d={progressPath} fill="none" stroke="var(--ink)" strokeOpacity="0.55" strokeWidth="64" strokeLinecap="round" strokeLinejoin="round" />}
            <path d={roadPath} fill="none" stroke="var(--lane)" strokeWidth={kit.lane.width} strokeOpacity={kit.lane.opacity} strokeDasharray={kit.lane.dash} strokeLinecap={kit.lane.width > 10 ? 'butt' : 'round'} className={kit.lane.width > 10 ? undefined : 'city-dash'} />
            {streetYs.map((sy, i) => (
              <kit.Crossing key={`cross${i}`} rx={roadXAt(sy)} sy={sy} />
            ))}

            {!reducedMotion && (
              <g>
                <kit.Vehicle color={CAR_COLORS[1]} />
                <animateMotion dur="26s" repeatCount="indefinite" rotate="auto" path={roadPath} />
              </g>
            )}
            {!reducedMotion && (
              <g>
                <kit.Vehicle color={CAR_COLORS[2]} />
                <animateMotion dur="26s" begin="-13s" repeatCount="indefinite" rotate="auto" path={roadPath} />
              </g>
            )}

            {fillers}
            {scenery}

            <kit.Garland y={92} />
            <kit.Tree x={90} y={170} r={20} />
            <kit.Tree x={510} y={180} r={18} />
            <kit.Stall x={60} y={260} color={STALL_COLORS[3]} />
            <kit.Stall x={486} y={250} color={STALL_COLORS[0]} />

            <kit.Finale x={W / 2} y={bankY} isOpen={isCourseDone} />
            {world === 'city' && <kit.Tree x={90} y={bankY - 30} r={22} />}
            {world === 'city' && <kit.Tree x={510} y={bankY - 30} r={22} />}
            {kit.Front && <kit.Front h={H} reduced={reducedMotion} />}
          </svg>

          {stages.map((stage, s) => {
            const first = points[stageStarts[s]]
            if (!first) return null
            const stageLessons = lessons.map((lesson, i) => ({ lesson, i })).filter((item) => item.lesson.stageIndex === s)
            const done = stageLessons.filter((item) => statusOf(item.i) === 'completed').length
            return (
              <div key={stage.title} className="absolute left-1/2 z-10 w-[min(86%,380px)] -translate-x-1/2 -translate-y-1/2" style={{ top: pct(first.y - (s === 0 ? 150 : 140), H) }}>
                <div style={{ background: kit.stageColor }} className="flex items-center gap-3 rounded-2xl border-[3px] border-white/80 px-4 py-2.5 text-white shadow-[0_12px_24px_-14px_rgba(0,0,0,.6)]">
                  <span className="note-display note-num flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-base font-black" style={{ color: kit.stageColor }}>
                    {String(s + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="note-wide block text-[10px] font-extrabold opacity-85">{`Tema ${s + 1}${kit.districts[s] ? ` · ${kit.districts[s]}` : ''}`.toUpperCase()}</span>
                    <span className="note-display block text-base font-black leading-tight sm:text-lg">{stage.title}</span>
                  </span>
                  <span className="note-num text-sm font-bold opacity-90">
                    {done}/{stageLessons.length}
                  </span>
                </div>
              </div>
            )
          })}

          {points.map((point, i) => {
            const status = statusOf(i)
            const isCurrent = status === 'current'
            const isLocked = status === 'locked'
            const size = isCurrent ? (isCompact ? 60 : 84) : isCompact ? 46 : 66
            const labelOnLeft = point.x >= W / 2
            const left = pct(point.x, W)
            const top = pct(point.y, H)
            return (
              <React.Fragment key={lessons[i].title}>
                {isCurrent && (
                  <span className="city-pulse pointer-events-none absolute z-10 rounded-full bg-[var(--ink)]" style={{ left, top, width: size, height: size }} aria-hidden="true"></span>
                )}
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleOpen(i)}
                  aria-label={`Lección ${lessons[i].code || i + 1}: ${lessons[i].title}. ${status === 'completed' ? 'Completada' : isCurrent ? 'Siguiente lección' : status === 'available' ? 'Disponible' : 'Bloqueada'}`}
                  className="city-node absolute z-20 flex items-center justify-center rounded-full disabled:cursor-not-allowed"
                  style={{
                    left,
                    top,
                    width: size,
                    height: size,
                    transform: 'translate(-50%, -50%)',
                    background: isLocked ? '#c7ccd4' : status === 'available' ? '#ffffff' : 'var(--ink)',
                    color: isLocked ? '#6b7280' : status === 'available' ? 'var(--ink)' : 'var(--bg)',
                    border: `${isCompact ? 3 : 5}px solid ${isLocked ? '#e5e7eb' : '#ffffff'}`,
                    boxShadow: isLocked
                      ? 'inset 0 -5px 0 rgba(0,0,0,.12), 0 8px 16px -10px rgba(0,0,0,.5)'
                      : 'inset 0 -7px 0 rgba(0,0,0,.22), 0 14px 22px -12px rgba(0,0,0,.6)',
                  }}
                >
                  {status === 'completed' && <i className="fa-solid fa-check text-2xl"></i>}
                  {isCurrent && <i className={`fa-solid fa-play ${isCompact ? 'text-xl' : 'text-3xl'}`}></i>}
                  {status === 'available' && <span className={`note-display note-num font-black ${isCompact ? 'text-base' : 'text-xl'}`}>{lessons[i].code || i + 1}</span>}
                  {isLocked && <i className="fa-solid fa-lock text-lg"></i>}
                  {status === 'completed' && (
                    <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-0.5 rounded-full bg-white px-1.5 py-0.5" aria-hidden="true">
                      {[0, 1, 2].map((c) => (
                        <i key={c} className="fa-solid fa-star text-[10px] text-[#E3A92F]"></i>
                      ))}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isLocked}
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={() => handleOpen(i)}
                  className={`absolute z-10 -translate-y-1/2 rounded-xl border-2 text-left ${isCompact ? 'w-[40%] px-2 py-1.5' : 'w-[min(36%,210px)] px-3 py-2'} shadow-[0_10px_20px_-14px_rgba(0,0,0,.6)] disabled:cursor-not-allowed ${
                    isCurrent ? 'border-[var(--ink)] bg-white' : 'border-white/70 bg-white/90'
                  } ${labelOnLeft ? 'text-right' : ''}`}
                  style={{
                    top,
                    ...(labelOnLeft ? { right: `calc(${100 - (point.x / W) * 100}% + ${size / 2 + 10}px)` } : { left: `calc(${(point.x / W) * 100}% + ${size / 2 + 10}px)` }),
                  }}
                >
                  <span className={`note-num block ${isCompact ? 'text-[9px]' : 'text-[11px]'} ${isLocked ? 'text-[#9aa1ad]' : 'text-[#5b6472]'}`}>
                    Lección {lessons[i].code || String(i + 1).padStart(2, '0')}
                    {lessons[i].meta ? ` · ${lessons[i].meta}` : ''}
                  </span>
                  <FitText as="span" minSize={8} className={`note-display block font-bold leading-snug ${isCompact ? 'text-[11px]' : 'text-sm'} ${isLocked ? 'text-[#7b8390]' : 'text-[#111827]'}`}>{lessons[i].title}</FitText>
                </button>
                {lessons[i].scene && !isCompact && (
                  <div
                    className="pointer-events-none absolute z-10 -translate-y-1/2"
                    style={{
                      top: `calc(${top} + ${isCurrent ? 96 : -6}px)`,
                      ...(labelOnLeft ? { right: '2.5%' } : { left: '2.5%' }),
                    }}
                  >
                    <Billboard scene={lessons[i].scene as TrailScene} isLocked={isLocked} skinIndex={i} />
                  </div>
                )}
                {isCurrent && (
                  <div
                    className="pointer-events-none absolute z-30 hidden flex-col items-center sm:flex"
                    style={{
                      top: `calc(${top} - 150px)`,
                      ...(labelOnLeft ? { left: `calc(${left} + ${size / 2 - 8}px)` } : { right: `calc(${100 - (point.x / W) * 100}% + ${size / 2 - 8}px)` }),
                    }}
                    aria-hidden="true"
                  >
                    <span className="note-display mb-1 rounded-2xl rounded-b-sm bg-[var(--ink)] px-3 py-1.5 text-sm font-bold text-[var(--bg)] shadow-lg">
                      {completedCount ? '¡Sigue por aquí!' : '¡Empecemos!'}
                    </span>
                    <div className="h-32 w-24">
                      <CleverkorMascot3D height="128px" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}

          <div className="absolute left-1/2 z-10 -translate-x-1/2 text-center" style={{ top: pct(bankY + 14, H) }}>
            <span className="note-display inline-block rounded-full bg-white/90 px-4 py-1.5 text-sm font-black text-[#111827] shadow">
              {isCourseDone ? `${kit.finaleLabel} · completado` : `${kit.finaleLabel} · faltan ${lessons.length - completedCount}`}
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
        <span
          className={`rounded-full bg-[rgba(15,23,42,.78)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity duration-500 ${showHint ? 'opacity-100' : 'opacity-0'}`}
        >
          <i className="fa-solid fa-hand mr-1.5"></i>
          Arrastra para recorrer el camino
        </span>
        <button
          type="button"
          onClick={scrollToCurrent}
          className="pointer-events-auto rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-bold text-[var(--bg)] shadow-lg transition-transform active:scale-95"
        >
          <i className="fa-solid fa-location-crosshairs mr-1.5"></i>
          Ir a mi nivel
        </button>
      </div>
    </div>
  )
}
