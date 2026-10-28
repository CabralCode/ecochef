/** Perfil: personagem, provador, nível e troféus. */
import { WARDROBE, wardrobePart } from "../data/avatar.js";
import { LEVELS, levelIndex, levelProgress, nextLevel } from "../data/levels.js";
import { planName } from "../data/plans.js";
import { state, ui, weekPoints, cookCount } from "../core/store.js";
import { escapeHtml } from "../core/utils.js";
import { renderAvatar } from "../ui/avatar.js";
import { icon } from "../ui/icons.js";

export const TROPHIES = [
  { name: "Primeiro preparo", goal: "Registre seu primeiro preparo", done: () => cookCount() >= 1 },
  { name: "Salvador de cascas", goal: "Evite 500 g de desperdício", done: () => state.savedGrams >= 500 },
  { name: "Cozinha ativa", goal: "Registre 10 preparos", done: () => cookCount() >= 10 },
  { name: "Caderno de receitas", goal: "Salve 3 receitas favoritas", done: () => state.favorites.length >= 3 },
  { name: "Voz da cozinha", goal: "Publique sua primeira avaliação", done: () => Object.keys(state.reviews).length >= 1 },
  { name: "Horta cheia", goal: "Chegue a 100 pontos", done: () => state.points >= 100 },
];

const trophyIcon = won => `<svg viewBox="0 0 48 48" width="52" height="52" aria-hidden="true"><path d="M14 8h20v12a10 10 0 0 1-20 0z" fill="${won ? "url(#plan-1)" : "#C9C4B4"}"/><path d="M14 12H6q0 10 10 11M34 12h8q0 10-10 11" fill="none" stroke="${won ? "#D4A017" : "#C9C4B4"}" stroke-width="3"/><rect x="21" y="29" width="6" height="9" fill="${won ? "#B8860B" : "#B5AF9C"}"/><rect x="14" y="38" width="20" height="5" rx="2" fill="${won ? "#D4A017" : "#B5AF9C"}"/></svg>`;

export const isUnlocked = (partKey, index) => (wardrobePart(partKey).items[index]?.lock || 0) <= levelIndex(state.points);

function wardrobe() {
  const part = wardrobePart(ui.wardrobeTab);
  const items = part.items.map((item, i) => {
    const locked = !isUnlocked(part.key, i);
    const on = (state.avatar[part.key] ?? 0) === i;
    const need = LEVELS[item.lock || 0].name;
    return `<button class="wardrobe-item ${on ? "is-active" : ""} ${locked ? "is-locked" : ""}" data-action="wear" data-part="${part.key}" data-value="${i}"
        aria-pressed="${on}" aria-label="${item.name}${locked ? `, bloqueado. Nível ${need} necessário para desbloquear` : ""}">
      ${renderAvatar({ ...state.avatar, [part.key]: i }, state.plan, 64)}
      <span>${item.name}</span>
      ${locked ? `<span class="lock-tag">${icon("lock", 12)}<span><b>Nível ${need}</b>necessário para desbloquear</span></span>` : ""}
    </button>`;
  }).join("");
  return `<div class="panel wardrobe" id="wardrobe">
    <div><h3>Provador</h3><span class="meta">Toque em um item para vestir. Itens com cadeado mostram o nível necessário para desbloquear.</span></div>
    <div class="wardrobe__tabs" role="group" aria-label="Partes do visual">${WARDROBE.map(p =>
      `<button class="chip ${ui.wardrobeTab === p.key ? "is-active" : ""}" data-action="wardrobe-tab" data-value="${p.key}" aria-pressed="${ui.wardrobeTab === p.key}">${p.label}</button>`).join("")}</div>
    <div class="wardrobe__grid">${items}</div>
  </div>`;
}

function levelCard() {
  const level = LEVELS[levelIndex(state.points)];
  const next = nextLevel(state.points);
  return `<section class="panel level-card" id="level">
    <div class="level-card__main">
      <div class="level-card__badge"><svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">${level.icon}</svg></div>
      <div class="level-card__info">
        <div class="level-card__title"><b>Nível ${level.name}</b><span class="meta">${state.points} pontos</span></div>
        <div class="progress progress--large"><i style="width:${levelProgress(state.points)}%"></i></div>
        <span class="meta">${next ? `Faltam ${next.min - state.points} pontos para o nível ${next.name} e novos itens no provador.` : "Você chegou ao nível máximo. Todos os itens estão liberados."}</span>
      </div>
    </div>
    <div class="level-card__stats">
      <div><b>${weekPoints()}</b><span>pontos nesta semana</span></div>
      <div><b>${cookCount()}</b><span>preparos registrados</span></div>
      <div><b>${state.savedGrams} g</b><span>longe do lixo</span></div>
    </div>
  </section>`;
}

export function renderProfile() {
  const won = TROPHIES.filter(t => t.done()).length;
  return `<div class="page-intro"><div>
      <h1 class="page-title">Meu perfil</h1>
      <p class="page-lead">Vista seu personagem, acompanhe seu nível e veja suas conquistas.</p>
    </div></div>
  <div class="profile-layout">
    <div class="panel profile-card">
      ${renderAvatar(state.avatar, state.plan, 170)}
      <div><h3>${escapeHtml(state.user.name)}</h3>${state.user.handle ? `<span class="handle">@${escapeHtml(state.user.handle)}</span>` : ""}</div>
      <span class="plan-tag plan-tag--${state.plan}">${planName(state.plan)}</span>
      <button class="btn btn--orange" data-action="avatar-random">Sortear visual</button>
      <p class="note">A cor do aro mostra o seu plano.</p>
    </div>
    ${wardrobe()}
  </div>
  ${levelCard()}
  <h2 class="section-title" id="trophies">Troféus <span class="meta">${won} de ${TROPHIES.length}</span></h2>
  <div class="trophies">${TROPHIES.map(t => {
    const done = t.done();
    return `<div class="trophy ${done ? "is-won" : ""}">${trophyIcon(done)}<b>${t.name}</b><span class="meta">${done ? "Conquistado" : t.goal}</span></div>`;
  }).join("")}</div>
  <button class="btn btn--ghost profile-logout" data-action="logout">Sair da conta</button>`;
}
