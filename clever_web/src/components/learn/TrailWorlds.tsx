import React from 'react'

export const MAP_W = 600

export interface WorldKit {
  districts: string[]
  stageColor: string
  finaleLabel: string
  lane: { width: number; dash: string; opacity: number }
  Tree: React.FC<{ x: number; y: number; r?: number }>
  Stall: React.FC<{ x: number; y: number; color: string }>
  Plaza: React.FC<{ x: number; y: number }>
  Duo: React.FC<{ x: number; base: number; seed: number }>
  Block: React.FC<{ x: number; base: number; seed: number }>
  Landmark: React.FC<{ x: number; base: number }>
  Finale: React.FC<{ x: number; y: number; isOpen: boolean }>
  Garland: React.FC<{ y: number }>
  Lamp: React.FC<{ x: number; y: number }>
  Filler: React.FC<{ cx: number; cy: number; seed: number }>
  Street: React.FC<{ sy: number; index: number; reduced: boolean }>
  Crossing: React.FC<{ rx: number; sy: number }>
  Vehicle: React.FC<{ color: string }>
  Backdrop?: React.FC<{ h: number; reduced: boolean }>
  Front?: React.FC<{ h: number; reduced: boolean }>
}

export const WORLD_STYLES = `
.city-map[data-world="candles"]{--grass:#f1d9a8;--grass-2:#e9cc93;--walk:#e2c288;--walk-edge:#c99f5f;--asphalt:#b98a52;--asphalt-edge:#8f6536;--lane:#fff3d6;--tree:#5f9a4a;--tree-2:#4c8139;--water:#4fb3d9;--wall:#f7e7c6;--wall-2:#e2c690;--window:#c9a46a;--window-lit:#ffd66b;--roof:#c47f45;--shade:rgba(90,55,20,.16);--rock:#d9a86b;--rock-2:#c48d50}
.city-map[data-world="island"]{--grass:#f5e3b3;--grass-2:#efd8a0;--walk:#d7ae74;--walk-edge:#b48450;--asphalt:#a0703f;--asphalt-edge:#7a5230;--lane:#6b4423;--tree:#3f9a57;--tree-2:#2f7a44;--water:#2aa7c9;--wall:#fff4dd;--wall-2:#e8d3a8;--window:#8fd3e8;--window-lit:#ffd66b;--roof:#c8963e;--shade:rgba(60,40,10,.16);--sea:#1f8fb8;--sea-2:#2aa7c9}
:root:is([data-theme="dark"],[data-theme="terminal"],[data-theme="aurora"],[data-theme="neon"],[data-theme="sunset"],[data-theme="ocean"]) .city-map[data-world="candles"]{--grass:#3a2a1a;--grass-2:#33251a;--walk:#4a3622;--walk-edge:#5a4128;--asphalt:#6b4c2c;--asphalt-edge:#2a1d10;--lane:#e9cf9b;--tree:#3f7034;--tree-2:#335c2a;--water:#24557a;--wall:#4d3a26;--wall-2:#5d4630;--window:#6b5434;--rock:#7a5634;--rock-2:#5e4128;--shade:rgba(0,0,0,.3)}
:root:is([data-theme="dark"],[data-theme="terminal"],[data-theme="aurora"],[data-theme="neon"],[data-theme="sunset"],[data-theme="ocean"]) .city-map[data-world="island"]{--grass:#3d3424;--grass-2:#362e20;--walk:#5a4428;--walk-edge:#6b5232;--asphalt:#5c4026;--asphalt-edge:#2e1f10;--lane:#2a1b0c;--tree:#2b6643;--tree-2:#225636;--water:#1c5d7a;--wall:#4a3f2c;--wall-2:#5a4c34;--roof:#6b5025;--sea:#0f3d55;--sea-2:#17506d;--shade:rgba(0,0,0,.3)}
.world-flicker{transform-box:fill-box;transform-origin:50% 100%;animation:world-flicker .9s ease-in-out infinite alternate}
@keyframes world-flicker{from{transform:scaleY(.82) scaleX(1.05)}to{transform:scaleY(1.12) scaleX(.94)}}
.world-float{animation:world-float 7s ease-in-out infinite}
@keyframes world-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
.world-drift{animation:world-drift 46s linear infinite}
@keyframes world-drift{from{transform:translateX(-120px)}to{transform:translateX(720px)}}
.world-wave{stroke-dasharray:10 14;animation:city-dash 3.6s linear infinite}
.world-bob{transform-box:fill-box;transform-origin:center;animation:world-bob 3s ease-in-out infinite}
@keyframes world-bob{0%,100%{transform:rotate(-3deg) translateY(0)}50%{transform:rotate(3deg) translateY(-2px)}}
.world-beam{transform-box:view-box;animation:world-beam 6s linear infinite}
@keyframes world-beam{0%,100%{opacity:.15}50%{opacity:.6}}
.world-lid{transition:transform 1.4s cubic-bezier(.23,1,.32,1);transform-box:fill-box;transform-origin:50% 100%}
.city-vault-open .world-lid{transform:translate(-14px,-64px) rotate(-12deg)}
.world-sparkle{transform-box:fill-box;transform-origin:center;animation:world-sparkle 2.4s ease-in-out infinite}
@keyframes world-sparkle{0%,100%{opacity:0;transform:scale(.4) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}
.world-gold{opacity:0;transition:opacity 1s .4s}
.city-vault-open .world-gold{opacity:1}
@media (prefers-reduced-motion:reduce){.world-flicker,.world-float,.world-drift,.world-wave,.world-bob,.world-beam,.world-sparkle{animation:none!important}.world-lid,.world-gold{transition:none}}
`

const Shadow: React.FC<{ x: number; y: number; rx: number }> = ({ x, y, rx }) => <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.32} fill="var(--shade)" />

const Flame: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g>
    <path className="world-flicker" d={`M${x} ${y} c${-7 * s} ${-6 * s} ${-6 * s} ${-14 * s} 0 ${-22 * s} c${6 * s} ${8 * s} ${7 * s} ${16 * s} 0 ${22 * s} Z`} fill="#ff8a3d" />
    <path className="world-flicker" style={{ animationDelay: '.3s' }} d={`M${x} ${y} c${-4 * s} ${-4 * s} ${-3 * s} ${-9 * s} 0 ${-13 * s} c${3 * s} ${5 * s} ${4 * s} ${9 * s} 0 ${13 * s} Z`} fill="#ffd66b" />
  </g>
)

const Cactus: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 16 }) => {
  const h = r * 2.2
  const w = r * 0.62
  return (
    <g>
      <Shadow x={x + 4} y={y + r * 0.9} rx={r * 0.8} />
      <rect x={x - w / 2} y={y - h * 0.55} width={w} height={h} rx={w / 2} fill="var(--tree)" />
      <path d={`M${x - w / 2} ${y} h${-r * 0.45} v${-r * 0.7}`} stroke="var(--tree)" strokeWidth={w * 0.62} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${x + w / 2} ${y - r * 0.3} h${r * 0.45} v${-r * 0.6}`} stroke="var(--tree-2)" strokeWidth={w * 0.62} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1={x} y1={y - h * 0.45} x2={x} y2={y + h * 0.4} stroke="var(--tree-2)" strokeWidth="1.5" opacity="0.6" />
      <circle cx={x} cy={y - h * 0.55} r={r * 0.16} fill="#ff6fa3" />
    </g>
  )
}

const Palm: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 16 }) => {
  const top = { x: x + r * 0.35, y: y - r * 1.9 }
  return (
    <g>
      <Shadow x={x + 6} y={y + r * 0.5} rx={r * 1.1} />
      <path d={`M${x} ${y + r * 0.4} Q${x - r * 0.2} ${y - r} ${top.x} ${top.y}`} stroke="#8a5a3b" strokeWidth={r * 0.32} fill="none" strokeLinecap="round" />
      {[-150, -110, -60, -20, 20].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const ex = top.x + Math.cos(rad) * r * 1.5
        const ey = top.y + Math.sin(rad) * r * 1.1 + r * 0.5
        return <path key={i} d={`M${top.x} ${top.y} Q${(top.x + ex) / 2} ${Math.min(top.y, ey) - r * 0.5} ${ex} ${ey}`} stroke={i % 2 ? 'var(--tree)' : 'var(--tree-2)'} strokeWidth={r * 0.36} strokeLinecap="round" fill="none" />
      })}
      <circle cx={top.x - 2} cy={top.y + 3} r={r * 0.16} fill="#6b4423" />
      <circle cx={top.x + 3} cy={top.y + 4} r={r * 0.16} fill="#6b4423" />
    </g>
  )
}

const Tent: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g>
    <Shadow x={x + 30} y={y + 2} rx={32} />
    <path d={`M${x} ${y} L${x + 27} ${y - 48} L${x + 54} ${y} Z`} fill={color} />
    <path d={`M${x + 27} ${y - 48} L${x + 54} ${y} L${x + 40} ${y} Z`} fill="rgba(0,0,0,.14)" />
    <path d={`M${x + 18} ${y} L${x + 27} ${y - 20} L${x + 36} ${y} Z`} fill="#3a2a1a" opacity="0.75" />
    <line x1={x + 27} y1={y - 48} x2={x + 27} y2={y - 58} stroke="#6b4423" strokeWidth="2.5" />
    <path d={`M${x + 27} ${y - 58} l10 3 l-10 3 Z`} fill="#fff3d6" />
  </g>
)

const Hut: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g>
    <Shadow x={x + 30} y={y + 2} rx={34} />
    {[8, 46].map((dx) => (
      <rect key={dx} x={x + dx} y={y - 12} width="4" height="12" fill="#7a5230" />
    ))}
    <rect x={x + 4} y={y - 40} width="46" height="28" fill="#d9a85b" stroke="#b48450" strokeWidth="1.5" />
    {[0, 1, 2, 3, 4].map((i) => (
      <line key={i} x1={x + 10 + i * 9} y1={y - 40} x2={x + 10 + i * 9} y2={y - 12} stroke="#b48450" strokeWidth="1" />
    ))}
    <rect x={x + 21} y={y - 30} width="12" height="18" fill="#6b4423" />
    <path d={`M${x - 6} ${y - 38} L${x + 27} ${y - 62} L${x + 60} ${y - 38} Z`} fill="var(--roof)" />
    <path d={`M${x - 6} ${y - 38} h66`} stroke={color} strokeWidth="4" />
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={i} x1={x - 2 + i * 8} y1={y - 38} x2={x + i * 8} y2={y - 32} stroke="var(--roof)" strokeWidth="2" />
    ))}
  </g>
)

const Mesa: React.FC<{ x: number; base: number; w: number; h: number; up: boolean }> = ({ x, base, w, h, up }) => {
  const body = up ? '#2f9e66' : '#d4574c'
  const dark = up ? '#227a4e' : '#a8423a'
  return (
    <g>
      <rect x={x + 5} y={base - h + 6} width={w} height={h} rx="6" fill="var(--shade)" />
      <rect x={x + w / 2 - 2.5} y={base - h - 22} width="5" height={h + 30} rx="2" fill={dark} />
      <rect x={x} y={base - h} width={w} height={h} rx="6" fill={body} />
      <rect x={x + w * 0.62} y={base - h} width={w * 0.38} height={h} rx="6" fill={dark} opacity="0.35" />
      {Array.from({ length: Math.floor(h / 18) }).map((_, i) => (
        <line key={i} x1={x + 4} x2={x + w - 4} y1={base - h + 12 + i * 18} y2={base - h + 12 + i * 18} stroke={dark} strokeWidth="2" opacity="0.45" />
      ))}
    </g>
  )
}

const Balloon: React.FC<{ x: number; y: number; color: string; delay: number }> = ({ x, y, color, delay }) => (
  <g className="world-float" style={{ animationDelay: `${delay}s` }}>
    <path d={`M${x} ${y} c-26 0 -30 -42 0 -46 c30 4 26 46 0 46 Z`} fill={color} />
    <path d={`M${x} ${y} c-10 0 -12 -42 0 -46 c12 4 10 46 0 46 Z`} fill="#fff" opacity="0.28" />
    <line x1={x - 8} y1={y - 2} x2={x - 5} y2={y + 12} stroke="#6b4423" strokeWidth="1" />
    <line x1={x + 8} y1={y - 2} x2={x + 5} y2={y + 12} stroke="#6b4423" strokeWidth="1" />
    <rect x={x - 6} y={y + 12} width="12" height="9" rx="2" fill="#8a5a3b" />
  </g>
)

const Wagon: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <rect x="-16" y="-9" width="32" height="18" rx="4" fill="#8a5a3b" stroke="rgba(0,0,0,.25)" strokeWidth="1" />
    <path d="M-14 -9 Q0 -20 14 -9 Z" fill={color} opacity="0.9" />
    <path d="M-14 9 Q0 20 14 9 Z" fill={color} opacity="0.9" />
    <rect x="16" y="-2" width="8" height="4" rx="1" fill="#6b4423" />
  </g>
)

const Boat: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <path d="M-22 0 L22 0 L15 9 L-15 9 Z" fill="#7a5230" />
    <line x1="0" y1="0" x2="0" y2="-26" stroke="#4a3018" strokeWidth="2" />
    <path d="M1 -25 L18 -3 L1 -3 Z" fill="#fffaf0" />
    <path d="M-1 -20 L-14 -3 L-1 -3 Z" fill={color} />
  </g>
)

const Canoe: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <path d="M-20 0 Q0 9 20 0 Q0 4 -20 0 Z" fill="#8a5a3b" />
    <circle cx="-4" cy="-3" r="3.5" fill={color} />
    <line x1="-10" y1="-8" x2="4" y2="6" stroke="#4a3018" strokeWidth="1.5" />
  </g>
)

const BOAT_COLORS = ['#e4572e', '#2e86ab', '#f2c14e', '#7a5ea8']

const WaterStreet: React.FC<{ sy: number; index: number; reduced: boolean; vessel: 'boat' | 'canoe' }> = ({ sy, index, reduced, vessel }) => (
  <g>
    <rect x="0" y={sy - 30} width={MAP_W} height="60" fill="var(--walk)" />
    <rect x="0" y={sy - 22} width={MAP_W} height="44" fill="var(--water)" />
    <line x1="0" x2={MAP_W} y1={sy - 8} y2={sy - 8} stroke="#fff" strokeOpacity="0.45" strokeWidth="2" className="world-wave" />
    <line x1="0" x2={MAP_W} y1={sy + 9} y2={sy + 9} stroke="#fff" strokeOpacity="0.3" strokeWidth="2" className="world-wave" style={{ animationDelay: '-1.5s' }} />
    {!reduced && (
      <g className="city-car-right" style={{ ['--car-dur' as string]: `${22 + index * 5}s`, animationDelay: `${-index * 7}s` } as React.CSSProperties}>
        <g transform={`translate(0 ${sy + (vessel === 'boat' ? 6 : 2)})`} className="world-bob">
          {vessel === 'boat' ? <Boat color={BOAT_COLORS[index % BOAT_COLORS.length]} /> : <Canoe color={BOAT_COLORS[index % BOAT_COLORS.length]} />}
        </g>
      </g>
    )}
  </g>
)

const Bridge: React.FC<{ rx: number; sy: number; tone: string }> = ({ rx, sy, tone }) => (
  <g>
    <rect x={rx - 40} y={sy - 26} width="80" height="52" fill={tone} />
    {Array.from({ length: 9 }).map((_, i) => (
      <line key={i} x1={rx - 40} x2={rx + 40} y1={sy - 22 + i * 5.5} y2={sy - 22 + i * 5.5} stroke="rgba(0,0,0,.22)" strokeWidth="1.2" />
    ))}
    <rect x={rx - 44} y={sy - 28} width="5" height="56" rx="2" fill="#6b4423" />
    <rect x={rx + 39} y={sy - 28} width="5" height="56" rx="2" fill="#6b4423" />
  </g>
)

const Pennants: React.FC<{ y: number; colors: string[] }> = ({ y, colors }) => (
  <g>
    <path d={`M0 ${y} Q${MAP_W / 2} ${y + 26} ${MAP_W} ${y}`} fill="none" stroke="#6b4423" strokeWidth="1.5" />
    {Array.from({ length: 16 }).map((_, i) => {
      const t = (i + 0.5) / 16
      const px = t * MAP_W
      const py = y + 26 * 4 * t * (1 - t) * 0.5 * 2
      return <path key={i} className="city-sway" style={{ animationDelay: `${i * 0.2}s` }} d={`M${px - 10} ${py} h20 l-10 18 Z`} fill={colors[i % colors.length]} />
    })}
  </g>
)

const Buoys: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <path d={`M0 ${y} Q${MAP_W / 2} ${y + 26} ${MAP_W} ${y}`} fill="none" stroke="#e8d3a8" strokeWidth="3" />
    {Array.from({ length: 12 }).map((_, i) => {
      const t = (i + 0.5) / 12
      const px = t * MAP_W
      const py = y + 26 * 4 * t * (1 - t) * 0.5 * 2
      return (
        <g key={i} className="city-sway" style={{ animationDelay: `${i * 0.25}s` }}>
          <circle cx={px} cy={py + 9} r="8" fill={i % 2 ? '#e4572e' : '#fffaf0'} stroke="#7a5230" strokeWidth="1" />
          <rect x={px - 8} y={py + 7} width="16" height="4" fill={i % 2 ? '#fffaf0' : '#e4572e'} />
        </g>
      )
    })}
  </g>
)

const Torch: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 2} y={y - 26} width="4" height="26" rx="2" fill="#6b4423" />
    <rect x={x - 5} y={y - 30} width="10" height="6" rx="2" fill="#8a5a3b" />
    <Flame x={x} y={y - 30} s={0.8} />
  </g>
)

const Stamp: React.FC<{ x: number; y: number; text: string; color: string }> = ({ x, y, text, color }) => (
  <g>
    <rect x={x - text.length * 4.6 - 10} y={y - 13} width={text.length * 9.2 + 20} height="20" rx="4" fill={color} />
    <text x={x} y={y + 1.5} textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" fontFamily="Archivo, system-ui, sans-serif">
      {text}
    </text>
  </g>
)

export const CANDLES_KIT: WorldKit = {
  districts: ['Cañón del Toro', 'Meseta de las Velas', 'Oasis del Oscilador', 'Cordillera Cripto', 'Paso del Riesgo', 'Delta DeFi'],
  stageColor: '#8f4a1f',
  finaleLabel: 'La Gran Vela',
  lane: { width: 3.5, dash: '6 10', opacity: 1 },
  Tree: Cactus,
  Stall: Tent,
  Plaza: ({ x, y }) => (
    <g>
      <circle cx={x} cy={y} r="44" fill="var(--walk)" stroke="var(--walk-edge)" strokeWidth="3" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2
        return <circle key={i} cx={x + Math.cos(a) * 22} cy={y + Math.sin(a) * 22} r="5" fill="var(--rock-2)" />
      })}
      <path d={`M${x - 12} ${y + 8} L${x + 12} ${y - 2} M${x - 12} ${y - 2} L${x + 12} ${y + 8}`} stroke="#6b4423" strokeWidth="5" strokeLinecap="round" />
      <Flame x={x} y={y + 6} s={1.2} />
      {[0, 90, 180, 270].map((deg) => (
        <Cactus key={deg} x={x + Math.cos((deg * Math.PI) / 180) * 58} y={y + Math.sin((deg * Math.PI) / 180) * 58} r={10} />
      ))}
    </g>
  ),
  Duo: ({ x, base }) => (
    <g>
      <Mesa x={x - 72} base={base} w={52} h={72} up />
      <Mesa x={x + 8} base={base} w={44} h={50} up={false} />
    </g>
  ),
  Block: ({ x, base, seed }) => (
    <g>
      <Mesa x={x - 80} base={base} w={46} h={98} up={seed % 2 === 0} />
      <Mesa x={x - 28} base={base} w={56} h={118} up />
      <Mesa x={x + 34} base={base} w={44} h={84} up={seed % 2 === 1} />
    </g>
  ),
  Landmark: ({ x, base }) => (
    <g>
      <path d={`M${x - 70} ${base} Q${x - 50} ${base - 96} ${x} ${base - 100} Q${x + 56} ${base - 96} ${x + 74} ${base} Z`} fill="var(--rock)" />
      <path d={`M${x - 70} ${base} Q${x - 50} ${base - 96} ${x} ${base - 100} Q${x - 26} ${base - 60} ${x - 30} ${base} Z`} fill="var(--rock-2)" opacity="0.6" />
      <path d={`M${x - 22} ${base} v-34 a22 22 0 0 1 44 0 v34 Z`} fill="#2a1d10" />
      <path d={`M${x - 26} ${base - 34} a26 26 0 0 1 52 0`} stroke="#8a5a3b" strokeWidth="6" fill="none" />
      <line x1={x - 60} x2={x + 64} y1={base + 4} y2={base + 4} stroke="#6b4423" strokeWidth="3" />
      <g>
        <rect x={x + 30} y={base - 18} width="30" height="16" rx="3" fill="#5c6670" />
        <circle cx={x + 36} cy={base - 1} r="4" fill="#2a2f3a" />
        <circle cx={x + 54} cy={base - 1} r="4" fill="#2a2f3a" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={x + 38 + i * 7} cy={base - 20} r="4" fill="#E3A92F" />
        ))}
      </g>
      <Stamp x={x} y={base - 72} text="MINA" color="#8f4a1f" />
    </g>
  ),
  Finale: ({ x, y, isOpen }) => (
    <g className={isOpen ? 'city-vault-open' : ''}>
      <path d={`M${x - 170} ${y + 6} Q${x} ${y - 40} ${x + 170} ${y + 6} Z`} fill="var(--rock)" />
      <rect x={x - 4} y={y - 214} width="8" height="70" rx="3" fill="#227a4e" />
      <rect x={x - 62} y={y - 160} width="124" height="152" rx="12" fill="#2f9e66" />
      <rect x={x + 18} y={y - 160} width="44" height="152" rx="12" fill="#227a4e" opacity="0.45" />
      <line x1={x} y1={y - 214} x2={x} y2={y - 250} stroke="#6b4423" strokeWidth="3" />
      <path d={`M${x} ${y - 250} l30 9 l-30 9 Z`} fill="#E3A92F" />
      <circle cx={x} cy={y - 66} r="40" fill="#1d6b45" />
      <g className="city-vault">
        <circle cx={x} cy={y - 66} r="34" fill="var(--ink)" />
        <circle cx={x} cy={y - 66} r="26" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <rect key={a} x={x - 2.5} y={y - 94} width="5" height="16" rx="2.5" fill="#fff" opacity="0.8" transform={`rotate(${a} ${x} ${y - 66})`} />
        ))}
        <circle cx={x} cy={y - 66} r="8" fill="#E3A92F" />
      </g>
      <Stamp x={x} y={y - 128} text="GRAN VELA" color="#8f4a1f" />
    </g>
  ),
  Garland: ({ y }) => <Pennants y={y} colors={['#e4572e', '#f2c14e', '#2f9e66', '#2e86ab', '#d4574c']} />,
  Lamp: Torch,
  Filler: ({ cx, cy, seed }) => (
    <g>
      <ellipse cx={cx - 6} cy={cy + 6} rx="26" ry="16" fill="var(--rock)" />
      <ellipse cx={cx + 16} cy={cy + 10} rx="16" ry="11" fill="var(--rock-2)" />
      <ellipse cx={cx - 12} cy={cy + 2} rx="10" ry="5" fill="#fff" opacity="0.18" />
      {seed % 3 === 0 && <Cactus x={cx + 24} y={cy - 10} r={9} />}
    </g>
  ),
  Street: (props) => <WaterStreet {...props} vessel="canoe" />,
  Crossing: ({ rx, sy }) => <Bridge rx={rx} sy={sy} tone="#a8763f" />,
  Vehicle: () => <Wagon color="#fff3d6" />,
  Front: ({ reduced }) => (
    <g>
      {!reduced && (
        <g className="world-drift" style={{ animationDuration: '60s' }}>
          <Balloon x={0} y={260} color="#e4572e" delay={0} />
        </g>
      )}
      <Balloon x={520} y={120} color="#f2c14e" delay={1.4} />
      <Balloon x={80} y={620} color="#2e86ab" delay={2.6} />
    </g>
  ),
}

const TreasureChest: React.FC<{ x: number; y: number; isOpen: boolean }> = ({ x, y, isOpen }) => {
  const top = y - 92
  const wood = '#9a5b2e'
  const woodDark = '#6e3b1a'
  const gold = '#E8B23A'
  const goldDark = '#b07d14'
  const lidPath = `M${x - 96} ${top} V${top - 22} Q${x - 96} ${top - 62} ${x} ${top - 62} Q${x + 96} ${top - 62} ${x + 96} ${top - 22} V${top} Z`
  return (
    <g className={isOpen ? 'city-vault-open' : ''}>
      <defs>
        <clipPath id="chest-lid-clip">
          <path d={lidPath} />
        </clipPath>
        <radialGradient id="chest-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff2b0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffd66b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y - 8} rx="200" ry="56" fill="var(--grass-2)" />
      <ellipse cx={x + 8} cy={y + 2} rx="120" ry="18" fill="var(--shade)" />
      <Palm x={x - 150} y={y - 28} r={22} />
      <Palm x={x + 160} y={y - 22} r={20} />
      <g>
        <line x1={x + 120} y1={y - 4} x2={x + 140} y2={y - 70} stroke="#7a5230" strokeWidth="5" strokeLinecap="round" />
        <path d={`M${x + 112} ${y + 6} l18 -14 l10 8 l-10 18 Z`} fill="#9aa4ad" stroke="#5c6670" strokeWidth="1.5" />
      </g>
      <path d={`M${x - 140} ${y - 30} l14 14 M${x - 126} ${y - 30} l-14 14`} stroke="#c0392b" strokeWidth="5" strokeLinecap="round" />
      {[[-118, 0], [-104, 6], [104, 4]].map(([dx, dy], i) => (
        <ellipse key={i} cx={x + dx} cy={y + dy} rx="8" ry="4" fill={gold} stroke={goldDark} strokeWidth="1.5" />
      ))}

      <g className="world-gold">
        <circle cx={x} cy={top - 40} r="96" fill="url(#chest-glow)" />
        <path d={`M${x - 88} ${top + 4} Q${x - 60} ${top - 40} ${x} ${top - 44} Q${x + 60} ${top - 40} ${x + 88} ${top + 4} Z`} fill={gold} />
        {Array.from({ length: 14 }).map((_, i) => {
          const cx = x - 72 + (i % 7) * 24 + (i > 6 ? 12 : 0)
          const cy = top - (i > 6 ? 30 : 10) + ((i * 7) % 5)
          return <ellipse key={i} cx={cx} cy={cy} rx="10" ry="5" fill="#ffd66b" stroke={goldDark} strokeWidth="1.2" />
        })}
        <path d={`M${x - 20} ${top - 36} l10 -14 l10 14 l-10 10 Z`} fill="#e4572e" stroke="#9e2f16" strokeWidth="1.5" />
        <path d={`M${x + 26} ${top - 30} l8 -11 l8 11 l-8 8 Z`} fill="#2e86ab" stroke="#1b5772" strokeWidth="1.5" />
        <circle cx={x + 52} cy={top - 18} r="6" fill="#3f9a57" stroke="#2f7a44" strokeWidth="1.5" />
        {[[-50, -70], [40, -84], [80, -50], [-84, -40]].map(([dx, dy], i) => (
          <path key={i} className="world-sparkle" style={{ animationDelay: `${i * 0.55}s` }} d={`M${x + dx} ${top + dy - 9} L${x + dx + 2.5} ${top + dy - 2.5} L${x + dx + 9} ${top + dy} L${x + dx + 2.5} ${top + dy + 2.5} L${x + dx} ${top + dy + 9} L${x + dx - 2.5} ${top + dy + 2.5} L${x + dx - 9} ${top + dy} L${x + dx - 2.5} ${top + dy - 2.5} Z`} fill="#fff6c2" />
        ))}
      </g>

      <rect x={x - 96} y={top} width="192" height="86" rx="6" fill={wood} stroke={woodDark} strokeWidth="3" />
      {[top + 28, top + 56].map((ly) => (
        <line key={ly} x1={x - 94} x2={x + 94} y1={ly} y2={ly} stroke={woodDark} strokeWidth="2" opacity="0.55" />
      ))}
      <rect x={x - 96} y={top + 70} width="192" height="16" rx="4" fill={woodDark} opacity="0.35" />
      {[-70, 56].map((dx) => (
        <g key={dx}>
          <rect x={x + dx} y={top} width="14" height="86" fill={gold} stroke={goldDark} strokeWidth="1.5" />
          {[14, 42, 70].map((ry) => (
            <circle key={ry} cx={x + dx + 7} cy={top + ry} r="2.6" fill={goldDark} />
          ))}
        </g>
      ))}
      <path d={`M${x - 96} ${y - 20} h22 v14 h-22 Z M${x + 74} ${y - 20} h22 v14 h-22 Z`} fill={gold} stroke={goldDark} strokeWidth="1.5" />

      <g className="world-lid">
        <path d={lidPath} fill={wood} stroke={woodDark} strokeWidth="3" />
        <g clipPath="url(#chest-lid-clip)">
          <path d={`M${x - 96} ${top - 30} Q${x} ${top - 52} ${x + 96} ${top - 30}`} stroke={woodDark} strokeWidth="2" fill="none" opacity="0.55" />
          <path d={`M${x - 70} ${top - 70} Q${x - 30} ${top - 66} ${x} ${top - 66} Q${x + 30} ${top - 66} ${x + 70} ${top - 70}`} stroke="#fff" strokeOpacity="0.18" strokeWidth="6" fill="none" />
          {[-70, 56].map((dx) => (
            <rect key={dx} x={x + dx} y={top - 70} width="14" height="70" fill={gold} stroke={goldDark} strokeWidth="1.5" />
          ))}
        </g>
        <rect x={x - 100} y={top - 8} width="200" height="12" rx="4" fill={gold} stroke={goldDark} strokeWidth="2" />
        <rect x={x - 17} y={top - 18} width="34" height="40" rx="6" fill={gold} stroke={goldDark} strokeWidth="2" />
        <circle cx={x} cy={top} r="5" fill="#3d2410" />
        <path d={`M${x - 3} ${top + 2} h6 l2 10 h-10 Z`} fill="#3d2410" />
      </g>
    </g>
  )
}

export const ISLAND_KIT: WorldKit = {
  districts: ['Playa del Novato', 'Bahía del Capitán', 'Arrecife de Indicadores', 'Faro Cripto', 'Cabo del Riesgo', 'Laguna DeFi'],
  stageColor: '#0b6e8a',
  finaleLabel: 'El cofre del tesoro',
  lane: { width: 60, dash: '2 9', opacity: 0.35 },
  Tree: Palm,
  Stall: Hut,
  Plaza: ({ x, y }) => (
    <g>
      <circle cx={x} cy={y} r="46" fill="var(--grass-2)" />
      <circle cx={x} cy={y} r="32" fill="var(--water)" />
      <circle cx={x} cy={y} r="20" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" className="city-ripple" />
      <circle cx={x} cy={y} r="20" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" className="city-ripple" style={{ animationDelay: '1.3s' }} />
      <ellipse cx={x + 6} cy={y + 4} rx="9" ry="6" fill="#b48450" />
      {[30, 150, 260].map((deg) => (
        <Palm key={deg} x={x + Math.cos((deg * Math.PI) / 180) * 60} y={y + Math.sin((deg * Math.PI) / 180) * 56} r={10} />
      ))}
    </g>
  ),
  Duo: ({ x, base }) => (
    <g>
      <Shadow x={x - 40} y={base + 2} rx={30} />
      <path d={`M${x - 58} ${base} L${x - 50} ${base - 96} L${x - 30} ${base - 96} L${x - 22} ${base} Z`} fill="#fffaf0" stroke="#e8d3a8" strokeWidth="1.5" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${x - 56 + i * 2.6} ${base - 20 - i * 30} L${x - 24 - i * 2.6} ${base - 20 - i * 30} L${x - 25.5 - i * 2.6} ${base - 34 - i * 30} L${x - 54.5 + i * 2.6} ${base - 34 - i * 30} Z`} fill="#e4572e" />
      ))}
      <rect x={x - 52} y={base - 112} width="24" height="16" rx="3" fill="#2a2f3a" />
      <circle cx={x - 40} cy={base - 104} r="6" fill="#ffd66b" />
      <path className="world-beam" d={`M${x - 40} ${base - 104} L${x + 60} ${base - 140} L${x + 60} ${base - 70} Z`} fill="#ffd66b" />
      <path d={`M${x - 58} ${base - 112} L${x - 40} ${base - 126} L${x - 22} ${base - 112} Z`} fill="#e4572e" />
      <g className="world-bob">
        <path d={`M${x + 10} ${base - 6} L${x + 52} ${base - 6} L${x + 44} ${base + 4} L${x + 18} ${base + 4} Z`} fill="#8a5a3b" />
      </g>
    </g>
  ),
  Block: ({ x, base }) => (
    <g>
      <Shadow x={x} y={base + 4} rx={78} />
      <path d={`M${x - 78} ${base - 30} L${x + 80} ${base - 30} L${x + 62} ${base} L${x - 64} ${base} Z`} fill="#7a5230" />
      <path d={`M${x - 78} ${base - 30} L${x + 80} ${base - 30}`} stroke="#5a3a1e" strokeWidth="4" />
      {[-50, -20, 10, 40].map((dx) => (
        <circle key={dx} cx={x + dx} cy={base - 16} r="4" fill="#2a1d10" />
      ))}
      <line x1={x - 24} y1={base - 30} x2={x - 24} y2={base - 136} stroke="#4a3018" strokeWidth="4" />
      <line x1={x + 30} y1={base - 30} x2={x + 30} y2={base - 116} stroke="#4a3018" strokeWidth="4" />
      <path d={`M${x - 22} ${base - 130} Q${x + 10} ${base - 100} ${x - 22} ${base - 46} Z`} fill="#fffaf0" />
      <path d={`M${x + 32} ${base - 110} Q${x + 60} ${base - 84} ${x + 32} ${base - 46} Z`} fill="#fffaf0" />
      <path d={`M${x - 24} ${base - 136} l-20 6 l20 6 Z`} fill="#1b1b1b" />
      <circle cx={x - 32} cy={base - 130} r="2.4" fill="#fff" />
    </g>
  ),
  Landmark: ({ x, base }) => (
    <g>
      <rect x={x - 62} y={base - 56} width="124" height="60" fill="var(--shade)" rx="3" transform="translate(5 2)" />
      <rect x={x - 62} y={base - 58} width="124" height="58" fill="#c9b79a" stroke="#a8977a" strokeWidth="2" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={x - 62 + i * 19} y={base - 70} width="12" height="12" fill="#c9b79a" stroke="#a8977a" strokeWidth="2" />
      ))}
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4, 5].map((c) => <rect key={`${r}-${c}`} x={x - 58 + c * 20 + (r % 2) * 10} y={base - 50 + r * 14} width="16" height="10" fill="none" stroke="#a8977a" strokeWidth="1" />),
      )}
      <path d={`M${x - 16} ${base} v-26 a16 16 0 0 1 32 0 v26 Z`} fill="#4a3018" />
      <line x1={x + 46} y1={base - 70} x2={x + 46} y2={base - 112} stroke="#4a3018" strokeWidth="3" />
      <path d={`M${x + 47} ${base - 112} l26 8 l-26 8 Z`} fill="#e4572e" className="city-sway" />
      <Stamp x={x - 10} y={base - 84} text="FUERTE" color="#0b6e8a" />
    </g>
  ),
  Finale: ({ x, y, isOpen }) => <TreasureChest x={x} y={y} isOpen={isOpen} />,
  Garland: Buoys,
  Lamp: Torch,
  Filler: ({ cx, cy, seed }) => (
    <g>
      <ellipse cx={cx} cy={cy + 4} rx="34" ry="18" fill="var(--grass-2)" />
      {seed % 2 === 0 ? (
        <Palm x={cx - 4} y={cy + 4} r={11} />
      ) : (
        <g>
          <path d={`M${cx - 10} ${cy} l3 -7 l3 7 l7 1 l-5 5 l2 7 l-7 -4 l-7 4 l2 -7 l-5 -5 Z`} fill="#f2875a" />
          <path d={`M${cx + 12} ${cy + 8} q6 -10 12 0 Z`} fill="#fff1e0" stroke="#e8c9a8" strokeWidth="1" />
        </g>
      )}
    </g>
  ),
  Street: (props) => <WaterStreet {...props} vessel="boat" />,
  Crossing: ({ rx, sy }) => <Bridge rx={rx} sy={sy} tone="#a0703f" />,
  Vehicle: () => <Wagon color="#e8d3a8" />,
  Backdrop: ({ h }) => (
    <g>
      <rect x="0" y="0" width="56" height={h} fill="var(--sea)" />
      <rect x={MAP_W - 56} y="0" width="56" height={h} fill="var(--sea)" />
      <rect x="44" y="0" width="16" height={h} fill="var(--sea-2)" opacity="0.6" />
      <rect x={MAP_W - 60} y="0" width="16" height={h} fill="var(--sea-2)" opacity="0.6" />
      {Array.from({ length: Math.ceil(h / 70) }).map((_, i) => (
        <g key={i}>
          <path d={`M8 ${i * 70 + 30} q8 -6 16 0 t16 0`} stroke="#fff" strokeOpacity="0.4" strokeWidth="2" fill="none" />
          <path d={`M${MAP_W - 44} ${i * 70 + 60} q8 -6 16 0 t16 0`} stroke="#fff" strokeOpacity="0.4" strokeWidth="2" fill="none" />
        </g>
      ))}
    </g>
  ),
}
