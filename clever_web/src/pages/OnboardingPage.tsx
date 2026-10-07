import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES } from '../data/catalog'

const GOALS = [
  'Aprender trading y finanzas desde cero',
  'Mejorar mi análisis técnico y lectura de gráficos',
  'Aprender de forma interactiva con cultura pop y videojuegos',
  'Comprender economías digitales y mercados reales',
]

export const OnboardingPage: React.FC = () => {
  const { user, updateUserProfile, showToast } = usePlatform()
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user.interests.length > 0 ? user.interests : ['trading'],
  )
  const [selectedGoal, setSelectedGoal] = useState<string>(user.goal || GOALS[0])
  const navigate = useNavigate()

  const handleToggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length <= 1) {
        showToast('Selecciona al menos una categoría.', 'info')
        return
      }
      setSelectedInterests(selectedInterests.filter((x) => x !== id))
    } else {
      setSelectedInterests([...selectedInterests, id])
    }
  }

  const handleNext = () => {
    if (step === 1) {
      if (selectedInterests.length === 0) {
        showToast('Selecciona al menos un interés.', 'error')
        return
      }
      setStep(2)
    } else {
      updateUserProfile({
        interests: selectedInterests,
        goal: selectedGoal,
        onboardingCompleted: true,
      })
      showToast('Preferencias guardadas.', 'success')
      navigate('/diagnostico?cat=' + (selectedInterests[0] || 'trading'))
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="platform-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] border-b border-[var(--border)] pb-3">
          <span>Configuración Inicial</span>
          <span>Paso {step} de 2</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h1 className="text-base font-bold text-[var(--text)]">
                Selecciona tus áreas de interés
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Podrás añadir o remover temas en cualquier momento.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedInterests.includes(cat.id)

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleToggleInterest(cat.id)}
                    className={`p-3 rounded border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--text)] font-semibold'
                        : 'bg-[var(--bg-alt)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <i className={cat.icon}></i>
                      <span className="text-xs">{cat.name}</span>
                    </div>
                    {isSelected && (
                      <i className="fa-solid fa-check text-[10px] text-[var(--primary)]"></i>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h1 className="text-base font-bold text-[var(--text)]">
                ¿Cuál es tu objetivo principal?
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Esto ayuda a ordenar las sugerencias y desafíos recomendados.
              </p>
            </div>

            <div className="space-y-2">
              {GOALS.map((g, idx) => {
                const isSelected = selectedGoal === g

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGoal(g)}
                    className={`w-full p-3 rounded border text-left text-xs transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--text)] font-semibold'
                        : 'bg-[var(--bg-alt)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    <span>{g}</span>
                    {isSelected && (
                      <i className="fa-solid fa-check text-[10px] text-[var(--primary)]"></i>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="platform-btn-secondary py-1.5 px-3 text-xs"
            >
              Atrás
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="platform-btn-primary py-1.5 px-4 text-xs font-semibold"
          >
            <span>{step === 2 ? 'Finalizar' : 'Continuar'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
