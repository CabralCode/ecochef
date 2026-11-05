import { sampleReviewsFor } from "../data/community.js";
import { state } from "./store.js";

export function reviewsFor(recipeId) {
  const list = sampleReviewsFor(recipeId);
  const mine = state.reviews[recipeId];
  if (mine) list.unshift({ ...mine, name: `${state.user.name} (você)`, handle: state.user.handle, plan: state.plan, avatar: state.avatar, mine: true });
  // avaliação com foto do preparo aparece primeiro
  return list.sort((a, b) => Boolean(b.photo) - Boolean(a.photo));
}

export function averageRating(recipeId) {
  const list = reviewsFor(recipeId);
  return list.reduce((sum, r) => sum + r.stars, 0) / list.length;
}
