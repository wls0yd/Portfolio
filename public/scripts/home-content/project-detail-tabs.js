function selectTab(dialog, selectedTab, moveFocus = false) {
  dialog.querySelectorAll("[data-detail-tab]").forEach((tab) => {
    const selected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = dialog.querySelector(`#${tab.getAttribute("aria-controls")}`);
    if (panel) panel.hidden = !selected;
  });
  if (moveFocus) selectedTab.focus();
}

export function resetProjectDetailTabs(dialog) {
  const firstTab = dialog.querySelector("[data-detail-tab]");
  if (firstTab) selectTab(dialog, firstTab);
}

export function setupProjectDetailTabs(dialog) {
  const tabs = [...dialog.querySelectorAll("[data-detail-tab]")];
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(dialog, tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex;
      switch (event.key) {
        case "ArrowRight": nextIndex = (index + 1) % tabs.length; break;
        case "ArrowLeft": nextIndex = (index - 1 + tabs.length) % tabs.length; break;
        case "Home": nextIndex = 0; break;
        case "End": nextIndex = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      selectTab(dialog, tabs[nextIndex], true);
    });
  });
}
