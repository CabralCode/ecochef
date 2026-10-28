/**
 * Pessoas de exemplo para avaliações e ranking enquanto não existe banco de dados.
 * Substitua por dados reais quando a API estiver pronta.
 */
export const SAMPLE_PEOPLE = [
  { name: "Dona Maria", handle: "donamaria", plan: 2, weekPoints: 140, avatar: { base: 1, face: 0, accessory: 1, background: 1 } },
  { name: "Chef Zé", handle: "chefze", plan: 1, weekPoints: 95, avatar: { base: 2, face: 1, accessory: 2, background: 2 } },
  { name: "Ana Horta", handle: "anahorta", plan: 0, weekPoints: 70, avatar: { base: 5, face: 2, accessory: 3, background: 0 } },
  { name: "Bia Fitness", handle: "biafitness", plan: 1, weekPoints: 45, avatar: { base: 3, face: 0, accessory: 0, background: 4 } },
  { name: "Seu Jorge", handle: "seujorge", plan: 0, weekPoints: 20, avatar: { base: 4, face: 1, accessory: 0, background: 0 } },
];

const SAMPLE_REVIEWS = [
  { person: 0, stars: 5, text: "Fica uma delícia e não sobra nada!" },
  { person: 1, stars: 4, text: "Fácil de fazer e rendeu bem." },
  { person: 2, stars: 5, text: "Minha família nem percebeu que era casca." },
  { person: 3, stars: 4, text: "Boa opção leve para o dia a dia." },
];

/** Avaliações de exemplo de uma receita (alterna entre as pessoas para variar). */
export const sampleReviewsFor = recipeId =>
  SAMPLE_REVIEWS.filter((_, i) => (i + recipeId) % 2 === 0).map(r => ({ ...r, ...SAMPLE_PEOPLE[r.person] }));

/** Nomes de usuário que ninguém pode registrar. */
export const RESERVED_HANDLES = ["admin", "ecochef", "suporte", "visitante", "convidado", ...SAMPLE_PEOPLE.map(p => p.handle)];
