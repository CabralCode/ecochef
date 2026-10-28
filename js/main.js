/**
 * Ponto de entrada do EcoChef.
 * - render(): desenha a tela atual a partir de `state` e `ui`
 * - ACTIONS: o que cada botão faz (botões usam data-action="nome" e data-value="valor")
 */
import { POINTS } from "./config.js";
import { RECIPES } from "./data/recipes.js";
import { WARDROBE, wardrobePart } from "./data/avatar.js";
import { LEVELS } from "./data/levels.js";
import { PLANS, planName } from "./data/plans.js";
import { state, ui, save, addPoints, recipesOpenedToday, dailyLimit, cookedToday } from "./core/store.js";
import { $, toast, todayKey, scrollToElement } from "./core/utils.js";
import { watchMissingImages } from "./ui/media.js";
import { initCarousel, goToBanner, stepBanner } from "./ui/carousel.js";
import { showMessage, closeDialog } from "./ui/dialog.js";
import { registerServiceWorker, showInstallHint, dismissInstallHint } from "./ui/install.js";
import { renderHeader } from "./views/header.js";
import { renderLogin, onHandleInput, submitAuth } from "./views/login.js";
import { renderHome, renderGrid } from "./views/home.js";
import { renderRecipe, findRecipe, resetVideo, stopVideo, toggleVideo, updateVideo } from "./views/recipe.js";
import { renderProfile, isUnlocked } from "./views/profile.js";
import { renderRanking } from "./views/ranking.js";
import { renderPlans } from "./views/plans.js";

const VIEWS = {
  home: () => renderHome(false),
  favorites: () => renderHome(true),
  recipe: renderRecipe,
  profile: renderProfile,
  ranking: renderRanking,
  plans: renderPlans,
};

export function render() {
  const app = $("#app");
  if (!state.user) {
    app.innerHTML = renderLogin();
    return;
  }
  const keepScroll = $("#collections-track")?.scrollLeft || 0;
  app.innerHTML = `${renderHeader()}<main class="page" id="main">${VIEWS[ui.view]()}</main>`;
  renderGrid();
  if (ui.view === "recipe") updateVideo();
  const track = $("#collections-track");
  if (track) track.scrollLeft = keepScroll;
}

/* ---------- Navegação ---------- */
function go(view, { top = true } = {}) {
  stopVideo();
  closeDialog();
  ui.view = view;
  render();
  if (top) scrollTo(0, 0);
}

function openRecipe(id) {
  const recipe = findRecipe(id);
  if (recipe.plan > state.plan) {
    return showMessage(`Exclusiva do plano ${planName(recipe.plan)}`,
      `Esta receita faz parte do plano ${planName(recipe.plan)} e hoje você está no ${planName(state.plan)}. Conheça os planos e libere receitas como esta.`, { upgrade: true });
  }
  if (!state.usage.ids.includes(recipe.id)) {
    if (recipesOpenedToday() >= dailyLimit()) {
      return showMessage("Você já abriu as receitas de hoje",
        `O plano ${planName(state.plan)} libera ${dailyLimit()} receitas por dia. Amanhã tem mais, ou você pode conhecer um plano com mais receitas.`, { upgrade: true });
    }
    state.usage.ids.push(recipe.id);
    save();
  }
  resetVideo();
  ui.recipeId = recipe.id;
  ui.servings = recipe.servings;
  const mine = state.reviews[recipe.id];
  ui.review = { stars: mine?.stars || 0, text: mine?.text || "" };
  go("recipe");
}

/* ---------- Ações dos botões ---------- */
const ACTIONS = {
  // conta
  "auth-mode": v => { ui.authMode = v; render(); },
  guest: () => { state.user = { name: "Visitante" }; save(); render(); scrollTo(0, 0); showInstallHint(); },
  logout: () => { state.user = null; save(); ui.view = "home"; render(); scrollTo(0, 0); },

  // navegação
  home: () => { ui.collection = "todas"; ui.query = ""; go("home"); },
  go: v => go(v),
  "open-recipe": v => openRecipe(v),
  "show-collection": v => {
    ui.collection = v; ui.query = "";
    go("home", { top: false });
    scrollToElement($("#results-head"));
  },
  "profile-section": v => { go("profile", { top: false }); scrollToElement($(`#${v}`)); },

  // home
  "toggle-collection": v => { ui.collection = ui.collection === v ? "todas" : v; render(); },
  "clear-filters": () => { ui.collection = "todas"; ui.query = ""; render(); },
  "collections-scroll": v => {
    const track = $("#collections-track");
    track?.scrollBy({ left: Number(v) * Math.max(200, track.clientWidth * 0.8), behavior: "smooth" });
  },
  "banner-step": v => stepBanner(Number(v)),
  "banner-go": v => goToBanner(Number(v), true),

  // receita
  "toggle-favorite": v => {
    const id = Number(v);
    const i = state.favorites.indexOf(id);
    if (i < 0) state.favorites.push(id); else state.favorites.splice(i, 1);
    save();
    if (ui.view === "recipe") render(); else renderGrid();
  },
  servings: v => { ui.servings = Math.max(1, ui.servings + Number(v)); render(); },
  cook: () => {
    const recipe = findRecipe(ui.recipeId);
    if (cookedToday(recipe.id)) return toast("Este preparo já está registrado hoje. Fez de novo amanhã? Registre e some mais pontos.");
    state.cookLog.push(`${recipe.id}|${todayKey()}`);
    addPoints(POINTS.cook);
    state.savedGrams += Math.round(recipe.wasteGrams * ui.servings / recipe.servings);
    save(); render();
    toast(`+${POINTS.cook} pontos! Mais comida no prato e menos no lixo.`);
  },
  "photo-pick": () => $("#photo-input").click(),
  "photo-remove": () => { delete state.photos[ui.recipeId]; save(); render(); },
  "video-toggle": () => toggleVideo(),
  "video-restart": () => { resetVideo(); toggleVideo(); },
  "review-stars": v => { ui.review.text = $("#review-text")?.value ?? ui.review.text; ui.review.stars = Number(v); render(); },
  "review-send": () => {
    const text = $("#review-text").value.trim();
    if (!ui.review.stars) return toast("Escolha de 1 a 5 estrelas.");
    if (!text) return toast("Escreva um comentário curto antes de publicar.");
    const first = !state.reviews[ui.recipeId];
    state.reviews[ui.recipeId] = { stars: ui.review.stars, text };
    ui.review.text = text;
    if (first) addPoints(POINTS.review);
    save(); render();
    toast(first ? `Avaliação publicada. Obrigado por ajudar a comunidade! +${POINTS.review} pontos` : "Avaliação atualizada.");
  },

  // perfil
  "wardrobe-tab": v => { ui.wardrobeTab = v; render(); },
  wear: (v, el) => {
    const part = el.dataset.part, index = Number(v);
    if (!isUnlocked(part, index)) {
      const level = LEVELS[wardrobePart(part).items[index].lock];
      return toast(`Nível ${level.name} necessário para desbloquear. Faltam ${level.min - state.points} pontos.`);
    }
    state.avatar[part] = index; save(); render();
  },
  "avatar-random": () => {
    WARDROBE.forEach(part => {
      const free = part.items.map((_, i) => i).filter(i => isUnlocked(part.key, i));
      state.avatar[part.key] = free[Math.floor(Math.random() * free.length)];
    });
    save(); render();
    toast("Visual novo! Gostou? Sorteie de novo se quiser.");
  },

  // planos e janelas
  "choose-plan": v => { state.plan = Number(v); save(); render(); toast(`Plano ${PLANS[state.plan].name} ativado. Bom proveito!`); },
  "dialog-plans": () => go("plans"),
  "dialog-close": () => closeDialog(),
  "install-dismiss": () => dismissInstallHint(),
};

/* ---------- Eventos ---------- */
function bindEvents() {
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    // Depois de clicar num item do cabeçalho, os menus ficam fechados até o mouse sair dele.
    if (el.closest(".site-header")) {
      ui.suppressMenus = true;
      document.activeElement?.blur();
    }
    ACTIONS[el.dataset.action]?.(el.dataset.value, el);
  });

  document.addEventListener("mouseover", e => {
    if (ui.suppressMenus && !e.target.closest(".site-header")) {
      ui.suppressMenus = false;
      $(".site-header")?.classList.remove("menus-off");
    }
  });

  document.addEventListener("input", e => {
    if (e.target.id === "search-input") { ui.query = e.target.value; renderGrid(); }
    if (e.target.id === "auth-handle") onHandleInput(e.target);
  });

  document.addEventListener("submit", e => {
    e.preventDefault();
    if (e.target.id === "search-form") scrollToElement($("#results-head"));
    if (e.target.id === "auth-form" && submitAuth(e.target)) { ui.view = "home"; render(); scrollTo(0, 0); showInstallHint(); }
  });

  // Foto enviada pelo usuário: reduzida para no máximo 900 px e guardada no navegador.
  document.addEventListener("change", e => {
    const file = e.target.id === "photo-input" && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const k = Math.min(1, 900 / Math.max(img.width, img.height));
        canvas.width = img.width * k;
        canvas.height = img.height * k;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        state.photos[ui.recipeId] = canvas.toDataURL("image/jpeg", 0.8);
        save(); render();
        toast("Foto adicionada. Ela fica salva só neste navegador.");
      };
      img.onerror = () => toast("Não conseguimos abrir essa imagem. Tente uma foto em JPG ou PNG.");
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  const dialog = $("#dialog");
  dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
}

/* ---------- Início ---------- */
watchMissingImages();
initCarousel();
bindEvents();
render();
registerServiceWorker();
if (state.user) showInstallHint();

// Disponível no console para depuração.
window.EcoChef = { state, ui, RECIPES, render };
