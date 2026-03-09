// All tunable constants for the game.
// Modify these values to change the look and feel without touching logic.

const CONFIG = {
    world: {
        maxZ: 2000,
        overscan: 200
    },

    colors: {
        // Phase-based sky colors — Endesga 64 palette
        skyPeace: 0x4B7DC8,        // bright blue (#4b7dc8)
        skyTension: 0xE69C69,      // warm sunset (#e69c69)
        skyCrisis: 0xC64524,       // deep red (#c64524)
        skyCatastrophe: 0x0E071B,  // near-black purple (#0e071b)
        skyHope: 0xFFC825,         // golden yellow (#ffc825)

        ground: 0x5A5A5A,          // Endesga mid-gray
        horizon: 0x3C3C3C,         // Endesga dark gray
        sun: 0xFFEB57,             // Endesga pale yellow

        // Seoul buildings — Endesga 64
        buildingModern: 0xC7CFDD,
        buildingGlass: 0x92A1B9,
        buildingApartment: 0xF6CA9F,
        buildingShadow: 0x5A5A5A,
        windowLit: 0xFFEB57,
        windowDark: 0x2A2F4E,

        // Namsan Tower — Endesga 64
        towerBody: 0xB2B2B2,
        towerShadow: 0x8B8B8B,
        towerLight: 0xFF0040,      // Endesga red

        // Street level — Endesga 64
        treeFoliage: 0x33984B,
        treeTrunk: 0x5D2C28,
        streetlight: 0x8B8B8B,
        streetlightGlow: 0xEDAB50,

        // Crisis objects — Endesga 64
        smoke: 0x3C3C3C,
        fire: 0xFF5000,
        screenFlash: 0xFFFFFF
    },

    counts: {
        buildings: 50,
        trees: 20,
        streetlights: 15,
        clouds: 8
    },

    sizes: {
        buildingWidthMin: 80,
        buildingWidthMax: 250,
        buildingHeightMin: 120,
        buildingHeightMax: 500,
        treeWidth: 30,
        treeHeight: 60
    },

    // Entropy-driven phase thresholds
    phases: {
        peace:       { min: 0,  max: 25 },
        tension:     { min: 25, max: 50 },
        crisis:      { min: 50, max: 75 },
        catastrophe: { min: 75, max: 100 }
    },

    // Visual params per phase (GSAP tweens toward these)
    phaseVisuals: {
        peace:       { speed: 40,  focalLength: 400, shake: 0  },
        tension:     { speed: 50,  focalLength: 300, shake: 2  },
        crisis:      { speed: 75,  focalLength: 200, shake: 8  },
        catastrophe: { speed: 100, focalLength: 100, shake: 20 },
        hope:        { speed: 15,  focalLength: 350, shake: 1  }
    },

    // Pseudo-3D road (OutRun / Slipstream style)
    road: {
        segmentLength: 200,     // world units per segment
        visibleSegments: 200,   // draw distance
        roadWidth: 2200,        // road half-width in world units
        shoulderWidth: 600,     // shoulder half-width beyond road edge
        lanes: 3,
        rumbleWidth: 100,       // rumble strip width
        cameraHeight: 1000,     // camera Y above road
        cameraDepth: 0.84,      // 1/tan(fov/2) — ~60° FOV
        centrifugal: 30,        // how much curve pushes camera sideways
        totalSegments: 1600,    // loop length
        fogDensity: 5,          // higher = more distant fog
        // Color pairs [even, odd] — Endesga 64 palette
        colors: {
            road:    [0x5A5A5A, 0x3C3C3C],
            grass:   [0x5AC54F, 0x33984B],
            rumble:  [0xFF0040, 0xFFFFFF],
            lane:    0xC7CFDD,
            shoulder:[0xE07438, 0xED7614]
        }
    },

    timing: {
        sessionDuration: 60,    // seconds for phase 1
        entropyRate: 1.67,      // per second (100 / 60)
        interventionSlowdown: 0.15, // speed multiplier during choices
        choiceDuration: 5000    // ms choices are visible
    }
};
