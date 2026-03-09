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
    // Glow layers (emissive — bypass color grading filter)
    'building-modern-glow': 'building-modern-glow.png',
    'building-glass-glow': 'building-glass-glow.png',
    'building-apartment-glow': 'building-apartment-glow.png',
    'namsan-tower-glow': 'namsan-tower-glow.png',
    'streetlight-glow': 'streetlight-glow.png',
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

        // Glow layer fallbacks (emissive — only the lit parts on transparent bg)
        if (!textures['building-modern-glow'])    textures['building-modern-glow']    = this._genBuildingGlow(app, 24, 40);
        if (!textures['building-glass-glow'])     textures['building-glass-glow']     = this._genBuildingGlow(app, 20, 48);
        if (!textures['building-apartment-glow']) textures['building-apartment-glow'] = this._genBuildingGlow(app, 28, 36);
        if (!textures['namsan-tower-glow'])       textures['namsan-tower-glow']       = this._genNamsanTowerGlow(app);
        if (!textures['streetlight-glow'])        textures['streetlight-glow']        = this._genStreetlightGlow(app);
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
    }
};
