// Entity creation, object pooling, and positioning.
// Road entities (trees, streetlights, buildings) are anchored to road segments.
// Background entities (clouds, Namsan Tower) are fixed in a back panel with parallax.

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

const Entities = {
    init() {
        const camera = Renderer.getCamera();
        const totalSegs = Road.getSegmentCount();

        // ── Road-anchored entities ──

        // Trees along road edges (alternating sides)
        for (let i = 0; i < CONFIG.counts.trees; i++) {
            const segIdx = (i * SPACING.tree + Math.floor(Math.random() * 3)) % totalSegs;
            const side = (i % 2 === 0) ? 1 : -1;
            const offset = side * (PLACEMENT.tree.minOff + Math.random() * (PLACEMENT.tree.maxOff - PLACEMENT.tree.minOff));

            const sprite = Assets.createSprite('tree');
            entityList.push({
                sprite,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'tree',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.tree,
                elevation: 0
            });
            camera.addChild(sprite);
        }

        // Streetlights along road edges
        for (let i = 0; i < CONFIG.counts.streetlights; i++) {
            const segIdx = (i * SPACING.streetlight + 5 + Math.floor(Math.random() * 4)) % totalSegs;
            const side = (i % 2 === 0) ? 1 : -1;
            const offset = side * (PLACEMENT.streetlight.minOff + Math.random() * (PLACEMENT.streetlight.maxOff - PLACEMENT.streetlight.minOff));

            const sprite = Assets.createSprite('streetlight');
            entityList.push({
                sprite,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'streetlight',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.streetlight,
                elevation: 0
            });
            camera.addChild(sprite);
        }

        // Buildings further from road
        const buildingKeys = ['building-modern', 'building-glass', 'building-apartment'];
        for (let i = 0; i < CONFIG.counts.buildings; i++) {
            const key = buildingKeys[Math.floor(Math.random() * buildingKeys.length)];
            const segIdx = (i * SPACING.building + Math.floor(Math.random() * 6)) % totalSegs;
            const side = (i % 2 === 0) ? 1 : -1;
            const offset = side * (PLACEMENT.building.minOff + Math.random() * (PLACEMENT.building.maxOff - PLACEMENT.building.minOff));

            const sprite = Assets.createSprite(key);

            const relativeSize = (key === 'building-glass') ? 3 : 1;
            entityList.push({
                sprite,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'building',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.building * relativeSize,
                elevation: 0
            });
            camera.addChild(sprite);
        }

        // ── Background scenery (fixed back panel with parallax) ──

        // Namsan Tower — fixed landmark on the horizon
        // Uses perspective-correct parallax: shift = cameraDepth / towerZ
        const tower = Assets.createSprite('namsan-tower');
        tower.zIndex = -8000;
        bgList.push({
            sprite: tower,
            worldX: -3000,     // fixed world X position (left of road center)
            worldZ: 80000,     // virtual distance (beyond draw distance but not infinity)
            type: 'tower',
            fsm: 'normal',
            baseScale: 1.8
        });
        camera.addChild(tower);

        // Clouds — fixed in the sky, slow parallax
        for (let i = 0; i < CONFIG.counts.clouds; i++) {
            const sprite = Assets.createSprite('cloud');
            sprite.anchor.set(0.5, 0.5);
            sprite.zIndex = -8500;
            bgList.push({
                sprite,
                baseX: 0.1 + (i / CONFIG.counts.clouds) * 0.85,
                baseY: 0.08 + Math.random() * 0.25,
                worldZ: 150000 + Math.random() * 100000,  // very far (near-infinite)
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

        // ── Background scenery ──
        const cameraDepth = CONFIG.road.cameraDepth;

        // Horizon Y from farthest projected segment (tower sits here)
        let horizonY = sh * 0.45;
        // Accumulated curve offset and Z at the draw-distance horizon
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
                // Perspective-correct parallax:
                // scale = cameraDepth / worldZ (same formula as road projection)
                // Extrapolate curve offset beyond draw distance proportionally
                const towerScale = cameraDepth / bg.worldZ;
                const curveDx = horizonDx * (bg.worldZ / horizonZ);
                const towerScreenX = (sw / 2) + towerScale * (bg.worldX - STATE.playerX + curveDx) * sw / 2;

                bg.sprite.x = towerScreenX;
                bg.sprite.y = horizonY;
                bg.sprite.scale.set(bg.baseScale);
                this._updateEntityVisuals(bg);
            } else {
                // Clouds: very far (effectively infinite Z), gentle curve parallax
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

        // Build lookup from segment index → projected data
        const projLookup = {};
        for (let i = 0; i < projected.length; i++) {
            projLookup[projected[i].index] = projected[i];
        }

        for (let i = 0; i < entityList.length; i++) {
            const e = entityList[i];

            // How far ahead is this entity's segment from camera?
            let segDist = e.segmentIndex - cameraSegIdx;
            if (segDist < 0) segDist += totalSegs;

            // Only show entities in the visible range
            const proj = projLookup[e.segmentIndex];
            if (!proj || proj.clip || segDist > CONFIG.road.visibleSegments) {
                e.sprite.visible = false;
                continue;
            }

            e.sprite.visible = true;

            // Position relative to road segment
            let screenX = proj.x + proj.w * e.roadOffset;
            const screenY = proj.y - e.elevation * proj.scale * sh;
            const scale = proj.scale * e.baseScale * sw * 2;

            // Push buildings outward by half their rendered width
            // so the inner edge doesn't overlap the road
            if (e.type === 'building') {
                const halfW = e.sprite.texture.width * Math.abs(scale) * 0.5;
                screenX += (e.roadOffset > 0 ? 1 : -1) * halfW;
            }

            e.sprite.x = screenX;
            e.sprite.y = screenY;
            e.sprite.scale.set(Math.max(0.01, scale));

            // Fade by fog
            e.sprite.alpha = Math.max(0, 1 - proj.fog * proj.fog * 0.5);

            // Z-index for depth sorting
            e.sprite.zIndex = -segDist;

            // FSM-based visual changes
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
