/* =========================================================
   AUTH.JS — Registro con pantalla de carga y modal de Términos
   <!-- AUTENTICACIÓN: reemplazar por backend real (JWT/sesión) -->
   ========================================================= */

let pendingRegistrationData = null;
let hasScrolledTermsToBottom = false;

document.addEventListener("DOMContentLoaded", () => {
  const scrollContainer = document.getElementById("terms-scroll-container");
  const acceptBtn = document.getElementById("btn-accept-terms");

  if (scrollContainer && acceptBtn) {
    scrollContainer.addEventListener("scroll", () => {
      const reachedBottom =
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 10;

      if (reachedBottom && !hasScrolledTermsToBottom) {
        hasScrolledTermsToBottom = true;
        acceptBtn.disabled = false;
      }
    });
  }
});

function handleRegisterSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirm = document.getElementById("reg-confirm").value;
  const errorEl = document.getElementById("reg-error");

  errorEl.textContent = "";

  if (!name || !username || !email || !password) {
    errorEl.textContent = "Completa todos los campos.";
    return;
  }
  if (password !== confirm) {
    errorEl.textContent = "Las contraseñas no coinciden.";
    return;
  }

  const users = getAllUsers();
  if (users[username]) {
    errorEl.textContent = "Ese nombre de usuario ya existe.";
    return;
  }

  // Guardamos temporalmente los datos validados y lanzamos la pantalla de carga
  pendingRegistrationData = { name, username, email, password };

  const loadingOverlay = document.getElementById("reg-loading-overlay");
  const termsModal = document.getElementById("terms-modal-overlay");
  const scrollContainer = document.getElementById("terms-scroll-container");
  const acceptBtn = document.getElementById("btn-accept-terms");

  // Reiniciar el estado del modal por si el usuario lo cerró antes
  hasScrolledTermsToBottom = false;
  if (acceptBtn) acceptBtn.disabled = true;
  if (scrollContainer) scrollContainer.scrollTop = 0;

  if (loadingOverlay) loadingOverlay.classList.remove("hidden");

  setTimeout(() => {
    if (loadingOverlay) loadingOverlay.classList.add("hidden");
    if (termsModal) termsModal.classList.remove("hidden");

    // En caso de monitores verticales gigantes donde no exista barra de scroll
    if (
      scrollContainer &&
      scrollContainer.scrollHeight <= scrollContainer.clientHeight + 10
    ) {
      hasScrolledTermsToBottom = true;
      if (acceptBtn) acceptBtn.disabled = false;
    }
  }, 650);
}

function closeTermsModal() {
  const termsModal = document.getElementById("terms-modal-overlay");
  if (termsModal) termsModal.classList.add("hidden");
  pendingRegistrationData = null;
}

function confirmTermsAndRegister() {
  if (!pendingRegistrationData || !hasScrolledTermsToBottom) return;

  const { name, username, email, password } = pendingRegistrationData;
  const user = createDefaultUser(name, username, email);

  user.termsAcceptedAt = Date.now();
  user.termsVersion = "2026-10-23";
  user._demoPassword = password;

  saveUser(user);
  setCurrentUsername(username);

  closeTermsModal();
  toast("Cuenta creada. ¡Bienvenido!");
  setTimeout(() => routeAfterLogin(user), 400);
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const identifier = document.getElementById("login-id").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");
  errorEl.textContent = "";

  const users = getAllUsers();
  const user = Object.values(users).find(
    (u) => u.username === identifier || u.email === identifier
  );

  if (!user) {
    errorEl.textContent =
      "No encontramos una cuenta con esos datos. Regístrate primero.";
    return;
  }
  if (user._demoPassword !== undefined && user._demoPassword !== password) {
    errorEl.textContent = "Contraseña incorrecta.";
    return;
  }

  setCurrentUsername(user.username);
  toast("Sesión iniciada.");
  setTimeout(() => routeAfterLogin(user), 300);
}