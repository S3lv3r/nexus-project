/* ------------------------------------------------------------------ */
/* Contenido de la parte 4: indicadores y herramientas de análisis     */
/* ------------------------------------------------------------------ */

export type CategoryKey = 'trend' | 'momentum' | 'volatility' | 'structure'

export type IndicatorIconKey =
  | 'sma'
  | 'ema'
  | 'smma'
  | 'lwma'
  | 'dema'
  | 'tema'
  | 'ichimoku'
  | 'macd'
  | 'rsi'
  | 'kdj'
  | 'bollinger'
  | 'adx'
  | 'vix'
  | 'elliott'
  | 'fibonacci'

export type IllustrationKey = 'macd' | 'rsi' | 'kdj' | 'bollinger' | 'adx' | 'vix' | 'elliott' | 'fibonacci'

export interface Indicator {
  id: string
  name: string
  subtitle: string
  icon: IndicatorIconKey
  /** qué intenta medir o identificar (una línea) */
  measures: string
  /** explicación breve para principiantes */
  explanation: string
  /** interpretación sencilla */
  reading: string[]
  /** advertencia sobre sus límites */
  caution?: string
  illustration?: IllustrationKey
}

export interface IndicatorCategory {
  key: CategoryKey
  letter: string
  title: string
  tagline: string
}

export const CATEGORIES: Record<CategoryKey, IndicatorCategory> = {
  trend: { key: 'trend', letter: 'A', title: 'Tendencia y medias móviles', tagline: 'Hacia dónde apunta el precio.' },
  momentum: { key: 'momentum', letter: 'B', title: 'Impulso y momentum', tagline: 'Con qué fuerza se mueve el precio.' },
  volatility: {
    key: 'volatility',
    letter: 'C',
    title: 'Volatilidad y fuerza de tendencia',
    tagline: 'Qué tan agitado está el mercado y qué tan firme es la tendencia.',
  },
  structure: {
    key: 'structure',
    letter: 'D',
    title: 'Estructura y niveles',
    tagline: 'Dónde podrían estar las zonas de referencia.',
  },
}

/* ---------- A. Tendencia y medias móviles ---------- */

export const SMA: Indicator = {
  id: 'sma',
  name: 'SMA',
  subtitle: 'Media móvil simple',
  icon: 'sma',
  measures: 'La dirección general del precio, con el ruido suavizado.',
  explanation: 'Es el promedio aritmético de los precios de los últimos periodos. Cada periodo cuenta exactamente igual.',
  reading: [
    'Precio por encima de la media y con la media subiendo: suele leerse como contexto alcista.',
    'Precio por debajo y con la media bajando: suele leerse como contexto bajista.',
    'Un periodo más largo suaviza más la línea.',
  ],
}

export const EMA: Indicator = {
  id: 'ema',
  name: 'EMA',
  subtitle: 'Media móvil exponencial',
  icon: 'ema',
  measures: 'La tendencia, dándole más peso a lo que acaba de pasar.',
  explanation: 'Es un promedio ponderado que da mayor importancia a los datos recientes y menos a los antiguos.',
  reading: [
    'Se lee igual que la SMA: la posición del precio respecto a la línea y su pendiente.',
    'Como pesa más lo reciente, su forma puede diferir de la SMA aun con el mismo periodo.',
  ],
}

export const OTHER_AVERAGES: Indicator[] = [
  {
    id: 'smma',
    name: 'SMMA',
    subtitle: 'Media móvil suavizada',
    icon: 'smma',
    measures: 'El rumbo de fondo del precio con cambios graduales.',
    explanation: 'Media suavizada: cada dato nuevo se incorpora de forma gradual, lo que da una línea muy continua.',
    reading: ['Se interpreta como las demás medias: posición del precio y pendiente de la línea.'],
  },
  {
    id: 'lwma',
    name: 'LWMA',
    subtitle: 'Media móvil ponderada linealmente',
    icon: 'lwma',
    measures: 'La tendencia con un peso que crece hacia lo reciente.',
    explanation:
      'Media ponderada linealmente: cada dato pesa un poco más que el anterior, en una escala lineal hasta el más reciente.',
    reading: ['Se interpreta igual que las otras medias; su forma depende del periodo y de sus pesos.'],
  },
  {
    id: 'dema',
    name: 'DEMA',
    subtitle: 'Media móvil exponencial doble',
    icon: 'dema',
    measures: 'La tendencia con menos retraso, según su diseño.',
    explanation: 'Media móvil doble: combina dos medias exponenciales y está diseñada para reducir el retraso.',
    reading: ['Se lee como una media más; reducir el retraso también puede hacerla reaccionar a movimientos pasajeros.'],
  },
  {
    id: 'tema',
    name: 'TEMA',
    subtitle: 'Media móvil exponencial triple',
    icon: 'tema',
    measures: 'La tendencia con menos retraso, según su diseño.',
    explanation: 'Media móvil triple: combina tres medias exponenciales y también está diseñada para reducir el retraso.',
    reading: ['Funciona como la DEMA; su comportamiento depende mucho del periodo elegido.'],
  },
]

export const ICHIMOKU: Indicator = {
  id: 'ichimoku',
  name: 'Ichimoku',
  subtitle: 'Nube de Ichimoku',
  icon: 'ichimoku',
  measures: 'El contexto de la tendencia respecto a la nube.',
  explanation: 'Sistema de análisis que combina varias líneas y una nube para describir el contexto del precio de un vistazo.',
  reading: [
    'Precio por encima de la nube: puede sugerir un contexto alcista.',
    'Precio por debajo de la nube: puede sugerir un contexto bajista.',
    'Precio dentro de la nube: la lectura suele ser menos clara.',
  ],
}

/* ---------- B. Impulso y momentum ---------- */

export const MOMENTUM: Indicator[] = [
  {
    id: 'macd',
    name: 'MACD',
    subtitle: 'Convergencia/divergencia de medias móviles',
    icon: 'macd',
    measures: 'El impulso y posibles cambios de tendencia.',
    explanation:
      'Compara dos medias móviles para estudiar el impulso y posibles cambios de tendencia. Se dibuja con la línea MACD, la línea de señal y unas barras que muestran la distancia entre ambas.',
    reading: [
      'Cuando la línea MACD cruza hacia arriba la línea de señal, el impulso alcista gana fuerza.',
      'Cuando la cruza hacia abajo, gana fuerza el impulso bajista.',
      'Si las barras se acortan, las dos líneas se están acercando.',
    ],
    caution: 'Los cruces son avisos, no certezas: pueden fallar, sobre todo cuando el precio se mueve de lado.',
    illustration: 'macd',
  },
  {
    id: 'rsi',
    name: 'RSI',
    subtitle: 'Índice de fuerza relativa',
    icon: 'rsi',
    measures: 'Qué tan fuerte ha sido el movimiento reciente hacia un lado.',
    explanation: 'Oscilador que mide el impulso relativo del precio en una escala de 0 a 100.',
    reading: [
      'Por encima de 70 suele interpretarse como sobrecompra.',
      'Por debajo de 30 suele interpretarse como sobreventa.',
    ],
    caution:
      'Estos niveles no implican necesariamente una reversión: en tendencias fuertes el RSI puede quedarse en esas zonas durante mucho tiempo.',
    illustration: 'rsi',
  },
  {
    id: 'kdj',
    name: 'KDJ',
    subtitle: 'Variante del estocástico',
    icon: 'kdj',
    measures: 'El impulso y las zonas de sobrecompra o sobreventa.',
    explanation:
      'Indicador formado por tres líneas (K, D y J) que ayuda a interpretar el impulso y las condiciones de sobrecompra o sobreventa.',
    reading: [
      'Los cruces entre sus líneas y su posición cerca de los extremos se toman como pistas.',
      'Una zona alta sugiere sobrecompra y una zona baja, sobreventa.',
    ],
    caution: 'Sus señales deben analizarse en contexto: por sí solas pueden resultar engañosas.',
    illustration: 'kdj',
  },
]

/* ---------- C. Volatilidad y fuerza de tendencia ---------- */

export const VOLATILITY: Indicator[] = [
  {
    id: 'bollinger',
    name: 'Bandas de Bollinger',
    subtitle: 'Bandas de volatilidad',
    icon: 'bollinger',
    measures: 'La volatilidad reciente y qué tan lejos está el precio de su promedio.',
    explanation:
      'Tres líneas alrededor del precio: una media central y dos bandas que se expanden y se contraen según la volatilidad.',
    reading: [
      'Bandas más anchas indican más volatilidad; bandas más estrechas, menos.',
      'Cuando se estrechan, la volatilidad ha bajado; por sí solo no indica hacia dónde irá el precio.',
    ],
    caution: 'Tocar una banda no implica automáticamente que el precio esté caro o barato, ni que vaya a revertirse.',
    illustration: 'bollinger',
  },
  {
    id: 'adx',
    name: 'ADX',
    subtitle: 'Índice direccional promedio',
    icon: 'adx',
    measures: 'La fuerza de la tendencia, no su dirección.',
    explanation: 'Indicador que mide la fuerza de una tendencia, sin indicar si esta sube o baja.',
    reading: [
      'Por debajo de 25 suele sugerir una tendencia débil o poco definida.',
      'Por encima de 40 suele asociarse con una tendencia fuerte.',
    ],
    caution: 'Los umbrales son orientativos y el ADX por sí solo no determina la dirección.',
    illustration: 'adx',
  },
  {
    id: 'vix',
    name: 'VIX',
    subtitle: 'Índice de volatilidad de Cboe, el "índice del miedo"',
    icon: 'vix',
    measures: 'La volatilidad que el mercado espera para el S&P 500 en los próximos 30 días.',
    explanation:
      'Lo calcula Cboe a partir de los precios de las opciones sobre el S&P 500. Se expresa en puntos que equivalen a la volatilidad anual esperada en porcentaje: un VIX de 20 significa que el mercado espera movimientos de alrededor de 20% al año.',
    reading: [
      'Por debajo de 20 suele asociarse con un mercado tranquilo.',
      'Entre 20 y 30 refleja nerviosismo o incertidumbre.',
      'Por encima de 30 se asocia con miedo; en las crisis de 2008 y 2020 superó los 80 puntos.',
      'Suele moverse al revés que el S&P 500: cuando las acciones caen con fuerza, el VIX tiende a dispararse.',
    ],
    caution:
      'Mide expectativas de movimiento, no la dirección del mercado. Además, no se puede comprar directamente: los productos que lo siguen (futuros y ETFs) se comportan distinto al índice.',
    illustration: 'vix',
  },
]

/* ---------- D. Estructura y niveles ---------- */

export const STRUCTURE: Indicator[] = [
  {
    id: 'elliott',
    name: 'Ondas de Elliott',
    subtitle: 'Modelo de ciclos del mercado',
    icon: 'elliott',
    measures: 'En qué fase de un ciclo podría estar el precio.',
    explanation:
      'Modelo que interpreta ciertos movimientos del mercado como cinco ondas de impulso (1 a 5) seguidas de tres de corrección (A, B y C).',
    reading: [
      'Las ondas 1, 3 y 5 avanzan en la dirección principal; la 2 y la 4 son retrocesos.',
      'Las ondas A, B y C corrigen parte del avance anterior.',
    ],
    caution:
      'Es un modelo interpretativo, no una secuencia garantizada: distintos analistas pueden contar las ondas de formas diferentes.',
    illustration: 'elliott',
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci',
    subtitle: 'Niveles de retroceso',
    icon: 'fibonacci',
    measures: 'Posibles zonas de retroceso o reacción del precio.',
    explanation:
      'Herramienta que traza niveles de referencia (23.6%, 38.2%, 50% y 61.8%) entre el inicio y el final de un movimiento.',
    reading: [
      'Tras un avance, se observan esos niveles como referencias para ver cómo reacciona el precio al retroceder.',
      'Sirven para estudiar zonas, no para fijar puntos exactos.',
    ],
    caution: 'El precio no tiene por qué detenerse en estos niveles: son referencias, no garantías.',
    illustration: 'fibonacci',
  },
]
