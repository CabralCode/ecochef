import { STORAGE_KEY, LEGACY_STORAGE_KEY } from "../config.js";
import { DEFAULT_AVATAR } from "../data/avatar.js";
import { PLANS } from "../data/plans.js";
import { todayKey, weekKey } from "./utils.js";

const initialState = () => ({
  accounts: {},
  user: null,
  plan: 0,
  avatar: { ...DEFAULT_AVATAR },
  photos: {},
  reviews: {},
  favorites: [],
  points: 0,
  savedGrams: 0,
  cookLog: [],
  week: { key: "", points: 0 },
  usage: { day: "", ids: [] },
});

export const state = load();

export const ui = {
  view: "home",
  recipeId: null,
  servings: 1,
  collection: "todas",
  query: "",
  authMode: "login",
  wardrobeTab: "base",
  review: { stars: 0, text: "" },
  suppressMenus: false,
};

// por enquanto tudo fica no localStorage, depois troco pela API
function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...initialState(), ...JSON.parse(saved) };
    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "null");
    if (legacy) return migrateLegacy(legacy);
  } catch {}
  return initialState();
}

// converte o formato antigo (ecochef.v1)
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
  } catch {}
}

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
