import { messages as korean } from "../data/locales/ko.js?v=3";
import { messages as english } from "../data/locales/en.js?v=3";

const dictionaries = { ko: korean, en: english };
const storageKey = "portfolio.language";
const isSupported = (value) => value === "ko" || value === "en";
let language = readLanguage();

function readLanguage() {
  const requested = new URL(window.location.href).searchParams.get("lang");
  if (isSupported(requested)) return requested;
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (isSupported(saved)) return saved;
  } catch {
    // URL selection and switching still work when storage is unavailable.
  }
  return "ko";
}

export function getLanguage() {
  return language;
}

export function t(key, values = {}) {
  const message = dictionaries[language][key] ?? korean[key] ?? key;
  return message.replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
}

function translatePage() {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  ["aria-label", "title", "content", "lang"].forEach((attribute) => {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => {
      element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
    });
  });
  document.querySelectorAll("[data-language-home]").forEach((link) => {
    const url = new URL(link.getAttribute("href"), window.location.href);
    url.searchParams.set("lang", language);
    link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
  });
  document.querySelectorAll("[data-language-select]").forEach((select) => {
    select.value = language;
  });
}

export function setupLanguage(renderContent = () => {}) {
  function refresh(announce = false) {
    translatePage();
    renderContent();
    const status = document.querySelector("[data-language-status]");
    if (status) status.textContent = announce ? t("language.changed") : "";
  }

  document.querySelectorAll("[data-language-select]").forEach((select) => {
    select.addEventListener("change", () => {
      if (!isSupported(select.value) || language === select.value) return;
      language = select.value;
      try {
        window.localStorage.setItem(storageKey, language);
      } catch {
        // Keep this visit functional even when the preference cannot be saved.
      }
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      window.history.replaceState(window.history.state, "", url);
      refresh(true);
    });
  });

  window.addEventListener("popstate", () => {
    const nextLanguage = readLanguage();
    if (nextLanguage === language) return;
    language = nextLanguage;
    refresh();
  });

  refresh();
  document.querySelectorAll("[data-language-switcher]").forEach((switcher) => {
    switcher.hidden = false;
  });
}
