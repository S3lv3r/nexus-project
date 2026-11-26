import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { COURSE_LESSONS, COURSE_TOPICS, TOTAL_LESSONS, getCourseProgress, lessonPath } from '../data/course'
import { resolveAvatarSrc } from '../data/avatarPresets'
import { LEARN_WORLDS } from '../data/profileCustomizationOptions'
import { NOTE_STYLES, Rosette } from '../components/note/NoteKit'
import { ProfileStudio, STUDIO_TAB_IDS } from '../components/profile/ProfileStudio'
import type { StudioTabId } from '../components/profile/ProfileStudio'
import { PROFILE_STYLES } from '../components/profile/ProfileVisuals'
import { CardHero, CredentialHero, LAYOUT_STYLES, OfficeHero, getFolio } from '../components/profile/ProfileLayouts'
import type { HeroProps } from '../components/profile/ProfileLayouts'
import { exportProfileCard } from '../components/profile/profileCard'
import { useProfileCustomization } from '../services/profileCustomizationService'


const SectionHead: React.FC<{ kicker: string; title: string; action?: React.ReactNode }> = ({ kicker, title, action }) => (
  <div className="mb-4 flex items-end justify-between gap-3">
    <div>
      <div className="note-wide text-[10px] font-bold text-[var(--ink)]">{kicker}</div>
      <h2 className="note-display mt-1 text-[24px] font-black leading-none text-[var(--text)]">{title}</h2>
    </div>
    {action}
  </div>
)

const GuestProfile: React.FC = () => (
  <div className="note-home mx-auto max-w-3xl py-10">
    <style>{NOTE_STYLES}</style>
    <section className="note-paper relative overflow-hidden rounded-[28px] p-8 text-center sm:p-12">
      <Rosette className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 opacity-60" />
      <div className="relative">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ink)] text-2xl text-[var(--bg)]">
          <i className="fa-solid fa-id-card"></i>
        </span>
        <h1 className="note-display mt-6 text-[40px] font-black leading-[0.95] text-[var(--text)]">Tu credencial te espera</h1>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-[var(--text-muted)]">
          Crea tu cuenta para tener un perfil propio, guardar tu avance en el curso y personalizar temas, barras y mundos.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="note-btn note-btn-ink">
            Crear cuenta gratis
            <i className="fa-solid fa-arrow-right text-[13px]"></i>
          </Link>
          <Link to="/login" className="note-btn note-btn-line">
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </section>
  </div>
)

export const ProfilePage: React.FC = () => {
  const { user, isGuest, showToast } = usePlatform()
  const [custom] = useProfileCustomization(user.username)
  const [searchParams, setSearchParams] = useSearchParams()
  const [isExporting, setIsExporting] = useState(false)

  const requested = searchParams.get('estudio') as StudioTabId | null
  const studioOpen = Boolean(requested && STUDIO_TAB_IDS.includes(requested))
  const studioTab: StudioTabId = studioOpen ? (requested as StudioTabId) : 'diseno'

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  if (isGuest) return <GuestProfile />

  const openStudio = (tab: StudioTabId) => setSearchParams({ estudio: tab })
  const changeTab = (tab: StudioTabId) => setSearchParams({ estudio: tab }, { replace: true })
  const closeStudio = () => setSearchParams({}, { replace: false })

  const displayName = user.name || user.username
  const avatarSrc = resolveAvatarSrc(user.avatar, user.username)
  const initials = (displayName || 'U').slice(0, 2).toUpperCase()
  const course = getCourseProgress(user.moduleProgress)
  const lessonsTotal = TOTAL_LESSONS
  const lessonsDone = course.done
  const topicMarks = course.topicStats.map(({ topic, done, total }) => ({ number: topic.number, label: topic.shortTitle, icon: topic.icon, done, total }))
  const currentTopicLabel = course.isDone ? 'Curso completado' : `Tema ${course.currentTopic.number} · ${course.currentTopic.shortTitle}`
  const recent = COURSE_LESSONS.filter((lesson) => course.completed.has(lesson.index)).slice(-3).reverse()
  const world = LEARN_WORLDS.find((item) => item.id === custom.learnWorld) || LEARN_WORLDS[0]
  const gap = custom.density === 'compact' ? 'space-y-5' : 'space-y-8'

  const handleExport = async () => {
    if (isExporting) return
    setIsExporting(true)
    try {
      await exportProfileCard({
        displayName,
        username: user.username,
        lessonsDone,
        lessonsTotal,
        topicsDone: course.topicsDone,
        topicsTotal: COURSE_TOPICS.length,
        progress: course.percent,
        currentTopicLabel,
        avatar: avatarSrc,
        shape: custom.avatarShape,
        initials,
        colorA: custom.bannerColorA,
        colorB: custom.bannerColorB,
        status: custom.status,
      })
      showToast('Tarjeta descargada', 'success')
    } catch {
      showToast('No se pudo generar la tarjeta', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const statusSlot = custom.status ? (
    <button
      type="button"
      onClick={() => openStudio('datos')}
      title="Editar estado"
      className="group inline-flex shrink-0 items-center gap-2 self-center rounded-full border border-[var(--rule)] bg-[var(--paper)] px-3.5 py-2 text-[14px] text-[var(--text)] transition-colors hover:border-[var(--ink)] sm:self-auto"
    >
      <i className={`${custom.statusIcon} text-[var(--ink)]`}></i>
      {custom.status}
      <i className="fa-solid fa-pen text-[10px] text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100"></i>
    </button>
  ) : (
    <button
      type="button"
      onClick={() => openStudio('datos')}
      className="inline-flex shrink-0 items-center gap-2 self-center rounded-full border border-dashed border-[var(--rule)] px-3.5 py-2 text-[14px] text-[var(--text-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] sm:self-auto"
    >
      <i className="fa-solid fa-plus text-[11px]"></i>
      Agregar un estado
    </button>
  )

  const actions = (
    <>
      <button type="button" onClick={() => openStudio('diseno')} className="note-btn note-btn-ink h-11 px-5 text-[15px]">
        <i className="fa-solid fa-wand-magic-sparkles text-[13px]"></i>
        Personalizar
      </button>
      <button type="button" onClick={handleExport} disabled={isExporting} aria-label="Descargar tarjeta" title="Descargar tarjeta" className="note-btn note-btn-line h-11 w-11 px-0 disabled:opacity-60">
        {isExporting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-download text-[14px]"></i>}
      </button>
    </>
  )

  const heroProps: HeroProps = {
    user,
    custom,
    avatarSrc,
    initials,
    displayName,
    progress: course.percent,
    topics: topicMarks,
    currentTopic: course.currentTopic.number,
    currentTopicLabel,
    folio: getFolio(user.username),
    lessonsDone,
    lessonsTotal,
    statusSlot,
    actions,
  }

  return (
    <div className={`note-home mx-auto max-w-6xl py-2 transition-[padding] duration-300 sm:py-4 ${studioOpen ? 'lg:pr-[452px]' : ''}`}>
      <style>{NOTE_STYLES}</style>
      <style>{PROFILE_STYLES}</style>
      <style>{LAYOUT_STYLES}</style>

      <div className={gap}>
        <div key={custom.profileLayout} className="note-enter">
          {custom.profileLayout === 'office' && <OfficeHero {...heroProps} />}
          {custom.profileLayout === 'card' && <CardHero {...heroProps} />}
          {custom.profileLayout === 'credential' && <CredentialHero {...heroProps} />}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <section>
            <SectionHead
              kicker="TU CURSO"
              title={`${course.topicsDone} de ${COURSE_TOPICS.length} temas terminados`}
              action={<span className="note-num text-[14px] font-semibold text-[var(--ink)]">{course.percent}%</span>}
            />
            <div className="note-card divide-y divide-[var(--rule)] overflow-hidden">
              {course.topicStats.map(({ topic, done, total }, topicIndex) => {
                const isCurrent = !course.isDone && topicIndex === course.next.topicIndex
                const isComplete = done === total
                return (
                  <div key={topic.number} className={`flex items-center gap-4 p-4 sm:px-5 ${isCurrent ? 'bg-[color-mix(in_srgb,var(--ink)_6%,transparent)]' : ''}`}>
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[15px] ${
                        isComplete || isCurrent ? 'bg-[var(--ink)] text-[var(--bg)]' : 'bg-[var(--paper-2)] text-[var(--ink)]'
                      }`}
                    >
                      <i className={isComplete ? 'fa-solid fa-check' : topic.icon}></i>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="truncate text-[15px] font-semibold text-[var(--text)]">
                          {topic.number}. {topic.shortTitle}
                        </span>
                        <span className="note-num shrink-0 text-[13px] text-[var(--text-muted)]">
                          {done}/{total}
                        </span>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {Array.from({ length: total }).map((_, i) => (
                          <span key={i} className={`h-1.5 flex-1 rounded-full ${i < done ? 'bg-[var(--ink)]' : 'bg-[var(--rule)]'}`}></span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <div className="space-y-6">
            <section>
              <SectionHead kicker="TU CAMINO" title={world.label} />
              <div className="note-card overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--ink)] text-[22px] text-[var(--bg)]">
                    <i className={world.icon}></i>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold text-[var(--text)]">{course.isDone ? 'Curso completado' : `Siguiente: lección ${course.next.id}`}</div>
                    <div className="text-[13px] leading-snug text-[var(--text-muted)]">{course.isDone ? `${lessonsDone} de ${lessonsTotal} lecciones` : course.next.title}</div>
                  </div>
                </div>
                {recent.length > 0 && (
                  <ul className="space-y-1.5 px-5 pb-1">
                    {recent.map((lesson) => (
                      <li key={lesson.id} className="flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
                        <i className="fa-solid fa-circle-check text-[11px] text-[var(--ink)]"></i>
                        <span className="note-num font-semibold text-[var(--text)]">{lesson.id}</span>
                        <span className="truncate">{lesson.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex border-t border-[var(--rule)]">
                  <Link to={course.isDone ? '/aprender' : lessonPath(course.resumeIndex)} className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[14px] font-bold text-[var(--ink)] hover:bg-[var(--paper)]">
                    {lessonsDone >= lessonsTotal ? 'Repasar' : 'Continuar'}
                    <i className="fa-solid fa-arrow-right text-[12px]"></i>
                  </Link>
                  <button type="button" onClick={() => openStudio('mundo')} className="flex flex-1 items-center justify-center gap-2 border-l border-[var(--rule)] py-3.5 text-[14px] font-semibold text-[var(--text-muted)] hover:bg-[var(--paper)] hover:text-[var(--text)]">
                    <i className="fa-solid fa-earth-americas text-[12px]"></i>
                    Cambiar mundo
                  </button>
                </div>
              </div>
            </section>

            <section>
              <SectionHead
                kicker="MI META"
                title="Hacia dónde voy"
                action={
                  <button type="button" onClick={() => openStudio('datos')} className="text-[14px] font-semibold text-[var(--ink)] hover:underline">
                    Editar
                  </button>
                }
              />
              <div className="note-card p-5">
                {user.goal ? (
                  <p className="note-display text-[20px] font-bold leading-snug text-[var(--text)]">{user.goal}</p>
                ) : (
                  <button type="button" onClick={() => openStudio('datos')} className="text-[15px] text-[var(--text-muted)] hover:text-[var(--ink)]">
                    Escribe una meta para tenerla siempre a la vista
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>

      </div>

      <ProfileStudio open={studioOpen} tab={studioTab} onTabChange={changeTab} onClose={closeStudio} />
    </div>
  )
}
