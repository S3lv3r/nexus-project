import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HudDots } from './HudDots'
import { HudFit } from './HudFit'
import { HudSidebar } from './HudSidebar'
import type { HudSection } from './HudSidebar'
import { HudSlide } from './HudSlide'
import type { SlideState } from './HudSlide'
import { HudStyles } from './HudStyles'
import { useFitHeight, useGridPager, useMediaQuery, useViewportBreakout } from './hudHooks'

/** Un subtema: una pantalla con sus tarjetas. */
export interface TopicSlide {
  id: string
  /** nombre accesible del punto (no se muestra) */
  label: string
  /** subtemas con el mismo número de grupo se agrupan en la barra de puntos */
  group?: number
  /** clases de la cuadrícula con las tarjetas (por defecto, una columna) */
  layout?: string
  /** escala mínima al ajustar a la pantalla (por defecto 0.5) */
  minScale?: number
  /** las tarjetas, cada una dentro de un <HudItem> */
  children: React.ReactNode
}

/** Un tema: una entrada de la barra lateral con uno o más subtemas. */
export interface Topic extends HudSection {
  slides: TopicSlide[]
}

interface TopicHudProps {
  topics: Topic[]
  /** cabecera fija de la página (título, botón de regreso…) */
  header: React.ReactNode
  /** nombre accesible del conjunto */
  label: string
  /** botón destacado arriba de los temas de la barra lateral */
  sidebarAction?: React.ReactNode
  /**
   * ancho mínimo del contenido (p. ej. '77rem') para pantallas con un tablero grande, como el Atlas.
   * Si la ventana no alcanza, se reduce sola. Sin esto, el contenido mide lo mismo que en acciones.
   */
  contentWidth?: string
}

/** Espacio bajo el HUD: separación (16) + barra de puntos (48). */
const DOTS_BLOCK = 64

/** Posición que pide la URL (?categoria=<tema>&tema=<subtema>); la primera si no existe. */
function positionFromParams(topics: Topic[], params: URLSearchParams): { topic: number; slide: number } {
  const topic = Math.max(0, topics.findIndex((t) => t.id === params.get('categoria')))
  const slide = Math.max(0, topics[topic].slides.findIndex((s) => s.id === params.get('tema')))
  return { topic, slide }
}

/**
 * HUD en dos ejes.
 *  - Temas: barra lateral. Cambian con los botones, la rueda del mouse o ↑ ↓ (las tarjetas suben o bajan).
 *  - Subtemas: barra de puntos. Cambian con los puntos, deslizando de lado o con ← → (las tarjetas se deslizan).
 */
export const TopicHud: React.FC<TopicHudProps> = ({ topics, header, label, sidebarAction, contentWidth }) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  // en pantallas anchas la página ocupa todo el ancho de la ventana; el contenido conserva su ancho de siempre
  const naturalWidth = useViewportBreakout(rootRef, isDesktop)
  const stageHeight = useFitHeight(stageRef, isDesktop, 360, 28 + DOTS_BLOCK)
  // la URL guarda el tema y el subtema: al recargar o compartir el enlace se abre en el mismo lugar
  const [params, setParams] = useSearchParams()
  const [initial] = useState(() => positionFromParams(topics, params))
  const { topic, slide, goTopic, goSlide, nextTopic, prevTopic, nextSlide, prevSlide } = useGridPager({
    slideCounts: topics.map((t) => t.slides.length),
    wheelEnabled: isDesktop,
    stageRef,
    initial,
  })

  const topicId = topics[topic].id
  const slideId = topics[topic].slides[slide].id
  useEffect(() => {
    setParams(
      (prev) => {
        if (prev.get('categoria') === topicId && prev.get('tema') === slideId) return prev
        const next = new URLSearchParams(prev)
        next.set('categoria', topicId)
        next.set('tema', slideId)
        return next
      },
      { replace: true },
    )
  }, [topicId, slideId, setParams])

  // el primer tema también entra con animación
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const stateOf = (t: number, s: number): SlideState => {
    if (!ready) return 'below'
    if (t === topic) return s === slide ? 'active' : s < slide ? 'left' : 'right'
    return t < topic ? 'above' : 'below'
  }

  const current = topics[topic]
  // tamaños de los grupos de puntos del tema actual, p. ej. [4, 3, 2, 2]
  const groups: number[] = []
  current.slides.forEach((s, i) => {
    if (i > 0 && s.group === current.slides[i - 1].group) groups[groups.length - 1] += 1
    else groups.push(1)
  })

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label={label}
      style={
        naturalWidth
          ? ({ '--hud-w': contentWidth ? `max(calc(${naturalWidth}px - 16.5rem), ${contentWidth})` : `calc(${naturalWidth}px - 16.5rem)` } as React.CSSProperties)
          : contentWidth
            ? ({ '--hud-w': contentWidth } as React.CSSProperties)
            : undefined
      }
      className="relative isolate mx-auto w-full max-w-7xl py-4"
    >
      <HudStyles />

      <p aria-live="polite" className="sr-only">
        Tema {topic + 1} de {topics.length}: {current.label}. Subtema {slide + 1} de {current.slides.length}.
      </p>

      <div className="grid gap-x-6 gap-y-5 lg:grid-cols-[minmax(15rem,1fr)_minmax(0,var(--hud-w,63.5rem))_1fr] lg:gap-y-6 lg:px-6">
        <header className="lg:col-start-2 lg:row-start-1">{header}</header>

        {/* temas: pegados al borde izquierdo de la página */}
        <HudSidebar
          sections={topics}
          index={topic}
          onSelect={goTopic}
          onPrev={prevTopic}
          onNext={nextTopic}
          className="lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start"
          hintTitle="Cambia de categoría"
          hintText="con la lista o con estas flechas"
          mobileGrid="grid-cols-2 sm:grid-cols-3"
          topAction={sidebarAction}
        />

        <div className="lg:col-start-2 lg:row-start-2">
          {/* en pantallas anchas ocupa exactamente lo que queda de la pantalla */}
          <div
            ref={stageRef}
            style={
              {
                '--hud-travel': '100vh',
                '--hud-travel-x': '100vw',
                ...(isDesktop ? { height: stageHeight ?? 'calc(100vh - 20rem)' } : {}),
              } as React.CSSProperties
            }
            className="relative grid overflow-hidden lg:-mx-4"
          >
            {topics.map((t, ti) =>
              t.slides.map((s, si) => (
                <HudSlide
                  key={`${t.id}-${s.id}`}
                  id={si === 0 ? `hud-panel-${t.id}` : `hud-panel-${t.id}-${si}`}
                  tabId={`hud-tab-${t.id}`}
                  state={stateOf(ti, si)}
                  padding="px-0 py-2 lg:px-4"
                  collapseInactive
                >
                  <HudFit enabled={isDesktop} minScale={s.minScale} className={s.layout ?? 'grid gap-5'}>
                    {s.children}
                  </HudFit>
                </HudSlide>
              )),
            )}
          </div>

          <HudDots
            count={current.slides.length}
            index={slide}
            groups={groups}
            labels={current.slides.map((s) => s.label)}
            onSelect={goSlide}
            onPrev={prevSlide}
            onNext={nextSlide}
          />
        </div>
      </div>
    </div>
  )
}