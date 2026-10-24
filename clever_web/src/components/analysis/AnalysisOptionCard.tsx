import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ------------------------------------------------------------------ */
/* Tema de color de cada tarjeta (clases completas para Tailwind)      */
/* ------------------------------------------------------------------ */

export interface AnalysisOptionTheme {
  /** degradado pastel muy leve del fondo decorativo */
  surface: string
  /** manchas de color difuminadas que flotan despacio */
  blobA: string
  blobB: string
  /** color de la trama de puntos */
  dots: string
  /** color (rgba) del foco de luz que sigue al mouse */
  spotlight: string
  /** borde normal y al pasar el mouse */
  border: string
  /** sombra de color al pasar el mouse */
  glow: string
  /** etiqueta superior */
  chip: string
  chipDot: string
  /** botón "Explorar" y su círculo con flecha */
  cta: string
  ctaIcon: string
  /** anillo de foco (teclado) */
  ring: string
  /** anillo cuando la tarjeta está marcada como seleccionada */
  selected: string
}

export interface AnalysisOptionCardProps {
  eyebrow: string
  title: string
  description: string
  /** ruta a la que navega al hacer clic (ej. '/analisis/acciones') */
  to: string
  /** resalta la tarjeta (ej. si es la sección actual) */
  selected?: boolean
  theme: AnalysisOptionTheme
  /** ilustración animada; reacciona al hover/foco de la tarjeta mediante las clases `ao-*` */
  Illustration: React.FC<{ active: boolean }>
  /** retraso de la animación de entrada, en ms */
  delay?: number
  /** versión compacta (texto a la izquierda, ilustración a la derecha) para espacios con poca altura */
  compact?: boolean
  /** anima su propia entrada al aparecer; desactívalo si un contenedor ya la anima */
  reveal?: boolean
}

/* ------------------------------------------------------------------ */
/* Animaciones (keyframes). Tailwind no las trae, así que van aquí:    */
/* el componente es autocontenido y no hay que tocar tailwind.config.  */
/* ------------------------------------------------------------------ */

const ON = '.ao-root:is(:hover,:focus-visible,[data-active="true"])'

const CSS = `
.ao-origin-b{transform-box:fill-box;transform-origin:50% 100%}
.ao-origin-c{transform-box:fill-box;transform-origin:50% 50%}

/* fondo decorativo */
.ao-blob-a{animation:ao-drift-a 14s ease-in-out infinite}
.ao-blob-b{animation:ao-drift-b 18s ease-in-out infinite}
@keyframes ao-drift-a{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(18px,14px) scale(1.12)}}
@keyframes ao-drift-b{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-16px,-10px) scale(1.1)}}
.ao-shine{position:absolute;top:0;bottom:0;left:0;width:45%;pointer-events:none;opacity:0;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);
  transform:translateX(-130%) skewX(-18deg)}
${ON} .ao-shine{animation:ao-shine 1s ease-out}
@keyframes ao-shine{0%{opacity:0;transform:translateX(-130%) skewX(-18deg)}20%{opacity:1}100%{opacity:0;transform:translateX(330%) skewX(-18deg)}}

/* acciones: barras que se reconstruyen, línea que se dibuja y punto que la recorre */
.ao-bar{animation:ao-breathe 4.5s ease-in-out infinite;animation-delay:calc(var(--i,0)*.35s)}
${ON} .ao-bar{animation:ao-rise .9s cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--i,0)*70ms)}
@keyframes ao-breathe{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.94)}}
@keyframes ao-rise{from{transform:scaleY(.3);opacity:.5}to{transform:scaleY(1);opacity:1}}
.ao-line{stroke-dasharray:1;stroke-dashoffset:0}
${ON} .ao-line{animation:ao-draw 1.1s ease-out .15s both}
@keyframes ao-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
${ON} .ao-area{animation:ao-fade .9s ease-out .5s both}
@keyframes ao-fade{from{opacity:0}to{opacity:1}}
.ao-dot{stroke-dasharray:.001 2;stroke-dashoffset:-.998}
${ON} .ao-dot{animation:ao-travel 1.1s ease-out .15s both}
@keyframes ao-travel{from{stroke-dashoffset:0}to{stroke-dashoffset:-.998}}
${ON} .ao-pop{animation:ao-pop .6s cubic-bezier(.34,1.56,.64,1) .85s both}
@keyframes ao-pop{from{opacity:0;transform:translateY(8px) scale(.7)}to{opacity:1;transform:translateY(0) scale(1)}}
.ao-twinkle{animation:ao-twinkle 3.2s ease-in-out infinite;animation-delay:calc(var(--i,0)*.8s)}
@keyframes ao-twinkle{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}

/* criptos: moneda que flota y gira, red que se enciende y chispas */
.ao-float{animation:ao-float 5.5s ease-in-out infinite}
@keyframes ao-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
${ON} .ao-flip{animation:ao-flip .9s cubic-bezier(.45,0,.25,1) .05s both}
@keyframes ao-flip{0%{transform:scaleX(1)}45%{transform:scaleX(.04)}100%{transform:scaleX(1)}}
.ao-orbit{animation:ao-spin 30s linear infinite}
@keyframes ao-spin{to{transform:rotate(360deg)}}
.ao-glow{animation:ao-glow 4.5s ease-in-out infinite}
@keyframes ao-glow{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.95;transform:scale(1.08)}}
.ao-ring{opacity:0}
${ON} .ao-ring{animation:ao-ring 1.8s ease-out infinite}
@keyframes ao-ring{0%{opacity:.7;transform:scale(.9)}100%{opacity:0;transform:scale(1.5)}}
.ao-link{stroke-dasharray:1;stroke-dashoffset:0;opacity:.55}
${ON} .ao-link{opacity:1;animation:ao-draw .9s ease-out both;animation-delay:calc(var(--i,0)*90ms)}
.ao-node{animation:ao-node 4s ease-in-out infinite;animation-delay:calc(var(--i,0)*.6s)}
${ON} .ao-node{animation:ao-node-in .6s cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--i,0)*90ms + .3s)}
@keyframes ao-node{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
@keyframes ao-node-in{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}
.ao-spark{opacity:0}
${ON} .ao-spark{animation:ao-spark 1.6s ease-out infinite;animation-delay:calc(var(--i,0)*.22s)}
@keyframes ao-spark{0%{opacity:0;transform:translate(0,0) scale(.5)}20%{opacity:1}100%{opacity:0;transform:translate(var(--dx,0px),var(--dy,0px)) scale(1)}}

@media (prefers-reduced-motion:reduce){
  .ao-root *{animation:none!important;transition:none!important}
  .ao-shine,.ao-spark{display:none}
}
`

const AnalysisOptionStyles: React.FC = () => <style>{CSS}</style>

const ArrowIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    className={`h-4 w-4 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Botón-tarjeta de cada tipo de análisis.
 * - Entrada suave y escalonada al aparecer en pantalla.
 * - Con el mouse: ligera inclinación 3D, foco de luz que lo sigue y destello que cruza la tarjeta.
 * - La ilustración se "reproduce" al pasar el mouse o enfocar con teclado.
 */
export const AnalysisOptionCard: React.FC<AnalysisOptionCardProps> = ({
  eyebrow,
  title,
  description,
  to,
  selected = false,
  theme,
  Illustration,
  delay = 0,
  compact = false,
  reveal = true,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const [shown, setShown] = useState(!reveal)

  // entrada al aparecer en pantalla (solo si la tarjeta anima su propia entrada)
  useEffect(() => {
    if (!reveal) return
    const el = wrapRef.current
    if (!el) return
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reveal])

  const setVars = (vars: Record<string, string>) => {
    const el = linkRef.current
    if (!el) return
    Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v))
  }
  const resetTilt = () => setVars({ '--rx': '0deg', '--ry': '0deg', '--ty': '0px', '--s': '1' })

  const onPointerEnter = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === 'mouse' && !prefersReducedMotion()) setVars({ '--ty': '-6px' })
  }
  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = linkRef.current
    if (!el || e.pointerType !== 'mouse' || prefersReducedMotion()) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setVars({
      '--mx': `${(px * 100).toFixed(1)}%`,
      '--my': `${(py * 100).toFixed(1)}%`,
      '--rx': `${((0.5 - py) * 6).toFixed(2)}deg`,
      '--ry': `${((px - 0.5) * 8).toFixed(2)}deg`,
    })
  }

  return (
    <div
      ref={wrapRef}
      style={reveal ? { transitionDelay: `${delay}ms` } : undefined}
      className={
        reveal
          ? `h-full transition duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-[0.97] opacity-0'
            }`
          : 'h-full'
      }
    >
      <AnalysisOptionStyles />

      <Link
        ref={linkRef}
        to={to}
        data-active={selected ? 'true' : undefined}
        aria-current={selected ? 'page' : undefined}
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={resetTilt}
        onPointerDown={() => setVars({ '--s': '0.985' })}
        onPointerUp={() => setVars({ '--s': '1' })}
        onPointerCancel={resetTilt}
        style={{
          transform:
            'perspective(1100px) translateY(var(--ty,0px)) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--s,1))',
        }}
        className={`ao-root group relative flex h-full flex-col overflow-hidden rounded-[2rem] border-2 bg-white shadow-sm shadow-slate-200/60 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none ${
          compact
            ? 'min-h-0 p-5 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] sm:items-center sm:gap-x-4'
            : 'min-h-[380px] p-7 sm:p-8'
        } ${theme.border} ${theme.glow} ${theme.ring} ${selected ? theme.selected : ''}`}
      >
        {/* fondo decorativo: pastel muy leve */}
        <span aria-hidden="true" className={`pointer-events-none absolute inset-0 ${theme.surface}`} />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${theme.dots}`}
          style={{
            backgroundImage: 'radial-gradient(currentColor 1.1px, transparent 1.1px)',
            backgroundSize: '20px 20px',
            maskImage: 'linear-gradient(to bottom right, black, transparent 55%)',
            WebkitMaskImage: 'linear-gradient(to bottom right, black, transparent 55%)',
          }}
        />
        <span
          aria-hidden="true"
          className={`ao-blob-a pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full blur-3xl ${theme.blobA}`}
        />
        <span
          aria-hidden="true"
          className={`ao-blob-b pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full blur-3xl ${theme.blobB}`}
        />

        {/* foco de luz que sigue al mouse y destello */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(380px circle at var(--mx, 50%) var(--my, 40%), ${theme.spotlight}, transparent 65%)`,
          }}
        />
        <span aria-hidden="true" className="ao-shine" />

        {/* contenido */}
        <span className={`relative z-10 flex items-center justify-between ${compact ? 'sm:col-start-1 sm:row-start-1' : ''}`}>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ring-1 backdrop-blur ${theme.chip}`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-60 group-hover:animate-ping ${theme.chipDot}`}
              />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${theme.chipDot}`} />
            </span>
            {eyebrow}
          </span>
        </span>

        <span className={`relative z-10 block ${compact ? 'mt-3 sm:col-start-1 sm:row-start-2' : 'mt-5'}`}>
          <span
            className={`block font-semibold tracking-tight text-slate-800 ${
              compact ? 'text-xl' : 'text-2xl sm:text-[1.75rem]'
            }`}
          >
            {title}
          </span>
          <span className={`mt-2 block max-w-xs leading-relaxed text-slate-500 ${compact ? 'text-xs' : 'text-sm'}`}>
            {description}
          </span>
        </span>

        <span
          className={`relative z-10 flex items-center justify-center ${
            compact ? 'my-2 sm:col-start-2 sm:row-span-3 sm:row-start-1 sm:my-0' : 'my-4 flex-1'
          }`}
        >
          <span
            className={`block w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none ${
              compact ? 'max-w-[200px]' : 'max-w-[290px]'
            }`}
          >
            <Illustration active={selected} />
          </span>
        </span>

        <span className={`relative z-10 flex items-center ${compact ? 'mt-3 sm:col-start-1 sm:row-start-3' : ''}`}>
          <span
            className={`inline-flex items-center rounded-full font-semibold ring-1 backdrop-blur transition duration-300 ${
              compact ? 'gap-2 py-1 pl-4 pr-1 text-xs' : 'gap-3 py-1.5 pl-5 pr-1.5 text-sm'
            } ${theme.cta}`}
          >
            {selected ? 'Seleccionado' : 'Explorar'}
            <span
              className={`relative flex items-center justify-center overflow-hidden rounded-full transition duration-300 ${
                compact ? 'h-8 w-8' : 'h-9 w-9'
              } ${theme.ctaIcon}`}
            >
              <ArrowIcon className="absolute transition duration-300 ease-out group-hover:translate-x-8 group-hover:opacity-0" />
              <ArrowIcon className="absolute -translate-x-8 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
            </span>
          </span>
        </span>
      </Link>
    </div>
  )
}