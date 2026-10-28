import { sampleReviewsFor } from "../data/community.js";
import { state } from "./store.js";

/** Avaliações de uma receita: a do usuário (se houver) primeiro, depois as de exemplo. */
export function reviewsFor(recipeId) {
  const list = sampleReviewsFor(recipeId);
  const mine = state.reviews[recipeId];
  if (mine) list.unshift({ ...mine, name: `${state.user.name} (você)`, handle: state.user.handle, plan: state.plan, avatar: state.avatar, mine: true });
  return list;
}

export function averageRating(recipeId) {
  const list = reviewsFor(recipeId);
  return list.reduce((sum, r) => sum + r.stars, 0) / list.length;
}
