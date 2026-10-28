/** Funções utilitárias usadas em todo o app. */

export const $ = (selector, root = document) => root.querySelector(selector);

/** Escapa texto digitado pelo usuário antes de inserir no HTML. */
export const escapeHtml = value =>
  String(value).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

/** Número com até 1 casa decimal e vírgula: 2.5 -> "2,5". */
export const formatNumber = n => String(Math.round(n * 10) / 10).replace(".", ",");

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** Data de hoje no formato AAAA-MM-DD (fuso local). */
export const todayKey = () => new Date().toLocaleDateString("sv-SE");

/** Segunda-feira da semana atual, no formato AAAA-MM-DD. */
export function weekKey() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toLocaleDateString("sv-SE");
}

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export const scrollToElement = el =>
  el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

let toastTimer;
/** Mensagem curta no rodapé da tela. */
export function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2800);
}

export const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
