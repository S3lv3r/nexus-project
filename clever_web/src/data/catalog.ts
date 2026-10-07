import type { Achievement, Category, DiagnosticQuestion, Mission } from '../types/platform'

export const CATEGORIES: Category[] = [
  {
    id: 'trading',
    name: 'Trading y Finanzas',
    icon: 'fa-solid fa-chart-line',
    desc: 'Mercados, análisis y gestión de riesgo mediante simulación práctica.',
  },
  {
    id: 'gaming',
    name: 'Videojuegos y Economía',
    icon: 'fa-solid fa-gamepad',
    desc: 'Industria del videojuego, lanzamientos, publishers y economías digitales.',
  },
  {
    id: 'cine',
    name: 'Películas y Series',
    icon: 'fa-solid fa-film',
    desc: 'Historia del cine, análisis narrativo y producción audiovisual.',
  },
  {
    id: 'libros',
    name: 'Libros y Literatura',
    icon: 'fa-solid fa-book-open',
    desc: 'Autores, movimientos literarios y análisis de grandes obras.',
  },
  {
    id: 'musica',
    name: 'Música y Producción',
    icon: 'fa-solid fa-music',
    desc: 'Géneros, teoría musical, producción e industria sonora.',
  },
  {
    id: 'historia',
    name: 'Historia y Procesos',
    icon: 'fa-solid fa-landmark',
    desc: 'Eventos históricos, civilizaciones y contexto geopolítico.',
  },
  {
    id: 'ciencia',
    name: 'Ciencia y Lógica',
    icon: 'fa-solid fa-flask',
    desc: 'Método empírico, modelos analíticos y pensamiento crítico.',
  },
  {
    id: 'cultura',
    name: 'Cultura General',
    icon: 'fa-solid fa-earth-americas',
    desc: 'Ideas contemporáneas, dinámicas sociales y filosofía.',
  },
]

export const MODULES_BY_CATEGORY: Record<string, string[]> = {
  trading: [
    'Fundamentos del Mercado y Acciones',
    'Análisis Técnico y Velas Japonesas',
    'Soportes, Resistencias y Tendencias',
    'Gestión de Riesgo y Posicionamiento',
    'Psicología del Trader y Disciplina',
    'Estrategias de Inversión y Órdenes',
    'Simulación Práctica en Vivo',
    'Backtesting y Optimización',
  ],
  gaming: [
    'Historia y Generaciones de Consolas',
    'Arquitectura y Motores de Videojuegos',
    'Géneros, Mecánicas y Diseño de Niveles',
    'Grandes Estudios y Casas Desarrolladoras',
    'Economía de la Industria y eSports',
  ],
  cine: [
    'Historia y Nacimiento del Cine',
    'Lenguaje y Montaje Cinematográfico',
    'Dirección, Planos y Composición',
    'Estructura Narrativa y Guion',
    'Géneros Cinematográficos',
    'Análisis Crítico de Obras Maestras',
  ],
  libros: [
    'Movimientos Literarios Clásicos y Modernos',
    'Autores Clave de la Literatura Universal',
    'Géneros y Subgéneros Narrativos',
    'Análisis Textual y Figuras Retóricas',
    'Crítica Literaria y Contexto Histórico',
  ],
  musica: [
    'Teoría Musical y Armonía Básica',
    'Historia de los Grandes Géneros',
    'Producción de Audio y Mezcla',
    'Instrumentación y Acústica',
    'Análisis Estructural de Canciones',
  ],
  historia: [
    'Civilizaciones Antiguas y Primeros Imperios',
    'Edad Media y Rutas Comerciales',
    'Renacimiento e Ilustración',
    'Revoluciones y Siglo XX',
    'Geopolítica y Mundo Contemporáneo',
  ],
  ciencia: [
    'Método Científico y Empirismo',
    'Física Elemental y Leyes del Movimiento',
    'Química y Estructura de la Materia',
    'Biología Celular y Evolución',
    'Pensamiento Crítico y Lógica',
  ],
  cultura: [
    'Actualidad y Dinámicas Globales',
    'Grandes Corrientes Filosóficas',
    'Historia del Arte y Estética',
    'Sociedad, Comunicación y Redes',
    'Paradojas y Curiosidades Universales',
  ],
}

export const MISSIONS_BY_CATEGORY: Record<string, Mission> = {
  trading: {
    text: 'Identifica una zona de soporte en el gráfico y evalúa la relación riesgo/beneficio.',
    xp: 100,
    coins: 50,
  },
  gaming: {
    text: 'Analiza el impacto de un lanzamiento AAA en la valoración del catálogo.',
    xp: 100,
    coins: 50,
  },
  cine: {
    text: 'Identifica qué técnica de montaje genera tensión en una escena clave.',
    xp: 100,
    coins: 50,
  },
  libros: {
    text: 'Relaciona a un autor con su respectivo movimiento literario y contexto.',
    xp: 100,
    coins: 50,
  },
  musica: {
    text: 'Reconoce los compases e instrumentos principales en un fragmento musical.',
    xp: 100,
    coins: 50,
  },
  historia: {
    text: 'Ordena cronológicamente los hitos clave de una transformación social.',
    xp: 100,
    coins: 50,
  },
  ciencia: {
    text: 'Formula una hipótesis comprobable usando el método científico.',
    xp: 100,
    coins: 50,
  },
  cultura: {
    text: 'Explora una paradoja filosófica y reflexiona sobre sus implicaciones.',
    xp: 100,
    coins: 50,
  },
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_challenge',
    name: 'Primer Desafío',
    icon: 'fa-solid fa-bolt',
    desc: 'Completa tu primer reto o misión diaria.',
  },
  {
    id: 'first_analysis',
    name: 'Analista Técnico',
    icon: 'fa-solid fa-magnifying-glass-chart',
    desc: 'Completa tu primer análisis o experiencia interactiva.',
  },
  {
    id: 'streak_7',
    name: 'Constancia de 7 Días',
    icon: 'fa-solid fa-fire',
    desc: 'Mantén una racha de estudio de 7 días consecutivos.',
  },
  {
    id: 'explorer',
    name: 'Mente Curiosa',
    icon: 'fa-solid fa-compass',
    desc: 'Explora y suscríbete a 3 categorías distintas.',
  },
  {
    id: 'knowledge_master',
    name: 'Nivel 10 Alcanzado',
    icon: 'fa-solid fa-graduation-cap',
    desc: 'Alcanza el nivel 10 en la plataforma.',
  },
  {
    id: 'first_trade',
    name: 'Primera Orden en Mercado',
    icon: 'fa-solid fa-chart-line',
    desc: 'Realiza tu primera operación en el exchange spot.',
  },
  {
    id: 'community_voice',
    name: 'Aporte a la Comunidad',
    icon: 'fa-solid fa-comments',
    desc: 'Publica un análisis o comentario en el foro.',
  },
  {
    id: 'diagnostico_ace',
    name: 'Diagnóstico Completado',
    icon: 'fa-solid fa-certificate',
    desc: 'Completa tu primer examen diagnóstico de nivel.',
  },
]

export const DIAGNOSTIC_QUESTIONS: Record<string, DiagnosticQuestion[]> = {
  trading: [
    {
      type: 'mcq',
      q: '¿Qué representa una vela japonesa en un gráfico financiero?',
      options: [
        'Un indicador de volumen acumulado',
        'Los precios de apertura, cierre, máximo y mínimo en un periodo',
        'Un tipo de activo digital',
        'Una métrica de sentimiento de redes sociales',
      ],
      correct: 1,
    },
    {
      type: 'tf',
      q: 'Un nivel de soporte es una zona donde históricamente la demanda frena las caídas.',
      correct: true,
    },
    {
      type: 'mcq',
      q: '¿Cuál es el objetivo primordial de la gestión de riesgo?',
      options: [
        'Asegurar ganancias en cada transacción',
        'Limitar pérdidas potenciales para preservar el capital',
        'Predecir exactamente el cierre del mercado',
        'Operar con la máxima frecuencia posible',
      ],
      correct: 1,
    },
    {
      type: 'scenario',
      q: 'Un activo alcanza un nivel de resistencia clave tras una fuerte subida ininterrumpida. ¿Qué conducta es más prudente?',
      options: [
        'Comprar de inmediato con todo el capital',
        'Esperar una confirmación de ruptura o rechazo antes de entrar',
        'Vender en corto sin Stop Loss',
        'Ignorar el gráfico',
      ],
      correct: 1,
    },
    {
      type: 'mcq',
      q: '¿Cómo se define una tendencia alcista estructural?',
      options: [
        'Una sucesión de máximos y mínimos ascendentes',
        'Una sucesión de máximos y mínimos descendentes',
        'Un rango lateral horizontal',
        'Un movimiento vertical sin corrección',
      ],
      correct: 0,
    },
    {
      type: 'tf',
      q: 'El oscilador RSI señala zonas de posible sobrecompra o sobreventa.',
      correct: true,
    },
    {
      type: 'order',
      q: 'Ordena los pasos de una planificación de trading rigurosa (del primero al último):',
      options: [
        'Definir tamaño de posición y Stop Loss',
        'Analizar estructura del mercado',
        'Ejecutar orden según el plan',
        'Registrar en bitácora y evaluar',
      ],
      correctOrder: [1, 0, 2, 3],
    },
  ],
  gaming: [
    {
      type: 'mcq',
      q: '¿Qué generación de consolas consolidó los entornos 3D en el mercado masivo?',
      options: [
        'Quinta generación (PlayStation, N64, Saturn)',
        'Segunda generación (Atari 2600)',
        'Primera generación',
        'Generación de 8-bits',
      ],
      correct: 0,
    },
    {
      type: 'tf',
      q: 'Un juego Roguelike se distingue por generación procedural y muerte permanente.',
      correct: true,
    },
    {
      type: 'order',
      q: 'Ordena cronológicamente estas consolas:',
      options: ['Atari 2600', 'Super Nintendo', 'PlayStation 2', 'Nintendo Switch'],
      correctOrder: [0, 1, 2, 3],
    },
  ],
  cine: [
    {
      type: 'mcq',
      q: '¿En qué consiste el montaje cinematográfico?',
      options: [
        'En la redacción del guion',
        'En el ensamblaje de tomas para dar ritmo y significado',
        'En la selección de actores',
        'En la mezcla de sonido',
      ],
      correct: 1,
    },
    {
      type: 'tf',
      q: 'El plano secuencia se caracteriza por la ausencia de cortes visibles de edición.',
      correct: true,
    },
  ],
  libros: [
    {
      type: 'mcq',
      q: '¿Qué rasgo define al Realismo Mágico?',
      options: [
        'Integrar lo extraordinario en la vida cotidiana de forma natural',
        'Rechazar cualquier elemento emocional',
        'Ambientación futurista exclusiva',
        'Escribir solo en verso',
      ],
      correct: 0,
    },
    {
      type: 'tf',
      q: 'Un narrador intradiegético forma parte de la historia que cuenta.',
      correct: true,
    },
  ],
}

export const MENTOR_KNOWLEDGE: Record<string, string> = {
  rsi: 'El RSI oscila entre 0 y 100. Superar 70 suele indicar sobrecompra; situarse bajo 30 señala sobreventa.',
  soporte: 'Un soporte es un nivel donde la presión compradora supera la vendedora, frenando el descenso del precio.',
  resistencia: 'Una resistencia es una zona de precio donde la oferta vendedora frena el avance del activo.',
  'gestion de riesgo': 'Consiste en definir previamente el porcentaje máximo de capital expuesto por operación con un Stop Loss riguroso.',
  'velas japonesas': 'Representan visualmente el balance entre compradores y vendedores mediante apertura, cierre, máximos y mínimos.',
  stoploss: 'Es una orden de corte automático que limita la pérdida máxima tolerable en una operación.',
}

export const MENTOR_SUGGESTIONS = [
  '¿Cómo identificar un soporte y resistencia?',
  'Explícame la gestión de riesgo.',
  '¿Qué significan las mechas de las velas?',
  'Ponme un reto de análisis técnico.',
  '¿Cuál debería ser mi siguiente módulo?',
]
