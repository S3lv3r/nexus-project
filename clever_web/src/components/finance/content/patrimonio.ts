import type { FinanceContentMap } from '../types'
import { SRC } from './sources'

/** 06 · Patrimonio e independencia financiera */
export const PATRIMONIO: FinanceContentMap = {
  'construccion-patrimonio': {
    summary: 'Lo que realmente tienes es lo que te queda después de restar lo que debes.',
    intro: [
      'Tu patrimonio es el valor de todo lo que tienes menos todo lo que debes. A esa diferencia se le llama patrimonio neto, y es una de las mejores formas de medir si tus finanzas avanzan o retroceden.',
      'Importa porque ganar más no siempre significa tener más. Alguien con un buen sueldo puede tener un patrimonio bajo si gasta todo y debe mucho; alguien con un ingreso modesto puede construir un patrimonio sólido con constancia.',
    ],
    sections: [
      {
        heading: 'Cómo se calcula',
        formula: {
          expression: 'Patrimonio neto = Lo que tienes − Lo que debes',
          variables: [
            { symbol: 'Lo que tienes', meaning: 'Dinero en cuentas, inversiones, tu afore y el valor actual de tus bienes (casa, auto, equipo).' },
            { symbol: 'Lo que debes', meaning: 'Saldos pendientes de tarjetas, préstamos, créditos de auto o hipoteca.' },
          ],
        },
        list: [
          'Usa el valor actual de tus bienes, no lo que pagaste por ellos: un auto vale menos cada año.',
          'Usa el saldo que debes hoy, no el monto original del crédito.',
          'Calcúlalo una o dos veces al año, siempre de la misma forma, para comparar.',
        ],
        callout: 'Un patrimonio neto negativo es común al empezar, por ejemplo al recién comprar un auto a crédito o al tener deudas escolares. Lo importante es la tendencia: que cada año sea mayor que el anterior.',
      },
      {
        heading: 'Cómo hacerlo crecer',
        paragraphs: ['El patrimonio aumenta por tres caminos, y conviene usar los tres al mismo tiempo:'],
        table: {
          columns: ['Camino', 'Qué significa', 'Ejemplo'],
          rows: [
            ['Ahorrar', 'Gastar menos de lo que ganas y guardar la diferencia.', 'Apartar $1,500 cada mes.'],
            ['Pagar deudas', 'Cada peso que dejas de deber suma a tu patrimonio.', 'Liquidar una tarjeta.'],
            ['Hacer crecer lo que tienes', 'Que tu dinero genere rendimientos o que tus bienes conserven su valor.', 'Invertir a largo plazo en lugar de dejar el dinero sin rendimiento.'],
          ],
        },
      },
    ],
    example: {
      title: 'El patrimonio de Mauricio en un año',
      text: 'Mauricio calcula su patrimonio hoy y lo vuelve a calcular un año después. En ese tiempo ahorró $1,500 al mes, siguió aportando a su afore y pagó deudas.',
      table: {
        columns: ['Concepto', 'Hoy', 'Un año después'],
        rows: [
          ['Cuenta de ahorro', '$18,000', '$36,000'],
          ['Afore', '$65,000', '$75,000'],
          ['Auto (valor actual)', '$120,000', '$105,000'],
          ['Computadora (valor actual)', '$10,000', '$8,000'],
          ['Total de lo que tiene', '$213,000', '$224,000'],
          ['Crédito del auto', '$70,000', '$45,000'],
          ['Tarjeta de crédito', '$8,000', '$0'],
          ['Total de lo que debe', '$78,000', '$45,000'],
          ['Patrimonio neto', '$135,000', '$179,000'],
        ],
      },
      conclusion:
        'Aunque su auto y su computadora perdieron valor, su patrimonio creció $44,000 gracias al ahorro y a las deudas que pagó.',
    },
    keyPoints: [
      'No confundas ingreso con patrimonio: lo que cuenta es lo que te queda.',
      'Comprar a crédito no aumenta tu patrimonio: sumas un bien, pero también una deuda.',
      'Los bienes que pierden valor, como un auto, reducen tu patrimonio con el tiempo.',
      'Mide siempre con el mismo método y en la misma época del año.',
      'Construir patrimonio toma años; los avances pequeños y constantes son los que más pesan.',
    ],
    sources: [SRC.esar, SRC.consarCuaderno],
  },

  'activos-pasivos-ingresos-pasivos': {
    summary: 'Distinguir lo que te genera dinero de lo que te lo quita es la base para construir riqueza.',
    intro: [
      'Un activo es algo que tienes y que tiene valor: dinero, inversiones, una casa. Un pasivo es una deuda: algo que debes pagar. Esta diferencia, que parece sencilla, cambia la forma de ver muchas decisiones.',
      'Además, hay una pregunta útil para cualquier cosa que compres: ¿me va a generar dinero, me va a costar dinero o solo lo voy a disfrutar? Responderla te ayuda a decidir con más claridad.',
    ],
    sections: [
      {
        heading: 'Tres tipos de cosas que puedes tener',
        table: {
          columns: ['Tipo', 'Qué hace con tu dinero', 'Ejemplos'],
          rows: [
            ['Activos que generan ingresos', 'Te dejan dinero o crecen con el tiempo.', 'Ahorro con rendimiento, CETES, fondos, un local que rentas.'],
            ['Bienes de uso', 'Tienen valor y los usas, pero cuestan mantenerlos y suelen perder valor.', 'Auto, celular, muebles, ropa.'],
            ['Pasivos', 'Te quitan dinero cada mes en pagos e intereses.', 'Tarjeta de crédito, préstamo personal, crédito de auto.'],
          ],
        },
        paragraphs: [
          'Los bienes de uso no son malos: un auto puede ser indispensable para trabajar. Solo conviene reconocer que no te harán más rico y que, si los compras a crédito, también suman un pasivo.',
        ],
      },
      {
        heading: 'Ingresos activos e ingresos pasivos',
        paragraphs: [
          'Un ingreso activo depende de tu trabajo directo: si dejas de trabajar, deja de llegar. El sueldo y los honorarios son ingresos activos.',
          'Un ingreso pasivo proviene de algo que ya tienes, sin que tengas que cambiar tu tiempo por dinero cada día: intereses de una inversión, la renta de un inmueble, los dividendos de una acción o las regalías por un contenido.',
        ],
        callout:
          'Casi ningún ingreso es totalmente pasivo. Requiere un capital inicial, tiempo para administrarlo y conlleva riesgos y costos. También paga impuestos. Desconfía de quien prometa “ingresos pasivos” sin esfuerzo ni riesgo.',
      },
      {
        heading: 'Cómo ayudan a generar riqueza',
        paragraphs: [
          'La lógica es sencilla: usar parte de tu ingreso activo para adquirir activos que generen ingresos, y reinvertir lo que producen. Con el tiempo, esos ingresos pasivos pueden complementar o, en algunos casos, reemplazar parte de tu sueldo.',
        ],
      },
    ],
    example: {
      title: 'Lo que deja realmente un departamento en renta',
      text: 'Rosa tiene un departamento que renta en $7,000 al mes. Calcula lo que le queda en un año considerando un mes sin inquilino y gastos de predial, mantenimiento y seguro de $900 al mes en promedio.',
      steps: [
        'Rentas cobradas: $7,000 × 11 meses = $77,000.',
        'Gastos del año: $900 × 12 = $10,800.',
        'Ingreso neto antes de impuestos: $77,000 − $10,800 = $66,200, unos $5,517 al mes.',
        'Si el departamento tuviera una hipoteca de $6,000 al mes ($72,000 al año), el resultado sería $66,200 − $72,000 = −$5,800: le costaría dinero mientras la paga.',
      ],
      conclusion: 'Un activo genera ingreso pasivo solo cuando lo que produce supera lo que cuesta mantenerlo. Hay que hacer las cuentas completas.',
    },
    keyPoints: [
      'No todo lo que tiene valor te genera dinero; distingue activos productivos de bienes de uso.',
      'Una compra grande a crédito suma un bien y un pasivo al mismo tiempo.',
      'Calcula los ingresos pasivos después de gastos, periodos sin ingreso e impuestos.',
      'Empezar a generar ingresos pasivos requiere ahorrar primero; no hay atajos.',
      'Si rentas un inmueble, debes registrarte ante el SAT en el Régimen de Arrendamiento y declarar esos ingresos.',
      'Los esquemas que prometen dinero fácil y garantizado suelen ser fraudes.',
    ],
    sources: [SRC.satArrendamiento],
  },

  'independencia-financiera': {
    summary: 'El punto en el que tu patrimonio y tus ingresos pasivos podrían cubrir tus gastos sin depender de un sueldo.',
    intro: [
      'Ser independiente financieramente significa que podrías cubrir tus gastos con lo que generan tus inversiones, tus rentas o tu pensión, sin necesitar trabajar para vivir. No obliga a dejar de trabajar: significa que trabajar se vuelve una decisión y no una necesidad.',
      'Es una meta de muy largo plazo y no está garantizada: depende de tus ingresos, tus gastos, los rendimientos y la inflación. Aun así, acercarse a ella aporta tranquilidad y margen ante cualquier imprevisto.',
    ],
    sections: [
      {
        heading: 'Cómo calcular tu meta',
        paragraphs: [
          'Una forma común de estimarla es dividir tus gastos anuales entre una tasa de retiro: el porcentaje de tu patrimonio que podrías gastar cada año sin agotarlo demasiado pronto.',
        ],
        formula: {
          expression: 'Meta de patrimonio = Gastos anuales ÷ Tasa de retiro',
          variables: [
            { symbol: 'Gastos anuales', meaning: 'Lo que necesitas para vivir un año (gastos mensuales × 12).' },
            { symbol: 'Tasa de retiro', meaning: 'Porcentaje anual que retirarías del patrimonio, en decimal (4% = 0.04).' },
          ],
        },
        callout:
          'La referencia del 4% (equivalente a multiplicar tus gastos anuales por 25) proviene de estudios con datos de mercados de Estados Unidos. No es una garantía ni aplica igual en todos los países; usar una tasa menor, como 3%, da un margen más prudente.',
      },
      {
        heading: 'Estrategias para acercarte',
        list: [
          'Controla tus gastos: reducirlos baja la meta y, al mismo tiempo, te permite ahorrar más.',
          'Aumenta tu tasa de ahorro conforme crecen tus ingresos, en lugar de aumentar tu nivel de gasto.',
          'Invierte de forma constante, diversificada y a largo plazo, para aprovechar el interés compuesto.',
          'Evita las deudas caras, que retrasan cualquier avance.',
          'Considera tus otras fuentes: una pensión o una renta reducen lo que necesitas reunir.',
        ],
      },
    ],
    example: {
      title: 'La meta de Andrés',
      text: 'Andrés gasta $20,000 al mes y quiere estimar su meta de independencia financiera.',
      steps: [
        'Gastos anuales: $20,000 × 12 = $240,000.',
        'Con una tasa de retiro de 4%: $240,000 ÷ 0.04 = $6,000,000.',
        'Con una tasa más prudente de 3%: $240,000 ÷ 0.03 = $8,000,000.',
        'Si espera recibir una pensión de $8,000 al mes, solo tendría que cubrir $12,000: $144,000 al año ÷ 0.04 = $3,600,000.',
      ],
      conclusion:
        'La cifra parece lejana, pero le da una dirección clara: cada peso ahorrado, cada deuda pagada y cada gasto que reduce lo acercan, aunque la meta tome décadas.',
    },
    keyPoints: [
      'Es una meta de largo plazo; nadie puede garantizar cuándo ni si se alcanzará.',
      'La inflación aumenta tus gastos con el tiempo: revisa tu meta cada año.',
      'Los rendimientos varían; no bases tu plan en el mejor escenario.',
      'Desconfía de cursos o esquemas que prometen “libertad financiera” rápida.',
      'Aunque no llegues a la meta completa, avanzar hacia ella mejora mucho tu estabilidad.',
    ],
    sources: [SRC.trinity],
  },
}
