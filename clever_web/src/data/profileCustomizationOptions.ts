import type {
  AvatarShape,
  BannerStyle,
  HomeGreeting,
  HomeLessonBg,
  HomeMainSection,
  HomeSideSection,
  FrameStyle,
  LearnWorld,
  NavStyle,
  ProfileCustomization,
  ProfileLayout,
  StatId,
  UnlockRule,
} from '../types/profileCustomization'

export const DEFAULT_CUSTOMIZATION: ProfileCustomization = {
  bannerStyle: 'guilloche',
  bannerColorA: '',
  bannerColorB: '',
  bannerSpeed: 1,
  frameStyle: 'solid',
  frameColor: '',
  avatarShape: 'circle',
  showLevelRing: true,
  status: '',
  statusIcon: 'fa-solid fa-book-open',
  pinnedAchievements: [],
  visibleStats: ['topics'],
  showStreakCalendar: false,
  showLevelJourney: false,
  glow: true,
  tilt: true,
  density: 'comfortable',
  profileLayout: 'credential',
  navStyle: 'bill',
  learnWorld: 'city',
  owned: [],
  adminMode: false,
  homeMain: ['lesson', 'topics'],
  homeSide: ['credential', 'details'],
  homeHidden: [],
  homeGreeting: 'continue',
  homeGreetingText: '',
  homeSidebarLeft: false,
  homeMascot: true,
  homeCredentialCover: false,
  homeCompact: false,
  homeLessonBg: 'bill',
}

export const HOME_MAIN_SECTIONS: { id: HomeMainSection; label: string; icon: string }[] = [
  { id: 'lesson', label: 'Tu lección actual', icon: 'fa-solid fa-play' },
  { id: 'topics', label: 'Temas del curso', icon: 'fa-solid fa-layer-group' },
]

export const HOME_SIDE_SECTIONS: { id: HomeSideSection; label: string; icon: string }[] = [
  { id: 'credential', label: 'Credencial', icon: 'fa-solid fa-id-card' },
  { id: 'details', label: 'Ficha de tu lección', icon: 'fa-solid fa-clipboard-list' },
]

export const HOME_GREETINGS: { id: HomeGreeting; label: string; text: string }[] = [
  { id: 'continue', label: 'Continuar', text: 'Continúa donde lo dejaste.' },
  { id: 'ready', label: 'Con energía', text: '¿Listo para aprender algo hoy?' },
  { id: 'market', label: 'De mercado', text: 'El mercado abre. Tú también.' },
  { id: 'custom', label: 'Mi frase', text: '' },
]

export const MAX_GREETING_LENGTH = 48

export const HOME_LESSON_BACKGROUNDS: { id: HomeLessonBg; label: string; icon: string; dark: boolean }[] = [
  { id: 'bill', label: 'Billete', icon: 'fa-solid fa-fingerprint', dark: false },
  { id: 'paper', label: 'Liso', icon: 'fa-regular fa-square', dark: false },
  { id: 'ink', label: 'Tinta', icon: 'fa-solid fa-fill-drip', dark: true },
  { id: 'aurora', label: 'Aurora', icon: 'fa-solid fa-gem', dark: true },
  { id: 'stars', label: 'Galaxia', icon: 'fa-solid fa-meteor', dark: true },
  { id: 'candles', label: 'Mercado', icon: 'fa-solid fa-chart-simple', dark: true },
  { id: 'waves', label: 'Olas', icon: 'fa-solid fa-water', dark: true },
  { id: 'skyline', label: 'Skyline', icon: 'fa-solid fa-city', dark: true },
]

export const MAX_PINNED_ACHIEVEMENTS = 3

export const MAX_STATUS_LENGTH = 60

interface UnlockableOption<T extends string> {
  id: T
  label: string
  description: string
  icon: string
  unlock?: UnlockRule
}

export const PROFILE_LAYOUTS: UnlockableOption<ProfileLayout>[] = [
  { id: 'credential', label: 'Credencial', description: 'Tu credencial de inversionista en papel moneda', icon: 'fa-solid fa-id-card' },
  { id: 'office', label: 'Oficina de trader', description: 'Una escena con tus monitores, tus temas y vista a la ciudad', icon: 'fa-solid fa-desktop' },
  { id: 'card', label: 'Carta coleccionable', description: 'Una carta holográfica que brilla al moverla', icon: 'fa-solid fa-clone' },
]

export const NAV_STYLES: UnlockableOption<NavStyle>[] = [
  { id: 'bill', label: 'Billete', description: 'Franja de microtexto y tinta que se desliza', icon: 'fa-solid fa-money-bill-wave' },
  { id: 'island', label: 'Isla flotante', description: 'Cápsula flotante que se encoge al bajar', icon: 'fa-solid fa-capsules' },
  { id: 'ticker', label: 'Ticker de lecciones', description: 'Cinta con las lecciones del curso en movimiento', icon: 'fa-solid fa-chart-line' },
  { id: 'sidebar', label: 'Lateral', description: 'Menú de iconos a la izquierda que se expande', icon: 'fa-solid fa-table-columns' },
]

export const LEARN_WORLDS: UnlockableOption<LearnWorld>[] = [
  { id: 'city', label: 'Ciudad financiera', description: 'Avenidas, mercados, la Bolsa y el Banco Central', icon: 'fa-solid fa-city' },
  { id: 'candles', label: 'Valle de las velas', description: 'Mesetas con forma de vela, globos y un río', icon: 'fa-solid fa-mountain-sun' },
  { id: 'island', label: 'Isla del tesoro', description: 'Muelles, barcos y un cofre al final del camino', icon: 'fa-solid fa-anchor' },
]

export const BANNER_STYLES: { id: BannerStyle; label: string; icon: string; unlock?: UnlockRule }[] = [
  { id: 'guilloche', label: 'Guilloché', icon: 'fa-solid fa-fingerprint' },
  { id: 'aurora', label: 'Aurora', icon: 'fa-solid fa-gem' },
  { id: 'candles', label: 'Mercado', icon: 'fa-solid fa-chart-simple' },
  { id: 'skyline', label: 'Skyline', icon: 'fa-solid fa-city' },
  { id: 'waves', label: 'Olas', icon: 'fa-solid fa-water' },
  { id: 'stars', label: 'Galaxia', icon: 'fa-solid fa-meteor' },
  { id: 'cover', label: 'Mi imagen', icon: 'fa-solid fa-image' },
]

export const FRAME_STYLES: { id: FrameStyle; label: string; icon: string; unlock?: UnlockRule }[] = [
  { id: 'none', label: 'Sin marco', icon: 'fa-regular fa-circle' },
  { id: 'solid', label: 'Sólido', icon: 'fa-solid fa-circle' },
  { id: 'pulse', label: 'Pulso', icon: 'fa-solid fa-heart-pulse' },
  { id: 'rainbow', label: 'Arcoíris', icon: 'fa-solid fa-palette' },
  { id: 'orbit', label: 'Órbita', icon: 'fa-solid fa-satellite' },
]

export const AVATAR_SHAPES: { id: AvatarShape; label: string; icon: string }[] = [
  { id: 'circle', label: 'Círculo', icon: 'fa-regular fa-circle' },
  { id: 'rounded', label: 'Redondeado', icon: 'fa-regular fa-square' },
  { id: 'hexagon', label: 'Hexágono', icon: 'fa-solid fa-diamond' },
]

export const STAT_OPTIONS: { id: StatId; label: string; icon: string }[] = [
  { id: 'level', label: 'Nivel', icon: 'fa-solid fa-star' },
  { id: 'coins', label: 'Monedas Kor', icon: 'fa-solid fa-coins' },
  { id: 'streak', label: 'Racha', icon: 'fa-solid fa-fire' },
  { id: 'achievements', label: 'Logros', icon: 'fa-solid fa-trophy' },
  { id: 'topics', label: 'Lecciones', icon: 'fa-solid fa-road' },
]

export const STATUS_ICONS: { icon: string; label: string }[] = [
  { icon: 'fa-solid fa-book-open', label: 'Estudiando' },
  { icon: 'fa-solid fa-chart-line', label: 'Operando' },
  { icon: 'fa-solid fa-pen-to-square', label: 'Tomando notas' },
  { icon: 'fa-solid fa-mug-hot', label: 'Descansando' },
  { icon: 'fa-solid fa-moon', label: 'Nocturno' },
  { icon: 'fa-solid fa-rocket', label: 'Con todo' },
  { icon: 'fa-solid fa-brain', label: 'Concentrado' },
]

export const STATUS_SUGGESTIONS: string[] = [
  'Estudiando análisis técnico',
  'Repasando mis lecciones',
  'Terminando el tema 1',
  'Aprendiendo a leer velas',
]

export const BANNER_PRESETS: { id: string; label: string; a: string; b: string }[] = [
  { id: 'accent', label: 'Del tema', a: '', b: '' },
  { id: 'ocean', label: 'Océano', a: '#0ea5e9', b: '#6366f1' },
  { id: 'sunset', label: 'Atardecer', a: '#f97316', b: '#ec4899' },
  { id: 'forest', label: 'Bosque', a: '#10b981', b: '#0ea5e9' },
  { id: 'violet', label: 'Violeta', a: '#8b5cf6', b: '#ec4899' },
  { id: 'ember', label: 'Brasas', a: '#ef4444', b: '#f59e0b' },
  { id: 'mono', label: 'Grafito', a: '#334155', b: '#94a3b8' },
]

export const FRAME_COLORS: string[] = ['', '#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899']

export const DEFAULT_BANNER_A = 'var(--grad-a, var(--primary))'

export const DEFAULT_BANNER_B = 'var(--grad-b, color-mix(in srgb, var(--primary) 40%, #8b5cf6))'

export const unlockKey = (group: string, id: string) => `${group}:${id}`
