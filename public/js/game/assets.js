// Asset loading pipeline.
// Loads sprite textures from /img/game/ PNGs when available,
// falls back to generated pixel art placeholders.
//
// To replace placeholders with real art:
//   1. Put PNGs in public/img/game/ (e.g., building-modern.png)
//   2. Add the filename to SPRITE_MANIFEST below
//   3. The sprite will be used automatically; fallback is skipped.

const SPRITE_MANIFEST = {
    // key: path relative to /img/game/
    'building-modern': 'building-modern.png',
    'building-glass': 'building-glass.png',
    'building-apartment': 'building-apartment.png',
    'namsan-tower': 'namsan-tower.png',
    'tree': 'tree.png',
    'streetlight': 'streetlight.png',
    'cloud': 'cloud.png',
    'sun': 'sun.png',
    'ground': 'ground.png',
    // Aerial entities (witch flight path)
    'crow': 'crow.png',
    'lantern': 'lantern.png',
    'balloon': 'balloon.png',
    'moon': 'moon.png',
    'star': 'star.png',
    // Sea entities (Act 2 — deluge)
    'boat': 'boat.png',
    'debris': 'debris.png',
    'beacon': 'beacon.png',
    // City entities (Act 3 — babel)
    'neon': 'neon.png',
    // Glow layers (emissive — bypass color grading filter)
    'building-modern-glow': 'building-modern-glow.png',
    'building-glass-glow': 'building-glass-glow.png',
    'building-apartment-glow': 'building-apartment-glow.png',
    'namsan-tower-glow': 'namsan-tower-glow.png',
    'streetlight-glow': 'streetlight-glow.png',
    'lantern-glow': 'lantern-glow.png',
    'beacon-glow': 'beacon-glow.png',
    'neon-glow': 'neon-glow.png',
};

const textures = {};

const Assets = {
    async load(app) {
        // Load real sprites from manifest
        const loadPromises = [];
        for (const [key, filename] of Object.entries(SPRITE_MANIFEST)) {
            loadPromises.push(
                PIXI.Assets.load('/img/game/' + filename)
                    .then(tex => { textures[key] = tex; })
                    .catch(() => { /* will use fallback */ })
            );
        }
        await Promise.all(loadPromises);

        // Generate fallback textures for anything not loaded
        this._generateFallbacks(app);
    },

    get(key) {
        return textures[key] || null;
    },

    // Create a PIXI.Sprite from a loaded texture, with anchor at bottom-center
    createSprite(key) {
        const tex = textures[key];
        if (!tex) return null;
        const sprite = new PIXI.Sprite(tex);
        sprite.anchor.set(0.5, 1); // bottom-center pivot for ground-level objects
        return sprite;
    },

    _generateFallbacks(app) {
        if (!textures['building-modern'])    textures['building-modern']    = this._genBuilding(app, 0xCCCCCC, 24, 40);
        if (!textures['building-glass'])     textures['building-glass']     = this._genBuilding(app, 0x88AACC, 20, 48);
        if (!textures['building-apartment']) textures['building-apartment'] = this._genBuilding(app, 0xDDCCBB, 28, 36);
        if (!textures['namsan-tower'])       textures['namsan-tower']       = this._genNamsanTower(app);
        if (!textures['tree'])               textures['tree']               = this._genTree(app);
        if (!textures['streetlight'])        textures['streetlight']        = this._genStreetlight(app);
        if (!textures['cloud'])              textures['cloud']              = this._genCloud(app);
        if (!textures['crow'])               textures['crow']               = this._genCrow(app);
        if (!textures['lantern'])            textures['lantern']            = this._genLantern(app);
        if (!textures['balloon'])            textures['balloon']            = this._genBalloon(app);
        if (!textures['moon'])               textures['moon']               = this._genMoon(app);
        if (!textures['star'])               textures['star']               = this._genStar(app);
        if (!textures['boat'])               textures['boat']               = this._genBoat(app);
        if (!textures['debris'])             textures['debris']             = this._genDebris(app);
        if (!textures['beacon'])             textures['beacon']             = this._genBeacon(app);
        if (!textures['neon'])               textures['neon']               = this._genNeon(app);
        if (!textures['drone'])             textures['drone']              = this._genDrone(app);

        // Glow layer fallbacks (emissive — only the lit parts on transparent bg)
        if (!textures['building-modern-glow'])    textures['building-modern-glow']    = this._genBuildingGlow(app, 24, 40);
        if (!textures['building-glass-glow'])     textures['building-glass-glow']     = this._genBuildingGlow(app, 20, 48);
        if (!textures['building-apartment-glow']) textures['building-apartment-glow'] = this._genBuildingGlow(app, 28, 36);
        if (!textures['namsan-tower-glow'])       textures['namsan-tower-glow']       = this._genNamsanTowerGlow(app);
        if (!textures['streetlight-glow'])        textures['streetlight-glow']        = this._genStreetlightGlow(app);
        if (!textures['lantern-glow'])            textures['lantern-glow']            = this._genLanternGlow(app);
        if (!textures['beacon-glow'])             textures['beacon-glow']             = this._genBeaconGlow(app);
        if (!textures['neon-glow'])               textures['neon-glow']               = this._genNeonGlow(app);
    },

    // --- Pixel art generators (placeholder fallbacks) ---

    _genBuilding(app, color, w, h) {
        const g = new PIXI.Graphics();
        const shadowColor = 0x555555;

        // Main body
        g.beginFill(color);
        g.drawRect(0, 0, w, h);
        g.endFill();

        // Shadow side (left 25%)
        g.beginFill(shadowColor, 0.3);
        g.drawRect(0, 0, Math.floor(w * 0.25), h);
        g.endFill();

        // Pixel windows
        const winOn = 0xFFEEAA;
        const winOff = 0x334455;
        const winSize = 2;
        const gap = 4;
        const marginX = 3;
        const marginY = 3;
        for (let row = marginY; row < h - 2; row += gap) {
            for (let col = marginX; col < w - 2; col += gap) {
                g.beginFill(Math.random() > 0.3 ? winOn : winOff);
                g.drawRect(col, row, winSize, winSize);
                g.endFill();
            }
        }

        // Roof edge
        g.beginFill(0x666666);
        g.drawRect(0, 0, w, 1);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genNamsanTower(app) {
        const g = new PIXI.Graphics();
        // Base/mountain
        g.beginFill(0x668855);
        g.moveTo(0, 80);
        g.lineTo(16, 55);
        g.lineTo(32, 80);
        g.closePath();
        g.endFill();

        // Tower shaft
        g.beginFill(0xBBBBBB);
        g.drawRect(14, 10, 4, 45);
        g.endFill();

        // Shadow on shaft
        g.beginFill(0x888888);
        g.drawRect(14, 10, 1, 45);
        g.endFill();

        // Observation deck
        g.beginFill(0xAAAAAA);
        g.drawRect(10, 30, 12, 5);
        g.endFill();

        // Antenna
        g.beginFill(0x999999);
        g.drawRect(15, 2, 2, 8);
        g.endFill();

        // Red beacon
        g.beginFill(0xFF3333);
        g.drawRect(15, 1, 2, 2);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genTree(app) {
        const g = new PIXI.Graphics();
        // Trunk
        g.beginFill(0x665544);
        g.drawRect(5, 10, 2, 6);
        g.endFill();

        // Foliage (layered circles for pixel look)
        g.beginFill(0x558844);
        g.drawRect(2, 4, 8, 6);
        g.endFill();
        g.beginFill(0x66AA55);
        g.drawRect(3, 3, 6, 4);
        g.endFill();
        // Highlight
        g.beginFill(0x77BB66);
        g.drawRect(4, 3, 3, 2);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genStreetlight(app) {
        const g = new PIXI.Graphics();
        // Pole
        g.beginFill(0x999999);
        g.drawRect(2, 4, 1, 20);
        g.endFill();

        // Arm
        g.beginFill(0x999999);
        g.drawRect(2, 4, 5, 1);
        g.endFill();

        // Lamp glow
        g.beginFill(0xFFDD88, 0.8);
        g.drawRect(6, 3, 2, 2);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genCloud(app) {
        const g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF, 0.7);
        g.drawRect(2, 2, 12, 4);
        g.drawRect(4, 0, 8, 2);
        g.drawRect(0, 4, 4, 2);
        g.drawRect(10, 4, 6, 2);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    // --- Glow layer generators (emissive textures — lit parts only on transparent bg) ---
    // Same dimensions as base sprites so they overlay perfectly.

    _genBuildingGlow(app, w, h) {
        const g = new PIXI.Graphics();
        const winOn = 0xFFEEAA;
        const winSize = 2;
        const gap = 4;
        const marginX = 3;
        const marginY = 3;

        // Only the lit windows — same grid as _genBuilding but skip dark ones
        for (let row = marginY; row < h - 2; row += gap) {
            for (let col = marginX; col < w - 2; col += gap) {
                if (Math.random() > 0.3) {
                    g.beginFill(winOn);
                    g.drawRect(col, row, winSize, winSize);
                    g.endFill();
                }
            }
        }

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1,
            region: new PIXI.Rectangle(0, 0, w, h)
        });
        g.destroy();
        return tex;
    },

    _genNamsanTowerGlow(app) {
        const g = new PIXI.Graphics();
        // Red beacon only (matches base tower dimensions: 32x80)
        g.beginFill(0xFF3333);
        g.drawRect(15, 1, 2, 2);
        g.endFill();
        // Beacon halo
        g.beginFill(0xFF5555, 0.5);
        g.drawRect(14, 0, 4, 4);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1,
            region: new PIXI.Rectangle(0, 0, 32, 80)
        });
        g.destroy();
        return tex;
    },

    _genStreetlightGlow(app) {
        const g = new PIXI.Graphics();
        // Lamp glow only (matches base streetlight dimensions: ~8x24)
        g.beginFill(0xFFDD88);
        g.drawRect(6, 3, 2, 2);
        g.endFill();
        // Soft halo around lamp
        g.beginFill(0xFFDD88, 0.4);
        g.drawRect(5, 2, 4, 4);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1,
            region: new PIXI.Rectangle(0, 0, 8, 24)
        });
        g.destroy();
        return tex;
    },

    // --- Aerial entity generators (witch flight) ---

    _genCrow(app) {
        const g = new PIXI.Graphics();
        // Simple bird silhouette — V-shaped wings
        g.beginFill(0x222222);
        // Body
        g.drawRect(4, 3, 4, 2);
        // Left wing
        g.drawRect(0, 1, 3, 1);
        g.drawRect(1, 2, 2, 1);
        // Right wing
        g.drawRect(9, 1, 3, 1);
        g.drawRect(9, 2, 2, 1);
        g.endFill();
        // Eye
        g.beginFill(0xFFFFFF);
        g.drawRect(6, 3, 1, 1);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genLantern(app) {
        const g = new PIXI.Graphics();
        // Paper lantern — warm glow
        // String
        g.beginFill(0x888888);
        g.drawRect(4, 0, 1, 3);
        g.endFill();
        // Lantern body
        g.beginFill(0xCC4422);
        g.drawRect(2, 3, 5, 7);
        g.endFill();
        // Inner glow
        g.beginFill(0xFF8844, 0.8);
        g.drawRect(3, 4, 3, 5);
        g.endFill();
        // Bottom
        g.beginFill(0x996633);
        g.drawRect(3, 10, 3, 1);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genLanternGlow(app) {
        const g = new PIXI.Graphics();
        // Warm glow halo (matches lantern dimensions: 9x11)
        g.beginFill(0xFF8844, 0.8);
        g.drawRect(3, 4, 3, 5);
        g.endFill();
        g.beginFill(0xFF8844, 0.3);
        g.drawRect(1, 2, 7, 9);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1,
            region: new PIXI.Rectangle(0, 0, 9, 11)
        });
        g.destroy();
        return tex;
    },

    _genBalloon(app) {
        const g = new PIXI.Graphics();
        // Hot air balloon
        // Envelope (round top)
        g.beginFill(0xDD5533);
        g.drawRect(4, 0, 12, 4);
        g.drawRect(2, 4, 16, 8);
        g.drawRect(4, 12, 12, 4);
        g.endFill();
        // Stripe
        g.beginFill(0xEECC44);
        g.drawRect(2, 6, 16, 3);
        g.endFill();
        // Basket ropes
        g.beginFill(0x886644);
        g.drawRect(6, 16, 1, 4);
        g.drawRect(13, 16, 1, 4);
        g.endFill();
        // Basket
        g.beginFill(0x886644);
        g.drawRect(5, 20, 10, 4);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genMoon(app) {
        const g = new PIXI.Graphics();
        // Crescent moon
        g.beginFill(0xEEEECC);
        g.drawRect(4, 0, 16, 4);
        g.drawRect(2, 4, 20, 4);
        g.drawRect(0, 8, 24, 8);
        g.drawRect(2, 16, 20, 4);
        g.drawRect(4, 20, 16, 4);
        g.endFill();
        // Dark part (crescent cutout)
        g.beginFill(0x000000, 0);
        g.endFill();
        // Shadow to make crescent shape
        g.beginFill(0x141430, 0.95);
        g.drawRect(8, 2, 12, 4);
        g.drawRect(10, 6, 12, 4);
        g.drawRect(10, 10, 12, 4);
        g.drawRect(8, 14, 12, 4);
        g.drawRect(8, 18, 10, 4);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genStar(app) {
        const g = new PIXI.Graphics();
        // Tiny star — 3x3 cross
        g.beginFill(0xFFFFDD);
        g.drawRect(1, 0, 1, 1);
        g.drawRect(0, 1, 3, 1);
        g.drawRect(1, 2, 1, 1);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    // --- Sea entities (Act 2 — Deluge) ---

    _genBoat(app) {
        const g = new PIXI.Graphics();
        // Hull — dark wooden boat
        g.beginFill(0x5A3A1E);
        g.drawRect(2, 10, 20, 6);
        g.endFill();
        // Hull bottom curve
        g.beginFill(0x4A2A14);
        g.drawRect(4, 16, 16, 2);
        g.endFill();
        // Deck
        g.beginFill(0x7A5A3A);
        g.drawRect(4, 9, 16, 2);
        g.endFill();
        // Mast
        g.beginFill(0x8A6A4A);
        g.drawRect(11, 1, 2, 9);
        g.endFill();
        // Sail (tattered — deluge)
        g.beginFill(0xCCBBAA, 0.8);
        g.drawRect(13, 2, 6, 4);
        g.drawRect(13, 6, 4, 2);
        g.endFill();
        // Sail tear
        g.beginFill(0x9A8A7A, 0.6);
        g.drawRect(15, 3, 2, 2);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genDebris(app) {
        const g = new PIXI.Graphics();
        // Floating plank
        g.beginFill(0x6A5030);
        g.drawRect(0, 4, 10, 3);
        g.endFill();
        // Broken edge
        g.beginFill(0x5A4020);
        g.drawRect(1, 3, 3, 1);
        g.drawRect(8, 5, 2, 2);
        g.endFill();
        // Nail/detail
        g.beginFill(0x888888);
        g.drawRect(3, 5, 1, 1);
        g.drawRect(7, 5, 1, 1);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genBeacon(app) {
        const g = new PIXI.Graphics();
        // Float base (red/white buoy)
        g.beginFill(0xCC2222);
        g.drawRect(3, 12, 8, 6);
        g.endFill();
        g.beginFill(0xDDDDDD);
        g.drawRect(3, 15, 8, 3);
        g.endFill();
        // Pole
        g.beginFill(0x888888);
        g.drawRect(6, 4, 2, 8);
        g.endFill();
        // Light housing
        g.beginFill(0xFFAA00);
        g.drawRect(5, 2, 4, 3);
        g.endFill();
        // Light bulb
        g.beginFill(0xFFDD44);
        g.drawRect(6, 1, 2, 2);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genBeaconGlow(app) {
        const g = new PIXI.Graphics();
        // Light glow only (matches beacon dimensions: 14x18)
        g.beginFill(0xFFDD44);
        g.drawRect(6, 1, 2, 2);
        g.endFill();
        // Halo
        g.beginFill(0xFFDD44, 0.4);
        g.drawRect(4, 0, 6, 5);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1,
            region: new PIXI.Rectangle(0, 0, 14, 18)
        });
        g.destroy();
        return tex;
    },

    // --- City entities (Act 3 — Babel) ---

    _genNeon(app) {
        const g = new PIXI.Graphics();
        // Sign backing (dark panel)
        g.beginFill(0x1A1A2A);
        g.drawRect(0, 0, 16, 10);
        g.endFill();
        // Border frame
        g.beginFill(0x333344);
        g.drawRect(0, 0, 16, 1);
        g.drawRect(0, 9, 16, 1);
        g.drawRect(0, 0, 1, 10);
        g.drawRect(15, 0, 1, 10);
        g.endFill();
        // Neon text/symbol — random color per generation
        const neonColors = [0x00DDFF, 0xFF2288, 0x44FF44, 0xFFAA00, 0xAA44FF];
        const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)];
        // Abstract neon shapes (Korean-style signage)
        g.beginFill(neonColor);
        g.drawRect(2, 2, 3, 1);
        g.drawRect(2, 3, 1, 4);
        g.drawRect(2, 7, 3, 1);
        // Second character
        g.drawRect(7, 2, 1, 6);
        g.drawRect(8, 2, 3, 1);
        g.drawRect(8, 5, 3, 1);
        // Dot accent
        g.drawRect(13, 3, 2, 2);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genDrone(app) {
        const g = new PIXI.Graphics();
        // Drone seen from behind — quadcopter silhouette
        // Central body
        g.beginFill(0x3a3a4a);
        g.drawRect(10, 8, 12, 6);
        g.endFill();
        // Body highlight
        g.beginFill(0x5a5a6a);
        g.drawRect(12, 9, 8, 4);
        g.endFill();
        // Camera lens (center bottom)
        g.beginFill(0x22aacc);
        g.drawRect(14, 12, 4, 2);
        g.endFill();
        g.beginFill(0x44ddff);
        g.drawRect(15, 12, 2, 1);
        g.endFill();
        // Arms (4 diagonal struts)
        g.beginFill(0x555566);
        // Top-left arm
        g.drawRect(4, 4, 8, 2);
        // Top-right arm
        g.drawRect(20, 4, 8, 2);
        // Bottom-left arm
        g.drawRect(4, 14, 8, 2);
        // Bottom-right arm
        g.drawRect(20, 14, 8, 2);
        g.endFill();
        // Rotors (spinning discs at arm tips)
        g.beginFill(0x999999, 0.6);
        g.drawRect(0, 2, 8, 2);   // top-left rotor
        g.drawRect(24, 2, 8, 2);  // top-right rotor
        g.drawRect(0, 16, 8, 2);  // bottom-left rotor
        g.drawRect(24, 16, 8, 2); // bottom-right rotor
        g.endFill();
        // Rotor hubs
        g.beginFill(0x222233);
        g.drawRect(3, 3, 2, 1);
        g.drawRect(27, 3, 2, 1);
        g.drawRect(3, 17, 2, 1);
        g.drawRect(27, 17, 2, 1);
        g.endFill();
        // Status LED
        g.beginFill(0x00ff44);
        g.drawRect(15, 8, 2, 1);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _genNeonGlow(app) {
        const g = new PIXI.Graphics();
        // Full neon glow — entire sign emits light (matches neon dimensions: 16x10)
        const neonColors = [0x00DDFF, 0xFF2288, 0x44FF44, 0xFFAA00, 0xAA44FF];
        const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)];
        g.beginFill(neonColor, 0.6);
        g.drawRect(1, 1, 14, 8);
        g.endFill();
        g.beginFill(neonColor, 0.2);
        g.drawRect(0, 0, 16, 10);
        g.endFill();

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1,
            region: new PIXI.Rectangle(0, 0, 16, 10)
        });
        g.destroy();
        return tex;
    }
};
