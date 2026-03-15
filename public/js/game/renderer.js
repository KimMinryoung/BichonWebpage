// PixiJS application setup, camera container, pseudo-3D road rendering, screen effects.
// Sky gradient, AI light beam, narrative text overlay, atmospheric perspective.

let app, camera, cameraGlow, flash, centerX, centerY;
let roadGfx = null;
let sunSprite = null;
let droneSprite = null;    // player drone sprite (visible at bottom-center)
let bgContainer = null;
let skyGfx = null;         // sky gradient graphics (inside camera — rotates with it)
let aiBeamGfx = null;      // AI light beam on road
let fireColumnGfx = null;  // fire columns on horizon (Act 2)
let narrativeEl = null;    // DOM element for narrative text
let _groundTopY = 0;       // Y where ground starts (updated by drawRoad, read by _drawSky)

// Overscan padding (pixels) — sky and road draw beyond screen bounds so that
// camera roll/shake/hover never exposes gaps at screen edges.
const OVERSCAN = 250;

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
        this._initFireColumns();
        this._initBackground();
        this._drawSun();
        this._initDrone();
    },

    _initSkyGraphics() {
        // Sky lives INSIDE camera so it rotates/translates together with road.
        // Oversized drawing prevents gaps at screen edges during roll.
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

    _initFireColumns() {
        fireColumnGfx = new PIXI.Graphics();
        fireColumnGfx.zIndex = -8200;
        fireColumnGfx.blendMode = PIXI.BLEND_MODES.ADD;
        cameraGlow.addChild(fireColumnGfx);
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
            sunSprite.scale.set(2.0);
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

    _initDrone() {
        const sw = app.screen.width;
        const sh = app.screen.height;
        const tex = Assets.get('drone');
        if (tex) {
            droneSprite = new PIXI.Sprite(tex);
            droneSprite.anchor.set(0.5, 0.5);
        } else {
            // Minimal fallback — small rectangle
            droneSprite = new PIXI.Graphics();
            droneSprite.beginFill(0x555566);
            droneSprite.drawRect(-8, -3, 16, 6);
            droneSprite.endFill();
        }
        // Position: horizontally centered, ~80% down screen
        // This matches the pseudo-3D perspective — drone is "near" the camera
        droneSprite.x = sw / 2;
        droneSprite.y = sh * 0.82;
        droneSprite.scale.set(5);
        droneSprite.zIndex = 9000; // always on top (HUD-like — drone is nearest to camera)
        droneSprite.alpha = 0.9;
        camera.addChild(droneSprite);
    },

    _createFlash() {
        flash = new PIXI.Graphics();
        flash.beginFill(0xFFFFFF);
        flash.drawRect(0, 0, app.screen.width, app.screen.height);
        flash.endFill();
        flash.alpha = 0;
        app.stage.addChild(flash);
    },

    // Draw 3-stop sky gradient — inside camera container with overscan.
    // Sky and road share the same coordinate space, so roll/shake/hover
    // never creates gaps between them.
    _drawSky(groundTop) {
        if (!skyGfx) return;
        const sw = app.screen.width;
        const sh = app.screen.height;
        const os = OVERSCAN;

        // Gradient spans from top of overscan to the ground horizon
        const gradientEnd = Math.max(groundTop || sh * 0.30, sh * 0.25);

        skyGfx.clear();

        // Sky gradient bands (with overscan X and top margin)
        const bands = 24;
        const gradientHeight = gradientEnd + os;  // from -os to gradientEnd
        const bandH = Math.ceil(gradientHeight / bands);
        for (let i = 0; i < bands; i++) {
            const t = i / (bands - 1);
            let r, g, b;
            if (t < 0.5) {
                const p = t * 2;
                r = STATE.skyTopR + (STATE.skyMidR - STATE.skyTopR) * p;
                g = STATE.skyTopG + (STATE.skyMidG - STATE.skyTopG) * p;
                b = STATE.skyTopB + (STATE.skyMidB - STATE.skyTopB) * p;
            } else {
                const p = (t - 0.5) * 2;
                r = STATE.skyMidR + (STATE.skyBotR - STATE.skyMidR) * p;
                g = STATE.skyMidG + (STATE.skyBotG - STATE.skyMidG) * p;
                b = STATE.skyMidB + (STATE.skyBotB - STATE.skyMidB) * p;
            }
            const c = (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
            skyGfx.beginFill(c);
            skyGfx.drawRect(-os, -os + i * bandH, sw + os * 2, bandH + 1);
            skyGfx.endFill();
        }

        // Fill below gradient to bottom of overscan with sky-bottom color.
        // Road strips (higher zIndex) will paint over this in the ground area.
        const botColor = (Math.round(STATE.skyBotR) << 16) | (Math.round(STATE.skyBotG) << 8) | Math.round(STATE.skyBotB);
        const gradientBottom = -os + bands * bandH;
        skyGfx.beginFill(botColor);
        skyGfx.drawRect(-os, gradientBottom, sw + os * 2, sh + os * 2 - gradientBottom);
        skyGfx.endFill();

        // Background color = ground for any extreme gap beyond overscan
        const rc = getRoadColors(STATE.act);
        app.renderer.background.color = rc.grass[0];
    },

    // Draw ground plane below flight path (After Burner style).
    // Oversized bounds so camera roll doesn't expose gaps.
    drawRoad(projected) {
        if (!roadGfx || projected.length < 2) return;

        const sw = app.screen.width;
        const sh = app.screen.height;
        const os = OVERSCAN;
        const rc = getRoadColors(STATE.act);

        roadGfx.clear();

        // Fill below horizon with base ground color (oversized)
        if (projected.length > 0) {
            const horizon = projected[projected.length - 1];
            const horizonY = Math.max(0, horizon.y);
            _groundTopY = horizonY;   // store for sky to extend down to
            roadGfx.beginFill(rc.grass[0]);
            roadGfx.drawRect(-os, horizonY, sw + os * 2, sh - horizonY + os);
            roadGfx.endFill();
        }

        // Fog/atmospheric color
        const fogColor = (Math.round(STATE.fogR) << 16)
                       | (Math.round(STATE.fogG) << 8)
                       | Math.round(STATE.fogB);

        // Draw ground strips from far to near (painter's algorithm).
        // Full-width horizontal bands with overscan — terrain seen from altitude.
        for (let n = projected.length - 2; n >= 0; n--) {
            const curr = projected[n];
            const prev = projected[n + 1];

            if (curr.clip && prev.clip) continue;
            if (prev.y > sh * 2 && curr.y > sh * 2) continue;

            const isEven = (curr.index % 2) === 0;

            // Ground terrain strips (alternating colors — checkerboard feel)
            const groundColor = isEven ? rc.grass[0] : rc.grass[1];
            roadGfx.beginFill(groundColor);
            roadGfx.moveTo(-os, prev.y);
            roadGfx.lineTo(sw + os, prev.y);
            roadGfx.lineTo(sw + os, curr.y);
            roadGfx.lineTo(-os, curr.y);
            roadGfx.endFill();

            // ── Sea wave shimmer (Act 2, sea biome) ──
            if (STATE.biome === 'sea' && curr.fog < 0.7 && n % 3 === 0) {
                const time = Date.now() * 0.003;
                const wavePhase = Math.sin(time + curr.index * 0.8);
                const sparkle = Math.sin(time * 2.3 + curr.index * 1.7);
                if (wavePhase > 0.1) {
                    const shimmerAlpha = wavePhase * 0.25 * (1 - curr.fog) * Math.max(0, sparkle * 0.5 + 0.5);
                    const stripH = curr.y - prev.y;
                    const shimmerY = prev.y + stripH * (0.3 + wavePhase * 0.4);
                    const shimmerW = curr.w * (0.3 + Math.abs(sparkle) * 0.5);
                    roadGfx.beginFill(0x3a6878, shimmerAlpha);
                    roadGfx.drawRect(curr.x - shimmerW, shimmerY, shimmerW * 2, Math.max(1, stripH * 0.15));
                    roadGfx.endFill();
                    // Secondary highlight (foam crest)
                    if (sparkle > 0.5 && curr.fog < 0.4) {
                        roadGfx.beginFill(0x5a8898, shimmerAlpha * 0.6);
                        roadGfx.drawRect(curr.x - shimmerW * 0.4, shimmerY - 1, shimmerW * 0.8, 1);
                        roadGfx.endFill();
                    }
                }
            }

            // ── Neon road reflections (Act 3, city biome) ──
            if (STATE.act === 'act3' && STATE.biome === 'city' && curr.fog < 0.6 && n % 3 === 0) {
                const neonColors = [0x00c0d8, 0xd800a0, 0x39ff14, 0xffa020];
                const hash = (curr.index * 127 + 53) % 97;
                const colorIdx = hash % neonColors.length;
                const time = Date.now() * 0.004;
                const flicker = Math.sin(time + curr.index * 2.3) * Math.sin(time * 1.7 + curr.index);
                const alpha = 0.18 * (1 - curr.fog) * (0.5 + flicker * 0.5);
                if (alpha > 0.02) {
                    const puddleOff = ((hash * 211) % 100 - 50) / 100;  // -0.5 to 0.5
                    const puddleW = curr.w * (0.08 + (hash % 20) * 0.01);
                    const puddleX = curr.x + curr.w * puddleOff * 0.4;
                    roadGfx.beginFill(neonColors[colorIdx], alpha);
                    roadGfx.drawRect(puddleX - puddleW, prev.y, puddleW * 2, curr.y - prev.y);
                    roadGfx.endFill();
                }
            }

            // Atmospheric fog overlay
            if (prev.fog > 0.05) {
                const fogAlpha = prev.fog * prev.fog;
                roadGfx.beginFill(fogColor, fogAlpha);
                roadGfx.moveTo(-os, prev.y);
                roadGfx.lineTo(sw + os, prev.y);
                roadGfx.lineTo(sw + os, curr.y);
                roadGfx.lineTo(-os, curr.y);
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

    // Draw fire columns on the horizon (Act 2 — the world burns)
    drawFireColumns(projected) {
        if (!fireColumnGfx) return;
        fireColumnGfx.clear();

        // Only visible in Act 2
        if (STATE.act !== 'act2' || !projected || projected.length < 10) return;

        const sw = app.screen.width;
        const sh = app.screen.height;
        const horizonY = projected[projected.length - 1].y;
        const horizonX = projected[projected.length - 1].x;
        const time = Date.now() * 0.001;

        // Fire column positions (normalized screen X offsets from center)
        const columns = [-0.55, -0.25, 0.1, 0.35, 0.65];

        for (let i = 0; i < columns.length; i++) {
            const baseX = horizonX + columns[i] * sw * 0.5;

            // Height oscillation
            const heightBase = 50 + (i % 3) * 25;
            const heightPulse = heightBase + Math.sin(time * 1.5 + i * 2.1) * 15;

            // Width varies
            const w = 8 + (i % 2) * 6;

            // Core fire (bright orange)
            const coreAlpha = 0.4 + Math.sin(time * 3.0 + i * 1.3) * 0.15;
            fireColumnGfx.beginFill(0xe07020, coreAlpha);
            fireColumnGfx.drawRect(baseX - w / 2, horizonY - heightPulse, w, heightPulse);
            fireColumnGfx.endFill();

            // Inner glow (yellow)
            const innerW = w * 0.5;
            fireColumnGfx.beginFill(0xffa020, coreAlpha * 0.7);
            fireColumnGfx.drawRect(baseX - innerW / 2, horizonY - heightPulse * 0.8, innerW, heightPulse * 0.8);
            fireColumnGfx.endFill();

            // Outer halo (dim red)
            const haloW = w * 2.5;
            fireColumnGfx.beginFill(0xc43020, coreAlpha * 0.15);
            fireColumnGfx.drawRect(baseX - haloW / 2, horizonY - heightPulse * 1.1, haloW, heightPulse * 1.1);
            fireColumnGfx.endFill();

            // Tip flicker (bright white-yellow)
            const tipFlicker = Math.sin(time * 8.0 + i * 5.0) > 0.3 ? 1 : 0;
            if (tipFlicker) {
                fireColumnGfx.beginFill(0xffdd44, coreAlpha * 0.5);
                fireColumnGfx.drawRect(baseX - 2, horizonY - heightPulse - 4, 4, 6);
                fireColumnGfx.endFill();
            }
        }
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
        // Camera shake: dual-frequency sin waves per axis (原理 5)
        // Different frequencies per axis create Lissajous-like organic motion
        const time = Date.now() * 0.001;
        const shakeX = STATE.shake * (Math.sin(time * 3.7) * 0.6 + Math.sin(time * 7.3) * 0.4);
        const shakeY = STATE.shake * (Math.sin(time * 2.3) * 0.6 + Math.sin(time * 5.9) * 0.4);
        // Hover bob: slow altitude oscillation (independent frequency)
        const hoverY = Math.sin(time * 2.0) * 15;

        // Camera roll (bank into curves + swipe banking)
        const roll = (STATE.cameraRoll || 0) + (STATE.swipeRoll || 0);
        const swipeShift = STATE.swipeX || 0;

        camera.rotation = roll;
        camera.pivot.set(centerX, centerY);
        camera.position.set(centerX + shakeX + swipeShift, centerY + shakeY + hoverY);

        cameraGlow.rotation = roll;
        cameraGlow.pivot.set(centerX, centerY);
        cameraGlow.position.set(centerX + shakeX + swipeShift, centerY + shakeY + hoverY);

        // Sun position & tint based on act progression
        if (sunSprite) {
            const parallaxShift = -STATE.curveDelta * STATE.speed * 0.3;

            // Sun visible in Act 1 and early Act 2, then fades
            const t = Math.min(1, STATE.entropy / 50);
            const baseX = app.screen.width * 0.7;
            const endX = app.screen.width * 0.85;
            const startY = app.screen.height * 0.15;
            const endY = centerY + 40;

            sunSprite.x = (baseX + (endX - baseX) * t) + parallaxShift;
            sunSprite.y = startY + (endY - startY) * t ;

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
                sunSprite.y = app.screen.height * 0.3 ;
            } else {
                sunSprite.alpha = 0;
            }
        }

        // Update drone sprite position (subtle hover bob)
        if (droneSprite) {
            const sw = app.screen.width;
            const sh = app.screen.height;
            droneSprite.x = sw / 2;
            droneSprite.y = sh * 0.82 + Math.sin(time * 3.1) * 3;
            // Slight tilt following swipe
            droneSprite.rotation = (STATE.swipeRoll || 0) * -0.5;
        }

        // Draw sky gradient (same coord space as road — no gap possible)
        this._drawSky(_groundTopY);

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
    getRoadGfx() { return roadGfx; },
    getDronePosition() {
        if (!droneSprite) return { x: app.screen.width / 2, y: app.screen.height * 0.82 };
        return { x: droneSprite.x, y: droneSprite.y };
    }
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
