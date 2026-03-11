// All tunable constants for the game — Babel Express edition.
// Palette derived from babel-express-palette-v2.jsx

const CONFIG = {
    world: {
        maxZ: 2000,
        overscan: 200
    },

    // ── Act-based palette (from babel-express-palette-v2) ──
    // Each act defines: sky gradient, road, grass, edge accent, building tints,
    // cloud tint, AI beam colors, and atmospheric fog color.
    acts: {
        act1: {
            name: 'genesis',
            sky: {
                top:     { r: 0x14, g: 0x14, b: 0x30 },  // #141430
                mid:     { r: 0x2d, g: 0x2b, b: 0x55 },  // #2d2b55
                horizon: { r: 0x78, g: 0x68, b: 0xa6 },  // #7868a6
                glow:    { r: 0xc4, g: 0xa0, b: 0x60 }   // #c4a060 dawn gold
            },
            road:  { dark: 0x18182e, light: 0x28284a, reflect: 0x3a3a60 },
            grass: { dark: 0x1a3028, light: 0x2e5840 },
            edge:  0xc4a060,
            rumble: { a: 0xc4a060, b: 0x28284a },
            lane:  0x4a4078,
            shoulder: { a: 0x2d2b55, b: 0x3a3860 },
            buildingTint: 0x8888cc,
            cloudTint: 0xa098c0,
            fogColor: { r: 0x2d, g: 0x2b, b: 0x55 },
            window: 0xe6c86e,
            ai: { core: 0x00b8d8, glow: 0x80f0ff, dark: 0x005070 },
            nature: { shadow: 0x1a3028, leaf: 0x2e5840 }
        },
        act2: {
            name: 'deluge',
            sky: {
                top:     { r: 0x1a, g: 0x0c, b: 0x10 },  // #1a0c10
                mid:     { r: 0x5a, g: 0x1a, b: 0x20 },  // #5a1a20
                horizon: { r: 0xc4, g: 0x30, b: 0x20 },  // #c43020
                glow:    { r: 0xe0, g: 0x70, b: 0x20 }   // #e07020 fire
            },
            road:  { dark: 0x1a0c14, light: 0x2a1018, reflect: 0x3a1828 },
            grass: { dark: 0x1a0c10, light: 0x2a1818 },
            edge:  0xc41e1e,
            rumble: { a: 0xc41e1e, b: 0x2a1018 },
            lane:  0x5a2828,
            shoulder: { a: 0x5a1a20, b: 0x3a1828 },
            buildingTint: 0xcc6666,
            cloudTint: 0x8a4838,
            fogColor: { r: 0x5a, g: 0x1a, b: 0x20 },
            window: 0xffa020,
            ai: { core: 0x40c868, glow: 0x80e060, dark: 0x006838 },
            nature: { shadow: 0x1a0c10, leaf: 0x2a1818 }
        },
        act3: {
            name: 'babel',
            sky: {
                top:     { r: 0x06, g: 0x06, b: 0x0e },  // #06060e
                mid:     { r: 0x10, g: 0x10, b: 0x20 },  // #101020
                horizon: { r: 0x18, g: 0x18, b: 0x28 },  // #181828
                glow:    { r: 0x18, g: 0x18, b: 0x28 }   // same — no natural glow
            },
            road:  { dark: 0x0a0a14, light: 0x161624, reflect: 0x222238 },
            grass: { dark: 0x060610, light: 0x0a0a18 },
            edge:  0x00c0d8,
            rumble: { a: 0x00c0d8, b: 0x161624 },
            lane:  0x222238,
            shoulder: { a: 0x101020, b: 0x18182a },
            buildingTint: 0x6666aa,
            cloudTint: 0x18182a,
            fogColor: { r: 0x10, g: 0x10, b: 0x20 },
            window: 0x00a0b8,
            ai: { core: 0x40c868, glow: 0x80e060, dark: 0x006838 },
            nature: { shadow: 0x060610, leaf: 0x0a0a18 }
        },
        act4: {
            name: 'emptyCradle',
            sky: {
                top:     { r: 0xd8, g: 0xd0, b: 0xc0 },  // #d8d0c0
                mid:     { r: 0xe8, g: 0xe0, b: 0xd4 },  // #e8e0d4
                horizon: { r: 0xf0, g: 0xeb, b: 0xe0 },  // #f0ebe0
                glow:    { r: 0xf0, g: 0xeb, b: 0xe0 }   // overexposed
            },
            road:  { dark: 0xb8b0a0, light: 0xd0c8b8, reflect: 0xe4ddd0 },
            grass: { dark: 0x90a880, light: 0xb8c8a0 },
            edge:  0x8b5030,
            rumble: { a: 0x8b5030, b: 0xd0c8b8 },
            lane:  0xd0c8b8,
            shoulder: { a: 0xd8d0c0, b: 0xe4ddd0 },
            buildingTint: 0xddddcc,
            cloudTint: 0xe8e0d4,
            fogColor: { r: 0xe8, g: 0xe0, b: 0xd4 },
            window: 0x5a8080,
            ai: { core: 0x80a8a8, glow: 0xb0d0d0, dark: 0x406868 },
            nature: { shadow: 0x90a880, leaf: 0xb8c8a0 }
        }
    },

    // Ending accent palettes
    endings: {
        transparent: { accent: 0x00c8e8, bg: 0x003848, flash: 0xffffff },
        newTongues:  { accent: 0xe07020, bg: 0x4a7a3f, flash: 0x3090b8 },
        pedestrian:  { accent: 0xc4a060, bg: 0x8b5a2b, flash: 0x90a880 },
        inertia:     { accent: 0x003838, bg: 0x0a0a0a, flash: 0x000000 }
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

    // Act thresholds (entropy ranges)
    phases: {
        act1: { min: 0,  max: 20 },
        act2: { min: 20, max: 47 },
        act3: { min: 47, max: 73 },
        act4: { min: 73, max: 90 },
        act5: { min: 90, max: 100 }
    },

    // Visual params per act (GSAP tweens toward these)
    phaseVisuals: {
        act1: { speed: 30,  focalLength: 400, shake: 0, motionBlur: 0 },
        act2: { speed: 50,  focalLength: 300, shake: 2, motionBlur: 0.1 },
        act3: { speed: 75,  focalLength: 200, shake: 6, motionBlur: 0.3 },
        act4: { speed: 100, focalLength: 120, shake: 14, motionBlur: 0.6 },
        act5: { speed: 120, focalLength: 80,  shake: 22, motionBlur: 0.8 },
        // Special states
        stopped:  { speed: 0,   focalLength: 400, shake: 0, motionBlur: 0 },
        hope:     { speed: 15,  focalLength: 350, shake: 1, motionBlur: 0 }
    },

    // Pseudo-3D flight path (After Burner style — aerial on-rails)
    road: {
        segmentLength: 200,
        visibleSegments: 200,
        roadWidth: 2200,
        shoulderWidth: 600,
        lanes: 3,
        rumbleWidth: 100,
        cameraHeight: 600,          // low altitude — broomstick skimming rooftops
        cameraDepth: 1.8,           // narrow FOV (telephoto) — more realistic perspective
        centrifugal: 0,
        totalSegments: 1600,
        fogDensity: 5,
        horizonLine: 0.30,          // horizon at 30% down screen (sky ~30%, ground ~70%)

        // Hill physics
        hill: {
            cameraFollow: 0.15      // how quickly camera elevation tracks road (0-1)
        },

        // Curve camera: train follows track, roll provides banking feel
        curve: {
            rollScale: 0.12,        // bank angle (radians per unit curve) — ~12° max
            rollSmoothing: 0.08,    // smooth banking with slight lag
        },

        // Default colors (overridden per-act by getRoadColors())
        colors: {
            road:    [0x18182e, 0x28284a],
            grass:   [0x1a3028, 0x2e5840],
            rumble:  [0xc4a060, 0x28284a],
            lane:    0x4a4078,
            shoulder:[0x2d2b55, 0x3a3860]
        }
    },

    timing: {
        sessionDuration: 75,        // 1 min 15 sec
        entropyRate: 1.333,         // 100 / 75 per second
        interventionSlowdown: 0.15,
        choiceDuration: 8000,       // 8 seconds for choices (longer for narrative depth)
        narrativeDuration: 4000     // how long narrative text stays visible
    }
};

// Returns road colors for current act
function getRoadColors(act) {
    const a = CONFIG.acts[act];
    if (!a) return CONFIG.road.colors;
    return {
        road:     [a.road.dark, a.road.light],
        grass:    [a.grass.dark, a.grass.light],
        rumble:   [a.rumble.a, a.rumble.b],
        lane:     a.lane,
        shoulder: [a.shoulder.a, a.shoulder.b]
    };
}
