import React, { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CleverkorMascot3D } from './CleverkorMascot3D'

type TutorialPage = 'home' | 'learn' | 'challenges' | 'exchange' | 'community'

interface TutorialStep {
  title: string
  text: string
  target: string | null
}

const TUTORIALS: Record<TutorialPage, { label: string; steps: TutorialStep[] }> = {
  home: { label: 'Inicio', steps: [
    { title: 'Tu punto de partida', text: 'Desde aquí puedes retomar tu aprendizaje y ver qué sigue en tu camino.', target: '.platform-card' },
    { title: 'Herramientas para avanzar', text: 'Explora las herramientas disponibles para aprender, practicar y seguir tu progreso.', target: '[data-tour="home-tools"]' },
    { title: 'Top Ranking de Usuarios', text: 'Escala a lo largo de tu jornada en el Top Ranking de Usuarios.', target: '[data-tour="home-ranking"]' },
  ] },
  learn: { label: 'Aprender', steps: [
    { title: 'Sigue donde lo dejaste', text: 'Explora tu camino recomendado según tus intereses.', target: '.lm-feature' },
    { title: 'Elige tu camino', text: 'Explora mundos bastos de información sobre temas interesantes.', target: '.lm-more-paths' },
    { title: 'Personaliza la experiencia', text: 'Ajusta tu experiencia de aprendizaje cuando quieras.', target: 'main .lm-style-chip' },
    { title: 'Desbloquea funciones', text: 'A lo largo de avanzar en tus caminos desbloquearás funciones en la página, revísalos!', target: null },
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
  const page = PATHS[location.pathname]
  const [step, setStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const [panelPosition, setPanelPosition] = useState<React.CSSProperties>({ top: 120, left: 12 })

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
    if (!isOpen || !page) return
    document.querySelectorAll('.tutorial-target').forEach((element) => element.classList.remove('tutorial-target'))
    document.querySelectorAll('[data-tutorial-launcher]').forEach((element) => element.classList.remove('tutorial-target'))
    const targetSelector = TUTORIALS[page].steps[step].target
    const selectors = targetSelector?.split(', ') || []
    const found = selectors.map((selector) => document.querySelector<HTMLElement>(selector)).find((element) => element && !element.closest('[data-tutorial-launcher]')) || null
    setTarget(found)
    found?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (!targetSelector) {
      document.querySelectorAll('.tutorial-target').forEach((element) => element.classList.remove('tutorial-target'))
      setTarget(null)
    }
    return () => {
      found?.classList.remove('tutorial-target')
      document.querySelectorAll('[data-tutorial-launcher]').forEach((element) => element.classList.remove('tutorial-target'))
    }
  }, [isOpen, page, step])

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
      setPanelPosition({ top: Math.max(68, (window.innerHeight - panelHeight) / 2), left: (window.innerWidth - panelWidth) / 2, width: panelWidth })
      return
    }
    if (!target) return
    const placePanel = () => {
      const rect = target.getBoundingClientRect()
      const panelWidth = Math.min(480, window.innerWidth * 0.92)
      const panelHeight = window.innerWidth < 640 ? 220 : 190
      const gap = 18
      const canPlaceRight = rect.right + gap + panelWidth <= window.innerWidth - 12
      const canPlaceLeft = rect.left - gap - panelWidth >= 12
      let left = canPlaceRight ? rect.right + gap : canPlaceLeft ? rect.left - gap - panelWidth : Math.max(12, (window.innerWidth - panelWidth) / 2)
      let top = canPlaceRight || canPlaceLeft ? rect.top + rect.height / 2 - panelHeight / 2 : rect.bottom + gap
      if (top + panelHeight > window.innerHeight - 12) top = rect.top - panelHeight - gap
      top = Math.max(68, Math.min(top, window.innerHeight - panelHeight - 12))
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
      if (event.key === 'ArrowRight') setStep((current) => Math.min(current + 1, (page ? TUTORIALS[page].steps.length : 1) - 1))
      if (event.key === 'ArrowLeft') setStep((current) => Math.max(0, current - 1))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [close, isOpen, page])

  if (!page) return null
  const tutorial = TUTORIALS[page]
  const current = tutorial.steps[step]
  const isPanelOnlyStep = (page === 'learn' || page === 'challenges') && step === tutorial.steps.length - 1

  return <>
    <style>{`.tutorial-target{position:relative;z-index:61!important;outline:3px solid var(--primary);outline-offset:5px;border-radius:12px;box-shadow:0 0 0 9999px rgba(5,10,20,.38),0 0 24px color-mix(in srgb,var(--primary) 55%,transparent);animation:tutorial-pulse 1.7s ease-in-out infinite alternate}${isPanelOnlyStep ? '.tutorial-target{outline:none!important;box-shadow:none!important;animation:none!important}' : ''}@keyframes tutorial-pulse{from{outline-offset:3px}to{outline-offset:7px}}@media(prefers-reduced-motion:reduce){.tutorial-target{animation:none}}`}</style>
    {!isOpen && <button type="button" data-tutorial-launcher="true" onClick={start} className="fixed bottom-5 left-3 z-30 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)] shadow-md transition hover:border-[var(--primary)] hover:text-[var(--primary)] sm:bottom-6 sm:left-5" aria-label={`Reproducir tutorial de ${tutorial.label}`}>
      <i className="fa-regular fa-circle-question text-[var(--primary)]"></i><span>Tutorial</span>
    </button>}
    {isOpen && <div className="fixed inset-0 z-[62] pointer-events-none">
      {isPanelOnlyStep && <div style={{ top: page === 'learn' ? '3.5rem' : 0 }} className="pointer-events-auto fixed inset-x-0 bottom-0 bg-[rgba(5,10,20,0.38)]"></div>}
      <section style={{ ...panelPosition, borderColor: 'var(--primary)', backgroundColor: 'var(--surface)', boxShadow: '0 0 0 4px color-mix(in srgb,var(--primary) 45%,transparent),0 0 30px color-mix(in srgb,var(--primary) 65%,transparent),0 18px 60px rgba(0,0,0,.55)' }} className="pointer-events-auto fixed z-[1] flex items-center gap-3 rounded-2xl border-2 p-4">
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
