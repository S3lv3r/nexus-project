import type { FinanceContentMap } from '../types'
import { SRC } from './sources'

/** 04 · Inversiones */
export const INVERSIONES: FinanceContentMap = {
  'riesgo-y-rendimiento': {
    summary: 'Todo inversionista busca ganancias, pero cada peso de rendimiento esperado viene acompañado de cierto riesgo.',
    intro: [
      'Invertir es poner tu dinero en un instrumento con la expectativa de que crezca con el tiempo. A diferencia del ahorro, la inversión no garantiza el resultado: el valor puede subir o bajar.',
      'Entender la relación entre riesgo y rendimiento te ayuda a elegir inversiones acordes a tus metas y a no tomar decisiones por miedo o por promesas de ganancias fáciles.',
    ],
    visual: 'risk-return',
    sections: [
      {
        heading: 'Rendimiento y riesgo',
        paragraphs: [
          'El rendimiento es lo que gana (o pierde) tu inversión, normalmente expresado como porcentaje anual. El riesgo es la posibilidad de que el resultado sea distinto al esperado, incluso de perder parte de lo invertido.',
          'En general, los instrumentos que pueden dar más rendimiento también tienen precios que suben y bajan con más fuerza. Ninguna inversión legítima ofrece rendimientos altos sin riesgo.',
        ],
      },
      {
        heading: 'Tres preguntas antes de invertir',
        list: [
          '¿Para cuándo necesito el dinero? Mientras más tiempo, más capacidad tienes de esperar a que se recupere una caída. Lo que necesitas en menos de un año no debería estar en instrumentos de riesgo.',
          '¿Cuánto puedo ver bajar mi inversión sin ponerme nervioso o vender? Esa es tu tolerancia al riesgo.',
          '¿Tengo antes un fondo de emergencia y mis deudas caras bajo control? Si no, empieza por ahí.',
        ],
      },
      {
        heading: 'Diversificar: no todo en un solo lugar',
        paragraphs: [
          'Repartir tu dinero entre distintos instrumentos reduce el impacto de que uno salga mal. La diversificación no elimina el riesgo, pero evita que un solo resultado afecte todo tu patrimonio.',
        ],
      },
    ],
    example: {
      title: 'Repartir para reducir el golpe',
      text: 'Elena invierte $20,000 para una meta a cinco años: $10,000 en CETES, $6,000 en un fondo de inversión y $4,000 en acciones.',
      steps: [
        'Supongamos que en un mal año las acciones bajan 20%: $4,000 × 20% = $800.',
        'Esa pérdida representa $800 ÷ $20,000 = 4% del total.',
        'Si hubiera puesto los $20,000 en acciones, la misma caída sería de $4,000.',
      ],
      conclusion: 'Diversificar no evitó la caída, pero la hizo manejable. Y como su plazo es de cinco años, Elena tiene tiempo para esperar la recuperación.',
    },
    keyPoints: [
      'Si alguien te garantiza rendimientos muy altos y sin riesgo, probablemente es un fraude.',
      'Invierte solo en instituciones autorizadas; puedes verificarlas en el SIPRES de la CONDUSEF o con la CNBV.',
      'Los rendimientos pasados no garantizan los futuros.',
      'No inviertas dinero que vas a necesitar pronto.',
      'Vender por pánico en una caída convierte una baja temporal en una pérdida real.',
    ],
    sources: [SRC.cnbvEntidades, SRC.cetesAprende],
  },

  'cetes-acciones-fondos': {
    summary: 'Tres formas comunes de invertir en México, con niveles de riesgo y funcionamiento distintos.',
    intro: [
      'No necesitas ser experto ni tener mucho dinero para invertir. En México hay opciones accesibles y reguladas. Tres de las más comunes son los CETES, las acciones y los fondos de inversión.',
      'Cada una funciona de forma diferente y conviene para objetivos distintos. Conocerlas te permite elegir con información y no por recomendación de terceros.',
    ],
    sections: [
      {
        heading: 'CETES',
        paragraphs: [
          'Los Certificados de la Tesorería de la Federación son deuda del gobierno federal: al comprarlos le prestas dinero por un plazo, como 28, 91, 182 o 364 días. Cada título vale $10 al vencimiento y se compra con descuento; la diferencia es tu ganancia.',
          'Se consideran de bajo riesgo dentro del mercado mexicano. Puedes comprarlos directamente, sin intermediarios y desde $100, en la plataforma oficial Cetes Directo.',
        ],
      },
      {
        heading: 'Acciones',
        paragraphs: [
          'Una acción es una pequeña parte de una empresa. Ganas si el precio sube o si la empresa reparte dividendos, y pierdes si el precio baja. No hay un pago prometido. Se compran a través de una casa de bolsa y se negocian en la Bolsa Mexicana de Valores o en BIVA.',
          'Son de mayor riesgo y más adecuadas para plazos largos. Si quieres aprender a analizarlas, revisa la sección de Análisis de acciones de la plataforma.',
        ],
      },
      {
        heading: 'Fondos de inversión',
        paragraphs: [
          'Un fondo reúne el dinero de muchas personas y un administrador profesional lo invierte en una canasta de instrumentos: deuda, acciones o una mezcla. Te permite diversificar con poco dinero. Los ofrecen bancos, casas de bolsa y operadoras de fondos, y cada uno tiene un nivel de riesgo y un plazo recomendado.',
        ],
      },
      {
        heading: 'Comparación rápida',
        table: {
          columns: ['', 'CETES', 'Acciones', 'Fondos de inversión'],
          rows: [
            ['Qué compras', 'Deuda del gobierno', 'Parte de una empresa', 'Parte de una canasta'],
            ['Riesgo', 'Bajo', 'Alto', 'Depende del fondo'],
            ['Ganancia', 'Conocida al comprar', 'Variable', 'Variable'],
            ['Plazo sugerido', 'Corto a mediano', 'Largo', 'Según el fondo'],
            ['Dónde', 'Cetes Directo, bancos, casas de bolsa', 'Casas de bolsa', 'Bancos, casas de bolsa, operadoras'],
          ],
        },
        callout:
          'Las inversiones en CETES, acciones o fondos no están protegidas por el IPAB; esa protección es para depósitos bancarios. El riesgo de cada instrumento depende de su emisor y del mercado.',
      },
    ],
    example: {
      title: 'Cómo gana dinero un CETE',
      text: 'Con precios ilustrativos: Pedro compra 1,000 CETES a 28 días a $9.90 cada uno.',
      steps: [
        'Invierte: 1,000 × $9.90 = $9,900.',
        'Al vencimiento recibe: 1,000 × $10 = $10,000.',
        'Ganancia antes de impuestos: $10,000 − $9,900 = $100.',
        'Puede reinvertir los $10,000 automáticamente en otro plazo.',
      ],
      conclusion: 'El rendimiento real depende de la tasa vigente en cada subasta, que se publica en Cetes Directo.',
    },
    keyPoints: [
      'Empieza por instrumentos que entiendas; si no sabes explicar cómo gana dinero, no inviertas aún.',
      'Revisa las comisiones: con montos pequeños pesan más.',
      'Las acciones individuales concentran riesgo; los fondos ayudan a diversificar.',
      'Las tasas de los CETES cambian en cada subasta; consulta siempre el dato vigente.',
      'Las ganancias de inversiones pueden tener retenciones de impuestos; revisa tu constancia anual.',
    ],
    sources: [SRC.cetesAprende, SRC.cetesDirecto, SRC.cnbvEntidades],
  },

  'interes-compuesto': {
    summary: 'Cuando los intereses también generan intereses, el dinero crece cada vez más rápido con el tiempo.',
    intro: [
      'El interés compuesto ocurre cuando las ganancias de una inversión se suman al capital y, en el siguiente periodo, también generan ganancias. Es el motivo por el que empezar temprano importa tanto.',
      'Funciona en ambos sentidos: hace crecer tus inversiones, pero también hace crecer una deuda que no pagas.',
    ],
    visual: 'compound',
    sections: [
      {
        heading: 'Simple contra compuesto',
        paragraphs: [
          'Con interés simple, ganas siempre sobre la cantidad inicial, así que cada año ganas lo mismo. Con interés compuesto, ganas sobre la cantidad inicial más lo que ya ganaste, así que cada año ganas un poco más que el anterior.',
        ],
        formula: {
          expression: 'Monto final = Capital × (1 + tasa) ^ años',
          variables: [
            { symbol: 'Capital', meaning: 'Dinero con el que empiezas.' },
            { symbol: 'tasa', meaning: 'Rendimiento por periodo, en decimal (10% = 0.10).' },
            { symbol: 'años', meaning: 'Número de periodos en que se reinvierten las ganancias.' },
          ],
        },
      },
      {
        heading: 'El tiempo es el factor más poderoso',
        paragraphs: [
          'Al principio la diferencia es pequeña y casi no se nota. Con los años crece cada vez más. Por eso, para metas de largo plazo como el retiro, empezar cinco o diez años antes puede pesar más que aportar mucho después.',
        ],
        callout:
          'Las tasas de los ejemplos son hipotéticas y solo ilustran el cálculo. Ninguna inversión garantiza un rendimiento fijo durante años, y la inflación reduce el valor real de lo que ganas.',
      },
    ],
    example: {
      title: '$10,000 con una tasa hipotética de 10% anual',
      text: 'Comparación entre reinvertir las ganancias y retirarlas cada año:',
      table: {
        columns: ['Año', 'Interés simple', 'Interés compuesto'],
        rows: [
          ['Inicio', '$10,000', '$10,000'],
          ['1', '$11,000', '$11,000'],
          ['2', '$12,000', '$12,100'],
          ['3', '$13,000', '$13,310'],
          ['10', '$20,000', '$25,937'],
        ],
      },
      steps: ['Año 3 compuesto: $10,000 × 1.10 × 1.10 × 1.10 = $13,310.', 'Año 10 compuesto: $10,000 × 1.10^10 ≈ $25,937.'],
      conclusion: 'En tres años la diferencia es de $310; en diez años ya es de casi $6,000, sin aportar un peso más.',
    },
    keyPoints: [
      'Reinvertir las ganancias es lo que activa el interés compuesto.',
      'Empezar pronto, aunque sea con poco, suele importar más que la cantidad.',
      'Las comisiones también se componen: una comisión alta reduce mucho el resultado a largo plazo.',
      'Una deuda de tarjeta que no pagas crece con la misma lógica, pero en tu contra.',
      'Desconfía de simuladores o promotores que muestran rendimientos altos como si fueran seguros.',
    ],
  },
}
