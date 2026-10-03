import { getProjectCategory, getProjectCategoryLabel } from "./project-categories.js?v=3";
import { escapeHtml, renderLink } from "./utils.js?v=3";
import { t } from "../i18n.js?v=3";

const PLATFORM_TAGS = new Set(["HoloLens 2", "PC", "PS5", "Nintendo Switch", "Xbox", "iOS", "Android"]);

export function renderProjectCard(item) {
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const platforms = tags.filter((tag) => PLATFORM_TAGS.has(tag));
  const summaryTags = platforms.length > 0 && tags.length > 3
    ? platforms
    : [...tags].sort((left, right) => Number(PLATFORM_TAGS.has(right)) - Number(PLATFORM_TAGS.has(left)));
  const image = item.cardImage?.src
    ? `<img src="${escapeHtml(item.cardImage.src)}" alt="${escapeHtml(item.cardImage.alt || "")}" loading="lazy" decoding="async" />`
    : '<div class="project-card-media-placeholder" aria-hidden="true"></div>';
  const action = item.detail && item.id
    ? `<button class="project-card-button" type="button" data-project-trigger="${escapeHtml(item.id)}" aria-label="${escapeHtml(t("projects.details", { title: item.title }))}" aria-haspopup="dialog" aria-controls="project-detail-dialog">${escapeHtml(t("projects.explore"))} <span aria-hidden="true">↗</span></button>`
    : (Array.isArray(item.detail?.links) ? item.detail.links : [])
      .map((link) => renderLink(link, "project-card-link")).join("");

  return `
    <article class="project-card ${escapeHtml(item.themeClass || "")}"${item.anchorId ? ` id="${escapeHtml(item.anchorId)}"` : ""} data-project-category="${escapeHtml(getProjectCategory(item).key)}">
      <div class="project-card-media">${image}</div>
      <div class="project-card-body">
        <p class="project-card-category">${escapeHtml(getProjectCategoryLabel(item))}</p>
        <h3>${escapeHtml(item.title || "")}</h3>
        <p class="project-card-description">${escapeHtml(item.description || "")}</p>
        ${item.externalNote ? `<p class="project-note">${escapeHtml(item.externalNote)}</p>` : ""}
        <ul class="project-platforms" aria-label="${escapeHtml(t("projects.platforms"))}">${summaryTags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>
        ${action}
      </div>
    </article>
  `;
}
