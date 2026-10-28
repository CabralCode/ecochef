import { RESERVED_HANDLES } from "../data/community.js";
import { state, ui, save, startFreshProgress } from "../core/store.js";
import { $ } from "../core/utils.js";

const HANDLE_RULE = /^[a-z0-9_]{3,15}$/;
const HANDLE_HINT = "De 3 a 15 caracteres: letras, números ou _. Ninguém mais poderá usar.";
const isEmail = v => /\S+@\S+\.\S+/.test(v);

const handleTaken = handle =>
  RESERVED_HANDLES.includes(handle) || Object.values(state.accounts).some(acc => acc.handle === handle);

export function checkHandle(value) {
  if (!value) return ["", HANDLE_HINT];
  if (value.length < 3) return ["error", "Use pelo menos 3 caracteres."];
  if (!HANDLE_RULE.test(value)) return ["error", "Use só letras minúsculas, números ou _."];
  if (handleTaken(value)) return ["error", `@${value} já tem dono. Tente uma variação.`];
  return ["ok", `@${value} está livre. É seu!`];
}

// arte do login (bauhaus). o prato usa assets/img/login/destaque.webp
function bauhausArt() {
  const star = (x, y, r, color) =>
    `<path d="M${x} ${y - r}Q${x + r * .18} ${y - r * .18} ${x + r} ${y}Q${x + r * .18} ${y + r * .18} ${x} ${y + r}Q${x - r * .18} ${y + r * .18} ${x - r} ${y}Q${x - r * .18} ${y - r * .18} ${x} ${y - r}Z" fill="${color}"/>`;
  const dots = (x0, y0, cols, rows, gap, r) => {
    let out = "";
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) out += `<circle cx="${x0 + i * gap}" cy="${y0 + j * gap}" r="${r}" fill="#fff"/>`;
    return out;
  };
  const leaf = (x, y, w, h, color) => `<path d="M${x} ${y}Q${x + w / 2} ${y - h} ${x + w} ${y}Q${x + w / 2} ${y + h} ${x} ${y}Z" fill="${color}"/>`;
  return `<svg class="bauhaus" viewBox="0 0 540 900" preserveAspectRatio="xMidYMid slice">
    <rect width="540" height="900" fill="var(--navy)"/>
    <rect x="0" y="0" width="180" height="180" fill="var(--leaf)"/>${dots(42, 42, 1, 2, 48, 11)}
    <path d="M180 300V100A90 90 0 0 1 360 100V300Z" fill="var(--coral)"/>
    <path d="M540 0V200A200 200 0 0 1 340 0Z" fill="var(--orange)"/>
    <circle cx="455" cy="262" r="26" fill="var(--coral)"/>
    <path d="M0 210A140 140 0 0 1 0 490Z" fill="var(--coral)"/>
    <path d="M540 300V620A320 320 0 0 1 220 300Z" fill="var(--leaf)"/>
    <rect x="0" y="560" width="200" height="340" fill="var(--coral)"/>
    <path d="M0 560A100 100 0 0 0 200 560Z" fill="var(--wine)"/>
    ${leaf(222, 830, 96, 52, "var(--orange)")}${leaf(334, 830, 96, 52, "var(--orange)")}
    <path d="M540 660V900H360V840A180 180 0 0 1 540 660Z" fill="var(--leaf)"/>${dots(410, 830, 3, 2, 40, 9)}
    ${star(92, 520, 34, "var(--leaf)")}${star(478, 470, 40, "var(--wine)")}${star(300, 62, 22, "#fff")}
  </svg>
  <div class="bauhaus__plate">
    <img class="bauhaus__fallback" src="assets/brand/marca-cor.png" alt="">
    <img class="media__img" src="assets/img/login/destaque.webp" alt="">
  </div>`;
}

export function renderLogin() {
  const signup = ui.authMode === "signup";
  return `<div class="auth">
    <aside class="auth__art" aria-hidden="true">${bauhausArt()}</aside>
    <section class="auth__main">
      <div class="auth__intro">
        <img class="auth__logo" src="assets/brand/logo-horizontal-cor.png" alt="EcoChef" width="200" height="59">
        <h1>Sabor que não vai pro lixo.</h1>
        <p>Receitas testadas que transformam cascas, talos, sementes e a comida de ontem em pratos que dão gosto de servir.</p>
      </div>
      <div class="auth__card">
        <div class="segmented" role="group" aria-label="Tipo de acesso">
          <button class="${signup ? "" : "is-active"}" data-action="auth-mode" data-value="login" aria-pressed="${!signup}">Entrar</button>
          <button class="${signup ? "is-active" : ""}" data-action="auth-mode" data-value="signup" aria-pressed="${signup}">Criar conta</button>
        </div>
        <form id="auth-form" class="form" novalidate>
          ${signup ? `
          <label class="field">Nome
            <input type="text" id="auth-name" name="name" autocomplete="name" maxlength="40" placeholder="Como você quer ser chamado">
          </label>
          <label class="field">Nome de usuário
            <span class="handle-input"><b>@</b><input type="text" id="auth-handle" name="handle" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="15" placeholder="seuusuario"></span>
            <span class="field__hint" id="handle-hint">${HANDLE_HINT}</span>
          </label>` : ""}
          <label class="field">${signup ? "E-mail" : "E-mail ou @usuário"}
            <input type="${signup ? "email" : "text"}" id="auth-email" name="email" autocomplete="${signup ? "email" : "username"}" autocapitalize="none">
          </label>
          <label class="field">Senha
            <input type="password" id="auth-password" name="password" autocomplete="${signup ? "new-password" : "current-password"}">
          </label>
          <button class="btn" type="submit">${signup ? "Criar conta grátis" : "Entrar"}</button>
          <p class="form__error" id="auth-error" role="alert"></p>
        </form>
        <button class="link" data-action="guest">Explorar sem cadastro</button>
        <p class="note">Versão de demonstração: as contas ficam salvas apenas neste navegador.</p>
      </div>
    </section>
  </div>`;
}

export function onHandleInput(input) {
  const value = input.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 15);
  if (input.value !== value) input.value = value;
  const [status, message] = checkHandle(value);
  const hint = $("#handle-hint");
  hint.textContent = message;
  hint.className = `field__hint ${status ? `field__hint--${status}` : ""}`;
}

export function submitAuth(form) {
  const data = new FormData(form);
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");
  const fail = msg => { $("#auth-error").textContent = msg; return false; };

  if (ui.authMode === "signup") {
    const name = String(data.get("name") || "").trim();
    const handle = String(data.get("handle") || "").trim().toLowerCase();
    if (!name) return fail("Conte pra gente como você quer ser chamado.");
    if (!handle) return fail("Escolha seu @usuário para continuar.");
    const [status, message] = checkHandle(handle);
    if (status !== "ok") return fail(message);
    if (!isEmail(email)) return fail("Esse e-mail parece incompleto. Confira e tente de novo.");
    if (state.accounts[email]) return fail("Este e-mail já tem uma conta. Toque em Entrar.");
    if (password.length < 4) return fail("Use uma senha com pelo menos 4 caracteres.");
    state.accounts[email] = { name, handle };
    state.user = { name, handle };
    startFreshProgress();
  } else {
    if (!email) return fail("Digite seu e-mail ou @usuário.");
    let account;
    if (isEmail(email)) {
      account = state.accounts[email];
    } else {
      const handle = email.replace(/^@/, "");
      account = Object.values(state.accounts).find(acc => acc.handle === handle);
      if (!account) return fail(`Não achamos @${handle}. Confira a grafia ou crie sua conta.`);
    }
    if (password.length < 4) return fail("Use uma senha com pelo menos 4 caracteres.");
    if (!account) return fail("Ainda não há conta com esse e-mail. Que tal criar uma agora?");
    state.user = { ...account };
  }
  save();
  return true;
}
