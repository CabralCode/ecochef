const CAP_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const link = (label, action, value) => `<li><button class="footer__link" data-action="${action}" data-value="${value}">${label}</button></li>`;

export function renderFooter() {
  return `<footer class="site-footer">
    <div class="site-footer__inner">
      <div class="footer__brand">
        <span class="footer__mark"><img src="assets/brand/marca-cor.png" alt="" width="40" height="38"></span>
        <div>
          <b>EcoChef</b>
          <p>Sabor que não vai pro lixo. Receitas de aproveitamento integral para o dia a dia.</p>
        </div>
      </div>
      <nav class="footer__col" aria-label="Explorar receitas">
        <h2>Explorar</h2>
        <ul>
          ${link("Todas as receitas", "show-collection", "todas")}
          ${link("Comida de ontem", "show-collection", "sobras")}
          ${link("Cascas", "show-collection", "cascas")}
          ${link("Prontas em 20 min", "show-collection", "rap")}
        </ul>
      </nav>
      <nav class="footer__col" aria-label="Sua conta">
        <h2>Sua conta</h2>
        <ul>
          ${link("Favoritas", "go", "favorites")}
          ${link("Ranking da semana", "go", "ranking")}
          ${link("Planos", "go", "plans")}
          ${link("Meu perfil", "go", "profile")}
        </ul>
      </nav>
      <div class="footer__col footer__about">
        <h2>Sobre o projeto</h2>
        <p class="footer__credit">${CAP_ICON}<span>Trabalho acadêmico: protótipo de negócio e de aplicação desenvolvido por <b>Vitor Cabral</b> para a Etec.</span></p>
      </div>
    </div>
    <div class="site-footer__bottom">
      <span>© ${new Date().getFullYear()} EcoChef · Vitor Cabral</span>
      <span>Valores nutricionais estimados com as tabelas TACO e USDA.</span>
    </div>
  </footer>`;
}
