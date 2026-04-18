export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function isInternalHref(href) {
  return typeof href === "string" && href.startsWith("#");
}

export function renderLink(link, className) {
  if (!link || !link.href || !link.label) {
    return "";
  }

  const extraAttributes = isInternalHref(link.href)
    ? ""
    : ' target="_blank" rel="noreferrer noopener"';

  return `<a class="${className}" href="${escapeHtml(link.href)}"${extraAttributes}>${escapeHtml(link.label)}</a>`;
}
