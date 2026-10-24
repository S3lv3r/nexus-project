import React from 'react'
import { animVars } from '../animVars'
import { lerp } from '../atlasData'
import { Backdrop, FONT, SVG_PROPS, f } from './SceneKit'

const BASE = 112
const CX = 84
const N = 7
const NOISE = [0.62, 0.15, 0.88, 0.33, 0.74, 0.21, 0.55] // irregularidad fija: no cambia entre cuadros

/** Un lado del libro de órdenes: escalones que crecen al alejarse del precio central. */
function side(liq: number, dir: 1 | -1): { area: string; edge: string } {
  const L = liq / 100
  const gap = lerp(16, 3, L) // separación entre compra y venta (spread)
  const x0 = CX + (dir * gap) / 2
  const far = dir === 1 ? 154 : 14
  const sw = Math.abs(far - x0) / N
  const depth = lerp(0.35, 1, L) * 64
  const jag = (1 - L) * 12
  let prev = 0
  const pts: Array<[number, number]> = [[x0, BASE]]
  for (let i = 0; i < N; i++) {
    const h = Math.max(prev, depth * Math.pow((i + 1) / N, 0.8) + (NOISE[(i + (dir === 1 ? 3 : 0)) % N] - 0.5) * 2 * jag)
    prev = h
    pts.push([x0 + dir * sw * i, BASE - h], [x0 + dir * sw * (i + 1), BASE - h])
  }
  pts.push([far, BASE])
  const edge = pts.slice(1, -1).map(([x, y]) => `${f(x)} ${f(y)}`).join(' ')
  return { area: pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' '), edge }
}

/** Liquidez → libro de órdenes: con mucha liquidez las curvas son altas, parejas y casi se tocan; con poca, bajas y entrecortadas. */
export const LiquidityScene: React.FC<{ value: number }> = ({ value }) => {
  const bids = side(value, -1)
  const asks = side(value, 1)
  const d = `${lerp(4.8, 2.4, 1 - value / 100)}s`

  return (
    <svg {...SVG_PROPS}>
      <Backdrop id="li" from="#f0fdfa" to="#ccfbf1" />

      <g className="sc-bob" style={animVars({ '--d': d })}>
        <polygon points={bids.area} fill="#34d399" fillOpacity="0.28" />
        <polyline points={bids.edge} fill="none" stroke="#059669" strokeWidth="1.8" strokeLinejoin="round" />
      </g>
      <g className="sc-bob" style={{ ...animVars({ '--d': d }), animationDelay: '-1.2s' }}>
        <polygon points={asks.area} fill="#fb7185" fillOpacity="0.28" />
        <polyline points={asks.edge} fill="none" stroke="#e11d48" strokeWidth="1.8" strokeLinejoin="round" />
      </g>

      <line x1="8" x2="160" y1={BASE} y2={BASE} stroke="#64748b" strokeOpacity="0.6" strokeWidth="1.2" />
      <line x1={CX} x2={CX} y1="40" y2={BASE + 4} stroke="#64748b" strokeOpacity="0.45" strokeDasharray="2 3" />
      <g fontSize="8" fill="#64748b" style={FONT}>
        <text x="14" y="124">Compra</text>
        <text x="154" y="124" textAnchor="end">Venta</text>
      </g>
    </svg>
  )
}
