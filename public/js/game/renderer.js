// PixiJS application setup, camera container, environment drawing, screen effects.
// Ground uses Mode 7-style scanline strips with correct 3D perspective mapping.

let app, camera, flash, centerX, centerY;
let groundContainer = null;
let groundStrips = [];
let groundTexture = null;
let groundScrollOffset = 0;
let sunSprite = null;
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
        camera.sortableChildren = true;
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
        groundContainer.zIndex = -5000; // behind entities, in front of sun
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

            const scaleX = depth * 1.0;
            const scaleY = (depth * depth * 0.75) + 0.01;

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
        const sunX = app.screen.width * 0.7;
        const sunY = app.screen.height * 0.15;

        if (sunTex) {
            sunSprite = new PIXI.Sprite(sunTex);
            sunSprite.anchor.set(0.5, 0.5);
            sunSprite.scale.set(0.5);
        } else {
            sunSprite = new PIXI.Graphics();
            sunSprite.beginFill(CONFIG.colors.sun);
            sunSprite.drawRect(-25, -25, 50, 50);
            sunSprite.endFill();
        }
        sunSprite.x = sunX;
        sunSprite.y = sunY;
        sunSprite.zIndex = -10000; // behind ground and all entities
        camera.addChild(sunSprite);
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

        // Sun position & tint: sets by entropy ~65, hidden before sky goes dark
        if (sunSprite) {
            // Sun completes its descent over entropy 0–65 (before catastrophe)
            const t = Math.min(1, STATE.entropy / 65);
            const startX = app.screen.width * 0.7;
            const endX = app.screen.width * 0.85;
            const startY = app.screen.height * 0.15;
            const endY = centerY + 40; // sink below horizon
            sunSprite.x = startX + (endX - startX) * t;
            sunSprite.y = startY + (endY - startY) * t;
            // Tint: white → warm orange → deep red → fade out
            if (t < 0.4) {
                sunSprite.tint = 0xFFFDE7;
                sunSprite.alpha = 1;
            } else if (t < 0.75) {
                const p = (t - 0.4) / 0.35;
                const r = 0xFF;
                const g = Math.round(0xFD - p * 0x7D);
                const b = Math.round(0xE7 - p * 0xC7);
                sunSprite.tint = (r << 16) | (g << 8) | b;
                sunSprite.alpha = 1;
            } else {
                const p = (t - 0.75) / 0.25;
                sunSprite.tint = 0xFF4010;
                sunSprite.alpha = Math.max(0, 1 - p);
            }
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
