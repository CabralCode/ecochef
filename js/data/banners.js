/**
 * Banners do carrossel da home.
 *
 * Tipos:
 * - "recipe": banner de receita com imagem. A imagem fica em assets/img/banners/<id>.webp
 *             (enquanto ela não existir, aparece um placeholder).
 * - "halloween" e "points": banners especiais com ilustração animada em código.
 *
 * `theme` muda as cores de fundo (veja .banner--<theme> em css/components.css).
 * `recipe` é o id da receita aberta pelo botão.
 */
export const BANNERS = [
  {
    id: "halloween",
    type: "halloween",
    theme: "night",
    eyebrow: "Halloween no EcoChef",
    title: "Um Halloween sem desperdício",
    text: "Fantasminhas feitos com o arroz de ontem. Assustadoramente bons.",
    cta: "Ver receita",
    recipe: 9,
  },
  {
    id: "carne-louca-de-casca-de-banana",
    type: "recipe",
    theme: "forest",
    eyebrow: "Receita da semana",
    title: "Carne louca de casca de banana",
    text: "A casca vira um recheio desfiado e suculento para o pão ou a tapioca.",
    cta: "Quero fazer",
    recipe: 12,
  },
  {
    id: "bolo-de-banana-bem-madura",
    type: "recipe",
    theme: "caramel",
    eyebrow: "Banana pintadinha? Melhor ainda",
    title: "Bolo de banana bem madura",
    text: "Quanto mais madura a banana, mais doce o bolo fica, com menos açúcar.",
    cta: "Ver receita",
    recipe: 44,
  },
  {
    id: "points",
    type: "points",
    theme: "green",
    eyebrow: "Cozinhe e pontue",
    title: "Cada preparo vale pontos",
    cta: "Ver o ranking",
  },
  {
    id: "pudim-de-pao-amanhecido",
    type: "recipe",
    theme: "wine",
    eyebrow: "Pão amanhecido",
    title: "Pudim de pão amanhecido",
    text: "O pão de ontem vira uma sobremesa cremosa, com calda de caramelo.",
    cta: "Ver receita",
    recipe: 31,
  },
  {
    id: "molho-de-tomate-maduro",
    type: "recipe",
    theme: "tomato",
    eyebrow: "Tomate bem maduro",
    title: "Molho de tomate caseiro",
    text: "Tomates no ponto rendem o molho mais saboroso. Congela por até 3 meses.",
    cta: "Ver receita",
    recipe: 46,
  },
  {
    id: "caldo-de-frango-com-carcaca",
    type: "recipe",
    theme: "diamond",
    eyebrow: "Exclusiva Diamond",
    title: "Caldo de frango com carcaça",
    text: "A base que deixa sopas e risotos com gosto de comida de vó.",
    cta: "Ver receita",
    recipe: 56,
  },
];
