import { projectList } from "./dom.js";
import { bindProjectTriggers, setProjectDetailLookup } from "./project-dialog.js";
import { escapeHtml } from "./utils.js";

function renderProjectMedia(item) {
  const imageSrc = item?.cardImage?.src;
  const imageAlt = item?.cardImage?.alt || "";
  const imageMarkup = imageSrc
    ? `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(imageAlt)}" loading="lazy" />`
    : '<div class="project-card-media-placeholder" aria-hidden="true"></div>';

  return `
    <div class="project-card-media">
      ${imageMarkup}
    </div>
  `;
}

function renderProjectContent(item, tags, note) {
  return `
    ${renderProjectMedia(item)}
    <p class="project-index">${escapeHtml(item.index || "")}</p>
    <h3>${escapeHtml(item.title || "")}</h3>
    <p>${escapeHtml(item.description || "")}</p>
    ${note}
    <ul>${tags}</ul>
  `;
}

export function renderProjects(items) {
  if (!projectList) {
    return;
  }

  setProjectDetailLookup(items);

  projectList.innerHTML = items
    .map((item) => {
      const tags = Array.isArray(item.tags)
        ? item.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")
        : "";
      const note = item.externalNote
        ? `<p class="project-note">${escapeHtml(item.externalNote)}</p>`
        : "";

      if (item.detail && item.id) {
        return `
          <article class="project-card ${escapeHtml(item.themeClass || "")}" id="${escapeHtml(item.anchorId || "")}">
            ${renderProjectContent(item, tags, note)}
            <button class="project-card-button" type="button" data-project-trigger="${escapeHtml(item.id)}" aria-haspopup="dialog" aria-controls="project-detail-dialog">
              자세히 보기
            </button>
          </article>
        `;
      }

      return `
        <article class="project-card ${escapeHtml(item.themeClass || "")}">
          ${renderProjectContent(item, tags, note)}
        </article>
      `;
    })
    .join("");

  bindProjectTriggers(projectList);
}
