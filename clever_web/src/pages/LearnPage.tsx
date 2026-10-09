import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES, COURSE_STAGES, MODULES_BY_CATEGORY } from '../data/catalog'
import './LearnPage.css'

const UNITS = COURSE_STAGES.trading.map((title, unitIndex) => ({
  title,
  lessons: MODULES_BY_CATEGORY.trading.slice(unitIndex * 4, unitIndex * 4 + 4),
}))
const LESSONS = MODULES_BY_CATEGORY.trading.map((title, index) => ({ title, unitIndex: Math.floor(index / 4) }))
const UNIT_COLORS = ['#45b895', '#eead48', '#638ef3', '#a179e8', '#e87971']
const CATEGORY_GUIDES: Record<string, string[]> = {
  trading: ['Empieza por las ideas esenciales para entender cómo funcionan los mercados.', 'Conoce los activos digitales, sus redes y las diferencias entre ellos.', 'Aprende a leer los movimientos del precio con ejemplos visuales.', 'Practica cómo se planea una operación y cómo se cuida el riesgo.', 'Relaciona indicadores y volumen para leer una gráfica con más contexto.', 'Pon en práctica lo aprendido con ejercicios guiados y simulaciones.'],
  gaming: ['Recorre la evolución de los videojuegos y sus plataformas.', 'Descubre cómo se construyen las mecánicas y los niveles.', 'Relaciona estudios, lanzamientos y economía digital.', 'Aplica lo aprendido al analizar la industria gamer.'],
  cine: ['Conoce cómo nació el cine y cómo ha cambiado.', 'Observa cómo los planos, el montaje y el sonido cuentan una historia.', 'Explora la dirección, la composición y las decisiones visuales.', 'Practica el análisis de historias y obras cinematográficas.'],
  libros: ['Ubica los movimientos literarios y su época.', 'Conoce autores, géneros y recursos narrativos.', 'Aprende a leer entre líneas y reconocer figuras retóricas.', 'Construye una interpretación propia con contexto.'],
  musica: ['Identifica ritmo, melodía y armonía en una canción.', 'Explora cómo evolucionaron los géneros y sus escenas.', 'Descubre cómo se graba, produce y mezcla una pieza.', 'Escucha con atención y reconoce la estructura musical.'],
  historia: ['Sitúa las civilizaciones y los primeros intercambios.', 'Comprende cómo las rutas e ideas conectaron sociedades.', 'Relaciona revoluciones y cambios con su contexto.', 'Interpreta procesos que ayudan a entender el presente.'],
  ciencia: ['Aprende a formular preguntas y comprobar ideas.', 'Explora leyes físicas a través de fenómenos cotidianos.', 'Conecta la materia, la vida y los sistemas naturales.', 'Practica lógica y pensamiento crítico con ejemplos.'],
  cultura: ['Conecta acontecimientos e ideas que influyen en el mundo.', 'Explora preguntas filosóficas que siguen vigentes.', 'Lee el arte y la sociedad desde distintos contextos.', 'Descubre patrones, paradojas y curiosidades.'],
}
const CATEGORY_LESSON_COPY: Record<string, { idea: string; simple: string; example: string; practice: string }> = {
  trading: { idea: 'Este concepto te ayuda a interpretar los movimientos del mercado y tomar decisiones con un plan.', simple: 'Imagina que {term} es una pieza de un mapa que te ayuda a orientarte antes de dar el siguiente paso.', example: 'Al revisar una gráfica de precios, puedes reconocer {term} y explicar qué información aporta.', practice: 'Mira una gráfica sencilla e intenta encontrar un ejemplo de {term}. ¿Qué observas?' },
  gaming: { idea: 'Este tema explica una parte de cómo se crean los videojuegos y cómo se relacionan con su industria.', simple: 'Piensa en {term} como una regla o pieza del juego que ayuda a que todo funcione.', example: 'Al jugar un título que conoces, busca un ejemplo de {term} y observa cómo cambia tu experiencia.', practice: 'Elige tu videojuego favorito: ¿dónde notas {term} y qué función cumple?' },
  cine: { idea: 'Este recurso ayuda a construir el ritmo, la atmósfera o el significado de una escena.', simple: 'Es como elegir qué mostrar y cuándo para que una historia se sienta de cierta manera.', example: 'En una escena de suspenso, observa cómo {term} guía tu atención y tus emociones.', practice: 'Piensa en una escena que recuerdes: ¿cómo se usa {term} para contar la historia?' },
  libros: { idea: 'Este concepto ayuda a reconocer cómo está construida una obra y qué contexto le da sentido.', simple: 'Es una pista que te ayuda a entender mejor lo que el autor quiere contar.', example: 'Al leer un cuento, identifica {term} y fíjate cómo cambia tu interpretación.', practice: 'Piensa en una historia que hayas leído: ¿qué ejemplo de {term} recuerdas?' },
  musica: { idea: 'Este elemento participa en la estructura y en la sensación que transmite una pieza musical.', simple: 'Es una de las piezas que hace que una canción tenga su propio sonido y movimiento.', example: 'Escucha una canción que te guste y nota cómo aparece {term} en distintas partes.', practice: 'Escucha unos segundos de una canción: ¿puedes distinguir dónde aparece {term}?' },
  historia: { idea: 'Este tema permite relacionar acontecimientos con las condiciones y decisiones de su época.', simple: 'Es una pieza del pasado que nos ayuda a entender por qué las cosas cambiaron.', example: 'Al estudiar {term}, pregúntate qué ocurrió antes y qué consecuencias tuvo después.', practice: 'Relaciona {term} con un cambio que todavía puedas observar en la actualidad.' },
  ciencia: { idea: 'Este concepto conecta observaciones con explicaciones que pueden ponerse a prueba.', simple: 'Es una forma ordenada de buscar por qué sucede algo y comprobar si nuestra idea tiene sentido.', example: 'Observa algo cotidiano relacionado con {term}, plantea una pregunta y piensa cómo comprobarla.', practice: 'Formula una pregunta sencilla sobre {term}: ¿qué observarías para encontrar una respuesta?' },
  cultura: { idea: 'Este tema ofrece una lente para interpretar ideas, costumbres y cambios de la vida cotidiana.', simple: 'Es una manera de mirar algo conocido desde un ángulo nuevo.', example: 'Busca {term} en una situación de todos los días y piensa qué dice sobre la sociedad.', practice: 'Conecta {term} con una experiencia, noticia o costumbre que conozcas.' },
}
const QUESTIONS = [
  { title: '¿Qué es una stablecoin?', answers: ['Una criptomoneda diseñada para mantener un valor estable', 'Una moneda que siempre sube', 'Una acción de una empresa'] },
  { title: '¿Has utilizado alguna vez una plataforma de trading?', answers: ['Sí, varias veces', 'La he explorado, pero no operado', 'Todavía no'] },
  { title: '¿Has visto una vela japonesa?', answers: ['Sí, y sé qué muestra', 'La he visto, pero no la entiendo aún', 'No, todavía no'] },
]
const STYLES = [
  ['fa-solid fa-seedling', 'Explícamelo fácil', 'Ejemplos cotidianos y palabras sencillas.'],
  ['fa-solid fa-book-open', 'Quiero aprender en detalle', 'Conceptos y términos de los mercados.'],
  ['fa-solid fa-wand-magic-sparkles', 'Quiero aprender haciendo', 'Gráficas y ejercicios prácticos.'],
  ['fa-solid fa-forward', 'Ya tengo experiencia', 'Avanza y repasa solo lo que necesitas.'],
]
type View = 'home' | 'path' | 'style' | 'diagnostic' | 'result' | 'lesson' | 'secondary'
type TrailStyle = React.CSSProperties & { '--node-x': string; '--map-color': string; '--step-delay': string; '--label-x': string }

export const LearnPage: React.FC = () => {
  const { user, completeModule, addXP, addCoins, logActivity, showToast, updateUserProfile } = usePlatform()
  const [searchParams] = useSearchParams()
  const requestedCategory = searchParams.get('cat')
  const initialCategory = CATEGORIES.some((category) => category.id === requestedCategory) ? requestedCategory as string : 'trading'
  const [view, setView] = useState<View>(requestedCategory ? initialCategory === 'trading' ? 'path' : 'secondary' : 'home')
  const [selectedCat, setSelectedCat] = useState(initialCategory)
  const completed = user.moduleProgress.trading || []
  const [lesson, setLesson] = useState(2)
  const [learningStyle, setLearningStyle] = useState(user.learningStyle || '')
  const [question, setQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showEasy, setShowEasy] = useState(false)
  const [unitReward, setUnitReward] = useState<{ title: string; bonus: number; coins: number } | null>(null)
  const [surveyClarity, setSurveyClarity] = useState<number | null>(null)
  const [surveyNextStep, setSurveyNextStep] = useState('')

  const totalLessons = LESSONS.length
  const progress = Math.round((completed.length / totalLessons) * 100)
  const firstIncompleteTradingLesson = LESSONS.findIndex((_, index) => !completed.includes(index))
  const tradingResumeIndex = firstIncompleteTradingLesson < 0 ? totalLessons - 1 : firstIncompleteTradingLesson
  const displayXP = user.xp
  const activeCategories = CATEGORIES.filter((category) => user.interests.includes(category.id))
  const secondaryCategories = CATEGORIES.filter((category) => category.id !== 'trading')
  const selectedCategory = CATEGORIES.find((category) => category.id === selectedCat) || CATEGORIES[0]
  const activeModules = MODULES_BY_CATEGORY[selectedCat] || []
  const activeLessonTitle = selectedCat === 'trading'
    ? LESSONS[lesson]?.title || LESSONS[0].title
    : activeModules[lesson] || activeModules[0] || selectedCategory.name

  const makeTrail = (unitIndex: number) => {
    const unit = UNITS[unitIndex]
    const objective = CATEGORY_GUIDES.trading[unitIndex]
    const start = UNITS.slice(0, unitIndex).reduce((sum, item) => sum + item.lessons.length, 0)
    const xs = [50, 72, 55, 30, 43, 68, 51]
    const points = unit.lessons.map((_, index) => ({ x: xs[(index + unitIndex) % xs.length], y: 56 + index * 108 }))
    const unitDone = completed.filter((item) => item >= start && item < start + unit.lessons.length).length
    const unitProgress = Math.round((unitDone / unit.lessons.length) * 100)
    const path = points.slice(1).reduce((result, point, index) => {
      const previous = points[index]
      const middle = (previous.y + point.y) / 2
      return `${result} C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`
    }, `M ${points[0].x} ${points[0].y}`)

    return (
      <section className="lm-unit" data-theme="trading" key={unit.title} style={{ '--map-color': UNIT_COLORS[unitIndex] } as React.CSSProperties}>
        <header className="lm-unit-head">
          <div><span className="lm-eyebrow">Etapa {String(unitIndex + 1).padStart(2, '0')}</span><h3>{unit.title}</h3><p className="lm-unit-objective">{objective}</p></div>
          <div className="lm-unit-progress-wrap"><span className="lm-unit-tag">{unitDone} / {unit.lessons.length} completadas</span><div className="lm-unit-progress" role="progressbar" aria-label={`Progreso de ${unit.title}`} aria-valuenow={unitDone} aria-valuemin={0} aria-valuemax={unit.lessons.length}><i style={{ width: `${unitProgress}%` }} /></div><small>{unitProgress}% de la etapa</small></div>
        </header>
        <div className="lm-trail">
          <svg className="lm-trail-svg" viewBox={`0 0 100 ${unit.lessons.length * 108}`} preserveAspectRatio="none" aria-hidden="true"><path className="lm-road-edge" d={path} /><path className="lm-road-ribbon" d={path} /><path className="lm-road-progress" pathLength="100" d={path} style={{ strokeDasharray: `${unitProgress} 100` }} /><path className="lm-road-center" d={path} /></svg>
          {unit.lessons.map((title, index) => {
            const lessonIndex = start + index
            const status = completed.includes(lessonIndex) ? 'completed' : lessonIndex === tradingResumeIndex ? 'current' : lessonIndex === tradingResumeIndex + 1 ? 'available' : 'locked'
            const statusLabel = status === 'completed' ? 'Completada' : status === 'current' ? 'Siguiente lección' : status === 'available' ? 'Disponible' : 'Bloqueada'
            const x = points[index].x
            const style: TrailStyle = {
              '--node-x': `${x}%`,
              '--map-color': UNIT_COLORS[unitIndex],
              '--step-delay': `${Math.min(index * 65, 390)}ms`,
              '--label-x': x > 43 ? 'calc(var(--node-x) - min(225px, 42%))' : 'calc(var(--node-x) + 43px)',
            }
            const xp = lessonIndex % 3 === 0 ? 30 : 50
            return (
              <article className={`lm-step ${status}`} style={style} key={title}>
                <button className="lm-node" disabled={status === 'locked'} onClick={() => openLesson(lessonIndex)} aria-label={`${title}, ${statusLabel}`}>
                  <span>{status === 'completed' ? '✓' : status === 'locked' ? <i className="fa-solid fa-lock" /> : status === 'current' ? <i className="fa-solid fa-play" /> : <i className="fa-solid fa-star" />}</span>
                  {status === 'completed' && <small className="lm-xp-badge">+{xp} XP</small>}
                </button>
                <span className={`lm-trail-item ${status}`} aria-hidden="true"><i className={status === 'completed' ? 'fa-solid fa-coins' : status === 'locked' ? 'fa-solid fa-lock' : 'fa-solid fa-gem'} />{status === 'completed' && <small>+{xp}</small>}</span>
                {status === 'current' && <span className="lm-next-bubble">Sigue por aquí</span>}
                <button className="lm-step-label" disabled={status === 'locked'} onClick={() => openLesson(lessonIndex)}>
                  <strong>{title}</strong><small>{statusLabel} · +{xp} XP</small>
                </button>
              </article>
            )
          })}
        </div>
      </section>
    )
  }

  const makeCategoryTrail = (categoryId: string, unitIndex: number) => {
    const title = CATEGORIES.find((category) => category.id === categoryId)?.name || 'Camino'
    const courseModules = MODULES_BY_CATEGORY[categoryId] || []
    const done = user.moduleProgress[categoryId] || []
    const chunkSize = 4
    const start = unitIndex * chunkSize
    const unitModules = courseModules.slice(start, start + chunkSize)
    const unitDone = done.filter((index) => index >= start && index < start + unitModules.length).length
    const unitProgress = unitModules.length ? Math.round((unitDone / unitModules.length) * 100) : 0
    const offsets = [50, 70, 48, 28]
    const points = unitModules.map((_, index) => ({ x: offsets[index % offsets.length], y: 54 + index * 108 }))
    const line = unitModules.length === 1
      ? `M 24 102 C 31 91, 42 70, ${points[0].x} ${points[0].y}`
      : points.slice(1).reduce((result, point, index) => {
      const previous = points[index]
      const middle = (previous.y + point.y) / 2
      return `${result} C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`
    }, `M ${points[0].x} ${points[0].y}`)
    const color = UNIT_COLORS[(unitIndex + 1) % UNIT_COLORS.length]
    const objective = CATEGORY_GUIDES[categoryId]?.[unitIndex] || `Explora ${title.toLowerCase()} con ejemplos y avanza tema a tema.`
    const stageTitle = COURSE_STAGES[categoryId]?.[unitIndex] || `Etapa ${unitIndex + 1}`

    return <section className="lm-unit lm-other-unit" data-theme={categoryId} key={`${categoryId}-${unitIndex}`} style={{ '--map-color': color } as React.CSSProperties}>
      <header className="lm-unit-head"><div><span className="lm-eyebrow">Etapa {String(unitIndex + 1).padStart(2, '0')}</span><h3>{stageTitle}</h3><p className="lm-unit-objective">{objective}</p></div><div className="lm-unit-progress-wrap"><span className="lm-unit-tag">{unitDone} / {unitModules.length} completadas</span><div className="lm-unit-progress" role="progressbar" aria-label={`Progreso de etapa ${unitIndex + 1}`} aria-valuenow={unitDone} aria-valuemin={0} aria-valuemax={unitModules.length}><i style={{ width: `${unitProgress}%` }} /></div><small>{unitProgress}% de la etapa</small></div></header>
      <div className="lm-trail"><svg className="lm-trail-svg" viewBox={`0 0 100 ${unitModules.length * 108}`} preserveAspectRatio="none" aria-hidden="true"><path className="lm-road-edge" d={line} /><path className="lm-road-ribbon" d={line} /><path className="lm-road-progress" pathLength="100" d={line} style={{ strokeDasharray: `${unitProgress} 100` }} /><path className="lm-road-center" d={line} /></svg>{unitModules.map((module, index) => {
        const moduleIndex = start + index
        const firstIncomplete = courseModules.findIndex((_, courseIndex) => !done.includes(courseIndex))
        const currentModule = firstIncomplete < 0 ? courseModules.length : firstIncomplete
        const status = done.includes(moduleIndex) ? 'completed' : moduleIndex === currentModule ? 'current' : moduleIndex === currentModule + 1 ? 'available' : 'locked'
        const x = points[index].x
        const style: TrailStyle = { '--node-x': `${x}%`, '--map-color': color, '--step-delay': `${Math.min(index * 55, 260)}ms`, '--label-x': x > 43 ? 'calc(var(--node-x) - min(225px, 42%))' : 'calc(var(--node-x) + 43px)' }
        return <article className={`lm-step ${status}`} style={style} key={module}>
          <button className="lm-node" disabled={status === 'locked'} onClick={() => openLesson(moduleIndex)} aria-label={`${module} · ${status}`}><span>{status === 'completed' ? '✓' : status === 'locked' ? <i className="fa-solid fa-lock" /> : status === 'current' ? <i className="fa-solid fa-play" /> : <i className="fa-solid fa-star" />}</span>{status === 'completed' && <small className="lm-xp-badge">+35 XP</small>}</button>
          <span className={`lm-trail-item ${status}`} aria-hidden="true"><i className={status === 'completed' ? 'fa-solid fa-coins' : status === 'locked' ? 'fa-solid fa-lock' : 'fa-solid fa-gem'} />{status === 'completed' && <small>+35</small>}</span>
          {status === 'current' && <span className="lm-next-bubble">Sigue por aquí</span>}
          <button className="lm-step-label" disabled={status === 'locked'} onClick={() => openLesson(moduleIndex)}><strong>{module}</strong><small>{status === 'completed' ? 'Completada' : status === 'current' ? 'Siguiente lección' : status === 'available' ? 'Disponible' : 'Bloqueada'} · +35 XP</small></button>
        </article>
      })}</div>
    </section>
  }

  function openLesson(index: number) {
    setLesson(index)
    setShowEasy(false)
    const savedSurvey = user.lessonSurveys?.[selectedCat]?.[index]
    setSurveyClarity(savedSurvey?.clarity ?? null)
    setSurveyNextStep(savedSurvey?.nextStep ?? '')
    setView('lesson')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function completeCurrentLesson() {
    const finished = user.moduleProgress[selectedCat] || []
    if (finished.includes(lesson)) {
      setView(selectedCat === 'trading' ? 'path' : 'secondary')
      return
    }

    completeModule(selectedCat, lesson)
    logActivity(`Lección completada: ${activeModules[lesson]}`)
    const unitIndex = Math.floor(lesson / 4)
    const unitStart = unitIndex * 4
    const stageCompleted = Array.from({ length: 4 }, (_, offset) => unitStart + offset).every((index) => finished.includes(index) || index === lesson)
    if (stageCompleted) {
      addXP(100)
      addCoins(50)
      setUnitReward({ title: COURSE_STAGES[selectedCat]?.[unitIndex] || `Etapa ${unitIndex + 1}`, bonus: 100, coins: 50 })
    }

    if (stageCompleted || lesson >= activeModules.length - 1) {
      setView(selectedCat === 'trading' ? 'path' : 'secondary')
      return
    }
    openLesson(lesson + 1)
  }

  function submitLessonSurvey() {
    if (surveyClarity === null || !surveyNextStep) {
      showToast('Responde las dos preguntas para completar la lección y recibir tu recompensa.', 'info')
      return
    }
    const surveys = user.lessonSurveys || {}
    updateUserProfile({ lessonSurveys: { ...surveys, [selectedCat]: { ...(surveys[selectedCat] || {}), [lesson]: { clarity: surveyClarity, nextStep: surveyNextStep, completedAt: Date.now() } } } })
    completeCurrentLesson()
  }
  const beginDiagnostic = () => { setQuestion(0); setAnswers([]); setView('diagnostic') }
  const selectAnswer = (choice: number) => setAnswers((previous) => {
    const updated = [...previous]
    updated[question] = choice
    return updated
  })
  const advanceDiagnostic = () => {
    if (answers[question] === undefined) { showToast('Elige una respuesta para continuar.', 'info'); return }
    if (question < QUESTIONS.length - 1) setQuestion((previous) => previous + 1)
    else setView('result')
  }

  const home = () => { setSelectedCat('trading'); setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openPath = () => { setSelectedCat('trading'); setView('path'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const returnHomeButton = <button className="lm-return-home" onClick={home} title="Volver a elegir un camino"><i className="fa-solid fa-arrow-left" /> Caminos</button>
  const saveLearningStyle = () => {
    if (!learningStyle) { showToast('Selecciona una forma de aprender.', 'info'); return }
    updateUserProfile({ learningStyle })
    showToast('Tu forma de aprender quedó actualizada.', 'success')
    setView(selectedCat === 'trading' ? 'path' : 'secondary')
  }

  if (view === 'style') return (
    <div className="lm-page lm-flow-wrap">{returnHomeButton}<section className="lm-flow-card"><button className="lm-back" onClick={() => setView(selectedCat === 'trading' ? 'path' : 'secondary')}>← Volver al camino</button><span className="lm-eyebrow">Tu forma de aprender</span><h1>¿Cómo quieres aprender?</h1><p>Escoge lo que se sienta mejor para ti. Puedes cambiarlo después.</p><div className="lm-choice-grid">{STYLES.map(([icon, title, description]) => <button key={title} className={`lm-choice ${learningStyle === title ? 'selected' : ''}`} onClick={() => setLearningStyle(title)}><i className={icon} /><strong>{title}</strong><small>{description}</small></button>)}</div><div className="lm-flow-footer"><span>{user.learningStyle ? `Estilo actual: ${user.learningStyle}` : 'Tu camino se adaptará a tu preferencia.'}</span><button className="platform-btn-primary" onClick={saveLearningStyle}>Guardar preferencia →</button></div></section></div>
  )

  if (view === 'diagnostic') return (
    <div className="lm-page lm-flow-wrap">{returnHomeButton}<section className="lm-flow-card"><button className="lm-back" onClick={openPath}>← Volver al camino</button><div className="lm-diagnostic-progress"><div><span style={{ width: `${((question + 1) / QUESTIONS.length) * 100}%` }} /></div><small>{question + 1} de {QUESTIONS.length}</small></div><span className="lm-eyebrow">Un punto de partida a tu medida</span><h1>Descubramos qué sabes</h1><p>No hay respuestas malas. Esto nos ayuda a sugerirte por dónde empezar.</p><h2>{QUESTIONS[question].title}</h2><div className="lm-diagnostic-options">{QUESTIONS[question].answers.map((answer, index) => <button key={answer} className={`lm-choice lm-answer ${answers[question] === index ? 'selected' : ''}`} onClick={() => selectAnswer(index)}><span>{String.fromCharCode(65 + index)}</span><strong>{answer}</strong></button>)}</div><div className="lm-flow-footer"><span>Responde con tranquilidad.</span><button className="platform-btn-primary" onClick={advanceDiagnostic}>{question === QUESTIONS.length - 1 ? 'Ver mi recomendación →' : 'Continuar →'}</button></div></section></div>
  )

  if (view === 'result') {
    const experienced = answers[0] === 0 && answers[1] === 0
    const recommended = experienced ? 8 : 2
    return <div className="lm-page lm-flow-wrap">{returnHomeButton}<section className="lm-flow-card"><button className="lm-back" onClick={openPath}>← Volver al camino</button><span className="lm-eyebrow">Tu recomendación</span><div className="lm-result-icon"><i className="fa-solid fa-compass" /></div><h1>Tu punto de partida</h1><h2>{experienced ? 'Principiante con experiencia' : 'Principiante'}</h2><p>Te recomendamos avanzar a tu ritmo, construyendo una base clara antes de explorar nuevas herramientas.</p><div className="lm-recommendation"><div><strong>{LESSONS[recommended].title}</strong><small>Etapa {LESSONS[recommended].unitIndex + 1} · Trading y Finanzas</small></div><span>Recomendado</span></div><div className="lm-flow-footer"><span>Siempre puedes explorar otros temas.</span><button className="platform-btn-primary" onClick={() => openLesson(recommended)}>Ir a mi lección →</button></div></section></div>
  }

  if (view === 'lesson') {
    const title = activeLessonTitle
    const candle = title.toLowerCase().includes('vela')
    const isSimpleStyle = user.learningStyle === STYLES[0][1]
    const isDetailedStyle = user.learningStyle === STYLES[1][1]
    const isPracticeStyle = user.learningStyle === STYLES[2][1]
    const categoryCopy = CATEGORY_LESSON_COPY[selectedCat] || CATEGORY_LESSON_COPY.trading
    const technical = candle ? 'Una vela japonesa representa cómo se movió el precio de un activo durante un periodo. Su cuerpo muestra la apertura y el cierre; las mechas señalan los precios máximo y mínimo.' : `${title}: ${categoryCopy.idea}`
    const simple = candle ? 'Piensa en una vela como el resumen de una historia: te enseña dónde empezó y terminó el precio, y hasta dónde llegó en el camino.' : categoryCopy.simple.replace('{term}', title.toLowerCase())
    const example = candle ? 'Si una criptomoneda comenzó en $100 y terminó en $110, la vela muestra ese movimiento. Sus mechas señalan si llegó a subir o bajar más.' : categoryCopy.example.replaceAll('{term}', title.toLowerCase())
    const practicePrompt = categoryCopy.practice.replace('{term}', title.toLowerCase())
    return <div className="lm-page lm-lesson-page">{returnHomeButton}<div className="lm-breadcrumb"><button onClick={home}>Caminos</button><span>›</span><button onClick={() => setView(selectedCat === 'trading' ? 'path' : 'secondary')}>{selectedCategory.name}</button><span>›</span><span>Lección</span></div><header className="lm-lesson-heading"><div><span className="lm-eyebrow">Etapa {selectedCat === 'trading' ? LESSONS[lesson].unitIndex + 1 : Math.floor(lesson / 4) + 1} · {selectedCategory.name}</span><h1>{title}</h1><p>{technical}</p></div><span>Lección {lesson + 1} / {selectedCat === 'trading' ? totalLessons : activeModules.length}</span></header><div className="lm-lesson-grid"><section className="lm-content-card"><span className="lm-eyebrow">{isDetailedStyle ? 'Concepto clave' : 'La idea principal'}</span><p>{technical}</p>{isDetailedStyle && <div className="lm-term-chip"><i className="fa-solid fa-bookmark" /> Término clave: {title}</div>}</section><section className="lm-content-card lm-simple-card"><header><strong>{isSimpleStyle ? 'En palabras simples' : 'Una forma de entenderlo'}</strong><button onClick={() => setShowEasy((previous) => !previous)}>{showEasy ? 'Ver explicación' : 'Explicarlo más fácil'}</button></header><p>{showEasy ? simple : isSimpleStyle ? simple : technical}</p></section>{candle && <section className="lm-content-card lm-chart-card"><header><strong>{isPracticeStyle ? 'Prueba a leer este movimiento' : 'Así se ve un movimiento'}</strong><small>Ilustración · sin datos de mercado</small></header><div className="lm-candles">{[42, 65, 52, 75, 56, 82, 62, 91, 68, 78, 54, 70].map((height, index) => <span key={index} className={index === 2 || index === 6 || index === 10 ? 'down' : ''} style={{ height, '--wick': `${14 + (index % 3) * 5}px` } as React.CSSProperties} />)}</div><div className="lm-chart-labels"><span>Apertura</span><span>Movimiento del precio</span><span>Cierre</span></div>{isPracticeStyle && <p className="lm-practice-prompt">Observa el cuerpo y las mechas. ¿En qué dirección terminó el precio?</p>}</section>}{isPracticeStyle && !candle && <section className="lm-content-card lm-practice-card"><strong><i className="fa-solid fa-pencil" /> Prueba rápida</strong><p>{practicePrompt}</p><span>Piensa tu respuesta antes de continuar.</span></section>}<section className="lm-content-card lm-example-card"><strong><i className="fa-regular fa-lightbulb" /> {isDetailedStyle ? 'Aplicación del concepto' : 'Ejemplo cotidiano'}</strong><p>{example}</p></section></div><section className="lm-survey-card"><span className="lm-eyebrow">Encuesta de la lección</span><h2>Antes de seguir, cuéntanos</h2><p>Tu respuesta guarda tu avance y activa tus recompensas.</p><strong>¿Qué tan clara fue esta lección?</strong><div className="lm-survey-options">{[1,2,3,4,5].map((value) => <button type="button" className={surveyClarity === value ? 'selected' : ''} key={value} onClick={() => setSurveyClarity(value)} aria-pressed={surveyClarity === value}>{value}<small>{value === 1 ? 'Poco' : value === 5 ? 'Mucho' : ''}</small></button>)}</div><strong>¿Qué harás con lo aprendido?</strong><div className="lm-survey-next">{['Repasarlo','Aplicarlo en un ejemplo','Continuar con el siguiente tema'].map((choice) => <button type="button" className={surveyNextStep === choice ? 'selected' : ''} key={choice} onClick={() => setSurveyNextStep(choice)} aria-pressed={surveyNextStep === choice}>{choice}</button>)}</div><div className="lm-lesson-footer"><span>Recompensa: <strong>+35 XP · +15 monedas</strong>{(lesson + 1) % 4 === 0 && <small> Cofre de etapa: +100 XP · +50 monedas</small>}</span><button className="platform-btn-primary" onClick={submitLessonSurvey} disabled={(user.moduleProgress[selectedCat] || []).includes(lesson) || surveyClarity === null || !surveyNextStep}>{(user.moduleProgress[selectedCat] || []).includes(lesson) ? 'Lección completada' : 'Completar encuesta y continuar →'}</button></div></section></div>
  }

  if (view === 'secondary') {
    const finished = user.moduleProgress[selectedCat] || []
    const unitCount = Math.ceil(activeModules.length / 4)
    const categoryProgress = activeModules.length ? Math.round((finished.length / activeModules.length) * 100) : 0
    const nextCategoryLesson = activeModules.findIndex((_, index) => !finished.includes(index))
    const categoryResumeIndex = nextCategoryLesson < 0 ? 0 : nextCategoryLesson
    return <div className="lm-page lm-learning-page" data-theme={selectedCat}>{returnHomeButton}<div className="lm-breadcrumb"><button onClick={home}>Caminos</button><span>›</span><span>{selectedCategory.name}</span></div><header className="lm-category-banner"><div className="lm-category-copy"><span className="lm-eyebrow">Camino para explorar</span><h1><i className={selectedCategory.icon} /> {selectedCategory.name}</h1><p>{selectedCategory.desc}</p><span className="lm-banner-meta"><i className="fa-solid fa-route" /> {activeModules.length} lecciones · {unitCount} etapas</span><button className="lm-category-continue platform-btn-primary" onClick={() => openLesson(categoryResumeIndex)}>{nextCategoryLesson < 0 ? 'Repasar el camino' : finished.length ? 'Continuar camino' : 'Comenzar camino'} <i className="fa-solid fa-arrow-right" /></button></div><div className="lm-category-art" aria-hidden="true"><span className="lm-art-orbit orbit-one"/><span className="lm-art-orbit orbit-two"/><i className={selectedCategory.icon}/><span className="lm-art-spark spark-one">✦</span><span className="lm-art-spark spark-two">✧</span></div><div className="lm-other-summary"><strong>{categoryProgress}%</strong><span>{finished.length} de {activeModules.length} lecciones</span><div className="lm-category-progress"><i style={{width:`${categoryProgress}%`}}/></div></div></header><div className="lm-other-layout"><main><div className="lm-map-heading"><div><span className="lm-eyebrow">Tu recorrido</span><h2>Avanza a tu manera</h2></div><button className="lm-change-style" onClick={() => { setLearningStyle(user.learningStyle || ''); setView('style') }}><i className="fa-solid fa-sliders" /> {user.learningStyle || 'Elegir estilo'}</button></div><div className="lm-route-tip"><i className="fa-solid fa-compass" /><span><strong>¿Cómo recorrerlo?</strong> Sigue el nodo resaltado, aprende con cada tema y gana XP al completar una lección.</span></div>{Array.from({ length: unitCount }, (_, index) => makeCategoryTrail(selectedCat, index))}</main><aside className="lm-other-aside"><span className="lm-eyebrow">Tu forma de aprender</span><strong>{user.learningStyle || 'A tu propio ritmo'}</strong><p>Este camino usa tus preferencias. Puedes cambiarlas en cualquier momento.</p><button className="platform-btn-secondary" onClick={() => { setLearningStyle(user.learningStyle || ''); setView('style') }}>Cambiar forma de aprender</button><div className="lm-small-xp"><i className="fa-solid fa-bolt" /> Cada lección completada suma XP</div></aside></div>{unitReward !== null && <div className="lm-reward-backdrop" role="presentation" onClick={() => setUnitReward(null)}><section className="lm-reward-modal" role="dialog" aria-modal="true" aria-labelledby="lm-reward-title" onClick={(event) => event.stopPropagation()}><button className="lm-reward-close" onClick={() => setUnitReward(null)} aria-label="Cerrar recompensa">×</button><div className="lm-reward-burst"><i className="fa-solid fa-gift" /></div><span className="lm-eyebrow">¡Etapa completada!</span><h2 id="lm-reward-title">Un cofre para ti</h2><p>Terminaste “{unitReward.title}”. Tu constancia merece una recompensa.</p><div className="lm-reward-chest"><i className="fa-solid fa-box-open" /><span>+{unitReward.bonus} XP · +{unitReward.coins} monedas</span></div><button className="platform-btn-primary" onClick={() => setUnitReward(null)}>Seguir aprendiendo <i className="fa-solid fa-arrow-right" /></button></section></div>}</div>
  }

  if (view === 'path') return (
    <div className="lm-page lm-learning-page" data-theme="trading">
      {returnHomeButton}
      <div className="lm-breadcrumb"><button onClick={home}>Caminos</button><span>›</span><span>Trading y Finanzas</span></div>
      <header className="lm-path-hero"><div><span className="lm-eyebrow">Tu recorrido recomendado</span><h1><i className="fa-solid fa-chart-line" /> Trading y Finanzas</h1><p>Un paso a la vez. Construye una base sólida y desbloquea nuevas herramientas mientras avanzas.</p><div className="lm-hero-actions"><button className="platform-btn-primary" onClick={() => openLesson(tradingResumeIndex)}>Continuar aprendizaje <i className="fa-solid fa-arrow-right" /></button><button className="platform-btn-secondary" onClick={beginDiagnostic}>Descubrir mi nivel</button><button className="platform-btn-secondary" onClick={() => { setLearningStyle(user.learningStyle || ''); setView('style') }}><i className="fa-solid fa-sliders" /> {user.learningStyle || '¿Cómo quieres aprender?'}</button></div></div><div className="lm-hero-stats"><strong>{displayXP} <small>XP</small></strong><span>Nivel {user.level} · {user.levelLabel}</span><div><span style={{ width: `${progress}%` }} /></div><small>{progress}% del camino</small></div></header>
      <div className="lm-map-layout"><main className="lm-course-map"><div className="lm-map-heading"><div><span className="lm-eyebrow">Tu mapa de aprendizaje</span><h2>Avanza a tu ritmo</h2></div><span>{completed.length} de {totalLessons} lecciones</span></div><div className="lm-route-tip"><i className="fa-solid fa-compass" /><span><strong>Tu misión</strong> Completa el nodo activo para descubrir el siguiente. Cada etapa termina con una habilidad nueva.</span></div>{UNITS.map((_, index) => makeTrail(index))}</main><aside className="lm-map-sidebar"><section className="lm-side-card"><span className="lm-eyebrow">Tu progreso</span><strong className="lm-xp-total">{displayXP} XP</strong><p>Nivel {user.level} · {user.levelLabel}</p><div className="lm-xp-bar"><span style={{ width: `${Math.min((displayXP / user.xpToNext) * 100, 100)}%` }} /></div><small>{Math.max(0, user.xpToNext - (displayXP % user.xpToNext))} XP para el siguiente nivel</small><div className="lm-badges"><span>✦ Racha de {user.streak} días</span><span>✓ {completed.length} lecciones</span></div></section><section className="lm-side-card"><span className="lm-eyebrow">Aprende y desbloquea</span><h3>Las herramientas llegan con tu progreso</h3>{[['fa-solid fa-chart-area', 'Gráficas avanzadas', 'Completa 5 lecciones'], ['fa-solid fa-wave-square', 'Indicadores', 'Aprende sobre tendencias'], ['fa-solid fa-vr-cardboard', 'Simulador', 'Completa fundamentos']].map(([icon, name, description]) => <div className="lm-unlock" key={name}><i className={icon} /><span><strong>{name}</strong><small>{description}</small></span><i className="fa-solid fa-lock" /></div>)}</section><section className="lm-side-card lm-mentor-card"><i className="fa-solid fa-wand-magic-sparkles" /><strong>¿Una duda en el camino?</strong><p>El Mentor puede explicarte cada concepto paso a paso.</p><Link to="/mentor">Preguntar al Mentor →</Link></section></aside></div>
      {unitReward !== null && <div className="lm-reward-backdrop" role="presentation" onClick={() => setUnitReward(null)}><section className="lm-reward-modal" role="dialog" aria-modal="true" aria-labelledby="lm-reward-title" onClick={(event) => event.stopPropagation()}><button className="lm-reward-close" onClick={() => setUnitReward(null)} aria-label="Cerrar recompensa">×</button><div className="lm-reward-burst"><i className="fa-solid fa-gift" /></div><span className="lm-eyebrow">¡Etapa completada!</span><h2 id="lm-reward-title">Un cofre para ti</h2><p>Terminaste “{unitReward.title}”. Tu constancia merece una recompensa.</p><div className="lm-reward-chest"><i className="fa-solid fa-box-open" /><span>+{unitReward.bonus} XP · +{unitReward.coins} monedas</span></div><button className="platform-btn-primary" onClick={() => setUnitReward(null)}>Seguir aprendiendo <i className="fa-solid fa-arrow-right" /></button></section></div>}
    </div>
  )

  if (view === 'home') return (
    <div className="lm-page lm-learning-page" data-theme="trading">
      <header className="lm-home-heading"><div><span className="lm-eyebrow">Tu espacio para avanzar</span><h1>Caminos</h1><p>Elige algo que quieras aprender. Tu progreso se adapta a ti.</p></div><div className="lm-home-tools">{returnHomeButton}<button className="lm-style-chip" onClick={() => { setLearningStyle(user.learningStyle || ''); setView('style') }}><i className="fa-solid fa-sliders" /> {user.learningStyle || 'Personalizar aprendizaje'}</button><span className="lm-streak"><i className="fa-solid fa-fire" /> {user.streak} días aprendiendo</span></div></header>
      <section className="lm-feature"><div className="lm-feature-main"><span className="lm-eyebrow">Tu camino recomendado</span><div className="lm-feature-title"><span><i className="fa-solid fa-chart-line" /></span><h2>Trading y Finanzas</h2></div><p>Entiende los mercados desde cero, aprende a leer gráficas y descubre cómo funcionan las inversiones.</p><div className="lm-feature-level">Nivel {user.level} · {user.levelLabel} <span>•</span> {completed.length} lecciones completadas</div><div className="lm-progress-line"><span><i style={{ width: `${progress}%` }} /></span><strong>{progress}%</strong></div><div className="lm-feature-actions"><button className="platform-btn-primary" onClick={openPath}>Continuar camino <i className="fa-solid fa-arrow-right" /></button><button className="platform-btn-secondary" onClick={beginDiagnostic}>Descubrir mi nivel</button></div></div><div className="lm-feature-stats"><div><span>Experiencia</span><strong>{displayXP} XP</strong></div><div><span>Siguiente lección</span><strong>{LESSONS[tradingResumeIndex]?.title || 'Camino completado'}</strong></div><div><span>Racha actual</span><strong><i className="fa-solid fa-fire" /> {user.streak} días</strong></div></div></section>
      <section className="lm-more-paths"><div className="lm-section-heading"><div><span className="lm-eyebrow">Más para descubrir</span><h2>Elige otro camino</h2></div><Link to="/explorar">Ver temas <i className="fa-solid fa-arrow-right" /></Link></div><div className="lm-category-grid">{secondaryCategories.map((category, index) => <button key={category.id} data-theme={category.id} className="lm-category-card" onClick={() => { setSelectedCat(category.id); setView('secondary') }}><span className={`lm-category-icon tone-${index % 6}`}><i className={category.icon} /></span><span><strong>{category.name}</strong><small>{MODULES_BY_CATEGORY[category.id]?.length || 0} módulos para explorar</small></span><i className={category.icon + ' lm-card-art'} /><i className="fa-solid fa-arrow-up-right-from-square lm-card-arrow" /></button>)}</div></section>
      {activeCategories.length > 0 && <p className="lm-interest-note"><i className="fa-solid fa-sparkles" /> Tus intereses incluyen {activeCategories.map((category) => category.name).join(' y ')}.</p>}
    </div>
  )

  return null
}
