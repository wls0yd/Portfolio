import { careerList, projectList } from "./home-content/dom.js";
import { renderCareer } from "./home-content/render-career.js";
import { renderProjects } from "./home-content/render-projects.js";
import { setupProjectDialog } from "./home-content/project-dialog.js";

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomeContent, { once: true });
} else {
  initHomeContent();
}
