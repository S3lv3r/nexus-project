/* =========================================================
   MENTOR.JS — NEXUS AI
   Chatbot simulado (sin backend todavía).
   <!-- API DE IA: aquí se conectará el modelo real -->
   Responde según la categoría/intereses del usuario y
   palabras clave simples del mensaje.
   ========================================================= */

const MENTOR_SUGGESTIONS = [
  "Explícame esto.",
  "Ponme un reto.",
  "¿Qué debería aprender después?",
  "¿Por qué me equivoqué?",
  "Explícamelo usando una película.",
  "Explícamelo usando un videojuego.",
];

/* Base de conocimiento simulada por palabra clave.
   <!-- BASE DE DATOS / API DE IA: sustituir por modelo real --> */
const MENTOR_KNOWLEDGE = {
  rsi: "El RSI (Índice de Fuerza Relativa) es un indicador que mide la velocidad y magnitud de los movimientos de precio, usado para identificar condiciones de sobrecompra o sobreventa.",
  "gestión de riesgo": "Gestionar el riesgo significa decidir de antemano cuánto estás dispuesto a perder en una operación o decisión, para que ningún resultado individual te saque del juego.",
  montaje: "El montaje cinematográfico es el proceso de seleccionar y ordenar las tomas de una película para construir ritmo, significado y emoción.",
  soporte: "Un soporte es un nivel de precio donde históricamente la demanda ha sido suficiente para detener una caída.",
  resistencia: "Una resistencia es un nivel de precio donde la oferta ha detenido subidas anteriores.",
};

function mentorRespond(user, message){
  const msg = message.toLowerCase();

  // Si pide explicar con analogía de un tema específico
  if(msg.includes("película") || msg.includes("pelicula")){
    return "Imagina un concepto financiero como el argumento de una película: los datos son las escenas, y tú, como espectador, debes anticipar el desenlace observando patrones. ¿Sobre qué concepto quieres que use esta analogía?";
  }
  if(msg.includes("videojuego")){
    return "Piénsalo como subir de nivel en un juego: cada decisión que tomas te da experiencia (información), y con suficiente experiencia puedes anticipar mejor los retos siguientes. ¿Qué concepto te gustaría que explique así?";
  }
  if(msg.includes("reto")){
    return "Aquí tienes un reto rápido: analiza la última 'Misión del día' en tu Dashboard y decide qué información necesitarías antes de tomar una decisión. Cuéntame tu razonamiento y te doy retroalimentación.";
  }
  if(msg.includes("después") || msg.includes("siguiente")){
    const cats = user.interests && user.interests.length ? user.interests : ["cultura"];
    const cat = categoryById(cats[0]);
    const modules = MODULES_BY_CATEGORY[cats[0]] || [];
    return `Según tu progreso en ${cat ? cat.name : "tu ruta"}, te recomiendo continuar con "${modules[0] || "Fundamentos"}". Puedes verlo en la sección Aprender.`;
  }
  if(msg.includes("equivoqué") || msg.includes("equivoque") || msg.includes("error")){
    return "No te preocupes por los errores: son parte de cómo mides tu razonamiento, no solo tu memoria. Revisa la explicación del diagnóstico o el módulo relacionado y vuelve a intentar el reto.";
  }

  for(const key in MENTOR_KNOWLEDGE){
    if(msg.includes(key)){
      return MENTOR_KNOWLEDGE[key];
    }
  }

  return "Buena pregunta. Todavía estoy conectado a una base de conocimiento simulada (esto se reemplazará por un modelo de IA real), pero puedo ayudarte a explorar el tema, ponerte un reto o adaptar la explicación a tu nivel. ¿Qué prefieres?";
}

/* ---------- Widget flotante (todas las páginas internas) ---------- */
function initMentorWidget(user){
  const fab = document.getElementById("mentor-fab");
  const panel = document.getElementById("mentor-panel");
  if(!fab || !panel) return;

  let messages = [
    { from: "bot", text: `Hola ${user.name || ""}, soy NEXUS AI 🤖. Estoy al tanto de tu nivel y tus intereses. ¿En qué te ayudo?` }
  ];

  function renderPanel(){
    panel.innerHTML = `
      <div class="mentor-head">
        <span>🤖 NEXUS AI</span>
        <button class="btn btn-ghost btn-sm" id="mentor-close">✕</button>
      </div>
      <div class="mentor-body" id="mentor-body">
        ${messages.map(m => `<div class="mentor-msg ${m.from}">${m.text}</div>`).join("")}
      </div>
      <div class="mentor-suggestions">
        ${MENTOR_SUGGESTIONS.slice(0,3).map(s => `<button class="btn btn-sm" data-suggestion="${s}">${s}</button>`).join("")}
      </div>
      <div class="mentor-input">
        <input type="text" id="mentor-input-field" placeholder="Escribe tu pregunta..." />
        <button class="btn btn-primary btn-sm" id="mentor-send">Enviar</button>
      </div>
    `;
    document.getElementById("mentor-close").onclick = () => panel.classList.add("hidden");
    document.getElementById("mentor-send").onclick = sendFromInput;
    document.getElementById("mentor-input-field").addEventListener("keydown", e => {
      if(e.key === "Enter") sendFromInput();
    });
    panel.querySelectorAll("[data-suggestion]").forEach(btn => {
      btn.onclick = () => sendMessage(btn.getAttribute("data-suggestion"));
    });
    const body = document.getElementById("mentor-body");
    body.scrollTop = body.scrollHeight;
  }

  function sendFromInput(){
    const field = document.getElementById("mentor-input-field");
    if(field.value.trim()){ sendMessage(field.value.trim()); field.value = ""; }
  }

  function sendMessage(text){
    messages.push({ from: "user", text });
    const reply = mentorRespond(user, text);
    messages.push({ from: "bot", text: reply });
    renderPanel();
  }

  fab.onclick = () => {
    panel.classList.toggle("hidden");
    if(!panel.classList.contains("hidden")) renderPanel();
  };
}

/* ---------- Página completa /mentor.html ---------- */
function initMentorPage(user){
  const container = document.getElementById("mentor-page-body");
  let messages = [
    { from: "bot", text: `Hola ${user.name || ""} 👋 Soy NEXUS AI. Conozco tu nivel (${user.levelLabel}), tus intereses (${categoryNames(user.interests).join(", ") || "aún ninguno"}) y tu progreso. ¿Qué quieres aprender hoy?` }
  ];

  function render(){
    container.innerHTML = `
      <div class="card" style="height:420px; display:flex; flex-direction:column;">
        <div style="flex:1; overflow-y:auto; padding-right:8px;" id="mentor-full-body">
          ${messages.map(m => `<div class="mentor-msg ${m.from}" style="margin-bottom:14px;">
            <strong>${m.from === "bot" ? "NEXUS AI" : "Tú"}:</strong> ${m.text}
          </div>`).join("")}
        </div>
        <div class="mentor-suggestions" style="padding:10px 0;">
          ${MENTOR_SUGGESTIONS.map(s => `<button class="btn btn-sm" data-suggestion="${s}">${s}</button>`).join("")}
        </div>
        <div style="display:flex; gap:8px;">
          <input type="text" id="mentor-full-input" placeholder="Escribe tu pregunta a NEXUS AI..." style="flex:1; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-alt); color:var(--text);">
          <button class="btn btn-primary" id="mentor-full-send">Enviar</button>
        </div>
      </div>
    `;
    container.querySelectorAll("[data-suggestion]").forEach(btn => {
      btn.onclick = () => submit(btn.getAttribute("data-suggestion"));
    });
    document.getElementById("mentor-full-send").onclick = () => {
      const field = document.getElementById("mentor-full-input");
      if(field.value.trim()){ submit(field.value.trim()); field.value = ""; }
    };
    document.getElementById("mentor-full-input").addEventListener("keydown", e => {
      if(e.key === "Enter") document.getElementById("mentor-full-send").click();
    });
    const body = document.getElementById("mentor-full-body");
    body.scrollTop = body.scrollHeight;
  }

  function submit(text){
    messages.push({ from: "user", text });
    messages.push({ from: "bot", text: mentorRespond(user, text) });
    render();
  }

  render();
}
