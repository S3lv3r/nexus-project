import React from 'react'

const CandleAnatomy: React.FC = () => (
  <svg viewBox="0 0 520 300" className="h-auto w-full" role="img" aria-label="Anatomía de una vela alcista y una vela bajista">
    {[
      { x: 130, up: true, label: 'Vela alcista', top: 'Cierre', bottom: 'Apertura' },
      { x: 390, up: false, label: 'Vela bajista', top: 'Apertura', bottom: 'Cierre' },
    ].map((candle) => {
      const color = candle.up ? 'var(--success)' : 'var(--danger)'
      return (
        <g key={candle.label}>
          <line x1={candle.x} x2={candle.x} y1="34" y2="252" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <rect x={candle.x - 38} y="84" width="76" height="118" rx="8" fill={color} fillOpacity="0.9" />
          <text x={candle.x} y="148" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">
            Cuerpo
          </text>
          <text x={candle.x} y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">
            Máximo
          </text>
          <text x={candle.x} y="272" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">
            Mínimo
          </text>
          <line x1={candle.x + 44} x2={candle.x + 66} y1="84" y2="84" stroke="var(--text-muted)" strokeWidth="1.5" />
          <text x={candle.x + 70} y="88" fontSize="13" fill="var(--text-muted)">
            {candle.top}
          </text>
          <line x1={candle.x + 44} x2={candle.x + 66} y1="202" y2="202" stroke="var(--text-muted)" strokeWidth="1.5" />
          <text x={candle.x + 70} y="206" fontSize="13" fill="var(--text-muted)">
            {candle.bottom}
          </text>
          <text x={candle.x - 52} y="60" textAnchor="end" fontSize="12" fill="var(--text-muted)">
            Mecha
          </text>
          <text x={candle.x} y="296" textAnchor="middle" fontSize="14" fontWeight="800" fill={color}>
            {candle.label}
          </text>
        </g>
      )
    })}
  </svg>
)

const ELLIOTT_POINTS: [number, number, string][] = [
  [30, 250, 'Origen'],
  [110, 170, '1'],
  [160, 210, '2'],
  [270, 70, '3'],
  [320, 130, '4'],
  [400, 40, '5'],
  [440, 110, 'a'],
  [470, 80, 'b'],
  [510, 170, 'c'],
]

const ElliottWave: React.FC = () => (
  <svg viewBox="0 0 540 290" className="h-auto w-full" role="img" aria-label="Ciclo fractal de Elliott con cinco ondas de impulso y tres correctivas">
    <rect x="20" y="20" width="400" height="250" rx="10" fill="color-mix(in srgb, var(--success) 8%, transparent)" />
    <rect x="420" y="20" width="110" height="250" rx="10" fill="color-mix(in srgb, var(--danger) 8%, transparent)" />
    <text x="30" y="40" fontSize="12" fontWeight="800" fill="var(--success)">
      IMPULSO 1-2-3-4-5
    </text>
    <text x="428" y="40" fontSize="12" fontWeight="800" fill="var(--danger)">
      CORRECCIÓN
    </text>
    <polyline points={ELLIOTT_POINTS.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
    {ELLIOTT_POINTS.map(([x, y, label], index) => (
      <g key={label}>
        <circle cx={x} cy={y} r={index === 0 ? 5 : 15} fill={index === 0 ? 'var(--primary)' : 'var(--surface)'} stroke="var(--primary)" strokeWidth="2.5" />
        {index > 0 ? (
          <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--text)">
            {label}
          </text>
        ) : (
          <text x={x + 10} y={y + 20} fontSize="12" fontWeight="700" fill="var(--text-muted)">
            {label}
          </text>
        )}
      </g>
    ))}
  </svg>
)

const MevFlow: React.FC = () => {
  const box = 'fill-[var(--surface)] stroke-[var(--border)]'
  return (
    <svg viewBox="0 0 520 380" className="h-auto w-full" role="img" aria-label="Flujo de una transacción expuesta al MEV">
      <defs>
        <marker id="mev-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="var(--text-muted)" />
        </marker>
      </defs>
      <rect x="180" y="10" width="160" height="44" rx="12" className={box} strokeWidth="2" />
      <text x="260" y="38" textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--text)">
        Firma en cartera
      </text>
      <line x1="260" y1="56" x2="260" y2="84" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#mev-arrow)" />
      <rect x="40" y="88" width="440" height="122" rx="14" className={box} strokeWidth="2" />
      <text x="60" y="114" fontSize="14" fontWeight="800" fill="var(--text)">
        Mempool pública
      </text>
      {[
        ['Transacción A del usuario', 'var(--primary)'],
        ['Bot MEV detecta A e inserta orden 1 (compra)', 'var(--danger)'],
        ['Bot MEV detecta A e inserta orden 2 (venta)', 'var(--danger)'],
      ].map(([label, color], index) => (
        <g key={label}>
          <circle cx="68" cy={140 + index * 24} r="5" fill={color} />
          <text x="82" y={145 + index * 24} fontSize="13" fill="var(--text)">
            {label}
          </text>
        </g>
      ))}
      <line x1="260" y1="212" x2="260" y2="240" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#mev-arrow)" />
      <rect x="40" y="244" width="440" height="126" rx="14" fill="color-mix(in srgb, var(--primary) 8%, var(--surface))" stroke="var(--primary)" strokeWidth="2" />
      <text x="60" y="270" fontSize="14" fontWeight="800" fill="var(--text)">
        Bloque confirmado en la EVM
      </text>
      {[
        ['1', 'El bot compra primero (front-run)', 'var(--danger)'],
        ['2', 'El usuario compra con deslizamiento máximo', 'var(--primary)'],
        ['3', 'El bot vende después (back-run)', 'var(--danger)'],
      ].map(([step, label, color], index) => (
        <g key={step}>
          <circle cx="70" cy={298 + index * 24} r="9" fill={color} />
          <text x="70" y={302 + index * 24} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">
            {step}
          </text>
          <text x="88" y={302 + index * 24} fontSize="13" fill="var(--text)">
            {label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export const LESSON_DIAGRAMS: Record<string, { title: string; render: () => React.ReactNode }> = {
  '2.1': { title: 'Anatomía de las velas japonesas', render: () => <CandleAnatomy /> },
  '3.4': { title: 'Estructura del ciclo fractal de Elliott', render: () => <ElliottWave /> },
  '4.3': { title: 'Flujo de una transacción y exposición al MEV', render: () => <MevFlow /> },
}
