/**
 * Instalação como app (PWA).
 * - Registra o service worker (sw.js), que guarda os arquivos para abrir rápido e sem internet.
 * - No iPhone/iPad, mostra um aviso ensinando a usar "Adicionar à Tela de Início".
 */
import { $ } from "../core/utils.js";

const DISMISS_KEY = "ecochef.installHintDismissed";
const SNOOZE_DAYS = 14;

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
  navigator.serviceWorker.register("./sw.js").catch(() => {
    /* ambiente sem suporte (pré-visualização, por exemplo): o app funciona normalmente */
  });
}

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const isInstalled = () => navigator.standalone === true || matchMedia("(display-mode: standalone)").matches;

function recentlyDismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return Date.now() - at < SNOOZE_DAYS * 86400000;
  } catch (e) {
    return false;
  }
}

const SHARE_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4M6 11H5v10h14V11h-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function showInstallHint() {
  const box = $("#install-hint");
  if (!box || !isIOS() || isInstalled() || recentlyDismissed()) return;
  box.innerHTML = `<div class="install-hint" role="dialog" aria-label="Instalar o EcoChef">
    <img src="assets/icons/icon-192.png" alt="" width="44" height="44">
    <div class="install-hint__text">
      <b>Leve o EcoChef na tela de início</b>
      <span>Toque em ${SHARE_ICON} <b>Compartilhar</b> e depois em <b>Adicionar à Tela de Início</b>.</span>
    </div>
    <button class="install-hint__close" data-action="install-dismiss" aria-label="Fechar aviso">×</button>
  </div>`;
}

export function dismissInstallHint() {
  try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) { /* sem armazenamento */ }
  const box = $("#install-hint");
  if (box) box.innerHTML = "";
}
