import React from 'react'

const CSS = `
.atlas-root{--ax-ink:color-mix(in oklab,var(--text) 78%,transparent);--ax-soft:color-mix(in oklab,var(--text) 46%,transparent);--ax-line:color-mix(in oklab,var(--text) 17%,transparent);--ax-faint:color-mix(in oklab,var(--text) 8%,transparent);--ax-dial:color-mix(in srgb,var(--surface) 88%,transparent)}
.sc-fb{transform-box:fill-box}
.sc-oc{transform-origin:center}
.sc-ob{transform-origin:50% 100%}

.sc-drift-up{animation:sc-drift-up var(--d,5s) ease-in-out infinite}
.sc-drift-down{animation:sc-drift-down var(--d,5s) ease-in-out infinite}
.sc-drift-x{animation:sc-drift-x var(--d,6s) ease-in-out infinite}
.sc-scroll{animation:sc-scroll var(--d,6s) linear infinite}
.sc-wave{animation:sc-wave var(--d,6s) linear infinite}
.sc-fall{animation:sc-fall var(--d,2s) linear infinite}
.sc-rise{animation:sc-rise var(--d,6s) ease-in infinite}
.sc-breathe{animation:sc-breathe var(--d,6s) ease-in-out infinite}
.sc-settle{animation:sc-settle var(--d,5s) ease-in-out infinite}
.sc-cloud{animation:sc-cloud var(--d,48s) linear infinite}
.sc-haze{animation:sc-haze var(--d,16s) ease-in-out infinite}
.sc-hover{animation:sc-hover var(--d,4s) ease-in-out infinite}
.sc-push{animation:sc-push var(--d,3.6s) ease-in-out infinite}
.sc-ring{animation:sc-ring var(--d,3s) ease-out infinite}
.sc-thrust{animation:sc-thrust var(--d,1s) ease-in-out infinite}
.sc-pulse{animation:sc-pulse var(--d,3s) ease-in-out infinite}
.sc-alarm{animation:sc-alarm var(--d,1.6s) ease-out infinite}
.sc-shiver{animation:sc-shiver .24s linear infinite}
.sc-shine{animation:sc-shine 4.5s ease-in-out infinite}
.sc-gust{animation:sc-gust var(--d,2s) linear infinite}
.sc-sheen{animation:sc-sheen var(--d,6s) ease-in-out infinite}

@keyframes sc-drift-up{0%{transform:translateY(8px);opacity:0}40%,60%{opacity:.45}100%{transform:translateY(-8px);opacity:0}}
@keyframes sc-drift-down{0%{transform:translateY(-8px);opacity:0}40%,60%{opacity:.45}100%{transform:translateY(8px);opacity:0}}
@keyframes sc-drift-x{0%{transform:translateX(-8px);opacity:0}40%,60%{opacity:.35}100%{transform:translateX(8px);opacity:0}}
@keyframes sc-scroll{to{transform:translateX(-168px)}}
@keyframes sc-wave{to{transform:translateX(-80px)}}
@keyframes sc-fall{0%{transform:translateY(-24px);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateY(var(--h,200px));opacity:0}}
@keyframes sc-rise{0%{transform:translateY(0);opacity:0}20%{opacity:.6}100%{transform:translateY(var(--h,-60px));opacity:0}}
@keyframes sc-breathe{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(var(--s,1.05));opacity:1}}
@keyframes sc-settle{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}
@keyframes sc-cloud{from{transform:translateX(-70px)}to{transform:translateX(238px)}}
@keyframes sc-haze{0%,100%{transform:translateX(-8px)}50%{transform:translateX(8px)}}
@keyframes sc-hover{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
@keyframes sc-push{0%,100%{transform:translateX(0)}50%{transform:translateX(var(--px,3px))}}
@keyframes sc-thrust{0%,100%{transform:scaleY(1)}50%{transform:scaleY(var(--s,1.1))}}
@keyframes sc-pulse{0%,100%{transform:scale(1)}50%{transform:scale(var(--s,1.1))}}
@keyframes sc-alarm{0%{transform:scale(.96);opacity:.6}100%{transform:scale(1.35);opacity:0}}
@keyframes sc-shiver{0%,100%{transform:translateX(0)}25%{transform:translateX(-.6px)}75%{transform:translateX(.6px)}}
@keyframes sc-shine{0%,60%{transform:translateX(-90px)}100%{transform:translateX(130px)}}
@keyframes sc-gust{0%{transform:translateX(0);opacity:0}20%{opacity:1}100%{transform:translateX(-150px);opacity:0}}
@keyframes sc-sheen{0%,60%{transform:translateX(-140px)}100%{transform:translateX(140px)}}
@keyframes sc-ring{0%{transform:scale(.98);opacity:.55}100%{transform:scale(1.14);opacity:0}}

@media (prefers-reduced-motion:reduce){
  [class^="sc-"],[class*=" sc-"]{animation:none!important}
}
`

export const SceneStyles: React.FC = () => <style>{CSS}</style>
