import {
  projectDialog,
  projectDialogCloseButton,
  projectDialogHighlights,
  projectDialogIndex,
  projectDialogLinks,
  projectDialogOverview,
  projectDialogSubtitle,
  projectDialogTitle,
} from "./dom.js";
import { escapeHtml, renderLink } from "./utils.js";

let lastProjectTrigger = null;
let projectDetailLookup = new Map();

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
    }
  });
}
