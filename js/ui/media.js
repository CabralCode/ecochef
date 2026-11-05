import { IMAGES } from "../config.js";
import { state } from "../core/store.js";
import { escapeHtml } from "../core/utils.js";
import { icon } from "./icons.js";
import { RECIPES } from "../data/recipes.js";

const missing = new Set();

export const recipeImagePath = recipe =>
  state.photos[recipe.id] || recipe.image || `${IMAGES.recipes}/${recipe.slug}.${IMAGES.extension}`;

export const bannerImagePath = banner => banner.image || `${IMAGES.banners}/${banner.id}.${IMAGES.extension}`;

export function media({ src, fallback = "", alt, label, placeholderIcon = "camera", eager = false }) {
  const placeholder = `<span class="media__placeholder">${icon(placeholderIcon, 34)}<span>${label}</span></span>`;
  const img = src && !missing.has(src)
    ? `<img class="media__img" src="${src}" ${fallback ? `data-fallback="${fallback}"` : ""} alt="${escapeHtml(alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async">`
    : "";
  return `<div class="media">${placeholder}${img}</div>`;
}

export const recipeMedia = (recipe, opts = {}) =>
  media({ src: recipeImagePath(recipe), alt: `Foto da receita ${recipe.name}`, label: "Imagem da receita", ...opts });

// sem imagem própria do banner, usa a foto da receita
export const bannerMedia = banner => {
  const recipe = RECIPES.find(r => r.id === banner.recipe);
  return media({ src: bannerImagePath(banner), fallback: recipe ? recipeImagePath(recipe) : "", alt: banner.title, label: "Imagem do banner", eager: true });
};

// se a imagem não existir, tira a <img> e fica só o placeholder
export function watchMissingImages() {
  document.addEventListener("error", event => {
    const img = event.target;
    if (img instanceof HTMLImageElement && img.classList.contains("media__img")) {
      missing.add(img.getAttribute("src"));
      const next = img.dataset.fallback;
      if (next && !missing.has(next)) {
        img.removeAttribute("data-fallback");
        img.src = next;
      } else img.remove();
    }
  }, true);
}
