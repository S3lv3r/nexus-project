import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES, DIAGNOSTIC_QUESTIONS } from '../data/catalog'
import type { DiagnosticQuestion, DiagnosticResult } from '../types/platform'

export const DiagnosticPage: React.FC = () => {
  const { user, isGuest, saveDiagnostic } = usePlatform()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const catParam = searchParams.get('cat')
  const activeCat = catParam && CATEGORIES.some((c) => c.id === catParam) ? catParam : user.interests[0] || 'trading'
  const categoryObj = CATEGORIES.find((c) => c.id === activeCat) || CATEGORIES[0]

  const rawQuestions: DiagnosticQuestion[] = DIAGNOSTIC_QUESTIONS[activeCat] || [
    {
      type: 'mcq',
      q: `¿Qué nivel de experiencia tienes en ${categoryObj.name}?`,
      options: ['Principiante', 'Intermedio', 'Avanzado'],
      correct: 1,
    },
    {
      type: 'tf',
      q: `¿Has operado o analizado conceptos de ${categoryObj.name} anteriormente?`,
      correct: true,
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [selectedOrder, setSelectedOrder] = useState<number[]>([])
  const [isAnswering, setIsAnswering] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | boolean | null>(null)
  const [isStarted, setIsStarted] = useState(false)

  const currentQ = rawQuestions[currentIndex]
  const totalQuestions = rawQuestions.length

  const handleSelectOption = (choice: number | boolean, isCorrect: boolean) => {
    if (isAnswering) return
    setIsAnswering(true)
    setSelectedOption(choice)

    const updatedAnswers = [...answers, isCorrect]
    setAnswers(updatedAnswers)

    setTimeout(() => {
      setSelectedOption(null)
      setIsAnswering(false)
      if (currentIndex + 1 < totalQuestions) {
        setCurrentIndex(currentIndex + 1)
      } else {
        finishExam(updatedAnswers)
      }
    }, 400)
  }

  const handleOrderClick = (itemIdx: number) => {
    if (isAnswering || selectedOrder.includes(itemIdx)) return

    const newOrder = [...selectedOrder, itemIdx]
    setSelectedOrder(newOrder)

    if (currentQ.options && newOrder.length === currentQ.options.length) {
      setIsAnswering(true)
      const isCorrect = JSON.stringify(newOrder) === JSON.stringify(currentQ.correctOrder)
      const updatedAnswers = [...answers, isCorrect]
      setAnswers(updatedAnswers)

      setTimeout(() => {
        setSelectedOrder([])
        setIsAnswering(false)
        if (currentIndex + 1 < totalQuestions) {
          setCurrentIndex(currentIndex + 1)
        } else {
          finishExam(updatedAnswers)
        }
      }, 500)
    }
  }

  const finishExam = (finalAnswers: boolean[]) => {
    const score = finalAnswers.filter(Boolean).length
    const knowledge = Math.round((score / totalQuestions) * 100)
    const decisionMaking = Math.min(100, Math.max(15, knowledge - 5 + Math.round(Math.random() * 10)))
    const analyticalThinking = Math.min(100, Math.max(15, knowledge + Math.round(Math.random() * 8) - 4))
    const level: 'Principiante' | 'Intermedio' | 'Avanzado' =
      knowledge > 75 ? 'Avanzado' : knowledge > 45 ? 'Intermedio' : 'Principiante'

    const result: DiagnosticResult = {
      category: activeCat,
      knowledge,
      decisionMaking,
      analyticalThinking,
      level,
      date: Date.now(),
    }

    if (isGuest) {
      sessionStorage.setItem('edu_guest_diagnostico', JSON.stringify(result))
    } else {
      saveDiagnostic(result)
    }

    navigate('/resultado')
  }

  if (!isStarted) {
    return (
      <div className="max-w-lg mx-auto py-12">
        <div className="platform-card p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-[var(--primary)] uppercase">
              Evaluación Inicial
            </div>
            <h1 className="text-xl font-bold text-[var(--text)]">
              Diagnóstico: {categoryObj.name}
            </h1>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Responde {totalQuestions} preguntas situacionales para calibrar tu nivel y definir tu ruta de aprendizaje.
            </p>
          </div>

          <button
            onClick={() => setIsStarted(true)}
            className="w-full platform-btn-primary py-2.5 text-xs font-semibold justify-center"
          >
            Comenzar diagnóstico
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="platform-card p-6 space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] border-b border-[var(--border)] pb-3">
          <span>{categoryObj.name}</span>
          <span>{currentIndex + 1} / {totalQuestions}</span>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-mono text-[var(--primary)] uppercase">
            {currentQ.type === 'order' ? 'Ordenar pasos' : currentQ.type === 'tf' ? 'Verdadero / Falso' : 'Opción múltiple'}
          </div>
          <h2 className="text-sm font-bold text-[var(--text)] leading-snug">
            {currentQ.q}
          </h2>
        </div>

        {currentQ.type === 'order' && (
          <div className="space-y-2">
            {currentQ.options?.map((opt, i) => {
              const orderPos = selectedOrder.indexOf(i)
              const isSelected = orderPos !== -1

              return (
                <button
                  key={i}
                  onClick={() => handleOrderClick(i)}
                  className={`w-full p-3 rounded border text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--text)]'
                      : 'bg-[var(--bg-alt)] border-[var(--border)] text-[var(--text)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && (
                    <span className="font-mono text-xs text-[var(--primary)] font-bold">
                      #{orderPos + 1}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {(currentQ.type === 'mcq' || currentQ.type === 'scenario') && (
          <div className="space-y-2">
            {currentQ.options?.map((opt, i) => {
              const isSelected = selectedOption === i
              const isCorrect = i === currentQ.correct

              let btnClass = 'bg-[var(--bg-alt)] border-[var(--border)] hover:border-[var(--text-muted)] text-[var(--text)]'
              if (isSelected) {
                btnClass = isCorrect
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-rose-500 bg-rose-500/10 text-rose-400'
              }

              return (
                <button
                  key={i}
                  disabled={isAnswering}
                  onClick={() => handleSelectOption(i, isCorrect)}
                  className={`w-full p-3 rounded border text-left text-xs font-medium transition-colors cursor-pointer disabled:cursor-default ${btnClass}`}
                >
                  <span>{opt}</span>
                </button>
              )
            })}
          </div>
        )}

        {currentQ.type === 'tf' && (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((val) => {
              const isSelected = selectedOption === val
              const isCorrect = val === currentQ.correct

              let btnClass = 'bg-[var(--bg-alt)] border-[var(--border)] hover:border-[var(--text-muted)] text-[var(--text)]'
              if (isSelected) {
                btnClass = isCorrect
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-rose-500 bg-rose-500/10 text-rose-400'
              }

              return (
                <button
                  key={String(val)}
                  disabled={isAnswering}
                  onClick={() => handleSelectOption(val, isCorrect)}
                  className={`p-3 rounded border font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:cursor-default ${btnClass}`}
                >
                  <span>{val ? 'Verdadero' : 'Falso'}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
