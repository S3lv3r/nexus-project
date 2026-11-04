import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'

export const RegisterPage: React.FC = () => {
  const { register } = usePlatform()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para el flujo de Términos y Condiciones
  const [isPreparingTerms, setIsPreparingTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const termsScrollRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()

  // Paso 1: Validar el formulario y lanzar la pantalla de carga previa al modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMsg('Completa todos los campos.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.')
      return
    }

    // Reiniciar estados del modal y mostrar pantalla de carga
    setHasScrolledToBottom(false)
    setIsPreparingTerms(true)

    setTimeout(() => {
      setIsPreparingTerms(false)
      setShowTermsModal(true)
    }, 650)
  }

  // Verificar si el contenedor requiere scroll al abrirse (por si la pantalla es muy alta)
  useEffect(() => {
    if (showTermsModal && termsScrollRef.current) {
      const el = termsScrollRef.current
      el.scrollTop = 0
      if (el.scrollHeight <= el.clientHeight + 10) {
        setHasScrolledToBottom(true)
      }
    }
  }, [showTermsModal])

  // Detector de scroll hasta el final del contrato
  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 12
    if (reachedBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true)
    }
  }

  const handleCancelTerms = () => {
    if (isSubmitting) return
    setShowTermsModal(false)
    setHasScrolledToBottom(false)
  }

  // Paso 2: Confirmar lectura y registrar en cleverkor_db
  const handleConfirmTermsAndRegister = async () => {
    if (!hasScrolledToBottom || isSubmitting) return

    setIsSubmitting(true)
    try {
      const ok = await register(name.trim(), username.trim(), email.trim(), password)
      if (ok) {
        setShowTermsModal(false)
        navigate('/onboarding')
      } else {
        setShowTermsModal(false)
      }
    } catch (err) {
      setShowTermsModal(false)
      setErrorMsg('Ocurrió un error al registrar la cuenta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <div className="platform-card p-6 space-y-5">
        <div>
          <h1 className="text-lg font-bold text-[var(--text)]">
            Crear Cuenta
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Registra tus datos en cleverkor_db para guardar tus avances.
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Nombre
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting || isPreparingTerms}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="platform-input"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Usuario
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting || isPreparingTerms}
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
              placeholder="usuario123"
              className="platform-input font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Correo
            </label>
            <input
              type="email"
              required
              disabled={isSubmitting || isPreparingTerms}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="platform-input"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              disabled={isSubmitting || isPreparingTerms}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="platform-input"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              required
              disabled={isSubmitting || isPreparingTerms}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="platform-input"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isPreparingTerms}
            className="w-full platform-btn-primary py-2 text-xs font-semibold justify-center pt-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin mr-1.5"></i>
                Registrando...
              </>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[var(--primary)] hover:underline font-medium">
            Iniciar sesión
          </Link>
        </div>
      </div>

      {/* 1. PANTALLA DE CARGA PREVIA AL CONTRATO */}
      {isPreparingTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="platform-card p-6 flex flex-col items-center space-y-3 max-w-xs w-full text-center">
            <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[var(--primary)]"></i>
            <p className="text-xs text-[var(--text-muted)]">
              Preparando contrato de servicio...
            </p>
          </div>
        </div>
      )}

      {/* 2. MODAL AMPLIO DE TÉRMINOS Y CONDICIONES */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="platform-card w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-[var(--border)]">
            {/* Encabezado */}
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--text)]">
                Términos de Servicio de CLEVER
              </h2>
              <span className="text-[11px] text-[var(--text-muted)]">
                Desplázate hasta el final para aceptar
              </span>
            </div>

            {/* Cuerpo del contrato con detector de Scroll */}
            <div
              ref={termsScrollRef}
              onScroll={handleTermsScroll}
              className="px-6 py-5 overflow-y-auto space-y-3 text-xs leading-relaxed text-[var(--text-muted)] select-none"
            >
              <p className="text-[var(--text)] font-medium">
                Última revisión y actualización: 23 de octubre de 2026
              </p>
              <p>
                Hemos estructurado los Términos de Servicio de CLEVER (operando también bajo la denominación de interfaz <strong className="text-[var(--text)]">NEXUS</strong>) para regular el acceso a nuestro ecosistema formativo, módulos de cultura y entretenimiento, y simulador financiero (<em>Exchange Spot</em>), esclarecer la gobernanza sobre los datos generados en la plataforma y establecer las directrices de uso frente a herramientas de inteligencia artificial y agentes automatizados.
              </p>
              <p>
                Nuestras Restricciones de Uso (Sección 8.2) abordan el acceso automatizado y el alcance de nuestras herramientas de IA. Queda prohibido el entrenamiento de modelos de aprendizaje automático sobre los Servicios de CLEVER —o sobre los datos derivados de ellos— sin autorización previa. Los <em>scrapers</em>, bots y agentes autónomos que apunten a nuestras APIs, sistemas de puntuación, tablas de clasificación o módulos de mercado están estrictamente restringidos. Usted mantiene la responsabilidad total sobre cualquier sistema o llamada automatizada que opere a través de su Cuenta CLEVER o sesión de Invitado.
              </p>
              <p>
                Asimismo, detallamos la naturaleza estrictamente pedagógica de nuestras cotizaciones, métricas y saldos simulados. El objetivo es delimitar qué información se procesa para operar el entorno gamificado, cómo funciona el almacenamiento local o en base de datos en fases de evaluación y cómo CLEVER se deslinda de cualquier ejecución financiera que usted realice en mercados reales fuera de nuestros Servicios.
              </p>
              <p>
                Estos Términos aplican a su Cuenta CLEVER, a su navegación en Modo Invitado y a todos nuestros Servicios, constituyendo un contrato vinculante entre usted y la Parte Contratante de CLEVER. Los términos en mayúsculas se definen a lo largo de este documento y en la Sección 16 (Definiciones).
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                1. Elegibilidad y Capacidad Legal
              </h3>
              <p>
                Para crear una Cuenta CLEVER o utilizar los Servicios de forma autónoma, usted debe tener al menos <strong className="text-[var(--text)]">14 años de edad</strong> cumplidos y cumplir con todas las condiciones de elegibilidad establecidas en la Documentación del Sitio. No obstante, conforme a la legislación civil aplicable en los Estados Unidos Mexicanos y jurisdicciones equivalentes, la plena capacidad de ejercicio para contraer obligaciones patrimoniales, mercantiles o financieras se adquiere a los <strong className="text-[var(--text)]">18 años de edad</strong>.
              </p>
              <p>
                Por consiguiente: (a) los usuarios de entre 14 y 17 años tienen permitido el acceso exclusivo a los módulos educativos, culturales, de gamificación y simulación virtual sin valor monetario, declarando contar con la supervisión y autorización de sus padres o tutores legales, quienes asumen la responsabilidad civil solidaria por los actos del menor; (b) usted debe tener al menos <strong className="text-[var(--text)]">18 años cumplidos</strong> para realizar cualquier transacción económica real, vincular métodos de pago (cuando dichas funciones sean habilitadas) o asumir compromisos comerciales dentro del Sitio; y (c) queda estrictamente prohibido el registro o uso de los Servicios a menores de 14 años. Usted declara y garantiza que posee la capacidad legal exigida en este apartado y que cumplirá con todas las leyes aplicables en relación con el uso de los Servicios.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                2. Aceptación
              </h3>
              <p>
                Al aceptar estos Términos durante el proceso de registro de su cuenta (desplazándose hasta el final de este contrato y activando el botón de aceptación), o por el simple hecho de acceder, navegar o utilizar cualquiera de nuestros Servicios bajo el <strong className="text-[var(--text)]">Modo Invitado</strong> o versión de evaluación gratuita, usted acepta estos Términos y se convierte en parte de este contrato vinculante. Si no está de acuerdo con estos Términos, debe abstenerse de crear una cuenta y abandonar el Sitio de inmediato.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                3. Su Cuenta CLEVER, Modo Invitado y Almacenamiento
              </h3>
              <p>
                <strong className="text-[var(--text)]">3.1 Registro y Credenciales:</strong> Para acceder a las funciones de personalización, guardado de progreso, logros, tablas de clasificación (<em>Ranking</em>) y configuración de perfil, debe registrarse y crear una "Cuenta CLEVER". En el futuro, CLEVER podrá habilitar el inicio de sesión mediante proveedores de identidad de terceros (como Google o Apple), quedando dicho acceso sujeto también a estos Términos. Usted es responsable de toda persona o sistema (incluyendo cualquier agente de IA, sistema autónomo o modelo de lenguaje) que acceda o invoque los Servicios mediante sus credenciales. Toda la información proporcionada durante su registro, diagnóstico inicial y configuración de perfil debe ser veraz, exacta y actual.
              </p>
              <p>
                <strong className="text-[var(--text)]">3.2 Seguridad en Versiones de Prototipo y Almacenamiento:</strong> Usted reconoce y acepta que, durante las fases de evaluación, prototipo o demostración técnica de los Servicios, el estado de su cuenta, progreso, monedas virtuales y credenciales de prueba pueden sincronizarse entre servidores de desarrollo (<code>cleverkor_db</code>) y la memoria local de su navegador web (<em>localStorage</em>). <strong className="text-[var(--text)]">Usted se obliga a no utilizar contraseñas bancarias o de uso personal crítico al registrarse en versiones de evaluación de CLEVER.</strong> Asimismo, comprende que borrar los datos de navegación de su dispositivo o los reinicios técnicos de bases de datos de prueba pueden provocar la pérdida de su progreso sin que CLEVER asuma obligación legal de indemnización.
              </p>
              <p>
                <strong className="text-[var(--text)]">3.3 Modo Invitado:</strong> CLEVER permite explorar ciertas áreas del Sitio, realizar exámenes diagnósticos, interactuar con el simulador y ejecutar desafíos bajo un "Modo Invitado" sin necesidad de registro. Usted comprende que el Modo Invitado es volátil: ninguna actividad, puntuación, moneda virtual o progreso generado como invitado se guardará de forma permanente. El usuario en Modo Invitado está sujeto exactamente a las mismas restricciones de uso, exenciones de responsabilidad financiera y reglas de conducta que un usuario registrado.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                4. Naturaleza de los Servicios y Entorno Simulado
              </h3>
              <p>
                <strong className="text-[var(--text)]">4.1 Propósito Multidisciplinario y Ausencia de Asesoría Financiera:</strong> Los Servicios abarcan módulos interactivos sobre Trading y Finanzas, Películas y Series, Libros y Literatura, Videojuegos, Música, Historia, Ciencia y Cultura General, proporcionándose con fines exclusivamente educativos, culturales y de entretenimiento. <strong className="text-[var(--text)]">CLEVER no es una institución financiera, casa de bolsa, corredor (<em>broker</em>), asesor de inversiones registrado ni intermediario de activos virtuales.</strong> Ningún contenido, misión diaria, análisis técnico o texto dentro de los Servicios constituye una oferta, solicitud, recomendación o asesoría legal, fiscal o financiera para comprar, vender o mantener activos reales.
              </p>
              <p>
                <strong className="text-[var(--text)]">4.2 Entorno de Simulación (<em>Exchange Spot</em> y Backtesting):</strong> Las operaciones ejecutadas en nuestros módulos de mercado, gráficas interactivas, análisis y simulador operan exclusivamente con Datos de Simulación y fondos ficticios. El rendimiento positivo, las rachas ganadoras o el nivel alcanzado dentro de CLEVER (ej. rangos de "Analista", "Estratega" o "Maestro del conocimiento") son etiquetas lúdicas y <strong className="text-[var(--text)]">no certifican competencia financiera real ni garantizan o predicen resultados en mercados financieros reales</strong>. Usted reconoce que el entorno simulado no replica variables críticas del mercado real, tales como liquidez del libro de órdenes, deslizamiento de precios (<em>slippage</em>), comisiones de red, impuestos o el impacto emocional del riesgo patrimonial.
              </p>
              <p>
                <strong className="text-[var(--text)]">4.3 Carencia de Valor Patrimonial de los Derechos de Uso (<em>Entitlements</em>):</strong> Los saldos virtuales, Monedas (<em>Coins</em>), puntos de experiencia (XP), niveles, rachas (<em>Streaks</em>), trofeos, logros, posiciones en el Ranking y temas o colores de personalización constituyen Derechos de Uso internos sin valor monetario real. No son propiedad privada, divisas, criptoactivos ni instrumentos financieros; no pueden ser canjeados por dinero fiat, transferidos ni exigidos como deuda. CLEVER se reserva el derecho de recalibrar las fórmulas de experiencia, reiniciar saldos o modificar misiones en cualquier momento sin responsabilidad hacia usted.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                5. Herramientas de IA (Mentor IA) y Materiales de Terceros
              </h3>
              <p>
                <strong className="text-[var(--text)]">5.1 Uso del Mentor IA:</strong> Los Servicios integran un asistente virtual interactivo ("Mentor IA" / "NEXUS AI") diseñado para apoyar el aprendizaje. Usted reconoce que los modelos de inteligencia artificial procesan información de forma probabilística y pueden generar respuestas inexactas, incompletas, sesgadas o completamente ficticias ("alucinaciones"). Queda estrictamente prohibido tomar decisiones financieras reales, médicas, legales o académicas críticas basándose en las respuestas del Mentor IA, o utilizar sus salidas como señales de inversión (<em>trading signals</em>).
              </p>
              <p>
                <strong className="text-[var(--text)]">5.2 Materiales y APIs de Terceros:</strong> Las gráficas financieras, cotizaciones de mercado y referencias culturales o históricas pueden nutrirse de Materiales de Terceros (APIs externas y bases de datos públicas). CLEVER no garantiza la exactitud, sincronización en tiempo real ni disponibilidad continua de dichos datos, deslindándose de cualquier responsabilidad por latencia, caídas de servicio o discrepancias de precios frente a mercados oficiales.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                6. Contenido de Usuario y Configuración de Privacidad Pública
              </h3>
              <p>
                <strong className="text-[var(--text)]">6.1 Titularidad y Licencia:</strong> Su Contenido de Usuario (incluyendo imágenes de avatar, portadas, publicaciones en el módulo de Comunidad y comentarios) le pertenece a usted. Al subir o compartir Contenido de Usuario en los Servicios, usted otorga a CLEVER una licencia mundial, no exclusiva, libre de regalías y transferible para usar, reproducir, mostrar públicamente y distribuir dicho contenido con el fin de operar, asegurar y mostrar los Servicios a otros usuarios.
              </p>
              <p>
                <strong className="text-[var(--text)]">6.2 Visibilidad de Perfil Público:</strong> Por defecto, ciertas métricas de su cuenta (como sus logros, estadísticas, nivel, historial de actividad reciente e intereses seleccionados) pueden estar configuradas como visibles para la comunidad y las tablas de clasificación. Es su responsabilidad gestionar las opciones de visibilidad desde los controles de su perfil si desea restringir el acceso público a sus métricas de actividad.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                7. Datos y Privacidad
              </h3>
              <p>
                <strong className="text-[var(--text)]">7.1 Datos de Usuario y Datos de Producto:</strong> Al proporcionar Datos de Usuario (incluyendo sus respuestas en el examen diagnóstico, selección de objetivos, intereses y consultas enviadas al Mentor IA), usted autoriza a CLEVER a procesar dicha información para personalizar su ruta de aprendizaje, asignar misiones diarias y mejorar el funcionamiento de la plataforma. CLEVER retiene la propiedad exclusiva sobre todos los Datos de Producto y telemetría agregada derivada del uso del sistema.
              </p>
              <p>
                <strong className="text-[var(--text)]">7.2 Prohibición de Información Personal Sensible:</strong> Usted se compromete a no ingresar, subir ni compartir dentro de los Servicios (especialmente en los formularios de perfil, chats con el Mentor IA o foros de Comunidad) ninguna Información Personal Sensible, tales como números de tarjetas de crédito o débito, claves privadas o frases semilla (<em>seed phrases</em>) de billeteras criptográficas reales, identificaciones oficiales, domicilios particulares, datos biométricos o información financiera confidencial.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                8. Limitaciones y Restricciones de Uso
              </h3>
              <p>
                <strong className="text-[var(--text)]">8.1 Evaluación de Riesgo por el Usuario:</strong> Usted es el único responsable de determinar si el uso de los Servicios se ajusta a sus propósitos educativos. CLEVER no será responsable en modo alguno por los resultados o decisiones tomadas por usted fuera de la plataforma a partir de la interpretación de nuestros contenidos teóricos o simulaciones.
              </p>
              <p>
                <strong className="text-[var(--text)]">8.2 Restricciones de Uso:</strong> El incumplimiento de cualquiera de las siguientes disposiciones rescindirá de inmediato su derecho a utilizar los Servicios. Salvo autorización expresa y por escrito de CLEVER, usted no podrá (ni permitirá a terceros o sistemas automatizados):
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>(a)</strong> Reproducir, modificar, adaptar, traducir o crear obras derivadas de los Servicios o Materiales de CLEVER;</li>
                <li><strong>(b)</strong> Vender, alquilar, sublicenciar o comercializar el acceso a los Servicios o a cuentas con niveles o logros desbloqueados;</li>
                <li><strong>(c)</strong> Eliminar u ocultar avisos de propiedad intelectual, logotipos o marcas (incluyendo las insignias de CLEVER y NEXUS);</li>
                <li><strong>(d)</strong> Manipular, interceptar o alterar de forma ilegítima las peticiones a la API o las variables de estado almacenadas en el navegador (<em>localStorage</em> / <em>sessionStorage</em>) para inflar artificialmente sus puntos de experiencia (XP), Monedas (<em>Coins</em>), niveles, rachas diarias o desbloqueo de logros;</li>
                <li><strong>(e)</strong> Realizar ingeniería inversa, descompilar o intentar extraer la arquitectura del backend, bases de datos, componentes o configuraciones de servidor de los Servicios;</li>
                <li><strong>(f)</strong> Eludir o vulnerar las guardas de navegación, controles de autenticación o restricciones de edad del Sitio;</li>
                <li><strong>(g)</strong> Ejecutar ataques de denegación de servicio (DoS/DDoS), inyecciones SQL, <em>Cross-Site Scripting</em> (XSS) o cualquier acción que sobrecargue o degrade la infraestructura de alojamiento web (<em>hosting</em>) y APIs de CLEVER;</li>
                <li><strong>(h)</strong> Utilizar <em>scrapers</em>, bots, <em>crawlers</em> o scripts automatizados para extraer catálogos de preguntas, manipular las tablas de clasificación (<em>Ranking</em>) o interactuar de forma no humana con los módulos;</li>
                <li><strong>(i)</strong> Utilizar los Servicios o los Datos de Producto para análisis competitivo (<em>benchmarking</em>) con el fin de desarrollar una plataforma que copie o compita con CLEVER;</li>
                <li><strong>(j)</strong> Utilizar el módulo de Comunidad o perfiles para publicar material difamatorio, obsceno, ilegal, acosador, o para promover estafas financieras, esquemas piramidales (<em>Ponzi</em>), grupos de compra/venta fraudulenta (<em>pump and dump</em>), enlaces de <em>phishing</em> o <em>spam</em>;</li>
                <li><strong>(k)</strong> Utilizar cualquier contenido, estructura pedagógica o salida generada por el Mentor IA para entrenar, ajustar (<em>fine-tuning</em>) o validar modelos de inteligencia artificial o aprendizaje automático de terceros;</li>
                <li><strong>(l)</strong> Conectar agentes autónomos de IA, clientes de protocolo de contexto de modelo (MCP) o modelos de lenguaje externos para operar o consultar los Servicios sin pasar por una interfaz autorizada por CLEVER.</li>
              </ul>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                9. Versiones de Evaluación y Reporte de Errores
              </h3>
              <p>
                <strong className="text-[var(--text)]">9.1 Naturaleza de Prototipo:</strong> Usted reconoce que los Servicios pueden ofrecerse en estado de prototipo, versión alfa, beta o de evaluación continua. Dichas versiones se entregan sin compromiso de permanencia y pueden contener errores de código (<em>bugs</em>), reinicios de base de datos o cambios estructurales que afecten la disponibilidad o integridad de su progreso guardado.
              </p>
              <p>
                <strong className="text-[var(--text)]">9.2 Reporte de Errores (<em>Bug Submission</em>):</strong> Si usted identifica y reporta un fallo técnico o vulnerabilidad a CLEVER, acepta que todos los derechos de propiedad intelectual sobre los parches o mejoras resultantes pertenecerán exclusivamente a CLEVER, obligándose a mantener la confidencialidad del fallo hasta su resolución.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                10. Retroalimentación (<em>Feedback</em>)
              </h3>
              <p>
                Cualquier idea, sugerencia de nuevas categorías, mecánicas de gamificación o mejoras que usted envíe a CLEVER ("Retroalimentación") se considerará no confidencial. Usted otorga a CLEVER una licencia perpetua, irrevocable, mundial y libre de regalías para implementar, modificar y explotar comercialmente dicha Retroalimentación dentro de los Servicios sin obligación de pago o atribución.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                11. Derechos de Propiedad Intelectual
              </h3>
              <p>
                CLEVER y sus licenciantes son los titulares exclusivos de todos los derechos de propiedad intelectual e industrial sobre: (a) los Servicios, el Sitio, la Documentación y los Materiales de CLEVER (incluyendo las marcas y signos distintivos "CLEVER", "NEXUS", el diseño de personajes y mascotas oficiales como "Cleverkor", interfaces de usuario, hojas de estilo y catálogos de misiones); (b) el código fuente y la arquitectura de software en todos sus lenguajes y entornos; y (c) los Datos de Producto. Todos los derechos no concedidos expresamente en este documento quedan reservados.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                12. Exenciones de Garantía y Limitación de Responsabilidad
              </h3>
              <p>
                <strong className="text-[var(--text)]">12.1 Exclusión de Garantías:</strong> LOS SERVICIOS, EL SIMULADOR FINANCIERO, EL MENTOR IA Y TODOS LOS CONTENIDOS EDUCATIVOS SE PROPORCIONAN "TAL CUAL" (<em>AS IS</em>) Y "SEGÚN DISPONIBILIDAD" (<em>AS AVAILABLE</em>), SIN GARANTÍAS DE NINGÚN TIPO. CLEVER RECHAZA TODA GARANTÍA EXPRESA, IMPLÍCITA O ESTATUTARIA, INCLUYENDO GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR, PRECISIÓN DE DATOS FINANCIEROS Y NO INFRACCIÓN. USTED ASUME TODO EL RIESGO DERIVADO DEL USO DE LOS SERVICIOS Y DE SU CONFIANZA EN LA UTILIDAD O EXACTITUD DE LAS SIMULACIONES.
              </p>
              <p>
                <strong className="text-[var(--text)]">12.2 Limitación Cuantitativa y Cualitativa de Responsabilidad:</strong> EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE, LA RESPONSABILIDAD TOTAL ACUMULADA DE LA PARTE CONTRATANTE DE CLEVER, SUS FUNDADORES, DESARROLLADORES Y COLABORADORES FRENTE A USTED POR CUALQUIER RECLAMACIÓN DERIVADA DE ESTOS TÉRMINOS O DEL USO DE LOS SERVICIOS NO EXCEDERÁ EN NINGÚN CASO EL MONTO MAYOR ENTRE: (A) CIEN PESOS MEXICANOS ($100.00 MXN); O (B) EL MONTO TOTAL EFECTIVAMENTE PAGADO POR USTED A CLEVER EN LOS SEIS (6) MESES PREVIOS AL EVENTO QUE ORIGINÓ LA DISPUTA (EQUIVALENTE A $0.00 MXN MIENTRAS EL SERVICIO SEA GRATUITO).
              </p>
              <p>
                EN NINGÚN CASO CLEVER SERÁ RESPONSABLE POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENTES O PUNITIVOS; PÉRDIDAS ECONÓMICAS O DE CAPITAL EN INVERSIONES O MERCADOS REALES; PÉRDIDA DE DATOS EN EL ALMACENAMIENTO LOCAL O EN SERVIDORES DE PRUEBA; ROBO DE IDENTIDAD POR USO DE CONTRASEÑAS NO SEGURAS EN ENTORNOS DE EVALUACIÓN; NI POR INTERRUPCIONES DERIVADAS DE PROVEEDORES DE ALOJAMIENTO EXTERNO O FUERZA MAYOR.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                13. Indemnización
              </h3>
              <p>
                Usted se obliga a indemnizar, defender y mantener indemne a CLEVER, sus desarrolladores, representantes y afiliados frente a cualquier reclamación, demanda, pérdida, multa, responsabilidad y gasto (incluyendo honorarios razonables de abogados) que surja de o se relacione con: (a) su Contenido de Usuario; (b) cualquier operación financiera, bursátil o criptográfica que usted realice con dinero real fuera de los Servicios; (c) su incumplimiento de estos Términos (incluyendo la manipulación técnica del sistema o la falsedad en la declaración de edad o autorización de tutores); y (d) su violación de cualquier ley o derecho de terceros.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                14. Vigencia, Terminación y Suspensión
              </h3>
              <p>
                Estos Términos entran en vigor desde su primer acceso al Sitio o desde la creación de su cuenta y permanecen vigentes indefinidamente hasta su terminación. CLEVER podrá suspender o eliminar su cuenta, reiniciar su progreso o bloquear su acceso a los Servicios en cualquier momento y sin previo aviso si detecta el incumplimiento de la Sección 8.2, inactividad prolongada o por el cierre o actualización de fases de prototipo. Tras la terminación, sobrevivirán las Secciones 4, 5, 6, 7, 8, 10, 11, 12, 13, 15 y 16.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                15. Disposiciones Generales (<em>Miscellaneous</em>)
              </h3>
              <p>
                <strong className="text-[var(--text)]">15.1 Modificaciones:</strong> CLEVER se reserva el derecho de modificar estos Términos o las características de los Servicios en cualquier momento. Los cambios entrarán en vigor al publicarse en el Sitio actualizando la fecha de revisión en la parte superior. El uso continuado de los Servicios tras una actualización constituye su aceptación de los Términos modificados.
              </p>
              <p>
                <strong className="text-[var(--text)]">15.2 Ley Aplicable, Jurisdicción y Renuncia a Demandas Colectivas:</strong> Estos Términos se regirán e interpretarán conforme a las leyes vigentes en los Estados Unidos Mexicanos. Para cualquier controversia derivada del presente contrato, las partes se someten expresamente a la jurisdicción de los tribunales competentes correspondientes al domicilio de la Parte Contratante de CLEVER, renunciando a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros. <strong className="text-[var(--text)]">USTED Y CLEVER ACUERDAN QUE CUALQUIER RECLAMACIÓN DEBERÁ PRESENTARSE ÚNICAMENTE A TÍTULO INDIVIDUAL, RENUNCIANDO EXPRESAMENTE A INICIAR O PARTICIPAR EN CUALQUIER DEMANDA COLECTIVA (<em>CLASS ACTION</em>) O ACCIÓN DE GRUPO.</strong>
              </p>
              <p>
                <strong className="text-[var(--text)]">15.3 Divisibilidad, Cesión y Acuerdo Completo:</strong> Si alguna cláusula de estos Términos es declarada nula o inaplicable, se modificará en la medida mínima necesaria para su validez, manteniendo el resto del contrato su plena fuerza legal. Usted no podrá ceder sus derechos bajo estos Términos; CLEVER podrá cederlos libremente. Este documento constituye el acuerdo íntegro entre usted y CLEVER respecto al uso de los Servicios.
              </p>

              <h3 className="text-xs font-bold text-[var(--text)] pt-3">
                16. Definiciones
              </h3>
              <ul className="list-disc pl-5 space-y-1 pb-2">
                <li><strong>"Contenido de Usuario"</strong> significa cualquier imagen, texto, comentario, publicación comunitaria o personalización subida o generada por usted en los Servicios.</li>
                <li><strong>"Cuenta CLEVER"</strong> significa el perfil de usuario registrado (ya sea persistido en <code>cleverkor_db</code> o en almacenamiento local durante fases de prototipo) mediante el cual se accede a los Servicios.</li>
                <li><strong>"Datos de Producto"</strong> significa las métricas operativas, registros de telemetría, estadísticas de uso e información técnica generada por el funcionamiento de los Servicios.</li>
                <li><strong>"Datos de Simulación"</strong> significa las cotizaciones ficticias o diferidas, gráficas de práctica, resultados de exámenes diagnósticos y operaciones virtuales ejecutadas en los módulos de mercado y aprendizaje.</li>
                <li><strong>"Datos de Usuario"</strong> significa los datos proporcionados por usted a los Servicios, incluyendo selecciones de intereses, metas, respuestas de diagnóstico y las consultas (<em>prompts</em>) ingresadas al Mentor IA.</li>
                <li><strong>"Derechos de Uso" (<em>Entitlements</em>)</strong> significa las Monedas virtuales (<em>Coins</em>), puntos de experiencia (XP), niveles, etiquetas de rango, rachas (<em>Streaks</em>), logros y artículos cosméticos otorgados dentro de la plataforma sin valor económico real.</li>
                <li><strong>"Documentación"</strong> significa las lecciones teóricas, descripciones de módulos, guías e instrucciones técnicas o legales disponibles en el Sitio.</li>
                <li><strong>"Materiales de CLEVER"</strong> significa todo el código fuente, lógica de programación, hojas de estilo, bases de datos, diseño de interfaz, marcas ("CLEVER", "NEXUS"), logotipos y activos gráficos (incluyendo la mascota "Cleverkor") propiedad del proyecto.</li>
                <li><strong>"Materiales de Terceros"</strong> significa las APIs externas de cotización, librerías de software, fuentes tipográficas y servicios de terceros integrados en los Servicios.</li>
                <li><strong>"Modo Invitado"</strong> significa la modalidad de acceso temporal sin registro que permite explorar módulos del Sitio sin persistencia de datos entre sesiones.</li>
                <li><strong>"Parte Contratante de CLEVER"</strong> significa el equipo fundador, desarrollador y operador del proyecto CLEVER / NEXUS y las entidades legales que lo representen.</li>
                <li><strong>"Servicios"</strong> significa la plataforma web integral, sus módulos temáticos, el simulador financiero, el asistente Mentor IA y todas las funcionalidades asociadas ofrecidas por CLEVER.</li>
                <li><strong>"Sitio"</strong> significa el conjunto de interfaces web, dominios y subdominios operados por CLEVER.</li>
              </ul>
            </div>

            {/* Pie del Modal con botones */}
            <div className="px-6 py-3.5 border-t border-[var(--border)] flex items-center justify-end gap-3 bg-black/20">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCancelTerms}
                className="px-4 py-2 rounded text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={!hasScrolledToBottom || isSubmitting}
                onClick={handleConfirmTermsAndRegister}
                className={`px-5 py-2 rounded text-xs font-semibold transition-all ${
                  hasScrolledToBottom
                    ? 'platform-btn-primary cursor-pointer'
                    : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-75'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin mr-1.5"></i>
                    Registrando...
                  </>
                ) : (
                  'Aceptar y crear cuenta'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}