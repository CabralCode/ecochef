/** Tela de entrada: login, criação de conta com @usuário e acesso sem cadastro. */
import { RESERVED_HANDLES } from "../data/community.js";
import { state, ui, save, startFreshProgress } from "../core/store.js";
import { $ } from "../core/utils.js";

const HANDLE_RULE = /^[a-z0-9_]{3,15}$/;
const HANDLE_HINT = "De 3 a 15 caracteres: letras, números ou _. Ninguém mais poderá usar.";
const isEmail = v => /\S+@\S+\.\S+/.test(v);

const handleTaken = handle =>
  RESERVED_HANDLES.includes(handle) || Object.values(state.accounts).some(acc => acc.handle === handle);

/** Valida o @usuário. Retorna [estado, mensagem], estado = "" | "ok" | "error". */
export function checkHandle(value) {
  if (!value) return ["", HANDLE_HINT];
  if (value.length < 3) return ["error", "Use pelo menos 3 caracteres."];
  if (!HANDLE_RULE.test(value)) return ["error", "Use só letras minúsculas, números ou _."];
  if (handleTaken(value)) return ["error", `@${value} já tem dono. Tente uma variação.`];
  return ["ok", `@${value} está livre. É seu!`];
}

export function renderLogin() {
  const signup = ui.authMode === "signup";
  return `<div class="auth">
    <section class="auth__hero">
      <div class="auth__pattern" aria-hidden="true"></div>
      <div class="auth__copy">
        <img class="auth__logo" src="assets/brand/logo-vertical-branco.png" alt="EcoChef" width="150" height="138">
        <h1>Sabor que não vai pro lixo.</h1>
        <p>Receitas testadas que transformam cascas, talos, sementes e a comida de ontem em pratos que dão gosto de servir.</p>
        <div class="auth__pills"><span>Cascas</span><span>Talos e folhas</span><span>Pão amanhecido</span><span>Comida de ontem</span></div>
      </div>
    </section>
    <section class="auth__form-area">
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

/** Formata o @ enquanto a pessoa digita e mostra se está livre. */
export function onHandleInput(input) {
  const value = input.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 15);
  if (input.value !== value) input.value = value;
  const [status, message] = checkHandle(value);
  const hint = $("#handle-hint");
  hint.textContent = message;
  hint.className = `field__hint ${status ? `field__hint--${status}` : ""}`;
}

/** Envio do formulário. Retorna true quando a pessoa entrou. */
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
