/** Home (banners, busca, categorias e receitas) e página de favoritas. */
import { RECIPES } from "../data/recipes.js";
import { COLLECTIONS, findCollection } from "../data/categories.js";
import { state, ui, recipesOpenedToday, dailyLimit } from "../core/store.js";
import { $, escapeHtml, plural } from "../core/utils.js";
import { renderCarousel } from "../ui/carousel.js";
import { recipeCard } from "../ui/recipeCard.js";
import { icon } from "../ui/icons.js";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function intro(favorites) {
  const opened = recipesOpenedToday();
  const limit = dailyLimit();
  const unlimited = limit === Infinity;
  const firstName = escapeHtml(state.user.name.split(" ")[0]);
  return `<div class="page-intro">
    <div>
      <h1 class="page-title">${favorites ? "Suas favoritas" : `${greeting()}, ${firstName}`}</h1>
      <p class="page-lead">${favorites ? "Seu caderno de receitas. Tudo o que você salvar fica aqui." : "O que está esperando na sua cozinha pode virar o prato de hoje."}</p>
    </div>
    <div class="usage">
      <b>Receitas abertas hoje: ${opened} de ${unlimited ? "∞" : limit}</b>
      <div class="progress"><i style="width:${unlimited ? 100 : Math.min(100, (opened / limit) * 100)}%"></i></div>
    </div>
  </div>`;
}

function searchBar() {
  return `<form class="search" role="search" id="search-form">
    ${icon("search", 22)}
    <input type="search" id="search-input" placeholder="Busque por ingrediente: casca de banana, talo, pão…" aria-label="Buscar receita" value="${escapeHtml(ui.query)}">
    <button class="btn" type="submit">Buscar</button>
  </form>`;
}

function collections() {
  const active = findCollection(ui.collection).id;
  return `<section class="collections" aria-label="Categorias">
    <div class="section-head">
      <h2>O que você tem em casa?</h2>
      <span class="meta">Escolha um ingrediente e descubra o que ele pode virar.</span>
    </div>
    <div class="collections__viewport">
      <button class="collections__arrow collections__arrow--prev" data-action="collections-scroll" data-value="-1" aria-label="Categorias anteriores">‹</button>
      <div class="collections__track" id="collections-track">
        ${COLLECTIONS.map(c => {
          const count = RECIPES.filter(c.match).length;
          const on = c.id === active;
          return `<button class="collection ${on ? "is-active" : ""}" data-action="toggle-collection" data-value="${c.id}" aria-pressed="${on}" aria-label="${c.name}: ${count} receitas">
            <span class="collection__bubble" style="--bubble:${c.bg}"><svg viewBox="0 0 64 64" aria-hidden="true">${c.icon}</svg></span>
            <b>${c.name}</b><small>${plural(count, "receita", "receitas")}</small>
          </button>`;
        }).join("")}
      </div>
      <button class="collections__arrow collections__arrow--next" data-action="collections-scroll" data-value="1" aria-label="Mais categorias">›</button>
    </div>
  </section>`;
}

export function renderHome(favorites = false) {
  if (favorites) return `${intro(true)}<div class="recipe-grid" id="recipe-grid"></div>`;
  return `${renderCarousel()}${intro(false)}${searchBar()}${collections()}
    <div class="results-head" id="results-head"></div>
    <div class="recipe-grid" id="recipe-grid"></div>`;
}

const matchesQuery = (recipe, q) => !q || `${recipe.name} ${recipe.ingredients.map(i => i[2]).join(" ")}`.toLowerCase().includes(q);

/** Atualiza só a grade e o título dos resultados (usado também enquanto a pessoa digita). */
export function renderGrid() {
  const grid = $("#recipe-grid");
  if (!grid) return;
  const q = ui.query.trim().toLowerCase();
  const collection = findCollection(ui.collection);
  const list = RECIPES.filter(r =>
    (ui.view === "favorites" ? state.favorites.includes(r.id) : collection.match(r)) && matchesQuery(r, q));

  const head = $("#results-head");
  if (head) {
    const filtered = collection.id !== "todas" || q;
    head.innerHTML = `<h2>${collection.id === "todas" ? "Todas as receitas" : collection.name}${q ? ` · “${escapeHtml(ui.query)}”` : ""}</h2>
      <span class="meta">${plural(list.length, "receita", "receitas")}</span>
      ${filtered ? '<button class="link" data-action="clear-filters">Limpar filtros</button>' : ""}`;
  }

  grid.innerHTML = list.length
    ? list.map(recipeCard).join("")
    : `<div class="empty-state">${ui.view === "favorites"
        ? "Seu caderno ainda está vazio. Toque na estrela de uma receita para guardá-la aqui."
        : "Nenhuma receita com esse nome por enquanto. Tente buscar por um ingrediente, como casca, talo ou pão."}</div>`;
}
