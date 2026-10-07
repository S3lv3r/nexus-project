import React, { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { PresetCatalyst } from '../types'

interface EventSimulatorModalProps {
  isOpen: boolean
  onClose: () => void
  onEventTriggered: (eventResult: any) => void
}

export const EventSimulatorModal: React.FC<EventSimulatorModalProps> = ({
  isOpen,
  onClose,
  onEventTriggered,
}) => {
  const [presets, setPresets] = useState<PresetCatalyst[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [isTriggering, setIsTriggering] = useState<boolean>(false)
  const [activeTriggerIndex, setActiveTriggerIndex] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen && presets.length === 0) {
      api.getPresetCatalysts().then((data) => setPresets(data)).catch(() => {})
    }
  }, [isOpen, presets.length])

  if (!isOpen) return null

  const handleTrigger = async (index: number) => {
    setIsTriggering(true)
    setActiveTriggerIndex(index)
    try {
      const res = await api.triggerEvent(index)
      onEventTriggered(res)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsTriggering(false)
      setActiveTriggerIndex(null)
    }
  }

  const handleTriggerRandom = async () => {
    setIsTriggering(true)
    try {
      const res = await api.triggerEvent(undefined, true)
      onEventTriggered(res)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsTriggering(false)
    }
  }

  const categories = ['ALL', 'SECUELA', 'LANZAMIENTO', 'ADAPTACION', 'ESPORTS', 'POLEMICA', 'HYPE', 'ACTUALIZACION']

  const filteredPresets = presets.filter((p) => {
    if (selectedCategory === 'ALL') return true
    return p.category === selectedCategory
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-alt)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--primary)] text-[var(--primary-text)] rounded flex items-center justify-center font-bold text-xs">
              <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--text)] tracking-tight">
                Simulador de Eventos y Noticias
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-normal">
                Dispara noticias reales para observar el impacto directo en las cotizaciones.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-[var(--surface)] hover:bg-[var(--border)] rounded text-[var(--text-muted)] flex items-center justify-center transition-colors cursor-pointer border border-[var(--border)]"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2 overflow-x-auto border-b border-[var(--border)] bg-[var(--surface-alt)]">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[var(--primary)] text-[var(--primary-text)] font-semibold'
                    : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={handleTriggerRandom}
            disabled={isTriggering}
            className="px-3 py-1 platform-btn-primary text-xs flex-shrink-0 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-shuffle text-xs"></i>
            <span>Aleatorio</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[var(--surface)]">
          {filteredPresets.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-muted)]">
              <i className="fa-solid fa-spinner animate-spin text-2xl text-[var(--primary)] mb-2"></i>
              <p className="text-xs uppercase font-medium">Cargando catalizadores...</p>
            </div>
          ) : (
            filteredPresets.map((preset, index) => {
              const originalIndex = presets.findIndex((p) => p.title === preset.title)
              const isCurrentTriggering = isTriggering && activeTriggerIndex === originalIndex

              return (
                <div
                  key={index}
                  className="bg-[var(--surface-alt)] border border-[var(--border)] hover:border-[var(--primary)] rounded p-3.5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[var(--primary)] text-[var(--primary-text)] rounded text-[10px] font-mono font-medium uppercase">
                        {preset.category}
                      </span>
                      <h3 className="text-xs font-semibold text-[var(--text)]">
                        {preset.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleTrigger(originalIndex)}
                      disabled={isTriggering}
                      className="px-3 py-1 platform-btn-primary text-xs flex-shrink-0 flex items-center gap-1.5"
                    >
                      {isCurrentTriggering ? (
                        <i className="fa-solid fa-spinner animate-spin"></i>
                      ) : (
                        <i className="fa-solid fa-bolt text-xs"></i>
                      )}
                      <span>{isCurrentTriggering ? 'Disparando...' : 'Disparar'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-2 font-normal">
                    {preset.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border)]">
                    {preset.impacts.map((imp, i) => {
                      const isPos = imp.change_pct >= 0
                      return (
                        <div
                          key={i}
                          className={`inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded ${
                            isPos
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span className="font-sans font-medium">{imp.asset_slug}:</span>
                          <span>
                            {isPos ? '+' : ''}
                            {imp.change_pct}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
