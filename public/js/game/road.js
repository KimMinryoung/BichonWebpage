// Pseudo-3D track system (Slipstream style).
// Camera rides the front of a train — follows the track like a roller coaster.
// No lateral drift. Camera yaw follows track direction via look-ahead dx.
// Camera roll provides banking feel on curves.

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
                y: 0,
                screen: { x: 0, y: 0, w: 0, scale: 0 },
                entitySlots: []
            });
        }

        trackLength = total * segLen;

        // ── Track layout: curves only (no hills) ──

        // Act 1: Gentle introduction
        this._addCurve(30, 60, 0.5);
        this._addCurve(100, 80, -0.8);

        // Act 2: Acceleration
        this._addCurve(200, 120, 1.2);
        this._addCurve(340, 60, -0.8);
        this._addCurve(400, 70, 1.0);
        this._addCurve(450, 90, -1.5);

        // Act 3: Chaotic
        this._addCurve(540, 50, 1.4);
        this._addCurve(620, 50, -0.6);
        this._addCurve(690, 80, -0.8);
        this._addCurve(780, 100, 1.6);
        this._addCurve(920, 50, -1.8);

        // Act 4: Eerie
        this._addCurve(1020, 50, 0.6);
        this._addCurve(1080, 60, -0.8);
        this._addCurve(1150, 40, 0.5);
        this._addCurve(1250, 70, -0.7);

        // Act 5: Finale
        this._addCurve(1410, 100, 1.3);
        this._addCurve(1530, 60, -0.9);
    },

    _addCurve(startIdx, length, intensity) {
        for (let i = startIdx; i < startIdx + length && i < segments.length; i++) {
            const t = (i - startIdx) / length;
            segments[i].curve += intensity * Math.sin(t * Math.PI);
        }
    },

    // Project all visible segments from camera position.
    project(screenW, screenH) {
        const segLen = CONFIG.road.segmentLength;
        const total = segments.length;
        const cameraDepth = CONFIG.road.cameraDepth;
        const cameraH = CONFIG.road.cameraHeight;

        const baseIdx = Math.floor(STATE.roadPosition / segLen);
        const visible = CONFIG.road.visibleSegments;

        // ── Look-ahead yaw: accumulate curve dx for next N segments ──
        // This shifts the vanishing point so the road at look-ahead distance
        // stays centered, giving the effect of the camera rotating into curves.
        const yawLookDist = 40;
        let yawDx = 0;
        for (let n = 0; n < yawLookDist; n++) {
            const lIdx = (baseIdx + n) % total;
            yawDx += segments[lIdx].curve * segLen;
        }
        const yawZ = yawLookDist * segLen;
        const yawScale = cameraDepth / yawZ;
        const vanishX = (screenW / 2) + yawScale * yawDx * screenW / 2;

        let dx = 0;
        let clipY = screenH;

        const projected = [];

        for (let n = 0; n < visible; n++) {
            const idx = (baseIdx + n) % total;
            const seg = segments[idx];

            const worldZ = (n * segLen) - (STATE.roadPosition % segLen);
            if (worldZ < 10) continue;

            dx += seg.curve * segLen;

            const scale = cameraDepth / worldZ;

            // Vanishing point shifted by look-ahead so mid-distance road stays centered.
            // Near segments barely move; far segments show the curve ahead.
            const projX = vanishX + scale * (-dx) * screenW / 2;
            const projY = (screenH / 2) + scale * cameraH * screenH / 2;
            const projW = scale * CONFIG.road.roadWidth * screenW / 2;

            seg.screen.x = projX;
            seg.screen.y = projY;
            seg.screen.w = projW;
            seg.screen.scale = scale;

            const fogT = Math.min(1, n / (visible * 0.7));

            let clip = false;
            if (projY < clipY) {
                clipY = projY;
            } else {
                clip = true;
            }

            projected.push({
                index: idx,
                segIndex: n,
                x: projX,
                y: projY,
                w: projW,
                scale: scale,
                curve: seg.curve,
                elevation: 0,
                fog: fogT,
                clip: clip
            });
        }

        projected.horizonDx = dx;
        projected.horizonZ = visible * segLen;

        return projected;
    },

    // Advance camera along track
    update(dt) {
        const segLen = CONFIG.road.segmentLength;
        const total = segments.length;

        const idx = Math.floor(STATE.roadPosition / segLen) % total;
        const seg = segments[idx];

        // Advance position
        STATE.roadPosition += STATE.speed * dt * 60;
        if (STATE.roadPosition >= trackLength) {
            STATE.roadPosition -= trackLength;
        }

        // Curve handling — train on rails
        STATE.curveDelta = seg.curve;
        STATE.playerX = 0;

        // Camera roll: bank into curves
        const curveConf = CONFIG.road.curve;
        const targetRoll = -seg.curve * curveConf.rollScale;
        STATE.cameraRoll += (targetRoll - STATE.cameraRoll) * curveConf.rollSmoothing;
    },

    getSegment(idx) {
        return segments[((idx % segments.length) + segments.length) % segments.length];
    },

    getSegments() { return segments; },
    getTrackLength() { return trackLength; },
    getSegmentCount() { return segments.length; }
};
