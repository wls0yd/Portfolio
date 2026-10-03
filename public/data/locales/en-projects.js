// IDs, images, platforms, and destination URLs stay in the shared project data.
export const projects = {
  "arslope": {
    description: "An AR multiplayer racing capstone project that generates tracks from real-world objects.",
    category: { label: "Team project" },
    cardImage: { alt: "AR Slope project cover" },
    detail: {
      overview: "A dynamic AR racing system for Microsoft HoloLens 2 that turns physical objects into track elements and lets two players compete in the same space. The capstone project covered planning, implementation, and a research paper.",
      highlights: [
        "Detected real-world planes and objects and used object center coordinates to generate racing tracks whose shape and difficulty adapt to the environment.",
        "As team lead and main developer, led project planning, core gameplay implementation, multiplayer architecture, and research paper writing.",
        "Combined Photon Unity Networking with World Locking Tools to synchronize multiplayer state and align coordinate systems across devices.",
        "Designed gameplay using hand tracking and gesture input for vehicle control, checkpoint progression, and interactions with items and obstacles.",
        "Documented the project in a paper on ARSlope, a dynamic AR multiplayer racing system based on real-world objects, published in the Journal of the Korea Computer Graphics Society.",
      ],
    },
  },
  "catgirl-survivor-1": {
    description: "A Vampire Survivors-style 2D pixel-art action game developed with Unity and C#.",
    cardImage: { alt: "CatGirlSurvivor1 project cover" },
    detail: {
      overview: "A company project developing a Vampire Survivors-style 2D pixel-art action game in Unity and C#. Seven catgirl characters and combinable skill builds create different combat experiences on each run. The project combines accessible controls with deep progression and is being released across PC and consoles.",
      highlights: [
        "Fight waves of enemies with seven distinct catgirl characters in a Vampire Survivors-style 2D pixel-art action game.",
        "Combine skills into different builds to discover new combat strategies across repeated runs.",
        "Automatic attacks let players focus on movement and skill selection, pairing accessible controls with depth in skill combinations and progression.",
        "Level characters up to 1,000 and upgrade equipment for long-term progression.",
        "The project continues to expand with varied stages, boss battles, and platform-specific support for PC and consoles.",
      ],
    },
  },
  "no-more-slimes": {
    description: "A progression-focused 2D pixel-art action game built with Unity and C#, released on PC, consoles, and mobile.",
    cardImage: { alt: "No More Slimes!! project cover" },
    detail: {
      overview: "A company project built with Unity and C#: a 2D pixel-art action game where players defeat waves of slimes, collect loot, and upgrade characters and weapons. Skill trees, cards, relics, and mercenaries enable different play styles. Released on PC, PS5, Nintendo Switch, Xbox, iOS, and Android.",
      highlights: [
        "Simple, intuitive controls support a progression loop of fighting slime hordes, collecting loot, and upgrading.",
        "Choose skill-tree paths for attack power, attack speed, and special abilities, then combine cards and relics to create different builds.",
        "Recruit and develop mercenaries with distinct attack patterns and unique skills, combining automatic combat with skill use.",
        "Take on crowds of enemies with lightning, freezing, meteors, wall-bouncing boomerangs, and other area attacks.",
        "Weapon upgrades increase attack range and power, bringing 2D pixel art and satisfying combat to PC, consoles, and mobile.",
      ],
    },
  },
};

export const projectLinkLabels = {
  "Steam 페이지": "Steam page",
  "KCGS 게재 논문": "Published paper (KCGS)",
};
