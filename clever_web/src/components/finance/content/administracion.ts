import type { FinanceContentMap } from '../types'
import { SRC } from './sources'

/** 01 · Administración del dinero */
export const ADMINISTRACION: FinanceContentMap = {
  'crear-presupuesto': {
    summary: 'Un plan por escrito que le da un destino a cada peso antes de gastarlo.',
    intro: [
      'Un presupuesto es un plan de cuánto dinero recibirás en un periodo y en qué lo vas a usar. No es una lista de prohibiciones: es la forma de decidir con anticipación, en lugar de descubrir a fin de mes que el dinero no alcanzó.',
      'Importa porque casi todo lo demás depende de él. Sin presupuesto es difícil ahorrar, saber cuánto puedes pagar de un crédito o cumplir una meta.',
    ],
    sections: [
      {
        heading: 'Cómo hacerlo en cinco pasos',
        ordered: true,
        list: [
          'Anota cuánto recibes en el periodo. Usa tu ingreso neto, es decir, lo que realmente llega a tu cuenta. Si tu ingreso varía, toma como base un mes bajo.',
          'Lista tus gastos fijos: renta, servicios, transporte, colegiaturas y pagos de deudas.',
          'Estima tus gastos variables: comida, salidas, ropa, entretenimiento.',
          'Define cuánto vas a ahorrar y trátalo como un gasto fijo más, no como “lo que sobre”.',
          'Resta todos los gastos al ingreso. Si el resultado es negativo, ajusta antes de que empiece el mes.',
        ],
      },
      {
        heading: 'Una referencia para repartir: 50/30/20',
        paragraphs: [
          'Si no sabes por dónde empezar, una guía popular es destinar cerca de 50% del ingreso neto a necesidades, 30% a gustos y 20% a ahorro o a pagar deudas antes de tiempo. No es una regla oficial: si tu renta es alta, ajusta los porcentajes, pero procura que el ahorro no quede en cero.',
        ],
      },
      {
        heading: 'No olvides los gastos que no son mensuales',
        paragraphs: [
          'El predial, la tenencia o refrendo, los seguros, los útiles escolares o los regalos de diciembre llegan una o dos veces al año. Súmalos, divídelos entre 12 y aparta esa cantidad cada mes. Así no rompen tu presupuesto cuando llegan.',
        ],
        callout: 'Si te pagan por quincena o por semana, haz el presupuesto con ese mismo periodo. Lo importante es que cada pago tenga un plan antes de recibirlo.',
      },
    ],
    visual: 'rule-50-30-20',
    example: {
      title: 'El presupuesto mensual de Mariana',
      text: 'Mariana recibe $14,000 netos al mes. Así reparte su dinero:',
      table: {
        columns: ['Rubro', 'Monto'],
        rows: [
          ['Renta', '$4,500'],
          ['Comida', '$3,200'],
          ['Transporte', '$1,200'],
          ['Luz, agua, gas e internet', '$900'],
          ['Teléfono', '$350'],
          ['Salidas y entretenimiento', '$1,300'],
          ['Ropa', '$600'],
          ['Gastos anuales ($3,600 de predial y seguro ÷ 12)', '$300'],
          ['Ahorro', '$1,400'],
          ['Total', '$13,750'],
        ],
      },
      conclusion: 'Le sobran $14,000 − $13,750 = $250. En lugar de gastarlos, los suma a su ahorro.',
    },
    keyPoints: [
      'Escríbelo. Un presupuesto “de memoria” casi nunca se cumple.',
      'Sé realista: un presupuesto imposible se abandona en la primera semana.',
      'El primer mes no va a cuadrar exacto; ajústalo cada periodo con lo que realmente gastaste.',
      'Aparta el ahorro al recibir tu pago, no al final del mes.',
      'La CONDUSEF tiene la app gratuita “Presupuesto familiar” si prefieres llevarlo en el celular.',
    ],
    sources: [SRC.condusefPresupuesto, SRC.condusefComoPresupuesto, SRC.allYourWorth],
  },

  'organizar-ingresos-gastos': {
    summary: 'Saber exactamente cuánto entra, en qué se va y en qué fechas, para que el presupuesto funcione en la práctica.',
    intro: [
      'El presupuesto es el plan; organizar tus ingresos y gastos es llevarlo a la realidad. Implica conocer tu ingreso real, registrar lo que gastas y acomodar tus pagos según las fechas en que cobras.',
      'Muchas personas sienten que “no les alcanza” no porque ganen poco, sino porque no saben a dónde se va el dinero o porque sus pagos grandes caen antes de que cobren.',
    ],
    visual: 'gross-net',
    sections: [
      {
        heading: 'Conoce tu ingreso real',
        paragraphs: [
          'El sueldo que te ofrecen es el ingreso bruto. Lo que llega a tu cuenta es el ingreso neto: el bruto menos el ISR y las cuotas de seguridad social que tu empleador descuenta, y otros descuentos como un crédito Infonavit. Planea siempre con el neto. En tu recibo de nómina verás percepciones (lo que ganas) y deducciones (lo que te descuentan).',
          'Si trabajas por tu cuenta, nadie te descuenta nada: aparta desde el inicio una parte de cada cobro para impuestos y gastos del trabajo, y considera como ingreso personal solo lo que queda.',
        ],
      },
      {
        heading: 'Registra todos tus gastos',
        paragraphs: [
          'Anota cada gasto durante un mes, incluso los pequeños, y clasifícalos: vivienda, comida, transporte, servicios, gustos, deudas. Puedes usar una libreta, una hoja de cálculo o la app de tu banco. Al final del mes verás patrones que no sabías que tenías.',
          'Pon atención a los gastos hormiga: compras pequeñas y frecuentes que, sumadas, pesan mucho.',
        ],
        formula: {
          expression: 'Gasto al año = Costo × Veces por semana × 52',
          variables: [
            { symbol: 'Costo', meaning: 'Lo que pagas cada vez.' },
            { symbol: 'Veces por semana', meaning: 'Con qué frecuencia lo compras.' },
            { symbol: '52', meaning: 'Semanas del año.' },
          ],
          steps: ['Un café de $45 cinco veces por semana.', '$45 × 5 × 52 = $11,700 al año.'],
        },
      },
      {
        heading: 'Separa necesidades de gustos',
        paragraphs: [
          'Las necesidades son lo indispensable: vivienda, comida básica, salud, servicios y transporte al trabajo. Los gustos mejoran tu vida, pero se pueden posponer o cambiar. Cuando haya que recortar, empieza por los gustos. Pregúntate: “¿qué pasa si no lo compro?”.',
        ],
      },
      {
        heading: 'Acomoda tus pagos según tus fechas de cobro',
        paragraphs: [
          'No basta con que el mes cuadre: también importa cuándo entra y cuándo sale el dinero. Haz un calendario con tus días de cobro y la fecha de cada pago, y decide qué parte de cada ingreso se reserva para los pagos que vienen.',
        ],
      },
    ],
    example: {
      title: 'El problema de Daniel a principio de mes',
      text: 'Daniel cobra $7,000 los días 15 y 30. Paga renta de $5,000 el día 1, su tarjeta de $2,500 el día 5, servicios de $1,000 el día 20 y gasta $2,400 por quincena en comida y transporte.',
      table: {
        columns: ['Periodo', 'Entra', 'Sale', 'Resultado'],
        rows: [
          ['Del día 30 al 14', '$7,000', '$9,900', '−$2,900'],
          ['Del día 15 al 29', '$7,000', '$3,400', '+$3,600'],
          ['Mes completo', '$14,000', '$13,300', '+$700'],
        ],
      },
      conclusion:
        'En el mes le sobran $700, pero a principio de mes le faltan $2,900 y termina usando la tarjeta. Solución: de la quincena del día 15 aparta $2,900 para la renta. Así nunca se queda sin dinero.',
    },
    keyPoints: [
      'Planea con tu ingreso neto, nunca con el bruto.',
      'Revisa tu recibo de nómina: cada descuento debe tener un motivo. La Ley Federal del Trabajo solo permite descuentos en casos específicos.',
      'Registra también los gastos pequeños; ahí suelen estar las fugas.',
      'Revisa tu estado de cuenta cada semana: suscripciones que ya no usas, comisiones o cargos que no reconoces.',
      'El crédito disponible en tu tarjeta no es dinero tuyo. Si lo usas para el día a día, es señal de que algo no cuadra.',
    ],
    sources: [SRC.condusefComoPresupuesto, SRC.lft],
  },

  'metas-financieras': {
    summary: 'Objetivos con monto y fecha que le dan un propósito a tu ahorro.',
    intro: [
      'Una meta financiera es algo que quieres lograr con dinero: un viaje, una computadora, el enganche de un auto o salir de una deuda. Lo que la distingue de un simple deseo es que tiene una cantidad y una fecha.',
      'Sin metas, el dinero que apartas se gasta en lo primero que aparece. Con ellas, cada peso ahorrado tiene un destino y es más fácil mantener la constancia.',
    ],
    sections: [
      {
        heading: 'Cómo plantear una buena meta',
        paragraphs: ['Una meta útil cumple cinco condiciones (el método SMART, por sus siglas en inglés):'],
        table: {
          columns: ['Condición', 'Ejemplo'],
          rows: [
            ['Específica: dice qué quieres', 'Comprar una laptop para la escuela'],
            ['Medible: tiene un monto', '$18,000'],
            ['Alcanzable: cabe en tu presupuesto', 'Puedes apartar $1,500 al mes'],
            ['Relevante: es importante para ti', 'La necesitas para estudiar'],
            ['Con plazo: tiene fecha', 'En 10 meses'],
          ],
        },
      },
      {
        heading: 'Cuánto apartar cada mes',
        formula: {
          expression: 'Aportación mensual = (Meta − Lo que ya tienes) ÷ Meses que faltan',
          variables: [
            { symbol: 'Meta', meaning: 'Monto total que necesitas.' },
            { symbol: 'Lo que ya tienes', meaning: 'Dinero que ya apartaste para esa meta.' },
            { symbol: 'Meses que faltan', meaning: 'Tiempo hasta la fecha que te pusiste.' },
          ],
        },
        callout: 'Si la aportación no cabe en tu presupuesto, no abandones la meta: amplía el plazo, reduce el monto o busca un ingreso extra para ella.',
      },
      {
        heading: 'Qué meta va primero',
        ordered: true,
        list: [
          'Un fondo para emergencias, porque protege todas las demás metas.',
          'Pagar deudas caras, porque los intereses frenan cualquier avance.',
          'Las metas con fecha cercana (un pago escolar, un trámite).',
          'Las metas de mayor plazo (un enganche, tu retiro).',
        ],
      },
    ],
    example: {
      title: 'Cuando la meta no cabe en el presupuesto',
      text: 'Valeria quiere una laptop de $18,000 en 10 meses y ya tiene $3,000 ahorrados.',
      steps: [
        'Le faltan $18,000 − $3,000 = $15,000.',
        'Aportación necesaria: $15,000 ÷ 10 = $1,500 al mes.',
        'Su presupuesto solo le permite apartar $1,000.',
        'Opción A: ampliar el plazo a $15,000 ÷ $1,000 = 15 meses.',
        'Opción B: vender una consola que no usa en $3,000. Le faltarían $12,000, que con $1,000 al mes reúne en 12 meses.',
      ],
      conclusion: 'Valeria elige la opción B: tendrá su laptop en un año sin desordenar su presupuesto.',
    },
    keyPoints: [
      'Escribe tus metas con monto y fecha; “ahorrar más” no es una meta.',
      'No persigas demasiadas metas a la vez: avanza en dos o tres.',
      'Incluye la aportación en tu presupuesto como un gasto fijo.',
      'Guarda el dinero de cada meta por separado para no mezclarlo con el gasto diario.',
      'Revisa tu avance cada mes y ajusta si es necesario.',
    ],
    sources: [SRC.condusefPresupuesto, SRC.condusefAhorro],
  },
}
