import { getProjectCategory, getProjectCategoryLabel } from "./project-categories.js?v=4";
import { PLATFORM_TAGS } from "./platforms.js?v=4";
import { escapeHtml, renderLink } from "./utils.js?v=4";
import { t } from "../i18n.js?v=4";

function renderMedia(image) {
  if (!image?.src) {
    return '<div class="project-card-media-placeholder" aria-hidden="true"></div>';
  }

  const src = escapeHtml(image.src);
  // The blurred copy fills the empty space when the art's shape differs from the frame (e.g. square logos).
  return `
    <img class="project-card-backdrop" src="${src}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
    <img class="project-card-art" src="${src}" alt="${escapeHtml(image.alt || "")}" loading="lazy" decoding="async" />`;
}

export function renderProjectCard(item) {
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const platforms = tags.filter((tag) => PLATFORM_TAGS.has(tag));
  const summaryTags = platforms.length > 0 && tags.length > 3
    ? platforms
    : [...tags].sort((left, right) => Number(PLATFORM_TAGS.has(right)) - Number(PLATFORM_TAGS.has(left)));
  const action = item.detail && item.id
    ? `<button class="project-card-button" type="button" data-project-trigger="${escapeHtml(item.id)}" aria-label="${escapeHtml(t("projects.details", { title: item.title }))}" aria-haspopup="dialog" aria-controls="project-detail-dialog">${escapeHtml(t("projects.explore"))}</button>`
    : (Array.isArray(item.detail?.links) ? item.detail.links : [])
      .map((link) => renderLink(link, "project-card-link")).join("");

  return `
    <article class="project-card ${escapeHtml(item.themeClass || "")}"${item.anchorId ? ` id="${escapeHtml(item.anchorId)}"` : ""} data-project-category="${escapeHtml(getProjectCategory(item).key)}">
      <div class="project-card-media">${renderMedia(item.cardImage)}</div>
      <div class="project-card-body">
        <p class="project-card-category label">${escapeHtml(getProjectCategoryLabel(item))}</p>
        <h3>${escapeHtml(item.title || "")}</h3>
        <p class="project-card-description">${escapeHtml(item.description || "")}</p>
        ${item.externalNote ? `<p class="project-note">${escapeHtml(item.externalNote)}</p>` : ""}
        <ul class="project-platforms" aria-label="${escapeHtml(t("projects.platforms"))}">${summaryTags.map((tag) => `<li class="label">${escapeHtml(tag)}</li>`).join("")}</ul>
        ${action}
      </div>
    </article>
  `;
}
