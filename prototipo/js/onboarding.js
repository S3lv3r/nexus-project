/* =========================================================
   ONBOARDING.JS — Conocer al usuario
   2 pasos: intereses -> meta.
   NOTA: la plataforma ya no permite elegir "cómo prefieres
   aprender" — el nivel real se mide siempre con el diagnóstico,
   no con una preferencia declarada.
   ========================================================= */

const GOALS = [
  "Aprender desde cero",
  "Mejorar mis conocimientos",
  "Poner a prueba lo que sé",
  "Aprender de forma entretenida",
  "Prepararme para estudiar algo más avanzado",
];

let onboardingState = { step: 1, interests: [], goal: "" };

function initOnboarding(user){
  if(!user){ window.location.href = "login.html"; return; }
  if(user.onboardingCompleted){ window.location.href = "diagnostico.html"; return; }
  renderOnboardingStep();
}

function renderOnboardingStep(){
  const root = document.getElementById("onboarding-root");
  const totalSteps = 2;
  const dots = [1,2].map(n => `<span class="dot ${n === onboardingState.step ? "active" : ""}"></span>`).join("");

  let body = "";
  if(onboardingState.step === 1){
    body = `
      <h2>¿Qué te interesa aprender?</h2>
      <p>Selecciona una o varias categorías. Podrás cambiarlas después. Trading y Finanzas es el punto de partida de la plataforma.</p>
      <div class="chip-select" id="interest-chips">
        ${CATEGORIES.map(c => `
          <div class="chip ${onboardingState.interests.includes(c.id) ? "selected" : ""}" data-id="${c.id}">
            ${c.icon} ${c.name}
          </div>`).join("")}
      </div>`;
  } else {
    body = `
      <h2>¿Qué quieres conseguir?</h2>
      <p>Elige la opción que más se acerque a tu meta.</p>
      <div class="option-list" id="goal-options">
        ${GOALS.map(g => `
          <div class="option-item ${onboardingState.goal === g ? "selected" : ""}" data-goal="${g}">${g}</div>`).join("")}
      </div>`;
  }

  root.innerHTML = `
    <div class="form-card" style="max-width:640px;">
      <div class="wizard-steps">${dots}</div>
      ${body}
      <div class="row mt-24" style="justify-content:space-between;">
        <button class="btn" id="ob-back" ${onboardingState.step === 1 ? "disabled" : ""}>Atrás</button>
        <button class="btn btn-primary" id="ob-next">${onboardingState.step === totalSteps ? "Finalizar" : "Continuar"}</button>
      </div>
    </div>`;

  if(onboardingState.step === 1){
    root.querySelectorAll("#interest-chips .chip").forEach(chip => {
      chip.onclick = () => {
        const id = chip.getAttribute("data-id");
        toggleInArray(onboardingState.interests, id);
        renderOnboardingStep();
      };
    });
  } else {
    root.querySelectorAll("#goal-options .option-item").forEach(opt => {
      opt.onclick = () => {
        onboardingState.goal = opt.getAttribute("data-goal");
        renderOnboardingStep();
      };
    });
  }

  document.getElementById("ob-back").onclick = () => {
    if(onboardingState.step > 1){ onboardingState.step--; renderOnboardingStep(); }
  };
  document.getElementById("ob-next").onclick = () => {
    if(onboardingState.step === 1 && onboardingState.interests.length === 0){
      toast("Selecciona al menos un interés."); return;
    }
    if(onboardingState.step === 2 && !onboardingState.goal){
      toast("Selecciona una meta."); return;
    }
    if(onboardingState.step < totalSteps){
      onboardingState.step++;
      renderOnboardingStep();
    } else {
      finishOnboarding();
    }
  };
}

function toggleInArray(arr, val){
  const i = arr.indexOf(val);
  if(i >= 0) arr.splice(i, 1); else arr.push(val);
}

function finishOnboarding(){
  const user = getUser();
  user.interests = onboardingState.interests;
  user.goal = onboardingState.goal;
  user.onboardingCompleted = true;
  saveUser(user);
  toast("Preferencias guardadas.");
  setTimeout(() => window.location.href = "diagnostico.html", 300);
}
