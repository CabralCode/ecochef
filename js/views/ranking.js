import { SAMPLE_PEOPLE } from "../data/community.js";
import { planName } from "../data/plans.js";
import { state, weekPoints } from "../core/store.js";
import { escapeHtml } from "../core/utils.js";
import { renderAvatar } from "../ui/avatar.js";

export function renderRanking() {
  const me = { name: state.user.name, handle: state.user.handle, plan: state.plan, avatar: state.avatar, weekPoints: weekPoints(), me: true };
  const list = [...SAMPLE_PEOPLE, me].sort((a, b) => b.weekPoints - a.weekPoints);
  return `<div class="page-intro"><div>
      <h1 class="page-title">Ranking da semana</h1>
      <p class="page-lead">Cada preparo e cada avaliação somam pontos. O placar zera toda segunda-feira. Os outros participantes são exemplos.</p>
    </div></div>
  <ol class="ranking">${list.map((p, i) => `<li class="ranking__row ${p.me ? "is-me" : ""}">
      <b class="ranking__pos ranking__pos--${i}">${i + 1}</b>
      ${renderAvatar(p.avatar, p.plan, 48)}
      <span class="ranking__name">${escapeHtml(p.name)}${p.me ? " (você)" : ""}${p.handle ? `<span class="handle">@${escapeHtml(p.handle)}</span>` : ""}</span>
      <span class="plan-tag plan-tag--${p.plan}">${planName(p.plan)}</span>
      <b>${p.weekPoints} pts</b>
    </li>`).join("")}</ol>`;
}
