import React, { useEffect, useId, useRef, useState } from 'react'
import type { AvatarShape, BannerStyle, FrameStyle } from '../../types/profileCustomization'

export const PROFILE_STYLES = `
.pf-banner{position:relative;overflow:hidden;isolation:isolate}
.pf-layer{position:absolute;inset:0}
.pf-gradient{background:linear-gradient(120deg,var(--pf-a),var(--pf-b))}
.pf-aurora-base{background:linear-gradient(120deg,#0b1220,#121c38)}
.pf-night-base{background:linear-gradient(160deg,#050816,#0f1b3d)}
.pf-blob{position:absolute;border-radius:9999px;filter:blur(38px);opacity:.8;will-change:transform}
.pf-blob-a{background:var(--pf-a);width:55%;height:150%;left:-10%;top:-30%;animation:pf-drift-a calc(14s / var(--pf-speed,1)) ease-in-out infinite}
.pf-blob-b{background:var(--pf-b);width:50%;height:140%;right:-8%;top:-25%;animation:pf-drift-b calc(17s / var(--pf-speed,1)) ease-in-out infinite}
.pf-blob-c{background:#ffffff;opacity:.2;width:28%;height:90%;left:38%;top:10%;animation:pf-drift-c calc(11s / var(--pf-speed,1)) ease-in-out infinite}
@keyframes pf-drift-a{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40%,18%) scale(1.25)}}
@keyframes pf-drift-b{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-45%,10%) scale(1.15)}}
@keyframes pf-drift-c{0%,100%{transform:translate(0,0)}50%{transform:translate(-60%,25%)}}
.pf-grid{background-image:linear-gradient(rgba(255,255,255,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.22) 1px,transparent 1px);background-size:28px 28px;animation:pf-grid-move calc(5s / var(--pf-speed,1)) linear infinite}
@keyframes pf-grid-move{to{background-position:28px 28px}}
.pf-wave{position:absolute;left:0;bottom:0;width:200%;animation:pf-wave-move calc(12s / var(--pf-speed,1)) linear infinite}
.pf-wave-1{height:55%}
.pf-wave-2{height:42%;animation-duration:calc(18s / var(--pf-speed,1));animation-direction:reverse}
.pf-wave-3{height:30%;animation-duration:calc(9s / var(--pf-speed,1))}
@keyframes pf-wave-move{to{transform:translateX(-50%)}}
.pf-scroll{position:absolute;left:0;top:0;width:200%;height:100%;animation:pf-wave-move calc(26s / var(--pf-speed,1)) linear infinite}
.pf-star{position:absolute;border-radius:9999px;background:#fff;animation:pf-twinkle calc(3.2s / var(--pf-speed,1)) ease-in-out infinite}
@keyframes pf-twinkle{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:1;transform:scale(1.25)}}
.pf-starstrip{position:absolute;top:0;left:0;width:200%;height:100%;animation:pf-star-drift calc(var(--pf-dur,80s) / var(--pf-speed,1)) linear infinite}
@keyframes pf-star-drift{to{transform:translateX(-50%)}}
.pf-milky{position:absolute;left:-10%;top:-30%;width:120%;height:160%;background:linear-gradient(100deg,transparent 34%,rgba(255,255,255,.07) 47%,rgba(255,255,255,.13) 50%,rgba(255,255,255,.07) 53%,transparent 66%);filter:blur(6px);animation:pf-milky calc(30s / var(--pf-speed,1)) ease-in-out infinite alternate}
@keyframes pf-milky{from{transform:translateX(-4%) rotate(-8deg)}to{transform:translateX(4%) rotate(-8deg)}}
.pf-vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,transparent 50%,rgba(0,0,0,.42) 100%)}
.pf-planet{animation:pf-planet-bob 7s ease-in-out infinite}
@keyframes pf-planet-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.pf-sparkle{transform-box:fill-box;transform-origin:center;opacity:0;animation:pf-sparkle 3.4s ease-in-out infinite}
@keyframes pf-sparkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg)}50%{opacity:1;transform:scale(1) rotate(45deg)}}
.pf-meteor{position:absolute;top:-10%;left:85%;width:120px;height:2px;background:linear-gradient(90deg,rgba(255,255,255,0),#fff);opacity:0;animation:pf-meteor calc(6s / var(--pf-speed,1)) ease-in infinite}
@keyframes pf-meteor{0%{opacity:0;transform:translate(0,0) rotate(-35deg)}8%{opacity:1}30%{opacity:0;transform:translate(-520px,360px) rotate(-35deg)}100%{opacity:0;transform:translate(-520px,360px) rotate(-35deg)}}
.pf-cover{position:absolute;inset:0;background-size:cover;background-position:center;animation:pf-kenburns calc(24s / var(--pf-speed,1)) ease-in-out infinite alternate}
@keyframes pf-kenburns{from{transform:scale(1)}to{transform:scale(1.12)}}
.pf-shine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(110deg,transparent 40%,rgba(255,255,255,.28) 50%,transparent 60%);background-size:250% 100%;animation:pf-shine calc(7s / var(--pf-speed,1)) ease-in-out infinite}
@keyframes pf-shine{0%{background-position:150% 0}55%,100%{background-position:-50% 0}}

.pf-ring-progress{transition:stroke-dasharray 1.1s cubic-bezier(.2,.8,.2,1)}
.pf-glow{animation:pf-glow 2.4s ease-in-out infinite}
@keyframes pf-glow{0%,100%{opacity:.12}50%{opacity:.85}}

.pf-tilt{position:relative;transition:transform .15s ease-out;transform-style:preserve-3d}
.pf-tilt::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .2s;background:radial-gradient(circle at var(--pf-gx,50%) var(--pf-gy,50%),rgba(255,255,255,.35),transparent 55%)}
.pf-tilt:hover::after{opacity:1}

.pf-rise{animation:pf-rise .5s ease-out both}
@keyframes pf-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.pf-xp-fill{position:relative;overflow:hidden}
.pf-xp-fill::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:translateX(-100%);animation:pf-xp-shimmer 2.4s ease-in-out infinite}
@keyframes pf-xp-shimmer{to{transform:translateX(100%)}}
.pf-flame{animation:pf-flame 1.6s ease-in-out infinite}
@keyframes pf-flame{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.18) rotate(-6deg)}}
.pf-node-current{animation:pf-node 2s ease-out infinite}
@keyframes pf-node{0%{box-shadow:0 0 0 0 color-mix(in srgb, var(--primary) 55%, transparent)}100%{box-shadow:0 0 0 12px transparent}}
.pf-float{animation:pf-float 3.4s ease-in-out infinite}
@keyframes pf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
`

const seeded = (index: number, salt: number) => {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const CANDLES = Array.from({ length: 24 }, (_, i) => {
  const base = 110 + Math.sin(i * 0.6) * 45
  const open = base + (seeded(i, 1) - 0.5) * 40
  const close = base + (seeded(i, 2) - 0.5) * 40
  return {
    x: 25 + i * 50,
    open,
    close,
    high: Math.min(open, close) - seeded(i, 3) * 22,
    low: Math.max(open, close) + seeded(i, 4) * 22,
  }
})

interface StarSpec {
  x: number
  y: number
  size: number
  delay: number
  color: string
}

const buildStarLayer = (count: number, salt: number, minSize: number, maxSize: number, colors: string[]): StarSpec[] =>
  Array.from({ length: count }, (_, i) => ({
    x: seeded(i, salt) * 100,
    y: seeded(i, salt + 1) * 100,
    size: minSize + seeded(i, salt + 2) * (maxSize - minSize),
    delay: seeded(i, salt + 3) * 5,
    color: colors[Math.floor(seeded(i, salt + 4) * colors.length)],
  }))

const STAR_LAYERS: { stars: StarSpec[]; duration: number; glow: boolean; opacity: number }[] = [
  { stars: buildStarLayer(70, 20, 1, 1.7, ['#ffffff', '#dbeafe']), duration: 140, glow: false, opacity: 0.7 },
  { stars: buildStarLayer(36, 40, 1.6, 2.6, ['#ffffff', '#e0f2fe', '#fef3c7']), duration: 85, glow: false, opacity: 0.9 },
  { stars: buildStarLayer(14, 60, 3, 4.6, ['#ffffff', '#bae6fd', '#fde68a', '#fbcfe8']), duration: 50, glow: true, opacity: 1 },
]

const SPARKLES = [
  { x: 240, y: 62, scale: 1, delay: 0 },
  { x: 470, y: 48, scale: 0.8, delay: 1.1 },
  { x: 620, y: 160, scale: 1.1, delay: 2.2 },
  { x: 705, y: 40, scale: 0.7, delay: 0.6 },
  { x: 880, y: 190, scale: 0.9, delay: 1.8 },
]

const METEORS = [
  { left: '88%', top: '-8%', delay: 0, duration: 7 },
  { left: '60%', top: '-12%', delay: 3.4, duration: 9 },
  { left: '96%', top: '18%', delay: 5.6, duration: 8 },
]

const StarLayer: React.FC<{ layer: (typeof STAR_LAYERS)[number] }> = ({ layer }) => (
  <div className="pf-starstrip" style={{ '--pf-dur': `${layer.duration}s`, opacity: layer.opacity } as React.CSSProperties}>
    {[0, 1].map((tile) => (
      <div key={tile} style={{ position: 'absolute', top: 0, height: '100%', width: '50%', left: `${tile * 50}%` }}>
        {layer.stars.map((star, index) => (
          <span
            key={index}
            className="pf-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              background: star.color,
              animationDelay: `${star.delay}s`,
              boxShadow: layer.glow ? `0 0 ${star.size * 2.2}px ${star.size * 0.6}px ${star.color}` : undefined,
            }}
          />
        ))}
      </div>
    ))}
  </div>
)

const GalaxyPlanets: React.FC = () => {
  const uid = useId().replace(/:/g, '')
  const id = (name: string) => `${name}-${uid}`
  const ref = (name: string) => `url(#${id(name)})`

  return (
    <svg
      className="pf-layer"
      viewBox="0 0 1000 250"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id={id('bodyA')} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" style={{ stopColor: 'color-mix(in srgb, var(--pf-a) 40%, #ffffff)' }} />
          <stop offset="0.55" style={{ stopColor: 'var(--pf-a)' }} />
          <stop offset="1" style={{ stopColor: 'color-mix(in srgb, var(--pf-a) 35%, #0b1020)' }} />
        </radialGradient>
        <radialGradient id={id('bodyB')} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" style={{ stopColor: 'color-mix(in srgb, var(--pf-b) 40%, #ffffff)' }} />
          <stop offset="0.55" style={{ stopColor: 'var(--pf-b)' }} />
          <stop offset="1" style={{ stopColor: 'color-mix(in srgb, var(--pf-b) 35%, #0b1020)' }} />
        </radialGradient>
        <radialGradient id={id('bodyC')} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#fed7aa" />
          <stop offset="0.5" stopColor="#fb923c" />
          <stop offset="1" stopColor="#7c2d12" />
        </radialGradient>
        <radialGradient id={id('bodyD')} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#cffafe" />
          <stop offset="0.5" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#164e63" />
        </radialGradient>
        <radialGradient id={id('shade')} cx="0.3" cy="0.3" r="0.95">
          <stop offset="0" stopColor="#000000" stopOpacity="0" />
          <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.62" />
        </radialGradient>
        <radialGradient id={id('glowA')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" style={{ stopColor: 'var(--pf-a)', stopOpacity: 0.4 }} />
          <stop offset="1" style={{ stopColor: 'var(--pf-a)', stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id={id('glowB')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" style={{ stopColor: 'var(--pf-b)', stopOpacity: 0.4 }} />
          <stop offset="1" style={{ stopColor: 'var(--pf-b)', stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id={id('ring')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="0.5" style={{ stopColor: 'color-mix(in srgb, var(--pf-b) 45%, #ffffff)' }} />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
        <clipPath id={id('clipBig')}>
          <circle r="42" />
        </clipPath>
        <clipPath id={id('clipGas')}>
          <circle r="25" />
        </clipPath>
      </defs>

      <g transform="translate(795 118)">
        <g className="pf-planet">
          <circle r="78" fill={ref('glowA')} />
          <g transform="rotate(-20)">
            <path d="M-96 0 A96 21 0 0 1 96 0" fill="none" stroke={ref('ring')} strokeWidth="9" opacity="0.6" />
            <path d="M-82 0 A82 17 0 0 1 82 0" fill="none" stroke={ref('ring')} strokeWidth="3" opacity="0.5" />
          </g>
          <circle r="42" fill={ref('bodyA')} />
          <g clipPath={ref('clipBig')}>
            <ellipse cx="0" cy="-14" rx="46" ry="5" fill="#ffffff" opacity="0.16" />
            <ellipse cx="0" cy="2" rx="46" ry="7" fill="#000000" opacity="0.1" />
            <ellipse cx="0" cy="20" rx="46" ry="5" fill="#ffffff" opacity="0.12" />
          </g>
          <circle r="42" fill={ref('shade')} />
          <g transform="rotate(-20)">
            <path d="M-96 0 A96 21 0 0 0 96 0" fill="none" stroke={ref('ring')} strokeWidth="9" opacity="0.9" />
            <path d="M-82 0 A82 17 0 0 0 82 0" fill="none" stroke={ref('ring')} strokeWidth="3" opacity="0.75" />
          </g>
        </g>
      </g>

      <g transform="translate(365 96)">
        <g className="pf-planet" style={{ animationDelay: '-2.5s' }}>
          <circle r="46" fill={ref('glowB')} />
          <circle r="25" fill={ref('bodyB')} />
          <g clipPath={ref('clipGas')}>
            <rect x="-26" y="-14" width="52" height="5" fill="#ffffff" opacity="0.2" />
            <rect x="-26" y="-3" width="52" height="7" fill="#000000" opacity="0.14" />
            <rect x="-26" y="10" width="52" height="4" fill="#ffffff" opacity="0.16" />
          </g>
          <circle r="25" fill={ref('shade')} />
          <g transform="rotate(-14)">
            <circle r="5" fill="#e2e8f0">
              <animateMotion dur="9s" repeatCount="indefinite" path="M-54 0 A54 15 0 1 1 54 0 A54 15 0 1 1 -54 0" />
            </circle>
          </g>
        </g>
      </g>

      <g transform="translate(935 60)">
        <g className="pf-planet" style={{ animationDelay: '-4s' }}>
          <circle r="11" fill={ref('bodyC')} />
          <circle r="11" fill={ref('shade')} />
        </g>
      </g>

      <g transform="translate(560 188)">
        <g className="pf-planet" style={{ animationDelay: '-1s' }}>
          <circle r="8" fill={ref('bodyD')} />
          <circle r="8" fill={ref('shade')} />
        </g>
      </g>

      {SPARKLES.map((sparkle, index) => (
        <g key={index} transform={`translate(${sparkle.x} ${sparkle.y}) scale(${sparkle.scale})`}>
          <path
            className="pf-sparkle"
            d="M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z"
            fill="#ffffff"
            style={{ animationDelay: `${sparkle.delay}s` }}
          />
        </g>
      ))}
    </svg>
  )
}

const WAVE_PATH = 'M0 60 C150 10 300 110 450 60 S750 10 900 60 S1200 110 1200 60 V120 H0 Z'

const CandleTile: React.FC<{ offset: number }> = ({ offset }) => (
  <g transform={`translate(${offset} 0)`}>
    {CANDLES.map((c) => {
      const up = c.close < c.open
      const color = up ? '#22c55e' : '#ef4444'
      return (
        <g key={c.x}>
          <line x1={c.x} x2={c.x} y1={c.high} y2={c.low} stroke={color} strokeOpacity="0.7" strokeWidth="2" />
          <rect
            x={c.x - 9}
            y={Math.min(c.open, c.close)}
            width="18"
            height={Math.max(Math.abs(c.open - c.close), 5)}
            rx="3"
            fill={color}
            fillOpacity="0.65"
          />
        </g>
      )
    })}
  </g>
)

const WaveSvg: React.FC<{ className: string; opacity: number }> = ({ className, opacity }) => (
  <svg className={`pf-wave ${className}`} viewBox="0 0 2400 120" preserveAspectRatio="none">
    <path d={WAVE_PATH} fill={`rgba(255,255,255,${opacity})`} />
    <path d={WAVE_PATH} transform="translate(1200 0)" fill={`rgba(255,255,255,${opacity})`} />
  </svg>
)

const BannerScene: React.FC<{ style: BannerStyle; cover?: string }> = ({ style, cover }) => {
  if (style === 'cover') {
    if (cover) {
      return <div className="pf-cover" style={{ backgroundImage: `url(${cover})` }} />
    }
    return (
      <>
        <div className="pf-layer pf-gradient" />
        <div className="pf-blob pf-blob-c" />
      </>
    )
  }

  if (style === 'candles') {
    return (
      <>
        <div className="pf-layer pf-night-base" />
        <div className="pf-layer pf-grid" style={{ opacity: 0.18 }} />
        <div className="pf-blob pf-blob-a" style={{ opacity: 0.35 }} />
        <svg className="pf-scroll" viewBox="0 0 2400 200" preserveAspectRatio="none">
          <CandleTile offset={0} />
          <CandleTile offset={1200} />
        </svg>
      </>
    )
  }

  if (style === 'skyline') {
    return (
      <>
        <div className="pf-layer pf-gradient" />
        <div className="pf-layer pf-grid" />
        <div className="pf-blob pf-blob-c" />
      </>
    )
  }

  if (style === 'waves') {
    return (
      <>
        <div className="pf-layer pf-gradient" />
        <WaveSvg className="pf-wave-1" opacity={0.22} />
        <WaveSvg className="pf-wave-2" opacity={0.2} />
        <WaveSvg className="pf-wave-3" opacity={0.28} />
      </>
    )
  }

  if (style === 'stars') {
    return (
      <>
        <div className="pf-layer pf-night-base" />
        <div className="pf-blob pf-blob-a" style={{ opacity: 0.45 }} />
        <div className="pf-blob pf-blob-b" style={{ opacity: 0.45 }} />
        <div className="pf-blob pf-blob-c" style={{ opacity: 0.12 }} />
        <div className="pf-milky" />
        {STAR_LAYERS.map((layer, index) => (
          <StarLayer key={index} layer={layer} />
        ))}
        <GalaxyPlanets />
        {METEORS.map((meteor, index) => (
          <span
            key={index}
            className="pf-meteor"
            style={{ left: meteor.left, top: meteor.top, animationDelay: `${meteor.delay}s`, animationDuration: `calc(${meteor.duration}s / var(--pf-speed, 1))` }}
          />
        ))}
        <div className="pf-vignette" />
      </>
    )
  }

  return (
    <>
      <div className="pf-layer pf-aurora-base" />
      <div className="pf-blob pf-blob-a" />
      <div className="pf-blob pf-blob-b" />
      <div className="pf-blob pf-blob-c" />
    </>
  )
}

interface ProfileBannerProps {
  style: BannerStyle
  colorA: string
  colorB: string
  speed: number
  cover?: string
  className?: string
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  style,
  colorA,
  colorB,
  speed,
  cover,
  className = '',
}) => {
  const variables = { '--pf-a': colorA, '--pf-b': colorB, '--pf-speed': speed } as React.CSSProperties

  return (
    <div className={`pf-banner ${className}`} style={variables} aria-hidden="true">
      <BannerScene style={style} cover={cover} />
      <div className="pf-shine" />
    </div>
  )
}

const HEXAGON = 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)'

export const getShapeStyle = (shape: AvatarShape): React.CSSProperties => {
  if (shape === 'circle') return { borderRadius: '9999px' }
  if (shape === 'rounded') return { borderRadius: '26%' }
  return { clipPath: HEXAGON }
}

const AVATAR_PAD = 26
const FRAME_STROKE = 6
const FRAME_OFFSET = 3
const ORBIT_OFFSET = 13
const RING_OFFSET = 21

export const buildShapePath = (shape: AvatarShape, box: number, center: number): string => {
  const x = center - box / 2
  const y = x
  const w = box
  if (shape === 'circle') {
    const r = box / 2
    return `M${center} ${y} A${r} ${r} 0 1 1 ${center} ${y + box} A${r} ${r} 0 1 1 ${center} ${y} Z`
  }
  if (shape === 'rounded') {
    const rr = box * 0.26
    return `M${center} ${y} H${x + w - rr} A${rr} ${rr} 0 0 1 ${x + w} ${y + rr} V${y + w - rr} A${rr} ${rr} 0 0 1 ${x + w - rr} ${y + w} H${x + rr} A${rr} ${rr} 0 0 1 ${x} ${y + w - rr} V${y + rr} A${rr} ${rr} 0 0 1 ${x + rr} ${y} Z`
  }
  return `M${center} ${y + 0.05 * w} L${x + 0.75 * w} ${y + 0.05 * w} L${x + w} ${y + 0.5 * w} L${x + 0.75 * w} ${y + 0.95 * w} L${x + 0.25 * w} ${y + 0.95 * w} L${x} ${y + 0.5 * w} L${x + 0.25 * w} ${y + 0.05 * w} Z`
}

interface AvatarFrameProps {
  src?: string
  initials: string
  alt: string
  shape: AvatarShape
  frame: FrameStyle
  frameColor: string
  showLevelRing: boolean
  progress: number
  level?: number
  size?: number
}

export const AvatarFrame: React.FC<AvatarFrameProps> = ({
  src,
  initials,
  alt,
  shape,
  frame,
  frameColor,
  showLevelRing,
  progress,
  level,
  size = 112,
}) => {
  const [mounted, setMounted] = useState(false)
  const uid = useId().replace(/:/g, '')

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const outer = size + AVATAR_PAD * 2
  const center = outer / 2
  const shownProgress = mounted ? Math.max(0, Math.min(100, progress)) : 0
  const framePath = buildShapePath(shape, size + FRAME_OFFSET * 2, center)
  const orbitPath = buildShapePath(shape, size + ORBIT_OFFSET * 2, center)
  const ringPath = buildShapePath(shape, size + RING_OFFSET * 2, center)
  const wrapperStyle = { width: outer, height: outer, '--pf-frame': frameColor } as React.CSSProperties
  const shapeStyle = getShapeStyle(shape)
  const rainbowId = `rb-${uid}`
  const glowId = `gl-${uid}`
  const frameStroke = frame === 'rainbow' ? `url(#${rainbowId})` : 'var(--pf-frame)'
  const badgeSize = Math.max(24, Math.round(size * 0.28))

  return (
    <div className="relative flex items-center justify-center" style={wrapperStyle}>
      <svg className="absolute inset-0" width={outer} height={outer} viewBox={`0 0 ${outer} ${outer}`} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={rainbowId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ef4444" />
            <stop offset="0.2" stopColor="#f59e0b" />
            <stop offset="0.4" stopColor="#22c55e" />
            <stop offset="0.6" stopColor="#06b6d4" />
            <stop offset="0.8" stopColor="#6366f1" />
            <stop offset="1" stopColor="#d946ef" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 0.5 0.5"
              to="360 0.5 0.5"
              dur="6s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {showLevelRing && (
          <>
            <path d={ringPath} strokeWidth="5" strokeLinejoin="round" style={{ stroke: 'var(--border)' }} />
            <path
              className="pf-ring-progress"
              d={ringPath}
              pathLength={100}
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap={shownProgress > 0 ? 'round' : 'butt'}
              strokeDasharray={`${shownProgress} 100`}
              style={{ stroke: 'var(--pf-frame)' }}
            />
          </>
        )}

        {frame === 'pulse' && (
          <path
            className="pf-glow"
            d={framePath}
            strokeWidth={FRAME_STROKE + 6}
            strokeLinejoin="round"
            filter={`url(#${glowId})`}
            style={{ stroke: 'var(--pf-frame)' }}
          />
        )}

        {frame !== 'none' && (
          <path
            d={framePath}
            strokeWidth={FRAME_STROKE}
            strokeLinejoin="round"
            style={frame === 'rainbow' ? undefined : { stroke: 'var(--pf-frame)' }}
            stroke={frame === 'rainbow' ? frameStroke : undefined}
          />
        )}

        {frame === 'orbit' && (
          <>
            <circle r="3" opacity="0.45" style={{ fill: 'var(--pf-frame)' }}>
              <animateMotion dur="5s" begin="-0.4s" repeatCount="indefinite" path={orbitPath} />
            </circle>
            <circle r="5.5" style={{ fill: 'var(--pf-frame)' }}>
              <animateMotion dur="5s" repeatCount="indefinite" path={orbitPath} />
            </circle>
          </>
        )}
      </svg>

      <div
        className="relative overflow-hidden flex items-center justify-center font-bold text-3xl text-[var(--text)]"
        style={{ width: size, height: size, background: 'var(--surface)', ...shapeStyle }}
      >
        {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : initials}
      </div>

      {level !== undefined && (
        <div
          className="absolute rounded-full bg-[var(--primary)] text-[var(--primary-text)] border-2 border-[var(--surface)] flex items-center justify-center text-xs font-bold shadow"
          style={{ width: badgeSize, height: badgeSize, right: AVATAR_PAD - 6, bottom: AVATAR_PAD - 6 }}
        >
          {level}
        </div>
      )}
    </div>
  )
}

interface TiltCardProps {
  enabled: boolean
  className?: string
  children: React.ReactNode
}

export const TiltCard: React.FC<TiltCardProps> = ({ enabled, className = '', children }) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!enabled || !el) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    el.style.transform = `perspective(700px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg)`
    el.style.setProperty('--pf-gx', `${px * 100}%`)
    el.style.setProperty('--pf-gy', `${py * 100}%`)
  }

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`${enabled ? 'pf-tilt' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export const useCountUp = (target: number, duration = 900) => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

export const CountUp: React.FC<{ value: number }> = ({ value }) => <>{useCountUp(value)}</>

const WEEKDAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

export const StreakCalendar: React.FC<{ streak: number }> = ({ streak }) => {
  const totalDays = 28
  const today = new Date()

  const cells = Array.from({ length: totalDays }, (_, index) => {
    const daysAgo = totalDays - 1 - index
    const date = new Date(today)
    date.setDate(today.getDate() - daysAgo)
    return { index, daysAgo, date, active: daysAgo < streak }
  })

  const startWeekday = cells[0].date.getDay()
  const headers = Array.from({ length: 7 }, (_, i) => WEEKDAY_LABELS[(startWeekday + i) % 7])

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono text-[var(--text-muted)]">
        {headers.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell) => {
          const isToday = cell.daysAgo === 0
          return (
            <div
              key={cell.index}
              title={cell.date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] border transition-transform hover:scale-110 ${
                cell.active
                  ? 'border-transparent text-white'
                  : 'border-[var(--border)] bg-[var(--bg-alt)] text-[var(--text-muted)]'
              }`}
              style={
                cell.active
                  ? { background: 'linear-gradient(135deg, #f97316, #ef4444)', outline: isToday ? '2px solid var(--primary)' : undefined, outlineOffset: 2 }
                  : { outline: isToday ? '2px solid var(--primary)' : undefined, outlineOffset: 2 }
              }
            >
              {cell.active ? (
                <i className={`fa-solid fa-fire ${isToday ? 'pf-flame' : ''}`}></i>
              ) : (
                cell.date.getDate()
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface LevelJourneyProps {
  level: number
  xp: number
  xpToNext: number
}

export const LevelJourney: React.FC<LevelJourneyProps> = ({ level, xp, xpToNext }) => {
  const nodeCount = 5
  const start = Math.max(1, level - 1)
  const nodes = Array.from({ length: nodeCount }, (_, i) => start + i)
  const currentIndex = level - start
  const fraction = xpToNext > 0 ? Math.min(1, xp / xpToNext) : 0
  const fillPercent = Math.min(100, ((currentIndex + fraction) / (nodeCount - 1)) * 100)
  const missing = Math.max(0, xpToNext - xp)

  return (
    <div className="space-y-4">
      <div className="relative px-4 pt-1">
        <div className="absolute left-8 right-8 top-[19px] h-1 rounded-full bg-[var(--border)]" />
        <div
          className="absolute left-8 top-[19px] h-1 rounded-full bg-[var(--primary)] transition-all duration-1000"
          style={{ width: `calc((100% - 4rem) * ${fillPercent / 100})` }}
        />
        <div className="relative flex justify-between">
          {nodes.map((node) => {
            const done = node < level
            const current = node === level
            return (
              <div key={node} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    current
                      ? 'pf-node-current bg-[var(--primary)] border-[var(--primary)] text-white'
                      : done
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'
                  }`}
                >
                  {done ? (
                    <i className="fa-solid fa-check text-xs"></i>
                  ) : current ? (
                    node
                  ) : (
                    <i className="fa-solid fa-lock text-[10px]"></i>
                  )}
                </div>
                <span className={`text-[11px] ${current ? 'font-bold text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                  Nivel {node}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      {xpToNext > 0 && (
        <p className="text-center text-xs text-[var(--text-muted)]">
          Te faltan <span className="font-bold text-[var(--text)]">{missing} XP</span> para llegar al nivel {level + 1}.
        </p>
      )}
    </div>
  )
}