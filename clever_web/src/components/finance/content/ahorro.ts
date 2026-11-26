import type { FinanceContentMap } from '../types'
import { SRC } from './sources'

/** 02 · Ahorro y estabilidad financiera */
export const AHORRO: FinanceContentMap = {
  'como-ahorrar': {
    summary: 'Apartar una parte de tu ingreso de forma constante, segura y con un propósito.',
    intro: [
      'Ahorrar es guardar hoy una parte de lo que ganas para usarla después. Te da tranquilidad ante imprevistos, te permite cumplir metas sin pedir prestado y es el primer paso para empezar a invertir.',
      'Ahorrar correctamente no depende de cuánto ganas, sino de tres cosas: hacerlo con constancia, guardar el dinero en un lugar seguro y saber para qué es.',
    ],
    sections: [
      {
        heading: 'Págate primero',
        paragraphs: [
          'El error más común es ahorrar “lo que sobre”, porque casi nunca sobra. Haz lo contrario: el mismo día que recibes tu pago, separa la cantidad que decidiste ahorrar y vive con el resto.',
          'Empieza con un porcentaje que puedas sostener, aunque sea 5% o 10% de tu ingreso, y súbelo cuando mejore tu situación. La constancia vale más que la cantidad.',
        ],
      },
      {
        heading: 'Hazlo automático',
        paragraphs: [
          'Programa una transferencia el día de pago hacia una cuenta o apartado distinto al de tus gastos. Si no ves el dinero, es menos probable que lo gastes. Muchas apps bancarias permiten crear apartados por meta o domiciliar el ahorro.',
        ],
      },
      {
        heading: 'Guárdalo en un lugar seguro',
        table: {
          columns: ['Dónde', 'Qué considerar'],
          rows: [
            ['Bancos', 'Tus depósitos están protegidos por el IPAB hasta 400 mil UDIS por persona y por banco.'],
            ['Sofipos y cooperativas autorizadas', 'Cuentan con sus propios fondos de protección (Prosofipo y Focoop), hasta 25 mil UDIS por persona. Verifica que estén autorizadas.'],
            ['Debajo del colchón o en tandas', 'No generan rendimiento, se pueden perder o robar y nadie protege tu dinero si algo sale mal.'],
          ],
        },
        callout:
          'Antes de abrir una cuenta, verifica que la institución esté registrada en el SIPRES de la CONDUSEF o en el padrón de la CNBV, y revisa las comisiones y el rendimiento (GAT) que ofrece.',
      },
      {
        heading: 'Cuidado con la inflación',
        paragraphs: [
          'Los precios suben con el tiempo. Un ahorro que no genera rendimiento pierde poder de compra año con año. Para el dinero que necesitas pronto, lo importante es tenerlo disponible; para el de largo plazo, conviene buscar instrumentos que al menos igualen la inflación, como se explica en la categoría de Inversiones.',
        ],
      },
    ],
    example: {
      title: 'El 10% de Carlos',
      text: 'Carlos gana $13,000 netos al mes. Decide ahorrar 10% y programa una transferencia automática cada día de pago.',
      steps: ['10% de $13,000 = $1,300 al mes.', 'En un año: $1,300 × 12 = $15,600, sin contar rendimientos.', 'Además, redondea cada compra con tarjeta a la decena más cercana y la diferencia va a su apartado.'],
      conclusion: 'Sin pensar en ello cada mes, Carlos termina el año con más de $15,600 apartados.',
    },
    keyPoints: [
      'Ahorra al recibir tu pago, no al final del mes.',
      'Separa tu ahorro de tu cuenta de gastos diarios.',
      'Usa instituciones autorizadas; desconfía de quien ofrezca rendimientos muy altos sin riesgo.',
      'Dale un propósito a cada ahorro: es más fácil no tocarlo.',
      'Si un mes no puedes ahorrar, retoma el siguiente; no abandones el hábito.',
    ],
    sources: [SRC.condusefAhorro, SRC.cnbvEntidades],
  },

  'fondo-de-emergencia': {
    summary: 'Un ahorro reservado solo para imprevistos, para que un problema no se convierta en deuda.',
    intro: [
      'Un fondo de emergencia es dinero apartado exclusivamente para situaciones inesperadas: perder el empleo, una enfermedad, una reparación urgente del auto o de la casa.',
      'Sin él, cualquier imprevisto termina en la tarjeta de crédito o en un préstamo caro. Con él, un mal momento se queda en eso y no afecta tus metas ni tu tranquilidad.',
    ],
    sections: [
      {
        heading: '¿Cuánto necesitas?',
        paragraphs: [
          'La CONDUSEF recomienda reunir el equivalente a entre tres y seis meses de tus gastos esenciales: renta, comida, servicios, transporte y pagos mínimos de deudas. No cuentes los gustos, porque en una emergencia se pueden recortar.',
          'Apunta a seis meses o más si tu ingreso es variable, si trabajas por tu cuenta o si otras personas dependen de ti.',
        ],
        formula: {
          expression: 'Fondo de emergencia = Gastos esenciales del mes × Meses de cobertura',
          variables: [
            { symbol: 'Gastos esenciales', meaning: 'Lo mínimo que necesitas para vivir un mes.' },
            { symbol: 'Meses de cobertura', meaning: 'Normalmente entre 3 y 6.' },
          ],
        },
      },
      {
        heading: 'Dónde guardarlo',
        paragraphs: [
          'Debe estar en un lugar seguro y disponible en pocos días: una cuenta de ahorro o un instrumento de muy corto plazo en una institución regulada. No lo inviertas en algo que pueda bajar de valor o que no puedas retirar cuando lo necesites, y mantenlo separado del dinero del día a día.',
        ],
      },
      {
        heading: 'Cómo construirlo',
        ordered: true,
        list: [
          'Calcula tus gastos esenciales con tu presupuesto.',
          'Ponte una primera meta pequeña, como un mes de gastos.',
          'Aparta una cantidad fija cada pago, de forma automática.',
          'Suma ingresos extra, como parte del aguinaldo o de un bono.',
          'Si lo usas, tu prioridad es volver a llenarlo.',
        ],
      },
    ],
    example: {
      title: 'El fondo de Lucía',
      text: 'Los gastos esenciales de Lucía suman $9,000 al mes y puede apartar $1,500 mensuales.',
      steps: [
        'Fondo de tres meses: $9,000 × 3 = $27,000.',
        'Tiempo para reunirlo: $27,000 ÷ $1,500 = 18 meses.',
        'Para acelerarlo, destina $6,000 de su aguinaldo: ($27,000 − $6,000) ÷ $1,500 = 14 meses.',
      ],
      conclusion: 'En poco más de un año, Lucía tiene un respaldo para tres meses sin depender de un crédito.',
    },
    keyPoints: [
      'Unas vacaciones, una oferta o un celular nuevo no son emergencias.',
      'No lo guardes en efectivo en casa ni en instrumentos de riesgo.',
      'Empieza aunque sea con poco: un mes de gastos ya cambia mucho tu situación.',
      'Revisa el monto cuando cambien tus gastos, por ejemplo al mudarte o al tener hijos.',
      'Pagar deudas caras y armar el fondo pueden avanzar al mismo tiempo: no tienes que esperar a terminar una para empezar la otra.',
    ],
    sources: [SRC.condusefFondoEmergencia],
  },

  'corto-y-largo-plazo': {
    summary: 'Separar tu dinero según cuándo lo vas a necesitar, para guardarlo en el lugar adecuado.',
    intro: [
      'No todo tu ahorro tiene el mismo propósito ni el mismo plazo. El dinero para un viaje de diciembre no debería guardarse igual que el dinero para tu retiro.',
      'Organizarte por plazos te ayuda a decidir cuánto apartar para cada cosa y dónde guardarlo: lo que necesitarás pronto debe estar disponible; lo que usarás en muchos años puede buscar crecimiento.',
    ],
    visual: 'savings-horizons',
    sections: [
      {
        heading: 'Los tres plazos',
        table: {
          columns: ['Plazo', 'Ejemplos', 'Qué priorizar'],
          rows: [
            ['Corto: menos de 1 año', 'Fondo de emergencia, vacaciones, un curso', 'Seguridad y disponibilidad'],
            ['Mediano: 1 a 5 años', 'Enganche de un auto, una boda, un posgrado', 'Equilibrio entre seguridad y rendimiento'],
            ['Largo: más de 5 años', 'Retiro, enganche de vivienda, educación de los hijos', 'Crecimiento por encima de la inflación'],
          ],
        },
      },
      {
        heading: 'Una cuenta o apartado por objetivo',
        paragraphs: [
          'Si todo tu ahorro está en un solo lugar, es fácil usar el dinero del retiro para unas vacaciones. Separa tus ahorros en apartados o cuentas distintas, cada uno con su nombre y su meta. Así sabes en todo momento cuánto llevas para cada cosa.',
        ],
      },
      {
        heading: 'Cómo repartir lo que ahorras',
        paragraphs: [
          'Primero asegura el corto plazo (sobre todo el fondo de emergencia). Una vez que avanza, reparte el resto entre tus metas de mediano y largo plazo. Para el largo plazo, el tiempo juega a tu favor: empezar temprano, aunque sea con poco, suele pesar más que aportar mucho después.',
        ],
        callout: 'Cada año, revisa tus plazos: una meta que era de largo plazo se vuelve de corto plazo conforme se acerca, y conviene moverla a algo más seguro.',
      },
    ],
    example: {
      title: 'Los tres apartados de Laura',
      text: 'Laura ahorra $2,500 al mes y los reparte así:',
      table: {
        columns: ['Apartado', 'Plazo', 'Aportación mensual'],
        rows: [
          ['Emergencias', 'Corto', '$1,200'],
          ['Vacaciones de $8,000 en 8 meses', 'Corto', '$1,000'],
          ['Retiro (aportación voluntaria a su afore)', 'Largo', '$300'],
          ['Total', '', '$2,500'],
        ],
      },
      conclusion:
        'Cuando termine de pagar las vacaciones, Laura podrá mover esos $1,000 a una meta de mediano plazo, como el enganche de un auto.',
    },
    keyPoints: [
      'No mezcles el dinero de distintas metas en una sola cuenta.',
      'No inviertas en algo con riesgo el dinero que necesitarás en meses.',
      'No dejes inmóvil, sin rendimiento, el dinero que usarás en muchos años.',
      'El retiro también es una meta, aunque parezca lejana; empieza aunque sea con una cantidad pequeña.',
      'Revisa tu plan al menos una vez al año o cuando cambie tu situación.',
    ],
    sources: [SRC.condusefAhorro],
  },
}
