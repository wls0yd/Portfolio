import { careerList, projectList, introduceContent, projectDialog } from "./home-content/dom.js?v=3";
import { renderCareer } from "./home-content/render-career.js?v=3";
import { renderIntroduce } from "./home-content/render-introduce.js?v=3";
import { renderProjects } from "./home-content/render-projects.js?v=3";
import { setupProjectDialog, closeProjectDialog } from "./home-content/project-dialog.js?v=3";
import { getHomeContent } from "../data/home-content.js?v=3";
import { getLanguage, setupLanguage, t } from "./i18n.js?v=3";
import { escapeHtml } from "./home-content/utils.js?v=3";

let firstRender = true;

function renderHomeContent() {
  try {
    const { introduce, projects, career } = getHomeContent(getLanguage());
    if (projectDialog && !projectDialog.hidden) closeProjectDialog();

    renderIntroduce(introduce);
    renderProjects(projects, { revealHash: firstRender });
    renderCareer(career);
    firstRender = false;
  } catch (error) {
    if (introduceContent) {
      introduceContent.innerHTML =
        `<p class="dynamic-status">${escapeHtml(t("introduce.error"))}</p>`;
    }

    if (projectList) {
      projectList.innerHTML =
        `<p class="dynamic-status">${escapeHtml(t("projects.error"))}</p>`;
    }

    if (careerList) {
      careerList.innerHTML =
        `<li><p class="dynamic-status">${escapeHtml(t("career.error"))}</p></li>`;
    }

    console.error("Failed to initialize homepage content.", error);
  }
}

function initHomeContent() {
  setupProjectDialog();
  setupLanguage(renderHomeContent);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomeContent, { once: true });
} else {
  initHomeContent();
}
