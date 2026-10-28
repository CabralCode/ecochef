# EcoChef

Protótipo de negócio e aplicação desenvolvido por Vitor Cabral para a Etec.

O EcoChef é um app de receitas de aproveitamento integral: cascas, talos, folhas, sementes, pão e arroz amanhecidos e a comida de ontem viram pratos completos. Tem gamificação (pontos, níveis, troféus, ranking semanal e personagem personalizável) e três planos (Silver, Gold e Diamond).

## Rodando

O JS usa módulos, então precisa de um servidor local:

```bash
python3 -m http.server 8000
```

Depois é só abrir http://localhost:8000. A Live Server do VS Code também funciona.

O site está publicado no GitHub Pages e pode ser instalado no celular como app (PWA): no Safari, Compartilhar › Adicionar à Tela de Início.

## Estrutura

```
index.html
manifest.webmanifest   dados do app instalável
sw.js                  cache offline
css/
  tokens.css           cores, fontes e medidas
  base.css
  layout.css           header, menus, navegação e rodapé
  components.css       botões, cards, busca, categorias, banners
  pages.css            login, receita, perfil, ranking e planos
js/
  main.js              render, navegação e ações
  config.js
  core/                estado, avaliações e utilitários
  data/                receitas, categorias, banners, planos, níveis, avatar
  ui/                  componentes (imagem, carrossel, card, avatar...)
  views/               uma tela por arquivo
assets/
  brand/               logo
  icons/               ícones do app
  img/                 fotos das receitas, banners e login
```

## Imagens

| Onde | Nome do arquivo | Tamanho |
|---|---|---|
| `assets/img/receitas/` | `<slug-da-receita>.webp` | 1200 × 900 |
| `assets/img/banners/` | `<id-do-banner>.webp` | 1600 × 900 |
| `assets/img/login/` | `destaque.webp` | 800 × 800 |

Enquanto a foto não existe, aparece um placeholder. A lista de nomes está no LEIA-ME de cada pasta.

## Identidade visual

Fonte Poppins, fundo branco e a paleta do projeto: Noite de Cozinha `#1E1D56`, Fogão Diário `#FA4846`, Folha Nova `#33A67B` e Molho Reduzido `#A32237`, além do laranja do logo `#EE7433`.

## Dados

Os valores nutricionais são estimativas por porção calculadas com as tabelas TACO (Unicamp) e USDA.
Por enquanto as contas, pontos e favoritas ficam salvos no navegador (localStorage).

## Próximos passos

- Banco de dados e login de verdade (@usuário único no servidor)
- Editar nome e @ pelo perfil
- Fotos das receitas
- Mais receitas em Sementes e caroços e em Bebidas

## Atualizando o app publicado

A cada deploy, subo a versão em `sw.js` (`ecochef-vN`) para os celulares baixarem os arquivos novos.
