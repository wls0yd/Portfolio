import { projects } from "./projects.js?v=3";
import { career } from "./career.js?v=3";
import { introduce } from "./introduce.js?v=3";
import { projects as englishProjects, projectLinkLabels } from "./locales/en-projects.js?v=3";
import { career as englishCareer, introduce as englishIntroduce } from "./locales/en-career.js?v=3";

export function getHomeContent(language) {
  if (language !== "en") return { projects, career, introduce };

  return {
    introduce: englishIntroduce,
    projects: projects.map((project) => {
      const translation = englishProjects[project.id];
      if (!translation) return project;
      return {
        ...project,
        ...translation,
        category: { ...project.category, ...translation.category },
        cardImage: { ...project.cardImage, ...translation.cardImage },
        detail: {
          ...project.detail,
          ...translation.detail,
          links: project.detail.links.map((link) => ({
            ...link,
            label: projectLinkLabels[link.label] || link.label,
          })),
        },
      };
    }),
    career: career.map((item) => {
      const translation = englishCareer[item.id];
      if (!translation) return item;
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
