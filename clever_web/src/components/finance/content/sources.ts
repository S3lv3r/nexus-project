import type { FinanceSource } from '../types'

/**
 * Fuentes oficiales y de referencia. Se definen una sola vez y los artículos las reutilizan.
 * Verificadas el 24 de noviembre de 2026.
 */
export const SRC = {
  condusefPresupuesto: {
    title: 'Toma el control de tu dinero (presupuesto)',
    publisher: 'CONDUSEF',
    url: 'https://www.gob.mx/cms/uploads/attachment/file/755667/Presupuesto_.pdf',
  },
  condusefComoPresupuesto: {
    title: 'Cómo hacer un presupuesto',
    publisher: 'CONDUSEF',
    url: 'https://www.gob.mx/cms/uploads/attachment/file/475636/como_hacer_un_presupuesto.pdf',
  },
  condusefAhorro: {
    title: 'Guía de ahorro',
    publisher: 'CONDUSEF',
    url: 'https://www.gob.mx/cms/uploads/attachment/file/838788/AHORRO2023.pdf',
  },
  condusefFondoEmergencia: {
    title: 'Consejos para tu bolsillo: fondo de emergencia',
    publisher: 'CONDUSEF',
    url: 'https://www.gob.mx/cms/uploads/attachment/file/547098/CONSEJOSPARATUBOLSILLO-170419.pdf',
  },
  condusefCredito: {
    title: 'Guía de crédito',
    publisher: 'CONDUSEF',
    url: 'https://www.gob.mx/cms/uploads/attachment/file/838797/CR_DITO2023.pdf',
  },
  condusef: {
    title: 'Portal de la CONDUSEF',
    publisher: 'CONDUSEF',
    url: 'https://www.gob.mx/condusef',
  },
  cnbvEntidades: {
    title: 'Búsqueda de entidades supervisadas y seguros de depósito',
    publisher: 'CNBV',
    url: 'https://www.cnbv.gob.mx/Paginas/busquedaentidades.aspx',
  },
  banxicoCat: {
    title: 'Calculadora y definición del Costo Anual Total (CAT)',
    publisher: 'Banco de México',
    url: 'https://www.banxico.org.mx/CAT/',
  },
  buroCredito: {
    title: 'Reporte de Crédito Especial',
    publisher: 'Buró de Crédito',
    url: 'https://www.burodecredito.com.mx/',
  },
  cetesAprende: {
    title: 'Aprende a invertir con cetesdirecto',
    publisher: 'Gobierno de México',
    url: 'https://www.gob.mx/cms/uploads/attachment/file/755268/Aprende_a_Invertir_cetesdirecto.pdf',
  },
  cetesDirecto: {
    title: 'Cetes Directo',
    publisher: 'Plataforma oficial de valores gubernamentales',
    url: 'https://www.cetesdirecto.com/',
  },
  dofSeguroAuto: {
    title: 'Reglas del seguro obligatorio de responsabilidad civil vehicular',
    publisher: 'Diario Oficial de la Federación',
    url: 'https://dof.gob.mx/nota_detalle_popup.php?codigo=5338448',
  },
  satDeclaracion: {
    title: 'Guía de llenado de la declaración anual: sueldos y salarios',
    publisher: 'SAT',
    url: 'https://www.sat.gob.mx/minisitio/DeclaracionAnual/Personas/documentos/GuiaLlenado_SueldosSalarios.pdf',
  },
  satIvaFrontera: {
    title: 'Estímulo de IVA en la región fronteriza',
    publisher: 'SAT',
    url: 'https://www.sat.gob.mx/minisitio/EstimulosFiscalesFronteraNorteSur/region_fronteriza_norte_iva/en_que_consiste.html',
  },
  lft: {
    title: 'Ley Federal del Trabajo (art. 110)',
    publisher: 'Cámara de Diputados',
    url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf',
  },
  consarCuaderno: {
    title: 'Cuaderno del retiro',
    publisher: 'CONSAR',
    url: 'https://www.gob.mx/cms/uploads/attachment/file/895034/Cuaderno_Retiro_2024.pdf',
  },
  consarGuiaImss: {
    title: 'Guía infográfica del SAR (IMSS)',
    publisher: 'CONSAR',
    url: 'https://www.gob.mx/cms/uploads/attachment/file/765537/Gui_a_Infogra_fica_SAR_IMSS_210923.pdf',
  },
  esar: {
    title: 'Localiza tu afore',
    publisher: 'e-SAR',
    url: 'https://www.e-sar.com.mx/',
  },
  allYourWorth: {
    title: 'All Your Worth (2005), origen de la regla 50/30/20',
    publisher: 'Elizabeth Warren y Amelia Warren Tyagi',
  },
  trinity: {
    title: 'Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable (1998), origen de la referencia del 4%',
    publisher: 'Cooley, Hubbard y Walz · AAII Journal',
    url: 'https://www.aaii.com/journal/article/retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable',
  },
  satArrendamiento: {
    title: 'Guía de llenado de la declaración anual: arrendamiento',
    publisher: 'SAT',
    url: 'https://www.sat.gob.mx/minisitio/DeclaracionAnual/Personas/documentos/GuiaLlenado_Arrendamiento.pdf',
  },
} satisfies Record<string, FinanceSource>
