export type BannerStyle = 'guilloche' | 'cover' | 'aurora' | 'candles' | 'skyline' | 'waves' | 'stars'

export type FrameStyle = 'none' | 'solid' | 'rainbow' | 'pulse' | 'orbit'

export type AvatarShape = 'circle' | 'rounded' | 'hexagon'

export type StatId = 'level' | 'coins' | 'streak' | 'achievements' | 'topics'

export type ProfileDensity = 'comfortable' | 'compact'

export type ProfileLayout = 'credential' | 'office' | 'card'

export type NavStyle = 'bill' | 'island' | 'ticker' | 'sidebar'

export type LearnWorld = 'city' | 'candles' | 'island'

export type HomeMainSection = 'lesson' | 'topics'

export type HomeSideSection = 'credential' | 'details'

export type HomeGreeting = 'continue' | 'ready' | 'market' | 'custom'

export type HomeLessonBg = 'bill' | 'paper' | 'ink' | 'aurora' | 'stars' | 'candles' | 'waves' | 'skyline'

export interface ProfileCustomization {
  bannerStyle: BannerStyle
  bannerColorA: string
  bannerColorB: string
  bannerSpeed: number
  frameStyle: FrameStyle
  frameColor: string
  avatarShape: AvatarShape
  showLevelRing: boolean
  status: string
  statusIcon: string
  pinnedAchievements: string[]
  visibleStats: StatId[]
  showStreakCalendar: boolean
  showLevelJourney: boolean
  glow: boolean
  tilt: boolean
  density: ProfileDensity
  profileLayout: ProfileLayout
  navStyle: NavStyle
  learnWorld: LearnWorld
  owned: string[]
  adminMode: boolean
  homeMain: HomeMainSection[]
  homeSide: HomeSideSection[]
  homeHidden: string[]
  homeGreeting: HomeGreeting
  homeGreetingText: string
  homeSidebarLeft: boolean
  homeMascot: boolean
  homeCredentialCover: boolean
  homeCompact: boolean
  homeLessonBg: HomeLessonBg
}

export interface UnlockRule {
  price?: number
  level?: number
}
