// All tunable constants for the game.
// Modify these values to change the look and feel without touching logic.

const CONFIG = {
    world: {
        maxZ: 2000,
        overscan: 200
    },

    colors: {
        // Phase-based sky colors (interpolated via GSAP)
        skyPeace: 0x87CEEB,
        skyTension: 0xD4A574,
        skyCrisis: 0xCC4422,
        skyCatastrophe: 0x1A0505,
        skyHope: 0xFFD700,

        ground: 0x888888,       // asphalt gray
        horizon: 0x666666,
        sun: 0xFFFDE7,

        // Seoul buildings
        buildingModern: 0xCCCCCC,
        buildingGlass: 0x88AACC,
        buildingApartment: 0xDDCCBB,
        buildingShadow: 0x777777,
        windowLit: 0xFFEEAA,
        windowDark: 0x334455,

        // Namsan Tower
        towerBody: 0xBBBBBB,
        towerShadow: 0x888888,
        towerLight: 0xFF3333,   // red beacon light

        // Street level
        treeFoliage: 0x558844,
        treeTrunk: 0x665544,
        streetlight: 0x999999,
        streetlightGlow: 0xFFDD88,

        // Crisis objects
        smoke: 0x444444,
        fire: 0xFF5500,
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

    timing: {
        sessionDuration: 60,    // seconds for phase 1
        entropyRate: 1.67,      // per second (100 / 60)
        interventionSlowdown: 0.15, // speed multiplier during choices
        choiceDuration: 5000    // ms choices are visible
    }
};
