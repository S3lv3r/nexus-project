import React from 'react'

export const NOTE_STYLES = `
.note-home{--ink:color-mix(in srgb,var(--primary) 86%,var(--text));--ink-2:color-mix(in srgb,#5b3e9e 72%,var(--text));--ink-3:color-mix(in srgb,#a8323e 75%,var(--text));--paper:color-mix(in srgb,var(--primary) 6%,var(--surface));--paper-2:color-mix(in srgb,var(--primary) 11%,var(--surface));--rule:color-mix(in srgb,var(--ink) 22%,transparent);font-family:var(--font-body);font-size:16px;color:var(--text)}
:root:is([data-theme="dark"],[data-theme="terminal"],[data-theme="aurora"],[data-theme="neon"],[data-theme="sunset"],[data-theme="ocean"]) .note-home{--ink:color-mix(in srgb,var(--primary) 88%,var(--text));--ink-2:color-mix(in srgb,#b9a4ff 80%,var(--text));--ink-3:color-mix(in srgb,#ff8f9a 82%,var(--text));--paper:color-mix(in srgb,var(--primary) 7%,var(--bg-alt));--paper-2:color-mix(in srgb,var(--primary) 13%,var(--bg-alt))}
.note-display{font-family:var(--font-display);font-stretch:calc(var(--display-stretch) + 4%);letter-spacing:calc(var(--display-tracking) - 0.005em)}
.note-wide{font-family:"Archivo","Schibsted Grotesk",system-ui,sans-serif;font-stretch:125%;letter-spacing:.02em}
.note-num{font-variant-numeric:tabular-nums lining-nums}
.note-home ::selection{background:color-mix(in srgb,var(--ink) 25%,transparent)}
.note-paper{background-color:var(--paper);background-image:repeating-linear-gradient(115deg,transparent 0 9px,color-mix(in srgb,var(--ink) 4%,transparent) 9px 10px);border:1px solid var(--rule)}
.note-btn{display:inline-flex;align-items:center;justify-content:center;gap:.55rem;height:3.25rem;padding:0 1.6rem;border-radius:999px;font-family:"Archivo","Schibsted Grotesk",system-ui,sans-serif;font-stretch:108%;font-weight:700;font-size:1rem;letter-spacing:-.005em;transition:transform .16s cubic-bezier(.23,1,.32,1),background-color .2s,border-color .2s,color .2s;cursor:pointer}
.note-btn:active{transform:scale(.97)}
.note-btn:focus-visible{outline:2px solid var(--ink);outline-offset:3px}
.note-btn-ink{background:var(--ink);color:var(--bg)}
.note-btn-ink:hover{background:color-mix(in srgb,var(--ink) 88%,var(--text))}
.note-btn-line{border:1.5px solid color-mix(in srgb,var(--ink) 45%,transparent);color:var(--ink);background:transparent}
.note-btn-line:hover{border-color:var(--ink);background:color-mix(in srgb,var(--ink) 6%,transparent)}
.note-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;backdrop-filter:var(--card-blur);-webkit-backdrop-filter:var(--card-blur)}
.note-link{transition:border-color .2s,transform .3s cubic-bezier(.23,1,.32,1)}
.note-link:hover{border-color:color-mix(in srgb,var(--ink) 45%,var(--border));transform:translateY(-2px)}
.note-rosette{transform-origin:center;transform-box:fill-box;transition:transform 1.6s cubic-bezier(.23,1,.32,1)}
.note-bill:hover .note-rosette{transform:rotate(14deg)}
.note-bill:hover .note-rosette-alt{transform:rotate(-10deg)}
.note-enter{animation:note-enter .9s cubic-bezier(.23,1,.32,1) both}
@keyframes note-enter{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.note-thread{background:repeating-linear-gradient(180deg,var(--ink-2) 0 14px,color-mix(in srgb,var(--ink-2) 70%,var(--surface)) 14px 16px)}
.note-scroll{animation:note-scroll 22s linear infinite}
@keyframes note-scroll{from{transform:translateX(0)}to{transform:translateX(-400px)}}
.note-shine{background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.2) 50%,transparent 58%);background-size:260% 100%;animation:note-shine 7s ease-in-out infinite}
@keyframes note-shine{0%{background-position:160% 0}60%,100%{background-position:-60% 0}}
.note-ring{background:conic-gradient(from 0deg,var(--ink),var(--ink-2),var(--ink-3),var(--ink));animation:note-spin 8s linear infinite}
@keyframes note-spin{to{transform:rotate(360deg)}}
.rail-fade{-webkit-mask-image:linear-gradient(to right,#000 85%,transparent);mask-image:linear-gradient(to right,#000 85%,transparent)}
@media (prefers-reduced-motion:reduce){
.note-enter,.note-scroll,.note-shine,.note-ring{animation:none!important}
.note-rosette,.note-link,.note-btn{transition:none}
}
`

export const guillocheRing = (cx: number, cy: number, radius: number, amp: number, lobes: number, strands: number, twist = 0): string => {
  const steps = 900
  let d = ''
  for (let k = 0; k < strands; k++) {
    const phase = (k / strands) * Math.PI * 2
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * Math.PI * 2
      const r = radius + amp * Math.sin(lobes * t + phase) + twist * Math.sin((lobes / 2) * t - phase)
      const x = cx + r * Math.cos(t)
      const y = cy + r * Math.sin(t)
      d += `${s === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    }
  }
  return d
}

export const ROSETTE_A = guillocheRing(160, 160, 122, 20, 11, 18) + guillocheRing(160, 160, 80, 14, 8, 14) + guillocheRing(160, 160, 44, 8, 6, 10)
export const ROSETTE_B = guillocheRing(160, 160, 126, 18, 14, 16, 6) + guillocheRing(160, 160, 88, 16, 9, 14)
export const ROSETTE_SMALL = guillocheRing(50, 50, 36, 8, 7, 12)

const WAVE_LINES = Array.from({ length: 14 }).map((_, i) => {
  const y0 = 10 + i * 7
  let d = `M0 ${y0}`
  for (let x = 0; x <= 600; x += 10) {
    d += ` L${x} ${(y0 + Math.sin(x / 38 + i * 0.45) * 6).toFixed(1)}`
  }
  return d
})

export const Rosette: React.FC<{ className?: string; variant?: 'a' | 'b' }> = ({ className = '', variant = 'a' }) => (
  <svg viewBox="0 0 320 320" className={className} aria-hidden="true">
    <path d={variant === 'a' ? ROSETTE_A : ROSETTE_B} fill="none" stroke="var(--ink)" strokeWidth="0.3" strokeOpacity="0.45" className={variant === 'a' ? 'note-rosette' : 'note-rosette note-rosette-alt'} />
  </svg>
)

export const SmallRosette: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <path d={ROSETTE_SMALL} fill="none" stroke="var(--ink)" strokeWidth="0.6" strokeOpacity="0.7" />
  </svg>
)

export const WaveField: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 600 110" preserveAspectRatio="none" className={className} aria-hidden="true">
    {WAVE_LINES.map((d, i) => (
      <path key={i} d={d} fill="none" stroke="var(--ink)" strokeWidth="0.6" strokeOpacity="0.28" />
    ))}
  </svg>
)

const MICROTEXT = 'CLEVER · TRADING · BLOCKCHAIN · FINANZAS DIGITALES · '.repeat(14)

export const Microtext: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`note-wide overflow-hidden whitespace-nowrap text-[7px] font-semibold leading-none text-[var(--ink)] opacity-60 ${className}`} aria-hidden="true">
    {MICROTEXT}
  </div>
)
