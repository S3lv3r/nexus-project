import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { COURSE_ID, COURSE_LESSONS, COURSE_NAME, COURSE_TOPICS, TOTAL_LESSONS, getCourseProgress } from '../data/course'
import { GuestSignupGate } from '../components/GuestSignupGate'
import { TradingTrailMap, type TrailLessonStatus, type TrailScene } from '../components/learn/TradingTrailMap'
import { LessonView } from '../components/learn/LessonView'
import { useProfileCustomization } from '../services/profileCustomizationService'
import { Microtext, NOTE_STYLES, ROSETTE_SMALL, Rosette, SmallRosette } from '../components/note/NoteKit'

const STAGES = COURSE_TOPICS.map((topic) => ({ title: topic.shortTitle, objective: topic.summary }))

const LESSON_SCENES: Record<string, TrailScene> = {
  '1.1': 'company',
  '1.2': 'orders',
  '2.1': 'candles',
  '2.2': 'range',
  '3.3': 'simulator',
  '5.1': 'stoploss',
  '5.3': 'emotions',
  '5.5': 'backtest',
}

const WORLD_PHRASES: Record<string, string> = { city: 'la ciudad', candles: 'el Valle de las velas', island: 'la Isla del tesoro' }

const LESSONS = COURSE_LESSONS.map((lesson) => ({
  title: lesson.title,
  stageIndex: lesson.topicIndex,
  scene: LESSON_SCENES[lesson.id],
  code: lesson.id,
}))

const QUESTIONS = [
  { title: '¿Qué es una stablecoin?', answers: ['Una criptomoneda diseñada para mantener un valor estable', 'Una moneda que siempre sube', 'Una acción de una empresa'] },
  { title: '¿Has utilizado alguna vez una plataforma de trading?', answers: ['Sí, varias veces', 'La he explorado, pero no operado', 'Todavía no'] },
  { title: '¿Has visto una vela japonesa?', answers: ['Sí, y sé qué muestra', 'La he visto, pero no la entiendo aún', 'No, todavía no'] },
]

const STYLES = [
  { icon: 'fa-solid fa-seedling', title: 'Explícamelo fácil', text: 'Ejemplos cotidianos y palabras sencillas.' },
  { icon: 'fa-solid fa-book-open', title: 'Quiero aprender en detalle', text: 'Conceptos y términos de los mercados.' },
  { icon: 'fa-solid fa-wand-magic-sparkles', title: 'Quiero aprender haciendo', text: 'Gráficas y ejercicios prácticos.' },
  { icon: 'fa-solid fa-forward', title: 'Ya tengo experiencia', text: 'Avanza y repasa solo lo que necesitas.' },
]

const SURVEY_NEXT_STEPS = ['Repasarlo', 'Aplicarlo en un ejemplo', 'Continuar con el siguiente tema']

type View = 'path' | 'style' | 'diagnostic' | 'result' | 'lesson'
type LessonStatus = TrailLessonStatus

const pad = (value: number) => String(value).padStart(2, '0')


const ProgressSeal: React.FC<{ done: number; total: number }> = ({ done, total }) => {
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const ratio = total ? done / total : 0
  return (
    <div className="relative h-52 w-52 shrink-0" role="img" aria-label={`${done} de ${total} lecciones completadas`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={ROSETTE_SMALL} fill="none" stroke="var(--ink)" strokeWidth="0.35" strokeOpacity="0.55" />
      </svg>
      <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="80" cy="80" r={radius} fill="var(--surface)" stroke="var(--paper-2)" strokeWidth="7" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${circumference * ratio} ${circumference}`}
          className="transition-[stroke-dasharray] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="note-display note-num text-5xl font-black leading-none text-[var(--text)]">
          {pad(done)}
          <span className="text-2xl text-[var(--text-muted)]">/{pad(total)}</span>
        </span>
        <span className="mt-1 text-sm text-[var(--text-muted)]">lecciones</span>
      </div>
    </div>
  )
}

const FlowShell: React.FC<{ onBack: () => void; children: React.ReactNode }> = ({ onBack, children }) => (
  <div className="note-home mx-auto max-w-3xl py-6">
    <style>{NOTE_STYLES}</style>
    <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--ink)]">
      <i className="fa-solid fa-arrow-left text-xs"></i>
      Volver al camino
    </button>
    <section className="note-paper relative isolate overflow-hidden rounded-[28px] p-7 sm:p-10">
      <SmallRosette className="pointer-events-none absolute -right-14 -top-14 -z-10 h-56 w-56 opacity-50" />
      {children}
    </section>
  </div>
)

const TopicDoneModal: React.FC<{ topicIndex: number; onClose: () => void }> = ({ topicIndex, onClose }) => {
  const topic = COURSE_TOPICS[topicIndex]
  const nextTopic = COURSE_TOPICS[topicIndex + 1]
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(5,10,20,0.55)] p-4 backdrop-blur-[3px]" role="presentation" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="learn-topic-title"
        onClick={(event) => event.stopPropagation()}
        className="note-paper relative isolate w-full max-w-md overflow-hidden rounded-[28px] bg-[var(--bg-alt)] p-8 text-center"
      >
        <Rosette className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/3 opacity-70" />
        <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--paper-2)]">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ink)] text-2xl text-[var(--bg)]">
          <i className="fa-solid fa-award"></i>
        </span>
        <div className="note-wide mt-5 text-xs font-extrabold text-[var(--ink)]">TEMA {topic.number} TERMINADO</div>
        <h2 id="learn-topic-title" className="note-display mt-2 text-3xl font-black leading-tight text-[var(--text)]">{topic.shortTitle}</h2>
        <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">
          {nextTopic ? `Completaste las ${topic.lessons.length} lecciones de este tema. Lo que sigue: ${nextTopic.title}.` : 'Terminaste todos los temas del curso. Puedes repasar cualquier lección cuando quieras.'}
        </p>
        <div className="mt-7">
          <button type="button" onClick={onClose} className="note-btn note-btn-ink w-full">
            {nextTopic ? 'Seguir con el siguiente tema' : 'Volver al camino'}
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </button>
        </div>
      </section>
    </div>
  )
}

export const LearnPage: React.FC = () => {
  const { user, isGuest, completeModule, logActivity, showToast, updateUserProfile } = usePlatform()
  const [customization] = useProfileCustomization(user.username)
  const [searchParams, setSearchParams] = useSearchParams()

  const [isGuestGateOpen, setIsGuestGateOpen] = useState(isGuest)
  const [learningStyle, setLearningStyle] = useState(user.learningStyle || '')
  const [question, setQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [finishedTopic, setFinishedTopic] = useState<number | null>(null)
  const [surveyClarity, setSurveyClarity] = useState<number | null>(null)
  const [surveyNextStep, setSurveyNextStep] = useState('')

  const requestedView = searchParams.get('view')
  const requestedLesson = Number.parseInt(searchParams.get('nivel') || '1', 10)
  const lesson = Number.isFinite(requestedLesson) ? Math.min(Math.max(requestedLesson - 1, 0), LESSONS.length - 1) : 0
  const view: View =
    requestedView === 'lesson' && !isGuest
      ? 'lesson'
      : requestedView === 'diagnostic' || requestedView === 'style'
        ? requestedView
        : requestedView === 'result' && answers.length === QUESTIONS.length
          ? 'result'
          : requestedView === 'result'
            ? 'diagnostic'
            : 'path'

  const goTo = (next: View, options: { lessonIndex?: number; replace?: boolean } = {}) => {
    const params: Record<string, string> = {}
    if (next !== 'path') params.view = next
    if (next === 'lesson') params.nivel = String((options.lessonIndex ?? 0) + 1)
    setSearchParams(params, { replace: options.replace ?? false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (view !== 'lesson') return
    const savedSurvey = user.lessonSurveys?.[COURSE_ID]?.[lesson]
    setSurveyClarity(savedSurvey?.clarity ?? null)
    setSurveyNextStep(savedSurvey?.nextStep ?? '')
  }, [view, lesson])

  const course = getCourseProgress(user.moduleProgress)
  const completedSet = course.completed
  const totalLessons = TOTAL_LESSONS
  const progress = course.percent
  const resumeIndex = course.resumeIndex
  const isCourseDone = course.isDone

  const statusOf = (index: number): LessonStatus => {
    if (completedSet.has(index)) return 'completed'
    if (index === resumeIndex) return 'current'
    if (index === resumeIndex + 1) return 'available'
    return 'locked'
  }

  const openPath = (replace = false) => goTo('path', { replace })

  function openLesson(index: number) {
    if (isGuest) {
      setIsGuestGateOpen(true)
      return
    }
    goTo('lesson', { lessonIndex: index })
  }

  function completeCurrentLesson() {
    const finished = user.moduleProgress[COURSE_ID] || []
    if (finished.includes(lesson)) {
      openPath(true)
      return
    }
    completeModule(COURSE_ID, lesson)
    logActivity(`Lección completada: ${COURSE_LESSONS[lesson].id} ${COURSE_LESSONS[lesson].title}`)
    const topicIndex = COURSE_LESSONS[lesson].topicIndex
    const stageCompleted = COURSE_LESSONS.filter((item) => item.topicIndex === topicIndex).every((item) => finished.includes(item.index) || item.index === lesson)
    if (stageCompleted) setFinishedTopic(topicIndex)
    if (stageCompleted || lesson >= totalLessons - 1) {
      openPath(true)
      return
    }
    openLesson(lesson + 1)
  }

  function submitLessonSurvey() {
    if (surveyClarity === null || !surveyNextStep) {
      showToast('Responde las dos preguntas para completar la lección.', 'info')
      return
    }
    const surveys = user.lessonSurveys || {}
    updateUserProfile({
      lessonSurveys: {
        ...surveys,
        [COURSE_ID]: { ...(surveys[COURSE_ID] || {}), [lesson]: { clarity: surveyClarity, nextStep: surveyNextStep, completedAt: Date.now() } },
      },
    })
    completeCurrentLesson()
  }

  const beginDiagnostic = () => {
    setQuestion(0)
    setAnswers([])
    goTo('diagnostic')
  }

  const selectAnswer = (choice: number) =>
    setAnswers((previous) => {
      const updated = [...previous]
      updated[question] = choice
      return updated
    })

  const advanceDiagnostic = () => {
    if (answers[question] === undefined) {
      showToast('Elige una respuesta para continuar.', 'info')
      return
    }
    if (question < QUESTIONS.length - 1) setQuestion((previous) => previous + 1)
    else goTo('result')
  }

  const openStyle = () => {
    setLearningStyle(user.learningStyle || '')
    goTo('style')
  }

  const saveLearningStyle = () => {
    if (!learningStyle) {
      showToast('Selecciona una forma de aprender.', 'info')
      return
    }
    updateUserProfile({ learningStyle })
    showToast('Tu forma de aprender quedó actualizada.', 'success')
    openPath(true)
  }

  if (view === 'style') {
    return (
      <FlowShell onBack={() => openPath()}>
        <h1 className="note-display text-4xl font-black leading-tight text-[var(--text)] sm:text-5xl">¿Cómo quieres aprender?</h1>
        <p className="mt-3 text-lg text-[var(--text-muted)]">Escoge lo que se sienta mejor para ti. Puedes cambiarlo después.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {STYLES.map((style) => {
            const isSelected = learningStyle === style.title
            return (
              <button
                key={style.title}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setLearningStyle(style.title)}
                className={`flex items-start gap-4 rounded-2xl border-[1.5px] p-5 text-left transition-colors ${
                  isSelected ? 'border-[var(--ink)] bg-[color-mix(in_srgb,var(--ink)_8%,var(--surface))]' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[color-mix(in_srgb,var(--ink)_45%,var(--border))]'
                }`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${isSelected ? 'bg-[var(--ink)] text-[var(--bg)]' : 'border border-[var(--rule)] text-[var(--ink)]'}`}>
                  <i className={style.icon}></i>
                </span>
                <span>
                  <span className="note-display block text-lg font-bold text-[var(--text)]">{style.title}</span>
                  <span className="mt-1 block text-[15px] text-[var(--text-muted)]">{style.text}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
          <span className="text-[15px] text-[var(--text-muted)]">
            {user.learningStyle ? `Estilo actual: ${user.learningStyle}` : 'Tu camino se adaptará a tu preferencia.'}
          </span>
          <button type="button" onClick={saveLearningStyle} className="note-btn note-btn-ink">
            Guardar preferencia
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </button>
        </div>
      </FlowShell>
    )
  }

  if (view === 'diagnostic') {
    const current = QUESTIONS[question]
    return (
      <FlowShell onBack={() => openPath()}>
        <div className="flex items-center gap-4">
          <div className="grid flex-1 grid-cols-3 gap-1.5" aria-hidden="true">
            {QUESTIONS.map((item, index) => (
              <span key={item.title} className={`h-2 rounded-full ${index <= question ? 'bg-[var(--ink)]' : 'bg-[var(--paper-2)]'}`}></span>
            ))}
          </div>
          <span className="note-num text-sm font-medium text-[var(--text-muted)]">
            {question + 1} de {QUESTIONS.length}
          </span>
        </div>
        <h1 className="note-display mt-8 text-4xl font-black leading-tight text-[var(--text)] sm:text-5xl">Descubramos qué sabes</h1>
        <p className="mt-3 text-lg text-[var(--text-muted)]">No hay respuestas malas. Esto nos ayuda a sugerirte por dónde empezar.</p>
        <h2 className="note-display mt-8 text-2xl font-extrabold text-[var(--text)]">{current.title}</h2>
        <div className="mt-5 grid gap-3">
          {current.answers.map((answer, index) => {
            const isSelected = answers[question] === index
            return (
              <button
                key={answer}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectAnswer(index)}
                className={`flex items-center gap-4 rounded-2xl border-[1.5px] p-4 text-left transition-colors ${
                  isSelected ? 'border-[var(--ink)] bg-[color-mix(in_srgb,var(--ink)_8%,var(--surface))]' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[color-mix(in_srgb,var(--ink)_45%,var(--border))]'
                }`}
              >
                <span className={`note-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-extrabold ${isSelected ? 'bg-[var(--ink)] text-[var(--bg)]' : 'border border-[var(--rule)] text-[var(--ink)]'}`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-base font-medium text-[var(--text)]">{answer}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
          <span className="text-[15px] text-[var(--text-muted)]">Responde con tranquilidad.</span>
          <button type="button" onClick={advanceDiagnostic} className="note-btn note-btn-ink">
            {question === QUESTIONS.length - 1 ? 'Ver mi recomendación' : 'Continuar'}
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </button>
        </div>
      </FlowShell>
    )
  }

  if (view === 'result') {
    const isExperienced = answers[0] === 0 && answers[1] === 0
    const recommended = isExperienced ? Math.min(4, totalLessons - 1) : 0
    return (
      <FlowShell onBack={() => openPath()}>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ink)] text-xl text-[var(--bg)]">
          <i className="fa-solid fa-compass"></i>
        </span>
        <h1 className="note-display mt-6 text-4xl font-black leading-tight text-[var(--text)] sm:text-5xl">Tu punto de partida</h1>
        <p className="note-display mt-2 text-2xl font-bold text-[var(--ink)]">{isExperienced ? 'Principiante con experiencia' : 'Principiante'}</p>
        <p className="mt-3 text-lg leading-relaxed text-[var(--text-muted)]">
          Te recomendamos avanzar a tu ritmo, construyendo una base clara antes de explorar nuevas herramientas.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-[1.5px] border-[var(--ink)] bg-[var(--surface)] p-5">
          <div>
            <span className="note-num text-sm text-[var(--text-muted)]">
              Lección {COURSE_LESSONS[recommended].id} &middot; Tema {COURSE_LESSONS[recommended].topicNumber}
            </span>
            <strong className="note-display mt-1 block text-xl font-extrabold text-[var(--text)]">{LESSONS[recommended].title}</strong>
          </div>
          <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-sm font-semibold text-[var(--bg)]">Recomendado</span>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
          <span className="text-[15px] text-[var(--text-muted)]">Puedes recorrer el camino en el orden que prefieras.</span>
          <button type="button" onClick={() => openLesson(recommended)} className="note-btn note-btn-ink">
            Ir a mi lección
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </button>
        </div>
        {isGuest && isGuestGateOpen && <GuestSignupGate onClose={() => setIsGuestGateOpen(false)} />}
      </FlowShell>
    )
  }

  if (view === 'lesson') {
    const isLessonDone = completedSet.has(lesson)
    const current = COURSE_LESSONS[lesson]
    const isTopicClosing = COURSE_LESSONS[lesson + 1]?.topicIndex !== current.topicIndex

    const survey = (
      <section className="note-card p-6 sm:p-9">
        <h2 className="note-display text-3xl font-black text-[var(--text)]">Antes de seguir, cuéntanos</h2>
        <p className="mt-2 text-base text-[var(--text-muted)]">Tu respuesta guarda tu avance y nos ayuda a mejorar cada lección.</p>

        <fieldset className="mt-7">
          <legend className="note-display text-lg font-bold text-[var(--text)]">¿Qué tan clara fue esta lección?</legend>
          <div className="mt-3 grid max-w-xl grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const isSelected = surveyClarity === value
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSurveyClarity(value)}
                  className={`flex flex-col items-center justify-center rounded-2xl border-[1.5px] py-3 transition-colors ${
                    isSelected ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[color-mix(in_srgb,var(--ink)_45%,var(--border))]'
                  }`}
                >
                  <span className="note-display note-num text-xl font-extrabold">{value}</span>
                  <small className={`h-4 text-xs ${isSelected ? 'opacity-80' : 'text-[var(--text-muted)]'}`}>{value === 1 ? 'Poco' : value === 5 ? 'Mucho' : ''}</small>
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="note-display text-lg font-bold text-[var(--text)]">¿Qué harás con lo aprendido?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {SURVEY_NEXT_STEPS.map((choice) => {
              const isSelected = surveyNextStep === choice
              return (
                <button
                  key={choice}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSurveyNextStep(choice)}
                  className={`rounded-full border-[1.5px] px-4 py-2 text-[15px] font-medium transition-colors ${
                    isSelected ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]' : 'border-[var(--border)] text-[var(--text)] hover:border-[color-mix(in_srgb,var(--ink)_45%,var(--border))]'
                  }`}
                >
                  {choice}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
          <span className="text-[15px] text-[var(--text-muted)]">
            {isLessonDone ? 'Ya completaste esta lección. Puedes repasarla cuando quieras.' : isTopicClosing ? `Con esta lección terminas el Tema ${current.topicNumber}.` : `Siguiente: ${COURSE_LESSONS[lesson + 1]?.title}`}
          </span>
          {isLessonDone ? (
            <button type="button" onClick={() => (lesson < totalLessons - 1 ? openLesson(lesson + 1) : openPath())} className="note-btn note-btn-ink">
              {lesson < totalLessons - 1 ? 'Ir a la siguiente lección' : 'Volver al camino'}
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </button>
          ) : (
            <button
              type="button"
              onClick={submitLessonSurvey}
              disabled={surveyClarity === null || !surveyNextStep}
              className="note-btn note-btn-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              Completar y continuar
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </button>
          )}
        </div>
      </section>
    )

    return (
      <>
        <style>{NOTE_STYLES}</style>
        <LessonView key={current.id} lesson={current} learningStyle={user.learningStyle} isDone={isLessonDone} onOpenPath={() => openPath()} onOpenStyle={openStyle} footer={survey} />
      </>
    )
  }

  return (
    <div className="note-home mx-auto max-w-6xl space-y-14 py-6">
      <style>{NOTE_STYLES}</style>

      <header data-tour="learn-hero" className="note-bill note-paper note-enter relative isolate overflow-hidden rounded-[28px]">
        <Rosette className="pointer-events-none absolute -right-36 -top-44 -z-10 h-[520px] w-[520px] opacity-80" />
        <div className="absolute inset-x-6 top-4 sm:inset-x-8">
          <Microtext />
        </div>
        <div className="grid items-center gap-10 px-6 pb-10 pt-12 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14 lg:pb-12 lg:pt-14">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="note-wide text-sm font-extrabold text-[var(--ink)]">CLEVER</span>
              <span className="h-px w-10 bg-[var(--rule)]"></span>
              <span className="note-num text-sm text-[var(--text-muted)]">
                {STAGES.length} temas &middot; {totalLessons} lecciones
              </span>
            </div>
            <h1 className="note-display mt-6 pr-16 text-[clamp(2.3rem,4.6vw,4rem)] font-black leading-[0.98] text-[var(--text)] [font-stretch:100%] [text-wrap:balance] sm:pr-0">{COURSE_NAME}</h1>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-[var(--text-muted)]">
              Un tema a la vez. Construye una base sólida en economía y mercados y avanza hasta las finanzas descentralizadas.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => openLesson(resumeIndex)} className="note-btn note-btn-ink">
                {isCourseDone ? 'Repasar el camino' : completedSet.size ? 'Continuar aprendizaje' : 'Empezar el camino'}
                <i className="fa-solid fa-arrow-right text-sm"></i>
              </button>
              <button type="button" onClick={beginDiagnostic} className="note-btn note-btn-line">
                Descubrir mi nivel
              </button>
              <button type="button" data-tour="learn-style" onClick={openStyle} className="note-btn note-btn-line">
                <i className="fa-solid fa-sliders text-sm"></i>
                {user.learningStyle || '¿Cómo quieres aprender?'}
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ProgressSeal done={completedSet.size} total={totalLessons} />
            <div className="text-center">
              <div className="note-display text-lg font-extrabold text-[var(--text)]">
                {isCourseDone ? 'Curso completado' : `Tema ${course.currentTopic.number} · ${course.currentTopic.shortTitle}`}
              </div>
              <div className="note-num text-sm text-[var(--text-muted)]">{progress}% del camino</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-stretch">
        <main data-tour="learn-map" className="flex min-w-0 flex-col gap-6">
          <div className="border-b border-[var(--rule)] pb-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="note-display min-w-0 text-[26px] font-black leading-tight text-[var(--text)] sm:text-4xl">Tu mapa de lecciones</h2>
              {!isGuest && (
                <Link to="/perfil?estudio=mundo" aria-label="Cambiar mundo" className="mt-1 inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[var(--rule)] px-4 text-[14px] font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--paper)]">
                  <i className="fa-solid fa-earth-americas text-[12px]"></i>
                  <span className="hidden sm:inline">Cambiar mundo</span>
                  <span className="sm:hidden">Mundo</span>
                </Link>
              )}
            </div>
            <p className="mt-2 text-base text-[var(--text-muted)]">
              Recorre {WORLD_PHRASES[isGuest ? 'city' : customization.learnWorld]} tema por tema. Arrastra el mapa para ver todo el camino.
            </p>
            <span className="note-num mt-2 block text-sm font-semibold text-[var(--text-muted)]">
              {completedSet.size} de {totalLessons} lecciones
            </span>
          </div>
          <div className="relative h-[72vh] min-h-[520px] lg:h-auto lg:flex-1">
            <div className="absolute inset-0">
              <TradingTrailMap
                lessons={LESSONS}
                stages={STAGES}
                statusOf={statusOf}
                onOpenLesson={openLesson}
                isCourseDone={isCourseDone}
                completedCount={completedSet.size}
                world={isGuest ? 'city' : customization.learnWorld}
              />
            </div>
          </div>
        </main>

        <aside className="space-y-5">
          <section className="note-card p-6">
            <h2 className="note-display text-xl font-extrabold text-[var(--text)]">Tu progreso</h2>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="note-display note-num text-4xl font-black text-[var(--ink)]">{progress}%</span>
              <span className="note-num text-sm text-[var(--text-muted)]">
                {completedSet.size} de {totalLessons} lecciones
              </span>
            </div>
            <div className="mt-3 flex gap-1.5" aria-hidden="true">
              {COURSE_TOPICS.map((topic, topicIndex) => (
                <div key={topic.number} className="flex gap-[2px]" style={{ flexGrow: topic.lessons.length, flexBasis: 0 }}>
                  {COURSE_LESSONS.filter((item) => item.topicIndex === topicIndex).map((item) => (
                    <span key={item.id} className={`h-2 flex-1 rounded-full ${completedSet.has(item.index) ? 'bg-[var(--ink)]' : 'bg-[var(--paper-2)]'}`}></span>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-muted)]">
              {isCourseDone ? 'Camino completado. Puedes repasar tus lecciones.' : `Siguiente: ${COURSE_LESSONS[resumeIndex].id} ${COURSE_LESSONS[resumeIndex].title}`}
            </p>
          </section>

          <section className="note-card p-6">
            <h2 className="note-display text-xl font-extrabold text-[var(--text)]">Temas del curso</h2>
            <ol className="mt-4 space-y-3">
              {course.topicStats.map(({ topic, done, total }, topicIndex) => {
                const isCurrent = !isCourseDone && topicIndex === course.next.topicIndex
                return (
                  <li key={topic.number} className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] ${
                        done === total || isCurrent ? 'bg-[var(--ink)] text-[var(--bg)]' : 'border border-[var(--rule)] text-[var(--text-muted)]'
                      }`}
                    >
                      <i className={done === total ? 'fa-solid fa-check' : topic.icon}></i>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-[15px] font-semibold ${isCurrent ? 'text-[var(--ink)]' : 'text-[var(--text)]'}`}>
                        {topic.number}. {topic.shortTitle}
                      </span>
                      <span className="mt-1 block h-1 overflow-hidden rounded-full bg-[var(--paper-2)]">
                        <span className="block h-full rounded-full bg-[var(--ink)]" style={{ width: `${(done / total) * 100}%` }}></span>
                      </span>
                    </span>
                    <span className="note-num shrink-0 text-xs text-[var(--text-muted)]">
                      {done}/{total}
                    </span>
                  </li>
                )
              })}
            </ol>
          </section>

          <section className="note-paper relative isolate overflow-hidden rounded-[20px] p-6">
            <SmallRosette className="pointer-events-none absolute -bottom-10 -right-10 -z-10 h-36 w-36 opacity-50" />
            <h2 className="note-display flex items-center gap-2 text-xl font-extrabold text-[var(--text)]">
              <i className="fa-solid fa-signal text-base text-[var(--ink)]"></i>
              Tres niveles, un camino
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)]">
              Empiezas como principiante con economía y mercados, pasas a intermedio con indicadores, blockchain y riesgo, y terminas en avanzado con DeFi.
            </p>
          </section>
        </aside>
      </div>

      {finishedTopic !== null && <TopicDoneModal topicIndex={finishedTopic} onClose={() => setFinishedTopic(null)} />}
      {isGuest && isGuestGateOpen && <GuestSignupGate onClose={() => setIsGuestGateOpen(false)} />}
    </div>
  )
}
