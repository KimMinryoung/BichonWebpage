// Pseudo-3D road system (OutRun / Slipstream style).
// Manages track geometry (segments with curves + hills) and 3D→2D projection.

let segments = [];
let trackLength = 0;

const Road = {
    init() {
        this._buildTrack();
    },

    _buildTrack() {
        const total = CONFIG.road.totalSegments;
        const segLen = CONFIG.road.segmentLength;
        segments = [];

        for (let i = 0; i < total; i++) {
            segments.push({
                index: i,
                curve: 0,
                y: 0,         // elevation
                screen: { x: 0, y: 0, w: 0, scale: 0 },
                entitySlots: []
            });
        }

        trackLength = total * segLen;

        // --- Define track layout: curves and hills ---
        // Seoul route: winding through the city

        this._addCurve(30, 60, 0.5);
        this._addHill(50, 40, 30);

        this._addCurve(100, 80, -1.0);
        this._addHill(120, 60, -25);

        this._addCurve(200, 100, 1.2);
        this._addHill(220, 80, 50);

        this._addCurve(320, 60, -0.7);
        this._addHill(340, 50, -35);

        this._addCurve(400, 90, -1.5);
        this._addHill(420, 70, 25);

        this._addCurve(520, 70, 0.9);
        this._addHill(550, 100, 60);

        this._addCurve(660, 80, -0.6);
        this._addHill(680, 80, -45);

        this._addCurve(780, 100, 1.4);
        this._addHill(800, 60, 35);

        this._addCurve(900, 60, -1.8);
        this._addHill(920, 40, -20);

        this._addCurve(1000, 80, 0.6);
        this._addHill(1050, 80, 40);

        this._addCurve(1150, 70, -1.1);
        this._addHill(1180, 60, -30);

        this._addCurve(1280, 100, 1.3);
        this._addHill(1300, 80, 55);

        this._addCurve(1420, 60, -0.8);
        this._addHill(1450, 80, -40);
    },

    _addCurve(startIdx, length, intensity) {
        for (let i = startIdx; i < startIdx + length && i < segments.length; i++) {
            const t = (i - startIdx) / length;
            segments[i].curve += intensity * Math.sin(t * Math.PI);
        }
    },

    _addHill(startIdx, length, height) {
        for (let i = startIdx; i < startIdx + length && i < segments.length; i++) {
            const t = (i - startIdx) / length;
            segments[i].y += height * Math.sin(t * Math.PI);
        }
    },

    // Project all visible segments from camera position.
    // Returns projected segment data for renderer and entity system.
    project(screenW, screenH) {
        const segLen = CONFIG.road.segmentLength;
        const total = segments.length;
        const cameraDepth = CONFIG.road.cameraDepth;
        const cameraH = CONFIG.road.cameraHeight;

        const baseIdx = Math.floor(STATE.roadPosition / segLen);
        const visible = CONFIG.road.visibleSegments;

        // Cumulative X offset from road curves (in world units)
        let dx = 0;
        // Hill clipping: track the highest screen Y seen so far (lowest on screen = closest to horizon)
        let clipY = screenH;

        const projected = [];

        for (let n = 0; n < visible; n++) {
            const idx = (baseIdx + n) % total;
            const seg = segments[idx];

            // World Z distance from camera (must be positive)
            const worldZ = (n * segLen) - (STATE.roadPosition % segLen);
            if (worldZ < 10) continue;  // avoid division by near-zero

            // Accumulate curve offset in world units
            dx += seg.curve * segLen;

            // Perspective scale: dimensionless ratio
            const scale = cameraDepth / worldZ;

            // Project to screen coordinates
            // X: center + lateral offset (playerX drift - curve offset)
            const projX = (screenW / 2) + scale * (STATE.playerX - dx) * screenW / 2;
            // Y: road is BELOW camera, so it appears in the bottom half of screen
            // (cameraH - seg.y) > 0 means road is below camera → projY > screenH/2
            const projY = (screenH / 2) + scale * (cameraH - seg.y) * screenH / 2;
            // W: road half-width in pixels
            const projW = scale * CONFIG.road.roadWidth * screenW / 2;

            seg.screen.x = projX;
            seg.screen.y = projY;
            seg.screen.w = projW;
            seg.screen.scale = scale;

            // Fog: fade out distant segments
            const fogT = Math.min(1, n / (visible * 0.7));

            // Hill clipping: going near→far, projY decreases (approaches horizon).
            // If projY increases (segment dips below a closer hill crest), clip it.
            let clip = false;
            if (projY < clipY) {
                clipY = projY;  // new highest point (closest to horizon)
            } else {
                clip = true;    // hidden behind closer hill
            }

            projected.push({
                index: idx,
                segIndex: n,
                x: projX,
                y: projY,
                w: projW,
                scale: scale,
                curve: seg.curve,
                elevation: seg.y,
                fog: fogT,
                clip: clip
            });
        }

        return projected;
    },

    // Advance camera along track, apply centrifugal force
    update(dt) {
        STATE.roadPosition += STATE.speed * dt * 60;
        if (STATE.roadPosition >= trackLength) {
            STATE.roadPosition -= trackLength;
        }

        // Determine current curve intensity for centrifugal + parallax
        const segLen = CONFIG.road.segmentLength;
        const idx = Math.floor(STATE.roadPosition / segLen) % segments.length;
        const seg = segments[idx];
        STATE.curveDelta = seg.curve;

        // Centrifugal drift: curve pushes camera sideways
        STATE.playerX += seg.curve * CONFIG.road.centrifugal * STATE.speed * dt;
        // Spring back toward center
        STATE.playerX *= 0.97;
    },

    getSegment(idx) {
        return segments[((idx % segments.length) + segments.length) % segments.length];
    },

    getSegments() { return segments; },
    getTrackLength() { return trackLength; },
    getSegmentCount() { return segments.length; }
};
