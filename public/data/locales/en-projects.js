// IDs, images, platforms, and destination URLs stay in the shared project data.
export const projects = {
  "arslope": {
    description: "An AR multiplayer racing capstone project that generates tracks from real-world objects.",
    category: { label: "Team project" },
    cardImage: { alt: "AR Slope project cover" },
    detail: {
      contribution: {
        "role": "Team lead · Network development · Git management",
        "scope": "Photon PUN multiplayer, vehicle and game-state synchronization, branch/PR integration and version history",
        "tasks": [
          {
            "title": "Two-player connection and waiting flow",
            "work": "Implemented server connection and room creation/joining for up to two players with Photon PUN. Controlled waiting screens based on player count and connected the master client’s object-selection flow with the other client’s waiting state."
          },
          {
            "title": "Vehicle-state synchronization",
            "work": "Sent and received vehicle position, rotation, and velocity, with interpolation for remote vehicles. Fixed a movement issue on non-master clients and implemented vehicle-scale synchronization and network-position resets on restart."
          },
          {
            "title": "Game-over, restart, and object synchronization",
            "work": "Used RPCs to share the winner and game-over state across clients and route restart requests through the master. Connected vehicle resets with item and obstacle respawning, and applied Photon to item spawning and display."
          },
          {
            "title": "Team Git management and integration",
            "work": "Managed the project’s Git repository as team lead. Merged changes and pull requests across feature branches, develop, and main; reverted problematic changes and reapplied them as needed. Also fixed compilation errors during integration."
          }
        ]
      },
      overview: "A dynamic AR racing system for Microsoft HoloLens 2 that turns physical objects into track elements and lets two players compete in the same space. The capstone project covered planning, implementation, and a research paper.",
      highlights: [
        "Detected real-world planes and objects and used object center coordinates to generate racing tracks whose shape and difficulty adapt to the environment.",
        "As team lead, focused on network development and managed the project’s Git repository and change integration.",
        "Synchronized vehicle and game state with Photon PUN and connected World Locking Tools anchor saving/loading with RPC signals.",
        "Designed gameplay using hand tracking and gesture input for vehicle control, checkpoint progression, and interactions with items and obstacles.",
        "Documented the project in a paper on ARSlope, a dynamic AR multiplayer racing system based on real-world objects, published in the Journal of the Korea Computer Graphics Society.",
      ],
    },
  },
  "catgirl-survivor-1": {
    description: "A Vampire Survivors-style 2D pixel-art action game developed with Unity and C#.",
    cardImage: { alt: "CatGirlSurvivor1 project cover" },
    detail: {
      contribution: {
        "role": "Game client development · Xbox release owner",
        "scope": "ECS and optimization, content and usability features, combat and progression fixes, PC and console support",
        "tasks": [
          {
            "title": "Xbox release ownership",
            "work": "Handled Xbox platform setup and the Xbox release of CatGirlSurvivor1."
          },
          {
            "title": "ECS integration and runtime optimization",
            "work": "Applied an ECS Animator System to monsters and ECS to enemy spawning. Applied object pooling to collectible items and optimized draw calls. Fixed frame drops during BGM changes in the endless dungeon and adjusted its spawn timing per platform."
          },
          {
            "title": "New character, combination skill, and progression features",
            "work": "Added the character 레아 and the combination skill 멸망의날. Added combination-skill bans and a skill-drop bonus stat, and removed the skill-reroll limit. Adjusted the balance of defense-related equipment and artifacts."
          },
          {
            "title": "Combat and dungeon progression fixes",
            "work": "Fixed critical-hit and damage-over-time logic, skill hits and targeting for specific minibosses, and damage received after defeating a boss. Fixed boss-rush entry and pause-state issues after scene transitions or restarts. Corrected item collection after endless-dungeon reloads and magnet use."
          },
          {
            "title": "Usability features and clearer information",
            "work": "Added equipment-stat comparisons, bulk dismantling, and guide/tip popups. Fixed level-up stat displays, critical-hit displays, and font issues."
          },
          {
            "title": "PC and console stability and platform support",
            "work": "Fixed Nintendo Switch crashes and undersized boss health bars on consoles. Configured Steam DRM and fixed continued access to unlocked characters after DLC refunds."
          }
        ]
      },
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
      contribution: {
        "role": "Multiplatform support · Game client development",
        "scope": "PC, Xbox, PS5, Nintendo Switch, iOS, and Android support; build automation; platform services, input, purchases, and save data",
        "tasks": [
          {
            "title": "PC, console, and mobile build and deployment automation",
            "work": "Added Windows, macOS, and Linux build profiles and Steam upload configuration, and expanded Jenkins build workflows. Connected Xbox console/PC builds and packaging, iOS builds and App Store Connect uploads, and improved Android build settings and artifact archiving."
          },
          {
            "title": "PS5 platform service integration",
            "work": "Integrated PS5 trophies, DLC ownership checks, leaderboards, and save data. Connected chapter and stage progress to PS5 Activities and improved trophy progress/unlock synchronization and save/leaderboard error handling."
          },
          {
            "title": "Nintendo Switch platform support",
            "work": "Worked on Switch save data, DLC ownership checks, and leaderboard integration. Adjusted controller button mapping and platform settings, and improved network error handling, build version management, and save-call flows."
          },
          {
            "title": "iOS and Android controls and layout",
            "work": "Implemented touch controls and automatic-skill buttons, and adapted UI layouts to landscape screens and device safe areas. Handled Android back navigation and iOS language preferences, and worked on iCloud saves and Game Center leaderboard integration."
          },
          {
            "title": "Mobile in-app purchases, DLC, and purchase restoration",
            "work": "Connected mobile purchases and DLC ownership to character unlocks and purchase UI. Added purchase restoration and price/status displays, and improved iOS purchase-history checks and preservation/display of existing owners’ unlocks."
          },
          {
            "title": "Save-data compatibility and save-flow improvements",
            "work": "Added migration and validation code for converting older save data to the current structure. Checked preservation of progress and settings from earlier versions, and adjusted redundant autosaves during currency operations and platform-specific save calls."
          },
          {
            "title": "Input switching, combat detection, and gameplay improvements",
            "work": "Refined keyboard, mouse, and gamepad state handling and button icons, and improved menu and stage navigation. Improved attack-target detection, collision queries, and slime spawning/pooling, and updated minion stats, skills, and progression systems."
          }
        ]
      },
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
  "GitHub 저장소": "GitHub repository",
  "Steam 페이지": "Steam page",
  "KCGS 게재 논문": "Published paper (KCGS)",
};
