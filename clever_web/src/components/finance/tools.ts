import type React from 'react'
import type { FinanceTool, FinanceToolId } from './types'

/** Herramientas educativas de la sección. En esta fase todas están en desarrollo. */
export const FINANCE_TOOLS: FinanceTool[] = [
  {
    id: 'budget',
    name: 'Calculadora de presupuesto',
    icon: 'calculator',
    description: 'Reparte tu ingreso neto entre necesidades, deseos y ahorro, y compara lo planeado con lo real.',
    features: ['Registrar ingresos y gastos por categoría', 'Comparar con la regla 50/30/20', 'Detectar superávit o déficit'],
    status: 'en-desarrollo',
  },
  {
    id: 'compound',
    name: 'Calculadora de interés compuesto',
    icon: 'trendUp',
    description: 'Visualiza cómo crece un capital cuando los intereses se reinvierten periodo tras periodo.',
    features: ['Capital inicial y aportaciones periódicas', 'Tasa y plazo definidos por ti', 'Comparación con interés simple'],
    status: 'en-desarrollo',
  },
  {
    id: 'credit',
    name: 'Simulador de créditos',
    icon: 'card',
    description: 'Estima mensualidades, intereses totales y el efecto de hacer pagos anticipados.',
    features: ['Monto, tasa y plazo', 'Tabla de amortización', 'Impacto de pagos extra'],
    status: 'en-desarrollo',
  },
  {
    id: 'emergency',
    name: 'Calculadora de fondo de emergencia',
    icon: 'shield',
    description: 'Calcula cuánto necesitas reunir según tus gastos esenciales y en cuánto tiempo puedes lograrlo.',
    features: ['Gastos esenciales mensuales', 'Meses de cobertura deseados', 'Plan de aportaciones'],
    status: 'en-desarrollo',
  },
  {
    id: 'investment',
    name: 'Simulador de inversiones',
    icon: 'bars',
    description: 'Explora escenarios de inversión según tu horizonte y aportaciones, con fines educativos.',
    features: ['Escenarios con supuestos que tú defines', 'Horizonte y aportaciones', 'Efecto de la inflación'],
    status: 'en-desarrollo',
  },
  {
    id: 'debts',
    name: 'Organizador de deudas',
    icon: 'layers',
    description: 'Ordena tus deudas y compara los métodos avalancha y bola de nieve.',
    features: ['Listado de deudas, saldos y tasas', 'Orden de pago sugerido por método', 'Tiempo estimado para liquidar'],
    status: 'en-desarrollo',
  },
]

export const TOOL_BY_ID: Record<FinanceToolId, FinanceTool> = Object.fromEntries(
  FINANCE_TOOLS.map((t) => [t.id, t]),
) as Record<FinanceToolId, FinanceTool>

/**
 * Implementaciones de las herramientas. Cuando una esté lista, regístrala aquí
 * (p. ej. `budget: lazy(() => import('./tools/BudgetCalculator'))`) y cambia su status a 'disponible'.
 * Las que no aparezcan se muestran como "Próximamente".
 */
export const TOOL_COMPONENTS: Partial<Record<FinanceToolId, React.ComponentType>> = {}
