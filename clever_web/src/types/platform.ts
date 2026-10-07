export interface Category {
  id: string
  name: string
  icon: string
  desc: string
}

export interface DiagnosticQuestion {
  type: 'mcq' | 'tf' | 'scenario' | 'order'
  q: string
  options?: string[]
  correct?: number | boolean
  correctOrder?: number[]
}

export interface DiagnosticResult {
  category: string
  knowledge: number
  decisionMaking: number
  analyticalThinking: number
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  date?: number
}

export interface Achievement {
  id: string
  name: string
  icon: string
  desc: string
  unlockedAt?: number
}

export interface Mission {
  text: string
  xp: number
  coins: number
}

export interface CommunityPost {
  id: string
  user: string
  category: string
  text: string
  reactions: number
  createdAt: number
}

export interface UserActivity {
  text: string
  date: number
}

export interface UserProfile {
  name: string
  username: string
  email: string
  isGuest?: boolean
  createdAt: number
  onboardingCompleted: boolean
  diagnosticoCompleted: boolean
  interests: string[]
  goal: string
  level: number
  levelLabel: string
  xp: number
  xpToNext: number
  coins: number
  streak: number
  lastActiveDate: string | null
  _lastMissionDate?: string | null
  achievements: string[]
  diagnostico: DiagnosticResult | null
  theme: string
  accentColor: string
  avatar: string | null
  cover: string | null
  widgets: Record<string, boolean>
  publicProfile: Record<string, boolean>
  activity: UserActivity[]
  moduleProgress: Record<string, number[]>
  _demoPassword?: string
}

export interface MentorMessage {
  id: string
  from: 'user' | 'bot'
  text: string
  timestamp: number
}
