// Store platforms in display order. `tag` must match the tags used in data/projects.js.
export const RELEASE_PLATFORMS = [
  { tag: "PC", label: "PC" },
  { tag: "PS5", label: "PlayStation 5" },
  { tag: "Nintendo Switch", label: "Nintendo Switch" },
  { tag: "Xbox", label: "Xbox" },
  { tag: "iOS", label: "iOS" },
  { tag: "Android", label: "Android" },
];

// Tags that describe where a project runs (shown on cards), as opposed to tools or features.
export const PLATFORM_TAGS = new Set([...RELEASE_PLATFORMS.map(({ tag }) => tag), "HoloLens 2"]);
