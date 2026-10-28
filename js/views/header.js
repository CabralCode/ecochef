/** Cabeçalho: logo, navegação com menus suspensos, nível/pontos e avatar. */
import { collectionsByGroup } from "../data/categories.js";
import { LEVELS, levelIndex, levelProgress } from "../data/levels.js";
import { planName } from "../data/plans.js";
import { TROPHIES } from "./profile.js";
import { state, ui, weekPoints } from "../core/store.js";
import { escapeHtml, plural } from "../core/utils.js";
import { renderAvatar } from "../ui/avatar.js";
import { icon } from "../ui/icons.js";

const NAV = [
  { view: "home", label: "Receitas", icon: "bowl", menu: recipesMenu },
  { view: "favorites", label: "Favoritas", icon: "star" },
  { view: "ranking", label: "Ranking", icon: "trophy" },
  { view: "plans", label: "Planos", icon: "diamond" },
  { view: "profile", label: "Perfil", icon: "user", menu: profileMenu, alignRight: true },
];

function recipesMenu() {
  const items = group => collectionsByGroup(group).map(c => {
    return `<button class="menu__item" role="menuitem" data-action="show-collection" data-value="${c.id}">
      <span class="menu__bubble" style="--bubble:${c.bg}"><svg viewBox="0 0 64 64" aria-hidden="true">${c.icon}</svg></span>
      <span>${c.name}</span>
    </button>`;
  }).join("");
  return `<div class="menu menu--mega"><div class="menu__panel" role="menu" aria-label="Categorias de receitas">
    <div class="menu__group"><span class="menu__heading">Por ingrediente</span>${items("ingrediente")}</div>
    <div class="menu__group"><span class="menu__heading">Por ocasião</span>${items("ocasiao")}</div>
    <div class="menu__footer"><button class="menu__all" data-action="show-collection" data-value="todas">Ver todas as receitas →</button></div>
  </div></div>`;
}

export function profileMenu() {
  const level = LEVELS[levelIndex(state.points)];
  const won = TROPHIES.filter(t => t.done()).length;
  const items = [
    ["profile-section", "wardrobe", "Personalizar personagem", "Roupas, fundos e acessórios", "pencil"],
    ["profile-section", "level", "Nível e pontos", `${state.points} pts · nível ${level.name}`, "chart"],
    ["profile-section", "trophies", "Troféus", `${won} de ${TROPHIES.length} conquistados`, "trophy"],
    ["go", "favorites", "Minhas favoritas", plural(state.favorites.length, "receita salva", "receitas salvas"), "star"],
    ["go", "ranking", "Ranking da semana", `${weekPoints()} pts nesta semana`, "list"],
    ["go", "plans", "Meu plano", `Plano ${planName(state.plan)}`, "diamond"],
  ];
  const item = ([action, value, title, sub, ic]) => `<button class="menu__item" role="menuitem" data-action="${action}" data-value="${value}">
    <span class="menu__icon">${icon(ic)}</span><span class="menu__text"><b>${title}</b>${sub ? `<small>${sub}</small>` : ""}</span>
  </button>`;
  return `<div class="menu"><div class="menu__panel" role="menu" aria-label="Menu do perfil">
    <div class="menu__profile">${renderAvatar(state.avatar, state.plan, 44)}
      <div><b>${escapeHtml(state.user.name)}</b>${state.user.handle ? `<small>@${escapeHtml(state.user.handle)}</small>` : ""}
      <span class="progress progress--thin"><i style="width:${levelProgress(state.points)}%"></i></span></div>
    </div>
    ${items.map(item).join("")}
    <div class="menu__divider"></div>
    ${item(["logout", "", "Sair da conta", "", "logout"])}
  </div></div>`;
}

export function renderHeader() {
  const active = ui.view === "recipe" ? "home" : ui.view;
  const nav = NAV.map(n => {
    const button = `<button class="nav__link ${active === n.view ? "is-active" : ""}" data-action="go" data-value="${n.view}" aria-label="${n.label}">${icon(n.icon, 22, "nav__icon")}<span class="nav__label">${n.label}</span>${n.menu ? icon("chevronDown", 12, "nav__chevron") : ""}</button>`;
    return n.menu ? `<div class="has-menu ${n.alignRight ? "has-menu--right" : ""}">${button}${n.menu()}</div>` : button;
  }).join("");
  const li = levelIndex(state.points);
  return `<header class="site-header ${ui.suppressMenus ? "menus-off" : ""}">
    <div class="site-header__inner">
      <button class="logo" data-action="home" aria-label="EcoChef, voltar ao início"><img src="assets/brand/logo-horizontal-cor.png" alt="EcoChef" width="160" height="47"></button>
      <nav class="nav" aria-label="Principal">${nav}</nav>
      <div class="user-status">
        <button class="xp-chip" data-action="go" data-value="profile" aria-label="Nível ${LEVELS[li].name}, ${state.points} pontos. Ver meu perfil">
          <span class="xp-chip__icon"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${LEVELS[li].icon}</svg></span>
          <span class="xp-chip__text"><b>${state.points} pts</b><span class="progress progress--header"><i style="width:${levelProgress(state.points)}%"></i></span></span>
        </button>
        <div class="has-menu has-menu--right">
          <button class="avatar-button" data-action="go" data-value="profile" aria-label="Personalizar meu personagem">
            ${renderAvatar(state.avatar, state.plan, 44)}<span class="avatar-button__edit" aria-hidden="true">${icon("pencilSolid", 11)}</span>
          </button>
          ${profileMenu()}
        </div>
      </div>
    </div>
  </header>`;
}
