import { projectList, projectTabs, projectCount, projectStatus } from "./dom.js?v=3";
import { bindProjectTriggers, setProjectDetailLookup } from "./project-dialog.js?v=3";
import { getProjectCategories, getProjectCategory } from "./project-categories.js?v=3";
import { renderProjectCard } from "./render-project-card.js?v=3";
import { escapeHtml } from "./utils.js?v=3";
import { t } from "../i18n.js?v=3";

let renderedProjectItems = [];
let projectHandlersBound = false;

function getCategoryItems(key) {
  return key === "all" ? renderedProjectItems
    : renderedProjectItems.filter((item) => getProjectCategory(item).key === key);
}

function activateProjectCategory(key, { focusTab = false, announce = true } = {}) {
  const category = getProjectCategories().find((item) => item.key === key);
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
  emptyState.querySelector("h3").textContent = category.emptyTitle;
  emptyState.querySelector("p").textContent = category.emptyMessage;
  if (projectCount) projectCount.textContent = String(items.length).padStart(2, "0");
  if (projectStatus && announce) {
    projectStatus.textContent = items.length > 0
      ? t("projects.status", { category: category.title, count: items.length })
      : t("projects.emptyStatus", { category: category.title });
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

export function renderProjects(items, { revealHash = true } = {}) {
  if (!projectList || !projectTabs) return;

  const selectedCategory = projectTabs.querySelector('[aria-selected="true"]')?.dataset.projectTab || "all";
  const categories = getProjectCategories();
  const categoryOrder = (item) => categories.findIndex((category) => category.key === getProjectCategory(item).key);
  renderedProjectItems = [...items].sort((left, right) => categoryOrder(left) - categoryOrder(right));
  setProjectDetailLookup(renderedProjectItems);
  projectTabs.innerHTML = categories.map((category) => `
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
  activateProjectCategory(selectedCategory, { announce: false });
  if (projectStatus) projectStatus.textContent = "";
  bindProjectTriggers(projectList);
  bindProjectNavigation();
  if (revealHash) revealProjectFromHash();
}
