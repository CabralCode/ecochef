export const $ = (selector, root = document) => root.querySelector(selector);

export const escapeHtml = value =>
  String(value).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

export const formatNumber = n => String(Math.round(n * 10) / 10).replace(".", ",");

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export const todayKey = () => new Date().toLocaleDateString("sv-SE");

export function weekKey() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toLocaleDateString("sv-SE");
}

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export const scrollToElement = el =>
  el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

let toastTimer;
export function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2800);
}

export const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
