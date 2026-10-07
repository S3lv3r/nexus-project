/* =========================================================
   GAMIFICACION.JS — Logros y Ranking
   ========================================================= */

function renderLogros(user){
  const content = document.getElementById("page-content");
  content.innerHTML = `
    <h1>🏆 Logros</h1>
    <p>Desbloquea insignias completando retos, manteniendo tu racha y explorando nuevos temas.</p>
    <div class="card-grid mt-16">
      ${ACHIEVEMENTS.map(a => {
        const unlocked = user.achievements.includes(a.id);
        return `
          <div class="card ${unlocked ? "" : "muted"}" style="opacity:${unlocked ? 1 : .5}">
            <div style="font-size:1.6rem">${a.icon}</div>
            <h3>${a.name}</h3>
            <p>${a.desc}</p>
            <span class="badge ${unlocked ? "success" : ""}">${unlocked ? "Desbloqueado" : "Bloqueado"}</span>
          </div>`;
      }).join("")}
    </div>
  `;
}

/* Ranking simulado: mezcla usuarios reales (localStorage) con usuarios ficticios
   <!-- BACKEND: en producción este ranking vendría de una consulta agregada --> */
const FAKE_RANKING_USERS = [
  { name: "Valeria M.", xp: 4200 },
  { name: "Diego R.", xp: 3800 },
  { name: "Sofía T.", xp: 3450 },
  { name: "Andrés P.", xp: 2100 },
  { name: "Camila G.", xp: 1780 },
];

function renderRanking(user){
  const content = document.getElementById("page-content");
  const allUsers = Object.values(getAllUsers()).map(u => ({ name: u.name || u.username, xp: (u.level - 1) * 500 + u.xp, isMe: u.username === user.username }));
  const combined = [...FAKE_RANKING_USERS, ...allUsers].sort((a,b) => b.xp - a.xp);
  const myPos = combined.findIndex(u => u.isMe) + 1;

  content.innerHTML = `
    <h1>📈 Ranking</h1>
    <p>Basado en XP, misiones completadas y constancia — no en ganancias del simulador.</p>
    <div class="card mt-16">
      <table class="simple-table">
        <thead><tr><th>#</th><th>Usuario</th><th>XP total</th></tr></thead>
        <tbody>
          ${combined.slice(0,10).map((u,i) => `
            <tr style="${u.isMe ? "font-weight:700;" : ""}">
              <td>${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i+1}</td>
              <td>${u.name}${u.isMe ? " (tú)" : ""}</td>
              <td>${u.xp}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <p class="mt-16">Tu posición: <strong>#${myPos || "-"}</strong></p>
  `;
}
