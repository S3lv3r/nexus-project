import type { FinanceContentMap } from '../types'
import { SRC } from './sources'

/** 03 · Créditos y deudas */
export const CREDITOS: FinanceContentMap = {
  'tarjetas-de-credito': {
    summary: 'Una línea de dinero prestado que puedes usar y pagar cada mes; bien usada no te cuesta, mal usada sale muy cara.',
    intro: [
      'Con una tarjeta de débito pagas con tu propio dinero. Con una tarjeta de crédito, el banco paga por ti y tú le devuelves después. Es un préstamo que se renueva: conforme pagas, vuelves a tener crédito disponible.',
      'Puede ser una herramienta útil: te permite comprar en línea con más protección, construir historial crediticio y comprar a meses sin intereses. El problema aparece cuando se usa como si fuera un ingreso extra.',
    ],
    sections: [
      {
        heading: 'Cómo funciona',
        list: [
          'Límite de crédito: lo máximo que puedes deber. No es dinero tuyo, es lo que el banco está dispuesto a prestarte.',
          'Periodo: cada mes el banco suma tus compras y te envía un estado de cuenta.',
          'Pago: tienes unos días después del cierre para pagar. Lo que decidas pagar define si te cobran intereses o no.',
          'Anualidad y comisiones: algunas tarjetas cobran una cuota anual y comisiones por atraso o por disponer de efectivo.',
        ],
      },
      {
        heading: 'Las tres cantidades de tu estado de cuenta',
        table: {
          columns: ['Cantidad', 'Qué pasa si pagas solo eso'],
          rows: [
            ['Pago mínimo', 'Evitas el atraso, pero lo que no pagaste genera intereses. Es la opción más cara.'],
            ['Pago para no generar intereses', 'No pagas intereses en ese periodo. Es la opción recomendada.'],
            ['Saldo total', 'Liquidas todo, incluidas las mensualidades futuras de meses sin intereses.'],
          ],
        },
        paragraphs: [
          'El pago mínimo lo calcula el banco con reglas de Banco de México y suele ser una parte pequeña del saldo, por eso pagar solo eso alarga mucho la deuda.',
          'Quien paga cada mes el monto para no generar intereses se conoce como “totalero”: usa la tarjeta prácticamente gratis, salvo la anualidad.',
        ],
      },
      {
        heading: 'Meses sin intereses',
        paragraphs: [
          'Te permiten dividir una compra en pagos iguales sin intereses, siempre que pagues puntualmente. Pero cada mensualidad se suma a tus pagos de los meses siguientes. Si acumulas varias compras así, tu tarjeta puede quedar comprometida durante mucho tiempo.',
        ],
      },
    ],
    example: {
      title: 'Totalero contra pago mínimo',
      text: 'En un mes, Andrea gasta $6,000 con su tarjeta. Su estado de cuenta indica un pago para no generar intereses de $6,000 y un pago mínimo de $300. Supongamos una tasa ilustrativa de 5% mensual.',
      steps: [
        'Si paga $6,000: no paga intereses.',
        'Si paga $300: quedan $5,700 que generan intereses.',
        'Interés aproximado del mes: $5,700 × 5% = $285.',
        'A los intereses se les suma IVA: $285 × 16% = $45.60.',
        'Costo de pagar solo el mínimo ese mes: alrededor de $331, y la deuda sigue casi completa.',
      ],
      conclusion: 'Con el mismo gasto, una decisión de pago hace que la tarjeta le cueste cero o cientos de pesos cada mes.',
    },
    keyPoints: [
      'Usa la tarjeta solo para compras que podrías pagar de contado.',
      'Paga siempre el monto para no generar intereses; el pago mínimo es la salida más cara.',
      'No uses la tarjeta para sacar efectivo: suele cobrar comisión e intereses desde el primer día.',
      'Lleva la cuenta de cuántas compras a meses tienes activas.',
      'Antes de contratar una tarjeta, compara la anualidad y el CAT en el sitio de la CONDUSEF.',
    ],
    sources: [SRC.condusefCredito],
  },

  'intereses-cat-fechas': {
    summary: 'Lo que cuesta un crédito y los días que determinan si pagas intereses o no.',
    intro: [
      'Cuando pides prestado, pagas un precio por usar dinero ajeno. Ese precio se expresa con la tasa de interés y, de forma más completa, con el CAT.',
      'Entender estos dos números y las fechas de tu tarjeta te permite comparar créditos y evitar cargos que muchas personas pagan sin darse cuenta.',
    ],
    sections: [
      {
        heading: 'Tasa de interés y CAT',
        table: {
          columns: ['Concepto', 'Qué incluye', 'Para qué sirve'],
          rows: [
            ['Tasa de interés', 'Solo el porcentaje que se cobra por el dinero prestado.', 'Saber cuánto crecen los intereses.'],
            ['CAT (Costo Anual Total)', 'La tasa más comisiones y otros cargos, en un solo porcentaje anual.', 'Comparar créditos del mismo tipo.'],
          ],
        },
        paragraphs: [
          'En México las instituciones están obligadas a informar el CAT. Se expresa sin IVA y es una referencia para comparar, no tu costo exacto. Al comparar dos créditos del mismo tipo, plazo y monto, el de menor CAT suele ser el más barato.',
          'En las tarjetas, los intereses se calculan sobre el saldo que dejas sin pagar, día con día, y a esos intereses se les cobra IVA.',
        ],
      },
      {
        heading: 'Fecha de corte y fecha límite de pago',
        paragraphs: [
          'La fecha de corte es el día en que cierra tu periodo: el banco suma tus compras y emite el estado de cuenta. La fecha límite de pago es el último día para pagar sin cargos por atraso. Según la CONDUSEF, normalmente tienes hasta 20 días naturales después del corte para pagar.',
          'Por eso, una compra hecha justo después del corte puede darte hasta unos 50 días antes de pagarla sin intereses, siempre que liquides el monto para no generar intereses.',
        ],
        callout: 'Pagar después de la fecha límite genera intereses, una comisión por atraso y una marca negativa en tu historial crediticio.',
      },
    ],
    visual: 'card-cycle',
    example: {
      title: 'Aprovechar las fechas y comparar créditos',
      text: 'La tarjeta de Óscar tiene fecha de corte el día 10 y fecha límite de pago el día 30.',
      steps: [
        'Compra el día 11 de noviembre: entra en el periodo que cierra el 10 de diciembre.',
        'La paga a más tardar el 30 de diciembre: casi 50 días después, sin intereses si cubre el monto para no generar intereses.',
        'Además, Óscar busca un préstamo de $20,000 a 12 meses y le ofrecen uno con CAT de 35% y otro con CAT de 48%.',
        'Mismo monto, mismo plazo y mismo tipo de crédito: el de CAT de 35% suele ser el más barato.',
      ],
      conclusion: 'Conocer sus fechas y comparar el CAT le permite usar el crédito sin pagar de más.',
    },
    keyPoints: [
      'Revisa en qué periodo está expresada una tasa: no es lo mismo mensual que anual.',
      'Compara el CAT solo entre créditos equivalentes; para otros productos, revisa también el pago total.',
      'Anota tus fechas de corte y de pago, o domicilia el pago para no olvidarlas.',
      'No esperes al último día: los pagos pueden tardar en reflejarse.',
      'Las tasas y el CAT cambian; consulta los datos vigentes con la institución o en la CONDUSEF.',
    ],
    sources: [SRC.banxicoCat, SRC.condusefCredito],
  },

  'evitar-liquidar-deudas': {
    summary: 'Cómo saber cuánto puedes deber sin ponerte en riesgo y cómo salir de las deudas con un plan.',
    intro: [
      'Una deuda no es mala por sí misma: un crédito hipotecario o uno para tu negocio pueden ayudarte a construir algo. El problema es deber más de lo que puedes pagar o endeudarte para cosas que se acaban antes que la deuda.',
      'Saber cuándo detenerte y tener un plan para salir protege tu ingreso, tu historial y tu tranquilidad.',
    ],
    sections: [
      {
        heading: 'Señales de alerta',
        list: [
          'Pagas una tarjeta con otra o con préstamos.',
          'Solo cubres pagos mínimos.',
          'No sabes cuánto debes en total.',
          'Tus pagos de deudas ya no te dejan cubrir lo básico.',
        ],
        paragraphs: [
          'Una referencia común es que la suma de tus pagos de deudas no rebase alrededor de 30% de tu ingreso neto. No es una regla oficial, pero si la superas, conviene no adquirir más deudas.',
        ],
      },
      {
        heading: 'Un plan para liquidar',
        ordered: true,
        list: [
          'Deja de usar crédito para gastos nuevos mientras pagas.',
          'Haz una lista con cada deuda: saldo, tasa de interés y pago mínimo.',
          'Paga el mínimo en todas para no caer en atraso.',
          'Destina todo el dinero extra a una sola deuda, según el método que elijas.',
          'Cuando la liquides, suma ese pago a la siguiente.',
        ],
        table: {
          columns: ['Método', 'A qué deuda va el dinero extra', 'Ventaja'],
          rows: [
            ['Avalancha', 'A la de tasa de interés más alta', 'Sueles pagar menos intereses en total.'],
            ['Bola de nieve', 'A la de saldo más pequeño', 'Liquidas deudas pronto y eso motiva.'],
          ],
        },
      },
      {
        heading: 'Si ya no puedes pagar',
        paragraphs: [
          'Habla con la institución antes de caer en atraso: puedes pedir una reestructura (cambiar plazo o pago). Si tienes un problema con un banco o un despacho de cobranza, la CONDUSEF puede orientarte. Revisa tu historial pidiendo tu Reporte de Crédito Especial, que es gratuito una vez cada 12 meses.',
        ],
      },
    ],
    visual: 'debt-strategies',
    example: {
      title: 'El plan de Ricardo',
      text: 'Ricardo tiene tres deudas y puede destinar $1,500 extra al mes, además de los pagos mínimos.',
      table: {
        columns: ['Deuda', 'Saldo', 'Tasa', 'Avalancha', 'Bola de nieve'],
        rows: [
          ['Tarjeta A', '$12,000', 'La más alta', '1.ª', '2.ª'],
          ['Tarjeta B', '$4,000', 'Media', '2.ª', '1.ª'],
          ['Préstamo personal', '$30,000', 'La más baja', '3.ª', '3.ª'],
        ],
      },
      conclusion:
        'Con bola de nieve, Ricardo liquida la tarjeta B en menos de tres meses ($4,000 ÷ $1,500 extra) y se motiva. Con avalancha, ataca primero la deuda que más intereses le cobra. Cualquiera funciona si deja de usar las tarjetas mientras paga.',
    },
    keyPoints: [
      'Antes de pedir un crédito, calcula si el pago cabe en tu presupuesto sin descuidar lo básico.',
      'No pidas prestado para pagar gastos del día a día o para pagar otras deudas sin un plan.',
      'Desconfía de quien cobre por “sacarte del Buró”: la información se corrige con aclaraciones formales.',
      'Los préstamos “rápidos” por app o sin requisitos suelen ser muy caros; verifica que la empresa esté registrada ante la CONDUSEF.',
      'Un fondo de emergencia es la mejor forma de no volver a endeudarte por un imprevisto.',
    ],
    sources: [SRC.buroCredito, SRC.condusefCredito],
  },
}
