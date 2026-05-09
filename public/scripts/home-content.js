import { careerList, projectList, introduceContent } from "./home-content/dom.js";
import { renderCareer } from "./home-content/render-career.js";
import { renderIntroduce } from "./home-content/render-introduce.js";
import { renderProjects } from "./home-content/render-projects.js";
import { setupProjectDialog } from "./home-content/project-dialog.js";

function initHomeContent() {
  try {
    const introduce = window.__HOME_INTRODUCE__ || {};
    const projects = Array.isArray(window.__HOME_PROJECTS__)
      ? window.__HOME_PROJECTS__
      : [];
    const career = Array.isArray(window.__HOME_CAREER__)
      ? window.__HOME_CAREER__
      : [];

    renderIntroduce(introduce);
    renderProjects(projects);
    renderCareer(career);
    setupProjectDialog();
  } catch (error) {
    if (introduceContent) {
      introduceContent.innerHTML =
        '<p class="dynamic-status">Introduce data could not be loaded.</p>';
    }

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomeContent, { once: true });
} else {
  initHomeContent();
}
