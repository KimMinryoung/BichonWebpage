// PixiJS application setup, camera container, environment drawing, screen effects.

let app, camera, flash, centerX, centerY;

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

        this._drawEnvironment();
        this._createFlash();

        window.addEventListener('resize', () => this._onResize());
    },

    _drawEnvironment() {
        // Ground plane
        const ground = new PIXI.Graphics();
        ground.beginFill(CONFIG.colors.ground);
        ground.drawRect(
            -CONFIG.world.overscan, centerY,
            app.screen.width + CONFIG.world.overscan * 2,
            app.screen.height + CONFIG.world.overscan
        );
        ground.endFill();
        camera.addChild(ground);

        // Horizon line
        const horizon = new PIXI.Graphics();
        horizon.lineStyle(2, CONFIG.colors.horizon);
        horizon.moveTo(-CONFIG.world.overscan, centerY);
        horizon.lineTo(app.screen.width + CONFIG.world.overscan * 2, centerY);
        camera.addChild(horizon);

        // Sun
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
    },

    applyEffects() {
        // Camera shake
        camera.x = (Math.random() - 0.5) * STATE.shake;
        camera.y = (Math.random() - 0.5) * STATE.shake;

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
