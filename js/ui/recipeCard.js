import { planName } from "../data/plans.js";
import { state, isFavorite } from "../core/store.js";
import { escapeHtml, formatNumber } from "../core/utils.js";
import { averageRating } from "../core/ratings.js";
import { recipeMedia } from "./media.js";

export const planBadge = recipe =>
  recipe.plan ? `<span class="badge badge--${recipe.plan === 1 ? "gold" : "diamond"}">${planName(recipe.plan)}</span>` : "";

export function recipeCard(recipe) {
  const locked = recipe.plan > state.plan;
  const fav = isFavorite(recipe.id);
  return `<article class="recipe-card">
    <button class="recipe-card__media" data-action="open-recipe" data-value="${recipe.id}" aria-label="Abrir ${escapeHtml(recipe.name)}">
      ${recipeMedia(recipe)}
    </button>
    <div class="recipe-card__badges">
      ${recipe.fit ? '<span class="badge">Fit</span>' : ""}${planBadge(recipe)}${locked ? '<span class="badge badge--locked">Desbloqueie</span>' : ""}
    </div>
    <button class="fav-toggle" data-action="toggle-favorite" data-value="${recipe.id}" aria-pressed="${fav}"
      aria-label="${fav ? "Remover das" : "Salvar nas"} favoritas">${fav ? "★" : "☆"}</button>
    <div class="recipe-card__body">
      <h3 class="recipe-card__title" data-action="open-recipe" data-value="${recipe.id}">${recipe.name}</h3>
      <p class="meta">${recipe.minutes} min · ${recipe.difficulty} · ${recipe.category} · ★ ${formatNumber(averageRating(recipe.id))}</p>
      <p class="meta"><b class="kcal">${recipe.nutrition.kcal} kcal</b> por porção · ${recipe.wasteGrams} g a menos no lixo</p>
    </div>
  </article>`;
}
