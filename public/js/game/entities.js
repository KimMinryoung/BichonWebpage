// Entity creation, object pooling, and per-frame z-projection.

const entityList = [];

const Entities = {
    init() {
        const camera = Renderer.getCamera();

        // Seoul buildings
        for (let i = 0; i < CONFIG.counts.buildings; i++) {
            const sprite = this._createBuilding();
            const entity = {
                sprite,
                x: this._randomBuildingX(),
                y: 800,
                z: Math.random() * CONFIG.world.maxZ,
                type: 'building',
                fsm: 'normal'
            };
            entityList.push(entity);
            camera.addChild(sprite);
        }

        // Namsan Tower (persistent landmark, centered)
        const tower = this._createNamsanTower();
        entityList.push({
            sprite: tower,
            x: 0,
            y: 800,
            z: CONFIG.world.maxZ * 0.9,
            type: 'tower',
            fsm: 'normal'
        });
        camera.addChild(tower);

        // Trees along the street
        for (let i = 0; i < CONFIG.counts.trees; i++) {
            const sprite = this._createTree();
            entityList.push({
                sprite,
                x: this._randomTreeX(),
                y: 800,
                z: Math.random() * CONFIG.world.maxZ,
                type: 'tree',
                fsm: 'normal'
            });
            camera.addChild(sprite);
        }

        // Streetlights
        for (let i = 0; i < CONFIG.counts.streetlights; i++) {
            const sprite = this._createStreetlight();
            entityList.push({
                sprite,
                x: (Math.random() > 0.5 ? 1 : -1) * (400 + Math.random() * 300),
                y: 800,
                z: Math.random() * CONFIG.world.maxZ,
                type: 'streetlight',
                fsm: 'normal'
            });
            camera.addChild(sprite);
        }

        // Clouds
        for (let i = 0; i < CONFIG.counts.clouds; i++) {
            const sprite = this._createCloud();
            entityList.push({
                sprite,
                x: (Math.random() - 0.5) * 4000,
                y: -400 - Math.random() * 600,
                z: Math.random() * CONFIG.world.maxZ,
                type: 'cloud',
                fsm: 'normal'
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
            e.sprite.scale.set(scale);

            // Fade in from distance
            e.sprite.alpha = Math.min(1, (maxZ - e.z) / (maxZ * 0.5));

            // FSM-based visual changes driven by entropy
            this._updateEntityVisuals(e);
        }
    },

    _updateEntityVisuals(e) {
        if (e.type === 'cloud' || e.type === 'streetlight') return;

        if (STATE.entropy > 50 && e.fsm === 'normal' && e.z < CONFIG.world.maxZ * 0.5) {
            // Random chance to stress nearby entities
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

    // --- Factory methods ---

    _createBuilding() {
        const gfx = new PIXI.Graphics();
        const w = CONFIG.sizes.buildingWidthMin + Math.random() * (CONFIG.sizes.buildingWidthMax - CONFIG.sizes.buildingWidthMin);
        const h = CONFIG.sizes.buildingHeightMin + Math.random() * (CONFIG.sizes.buildingHeightMax - CONFIG.sizes.buildingHeightMin);

        // Pick a random Seoul building style
        const styles = [CONFIG.colors.buildingModern, CONFIG.colors.buildingGlass, CONFIG.colors.buildingApartment];
        const bodyColor = styles[Math.floor(Math.random() * styles.length)];

        // Main body
        gfx.beginFill(bodyColor);
        gfx.drawRect(-w / 2, -h, w, h);
        gfx.endFill();

        // Shadow side
        gfx.beginFill(CONFIG.colors.buildingShadow);
        gfx.drawRect(-w / 2, -h, w * 0.25, h);
        gfx.endFill();

        // Windows grid
        const winColor = Math.random() > 0.3 ? CONFIG.colors.windowLit : CONFIG.colors.windowDark;
        gfx.beginFill(winColor, 0.8);
        const cols = Math.floor(w / 25);
        const rows = Math.floor(h / 30);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.random() > 0.3) {
                    gfx.drawRect(-w / 2 + 10 + c * 25, -h + 10 + r * 30, 8, 12);
                }
            }
        }
        gfx.endFill();

        return gfx;
    },

    _createNamsanTower() {
        const gfx = new PIXI.Graphics();
        // Tower shaft
        gfx.beginFill(CONFIG.colors.towerBody);
        gfx.drawRect(-15, -900, 30, 900);
        gfx.endFill();
        // Shadow
        gfx.beginFill(CONFIG.colors.towerShadow);
        gfx.drawRect(-15, -900, 10, 900);
        gfx.endFill();
        // Observation deck
        gfx.beginFill(CONFIG.colors.towerBody);
        gfx.drawRect(-40, -750, 80, 40);
        gfx.endFill();
        // Antenna
        gfx.beginFill(CONFIG.colors.towerShadow);
        gfx.drawRect(-3, -950, 6, 50);
        gfx.endFill();
        // Red beacon
        gfx.beginFill(CONFIG.colors.towerLight);
        gfx.drawCircle(0, -955, 5);
        gfx.endFill();
        return gfx;
    },

    _createTree() {
        const gfx = new PIXI.Graphics();
        // Trunk
        gfx.beginFill(CONFIG.colors.treeTrunk);
        gfx.drawRect(-3, -CONFIG.sizes.treeHeight * 0.4, 6, CONFIG.sizes.treeHeight * 0.4);
        gfx.endFill();
        // Foliage (circle)
        gfx.beginFill(CONFIG.colors.treeFoliage);
        gfx.drawCircle(0, -CONFIG.sizes.treeHeight * 0.6, CONFIG.sizes.treeWidth * 0.5);
        gfx.endFill();
        return gfx;
    },

    _createStreetlight() {
        const gfx = new PIXI.Graphics();
        // Pole
        gfx.beginFill(CONFIG.colors.streetlight);
        gfx.drawRect(-2, -120, 4, 120);
        gfx.endFill();
        // Lamp arm
        gfx.beginFill(CONFIG.colors.streetlight);
        gfx.drawRect(-2, -120, 20, 3);
        gfx.endFill();
        // Glow
        gfx.beginFill(CONFIG.colors.streetlightGlow, 0.6);
        gfx.drawCircle(18, -118, 6);
        gfx.endFill();
        return gfx;
    },

    _createCloud() {
        const gfx = new PIXI.Graphics();
        gfx.beginFill(0xFFFFFF, 0.6);
        gfx.drawEllipse(0, 0, 60 + Math.random() * 40, 15 + Math.random() * 10);
        gfx.endFill();
        return gfx;
    },

    _randomBuildingX() {
        return (Math.random() - 0.5) * 6000 + (Math.random() > 0.5 ? 1200 : -1200);
    },

    _randomTreeX() {
        return (Math.random() > 0.5 ? 1 : -1) * (300 + Math.random() * 500);
    },

    getList() { return entityList; }
};
