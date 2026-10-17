import { escapeHtml } from "./utils.js?v=3";
import { t } from "../i18n.js?v=3";

// Add detail.contribution per project: { role, scope, tasks: [{ title, work }] }.
// Missing values remain explicitly marked placeholders until real content is supplied.
export function renderProjectContribution(contribution = {}) {
  const content = contribution || {};
  const tasks = content.tasks?.length ? content.tasks : [{}, {}];
  const isDraft = !content.role || !content.scope || tasks.some((task) => !task.title || !task.work);
  const value = (text, key) => escapeHtml(text || t(`contribution.${key}`));

  return `
    <section class="project-contribution" aria-labelledby="project-contribution-title">
      <div class="project-contribution-heading">
        <h4 id="project-contribution-title">${t("contribution.title")}</h4>
        ${isDraft ? `<span class="project-contribution-badge">${t("contribution.draft")}</span>` : ""}
      </div>
      ${isDraft ? `<p class="project-contribution-note">${t("contribution.note")}</p>` : ""}
      <dl class="project-contribution-summary">
        <div><dt>${t("contribution.role")}</dt><dd>${value(content.role, "rolePlaceholder")}</dd></div>
        <div><dt>${t("contribution.scope")}</dt><dd>${value(content.scope, "scopePlaceholder")}</dd></div>
      </dl>
      <h5 class="project-contribution-tasks-title">${t("contribution.tasks")}</h5>
      <ol class="project-contribution-tasks">
        ${tasks.map((task, index) => `
          <li>
            <span class="project-contribution-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
            <div class="project-contribution-task">
              <h6>${value(task.title, "taskTitle")}</h6>
              <p>${value(task.work, "workPlaceholder")}</p>
            </div>
          </li>`).join("")}
      </ol>
    </section>`;
}
