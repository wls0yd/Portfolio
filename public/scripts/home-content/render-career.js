import { careerList } from "./dom.js";
import { escapeHtml, renderLink } from "./utils.js";

function renderTimelineMeta(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return `
    <dl class="timeline-meta">
      ${items
        .map(
          (item) => `
            <div>
              <dt>${escapeHtml(item.label || "")}</dt>
              <dd>${escapeHtml(item.value || "")}</dd>
            </div>
          `,
        )
        .join("")}
    </dl>
  `;
}

function renderTimelineHighlights(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return `
    <ul class="timeline-details">
      ${items
        .map((item) => {
          const link = item.href && item.linkLabel
            ? renderLink({ href: item.href, label: item.linkLabel }, "timeline-link")
            : "";
          const summaryParts = [
            item.label ? `<span class="timeline-detail-label">${escapeHtml(item.label)}</span>` : "",
            link,
            item.suffix ? `<span>${escapeHtml(item.suffix)}</span>` : "",
          ].filter(Boolean);
          const bullets = Array.isArray(item.bullets) && item.bullets.length > 0
            ? `
              <ul class="timeline-subdetails">
                ${item.bullets
                  .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
                  .join("")}
              </ul>
            `
            : "";

          return `
            <li>
              ${summaryParts.length > 0 ? `<p class="timeline-detail-summary">${summaryParts.join(" ")}</p>` : ""}
              ${bullets}
            </li>
          `;
        })
        .join("")}
    </ul>
  `;
}

export function renderCareer(items) {
  if (!careerList) {
    return;
  }

  careerList.innerHTML = items
    .map(
      (item) => `
        <li>
          <span class="timeline-year">${escapeHtml(item.year || "")}</span>
          <div class="timeline-copy">
            <strong>${escapeHtml(item.title || "")}</strong>
            ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
            ${renderTimelineMeta(item.meta)}
            ${renderTimelineHighlights(item.highlights)}
          </div>
        </li>
      `,
    )
    .join("");
}
