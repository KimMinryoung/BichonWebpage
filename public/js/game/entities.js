// Entity creation, object pooling, and per-frame z-projection.
// Uses sprite textures from Assets (real PNGs or generated fallbacks).

const entityList = [];

// Base pixel dimensions for scaling reference.
// z-projection scale is multiplied by a size factor so pixel sprites
// appear at a reasonable world size.
const ENTITY_SCALE = {
    building: 3,
    tower: 4,
    tree: 1.6,
    streetlight: 1.6,
    cloud: 2
};

const Entities = {
    init() {
        const camera = Renderer.getCamera();

        // Seoul buildings (pick from 3 styles randomly)
        const buildingKeys = ['building-modern', 'building-glass', 'building-apartment'];
        for (let i = 0; i < CONFIG.counts.buildings; i++) {
            const key = buildingKeys[Math.floor(Math.random() * buildingKeys.length)];
            const sprite = Assets.createSprite(key);
            const entity = {
                sprite,
                x: this._randomBuildingX(),
                y: 800,
                z: Math.random() * CONFIG.world.maxZ,
                type: 'building',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.building
            };
            entityList.push(entity);
            camera.addChild(sprite);
        }

        // Namsan Tower
        const tower = Assets.createSprite('namsan-tower');
        entityList.push({
            sprite: tower,
            x: 0,
            y: 800,
            z: CONFIG.world.maxZ * 0.9,
            type: 'tower',
            fsm: 'normal',
            baseScale: ENTITY_SCALE.tower
        });
        camera.addChild(tower);

        // Trees
        for (let i = 0; i < CONFIG.counts.trees; i++) {
            const sprite = Assets.createSprite('tree');
            entityList.push({
                sprite,
                x: this._randomTreeX(),
                y: 800,
                z: Math.random() * CONFIG.world.maxZ,
                type: 'tree',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.tree
            });
            camera.addChild(sprite);
        }

        // Streetlights
        for (let i = 0; i < CONFIG.counts.streetlights; i++) {
            const sprite = Assets.createSprite('streetlight');
            entityList.push({
                sprite,
                x: (Math.random() > 0.5 ? 1 : -1) * (400 + Math.random() * 300),
                y: 800,
                z: Math.random() * CONFIG.world.maxZ,
                type: 'streetlight',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.streetlight
            });
            camera.addChild(sprite);
        }

        // Clouds
        for (let i = 0; i < CONFIG.counts.clouds; i++) {
            const sprite = Assets.createSprite('cloud');
            sprite.anchor.set(0.5, 0.5); // clouds anchor at center
            entityList.push({
                sprite,
                x: (Math.random() - 0.5) * 4000,
                y: -400 - Math.random() * 600,
                z: Math.random() * CONFIG.world.maxZ,
                type: 'cloud',
                fsm: 'normal',
                baseScale: ENTITY_SCALE.cloud
            });
            camera.addChild(sprite);
        }
    },

    update(delta) {
        const center = Renderer.getCenter();
        const maxZ = CONFIG.world.maxZ;

        for (let i = 0; i < entityList.length; i++) {
            const e = entityList[i];
            e.z -= STATE.speed * delta;

            // Recycle when past camera
            if (e.z <= 1) {
                e.z += maxZ;
                if (e.type === 'building') {
                    e.x = this._randomBuildingX();
                } else if (e.type === 'tree') {
                    e.x = this._randomTreeX();
                } else if (e.type === 'cloud') {
                    e.x = (Math.random() - 0.5) * 4000;
                }
                // Reset crisis visuals on recycle
                if (e.fsm === 'stressed' || e.fsm === 'damaged') {
                    e.sprite.tint = 0xFFFFFF;
                    e.fsm = 'normal';
                }
            }

            // 3D projection
            const scale = STATE.focalLength / e.z;
            e.sprite.x = center.x + e.x * scale;
            e.sprite.y = center.y + e.y * scale;
            e.sprite.scale.set(scale * e.baseScale);

            // Fade in from distance
            e.sprite.alpha = Math.min(1, (maxZ - e.z) / (maxZ * 0.5));

            // FSM-based visual changes
            this._updateEntityVisuals(e);
        }
    },

    _updateEntityVisuals(e) {
        if (e.type === 'cloud' || e.type === 'streetlight') return;

        if (STATE.entropy > 50 && e.fsm === 'normal' && e.z < CONFIG.world.maxZ * 0.5) {
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

    _randomBuildingX() {
        return (Math.random() - 0.5) * 6000 + (Math.random() > 0.5 ? 1200 : -1200);
    },

    _randomTreeX() {
        return (Math.random() > 0.5 ? 1 : -1) * (300 + Math.random() * 500);
    },

    getList() { return entityList; }
};
