/* =========================================================
   HOME.JS — Pantalla de Inicio ("¿Qué quieres descubrir hoy?")
   Funciona igual para invitados y usuarios con cuenta.
   Los invitados pueden explorar categorías y hacer el examen
   diagnóstico y los desafíos; nada de eso se guarda hasta que
   creen una cuenta.
   ========================================================= */

// Colores de fondo por categoría (gradientes, sin depender de imágenes reales/con derechos de autor)
const TOPIC_GRADIENTS = {
  trading:  "linear-gradient(160deg, #0f3d3a, #0b1f2e)",
  cine:     "linear-gradient(160deg, #3a1f4d, #1a1330)",
  libros:   "linear-gradient(160deg, #3a2a12, #201607)",
  gaming:   "linear-gradient(160deg, #2a1740, #150c2b)",
  musica:   "linear-gradient(160deg, #123a3a, #0b1f24)",
  historia: "linear-gradient(160deg, #3a2f12, #201c07)",
  ciencia:  "linear-gradient(160deg, #123a2e, #0b241d)",
  cultura:  "linear-gradient(160deg, #1c2a4a, #0d1526)",
};

function wasMissionCompletedToday(user){
  const today = new Date().toDateString();
  return user._lastMissionDate === today;
}

function completeDailyMission(user, mission){
  const today = new Date().toDateString();
  user._lastMissionDate = today;
  addXP(user, mission.xp);
  addCoins(user, mission.coins);
  unlockAchievement(user, "first_challenge");
  logActivity(user, "Completó la misión del día");
  saveUser(user);
  toast(`¡Misión completada! +${mission.xp} XP, +${mission.coins} Coins` + (user.isGuest ? " (no se guardará sin cuenta)" : ""));
}

function heroBarsHTML(){
  // Barras decorativas tipo "velas" — puramente CSS, sin imágenes ni derechos de autor
  const heights = [40, 70, 55, 90, 65, 110, 80, 60, 95, 50];
  const colors = ["#2dd4bf", "#38bdf8", "#2dd4bf", "#f87171", "#2dd4bf", "#38bdf8", "#2dd4bf", "#f87171", "#38bdf8", "#2dd4bf"];
  return `<div class="hero-chart-deco">${heights.map((h,i) => `<div class="bar" style="height:${h}px; background:${colors[i]}"></div>`).join("")}</div>`;
}

function renderGuestHero(){
  return `
    <div class="hero-banner">
      <div class="hero-eyebrow">Aprende · Descubre · Sube de nivel</div>
      <h1>Empieza tu <span class="accent">Aventura</span> en el Trading</h1>
      <p class="hero-sub">La forma más entretenida de aprender trading, finanzas y mucho más — con retos, un simulador 100% virtual y un mentor IA a tu lado.</p>
      <div class="hero-actions">
        <a href="diagnostico.html?cat=trading" class="btn btn-primary btn-hero">Empezar</a>
        <a href="register.html" class="btn btn-hero">Crear cuenta gratis</a>
      </div>
      <p class="hero-trust">Sin registro necesario para tu primer examen de nivel · Todo el trading aquí es simulado, sin dinero real.</p>
      ${heroBarsHTML()}
    </div>`;
}

function renderHome(user){
  const content = document.getElementById("page-content");

  // Trading siempre primero y destacado, para dejar claro que es el eje de la plataforma
  const orderedCategories = [
    categoryById("trading"),
    ...CATEGORIES.filter(c => c.id !== "trading"),
  ];

  const missionCat = (user.interests && user.interests.includes("trading")) ? "trading" : (user.interests[0] || "trading");
  const mission = MISSIONS_BY_CATEGORY[missionCat] || MISSIONS_BY_CATEGORY.trading;
  const missionDone = wasMissionCompletedToday(user);
  const diagDone = user.isGuest ? false : user.diagnosticoCompleted;
  const xpPct = Math.round((user.xp / user.xpToNext) * 100);

  content.innerHTML = `
    ${user.isGuest ? renderGuestHero() : ""}
    <div class="home-grid">
      <div class="home-main">
        <h1>¿Qué quieres descubrir hoy?</h1>
        <p>Aprende jugando, explora tus intereses y conviértete en experto — empezando por trading y finanzas.</p>

        <div class="section-label">Sección de intereses</div>
        <div class="topic-grid">
          ${orderedCategories.map(c => `
            <div class="topic-card ${c.id === "trading" ? "featured" : ""}" style="background-image:${TOPIC_GRADIENTS[c.id]}" data-cat="${c.id}">
              ${c.id === "trading" ? `<span class="topic-badge">Comienza aquí</span>` : ""}
              <div class="topic-icon">${c.icon}</div>
              <div class="topic-name">${c.name}</div>
            </div>`).join("")}
        </div>

        <div class="section-label">Sección de experiencia</div>
        <p class="muted" style="margin-top:-6px;">¿Cómo quieres poner a prueba tu conocimiento de trading?</p>
        <div class="experience-grid">
          <a href="experiencias.html" class="experience-card" style="display:block; color:inherit;">
            <div class="exp-icon">🎮</div>
            <h3>Desafíos</h3>
            <p>Pon a prueba tus conocimientos con retos rápidos.</p>
          </a>
          <a href="mentor.html" class="experience-card" style="display:block; color:inherit;">
            <div class="exp-icon">🤖</div>
            <h3>Mentor IA</h3>
            <p>Pregunta, conversa y aprende con NEXUS AI.</p>
          </a>
          <a href="simulador.html" class="experience-card" style="display:block; color:inherit;">
            <div class="exp-icon">📈</div>
            <h3>Simulador</h3>
            <p>Aprende tomando decisiones en escenarios virtuales de trading.</p>
          </a>
        </div>
      </div>

      <div class="home-side">
        <div class="mission-side-card">
          <div class="eyebrow">${diagDone ? "Misión del día" : "Tu primera misión"}</div>
          <h3>${diagDone ? mission.text : "Descubre tu nivel real de trading."}</h3>
          <p class="muted" style="margin-bottom:10px;">
            ${diagDone ? `Recompensa: +${mission.xp} XP · +${mission.coins} Coins` : "10 preguntas rápidas · ~3 minutos · Recompensa: +50 XP"}
          </p>
          ${diagDone
            ? (missionDone
                ? `<span class="badge success">Completada hoy ✔</span>`
                : `<button class="btn btn-primary btn-block" id="start-mission-btn">Comenzar</button>`)
            : `<a href="diagnostico.html?cat=trading" class="btn btn-primary btn-block">Comenzar</a>`}
        </div>

        <div class="stat-side-card">
          <div>🔥 Racha: <strong>${user.streak}</strong> día(s)</div>
          <div>⭐ Nivel: <strong>${user.levelLabel}</strong></div>
          <div>
            XP: ${user.xp}/${user.xpToNext}
            <div class="progress-bar mt-8"><div style="width:${xpPct}%"></div></div>
          </div>
          ${user.isGuest ? `<div class="muted" style="font-size:.78rem;">Inicia sesión para que tu XP y nivel se guarden.</div>` : ""}
        </div>
      </div>
    </div>
  `;

  content.querySelectorAll("[data-cat]").forEach(card => {
    card.onclick = () => {
      const catId = card.getAttribute("data-cat");
      if(user.isGuest){
        window.location.href = "diagnostico.html?cat=" + catId;
      } else if(!user.interests.includes(catId)){
        user.interests.push(catId);
        saveUser(user);
        toast("Categoría agregada. Redirigiendo a tu ruta de aprendizaje...");
        setTimeout(() => window.location.href = "aprender.html", 500);
      } else {
        window.location.href = "aprender.html";
      }
    };
  });

  const missionBtn = document.getElementById("start-mission-btn");
  if(missionBtn){
    missionBtn.onclick = () => {
      completeDailyMission(user, mission);
      renderHome(getUser() || user);
    };
  }
}
