export const DEFAULT_AVATAR = { base: 1, face: 0, accessory: 1, mustache: 0, makeup: 0, background: 0 };

// lock = nível pra desbloquear (0 semente, 1 broto, 2 horta, 3 pomar)
export const WARDROBE = [
  { key: "base", label: "Personagem", items: [
    { name: "Tomate", lock: 0, svg: '<circle cx="50" cy="56" r="34" fill="#C8372D"/><path d="M38 24q12 6 24 0-6-8-12-6-6-2-12 6z" fill="#3C8A3E"/>' },
    { name: "Abóbora", lock: 0, svg: '<ellipse cx="50" cy="58" rx="37" ry="30" fill="#E8791A"/><path d="M50 28v60M36 30q-8 28 0 56M64 30q8 28 0 56" stroke="#C25E0A" fill="none" stroke-width="3"/><rect x="46" y="16" width="8" height="14" rx="3" fill="#6B8E23"/>' },
    { name: "Cenoura", lock: 0, svg: '<path d="M50 24q-10-14-4-20 8 6 4 20zM50 24q2-16 12-18 0 10-12 18z" fill="#3C8A3E"/><path d="M18 38q32-24 64 0L58 94q-8 6-16 0z" fill="#F08A1C"/><path d="M30 52h8M62 64h8M42 78h6" stroke="#C25E0A" stroke-width="3"/>' },
    { name: "Berinjela", lock: 0, svg: '<ellipse cx="50" cy="58" rx="30" ry="38" fill="#6A2C91"/><path d="M34 26q16 10 32 0l-2-10q-14 6-28 0z" fill="#3C8A3E"/><ellipse cx="36" cy="48" rx="4" ry="9" fill="#fff" opacity=".2"/>' },
    { name: "Abacaxi", lock: 1, svg: '<ellipse cx="50" cy="60" rx="30" ry="34" fill="#E5B83A"/><path d="M28 44l44 44M50 28l26 26M28 66l22 22M72 44L28 88M50 28L24 54M72 66L50 88" stroke="#C99A1A" stroke-width="2"/><path d="M50 28l-14-20 8 6 6-12 6 12 8-6z" fill="#3C8A3E"/>' },
    { name: "Pão", lock: 0, svg: '<path d="M14 64q-4-36 36-36t36 36q0 24-36 24T14 64z" fill="#D9923A"/><path d="M30 44q20-12 40 0" stroke="#F3C58A" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M38 34l5 9M52 32l5 9M66 35l4 8" stroke="#A8571A" stroke-width="3"/>' },
    { name: "Ovo", lock: 0, svg: '<ellipse cx="50" cy="58" rx="29" ry="36" fill="#FFF8E6" stroke="#E0D6B8" stroke-width="3"/>' },
    { name: "Queijo", lock: 2, svg: '<rect x="16" y="28" width="68" height="60" rx="12" fill="#F5C842"/><g fill="#E0A91F"><circle cx="28" cy="40" r="5"/><circle cx="72" cy="78" r="6"/><circle cx="72" cy="40" r="3"/><circle cx="30" cy="80" r="3"/></g>' },
  ] },
  { key: "background", label: "Fundo", items: [
    { name: "Liso", lock: 0, svg: '<rect width="100" height="100" style="fill:var(--chip)"/>' },
    { name: "Horta", lock: 0, svg: '<rect width="100" height="100" fill="#D6EFD8"/><circle cx="78" cy="24" r="8" fill="#FFE08A"/><path d="M0 72q25-10 50 0t50 0v28H0z" fill="#7DBB5C"/><path d="M0 84q25-8 50 0t50 0v16H0z" fill="#5BAE4F"/><g fill="#3C8A3E"><path d="M14 74q-2-8 4-10 0 6-4 10z"/><path d="M86 74q2-8-4-10 0 6 4 10z"/></g>' },
    { name: "Cozinha", lock: 0, svg: '<rect width="100" height="100" fill="#F4EFE4"/><path d="M0 20h100M0 40h100M0 60h100M20 0v76M40 0v76M60 0v76M80 0v76" stroke="#E2D9C4" stroke-width="1.5"/><rect y="76" width="100" height="24" fill="#B9763D"/><rect y="74" width="100" height="5" fill="#8A5428"/>' },
    { name: "Feira", lock: 1, svg: '<rect width="100" height="100" fill="#FFF3D6"/><path d="M0 0h100v22H0z" fill="#C8372D"/><path d="M10 0h12v22H10zM34 0h12v22H34zM58 0h12v22H58zM82 0h12v22H82z" fill="#fff"/><path d="M0 22q6 8 12 0t12 0t12 0t12 0t12 0t12 0t12 0t12 0t12 0z" fill="#C8372D"/><rect y="82" width="100" height="18" fill="#C98A2E"/><g fill="#E8791A"><circle cx="18" cy="82" r="6"/><circle cx="30" cy="82" r="6"/></g><g fill="#5BAE4F"><circle cx="70" cy="82" r="6"/><circle cx="82" cy="82" r="6"/></g>' },
    { name: "Pôr do sol", lock: 2, svg: '<rect width="100" height="100" fill="#FFC68A"/><rect width="100" height="38" fill="#F7876B"/><circle cx="50" cy="70" r="20" fill="#FFE29A"/><rect y="74" width="100" height="26" fill="#C25E3A"/>' },
    { name: "Noite", lock: 2, svg: '<rect width="100" height="100" fill="#1E2A4A"/><circle cx="78" cy="22" r="9" fill="#F6E7B0"/><circle cx="82" cy="19" r="8" fill="#1E2A4A"/><g fill="#fff"><circle cx="16" cy="18" r="1.4"/><circle cx="34" cy="10" r="1"/><circle cx="58" cy="26" r="1.2"/><circle cx="12" cy="44" r="1"/><circle cx="90" cy="48" r="1.2"/></g>' },
    { name: "Brilho", lock: 3, svg: '<rect width="100" height="100" fill="url(#gm2)"/><g fill="#fff"><path d="M20 20l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/><path d="M80 70l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5z"/><path d="M78 18l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/></g>' },
  ] },
  { key: "accessory", label: "Chapéus e óculos", items: [
    { name: "Nenhum", lock: 0, svg: "" },
    { name: "Chapéu de chef", lock: 0, svg: '<path d="M32 30Q22 16 36 14Q42 4 52 10Q64 6 68 16Q80 18 68 30Z" fill="#fff" stroke="#D9D5C8" stroke-width="2"/>' },
    { name: "Óculos", lock: 1, svg: '<g fill="#fff" fill-opacity=".4" stroke="#1F2A1D" stroke-width="3"><circle cx="38" cy="50" r="9"/><circle cx="62" cy="50" r="9"/></g><path d="M47 50h6" stroke="#1F2A1D" stroke-width="3"/>' },
    { name: "Broto", lock: 0, svg: '<path d="M50 22q-3-14 9-16 3 12-9 16z" fill="#3C8A3E"/><path d="M50 22q-10-7-21 0 7 9 21 0z" fill="#5BAE4F"/>' },
  ] },
  { key: "face", label: "Expressão", items: [
    { name: "Feliz", lock: 0, svg: '<circle cx="38" cy="50" r="4"/><circle cx="62" cy="50" r="4"/><path d="M40 62q10 10 20 0" fill="none" stroke="#1F2A1D" stroke-width="3" stroke-linecap="round"/>' },
    { name: "Animado", lock: 0, svg: '<circle cx="38" cy="50" r="5"/><circle cx="62" cy="50" r="5"/><path d="M40 60h20q-2 15-10 15t-10-15z" fill="#7A1F1A"/>' },
    { name: "Piscando", lock: 0, svg: '<path d="M32 50q6-6 12 0" fill="none" stroke="#1F2A1D" stroke-width="3" stroke-linecap="round"/><circle cx="62" cy="50" r="4"/><path d="M40 62q10 10 20 0" fill="none" stroke="#1F2A1D" stroke-width="3" stroke-linecap="round"/>' },
  ] },
  { key: "mustache", label: "Bigode", items: [
    { name: "Sem bigode", lock: 0, svg: "" },
    { name: "Fino", lock: 0, svg: '<path d="M36 62q7-5 14 0 7-5 14 0" stroke="#3B2A1A" stroke-width="3" fill="none" stroke-linecap="round"/>' },
    { name: "Guidão", lock: 1, svg: '<path d="M50 64q-10-6-20 0-6 4-4-4M50 64q10-6 20 0 6 4 4-4" stroke="#3B2A1A" stroke-width="5" fill="none" stroke-linecap="round"/>' },
    { name: "Grosso", lock: 0, svg: '<path d="M34 66q8-9 16-3 8-6 16 3-8 5-16 1-8 4-16-1z" fill="#3B2A1A"/>' },
    { name: "Cavanhaque", lock: 2, svg: '<path d="M42 72q8 16 16 0-8 4-16 0z" fill="#3B2A1A"/>' },
  ] },
  { key: "makeup", label: "Maquiagem", items: [
    { name: "Sem make", lock: 0, svg: "" },
    { name: "Batom", lock: 0, svg: '<path d="M41 64q4-4 9-1 5-3 9 1-4 8-9 8t-9-8z" fill="#C8372D"/>' },
    { name: "Blush", lock: 0, svg: '<circle cx="30" cy="62" r="6" fill="#FF7AA8" opacity=".6"/><circle cx="70" cy="62" r="6" fill="#FF7AA8" opacity=".6"/>' },
    { name: "Sombra", lock: 1, svg: '<ellipse cx="38" cy="43" rx="9" ry="4" fill="#7B6CF6" opacity=".75"/><ellipse cx="62" cy="43" rx="9" ry="4" fill="#7B6CF6" opacity=".75"/>' },
    { name: "Cílios", lock: 1, svg: '<path d="M33 46l-4-4M38 44v-5M43 46l4-4M57 46l-4-4M62 44v-5M67 46l4-4" stroke="#1F2A1D" stroke-width="2.5" stroke-linecap="round"/>' },
    { name: "Glitter", lock: 2, svg: '<g fill="#FFD54A"><path d="M30 58l2 4 4 1-4 1-2 4-2-4-4-1 4-1z"/><path d="M70 58l2 4 4 1-4 1-2 4-2-4-4-1 4-1z"/><circle cx="50" cy="40" r="2"/></g>' },
  ] },
];

export const wardrobePart = key => WARDROBE.find(part => part.key === key);
