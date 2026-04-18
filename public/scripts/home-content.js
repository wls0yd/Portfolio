const projectList = document.querySelector("[data-project-list]");
const careerList = document.querySelector("[data-career-list]");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderProjects(items) {
  if (!projectList) {
    return;
  }

  projectList.innerHTML = items
    .map((item) => {
      const tags = Array.isArray(item.tags)
        ? item.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")
        : "";

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
          <div>
            <strong>${escapeHtml(item.title || "")}</strong>
            <p>${escapeHtml(item.description || "")}</p>
          </div>
        </li>
      `,
    )
    .join("");
}

async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json();
}

async function initHomeContent() {
  try {
    const [projects, career] = await Promise.all([
      loadJson("./data/projects.json"),
      loadJson("./data/career.json"),
    ]);

    renderProjects(projects);
    renderCareer(career);
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

void initHomeContent();
