import { WARDROBE } from "../data/avatar.js";

const pick = (key, avatar) => {
  const part = WARDROBE.find(p => p.key === key);
  return part.items[avatar[key] ?? 0]?.svg || "";
};

/**
 * Desenha o personagem. O aro externo usa a cor do plano (gradientes #plan-0, #plan-1, #plan-2
 * definidos no index.html) e o fundo é recortado pelo círculo #avatar-clip.
 */
export function renderAvatar(avatar, plan = 0, size = 44) {
  return `<svg class="avatar" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="Personagem">
    <g clip-path="url(#avatar-clip)">${pick("background", avatar)}</g>
    <circle cx="50" cy="50" r="46" fill="none" stroke="url(#plan-${plan})" stroke-width="7"/>
    <g transform="translate(50 52) scale(.78) translate(-50 -52)">
      ${pick("base", avatar)}<g fill="#1F2A1D">${pick("face", avatar)}</g>${pick("makeup", avatar)}${pick("mustache", avatar)}${pick("accessory", avatar)}
    </g>
  </svg>`;
}
