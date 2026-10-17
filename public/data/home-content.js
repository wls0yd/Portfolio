import { projects } from "./projects.js?v=4";
import { career } from "./career.js?v=4";
import * as koreanProjects from "./locales/ko/ko-projects.js?v=4";
import * as englishProjects from "./locales/en/en-projects.js?v=4";
import { career as koreanCareer } from "./locales/ko/ko-career.js?v=4";
import { career as englishCareer } from "./locales/en/en-career.js?v=4";
import { introduce as koreanIntroduce } from "./locales/ko/ko-introduce.js?v=4";
import { introduce as englishIntroduce } from "./locales/en/en-introduce.js?v=4";

const locales = {
  ko: { ...koreanProjects, career: koreanCareer, introduce: koreanIntroduce },
  en: { ...englishProjects, career: englishCareer, introduce: englishIntroduce },
};

export function getHomeContent(language) {
  const locale = locales[language] || locales.ko;

  return {
    introduce: locale.introduce,
    projects: projects.map((project) => {
      const translation = locale.projects[project.id];
      return {
        ...project,
        ...translation,
        category: { ...project.category, ...translation.category },
        cardImage: { ...project.cardImage, ...translation.cardImage },
        detail: {
          ...project.detail,
          ...translation.detail,
          links: project.detail.links.map(({ labelKey, ...link }) => ({
            ...link,
            label: labelKey ? locale.projectLinkLabels[labelKey] : link.label,
          })),
        },
      };
    }),
    career: career.map((item) => {
      const translation = locale.career[item.id];
      return {
        ...item,
        ...translation,
        highlights: item.highlights.map((highlight, index) => ({
          ...highlight,
          ...translation.highlights[index],
        })),
      };
    }),
  };
}
