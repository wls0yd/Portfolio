import { introduceContent } from "./dom.js";
import { escapeHtml } from "./utils.js";

export function renderIntroduce(item) {
  if (!introduceContent) {
    return;
  }

  const paragraphs = Array.isArray(item?.paragraphs) ? item.paragraphs : [];

  if (paragraphs.length === 0) {
    introduceContent.innerHTML = '<p class="dynamic-status">Introduce data is empty.</p>';
    return;
  }

  introduceContent.innerHTML = paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}
