(() => {
  const storageKey = "portfolio.theme";
  const preferences = new Set(["light", "dark", "system"]);
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = readPreference();
  let switcher;

  function readPreference() {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return preferences.has(saved) ? saved : "system";
    } catch {
      return "system";
    }
  }

  function applyTheme() {
    document.documentElement.dataset.theme =
      preference === "system"
        ? systemTheme.matches ? "dark" : "light"
        : preference;

    switcher?.querySelectorAll('input[name="theme"]').forEach((input) => {
      input.checked = input.value === preference;
    });
  }

  // Run before the stylesheet loads to avoid showing the wrong theme first.
  applyTheme();

  systemTheme.addEventListener("change", () => {
    if (preference === "system") applyTheme();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = readPreference();
    applyTheme();
  });

  function setupSwitcher() {
    switcher = document.querySelector("[data-theme-switcher]");
    if (!switcher) return;

    switcher.addEventListener("change", (event) => {
      const input = event.target;
      if (!input.matches('input[name="theme"]') || !preferences.has(input.value)) return;

      preference = input.value;
      applyTheme();
      try {
        window.localStorage.setItem(storageKey, preference);
      } catch {
        // The current visit still works when browser storage is unavailable.
      }
    });

    applyTheme();
    switcher.hidden = false;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSwitcher, { once: true });
  } else {
    setupSwitcher();
  }
})();
