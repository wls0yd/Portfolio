import { projectList, projectTabs, projectCount, projectStatus } from "./dom.js";
import { bindProjectTriggers, setProjectDetailLookup } from "./project-dialog.js";
import { PROJECT_CATEGORIES, getProjectCategory } from "./project-categories.js";
import { renderProjectCard } from "./render-project-card.js";
import { escapeHtml } from "./utils.js";

let renderedProjectItems = [];
let projectHandlersBound = false;

function getCategoryItems(key) {
  return key === "all" ? renderedProjectItems
    : renderedProjectItems.filter((item) => getProjectCategory(item).key === key);
}

function activateProjectCategory(key, { focusTab = false, announce = true } = {}) {
  const category = PROJECT_CATEGORIES.find((item) => item.key === key);
  if (!category || !projectList || !projectTabs) return;

  projectTabs.querySelectorAll("[data-project-tab]").forEach((tab) => {
    const active = tab.dataset.projectTab === key;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focusTab) tab.focus();
  });

  const items = getCategoryItems(key);
  projectList.querySelector("[role='tabpanel']").setAttribute("aria-labelledby", `project-tab-${key}`);
  projectList.querySelectorAll("[data-project-category]").forEach((card) => {
    card.hidden = key !== "all" && card.dataset.projectCategory !== key;
  });
  const emptyState = projectList.querySelector("[data-project-empty]");
  emptyState.hidden = items.length > 0;
  emptyState.querySelector("h3").textContent = category.emptyTitle || "공개된 프로젝트가 없습니다";
  emptyState.querySelector("p").textContent = category.emptyMessage || "공개할 프로젝트를 정리하고 있습니다.";
  if (projectCount) projectCount.textContent = String(items.length).padStart(2, "0");
  if (projectStatus && announce) {
    projectStatus.textContent = items.length > 0
      ? `${category.title} 프로젝트 ${items.length}개를 표시합니다.`
      : `${category.title} 프로젝트는 공개 준비 중입니다.`;
  }
}

function getProjectFromHash(hash = window.location.hash) {
  return renderedProjectItems.find((item) => item.anchorId && `#${item.anchorId}` === hash);
}

function revealProjectFromHash() {
  const project = getProjectFromHash();
  if (!project) return;

  const card = document.getElementById(project.anchorId);
  if (card?.hidden) activateProjectCategory(getProjectCategory(project).key);
  window.requestAnimationFrame(() => card?.scrollIntoView({ block: "start" }));
}

function bindProjectNavigation() {
  if (projectHandlersBound) return;

  projectTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-project-tab]");
    if (tab) activateProjectCategory(tab.dataset.projectTab, { focusTab: true });
  });

  projectTabs.addEventListener("keydown", (event) => {
    const tab = event.target.closest("[data-project-tab]");
    if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...projectTabs.querySelectorAll("[data-project-tab]")];
    const index = tabs.indexOf(tab);
    const next = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    activateProjectCategory(tabs[next].dataset.projectTab, { focusTab: true });
  });

  window.addEventListener("hashchange", revealProjectFromHash);
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    const project = link && getProjectFromHash(link.getAttribute("href"));
    if (project && document.getElementById(project.anchorId)?.hidden) {
      activateProjectCategory(getProjectCategory(project).key);
    }
  });
  projectHandlersBound = true;
}

export function renderProjects(items) {
  if (!projectList || !projectTabs) return;

  const categoryOrder = (item) => PROJECT_CATEGORIES.indexOf(getProjectCategory(item));
  renderedProjectItems = [...items].sort((left, right) => categoryOrder(left) - categoryOrder(right));
  setProjectDetailLookup(renderedProjectItems);
  projectTabs.innerHTML = PROJECT_CATEGORIES.map((category) => `
    <button class="project-tab" id="project-tab-${category.key}" type="button" role="tab"
      aria-selected="${category.key === "all"}" aria-controls="project-panel" tabindex="${category.key === "all" ? "0" : "-1"}"
      data-project-tab="${category.key}">
      <span>${escapeHtml(category.title)}</span><span class="project-tab-count">${getCategoryItems(category.key).length}</span>
    </button>
  `).join("");

  projectList.innerHTML = `
    <div id="project-panel" role="tabpanel" aria-labelledby="project-tab-all" tabindex="0">
      <div class="project-gallery">${renderedProjectItems.map(renderProjectCard).join("")}</div>
      <div class="project-empty-card" data-project-empty hidden><h3></h3><p></p></div>
    </div>
  `;
  activateProjectCategory("all", { announce: false });
  bindProjectTriggers(projectList);
  bindProjectNavigation();
  revealProjectFromHash();
}
