/** Ícones SVG da interface (traço em currentColor, grade 24 × 24). */
const stroke = (d, width = 2) =>
  `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;

const PATHS = {
  chevronDown: stroke("M6 9l6 6 6-6", 2.6),
  search: `<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/>${stroke("M15.5 15.5L21 21", 2.2)}`,
  camera: `${stroke("M3.5 8h3.2l1.8-2.6h7l1.8 2.6h3.2v11H3.5z", 1.5)}<circle cx="12" cy="13.2" r="3.4" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  play: `<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 8.5v7l6-3.5z" fill="currentColor"/>`,
  lock: `<rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/>${stroke("M8 11V8a4 4 0 0 1 8 0v3", 2.5)}`,
  pencilSolid: `<path d="M4 20l1-5L16 4l4 4L9 19z" fill="currentColor"/>`,
  pencil: stroke("M4 20l1-5L16 4l4 4L9 19z"),
  chart: stroke("M5 20V11M11 20V5M17 20v-7M3 20h18"),
  trophy: stroke("M7 4h10v5a5 5 0 0 1-10 0zM7 6H4q0 5 4 6M17 6h3q0 5-4 6M12 14v4M8 20h8"),
  star: stroke("M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"),
  list: stroke("M9 6h12M9 12h12M9 18h12M4 6h.5M4 12h.5M4 18h.5", 2.4),
  diamond: stroke("M6 4h12l4 5-10 11L2 9zM2 9h20"),
  logout: stroke("M10 4H5v16h5M14 8l4 4-4 4M18 12H9"),
  bowl: stroke("M3 11h18a9 9 0 0 1-18 0zM9 7c0-1.5 1.5-1.5 1.5-3M14 7c0-1.5 1.5-1.5 1.5-3", 1.8),
  user: `<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/>${stroke("M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6", 1.8)}`,
};

export const icon = (name, size = 20, className = "") =>
  `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name]}</svg>`;
