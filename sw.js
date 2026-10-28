/**
 * Service worker do EcoChef: deixa o app abrir rápido e funcionar sem internet.
 *
 * IMPORTANTE: ao publicar uma versão nova, aumente o número em VERSION.
 * Assim os celulares baixam os arquivos novos em vez de usar os guardados.
 */
const VERSION = "ecochef-v2";
const APP_CACHE = `${VERSION}-app`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

// Arquivos do app guardados na instalação.
const APP_FILES = [
  "./",
  "./index.html",
  "./assets/brand/logo-horizontal-branco.png",
  "./assets/brand/logo-horizontal-cor.png",
  "./assets/brand/logo-horizontal-preto.png",
  "./assets/brand/logo-vertical-branco.png",
  "./assets/brand/logo-vertical-cor.png",
  "./assets/brand/logo-vertical-preto.png",
  "./assets/brand/marca-branco.png",
  "./assets/brand/marca-cor.png",
  "./assets/brand/marca-preto.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/favicon-32.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./css/base.css",
  "./css/components.css",
  "./css/layout.css",
  "./css/pages.css",
  "./css/tokens.css",
  "./js/config.js",
  "./js/core/ratings.js",
  "./js/core/store.js",
  "./js/core/utils.js",
  "./js/data/avatar.js",
  "./js/data/banners.js",
  "./js/data/categories.js",
  "./js/data/community.js",
  "./js/data/levels.js",
  "./js/data/plans.js",
  "./js/data/recipes.js",
  "./js/main.js",
  "./js/ui/avatar.js",
  "./js/ui/carousel.js",
  "./js/ui/dialog.js",
  "./js/ui/icons.js",
  "./js/ui/install.js",
  "./js/ui/media.js",
  "./js/ui/recipeCard.js",
  "./js/views/header.js",
  "./js/views/home.js",
  "./js/views/login.js",
  "./js/views/plans.js",
  "./js/views/profile.js",
  "./js/views/ranking.js",
  "./js/views/recipe.js",
  "./manifest.webmanifest",
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(APP_CACHE).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

// Remove caches de versões antigas.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Navegação (abrir o app): tenta a rede e, sem internet, usa a página guardada.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("./index.html")));
    return;
  }

  // Fotos e fontes: usa a cópia guardada e atualiza em segundo plano.
  const isImage = url.pathname.includes("/assets/img/");
  const isFont = url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com");
  if (isImage || isFont) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  // Arquivos do app (CSS, JS, ícones): guardado primeiro, rede como reserva.
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(request).then(hit => hit || fetch(request)));
  }
});

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(response => {
      if (response.ok || response.type === "opaque") cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || network;
}
