import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ACHIEVEMENTS, MENTOR_KNOWLEDGE, MISSIONS_BY_CATEGORY, MODULES_BY_CATEGORY } from '../data/catalog'
import type { DiagnosticResult, MentorMessage, UserProfile } from '../types/platform'

interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface PlatformContextType {
  user: UserProfile
  isGuest: boolean
  toasts: ToastItem[]
  isMentorOpen: boolean
  mentorMessages: MentorMessage[]
  login: (identifier: string, pass: string) => boolean
  register: (name: string, username: string, email: string, pass: string) => boolean
  logout: () => void
  addXP: (amount: number) => void
  addCoins: (amount: number) => void
  unlockAchievement: (id: string) => void
  logActivity: (text: string) => void
  completeModule: (catId: string, idx: number) => void
  completeMission: (catId: string) => void
  saveDiagnostic: (result: DiagnosticResult) => void
  updateUserProfile: (updates: Partial<UserProfile>) => void
  addCommunityPost: (catId: string, text: string) => void
  likeCommunityPost: (postId: string) => void
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
  dismissToast: (id: string) => void
  setIsMentorOpen: (open: boolean) => void
  sendMentorMessage: (text: string) => void
  setTheme: (theme: string) => void
  setAccentColor: (color: string) => void
}

const STORAGE_KEY_USERS = 'edu_users'
const STORAGE_KEY_SESSION = 'edu_session'

const getGuestUser = (): UserProfile => ({
  name: 'Invitado',
  username: 'guest',
  email: 'invitado@clever.local',
  isGuest: true,
  createdAt: Date.now(),
  onboardingCompleted: true,
  diagnosticoCompleted: false,
  interests: ['trading', 'gaming'],
  goal: 'Aprender trading y finanzas de forma interactiva',
  level: 1,
  levelLabel: 'Explorador',
  xp: 0,
  xpToNext: 500,
  coins: 50,
  streak: 1,
  lastActiveDate: new Date().toDateString(),
  _lastMissionDate: null,
  achievements: [],
  diagnostico: null,
  theme: 'light',
  accentColor: '#0284c7',
  avatar: null,
  cover: null,
  widgets: { mision: true, mercado: true, progreso: true, mentor: true, recomendaciones: true, racha: true, comunidad: true },
  publicProfile: { logros: true, estadisticas: true, nivel: true, actividad: true, intereses: true },
  activity: [],
  moduleProgress: { trading: [0] },
})

const createNewUser = (name: string, username: string, email: string, pass: string): UserProfile => ({
  name,
  username,
  email,
  isGuest: false,
  createdAt: Date.now(),
  onboardingCompleted: false,
  diagnosticoCompleted: false,
  interests: ['trading', 'gaming'],
  goal: 'Aprender desde cero',
  level: 1,
  levelLabel: 'Explorador',
  xp: 0,
  xpToNext: 500,
  coins: 100,
  streak: 1,
  lastActiveDate: new Date().toDateString(),
  _lastMissionDate: null,
  achievements: [],
  diagnostico: null,
  theme: 'light',
  accentColor: '#0284c7',
  avatar: null,
  cover: null,
  widgets: { mision: true, mercado: true, progreso: true, mentor: true, recomendaciones: true, racha: true, comunidad: true },
  publicProfile: { logros: true, estadisticas: true, nivel: true, actividad: true, intereses: true },
  activity: [{ text: 'Registro completado', date: Date.now() }],
  moduleProgress: {},
  _demoPassword: pass,
})

const getLevelTitle = (lvl: number): string => {
  if (lvl < 3) return 'Explorador'
  if (lvl < 6) return 'Aprendiz'
  if (lvl < 10) return 'Analista'
  if (lvl < 15) return 'Estratega'
  return 'Maestro'
}

const PlatformContext = createContext<PlatformContextType | null>(null)

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [isMentorOpen, setIsMentorOpen] = useState(false)
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([
    {
      id: 'init-msg',
      from: 'bot',
      text: 'Hola. Soy el Mentor de Clever. Conozco tu nivel actual y tus intereses. ¿Qué duda deseas resolver hoy?',
      timestamp: Date.now(),
    },
  ])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newToast: ToastItem = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
    }
    setToasts((prev) => [...prev, newToast])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const activeUsername = localStorage.getItem(STORAGE_KEY_SESSION)
      if (activeUsername) {
        const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '{}')
        if (storedUsers[activeUsername]) {
          return storedUsers[activeUsername]
        }
      }
    } catch {
      return getGuestUser()
    }
    return getGuestUser()
  })

  useEffect(() => {
    if (!user.isGuest) {
      try {
        const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '{}')
        storedUsers[user.username] = user
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(storedUsers))
      } catch (e) {
        console.error(e)
      }
    }
    document.documentElement.setAttribute('data-theme', user.theme || 'light')
    if (user.accentColor) {
      document.documentElement.style.setProperty('--primary', user.accentColor)
    }
  }, [user])

  const login = useCallback((identifier: string, pass: string): boolean => {
    try {
      const storedUsers: Record<string, UserProfile> = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '{}')
      const found = Object.values(storedUsers).find(
        (u) => u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase(),
      )
      if (!found) {
        showToast('No se encontró una cuenta con esos datos.', 'error')
        return false
      }
      if (found._demoPassword && found._demoPassword !== pass) {
        showToast('Contraseña incorrecta.', 'error')
        return false
      }
      localStorage.setItem(STORAGE_KEY_SESSION, found.username)
      setUser(found)
      showToast(`Sesión iniciada: ${found.name}`, 'success')
      return true
    } catch {
      showToast('Error al iniciar sesión.', 'error')
      return false
    }
  }, [showToast])

  const register = useCallback((name: string, username: string, email: string, pass: string): boolean => {
    try {
      const storedUsers: Record<string, UserProfile> = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '{}')
      if (storedUsers[username]) {
        showToast('El nombre de usuario ya existe.', 'error')
        return false
      }
      const newUser = createNewUser(name, username, email, pass)
      storedUsers[username] = newUser
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(storedUsers))
      localStorage.setItem(STORAGE_KEY_SESSION, username)
      setUser(newUser)
      showToast(`Cuenta creada para ${name}`, 'success')
      return true
    } catch {
      showToast('Error al registrar cuenta.', 'error')
      return false
    }
  }, [showToast])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_SESSION)
    setUser(getGuestUser())
    showToast('Sesión cerrada.', 'info')
  }, [showToast])

  const addXP = useCallback((amount: number) => {
    setUser((prev) => {
      let newXP = prev.xp + amount
      let newLevel = prev.level
      let nextXP = prev.xpToNext
      let leveledUp = false

      while (newXP >= nextXP) {
        newXP -= nextXP
        newLevel += 1
        nextXP = Math.round(nextXP * 1.25)
        leveledUp = true
      }

      if (leveledUp) {
        showToast(`Nivel ${newLevel}: ${getLevelTitle(newLevel)}`, 'success')
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNext: nextXP,
        levelLabel: getLevelTitle(newLevel),
      }
    })
  }, [showToast])

  const addCoins = useCallback((amount: number) => {
    setUser((prev) => ({
      ...prev,
      coins: prev.coins + amount,
    }))
  }, [])

  const unlockAchievement = useCallback((achId: string) => {
    setUser((prev) => {
      if (prev.achievements.includes(achId)) return prev
      const ach = ACHIEVEMENTS.find((a) => a.id === achId)
      if (ach) {
        showToast(`Logro: ${ach.name}`, 'success')
      }
      return {
        ...prev,
        achievements: [...prev.achievements, achId],
      }
    })
  }, [showToast])

  const logActivity = useCallback((text: string) => {
    setUser((prev) => ({
      ...prev,
      activity: [{ text, date: Date.now() }, ...prev.activity].slice(0, 15),
    }))
  }, [])

  const completeModule = useCallback((catId: string, idx: number) => {
    setUser((prev) => {
      const current = prev.moduleProgress[catId] || []
      if (current.includes(idx)) return prev
      const updated = [...current, idx]
      return {
        ...prev,
        moduleProgress: {
          ...prev.moduleProgress,
          [catId]: updated,
        },
      }
    })
    addXP(35)
    addCoins(15)
    logActivity(`Módulo completado en ${catId}`)
    showToast('Módulo completado (+35 XP)', 'success')
  }, [addCoins, addXP, logActivity, showToast])

  const completeMission = useCallback((catId: string) => {
    const mission = MISSIONS_BY_CATEGORY[catId] || MISSIONS_BY_CATEGORY.trading
    const today = new Date().toDateString()
    setUser((prev) => ({
      ...prev,
      _lastMissionDate: today,
    }))
    addXP(mission.xp)
    addCoins(mission.coins)
    unlockAchievement('first_challenge')
    logActivity(`Misión cumplida en ${catId}`)
    showToast(`Misión completada (+${mission.xp} XP)`, 'success')
  }, [addCoins, addXP, logActivity, showToast, unlockAchievement])

  const saveDiagnostic = useCallback((result: DiagnosticResult) => {
    setUser((prev) => ({
      ...prev,
      diagnostico: result,
      diagnosticoCompleted: true,
    }))
    addXP(60)
    addCoins(30)
    unlockAchievement('diagnostico_ace')
    logActivity(`Diagnóstico de nivel en ${result.category}`)
    showToast('Diagnóstico evaluado con éxito.', 'success')
  }, [addCoins, addXP, logActivity, showToast, unlockAchievement])

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }, [])

  const addCommunityPost = useCallback((catId: string, text: string) => {
    const newPost = {
      id: Math.random().toString(36).substring(2, 9),
      user: user.name || user.username,
      category: catId,
      text,
      reactions: 0,
      createdAt: Date.now(),
    }
    const stored = JSON.parse(localStorage.getItem('edu_community_posts') || '[]')
    localStorage.setItem('edu_community_posts', JSON.stringify([newPost, ...stored]))
    addXP(15)
    addCoins(10)
    unlockAchievement('community_voice')
    logActivity(`Publicación en comunidad de ${catId}`)
    showToast('Aporte publicado (+15 XP)', 'success')
  }, [addCoins, addXP, logActivity, showToast, unlockAchievement, user.name, user.username])

  const likeCommunityPost = useCallback((postId: string) => {
    const stored = JSON.parse(localStorage.getItem('edu_community_posts') || '[]')
    const updated = stored.map((p: any) => (p.id === postId ? { ...p, reactions: p.reactions + 1 } : p))
    localStorage.setItem('edu_community_posts', JSON.stringify(updated))
    showToast('Reacción guardada', 'info')
  }, [showToast])

  const sendMentorMessage = useCallback((text: string) => {
    const userMsg: MentorMessage = {
      id: Math.random().toString(36).substring(2, 9),
      from: 'user',
      text,
      timestamp: Date.now(),
    }
    setMentorMessages((prev) => [...prev, userMsg])

    const lower = text.toLowerCase()
    let reply = ''

    if (lower.includes('pelicula') || lower.includes('cine')) {
      reply = 'El análisis técnico funciona como el guion de una película: los soportes marcan los puntos de inflexión y las tendencias marcan el arco narrativo. ¿Qué concepto técnico deseas repasar?'
    } else if (lower.includes('videojuego') || lower.includes('gaming')) {
      reply = 'En el mercado, cada activo tiene patrones reconocibles como las mecánicas de un videojuego: identificar soportes te da ventaja antes de ejecutar cualquier orden.'
    } else if (lower.includes('siguiente') || lower.includes('aprender')) {
      const cat = user.interests[0] || 'trading'
      const modules = MODULES_BY_CATEGORY[cat] || []
      const done = user.moduleProgress[cat] || []
      const nextIdx = modules.findIndex((_, idx) => !done.includes(idx))
      const nextName = nextIdx >= 0 ? modules[nextIdx] : modules[0]
      reply = `Te sugiero continuar con el módulo: "${nextName}" en la sección Aprender.`
    } else {
      let matchedKey = Object.keys(MENTOR_KNOWLEDGE).find((k) => lower.includes(k))
      if (matchedKey) {
        reply = MENTOR_KNOWLEDGE[matchedKey]
      } else {
        reply = 'Puedo asistirte con conceptos de análisis técnico, gestión de riesgo o sugerencias de estudio. ¿Qué tema deseas explorar?'
      }
    }

    setTimeout(() => {
      const botMsg: MentorMessage = {
        id: Math.random().toString(36).substring(2, 9),
        from: 'bot',
        text: reply,
        timestamp: Date.now(),
      }
      setMentorMessages((prev) => [...prev, botMsg])
    }, 300)
  }, [user.interests, user.moduleProgress])

  const setTheme = useCallback((theme: string) => {
    setUser((prev) => ({ ...prev, theme }))
    showToast(`Tema: ${theme}`, 'info')
  }, [showToast])

  const setAccentColor = useCallback((color: string) => {
    setUser((prev) => ({ ...prev, accentColor: color }))
    showToast('Color de acento aplicado', 'info')
  }, [showToast])

  const value = useMemo(
    () => ({
      user,
      isGuest: !!user.isGuest,
      toasts,
      isMentorOpen,
      mentorMessages,
      login,
      register,
      logout,
      addXP,
      addCoins,
      unlockAchievement,
      logActivity,
      completeModule,
      completeMission,
      saveDiagnostic,
      updateUserProfile,
      addCommunityPost,
      likeCommunityPost,
      showToast,
      dismissToast,
      setIsMentorOpen,
      sendMentorMessage,
      setTheme,
      setAccentColor,
    }),
    [
      user,
      toasts,
      isMentorOpen,
      mentorMessages,
      login,
      register,
      logout,
      addXP,
      addCoins,
      unlockAchievement,
      logActivity,
      completeModule,
      completeMission,
      saveDiagnostic,
      updateUserProfile,
      addCommunityPost,
      likeCommunityPost,
      showToast,
      dismissToast,
      sendMentorMessage,
      setTheme,
      setAccentColor,
    ],
  )

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}

export const usePlatform = (): PlatformContextType => {
  const ctx = useContext(PlatformContext)
  if (!ctx) {
    throw new Error('usePlatform must be used within PlatformProvider')
  }
  return ctx
}
