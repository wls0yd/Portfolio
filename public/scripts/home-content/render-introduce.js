import { introduceContent } from "./dom.js?v=4";
import { escapeHtml } from "./utils.js?v=4";
import { t } from "../i18n.js?v=4";

export function renderIntroduce(item) {
  if (!introduceContent) {
    return;
  }

  const paragraphs = Array.isArray(item?.paragraphs) ? item.paragraphs : [];

  if (paragraphs.length === 0) {
    introduceContent.innerHTML = `<p class="dynamic-status">${escapeHtml(t("introduce.empty"))}</p>`;
    return;
  }

  introduceContent.innerHTML = paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}
