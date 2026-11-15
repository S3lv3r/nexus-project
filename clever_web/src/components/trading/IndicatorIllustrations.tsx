import React from 'react'
import type { IllustrationKey } from './IndicatorData'
import { adx, bollinger, buildPrices, fibLevels, kdj, macd, rsi, toOhlc } from './indicatorMath'

const W = 520
const PL = 12
const PR = 44
const RIGHT = W - PR

const INK = {
  grid: 'color-mix(in oklab, var(--text) 8%, transparent)',
  axis: 'color-mix(in oklab, var(--text) 20%, transparent)',
  label: 'color-mix(in oklab, var(--text) 55%, transparent)',
  title: 'color-mix(in oklab, var(--text) 72%, transparent)',
  price: 'color-mix(in oklab, var(--text) 68%, transparent)',
  surface: 'var(--surface)',
}

const C = {
  sky: '#4ba9dc',
  violet: '#9a86e6',
  amber: '#e2a93c',
  rose: '#e57385',
  emerald: '#3cb88c',
  teal: '#33b0a4',
  indigo: '#7182e0',
}

const tint = (color: string, amount: number) => `color-mix(in oklab, ${color} ${amount}%, transparent)`

const TEXT: React.CSSProperties = { fontFamily: 'inherit' }

const HALO = { stroke: 'var(--surface)', strokeWidth: 3.5, strokeLinejoin: 'round' as const, paintOrder: 'stroke' as const }

type Num = number | null

const finite = (vals: Num[]) => vals.filter((v): v is number => v !== null && !Number.isNaN(v))

const scaleX = (n: number) => (i: number) => PL + (i / (n - 1)) * (RIGHT - PL)

interface PanelScale {
  top: number
  height: number
  min: number
  max: number
  y: (v: number) => number
}

const panel = (top: number, height: number, min: number, max: number, pad = 8): PanelScale => ({
  top,
  height,
  min,
  max,
  y: (v: number) => top + pad + (1 - (v - min) / (max - min || 1)) * (height - 2 * pad),
})

function linePath(vals: Num[], x: (i: number) => number, y: (v: number) => number): string {
  let d = ''
  let pen = false
  vals.forEach((v, i) => {
    if (v === null || Number.isNaN(v)) {
      pen = false
      return
    }
    d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)} `
    pen = true
  })
  return d.trim()
}

function areaPath(vals: number[], x: (i: number) => number, y: (v: number) => number, base: number): string {
  const line = vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  return `${line} L${x(vals.length - 1).toFixed(1)},${base} L${x(0).toFixed(1)},${base} Z`
}

const Svg: React.FC<{ height: number; label: string; children: React.ReactNode }> = ({ height, label, children }) => (
  <svg viewBox={`0 0 ${W} ${height}`} role="img" aria-label={label} className="h-auto w-full" style={TEXT}>
    {children}
  </svg>
)

const PanelTitle: React.FC<{ p: PanelScale; title: string }> = ({ p, title }) => (
  <g>
    <rect x={PL + 2} y={p.top + 2} width={title.length * 6.4 + 12} height="17" rx="5" fill="color-mix(in srgb, var(--surface) 88%, transparent)" />
    <text x={PL + 8} y={p.top + 14} fontSize="11" fontWeight="600" fill={INK.title}>
      {title}
    </text>
  </g>
)

const PanelGrid: React.FC<{ p: PanelScale; title?: string; ticks?: Array<{ v: number; label: string }> }> = ({ p, ticks = [] }) => (
  <g>
    {[0, 0.25, 0.5, 0.75, 1].map((f) => (
      <line key={f} x1={PL} x2={RIGHT} y1={p.top + f * p.height} y2={p.top + f * p.height} stroke={INK.grid} />
    ))}
    {ticks.map((t) => (
      <text {...HALO} key={t.label} x={W - 6} y={p.y(t.v) + 3.5} textAnchor="end" fontSize="10.5" fill={INK.label}>
        {t.label}
      </text>
    ))}
  </g>
)

const Legend: React.FC<{ items: Array<{ label: string; color: string; dashed?: boolean; box?: boolean }>; x: number; y: number }> = ({ items, x, y }) => {
  let cursor = x
  return (
    <g fontSize="10.5" fill={INK.label}>
      {items.map((it) => {
        const at = cursor
        cursor += 26 + it.label.length * 5.6 + 10
        return (
          <g key={it.label}>
            {it.box ? (
              <rect x={at} y={y - 8} width="16" height="9" rx="2" fill={it.color} />
            ) : (
              <line x1={at} x2={at + 16} y1={y - 3.5} y2={y - 3.5} stroke={it.color} strokeWidth="2.6" strokeLinecap="round" strokeDasharray={it.dashed ? '3 3' : undefined} />
            )}
            <text {...HALO} x={at + 21} y={y}>
              {it.label}
            </text>
          </g>
        )
      })}
    </g>
  )
}

const Zone: React.FC<{ p: PanelScale; from: number; to: number; color: string; label?: string; opacity?: number }> = ({ p, from, to, color, label, opacity = 14 }) => {
  const y1 = p.y(Math.min(p.max, to))
  const y2 = p.y(Math.max(p.min, from))
  return (
    <g>
      <rect x={PL} y={y1} width={RIGHT - PL} height={Math.max(0, y2 - y1)} fill={tint(color, opacity)} />
      {label && (
        <text {...HALO} x={RIGHT - 6} y={y1 + 12} textAnchor="end" fontSize="10" fontWeight="600" fill={`color-mix(in oklab, ${color} 70%, var(--text))`}>
          {label}
        </text>
      )}
    </g>
  )
}

const PriceArea: React.FC<{ id: string; vals: number[]; x: (i: number) => number; p: PanelScale; color?: string }> = ({ id, vals, x, p, color = INK.price }) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--text)" stopOpacity="0.12" />
        <stop offset="100%" stopColor="var(--text)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d={areaPath(vals, x, p.y, p.top + p.height)} fill={`url(#${id})`} />
    <path d={linePath(vals, x, p.y)} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  </g>
)

const Guide: React.FC<{ x: number; top: number; bottom: number; color: string }> = ({ x, top, bottom, color }) => (
  <line x1={x} x2={x} y1={top} y2={bottom} stroke={tint(color, 55)} strokeDasharray="3 4" />
)

const Marker: React.FC<{ x: number; y: number; up: boolean }> = ({ x, y, up }) => {
  const color = up ? C.emerald : C.rose
  return up ? (
    <path d={`M${x},${y} l-5,8 h10 z`} fill={color} />
  ) : (
    <path d={`M${x},${y} l-5,-8 h10 z`} fill={color} />
  )
}

const rangeTicks = (min: number, max: number, count = 3) =>
  Array.from({ length: count }, (_, i) => {
    const v = min + ((i + 0.5) / count) * (max - min)
    return { v, label: v.toFixed(0) }
  })

const WEIGHT_PERIODS = 8
const ALPHA = 2 / (WEIGHT_PERIODS + 1)

export const SMA_WEIGHTS = Array.from({ length: WEIGHT_PERIODS }, () => 1)
export const EMA_WEIGHTS = Array.from({ length: WEIGHT_PERIODS }, (_, i) => ALPHA * (1 - ALPHA) ** (WEIGHT_PERIODS - 1 - i))
export const LWMA_WEIGHTS = Array.from({ length: WEIGHT_PERIODS }, (_, i) => i + 1)

export const WeightBars: React.FC<{ weights: number[]; color: string; label: string }> = ({ weights, color, label }) => {
  const total = weights.reduce((s, w) => s + w, 0)
  const max = Math.max(...weights)
  const bw = 15
  const gap = 6
  const width = weights.length * bw + (weights.length - 1) * gap
  const left = (180 - width) / 2
  const id = `wb-${label.length}-${Math.round(max * 1000)}`
  return (
    <svg viewBox="0 0 180 84" role="img" aria-label={label} className="h-auto w-full" style={TEXT}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <line x1="8" x2="172" y1="72" y2="72" stroke={INK.axis} />
      {weights.map((w, i) => {
        const h = Math.max(4, (w / max) * 52)
        const bx = left + i * (bw + gap)
        return (
          <g key={i}>
            <rect x={bx} y={72 - h} width={bw} height={h} rx="3" fill={`url(#${id})`} />
            <text x={bx + bw / 2} y={72 - h - 3.5} textAnchor="middle" fontSize="5" fontWeight="500" fill={INK.label}>
              {Math.round((w / total) * 100)}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const MACD_PRICES = buildPrices(7, [
  { len: 26, drift: 0.5, vol: 0.7 },
  { len: 22, drift: -0.7, vol: 0.8 },
  { len: 24, drift: 0.6, vol: 0.8 },
  { len: 18, drift: -0.5, vol: 0.8 },
])
const MACD_DATA = macd(MACD_PRICES, 12, 26, 9)
const MACD_FROM = 30

export const MacdIllustration: React.FC = () => {
  const price = MACD_PRICES.slice(MACD_FROM)
  const m = MACD_DATA.macd.slice(MACD_FROM)
  const s = MACD_DATA.signal.slice(MACD_FROM)
  const h = MACD_DATA.hist.slice(MACD_FROM)
  const n = price.length
  const x = scaleX(n)
  const pp = panel(6, 112, Math.min(...price), Math.max(...price))
  const lim = Math.max(...m.map(Math.abs), ...s.map(Math.abs), ...h.map(Math.abs)) * 1.15
  const mp = panel(134, 150, -lim, lim)
  const barW = ((RIGHT - PL) / n) * 0.62
  const crosses: Array<{ i: number; up: boolean }> = []
  for (let i = 1; i < n; i++) if (h[i - 1] <= 0 !== h[i] <= 0) crosses.push({ i, up: h[i] > 0 })

  return (
    <Svg height={292} label="MACD bajo el precio: línea MACD, línea de señal, histograma y los cruces marcados en ambos paneles">
      <PanelGrid p={pp} title="Precio" ticks={rangeTicks(pp.min, pp.max)} />
      <PanelGrid p={mp} ticks={[{ v: 0, label: '0' }]} />
      {crosses.map((c) => (
        <Guide key={c.i} x={x(c.i)} top={pp.top} bottom={mp.top + mp.height} color={c.up ? C.emerald : C.rose} />
      ))}
      <PriceArea id="ill-macd-area" vals={price} x={x} p={pp} />
      {crosses.map((c) => (
        <Marker key={c.i} x={x(c.i)} y={c.up ? pp.y(price[c.i]) + 7 : pp.y(price[c.i]) - 7} up={c.up} />
      ))}
      <line x1={PL} x2={RIGHT} y1={mp.y(0)} y2={mp.y(0)} stroke={INK.axis} />
      {h.map((v, i) => {
        const growing = i > 0 && Math.abs(v) >= Math.abs(h[i - 1])
        const color = v >= 0 ? C.emerald : C.rose
        return (
          <rect
            key={i}
            x={x(i) - barW / 2}
            y={Math.min(mp.y(0), mp.y(v))}
            width={barW}
            height={Math.max(Math.abs(mp.y(v) - mp.y(0)), 0.8)}
            rx="1"
            fill={tint(color, growing ? 55 : 30)}
          />
        )
      })}
      <path d={linePath(s, x, mp.y)} fill="none" stroke={C.amber} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linePath(m, x, mp.y)} fill="none" stroke={C.sky} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      {crosses.map((c) => (
        <circle key={c.i} cx={x(c.i)} cy={mp.y(m[c.i])} r="4.2" fill={INK.surface} stroke={c.up ? C.emerald : C.rose} strokeWidth="2.2" />
      ))}
      <Legend
        x={PL + 4}
        y={mp.top + 14}
        items={[
          { label: 'MACD', color: C.sky },
          { label: 'Señal', color: C.amber },
          { label: 'Histograma', color: tint(C.emerald, 55), box: true },
        ]}
      />
      <PanelTitle p={pp} title="Precio" />
    </Svg>
  )
}

const RSI_PRICES = buildPrices(11, [
  { len: 20, drift: 1.0, vol: 1.7 },
  { len: 20, drift: -1.2, vol: 1.7 },
  { len: 18, drift: 0.3, vol: 1.6 },
  { len: 14, drift: 1.1, vol: 1.6 },
  { len: 14, drift: -1.1, vol: 1.6 },
])
const RSI_DATA = rsi(RSI_PRICES, 14)
const RSI_FROM = 14

export const RsiIllustration: React.FC = () => {
  const price = RSI_PRICES.slice(RSI_FROM)
  const vals = RSI_DATA.slice(RSI_FROM)
  const n = price.length
  const x = scaleX(n)
  const pp = panel(6, 108, Math.min(...price), Math.max(...price))
  const rp = panel(130, 156, 0, 100, 6)
  const entries: Array<{ i: number; high: boolean }> = []
  for (let i = 1; i < n; i++) {
    const a = vals[i - 1]
    const b = vals[i]
    if (a === null || b === null) continue
    if (a < 70 && b >= 70) entries.push({ i, high: true })
    if (a > 30 && b <= 30) entries.push({ i, high: false })
  }

  return (
    <Svg height={290} label="RSI bajo el precio, con las zonas de sobrecompra por encima de 70 y de sobreventa por debajo de 30">
      <PanelGrid p={pp} title="Precio" ticks={rangeTicks(pp.min, pp.max)} />
      <Zone p={rp} from={70} to={100} color={C.rose} label="Sobrecompra" />
      <Zone p={rp} from={0} to={30} color={C.sky} label="Sobreventa" />
      <PanelGrid p={rp} title="RSI (14)" ticks={[{ v: 70, label: '70' }, { v: 50, label: '50' }, { v: 30, label: '30' }]} />
      <g stroke={INK.axis} strokeDasharray="3 4">
        <line x1={PL} x2={RIGHT} y1={rp.y(70)} y2={rp.y(70)} />
        <line x1={PL} x2={RIGHT} y1={rp.y(30)} y2={rp.y(30)} />
      </g>
      {entries.map((e) => (
        <Guide key={e.i} x={x(e.i)} top={pp.top} bottom={rp.top + rp.height} color={e.high ? C.rose : C.sky} />
      ))}
      <PriceArea id="ill-rsi-area" vals={price} x={x} p={pp} />
      <defs>
        <clipPath id="ill-rsi-high">
          <rect x={PL} y={rp.top} width={RIGHT - PL} height={rp.y(70) - rp.top} />
        </clipPath>
        <clipPath id="ill-rsi-low">
          <rect x={PL} y={rp.y(30)} width={RIGHT - PL} height={rp.top + rp.height - rp.y(30)} />
        </clipPath>
      </defs>
      <path d={linePath(vals, x, rp.y)} fill="none" stroke={C.violet} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linePath(vals, x, rp.y)} fill="none" stroke={C.rose} strokeWidth="2.8" strokeLinejoin="round" clipPath="url(#ill-rsi-high)" />
      <path d={linePath(vals, x, rp.y)} fill="none" stroke={C.sky} strokeWidth="2.8" strokeLinejoin="round" clipPath="url(#ill-rsi-low)" />
      {entries.map((e) => (
        <circle key={e.i} cx={x(e.i)} cy={rp.y(vals[e.i] as number)} r="4" fill={INK.surface} stroke={e.high ? C.rose : C.sky} strokeWidth="2.2" />
      ))}
      <PanelTitle p={pp} title="Precio" />
      <PanelTitle p={rp} title="RSI (14)" />
    </Svg>
  )
}

const KDJ_PRICES = buildPrices(5, [
  { len: 12, drift: 1, vol: 1.1 },
  { len: 12, drift: -1.1, vol: 1.1 },
  { len: 12, drift: 1, vol: 1.1 },
  { len: 10, drift: -0.9, vol: 1.1 },
  { len: 10, drift: 1, vol: 1.1 },
])
const KDJ_DATA = kdj(toOhlc(KDJ_PRICES, 6, 1.0), 9)
const KDJ_FROM = 9

export const KdjIllustration: React.FC = () => {
  const price = KDJ_PRICES.slice(KDJ_FROM)
  const k = KDJ_DATA.k.slice(KDJ_FROM)
  const d = KDJ_DATA.d.slice(KDJ_FROM)
  const j = KDJ_DATA.j.slice(KDJ_FROM)
  const n = price.length
  const x = scaleX(n)
  const pp = panel(6, 104, Math.min(...price), Math.max(...price))
  const kp = panel(126, 160, Math.min(-5, ...j), Math.max(105, ...j), 6)
  const crosses: Array<{ i: number; up: boolean }> = []
  for (let i = 1; i < n; i++) {
    const before = k[i - 1] - d[i - 1]
    const now = k[i] - d[i]
    if (before <= 0 !== now <= 0 && (k[i] > 70 || k[i] < 30)) crosses.push({ i, up: now > 0 })
  }

  return (
    <Svg height={290} label="KDJ bajo el precio: líneas K, D y J con las zonas por encima de 80 y por debajo de 20">
      <PanelGrid p={pp} title="Precio" ticks={rangeTicks(pp.min, pp.max)} />
      <Zone p={kp} from={80} to={kp.max} color={C.rose} label="Zona alta" />
      <Zone p={kp} from={kp.min} to={20} color={C.sky} />
      <text {...HALO} x={RIGHT - 6} y={kp.y(20) + 14} textAnchor="end" fontSize="10" fontWeight="600" fill={`color-mix(in oklab, ${C.sky} 70%, var(--text))`}>
        Zona baja
      </text>
      <PanelGrid p={kp} ticks={[{ v: 80, label: '80' }, { v: 20, label: '20' }]} />
      <g stroke={INK.axis} strokeDasharray="3 4">
        <line x1={PL} x2={RIGHT} y1={kp.y(80)} y2={kp.y(80)} />
        <line x1={PL} x2={RIGHT} y1={kp.y(20)} y2={kp.y(20)} />
      </g>
      {crosses.map((c) => (
        <Guide key={c.i} x={x(c.i)} top={pp.top} bottom={kp.top + kp.height} color={c.up ? C.emerald : C.rose} />
      ))}
      <PriceArea id="ill-kdj-area" vals={price} x={x} p={pp} />
      <path d={linePath(j, x, kp.y)} fill="none" stroke={C.violet} strokeWidth="1.6" strokeOpacity="0.85" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linePath(d, x, kp.y)} fill="none" stroke={C.amber} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linePath(k, x, kp.y)} fill="none" stroke={C.sky} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      {crosses.map((c) => (
        <circle key={c.i} cx={x(c.i)} cy={kp.y(k[c.i])} r="4" fill={INK.surface} stroke={c.up ? C.emerald : C.rose} strokeWidth="2.2" />
      ))}
      <Legend
        x={PL + 4}
        y={kp.top + 14}
        items={[
          { label: 'K', color: C.sky },
          { label: 'D', color: C.amber },
          { label: 'J', color: C.violet },
        ]}
      />
      <PanelTitle p={pp} title="Precio" />
    </Svg>
  )
}

const BOLL_PRICES = buildPrices(3, [
  { len: 22, drift: 0.05, vol: 0.45 },
  { len: 20, drift: 0.25, vol: 2.4 },
  { len: 22, drift: -0.05, vol: 0.5 },
])
const BOLL = bollinger(BOLL_PRICES, 20, 2)
const BOLL_FROM = 19

export const BollingerIllustration: React.FC = () => {
  const price = BOLL_PRICES.slice(BOLL_FROM)
  const up = BOLL.upper.slice(BOLL_FROM) as number[]
  const mid = BOLL.mid.slice(BOLL_FROM)
  const lo = BOLL.lower.slice(BOLL_FROM) as number[]
  const n = price.length
  const x = scaleX(n)
  const all = [...price, ...up, ...lo]
  const p = panel(28, 196, Math.min(...all), Math.max(...all), 6)
  const width = up.map((u, i) => u - lo[i])
  const early = width.slice(4, Math.floor(n * 0.45))
  const narrow = 4 + early.indexOf(Math.min(...early))
  const wide = width.indexOf(Math.max(...width))
  const band = `${up.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${p.y(v).toFixed(1)}`).join(' ')} ${lo
    .map((_, i) => `L${x(n - 1 - i).toFixed(1)},${p.y(lo[n - 1 - i]).toFixed(1)}`)
    .join(' ')} Z`

  const Note: React.FC<{ i: number; text: string; color: string }> = ({ i, text, color }) => (
    <g>
      <line x1={x(i)} x2={x(i)} y1={p.y(up[i]) - 4} y2={p.y(lo[i]) + 4} stroke={color} strokeWidth="1.4" />
      <line x1={x(i) - 4} x2={x(i) + 4} y1={p.y(up[i]) - 4} y2={p.y(up[i]) - 4} stroke={color} strokeWidth="1.4" />
      <line x1={x(i) - 4} x2={x(i) + 4} y1={p.y(lo[i]) + 4} y2={p.y(lo[i]) + 4} stroke={color} strokeWidth="1.4" />
      <text {...HALO} x={x(i)} y={p.y(lo[i]) + 18} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={`color-mix(in oklab, ${color} 70%, var(--text))`}>
        {text}
      </text>
    </g>
  )

  return (
    <Svg height={250} label="Bandas de Bollinger: se estrechan cuando la volatilidad baja y se ensanchan cuando sube">
      <defs>
        <linearGradient id="ill-boll-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.sky} stopOpacity="0.22" />
          <stop offset="50%" stopColor={C.sky} stopOpacity="0.1" />
          <stop offset="100%" stopColor={C.sky} stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <PanelGrid p={p} ticks={rangeTicks(p.min, p.max)} />
      <path d={band} fill="url(#ill-boll-band)" />
      <path d={linePath(up, x, p.y)} fill="none" stroke={C.sky} strokeWidth="1.8" strokeLinejoin="round" />
      <path d={linePath(lo, x, p.y)} fill="none" stroke={C.sky} strokeWidth="1.8" strokeLinejoin="round" />
      <path d={linePath(mid, x, p.y)} fill="none" stroke={INK.label} strokeWidth="1.4" strokeDasharray="4 4" />
      <path d={linePath(price, x, p.y)} fill="none" stroke={C.indigo} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <Note i={narrow} text="Contracción" color={C.teal} />
      <Note i={wide} text="Expansión" color={C.amber} />
      <Legend
        x={PL + 4}
        y={16}
        items={[
          { label: 'Precio', color: C.indigo },
          { label: 'Bandas', color: C.sky },
          { label: 'Media (20)', color: INK.label, dashed: true },
        ]}
      />
    </Svg>
  )
}

const ADX_CLOSE = buildPrices(9, [
  { len: 36, drift: 0, vol: 1.2 },
  { len: 22, drift: 1.0, vol: 1.2 },
  { len: 20, drift: -0.05, vol: 1.2 },
])
const ADX_DATA = adx(toOhlc(ADX_CLOSE, 4, 1.2), 14)
const ADX_FROM = 27

export const AdxIllustration: React.FC = () => {
  const price = ADX_CLOSE.slice(ADX_FROM)
  const vals = ADX_DATA.slice(ADX_FROM)
  const n = price.length
  const x = scaleX(n)
  const top = Math.max(55, ...finite(vals)) + 4
  const pp = panel(6, 108, Math.min(...price), Math.max(...price))
  const ap = panel(130, 156, 0, top, 6)
  const strong: Array<[number, number]> = []
  let start = -1
  vals.forEach((v, i) => {
    const on = v !== null && v >= 25
    if (on && start < 0) start = i
    if ((!on || i === n - 1) && start >= 0) {
      strong.push([start, on ? i : i - 1])
      start = -1
    }
  })

  return (
    <Svg height={290} label="ADX bajo el precio: por debajo de 25 la tendencia es débil y por encima de 40 es fuerte">
      {strong.map(([a, b]) => (
        <rect key={a} x={x(a)} y={pp.top} width={Math.max(2, x(b) - x(a))} height={ap.top + ap.height - pp.top} fill={tint(C.teal, 8)} />
      ))}
      <PanelGrid p={pp} title="Precio" ticks={rangeTicks(pp.min, pp.max)} />
      <Zone p={ap} from={0} to={25} color="#94a3b8" label="Débil o sin tendencia" opacity={12} />
      <Zone p={ap} from={40} to={top} color={C.teal} label="Tendencia fuerte" opacity={14} />
      <PanelGrid p={ap} title="ADX (14)" ticks={[{ v: 40, label: '40' }, { v: 25, label: '25' }]} />
      <g stroke={INK.axis} strokeDasharray="3 4">
        <line x1={PL} x2={RIGHT} y1={ap.y(25)} y2={ap.y(25)} />
        <line x1={PL} x2={RIGHT} y1={ap.y(40)} y2={ap.y(40)} />
      </g>
      <PriceArea id="ill-adx-area" vals={price} x={x} p={pp} />
      <path d={linePath(vals, x, ap.y)} fill="none" stroke={C.teal} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <PanelTitle p={pp} title="Precio" />
      <PanelTitle p={ap} title="ADX (14)" />
    </Svg>
  )
}

const VIX_PRICES = buildPrices(17, [
  { len: 30, drift: 0.35, vol: 0.5 },
  { len: 12, drift: -2.2, vol: 1.6 },
  { len: 14, drift: 0.2, vol: 1.4 },
  { len: 24, drift: 0.45, vol: 0.6 },
])
const VIX_DATA = (() => {
  const ret = VIX_PRICES.map((p, i) => (i === 0 ? 0 : Math.log(p / VIX_PRICES[i - 1])))
  const out: number[] = []
  let v = 13
  ret.forEach((r, i) => {
    const win = ret.slice(Math.max(1, i - 9), Math.max(2, i + 1))
    const mean = win.reduce((s, z) => s + z, 0) / win.length
    const sd = Math.sqrt(win.reduce((s, z) => s + (z - mean) ** 2, 0) / win.length)
    const target = 11 + sd * 900 + Math.max(0, -r) * 900
    v += (target - v) * 0.35
    out.push(v)
  })
  return out
})()

export const VixIllustration: React.FC = () => {
  const price = VIX_PRICES
  const vals = VIX_DATA
  const n = price.length
  const x = scaleX(n)
  const pp = panel(6, 108, Math.min(...price), Math.max(...price))
  const vp = panel(130, 156, 8, 50, 6)
  const peak = vals.indexOf(Math.max(...vals))
  const dropStart = 30

  return (
    <Svg height={290} label="VIX bajo el S&P 500: cuando el índice cae con fuerza, el VIX se dispara y luego vuelve a bajar">
      <rect x={x(dropStart)} y={pp.top} width={x(peak + 2) - x(dropStart)} height={vp.top + vp.height - pp.top} fill={tint(C.rose, 8)} />
      <PanelGrid p={pp} title="S&P 500" ticks={rangeTicks(pp.min, pp.max)} />
      <Zone p={vp} from={vp.min} to={20} color={C.emerald} label="Calma (< 20)" opacity={12} />
      <Zone p={vp} from={20} to={30} color={C.amber} label="Nerviosismo (20-30)" opacity={14} />
      <Zone p={vp} from={30} to={vp.max} color={C.rose} label="Miedo (> 30)" opacity={14} />
      <PanelGrid p={vp} title="VIX" ticks={[{ v: 30, label: '30' }, { v: 20, label: '20' }]} />
      <g stroke={INK.axis} strokeDasharray="3 4">
        <line x1={PL} x2={RIGHT} y1={vp.y(20)} y2={vp.y(20)} />
        <line x1={PL} x2={RIGHT} y1={vp.y(30)} y2={vp.y(30)} />
      </g>
      <PriceArea id="ill-vix-area" vals={price} x={x} p={pp} />
      <path d={linePath(vals, x, vp.y)} fill="none" stroke={C.violet} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(peak)} cy={vp.y(vals[peak])} r="4.5" fill={INK.surface} stroke={C.rose} strokeWidth="2.2" />
      <text {...HALO} x={x(peak) + 10} y={vp.y(vals[peak]) + 4} fontSize="10.5" fontWeight="600" fill={`color-mix(in oklab, ${C.rose} 70%, var(--text))`}>
        Pico de miedo
      </text>
      <text {...HALO} x={x(dropStart) + 6} y={pp.top + pp.height - 8} fontSize="10.5" fontWeight="600" fill={`color-mix(in oklab, ${C.rose} 70%, var(--text))`}>
        Caída fuerte
      </text>
      <PanelTitle p={pp} title="S&P 500" />
      <PanelTitle p={vp} title="VIX" />
    </Svg>
  )
}

const WAVE_POINTS: Array<{ x: number; y: number; label?: string; peak?: boolean }> = [
  { x: 20, y: 206 },
  { x: 92, y: 146, label: '1', peak: true },
  { x: 130, y: 174, label: '2' },
  { x: 230, y: 70, label: '3', peak: true },
  { x: 272, y: 112, label: '4' },
  { x: 344, y: 44, label: '5', peak: true },
  { x: 392, y: 118, label: 'A' },
  { x: 428, y: 88, label: 'B', peak: true },
  { x: 488, y: 162, label: 'C' },
]

export const ElliottIllustration: React.FC = () => {
  const toPath = (list: typeof WAVE_POINTS) => list.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const impulse = WAVE_POINTS.slice(0, 6)
  const correction = WAVE_POINTS.slice(5)
  const p2 = WAVE_POINTS[2]
  const p4 = WAVE_POINTS[4]
  const slope = (p4.y - p2.y) / (p4.x - p2.x)

  return (
    <Svg height={236} label="Ondas de Elliott: cinco ondas de impulso seguidas de tres ondas de corrección">
      <rect x={14} y={8} width={344 - 14} height={220} rx="8" fill={tint(C.violet, 7)} />
      <rect x={344} y={8} width={W - 344 - 8} height={220} rx="8" fill={tint(C.rose, 7)} />
      <text {...HALO} x={22} y={26} fontSize="11" fontWeight="600" fill={`color-mix(in oklab, ${C.violet} 70%, var(--text))`}>
        Impulso: 5 ondas
      </text>
      <text {...HALO} x={W - 16} y={26} textAnchor="end" fontSize="11" fontWeight="600" fill={`color-mix(in oklab, ${C.rose} 70%, var(--text))`}>
        Corrección: A, B, C
      </text>
      <line x1={p2.x - 60} y1={p2.y - slope * 60} x2={p4.x + 80} y2={p4.y + slope * 80} stroke={INK.axis} strokeDasharray="4 4" />
      <path d={toPath(impulse)} fill="none" stroke={C.violet} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <path d={toPath(correction)} fill="none" stroke={C.rose} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {WAVE_POINTS.filter((p) => p.label).map((p) => {
        const isCorrection = /[ABC]/.test(p.label as string)
        const color = isCorrection ? C.rose : C.violet
        const cy = p.peak ? p.y - 16 : p.y + 16
        return (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="3.5" fill={color} />
            <circle cx={p.x} cy={cy} r="10" fill={INK.surface} stroke={tint(color, 70)} strokeWidth="1.6" />
            <text {...HALO} x={p.x} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={`color-mix(in oklab, ${color} 75%, var(--text))`}>
              {p.label}
            </text>
          </g>
        )
      })}
    </Svg>
  )
}

const FIB_HIGH_Y = 34
const FIB_LOW_Y = 206
const FIB_RATIOS = [0.236, 0.382, 0.5, 0.618]
const FIB_LABELS = ['23.6%', '38.2%', '50%', '61.8%']

export const FibonacciIllustration: React.FC = () => {
  const levels = fibLevels(FIB_LOW_Y, FIB_HIGH_Y, FIB_RATIOS)
  const all = [FIB_HIGH_Y, ...levels, FIB_LOW_Y]
  const left = 36
  const right = RIGHT - 4

  return (
    <Svg height={236} label="Niveles de retroceso de Fibonacci trazados entre el mínimo y el máximo de un avance">
      {all.slice(0, -1).map((y, i) => (
        <rect key={y} x={left} y={y} width={right - left} height={all[i + 1] - y} fill={tint(C.teal, i % 2 === 0 ? 10 : 4)} />
      ))}
      {[
        { y: FIB_HIGH_Y, label: '0%' },
        { y: FIB_LOW_Y, label: '100%' },
      ].map((l) => (
        <g key={l.label}>
          <line x1={left} x2={right} y1={l.y} y2={l.y} stroke={INK.axis} strokeWidth="1.4" />
          <text {...HALO} x={W - 6} y={l.y + 4} textAnchor="end" fontSize="10.5" fill={INK.label}>
            {l.label}
          </text>
        </g>
      ))}
      {levels.map((y, i) => (
        <g key={FIB_LABELS[i]}>
          <line x1={left} x2={right} y1={y} y2={y} stroke={tint(C.teal, 80)} strokeDasharray="5 4" />
          <text {...HALO} x={W - 6} y={y + 4} textAnchor="end" fontSize="10.5" fontWeight="600" fill={`color-mix(in oklab, ${C.teal} 75%, var(--text))`}>
            {FIB_LABELS[i]}
          </text>
        </g>
      ))}
      <path
        d={`M${left},${FIB_LOW_Y} L110,160 L140,176 L268,${FIB_HIGH_Y} L320,94 L350,${levels[2] - 2} L384,116 L430,74`}
        fill="none"
        stroke={C.violet}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="268" cy={FIB_HIGH_Y} r="4" fill={C.violet} />
      <circle cx={left} cy={FIB_LOW_Y} r="4" fill={C.violet} />
      <circle cx="350" cy={levels[2] - 2} r="5" fill={INK.surface} stroke={C.violet} strokeWidth="2.2" />
      <text {...HALO} x="276" y={FIB_HIGH_Y - 6} fontSize="10.5" fontWeight="600" fill={INK.title}>
        Máximo
      </text>
      <text {...HALO} x={left + 8} y={FIB_LOW_Y - 8} fontSize="10.5" fontWeight="600" fill={INK.title}>
        Mínimo
      </text>
      <text {...HALO} x="358" y={levels[2] + 16} fontSize="10.5" fontWeight="600" fill={`color-mix(in oklab, ${C.violet} 75%, var(--text))`}>
        Reacción en el retroceso
      </text>
    </Svg>
  )
}

const ICHI_N = 25
const ichiX = (i: number) => PL + (i / (ICHI_N - 1)) * (RIGHT - PL)
const SPAN_A = Array.from({ length: ICHI_N }, (_, i) => 92 + i * 2.4 + 6 * Math.sin(i * 0.6))
const SPAN_B = Array.from({ length: ICHI_N }, (_, i) => 132 - i * 0.4)
const ICHI_PRICE = Array.from({ length: ICHI_N }, (_, i) => 60 + i * 1.6 + 10 * Math.sin(i * 0.9) + (i > 13 ? (i - 13) * 9.5 : 0))
const ICHI_TENKAN = ICHI_PRICE.map((_, i) => {
  const win = ICHI_PRICE.slice(Math.max(0, i - 3), i + 1)
  return (Math.max(...win) + Math.min(...win)) / 2
})
const ICHI_KIJUN = ICHI_PRICE.map((_, i) => {
  const win = ICHI_PRICE.slice(Math.max(0, i - 8), i + 1)
  return (Math.max(...win) + Math.min(...win)) / 2
})

export const IchimokuIllustration: React.FC = () => {
  const y = (v: number) => v
  const segments = SPAN_A.slice(0, -1).map((a, i) => {
    const bull = (a + SPAN_A[i + 1]) / 2 < (SPAN_B[i] + SPAN_B[i + 1]) / 2
    const d = `M${ichiX(i)},${y(a)} L${ichiX(i + 1)},${y(SPAN_A[i + 1])} L${ichiX(i + 1)},${y(SPAN_B[i + 1])} L${ichiX(i)},${y(SPAN_B[i])} Z`
    return { d, bull, key: i }
  })
  const line = (vals: number[]) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${ichiX(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  return (
    <Svg height={236} label="Ichimoku: el precio empieza por encima de la nube, la cruza y termina por debajo; la nube cambia de color">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={PL} x2={RIGHT} y1={236 * f} y2={236 * f} stroke={INK.grid} />
      ))}
      {segments.map((s) => (
        <path key={s.key} d={s.d} fill={tint(s.bull ? C.emerald : C.rose, 26)} stroke={tint(s.bull ? C.emerald : C.rose, 26)} strokeWidth="0.6" />
      ))}
      <path d={line(SPAN_A)} fill="none" stroke={tint(C.emerald, 75)} strokeWidth="1.2" />
      <path d={line(SPAN_B)} fill="none" stroke={tint(C.rose, 75)} strokeWidth="1.2" />
      <path d={line(ICHI_KIJUN)} fill="none" stroke={C.amber} strokeWidth="1.8" strokeLinejoin="round" />
      <path d={line(ICHI_TENKAN)} fill="none" stroke={C.sky} strokeWidth="1.8" strokeLinejoin="round" />
      <path d={line(ICHI_PRICE)} fill="none" stroke={INK.price} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <g fontSize="10.5" fontWeight="600">
        <text {...HALO} x={PL + 4} y={44} fill={`color-mix(in oklab, ${C.emerald} 70%, var(--text))`}>
          Por encima de la nube
        </text>
        <text {...HALO} x={RIGHT} y={226} textAnchor="end" fill={`color-mix(in oklab, ${C.rose} 70%, var(--text))`}>
          Por debajo de la nube
        </text>
      </g>
      <Legend
        x={PL + 4}
        y={18}
        items={[
          { label: 'Precio', color: INK.price },
          { label: 'Tenkan', color: C.sky },
          { label: 'Kijun', color: C.amber },
          { label: 'Nube', color: tint(C.emerald, 45), box: true },
        ]}
      />
    </Svg>
  )
}

export const ILLUSTRATIONS: Record<IllustrationKey, React.FC> = {
  macd: MacdIllustration,
  rsi: RsiIllustration,
  kdj: KdjIllustration,
  bollinger: BollingerIllustration,
  adx: AdxIllustration,
  vix: VixIllustration,
  elliott: ElliottIllustration,
  fibonacci: FibonacciIllustration,
}
