/** Níveis de jogador. `min` = pontos mínimos. `icon` = SVG em grade 24 × 24. */
export const LEVELS = [
  { name: "Semente", min: 0, icon: '<ellipse cx="12" cy="14" rx="5" ry="6.5" fill="#B07A45"/><path d="M12 8q1-3 3-4" stroke="#3C8A3E" stroke-width="2" fill="none" stroke-linecap="round"/>' },
  { name: "Broto", min: 30, icon: '<path d="M12 21v-9" stroke="#3C8A3E" stroke-width="2.4" stroke-linecap="round"/><path d="M12 13q-7 0-7-7 7 0 7 7zM12 11q6 0 7-6-7 0-7 6z" fill="#5BAE4F"/>' },
  { name: "Horta", min: 80, icon: '<path d="M4 21h16" stroke="#8A5428" stroke-width="2.4" stroke-linecap="round"/><g fill="#5BAE4F"><path d="M7 20q-4-1-4-6 4 1 4 6z"/><path d="M12 20q-4-2-3-9 4 3 3 9zM12 20q4-2 3-9-4 3-3 9z"/><path d="M17 20q4-1 4-6-4 1-4 6z"/></g>' },
  { name: "Pomar", min: 150, icon: '<rect x="10.5" y="14" width="3" height="8" rx="1" fill="#8A5428"/><circle cx="12" cy="10" r="7" fill="#3C8A3E"/><g fill="#E04A3A"><circle cx="9" cy="9" r="1.4"/><circle cx="14.5" cy="7.5" r="1.4"/><circle cx="13" cy="12.5" r="1.4"/></g>' },
];

export function levelIndex(points) {
  let index = 0;
  LEVELS.forEach((level, i) => { if (points >= level.min) index = i; });
  return index;
}

/** Progresso (0 a 100) dentro do nível atual. */
export function levelProgress(points) {
  const i = levelIndex(points);
  if (i === LEVELS.length - 1) return 100;
  const min = LEVELS[i].min, next = LEVELS[i + 1].min;
  return Math.min(100, ((points - min) / (next - min)) * 100);
}

export const nextLevel = points => LEVELS[levelIndex(points) + 1] || null;
