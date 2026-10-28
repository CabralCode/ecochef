/**
 * Carrossel de banners da home.
 * Troca por: setas, pontinhos, arrastar com o mouse, deslizar com o dedo e automaticamente.
 */
import { BANNERS } from "../data/banners.js";
import { BANNER_INTERVAL } from "../config.js";
import { LEVELS, levelIndex, nextLevel } from "../data/levels.js";
import { POINTS } from "../config.js";
import { state } from "../core/store.js";
import { $, prefersReducedMotion } from "../core/utils.js";
import { bannerMedia } from "./media.js";

let current = 0;
let lastManualChange = 0;
let hovering = false;
let drag = null; // { x, moved }

const HALLOWEEN_ART = `<svg class="banner__art" viewBox="0 0 400 260" aria-hidden="true"><circle cx="320" cy="60" r="38" fill="#FFE9A8"/><circle cx="306" cy="50" r="6" fill="#F2D27A"/><circle cx="334" cy="72" r="4" fill="#F2D27A"/><g fill="#fff"><circle class="anim-twinkle" cx="40" cy="40" r="2"/><circle class="anim-twinkle anim-delay" cx="110" cy="80" r="2"/><circle class="anim-twinkle" cx="250" cy="30" r="2"/><circle class="anim-twinkle anim-delay" cx="370" cy="130" r="2"/></g><g class="anim-float"><path d="M150 230V130a50 50 0 0 1 100 0v100l-25-14-25 14-25-14-25 14z" fill="#fff"/><circle cx="182" cy="130" r="8" fill="#2B1B4A"/><circle cx="218" cy="130" r="8" fill="#2B1B4A"/><ellipse cx="200" cy="160" rx="9" ry="12" fill="#2B1B4A"/></g><g class="anim-bat"><path d="M40 90q10-14 20 0 10-14 20 0-10-4-20 6-10-10-20-6z" fill="#14081F"/></g><g class="anim-bat anim-delay"><path d="M290 160q8-10 16 0 8-10 16 0-8-3-16 5-8-8-16-5z" fill="#14081F"/></g><ellipse cx="80" cy="232" rx="34" ry="26" fill="#E8791A"/><path d="M80 206v-8" stroke="#3C8A3E" stroke-width="5"/><path d="M66 224l6 8-12 0zM94 224l6 8-12 0zM68 240q12 8 24 0" fill="#2B1B4A" stroke="#2B1B4A" stroke-width="3"/></svg>`;

const POINTS_ART = `<svg class="banner__art" viewBox="0 0 400 260" aria-hidden="true"><g class="anim-float"><path d="M150 40h100v70a50 50 0 0 1-100 0z" fill="url(#plan-1)"/><path d="M150 56h-40q0 50 46 56M250 56h40q0 50-46 56" fill="none" stroke="#D4A017" stroke-width="10"/><rect x="190" y="150" width="20" height="40" fill="#B8860B"/><rect x="150" y="190" width="100" height="22" rx="8" fill="#D4A017"/></g><g class="anim-rise"><circle cx="90" cy="180" r="26" fill="#C2610E"/><text x="90" y="187" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">+10</text></g><g class="anim-rise anim-delay"><circle cx="320" cy="170" r="24" fill="#B02A22"/><text x="320" y="177" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">+5</text></g><g class="anim-rise anim-delay-2"><circle cx="300" cy="70" r="24" fill="#2F7D3A"/><text x="300" y="77" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">+10</text></g></svg>`;

function pointsContent() {
  const next = nextLevel(state.points);
  const base = LEVELS[levelIndex(state.points)].min;
  const progress = next ? Math.min(100, ((state.points - base) / (next.min - base)) * 100) : 100;
  return `<div class="banner__chips"><span>+${POINTS.cook} pontos a cada preparo</span><span>+${POINTS.review} por avaliação</span></div>
    <p>${next ? `Você tem ${state.points} pontos. Faltam ${next.min - state.points} para o nível ${next.name}.` : "Você chegou ao nível máximo. Que horta!"}</p>
    <div class="progress progress--on-dark"><i style="width:${progress}%"></i></div>`;
}

function slide(banner, i) {
  const active = i === current;
  const button = banner.type === "points"
    ? `<button class="btn btn--orange" data-action="go" data-value="ranking">${banner.cta}</button>`
    : `<button class="btn btn--orange" data-action="open-recipe" data-value="${banner.recipe}">${banner.cta}</button>`;
  const body = banner.type === "points" ? pointsContent() : `<p>${banner.text}</p>`;
  const visual = banner.type === "recipe"
    ? `<div class="banner__visual">${bannerMedia(banner)}</div>`
    : banner.type === "halloween" ? HALLOWEEN_ART : POINTS_ART;
  return `<div class="banner banner--${banner.theme} banner--${banner.type === "recipe" ? "photo" : "art"} ${active ? "is-active" : ""}"
      data-index="${i}" role="group" aria-roledescription="slide" aria-label="${i + 1} de ${BANNERS.length}: ${banner.title}" ${active ? "" : "inert"}>
    <div class="banner__text">
      <span class="banner__eyebrow">${banner.eyebrow}</span>
      <h2 class="banner__title">${banner.title}</h2>
      ${body}
      ${button}
    </div>
    ${visual}
  </div>`;
}

export function renderCarousel() {
  return `<section class="carousel" id="carousel" aria-roledescription="carousel" aria-label="Destaques">
    ${BANNERS.map(slide).join("")}
    <button class="carousel__arrow carousel__arrow--prev" data-action="banner-step" data-value="-1" aria-label="Banner anterior">‹</button>
    <button class="carousel__arrow carousel__arrow--next" data-action="banner-step" data-value="1" aria-label="Próximo banner">›</button>
    <div class="carousel__dots">${BANNERS.map((b, i) => `<button class="carousel__dot ${i === current ? "is-active" : ""}" data-action="banner-go" data-value="${i}" aria-label="Banner ${i + 1}: ${b.title}"><i></i></button>`).join("")}</div>
  </section>`;
}

export function goToBanner(index, manual = false) {
  current = (index + BANNERS.length) % BANNERS.length;
  if (manual) lastManualChange = Date.now();
  const root = $("#carousel");
  if (!root) return;
  root.querySelectorAll(".banner").forEach(el => {
    const on = Number(el.dataset.index) === current;
    el.classList.toggle("is-active", on);
    el.toggleAttribute("inert", !on);
  });
  root.querySelectorAll(".carousel__dot").forEach((el, i) => el.classList.toggle("is-active", i === current));
}

export const stepBanner = delta => goToBanner(current + delta, true);

/** Chamar uma vez na inicialização. */
export function initCarousel() {
  document.addEventListener("mouseover", e => { hovering = !!e.target.closest("#carousel"); });

  document.addEventListener("pointerdown", e => {
    if (!e.target.closest("#carousel") || e.target.closest(".carousel__arrow, .carousel__dot")) return;
    drag = { x: e.clientX, moved: false };
  });
  document.addEventListener("pointermove", e => {
    if (drag && Math.abs(e.clientX - drag.x) > 8) drag.moved = true;
  });
  document.addEventListener("pointerup", e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 40) stepBanner(dx < 0 ? 1 : -1);
    setTimeout(() => { drag = null; }, 0);
  });
  document.addEventListener("pointercancel", () => { drag = null; });
  // Um arraste não deve "clicar" no botão do banner.
  document.addEventListener("click", e => {
    if (drag?.moved && e.target.closest("#carousel")) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  if (prefersReducedMotion()) return;
  setInterval(() => {
    if (hovering || document.hidden || !$("#carousel")) return;
    if (Date.now() - lastManualChange < BANNER_INTERVAL) return;
    goToBanner(current + 1);
  }, BANNER_INTERVAL);
}
