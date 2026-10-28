export const PLANS = [
  {
    name: "Silver",
    daily: 3,
    headline: "3 receitas por dia",
    perks: ["Receitas testadas para o dia a dia", "Pontos, troféus e ranking semanal"],
  },
  {
    name: "Gold",
    daily: 8,
    headline: "8 receitas por dia",
    perks: ["Tudo do Silver", "Receitas exclusivas Gold"],
  },
  {
    name: "Diamond",
    daily: Infinity,
    headline: "Receitas ilimitadas",
    perks: [
      "Tudo do Gold",
      "Nutricionista para tirar dúvidas na hora",
      "Vídeos com chefs e criadores convidados",
      "Receitas exclusivas revisadas por nutricionista",
    ],
  },
];

export const planName = index => PLANS[index].name;
