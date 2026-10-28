/**
 * Estado do app.
 *
 * `state` guarda o que precisa persistir (conta, pontos, favoritas...). Hoje fica no
 * localStorage do navegador. Quando houver banco de dados, troque `load` e `save`
 * por chamadas à API mantendo o mesmo formato.
 *
 * `ui` guarda o que é só da tela atual (página aberta, filtro, busca...).
 */
import { STORAGE_KEY, LEGACY_STORAGE_KEY } from "../config.js";
import { DEFAULT_AVATAR } from "../data/avatar.js";
import { PLANS } from "../data/plans.js";
import { todayKey, weekKey } from "./utils.js";

const initialState = () => ({
  accounts: {}, // { [email]: { name, handle } }
  user: null, // { name, handle }
  plan: 0, // índice em PLANS
  avatar: { ...DEFAULT_AVATAR },
  photos: {}, // { [recipeId]: dataURL } fotos enviadas pelo próprio usuário
  reviews: {}, // { [recipeId]: { stars, text } }
  favorites: [], // ids de receitas
  points: 0,
  savedGrams: 0,
  cookLog: [], // "idDaReceita|AAAA-MM-DD", um registro por preparo
  week: { key: "", points: 0 },
  usage: { day: "", ids: [] }, // receitas abertas hoje
});

export const state = load();

export const ui = {
  view: "home", // home | favorites | ranking | plans | profile | recipe
  recipeId: null,
  servings: 1,
  collection: "todas",
  query: "",
  authMode: "login", // login | signup
  wardrobeTab: "base",
  review: { stars: 0, text: "" },
  suppressMenus: false,
};

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...initialState(), ...JSON.parse(saved) };
    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "null");
    if (legacy) return migrateLegacy(legacy);
  } catch (e) {
    /* armazenamento indisponível: segue com estado vazio */
  }
  return initialState();
}

/** Converte os dados da primeira versão do protótipo (ecochef.v1). */
function migrateLegacy(old) {
  const a = old.av || {};
  return {
    ...initialState(),
    accounts: Object.fromEntries(Object.entries(old.ac || {}).map(([email, acc]) => [email, { name: acc.n, handle: acc.h }])),
    user: old.u ? { name: old.u.n, handle: old.u.h } : null,
    plan: old.pl || 0,
    avatar: { ...DEFAULT_AVATAR, base: a.b ?? DEFAULT_AVATAR.base, face: a.f || 0, accessory: a.a ?? 1, mustache: a.m || 0, makeup: a.k || 0, background: a.g || 0 },
    photos: old.ph || {},
    reviews: Object.fromEntries(Object.entries(old.rv || {}).map(([id, r]) => [id, { stars: r.st, text: r.tx }])),
    favorites: old.fav || [],
    points: old.pts || 0,
    savedGrams: old.g || 0,
    cookLog: old.lg || (old.ok || []).map(id => `${id}|antes`),
  };
}

export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* sem armazenamento: o app continua funcionando nesta sessão */
  }
}

/** Zera o progresso ao criar uma conta nova. */
export function startFreshProgress() {
  Object.assign(state, {
    avatar: { ...DEFAULT_AVATAR }, points: 0, savedGrams: 0, cookLog: [], favorites: [], reviews: {}, week: { key: "", points: 0 },
  });
}

export function weekPoints() {
  const key = weekKey();
  if (state.week.key !== key) state.week = { key, points: 0 };
  return state.week.points;
}

export function addPoints(amount) {
  weekPoints();
  state.week.points += amount;
  state.points += amount;
}

export function recipesOpenedToday() {
  if (state.usage.day !== todayKey()) state.usage = { day: todayKey(), ids: [] };
  return state.usage.ids.length;
}

export const dailyLimit = () => PLANS[state.plan].daily;
export const cookedToday = recipeId => state.cookLog.includes(`${recipeId}|${todayKey()}`);
export const cookCount = () => state.cookLog.length;
export const isFavorite = recipeId => state.favorites.includes(recipeId);
