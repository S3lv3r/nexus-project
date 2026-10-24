const PASTEL = {
  sky: '186,230,253',
  mint: '167,243,208',
  violet: '221,214,254',
  amber: '253,230,138',
  peach: '254,215,170',
  indigo: '199,210,254',
} as const
export type Pastel = keyof typeof PASTEL

/**
 * Tres manchas pastel difuminadas para el fondo de una tarjeta (esquina superior izquierda, inferior derecha y superior derecha).
 * Se desvanecen por completo antes de llegar a los bordes, así que no se ven como un marco.
 */
export const pastelGlow = (topLeft: Pastel, bottomRight: Pastel, topRight: Pastel): string =>
  `radial-gradient(ellipse 40% 55% at 6% 10%, rgba(${PASTEL[topLeft]},0.4) 0%, rgba(${PASTEL[topLeft]},0) 100%),` +
  `radial-gradient(ellipse 40% 55% at 96% 96%, rgba(${PASTEL[bottomRight]},0.36) 0%, rgba(${PASTEL[bottomRight]},0) 100%),` +
  `radial-gradient(ellipse 28% 40% at 92% 6%, rgba(${PASTEL[topRight]},0.32) 0%, rgba(${PASTEL[topRight]},0) 100%)`