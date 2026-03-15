// Touch/swipe interaction for drone observation gameplay.
// TAP: touch entities on screen to "illuminate" them with scan beam.
// SWIPE: swipe left/right to change direction at narrative forks.
// The drone is an observer — its action is always "shining light."

let _canvas = null;
let _app = null;
let _active = false;
let _mode = null;          // 'tap', 'swipe', 'infection'
let _touchStart = null;    // {x, y, time}
let _touchCurrent = null;  // {x, y} — live drag position for swipe feedback
let _tapCallback = null;   // (entity) => void
let _swipeCallback = null; // (direction) => void
let _tapTargets = [];      // entities that can be tapped
let _scanBeams = [];       // active scan beam effects [{entity, startTime, duration}]
let _scanBeamGfx = null;
let _tapCount = 0;
let _totalTappable = 0;
let _tapEntityTypes = null;  // if set, any visible entity of these types is tappable
let _tappedEntities = null;  // Set of entities already tapped (prevent double-tap)
let _swipeResolved = false;  // true after swipe callback fires (prevent re-trigger)

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

        // Input events — use both mouse and touch for full PC + mobile coverage.
        // Pointer events are preferred but some browsers/contexts drop them.
        _canvas.addEventListener('mousedown', (e) => this._onDown(e));
        _canvas.addEventListener('mousemove', (e) => this._onMove(e));
        _canvas.addEventListener('mouseup', (e) => this._onUp(e));
        _canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // prevent synthetic mouse event
            if (e.touches.length > 0) this._onDown(e.touches[0]);
        }, { passive: false });
        _canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) this._onMove(e.touches[0]);
        }, { passive: false });
        _canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (e.changedTouches.length > 0) this._onUp(e.changedTouches[0]);
        }, { passive: false });
        _canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    },

    // Activate touch input for an event
    // mode: 'tap' | 'swipe' | 'infection'
    // opts: { targets, targetTypes, onTap, onSwipe }
    //   targets: specific entity references (optional)
    //   targetTypes: array of entity type strings — any visible entity of these types is tappable
    activate(mode, opts) {
        _active = true;
        _mode = mode;
        _tapTargets = (opts.targets || []).slice();
        _tapEntityTypes = opts.targetTypes || null;
        _tappedEntities = new Set();
        _tapCallback = opts.onTap || null;
        _swipeCallback = opts.onSwipe || null;
        _tapCount = 0;
        _totalTappable = _tapTargets.length;
        _swipeResolved = false;
        _touchCurrent = null;
    },

    deactivate() {
        _active = false;
        _mode = null;
        _tapTargets = [];
        _tapEntityTypes = null;
        _tappedEntities = null;
        _tapCallback = null;
        _swipeCallback = null;
        _swipeResolved = false;
        _touchCurrent = null;
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
        _touchCurrent = { x: coords.x, y: coords.y };

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

    _onMove(e) {
        if (!_active || !_touchStart) return;
        const coords = this._getGameCoords(e);
        _touchCurrent = { x: coords.x, y: coords.y };
    },

    _onUp(e) {
        if (!_active || !_touchStart) return;

        if (_mode === 'swipe' && !_swipeResolved) {
            const coords = this._getGameCoords(e);
            const dx = coords.x - _touchStart.x;
            const dy = coords.y - _touchStart.y;

            let dir = 'center';
            if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
                dir = dx > 0 ? 'right' : 'left';
            } else if (dy > SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
                dir = 'down';
            }

            _swipeResolved = true;
            if (_swipeCallback) _swipeCallback(dir);
        }

        _touchStart = null;
        _touchCurrent = null;
    },

    // ── Hit testing ──
    // Converts screen coords to camera-local space and tests against entity positions.
    // Uses generous hit radii — this is about intent, not precision.
    // Checks: 1) specific _tapTargets, 2) any visible entity matching _tapEntityTypes.
    _hitTest(gameX, gameY) {
        const camera = Renderer.getCamera();
        const localPoint = camera.worldTransform.applyInverse(
            new PIXI.Point(gameX, gameY)
        );

        let closest = null;
        let closestDist = Infinity;

        // Build candidate list: specific targets + type-matched visible entities
        let candidates = _tapTargets;
        if (_tapEntityTypes) {
            const allEntities = Entities.getList();
            // Merge: all visible entities of target types (excluding already-tapped)
            candidates = [];
            for (let i = 0; i < allEntities.length; i++) {
                const e = allEntities[i];
                if (!e.sprite.visible) continue;
                if (_tapEntityTypes.indexOf(e.type) < 0) continue;
                if (_tappedEntities && _tappedEntities.has(e)) continue;
                candidates.push(e);
            }
        }

        for (let i = 0; i < candidates.length; i++) {
            const entity = candidates[i];
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

        // Track tapped entity to prevent double-tap
        if (closest && _tappedEntities) {
            _tappedEntities.add(closest);
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

    // Draw scan beam effects and swipe indicators
    drawScanBeams() {
        if (!_scanBeamGfx) return;
        _scanBeamGfx.clear();

        // Draw swipe direction indicators when in swipe mode
        if (_active && _mode === 'swipe' && !_swipeResolved) {
            this._drawSwipeIndicators();
        }

        if (_scanBeams.length === 0) return;

        const now = Date.now();
        const sw = _app.screen.width;
        const sh = _app.screen.height;

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
            // Source: drone position (beam cast from visible drone sprite)
            const dronePos = Renderer.getDronePosition();
            const sx = dronePos.x;
            const sy = dronePos.y;

            // Beam narrows from drone (bottom) to target (scene)
            const widthSrc = 20 * (1 - t * 0.3);
            const widthTgt = 6 + 4 * (1 - t);

            // Fade out over time
            const alpha = (1 - t * t) * 0.55;
            const color = STATE.aiBeamColor;

            // Outer glow cone
            _scanBeamGfx.beginFill(color, alpha * 0.3);
            _scanBeamGfx.moveTo(sx - widthSrc, sy);
            _scanBeamGfx.lineTo(sx + widthSrc, sy);
            _scanBeamGfx.lineTo(tx + widthTgt * 3, ty);
            _scanBeamGfx.lineTo(tx - widthTgt * 3, ty);
            _scanBeamGfx.endFill();

            // Core beam
            _scanBeamGfx.beginFill(color, alpha);
            _scanBeamGfx.moveTo(sx - widthSrc * 0.3, sy);
            _scanBeamGfx.lineTo(sx + widthSrc * 0.3, sy);
            _scanBeamGfx.lineTo(tx + widthTgt, ty);
            _scanBeamGfx.lineTo(tx - widthTgt, ty);
            _scanBeamGfx.endFill();

            // Target ring
            const ringRadius = 12 + 8 * t;
            const ringAlpha = alpha * 0.7;
            _scanBeamGfx.lineStyle(2, color, ringAlpha);
            _scanBeamGfx.drawCircle(tx, ty, ringRadius);
            _scanBeamGfx.lineStyle(0);
        }
    },

    // ── Swipe visual indicators ──
    _drawSwipeIndicators() {
        // Use a separate non-ADD container for solid arrows
        // Since _scanBeamGfx uses ADD blend, draw arrows with high alpha
        const sw = _app.screen.width;
        const sh = _app.screen.height;
        const cy = sh * 0.45;
        const color = STATE.aiBeamColor;
        const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.005);

        // Determine current drag direction
        let dragDir = 'none';
        let dragStrength = 0;
        if (_touchStart && _touchCurrent) {
            const dx = _touchCurrent.x - _touchStart.x;
            const dy = _touchCurrent.y - _touchStart.y;
            if (Math.abs(dx) > SWIPE_THRESHOLD * 0.3 && Math.abs(dx) > Math.abs(dy)) {
                dragDir = dx > 0 ? 'right' : 'left';
                dragStrength = Math.min(1, Math.abs(dx) / (SWIPE_THRESHOLD * 2));
            } else if (dy > SWIPE_THRESHOLD * 0.3 && Math.abs(dy) > Math.abs(dx)) {
                dragDir = 'down';
                dragStrength = Math.min(1, dy / (SWIPE_THRESHOLD * 2));
            }
        }

        // Arrow dimensions — chevron style (< >)
        const arrowW = 30;
        const arrowH = 80;
        const margin = sw * 0.06;
        const bobX = Math.sin(Date.now() * 0.003) * 6; // gentle horizontal bob

        // Left chevron <
        const leftActive = dragDir === 'left';
        const leftAlpha = leftActive ? 0.7 + dragStrength * 0.3 : pulse * 0.5;
        const leftX = margin + (leftActive ? -bobX * dragStrength * 3 : bobX);
        _scanBeamGfx.lineStyle(leftActive ? 5 : 3, color, leftAlpha);
        _scanBeamGfx.moveTo(leftX + arrowW, cy - arrowH / 2);
        _scanBeamGfx.lineTo(leftX, cy);
        _scanBeamGfx.lineTo(leftX + arrowW, cy + arrowH / 2);
        // Double chevron when dragging
        if (leftActive && dragStrength > 0.3) {
            _scanBeamGfx.moveTo(leftX + arrowW + 15, cy - arrowH / 2);
            _scanBeamGfx.lineTo(leftX + 15, cy);
            _scanBeamGfx.lineTo(leftX + arrowW + 15, cy + arrowH / 2);
        }
        _scanBeamGfx.lineStyle(0);

        // Right chevron >
        const rightActive = dragDir === 'right';
        const rightAlpha = rightActive ? 0.7 + dragStrength * 0.3 : pulse * 0.5;
        const rightX = sw - margin + (rightActive ? bobX * dragStrength * 3 : -bobX);
        _scanBeamGfx.lineStyle(rightActive ? 5 : 3, color, rightAlpha);
        _scanBeamGfx.moveTo(rightX - arrowW, cy - arrowH / 2);
        _scanBeamGfx.lineTo(rightX, cy);
        _scanBeamGfx.lineTo(rightX - arrowW, cy + arrowH / 2);
        if (rightActive && dragStrength > 0.3) {
            _scanBeamGfx.moveTo(rightX - arrowW - 15, cy - arrowH / 2);
            _scanBeamGfx.lineTo(rightX - 15, cy);
            _scanBeamGfx.lineTo(rightX - arrowW - 15, cy + arrowH / 2);
        }
        _scanBeamGfx.lineStyle(0);

        // Drag trail line
        if (_touchStart && _touchCurrent && dragDir !== 'none') {
            const trailAlpha = 0.4 + dragStrength * 0.5;
            _scanBeamGfx.lineStyle(3, color, trailAlpha);
            _scanBeamGfx.moveTo(_touchStart.x, _touchStart.y);
            _scanBeamGfx.lineTo(_touchCurrent.x, _touchCurrent.y);
            _scanBeamGfx.lineStyle(0);

            // Direction dot
            _scanBeamGfx.beginFill(color, trailAlpha);
            _scanBeamGfx.drawCircle(_touchCurrent.x, _touchCurrent.y, 6 + dragStrength * 8);
            _scanBeamGfx.endFill();
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
        _touchCurrent = null;
        _swipeResolved = false;
        _tapCount = 0;
        _totalTappable = 0;
        if (_scanBeamGfx) _scanBeamGfx.clear();
    }
};
