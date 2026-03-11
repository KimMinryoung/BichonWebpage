// Entity creation, object pooling, and positioning.
// Road entities (trees, streetlights, buildings) are anchored to road segments.
// Background entities (clouds, Namsan Tower) are fixed in a back panel with parallax.
//
// Glow sprites (emissive layer) are separate PIXI.Sprites placed in cameraGlow
// with BLEND_MODES.ADD. They bypass the ColorMatrixFilter so lights stay vivid.

const entityList = [];
const bgList = [];

const ENTITY_SCALE = {
    building: 5,        // was 8 — smaller so they don't block the entire view
    tower: 4,
    tree: 5,
    streetlight: 4,
    cloud: 5,
    crow: 2,            // small birds near flight path
    lantern: 3,         // floating paper lanterns
    balloon: 6          // hot air balloons — large, visible from far
};

const PLACEMENT = {
    tree:        { minOff: 0.15, maxOff: 1.3 },   // can appear close to flight path
    streetlight: { minOff: 0.3,  maxOff: 1.05 },  // scattered around the flight path
    building:    { minOff: 0.6,  maxOff: 2.2 },   // fly between buildings — canyon feel
    crow:        { minOff: 0.05, maxOff: 0.8 },   // birds fly close to the witch
    lantern:     { minOff: 0.1,  maxOff: 1.0 },   // lanterns float near and mid range
    balloon:     { minOff: 0.3,  maxOff: 1.8 }    // balloons at various distances
};

const SPACING = {
    tree: 3,          // was 8 — much denser foliage
    streetlight: 5,   // was 15 — streetlights every few segments
    building: 3,      // was 10 — packed city blocks
    crow: 4,          // birds in small groups
    lantern: 6,       // lanterns scattered
    balloon: 15       // balloons sparse — special sighting
};

const GLOW_KEYS = {
    'building-modern':    'building-modern-glow',
    'building-glass':     'building-glass-glow',
    'building-apartment': 'building-apartment-glow',
    'streetlight':        'streetlight-glow',
    'namsan-tower':       'namsan-tower-glow',
    'lantern':            'lantern-glow'
};

function _makeGlow(baseKey) {
    const glowKey = GLOW_KEYS[baseKey];
    if (!glowKey) return null;
    const glow = Assets.createSprite(glowKey);
    if (!glow) return null;
    glow.blendMode = PIXI.BLEND_MODES.ADD;
    glow.alpha = 0;
    return glow;
}

const Entities = {
    init() {
        const camera = Renderer.getCamera();
        const glowLayer = Renderer.getCameraGlow();
        const totalSegs = Road.getSegmentCount();

        // Trees
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

        // Streetlights
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

        // Buildings
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

        // Crows — birds flying near the witch's altitude
        for (let i = 0; i < CONFIG.counts.crows; i++) {
            const segIdx = (i * SPACING.crow + 2 + Math.floor(Math.random() * 3)) % totalSegs;
            const side = (Math.random() > 0.5) ? 1 : -1;
            const offset = side * (PLACEMENT.crow.minOff + Math.random() * (PLACEMENT.crow.maxOff - PLACEMENT.crow.minOff));

            const sprite = Assets.createSprite('crow');
            entityList.push({
                sprite,
                glowSprite: null,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'crow',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.crow,
                elevation: 50 + Math.random() * 400       // above ground, varying altitude
            });
            camera.addChild(sprite);
        }

        // Lanterns — floating paper lanterns with warm glow
        for (let i = 0; i < CONFIG.counts.lanterns; i++) {
            const segIdx = (i * SPACING.lantern + 1 + Math.floor(Math.random() * 4)) % totalSegs;
            const side = (i % 2 === 0) ? 1 : -1;
            const offset = side * (PLACEMENT.lantern.minOff + Math.random() * (PLACEMENT.lantern.maxOff - PLACEMENT.lantern.minOff));

            const sprite = Assets.createSprite('lantern');
            const glow = _makeGlow('lantern');
            entityList.push({
                sprite,
                glowSprite: glow,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'lantern',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.lantern,
                elevation: 50 + Math.random() * 250     // floating above ground
            });
            camera.addChild(sprite);
            if (glow) glowLayer.addChild(glow);
        }

        // Balloons — hot air balloons at various distances and heights
        for (let i = 0; i < CONFIG.counts.balloons; i++) {
            const segIdx = (i * SPACING.balloon + 8 + Math.floor(Math.random() * 10)) % totalSegs;
            const side = (Math.random() > 0.5) ? 1 : -1;
            const offset = side * (PLACEMENT.balloon.minOff + Math.random() * (PLACEMENT.balloon.maxOff - PLACEMENT.balloon.minOff));

            const sprite = Assets.createSprite('balloon');
            entityList.push({
                sprite,
                glowSprite: null,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'balloon',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.balloon,
                elevation: 200 + Math.random() * 500     // high above the witch
            });
            camera.addChild(sprite);
        }

        // Namsan Tower
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

        // Clouds
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

        // Moon — visible in darker acts (counterpart to sun)
        const moonSprite = Assets.createSprite('moon');
        if (moonSprite) {
            moonSprite.anchor.set(0.5, 0.5);
            moonSprite.zIndex = -11500;
            bgList.push({
                sprite: moonSprite,
                glowSprite: null,
                baseX: 0.2,
                baseY: 0.12,
                type: 'moon',
                fsm: 'normal',
                baseScale: 2.5
            });
            camera.addChild(moonSprite);
        }

        // Stars — small twinkling lights in the sky
        for (let i = 0; i < CONFIG.counts.stars; i++) {
            const sprite = Assets.createSprite('star');
            if (!sprite) continue;
            sprite.anchor.set(0.5, 0.5);
            sprite.zIndex = -11800;
            bgList.push({
                sprite,
                glowSprite: null,
                baseX: Math.random() * 0.95 + 0.025,
                baseY: Math.random() * 0.35 + 0.02,
                type: 'star',
                fsm: 'normal',
                baseScale: 0.5 + Math.random() * 1.0,
                twinkleOffset: Math.random() * Math.PI * 2  // each star twinkles at different phase
            });
            camera.addChild(sprite);
        }
    },

    update(dt, projected) {
        const sw = Renderer.getApp().screen.width;
        const sh = Renderer.getApp().screen.height;

        // Glow alpha: ramps with entropy (lights matter more in darkness)
        // Act 1-2: low; Act 3: full; Act 4: faded
        let glowAlpha;
        if (STATE.act === 'act4') {
            glowAlpha = 0.2;
        } else {
            glowAlpha = Math.max(0, Math.min(1, (STATE.entropy - 40) / 20));
        }

        // Act-based building tint for atmospheric perspective
        const actData = CONFIG.acts[STATE.act];
        const buildingTint = actData ? actData.buildingTint : 0xFFFFFF;
        const cloudTint = actData ? actData.cloudTint : 0xFFFFFF;

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
                bg.sprite.tint = buildingTint;

                if (bg.glowSprite) {
                    bg.glowSprite.visible = true;
                    bg.glowSprite.x = bg.sprite.x;
                    bg.glowSprite.y = bg.sprite.y;
                    bg.glowSprite.scale.set(bg.baseScale);
                    const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.005);
                    bg.glowSprite.alpha = glowAlpha * pulse;
                }
            } else if (bg.type === 'cloud') {
                const cloudCurveShift = -horizonDx * (cameraDepth / (bg.worldZ || 200000)) * sw / 2;
                bg.sprite.x = bg.baseX * sw + cloudCurveShift;
                bg.sprite.y = bg.baseY * sh;
                bg.sprite.scale.set(bg.baseScale);
                bg.sprite.tint = cloudTint;
            } else if (bg.type === 'moon') {
                // Moon visible in Act 2-3, hidden in Act 1 (daytime) and Act 4 (overexposed)
                // Very distant — parallax nearly zero, like a real moon
                const moonCurveShift = -horizonDx * (cameraDepth / 500000) * sw / 2;
                bg.sprite.x = bg.baseX * sw + moonCurveShift;
                bg.sprite.y = bg.baseY * sh;
                bg.sprite.scale.set(bg.baseScale);

                if (STATE.act === 'act1') {
                    bg.sprite.alpha = 0;
                } else if (STATE.act === 'act2') {
                    bg.sprite.alpha = Math.min(1, (STATE.entropy - 25) / 15);
                    bg.sprite.tint = 0xDDCCBB;
                } else if (STATE.act === 'act3') {
                    bg.sprite.alpha = 1;
                    bg.sprite.tint = 0xEEEECC;
                } else {
                    bg.sprite.alpha = Math.max(0, 1 - (STATE.entropy - 73) / 10);
                    bg.sprite.tint = 0xDDD8C8;
                }
            } else if (bg.type === 'star') {
                // Stars are infinitely far — almost no parallax
                const starCurveShift = -horizonDx * (cameraDepth / 1000000) * sw / 2;
                bg.sprite.x = bg.baseX * sw + starCurveShift;
                bg.sprite.y = bg.baseY * sh;
                bg.sprite.scale.set(bg.baseScale);

                // Stars visible in Act 2-3, hidden during day/overexposed
                let starAlpha = 0;
                if (STATE.act === 'act2') {
                    starAlpha = Math.min(1, (STATE.entropy - 30) / 10);
                } else if (STATE.act === 'act3') {
                    starAlpha = 1;
                } else if (STATE.act === 'act4') {
                    starAlpha = Math.max(0, 1 - (STATE.entropy - 73) / 8);
                }

                // Twinkle effect
                const twinkle = 0.5 + 0.5 * Math.sin(Date.now() * 0.004 + (bg.twinkleOffset || 0));
                bg.sprite.alpha = starAlpha * twinkle;
                bg.sprite.tint = 0xFFFFDD;
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

            const fogFade = Math.max(0, 1 - proj.fog * proj.fog * 0.5);
            e.sprite.alpha = fogFade;

            e.sprite.zIndex = -segDist;

            // Atmospheric perspective: distant entities tinted toward fog color
            if (e.fsm === 'normal') {
                const distT = Math.min(1, segDist / (CONFIG.road.visibleSegments * 0.6));
                if (distT > 0.3 && e.type === 'building') {
                    // Blend toward building tint (sky-influenced color)
                    e.sprite.tint = buildingTint;
                } else if (e.fsm === 'normal') {
                    e.sprite.tint = 0xFFFFFF;
                }
            }

            // Sync glow sprite
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
        if (e.type === 'cloud' || e.type === 'streetlight' || e.type === 'crow' || e.type === 'lantern' || e.type === 'balloon') return;

        if (STATE.entropy > 50 && e.fsm === 'normal') {
            if (Math.random() < 0.002) {
                e.fsm = 'stressed';
                e.sprite.tint = CONFIG.acts[STATE.act] ? CONFIG.acts[STATE.act].buildingTint : 0xDDAAAA;
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
