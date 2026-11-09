import { careerList, projectList, introduceContent, projectDialog } from "./home-content/dom.js?v=4";
import { renderCareer } from "./home-content/render-career.js?v=4";
import { renderIntroduce } from "./home-content/render-introduce.js?v=4";
import { renderProjects } from "./home-content/render-projects.js?v=4";
import { setupProjectDialog, closeProjectDialog } from "./home-content/project-dialog.js?v=4";
import { getHomeContent } from "../data/home-content.js?v=4";
import { getLanguage, setupLanguage, t } from "./i18n.js?v=4";
import { escapeHtml } from "./home-content/utils.js?v=4";
import { renderReleaseBoard } from "./home-content/render-release-board.js?v=4";
import { setupContactCopy } from "./home-content/contact-copy.js?v=4";

let firstRender = true;

function renderHomeContent() {
  try {
    const { introduce, projects, career } = getHomeContent(getLanguage());
    if (projectDialog && !projectDialog.hidden) closeProjectDialog();

    renderIntroduce(introduce);
    renderReleaseBoard(projects);
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
  setupContactCopy();
  setupLanguage(renderHomeContent);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomeContent, { once: true });
} else {
  initHomeContent();
}
