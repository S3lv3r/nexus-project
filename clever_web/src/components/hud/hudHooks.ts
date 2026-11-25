import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** true cuando la ventana cumple la media query (ej. '(min-width: 1024px)'). */
export function useMediaQuery(query: string): boolean {
  const read = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : false
  const [matches, setMatches] = useState(read)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener?.('change', onChange)
    return () => mql.removeEventListener?.('change', onChange)
  }, [query])

  return matches
}

/**
 * Altura que le queda al elemento hasta el final de la pantalla.
 * Así el HUD ocupa exactamente la pantalla sin importar cuánto mida la barra de navegación.
 */
export function useFitHeight(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  min = 540,
  bottomGap = 28,
): number | null {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setHeight(null)
      return
    }
    const measure = () => {
      const el = ref.current
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY
      setHeight(Math.max(min, Math.round(window.innerHeight - top - bottomGap)))
    }
    measure()
    const settle = window.setTimeout(measure, 350) // vuelve a medir cuando cargan las fuentes
    window.addEventListener('resize', measure)
    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('resize', measure)
    }
  }, [ref, enabled, min, bottomGap])

  return height
}

/**
 * Hace que el elemento ocupe todo el ancho de la ventana aunque su contenedor sea más angosto
 * (así el panel puede pegarse al borde izquierdo de la página).
 * Devuelve el ancho que el elemento tenía antes de expandirse, para conservar el tamaño del contenido.
 */
export function useViewportBreakout(ref: RefObject<HTMLElement | null>, enabled: boolean): number | null {
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const reset = () => {
      el.style.marginLeft = ''
      el.style.width = ''
      el.style.maxWidth = ''
    }
    if (!enabled) {
      reset()
      setNaturalWidth(null)
      return
    }
    const apply = () => {
      reset()
      const natural = el.getBoundingClientRect().width // ancho original (el del contenedor)
      el.style.maxWidth = 'none'
      el.style.width = `${document.documentElement.clientWidth}px`
      el.style.marginLeft = '0px'
      // corrige el desfase que dejó el contenedor hasta quedar pegado al borde de la ventana
      for (let i = 0; i < 2; i++) {
        const left = el.getBoundingClientRect().left
        if (Math.abs(left) < 0.5) break
        el.style.marginLeft = `${(parseFloat(el.style.marginLeft) || 0) - left}px`
      }
      setNaturalWidth(natural > 0 ? natural : null)
    }
    apply()
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('resize', apply)
      reset()
    }
  }, [ref, enabled])

  return naturalWidth
}

/** Igual que hasScrollRoom pero en horizontal (tablas o diagramas con scroll lateral). */
function hasScrollRoomX(target: EventTarget | null, boundary: HTMLElement | null, dx: number): boolean {
  let el: HTMLElement | null =
    target instanceof HTMLElement ? target : ((target as Node | null)?.parentElement ?? null)
  while (el && el !== boundary) {
    const overflowX = getComputedStyle(el).overflowX
    if ((overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 1) {
      if (dx > 0 && el.scrollLeft + el.clientWidth < el.scrollWidth - 1) return true
      if (dx < 0 && el.scrollLeft > 0) return true
    }
    el = el.parentElement
  }
  return false
}

/** ¿Hay una ventana modal abierta (p. ej. el simulador)? Mientras la haya, la página de fondo no debe cambiar de sección. */
const modalOpen = () => !!document.querySelector('[role="dialog"]:not([aria-hidden="true"])')

/** ¿Hay un elemento con scroll propio (listas, paneles) que aún puede desplazarse en esa dirección? */
function hasScrollRoom(target: EventTarget | null, boundary: HTMLElement | null, dy: number): boolean {
  let el: HTMLElement | null =
    target instanceof HTMLElement ? target : ((target as Node | null)?.parentElement ?? null)
  while (el && el !== boundary) {
    const overflowY = getComputedStyle(el).overflowY
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
      if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true
      if (dy < 0 && el.scrollTop > 0) return true
    }
    el = el.parentElement
  }
  return false
}

interface PagerOptions {
  count: number
  /** activa la rueda y el deslizamiento táctil (solo cuando el HUD ocupa la pantalla) */
  wheelEnabled: boolean
  stageRef: RefObject<HTMLElement | null>
  lockMs?: number
  /** 'vertical' (↑ ↓ AvPág RePág) o 'both' (añade ← →, para barras horizontales) */
  keys?: 'vertical' | 'both'
  /** sección con la que arranca (por defecto, la primera) */
  initialIndex?: number
}

/**
 * Cambio de sección por tres vías: botones (goTo), rueda del mouse y flechas del teclado.
 * - Un gesto de rueda cambia una sola sección; hay que soltar la rueda un instante para otro cambio
 *   (así la inercia del trackpad no salta varias secciones).
 * - Si una lista interna aún puede desplazarse, la rueda se la deja a ella.
 */
export function useSectionPager({
  count,
  wheelEnabled,
  stageRef,
  lockMs = 1000,
  keys = 'vertical',
  initialIndex = 0,
}: PagerOptions) {
  const start = Math.max(0, Math.min(count - 1, initialIndex))
  const [index, setIndex] = useState(start)
  const indexRef = useRef(start)
  const lockedUntil = useRef(0)
  const ignoring = useRef(false)
  const lastWheel = useRef(0)
  const acc = useRef(0)

  const lock = useCallback(() => (prefersReducedMotion() ? 250 : lockMs), [lockMs])

  const goTo = useCallback(
    (next: number): boolean => {
      const clamped = Math.max(0, Math.min(count - 1, next))
      if (clamped === indexRef.current) return false
      indexRef.current = clamped
      setIndex(clamped)
      lockedUntil.current = performance.now() + lock()
      return true
    },
    [count, lock],
  )

  const step = useCallback((dir: 1 | -1) => goTo(indexRef.current + dir), [goTo])

  // rueda del mouse
  useEffect(() => {
    if (!wheelEnabled) return

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || modalOpen()) return

      const stage = stageRef.current
      const inStage = !!stage && stage.contains(e.target as Node)
      const pageScrollable = document.documentElement.scrollHeight > window.innerHeight + 4
      if (pageScrollable && !inStage) return // la página debe poder hacer scroll normal
      if (hasScrollRoom(e.target, stage, e.deltaY)) return // una lista interna aún puede desplazarse

      e.preventDefault()

      const now = performance.now()
      const gap = now - lastWheel.current
      lastWheel.current = now

      if (ignoring.current) {
        if (gap >= 140 && now >= lockedUntil.current) ignoring.current = false
        else return
      }

      if (gap > 140) acc.current = 0
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
      acc.current += e.deltaY * unit

      if (Math.abs(acc.current) >= 50) {
        const moved = step(acc.current > 0 ? 1 : -1)
        acc.current = 0
        if (moved) ignoring.current = true
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [wheelEnabled, stageRef, step])

  // flechas del teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || modalOpen()) return
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return

      let dir = 0
      if (e.key === 'ArrowDown' || e.key === 'PageDown') dir = 1
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') dir = -1
      else if (keys === 'both' && e.key === 'ArrowRight') dir = 1
      else if (keys === 'both' && e.key === 'ArrowLeft') dir = -1
      if (!dir) return

      e.preventDefault()
      if (performance.now() < lockedUntil.current) return
      step(dir as 1 | -1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, keys])

  // deslizar con el dedo (pantallas táctiles con el HUD a pantalla completa)
  useEffect(() => {
    const stage = stageRef.current
    if (!wheelEnabled || !stage) return
    let startY = 0
    const onStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0
    }
    const onEnd = (e: TouchEvent) => {
      const dy = startY - (e.changedTouches[0]?.clientY ?? startY)
      if (Math.abs(dy) < 70 || modalOpen() || hasScrollRoom(e.target, stage, dy)) return
      if (performance.now() < lockedUntil.current) return
      step(dy > 0 ? 1 : -1)
    }
    stage.addEventListener('touchstart', onStart, { passive: true })
    stage.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      stage.removeEventListener('touchstart', onStart)
      stage.removeEventListener('touchend', onEnd)
    }
  }, [wheelEnabled, stageRef, step])

  return { index, goTo, next: () => step(1), prev: () => step(-1) }
}

interface GridPagerOptions {
  /** cantidad de subtemas (slides) de cada tema */
  slideCounts: number[]
  wheelEnabled: boolean
  stageRef: RefObject<HTMLElement | null>
  lockMs?: number
  /** posición con la que abre (p. ej. la que pide la URL); por defecto, el primer tema y subtema */
  initial?: { topic: number; slide: number }
}

/**
 * Navegación en dos ejes:
 *  - Temas (vertical): rueda del mouse, ↑ ↓ AvPág RePág, deslizar hacia arriba o abajo.
 *  - Subtemas (horizontal): ← →, deslizar de lado (trackpad, Mayús + rueda o dedo).
 * Al cambiar de tema se empieza siempre por su primer subtema.
 * Un gesto cambia una sola posición; la inercia del trackpad no salta de más.
 */
export function useGridPager({ slideCounts, wheelEnabled, stageRef, lockMs = 1000, initial }: GridPagerOptions) {
  const [pos, setPos] = useState(() => initial ?? { topic: 0, slide: 0 })
  const posRef = useRef(pos)
  const counts = useRef(slideCounts)
  counts.current = slideCounts
  const lockedUntil = useRef(0)
  const ignoring = useRef(false)
  const lastWheel = useRef(0)
  const accX = useRef(0)
  const accY = useRef(0)

  const commit = useCallback(
    (next: { topic: number; slide: number }) => {
      posRef.current = next
      setPos(next)
      lockedUntil.current = performance.now() + (prefersReducedMotion() ? 250 : lockMs)
    },
    [lockMs],
  )

  const goTopic = useCallback(
    (t: number): boolean => {
      const topic = Math.max(0, Math.min(counts.current.length - 1, t))
      if (topic === posRef.current.topic) return false
      commit({ topic, slide: 0 })
      return true
    },
    [commit],
  )

  const goSlide = useCallback(
    (s: number): boolean => {
      const { topic, slide: current } = posRef.current
      const slide = Math.max(0, Math.min(counts.current[topic] - 1, s))
      if (slide === current) return false
      commit({ topic, slide })
      return true
    },
    [commit],
  )

  const stepTopic = useCallback((dir: 1 | -1) => goTopic(posRef.current.topic + dir), [goTopic])
  const stepSlide = useCallback((dir: 1 | -1) => goSlide(posRef.current.slide + dir), [goSlide])

  // rueda del mouse / trackpad
  useEffect(() => {
    if (!wheelEnabled) return

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || modalOpen()) return
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      const d = horizontal ? e.deltaX : e.deltaY

      const stage = stageRef.current
      const inStage = !!stage && stage.contains(e.target as Node)
      const pageScrollable = document.documentElement.scrollHeight > window.innerHeight + 4
      if (pageScrollable && !inStage) return
      if (horizontal ? hasScrollRoomX(e.target, stage, d) : hasScrollRoom(e.target, stage, d)) return

      e.preventDefault() // también evita el "atrás" del navegador con el deslizamiento lateral

      const now = performance.now()
      const gap = now - lastWheel.current
      lastWheel.current = now

      if (ignoring.current) {
        if (gap >= 140 && now >= lockedUntil.current) ignoring.current = false
        else return
      }

      if (gap > 140) {
        accX.current = 0
        accY.current = 0
      }
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
      const acc = horizontal ? accX : accY
      acc.current += d * unit

      if (Math.abs(acc.current) >= 50) {
        const dir = acc.current > 0 ? 1 : -1
        const moved = horizontal ? stepSlide(dir) : stepTopic(dir)
        accX.current = 0
        accY.current = 0
        if (moved) ignoring.current = true
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [wheelEnabled, stageRef, stepSlide, stepTopic])

  // flechas del teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || modalOpen()) return
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return

      let axis: 'topic' | 'slide' | null = null
      let dir: 1 | -1 = 1
      if (e.key === 'ArrowDown' || e.key === 'PageDown') axis = 'topic'
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') (axis = 'topic'), (dir = -1)
      else if (e.key === 'ArrowRight') axis = 'slide'
      else if (e.key === 'ArrowLeft') (axis = 'slide'), (dir = -1)
      if (!axis) return

      e.preventDefault()
      if (performance.now() < lockedUntil.current) return
      if (axis === 'topic') stepTopic(dir)
      else stepSlide(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stepSlide, stepTopic])

  // deslizar con el dedo
  useEffect(() => {
    const stage = stageRef.current
    if (!wheelEnabled || !stage) return
    let startX = 0
    let startY = 0
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0]?.clientX ?? 0
      startY = e.touches[0]?.clientY ?? 0
    }
    const onEnd = (e: TouchEvent) => {
      const dx = startX - (e.changedTouches[0]?.clientX ?? startX)
      const dy = startY - (e.changedTouches[0]?.clientY ?? startY)
      if (modalOpen() || performance.now() < lockedUntil.current) return
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) < 70 || hasScrollRoomX(e.target, stage, dx)) return
        stepSlide(dx > 0 ? 1 : -1)
      } else {
        if (Math.abs(dy) < 70 || hasScrollRoom(e.target, stage, dy)) return
        stepTopic(dy > 0 ? 1 : -1)
      }
    }
    stage.addEventListener('touchstart', onStart, { passive: true })
    stage.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      stage.removeEventListener('touchstart', onStart)
      stage.removeEventListener('touchend', onEnd)
    }
  }, [wheelEnabled, stageRef, stepSlide, stepTopic])

  return {
    topic: pos.topic,
    slide: pos.slide,
    goTopic,
    goSlide,
    nextTopic: () => stepTopic(1),
    prevTopic: () => stepTopic(-1),
    nextSlide: () => stepSlide(1),
    prevSlide: () => stepSlide(-1),
  }
}