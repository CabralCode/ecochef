# EcoChef

Webapp de receitas de aproveitamento integral: cascas, talos, sementes, pão e arroz amanhecidos e a comida de ontem.
Protótipo em HTML, CSS e JavaScript puro (sem etapa de build). Os dados ficam no navegador até existir banco de dados.

## Como rodar

O JavaScript usa módulos (`import`/`export`), então o projeto precisa ser aberto por um servidor local.
Abrir o `index.html` com dois cliques não funciona.

```bash
# opção 1: Python
python3 -m http.server 8000
# opção 2: Node
npx serve .
```

Depois acesse http://localhost:8000. No VS Code, a extensão **Live Server** também funciona.

## Estrutura

```
ecochef/
├── index.html              Página única: carrega CSS e o js/main.js
├── manifest.webmanifest    Dados do app instalável (nome, ícones, cores)
├── sw.js                   Service worker: abre rápido e funciona offline
├── css/
│   ├── tokens.css          Cores, fontes, raios e tema escuro (mude aqui para mudar o app todo)
│   ├── base.css            Reset, tipografia e campos de formulário
│   ├── layout.css          Cabeçalho, navegação, menus suspensos e área da página
│   ├── components.css      Botões, selos, cards, busca, categorias, banners, janelas
│   └── pages.css           Login, receita, perfil, ranking e planos
├── js/
│   ├── main.js             Início do app: render(), navegação e ações dos botões
│   ├── config.js           Pastas de imagens, pontos por ação, tempo dos banners
│   ├── core/
│   │   ├── store.js        Estado salvo (conta, pontos, favoritas) e estado da tela
│   │   ├── ratings.js      Avaliações e média de estrelas
│   │   └── utils.js        Funções auxiliares (formatação, datas, aviso na tela)
│   ├── data/               Conteúdo editável, sem lógica de tela
│   │   ├── recipes.js      57 receitas com ingredientes, preparo e nutrição
│   │   ├── categories.js   Categorias dos círculos e do menu "Receitas"
│   │   ├── banners.js      Banners do carrossel
│   │   ├── plans.js        Planos Silver, Gold e Diamond
│   │   ├── levels.js       Níveis de jogador (Semente, Broto, Horta, Pomar)
│   │   ├── avatar.js       Peças do personagem e nível para desbloquear
│   │   └── community.js    Pessoas e avaliações de exemplo
│   ├── ui/                 Peças visuais reutilizáveis
│   │   ├── media.js        Imagem com placeholder automático
│   │   ├── carousel.js     Carrossel de banners (setas, arrastar, automático)
│   │   ├── recipeCard.js   Card de receita
│   │   ├── avatar.js       Desenho do personagem
│   │   ├── dialog.js       Janela de aviso
│   │   └── icons.js        Ícones SVG
│   └── views/              Uma tela por arquivo
│       ├── header.js  login.js  home.js  recipe.js  profile.js  ranking.js  plans.js
└── assets/img/
    ├── receitas/           Fotos das receitas (veja LEIA-ME.md com os 57 nomes)
    └── banners/            Imagens dos banners (veja LEIA-ME.md)
```

## App no celular (PWA)

O EcoChef pode ser instalado como app, sem App Store:

- `manifest.webmanifest`: nome, cores e ícones do app
- `assets/icons/`: ícones (tela de início do iPhone, Android e aba do navegador)
- `sw.js`: service worker que guarda os arquivos para abrir rápido e funcionar sem internet
- `js/ui/install.js`: registra o service worker e mostra, no iPhone, o aviso de como instalar

No iPhone: abra o site publicado no **Safari**, toque em **Compartilhar** e em **Adicionar à Tela de Início**.
