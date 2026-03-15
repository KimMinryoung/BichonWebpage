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
    balloon: 6,         // hot air balloons — large, visible from far
    boat: 5,            // boats on the sea surface
    debris: 2,          // floating wreckage/debris
    beacon: 4,          // sea buoys with blinking light
    neon: 4             // neon signs on buildings (Act 3 city)
};

const PLACEMENT = {
    tree:        { minOff: 0.15, maxOff: 1.3 },   // can appear close to flight path
    streetlight: { minOff: 0.3,  maxOff: 1.05 },  // scattered around the flight path
    building:    { minOff: 0.6,  maxOff: 2.2 },   // fly between buildings — canyon feel
    crow:        { minOff: 0.05, maxOff: 0.8 },   // birds fly close to the witch
    lantern:     { minOff: 0.1,  maxOff: 1.0 },   // lanterns float near and mid range
    balloon:     { minOff: 0.3,  maxOff: 1.8 },   // balloons at various distances
    boat:        { minOff: 0.3,  maxOff: 1.6 },   // boats scattered across the sea
    debris:      { minOff: 0.1,  maxOff: 1.2 },   // debris close and mid range
    beacon:      { minOff: 0.4,  maxOff: 1.4 },   // buoys at regular intervals
    neon:        { minOff: 0.5,  maxOff: 2.0 }    // neon signs on building facades
};

const SPACING = {
    tree: 3,          // was 8 — much denser foliage
    streetlight: 5,   // was 15 — streetlights every few segments
    building: 3,      // was 10 — packed city blocks
    crow: 4,          // birds in small groups
    lantern: 6,       // lanterns scattered
    balloon: 15,      // balloons sparse — special sighting
    boat: 8,          // boats moderately spaced
    debris: 4,        // debris fairly dense (flood wreckage)
    beacon: 12,       // buoys regularly spaced
    neon: 6           // neon signs frequent in city
};

const GLOW_KEYS = {
    'building-modern':    'building-modern-glow',
    'building-glass':     'building-glass-glow',
    'building-apartment': 'building-apartment-glow',
    'streetlight':        'streetlight-glow',
    'namsan-tower':       'namsan-tower-glow',
    'lantern':            'lantern-glow',
    'beacon':             'beacon-glow',
    'neon':               'neon-glow'
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

        // Boats — vessels on the sea surface (Act 2)
        for (let i = 0; i < CONFIG.counts.boats; i++) {
            const segIdx = (i * SPACING.boat + 3 + Math.floor(Math.random() * 5)) % totalSegs;
            const side = (i % 2 === 0) ? 1 : -1;
            const offset = side * (PLACEMENT.boat.minOff + Math.random() * (PLACEMENT.boat.maxOff - PLACEMENT.boat.minOff));

            const sprite = Assets.createSprite('boat');
            entityList.push({
                sprite,
                glowSprite: null,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'boat',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.boat,
                elevation: 0
            });
            camera.addChild(sprite);
        }

        // Debris — floating wreckage (Act 2 sea, Act 4 desolate)
        for (let i = 0; i < CONFIG.counts.debris; i++) {
            const segIdx = (i * SPACING.debris + 1 + Math.floor(Math.random() * 3)) % totalSegs;
            const side = (Math.random() > 0.5) ? 1 : -1;
            const offset = side * (PLACEMENT.debris.minOff + Math.random() * (PLACEMENT.debris.maxOff - PLACEMENT.debris.minOff));

            const sprite = Assets.createSprite('debris');
            entityList.push({
                sprite,
                glowSprite: null,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'debris',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.debris,
                elevation: 0
            });
            camera.addChild(sprite);
        }

        // Beacons — sea buoys with blinking light (Act 2)
        for (let i = 0; i < CONFIG.counts.beacons; i++) {
            const segIdx = (i * SPACING.beacon + 7 + Math.floor(Math.random() * 6)) % totalSegs;
            const side = (i % 2 === 0) ? 1 : -1;
            const offset = side * (PLACEMENT.beacon.minOff + Math.random() * (PLACEMENT.beacon.maxOff - PLACEMENT.beacon.minOff));

            const sprite = Assets.createSprite('beacon');
            const glow = _makeGlow('beacon');
            entityList.push({
                sprite,
                glowSprite: glow,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'beacon',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.beacon,
                elevation: 0
            });
            camera.addChild(sprite);
            if (glow) glowLayer.addChild(glow);
        }

        // Neon signs — glowing signs in the city (Act 3)
        for (let i = 0; i < CONFIG.counts.neons; i++) {
            const segIdx = (i * SPACING.neon + 4 + Math.floor(Math.random() * 4)) % totalSegs;
            const side = (i % 2 === 0) ? 1 : -1;
            const offset = side * (PLACEMENT.neon.minOff + Math.random() * (PLACEMENT.neon.maxOff - PLACEMENT.neon.minOff));

            const sprite = Assets.createSprite('neon');
            const glow = _makeGlow('neon');
            entityList.push({
                sprite,
                glowSprite: glow,
                segmentIndex: segIdx,
                roadOffset: offset,
                type: 'neon',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.neon,
                elevation: 80 + Math.random() * 200    // mounted on building facades
            });
            camera.addChild(sprite);
            if (glow) glowLayer.addChild(glow);
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
        const refFL = CONFIG.road.focalLengthRef || 400;
        const cameraDepth = CONFIG.road.cameraDepth * (STATE.focalLength / refFL);

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
                // Slow wind drift
                if (!bg._driftSpeed) bg._driftSpeed = 0.002 + Math.random() * 0.004;
                if (!bg._driftPhase) bg._driftPhase = 0;
                bg._driftPhase += bg._driftSpeed * STATE.speed * dt;
                const drift = bg._driftPhase;
                bg.sprite.x = bg.baseX * sw + drift + cloudCurveShift;
                // Gentle vertical bob
                bg.sprite.y = bg.baseY * sh + Math.sin(Date.now() * 0.0005 + (bg.baseX || 0) * 10) * 3;
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

            // Biome visibility: hide entity types not in current biome
            const biomeVis = CONFIG.biomeEntities[STATE.biome];
            if (biomeVis && biomeVis[e.type] === false) {
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

            // Apply idle motion (must run after base position/scale is set)
            this._updateIdleMotion(e, dt);

            // Apply idle bob offset (balloons, lanterns) to screen Y
            if (e._idleBob) {
                e.sprite.y += e._idleBob * proj.scale * sh;
            }

            const fogFade = Math.max(0, 1 - proj.fog * proj.fog * 0.5);
            e.sprite.alpha = fogFade;

            e.sprite.zIndex = -segDist;

            // Atmospheric perspective: ALL entities blend toward fog color with distance
            if (e.fsm === 'normal') {
                const distT = Math.min(1, segDist / (CONFIG.road.visibleSegments * 0.6));
                if (distT > 0.15) {
                    const fogBlend = Math.min(1, (distT - 0.15) / 0.85);
                    const fr = Math.round(STATE.fogR);
                    const fg = Math.round(STATE.fogG);
                    const fb = Math.round(STATE.fogB);
                    const r = Math.round(255 + (fr - 255) * fogBlend);
                    const g = Math.round(255 + (fg - 255) * fogBlend);
                    const b = Math.round(255 + (fb - 255) * fogBlend);
                    e.sprite.tint = (r << 16) | (g << 8) | b;
                } else {
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

    // Per-frame idle animations for living entities
    _updateIdleMotion(e, dt) {
        const t = Date.now() * 0.001;
        const id = e.segmentIndex || 0; // unique phase offset per entity

        if (e.type === 'crow') {
            // Wing flap: scale.y oscillation + banking rotation
            const flapSpeed = 6 + (id % 5);          // slightly different per bird
            const flapAmp = 0.15;
            const flap = Math.sin(t * flapSpeed + id * 1.7);
            const baseScale = e.sprite.scale.x;
            e.sprite.scale.y = baseScale * (1 - flapAmp * Math.abs(flap));
            // Gentle banking as they fly
            const bank = Math.sin(t * 1.2 + id * 2.3) * 0.12;
            if (e.fsm === 'normal') e.sprite.rotation = bank;
        } else if (e.type === 'balloon') {
            // Gentle bobbing — slow altitude oscillation
            const bob = Math.sin(t * 0.5 + id * 0.8) * 30;
            e._idleBob = bob;
            // Slight horizontal sway
            if (e.fsm === 'normal') {
                e.sprite.rotation = Math.sin(t * 0.3 + id * 1.5) * 0.04;
            }
        } else if (e.type === 'lantern') {
            // Pendulum sway + vertical float
            const sway = Math.sin(t * 1.8 + id * 2.1) * 0.1;
            if (e.fsm === 'normal') e.sprite.rotation = sway;
            e._idleBob = Math.sin(t * 0.8 + id * 1.3) * 15;
            // Glow pulse
            if (e.glowSprite && e.fsm === 'normal') {
                const pulse = 0.3 + 0.3 * Math.sin(t * 2.5 + id * 0.9);
                e.glowSprite.alpha = Math.max(e.glowSprite.alpha, pulse);
            }
        } else if (e.type === 'tree') {
            // Wind sway — subtle rotation
            const wind = Math.sin(t * 0.7 + id * 0.6) * 0.03
                       + Math.sin(t * 1.9 + id * 1.2) * 0.01;
            if (e.fsm === 'normal') e.sprite.rotation = wind;
        } else if (e.type === 'boat') {
            // Rocking on waves — rotation + vertical bob
            const rock = Math.sin(t * 1.2 + id * 1.5) * 0.08;
            if (e.fsm === 'normal') e.sprite.rotation = rock;
            e._idleBob = Math.sin(t * 0.6 + id * 0.9) * 10;
        } else if (e.type === 'debris') {
            // Slow tumble rotation + gentle bob
            const tumble = Math.sin(t * 0.4 + id * 2.0) * 0.15;
            if (e.fsm === 'normal') e.sprite.rotation = tumble;
            e._idleBob = Math.sin(t * 0.7 + id * 1.1) * 5;
        } else if (e.type === 'beacon') {
            // Slight sway + blink glow
            const sway = Math.sin(t * 1.0 + id * 1.8) * 0.05;
            if (e.fsm === 'normal') e.sprite.rotation = sway;
            if (e.glowSprite && e.fsm === 'normal') {
                // Slow blink: on for 1s, off for 2s
                const blink = Math.sin(t * 2.0 + id * 3.0) > 0.3 ? 1.0 : 0.1;
                e.glowSprite.alpha = Math.max(e.glowSprite.alpha, blink * 0.8);
            }
        } else if (e.type === 'neon') {
            // Neon flicker — occasional rapid alpha jitter
            if (e.glowSprite && e.fsm === 'normal') {
                const flicker = Math.sin(t * 8.0 + id * 5.0) * Math.sin(t * 13.0 + id * 2.3);
                const pulse = 0.6 + 0.4 * Math.max(0, flicker);
                e.glowSprite.alpha = Math.max(e.glowSprite.alpha, pulse);
            }
        }
    },

    _updateEntityVisuals(e) {
        if (e.type === 'cloud' || e.type === 'streetlight' || e.type === 'crow' || e.type === 'lantern' || e.type === 'balloon' || e.type === 'boat' || e.type === 'debris' || e.type === 'beacon' || e.type === 'neon') return;

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
