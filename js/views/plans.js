import { PLANS } from "../data/plans.js";
import { state } from "../core/store.js";

export function renderPlans() {
  return `<div class="page-intro"><div>
      <h1 class="page-title">Escolha seu plano</h1>
      <p class="page-lead">Quanto mais você cozinha, mais receitas libera. Os preços ainda estão em definição, então teste cada plano à vontade.</p>
    </div></div>
  <div class="plans">${PLANS.map((plan, i) => `<div class="plan ${state.plan === i ? "is-current" : ""}">
      <h3><span class="plan-tag plan-tag--${i} plan-tag--large">${plan.name}</span></h3>
      <div class="plan__headline">${plan.headline}</div>
      <ul>${plan.perks.map(p => `<li>${p}</li>`).join("")}</ul>
      <button class="btn plan-tag--${i}" data-action="choose-plan" data-value="${i}" ${state.plan === i ? "disabled" : ""}>${state.plan === i ? "Plano atual" : `Testar ${plan.name}`}</button>
    </div>`).join("")}</div>`;
}
