import React from 'react'

/**
 * Animaciones de las tarjetas del Atlas (prefijo sc-). Son pocas y suaves: un instrumento que "respira", no una escena.
 * Las duraciones se controlan desde cada escena con la variable CSS --d. Se desactivan con "reducir movimiento".
 */
const CSS = `
.sc-fb{transform-box:fill-box}
.sc-oc{transform-origin:center}
.sc-ob{transform-origin:50% 100%}
.sc-ot{transform-origin:50% 0}

.sc-needle{animation:sc-needle 3.4s ease-in-out infinite}
.sc-scroll{animation:sc-scroll var(--d,5s) linear infinite}
.sc-bar{animation:sc-bar var(--d,2.6s) ease-in-out infinite}
.sc-dash{animation:sc-dash var(--d,1.8s) linear infinite}
.sc-pulse{animation:sc-pulse var(--d,3s) ease-in-out infinite}
.sc-blink{animation:sc-blink 2.4s ease-in-out infinite}
.sc-sheen{animation:sc-sheen var(--d,6s) ease-in-out infinite}
.sc-bob{animation:sc-bob var(--d,3.5s) ease-in-out infinite}
.sc-stripes{animation:sc-stripes var(--d,1.2s) linear infinite}
.sc-stripes-l{animation:sc-stripes var(--d,1.2s) linear infinite reverse}

@keyframes sc-needle{0%,100%{transform:rotate(-1.3deg)}50%{transform:rotate(1.3deg)}}
@keyframes sc-scroll{from{transform:translateX(0)}to{transform:translateX(-168px)}}
@keyframes sc-bar{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.09)}}
@keyframes sc-dash{from{stroke-dashoffset:0}to{stroke-dashoffset:-12}}
@keyframes sc-pulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
@keyframes sc-blink{0%,100%{opacity:.5}50%{opacity:1}}
@keyframes sc-sheen{0%,55%{transform:translateX(-60px)}100%{transform:translateX(190px)}}
@keyframes sc-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.6px)}}
@keyframes sc-stripes{from{background-position:0 0}to{background-position:18px 0}}

@media (prefers-reduced-motion:reduce){
  [class^="sc-"],[class*=" sc-"]{animation:none!important}
}
`

export const SceneStyles: React.FC = () => <style>{CSS}</style>