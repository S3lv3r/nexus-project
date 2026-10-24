import React from 'react'
import { CONCEPTS } from '../HudData'
import { HudCard } from '../HudCard'
import { HudRows } from '../HudRows'
import { pastelGlow } from '../hudGlow'

/** Conceptos básicos: ocho términos que se pueden tocar para enfocarlos. */
export const ConceptsCard: React.FC = () => (
  <HudCard title="Conceptos básicos" icon="bulb" glow={pastelGlow('mint', 'sky', 'violet')}>
    <HudRows items={CONCEPTS} label="Conceptos básicos" />
  </HudCard>
)