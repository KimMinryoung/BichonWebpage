// PixiJS application setup, camera container, environment drawing, screen effects.
// Ground uses Mode 7-style scanline strips with correct 3D perspective mapping.

let app, camera, flash, centerX, centerY;
let groundContainer = null;
let groundStrips = [];
let groundTexture = null;
let groundScrollOffset = 0;
// No longer subtracting safe inset from dimensions — the gesture nav
// overlays the viewport bottom, it doesn't reduce available space.

const GROUND_STRIP_HEIGHT = 4;

// Use visualViewport when available (mobile) for accurate dimensions
// that exclude browser chrome (URL bar, gesture nav bar).
function vpWidth() {
    const vv = window.visualViewport;
    return vv ? vv.width : window.innerWidth;
}
function vpHeight() {
    const vv = window.visualViewport;
    return vv ? vv.height : window.innerHeight;
}
function _isPortrait() {
    return vpHeight() > vpWidth();
}

// In portrait mode the CSS wrapper is rotated 90deg, so the game's
// logical width is the viewport height and vice-versa.
function gameWidth() {
    return _isPortrait() ? vpHeight() : vpWidth();
}
function gameHeight() {
    return _isPortrait() ? vpWidth() : vpHeight();
}

// Size and position the wrapper element via inline styles.
function _syncWrapper() {
    const wrapper = document.getElementById('game-wrapper');
    if (!wrapper) return;

    const vw = vpWidth();
    const vh = vpHeight();

    if (_isPortrait()) {
        // Rotated: wrapper width = viewport height, height = viewport width
        wrapper.style.width = vh + 'px';
        wrapper.style.height = vw + 'px';
        wrapper.style.transformOrigin = 'top left';
        wrapper.style.transform = 'translateX(' + vw + 'px) rotate(90deg)';
    } else {
        wrapper.style.width = vw + 'px';
        wrapper.style.height = vh + 'px';
        wrapper.style.transform = '';
        wrapper.style.transformOrigin = '';
    }
}

const Renderer = {
    setup() {
        _syncWrapper();

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        app = new PIXI.Application({
            width: gameWidth(),
            height: gameHeight(),
            backgroundColor: CONFIG.colors.skyPeace,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        document.getElementById('game-canvas-container').appendChild(app.view);

        camera = new PIXI.Container();
        app.stage.addChild(camera);

        centerX = app.screen.width / 2;
        centerY = app.screen.height / 2;

        this._createFlash();

        // Listen on visualViewport (mobile-accurate) and fallback to window
        const resizeTarget = window.visualViewport || window;
        resizeTarget.addEventListener('resize', () => this._onResize());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this._onResize(), 200);
        });
    },

    initEnvironment() {
        this._drawGround();
        this._drawSun();
    },

    _drawGround() {
        const loadedTex = Assets.get('ground');
        groundTexture = loadedTex || this._generateGroundTexture();

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

        let cumulativeTexY = 0;

        for (let i = 0; i < numStrips; i++) {
            const screenY = centerY + i * GROUND_STRIP_HEIGHT;
            const depth = (i + 1) / numStrips;

            const scaleX = depth * 4.0;
            const scaleY = (depth * depth * 3.0) + 0.05;

            const strip = new PIXI.TilingSprite(groundTexture, stripWidth, GROUND_STRIP_HEIGHT);
            strip.x = -CONFIG.world.overscan;
            strip.y = screenY;
            strip.tileScale.set(scaleX, scaleY);

            strip.tilePosition.x = centerX + CONFIG.world.overscan;

            strip._baseTPY = -cumulativeTexY * scaleY;
            strip._scaleY = scaleY;
            strip.tilePosition.y = strip._baseTPY;

            cumulativeTexY += GROUND_STRIP_HEIGHT / scaleY;

            strip.alpha = Math.min(1, depth * 4);

            groundContainer.addChild(strip);
            groundStrips.push(strip);
        }
    },

    _generateGroundTexture() {
        const size = 64;
        const g = new PIXI.Graphics();

        g.beginFill(0x8A8A88);
        g.drawRect(0, 0, size, size);
        g.endFill();

        for (let i = 0; i < 60; i++) {
            const px = Math.floor(Math.random() * size);
            const py = Math.floor(Math.random() * size);
            const shade = Math.random() > 0.5 ? 0x7E7E7C : 0x949492;
            g.beginFill(shade);
            g.drawRect(px, py, 1, 1);
            g.endFill();
        }

        g.lineStyle(1, 0x5A5A58);
        g.moveTo(8, 0);
        g.lineTo(12, 18);
        g.lineTo(10, 32);
        g.lineTo(15, 48);
        g.moveTo(40, 10);
        g.lineTo(38, 28);
        g.lineTo(44, 40);
        g.lineTo(42, 56);
        g.moveTo(20, 44);
        g.lineTo(34, 46);
        g.moveTo(50, 0);
        g.lineTo(52, 14);

        const tex = app.renderer.generateTexture(g, {
            scaleMode: PIXI.SCALE_MODES.NEAREST,
            resolution: 1
        });
        g.destroy();
        return tex;
    },

    _drawSun() {
        const sunTex = Assets.get('sun');
        // Position sun proportionally: 70% right, 15% from top
        const sunX = app.screen.width * 0.7;
        const sunY = app.screen.height * 0.15;

        if (sunTex) {
            const sun = new PIXI.Sprite(sunTex);
            sun.anchor.set(0.5, 0.5);
            sun.x = sunX;
            sun.y = sunY;
            sun.scale.set(0.5);
            camera.addChild(sun);
        } else {
            const sun = new PIXI.Graphics();
            sun.beginFill(CONFIG.colors.sun);
            sun.drawRect(sunX - 25, sunY - 25, 50, 50);
            sun.endFill();
            camera.addChild(sun);
        }
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
        _syncWrapper();

        const w = gameWidth();
        const h = gameHeight();
        app.renderer.resize(w, h);
        centerX = app.screen.width / 2;
        centerY = app.screen.height / 2;

        if (groundContainer) {
            this._buildStrips();
        }
        if (typeof Effects !== 'undefined') {
            Effects.onResize(app);
        }
    },

    applyEffects() {
        // Camera shake
        camera.x = (Math.random() - 0.5) * STATE.shake;
        camera.y = (Math.random() - 0.5) * STATE.shake;

        // Scroll ground
        groundScrollOffset += STATE.speed * 0.02;

        for (let i = 0; i < groundStrips.length; i++) {
            const strip = groundStrips[i];
            strip.tilePosition.y = strip._baseTPY + groundScrollOffset * strip._scaleY;
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
