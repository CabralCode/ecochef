/**
 * Configurações gerais do EcoChef.
 *
 * IMAGENS: basta salvar o arquivo na pasta certa, com o nome igual ao `slug` (receitas)
 * ou ao `id` (banners). Se o arquivo não existir, o app mostra um placeholder sozinho.
 *
 *   Receitas: assets/img/receitas/<slug>.webp   ex.: assets/img/receitas/bolinho-de-arroz-amanhecido.webp
 *   Banners:  assets/img/banners/<id>.webp      ex.: assets/img/banners/pudim-de-pao-amanhecido.webp
 */
export const IMAGES = {
  recipes: "assets/img/receitas",
  banners: "assets/img/banners",
  extension: "webp",
};

/** Chave do armazenamento local do navegador (protótipo sem banco de dados). */
export const STORAGE_KEY = "ecochef.v2";
export const LEGACY_STORAGE_KEY = "ecochef.v1";

/** Pontos por ação. */
export const POINTS = { cook: 10, review: 5 };

/** Tempo entre trocas automáticas de banner, em milissegundos. */
export const BANNER_INTERVAL = 6000;
