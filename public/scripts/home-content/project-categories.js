export const PROJECT_CATEGORIES = [
  { key: "all", title: "전체" },
  { key: "company", title: "회사" },
  { key: "team", title: "팀" },
  {
    key: "personal",
    title: "개인",
    emptyTitle: "개인 프로젝트 준비 중",
    emptyMessage: "1인 개발로 제작 중인 프로젝트를 추후 공개할 예정입니다.",
  },
];

export function getProjectCategory(item) {
  const key = typeof item?.category === "string" ? item.category : item?.category?.key;
  return PROJECT_CATEGORIES.find((category) => category.key !== "all" && category.key === key)
    || PROJECT_CATEGORIES.find((category) => category.key === "team");
}

export function getProjectCategoryLabel(item) {
  const category = getProjectCategory(item);
  const label = typeof item.category === "object" ? item.category?.label : "";
  return label && label !== `${category.title} 프로젝트`
    ? `${category.title} · ${label}`
    : `${category.title} 프로젝트`;
}
