import type { CourseLessonDetail } from './courseTypes'

export const LESSON_DETAILS: Record<string, CourseLessonDetail> = {
  "1.1": {
    "intro": [
      {
        "label": "Presentación",
        "text": "La realidad financiera exige diversificación activa para neutralizar la depreciación del capital y optimizar cargas tributarias."
      },
      {
        "label": "Importancia",
        "text": "La gestión patrimonial y operativa requiere el dominio de los fundamentos macroeconómicos y regulatorios locales."
      },
      {
        "label": "Situación",
        "text": "Un profesionista con salario bruto de $35,000 MXN recibe tras retenciones un neto de $28,350 MXN, que al deducir obligaciones crediticias se reduce a $17,356 MXN de ingreso disponible."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué mantener capital en cuentas de ahorro tradicionales asegura la pérdida sostenida del poder adquisitivo?"
      }
    ],
    "content": [
      {
        "term": "Conceptos macroeconómicos",
        "text": "Inflación (incremento generalizado y sostenido de precios), Deflación (descenso persistente de precios derivado de contracción de demanda), Devaluación (reducción del valor nominal respecto a divisas extranjeras), Estanflación (concurrencia de estancamiento económico, alto desempleo e inflación) e Hiperinflación (alzas inflacionarias superiores al 50% mensual).",
        "points": []
      },
      {
        "term": "Interés Simple vs. Compuesto",
        "text": "El interés simple liquida rendimientos únicamente sobre el capital principal estático. En contraste, el interés compuesto capitaliza los intereses devengados periodo a periodo, provocando un crecimiento de curva exponencial.",
        "points": []
      },
      {
        "term": "Marco tributario e ISR (Art. 152 LISR)",
        "text": "Estructura progresiva de retenciones mensuales mediante tablas fiscales (límite inferior, cuota fija y porcentaje sobre excedente). Detección de discrepancia fiscal ante depósitos en efectivo acumulados superiores a $15,000 MXN o gastos mediante tarjetas que rebasen los ingresos formalmente declarados.",
        "points": []
      },
      {
        "term": "Ley Fintech en México",
        "text": "Marco legal implementado en 2018 para Instituciones de Tecnología Financiera (ITF), distinguiendo Instituciones de Financiamiento Colectivo (Crowdfunding) e Instituciones de Fondos de Pago Electrónico (IFPE), reguladas por la CNBV, Banxico y CONDUSEF.",
        "points": []
      },
      {
        "term": "Seguridad y cumplimiento",
        "text": "Obligatoriedad de normativas KYC (Know Your Customer) para acreditación de identidad y AML (Anti-Money Laundering) para monitoreo transaccional anti-lavado.",
        "points": []
      }
    ],
    "examples": [
      {
        "term": "Proyección de Interés Compuesto",
        "text": "Inversión de $10,000 MXN al 6% anual a 3 años.",
        "points": [
          "Año 1: $10,000 × 0.06 = $600 → Saldo: $10,600 MXN.",
          "Año 2: $10,600 × 0.06 = $636 → Saldo: $11,236 MXN.",
          "Año 3: $11,236 × 0.06 = $674.16 → Saldo acumulado: $11,910.16 MXN (frente a $11,800 MXN bajo régimen simple)."
        ]
      },
      {
        "term": "Cálculo de Retención Fiscal",
        "text": "Sobre un salario base de $35,000 MXN, se aplica una cuota fija de $1,856.84 MXN más la tasa marginal del 21.36% sobre el excedente del límite inferior ($17,466.35 MXN), derivando en una retención impositiva de aproximadamente $5,587 MXN mensuales.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Concepto Clave",
          "Definición Operativa"
        ],
        "rows": [
          [
            "UMA",
            "Unidad de Medida y Actualización utilizada para determinar obligaciones y deducciones fiscales."
          ],
          [
            "SBC",
            "Salario Base de Cotización empleado para calcular cuotas obrero-patronales ante el IMSS."
          ],
          [
            "Saldo Insoluto",
            "Capital de una deuda pendiente de pago sobre el cual se calculan los intereses corrientes."
          ],
          [
            "Sandbox Regulatorio",
            "Espacio de pruebas temporal supervisado por la CNBV para probar modelos Fintech novedosos."
          ]
        ]
      }
    ],
    "activities": [
      "Determina la retención mensual de ISR y el salario neto aplicable para un ingreso bruto mensual de $25,000 MXN empleando la tabla oficial de la LISR.",
      "Construye una comparativa de balance proyectada a 5 años para $20,000 MXN depositados al 4% simple bancario versus un pagaré capitalizable al 10% compuesto.",
      "Accede al registro SIPRES de la CONDUSEF y valida si una plataforma de financiamiento colectivo cuenta con registro y autorización formal ante la CNBV."
    ],
    "summary": [
      "La inflación sostenida y la presión tributaria exigen la colocación estratégica de liquidez en vehículos regulados por la Ley Fintech bajo estructuras de interés compuesto para evitar la pérdida del poder de compra."
    ]
  },
  "1.2": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Las cotizaciones mostradas en las interfaces gráficas son el resultado dinámico del cruce ininterrumpido entre órdenes pasivas y agresivas de compra y venta."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué la ejecución inmediata mediante órdenes a mercado resulta usualmente más costosa que programar posturas límite?"
      }
    ],
    "content": [
      {
        "term": "Mecanismo de Subasta Continua",
        "text": "El precio se forma en la intersección de dos fuerzas: el Bid (oferta de compra más alta disponible) y el Ask (demanda de venta más baja solicitada).",
        "points": []
      },
      {
        "term": "El Spread Financiero",
        "text": "Diferencial directo existente entre el mejor Bid y el mejor Ask. Representa el coste operativo intrínseco de liquidación inmediata.",
        "points": []
      },
      {
        "term": "Participantes y Comisiones (Maker vs. Taker)",
        "text": "",
        "points": [
          {
            "term": "Makers",
            "text": "Introducen liquidez al sistema registrando órdenes límite (Limit) que descansan en el libro. Gozan de comisiones reducidas."
          },
          {
            "term": "Takers",
            "text": "Consumen liquidez instantánea extrayendo órdenes existentes mediante órdenes a mercado (Market), pagando comisiones mayores."
          }
        ]
      },
      {
        "term": "Deslizamiento (Slippage)",
        "text": "Desviación desfavorable entre el precio visual esperado y el precio promedio final ejecutado cuando una orden Market absorbe múltiples estratos de volumen en el libro.",
        "points": []
      }
    ],
    "examples": [
      {
        "term": "Dinámica de Slippage",
        "text": "Se emite una orden de compra Market por 5 BTC. El libro expone:",
        "points": [
          "Nivel 1: 1 BTC a $60,000 USD (mejor Ask).",
          "Nivel 2: 2 BTC a $60,100 USD.",
          "Nivel 3: 2 BTC a $60,300 USD.",
          "Ejecución: (1 × 60,000) + (2 × 60,100) + (2 × 60,300) = $300,800 USD. Precio medio por activo: $60,160 USD (deslizamiento de $160 USD por unidad respecto al mejor precio visible)."
        ]
      }
    ],
    "tables": [
      {
        "header": [
          "Componente",
          "Función en la Microestructura"
        ],
        "rows": [
          [
            "Bid (Verde)",
            "Órdenes pasivas de compra acumuladas a diferentes niveles de soporte."
          ],
          [
            "Ask (Rojo)",
            "Órdenes pasivas de venta situadas en niveles de resistencia inmediata."
          ],
          [
            "Depth Chart",
            "Gráfico de profundidad que representa el volumen acumulado en ambos lados del libro."
          ]
        ]
      }
    ],
    "activities": [
      "Determina el spread porcentual en tiempo real del par BTC/USDT y compáralo con el spread de una criptomoneda secundaria de baja liquidez.",
      "Ingresa una orden de compra Limit por debajo del precio corriente de mercado y verifica su posición pasiva dentro de la profundidad del Order Book.",
      "Calcula en el gráfico de profundidad el volumen exacto de capital requerido para depreciar la cotización de un activo un 1% desde el mejor Bid."
    ],
    "summary": [
      "El dominio del libro de órdenes permite optimizar la ejecución operativa decidiendo cuándo asumir costes mayores de inmediatez (Market) o aportar liquidez con menor comisión (Limit)."
    ]
  },
  "1.3": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Los mercados operan bajo esquemas heterogéneos; algunos transfieren la propiedad real del activo, mientras que otros negocian contratos de cobertura o especulación sobre precios futuros."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿A través de qué mecanismos contractuales es factible generar rentabilidad ante caídas directas en el precio de un activo?"
      }
    ],
    "content": [
      {
        "term": "Taxonomía de Mercados",
        "text": "",
        "points": [
          {
            "term": "Renta Variable (Acciones)",
            "text": "Títulos que representan partes proporcionales del capital social de corporaciones."
          },
          {
            "term": "Renta Fija (Bonos/Deuda)",
            "text": "Instrumentos de deuda con rendimiento y amortización estructurada (ej. CETES a 28, 91, 182 y 364 días)."
          },
          {
            "term": "ETFs (Exchange Traded Funds)",
            "text": "Vehículos de inversión indexados que agrupan carteras de activos cotizando como acciones independientes."
          },
          {
            "term": "Mercado Forex",
            "text": "Mercado interbancario descentralizado de tipos de cambio con operación continua durante las sesiones de Londres, Nueva York, Tokio y Sídney."
          },
          {
            "term": "Commodities",
            "text": "Materias primas estandarizadas de uso industrial, energético y alimentario."
          }
        ]
      },
      {
        "term": "Operativa al Contado (Spot)",
        "text": "Liquidación directa que transfiere la titularidad real del activo subyacente. Exclusivamente admite posiciones alcistas (Long).",
        "points": []
      },
      {
        "term": "Venta en Corto (Short Selling)",
        "text": "Mecanismo donde se toman activos en préstamo del intermediario financiero para venderlos al precio corriente, buscando recomprarlos a menor cotización para liquidar el pasivo y conservar la ganancia neta.",
        "points": []
      },
      {
        "term": "Instrumentos Derivados",
        "text": "Contratos cuyo precio se deriva de un activo base subyacente:",
        "points": [
          {
            "term": "Futuros",
            "text": "Contratos estandarizados con liquidación obligatoria y compensación formal en bolsa."
          },
          {
            "term": "Forwards",
            "text": "Contratos bilaterales no regulados ejecutados extrabursátilmente (Over-the-Counter / OTC)."
          },
          {
            "term": "Swaps",
            "text": "Acuerdos de intercambio financiero de flujos futuros de tasas o divisas."
          },
          {
            "term": "Opciones",
            "text": "Contratos asimétricos (Call para compra, Put para venta) donde el comprador adquiere el derecho abonando una prima sin incurrir en obligación de ejecución."
          },
          {
            "term": "CFDs",
            "text": "Contratos por diferencia que replican el subyacente sin transferir propiedad."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Spot versus Opciones Call",
        "text": "Comprar 1 acción a $180 USD en mercado Spot expone a un riesgo lineal; si la acción cae a $170 USD, la pérdida no realizada es de $10 USD conservando el activo. En una Opción Call sobre el mismo activo con precio de ejercicio de $185 USD y prima de $5 USD, el inversor solo arriesga los $5 USD de la prima si la cotización no supera el umbral de ejercicio al vencimiento.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Segmento de Mercado",
          "Horario Operativo Habitual (Zona Horaria CDMX)"
        ],
        "rows": [
          [
            "Acciones EE.UU. (NYSE/NASDAQ)",
            "Lunes a Viernes de 08:30 a 15:00 horas."
          ],
          [
            "Divisas (Forex)",
            "Domingo 16:00 a Viernes 16:00 horas continuas."
          ],
          [
            "Criptoactivos",
            "Operación global ininterrumpida (24/7/365)."
          ]
        ]
      }
    ],
    "activities": [
      "Clasifica técnicamente en una matriz de Renta Variable, Renta Fija, Commodity o Derivado a: Apple Inc., CETES 28D, Barril de Crudo WTI, Bono del Tesoro de EE.UU. a 10 años, y un Contrato de Futuros de Maíz.",
      "Modela matemáticamente una posición en corto de 100 títulos tomados prestados a $50 USD por acción y recomprados a $42 USD, calculando el rendimiento bruto obtenido.",
      "Analiza la correlación de rendimiento anualizada entre el índice tecnológico global QQQ y las acciones de Microsoft."
    ],
    "summary": [
      "La operativa Spot implica la adquisición directa del activo subyacente, en tanto que los contratos derivados facilitan coberturas y estrategias direccionales complejas mediante apalancamiento y compromisos con vencimiento."
    ]
  },
  "1.4": {
    "intro": [
      {
        "label": "Presentación",
        "text": "El trading comprende diferentes horizontes de inversión temporal; forzar estilos operativos desalineados de la agenda diaria induce fatiga y errores analíticos."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué intentar ejecutar operativas intradiarias mientras se desempeña otra labor profesional suele desencadenar la destrucción sistemática del capital?"
      }
    ],
    "content": [
      {
        "term": "Categorización por Marcos Temporales (Timeframes)",
        "text": "",
        "points": [
          {
            "term": "Scalping",
            "text": "Duración de segundos a minutos. Búsqueda de variaciones mínimas de cotización. Exige baja latencia, spreads nulos y tolerancia a la tensión continua."
          },
          {
            "term": "Day Trading (Intradía)",
            "text": "Apertura y liquidación dentro de la misma sesión bursátil sin mantenimiento de riesgo nocturno (Overnight), evitando desajustes por gaps de apertura."
          },
          {
            "term": "Swing Trading",
            "text": "Mantenimiento posicional durante días o semanas. Análisis centrado en estructuras de ciclo técnico; compatible con responsabilidades laborales al apoyarse en gráficos diarios (1D) o de 4 horas (4H)."
          },
          {
            "term": "Position Trading",
            "text": "Enfoque estratégico de meses a años sustentado en análisis fundamental, macroeconomía y tendencias estructurales."
          }
        ]
      },
      {
        "term": "Principio de Congruencia Operativa",
        "text": "La rentabilidad sistemática no depende de la frecuencia operativa, sino de la disciplina en la gestión y la reducción de fricción psicológica.",
        "points": []
      }
    ],
    "examples": [
      {
        "term": "Alineación Estratégica",
        "text": "Un profesionista con jornada fija de oficina adopta un esquema de Swing Trading analizando gráficos al cierre de la sesión bursátil (16:30 CDMX). Configura órdenes de entrada pasivas con parámetros de protección Stop-Loss y liquidación Take-Profit preestablecidos, eliminando la necesidad de monitoreo intra-sesión.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Estilo Operativo",
          "Temporalidad Gráfica Primaria",
          "Dedicación Diaria Requerida",
          "Exposición a Gaps Nocturnos"
        ],
        "rows": [
          [
            "Scalping",
            "1 min - 5 min",
            "4 a 6 horas (monitoreo pleno)",
            "Nula"
          ],
          [
            "Day Trading",
            "15 min - 1 hora",
            "2 a 4 horas continuas",
            "Nula"
          ],
          [
            "Swing Trading",
            "4 horas - Diario (1D)",
            "30 a 60 minutos",
            "Media"
          ],
          [
            "Position Trading",
            "Semanal (1W) - Mensual",
            "1 a 2 horas semanales",
            "Alta"
          ]
        ]
      }
    ],
    "activities": [
      "Diseña una matriz de disponibilidad temporal semanal personal identificando bloques libres de distracciones para análisis técnico.",
      "Mapea el comportamiento de un activo simultáneamente en marcos de 5 minutos, 1 hora y 1 día, anotando discrepancias en la estructura de tendencia observable.",
      "Redacta un manifiesto personal de trading delimitando el horizonte operativo adoptado, marco temporal base y horarios en los que se prohíbe operar."
    ],
    "summary": [
      "El éxito operativo radica en ajustar la temporalidad de mercado al ritmo y psicología del operador, asegurando una ejecución metódica libre de fricciones de agenda."
    ]
  },
  "2.1": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Las interfaces gráficas condensan las transacciones ejecutadas en periodos específicos; la selección de escala y tipología de gráfico define la claridad estructural del análisis."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Qué distorsiones visuales introduce la escala lineal al analizar activos con incrementos de valor exponenciales a lo largo del tiempo?"
      }
    ],
    "content": [
      {
        "term": "Tipología de Representaciones Gráficas",
        "text": "",
        "points": [
          {
            "term": "Gráficos de Líneas",
            "text": "Reflejan exclusivamente los precios de cierre. Minimizan ruido pero descartan la volatilidad intradiaria."
          },
          {
            "term": "Gráficos de Barras",
            "text": "Proyectan apertura, cierre, máximo y mínimo mediante marcas direccionales."
          },
          {
            "term": "Velas Japonesas (Candlestick)",
            "text": "Representación visual estándar que ilustra el balance emocional entre oferta y demanda en bloques definidos."
          },
          {
            "term": "Heikin Ashi",
            "text": "Gráficos basados en fórmulas de promedio que suavizan fluctuaciones para identificar direcciones predominantes de tendencia."
          },
          {
            "term": "Renko",
            "text": "Cajas basadas puramente en recorridos mínimos de precio, omitiendo la dimensión temporal."
          }
        ]
      },
      {
        "term": "Escalas Gráficas",
        "text": "",
        "points": [
          {
            "term": "Lineal",
            "text": "Asigna distancias idénticas a variaciones nominales equivalentes ($1 a $2 luce igual que $100 a $101)."
          },
          {
            "term": "Logarítmica",
            "text": "Asigna el espaciado gráfico en función del cambio porcentual real. Indispensable para históricos de activos de alta apreciación."
          }
        ]
      },
      {
        "term": "Anatomía OHLC",
        "text": "",
        "points": [
          {
            "term": "Open",
            "text": "Primer intercambio pactado del periodo."
          },
          {
            "term": "High",
            "text": "Nivel superior negociado."
          },
          {
            "term": "Low",
            "text": "Nivel inferior alcanzado."
          },
          {
            "term": "Close",
            "text": "Último precio registrado."
          },
          {
            "term": "Cuerpo",
            "text": "Distancia entre Open y Close."
          },
          {
            "term": "Mechas o Sombras",
            "text": "Extremos donde la liquidez fue rechazada antes del cierre."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Análisis de Absorción en Mechas",
        "text": "Una vela diaria abre a $100 USD, desciende a un mínimo de $85 USD y cierra en $99 USD. La mecha inferior representa un 93% del rango total de la sesión, evidenciando una absorción institucional agresiva de la presión de venta en la base.",
        "points": []
      }
    ],
    "tables": [],
    "activities": [
      "Extrae los cuatro componentes numéricos OHLC exactos de la última vela cerrada en marco semanal de un índice accionario.",
      "Modifica el gráfico histórico a largo plazo de Bitcoin de escala lineal a logarítmica y documenta la diferencia estructural en las fases de consolidación.",
      "Compara una fase lateral en velas japonesas tradicionales contra velas Heikin Ashi, anotando cómo se mitigan los cambios falsos de coloración."
    ],
    "summary": [
      "Las velas japonesas y la correcta parametrización de escalas gráficas aportan el fundamento visual necesario para interpretar el balance entre oferta y demanda en el mercado."
    ]
  },
  "2.2": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Los mercados se desplazan a través de ciclos estructurados por zonas de soporte y resistencia que concentran la liquidez histórica."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué concebir un soporte como una línea exacta suele inducir a una invalidación prematura de la posición por volatilidad transitoria?"
      }
    ],
    "content": [
      {
        "term": "Estructura Dinámica de Tendencias",
        "text": "",
        "points": [
          {
            "term": "Tendencia Alcista",
            "text": "Secuencia estructurada de Máximos más Altos (Higher Highs / HH) y Mínimos más Altos (Higher Lows / HL)."
          },
          {
            "term": "Tendencia Bajista",
            "text": "Secuencia progresiva de Máximos más Bajos (Lower Highs / LH) y Mínimos más Bajos (Lower Lows / LL)."
          },
          {
            "term": "Estructura Lateral (Consolidación)",
            "text": "Oscilación equilibrada del precio dentro de fronteras definidas sin dominancia clara."
          }
        ]
      },
      {
        "term": "Concepción de Zonas vs. Líneas",
        "text": "El soporte y la resistencia deben delimitarse como franjas o zonas de congestión donde confluyen órdenes límite, asumiendo dispersión operativa.",
        "points": []
      },
      {
        "term": "Principio de Cambio de Polaridad (Flip S/R)",
        "text": "Una zona de resistencia perforada de manera concluyente pasa a funcionar como futuro soporte estructural durante las correcciones subsiguientes.",
        "points": []
      },
      {
        "term": "Validación por Volumen",
        "text": "",
        "points": [
          {
            "term": "Ruptura estructural legítima",
            "text": "Acompañada por volumen marcadamente superior a la media de 20 periodos y velas de rango amplio."
          },
          {
            "term": "Falsas Rupturas (Bull/Bear Traps)",
            "text": "Penetración transitoria de una zona con volumen raquítico, seguida por cierres dentro del rango previo."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Validación Cuantitativa de Ruptura",
        "text": "Un activo consolida entre $145 USD y $150 USD durante 40 sesiones. Se produce una vela alcista que cierra en $153 USD, registrando un volumen tres veces superior al promedio móvil. La ruptura se cataloga como válida, previendo continuidad alcista.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Estado Estructural",
          "Comportamiento del Precio",
          "Confirmación por Volumen"
        ],
        "rows": [
          [
            "Tendencia Alcista Sana",
            "Formación continua de HH y HL",
            "Volumen expansivo en impulsos, contractivo en retrocesos"
          ],
          [
            "Tendencia Agotada",
            "Fallo en marcar un nuevo HH",
            "Divergencia bajista de volumen en nuevos máximos"
          ],
          [
            "Falsa Ruptura (Trap)",
            "Rechazo intradiario dejando mecha",
            "Volumen bajo o absorción rápida contraria"
          ]
        ]
      }
    ],
    "activities": [
      "Marca en un gráfico de 4 horas los últimos cuatro puntos estructurales mayores (HH/HL o LH/LL) para definir la dirección técnica formal.",
      "Localiza un ejemplo histórico de cambio de polaridad donde una resistencia previa haya actuado como soporte ante un retroceso.",
      "Audita una falsa ruptura en temporalidad diaria analizando el volumen relativo de la vela que intentó vulnerar el nivel."
    ],
    "summary": [
      "El análisis técnico estructural requiere trazar franjas de liquidez y validar cualquier ruptura mediante el volumen negociado para evitar trampas de mercado."
    ]
  },
  "2.3": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Los inversores institucionales manejan volúmenes de capital de tal escala que su principal limitación es la contrapartida de mercado; sus estrategias se diseñan para captar liquidez dispersa."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué las cotizaciones tienden a perforar soportes consolidados antes de iniciar movimientos alcistas acelerados?"
      }
    ],
    "content": [
      {
        "term": "La Dinámica de Ejecución Institucional",
        "text": "Las entidades no pueden ingresar órdenes masivas de compra a mercado sin distorsionar el precio al alza en su contra. Por ello, requieren inducir ventas masivas en los operadores minoristas.",
        "points": []
      },
      {
        "term": "Piscinas de Liquidez (Liquidity Pools)",
        "text": "Áreas críticas donde se agrupan órdenes de Stop-Loss y órdenes condicionales de ruptura. Habitualmente localizadas por encima de máximos dobles o por debajo de mínimos claros.",
        "points": []
      },
      {
        "term": "Barridos de Liquidez (Liquidity Sweeps)",
        "text": "Incursiones veloces del precio fuera de rangos de equilibrio con el fin de activar los Stop-Loss de los minoristas (que actúan como órdenes de venta forzadas en un soporte), absorbiendo ese volumen de venta para completar sus posiciones compradoras.",
        "points": []
      },
      {
        "term": "Bloques de Órdenes (Order Blocks)",
        "text": "La última vela en sentido contrario previa a una expansión institucional impulsiva. Representa la zona donde se originó el desbalance de órdenes que quebró la estructura.",
        "points": []
      },
      {
        "term": "Lectura de Flujo de Órdenes (Order Flow)",
        "text": "Evaluación del desbalance entre órdenes agresivas en compra y venta a través de herramientas de cinta y volumen delta.",
        "points": []
      }
    ],
    "examples": [
      {
        "term": "Barrido Institucional de Mínimos",
        "text": "Un soporte horizontal acumula órdenes de Stop-Loss por debajo de $2,000 USD. Se observa una vela bajista agresiva que desciende hasta $1,970 USD, activando las liquidaciones minoristas, para luego rebotar rápidamente y cerrar la sesión en $2,040 USD con una mecha inferior pronunciada. Las manos institucionales absorbieron las ventas de pánico como contrapartida barata.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Concepto Institucional",
          "Interpretación Práctica"
        ],
        "rows": [
          [
            "Smart Money",
            "Flujo de capital gestionado por fondos e instituciones que mueve el mercado."
          ],
          [
            "Liquidity Sweep",
            "Caza deliberada de órdenes de parada para proveer contrapartida a órdenes mayores."
          ],
          [
            "Bullish Order Block",
            "Última vela bajista previa a una ruptura alcista que generó un desbalance de oferta."
          ],
          [
            "Imbalance / FVG",
            "Brecha de valor donde el precio se desplazó con tal velocidad que dejó ineficiencias de volumen."
          ]
        ]
      }
    ],
    "activities": [
      "Identifica en un gráfico diario una piscina de liquidez formada por un doble suelo evidente y comprueba si fue barrida posteriormente.",
      "Localiza un Bloque de Órdenes alcista que haya originado una ruptura estructural de máximos y marca su rango de mitigación.",
      "Analiza el volumen en una mecha de absorción para confirmar la presencia de compras institucionales frente a ventas minoristas."
    ],
    "summary": [
      "Comprender la operativa institucional permite dejar de utilizar los soportes tradicionales como puntos de defensa vulnerables y comenzar a interpretar los barridos de liquidez como detonantes de alta probabilidad."
    ]
  },
  "3.1": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Las formaciones de velas reflejan la pugna continua por el control de la cotización; su fiabilidad depende de la confluencia con niveles estructurales clave."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué un patrón de giro carece de valor técnico si se produce en zonas intermedias sin soporte o resistencia previo?"
      }
    ],
    "content": [
      {
        "term": "Patrones de Reversión Alcista",
        "text": "",
        "points": [
          {
            "term": "Martillo (Hammer) y Martillo Invertido",
            "text": "Cuerpos estrechos en el extremo superior con mecha inferior extensa (rechazo a la baja en soportes)."
          },
          {
            "term": "Envolvente Alcista (Bullish Engulfing)",
            "text": "Vela verde de cuerpo amplio que cubre íntegramente el cuerpo de la vela bajista previa."
          },
          {
            "term": "Pauta Penetrante (Piercing Line)",
            "text": "Apertura con gap bajista y cierre por encima del 50% del cuerpo de la vela previa."
          },
          {
            "term": "Estrella de la Mañana (Morning Star)",
            "text": "Estructura tripartita constituida por vela bajista expansiva, cuerpo de indecisión intermedio y vela alcista de confirmación."
          },
          {
            "term": "Tres Soldados Blancos",
            "text": "Tres velas verdes consecutivas de cuerpo regular con mechas reducidas."
          }
        ]
      },
      {
        "term": "Patrones de Reversión Bajista",
        "text": "",
        "points": [
          {
            "term": "Hombre Colgado (Hanging Man) y Estrella Fugaz (Shooting Star)",
            "text": "Señales de agotamiento comprador en techos de mercado."
          },
          {
            "term": "Envolvente Bajista (Bearish Engulfing)",
            "text": "Vela bajista expansiva que engulle el cuerpo de la vela compradora anterior."
          },
          {
            "term": "Cubierta de Nube Oscura (Dark Cloud Cover)",
            "text": "Apertura con gap alcista y penetración bajista por debajo del ecuador de la vela previa."
          },
          {
            "term": "Estrella del Atardecer (Evening Star)",
            "text": "Formación bajista de tres fases en zonas de resistencia."
          },
          {
            "term": "Tres Cuervos Negros",
            "text": "Tres sesiones bajistas consistentes denotando capitulación compradora."
          }
        ]
      },
      {
        "term": "Patrones de Indecisión y Dominio",
        "text": "",
        "points": [
          {
            "term": "Doji",
            "text": "Precios de apertura y cierre prácticamente idénticos (equilibrio de fuerzas)."
          },
          {
            "term": "Trompos (Spinning Tops)",
            "text": "Cuerpos pequeños con mechas simétricas."
          },
          {
            "term": "Marubozu",
            "text": "Vela de rango amplio carente de mechas, representativa de control absoluto unidireccional."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Validación de Estrella de la Mañana",
        "text": "En un soporte diario se forma una vela roja amplia, seguida de un Doji de volumen contractivo, sucedida al día siguiente por una vela verde que cierra por encima del 60% del rango de la primera vela. La confirmación del giro se valida al confluir con el soporte.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Patrón",
          "Formación",
          "Implicación Técnica"
        ],
        "rows": [
          [
            "Martillo",
            "1 vela",
            "Señal de rechazo bajista en soportes."
          ],
          [
            "Envolvente Alcista",
            "2 velas",
            "Desbalance agresivo en favor de la demanda."
          ],
          [
            "Estrella de la Mañana",
            "3 velas",
            "Agotamiento de ventas y transición compradora estructurada."
          ],
          [
            "Marubozu",
            "1 vela",
            "Continuidad y fortaleza direccional sin oposición."
          ]
        ]
      }
    ],
    "activities": [
      "Localiza en temporalidad de 4 horas una formación Envolvente Bajista y verifica si se originó en una zona de resistencia relevante.",
      "Documenta un caso donde un patrón Martillo haya fallado por presentarse dentro de una tendencia bajista fuerte sin soporte.",
      "Analiza la respuesta del volumen transaccional en la formación de un patrón de Estrella del Atardecer."
    ],
    "summary": [
      "Los patrones de velas sintetizan el balance de poder entre la oferta y la demanda; su correcta interpretación exige evaluarlos siempre en confluencia con zonas estructurales clave."
    ]
  },
  "3.2": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Las medias móviles suavizan las series temporales de precios para exponer la tendencia subyacente; cada variante matemática pondera los datos recientes de forma distinta."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué la media móvil simple introduce un desfase temporal (lag) que retrasa la toma de decisiones en comparación con medias ponderadas?"
      }
    ],
    "content": [
      {
        "term": "Naturaleza del Retraso Matemático (Lag)",
        "text": "Al derivarse de observaciones históricas pasadas, cualquier media exhibirá una latencia intrínseca frente al precio spot.",
        "points": []
      },
      {
        "term": "Modelos Base",
        "text": "",
        "points": [
          {
            "term": "Media Móvil Simple (SMA)",
            "text": "Promedio aritmético no ponderado de N periodos: SMA = (Suma de Cierres de 1 a N) / N Pondera con igual peso la cotización de hace 20 periodos que la actual."
          },
          {
            "term": "Media Móvil Exponencial (EMA)",
            "text": "Asigna mayor ponderación a los precios más recientes aplicando un multiplicador: α = 2 / (N + 1) EMA_t = (Cierre_t × α) + (EMA_{t-1} × (1 - α))"
          }
        ]
      },
      {
        "term": "Jerarquía de Velocidad",
        "text": "SMMA → SMA → EMA → LWMA → DEMA → TEMA",
        "points": [
          {
            "term": "DEMA / TEMA",
            "text": "Algoritmos que combinan múltiples EMAs para cancelar matemáticamente el desfase temporal, optimizados para operativas intradía."
          }
        ]
      },
      {
        "term": "Ecosistema Ichimoku Kinko Hyo",
        "text": "",
        "points": [
          {
            "term": "",
            "text": "Compuesto por el Tenkan Sen (conversión, 9 periodos), Kijun Sen (línea base, 26 periodos), Chikou Span (cierre desplazado hacia atrás 26 periodos) y la Nube (Kumo) formada por Senkou Span A y B proyectadas 26 periodos hacia el futuro."
          },
          {
            "term": "",
            "text": "El posicionamiento relativo de la cotización respecto a la nube define el sesgo direccional del activo."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Cálculo de una SMA y EMA de 5 periodos",
        "text": "Precios de cierre: $10, $11, $12, $11, $14 USD.",
        "points": [
          "SMA = (10 + 11 + 12 + 11 + 14) / 5 = 58 / 5 = $11.60 USD.",
          "Para el siguiente día con cierre en $15 USD: Factor α = 2 / (5 + 1) = 0.3333.",
          "EMA = (15 - 11.60) × 0.3333 + 11.60 = 1.13 + 11.60 = $12.73 USD.",
          "La EMA refleja de inmediato el impacto del repunte de precios."
        ]
      }
    ],
    "tables": [
      {
        "header": [
          "Indicador",
          "Reactividad",
          "Uso Operativo Recomendado"
        ],
        "rows": [
          [
            "SMA 200",
            "Lenta",
            "Filtro institucional para determinar la tendencia de fondo a largo plazo."
          ],
          [
            "EMA 21",
            "Dinámica",
            "Soporte dinámico y seguimiento de aceleración tendencial en Swing."
          ],
          [
            "DEMA 9",
            "Ultra-reactiva",
            "Gatillo de entrada para Scalping reduciendo el retraso de la señal."
          ],
          [
            "Kumo (Ichimoku)",
            "Contextual",
            "Delimitador de zonas de soporte y resistencia proyectadas hacia el futuro."
          ]
        ]
      }
    ],
    "activities": [
      "Calcula a mano la SMA de 5 días de una acción y obtén la EMA subsiguiente tras el ingreso de un nuevo cierre.",
      "Configura simultáneamente en una gráfica de 15 minutos una SMA 50 y una DEMA 50, contrastando la velocidad de adaptación ante un giro rápido de precios.",
      "Interpreta el estado de tendencia de un activo mediante la posición del precio con respecto a la Nube Kumo de Ichimoku."
    ],
    "summary": [
      "Las medias lentas actúan como filtros macroeconómicos de dirección, mientras que las medias ponderadas y sistemas como Ichimoku permiten definir soportes dinámicos y momentos precisos de entrada."
    ]
  },
  "3.3": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Las medias móviles reflejan la dirección tendencial, mientras que los osciladores y bandas estadísticas cuantifican la fuerza del impulso y la compresión de volatilidad."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué abrir posiciones cortas únicamente porque el RSI se ubica en 'sobrecompra' puede resultar perjudicial en tendencias fuertes?"
      }
    ],
    "content": [
      {
        "term": "Métricas de Momentum (Aceleración)",
        "text": "",
        "points": [
          {
            "term": "RSI (Relative Strength Index)",
            "text": "Oscilador normalizado de 0 a 100 que mide la velocidad del cambio en los precios. Rangos estándar: Sobrecompra (>70), Sobreventa (<30)."
          },
          {
            "term": "Dinámica de Tendencia Fuerte",
            "text": "En mercados tendenciales firmes, el RSI puede oscilar sostenidamente en niveles de sobrecompra o sobreventa sin que se produzca una reversión inmediata."
          },
          {
            "term": "Divergencias Estructurales",
            "text": "Ocurren cuando la acción del precio marca un máximo superior pero el oscilador registra un pico menor, advirtiendo un debilitamiento en el impulso."
          },
          {
            "term": "MACD (Moving Average Convergence Divergence)",
            "text": "Diferencia entre las medias exponenciales de 12 y 26 periodos evaluada frente a una línea de señal de 9 periodos."
          },
          {
            "term": "Estocástico KDJ",
            "text": "Compara el precio de cierre respecto al rango máximo-mínimo de un periodo definido para afinar puntos de giro."
          }
        ]
      },
      {
        "term": "Modelos de Volatilidad y Desviación",
        "text": "",
        "points": [
          {
            "term": "Bandas de Bollinger",
            "text": "Compuestas por una media central (SMA 20) y dos bandas exteriores situadas a ± 2 Desviaciones Estándar (σ)."
          },
          {
            "term": "Compresión (The Squeeze)",
            "text": "Fase de contracción acentuada de las bandas indicativa de volatilidad mínima que precede a expansiones pronunciadas de precios."
          }
        ]
      },
      {
        "term": "Fuerza Tendencial con ADX (Average Directional Index)",
        "text": "",
        "points": [
          {
            "term": "",
            "text": "Cuantifica la intensidad de la tendencia independientemente de si es alcista o bajista. Valores de ADX inferiores a 20 indican lateralidad; lecturas superiores a 25 confirman una tendencia activa."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Confluencia Técnica Cuantitativa",
        "text": "Un activo toca la Banda inferior de Bollinger tras una contracción prolongada, el RSI genera una divergencia alcista saliendo de la zona de 26, y el ADX supera el umbral de 25. La interacción conjunta de volatilidad contenida e impulso validado respalda una entrada de alta probabilidad.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Categoría",
          "Indicador",
          "Parámetros Estándar",
          "Función Principal"
        ],
        "rows": [
          [
            "Momentum",
            "RSI",
            "14 periodos",
            "Detección de agotamient divergencias.o y"
          ],
          [
            "Seguimiento",
            "MACD",
            "12, 26, 9",
            "Cruces direccionales de convergencia y divergencia."
          ],
          [
            "Volatilidad",
            "Bollinger",
            "20 periodos, 2σ",
            "Medición de dispersión y compresión del rango deprecios."
          ],
          [
            "Fuerza",
            "ADX",
            "14 periodos",
            "Calificación de la intensid tendencial (umbral 25).ad"
          ]
        ]
      }
    ],
    "activities": [
      "Localiza una divergencia bajista formal entre el precio y el oscilador RSI en marco temporal diario y analiza el comportamiento posterior del mercado.",
      "Identifica en el gráfico un periodo de compresión (Squeeze) en las Bandas de Bollinger y cuantifica el porcentaje del movimiento que le siguió.",
      "Emplea el ADX para filtrar y descartar activos que se encuentren en fases de consolidación lateral sin tendencia definida."
    ],
    "summary": [
      "Los osciladores cuantifican el impulso y las Bandas de Bollinger miden la volatilidad; deben emplearse de forma complementaria evitando saturar el gráfico con herramientas redundantes."
    ]
  },
  "3.4": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Las dinámicas de masas en los mercados financieros reproducen secuencias geométricas armónicas vinculadas a la proporción áurea y estructuras fractales repetitivas."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué los retrocesos del 61.8% de Fibonacci concentran una alta confluencia de órdenes en sistemas algorítmicos?"
      }
    ],
    "content": [
      {
        "term": "Fundamento Matemático de Fibonacci",
        "text": "Sucesión recurrente (0, 1, 1, 2, 3, 5, 8, 13, 21...) donde el cociente asintótico entre términos consecutivos converge en Φ ≈ 1.618, y su inverso en 0.618 (61.8%).",
        "points": []
      },
      {
        "term": "Aplicación en el Mercado",
        "text": "",
        "points": [
          {
            "term": "Retrocesos de Fibonacci",
            "text": "Evalúan la magnitud técnica de una corrección frente al impulso previo. Zonas de control: 23.6%, 38.2%, 50.0% (retroceso medio de Dow), 61.8% (Golden Pocket) y 78.6%."
          },
          {
            "term": "Extensiones de Fibonacci",
            "text": "Determinan proyecciones de toma de utilidades tras la superación de los máximos previos (niveles 100%, 127.2%, 161.8%)."
          }
        ]
      },
      {
        "term": "Teoría Fractal de Ondas de Elliott",
        "text": "",
        "points": [
          {
            "term": "Estructura básica de ciclo",
            "text": "Compuesta por 8 ondas divididas en una fase impulsiva de 5 ondas ($1, 2, 3, 4, 5$) a favor de la tendencia principal y una fase correctiva de 3 ondas ($a, b, c$)."
          },
          {
            "term": "Las Tres Reglas Cardinales de Elliott",
            "text": "i. La Onda 2 nunca puede retroceder más allá del 100% del origen de la Onda 1. ii. La Onda 3 no puede ser la más corta entre las ondas de impulso (1, 3 y 5). iii. La Onda 4 jamás puede solapar el territorio de precios del máximo de la Onda 1."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Confluencia Técnica Elliott-Fibonacci",
        "text": "Un impulso inicial (Onda 1) avanza desde $100 USD hasta $200 USD. La corrección posterior (Onda 2) desciende hasta $138.20 USD, frenándose en el ratio del 61.8% de Fibonacci sin perforar el origen de $100 USD. Se valida la estructura técnica, proyectando el inicio de una Onda 3 hacia extensiones superiores.",
        "points": []
      }
    ],
    "tables": [],
    "activities": [
      "Aplica la herramienta de retrocesos de Fibonacci desde el mínimo hasta el máximo del último impulso semanal de un activo y marca la zona del 61.8%.",
      "Proyecta la extensión 161.8% de un ciclo alcista confirmado para fijar un objetivo estructurado de Take-Profit.",
      "Audita un conteo de ondas de Elliott en marco de 4 horas y valida el cumplimiento estricto de las 3 reglas cardinales de invalidación."
    ],
    "summary": [
      "Fibonacci define la profundidad de las correcciones y las metas de extensión, mientras que el modelo de ondas de Elliott aporta un marco estructural para mapear la evolución de los ciclos del mercado."
    ]
  },
  "4.1": {
    "intro": [
      {
        "label": "Presentación",
        "text": "La tecnología blockchain elimina intermediarios al apoyarse en funciones matemáticas criptográficas y estructuras de datos descentralizadas e inmutables."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué la modificación de un único carácter dentro de un bloque invalida de forma inmediata toda la cadena matemática subsiguiente?"
      }
    ],
    "content": [
      {
        "term": "Funciones Criptográficas Hash",
        "text": "Algoritmos unidireccionales determinísticos que convierten un conjunto de datos en una cadena de tamaño fijo (ej. SHA-256 genera salidas de 256 bits representadas en 64 caracteres hexadecimales).",
        "points": [
          {
            "term": "Propiedades esenciales",
            "text": "Determinismo matemático, irreversibilidad (computacionalmente inviable de descifrar hacia atrás), resistencia a colisiones y Efecto Avalancha (una variación marginal altera la salida completa)."
          },
          {
            "term": "Hashes comunes",
            "text": "Doble SHA-256 (Bitcoin), Keccak-256 (Ethereum), Blake2b (Polkadot/Cardano)."
          }
        ]
      },
      {
        "term": "Estructura Interna del Bloque",
        "text": "Cada bloque integra el hash del bloque previo, timestamp, nonce, y la raíz del árbol de Merkle (Merkle Root), que compacta y valida criptográficamente todas las transacciones del bloque.",
        "points": []
      },
      {
        "term": "Criptografía Asimétrica (ECDSA)",
        "text": "",
        "points": [
          {
            "term": "Clave Privada",
            "text": "Número aleatorio maestro de 256 bits que confiere soberanía de gasto y firma transacciones."
          },
          {
            "term": "Clave Pública y Dirección",
            "text": "Derivadas matemáticamente de la clave privada mediante curvas elípticas unidireccionales."
          }
        ]
      },
      {
        "term": "Custodia y Estándar BIP-39",
        "text": "",
        "points": [
          {
            "term": "",
            "text": "Estructuración mnemónica de la semilla criptográfica mediante listas normalizadas de 12 a 24 palabras."
          },
          {
            "term": "Carteras Calientes (Hot Wallets)",
            "text": "Software conectado a internet con exposición a vectores de ataque web y malware."
          },
          {
            "term": "Carteras Frías (Cold Wallets / Hardware Wallets)",
            "text": "Dispositivos físicos de almacenamiento que aíslan las claves privadas de entornos conectados a la red."
          },
          {
            "term": "Principio de Custodia",
            "text": "\"Not your keys, not your coins\". El almacenamiento en custodios centralizados convierte al usuario en acreedor quirografario de la entidad."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Demostración de Efecto Avalancha con SHA-256",
        "text": "",
        "points": [
          "Entrada: Nexus2026",
          "Hash: 5f81c9...3e41",
          "Entrada modificada: nexus2026",
          "Hash resultante: b40f22...9a12",
          "La discrepancia en una sola letra transforma la huella criptográfica de manera integral, imposibilitando la alteración encubierta de registros contables."
        ]
      }
    ],
    "tables": [
      {
        "header": [
          "Vector de Riesgo",
          "Hot Wallet",
          "Cold Wallet"
        ],
        "rows": [
          [
            "Exposición a Phishing web",
            "Alta",
            "Nula (requiere confirmación física en dispositivo)"
          ],
          [
            "Vulnerabilidad a Malware",
            "Alta",
            "Nula para las claves privadas"
          ],
          [
            "Accesibilidad para Trading rápido",
            "Inmediata",
            "Media (requiere conexión y firma física)"
          ],
          [
            "Recuperación de Fondos",
            "Vía Frase Semilla BIP-39",
            "Vía Frase Semilla BIP-39 aislada de internet"
          ]
        ]
      }
    ],
    "activities": [
      "Utiliza un generador de funciones criptográficas SHA-256 para documentar cómo un cambio en un espacio o signo de puntuación altera por completo el hash de salida.",
      "Rastrea una transacción en un explorador público de bloques (ej. Etherscan o Mempool.space) e identifica su Merkle Root y número de confirmaciones.",
      "Ejecuta un simulacro de respaldo de una billetera de pruebas mediante el estándar BIP-39, anotando la secuencia mnemónica de 12 palabras en un medio físico fuera de línea."
    ],
    "summary": [
      "La solidez de blockchain se sustenta en la criptografía asimétrica y el encadenamiento por funciones hash; la seguridad operativa depende del resguardo fuera de línea de las claves privadas."
    ]
  },
  "4.2": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Los sistemas distribuidos resuelven la coordinación entre nodos no confiables mediante protocolos de consenso que alinean incentivos económicos y castigos computacionales."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿De qué manera blockchain resuelve el problema del doble gasto sin recurrir a una entidad rectora centralizada?"
      }
    ],
    "content": [
      {
        "term": "El Problema del Doble Gasto (Double Spending)",
        "text": "Consiste en la posibilidad de reproducir transacciones digitales idénticas en dos destinos simultáneos. Se neutraliza mediante el ordenamiento cronológico e inmutable de bloques cerrados por consenso.",
        "points": []
      },
      {
        "term": "Arquitecturas de Consenso Principales",
        "text": "",
        "points": [
          {
            "term": "Proof of Work (PoW)",
            "text": "Empleado en Bitcoin. Competencia computacional de hardware especializado (ASICs) resolviendo retos de hashing criptográfico. El minero que genera una prueba válida propone el siguiente bloque y recibe la recompensa de bloque (Block Reward) más las comisiones. Alta descentralización y seguridad física a costa de alto consumo de energía."
          },
          {
            "term": "Proof of Stake (PoS)",
            "text": "Implementado en redes como Ethereum y Cardano. Los validadores bloquean capital nativo en garantía (Staking). Intentos de validación maliciosa o periodos prolongados de desconexión conllevan la destrucción punitiva de los fondos en custodia (Slashing). Ahorro energético del 99.9%."
          },
          {
            "term": "Delegated Proof of Stake (DPoS)",
            "text": "Elección democrática de un comité acotado de validadores de alto rendimiento (EOS, TRON)."
          },
          {
            "term": "Proof of Authority (PoA)",
            "text": "Consenso corporativo basado en validadores identificados de forma legal."
          },
          {
            "term": "Proof of History (PoH)",
            "text": "Secuenciación temporal de alta velocidad empleada por Solana para acelerar el procesamiento de transacciones."
          }
        ]
      },
      {
        "term": "Criptoeconomía de Bitcoin",
        "text": "",
        "points": [
          {
            "term": "Límite de Emisión",
            "text": "Máximo inmutable de 21,000,000 BTC."
          },
          {
            "term": "El Mecanismo de Halving",
            "text": "Reducción al 50% de la recompensa de minería cada 210,000 bloques (~4 años)."
          },
          {
            "term": "Defensa frente al Ataque del 51%",
            "text": "Alterar los registros históricos de Bitcoin requeriría aglutinar más de la mitad del cómputo mundial de la red, erigiendo una barrera económica de miles de millones de dólares en hardware y energía."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Evolución del Halving de Bitcoin",
        "text": "",
        "points": [
          "Bloque Génesis (2009): 50 BTC por bloque emitido.",
          "1.er Halving (2012): 25 BTC.",
          "2.º Halving (2016): 12.5 BTC.",
          "3.er Halving (2020): 6.25 BTC.",
          "4.º Halving (2024): 3.125 BTC.",
          "La reducción paulatina de la oferta nueva disponible contrasta con la expansión de la base de usuarios global."
        ]
      }
    ],
    "tables": [
      {
        "header": [
          "Modelo de Consenso",
          "Recurso Empleado",
          "Mecanismo de Penalización",
          "Nivel de Descentralización"
        ],
        "rows": [
          [
            "Proof of Work",
            "Gasto energético y hardware (ASIC)",
            "Pérdida de energía consumida sin recompensa",
            "Muy Alto"
          ],
          [
            "Proof of Stake",
            "Capital bloqueado en Staking",
            "Slashing (destrucción de fondos en depósito)",
            "Alto"
          ],
          [
            "Delegated PoS",
            "Votación por reputación",
            "Pérdida del estatus de validador activo",
            "Medio"
          ],
          [
            "Proof of Authority",
            "Identidad legal y reputación",
            "Pérdida de credenciales y litigio corporativo",
            "Bajo (Permisionado)"
          ]
        ]
      }
    ],
    "activities": [
      "Consulta un explorador de Bitcoin y analiza la recompensa por bloque más las comisiones acumuladas del último bloque verificado por la red.",
      "Modela matemáticamente una penalización por Slashing en la red Ethereum, deduciendo el porcentaje liquidado a un validador que firme dos bloques contradictorios.",
      "Traza una línea temporal que correlacione las fechas de los cuatro Halvings históricos con el comportamiento posterior del mercado."
    ],
    "summary": [
      "Los algoritmos de consenso resuelven el problema del doble gasto alineando incentivos económicos y penalizaciones, logrando que el cumplimiento honesto de las reglas resulte más rentable que vulnerar la red."
    ]
  },
  "4.3": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Ethereum amplió el modelo de blockchain al incorporar computación descentralizada de estado global (Ethereum Virtual Machine / EVM), permitiendo la ejecución de contratos inteligentes determinísticos."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Cómo operan los bots de búsqueda que analizan la sala de espera (Mempool) para beneficiarse de transacciones pendientes en exchanges descentralizados?"
      }
    ],
    "content": [
      {
        "term": "La Pila de 5 Capas de la Infraestructura Blockchain",
        "text": "a. Capa de Datos: Estructura de bloques, registros de transacciones, hashes y árboles de Merkle. b. Capa de Red: Comunicación peer-to-peer (P2P), enrutamiento y sincronización entre nodos. c. Capa de Consenso: Reglas operativas y algoritmos de acuerdo (PoW, PoS). d. Capa de Incentivos: Emisión de recompensas y estructura de cobro de tarifas de red. e. Capa de Aplicación: Contratos inteligentes, dApps, interfaces de billeteras y protocolos DeFi.",
        "points": []
      },
      {
        "term": "Smart Contracts y la EVM",
        "text": "",
        "points": [
          {
            "term": "",
            "text": "Códigos inmutables almacenados en la blockchain que se ejecutan automáticamente cuando se satisfacen parámetros lógicos específicos (\"Si X ocurre, ejecutar Y\")."
          },
          {
            "term": "",
            "text": "Entorno de computación turing-completo que ejecuta instrucciones operativas homogéneamente en miles de nodos."
          }
        ]
      },
      {
        "term": "Mecánica del Gas y la Mempool",
        "text": "",
        "points": [
          {
            "term": "",
            "text": "El Gas mide el esfuerzo computacional requerido para procesar transacciones en la red."
          },
          {
            "term": "",
            "text": "Su cobro evita bucles infinitos accidentales o ataques de saturación que busquen colapsar los validadores."
          },
          {
            "term": "Mempool",
            "text": "Zona de almacenamiento temporal pública donde las transacciones firmadas aguardan a ser incluidas en un bloque por los validadores."
          }
        ]
      },
      {
        "term": "Dinámica del MEV (Maximal Extractable Value)",
        "text": "",
        "points": [
          {
            "term": "",
            "text": "Ganancia que validadores o bots especializados extraen reorganizando, anteponiendo o insertando transacciones dentro del bloque que se minará."
          },
          {
            "term": "Front-running",
            "text": "Un bot detecta una compra relevante en la Mempool y emite una orden idéntica con mayor tarifa de Gas para ejecutarse primero y vender más caro."
          },
          {
            "term": "Sandwich Attack",
            "text": "Un bot sitúa una orden de compra antes y una de venta inmediatamente después de la orden del usuario, capturando el deslizamiento autorizado."
          },
          {
            "term": "Estrategias de Mitigación",
            "text": "Reducir la tolerancia de deslizamiento (Slippage Tolerance <0.5%) y utilizar nodos RPC privados con blindaje anti-MEV."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Mecánica de un Ataque Sándwich",
        "text": "Un operador intercambia 10 ETH en Uniswap aceptando un margen de deslizamiento del 3%. Un bot en la Mempool detecta la orden, emite una compra previa con Gas prioritario elevando la cotización del token, permite la ejecución de la orden del usuario al precio más desfavorable de su tolerancia, e inserta de inmediato una venta masiva en el mismo bloque, quedándose con la diferencia.",
        "points": []
      }
    ],
    "tables": [],
    "activities": [
      "Consulta herramientas como Etherscan Gas Tracker y calcula la diferencia de comisiones entre una transferencia simple y la interacción con un contrato de préstamo.",
      "Utiliza un visualizador de la Mempool pública para identificar transacciones pendientes ordenadas por la tarifa de Gas asignada.",
      "Configura en un exchange descentralizado el umbral de deslizamiento (Slippage) al 0.2% para evaluar cómo previene ataques de sándwich."
    ],
    "summary": [
      "Los contratos inteligentes ejecutan lógica inmutable respaldada por el cobro de Gas; monitorear la exposición en la Mempool resulta clave para proteger transacciones frente a bots de MEV."
    ]
  },
  "4.4": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Las blockchains principales aseguran altos niveles de seguridad y descentralización pero experimentan cuellos de botella de escalabilidad; el enfoque multicapa resuelve esta restricción mediante procesamiento fuera de la cadena principal."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué un Rollup de Capa 2 puede liquidar transacciones con comisiones reducidas conservando la seguridad final de la Capa 1?"
      }
    ],
    "content": [
      {
        "term": "El Trilema de Blockchain",
        "text": "Formulado por Vitalik Buterin, plantea que una red descentralizada solo puede optimizar al máximo dos de tres propiedades críticas: Seguridad, Descentralización y Escalabilidad.",
        "points": []
      },
      {
        "term": "Jerarquía Multicapa",
        "text": "",
        "points": [
          {
            "term": "Capa 1 (L1)",
            "text": "Red base de liquidación y consenso definitivo (Bitcoin, Ethereum principal)."
          },
          {
            "term": "Capa 2 (L2)",
            "text": "Protocolos que computan cientos de transacciones fuera de la cadena principal (off-chain), las empaquetan en un lote comprimido y devuelven una prueba criptográfica a la L1."
          }
        ]
      },
      {
        "term": "Tecnologías de Rollups",
        "text": "",
        "points": [
          {
            "term": "Rollups Optimistas (Arbitrum, Optimism, Base)",
            "text": "Asumen la validez de las operaciones por defecto y establecen una ventana de disputa (usualmente de 7 días) mediante pruebas de fraude (Fraud Proofs)."
          },
          {
            "term": "ZK-Rollups (zkSync, Starknet, Scroll)",
            "text": "Emplean pruebas criptográficas de conocimiento cero (Zero-Knowledge Proofs) que validan la legitimidad del lote de forma instantánea y determinística."
          },
          {
            "term": "Capa 3 (L3)",
            "text": "Capas de ultra-especialización construidas sobre L2 para aplicaciones de alto rendimiento (gaming, derivados)."
          }
        ]
      },
      {
        "term": "Interoperabilidad y Puentes (Bridges)",
        "text": "Protocolos que permiten migrar activos bloqueando el colateral en la red de origen y emitiendo representaciones envueltas (Wrapped Tokens) en el destino. Constituyen uno de los principales vectores de ataques y exploits.",
        "points": []
      },
      {
        "term": "Abstracción de Cuentas (Estándar ERC-4337)",
        "text": "Sustituye las cuentas de propiedad externa tradicionales (EOA dependientes de frases semilla) por billeteras gestionadas por contratos inteligentes (Smart Accounts), habilitando recuperación social, pago de Gas en stablecoins y ejecución por lotes.",
        "points": []
      }
    ],
    "examples": [
      {
        "term": "Analogía de Transporte y Compresión",
        "text": "Un envío directo en la Capa 1 equivale a un vehículo individual pagando la tarifa completa de una caseta de peaje. Un Rollup de Capa 2 actúa como un autobús que agrupa a 500 pasajeros; el autobús abona el peaje unificado en la Capa 1 y prorratea el coste total entre los 500 usuarios, reduciendo la tarifa a centavos.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Característica",
          "Capa 1 (L1 - Ethereum)",
          "Rollup Optimista (L2)",
          "ZK-Rollup (L2)"
        ],
        "rows": [
          [
            "Tiempo de Retiro a L1",
            "Instantáneo",
            "7 días (Periodo de desafío)",
            "Minutos (Validación de p ZK)rueba"
          ],
          [
            "Coste Computacional",
            "Elevado",
            "Reducido",
            "Mínimo"
          ],
          [
            "Nivel de Seguridad",
            "Primitivo de la red base",
            "Heredado de L1",
            "Heredado de L1 mediante ZKpruebas"
          ]
        ]
      }
    ],
    "activities": [
      "Consulta el portal L2Fees.info y elabora una tabla comparativa de los costes de transferencia en Ethereum versus redes Arbitrum y zkSync.",
      "Mapea el flujo técnico de un puente analizando el contrato que retiene y bloquea los fondos en L1 para la emisión del activo envuelto en L2.",
      "Investiga una billetera basada en ERC-4337 (ej. Biconomy o Safe) y documenta cómo implementa la recuperación social de accesos."
    ],
    "summary": [
      "Las soluciones de Capa 2 escalan el rendimiento transaccional heredando la seguridad de la Capa 1, en tanto que la Abstracción de Cuentas flexibiliza la gestión de billeteras para el usuario."
    ]
  },
  "4.5": {
    "intro": [
      {
        "label": "Presentación",
        "text": "La convergencia entre blockchain y las finanzas tradicionales se consolida mediante la tokenización de Activos del Mundo Real (Real World Assets / RWA) y el análisis de métricas on-chain."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Cómo habilita la infraestructura blockchain la inversión fraccionada en bienes inmuebles o deuda soberana reduciendo los intermediarios notariales tradicionales?"
      }
    ],
    "content": [
      {
        "term": "Tokenización de Activos Reales (RWA)",
        "text": "",
        "points": [
          {
            "term": "",
            "text": "Representación digital de derechos económicos sobre activos tangibles o financieros tradicionales (bienes raíces, bonos del tesoro, obras de arte) sobre raíles blockchain."
          },
          {
            "term": "Beneficios",
            "text": "Liquidación acelerada, fraccionamiento de capital, automatización de dividendos e interoperabilidad financiera global."
          },
          {
            "term": "Protocolos y plataformas del sector",
            "text": "Securitize, Tokeny, Brickken, Zoniqx, Ondo Finance."
          }
        ]
      },
      {
        "term": "Fundamentos de Tokenomics",
        "text": "",
        "points": [
          {
            "term": "Suministro Circulante (Circulating Supply) vs. Suministro Total/Máximo",
            "text": "Proporción de tokens disponibles en mercado abierto versus la emisión final programada."
          },
          {
            "term": "Mecanismos de Quema (Burn)",
            "text": "Retiro definitivo de unidades para reducir la oferta circulante."
          },
          {
            "term": "Calendarios de Desbloqueo (Vesting)",
            "text": "Liberación escalonada de tokens asignados al equipo e inversores iniciales; desbloqueos masivos suelen introducir presión de venta."
          }
        ]
      },
      {
        "term": "Los 4 Filtros de Seguridad Fundamental",
        "text": "a. Capitalización de Mercado: Filtrar proyectos con valoraciones líquidas superiores a $200M USD para mitigar manipulación. b. Whitepaper y Propuesta Técnica: Diagnóstico claro de la arquitectura y viabilidad económica del producto. c. Equipo Gestor: Desarrolladores identificados de trayectoria verificable y código de contratos públicos. d. Política de Emisión: Reglas monetarias claras que prohíban la acuñación arbitraria de nuevos tokens.",
        "points": []
      },
      {
        "term": "Métricas On-Chain y Ciclos de Mercado",
        "text": "",
        "points": [
          {
            "term": "Altcoin Season Index (ASI)",
            "text": "Mide el porcentaje de las 50 principales altcoins que superan el rendimiento de Bitcoin en periodos de 90 días (umbral de temporada en 75%)."
          },
          {
            "term": "",
            "text": "Monitoreo de carteras institucionales mediante herramientas como Glassnode, Santiment y Whale Alert."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Tokenización Inmobiliaria Fraccionada",
        "text": "Un complejo comercial valorado en $2,000,000 USD se tokeniza en 2,000 unidades digitales de $1,000 USD cada una. Los flujos derivados del arrendamiento se distribuyen de forma automatizada mediante contratos inteligentes a las direcciones de los poseedores de los tokens proporcionalmente a su tenencia.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Métrica On-Chain",
          "Propósito de Análisis",
          "Interpretación Básica"
        ],
        "rows": [
          [
            "Exchange Inflow/Outflow",
            "Rastreo de flujos hacia o desde exchanges",
            "Entradas altas sugieren presión vendedora; salidas indican acumulación"
          ],
          [
            "MVRV Z-Score",
            "Relación valor de mercado / valor realizado",
            "Identificación de techos y suelos macroeconómicos del ciclo"
          ],
          [
            "Vesting Schedule",
            "Cronograma de liberación de tokens",
            "Señalización de posibles episodios de dilución de precios"
          ]
        ]
      }
    ],
    "activities": [
      "Selecciona un proyecto del Top 100 de CoinMarketCap y audítalo empleando los 4 Filtros de Seguridad Fundamental.",
      "Consulta el Altcoin Season Index actual y analiza si el mercado se encuentra en fase de consolidación de Bitcoin o de rotación hacia altcoins.",
      "Rastrea una transferencia de gran volumen mediante Whale Alert y evalúa su impacto en el libro de órdenes del exchange receptor."
    ],
    "summary": [
      "Los proyectos RWA canalizan capital tradicional hacia infraestructuras descentralizadas; evaluar su viabilidad requiere analizar detenidamente los calendarios de desbloqueo y las métricas on-chain del protocolo."
    ]
  },
  "4.6": {
    "intro": [
      {
        "label": "Presentación",
        "text": "La inmutabilidad de los contratos inteligentes garantiza la ejecución sin intermediarios, pero también vuelve irreversibles las pérdidas ocasionadas por errores en el código o estafas."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué la mecánica algorítmica de estabilización de la paridad en el ecosistema Terra-Luna indujo una espiral deflacionaria irreversible?"
      }
    ],
    "content": [
      {
        "term": "Auditoría Básica de Código para Analistas",
        "text": "",
        "points": [
          {
            "term": "Identificación de funciones maliciosas",
            "text": "Honeypots (código que permite la adquisición de un token pero restringe la venta a direcciones no autorizadas) y Rug Pulls (retiro arbitrario de los fondos de liquidez por parte de los creadores)."
          },
          {
            "term": "Funciones de riesgo común",
            "text": "Tasas de venta modificables unilateralmente al 99% y acuñación ilimitada (unlimited minting)."
          },
          {
            "term": "",
            "text": "Revocación periódica de aprobaciones (Token Approvals) mediante utilidades especializadas como Revoke.cash."
          }
        ]
      },
      {
        "term": "Análisis Forense de Crisis Financieras Cripto",
        "text": "",
        "points": [
          {
            "term": "Terra-Luna (2022)",
            "text": "Ruptura de la paridad en una stablecoin algorítmica (UST) que activó una hiperinflación destructiva en el token de absorción (LUNA)."
          },
          {
            "term": "Celsius y Three Arrows Capital (2022)",
            "text": "Quiebras en cadena provocadas por apalancamiento sin garantías suficientes e iliquidez cruzada."
          },
          {
            "term": "Colapso de FTX (2022)",
            "text": "Utilización de depósitos de usuarios para financiar operaciones especulativas en fondos afiliados (Alameda Research)."
          }
        ]
      },
      {
        "term": "Operativa Segura en Plataformas Centralizadas",
        "text": "",
        "points": [
          {
            "term": "Bitso",
            "text": "Gestión de depósitos vía SPEI con vinculación formal de cuenta bancaria y liquidación regulada."
          },
          {
            "term": "Binance",
            "text": "Configuración segregada de billeteras Spot y Earn, verificación rigurosa de redes de destino (ERC20 vs. TRC20 vs. BEP20) para evitar extravíos irrevocables."
          },
          {
            "term": "Protocolos en Mercados P2P",
            "text": "Prohibición de liberación de activos previa confirmación en el saldo bancario real, prescindiendo de comprobantes en imagen fácilmente manipulables."
          },
          {
            "term": "",
            "text": "Blindaje institucional mediante autenticadores 2FA basados en apps o llaves físicas (FIDO/YubiKey), desactivando la autenticación por SMS."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Espiral del Colapso de Terra-Luna",
        "text": "La stablecoin UST perdió su paridad fija de $1 USD. El contrato de arbitraje emitió billones de tokens LUNA para intentar recomprar UST en el mercado. Al perderse la confianza, el exceso de oferta devaluó el valor de LUNA de $80 USD a niveles inferiores a $0.00001 USD en cuestión de días, liquidando más de $40,000 millones de USD de capital en el mercado.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Evento Histórico",
          "Fallo Estructural Central",
          "Lección Operativa Aplicable"
        ],
        "rows": [
          [
            "Mt. Gox (2014)",
            "Negligencia de custodia y hackeo interno",
            "La custodia centralizada prolongada concentra riesgo de contraparte."
          ],
          [
            "The DAO (2016)",
            "Ataque de reentrancia en smart contracts",
            "La inmutabilidad requiere auditorías exhaustivas previas al despliegue."
          ],
          [
            "Terra-Luna (2022)",
            "Mecanismo algorítmico sin colateral real",
            "Los rendimientos irreales suelen ocultar riesgos de insolvencia sistémica."
          ],
          [
            "FTX (2022)",
            "Apropiación indebida de fondos por el custodio",
            "Segregar fondos operativos de activos en custodia de clientes."
          ]
        ]
      }
    ],
    "activities": [
      "Utiliza herramientas como TokenSniffer o Honeypot.is para auditar la dirección de un contrato inteligente sospechoso en la red de pruebas.",
      "Conecta una billetera de pruebas a Revoke.cash y verifica el historial de asignaciones de gasto autorizadas a dApps.",
      "Redacta un protocolo operativo de 5 pasos para realizar transferencias de fondos en Binance P2P minimizando riesgos de fraude bancario."
    ],
    "summary": [
      "La soberanía financiera en criptoactivos exige auditar periódicamente los permisos contractuales concedidos, desconfiar de rendimientos desmedidos y blindar el acceso a plataformas mediante protocolos de seguridad física y 2FA."
    ]
  },
  "5.1": {
    "intro": [
      {
        "label": "Presentación",
        "text": "La rentabilidad sostenible en el trading descansa en una adecuada gestión del riesgo; un método no busca evitar pérdidas, sino mantenerlas bajo control estadístico."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué un detrimento patrimonial del 50% exige un incremento del 100% sobre el saldo restante simplemente para recuperar el capital inicial?"
      }
    ],
    "content": [
      {
        "term": "Asimetría Matemática de la Recuperación de Capital",
        "text": "",
        "points": [
          {
            "term": "",
            "text": "Pérdida del 10% requiere una ganancia del 11.11% para su restauración."
          },
          {
            "term": "",
            "text": "Pérdida del 20% requiere un 25.00%."
          },
          {
            "term": "",
            "text": "Pérdida del 30% requiere un 42.85%."
          },
          {
            "term": "",
            "text": "Pérdida del 50% exige un rendimiento del 100.00%."
          },
          {
            "term": "",
            "text": "Pérdida del 80% demanda un 400.00%."
          },
          {
            "term": "",
            "text": "Las reducciones de capital profundas reducen sustancialmente la probabilidad matemática de recuperación."
          }
        ]
      },
      {
        "term": "Comprensión y Control del Drawdown",
        "text": "Reducción porcentual acumulada desde el punto máximo histórico de la cuenta (peak) hasta el valle posterior. El Max Drawdown constituye la métrica central de solvencia de un sistema.",
        "points": []
      },
      {
        "term": "La Regla del 2% Máximo",
        "text": "Restringir el capital arriesgado por operación a un rango del 1% al 2% del balance total de la cuenta.",
        "points": []
      },
      {
        "term": "Cálculo Técnico del Tamaño de Posición",
        "text": "",
        "points": [
          {
            "term": "La posición se calcula a partir del punto de invalidación analítica, no al revés",
            "text": "Riesgo Monetario ($) = Balance Total × % Riesgo Máximo Distancia al Stop-Loss ($) = |Precio de Entrada - Precio de Stop-Loss| Tamaño de Posición (Unidades) = Riesgo Monetario ($) / Distancia al Stop-Loss ($)"
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Determinación Precisa de Tamaño de Posición",
        "text": "",
        "points": [
          "Capital total de la cuenta: $10,000 USD.",
          "Riesgo asignado (2%): $200 USD.",
          "Precio de compra de la acción: $50 USD.",
          "Stop-Loss técnico fijado bajo soporte: $46 USD.",
          "Distancia de riesgo por unidad: $50 - $46 = $4 USD.",
          "Asignación: $200 / $4 = 50 acciones.",
          "El capital destinado a la compra es de $2,500 USD ($50 × 50 títulos). Si el mercado alcanza el nivel de $46 USD, la pérdida liquidada será de exactamente $200 USD (el 2% de la cuenta)."
        ]
      }
    ],
    "tables": [
      {
        "header": [
          "Pérdida de Balance",
          "Ganancia Necesaria para Recuperar",
          "Impacto en la Capacidad Operativa"
        ],
        "rows": [
          [
            "-5%",
            "+5.26%",
            "Prácticamente inapreciable"
          ],
          [
            "-10%",
            "+11.11%",
            "Manejable bajo el plan estándar"
          ],
          [
            "-25%",
            "+33.33%",
            "Requiere reducción preventiva de posición"
          ],
          [
            "-50%",
            "+100.00%",
            "Exige reconstrucción integral del sistema"
          ],
          [
            "-75%",
            "+300.00%",
            "Inviabilidad estadística de rescate"
          ]
        ]
      }
    ],
    "activities": [
      "Calcula el tamaño de posición para tres activos distintos con una cuenta de $15,000 USD arriesgando un 1.5% fijo por operación.",
      "Modela en una hoja de cálculo una racha adversa de 8 operaciones perdedoras continuas aplicando el 2% versus un 10% de riesgo por operación.",
      "Ubica en una gráfica un nivel de invalidación técnico previo a la entrada y calcula la distancia porcentual del Stop-Loss."
    ],
    "summary": [
      "El tamaño de la posición debe ajustarse en función del nivel de invalidación técnica de la operación; aplicar la regla del 2% protege al balance de rachas de pérdidas prolongadas."
    ]
  },
  "5.2": {
    "intro": [
      {
        "label": "Presentación",
        "text": "El apalancamiento facilita una mayor eficiencia en el uso del colateral, pero amplifica de forma simétrica las variaciones del mercado, acelerando el riesgo de liquidación."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué un apalancamiento de 50x o 100x aproxima el precio de liquidación a la cotización de entrada, elevando el riesgo operativo?"
      }
    ],
    "content": [
      {
        "term": "Mecánica del Apalancamiento",
        "text": "Dispositivo contractual que permite negociar por un valor nominal superior al margen de garantía depositado: Exposición Total = Margen de Colateral × Multiplicador",
        "points": []
      },
      {
        "term": "Márgenes de Garantía",
        "text": "",
        "points": [
          {
            "term": "Margen Inicial",
            "text": "Colateral retenido como garantía para autorizar la apertura de una posición."
          },
          {
            "term": "Margen de Mantenimiento",
            "text": "Umbral mínimo de fondos requerido por la plataforma para mantener la posición activa."
          }
        ]
      },
      {
        "term": "Mecanismo de Liquidación Forzosa",
        "text": "Ocurre cuando el retroceso de precios absorbe el margen disponible, provocando el cierre automático de la orden por el motor del exchange y la pérdida íntegra del colateral.",
        "points": [
          {
            "term": "",
            "text": "Multiplicador 2x $\\rightarrow$ Tolerancia de caída del ~50%."
          },
          {
            "term": "",
            "text": "Multiplicador 10x $\\rightarrow$ Tolerancia de caída del ~10%."
          },
          {
            "term": "",
            "text": "Multiplicador 50x $\\rightarrow$ Tolerancia de caída del ~2%."
          },
          {
            "term": "",
            "text": "Multiplicador 100x $\\rightarrow$ Tolerancia de caída del ~1%."
          }
        ]
      },
      {
        "term": "Margen Aislado (Isolated) vs. Margen Cruzado (Cross Margin)",
        "text": "",
        "points": [
          {
            "term": "Margen Aislado",
            "text": "Confinamiento del riesgo exclusivamente al colateral aportado a esa operación específica."
          },
          {
            "term": "Margen Cruzado",
            "text": "Respaldo de la posición mediante la totalidad de los balances de la billetera de derivados. Presenta el riesgo de que una posición deficitaria liquide todos los activos de la cuenta."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Simulación de Escenarios en Derivados con Apalancamiento 10x",
        "text": "Depósito de $100 USDT de colateral para abrir una posición Long con exposición de $1,000 USDT (precio de Bitcoin en $50,000 USD).",
        "points": [
          "Escenario Favorable (+10%): Bitcoin se aprecia a $55,000 USD. El beneficio es el 10% sobre la exposición nominal de $1,000 USDT = $100 USDT de ganancia neta (+100% de retorno sobre el margen depositado).",
          "Escenario Desfavorable (-10%): Bitcoin desciende a $45,000 USD. La pérdida es el 10% sobre la exposición de $1,000 USDT = $100 USDT. Como la pérdida absorbe el 100% del margen inicial, el motor liquida la posición en su totalidad."
        ]
      }
    ],
    "tables": [
      {
        "header": [
          "Nivel de Apalancamiento",
          "Desviación Adversa para Liquidación",
          "Calificación de Riesgo"
        ],
        "rows": [
          [
            "2x - 3x",
            "33% - 50%",
            "Moderado (apto para Swing Trading)"
          ],
          [
            "5x - 10x",
            "10% - 20%",
            "Alto (requiere seguimiento intradiario)"
          ],
          [
            "20x - 50x",
            "2% - 5%",
            "Extremo (vulnerable al ruido del mercado)"
          ],
          [
            "100x",
            "1%",
            "Crítico (incompatible con la gestión técnica)"
          ]
        ]
      }
    ],
    "activities": [
      "Calcula el precio exacto de liquidación para una posición larga abierta a $30,000 USD empleando multiplicadores de 5x, 10x y 20x.",
      "Configura el entorno de pruebas en la modalidad de Margen Aislado para evitar la absorción de balances en Margen Cruzado.",
      "Programa una orden de Stop-Loss que cierre la posición con una pérdida controlada del 2% del colateral, mucho antes del umbral de liquidación forzosa."
    ],
    "summary": [
      "El apalancamiento debe utilizarse con moderación como herramienta de eficiencia de capital; su empleo exige operar bajo la modalidad de Margen Aislado con órdenes de Stop-Loss programadas."
    ]
  },
  "5.3": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Las respuestas biológicas ante el riesgo y la incertidumbre influyen directamente en la toma de decisiones financieras; reconocer estos patrones es fundamental para la consistencia operativa."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué cerrar una operación en pérdida suele activar una respuesta de malestar similar al dolor físico en el sistema nervioso?"
      }
    ],
    "content": [
      {
        "term": "Mecanismos Neurobiológicos del Operador",
        "text": "",
        "points": [
          {
            "term": "Secuestro de la Amígdala",
            "text": "Ante la percepción de una pérdida financiera, la amígdala cerebral puede activar la respuesta de lucha o huida, reduciendo la actividad de la corteza prefrontal, responsable de la evaluación analítica."
          },
          {
            "term": "Circuitos de Dopamina",
            "text": "La obtención de beneficios en escenarios de incertidumbre genera descargas de dopamina que pueden incentivar la sobreoperativa compulsiva (Overtrading)."
          }
        ]
      },
      {
        "term": "Sesgos Cognitivos en Trading",
        "text": "",
        "points": [
          {
            "term": "Aversión a la Pérdida (Kahneman y Tversky)",
            "text": "El impacto psicológico de una pérdida suele percibirse con el doble de intensidad que la satisfacción producida por una ganancia equivalente, induciendo al operador a cerrar operaciones ganadoras antes de tiempo y dejar correr operaciones deficitarias."
          },
          {
            "term": "Falacia del Apostador",
            "text": "Suponer que una secuencia de caídas consecutivas incrementa por sí misma la probabilidad de una reversión alcista inmediata."
          },
          {
            "term": "Sesgo de Confirmación",
            "text": "Buscar selectivamente análisis o comentarios que respalden una posición abierta, desestimando señales contrarias."
          },
          {
            "term": "Trading de Venganza (Revenge Trading)",
            "text": "Apertura inmediata de nuevas posiciones para compensar una pérdida reciente, prescindiendo del análisis metódico."
          }
        ]
      },
      {
        "term": "Los 8 Grandes Errores en Trading",
        "text": "a. Operar prescindiendo de un análisis objetivo previo. b. Rotar de mercado continuamente sin consolidar una especialización. c. Sobrecargar las gráficas de indicadores y mantener demasiadas posiciones simultáneas. d. Replicar estrategias ajenas sin comprender sus fundamentos. e. Operar con un nivel de capitalización insuficiente. f. Disociar el análisis técnico de la disciplina psicológica. g. Considerar que el mercado ofrece certidumbres absolutas. h. Depender del trading como fuente exclusiva de ingresos desde los primeros pasos.",
        "points": []
      },
      {
        "term": "Los 12 Mandamientos del Trading",
        "text": "a. No realizarás aportes del 100% del capital (All-in). b. Asimilarás las pérdidas controladas como parte intrínseca de la operativa. c. No buscarás revancha contra el mercado. d. No priorizarás la expectativa de enriquecimiento acelerado. e. Mantendrás un Stop-Loss activo en cada operación. f. No promediarás posiciones perdedoras. g. No ejecutarás entradas por impulso ante movimientos repentinos de precios (FOMO). h. Operarás en sintonía con la tendencia macroeconómica prevalente. i. Respetarás la planificación técnica definida previamente. j. Evitarás el exceso de operaciones dentro de una misma sesión (Overtrading). k. Conservarás tu sistema de análisis directo y comprensible. l. Regularás la respuesta emocional subordinándola a reglas operativas claras.",
        "points": []
      }
    ],
    "examples": [
      {
        "term": "El Ciclo Emocional del FOMO",
        "text": "El precio de un activo repunta un 15% de manera imprevista. El operador experimenta el temor a quedar fuera del avance (FOMO); entra en compras en el punto máximo de la vela; el mercado inicia una corrección técnica hacia soportes; ante la presión de la pérdida, el operador liquida en la base del retroceso, para luego observar la reanudación del movimiento alcista. Las decisiones fueron guiadas por la reacción biológica y no por un plan estructurado.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Sesgo / Error",
          "Causa Neurobiológica",
          "Protocolo de Mitigación"
        ],
        "rows": [
          [
            "Revenge Trading",
            "Activación de la amígdala por aversión a la pérdida",
            "Pausa operativa obligatoria tras acumular dos pérdidas sucesivas en una sesión"
          ],
          [
            "Overtrading",
            "Adicción dopaminérgica ante el estímulo de pantalla",
            "Delimitación estricta del número máximo de órdenes autorizadas por día"
          ],
          [
            "Omisión de Stop-Loss",
            "Negación psicológica del error operativo",
            "Ingreso automatizado y simultáneo del Stop-Loss al registrar la orden inicial"
          ]
        ]
      }
    ],
    "activities": [
      "Registra una bitácora retrospectiva describiendo un caso donde hayas sostenido una posición deficitaria por apego o liquidado una orden rentable prematuramente.",
      "Establece un protocolo personal que estipule la suspensión de la operativa y el cierre de la terminal tras dos pérdidas consecutivas en el día.",
      "Autoevalúa tu operativa en una escala del 1 al 10 en el cumplimiento de los 12 Mandamientos del Trading para identificar puntos de mejora."
    ],
    "summary": [
      "Reconocer las respuestas fisiológicas y los sesgos cognitivos resulta indispensable para mitigar decisiones impulsivas y apegarse al plan operativo preestablecido."
    ]
  },
  "5.4": {
    "intro": [
      {
        "label": "Presentación",
        "text": "La consistencia operativa se alcanza evaluando el rendimiento a través de registros estadísticos y principios de ventaja matemática, prescindiendo del azar."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Cómo puede un sistema con una tasa de acierto del 40% generar rentabilidad sostenida frente a otro con el 70% de efectividad?"
      }
    ],
    "content": [
      {
        "term": "El Flujo Metódico de 7 Pasos",
        "text": "a. Fijación de Activo y Temporalidad: Especialización en un catálogo acotado de instrumentos en marcos de referencia estructurados. b. Lectura de Estructura Macro: Mapeo de la tendencia principal en marcos de tiempo superiores (1D o 4H). c. Identificación de Confluencias: Verificación conjunta de zonas estructurales, medias de soporte y volumen transaccional. d. Diseño de Escenarios Condicionales: Planificación de respuestas estructuradas (\"Si el mercado alcanza el nivel X con volumen, se busca entrada; si rechaza, se descarta\"). e. Establecimiento de Punto de Invalidación (Stop-Loss): Determinación del nivel analítico donde la tesis de entrada pierde validez previa a la ejecución. f. Cálculo del Tamaño de Orden: Ajuste cuantitativo del volumen en concordancia con el límite de riesgo del 2%. g. Registro Documentado en Bitácora: Anotación de los parámetros de la operación antes de abrir la orden en el mercado.",
        "points": []
      },
      {
        "term": "La Bitácora de Trading",
        "text": "Instrumento central de registro y auditoría. Debe consignar: Fecha, Instrumento, Dirección (Long/Short), Nivel de entrada, Stop-Loss, Take-Profit, Ratio R:R, Tamaño de posición, Capturas gráficas de entrada y salida, Resultado nominal/porcentual, y Estado de disciplina emocional.",
        "points": []
      },
      {
        "term": "Métricas Cuantitativas de Evaluación",
        "text": "",
        "points": [
          {
            "term": "Tasa de Acierto (Win Rate)",
            "text": "Relación entre operaciones rentables y el total ejecutado."
          },
          {
            "term": "Ratio Riesgo/Beneficio (R",
            "text": "R): Proporción entre el capital arriesgado frente a la ganancia potencial perseguida (ej. 1:2 o 1:3)."
          },
          {
            "term": "Esperanza Matemática (EM)",
            "text": "EM = (Win Rate × Ganancia Promedio) - (Loss Rate × Pérdida Promedio) Un valor de EM > 0 confirma la viabilidad estadística a largo plazo del método."
          },
          {
            "term": "Factor de Beneficio (Profit Factor)",
            "text": "Cociente entre ganancias brutas y pérdidas acumuladas. Un índice superior a 1.5 refleja un sistema robusto."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Rentabilidad con Esperanza Matemática y R",
        "text": "R Asimétrico:",
        "points": [
          "Muestra: 100 operaciones.",
          "Riesgo fijo por evento: $100 USD.",
          "Ganancia esperada por acierto (Ratio 1:2): $200 USD.",
          "Rendimiento: Tasa de acierto del 40% (40 ganancias, 60 pérdidas).",
          "Retornos brutos: 40 × $200 = $8,000 USD.",
          "Pérdidas brutas: 60 × $100 = $6,000 USD.",
          "Beneficio neto: $2,000 USD.",
          "A pesar de registrar pérdidas en el 60% de los intentos, el sesgo asimétrico del ratio consolida un resultado positivo para la cuenta."
        ]
      }
    ],
    "tables": [
      {
        "header": [
          "Campo de Registro",
          "Finalidad Analítica"
        ],
        "rows": [
          [
            "R:R Planificado",
            "Verifica que la rentabilidad potencial justifique el riesgo asumido previo al ingreso."
          ],
          [
            "Captura Inicial / Final",
            "Facilita la auditoría visual técnica para detectar desviaciones en el plan."
          ],
          [
            "Notas Psicológicas",
            "Permite identificar si los errores derivaron de fallos técnicos o impulsos emocionales."
          ],
          [
            "Factor de Beneficio",
            "Mide la eficiencia del sistema (Total Ganado / Total Perdido)."
          ]
        ]
      }
    ],
    "activities": [
      "Ejecuta la planificación de una orden en entorno de pruebas desglosando formalmente cada uno de los 7 pasos requeridos antes de la apertura.",
      "Diseña una plantilla de bitácora y completa el registro retrospectivo de diez operaciones consecutivas incluyendo parámetros técnicos y gráficos.",
      "Calcula la Esperanza Matemática y el Factor de Beneficio de tu operativa histórica a partir de las últimas 30 operaciones simuladas."
    ],
    "summary": [
      "El registro minucioso en la bitácora y el aseguramiento de una esperanza matemática positiva transforman la operativa en una actividad estructurada y sustentada en probabilidades."
    ]
  },
  "5.5": {
    "intro": [
      {
        "label": "Presentación",
        "text": "La sistematización técnica traduce reglas analíticas subjetivas en parámetros lógicos y computables, posibilitando su evaluación retrospectiva sobre series históricas de datos."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Cómo validar la consistencia estadística de una estrategia de inversión antes de comprometer capital real en el mercado?"
      }
    ],
    "content": [
      {
        "term": "De la Operativa Discrecional a la Sistemática",
        "text": "",
        "points": [
          {
            "term": "Discrecional",
            "text": "Basada en apreciaciones visuales o interpretaciones del operador según el contexto momentáneo."
          },
          {
            "term": "Sistemática",
            "text": "Estructurada en premisas lógicas binarias e inequívocas (ej. \"Si EMA 20 supera a EMA 50 Y el RSI se ubica bajo 60, emitir compra con Stop en el mínimo previo\")."
          }
        ]
      },
      {
        "term": "Metodología de Backtesting Riguroso",
        "text": "",
        "points": [
          {
            "term": "",
            "text": "Validación empírica de una estrategia sobre series de precios históricos representativos."
          },
          {
            "term": "Criterios muestrales",
            "text": "Un mínimo de 100 operaciones distribuidas a través de diferentes fases de mercado (alcista, bajista y lateral)."
          },
          {
            "term": "Sesgos Analíticos Críticos",
            "text": "■ Sobreoptimización (Curve Fitting): Ajuste excesivo de parámetros al pasado que resta capacidad de adaptación del sistema frente a datos futuros. ■ Sesgo de Anticipación (Look-ahead Bias): Inclusión involuntaria en el cálculo de datos que no estaban disponibles en el instante de la apertura simulada."
          }
        ]
      },
      {
        "term": "Transición y Validación con Forward Testing",
        "text": "",
        "points": [
          {
            "term": "",
            "text": "Verificación en tiempo real sin riesgo financiero (Paper Trading) durante periodos de prueba prolongados para contrastar los resultados reales con las métricas del backtest."
          }
        ]
      },
      {
        "term": "Automatización y Operativa Algorítmica",
        "text": "",
        "points": [
          {
            "term": "Estrategias Pasivas Sistemáticas",
            "text": "Dollar Cost Averaging (DCA) y módulos Auto-Invest (adquisición periódica programada de activos por montos fijos para promediar precios de entrada y mitigar la volatilidad)."
          },
          {
            "term": "Estrategias de Rejilla (Grid Trading)",
            "text": "Algoritmos diseñados para desplegar mallas ordenadas de órdenes de compra y venta dentro de rangos laterales."
          },
          {
            "term": "Conexión por APIs y Ciberseguridad",
            "text": "■ Empleo de entornos de programación como Python y frameworks especializados. ■ Protocolo de Protección en Claves API: Al enlazar sistemas automáticos o bots externos, desactivar invariablemente la casilla de retiro de fondos, autorizando únicamente permisos de lectura y ejecución de operaciones."
          }
        ]
      }
    ],
    "examples": [
      {
        "term": "Eficacia del Modelo Dollar Cost Averaging (DCA)",
        "text": "La aportación fija de $100 USD el primer día de cada mes en Bitcoin durante un ciclo de tres años promedia el costo de adquisición a través de fases de auge y corrección. Este método suele superar el desempeño medio de operadores minoristas que intentan anticipar de forma discrecional el mínimo absoluto del mercado, reduciendo además el desgaste psicológico.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Etapa de Validación",
          "Entorno de Datos",
          "Objetivo Metodológico"
        ],
        "rows": [
          [
            "Backtesting Histórico",
            "Datos de precios pasados",
            "Validar la esperanza matemática y el drawdown teórico inicial."
          ],
          [
            "Forward Testing",
            "Cotizaciones en tiempo real sin capital real",
            "Contrastar la estabilidad del sistema frente al spread y la latencia real."
          ],
          [
            "Ejecución en Vivo",
            "Capital real acotado",
            "Comprobar la respuesta operativa y emocional en entorno real."
          ]
        ]
      }
    ],
    "activities": [
      "Redacta un sistema operativo estructurado en 3 condiciones exactas de entrada y 2 de salida sin margen a interpretación subjetiva.",
      "Desarrolla un backtest manual de al menos 30 eventos históricos continuos para una estrategia definida, documentando el ratio de aciertos y el drawdown resultante.",
      "Diseña un plan de compras periódicas automatizadas mediante la estrategia DCA para un activo ponderado a un horizonte de 12 meses."
    ],
    "summary": [
      "Resumen integrador del curso: La articulación coordinada del contexto macroeconómico, el análisis estructural de la acción del precio, las herramientas estadísticas, la infraestructura criptográfica de blockchain, la gestión del riesgo de capital, la disciplina conductual y la validación matemática de estrategias fundamenta el marco operativo necesario para participar con criterio en los mercados financieros y el ecosistema digital contemporáneo.",
      "Reflexión formativa: La consistencia operativa se alcanza integrando estos fundamentos técnicos y de gestión para proteger el capital y tomar decisiones informadas ante la incertidumbre del mercado."
    ]
  },
  "6.1": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Los intercambios descentralizados reemplazan los libros de órdenes tradicionales por contratos inteligentes cargados de pares de tokens que ajustan sus precios algorítmicamente."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué depositar fondos en un pool de liquidez puede resultar menos rentable que simplemente conservar los activos en custodia fría ante fuertes variaciones de precio?"
      }
    ],
    "content": [
      {
        "term": "Fórmula del Producto Constante (x × y = k)",
        "text": "Modelo matemático pionero de Uniswap v2 donde x e y representan la reserva de cada token en el pool y k es una constante invariable. Las compras de un token elevan su precio al reducir su oferta relativa dentro de la reserva.",
        "points": []
      },
      {
        "term": "Proveedores de Liquidez (LPs) y Tokens LP",
        "text": "Los usuarios depositan un valor equivalente de ambos activos para permitir intercambios a cambio de una comisión proporcional por transacción. Reciben tokens LP como comprobante respaldatorio.",
        "points": []
      },
      {
        "term": "Pérdida Impermanente (Impermanent Loss)",
        "text": "Coste de oportunidad derivado de la divergencia de precios entre los dos activos aportados respecto a su tenencia pasiva (Hold). Se vuelve permanente una vez retirados los fondos del pool.",
        "points": []
      }
    ],
    "examples": [
      {
        "term": "Cálculo de Pérdida Impermanente",
        "text": "Si un activo en un pool par 50/50 se duplica de precio (2x), el pool reequilibra sus reservas vendiendo el activo alcista. El proveedor de liquidez experimenta una pérdida impermanente del 5.7% frente a la estrategia de sostener los activos por separado, la cual debe ser compensada mediante las comisiones acumuladas por volumen.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Variación Relativa de Precio",
          "Pérdida Impermanente Estimada"
        ],
        "rows": [
          [
            "1.25x (+25%)",
            "-0.6%"
          ],
          [
            "1.50x (+50%)",
            "-2.0%"
          ],
          [
            "2.00x (+100%)",
            "-5.7%"
          ],
          [
            "5.00x (+400%)",
            "-25.5%"
          ]
        ]
      }
    ],
    "activities": [
      "Modela la reordenación de reservas en un pool x × y = k tras una compra que absorbe el 10% de la oferta de un token.",
      "Utiliza una calculadora de Impermanent Loss para simular el impacto en un par de alta volatilidad frente a un par de stablecoins."
    ],
    "summary": [
      "Los AMM eliminan intermediarios en los intercambios descentralizados; los proveedores de liquidez obtienen ingresos por comisiones pero deben gestionar la pérdida impermanente."
    ]
  },
  "6.2": {
    "intro": [
      {
        "label": "Presentación",
        "text": "Los protocolos de crédito en DeFi permiten obtener liquidez o rendimientos de manera transparente mediante contratos inteligentes impulsados por oráculos de precio."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Por qué DeFi exige depositar más colateral del que se solicita en préstamo en lugar de basarse en puntuaciones de crédito tradicionales?"
      }
    ],
    "content": [
      {
        "term": "Sobrecolateralización y LTV (Loan-to-Value)",
        "text": "Al carecer de identidades legales vinculadas, los préstamos requieren un exceso de garantía (ej. LTV del 75% exige $133 USD de colateral por cada $100 USD solicitados).",
        "points": []
      },
      {
        "term": "Factor de Salud (Health Factor)",
        "text": "Índice numérico que evalúa la seguridad del préstamo (HF = (Colateral × Límite de Liquidación) / Deuda). Si el HF < 1, la posición queda expuesta a liquidación inmediata por bots externos.",
        "points": []
      },
      {
        "term": "Yield Farming y Agregadores de Rendimiento",
        "text": "Estrategia activa para maximizar retornos combinando incentivos en tokens de gobernanza y rendimientos por comisiones mediante protocolos optimizadores.",
        "points": []
      }
    ],
    "examples": [
      {
        "term": "Dinámica de Liquidación en Aave",
        "text": "Un usuario deposita $1,500 USD en ETH y solicita $1,000 USDT prestados. Una caída del 25% en ETH reduce el colateral a $1,125 USD, provocando que el Factor de Salud caiga por debajo de 1. Un liquidador paga parte de la deuda acumulada y adquiere el colateral con un descuento de liquidación del 5% al 10%.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Métrica de Préstamo",
          "Significado Operativo"
        ],
        "rows": [
          [
            "LTV Máximo",
            "Capacidad máxima de endeudamiento autorizada sobre el colateral."
          ],
          [
            "Umbral de Liquidación",
            "Nivel de devaluación del colateral donde se activa la liquidación."
          ],
          [
            "Penalización de Liquidación",
            "Descuento otorgado al bot liquidador como incentivo de ejecución."
          ],
          [
            "Health Factor (> 1.5)",
            "Rango de bajo riesgo recomendado frente a volatilidad de mercado."
          ]
        ]
      }
    ],
    "activities": [
      "Calcula el Factor de Salud de una posición colateralizada con ETH ante una corrección proyectada del 20% en su precio.",
      "Compara la rentabilidad real de una tasa APR fija frente a una tasa APY con interés compuesto diario en un protocolo de agricultura de rendimiento."
    ],
    "summary": [
      "Los préstamos algorítmicos permiten apalancar estrategias sin vender activos base, exigiendo una supervisión constante del Factor de Salud para prevenir liquidaciones forzadas."
    ]
  },
  "6.3": {
    "intro": [
      {
        "label": "Presentación",
        "text": "La evolución de DeFi permite desbloquear la liquidez de los activos en staking para reutilizarla como colateral o tokenizar sus flujos de interés futuros."
      },
      {
        "label": "Pregunta inicial",
        "text": "¿Qué riesgos de seguridad sistémica surgen al re-apalancar un mismo depósito de staking en múltiples redes de validación secundarias?"
      }
    ],
    "content": [
      {
        "term": "Tokens de Staking Líquido (LSTs)",
        "text": "Representaciones sintéticas líquidas (ej. stETH de Lido) emitidas a cambio de ETH bloqueado en validadores, permitiendo al usuario operar en DeFi mientras genera rendimientos de red.",
        "points": []
      },
      {
        "term": "Arquitectura de Restaking (EigenLayer)",
        "text": "Permite reutilizar la seguridad criptoeconómica de Ethereum para respaldar oráculos, puentes y capas de disponibilidad de datos externas (AVS) a cambio de rendimientos adicionales.",
        "points": []
      },
      {
        "term": "Tokenización de Rendimiento Futuro (Pendle)",
        "text": "Segregación de activos con rendimiento en un Token Principal (PT) y un Token de Rendimiento (YT), facilitando la fijación de tasas de interés implícitas.",
        "points": []
      }
    ],
    "examples": [
      {
        "term": "Estrategia de Cobertura de Tasa con Pendle",
        "text": "Un inversor compra Principal Tokens (PT) con descuento para asegurar una rentabilidad fija anual del 8% a 1 año sobre su colateral, eliminando la incertidumbre de la fluctuación de tasas en protocolos de rendimiento variable.",
        "points": []
      }
    ],
    "tables": [
      {
        "header": [
          "Capa de Rendimiento",
          "Riesgo Principal de Composición"
        ],
        "rows": [
          [
            "Native Staking (L1)",
            "Penalización de Slashing por fallo del validador base."
          ],
          [
            "Liquid Staking (LST)",
            "Pérdida de paridad (De-peg) entre el LST y el activo subyacente."
          ],
          [
            "Restaking (EigenLayer)",
            "Cascada de Slashing acumulativo por fallos en servicios AVS externos."
          ]
        ]
      }
    ],
    "activities": [
      "Rastrea la paridad histórica entre stETH y ETH durante episodios de alta volatilidad y analiza sus desviaciones.",
      "Mapea la estructura de desglose entre Principal Token (PT) y Yield Token (YT) para un activo con vencimiento a 6 meses en Pendle Finance."
    ],
    "summary": [
      "El Liquid Staking y el Restaking maximizan la eficiencia de capital en redes Proof of Stake, aunque introducen capas de riesgo de composición que requieren un análisis técnico riguroso."
    ]
  }
}
