import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CleverkorMascot3D } from './CleverkorMascot3D'

type TutorialPage = 'home' | 'learn' | 'challenges' | 'exchange' | 'community'

interface TutorialStep {
  title: string
  text: string
  target: string | null
}

const TUTORIALS: Record<TutorialPage, { label: string; steps: TutorialStep[] }> = {
  home: { label: 'Inicio', steps: [] },
  learn: { label: 'Aprender', steps: [
    { title: 'Tu camino de Trading y Finanzas', text: 'Aquí ves tu avance, tu nivel y el botón para continuar donde te quedaste.', target: '[data-tour="learn-hero"]' },
    { title: 'Tu mapa de lecciones', text: 'Avanza lección por lección. La siguiente siempre está resaltada.', target: '[data-tour="learn-map"]' },
    { title: 'Personaliza la experiencia', text: 'Ajusta tu forma de aprender cuando quieras.', target: '[data-tour="learn-style"]' },
    { title: 'Desbloquea recursos', text: 'Al completar lecciones desbloqueas recursos para practicar. Revisa la columna de la derecha.', target: null },
  ] },
  challenges: { label: 'Desafíos', steps: [
    { title: 'Filtra los desafíos', text: 'Elige una categoría para encontrar ejercicios de tu interés.', target: 'main .no-scrollbar' },
    { title: 'Abre un caso', text: 'Cada tarjeta presenta una situación para poner en práctica lo aprendido.', target: 'main .grid' },
    { title: 'Responde y aprende', text: 'Elige una respuesta; verás si acertaste y podrás ganar experiencia.', target: null },
  ] },
  exchange: { label: 'Exchange Spot', steps: [
    { title: 'Observa el mercado', text: 'Consulta el resumen y las noticias para conocer el contexto actual.', target: 'h1' },
    { title: 'Explora el catálogo', text: 'Filtra y ordena los activos para encontrar una oportunidad que quieras analizar.', target: 'main .border-b' },
    { title: 'Revisa cada activo', text: 'Abre un activo para consultar sus detalles y operar en el simulador.', target: 'main table, main .grid' },
  ] },
  community: { label: 'Comunidad', steps: [
    { title: 'Comparte una idea', text: 'Escribe una reflexión o consulta para iniciar una conversación.', target: 'form' },
    { title: 'Elige un tema', text: 'Selecciona la categoría que mejor describe tu publicación.', target: 'select' },
    { title: 'Explora publicaciones', text: 'Filtra los temas, reacciona y descubre análisis de otros miembros.', target: 'main .space-y-3' },
  ] },
}

const PATHS: Record<string, TutorialPage> = {
  '/': 'home',
  '/aprender': 'learn',
  '/experiencias': 'challenges',
}

export const PageTutorial: React.FC = () => {
  const location = useLocation()
  const { user } = usePlatform()
  const page = PATHS[location.pathname]
  const homeSteps = useMemo<TutorialStep[]>(() => [
    { title: 'Comienza a aprender', text: 'Desde aquí puedes retomar tu aprendizaje y ver qué sigue en tu camino.', target: '[data-tour="home-learning"]' },
    { title: 'Herramientas para avanzar', text: 'Explora las herramientas disponibles para aprender, practicar y seguir tu progreso.', target: '[data-tour="home-tools"]' },
    ...(user.isGuest ? [] : [{ title: 'Hazlo tuyo', text: 'Desde tu perfil puedes personalizar esta página, los temas, la barra y tu mundo de Aprender.', target: '[data-tour="home-profile"]' }]),
  ], [user.isGuest])
  const tutorial = useMemo(() => page === 'home' ? { ...TUTORIALS.home, steps: homeSteps } : page ? TUTORIALS[page] : null, [homeSteps, page])
  const [step, setStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const [buttonPosition, setButtonPosition] = useState<React.CSSProperties>({ top: 80, left: 12 })
  const [panelPosition, setPanelPosition] = useState<React.CSSProperties>({ top: 120, left: 12 })

  useEffect(() => {
    setStep((current) => Math.min(current, Math.max(0, (tutorial?.steps.length || 1) - 1)))
  }, [tutorial])

  const close = useCallback(() => {
    if (page) localStorage.setItem(`clever_tutorial_${page}`, 'done')
    setIsOpen(false)
    setTarget(null)
  }, [page])

  const start = useCallback(() => {
    setStep(0)
    setIsOpen(true)
  }, [])

  useEffect(() => {
    if (!page) return
    setIsOpen(false)
    if (page === 'home') return
    if (localStorage.getItem(`clever_tutorial_${page}`) !== 'done') {
      const timer = window.setTimeout(start, 650)
      return () => window.clearTimeout(timer)
    }
  }, [page, location.key, start])

  useEffect(() => {
    if (!page) return
    const placeButton = () => {
      const heading = document.querySelector<HTMLElement>('main h1, main h2')
      const rect = heading?.getBoundingClientRect()
      if (!rect) return
      setButtonPosition({ top: Math.max(80, rect.top), left: Math.max(12, Math.min(rect.right + 12, window.innerWidth - 104)) })
    }
    const frame = window.requestAnimationFrame(placeButton)
    window.addEventListener('resize', placeButton)
    window.addEventListener('scroll', placeButton, true)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', placeButton)
      window.removeEventListener('scroll', placeButton, true)
    }
  }, [page, location.key])

  useEffect(() => {
    if (!isOpen || !page) return
    document.querySelectorAll('.tutorial-target').forEach((element) => element.classList.remove('tutorial-target'))
    document.querySelectorAll('[data-tutorial-launcher]').forEach((element) => element.classList.remove('tutorial-target'))
    const targetSelector = tutorial?.steps[step]?.target
    if (!targetSelector) {
      document.querySelectorAll('.tutorial-target').forEach((element) => element.classList.remove('tutorial-target'))
      setTarget(null)
      return
    }
    const selectors = targetSelector.split(', ')
    let frame = 0
    let attempts = 0
    const findTarget = () => {
      const found = selectors.map((selector) => document.querySelector<HTMLElement>(selector)).find((element) => element && !element.closest('[data-tutorial-launcher]')) || null
      if (found) {
        found.classList.add('tutorial-target')
        setTarget(found)
        const heading = page === 'home' && step < 2 ? found.querySelector<HTMLElement>('h1, h2') : null
        if (heading) {
          const panelHeight = window.innerWidth < 640 ? 220 : 190
          const headingTop = heading.getBoundingClientRect().top + window.scrollY
          window.scrollTo({ top: Math.max(0, headingTop - panelHeight - 36 - 80), behavior: 'smooth' })
        } else {
          found.scrollIntoView({ behavior: 'smooth' })
        }
        return
      }
      if (attempts < 60) {
        attempts += 1
        frame = window.requestAnimationFrame(findTarget)
      } else {
        setTarget(null)
      }
    }
    findTarget()
    return () => {
      window.cancelAnimationFrame(frame)
      document.querySelectorAll('.tutorial-target').forEach((element) => element.classList.remove('tutorial-target'))
      document.querySelectorAll('[data-tutorial-launcher]').forEach((element) => element.classList.remove('tutorial-target'))
    }
  }, [isOpen, page, step, tutorial])

  useEffect(() => {
    if (!target || target.closest('[data-tutorial-launcher]')) return
    target.classList.add('tutorial-target')
    return () => target.classList.remove('tutorial-target')
  }, [target])

  useEffect(() => {
    if (!isOpen) return
    if (!target && page === 'learn') {
      const panelWidth = Math.min(480, window.innerWidth * 0.92)
      const panelHeight = window.innerWidth < 640 ? 220 : 190
      setPanelPosition({ top: Math.max(80, (window.innerHeight - panelHeight) / 2), left: (window.innerWidth - panelWidth) / 2, width: panelWidth })
      return
    }
    if (!target) return
    const placePanel = () => {
      const rect = target.getBoundingClientRect()
      const panelWidth = Math.min(480, window.innerWidth * 0.92)
      const panelHeight = window.innerWidth < 640 ? 220 : 190
      const gap = 18
      const sectionHeading = page === 'home' && step < 2 ? target.querySelector<HTMLElement>('h1, h2') : null
      const headingRect = sectionHeading?.getBoundingClientRect()
      if (headingRect) {
        const top = Math.max(80, Math.min(headingRect.top - panelHeight - gap, window.innerHeight - panelHeight - 12))
        setPanelPosition({ top, left: Math.max(12, (window.innerWidth - panelWidth) / 2), width: panelWidth })
        return
      }
      const canPlaceRight = rect.right + gap + panelWidth <= window.innerWidth - 12
      const canPlaceLeft = rect.left - gap - panelWidth >= 12
      let left = canPlaceRight ? rect.right + gap : canPlaceLeft ? rect.left - gap - panelWidth : Math.max(12, (window.innerWidth - panelWidth) / 2)
      let top = canPlaceRight || canPlaceLeft ? rect.top + rect.height / 2 - panelHeight / 2 : rect.bottom + gap
      if (top + panelHeight > window.innerHeight - 12) top = rect.top - panelHeight - gap
      top = Math.max(80, Math.min(top, window.innerHeight - panelHeight - 12))
      left = Math.max(12, Math.min(left, window.innerWidth - panelWidth - 12))
      setPanelPosition({ top, left, width: panelWidth })
    }
    const frame = window.requestAnimationFrame(placePanel)
    window.addEventListener('resize', placePanel)
    window.addEventListener('scroll', placePanel, true)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', placePanel)
      window.removeEventListener('scroll', placePanel, true)
    }
  }, [isOpen, target, step])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') setStep((current) => Math.min(current + 1, (tutorial?.steps.length || 1) - 1))
      if (event.key === 'ArrowLeft') setStep((current) => Math.max(0, current - 1))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [close, isOpen, page, tutorial])

  if (!page || !tutorial) return null
  const current = tutorial.steps[step]

  return <>
    <style>{`.tutorial-target{position:relative;z-index:61!important;outline:3px solid var(--primary);outline-offset:5px;border-radius:12px;box-shadow:0 0 0 9999px rgba(5,10,20,.38),0 0 24px color-mix(in srgb,var(--primary) 55%,transparent);animation:tutorial-pulse 1.7s ease-in-out infinite alternate}@keyframes tutorial-pulse{from{outline-offset:3px}to{outline-offset:7px}}@media(prefers-reduced-motion:reduce){.tutorial-target{animation:none}}`}</style>
    {!isOpen && <button type="button" data-tutorial-launcher="true" onClick={start} style={buttonPosition} className="fixed z-30 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)] shadow-md transition hover:border-[var(--primary)] hover:text-[var(--primary)]" aria-label={`Reproducir tutorial de ${tutorial.label}`}>
      <i className="fa-regular fa-circle-question text-[var(--primary)]"></i><span>Tutorial</span>
    </button>}
    {isOpen && <div className="pointer-events-none">
      <section style={{ ...panelPosition, borderColor: 'var(--primary)', backgroundColor: 'var(--surface)', boxShadow: '0 0 0 4px color-mix(in srgb,var(--primary) 45%,transparent),0 0 30px color-mix(in srgb,var(--primary) 65%,transparent),0 18px 60px rgba(0,0,0,.55)' }} className="pointer-events-auto fixed z-[62] flex items-center gap-3 rounded-2xl border-2 p-4">
        <div className="h-24 w-20 shrink-0 animate-[tutorial-bob_2s_ease-in-out_infinite] sm:h-28 sm:w-24"><CleverkorMascot3D height="100%" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-2"><span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">{tutorial.label} · {step + 1} de {tutorial.steps.length}</span><button type="button" onClick={close} className="rounded px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text)]">Omitir</button></div>
          <h2 className="text-sm font-bold text-[var(--text)]">{current.title}</h2><p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{current.text}</p>
          <div className="mt-3 flex items-center justify-between"><button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="rounded px-2 py-1 text-xs text-[var(--text-muted)] disabled:opacity-40"><i className="fa-solid fa-arrow-left mr-1"></i>Anterior</button><div className="flex gap-1">{tutorial.steps.map((_, index) => <span key={index} className={`h-1.5 w-4 rounded-full ${index === step ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></span>)}</div><button type="button" onClick={() => step === tutorial.steps.length - 1 ? close() : setStep((value) => value + 1)} className="platform-btn-primary px-3 py-1.5 text-xs">{step === tutorial.steps.length - 1 ? 'Terminar' : 'Siguiente'}<i className="fa-solid fa-arrow-right ml-1"></i></button></div>
        </div>
      </section>
      <style>{`@keyframes tutorial-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
    </div>}
  </>
}
