/* =========================================================
   PERSONALIZACION.JS
   ========================================================= */

const THEMES = ["dark", "light", "midnight", "ocean", "forest", "cyber", "minimal"];
const ACCENT_COLORS = ["#3355ff", "#ff8a3d", "#21a179", "#e5484d", "#c026ff", "#0f8fb2"];

function renderPersonalizacion(user){
  const content = document.getElementById("page-content");

  content.innerHTML = `
    <h1>🎨 Personalización</h1>

    <div class="card mt-16">
      <h3>Foto de perfil</h3>
      <div class="row" style="align-items:center;">
        <div class="avatar-sm" style="width:64px;height:64px;font-size:1.4rem;">
          ${user.avatar ? `<img src="${user.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : (user.name||"U").slice(0,2).toUpperCase()}
        </div>
        <input type="file" id="avatar-upload" accept="image/*" class="mt-8">
        <button class="btn btn-sm btn-danger" id="avatar-remove">Eliminar</button>
      </div>
    </div>

    <div class="card mt-16">
      <h3>Portada / Fondo de perfil</h3>
      <div class="placeholder-box" style="height:100px;">Portada actual (placeholder)</div>
      <input type="file" id="cover-upload" accept="image/*" class="mt-8">
    </div>

    <div class="card mt-16">
      <h3>Tema de la plataforma</h3>
      <div class="chip-select">
        ${THEMES.map(t => `<div class="chip ${user.theme === t ? "selected" : ""}" data-theme-choice="${t}">${t}</div>`).join("")}
      </div>
    </div>

    <div class="card mt-16">
      <h3>Color principal</h3>
      <div class="row">
        ${ACCENT_COLORS.map(c => `<span class="color-swatch ${user.accentColor === c ? "selected" : ""}" style="background:${c}" data-color="${c}"></span>`).join("")}
      </div>
    </div>

    <div class="card mt-16">
      <h3>Widgets del dashboard</h3>
      ${Object.keys(user.widgets).map(w => `
        <div class="widget-toggle-row">
          <span>${w}</span>
          <input type="checkbox" data-widget="${w}" ${user.widgets[w] ? "checked" : ""}>
        </div>`).join("")}
    </div>

    <div class="card mt-16">
      <h3>Perfil público</h3>
      ${Object.keys(user.publicProfile).map(w => `
        <div class="widget-toggle-row">
          <span>Mostrar ${w}</span>
          <input type="checkbox" data-public="${w}" ${user.publicProfile[w] ? "checked" : ""}>
        </div>`).join("")}
    </div>
  `;

  content.querySelectorAll("[data-theme-choice]").forEach(el => {
    el.onclick = () => {
      user.theme = el.getAttribute("data-theme-choice");
      saveUser(user);
      applyPersonalization(user);
      renderPersonalizacion(user);
      toast("Tema actualizado.");
    };
  });

  content.querySelectorAll("[data-color]").forEach(el => {
    el.onclick = () => {
      user.accentColor = el.getAttribute("data-color");
      saveUser(user);
      applyPersonalization(user);
      renderPersonalizacion(user);
      toast("Color principal actualizado.");
    };
  });

  content.querySelectorAll("[data-widget]").forEach(el => {
    el.onchange = () => {
      user.widgets[el.getAttribute("data-widget")] = el.checked;
      saveUser(user);
    };
  });

  content.querySelectorAll("[data-public]").forEach(el => {
    el.onchange = () => {
      user.publicProfile[el.getAttribute("data-public")] = el.checked;
      saveUser(user);
    };
  });

  document.getElementById("avatar-upload").onchange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      user.avatar = reader.result;
      saveUser(user);
      renderPersonalizacion(user);
      toast("Foto de perfil actualizada.");
    };
    reader.readAsDataURL(file);
  };
  document.getElementById("avatar-remove").onclick = () => {
    user.avatar = null;
    saveUser(user);
    renderPersonalizacion(user);
  };
  document.getElementById("cover-upload").onchange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      user.cover = reader.result;
      saveUser(user);
      toast("Portada actualizada.");
    };
    reader.readAsDataURL(file);
  };
}
