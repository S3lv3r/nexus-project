import type { CourseTopic } from './courseTypes'

export const COURSE_TOPICS: CourseTopic[] = [
  {
    "number": 1,
    "title": "Economía digital, finanzas y mercados financieros",
    "shortTitle": "Economía y mercados",
    "icon": "fa-solid fa-landmark",
    "summary": "Entiende la inflación, el interés compuesto, la regulación Fintech y cómo se forma un precio dentro de un mercado.",
    "lessons": [
      {
        "id": "1.1",
        "title": "Contexto Macroeconómico, Interés Compuesto y Ecosistema Fintech",
        "description": "Entorno económico en México, pérdida de poder adquisitivo, cálculo de interés simple vs. compuesto, fundamentos fiscales (ISR) y la regulación bajo la Ley Fintech",
        "objective": "Comprender la necesidad de rentabilizar el capital frente a la inflación y navegar el marco regulatorio digital",
        "minutes": 60,
        "level": "Principiante",
        "keywords": [
          "Inflación",
          "ISR",
          "Interés Compuesto",
          "Ley Fintech",
          "KYC",
          "AML"
        ]
      },
      {
        "id": "1.2",
        "title": "Microestructura de Mercado, Libro de Órdenes y Mecánica de Precios",
        "description": "El proceso de subasta continua, Libro de Órdenes (Order Book), Spread, órdenes Market vs. Limit, y deslizamiento (slippage)",
        "objective": "Analizar cómo se ejecuta realmente una transacción dentro de un exchange",
        "minutes": 50,
        "level": "Principiante",
        "keywords": [
          "Order Book",
          "Bid",
          "Ask",
          "Spread",
          "Slippage",
          "Maker",
          "Taker"
        ]
      },
      {
        "id": "1.3",
        "title": "Clasificación de Mercados, Operativa Spot y Derivados OTC",
        "description": "Acciones, renta fija, divisas, materias primas, ETFs, operativa de contado, ventas en corto y derivados estandarizados y OTC",
        "objective": "Dominar el catálogo de instrumentos financieros y sus mecanismos contractuales",
        "minutes": 60,
        "level": "Principiante · Intermedio",
        "keywords": [
          "Spot",
          "Derivados",
          "Subyacente",
          "Long",
          "Short",
          "Futuros",
          "Opciones",
          "Swaps"
        ]
      },
      {
        "id": "1.4",
        "title": "Estilos de Operación, Horizontes Temporales y Gestión de Vida",
        "description": "Scalping, Day Trading, Swing Trading y Position Trading; alineación psicológica y adaptación a la rutina personal",
        "objective": "Seleccionar el estilo operativo compatible con la disponibilidad horaria del trader",
        "minutes": 45,
        "level": "Principiante",
        "keywords": [
          "Scalping",
          "Day Trading",
          "Swing Trading",
          "Position Trading",
          "Timeframe"
        ]
      }
    ]
  },
  {
    "number": 2,
    "title": "Gráficos, acción del precio y análisis estructural",
    "shortTitle": "Gráficos y precio",
    "icon": "fa-solid fa-chart-column",
    "summary": "Lee velas japonesas, tendencias, soportes y resistencias, y descubre cómo se mueve la liquidez institucional.",
    "lessons": [
      {
        "id": "2.1",
        "title": "Tipos de Gráficos, Escalas y Anatomía de Velas Japonesas",
        "description": "Gráficos de línea, barras, velas japonesas, Heikin Ashi, Renko, escala lineal vs. logarítmica y lectura de precios OHLC",
        "objective": "Leer con precisión la psicología del mercado contenida en cada barra gráfica",
        "minutes": 50,
        "level": "Principiante",
        "keywords": [
          "OHLC",
          "Vela Japonesa",
          "Mecha",
          "Cuerpo",
          "Heikin Ashi",
          "Renko",
          "Escala Logarítmica"
        ]
      },
      {
        "id": "2.2",
        "title": "Tendencias, Soportes, Resistencias Dinámicas y Validación por Volumen",
        "description": "Estructuras alcistas, bajistas y laterales; trazado de zonas de soporte y resistencia; y confirmación de rupturas mediante el volumen",
        "objective": "Mapear la estructura del mercado y distinguir rupturas genuinas de engaños",
        "minutes": 55,
        "level": "Principiante · Intermedio",
        "keywords": [
          "Tendencia Alcista",
          "Tendencia Bajista",
          "Soporte",
          "Resistencia",
          "Volumen",
          "Falsa Ruptura"
        ]
      },
      {
        "id": "2.3",
        "title": "Microestructura Institucional: Piscinas de Liquidez y Flujo de Órdenes (Order Flow)",
        "description": "Cómo operan los grandes capitales (Smart Money), zonas de acumulación de órdenes (Liquidity Pools), barridos de liquidez y lectura de Order Flow",
        "objective": "Interpretar los movimientos de manipulación institucional para evitar ser la contrapartida de los grandes fondos",
        "minutes": 60,
        "level": "Intermedio",
        "keywords": [
          "Smart Money",
          "Liquidity Pool",
          "Liquidity Sweep",
          "Order Flow",
          "Order Blocks"
        ]
      }
    ]
  },
  {
    "number": 3,
    "title": "Indicadores técnicos, modelos estadísticos y geometría de mercado",
    "shortTitle": "Indicadores técnicos",
    "icon": "fa-solid fa-wave-square",
    "summary": "Domina patrones de velas, medias móviles, osciladores, Fibonacci y los ciclos de Elliott.",
    "lessons": [
      {
        "id": "3.1",
        "title": "Catálogo de Patrones de Velas de Reversión, Continuación y Dominio",
        "description": "Estudio integral de patrones de 1, 2 y 3 velas: Martillo, Envolventes, Penetrante, Nube Oscura, Estrellas, Soldados, Cuervos, Trompos y Marubozu",
        "objective": "Identificar configuraciones de velas como pistas contextuales de reversión o consolidación",
        "minutes": 55,
        "level": "Principiante · Intermedio",
        "keywords": [
          "Martillo",
          "Bullish Engulfing",
          "Morning Star",
          "Evening Star",
          "Doji",
          "Marubozu"
        ]
      },
      {
        "id": "3.2",
        "title": "Medias Móviles, Ponderación Matemática y Jerarquía de Velocidad",
        "description": "Fórmulas de cálculo de SMA y EMA, variantes especializadas (SMMA, LWMA, DEMA, TEMA), el fenómeno del retraso (lag) y la Nube Ichimoku",
        "objective": "Utilizar promedios móviles para identificar tendencias y soportes dinámicos según el estilo operativo",
        "minutes": 60,
        "level": "Intermedio",
        "keywords": [
          "SMA",
          "EMA",
          "SMMA",
          "LWMA",
          "DEMA",
          "TEMA",
          "Ichimoku",
          "Lag"
        ]
      },
      {
        "id": "3.3",
        "title": "Osciladores, Medición de Volatilidad y Señales de Impulso",
        "description": "RSI, MACD, Oscilador Estocástico (KDJ), Bandas de Bollinger, Desviación Estándar y ADX",
        "objective": "Evaluar la aceleración, saturación y volatilidad del mercado sin incurrir en redundancia técnica",
        "minutes": 60,
        "level": "Intermedio",
        "keywords": [
          "RSI",
          "Sobrecompra",
          "Sobreventa",
          "MACD",
          "Bollinger",
          "Desviación Estándar",
          "ADX",
          "KDJ"
        ]
      },
      {
        "id": "3.4",
        "title": "Geometría de Mercado: Secuencia de Fibonacci y Ciclos Fractales de Elliott",
        "description": "Ratios áureos aplicados a retrocesos y extensiones; teoría fractal de ondas de Ralph Nelson Elliott y sus reglas de invalidación",
        "objective": "Estructurar proyecciones matemáticas de soporte, resistencia y objetivos de precio",
        "minutes": 65,
        "level": "Intermedio · Avanzado",
        "keywords": [
          "Fibonacci",
          "Golden Ratio",
          "Retrocesos",
          "Extensiones",
          "Ondas de Elliott",
          "Fractales"
        ]
      }
    ]
  },
  {
    "number": 4,
    "title": "Ecosistema cripto, arquitectura blockchain y criptoeconomía",
    "shortTitle": "Cripto y blockchain",
    "icon": "fa-solid fa-cubes",
    "summary": "Comprende la criptografía, el consenso, los contratos inteligentes, la escalabilidad y la seguridad operativa.",
    "lessons": [
      {
        "id": "4.1",
        "title": "Criptografía Aplicada, Estructura de Bloques y Gestión de Custodia",
        "description": "Funciones hash (SHA-256, Keccak-256), firmas digitales ECDSA, Merkle Trees, estándar BIP-39 de frases semilla y carteras calientes vs. frías",
        "objective": "Dominar la seguridad criptográfica que garantiza la inmutabilidad de los datos y proteger claves privadas",
        "minutes": 60,
        "level": "Principiante · Intermedio",
        "keywords": [
          "Hash",
          "SHA-256",
          "Criptografía Asimétrica",
          "Clave Privada",
          "Clave Pública",
          "BIP-39",
          "Cold Wallet"
        ]
      },
      {
        "id": "4.2",
        "title": "Algoritmos de Consenso, Incentivos Económicos y el Problema del Doble Gasto",
        "description": "Proof of Work (PoW), Proof of Stake (PoS), DPoS, PoA, PoH, resolución de forks, halving y la seguridad económica de Bitcoin",
        "objective": "Explicar cómo miles de computadoras sin jerarquía central acuerdan una única versión de la verdad contable",
        "minutes": 60,
        "level": "Intermedio",
        "keywords": [
          "Consenso",
          "PoW",
          "PoS",
          "Slashing",
          "Halving",
          "Doble Gasto",
          "Ataque del 51%"
        ]
      },
      {
        "id": "4.3",
        "title": "Arquitectura de 5 Capas, Contratos Inteligentes, Gas y MEV",
        "description": "Capas de Datos, Red, Consenso, Incentivos y Aplicación; Máquina Virtual (EVM), comisiones de Gas, la sala de espera (Mempool) y el Valor Extraíble Máximo (MEV)",
        "objective": "Comprender cómo se ejecuta el código en blockchain y proteger transacciones frente a bots de arbitraje",
        "minutes": 60,
        "level": "Intermedio",
        "keywords": [
          "EVM",
          "Smart Contracts",
          "Gas",
          "Mempool",
          "MEV",
          "Front-running",
          "Sandwich Attack"
        ]
      },
      {
        "id": "4.4",
        "title": "Escalabilidad Multicapa (L1, L2, L3), Interoperabilidad y Abstracción de Cuentas",
        "description": "El Trilema de Blockchain, Layer 1 vs. Layer 2 (Rollups Optimistas y ZK), Layer 3, Puentes (Bridges) y el estándar ERC-4337",
        "objective": "Diferenciar las redes de escalabilidad moderna y dominar las carteras de contratos inteligentes",
        "minutes": 60,
        "level": "Intermedio · Avanzado",
        "keywords": [
          "Trilema",
          "Layer 2",
          "Rollups",
          "Zero-Knowledge",
          "Bridges",
          "ERC-4337",
          "Account Abstraction"
        ]
      },
      {
        "id": "4.5",
        "title": "Tokenización de Activos Reales (RWA), Tokenomics y Métricas On-Chain",
        "description": "Tokenización de bienes raíces y deuda; diseño económico de tokens; los 4 filtros de seguridad cripto; y lectura del Altcoin Season Index",
        "objective": "Evaluar proyectos mediante análisis fundamental e identificar oportunidades de activos tokenizados regulados",
        "minutes": 65,
        "level": "Intermedio",
        "keywords": [
          "RWA",
          "Tokenomics",
          "Vesting",
          "Altcoin Season Index",
          "CoinMarketCap",
          "Whale Alert"
        ]
      },
      {
        "id": "4.6",
        "title": "Seguridad Operativa, Auditoría de Smart Contracts y Lecciones del Invierno Cripto",
        "description": "Prevención de estafas en código (Honeypots, Rug Pulls), revocación de permisos, análisis de los colapsos de 2022 (FTX, Terra-Luna, Celsius) y operativa real en Binance y Bitso",
        "objective": "Implementar protocolos de autodefensa frente a fraudes contractuales y desastres corporativos",
        "minutes": 65,
        "level": "Intermedio · Avanzado",
        "keywords": [
          "Honeypot",
          "Rug Pull",
          "Token Approvals",
          "Terra-Luna",
          "FTX",
          "Bitso",
          "Binance",
          "P2P"
        ]
      }
    ]
  },
  {
    "number": 5,
    "title": "Gestión del riesgo, psicotrading y estrategia sistemática",
    "shortTitle": "Riesgo y psicotrading",
    "icon": "fa-solid fa-shield-halved",
    "summary": "Protege tu capital, controla el apalancamiento, gestiona tus emociones y valida tus estrategias con datos.",
    "lessons": [
      {
        "id": "5.1",
        "title": "Planificación de Riesgo, Stop-Loss y Aritmética del Drawdown",
        "description": "La regla de oro del 2%, cálculo del tamaño de posición según la distancia de invalidación, asimetría de pérdidas y gestión del Drawdown",
        "objective": "Estructurar un escudo de gestión monetaria que garantice la supervivencia matemática de la cuenta",
        "minutes": 60,
        "level": "Intermedio",
        "keywords": [
          "Gestión de Riesgo",
          "Stop-Loss",
          "Regla del 2%",
          "Tamaño de Posición",
          "Drawdown Asimétrico"
        ]
      },
      {
        "id": "5.2",
        "title": "Apalancamiento en Futuros, Márgenes y Riesgo de Liquidación",
        "description": "Funcionamiento del apalancamiento financiero, margen aislado vs. cruzado, cálculo del precio de liquidación y gestión de derivados",
        "objective": "Utilizar el apalancamiento como herramienta de eficiencia de capital sin arriesgar la quiebra de la cuenta",
        "minutes": 55,
        "level": "Intermedio · Avanzado",
        "keywords": [
          "Apalancamiento",
          "Futuros",
          "Margen Aislado",
          "Margen Cruzado",
          "Liquidación"
        ]
      },
      {
        "id": "5.3",
        "title": "Psicotrading Profundo: Neurobiología, Sesgos y los 12 Mandamientos",
        "description": "El secuestro de la amígdala, circuitos de dopamina, aversión a la pérdida, los 8 grandes errores y los 12 mandamientos del trading",
        "objective": "Dominar las respuestas biológicas y psicológicas ante la incertidumbre financiera",
        "minutes": 60,
        "level": "Principiante · Intermedio · Avanzado",
        "keywords": [
          "Psicotrading",
          "Amígdala",
          "Dopamina",
          "FOMO",
          "Sesgos Cognitivos",
          "12 Mandamientos"
        ]
      },
      {
        "id": "5.4",
        "title": "Flujo Metódico de 7 Pasos, Auditoría en Bitácora y Esperanza Matemática",
        "description": "El proceso formal de ejecución en 7 pasos, diseño y auditoría de la Bitácora de Trading, cálculo de Esperanza Matemática y Factor de Beneficio",
        "objective": "Transformar el trading discrecional en una actividad profesional evaluada mediante métricas estadísticas",
        "minutes": 60,
        "level": "Intermedio · Avanzado",
        "keywords": [
          "Proceso de 7 Pasos",
          "Bitácora",
          "Esperanza Matemática",
          "Win Rate",
          "Risk/Reward",
          "Profit Factor"
        ]
      },
      {
        "id": "5.5",
        "title": "Sistematización de Estrategias: Backtesting Científico e Introducción al Trading Algorítmico",
        "description": "Metodología de Backtesting riguroso, Forward Testing (Paper Trading), automatización mediante DCA / Auto-Invest, y fundamentos de algoritmos en Python y APIs",
        "objective": "Validar estadísticamente una estrategia sobre datos históricos y sistematizar la ejecución operativa",
        "minutes": 65,
        "level": "Intermedio · Avanzado",
        "keywords": [
          "Backtesting",
          "Forward Testing",
          "Curve Fitting",
          "DCA",
          "Trading Algorítmico",
          "Python",
          "API Keys"
        ]
      }
    ]
  },
  {
    "number": 6,
    "title": "Finanzas descentralizadas (DeFi), AMMs y yield farming",
    "shortTitle": "DeFi y rendimiento",
    "icon": "fa-solid fa-droplet",
    "summary": "Conoce los AMM, los préstamos algorítmicos, el staking líquido y los riesgos del rendimiento descentralizado.",
    "lessons": [
      {
        "id": "6.1",
        "title": "Protocolos AMM, Pools de Liquidez y Pérdida Impermanente",
        "description": "Creadores de Mercado Automatizados (AMM), fórmula del producto constante (x × y = k), proveeduria de liquidez, tokens LP y matemática de la pérdida impermanente (Impermanent Loss)",
        "objective": "Comprender el funcionamiento interno de Uniswap y la dinámica de riesgo-beneficio al aportar liquidez en DEXs",
        "minutes": 60,
        "level": "Intermedio · Avanzado",
        "keywords": [
          "AMM",
          "Liquidity Pool",
          "Constant Product",
          "LP Token",
          "Impermanent Loss",
          "DEX"
        ]
      },
      {
        "id": "6.2",
        "title": "Préstamos Algorítmicos, Liquidaciones y Yield Farming",
        "description": "Mercados monetarios DeFi (Aave, Compound), sobrecolateralización, Factor de Salud (Health Factor), mecánicas de liquidación automática y estrategias de Yield Farming",
        "objective": "Utilizar protocolos de crédito sin custodia para optimizar el rendimiento del capital bajo parámetros estrictos de riesgo",
        "minutes": 60,
        "level": "Intermedio · Avanzado",
        "keywords": [
          "Overcollateralization",
          "Health Factor",
          "LTV",
          "Liquidation Penalty",
          "Yield Farming",
          "APY vs. APR"
        ]
      },
      {
        "id": "6.3",
        "title": "Liquid Staking, Restaking y Derivados de Rendimiento",
        "description": "Tokens de Staking Líquido (LSTs como stETH), Restaking (EigenLayer), tokens de rendimiento principal/interés (Pendle Finance) y riesgos de composición en cascada",
        "objective": "Analizar la reutilización del colateral en Proof of Stake y evaluar el riesgo de contagio en protocolos de rendimiento avanzado",
        "minutes": 60,
        "level": "Avanzado",
        "keywords": [
          "Liquid Staking",
          "stETH",
          "Restaking",
          "EigenLayer",
          "Pendle Finance",
          "Yield Tokenization"
        ]
      }
    ]
  }
]
