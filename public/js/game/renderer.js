// PixiJS application setup, camera container, pseudo-3D road rendering, screen effects.
// Sky gradient, AI light beam, narrative text overlay, atmospheric perspective.

let app, camera, cameraGlow, flash, centerX, centerY;
let roadGfx = null;
let sunSprite = null;
let bgContainer = null;
let skyGfx = null;         // sky gradient graphics
let aiBeamGfx = null;      // AI light beam on road
let narrativeEl = null;    // DOM element for narrative text

const Renderer = {
    setup() {
        _syncWrapper();

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        app = new PIXI.Application({
            width: gameWidth(),
            height: gameHeight(),
            backgroundColor: 0x141430,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        document.getElementById('game-canvas-container').appendChild(app.view);

        camera = new PIXI.Container();
        camera.sortableChildren = true;
        app.stage.addChild(camera);

        cameraGlow = new PIXI.Container();
        cameraGlow.sortableChildren = true;
        app.stage.addChild(cameraGlow);

        centerX = app.screen.width / 2;
        centerY = app.screen.height / 2;

        this._createFlash();

        // Narrative text DOM element
        narrativeEl = document.getElementById('game-narrative');

        const resizeTarget = window.visualViewport || window;
        resizeTarget.addEventListener('resize', () => this._onResize());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this._onResize(), 200);
        });
    },

    initEnvironment() {
        this._initSkyGraphics();
        this._initRoadGraphics();
        this._initAIBeam();
        this._initBackground();
        this._drawSun();
    },

    _initSkyGraphics() {
        skyGfx = new PIXI.Graphics();
        skyGfx.zIndex = -12000;
        camera.addChild(skyGfx);
    },

    _initRoadGraphics() {
        roadGfx = new PIXI.Graphics();
        roadGfx.zIndex = -5000;
        camera.addChild(roadGfx);
    },

    _initAIBeam() {
        aiBeamGfx = new PIXI.Graphics();
        aiBeamGfx.zIndex = -4998;
        aiBeamGfx.blendMode = PIXI.BLEND_MODES.ADD;
        camera.addChild(aiBeamGfx);
    },

    _initBackground() {
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
            sunSprite.beginFill(0xe6c86e);
            sunSprite.drawRect(-25, -25, 50, 50);
            sunSprite.endFill();
        }
        sunSprite.x = sunX;
        sunSprite.y = sunY;
        sunSprite.zIndex = -11000;
        camera.addChild(sunSprite);
    },

    _createFlash() {
        flash = new PIXI.Graphics();
        flash.beginFill(0xFFFFFF);
        flash.drawRect(0, 0, app.screen.width, app.screen.height);
        flash.endFill();
        flash.alpha = 0;
        app.stage.addChild(flash);
    },

    // Draw 3-stop sky gradient
    _drawSky() {
        if (!skyGfx) return;
        const sw = app.screen.width;
        const sh = app.screen.height;

        skyGfx.clear();

        const topColor = (Math.round(STATE.skyTopR) << 16) | (Math.round(STATE.skyTopG) << 8) | Math.round(STATE.skyTopB);
        const midColor = (Math.round(STATE.skyMidR) << 16) | (Math.round(STATE.skyMidG) << 8) | Math.round(STATE.skyMidB);
        const botColor = (Math.round(STATE.skyBotR) << 16) | (Math.round(STATE.skyBotG) << 8) | Math.round(STATE.skyBotB);

        // Draw sky in bands (pixelated gradient — fits the aesthetic)
        const bands = 24;
        const bandH = Math.ceil(sh / bands);
        for (let i = 0; i < bands; i++) {
            const t = i / (bands - 1);
            let r, g, b;
            if (t < 0.5) {
                // Top to mid
                const p = t * 2;
                r = STATE.skyTopR + (STATE.skyMidR - STATE.skyTopR) * p;
                g = STATE.skyTopG + (STATE.skyMidG - STATE.skyTopG) * p;
                b = STATE.skyTopB + (STATE.skyMidB - STATE.skyTopB) * p;
            } else {
                // Mid to bottom
                const p = (t - 0.5) * 2;
                r = STATE.skyMidR + (STATE.skyBotR - STATE.skyMidR) * p;
                g = STATE.skyMidG + (STATE.skyBotG - STATE.skyMidG) * p;
                b = STATE.skyMidB + (STATE.skyBotB - STATE.skyMidB) * p;
            }
            const c = (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
            skyGfx.beginFill(c);
            skyGfx.drawRect(0, i * bandH, sw, bandH + 1);
            skyGfx.endFill();
        }

        // Background color for areas not covered
        app.renderer.background.color = topColor;
    },

    // Draw road each frame using projected segments
    drawRoad(projected) {
        if (!roadGfx || projected.length < 2) return;

        const sw = app.screen.width;
        const sh = app.screen.height;
        const rc = getRoadColors(STATE.act);
        const rumbleW = CONFIG.road.rumbleWidth;
        const shoulderW = CONFIG.road.shoulderWidth;
        const edgeColor = (Math.round(STATE.roadEdgeR) << 16)
                        | (Math.round(STATE.roadEdgeG) << 8)
                        | Math.round(STATE.roadEdgeB);

        roadGfx.clear();

        // Fill below horizon with grass
        if (projected.length > 0) {
            const horizon = projected[projected.length - 1];
            const horizonY = Math.max(0, horizon.y);
            roadGfx.beginFill(rc.grass[0]);
            roadGfx.drawRect(0, horizonY, sw, sh - horizonY);
            roadGfx.endFill();
        }

        // Fog/atmospheric color
        const fogColor = (Math.round(STATE.fogR) << 16)
                       | (Math.round(STATE.fogG) << 8)
                       | Math.round(STATE.fogB);

        // Draw segments from far to near (painter's algorithm)
        for (let n = projected.length - 2; n >= 0; n--) {
            const curr = projected[n];
            const prev = projected[n + 1];

            if (curr.clip && prev.clip) continue;
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

            // Rumble strips — single accent color on even, road-dark on odd
            const rumbleColor = isEven ? edgeColor : rc.road[1];
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

            // Track cracks (entropy-driven distortion on road surface)
            if (STATE.trackCrackLevel > 0 && isEven && curr.scale > 0.005) {
                const crackAlpha = Math.min(0.6, STATE.trackCrackLevel * 0.6);
                const crackW = currW * 0.02 * (1 + STATE.trackCrackLevel * 2);
                roadGfx.beginFill(0x111111, crackAlpha);
                // Random-ish crack line on the road
                const seed = curr.index * 7 % 13;
                const offX = (seed / 13 - 0.5) * currW * 0.8;
                roadGfx.drawRect(curr.x + offX, curr.y, crackW, Math.abs(curr.y - prev.y) + 1);
                roadGfx.endFill();
            }

            // Lane markings (dashed)
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

            // Atmospheric fog overlay
            if (prev.fog > 0.05) {
                const fogAlpha = prev.fog * prev.fog;
                roadGfx.beginFill(fogColor, fogAlpha);
                roadGfx.moveTo(0, prev.y);
                roadGfx.lineTo(sw, prev.y);
                roadGfx.lineTo(sw, curr.y);
                roadGfx.lineTo(0, curr.y);
                roadGfx.endFill();
            }
        }
    },

    // Draw AI light beam ahead on the road
    drawAIBeam(projected) {
        if (!aiBeamGfx || projected.length < 10) return;
        aiBeamGfx.clear();

        if (STATE.aiBeamAlpha < 0.01) return;

        const beamColor = STATE.aiBeamColor;
        const beamWidth = STATE.aiBeamWidth;

        // Draw beam as a series of bright segments on the road center, fading into distance
        const startSeg = 5;
        const endSeg = Math.min(80, projected.length - 2);

        for (let n = startSeg; n < endSeg; n++) {
            const curr = projected[n];
            const prev = projected[n + 1];
            if (!curr || !prev || curr.clip || prev.clip) continue;

            const distT = (n - startSeg) / (endSeg - startSeg);
            // Beam narrows toward distance, widens near camera
            const w = curr.w * 0.08 * beamWidth * (1 - distT * 0.7);
            // Alpha: brightest in middle distance, fades near and far
            const nearFade = Math.min(1, (n - startSeg) / 10);
            const farFade = 1 - distT;
            const alpha = STATE.aiBeamAlpha * nearFade * farFade * 0.5;

            if (alpha < 0.01) continue;

            // Core beam (thin bright line)
            aiBeamGfx.beginFill(beamColor, alpha);
            aiBeamGfx.moveTo(prev.x - w * 0.3, prev.y);
            aiBeamGfx.lineTo(prev.x + w * 0.3, prev.y);
            aiBeamGfx.lineTo(curr.x + w * 0.3, curr.y);
            aiBeamGfx.lineTo(curr.x - w * 0.3, curr.y);
            aiBeamGfx.endFill();

            // Glow halo (wider, dimmer)
            aiBeamGfx.beginFill(beamColor, alpha * 0.25);
            aiBeamGfx.moveTo(prev.x - w, prev.y);
            aiBeamGfx.lineTo(prev.x + w, prev.y);
            aiBeamGfx.lineTo(curr.x + w, curr.y);
            aiBeamGfx.lineTo(curr.x - w, curr.y);
            aiBeamGfx.endFill();
        }

        // Pulsing time-based modulation
        const pulse = 0.8 + 0.2 * Math.sin(Date.now() * 0.003);
        aiBeamGfx.alpha = pulse;
    },

    // Update narrative text overlay
    updateNarrative() {
        if (!narrativeEl) return;
        if (STATE.narrativeAlpha > 0.01 && STATE.narrativeText) {
            narrativeEl.textContent = STATE.narrativeText;
            narrativeEl.style.opacity = Math.min(1, STATE.narrativeAlpha);
            narrativeEl.style.display = 'block';
        } else {
            narrativeEl.style.display = 'none';
        }
    },

    applyEffects() {
        // Camera shake
        const shakeX = (Math.random() - 0.5) * STATE.shake;
        const shakeY = (Math.random() - 0.5) * STATE.shake;
        camera.x = shakeX;
        camera.y = shakeY;
        cameraGlow.x = shakeX;
        cameraGlow.y = shakeY;

        // Sun position & tint based on act progression
        if (sunSprite) {
            const parallaxShift = -STATE.curveDelta * STATE.speed * 0.3;
            const hillParallax = STATE.cameraPitch * 0.6;

            // Sun visible in Act 1 and early Act 2, then fades
            const t = Math.min(1, STATE.entropy / 50);
            const baseX = app.screen.width * 0.7;
            const endX = app.screen.width * 0.85;
            const startY = app.screen.height * 0.15;
            const endY = centerY + 40;

            sunSprite.x = (baseX + (endX - baseX) * t) + parallaxShift;
            sunSprite.y = startY + (endY - startY) * t + hillParallax;

            if (STATE.act === 'act1') {
                sunSprite.tint = 0xc4a060;
                sunSprite.alpha = 1;
            } else if (STATE.act === 'act2') {
                const p = (STATE.entropy - 20) / 27;
                const r = 0xe0;
                const g = Math.round(0x70 - p * 0x50);
                const b = Math.round(0x20 - p * 0x18);
                sunSprite.tint = (r << 16) | (g << 8) | b;
                sunSprite.alpha = Math.max(0, 1 - p * 1.2);
            } else if (STATE.act === 'act4') {
                // Overexposed white sun
                sunSprite.tint = 0xf0ebe0;
                sunSprite.alpha = 0.6;
                sunSprite.y = app.screen.height * 0.3 + hillParallax;
            } else {
                sunSprite.alpha = 0;
            }
        }

        // Draw sky gradient
        this._drawSky();

        // Update narrative text
        this.updateNarrative();
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
    getCameraGlow() { return cameraGlow; },
    getFlash() { return flash; },
    getCenter() { return { x: centerX, y: centerY }; },
    getRoadGfx() { return roadGfx; }
};

// --- Viewport helpers ---

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
