import React from 'react'
import { HudItem, useSlideShown } from '../../hud/HudSlide'
import { EMA, SMA } from '../../trading/IndicatorData'
import type { CategoryKey, Indicator } from '../../trading/IndicatorData'
import { CategoryHeader, IndicatorAccordion, Reveal } from '../../trading/IndicatorParts'
import { MovingAveragesDiagram } from '../../trading/MovingAveragesDiagram'
import { AverageCard, IchimokuCard, LOOK, OtherAverages } from '../../trading/TrendIndicators'

/* Cada subtema muestra el encabezado de su familia y, debajo, la tarjeta correspondiente (las de siempre). */

/** Tendencia y medias móviles · 1: SMA y EMA lado a lado. */
export const SmaEmaSlide: React.FC = () => {
  const shown = useSlideShown()
  return (
    <>
      <HudItem lazy order={0} className="md:col-span-2">
        <CategoryHeader category="trend" />
      </HudItem>
      <HudItem lazy order={1}>
        <Reveal shown={shown} index={0} className="h-full">
          <AverageCard indicator={SMA} look={LOOK.sma} />
        </Reveal>
      </HudItem>
      <HudItem lazy order={2}>
        <Reveal shown={shown} index={1} className="h-full">
          <AverageCard indicator={EMA} look={LOOK.ema} />
        </Reveal>
      </HudItem>
    </>
  )
}

/** Tendencia y medias móviles · 2: las otras medias móviles (abierta desde el inicio). */
export const OtherAveragesSlide: React.FC = () => {
  const shown = useSlideShown()
  return (
    <>
      <HudItem lazy order={0}>
        <CategoryHeader category="trend" />
      </HudItem>
      <HudItem lazy order={1}>
        <Reveal shown={shown}>
          <OtherAverages defaultOpen />
        </Reveal>
      </HudItem>
    </>
  )
}

/** Tendencia y medias móviles · 3: el gráfico interactivo de las medias. */
export const MovingAveragesSlide: React.FC = () => {
  const shown = useSlideShown()
  return (
    <>
      <HudItem lazy order={0}>
        <CategoryHeader category="trend" />
      </HudItem>
      <HudItem lazy order={1}>
        <Reveal shown={shown}>
          <MovingAveragesDiagram />
        </Reveal>
      </HudItem>
    </>
  )
}

/** Tendencia y medias móviles · 4: la nube de Ichimoku. */
export const IchimokuSlide: React.FC = () => {
  const shown = useSlideShown()
  return (
    <>
      <HudItem lazy order={0}>
        <CategoryHeader category="trend" />
      </HudItem>
      <HudItem lazy order={1}>
        <Reveal shown={shown}>
          <IchimokuCard large />
        </Reveal>
      </HudItem>
    </>
  )
}

/** Impulso, volatilidad y estructura: un indicador por subtema, con su tarjeta desplegada. */
export const IndicatorSlide: React.FC<{ category: Exclude<CategoryKey, 'trend'>; indicator: Indicator }> = ({
  category,
  indicator,
}) => {
  const shown = useSlideShown()
  return (
    <>
      <HudItem lazy order={0}>
        <CategoryHeader category={category} />
      </HudItem>
      <HudItem lazy order={1}>
        <IndicatorAccordion items={[indicator]} category={category} shown={shown} defaultOpen={indicator.id} large />
      </HudItem>
    </>
  )
}
