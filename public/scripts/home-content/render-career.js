import { careerList } from "./dom.js?v=3";
import { escapeHtml, renderLink } from "./utils.js?v=3";
import { t } from "../i18n.js?v=3";

function renderCareerTitle(value) {
  const title = String(value || "");
  const aliasMatch = title.match(/^(.*?)(\s*)(\([^()]+\))$/u);

  if (!aliasMatch) {
    return escapeHtml(title);
  }

  return `${escapeHtml(aliasMatch[1])}${escapeHtml(aliasMatch[2])}<span class="timeline-title-alias">${escapeHtml(aliasMatch[3])}</span>`;
}

function renderTimelineDetailLabel(value) {
  const label = String(value || "");
  const periodSeparator = " · ";
  const periodStart = label.lastIndexOf(periodSeparator);

  if (periodStart < 0) {
    return escapeHtml(label);
  }

  return `${renderCareerTitle(label.slice(0, periodStart))}<span class="timeline-detail-period">${escapeHtml(label.slice(periodStart))}</span>`;
}

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
            item.label ? `<span class="timeline-detail-label">${renderTimelineDetailLabel(item.label)}</span>` : "",
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

  const openItems = new Set(
    [...careerList.querySelectorAll("[data-career-id]")]
      .filter((item) => item.querySelector("details")?.open)
      .map((item) => item.dataset.careerId),
  );

  careerList.innerHTML = items
    .map(
      (item) => `
        <li data-career-id="${escapeHtml(item.id || "")}">
          <span class="timeline-year">${escapeHtml(item.year || "")}</span>
          <div class="timeline-copy">
            <h3>${renderCareerTitle(item.title)}</h3>
            ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
            ${(item.meta?.length || item.highlights?.length) ? `
              <details class="timeline-extra"${openItems.has(item.id) ? " open" : ""}>
                <summary>${escapeHtml(t("career.details"))}<span class="sr-only">: ${escapeHtml(item.title)}</span></summary>
                <div class="timeline-extra-content">
                  ${renderTimelineMeta(item.meta)}
                  ${renderTimelineHighlights(item.highlights)}
                </div>
              </details>
            ` : ""}
          </div>
        </li>
      `,
    )
    .join("");
}
