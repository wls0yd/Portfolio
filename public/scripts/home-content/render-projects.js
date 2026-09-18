import { projectList } from "./dom.js";
import { bindProjectTriggers, setProjectDetailLookup } from "./project-dialog.js";
import { escapeHtml, renderLink } from "./utils.js";

const PROJECT_CATEGORIES = [
  {
    key: "company",
    eyebrow: "COMPANY",
    title: "MinimumStudio",
    description: "MinimumStudio에서 참여한 실무 기반 프로젝트입니다.",
  },
  {
    key: "team",
    eyebrow: "TEAM",
    title: "팀 프로젝트",
    description: "학교, 협업, 팀 단위로 역할을 나누어 완성한 프로젝트입니다.",
  },
  {
    key: "personal",
    eyebrow: "PERSONAL",
    title: "개인 프로젝트",
    description: "혼자 기획하거나 직접 구현한 프로젝트를 모아 보여주는 영역입니다.",
    emptyMessage: "아직 공개 가능한 개인 프로젝트는 정리 중입니다.",
  },
];

const PLATFORM_TAGS = new Set([
  "HoloLens 2",
  "PC",
  "PS5",
  "Nintendo Switch",
  "Xbox",
]);

let renderedProjectItems = [];
let projectHashHandlerBound = false;
let projectAnchorHandlerBound = false;
let projectTabHandlerBound = false;

function getProjectCategory(item) {
  const rawCategory = item?.category;
  const categoryKey = typeof rawCategory === "string"
    ? rawCategory
    : rawCategory?.key;

  return PROJECT_CATEGORIES.find((category) => category.key === categoryKey)
    || PROJECT_CATEGORIES[1];
}

function getCategoryProjectCount(categoryKey, groupedProjects) {
  return groupedProjects.get(categoryKey)?.length || 0;
}

function renderProjectMedia(item) {
  const imageSrc = item?.cardImage?.src;
  const imageAlt = item?.cardImage?.alt || "";
  const imageMarkup = imageSrc
    ? `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(imageAlt)}" loading="lazy" />`
    : '<div class="project-card-media-placeholder" aria-hidden="true"></div>';

  return `
    <div class="project-card-media">
      ${imageMarkup}
    </div>
  `;
}

function renderProjectContent(item, tags, note, links, action = "") {
  return `
    ${renderProjectMedia(item)}
    <div class="project-card-body">
      <p class="project-index">${escapeHtml(item.index || "")}</p>
      <h3>${escapeHtml(item.title || "")}</h3>
      <ul class="project-tags">${tags}</ul>
      <p class="project-card-description">${escapeHtml(item.description || "")}</p>
      ${note}
      ${links ? `<div class="project-card-links">${links}</div>` : ""}
      ${action}
    </div>
  `;
}

function renderProjectCard(item) {
  const tags = Array.isArray(item.tags)
    ? [...item.tags]
      .sort((left, right) => Number(PLATFORM_TAGS.has(right)) - Number(PLATFORM_TAGS.has(left)))
      .map((tag) => {
        const className = PLATFORM_TAGS.has(tag) ? "project-tag-platform" : "";

        return `<li class="${className}">${escapeHtml(tag)}</li>`;
      })
      .join("")
    : "";
  const note = item.externalNote
    ? `<p class="project-note">${escapeHtml(item.externalNote)}</p>`
    : "";
  const links = Array.isArray(item.detail?.links)
    ? item.detail.links
      .map((link) => renderLink(link, "project-card-link"))
      .filter(Boolean)
      .join("")
    : "";

  if (item.detail && item.id) {
    const action = `
      <button class="project-card-button" type="button" data-project-trigger="${escapeHtml(item.id)}" aria-haspopup="dialog" aria-controls="project-detail-dialog">
        자세히 보기
      </button>
    `;

    return `
      <article class="project-card ${escapeHtml(item.themeClass || "")}" id="${escapeHtml(item.anchorId || "")}">
        ${renderProjectContent(item, tags, note, links, action)}
      </article>
    `;
  }

  return `
    <article class="project-card ${escapeHtml(item.themeClass || "")}">
      ${renderProjectContent(item, tags, note, links)}
    </article>
  `;
}

function renderProjectTabs(groupedProjects, activeCategoryKey) {
  return `
    <div class="project-tabs" role="tablist" aria-label="프로젝트 분류">
      ${PROJECT_CATEGORIES
        .map((category) => {
          const isActive = category.key === activeCategoryKey;
          const projectCount = getCategoryProjectCount(category.key, groupedProjects);

          return `
            <button
              class="project-tab"
              id="project-tab-${escapeHtml(category.key)}"
              type="button"
              role="tab"
              aria-selected="${isActive ? "true" : "false"}"
              aria-controls="project-panel-${escapeHtml(category.key)}"
              tabindex="${isActive ? "0" : "-1"}"
              data-project-tab="${escapeHtml(category.key)}"
            >
              <span>${escapeHtml(category.title)}</span>
              <strong>${escapeHtml(projectCount)}</strong>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderProjectGroup(category, items, activeCategoryKey) {
  if (items.length === 0 && !category.emptyMessage) {
    return "";
  }

  const isActive = category.key === activeCategoryKey;
  const panelId = `project-panel-${category.key}`;
  const groupContent = items.length > 0
    ? items.map((item, index) => renderProjectCard({
      ...item,
      index: String(index + 1).padStart(2, "0"),
    })).join("")
    : `<p class="project-empty-card">${escapeHtml(category.emptyMessage)}</p>`;

  return `
    <section
      class="project-category project-category-${escapeHtml(category.key)}${isActive ? " is-active" : ""}"
      id="${escapeHtml(panelId)}"
      role="tabpanel"
      aria-labelledby="project-tab-${escapeHtml(category.key)}"
      data-project-panel="${escapeHtml(category.key)}"
      aria-hidden="${isActive ? "false" : "true"}"
      ${isActive ? "" : "hidden"}
    >
      <div class="project-category-heading">
        <p>${escapeHtml(category.eyebrow)}</p>
        <h3>${escapeHtml(category.title)}</h3>
        <span>${escapeHtml(category.description)}</span>
      </div>
      <div class="project-category-list">
        ${groupContent}
      </div>
    </section>
  `;
}

function activateProjectCategory(categoryKey, options = {}) {
  const targetCategory = PROJECT_CATEGORIES.find((category) => category.key === categoryKey);

  if (!projectList || !targetCategory) {
    return;
  }

  projectList.querySelectorAll("[data-project-tab]").forEach((tab) => {
    const isActive = tab.getAttribute("data-project-tab") === targetCategory.key;

    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.setAttribute("tabindex", isActive ? "0" : "-1");

    if (isActive && options.focusTab) {
      tab.focus();
    }
  });

  projectList.querySelectorAll("[data-project-panel]").forEach((panel) => {
    const isActive = panel.getAttribute("data-project-panel") === targetCategory.key;

    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", isActive ? "false" : "true");
  });
}

function getCategoryKeyFromHash() {
  const anchorId = window.location.hash.replace("#", "");

  if (!anchorId) {
    return "";
  }

  const matchedProject = renderedProjectItems.find((item) => item.anchorId === anchorId);

  return matchedProject ? getProjectCategory(matchedProject).key : "";
}

function getCategoryKeyFromAnchor(anchorId) {
  if (!anchorId) {
    return "";
  }

  const matchedProject = renderedProjectItems.find((item) => item.anchorId === anchorId);

  return matchedProject ? getProjectCategory(matchedProject).key : "";
}

function activateProjectCategoryFromHash() {
  const anchorId = window.location.hash.replace("#", "");
  const categoryKey = getCategoryKeyFromAnchor(anchorId);

  if (!categoryKey) {
    return;
  }

  activateProjectCategory(categoryKey);

  window.requestAnimationFrame(() => {
    const target = document.getElementById(window.location.hash.replace("#", ""));

    target?.scrollIntoView({ block: "start" });
  });
}

function bindProjectTabs() {
  const tabs = Array.from(projectList.querySelectorAll("[data-project-tab]"));

  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        return;
      }

      event.preventDefault();

      const lastTabIndex = tabs.length - 1;
      const nextIndex = {
        ArrowLeft: index === 0 ? lastTabIndex : index - 1,
        ArrowRight: index === lastTabIndex ? 0 : index + 1,
        Home: 0,
        End: lastTabIndex,
      }[event.key];
      const nextTab = tabs[nextIndex];

      activateProjectCategory(nextTab.getAttribute("data-project-tab") || "", {
        focusTab: true,
      });
    });
  });

  if (!projectTabHandlerBound) {
    projectList.addEventListener("click", (event) => {
      const tab = event.target?.closest?.("[data-project-tab]");

      if (!tab || !projectList.contains(tab)) {
        return;
      }

      activateProjectCategory(tab.getAttribute("data-project-tab") || "", {
        focusTab: true,
      });
    });
    projectTabHandlerBound = true;
  }

  if (!projectHashHandlerBound) {
    window.addEventListener("hashchange", activateProjectCategoryFromHash);
    projectHashHandlerBound = true;
  }

  if (!projectAnchorHandlerBound) {
    document.addEventListener("click", (event) => {
      const link = event.target?.closest?.("a[href^='#']");
      const anchorId = link?.getAttribute("href")?.replace("#", "") || "";
      const categoryKey = getCategoryKeyFromAnchor(anchorId);

      if (!categoryKey) {
        return;
      }

      activateProjectCategory(categoryKey);
    });
    projectAnchorHandlerBound = true;
  }
}

export function renderProjects(items) {
  if (!projectList) {
    return;
  }

  renderedProjectItems = items;
  setProjectDetailLookup(items);

  const groupedProjects = PROJECT_CATEGORIES.reduce((groups, category) => {
    groups.set(category.key, []);
    return groups;
  }, new Map());

  items.forEach((item) => {
    const category = getProjectCategory(item);
    groupedProjects.get(category.key).push(item);
  });

  const hashCategoryKey = getCategoryKeyFromHash();
  const firstCategoryWithProjects = PROJECT_CATEGORIES.find((category) => {
    return getCategoryProjectCount(category.key, groupedProjects) > 0;
  });
  const activeCategoryKey = hashCategoryKey || firstCategoryWithProjects?.key || PROJECT_CATEGORIES[0].key;

  projectList.innerHTML = [
    renderProjectTabs(groupedProjects, activeCategoryKey),
    ...PROJECT_CATEGORIES.map((category) => {
      return renderProjectGroup(category, groupedProjects.get(category.key) || [], activeCategoryKey);
    }),
  ]
    .join("");

  bindProjectTabs();
  bindProjectTriggers(projectList);
  activateProjectCategoryFromHash();
}
