/* =========================================================
   AUTH.JS — Registro e inicio de sesión simulados
   <!-- AUTENTICACIÓN: reemplazar por backend real (JWT/sesión) -->
   ========================================================= */

function handleRegisterSubmit(event){
  event.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirm = document.getElementById("reg-confirm").value;
  const terms = document.getElementById("reg-terms").checked;
  const errorEl = document.getElementById("reg-error");

  errorEl.textContent = "";

  if(!name || !username || !email || !password){
    errorEl.textContent = "Completa todos los campos.";
    return;
  }
  if(password !== confirm){
    errorEl.textContent = "Las contraseñas no coinciden.";
    return;
  }
  if(!terms){
    errorEl.textContent = "Debes aceptar los términos y condiciones.";
    return;
  }
  const users = getAllUsers();
  if(users[username]){
    errorEl.textContent = "Ese nombre de usuario ya existe.";
    return;
  }

  const user = createDefaultUser(name, username, email);
  // La contraseña NO se almacena de forma segura: esto es solo un prototipo visual.
  user._demoPassword = password;
  saveUser(user);
  setCurrentUsername(username);

  toast("Cuenta creada. ¡Bienvenido!");
  setTimeout(() => routeAfterLogin(user), 400);
}

function handleLoginSubmit(event){
  event.preventDefault();
  const identifier = document.getElementById("login-id").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");
  errorEl.textContent = "";

  const users = getAllUsers();
  // Permite iniciar sesión por username o email
  const user = Object.values(users).find(u => u.username === identifier || u.email === identifier);

  if(!user){
    errorEl.textContent = "No encontramos una cuenta con esos datos. Regístrate primero.";
    return;
  }
  if(user._demoPassword !== undefined && user._demoPassword !== password){
    errorEl.textContent = "Contraseña incorrecta.";
    return;
  }

  setCurrentUsername(user.username);
  toast("Sesión iniciada.");
  setTimeout(() => routeAfterLogin(user), 300);
}
