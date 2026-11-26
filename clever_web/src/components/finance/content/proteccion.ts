import type { FinanceContentMap } from '../types'
import { SRC } from './sources'

/** 05 · Protección y futuro financiero */
export const PROTECCION: FinanceContentMap = {
  seguros: {
    summary: 'Pagar una cantidad conocida para que un evento caro e inesperado no destruya tus finanzas.',
    intro: [
      'Un seguro es un contrato: pagas una prima a una aseguradora y, si ocurre un evento cubierto, ella paga los gastos hasta cierto límite. Transfiere a otros el costo de riesgos que tú no podrías pagar.',
      'Importa porque un solo accidente, una hospitalización o el robo de tu auto pueden costar más que años de ahorro. El fondo de emergencia cubre imprevistos pequeños y medianos; el seguro, los grandes.',
    ],
    sections: [
      {
        heading: 'Los seguros más comunes',
        table: {
          columns: ['Seguro', 'Qué cubre', 'Cuándo tiene más sentido'],
          rows: [
            ['Gastos médicos mayores', 'Hospitalizaciones, cirugías y tratamientos de alto costo.', 'Casi siempre, sobre todo sin otra cobertura médica.'],
            ['Vida', 'Una suma de dinero para tus beneficiarios si falleces.', 'Si otras personas dependen de tu ingreso.'],
            ['Auto', 'Daños a terceros, daños a tu auto y robo, según la cobertura.', 'Si tienes auto. La responsabilidad civil es obligatoria para circular en carreteras federales.'],
            ['Hogar', 'Daños a tu vivienda y a tus pertenencias por incendio, robo o fenómenos naturales.', 'Si tienes bienes que no podrías reponer fácilmente, aunque rentes.'],
          ],
        },
      },
      {
        heading: 'Términos que debes entender',
        list: [
          'Prima: lo que pagas por el seguro, mensual o anual.',
          'Suma asegurada: lo máximo que pagará la aseguradora.',
          'Deducible: la cantidad que pagas tú primero en cada reclamación.',
          'Coaseguro: el porcentaje del resto que también te corresponde pagar.',
          'Exclusiones: lo que el seguro no cubre. Es la parte que más conviene leer.',
        ],
        paragraphs: [
          'Un deducible más alto suele bajar la prima, pero implica pagar más cuando ocurre algo. Elige uno que puedas cubrir con tu fondo de emergencia.',
        ],
      },
    ],
    visual: 'deductible',
    example: {
      title: 'Una cirugía de $100,000',
      text: 'José tiene un seguro de gastos médicos con deducible de $10,000 y coaseguro de 10%. Necesita una cirugía cubierta que cuesta $100,000 (cifras ilustrativas).',
      steps: [
        'Paga primero el deducible: $10,000.',
        'Quedan $90,000. Le corresponde el 10% de coaseguro: $9,000.',
        'La aseguradora paga el resto: $90,000 − $9,000 = $81,000.',
        'José paga en total $19,000 en lugar de $100,000.',
      ],
      conclusion: 'Gracias a su fondo de emergencia, José puede cubrir su parte sin endeudarse.',
    },
    keyPoints: [
      'Asegura primero lo que no podrías pagar por tu cuenta.',
      'Lee las exclusiones y los periodos de espera antes de firmar.',
      'Compara varias opciones: precio, deducible, coaseguro y red de hospitales.',
      'Mantén actualizados a tus beneficiarios.',
      'Verifica que la aseguradora esté autorizada y consulta la CONDUSEF si tienes un problema con una reclamación.',
    ],
    sources: [SRC.dofSeguroAuto, SRC.condusef],
  },

  'impuestos-basicos': {
    summary: 'Qué impuestos pagas en tu vida diaria y qué obligaciones básicas tienes ante el SAT.',
    intro: [
      'Los impuestos son contribuciones obligatorias que financian servicios públicos como salud, educación e infraestructura. En México los administra el Servicio de Administración Tributaria (SAT).',
      'Entender los básicos te ayuda a leer tu recibo de nómina, a saber cuánto cuesta realmente lo que compras y, en algunos casos, a recuperar dinero en tu declaración anual.',
    ],
    sections: [
      {
        heading: 'Los dos impuestos que más te afectan',
        table: {
          columns: ['Impuesto', 'Sobre qué se cobra', 'Cómo lo pagas'],
          rows: [
            ['ISR (Impuesto Sobre la Renta)', 'Tus ingresos: sueldo, honorarios, rentas.', 'Si eres asalariado, tu empleador te lo retiene cada pago. Quien gana más paga un porcentaje mayor.'],
            ['IVA (Impuesto al Valor Agregado)', 'Lo que compras: bienes y servicios.', 'Va incluido en el precio. La tasa general es 16% y muchos alimentos y medicinas tienen tasa 0%. En las regiones fronterizas norte y sur, un estímulo temporal permite a negocios inscritos cobrar 8%.'],
          ],
        },
      },
      {
        heading: 'Tus herramientas ante el SAT',
        list: [
          'RFC: tu clave de identificación fiscal.',
          'Contraseña o e.firma: te permiten hacer trámites en línea; la e.firma tiene la misma validez que tu firma autógrafa.',
          'CFDI (factura electrónica): el comprobante de cada pago. Tu recibo de nómina también es un CFDI.',
          'Constancia de situación fiscal: documento con tu RFC, régimen y domicilio fiscal; te la suelen pedir para trabajar o facturar.',
        ],
      },
      {
        heading: 'La declaración anual',
        paragraphs: [
          'Las personas físicas la presentan normalmente en abril. En ella se calcula el impuesto del año y se compara con lo que ya se pagó o retuvo. El resultado puede ser saldo a favor (te devuelven), saldo a cargo (pagas la diferencia) o cero.',
          'No todos los asalariados están obligados, pero presentarla puede convenirte si tienes deducciones personales: gastos médicos, dentales y hospitalarios, colegiaturas, intereses reales de un crédito hipotecario, primas de seguros de gastos médicos o aportaciones voluntarias para el retiro, entre otras. Para que cuenten, deben estar facturadas a tu RFC y pagadas con tarjeta, transferencia o cheque nominativo; en general, los pagos en efectivo no son deducibles.',
        ],
        callout: 'Las tarifas, los límites de deducción y las reglas de quién debe declarar se actualizan cada año. Consulta siempre la información vigente en el portal del SAT.',
      },
    ],
    example: {
      title: 'Leer el IVA en una cotización',
      text: 'A Patricia le cotizan una reparación en “$1,000 más IVA” y en otro taller le dicen “$1,160 con IVA incluido”.',
      steps: [
        'Primer taller: $1,000 × 1.16 = $1,160 en total.',
        'Segundo taller: el precio ya incluye el IVA. Precio sin IVA: $1,160 ÷ 1.16 = $1,000.',
        'IVA en ambos casos: $160.',
      ],
      conclusion: 'Las dos ofertas cuestan lo mismo. Comparar precios sin revisar si incluyen IVA puede llevar a una mala decisión.',
    },
    keyPoints: [
      'Revisa tu recibo de nómina para saber cuánto ISR te retienen.',
      'Pide factura con tu RFC en gastos médicos, dentales y colegiaturas durante el año, no al final.',
      'Paga estos gastos con tarjeta o transferencia para que puedan deducirse.',
      'Si trabajas por tu cuenta, separa el dinero de tus impuestos en cuanto cobres.',
      'Presentar tarde o no presentar una declaración obligatoria puede generar multas y recargos.',
    ],
    sources: [SRC.satDeclaracion, SRC.satIvaFrontera],
  },

  'afore-y-retiro': {
    summary: 'La cuenta donde se acumula tu ahorro para el retiro y lo que puedes hacer desde hoy para que alcance.',
    intro: [
      'Si trabajas con un patrón registrado ante el IMSS o el ISSSTE, tienes una cuenta individual para el retiro administrada por una AFORE. Ahí se acumulan aportaciones tuyas, de tu patrón y del gobierno, y la afore las invierte para que crezcan.',
      'El retiro parece lejano, pero es la meta más grande de tus finanzas. Lo que hagas hoy, aunque sea poco, se multiplica gracias al tiempo.',
    ],
    visual: 'retirement-pillars',
    sections: [
      {
        heading: 'Cómo funciona tu AFORE',
        list: [
          'Aportaciones obligatorias: cada bimestre se depositan con base en tu salario registrado.',
          'Inversión: la afore invierte tu dinero en SIEFORES generacionales, que se asignan según tu año de nacimiento.',
          'Comisiones: la afore cobra una comisión por administrar tu cuenta.',
          'Supervisión: la CONSAR regula a las afores y publica comparativos de rendimientos y comisiones.',
        ],
        paragraphs: [
          'Las condiciones para pensionarte (edad, semanas cotizadas y monto) dependen del régimen en el que empezaste a cotizar y han cambiado con reformas recientes. Consulta tu caso con tu afore o en la CONSAR.',
        ],
      },
      {
        heading: 'Lo que puedes hacer desde hoy',
        ordered: true,
        list: [
          'Averigua en qué afore estás en e-SAR, AforeWeb o la app AforeMóvil, con tu CURP o NSS.',
          'Registra a tus beneficiarios y actualiza tus datos.',
          'Revisa tu estado de cuenta al menos una vez al año.',
          'Compara rendimientos netos entre afores; puedes cambiarte si otra te conviene más.',
          'Haz aportaciones voluntarias, aunque sean pequeñas, desde la app, en tiendas o por domiciliación.',
        ],
      },
      {
        heading: 'Otros complementos para el retiro',
        paragraphs: [
          'Además de la afore, existen los Planes Personales de Retiro (PPR) que ofrecen bancos, aseguradoras y operadoras de fondos. Sus aportaciones pueden deducirse en tu declaración anual dentro de los límites de ley, pero si retiras antes de la edad pactada puedes perder ese beneficio.',
        ],
        callout:
          'Si trabajas por tu cuenta, no tienes aportaciones obligatorias, pero puedes abrir una cuenta en una afore y ahorrar de forma voluntaria.',
      },
    ],
    example: {
      title: '$500 al mes durante 20 años',
      text: 'Gabriel, de 30 años, decide hacer aportaciones voluntarias de $500 al mes a su afore.',
      steps: [
        'Aportaciones en un año: $500 × 12 = $6,000.',
        'En 20 años: $6,000 × 20 = $120,000 aportados.',
        'A eso se suman los rendimientos que genere la afore con el tiempo, que no están garantizados pero se benefician del interés compuesto.',
      ],
      conclusion: 'Con una cantidad que equivale a una salida al mes, Gabriel construye un complemento importante para su retiro.',
    },
    keyPoints: [
      'Saber en qué afore estás y quiénes son tus beneficiarios es el primer paso.',
      'Mientras más temprano empieces a aportar, menos necesitarás aportar cada mes.',
      'Compara afores por rendimiento neto, no por regalos o promociones.',
      'Desconfía de agentes que te presionen para cambiar de afore o pidan tus datos sin identificarse.',
      'Las reglas de pensión y los rendimientos cambian; consulta la información vigente en la CONSAR.',
    ],
    sources: [SRC.consarCuaderno, SRC.consarGuiaImss, SRC.esar],
  },
}
