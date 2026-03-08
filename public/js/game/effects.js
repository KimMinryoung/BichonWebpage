// Visual polish: speed lines, vignette overlay, color grading filter.

let speedLineGfx;
let vignetteSprite;
let colorMatrix;

const Effects = {
    init(app, camera) {
        this._createSpeedLines(app);
        this._createVignette(app);
        this._createColorGrading(app);
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
            // Insert below the flash (flash is last child of stage)
            const flashIndex = app.stage.children.length - 1;
            app.stage.addChildAt(vignetteSprite, flashIndex);
        } catch (e) {
            console.warn('Vignette init failed:', e);
        }
    },

    _createSpeedLines(app) {
        speedLineGfx = new PIXI.Graphics();
        // Insert below flash
        const flashIndex = app.stage.children.length - 1;
        app.stage.addChildAt(speedLineGfx, flashIndex);
    },

    _createColorGrading(app) {
        try {
            if (typeof PIXI.ColorMatrixFilter === 'function') {
                colorMatrix = new PIXI.ColorMatrixFilter();
                // Apply to camera only, not entire stage (avoids breaking flash/UI)
                const camera = Renderer.getCamera();
                camera.filters = [colorMatrix];
            }
        } catch (e) {
            console.warn('ColorMatrixFilter not available:', e);
            colorMatrix = null;
        }
    },

    update(app) {
        // ── Speed lines ──
        if (speedLineGfx) {
            speedLineGfx.clear();
            if (STATE.speed > 20) {
                const cx = app.screen.width / 2;
                const cy = app.screen.height / 2;
                const intensity = Math.min(1, (STATE.speed - 20) / 80);
                const numLines = Math.floor(intensity * 16) + 4;
                const len = 60 + intensity * 140;

                speedLineGfx.lineStyle(1, 0xFFFFFF, intensity * 0.35);
                for (let i = 0; i < numLines; i++) {
                    const angle = (Math.PI * 2 * i / numLines) + (STATE.entropy * 0.01);
                    const r1 = 120 + Math.random() * 60;
                    const r2 = r1 + len + Math.random() * 40;
                    speedLineGfx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
                    speedLineGfx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
                }
            }
        }

        // ── Vignette intensity ──
        if (vignetteSprite) {
            const phase = STATE.phase;
            const vigAlpha = phase === 'peace' ? 0.2
                           : phase === 'tension' ? 0.35
                           : phase === 'crisis' ? 0.55
                           : phase === 'catastrophe' ? 0.75
                           : 0.15;
            vignetteSprite.alpha += (vigAlpha - vignetteSprite.alpha) * 0.05;
        }

        // ── Color grading ──
        if (colorMatrix) {
            try {
                colorMatrix.reset();
                const phase = STATE.phase;
                if (phase === 'tension') {
                    colorMatrix.saturate(1.2, false);
                } else if (phase === 'crisis') {
                    colorMatrix.saturate(0.5, false);
                    colorMatrix.contrast(0.15, true);
                } else if (phase === 'catastrophe') {
                    colorMatrix.saturate(0.1, false);
                    colorMatrix.contrast(0.3, true);
                } else if (phase === 'hope') {
                    colorMatrix.saturate(1.3, false);
                }
            } catch (e) {
                // Disable color grading if it errors
                colorMatrix = null;
            }
        }
    },

    onResize(app) {
        // Recreate vignette at new size
        if (vignetteSprite) {
            const idx = app.stage.getChildIndex(vignetteSprite);
            app.stage.removeChild(vignetteSprite);
            vignetteSprite.destroy();
            vignetteSprite = null;
            this._createVignette(app);
        }
    }
};
