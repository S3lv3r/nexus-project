import type { HudIconKey } from '../hud/HudIcons'

/** Herramientas interactivas de la sección (ver tools.ts). */
export type FinanceToolId = 'budget' | 'compound' | 'credit' | 'emergency' | 'investment' | 'debts'

/** Esquemas visuales disponibles para acompañar un artículo (ver FinanceVisuals.tsx). */
export type FinanceVisualKey =
  | 'rule-50-30-20'
  | 'gross-net'
  | 'savings-horizons'
  | 'card-cycle'
  | 'debt-strategies'
  | 'risk-return'
  | 'compound'
  | 'deductible'
  | 'retirement-pillars'

/** Navegación: un subtema dentro de una categoría. */
export interface FinanceSubtopic {
  /** identificador para la URL (?tema=...) y para buscar su contenido */
  id: string
  title: string
}

/** Navegación: una categoría de la barra lateral. */
export interface FinanceCategory {
  id: string
  /** número visible, p. ej. "01" */
  number: string
  label: string
  icon: HudIconKey
  description: string
  subtopics: FinanceSubtopic[]
}

/** Tabla sencilla: `columns` son los encabezados. */
export interface FinanceTable {
  columns: string[]
  rows: string[][]
  caption?: string
}

/** Fórmula con el significado de cada variable y, opcionalmente, un desarrollo paso a paso. */
export interface FinanceFormula {
  expression: string
  variables: Array<{ symbol: string; meaning: string }>
  steps?: string[]
}

/** Un apartado de la explicación. Los bloques son opcionales y se muestran en este orden. */
export interface FinanceSection {
  heading: string
  paragraphs?: string[]
  list?: string[]
  /** true para lista numerada (pasos) */
  ordered?: boolean
  table?: FinanceTable
  formula?: FinanceFormula
  /** recuadro informativo al final del apartado */
  callout?: string
}

/** Ejemplo práctico con cantidades en MXN. */
export interface FinanceExample {
  title: string
  text: string
  table?: FinanceTable
  steps?: string[]
  conclusion?: string
}

/** Fuente de consulta que respalda un artículo. */
export interface FinanceSource {
  title: string
  publisher: string
  /** enlace oficial; sin enlace para libros o artículos académicos */
  url?: string
}

/**
 * Artículo de un subtema. Tiene únicamente cuatro partes:
 * 1. introducción · 2. explicación · 3. ejemplo práctico · 4. puntos importantes.
 */
export interface FinanceTopicContent {
  /** descripción breve bajo el título */
  summary: string
  /** 1. qué es y por qué importa */
  intro: string[]
  /** 2. cómo funciona y qué necesitas saber */
  sections: FinanceSection[]
  /** esquema opcional dentro de la explicación */
  visual?: FinanceVisualKey
  /** 3. situación cotidiana con cantidades en MXN */
  example: FinanceExample
  /** 4. errores que evitar y aspectos a considerar */
  keyPoints: string[]
  /** fuentes que respaldan los datos del artículo (se muestran al final, de forma discreta) */
  sources?: FinanceSource[]
}

/** Contenido de una categoría: id del subtema → artículo. */
export type FinanceContentMap = Record<string, FinanceTopicContent>

export interface FinanceTool {
  id: FinanceToolId
  name: string
  icon: HudIconKey
  description: string
  /** lo que permitirá hacer cuando esté disponible */
  features: string[]
  status: 'en-desarrollo' | 'disponible'
}
