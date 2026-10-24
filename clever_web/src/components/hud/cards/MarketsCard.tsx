import React from 'react'
import { MARKETS } from '../HudData'
import { HudCard } from '../HudCard'
import { HudRows } from '../HudRows'
import { pastelGlow } from '../Hudglow'

/** Mercados donde se opera: cada mercado con su definición y un ejemplo. */
export const MarketsCard: React.FC = () => (
  <HudCard title="Mercados donde se opera" icon="globe" glow={pastelGlow('sky', 'peach', 'violet')}>
    <HudRows items={MARKETS} label="Mercados donde se opera" />
  </HudCard>
)