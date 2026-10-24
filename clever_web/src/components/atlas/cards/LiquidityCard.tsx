import React from 'react'
import { SceneCard } from '../SceneCard'
import { LiquidityScene } from '../scenes/LiquidityScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { goodColor, liquidityLabel } from '../atlasData'

/** Liquidez → libro de órdenes (poca: curvas bajas y entrecortadas · mucha: altas y parejas) */
export const LiquidityCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Liquidez"
      tip="Qué tan fácil es comprar o vender sin mover mucho el precio. Un libro de órdenes profundo y parejo, con poca separación entre compra y venta, indica alta liquidez."
      value={Math.round(v)}
      suffix="/100"
      label={liquidityLabel(v)}
      labelColor={goodColor(v)}
    >
      <LiquidityScene value={v} />
    </SceneCard>
  )
}