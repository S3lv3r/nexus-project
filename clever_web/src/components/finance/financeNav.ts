import type { FinanceCategory } from './types'

/**
 * Navegación de Finanzas personales: categorías (barra lateral) y subtemas (barra inferior).
 * El contenido de cada subtema vive en ./content, con el mismo id.
 */
export const FINANCE_CATEGORIES: FinanceCategory[] = [
  {
    id: 'administracion',
    number: '01',
    label: 'Administración del dinero',
    icon: 'wallet',
    description: 'Saber cuánto entra, a dónde se va y para qué lo quieres.',
    subtopics: [
      { id: 'crear-presupuesto', title: 'Cómo crear un presupuesto' },
      { id: 'organizar-ingresos-gastos', title: 'Cómo organizar ingresos y gastos' },
      { id: 'metas-financieras', title: 'Cómo establecer metas financieras' },
    ],
  },
  {
    id: 'ahorro',
    number: '02',
    label: 'Ahorro y estabilidad financiera',
    icon: 'piggy',
    description: 'Apartar dinero con constancia y tener un respaldo para los imprevistos.',
    subtopics: [
      { id: 'como-ahorrar', title: 'Cómo ahorrar correctamente' },
      { id: 'fondo-de-emergencia', title: 'Fondo de emergencia' },
      { id: 'corto-y-largo-plazo', title: 'Organización financiera a corto y largo plazo' },
    ],
  },
  {
    id: 'creditos',
    number: '03',
    label: 'Créditos y deudas',
    icon: 'card',
    description: 'Usar el crédito a tu favor y salir de las deudas que pesan.',
    subtopics: [
      { id: 'tarjetas-de-credito', title: 'Cómo funcionan las tarjetas de crédito' },
      { id: 'intereses-cat-fechas', title: 'Intereses, CAT y fechas de pago' },
      { id: 'evitar-liquidar-deudas', title: 'Cómo evitar y liquidar deudas' },
    ],
  },
  {
    id: 'inversiones',
    number: '04',
    label: 'Inversiones',
    icon: 'trendUp',
    description: 'Poner tu dinero a trabajar entendiendo lo que arriesgas.',
    subtopics: [
      { id: 'riesgo-y-rendimiento', title: 'Conceptos básicos: riesgo y rendimiento' },
      { id: 'cetes-acciones-fondos', title: 'CETES, acciones y fondos de inversión' },
      { id: 'interes-compuesto', title: 'Interés compuesto y crecimiento del dinero' },
    ],
  },
  {
    id: 'proteccion',
    number: '05',
    label: 'Protección y futuro financiero',
    icon: 'shield',
    description: 'Protegerte de lo inesperado, cumplir con tus impuestos y preparar tu retiro.',
    subtopics: [
      { id: 'seguros', title: 'Seguros y protección económica' },
      { id: 'impuestos-basicos', title: 'Impuestos básicos en México' },
      { id: 'afore-y-retiro', title: 'AFORE y planificación del retiro' },
    ],
  },
  {
    id: 'patrimonio',
    number: '06',
    label: 'Patrimonio e independencia financiera',
    icon: 'mountain',
    description: 'Medir lo que tienes, hacerlo crecer y acercarte a no depender solo de tu trabajo.',
    subtopics: [
      { id: 'construccion-patrimonio', title: 'Construcción del patrimonio' },
      { id: 'activos-pasivos-ingresos-pasivos', title: 'Activos, pasivos e ingresos pasivos' },
      { id: 'independencia-financiera', title: 'Independencia financiera' },
    ],
  },
]

/** Id de la vista de herramientas (entrada extra de la barra lateral). */
export const FINANCE_TOOLS_VIEW = 'herramientas'
