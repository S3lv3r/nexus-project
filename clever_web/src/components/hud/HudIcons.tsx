import React from 'react'

export type HudIconKey =
  | 'book' | 'bulb' | 'chart' | 'user' | 'users' | 'broker' | 'bank' | 'bars' | 'layers' | 'drop' | 'swap' | 'doc'
  | 'globe' | 'apple' | 'calendar' | 'trendUp' | 'arrowUpRight' | 'arrowDownRight' | 'info' | 'bolt' | 'sun'
  | 'wave' | 'mountain' | 'note' | 'basket' | 'bitcoin' | 'chevronUp' | 'chevronDown' | 'chevronLeft' | 'chevronRight' | 'mouse' | 'arrowRight' | 'candles' | 'sliders' | 'alert' | 'scroll'

const Svg: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = 'h-5 w-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
)

type IconProps = { className?: string }

export const HUD_ICONS: Record<HudIconKey, React.FC<IconProps>> = {
  book: (p) => (<Svg {...p}><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z" /><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z" /></Svg>),
  bulb: (p) => (<Svg {...p}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" /></Svg>),
  chart: (p) => (<Svg {...p}><path d="M4 4v16h16" /><path d="M8 15l3-4 3 2 4-6" /></Svg>),
  user: (p) => (<Svg {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" /></Svg>),
  users: (p) => (<Svg {...p}><circle cx="9" cy="8" r="3" /><path d="M3 19c0-3.3 2.7-5 6-5s6 1.7 6 5" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14c3 0 5 1.5 5 4" /></Svg>),
  broker: (p) => (<Svg {...p}><circle cx="12" cy="12" r="2.2" /><path d="M3 12h5M16 12h5M6 9l-3 3 3 3M18 9l3 3-3 3" /></Svg>),
  bank: (p) => (<Svg {...p}><path d="M3 9l9-5 9 5" /><path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9" /><path d="M3 20h18" /></Svg>),
  bars: (p) => (<Svg {...p}><path d="M5 20v-8M10 20V8M15 20v-7M20 20V5" /></Svg>),
  layers: (p) => (<Svg {...p}><path d="M12 4l8 4-8 4-8-4z" /><path d="M4 12l8 4 8-4M4 16l8 4 8-4" /></Svg>),
  drop: (p) => (<Svg {...p}><path d="M12 3c3.5 4.2 6 7 6 10a6 6 0 0 1-12 0c0-3 2.5-5.8 6-10z" /></Svg>),
  swap: (p) => (<Svg {...p}><path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4" /></Svg>),
  doc: (p) => (<Svg {...p}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></Svg>),
  globe: (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></Svg>),
  apple: (p) => (<Svg {...p}><path d="M12 8c-2-2-6-1-6 4 0 4 2 8 4 8 1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 4-4 4-8 0-5-4-6-6-4z" /><path d="M12 8c0-2 1-3 3-4" /></Svg>),
  calendar: (p) => (<Svg {...p}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></Svg>),
  trendUp: (p) => (<Svg {...p}><path d="M4 17l6-6 4 4 6-8" /><path d="M15 7h5v5" /></Svg>),
  arrowUpRight: (p) => (<Svg {...p}><path d="M7 17L17 7M9 7h8v8" /></Svg>),
  arrowDownRight: (p) => (<Svg {...p}><path d="M7 7l10 10M17 9v8H9" /></Svg>),
  info: (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Svg>),
  bolt: (p) => (<Svg {...p}><path d="M13 3L5 13h6l-1 8 8-10h-6z" /></Svg>),
  sun: (p) => (<Svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" /></Svg>),
  wave: (p) => (<Svg {...p}><path d="M3 15c2-4 4-4 6 0s4 4 6 0 4-4 6 0" /><path d="M3 9c2-4 4-4 6 0s4 4 6 0 4-4 6 0" opacity="0.5" /></Svg>),
  mountain: (p) => (<Svg {...p}><path d="M3 19l6-10 4 6 3-4 5 8z" /></Svg>),
  note: (p) => (<Svg {...p}><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9h.01M18 15h.01" /></Svg>),
  basket: (p) => (<Svg {...p}><path d="M5 10h14l-1.5 9h-11z" /><path d="M9 10l3-6 3 6" /></Svg>),
  bitcoin: (p) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M10 8h3a2 2 0 0 1 0 4h-3zM10 12h3.5a2 2 0 0 1 0 4H10zM10 6.5V8M10 16v1.5M13 6.5V8M13 16v1.5" /></Svg>),
  chevronUp: (p) => (<Svg {...p}><path d="M6 15l6-6 6 6" /></Svg>),
  chevronDown: (p) => (<Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>),
  chevronLeft: (p) => (<Svg {...p}><path d="M15 6l-6 6 6 6" /></Svg>),
  chevronRight: (p) => (<Svg {...p}><path d="M9 6l6 6-6 6" /></Svg>),
  candles: (p) => (<Svg {...p}><path d="M8 4v3M8 16v4M16 3v3M16 14v5" /><rect x="6" y="7" width="4" height="9" rx="1" /><rect x="14" y="6" width="4" height="8" rx="1" /></Svg>),
  sliders: (p) => (<Svg {...p}><path d="M4 7h9M19 7h1M4 17h1M11 17h9" /><circle cx="16" cy="7" r="2.2" /><circle cx="8" cy="17" r="2.2" /></Svg>),
  alert: (p) => (<Svg {...p}><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17h.01" /></Svg>),
  scroll: (p) => (<Svg {...p}><path d="M6 4h9a3 3 0 0 1 3 3v13H9a3 3 0 0 1-3-3z" /><path d="M9 8h6M9 12h6M9 16h3" /></Svg>),
  mouse: (p) => (<Svg {...p}><rect x="7" y="3" width="10" height="18" rx="5" /></Svg>),
  arrowRight: (p) => (<Svg {...p}><path d="M4 12h16M14 6l6 6-6 6" /></Svg>),
}

/** Colores pastel para los círculos de icono. */
export type HudToneKey = 'sky' | 'violet' | 'emerald' | 'amber' | 'rose' | 'teal'

export const HUD_TONES: Record<HudToneKey, { circle: string; chip: string; text: string; box: string; dot: string }> = {
  sky: { circle: 'bg-gradient-to-br from-sky-100 to-sky-200/80 text-sky-600', chip: 'bg-sky-50 text-sky-700 ring-sky-100', text: 'text-sky-700', box: 'bg-sky-50 text-sky-600 ring-1 ring-sky-100', dot: 'bg-sky-400' },
  violet: { circle: 'bg-gradient-to-br from-violet-100 to-violet-200/80 text-violet-600', chip: 'bg-violet-50 text-violet-700 ring-violet-100', text: 'text-violet-700', box: 'bg-violet-50 text-violet-600 ring-1 ring-violet-100', dot: 'bg-violet-400' },
  emerald: { circle: 'bg-gradient-to-br from-emerald-100 to-emerald-200/80 text-emerald-600', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-100', text: 'text-emerald-700', box: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100', dot: 'bg-emerald-400' },
  amber: { circle: 'bg-gradient-to-br from-amber-100 to-amber-200/80 text-amber-600', chip: 'bg-amber-50 text-amber-700 ring-amber-100', text: 'text-amber-700', box: 'bg-amber-50 text-amber-600 ring-1 ring-amber-100', dot: 'bg-amber-400' },
  rose: { circle: 'bg-gradient-to-br from-rose-100 to-rose-200/80 text-rose-600', chip: 'bg-rose-50 text-rose-700 ring-rose-100', text: 'text-rose-700', box: 'bg-rose-50 text-rose-600 ring-1 ring-rose-100', dot: 'bg-rose-400' },
  teal: { circle: 'bg-gradient-to-br from-teal-100 to-teal-200/80 text-teal-600', chip: 'bg-teal-50 text-teal-700 ring-teal-100', text: 'text-teal-700', box: 'bg-teal-50 text-teal-600 ring-1 ring-teal-100', dot: 'bg-teal-400' },
}