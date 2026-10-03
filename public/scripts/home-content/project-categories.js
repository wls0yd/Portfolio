import { t } from "../i18n.js?v=3";

export function getProjectCategories() {
  return ["all", "company", "team", "personal"].map((key) => ({
    key,
    title: t(`projects.category.${key}`),
    emptyTitle: t(key === "personal" ? "projects.personalTitle" : "projects.emptyTitle"),
    emptyMessage: t(key === "personal" ? "projects.personalMessage" : "projects.emptyMessage"),
  }));
}

export function getProjectCategory(item) {
  const key = typeof item?.category === "string" ? item.category : item?.category?.key;
  const categories = getProjectCategories();
  return categories.find((category) => category.key !== "all" && category.key === key)
    || categories.find((category) => category.key === "team");
}

export function getProjectCategoryLabel(item) {
  const category = getProjectCategory(item);
  const label = typeof item.category === "object" ? item.category?.label : "";
  const defaultLabel = t("projects.categoryLabel", { category: category.title });
  return label && label !== defaultLabel
    ? `${category.title} · ${label}`
    : defaultLabel;
}
