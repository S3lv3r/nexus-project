import React from 'react'

export type HudIconKey =
  | 'book' | 'bulb' | 'chart' | 'user' | 'users' | 'broker' | 'bank' | 'bars' | 'layers' | 'drop' | 'swap' | 'doc'
  | 'globe' | 'apple' | 'calendar' | 'trendUp' | 'arrowUpRight' | 'arrowDownRight' | 'info' | 'bolt' | 'sun'
  | 'wave' | 'mountain' | 'note' | 'basket' | 'bitcoin' | 'chevronUp' | 'chevronDown' | 'chevronLeft' | 'chevronRight' | 'mouse' | 'arrowRight' | 'candles' | 'sliders' | 'alert' | 'scroll'
  | 'wallet' | 'piggy' | 'card' | 'shield' | 'receipt' | 'hourglass' | 'newspaper' | 'calculator' | 'clock'

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
  wallet: (p) => (<Svg {...p}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" /><rect x="4" y="8" width="16" height="11" rx="2" /><path d="M16 13.5h.01" /></Svg>),
  piggy: (p) => (<Svg {...p}><path d="M5 11a6 5 0 0 1 11-2.5h2l1 2v3l-1.5.5-1 2.5h-2l-.5-1.5h-4l-.5 1.5h-2l-1-2.5A5 5 0 0 1 5 11z" /><path d="M10 6.5h3M15.5 11h.01" /></Svg>),
  card: (p) => (<Svg {...p}><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h3" /></Svg>),
  shield: (p) => (<Svg {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></Svg>),
  receipt: (p) => (<Svg {...p}><path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z" /><path d="M9 8h6M9 12h6M9 16h3" /></Svg>),
  hourglass: (p) => (<Svg {...p}><path d="M7 3h10M7 21h10" /><path d="M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" /></Svg>),
  newspaper: (p) => (<Svg {...p}><path d="M5 5h12v14H6.5A1.5 1.5 0 0 1 5 17.5z" /><path d="M17 9h2v8.5a1.5 1.5 0 0 1-3 0" /><path d="M8 8h6M8 12h6M8 15h4" /></Svg>),
  calculator: (p) => (<Svg {...p}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 14.5h.01M12 14.5h.01M16 14.5h.01M8 18h.01M12 18h4" /></Svg>),
  clock: (p) => (<Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Svg>),
}

export type HudToneKey = 'sky' | 'violet' | 'emerald' | 'amber' | 'rose' | 'teal'

const buildTone = (key: HudToneKey) => ({
  circle: `hud-tone-${key} hud-tone-circle`,
  chip: `hud-tone-${key} hud-tone-chip`,
  text: `hud-tone-${key} hud-tone-text`,
})

export const HUD_TONES: Record<HudToneKey, { circle: string; chip: string; text: string }> = {
  sky: buildTone('sky'),
  violet: buildTone('violet'),
  emerald: buildTone('emerald'),
  amber: buildTone('amber'),
  rose: buildTone('rose'),
  teal: buildTone('teal'),
}