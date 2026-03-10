// Visual polish: speed lines, vignette overlay, color grading filter, motion blur.
// Per-act color grading from babel-express-palette-v2.

let speedLineGfx;
let vignetteSprite;
let colorMatrix;
let infectionGfx;  // persistent infection pixels after Shadow Legion

const Effects = {
    init(app, camera) {
        this._createSpeedLines(app);
        this._createVignette(app);
        this._createColorGrading(app);
        this._createInfectionLayer(app);
    },

    _createVignette(app) {
        try {
            const w = app.screen.width;
            const h = app.screen.height;
            const size = Math.max(w, h);
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const c = canvas.getContext('2d');

            const gradient = c.createRadialGradient(
                w / 2, h / 2, size * 0.2,
                w / 2, h / 2, size * 0.55
            );
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,1)');
            c.fillStyle = gradient;
            c.fillRect(0, 0, w, h);

            const tex = PIXI.Texture.from(canvas);
            vignetteSprite = new PIXI.Sprite(tex);
            vignetteSprite.x = 0;
            vignetteSprite.y = 0;
            vignetteSprite.alpha = 0.3;
            const flashIndex = app.stage.children.length - 1;
            app.stage.addChildAt(vignetteSprite, flashIndex);
        } catch (e) {
            console.warn('Vignette init failed:', e);
        }
    },

    _createSpeedLines(app) {
        speedLineGfx = new PIXI.Graphics();
        const flashIndex = app.stage.children.length - 1;
        app.stage.addChildAt(speedLineGfx, flashIndex);
    },

    _createColorGrading(app) {
        try {
            if (typeof PIXI.ColorMatrixFilter === 'function') {
                colorMatrix = new PIXI.ColorMatrixFilter();
                const camera = Renderer.getCamera();
                camera.filters = [colorMatrix];
            }
        } catch (e) {
            console.warn('ColorMatrixFilter not available:', e);
            colorMatrix = null;
        }
    },

    _createInfectionLayer(app) {
        infectionGfx = new PIXI.Graphics();
        infectionGfx.blendMode = PIXI.BLEND_MODES.ADD;
        const flashIndex = app.stage.children.length - 1;
        app.stage.addChildAt(infectionGfx, Math.max(0, flashIndex - 1));
    },

    update(app) {
        // ── Speed lines (radial from center) ──
        if (speedLineGfx) {
            speedLineGfx.clear();
            if (STATE.speed > 20) {
                const cx = app.screen.width / 2;
                const cy = app.screen.height / 2;
                const intensity = Math.min(1, (STATE.speed - 20) / 80);
                const numLines = Math.floor(intensity * 16) + 4;
                const len = 60 + intensity * 140;

                // Line color matches act palette
                const lineColor = STATE.act === 'act1' ? 0xc4a060
                    : STATE.act === 'act2' ? 0xc41e1e
                    : STATE.act === 'act3' ? 0x00c0d8
                    : STATE.act === 'act4' ? 0xd8d0c0
                    : 0xFFFFFF;

                speedLineGfx.lineStyle(1, lineColor, intensity * 0.35);
                for (let i = 0; i < numLines; i++) {
                    const angle = (Math.PI * 2 * i / numLines) + (STATE.entropy * 0.01);
                    const r1 = 120 + Math.random() * 60;
                    const r2 = r1 + len + Math.random() * 40;
                    speedLineGfx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
                    speedLineGfx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
                }
            }
        }

        // ── Vignette intensity per act ──
        if (vignetteSprite) {
            const act = STATE.act;
            const vigAlpha = act === 'act1' ? 0.2
                           : act === 'act2' ? 0.35
                           : act === 'act3' ? 0.6
                           : act === 'act4' ? 0.15
                           : 0.7;
            vignetteSprite.alpha += (vigAlpha - vignetteSprite.alpha) * 0.05;
        }

        // ── Color grading per act ──
        if (colorMatrix) {
            try {
                colorMatrix.reset();
                const act = STATE.act;
                if (act === 'act1') {
                    // Slight warm tint, normal saturation
                    colorMatrix.saturate(1.1, false);
                } else if (act === 'act2') {
                    // Warm/red push, high contrast
                    colorMatrix.saturate(1.3, false);
                    colorMatrix.contrast(0.1, true);
                } else if (act === 'act3') {
                    // Desaturated, high contrast — Radical City vibe
                    colorMatrix.saturate(0.4, false);
                    colorMatrix.contrast(0.2, true);
                } else if (act === 'act4') {
                    // Overexposed, washed out — desaturated, low contrast
                    colorMatrix.saturate(0.2, false);
                    colorMatrix.brightness(1.2, true);
                } else if (act === 'act5') {
                    // Extreme
                    colorMatrix.saturate(0.1, false);
                    colorMatrix.contrast(0.3, true);
                }
            } catch (e) {
                colorMatrix = null;
            }
        }

        // ── Persistent infection pixels (from Shadow Legion aftermath) ──
        if (infectionGfx) {
            infectionGfx.clear();
            if (STATE.infectionLevel > 0) {
                const sw = app.screen.width;
                const sh = app.screen.height;
                const count = Math.floor(STATE.infectionLevel * 50);
                for (let i = 0; i < count; i++) {
                    // Deterministic positions based on index
                    const x = ((i * 127 + 53) % sw);
                    const y = ((i * 211 + 97) % sh);
                    const flicker = Math.sin(Date.now() * 0.01 + i * 0.7) > 0.3 ? 1 : 0;
                    if (flicker) {
                        infectionGfx.beginFill(0x39ff14, 0.3);
                        infectionGfx.drawRect(x, y, 2, 2);
                        infectionGfx.endFill();
                    }
                }
            }
        }
    },

    onResize(app) {
        if (vignetteSprite) {
            const idx = app.stage.getChildIndex(vignetteSprite);
            app.stage.removeChild(vignetteSprite);
            vignetteSprite.destroy();
            vignetteSprite = null;
            this._createVignette(app);
        }
    }
};
