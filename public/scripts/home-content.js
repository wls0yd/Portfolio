const projectList = document.querySelector("[data-project-list]");
const careerList = document.querySelector("[data-career-list]");
const projectDialog = document.querySelector("[data-project-dialog]");
const projectDialogIndex = document.querySelector("[data-project-dialog-index]");
const projectDialogTitle = document.querySelector("[data-project-dialog-title]");
const projectDialogSubtitle = document.querySelector("[data-project-dialog-subtitle]");
const projectDialogOverview = document.querySelector("[data-project-dialog-overview]");
const projectDialogHighlights = document.querySelector("[data-project-dialog-highlights]");
const projectDialogLinks = document.querySelector("[data-project-dialog-links]");
const projectDialogCloseButton = document.querySelector("[data-project-close]");

let projectDetailLookup = new Map();
let lastProjectTrigger = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isInternalHref(href) {
  return typeof href === "string" && href.startsWith("#");
}

function renderLink(link, className) {
  if (!link || !link.href || !link.label) {
    return "";
  }

  const extraAttributes = isInternalHref(link.href)
    ? ""
    : ' target="_blank" rel="noreferrer noopener"';

  return `<a class="${className}" href="${escapeHtml(link.href)}"${extraAttributes}>${escapeHtml(link.label)}</a>`;
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

function closeProjectDialog() {
  if (!projectDialog) {
    return;
  }

  projectDialog.hidden = true;
  document.body.classList.remove("dialog-open");

  if (lastProjectTrigger) {
    lastProjectTrigger.focus();
    lastProjectTrigger = null;
  }
}

function openProjectDialog(project, trigger) {
  if (!projectDialog || !project?.detail) {
    return;
  }

  if (projectDialogIndex) {
    projectDialogIndex.textContent = project.index || "";
  }

  if (projectDialogTitle) {
    projectDialogTitle.textContent = project.title || "";
  }

  if (projectDialogSubtitle) {
    projectDialogSubtitle.textContent = project.detail.subtitle || "";
    projectDialogSubtitle.hidden = !project.detail.subtitle;
  }

  if (projectDialogOverview) {
    projectDialogOverview.textContent = project.detail.overview || "";
    projectDialogOverview.hidden = !project.detail.overview;
  }

  if (projectDialogHighlights) {
    projectDialogHighlights.innerHTML = Array.isArray(project.detail.highlights)
      ? project.detail.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
      : "";
    projectDialogHighlights.hidden = !projectDialogHighlights.innerHTML;
  }

  if (projectDialogLinks) {
    projectDialogLinks.innerHTML = Array.isArray(project.detail.links)
      ? project.detail.links
        .map((link) => renderLink(link, "project-dialog-link"))
        .filter(Boolean)
        .join("")
      : "";
    projectDialogLinks.hidden = !projectDialogLinks.innerHTML;
  }

  lastProjectTrigger = trigger || null;
  projectDialog.hidden = false;
  document.body.classList.add("dialog-open");
  projectDialogCloseButton?.focus();
}

function bindProjectTriggers() {
  if (!projectList) {
    return;
  }

  projectList.querySelectorAll("[data-project-trigger]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projectDetailLookup.get(button.getAttribute("data-project-trigger") || "");

      if (project) {
        openProjectDialog(project, button);
      }
    });
  });
}

function setupProjectDialog() {
  if (!projectDialog) {
    return;
  }

  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) {
      closeProjectDialog();
    }
  });

  projectDialogCloseButton?.addEventListener("click", closeProjectDialog);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !projectDialog.hidden) {
      closeProjectDialog();
    }
  });
}

function renderProjects(items) {
  if (!projectList) {
    return;
  }

  projectDetailLookup = new Map(
    items
      .filter((item) => item?.id)
      .map((item) => [item.id, item]),
  );

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
          <article class="project-card ${escapeHtml(item.accent || "")}" id="${escapeHtml(item.anchorId || "")}">
            <button class="project-card-button" type="button" data-project-trigger="${escapeHtml(item.id)}" aria-haspopup="dialog" aria-controls="project-detail-dialog">
              <p class="project-index">${escapeHtml(item.index || "")}</p>
              <h3>${escapeHtml(item.title || "")}</h3>
              <p>${escapeHtml(item.description || "")}</p>
              ${note}
              <ul>${tags}</ul>
            </button>
          </article>
        `;
      }

      return `
        <article class="project-card ${escapeHtml(item.accent || "")}">
          <p class="project-index">${escapeHtml(item.index || "")}</p>
          <h3>${escapeHtml(item.title || "")}</h3>
          <p>${escapeHtml(item.description || "")}</p>
          <ul>${tags}</ul>
        </article>
      `;
    })
    .join("");

  bindProjectTriggers();
}

function renderCareer(items) {
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

function initHomeContent() {
  try {
    const projects = Array.isArray(window.__HOME_PROJECTS__)
      ? window.__HOME_PROJECTS__
      : [];
    const career = Array.isArray(window.__HOME_CAREER__)
      ? window.__HOME_CAREER__
      : [];

    renderProjects(projects);
    renderCareer(career);
    setupProjectDialog();
  } catch (error) {
    if (projectList) {
      projectList.innerHTML =
        '<p class="dynamic-status">Project data could not be loaded.</p>';
    }

    if (careerList) {
      careerList.innerHTML =
        '<li><p class="dynamic-status">Career data could not be loaded.</p></li>';
    }

    console.error("Failed to initialize homepage content.", error);
  }
}

initHomeContent();
