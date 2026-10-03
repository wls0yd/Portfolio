import {
  projectDialog,
  projectDialogCloseButton,
  projectDialogHighlights,
  projectDialogIndex,
  projectDialogLinks,
  projectDialogOverview,
  projectDialogSubtitle,
  projectDialogTags,
  projectDialogTitle,
} from "./dom.js?v=3";
import { escapeHtml, renderLink } from "./utils.js?v=3";
import { getProjectCategoryLabel } from "./project-categories.js?v=3";

let lastProjectTrigger = null;
let projectDetailLookup = new Map();

const DIALOG_FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function renderDialogHighlight(value) {
  const highlight = String(value || "");
  const terminalPhrase = highlight.match(/^(.*?)([^\s]+ 수 있습니다\.)$/u);

  if (!terminalPhrase) {
    return escapeHtml(highlight);
  }

  return `${escapeHtml(terminalPhrase[1])}<span class="project-dialog-phrase">${escapeHtml(terminalPhrase[2])}</span>`;
}

function setDialogBackgroundInert(isInert) {
  const backgroundElements = [
    document.querySelector(".topbar"),
    document.querySelector(".site-footer"),
    ...document.querySelectorAll(".layout > :not([data-project-dialog])"),
  ].filter(Boolean);

  backgroundElements.forEach((element) => {
    element.inert = isInert;
  });
}

function trapProjectDialogFocus(event) {
  if (event.key !== "Tab" || !projectDialog || projectDialog.hidden) {
    return;
  }

  const focusableElements = Array.from(
    projectDialog.querySelectorAll(DIALOG_FOCUSABLE_SELECTOR),
  ).filter((element) => element.getClientRects().length > 0);

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && (activeElement === firstElement || !projectDialog.contains(activeElement))) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && (activeElement === lastElement || !projectDialog.contains(activeElement))) {
    event.preventDefault();
    firstElement.focus();
  }
}

export function setProjectDetailLookup(items) {
  projectDetailLookup = new Map(
    items
      .filter((item) => item?.id)
      .map((item) => [item.id, item]),
  );
}

export function closeProjectDialog() {
  if (!projectDialog) {
    return;
  }

  projectDialog.hidden = true;
  document.body.classList.remove("dialog-open");
  setDialogBackgroundInert(false);

  if (lastProjectTrigger) {
    lastProjectTrigger.focus();
    lastProjectTrigger = null;
  }
}

export function openProjectDialog(project, trigger) {
  if (!projectDialog || !project?.detail) {
    return;
  }

  if (projectDialogIndex) {
    projectDialogIndex.textContent = getProjectCategoryLabel(project);
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

  if (projectDialogTags) {
    projectDialogTags.innerHTML = Array.isArray(project.tags)
      ? project.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")
      : "";
    projectDialogTags.hidden = !projectDialogTags.innerHTML;
  }

  if (projectDialogHighlights) {
    projectDialogHighlights.innerHTML = Array.isArray(project.detail.highlights)
      ? project.detail.highlights.map((item) => `<li>${renderDialogHighlight(item)}</li>`).join("")
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
  projectDialog.querySelector(".project-dialog").scrollTop = 0;
  document.body.classList.add("dialog-open");
  setDialogBackgroundInert(true);
  projectDialogCloseButton?.focus();
}

export function bindProjectTriggers(projectList) {
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

export function setupProjectDialog() {
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
      return;
    }

    trapProjectDialogFocus(event);
  });
}
