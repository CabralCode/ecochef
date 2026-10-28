import { RECIPES } from "../data/recipes.js";
import { planName } from "../data/plans.js";
import { POINTS } from "../config.js";
import { state, ui, cookedToday, isFavorite } from "../core/store.js";
import { reviewsFor, averageRating } from "../core/ratings.js";
import { $, escapeHtml, formatNumber, plural, stars } from "../core/utils.js";
import { renderAvatar } from "../ui/avatar.js";
import { recipeMedia, media } from "../ui/media.js";
import { planBadge } from "../ui/recipeCard.js";

export const findRecipe = id => RECIPES.find(r => r.id === Number(id));

function nutritionTable(recipe, servings) {
  const n = recipe.nutrition;
  const rows = [["Calorias", n.kcal, "kcal", true], ["Proteínas", n.protein, "g"], ["Carboidratos", n.carbs, "g"], ["Gorduras", n.fat, "g"], ["Fibras", n.fiber, "g"]];
  const value = (v, whole) => (whole ? String(Math.round(v)) : formatNumber(v));
  return `<div class="nutrition">
    <h4 class="label">Informação nutricional</h4>
    <div class="table-scroll"><table>
      <thead><tr><th scope="col">Nutriente</th><th scope="col">1 porção</th><th scope="col">${plural(servings, "porção", "porções")}</th></tr></thead>
      <tbody>${rows.map(([name, v, unit, whole]) => `<tr><th scope="row">${name}</th><td>${value(v, whole)} ${unit}</td><td>${value(v * servings, whole)} ${unit}</td></tr>`).join("")}</tbody>
    </table></div>
    <p class="note">Estimativa calculada com as tabelas TACO (Unicamp) e USDA. Não substitui a orientação de um nutricionista.</p>
  </div>`;
}

// prévia do vídeo: 6s por passo
const STEP_SECONDS = 6;
const video = { seconds: 0, playing: false, timer: null };

export function stopVideo() {
  clearInterval(video.timer);
  video.playing = false;
}
export function resetVideo() {
  stopVideo();
  video.seconds = 0;
}

export function updateVideo() {
  const caption = $("#video-caption");
  if (!caption) return;
  const recipe = findRecipe(ui.recipeId);
  const total = recipe.steps.length * STEP_SECONDS;
  const step = Math.min(recipe.steps.length - 1, Math.floor(video.seconds / STEP_SECONDS));
  caption.innerHTML = `<small>Passo ${step + 1} de ${recipe.steps.length}</small><br>${recipe.steps[step]}`;
  $("#video-progress").style.width = `${(video.seconds / total) * 100}%`;
  $("#video-time").textContent = `${video.seconds} s / ${total} s`;
  $("#video-toggle").textContent = video.playing ? "Pausar" : video.seconds >= total ? "Ver de novo" : "Assistir";
}

export function toggleVideo() {
  const total = findRecipe(ui.recipeId).steps.length * STEP_SECONDS;
  if (video.playing) { stopVideo(); return updateVideo(); }
  if (video.seconds >= total) video.seconds = 0;
  video.playing = true;
  video.timer = setInterval(() => {
    video.seconds += 1;
    if (video.seconds >= total) stopVideo();
    updateVideo();
  }, 1000);
  updateVideo();
}

const videoBlock = () => `<div class="video">
    ${media({ src: "", label: "Vídeo da receita", placeholderIcon: "play" })}
    <div class="video__caption" id="video-caption"></div>
  </div>
  <div class="progress"><i id="video-progress" style="width:0"></i></div>
  <div class="row">
    <button class="btn" id="video-toggle" data-action="video-toggle">Assistir</button>
    <button class="btn btn--ghost" data-action="video-restart">Reiniciar</button>
    <span class="meta" id="video-time"></span>
  </div>
  <p class="note">Prévia do passo a passo. Em breve, o vídeo completo com chefs e criadores convidados.</p>`;

function reviewsBlock(recipe) {
  const list = reviewsFor(recipe.id);
  const avg = averageRating(recipe.id);
  return `<div class="row"><b class="rating-big">${formatNumber(avg)}</b><span class="stars">${stars(Math.round(avg))}</span>
      <span class="meta">${plural(list.length, "avaliação", "avaliações")} · as de outras pessoas são exemplos</span></div>
    <div class="reviews">${list.map(r => `<div class="review">${renderAvatar(r.avatar, r.plan, 40)}<div>
      <b>${escapeHtml(r.name)}</b>${r.handle ? ` <span class="handle">@${escapeHtml(r.handle)}</span>` : ""} <span class="plan-tag plan-tag--${r.plan}">${planName(r.plan)}</span>
      <div class="stars">${stars(r.stars)}</div><div>${escapeHtml(r.text)}</div></div></div>`).join("")}</div>
    <h4 class="label">Já preparou? Conte como ficou</h4>
    <div class="star-picker" role="group" aria-label="Sua nota">${[1, 2, 3, 4, 5].map(i =>
      `<button data-action="review-stars" data-value="${i}" aria-label="${plural(i, "estrela", "estrelas")}">${i <= ui.review.stars ? "★" : "☆"}</button>`).join("")}</div>
    <textarea id="review-text" placeholder="Como ficou? Mudou algum ingrediente? Sua dica ajuda quem vai fazer depois." aria-label="Comentário">${escapeHtml(ui.review.text)}</textarea>
    <button class="btn" data-action="review-send">Publicar avaliação · +${POINTS.review} pts</button>`;
}

export function renderRecipe() {
  const recipe = findRecipe(ui.recipeId);
  const scale = ui.servings / recipe.servings;
  const avg = averageRating(recipe.id);
  const fav = isFavorite(recipe.id);
  const hasPhoto = !!state.photos[recipe.id];
  return `<nav class="breadcrumb" aria-label="Você está em"><button class="link" data-action="home">← Receitas</button><span>/ ${recipe.category} / ${recipe.name}</span></nav>
  <section class="recipe-hero">
    <div class="recipe-hero__media">${recipeMedia(recipe, { eager: true })}</div>
    <div class="recipe-hero__body">
      <div class="row">${recipe.fit ? '<span class="badge">Fit</span>' : ""}${planBadge(recipe)}</div>
      <h1>${recipe.name}</h1>
      <div class="row"><span class="stars">${stars(Math.round(avg))}</span><b>${formatNumber(avg)}</b><span class="meta">${plural(reviewsFor(recipe.id).length, "avaliação", "avaliações")}</span></div>
      <p class="meta">${recipe.minutes} min · ${recipe.difficulty} · ${recipe.category} · ${recipe.nutrition.kcal} kcal por porção</p>
      <div class="impact">Evita cerca de ${Math.round(recipe.wasteGrams * scale)} g de desperdício</div>
      <div class="row">
        <button class="btn btn--ghost" data-action="photo-pick">${hasPhoto ? "Trocar foto" : "Adicionar sua foto"}</button>
        <input type="file" accept="image/*" id="photo-input" hidden>
        ${hasPhoto ? '<button class="btn btn--ghost" data-action="photo-remove">Remover foto</button>' : ""}
        <button class="btn" data-action="cook">${cookedToday(recipe.id) ? "Preparo de hoje registrado" : `Preparei esta receita · +${POINTS.cook} pts`}</button>
        <button class="btn btn--ghost" data-action="toggle-favorite" data-value="${recipe.id}">${fav ? "★ Favorita" : "☆ Favoritar"}</button>
      </div>
    </div>
  </section>
  <div class="recipe-columns">
    <aside class="panel">
      <h3>Ingredientes</h3>
      <div class="servings"><span>Porções</span>
        <button data-action="servings" data-value="-1" aria-label="Menos porções">−</button><b>${ui.servings}</b>
        <button data-action="servings" data-value="1" aria-label="Mais porções">+</button></div>
      <ul>${recipe.ingredients.map(([qty, unit, text]) => `<li>${`${formatNumber(qty * scale)} ${unit} ${text}`.replace(/ {2,}/g, " ")}</li>`).join("")}</ul>
      ${nutritionTable(recipe, ui.servings)}
    </aside>
    <section class="panel">
      <h3>Modo de preparo</h3>
      <ol class="steps">${recipe.steps.map(s => `<li><label><input type="checkbox"><span>${s}</span></label></li>`).join("")}</ol>
      <div class="tip"><b>Dica do EcoChef:</b> ${recipe.tip}</div>
    </section>
  </div>
  <section class="panel panel--spaced"><h3>Vídeo</h3>${videoBlock()}</section>
  <section class="panel panel--spaced"><h3>Avaliações</h3>${reviewsBlock(recipe)}</section>`;
}
