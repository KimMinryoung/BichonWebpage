// Touch/swipe interaction for drone observation gameplay.
// TAP: touch entities on screen to "illuminate" them with scan beam.
// SWIPE: swipe left/right to change direction at narrative forks.
// The drone is an observer — its action is always "shining light."

let _canvas = null;
let _app = null;
let _active = false;
let _mode = null;          // 'tap', 'swipe', 'infection'
let _touchStart = null;    // {x, y, time}
let _tapCallback = null;   // (entity) => void
let _swipeCallback = null; // (direction) => void
let _tapTargets = [];      // entities that can be tapped
let _scanBeams = [];       // active scan beam effects [{entity, startTime, duration}]
let _scanBeamGfx = null;
let _tapCount = 0;
let _totalTappable = 0;
let _swipeIndicators = []; // visual fork indicators on event layer

const SWIPE_THRESHOLD = 50;       // min px for swipe detection
const HIT_RADIUS_MULT = 2.0;      // generous hit radius (design: 1.5-2x)
const SCAN_BEAM_DURATION = 1500;   // ms
const MIN_HIT_RADIUS = 50;        // minimum px hit radius

const Touch = {
    init() {
        _app = Renderer.getApp();
        _canvas = _app.view;

        // Scan beam Graphics lives inside camera (same coord space as entities)
        _scanBeamGfx = new PIXI.Graphics();
        _scanBeamGfx.zIndex = -4997; // above AI beam, below entities
        _scanBeamGfx.blendMode = PIXI.BLEND_MODES.ADD;
        Renderer.getCamera().addChild(_scanBeamGfx);

        // Pointer events on the canvas
        _canvas.addEventListener('pointerdown', (e) => this._onDown(e), { passive: false });
        _canvas.addEventListener('pointerup', (e) => this._onUp(e), { passive: false });
        _canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    },

    // Activate touch input for an event
    // mode: 'tap' | 'swipe' | 'infection'
    // opts: { targets, onTap, onSwipe }
    activate(mode, opts) {
        _active = true;
        _mode = mode;
        _tapTargets = (opts.targets || []).slice(); // copy
        _tapCallback = opts.onTap || null;
        _swipeCallback = opts.onSwipe || null;
        _tapCount = 0;
        _totalTappable = _tapTargets.length;
    },

    deactivate() {
        _active = false;
        _mode = null;
        _tapTargets = [];
        _tapCallback = null;
        _swipeCallback = null;
    },

    // ── Coordinate conversion ──
    // Converts pointer event to game-space coordinates,
    // accounting for portrait-mode CSS rotation.
    _getGameCoords(e) {
        const rect = _canvas.getBoundingClientRect();

        if (typeof _isPortrait === 'function' && _isPortrait()) {
            // Wrapper rotated 90deg CW: viewport Y→game X, viewport X→game Y (inverted)
            const vx = e.clientX - rect.left;
            const vy = e.clientY - rect.top;
            return {
                x: (vy / rect.height) * _app.screen.width,
                y: (1 - vx / rect.width) * _app.screen.height
            };
        }

        return {
            x: (e.clientX - rect.left) / rect.width * _app.screen.width,
            y: (e.clientY - rect.top) / rect.height * _app.screen.height
        };
    },

    // ── Pointer handlers ──

    _onDown(e) {
        if (!_active) return;
        const coords = this._getGameCoords(e);
        _touchStart = { x: coords.x, y: coords.y, time: Date.now() };

        if (_mode === 'tap' || _mode === 'infection') {
            const hit = this._hitTest(coords.x, coords.y);
            if (hit) {
                this._triggerScanBeam(hit);
                if (_tapCallback) _tapCallback(hit);
                // Remove from targets so it can't be tapped twice
                const idx = _tapTargets.indexOf(hit);
                if (idx >= 0) _tapTargets.splice(idx, 1);
                _tapCount++;
            }
        }
    },

    _onUp(e) {
        if (!_active || !_touchStart) return;

        if (_mode === 'swipe') {
            const coords = this._getGameCoords(e);
            const dx = coords.x - _touchStart.x;
            const dy = coords.y - _touchStart.y;

            let dir = 'center';
            if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
                dir = dx > 0 ? 'right' : 'left';
            } else if (dy > SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
                dir = 'down';
            }

            if (_swipeCallback) _swipeCallback(dir);
        }

        _touchStart = null;
    },

    // ── Hit testing ──
    // Converts screen coords to camera-local space and tests against entity positions.
    // Uses generous hit radii — this is about intent, not precision.
    _hitTest(gameX, gameY) {
        const camera = Renderer.getCamera();
        // Transform screen coords to camera-local space (accounts for shake/roll)
        const localPoint = camera.worldTransform.applyInverse(
            new PIXI.Point(gameX, gameY)
        );

        let closest = null;
        let closestDist = Infinity;

        for (let i = 0; i < _tapTargets.length; i++) {
            const entity = _tapTargets[i];
            if (!entity.sprite.visible) continue;

            const dx = localPoint.x - entity.sprite.x;
            const dy = localPoint.y - entity.sprite.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Sprite size in screen pixels
            const tex = entity.sprite.texture;
            const sw = (tex ? tex.width : 50) * Math.abs(entity.sprite.scale.x);
            const sh = (tex ? tex.height : 50) * Math.abs(entity.sprite.scale.y);
            const size = Math.max(sw, sh);
            const hitRadius = Math.max(MIN_HIT_RADIUS, size * HIT_RADIUS_MULT);

            if (dist < hitRadius && dist < closestDist) {
                closest = entity;
                closestDist = dist;
            }
        }

        return closest;
    },

    // ── Scan beam ──

    _triggerScanBeam(entity) {
        _scanBeams.push({
            entity: entity,
            startTime: Date.now(),
            duration: SCAN_BEAM_DURATION
        });
        Sound.playResolve();
    },

    // Called each frame
    update(dt) {
        const now = Date.now();
        _scanBeams = _scanBeams.filter(b => now - b.startTime < b.duration);
    },

    // Draw scan beam effects (called after entities update, in camera-local space)
    drawScanBeams() {
        if (!_scanBeamGfx) return;
        _scanBeamGfx.clear();
        if (_scanBeams.length === 0) return;

        const now = Date.now();
        const sw = _app.screen.width;

        for (let i = 0; i < _scanBeams.length; i++) {
            const beam = _scanBeams[i];
            const elapsed = now - beam.startTime;
            const t = elapsed / beam.duration; // 0→1
            if (t >= 1) continue;

            const entity = beam.entity;
            if (!entity.sprite.visible) continue;

            // Target position (camera-local)
            const tx = entity.sprite.x;
            const ty = entity.sprite.y;
            // Source: top-center of screen (drone position) in camera-local
            const sx = sw / 2;
            const sy = -80;

            // Beam narrows from source to target
            const widthTop = 25 * (1 - t * 0.3);
            const widthBot = 6 + 4 * (1 - t);

            // Fade out over time
            const alpha = (1 - t * t) * 0.55;
            const color = STATE.aiBeamColor;

            // Outer glow cone
            _scanBeamGfx.beginFill(color, alpha * 0.3);
            _scanBeamGfx.moveTo(sx - widthTop, sy);
            _scanBeamGfx.lineTo(sx + widthTop, sy);
            _scanBeamGfx.lineTo(tx + widthBot * 3, ty);
            _scanBeamGfx.lineTo(tx - widthBot * 3, ty);
            _scanBeamGfx.endFill();

            // Core beam
            _scanBeamGfx.beginFill(color, alpha);
            _scanBeamGfx.moveTo(sx - widthTop * 0.3, sy);
            _scanBeamGfx.lineTo(sx + widthTop * 0.3, sy);
            _scanBeamGfx.lineTo(tx + widthBot, ty);
            _scanBeamGfx.lineTo(tx - widthBot, ty);
            _scanBeamGfx.endFill();

            // Target ring
            const ringRadius = 12 + 8 * t;
            const ringAlpha = alpha * 0.7;
            _scanBeamGfx.lineStyle(2, color, ringAlpha);
            _scanBeamGfx.drawCircle(tx, ty, ringRadius);
            _scanBeamGfx.lineStyle(0);
        }
    },

    // Add new targets dynamically (used by infection event as infection spreads)
    addTargets(newTargets) {
        if (!_active) return;
        for (let i = 0; i < newTargets.length; i++) {
            if (_tapTargets.indexOf(newTargets[i]) < 0) {
                _tapTargets.push(newTargets[i]);
                _totalTappable++;
            }
        }
    },

    // ── Accessors ──
    getTapCount() { return _tapCount; },
    getTotalTappable() { return _totalTappable; },
    isActive() { return _active; },
    getMode() { return _mode; },

    reset() {
        this.deactivate();
        _scanBeams = [];
        _touchStart = null;
        _tapCount = 0;
        _totalTappable = 0;
        if (_scanBeamGfx) _scanBeamGfx.clear();
    }
};
