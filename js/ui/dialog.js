import { $ } from "../core/utils.js";

export function showMessage(title, body, { upgrade = false } = {}) {
  const dialog = $("#dialog");
  dialog.innerHTML = `<div class="dialog__body">
    <h2>${title}</h2>
    <p>${body}</p>
    <div class="row">
      ${upgrade ? '<button class="btn btn--orange" data-action="dialog-plans">Ver planos</button>' : ""}
      <button class="btn btn--ghost" data-action="dialog-close">Agora não</button>
    </div>
  </div>`;
  if (!dialog.open) dialog.showModal();
}

export function closeDialog() {
  const dialog = $("#dialog");
  if (dialog.open) dialog.close();
}
