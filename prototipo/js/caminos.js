(() => {
  const user = initShell("aprender.html");
  if (!user) return;
  const root = document.getElementById("page-content");
  root.classList.add("caminos-page");

  const levels = [
    ["Primeros pasos", ["¿Qué es invertir?", "¿Qué es un mercado?", "Riesgo vs. rendimiento", "¿Qué es una criptomoneda?"]],
    ["Entendiendo las criptomonedas", ["Bitcoin", "Ethereum", "Stablecoins", "¿Qué es una blockchain?"]],
    ["Aprende a leer el mercado", ["¿Qué es una gráfica?", "Velas japonesas", "Apertura, máximo, mínimo y cierre", "Tendencias", "Soporte y resistencia"]],
    ["Trading", ["¿Qué es hacer trading?", "Compra y venta", "Órdenes", "Stop Loss", "Take Profit", "Gestión de riesgo"]],
    ["Análisis", ["Indicadores", "Medias móviles", "RSI", "MACD", "Bollinger Bands", "Volumen", "Leer una gráfica completa"]],
    ["Práctica", ["Analiza una gráfica", "Detecta la tendencia", "Identifica soportes y resistencias", "Simulación de operación", "Primer análisis completo"]]
  ];
  const lessons = levels.flatMap(([level, items]) => items.map(title => ({ title, level })));
  const state = { view: "home", selectedStyle: "", question: 0, answers: [], lesson: 9, completed: [0, 1], simple: false, secondary: "", mockXp: 0 };
  const learningStyles = [
    ["◌", "Explícamelo fácil", "Quiero entenderlo con ejemplos cotidianos y palabras sencillas."],
    ["⌘", "Quiero aprender en detalle", "Quiero conocer los conceptos y términos utilizados en los mercados."],
    ["↗", "Quiero aprender haciendo", "Prefiero ejemplos, gráficas y ejercicios prácticos."],
    ["✦", "Ya tengo experiencia", "Quiero avanzar y saltarme los conceptos básicos."]
  ];
  const questions = [
    ["¿Qué es una stablecoin?", ["Una criptomoneda diseñada para mantener un valor estable", "Una moneda que siempre sube", "Una acción de una empresa"]],
    ["¿Has utilizado alguna vez una plataforma de trading?", ["Sí, varias veces", "La he explorado, pero no operado", "Todavía no"]],
    ["¿Has visto una vela japonesa?", ["Sí, y sé qué muestra", "La he visto, pero no la entiendo aún", "No, todavía no"]]
  ];

  const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  let xp = user.xp || 420;
  let level = user.level || 2;
  let progress = 0;
  const syncStats = () => {
    xp = (user.xp || 420) + state.mockXp;
    level = user.level || 2;
    progress = Math.round(state.completed.length / lessons.length * 100);
  };
  const page = html => { root.innerHTML = `<div class="paths">${html}</div>`; window.scrollTo({ top: 0, behavior: "smooth" }); };

  function home() {
    syncStats();
    state.view = "home";
    const secondary = CATEGORIES.filter(cat => cat.id !== "trading");
    page(`
      <header class="path-heading"><div><div class="path-kicker">Tu espacio para avanzar</div><h1>Caminos</h1><p>Elige algo que quieras aprender. Tu progreso se adapta a ti.</p></div><div class="path-streak">✦ &nbsp;${user.streak || 3} días de aprendizaje</div></header>
      <section class="path-feature"><div class="feature-main"><div class="path-eyebrow">Tu camino recomendado</div><div class="feature-title"><div class="feature-icon">↗</div><h2>Trading y Finanzas</h2></div><p>Entiende los mercados desde cero, aprende a leer gráficas y descubre cómo funcionan las inversiones.</p><div class="feature-level">Nivel ${level} · ${esc(user.levelLabel || "Principiante")} &nbsp;·&nbsp; Tu recorrido</div><div class="feature-progress"><div class="progress-bar"><div style="width:${progress}%;--progress:${progress}%"></div></div><strong>${progress}%</strong></div><div class="feature-actions"><button class="btn btn-primary" data-action="open-path">Continuar camino <span aria-hidden="true">→</span></button><button class="btn" data-action="diagnostic">Descubrir mi nivel</button></div></div><div class="feature-stats"><div class="feature-stat xp"><span>Experiencia</span><strong>${xp} XP</strong></div><div class="feature-stat"><span>Lecciones completadas</span><strong>${state.completed.length} de ${lessons.length}</strong></div><div class="feature-stat"><span>Siguiente hito</span><strong>${Math.max(0, 500 - (xp % 500))} XP restantes</strong></div></div></section>
      <section class="path-section"><div class="path-section-head"><div><div class="path-eyebrow">Sigue explorando</div><h2>Más caminos para ti</h2></div><p>Las categorías que ya conoces, en una nueva forma de aprender.</p></div><div class="path-lower"><div class="route-list">${secondary.map(cat => `<button class="route-card" data-category="${esc(cat.id)}"><span class="route-icon">${cat.icon}</span><span><strong>${esc(cat.name)}</strong><small>Explora este camino</small></span><span class="route-arrow">↗</span></button>`).join("")}</div><aside class="path-dashboard"><h3>Tu progreso</h3><div class="dashboard-current"><small>Camino actual</small><strong>Trading y Finanzas</strong></div><div class="dashboard-line"><span>Lección sugerida</span><strong>${esc(lessons[2].title)}</strong></div><div class="dashboard-line"><span>Racha</span><strong>✦ ${user.streak || 3} días</strong></div><div class="dashboard-line"><span>Próximo desbloqueo</span><strong>Gráficas avanzadas</strong></div><div class="path-badges"><span class="path-badge">✓ Primeros pasos</span><span class="path-badge">↗ ${state.completed.length} lecciones</span><span class="path-badge">✦ Curioso constante</span></div><button class="btn btn-primary btn-block mt-16" data-action="open-path">Continuar aprendiendo</button></aside></div></section>`);
    root.querySelectorAll("[data-action='open-path']").forEach(button => button.onclick = path);
    root.querySelector("[data-action='diagnostic']").onclick = () => { state.question = 0; state.answers = []; diagnostic(); };
    root.querySelectorAll("[data-category]").forEach(button => button.onclick = () => secondaryPath(button.dataset.category));
  }

  function path() {
    syncStats();
    state.view = "path";
    const groups = levels.map(([name, items], groupIndex) => {
      const start = levels.slice(0, groupIndex).reduce((sum, level) => sum + level[1].length, 0);
      const positions = [50, 72, 55, 30, 43, 68, 51];
      const points = items.map((_, i) => ({ x: positions[(i + groupIndex) % positions.length], y: 56 + i * 112 }));
      const line = points.slice(1).reduce((d, point, i) => {
        const prev = points[i];
        const middle = (prev.y + point.y) / 2;
        return `${d} C ${prev.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`;
      }, `M ${points[0].x} ${points[0].y}`);
      const stageColors = ["#48b99a", "#efad48", "#638df2", "#a278e8", "#ed7f71", "#4eb5cc"];
      return `<section class="map-level" style="--map-color:${stageColors[groupIndex]}"><header class="map-level-head"><div><div class="path-eyebrow">Etapa ${String(groupIndex + 1).padStart(2,"0")}</div><h3>${esc(name)}</h3></div><span class="map-unit-tag">${state.completed.filter(i => i >= start && i < start + items.length).length} / ${items.length} completadas</span></header><div class="map-trail"><svg class="map-trail-svg" viewBox="0 0 100 ${items.length * 112}" preserveAspectRatio="none" aria-hidden="true"><path d="${line}"/></svg>${items.map((title, i) => {
        const index = start + i;
        const status = state.completed.includes(index) ? "completed" : index === state.completed.length ? "current" : index < state.completed.length + 2 ? "available" : "locked";
        const marker = status === "completed" ? "✓" : status === "locked" ? "⌑" : status === "current" ? "▶" : "✦";
        const label = status === "completed" ? "Completada" : status === "locked" ? "Bloqueada" : status === "current" ? "Siguiente lección" : "Disponible";
        const pos = points[i].x;
        const labelX = pos > 43 ? "calc(var(--node-x) - min(225px,42%))" : "calc(var(--node-x) + 43px)";
        return `<article class="map-step ${status}" style="--node-x:${pos}%;--label-x:${labelX};--map-color:${stageColors[groupIndex]};--step-delay:${Math.min(i * 65, 390)}ms"><button class="map-node-button" data-lesson="${index}" aria-label="${esc(title)} · ${label}" ${status === "locked" ? "disabled" : ""}><span class="map-node-symbol">${marker}</span>${status === "completed" ? `<span class="map-node-stars">+${index % 3 === 0 ? 30 : 50} XP</span>` : ""}</button>${status === "current" ? `<span class="map-next-bubble">Sigue por aquí</span>` : ""}<button class="map-step-title" data-lesson="${index}" ${status === "locked" ? "disabled" : ""}><strong>${esc(title)}</strong><small>${label} · +${index % 3 === 0 ? 30 : 50} XP</small></button></article>`;
      }).join("")}</div></section>`;
    }).join("");
    page(`<nav class="path-subnav"><button data-action="home">Caminos</button><span>›</span><span>Trading y Finanzas</span></nav><div class="learning-banner"><div class="learning-banner-top"><div><div class="path-eyebrow">Tu recorrido</div><h1>Trading y Finanzas</h1><p>Un paso a la vez. Construye una base sólida antes de explorar nuevas herramientas.</p></div><div class="banner-progress"><strong>${progress}% completado</strong><div class="progress-bar"><div style="width:${progress}%"></div></div><span>${xp} XP acumulados</span></div></div></div><div class="learning-tools"><button class="btn" data-action="diagnostic">✦ Descubrir mi nivel</button><button class="btn" data-action="personalize">◉ ¿Cómo quieres aprender?</button></div><div class="learning-layout"><main class="learning-main">${groups}</main><aside class="learning-aside"><section class="side-panel"><h3>Tu experiencia</h3><div class="xp-big">${xp} XP</div><p>Nivel ${level} · ${esc(user.levelLabel || "Principiante")}</p><div class="progress-bar"><div style="width:${Math.round((xp % 500) / 5)}%"></div></div><p class="mt-8">${500 - xp % 500} XP para el siguiente nivel</p><div class="path-badges"><span class="path-badge">✦ Racha ${user.streak || 3} días</span><span class="path-badge">✓ ${state.completed.length} completadas</span></div></section><section class="side-panel"><h3>Aprender desbloquea herramientas</h3><div class="unlock-item"><span class="unlock-icon">⌁</span><span><strong>Gráficas avanzadas</strong><small>Completa 5 lecciones</small></span></div><div class="unlock-item"><span class="unlock-icon">⌗</span><span><strong>Indicadores</strong><small>Aprende sobre tendencias</small></span></div><div class="unlock-item"><span class="unlock-icon">◉</span><span><strong>Simulador</strong><small>Completa fundamentos</small></span></div></section></aside></div>`);
    root.querySelector("[data-action='home']").onclick = home;
    root.querySelector("[data-action='diagnostic']").onclick = () => { state.question = 0; state.answers = []; diagnostic(); };
    root.querySelector("[data-action='personalize']").onclick = personalize;
    root.querySelectorAll("[data-lesson]").forEach(button => button.onclick = () => { state.lesson = Number(button.dataset.lesson); lesson(); });
  }

  function flowHeader(back = "home") { return `<button class="flow-back" data-action="back">← Volver</button>`; }
  function personalize() {
    state.view = "personalize";
    page(`<section class="flow-card">${flowHeader()}<div class="path-eyebrow">Tu forma de aprender</div><h1>¿Cómo quieres aprender?</h1><p>Elige el estilo que te resulte más cómodo. Puedes cambiarlo cuando quieras.</p><div class="choice-grid">${learningStyles.map(([symbol, title, desc]) => `<button class="choice-card ${state.selectedStyle === title ? "selected" : ""}" data-style="${esc(title)}"><span class="choice-symbol">${symbol}</span><strong>${esc(title)}</strong><small>${esc(desc)}</small></button>`).join("")}</div><div class="flow-footer"><small>Tu camino se ajustará a tus preferencias.</small><button class="btn btn-primary" data-action="save-style">Guardar preferencia →</button></div></section>`);
    root.querySelector("[data-action='back']").onclick = path;
    root.querySelectorAll("[data-style]").forEach(button => button.onclick = () => { state.selectedStyle = button.dataset.style; personalize(); });
    root.querySelector("[data-action='save-style']").onclick = () => { if (!state.selectedStyle) { toast("Elige una forma de aprender para continuar"); return; } toast("Preferencia guardada para esta experiencia"); path(); };
  }

  function diagnostic() {
    state.view = "diagnostic";
    if (state.question >= questions.length) return diagnosticResult();
    const [question, options] = questions[state.question];
    const selected = state.answers[state.question];
    page(`<section class="flow-card">${flowHeader()}<div class="diagnostic-top"><div class="progress-bar"><div style="width:${(state.question + 1) / questions.length * 100}%"></div></div><small>${state.question + 1} de ${questions.length}</small></div><div class="path-eyebrow">Un punto de partida a tu medida</div><h1>Antes de comenzar, queremos saber qué tanto conoces.</h1><p>Responde con tranquilidad. Esto solo nos ayuda a recomendarte por dónde empezar.</p><h2 class="mt-24" style="font-size:1.08rem">${esc(question)}</h2><div class="option-list">${options.map((option, i) => `<button class="choice-card diagnostic-option ${selected === i ? "selected" : ""}" data-answer="${i}"><span class="choice-symbol">${String.fromCharCode(65 + i)}</span><span><strong>${esc(option)}</strong></span></button>`).join("")}</div><div class="flow-footer"><small>No hay respuestas malas.</small><button class="btn btn-primary" data-action="next-question">${state.question === questions.length - 1 ? "Ver mi punto de partida" : "Continuar →"}</button></div></section>`);
    root.querySelector("[data-action='back']").onclick = path;
    root.querySelectorAll("[data-answer]").forEach(button => button.onclick = () => { state.answers[state.question] = Number(button.dataset.answer); diagnostic(); });
    root.querySelector("[data-action='next-question']").onclick = () => { if (state.answers[state.question] === undefined) { toast("Selecciona una opción para continuar"); return; } state.question++; diagnostic(); };
  }
  function diagnosticResult() {
    const experienced = state.answers[0] === 0 && state.answers[1] === 0;
    const startIndex = experienced ? 8 : 0;
    page(`<section class="flow-card">${flowHeader()}<div class="path-eyebrow">Tu recomendación</div><h1>Tu punto de partida</h1><div class="result-medal">✦</div><h2 style="font-size:1.25rem">${experienced ? "Principiante con experiencia" : "Principiante"}</h2><p>Tu recorrido se construye a tu ritmo. Te recomendamos empezar por una base clara y avanzar cuando te sientas listo.</p><div class="result-start"><span><strong>${esc(lessons[startIndex].title)}</strong><small>Nivel ${lessons[startIndex].level} · Trading y Finanzas</small></span><span class="badge success">Recomendado</span></div><div class="flow-footer"><small>Puedes explorar cualquier lección disponible.</small><button class="btn btn-primary" data-action="start">Ir a mi camino →</button></div></section>`);
    root.querySelector("[data-action='back']").onclick = path;
    root.querySelector("[data-action='start']").onclick = () => { state.lesson = startIndex; lesson(); };
  }

  function lesson() {
    state.view = "lesson";
    const title = lessons[state.lesson].title;
    const isCandle = /vela/i.test(title);
    const technical = isCandle ? "Una vela japonesa representa cómo se movió el precio de un activo durante un periodo de tiempo. Su cuerpo muestra la apertura y el cierre; las mechas muestran los precios máximo y mínimo." : `${title} es uno de los conceptos que te ayuda a comprender cómo se comportan los mercados y tomar decisiones con más contexto.`;
    const simple = isCandle ? "Piensa en una vela como el resumen de una historia: te enseña dónde empezó y terminó el precio, y hasta dónde llegó en el camino." : `Imagina ${title.toLowerCase()} como una pieza de un mapa: entenderla te ayuda a orientarte mejor antes de dar el siguiente paso.`;
    const example = isCandle ? "Si una criptomoneda comenzó en $100 y terminó en $110, la vela muestra ese movimiento. Las mechas indican si durante ese tiempo llegó a subir o bajar más." : `Cuando aprendes sobre ${title.toLowerCase()}, puedes reconocer mejor este concepto al explorar una gráfica o un ejemplo práctico.`;
    const alreadyDone = state.completed.includes(state.lesson);
    page(`<nav class="path-subnav"><button data-action="back-home">Caminos</button><span>›</span><button data-action="back-path">Trading y Finanzas</button><span>›</span><span>Lección</span></nav><main class="lesson-page"><div class="lesson-head"><div><div class="path-eyebrow">Nivel ${levels.findIndex(item => item[0] === lessons[state.lesson].level) + 1} · Trading y Finanzas</div><h1>${esc(title)}</h1><p>${esc(technical)}</p></div><span class="lesson-step">Lección ${state.lesson + 1} de ${lessons.length}</span></div><div class="lesson-content"><section class="lesson-explain"><div class="path-eyebrow">La idea principal</div><p>${esc(technical)}</p></section><section class="simple-box"><div class="simple-box-head"><h3>En palabras simples</h3><button data-action="simplify">${state.simple ? "Ver explicación" : "Explicarlo más fácil"}</button></div><p>${esc(state.simple ? "Imagínalo como una pequeña historia visual: cada parte cuenta qué pasó y te ayuda a entender el movimiento sin memorizar términos." : simple)}</p></section>${isCandle ? `<section class="lesson-chart"><div class="chart-top"><strong>Así se ve un movimiento</strong><small>Representación ilustrativa · no es una cotización</small></div><div class="candles">${[42,65,52,75,56,82,62,91,68,78,54,70].map((height,i)=>`<span class="candle ${i===2||i===6||i===10?"down":""}" style="height:${height}px;--wick-top:${9+(i%4)*3}px;--wick-bottom:${7+(i%3)*4}px"></span>`).join("")}</div><div class="chart-labels"><span>Apertura</span><span>Movimiento del precio</span><span>Cierre</span></div></section>` : ""}<section class="example-box"><h3>✦ Ejemplo cotidiano</h3><p>${esc(example)}</p></section></div><div class="lesson-continue"><small>Al continuar, sumarás <strong>+${state.lesson % 3 === 0 ? 30 : 50} XP</strong> a tu experiencia.</small><button class="btn btn-primary" data-action="continue">${alreadyDone ? "Volver al camino" : "Entendido · Continuar →"}</button></div></main>`);
    root.querySelector("[data-action='back-home']").onclick = home;
    root.querySelector("[data-action='back-path']").onclick = path;
    root.querySelector("[data-action='simplify']").onclick = () => { state.simple = !state.simple; lesson(); };
    root.querySelector("[data-action='continue']").onclick = () => { if (!state.completed.includes(state.lesson)) { state.completed.push(state.lesson); state.completed.sort((a,b)=>a-b); state.mockXp += state.lesson % 3 === 0 ? 30 : 50; syncStats(); } questionLesson(); };
  }

  function questionLesson() {
    page(`<section class="flow-card"><div class="path-eyebrow">Un último paso</div><h1>¿Qué representa una vela japonesa?</h1><p>Comprueba lo que acabas de aprender. Es solo una pregunta de práctica.</p><div class="option-list"><button class="option-item" data-correct="false">El valor total de una empresa.</button><button class="option-item" data-correct="true">El movimiento del precio durante un periodo.</button><button class="option-item" data-correct="false">Una predicción de lo que hará el mercado.</button></div><div class="answer-feedback" aria-live="polite"></div><div class="flow-footer"><small>Tu avance se guarda en esta experiencia.</small><button class="btn btn-primary" data-action="finish">Volver al camino →</button></div></section>`);
    root.querySelectorAll("[data-correct]").forEach(button => button.onclick = () => { root.querySelectorAll("[data-correct]").forEach(item => item.classList.remove("correct", "incorrect")); button.classList.add(button.dataset.correct === "true" ? "correct" : "incorrect"); root.querySelector(".answer-feedback").textContent = button.dataset.correct === "true" ? "¡Exacto! Una vela resume el movimiento del precio. ✦" : "Casi. Recuerda: cada vela cuenta cómo se movió el precio durante un periodo."; });
    root.querySelector("[data-action='finish']").onclick = path;
  }

  function secondaryPath(categoryId) {
    const category = categoryById(categoryId);
    const modules = MODULES_BY_CATEGORY[categoryId] || [];
    const key = "_moduleProgress_" + categoryId;
    const done = user[key] || [];
    page(`<nav class="path-subnav"><button data-action="home">Caminos</button><span>›</span><span>${esc(category.name)}</span></nav><div class="learning-banner"><div class="path-eyebrow">Camino secundario</div><h1>${category.icon} ${esc(category.name)}</h1><p>${esc(category.desc)} Explora sus módulos y marca tu progreso a tu ritmo.</p></div><section class="flow-card"><h2>Tu recorrido</h2><div class="option-list">${modules.map((module,i)=>`<button class="option-item ${done.includes(i)?"correct":""}" data-module="${i}"><span>${done.includes(i)?"✓":"○"} &nbsp;${i+1}. ${esc(module)}</span><span style="float:right">${done.includes(i)?"Completado":"Marcar como visto"}</span></button>`).join("")}</div></section>`);
    root.querySelector("[data-action='home']").onclick = home;
    root.querySelectorAll("[data-module]").forEach(button => button.onclick = () => { const index = Number(button.dataset.module); user[key] = user[key] || []; if (!user[key].includes(index)) { user[key].push(index); addXP(user,30); logActivity(user,`Completó un módulo de ${category.name}`); toast("Módulo completado · +30 XP"); } saveUser(user); secondaryPath(categoryId); });
  }

  home();
})();
