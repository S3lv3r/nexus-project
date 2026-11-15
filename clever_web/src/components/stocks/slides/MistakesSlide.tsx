import React from 'react'
import { HudItem, useSlideShown } from '../../hud/HudSlide'
import { GROUP_STYLES } from '../../trading/CommonMistakes'
import { MistakeCard } from '../../trading/MistakeCard'
import { MISTAKE_GROUPS } from '../../trading/MistakeData'
import { MISTAKE_ICONS } from '../../trading/MistakeIcons'

/** Errores comunes: una columna por tipo de error, con sus tarjetas apiladas en vertical. */
export const MistakesSlide: React.FC = () => {
  const shown = useSlideShown()

  return (
    <>
      {MISTAKE_GROUPS.map((group, gi) => {
        const style = GROUP_STYLES[group.category]
        return (
          <HudItem lazy key={group.category} order={gi}>
            <h3 className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-slate-700">
              <span className={`h-2.5 w-2.5 rounded-full ring-4 ${style.dot}`} />
              {group.title}
              <span className="h-px flex-1 bg-slate-100" />
            </h3>
            <div className="space-y-4">
              {group.mistakes.map((mistake, i) => {
                const Icon = MISTAKE_ICONS[mistake.icon]
                return (
                  <MistakeCard
                    key={mistake.id}
                    title={mistake.title}
                    text={mistake.text}
                    icon={<Icon />}
                    iconTone={style.icon}
                    glow={style.glow}
                    shown={shown}
                    index={i}
                  />
                )
              })}
            </div>
          </HudItem>
        )
      })}
    </>
  )
}
