/* =========================================================
   APP.JS — Núcleo compartido de todo el prototipo
   - Manejo de estado en localStorage (simula backend)
   - Catálogo de categorías / módulos / misiones (simula BD)
   - Construcción dinámica de sidebar + topbar
   - Sistema de XP / Coins / Nivel / Logros
   ========================================================= */

const APP_PREFIX = "edu_"; // namespace de localStorage

/* ---------------------------------------------------------
   1. CATÁLOGO DE CATEGORÍAS
   <!-- BASE DE DATOS: esto vendrá de una tabla "categories" -->
   --------------------------------------------------------- */
const CATEGORIES = [
  { id: "trading",   name: "Trading y Finanzas", icon: "💰", desc: "Mercados, análisis y gestión de riesgo mediante simulación." },
  { id: "cine",      name: "Películas y Series",  icon: "🎬", desc: "Historia del cine, análisis narrativo y cultura audiovisual." },
  { id: "libros",    name: "Libros y Literatura", icon: "📚", desc: "Autores, movimientos literarios y análisis de obras." },
  { id: "gaming",    name: "Videojuegos",         icon: "🎮", desc: "Historia, desarrolladoras, géneros y cultura gamer." },
  { id: "musica",    name: "Música",              icon: "🎵", desc: "Géneros, teoría básica e historia musical." },
  { id: "historia",  name: "Historia",            icon: "🏛️", desc: "Eventos, procesos y análisis histórico." },
  { id: "ciencia",   name: "Ciencia",             icon: "🔬", desc: "Conceptos científicos explicados de forma interactiva." },
  { id: "cultura",   name: "Cultura General",     icon: "🌎", desc: "Un poco de todo, para curiosos sin un tema fijo." },
];

/* ---------------------------------------------------------
   2. MÓDULOS DE APRENDIZAJE POR CATEGORÍA (mapa de progreso)
   <!-- BASE DE DATOS: tabla "learning_modules" -->
   --------------------------------------------------------- */
const MODULES_BY_CATEGORY = {
  trading:  ["Fundamentos", "Análisis técnico", "Gestión de riesgo", "Psicología", "Estrategias", "Simulador", "Backtesting"],
  cine:     ["Historia del cine", "Géneros", "Dirección", "Narrativa", "Análisis", "Cultura cinematográfica"],
  libros:   ["Movimientos literarios", "Autores clave", "Géneros narrativos", "Análisis de texto", "Crítica literaria"],
  gaming:   ["Historia de los videojuegos", "Consolas y plataformas", "Géneros", "Desarrolladoras", "Cultura gamer"],
  musica:   ["Teoría básica", "Géneros musicales", "Historia de la música", "Producción", "Análisis de canciones"],
  historia: ["Civilizaciones antiguas", "Edad Media", "Edad Moderna", "Siglo XX", "Análisis de procesos históricos"],
  ciencia:  ["Método científico", "Física básica", "Biología", "Química", "Pensamiento crítico"],
  cultura:  ["Actualidad", "Curiosidades", "Arte", "Sociedad", "Ideas y filosofía"],
};

/* ---------------------------------------------------------
   3. MISIÓN DEL DÍA POR CATEGORÍA
   <!-- BASE DE DATOS: tabla "daily_missions", rotación real vendrá del backend -->
   --------------------------------------------------------- */
const MISSIONS_BY_CATEGORY = {
  trading:  { text: "Identifica una zona de soporte en el gráfico simulado.", xp: 100, coins: 50 },
  cine:     { text: "Identifica qué factor pudo influir en el éxito de una película.", xp: 100, coins: 50 },
  libros:   { text: "Relaciona a un autor con su movimiento literario.", xp: 100, coins: 50 },
  gaming:   { text: "Analiza la evolución de una franquicia de videojuegos.", xp: 100, coins: 50 },
  musica:   { text: "Identifica los elementos de un género musical.", xp: 100, coins: 50 },
  historia: { text: "Ordena una serie de eventos históricos por su impacto.", xp: 100, coins: 50 },
  ciencia:  { text: "Explica un fenómeno cotidiano usando el método científico.", xp: 100, coins: 50 },
  cultura:  { text: "Explora una curiosidad y compártela con la comunidad.", xp: 100, coins: 50 },
};

/* ---------------------------------------------------------
   4. LOGROS
   <!-- SISTEMA DE LOGROS: vendrá de tabla "achievements" + eventos de backend -->
   --------------------------------------------------------- */
const ACHIEVEMENTS = [
  { id: "first_challenge", name: "Primer reto", icon: "🏆", desc: "Completa tu primer reto." },
  { id: "first_analysis",  name: "Primer análisis", icon: "🏆", desc: "Completa tu primer análisis." },
  { id: "streak_7",        name: "7 días consecutivos", icon: "🏆", desc: "Mantén una racha de 7 días." },
  { id: "explorer",        name: "Explorador", icon: "🏆", desc: "Explora 3 categorías distintas." },
  { id: "knowledge_master",name: "Maestro del conocimiento", icon: "🏆", desc: "Alcanza el nivel 10." },
  { id: "first_sim_trade",name: "Primer trade simulado", icon: "🏆", desc: "Realiza tu primera operación en el simulador." },
];

/* ---------------------------------------------------------
   5. HELPERS DE ESTADO (localStorage)
   --------------------------------------------------------- */
function getCurrentUsername(){
  return localStorage.getItem(APP_PREFIX + "session");
}
function setCurrentUsername(username){
  localStorage.setItem(APP_PREFIX + "session", username);
}
function clearSession(){
  localStorage.removeItem(APP_PREFIX + "session");
}
function getAllUsers(){
  return JSON.parse(localStorage.getItem(APP_PREFIX + "users") || "{}");
}
function saveAllUsers(users){
  localStorage.setItem(APP_PREFIX + "users", JSON.stringify(users));
}
function getUser(username){
  const users = getAllUsers();
  return users[username || getCurrentUsername()] || null;
}
function saveUser(user){
  // Los usuarios invitados (sin cuenta) nunca se persisten: esto es lo que
  // garantiza que "no inicies sesión = no se guarda tu progreso".
  if(user.isGuest) return;
  const users = getAllUsers();
  users[user.username] = user;
  saveAllUsers(users);
}
function createDefaultUser(name, username, email){
  return {
    name, username, email,
    createdAt: Date.now(),
    onboardingCompleted: false,
    diagnosticoCompleted: false,
    interests: [],          // ids de CATEGORIES
    goal: "",
    level: 1,
    levelLabel: "Explorador",
    xp: 0,
    xpToNext: 500,
    coins: 100,
    streak: 0,
    lastActiveDate: null,
    achievements: [],
    diagnostico: {},        // resultados por categoría
    theme: "dark",
    accentColor: "#3355ff",
    avatar: null,
    cover: null,
    widgets: { mision: true, mercado: true, progreso: true, mentor: true, recomendaciones: true, racha: true, comunidad: true },
    publicProfile: { logros: true, estadisticas: true, nivel: true, actividad: true, intereses: true },
    activity: [],           // historial simple de actividad reciente
  };
}
function isLoggedIn(){
  return !!getCurrentUsername() && !!getUser();
}

/* ---------------------------------------------------------
   5b. MODO INVITADO
   Cualquier persona puede explorar la plataforma, hacer el examen
   diagnóstico y los ejercicios/retos SIN crear una cuenta.
   Nada de lo que hace un invitado se guarda de una visita a otra:
   solo Personalización, Progreso, Logros, Ranking, Perfil y
   Configuración requieren una cuenta.
   --------------------------------------------------------- */
function getGuestUser(){
  return {
    isGuest: true,
    name: "Invitado",
    username: "guest",
    interests: ["trading"],
    goal: "",
    level: 1,
    levelLabel: "Explorador",
    xp: 0,
    xpToNext: 500,
    coins: 0,
    streak: 0,
    achievements: [],
    diagnostico: {},
    theme: "dark",
    accentColor: "#2dd4bf",
    avatar: null,
    widgets: { mision: true, mercado: true, progreso: true, mentor: true, recomendaciones: true, racha: true, comunidad: true },
    publicProfile: { logros: true, estadisticas: true, nivel: true, actividad: true, intereses: true },
    activity: [],
    onboardingCompleted: true,   // el invitado no pasa por onboarding
    diagnosticoCompleted: false,
  };
}
function getCurrentUserOrGuest(){
  return getUser() || getGuestUser();
}

/* ---------------------------------------------------------
   6. GUARDAS DE NAVEGACIÓN (redirección según estado)
   --------------------------------------------------------- */
function routeAfterLogin(user){
  if(!user.onboardingCompleted){ window.location.href = "onboarding.html"; }
  else if(!user.diagnosticoCompleted){ window.location.href = "diagnostico.html"; }
  else { window.location.href = "index.html"; }
}

/* ---------------------------------------------------------
   7. XP / NIVEL / COINS / RACHA
   --------------------------------------------------------- */
function addXP(user, amount){
  user.xp += amount;
  while(user.xp >= user.xpToNext){
    user.xp -= user.xpToNext;
    user.level += 1;
    user.xpToNext = Math.round(user.xpToNext * 1.25);
    user.levelLabel = levelLabelFor(user.level);
  }
  saveUser(user);
}
function addCoins(user, amount){
  user.coins += amount;
  saveUser(user);
}
function levelLabelFor(level){
  if(level < 3) return "Explorador";
  if(level < 6) return "Aprendiz";
  if(level < 10) return "Analista";
  if(level < 15) return "Estratega";
  return "Maestro del conocimiento";
}
function registerDailyVisit(user){
  const today = new Date().toDateString();
  if(user.lastActiveDate !== today){
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    user.streak = (user.lastActiveDate === yesterday) ? user.streak + 1 : 1;
    user.lastActiveDate = today;
    saveUser(user);
  }
}
function unlockAchievement(user, achId){
  if(!user.achievements.includes(achId)){
    user.achievements.push(achId);
    saveUser(user);
    toast("🏆 Logro desbloqueado: " + (ACHIEVEMENTS.find(a=>a.id===achId)||{}).name);
  }
}
function logActivity(user, text){
  user.activity.unshift({ text, date: Date.now() });
  user.activity = user.activity.slice(0, 15);
  saveUser(user);
}

/* ---------------------------------------------------------
   8. TOAST simple (retroalimentación no intrusiva)
   --------------------------------------------------------- */
function toast(message){
  let el = document.getElementById("app-toast");
  if(!el){
    el = document.createElement("div");
    el.id = "app-toast";
    el.style.position = "fixed";
    el.style.bottom = "24px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.background = "var(--surface)";
    el.style.border = "1px solid var(--border)";
    el.style.borderRadius = "8px";
    el.style.padding = "10px 18px";
    el.style.fontSize = ".85rem";
    el.style.zIndex = "999";
    el.style.boxShadow = "0 2px 10px rgba(0,0,0,.2)";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.style.display = "block";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>{ el.style.display = "none"; }, 2600);
}

/* ---------------------------------------------------------
   9. TEMA / PERSONALIZACIÓN — aplicar al cargar cualquier página
   --------------------------------------------------------- */
function applyPersonalization(user){
  if(!user) return;
  document.documentElement.setAttribute("data-theme", user.theme || "dark");
  if(user.accentColor){
    document.documentElement.style.setProperty("--primary", user.accentColor);
  }
}

/* ---------------------------------------------------------
   10. BARRA DE NAVEGACIÓN SUPERIOR (top nav)
   Trading tiene su propio enlace fijo en la barra principal
   (Simulador) para dejar claro que es el eje central de la
   plataforma; el resto de temas viven en "Explorar".
   --------------------------------------------------------- */
const PRIMARY_NAV_ITEMS = [
  { page: "index.html",         label: "Inicio" },
  { page: "explorar.html",      label: "Explorar" },
  { page: "experiencias.html",  label: "Desafíos" },
  { page: "simulador.html",     label: "Simulador" },
  { page: "comunidad.html",     label: "Comunidad" },
];
const MORE_NAV_ITEMS = [
  { page: "aprender.html",   icon: "📚", label: "Aprender" },
  { page: "misiones.html",   icon: "🎯", label: "Misiones" },
  { page: "mercados.html",   icon: "📊", label: "Mercados" },
  { page: "analisis.html",   icon: "📉", label: "Análisis" },
  { page: "mentor.html",     icon: "🤖", label: "Mentor IA" },
  { page: "progreso.html",   icon: "📈", label: "Progreso" },
  { page: "logros.html",     icon: "🏆", label: "Logros" },
  { page: "ranking.html",    icon: "🥇", label: "Ranking" },
];

function renderTopNav(activePage, user){
  const navLinks = PRIMARY_NAV_ITEMS.map(item => `
    <a href="${item.page}" class="${item.page === activePage ? "active" : ""}">${item.label}</a>`).join("");

  const moreLinks = MORE_NAV_ITEMS.map(item => `
    <a href="${item.page}" class="${item.page === activePage ? "active" : ""}">${item.icon} ${item.label}</a>`).join("");

  let rightSide = "";
  if(user.isGuest){
    rightSide = `
      <a href="login.html" class="btn btn-sm btn-ghost">Iniciar sesión</a>
      <a href="register.html" class="btn btn-sm btn-primary">Registrarse</a>`;
  } else {
    const initials = (user.name || user.username || "U").slice(0,2).toUpperCase();
    rightSide = `
      <span class="badge">⭐ Nivel ${user.level}</span>
      <span class="badge">🪙 ${user.coins}</span>
      <details class="nav-dropdown account-dropdown">
        <summary><div class="avatar-sm">${initials}</div></summary>
        <div class="dropdown-menu">
          <a href="perfil.html">👤 Perfil</a>
          <a href="progreso.html">📈 Progreso</a>
          <a href="logros.html">🏆 Logros</a>
          <a href="ranking.html">🥇 Ranking</a>
          <a href="personalizacion.html">🎨 Personalización</a>
          <a href="configuracion.html">⚙️ Configuración</a>
          <a href="#" onclick="doLogout(); return false;">🚪 Cerrar sesión</a>
        </div>
      </details>`;
  }

  return `
    <a href="index.html" class="brand">✕ NEXUS</a>
    <nav class="primary-nav">
      ${navLinks}
      <details class="nav-dropdown">
        <summary>Más ▾</summary>
        <div class="dropdown-menu">${moreLinks}</div>
      </details>
    </nav>
    <div class="topnav-right">
      <span class="bell" title="Notificaciones">🔔</span>
      ${rightSide}
    </div>`;
}

/* Construye el shell (top nav) dentro de #app-shell-root.
   opts.requireAuth = true  -> exige cuenta real (Personalización, Progreso,
   Logros, Ranking, Perfil, Configuración). Sin cuenta, redirige a login.
   Por defecto (false) la página es utilizable como invitado, sin guardar nada. */
function initShell(activePage, opts){
  opts = opts || {};
  let user = getUser();

  if(!user){
    if(opts.requireAuth){
      window.location.href = "login.html";
      return null;
    }
    user = getGuestUser();
  } else {
    if(!user.onboardingCompleted){ window.location.href = "onboarding.html"; return null; }
    if(!user.diagnosticoCompleted){ window.location.href = "diagnostico.html"; return null; }
    registerDailyVisit(user);
  }

  applyPersonalization(user);

  const root = document.getElementById("app-shell-root");
  if(root){
    root.innerHTML = `
      <div class="app-shell">
        <header class="topnav">${renderTopNav(activePage, user)}</header>
        <main class="page-content" id="page-content"></main>
      </div>
      <!-- MENTOR IA FLOTANTE -->
      <button class="mentor-fab" id="mentor-fab" title="Preguntar a NEXUS AI">🤖</button>
      <div class="mentor-panel hidden" id="mentor-panel"></div>
    `;
    initMentorWidget(user);
  }
  return user;
}

function doLogout(){
  clearSession();
  window.location.href = "index.html";
}

/* ---------------------------------------------------------
   11. Helpers de categorías
   --------------------------------------------------------- */
function categoryById(id){ return CATEGORIES.find(c => c.id === id); }
function categoryNames(ids){ return (ids||[]).map(id => (categoryById(id)||{}).name).filter(Boolean); }
