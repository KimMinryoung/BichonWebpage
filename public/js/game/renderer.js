// PixiJS application setup, camera container, pseudo-3D road rendering, screen effects.
// Road uses segment-based projection (OutRun/Slipstream style) with curves + hills.

let app, camera, flash, centerX, centerY;
let roadGfx = null;         // PIXI.Graphics for road drawing
let sunSprite = null;
let bgContainer = null;     // background parallax container

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

        const resizeTarget = window.visualViewport || window;
        resizeTarget.addEventListener('resize', () => this._onResize());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this._onResize(), 200);
        });
    },

    initEnvironment() {
        this._initRoadGraphics();
        this._initBackground();
        this._drawSun();
    },

    _initRoadGraphics() {
        roadGfx = new PIXI.Graphics();
        roadGfx.zIndex = -5000;
        camera.addChild(roadGfx);
    },

    _initBackground() {
        // Background container for parallax elements (mountains, distant buildings)
        bgContainer = new PIXI.Container();
        bgContainer.zIndex = -9000;
        camera.addChild(bgContainer);
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
        sunSprite.zIndex = -10000;
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

    // Draw the road each frame using projected segments
    drawRoad(projected) {
        if (!roadGfx || projected.length < 2) return;

        const sw = app.screen.width;
        const sh = app.screen.height;
        const rc = CONFIG.road.colors;
        const rumbleW = CONFIG.road.rumbleWidth;
        const shoulderW = CONFIG.road.shoulderWidth;

        roadGfx.clear();

        // Fill sky-to-ground below horizon with grass
        if (projected.length > 0) {
            const horizon = projected[projected.length - 1];
            const horizonY = Math.max(0, horizon.y);
            roadGfx.beginFill(rc.grass[0]);
            roadGfx.drawRect(0, horizonY, sw, sh - horizonY);
            roadGfx.endFill();
        }

        // Draw segments from far to near (painter's algorithm)
        for (let n = projected.length - 2; n >= 0; n--) {
            const curr = projected[n];
            const prev = projected[n + 1]; // farther segment

            if (curr.clip && prev.clip) continue;
            // Skip only if BOTH are off-screen (near segments extend below screen, that's OK)
            if (prev.y > sh * 2 && curr.y > sh * 2) continue;

            const isEven = (curr.index % 2) === 0;

            const currW = curr.w;
            const prevW = prev.w;
            const currRumble = currW * (1 + rumbleW / CONFIG.road.roadWidth);
            const prevRumble = prevW * (1 + rumbleW / CONFIG.road.roadWidth);
            const currShoulder = currW * (1 + (rumbleW + shoulderW) / CONFIG.road.roadWidth);
            const prevShoulder = prevW * (1 + (rumbleW + shoulderW) / CONFIG.road.roadWidth);

            // Grass
            const grassColor = isEven ? rc.grass[0] : rc.grass[1];
            roadGfx.beginFill(grassColor);
            roadGfx.moveTo(0, prev.y);
            roadGfx.lineTo(sw, prev.y);
            roadGfx.lineTo(sw, curr.y);
            roadGfx.lineTo(0, curr.y);
            roadGfx.endFill();

            // Shoulder
            const shoulderColor = isEven ? rc.shoulder[0] : rc.shoulder[1];
            roadGfx.beginFill(shoulderColor);
            roadGfx.moveTo(prev.x - prevShoulder, prev.y);
            roadGfx.lineTo(prev.x + prevShoulder, prev.y);
            roadGfx.lineTo(curr.x + currShoulder, curr.y);
            roadGfx.lineTo(curr.x - currShoulder, curr.y);
            roadGfx.endFill();

            // Rumble strips
            const rumbleColor = isEven ? rc.rumble[0] : rc.rumble[1];
            roadGfx.beginFill(rumbleColor);
            roadGfx.moveTo(prev.x - prevRumble, prev.y);
            roadGfx.lineTo(prev.x + prevRumble, prev.y);
            roadGfx.lineTo(curr.x + currRumble, curr.y);
            roadGfx.lineTo(curr.x - currRumble, curr.y);
            roadGfx.endFill();

            // Road surface
            const roadColor = isEven ? rc.road[0] : rc.road[1];
            roadGfx.beginFill(roadColor);
            roadGfx.moveTo(prev.x - prevW, prev.y);
            roadGfx.lineTo(prev.x + prevW, prev.y);
            roadGfx.lineTo(curr.x + currW, curr.y);
            roadGfx.lineTo(curr.x - currW, curr.y);
            roadGfx.endFill();

            // Lane markings (dashed — only on even segments for dashes)
            if (isEven && curr.scale > 0.001) {
                const laneW = Math.max(1, currW * 0.02);
                for (let lane = 1; lane < CONFIG.road.lanes; lane++) {
                    const lanePos = -1 + (2 * lane / CONFIG.road.lanes);
                    const cx = curr.x + currW * lanePos;
                    const px = prev.x + prevW * lanePos;
                    roadGfx.beginFill(rc.lane);
                    roadGfx.moveTo(px - laneW * 0.5, prev.y);
                    roadGfx.lineTo(px + laneW * 0.5, prev.y);
                    roadGfx.lineTo(cx + laneW * 0.5, curr.y);
                    roadGfx.lineTo(cx - laneW * 0.5, curr.y);
                    roadGfx.endFill();
                }
            }

            // Fog overlay (semi-transparent sky color blended over far segments)
            if (prev.fog > 0.05) {
                const fogAlpha = prev.fog * prev.fog; // quadratic for softer near, stronger far
                const skyColor = (Math.round(STATE.skyR) << 16)
                               | (Math.round(STATE.skyG) << 8)
                               | Math.round(STATE.skyB);
                roadGfx.beginFill(skyColor, fogAlpha);
                roadGfx.moveTo(0, prev.y);
                roadGfx.lineTo(sw, prev.y);
                roadGfx.lineTo(sw, curr.y);
                roadGfx.lineTo(0, curr.y);
                roadGfx.endFill();
            }
        }
    },

    applyEffects() {
        // Camera shake
        camera.x = (Math.random() - 0.5) * STATE.shake;
        camera.y = (Math.random() - 0.5) * STATE.shake;

        // Background parallax: shift sun and bg opposite to curve
        if (sunSprite) {
            const parallaxShift = -STATE.curveDelta * STATE.speed * 0.3;
            // Sun position & tint: sets by entropy ~65
            const t = Math.min(1, STATE.entropy / 65);
            const baseX = app.screen.width * 0.7;
            const endX = app.screen.width * 0.85;
            const startY = app.screen.height * 0.15;
            const endY = centerY + 40;
            sunSprite.x = (baseX + (endX - baseX) * t) + parallaxShift;
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

    _onResize() {
        _syncWrapper();

        const w = gameWidth();
        const h = gameHeight();
        app.renderer.resize(w, h);
        centerX = app.screen.width / 2;
        centerY = app.screen.height / 2;

        if (typeof Effects !== 'undefined') {
            Effects.onResize(app);
        }
    },

    getApp() { return app; },
    getCamera() { return camera; },
    getFlash() { return flash; },
    getCenter() { return { x: centerX, y: centerY }; },
    getRoadGfx() { return roadGfx; }
};

// --- Viewport helpers (unchanged) ---

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
function gameWidth() {
    return _isPortrait() ? vpHeight() : vpWidth();
}
function gameHeight() {
    return _isPortrait() ? vpWidth() : vpHeight();
}
function _syncWrapper() {
    const wrapper = document.getElementById('game-wrapper');
    if (!wrapper) return;

    const vw = vpWidth();
    const vh = vpHeight();

    if (_isPortrait()) {
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
