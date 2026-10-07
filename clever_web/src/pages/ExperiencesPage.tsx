import React, { useState } from 'react'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES } from '../data/catalog'

interface ChallengeItem {
  id: string
  title: string
  category: string
  type: string
  desc: string
  xp: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const CHALLENGES: ChallengeItem[] = [
  {
    id: 'c1',
    title: 'Detección de Soporte Clave',
    category: 'trading',
    type: 'Análisis Técnico',
    desc: 'Un activo retrocede tras una subida hacia una zona histórica de demanda.',
    xp: 50,
    question: '¿Cuál es la conducta prudente de entrada?',
    options: [
      'Entrar en compra fijando un Stop Loss por debajo del nivel de soporte',
      'Vender todo sin esperar confirmación',
      'Comprar sin fijar límite de pérdida',
      'Ignorar el contexto del mercado',
    ],
    correctIndex: 0,
    explanation: 'Definir el Stop Loss por debajo del soporte protege el capital ante rupturas falsas.',
  },
  {
    id: 'c2',
    title: 'Ritmo y Montaje Audiovisual',
    category: 'cine',
    type: 'Caso Práctico',
    desc: 'Se busca generar tensión creciente en una escena de suspenso.',
    xp: 45,
    question: '¿Qué técnica de edición comprime la percepción temporal?',
    options: [
      'Planos generales continuos y música ambiental',
      'Planos cerrados con cortes de edición progresivamente más rápidos',
      'Tomas cenitales fijas',
      'Fundido a negro estático',
    ],
    correctIndex: 1,
    explanation: 'El corte acelerado y encuadres cerrados incrementan la tensión dramática.',
  },
  {
    id: 'c3',
    title: 'Cálculo de Ratio Riesgo / Beneficio',
    category: 'trading',
    type: 'Gestión de Riesgo',
    desc: 'Arriesgas $100 con Stop Loss para buscar una ganancia estimada de $300.',
    xp: 50,
    question: '¿Cuál es el ratio R:B de esta operación?',
    options: ['1:1', '1:2', '1:3', '3:1'],
    correctIndex: 2,
    explanation: 'Un ratio 1:3 permite mantener rentabilidad positiva con una tasa moderada de aciertos.',
  },
  {
    id: 'c4',
    title: 'Modelado y Motores en Videojuegos',
    category: 'gaming',
    type: 'Tecnología',
    desc: 'Iluminación físicamente precisa en tiempo real.',
    xp: 45,
    question: '¿Qué técnica calcula la trayectoria de la luz fotón a fotón?',
    options: [
      'Ray Tracing (Trazado de rayos)',
      'Sprite 2D Rendering',
      'Gouraud Shading',
      'Cel Shading',
    ],
    correctIndex: 0,
    explanation: 'Ray Tracing calcula rebotes e interacciones lumínicas en tiempo real.',
  },
]

export const ExperiencesPage: React.FC = () => {
  const { addXP, addCoins, unlockAchievement, logActivity, showToast } = usePlatform()
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [activeModal, setActiveModal] = useState<ChallengeItem | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])

  const filtered = selectedCat === 'all'
    ? CHALLENGES
    : CHALLENGES.filter((c) => c.category === selectedCat)

  const handleOpenChallenge = (ch: ChallengeItem) => {
    setActiveModal(ch)
    setSelectedOption(null)
    setIsAnswered(false)
  }

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !activeModal) return
    setSelectedOption(idx)
    setIsAnswered(true)

    const isCorrect = idx === activeModal.correctIndex
    if (isCorrect) {
      addXP(activeModal.xp)
      addCoins(20)
      unlockAchievement('first_challenge')
      logActivity(`Resolvió desafío: ${activeModal.title}`)
      setCompletedChallenges((prev) => [...prev, activeModal.id])
      showToast(`Correcto (+${activeModal.xp} XP)`, 'success')
    } else {
      showToast('Respuesta incorrecta.', 'error')
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
            Desafíos y Quizzes
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Resuelve situaciones prácticas y casos de estudio para medir tu criterio.
          </p>
        </div>

        <div className="text-xs font-mono text-[var(--text-muted)]">
          {completedChallenges.length} de {CHALLENGES.length} resueltos
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
            selectedCat === 'all'
              ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border border-[var(--primary)]'
              : 'bg-[var(--bg-alt)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'
          }`}
        >
          Todos
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
              selectedCat === cat.id
                ? 'bg-[var(--surface)] text-[var(--text)] font-semibold border border-[var(--primary)]'
                : 'bg-[var(--bg-alt)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            <i className={cat.icon}></i>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ch) => {
          const isDone = completedChallenges.includes(ch.id)

          return (
            <div
              key={ch.id}
              className="platform-card p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                  <span>{ch.type}</span>
                  <span className="text-[var(--primary)]">+{ch.xp} XP</span>
                </div>

                <h3 className="text-sm font-bold text-[var(--text)]">
                  {ch.title}
                </h3>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {ch.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                {isDone ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <i className="fa-solid fa-check text-[10px]"></i>
                    <span>Completado</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenChallenge(ch)}
                    className="platform-btn-secondary py-1 px-3 text-xs"
                  >
                    Resolver reto
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="platform-card max-w-lg w-full p-6 space-y-4 bg-[var(--surface)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span className="text-xs font-mono text-[var(--primary)] font-semibold">
                {activeModal.type}
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-bold text-[var(--text)]">
                {activeModal.title}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {activeModal.desc}
              </p>
            </div>

            <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)] rounded space-y-3">
              <div className="text-xs font-semibold text-[var(--text)]">
                {activeModal.question}
              </div>

              <div className="space-y-2">
                {activeModal.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx
                  const isCorrect = idx === activeModal.correctIndex

                  let btnClass = 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)] text-[var(--text)]'
                  if (isAnswered) {
                    if (isSelected) {
                      btnClass = isCorrect
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-rose-500 bg-rose-500/10 text-rose-400'
                    } else if (isCorrect) {
                      btnClass = 'border-emerald-500/50 text-emerald-400'
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-2.5 rounded border text-left text-xs transition-colors cursor-pointer ${btnClass}`}
                    >
                      <span>{opt}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {isAnswered && (
              <div className="p-3 bg-[var(--bg-alt)] border border-[var(--border)] rounded text-xs space-y-2">
                <div className="font-semibold text-[var(--primary)]">Explicación:</div>
                <p className="text-[var(--text-muted)]">{activeModal.explanation}</p>
                <div className="text-right pt-1">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="platform-btn-primary py-1 px-3 text-xs"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
