import { releaseBoard } from "./dom.js?v=4";
import { RELEASE_PLATFORMS } from "./platforms.js?v=4";
import { escapeHtml } from "./utils.js?v=4";
import { t } from "../i18n.js?v=4";

// Lets long camel-case titles (e.g. "CatGirlSurvivor1") wrap between words instead of mid-word.
const wrapCamelCase = (text) => escapeHtml(text).replace(/([a-z])([A-Z])/g, "$1<wbr>$2");

// Platform × title table built from project tags, so it never drifts from the project cards.
// Only titles released on at least one store platform appear (e.g. the HoloLens capstone is left out).
export function renderReleaseBoard(projects) {
  if (!releaseBoard) return;

  const titles = projects.filter((project) =>
    RELEASE_PLATFORMS.some(({ tag }) => project.tags?.includes(tag)),
  );
  const platforms = RELEASE_PLATFORMS.filter(({ tag }) =>
    titles.some((project) => project.tags.includes(tag)),
  );

  if (titles.length === 0) {
    releaseBoard.closest(".release-board")?.setAttribute("hidden", "");
    return;
  }

  const header = titles.map((project) => `
    <th scope="col">
      <a class="release-title" href="#${escapeHtml(project.anchorId || "")}">
        ${project.cardImage?.src ? `<img src="${escapeHtml(project.cardImage.src)}" alt="" width="40" height="40" decoding="async" />` : ""}
        <span>${wrapCamelCase(project.title || "")}</span>
      </a>
    </th>`).join("");

  const rows = platforms.map(({ tag, label }) => `
    <tr>
      <th scope="row" class="label">${escapeHtml(label)}</th>
      ${titles.map((project) => {
        const shipped = project.tags.includes(tag);
        return `<td><span class="release-cell${shipped ? " is-shipped" : ""}" aria-hidden="true"></span><span class="sr-only">${escapeHtml(t(shipped ? "release.shipped" : "release.notShipped"))}</span></td>`;
      }).join("")}
    </tr>`).join("");

  releaseBoard.innerHTML = `
    <table class="release-table" aria-labelledby="release-board-title">
      <thead><tr><td></td>${header}</tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}
