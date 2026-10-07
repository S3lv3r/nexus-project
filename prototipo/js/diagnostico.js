/* =========================================================
   DIAGNOSTICO.JS — Diagnóstico inicial adaptativo
   <!-- BASE DE DATOS: este banco de preguntas vendrá de una
        tabla "diagnostic_questions" filtrable por categoría -->
   10 preguntas ficticias por categoría, con distintos formatos:
   opción múltiple, verdadero/falso, escenario, ordenar.
   El objetivo es medir razonamiento, no solo memoria.
   ========================================================= */

const DIAGNOSTIC_QUESTIONS = {
  trading: [
    { type: "mcq", q: "¿Qué es una vela japonesa en un gráfico de precios?", options: ["Un tipo de indicador de volumen", "Una representación visual del precio en un periodo", "Un tipo de criptomoneda", "Un patrón de noticias"], correct: 1 },
    { type: "tf", q: "Un 'soporte' es un nivel donde el precio tiende a dejar de caer.", correct: true },
    { type: "mcq", q: "¿Qué mide principalmente la 'gestión de riesgo'?", options: ["Cuánto puedes ganar en una operación", "Cuánto estás dispuesto a perder antes de operar", "El precio futuro de un activo", "El sentimiento del mercado"], correct: 1 },
    { type: "scenario", q: "BTC acaba de llegar a una resistencia. ¿Qué harías?", options: ["Comprar de inmediato sin más análisis", "Esperar confirmación de ruptura o rechazo antes de decidir", "Vender todo sin analizar el contexto", "Ignorar el nivel por completo"], correct: 1 },
    { type: "mcq", q: "¿Qué es una 'tendencia alcista'?", options: ["Una serie de máximos y mínimos descendentes", "Una serie de máximos y mínimos ascendentes", "Un mercado sin dirección clara", "Un tipo de orden de compra"], correct: 1 },
    { type: "tf", q: "El RSI puede ayudar a identificar condiciones de sobrecompra o sobreventa.", correct: true },
    { type: "mcq", q: "¿Cuál de estos NO es un factor de psicología de trading?", options: ["Miedo a perderse una oportunidad (FOMO)", "Aversión a la pérdida", "El color de la aplicación de trading", "Exceso de confianza tras una racha ganadora"], correct: 2 },
    { type: "mcq", q: "¿Qué caracteriza principalmente a las criptomonedas frente a las acciones tradicionales?", options: ["Cotizan las 24 horas y suelen ser más volátiles", "No tienen ningún riesgo", "Siempre suben de precio", "Están reguladas igual que las acciones"], correct: 0 },
    { type: "order", q: "Ordena estos pasos de un análisis de riesgo básico (del primero al último):", options: ["Definir cuánto estás dispuesto a perder", "Analizar el activo", "Ejecutar la operación", "Revisar el resultado"], correctOrder: [1,0,2,3] },
    { type: "mcq", q: "¿Qué es un ETF?", options: ["Un fondo que agrupa varios activos y cotiza como una acción", "Una moneda digital", "Un indicador técnico", "Un tipo de vela japonesa"], correct: 0 },
  ],
  cine: [
    { type: "mcq", q: "¿Qué es el montaje cinematográfico?", options: ["El guion de la película", "El proceso de ordenar tomas para construir significado", "El casting de actores", "La banda sonora"], correct: 1 },
    { type: "tf", q: "El cine mudo precede históricamente al cine sonoro.", correct: true },
    { type: "scenario", q: "Una película tuvo enorme taquilla pero críticas negativas. ¿Qué información adicional necesitarías para analizar su impacto?", options: ["Ninguna, la taquilla ya lo dice todo", "Datos de audiencia, contexto de estreno y comparación con películas similares", "Solo el nombre del director", "El presupuesto de marketing únicamente"], correct: 1 },
    { type: "mcq", q: "¿Qué géneros combina comúnmente el 'neo-noir'?", options: ["Comedia romántica y musical", "Crimen y misterio con estética visual oscura", "Documental y animación infantil", "Ciencia ficción dura y western"], correct: 1 },
    { type: "mcq", q: "¿Qué función cumple un director de fotografía?", options: ["Escribe los diálogos", "Diseña la iluminación y composición visual", "Edita el sonido", "Produce el catering del set"], correct: 1 },
    { type: "tf", q: "Una franquicia exitosa siempre garantiza que su siguiente entrega también lo sea.", correct: false },
    { type: "mcq", q: "¿Qué es un 'plano secuencia'?", options: ["Una escena filmada en un solo toma continuo", "Un tráiler oficial", "Un tipo de guion", "Un efecto de sonido"], correct: 0 },
    { type: "order", q: "Ordena estas etapas de producción de una película (de la primera a la última):", options: ["Preproducción", "Rodaje", "Posproducción", "Estreno"], correctOrder: [0,1,2,3] },
    { type: "mcq", q: "¿Qué distingue al cine de autor del cine comercial?", options: ["El presupuesto siempre es mayor", "Prioriza la visión personal del director sobre fórmulas de taquilla", "Nunca tiene actores conocidos", "Se filma solo en blanco y negro"], correct: 1 },
    { type: "mcq", q: "¿Qué es un 'spin-off'?", options: ["Una nueva obra derivada de un personaje o universo existente", "El tráiler de una película", "Un tipo de cámara", "El nombre del estudio productor"], correct: 0 },
  ],
  libros: [
    { type: "mcq", q: "¿Qué caracteriza al 'realismo mágico'?", options: ["Mezclar elementos fantásticos con la realidad cotidiana de forma natural", "Solo escribir sobre ciencia ficción", "Evitar cualquier elemento simbólico", "Ser exclusivo de la poesía"], correct: 0 },
    { type: "tf", q: "Un narrador en primera persona cuenta la historia como 'yo'.", correct: true },
    { type: "scenario", q: "Un autor ha tenido varios libros exitosos. ¿Qué datos analizarías antes de predecir el comportamiento de su siguiente publicación?", options: ["Nada, el éxito pasado garantiza el futuro", "Ventas históricas, crítica, cambios de género o estilo", "Solo la portada del libro", "El número de páginas"], correct: 1 },
    { type: "mcq", q: "¿Qué es un 'movimiento literario'?", options: ["Un grupo de autores con enfoques estéticos o temáticos compartidos en una época", "Una editorial específica", "Un tipo de encuadernación", "Un premio literario"], correct: 0 },
    { type: "mcq", q: "¿A qué movimiento se asocia comúnmente Gabriel García Márquez?", options: ["Realismo mágico", "Futurismo", "Romanticismo alemán", "Naturalismo francés"], correct: 0 },
    { type: "tf", q: "La crítica literaria solo evalúa si un libro fue exitoso comercialmente.", correct: false },
    { type: "mcq", q: "¿Qué es un 'narrador omnisciente'?", options: ["Uno que solo conoce los pensamientos de un personaje", "Uno que conoce pensamientos y hechos de todos los personajes", "Uno que nunca aparece en la historia", "Un personaje secundario"], correct: 1 },
    { type: "order", q: "Ordena estas etapas del análisis de una obra literaria (de la primera a la última):", options: ["Lectura completa", "Identificar temas y estructura", "Contextualizar históricamente", "Formular una interpretación"], correctOrder: [0,1,2,3] },
    { type: "mcq", q: "¿Qué distingue a la novela del cuento?", options: ["La novela suele tener mayor extensión y desarrollo argumental", "El cuento siempre es más largo", "No hay diferencia real", "El cuento nunca tiene personajes"], correct: 0 },
    { type: "mcq", q: "¿Qué es la 'voz narrativa'?", options: ["La perspectiva y tono desde el que se cuenta la historia", "El volumen de un audiolibro", "El nombre del editor", "El tipo de letra usado"], correct: 0 },
  ],
  gaming: [
    { type: "mcq", q: "¿Qué generación de consolas introdujo ampliamente los gráficos 3D en el mercado masivo?", options: ["Quinta generación (PlayStation, N64)", "Primera generación (Atari)", "Consolas portátiles actuales", "Ninguna, siempre fue 3D"], correct: 0 },
    { type: "tf", q: "Un 'roguelike' se caracteriza por generación procedural y permadeath.", correct: true },
    { type: "scenario", q: "Una franquicia tiene millones de jugadores, pero su último lanzamiento recibió malas críticas. ¿Cómo evaluarías la situación?", options: ["Asumir que la franquicia está muerta sin más análisis", "Revisar qué cambió respecto a entregas anteriores y la recepción de la comunidad", "Ignorar las críticas por completo", "Juzgar solo por las ventas del primer día"], correct: 1 },
    { type: "mcq", q: "¿Qué caracteriza a un juego 'free-to-play'?", options: ["Es gratuito para empezar, con monetización adicional opcional", "Siempre es pirata", "No tiene ningún tipo de ingreso", "Solo existe en consolas antiguas"], correct: 0 },
    { type: "mcq", q: "¿Qué estudio es conocido por la saga 'The Legend of Zelda'?", options: ["Nintendo", "Sony", "Valve", "Ubisoft"], correct: 0 },
    { type: "tf", q: "Los eSports son competiciones organizadas de videojuegos.", correct: true },
    { type: "mcq", q: "¿Qué es un 'sandbox' en videojuegos?", options: ["Un género con mundo abierto y libertad de exploración", "Un tipo de control exclusivo de PC", "Un formato de solo un nivel lineal", "Un dispositivo físico"], correct: 0 },
    { type: "order", q: "Ordena estas generaciones de consolas de más antigua a más reciente:", options: ["Atari 2600", "PlayStation 1", "PlayStation 4", "PlayStation 5"], correctOrder: [0,1,2,3] },
    { type: "mcq", q: "¿Qué distingue a un juego 'indie'?", options: ["Es desarrollado sin el respaldo de una gran editora", "Siempre tiene el presupuesto más alto del mercado", "Nunca se vende en tiendas digitales", "Es exclusivo de una sola consola por definición"], correct: 0 },
    { type: "mcq", q: "¿Qué es el 'lore' de un videojuego?", options: ["El trasfondo narrativo y mitología de su universo", "El motor gráfico utilizado", "El nombre del estudio", "El precio de lanzamiento"], correct: 0 },
  ],
};

// Preguntas genéricas de respaldo para categorías sin banco propio todavía
function genericQuestionsFor(catId){
  const cat = categoryById(catId);
  return [
    { type: "mcq", q: `¿Qué tan familiarizado estás con temas de ${cat.name}?`, options: ["Nada familiarizado", "Algo familiarizado", "Bastante familiarizado", "Experto"], correct: 2 },
    { type: "tf", q: `Ya he explorado contenido relacionado con ${cat.name} antes.`, correct: true },
    { type: "mcq", q: `¿Qué te gustaría lograr al aprender sobre ${cat.name}?`, options: ["Curiosidad general", "Profundizar de forma seria", "Prepararme para algo específico", "Solo entretenimiento"], correct: 1 },
  ];
}

let diagState = { category: null, index: 0, answers: [], score: 0 };

function initDiagnostico(user){
  if(!user){ user = getGuestUser(); }

  // Los usuarios con cuenta deben completar el onboarding antes del diagnóstico;
  // los invitados van directo (sin registro) al examen.
  if(!user.isGuest){
    if(!user.onboardingCompleted){ window.location.href = "onboarding.html"; return; }
    if(user.diagnosticoCompleted){ window.location.href = "resultado.html"; return; }
  }

  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("cat");
  diagState.category = (catParam && categoryById(catParam)) ? catParam : (user.interests && user.interests[0]) || "trading";

  const questions = DIAGNOSTIC_QUESTIONS[diagState.category] || genericQuestionsFor(diagState.category);
  diagState.questions = questions;
  diagState.user = user;
  renderDiagIntro(user);
}

function renderDiagIntro(user){
  const root = document.getElementById("diagnostico-root");
  const cat = categoryById(diagState.category);
  root.innerHTML = `
    <div class="question-card text-center">
      <div class="topic-icon" style="margin:0 auto 14px; background:rgba(45,212,191,.12); color:var(--primary);">${cat.icon}</div>
      <h2>Examen de nivel — ${cat.name}</h2>
      <p>${diagState.questions.length} preguntas para medir tu razonamiento real, no solo tu memoria.
      No hay ninguna pregunta sobre "cómo prefieres aprender": solo mide lo que realmente sabes.</p>
      ${user.isGuest ? `<p class="badge warning">Estás en modo invitado: puedes hacer el examen, pero el resultado no se guardará a menos que crees una cuenta.</p>` : ""}
      <button class="btn btn-primary mt-16" id="diag-start-btn">Comenzar examen</button>
    </div>`;
  document.getElementById("diag-start-btn").onclick = () => renderDiagQuestion(user);
}

function renderDiagQuestion(user){
  const root = document.getElementById("diagnostico-root");
  const total = diagState.questions.length;
  const q = diagState.questions[diagState.index];

  if(!q){
    finishDiagnostico(user);
    return;
  }

  let body = "";
  if(q.type === "mcq" || q.type === "scenario"){
    body = `
      <div class="option-list">
        ${q.options.map((opt, i) => `<div class="option-item" data-i="${i}">${opt}</div>`).join("")}
      </div>`;
  } else if(q.type === "tf"){
    body = `
      <div class="option-list">
        <div class="option-item" data-i="true">Verdadero</div>
        <div class="option-item" data-i="false">Falso</div>
      </div>`;
  } else if(q.type === "order"){
    body = `
      <p class="muted">Toca los elementos en el orden correcto (1º al último).</p>
      <div class="option-list" id="order-list">
        ${q.options.map((opt, i) => `<div class="option-item" data-i="${i}">${opt}</div>`).join("")}
      </div>
      <div class="muted mt-8" id="order-progress">Seleccionados: ninguno</div>`;
  }

  root.innerHTML = `
    <div class="question-card">
      <div class="wizard-steps">${diagState.questions.map((_,i)=>`<span class="dot ${i<=diagState.index?"active":""}"></span>`).join("")}</div>
      <p class="muted">Pregunta ${diagState.index + 1} de ${total} · ${q.type === "scenario" ? "Escenario" : q.type === "order" ? "Ordenar" : q.type === "tf" ? "Verdadero/Falso" : "Opción múltiple"}</p>
      <h2>${q.q}</h2>
      ${body}
    </div>`;

  if(q.type === "order"){
    let selectedOrder = [];
    root.querySelectorAll("#order-list .option-item").forEach(item => {
      item.onclick = () => {
        const i = parseInt(item.getAttribute("data-i"));
        if(!selectedOrder.includes(i)){
          selectedOrder.push(i);
          item.classList.add("selected");
          item.innerHTML = `${selectedOrder.length}. ${item.textContent}`;
          document.getElementById("order-progress").textContent = "Seleccionados: " + selectedOrder.length + "/" + q.options.length;
          if(selectedOrder.length === q.options.length){
            const correct = JSON.stringify(selectedOrder) === JSON.stringify(q.correctOrder);
            registerAnswer(correct);
            setTimeout(() => { diagState.index++; renderDiagQuestion(user); }, 500);
          }
        }
      };
    });
  } else {
    root.querySelectorAll(".option-item").forEach(item => {
      item.onclick = () => {
        root.querySelectorAll(".option-item").forEach(o => o.style.pointerEvents = "none");
        let correct;
        if(q.type === "tf"){
          correct = (item.getAttribute("data-i") === "true") === q.correct;
        } else {
          correct = parseInt(item.getAttribute("data-i")) === q.correct;
        }
        item.classList.add(correct ? "correct" : "incorrect");
        registerAnswer(correct);
        setTimeout(() => { diagState.index++; renderDiagQuestion(user); }, 500);
      };
    });
  }
}

function registerAnswer(correct){
  diagState.answers.push(correct);
  if(correct) diagState.score++;
}

function finishDiagnostico(user){
  const total = diagState.questions.length;
  const pct = Math.round((diagState.score / total) * 100);

  // Estadísticas simuladas — en producción vendrían de un análisis más completo
  const results = {
    category: diagState.category,
    knowledge: pct,
    decisionMaking: Math.min(100, Math.max(10, pct - 10 + Math.round(Math.random()*15))),
    analyticalThinking: Math.min(100, Math.max(10, pct + Math.round(Math.random()*10) - 5)),
    level: pct > 75 ? "Avanzado" : pct > 45 ? "Intermedio" : "Principiante",
  };

  if(user.isGuest){
    // Modo invitado: el resultado solo vive en esta pestaña (sessionStorage),
    // nunca se guarda como cuenta ni sobrevive a un reinicio del navegador.
    sessionStorage.setItem("edu_guest_diagnostico", JSON.stringify(results));
  } else {
    user.diagnostico = results;
    user.diagnosticoCompleted = true;
    addXP(user, 50);
    logActivity(user, "Completó el diagnóstico inicial de " + (categoryById(diagState.category)||{}).name);
    saveUser(user);
  }

  setTimeout(() => window.location.href = "resultado.html", 200);
}
