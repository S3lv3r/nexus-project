import React, { useState } from 'react'
import { TRADERS } from '../HudData'
import { HudCard } from '../HudCard'
import { HUD_ICONS } from '../HudIcons'

export const TraderTypesCard: React.FC = () => {
  const [picked, setPicked] = useState<number | null>(null)
  const choice = picked !== null ? TRADERS[picked] : null

  return (
    <HudCard
      title="Tipos de trader"
      icon="users"
      accent={['rose', 'sky']}
      subtitle="De las operaciones más rápidas a las más pacientes"
    >
      <div aria-hidden="true" className="hc-spectrum">
        <div className="hc-spectrum-track">
          {TRADERS.map((t, i) => (
            <span key={t.name} data-on={picked === i ? '' : undefined} className={`hc-spectrum-dot hc-tone-${t.tone}`} />
          ))}
        </div>
        <div className="hc-spectrum-labels">
          <span>Más rápido</span>
          <span>Más paciente</span>
        </div>
      </div>

      <div role="group" aria-label="Tipos de trader" className="hc-traders">
        {TRADERS.map((t, i) => {
          const Icon = HUD_ICONS[t.icon]
          const on = picked === i
          return (
            <button
              key={t.name}
              type="button"
              aria-pressed={on}
              onClick={() => setPicked(on ? null : i)}
              className={`hc-trader hc-tone-${t.tone}`}
            >
              <span aria-hidden="true" className="hc-icon">
                <Icon className="hc-svg" />
              </span>
              <span className="min-w-0">
                <span className="hc-trader-name">{t.name}</span>
                <span className="hc-trader-text">{t.text}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className={`hc-pitch ${choice ? `hc-tone-${choice.tone}` : ''}`}>
        <p className="hc-pitch-q">Y tú, ¿qué tipo de trader quieres ser?</p>
        <p aria-live="polite" className="hc-pitch-a">
          {choice ? (
            <span key={choice.name} className="hc-swap inline-block">
              Elegiste ser <strong>Team {choice.name}</strong>.{' '}
              <em className="hc-pitch-note">Se cargó tu elección a tu perfil</em>
            </span>
          ) : (
            'Toca una opción para elegir.'
          )}
        </p>
      </div>
    </HudCard>
  )
}
