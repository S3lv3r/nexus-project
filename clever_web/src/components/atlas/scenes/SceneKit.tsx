import React from 'react'

/** Lienzo común de las escenas del Atlas: 168 × 185, se recorta ("slice") para llenar la tarjeta. */
export const W = 168
export const H = 185

/** Fondo de una escena: degradado pastel muy suave y una cuadrícula tenue de instrumento. */
export const Backdrop: React.FC<{ id: string; from: string; to: string }> = ({ id, from, to }) => (
  <>
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill={`url(#${id}-bg)`} />
    <g stroke="#0f172a" strokeOpacity="0.045" strokeWidth="1">
      {[40, 70, 100, 130].map((y) => (
        <line key={y} x1="0" x2={W} y1={y} y2={y} />
      ))}
      {[28, 56, 84, 112, 140].map((x) => (
        <line key={x} x1={x} x2={x} y1="0" y2={H} />
      ))}
    </g>
  </>
)

/** Punto sobre una circunferencia; el ángulo va en grados, de 0 (derecha) a 180 (izquierda), hacia arriba. */
export const polar = (cx: number, cy: number, angle: number, r: number): [number, number] => {
  const a = (angle * Math.PI) / 180
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)]
}

export const f = (n: number) => n.toFixed(1)
export const FONT = { fontFamily: 'ui-sans-serif, system-ui, sans-serif' } as const

/** Propiedades comunes de los <svg> de las escenas. */
export const SVG_PROPS = { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid slice' as const, className: 'h-full w-full', 'aria-hidden': true as const }
