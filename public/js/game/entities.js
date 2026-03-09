// Entity creation, object pooling, and positioning.
// Road entities (trees, streetlights, buildings) are anchored to road segments.
// Background entities (clouds, Namsan Tower) are fixed in a back panel with parallax.
//
// Glow sprites (emissive layer) are separate PIXI.Sprites placed in cameraGlow
// with BLEND_MODES.ADD. They bypass the ColorMatrixFilter so lights stay vivid
// even when the world desaturates in crisis/catastrophe phases.

const entityList = [];
const bgList = [];       // background scenery (not road-anchored)

const ENTITY_SCALE = {
    building: 8,
    tower: 4,
    tree: 1.6,
    streetlight: 1.6,
    cloud: 2
};

// Road-side placement offsets (fraction of road width from center)
const PLACEMENT = {
    tree:        { minOff: 1.05, maxOff: 1.3 },
    streetlight: { minOff: 1.0,  maxOff: 1.1 },
    building:    { minOff: 1.4,  maxOff: 2.5 }
};

// Spacing between same-type entities (in segments)
const SPACING = {
    tree: 8,
    streetlight: 15,
    building: 10
};

// Map base sprite keys to their glow layer counterparts
const GLOW_KEYS = {
    'building-modern':    'building-modern-glow',
    'building-glass':     'building-glass-glow',
    'building-apartment': 'building-apartment-glow',
    'streetlight':        'streetlight-glow',
    'namsan-tower':       'namsan-tower-glow'
};

// Helper: create a glow sprite for a base key, returns null if no glow texture
function _makeGlow(baseKey) {
    const glowKey = GLOW_KEYS[baseKey];
    if (!glowKey) return null;
    const glow = Assets.createSprite(glowKey);
    if (!glow) return null;
    glow.blendMode = PIXI.BLEND_MODES.ADD;
    glow.alpha = 0;  // starts invisible; fades in as entropy rises
    return glow;
}

const Entities = {
    init() {
        const camera = Renderer.getCamera();
        const glowLayer = Renderer.getCameraGlow();
        const totalSegs = Road.getSegmentCount();

        // ── Road-anchored entities ──

        // Trees along road edges (alternating sides) — no glow layer
        for (let i = 0; i < CONFIG.counts.trees; i++) {
            const segIdx = (i * SPACING.tree + Math.floor(Math.random() * 3)) % totalSegs;
            const side = (i % 2 === 0) ? 1 : -1;
            const offset = side * (PLACEMENT.tree.minOff + Math.random() * (PLACEMENT.tree.maxOff - PLACEMENT.tree.minOff));

            const sprite = Assets.createSprite('tree');
            entityList.push({
                sprite,
                glowSprite: null,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'tree',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.tree,
                elevation: 0
            });
            camera.addChild(sprite);
        }

        // Streetlights along road edges — with glow layer
        for (let i = 0; i < CONFIG.counts.streetlights; i++) {
            const segIdx = (i * SPACING.streetlight + 5 + Math.floor(Math.random() * 4)) % totalSegs;
            const side = (i % 2 === 0) ? 1 : -1;
            const offset = side * (PLACEMENT.streetlight.minOff + Math.random() * (PLACEMENT.streetlight.maxOff - PLACEMENT.streetlight.minOff));

            const sprite = Assets.createSprite('streetlight');
            const glow = _makeGlow('streetlight');
            entityList.push({
                sprite,
                glowSprite: glow,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'streetlight',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.streetlight,
                elevation: 0
            });
            camera.addChild(sprite);
            if (glow) glowLayer.addChild(glow);
        }

        // Buildings further from road — with glow layer
        const buildingKeys = ['building-modern', 'building-glass', 'building-apartment'];
        for (let i = 0; i < CONFIG.counts.buildings; i++) {
            const key = buildingKeys[Math.floor(Math.random() * buildingKeys.length)];
            const segIdx = (i * SPACING.building + Math.floor(Math.random() * 6)) % totalSegs;
            const side = (i % 2 === 0) ? 1 : -1;
            const offset = side * (PLACEMENT.building.minOff + Math.random() * (PLACEMENT.building.maxOff - PLACEMENT.building.minOff));

            const sprite = Assets.createSprite(key);
            const glow = _makeGlow(key);

            const relativeSize = (key === 'building-glass') ? 3 : 1;
            entityList.push({
                sprite,
                glowSprite: glow,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'building',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.building * relativeSize,
                elevation: 0
            });
            camera.addChild(sprite);
            if (glow) glowLayer.addChild(glow);
        }

        // ── Background scenery (fixed back panel with parallax) ──

        // Namsan Tower — fixed landmark on the horizon, with beacon glow
        const tower = Assets.createSprite('namsan-tower');
        tower.zIndex = -8000;
        const towerGlow = _makeGlow('namsan-tower');
        if (towerGlow) towerGlow.zIndex = -8000;
        bgList.push({
            sprite: tower,
            glowSprite: towerGlow,
            worldX: -3000,
            worldZ: 80000,
            type: 'tower',
            fsm: 'normal',
            baseScale: 1.8
        });
        camera.addChild(tower);
        if (towerGlow) glowLayer.addChild(towerGlow);

        // Clouds — fixed in the sky, slow parallax, no glow
        for (let i = 0; i < CONFIG.counts.clouds; i++) {
            const sprite = Assets.createSprite('cloud');
            sprite.anchor.set(0.5, 0.5);
            sprite.zIndex = -8500;
            bgList.push({
                sprite,
                glowSprite: null,
                baseX: 0.1 + (i / CONFIG.counts.clouds) * 0.85,
                baseY: 0.08 + Math.random() * 0.25,
                worldZ: 150000 + Math.random() * 100000,
                type: 'cloud',
                fsm: 'normal',
                baseScale: 0.8 + Math.random() * 0.6
            });
            camera.addChild(sprite);
        }
    },

    // Update road-anchored entities using projected road segments
    update(dt, projected) {
        const sw = Renderer.getApp().screen.width;
        const sh = Renderer.getApp().screen.height;

        // Glow intensity: ramps up from tension onward (0 in peace, 1 in catastrophe)
        const glowAlpha = Math.max(0, Math.min(1, (STATE.entropy - 20) / 55));

        // ── Background scenery ──
        const cameraDepth = CONFIG.road.cameraDepth;

        let horizonY = sh * 0.45;
        let horizonDx = 0;
        let horizonZ = CONFIG.road.visibleSegments * CONFIG.road.segmentLength;
        if (projected && projected.length > 0) {
            horizonY = projected[projected.length - 1].y;
            horizonDx = projected.horizonDx || 0;
            horizonZ = projected.horizonZ || horizonZ;
        }

        for (let i = 0; i < bgList.length; i++) {
            const bg = bgList[i];
            bg.sprite.visible = true;

            if (bg.type === 'tower') {
                const towerScale = cameraDepth / bg.worldZ;
                const curveDx = horizonDx * (bg.worldZ / horizonZ);
                const towerScreenX = (sw / 2) + towerScale * (bg.worldX - STATE.playerX + curveDx) * sw / 2;

                bg.sprite.x = towerScreenX;
                bg.sprite.y = horizonY;
                bg.sprite.scale.set(bg.baseScale);
                this._updateEntityVisuals(bg);

                // Sync glow sprite (beacon)
                if (bg.glowSprite) {
                    bg.glowSprite.visible = true;
                    bg.glowSprite.x = bg.sprite.x;
                    bg.glowSprite.y = bg.sprite.y;
                    bg.glowSprite.scale.set(bg.baseScale);
                    // Beacon pulses via sin wave, intensifies with entropy
                    const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.005);
                    bg.glowSprite.alpha = glowAlpha * pulse;
                }
            } else {
                const cloudCurveShift = -horizonDx * (cameraDepth / (bg.worldZ || 200000)) * sw / 2;
                bg.sprite.x = bg.baseX * sw + cloudCurveShift;
                bg.sprite.y = bg.baseY * sh;
                bg.sprite.scale.set(bg.baseScale);
            }
        }

        // ── Road-anchored entities ──
        if (!projected || projected.length < 2) return;

        const segLen = CONFIG.road.segmentLength;
        const totalSegs = Road.getSegmentCount();
        const cameraSegIdx = Math.floor(STATE.roadPosition / segLen) % totalSegs;

        const projLookup = {};
        for (let i = 0; i < projected.length; i++) {
            projLookup[projected[i].index] = projected[i];
        }

        for (let i = 0; i < entityList.length; i++) {
            const e = entityList[i];

            let segDist = e.segmentIndex - cameraSegIdx;
            if (segDist < 0) segDist += totalSegs;

            const proj = projLookup[e.segmentIndex];
            if (!proj || proj.clip || segDist > CONFIG.road.visibleSegments) {
                e.sprite.visible = false;
                if (e.glowSprite) e.glowSprite.visible = false;
                continue;
            }

            e.sprite.visible = true;

            // Position relative to road segment
            let screenX = proj.x + proj.w * e.roadOffset;
            const screenY = proj.y - e.elevation * proj.scale * sh;
            const scale = proj.scale * e.baseScale * sw * 2;

            if (e.type === 'building') {
                const halfW = e.sprite.texture.width * Math.abs(scale) * 0.5;
                screenX += (e.roadOffset > 0 ? 1 : -1) * halfW;
            }

            e.sprite.x = screenX;
            e.sprite.y = screenY;
            e.sprite.scale.set(Math.max(0.01, scale));

            // Fade by fog
            const fogFade = Math.max(0, 1 - proj.fog * proj.fog * 0.5);
            e.sprite.alpha = fogFade;

            e.sprite.zIndex = -segDist;

            // Sync glow sprite: same position/scale, alpha driven by entropy + fog
            if (e.glowSprite) {
                e.glowSprite.visible = true;
                e.glowSprite.x = screenX;
                e.glowSprite.y = screenY;
                e.glowSprite.scale.set(Math.max(0.01, scale));
                e.glowSprite.zIndex = -segDist;
                e.glowSprite.alpha = glowAlpha * fogFade;
            }

            this._updateEntityVisuals(e);
        }
    },

    _updateEntityVisuals(e) {
        if (e.type === 'cloud' || e.type === 'streetlight') return;

        if (STATE.entropy > 50 && e.fsm === 'normal') {
            if (Math.random() < 0.002) {
                e.fsm = 'stressed';
                e.sprite.tint = 0xDDAAAA;
            }
        }
        if (STATE.entropy > 75 && e.fsm === 'stressed') {
            if (Math.random() < 0.005) {
                e.fsm = 'damaged';
                e.sprite.tint = 0x666666;
            }
        }
    },

    getList() { return entityList; },
    getBgList() { return bgList; }
};
