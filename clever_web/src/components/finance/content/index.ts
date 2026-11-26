import type { FinanceContentMap, FinanceTopicContent } from '../types'
import { ADMINISTRACION } from './administracion'
import { AHORRO } from './ahorro'
import { CREDITOS } from './creditos'
import { INVERSIONES } from './inversiones'
import { PATRIMONIO } from './patrimonio'
import { PROTECCION } from './proteccion'

/** Artículos por categoría (mismo id que en financeNav.ts). */
const CONTENT_BY_CATEGORY: Record<string, FinanceContentMap> = {
  administracion: ADMINISTRACION,
  ahorro: AHORRO,
  creditos: CREDITOS,
  inversiones: INVERSIONES,
  proteccion: PROTECCION,
  patrimonio: PATRIMONIO,
}

/** Artículo de un subtema, o null si todavía no se ha escrito. */
export function getTopicContent(categoryId: string, subtopicId: string): FinanceTopicContent | null {
  return CONTENT_BY_CATEGORY[categoryId]?.[subtopicId] ?? null
}
