/**
 * Imagens de receitas e banners com placeholder automático.
 *
 * O placeholder fica sempre por baixo. A <img> é desenhada por cima e, se o arquivo
 * não existir, ela é removida e o caminho entra na lista `missing` para não ser pedido de novo.
 */
import { IMAGES } from "../config.js";
import { state } from "../core/store.js";
import { escapeHtml } from "../core/utils.js";
import { icon } from "./icons.js";

const missing = new Set();

export const recipeImagePath = recipe =>
  state.photos[recipe.id] || recipe.image || `${IMAGES.recipes}/${recipe.slug}.${IMAGES.extension}`;

export const bannerImagePath = banner => banner.image || `${IMAGES.banners}/${banner.id}.${IMAGES.extension}`;

/**
 * @param {object} opts
 * @param {string} opts.src      caminho da imagem
 * @param {string} opts.alt      texto alternativo
 * @param {string} opts.label    texto do placeholder
 * @param {"camera"|"play"} [opts.placeholderIcon]
 * @param {boolean} [opts.eager] carregar sem esperar a rolagem (banners do topo)
 */
export function media({ src, alt, label, placeholderIcon = "camera", eager = false }) {
  const placeholder = `<span class="media__placeholder">${icon(placeholderIcon, 34)}<span>${label}</span></span>`;
  const img = src && !missing.has(src)
    ? `<img class="media__img" src="${src}" alt="${escapeHtml(alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async">`
    : "";
  return `<div class="media">${placeholder}${img}</div>`;
}

export const recipeMedia = (recipe, opts = {}) =>
  media({ src: recipeImagePath(recipe), alt: `Foto da receita ${recipe.name}`, label: "Imagem da receita", ...opts });

export const bannerMedia = banner =>
  media({ src: bannerImagePath(banner), alt: banner.title, label: "Imagem do banner", eager: true });

/** Chamar uma vez na inicialização. */
export function watchMissingImages() {
  document.addEventListener("error", event => {
    const img = event.target;
    if (img instanceof HTMLImageElement && img.classList.contains("media__img")) {
      missing.add(img.getAttribute("src"));
      img.remove();
    }
  }, true);
}
