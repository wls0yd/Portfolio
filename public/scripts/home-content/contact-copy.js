import { t } from "../i18n.js?v=4";

// mailto: links do nothing on machines without a mail app, so offer a one-click copy as well.
export function setupContactCopy() {
  const button = document.querySelector("[data-contact-copy]");
  const email = document.querySelector("[data-contact-email]");
  const status = document.querySelector("[data-contact-copy-status]");
  if (!button || !email || !navigator.clipboard?.writeText) return;

  let clearTimer;
  button.hidden = false;
  button.addEventListener("click", async () => {
    const address = email.getAttribute("href").replace(/^mailto:/, "");
    try {
      await navigator.clipboard.writeText(address);
      if (status) status.textContent = t("contact.copied");
    } catch {
      if (status) status.textContent = t("contact.copyFailed");
    }
    window.clearTimeout(clearTimer);
    clearTimer = window.setTimeout(() => {
      if (status) status.textContent = "";
    }, 4000);
  });
}
