// PixiJS application setup, camera container, environment drawing, screen effects.
// Ground uses Mode 7-style scanline strips with correct 3D perspective mapping.

let app, camera, flash, centerX, centerY;
let groundContainer = null;
let groundStrips = [];
let groundTexture = null;
let groundScrollOffset = 0;

const GROUND_STRIP_HEIGHT = 4;

const Renderer = {
    setup() {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: CONFIG.colors.skyPeace,
            resolution: window.devicePixelRatio || 1,
        });
        document.getElementById('game-canvas-container').appendChild(app.view);

        camera = new PIXI.Container();
        app.stage.addChild(camera);

        centerX = app.screen.width / 2;
        centerY = app.screen.height / 2;

        this._createFlash();

        window.addEventListener('resize', () => this._onResize());
    },

    initEnvironment() {
        this._drawGround();
        this._drawSun();
    },

    _drawGround() {
        groundTexture = this._generateGroundTexture();

        groundContainer = new PIXI.Container();
        camera.addChild(groundContainer);

        this._buildStrips();
    },

    _buildStrips() {
        groundContainer.removeChildren();
        groundStrips = [];

        const groundHeight = app.screen.height - centerY + CONFIG.world.overscan;
        const stripWidth = app.screen.width + CONFIG.world.overscan * 2;
        const numStrips = Math.ceil(groundHeight / GROUND_STRIP_HEIGHT);

        // PixiJS TilingSprite texture coordinate formula:
        //   texCoord = (localPos - tilePosition) / (tileScale * textureSize)
        //
        // For vertical lines to be straight: all strips must have the same
        // tilePosition.x so that texCoord=0 falls at the same screen position.
        //
        // For horizontal lines to be seamless: cumulative texture Y tracking
        // converted properly through the tileScale.

        let cumulativeTexY = 0; // accumulated texture pixels from horizon downward
        const texSize = groundTexture.width; // texture is square

        for (let i = 0; i < numStrips; i++) {
            const screenY = centerY + i * GROUND_STRIP_HEIGHT;
            const depth = (i + 1) / numStrips;

            // X scale: linear with depth (wider tiles near camera)
            const scaleX = depth * 4.0;
            // Y scale: quadratic (ground stretches more near camera)
            const scaleY = (depth * depth * 3.0) + 0.05;

            const strip = new PIXI.TilingSprite(groundTexture, stripWidth, GROUND_STRIP_HEIGHT);
            strip.x = -CONFIG.world.overscan;
            strip.y = screenY;
            strip.tileScale.set(scaleX, scaleY);

            // X alignment: tilePosition.x is in local pixel space.
            // Setting it to (centerX + overscan) makes texCoord=0 fall at screen center
            // for ALL strips regardless of scaleX → vertical lines stay straight.
            strip.tilePosition.x = centerX + CONFIG.world.overscan;

            // Y alignment: convert cumulative texture coordinate to tilePosition.
            // At strip top (localY=0), we want texCoord = cumulativeTexY / texSize:
            //   cumulativeTexY / texSize = (0 - tilePosition.y) / (scaleY * texSize)
            //   tilePosition.y = -cumulativeTexY * scaleY
            strip._baseTPY = -cumulativeTexY * scaleY;
            strip._scaleY = scaleY;
            strip.tilePosition.y = strip._baseTPY;

            // Advance cumulative texture Y by how many texture pixels this strip covers
            cumulativeTexY += GROUND_STRIP_HEIGHT / scaleY;

            groundContainer.addChild(strip);
            groundStrips.push(strip);
        }
    },

    _generateGroundTexture() {
        // Debug grid — will be replaced with cracked concrete once verified
        const size = 64;
        const g = new PIXI.Graphics();

        g.beginFill(0x999999);
        g.drawRect(0, 0, size, size);
        g.endFill();

        g.lineStyle(1, 0x666666);
        for (let i = 0; i <= size; i += 8) {
            g.moveTo(i, 0);
            g.lineTo(i, size);
            g.moveTo(0, i);
            g.lineTo(size, i);
        }

        g.lineStyle(2, 0x444444);
        g.moveTo(size / 2, 0);
        g.lineTo(size / 2, size);
        g.moveTo(0, size / 2);
        g.lineTo(size, size / 2);

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _drawSun() {
        const sun = new PIXI.Graphics();
        sun.beginFill(CONFIG.colors.sun);
        sun.drawRect(centerX + 150, centerY - 250, 50, 50);
        sun.endFill();
        camera.addChild(sun);
    },

    _createFlash() {
        flash = new PIXI.Graphics();
        flash.beginFill(CONFIG.colors.screenFlash);
        flash.drawRect(0, 0, app.screen.width, app.screen.height);
        flash.endFill();
        flash.alpha = 0;
        app.stage.addChild(flash);
    },

    _onResize() {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        centerX = app.screen.width / 2;
        centerY = app.screen.height / 2;

        if (groundContainer) {
            this._buildStrips();
        }
    },

    applyEffects() {
        // Camera shake
        camera.x = (Math.random() - 0.5) * STATE.shake;
        camera.y = (Math.random() - 0.5) * STATE.shake;

        // Scroll ground: advance texture offset, convert through scaleY per strip.
        // Multiplying by scaleY makes near strips (large scaleY) move faster on screen.
        groundScrollOffset += STATE.speed * 0.02;

        for (let i = 0; i < groundStrips.length; i++) {
            const strip = groundStrips[i];
            strip.tilePosition.y = strip._baseTPY - groundScrollOffset * strip._scaleY;
        }

        // Sky color from state
        const skyColor = (Math.round(STATE.skyR) << 16)
                       | (Math.round(STATE.skyG) << 8)
                       | Math.round(STATE.skyB);
        app.renderer.background.color = skyColor;
    },

    getApp() { return app; },
    getCamera() { return camera; },
    getFlash() { return flash; },
    getCenter() { return { x: centerX, y: centerY }; }
};
