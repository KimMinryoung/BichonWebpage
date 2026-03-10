// Pseudo-3D track system (Slipstream style).
// Camera rides the front of a train — follows the track like a roller coaster.
// Curves: look-ahead yaw shifts vanishing point so mid-distance road stays centered.
// Hills: each segment has a Y elevation; camera tracks the surface, creating
//        visible slopes, crests, and valleys purely through projection math.
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

        // ═══════════════════════════════════════════
        //  Track layout: curves + hills interleaved
        // ═══════════════════════════════════════════

        // Act 1: Gentle introduction — ease the player in
        this._addCurve(30, 60, 0.5);
        this._addHill(40, 80, 1200);           // gradual climb
        this._addCurve(100, 80, -0.8);
        this._addHill(120, 60, -800);          // descent into valley

        // Act 2: Acceleration — bigger features
        this._addHill(200, 100, 2000);         // long sustained climb
        this._addCurve(200, 120, 1.2);
        this._addHill(310, 50, -1800);         // steep plunge off the summit
        this._addCurve(340, 60, -0.8);
        this._addHill(370, 40, 800);           // quick crest
        this._addHill(415, 35, -700);          // quick dip
        this._addCurve(400, 70, 1.0);
        this._addCurve(450, 90, -1.5);
        this._addHill(460, 80, 1500);          // climb into Act 3

        // Act 3: Chaotic — dramatic terrain
        this._addCurve(540, 50, 1.4);
        this._addHill(550, 60, -2500);         // stomach-dropping plunge
        this._addCurve(620, 50, -0.6);
        this._addHill(630, 30, 1000);          // quick crest
        this._addHill(665, 25, -900);          // sharp dip
        this._addCurve(690, 80, -0.8);
        this._addHill(700, 100, 2200);         // big roller-coaster climb
        this._addCurve(780, 100, 1.6);
        this._addHill(810, 50, -2000);         // huge drop
        // Washboard hills
        this._addHill(870, 20, 600);
        this._addHill(895, 20, -700);
        this._addHill(920, 20, 600);
        this._addCurve(920, 50, -1.8);
        this._addHill(950, 60, -1200);         // valley before Act 4

        // Act 4: Eerie — gentle undulation
        this._addCurve(1020, 50, 0.6);
        this._addHill(1030, 80, 800);          // slow rise
        this._addCurve(1080, 60, -0.8);
        this._addHill(1110, 60, -600);         // gentle descent
        this._addCurve(1150, 40, 0.5);
        this._addHill(1180, 50, 500);          // undulation
        this._addHill(1235, 40, -400);
        this._addCurve(1250, 70, -0.7);

        // Act 5: Finale — grand climb and plunge
        this._addHill(1350, 120, 3000);        // tallest hill on track
        this._addCurve(1410, 100, 1.3);
        this._addHill(1480, 70, -2800);        // massive final drop
        this._addCurve(1530, 60, -0.9);
        this._addHill(1555, 40, 600);          // gentle rise back to baseline
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
    project(screenW, screenH) {
        const segLen = CONFIG.road.segmentLength;
        const total = segments.length;
        const cameraDepth = CONFIG.road.cameraDepth;
        const baseCameraH = CONFIG.road.cameraHeight;

        // Camera sits on the road surface + cameraHeight above it
        const cameraY = baseCameraH + STATE.cameraElevation;

        const baseIdx = Math.floor(STATE.roadPosition / segLen);
        const visible = CONFIG.road.visibleSegments;

        // ── First-person on-rails: no look-ahead yaw ──
        // Camera faces the track tangent at the current position.
        // Road directly ahead is always centered; curves appear in the distance.
        const vanishX = screenW / 2;

        let dx = 0;       // curve rate accumulator
        let x = 0;        // curve position accumulator (double integral)
        let clipY = screenH;

        const projected = [];

        for (let n = 0; n < visible; n++) {
            const idx = (baseIdx + n) % total;
            const seg = segments[idx];

            const worldZ = (n * segLen) - (STATE.roadPosition % segLen);
            if (worldZ < 10) continue;

            x += dx;
            dx += seg.curve;

            const scale = cameraDepth / worldZ;

            // X: first-person — near road centered, far road curves away.
            // +x because camera faces track tangent: positive curve (right turn)
            // → x grows positive → far segments appear to the right.
            const projX = vanishX + scale * x * screenW / 2;

            // Y: camera rides the road surface.
            // cameraY - seg.y = height difference between camera and this segment.
            // Positive = camera above segment = segment below horizon = larger projY.
            // When approaching a hill, distant segments have higher seg.y → they
            // appear above the nearby road → visible upward slope.
            const projY = (screenH / 2) + scale * (cameraY - seg.y) * screenH / 2;

            const projW = scale * CONFIG.road.roadWidth * screenW / 2;

            seg.screen.x = projX;
            seg.screen.y = projY;
            seg.screen.w = projW;
            seg.screen.scale = scale;

            const fogT = Math.min(1, n / (visible * 0.7));

            // Hill clipping: if a segment is below a closer hill crest on screen,
            // it's hidden behind the crest.
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
                elevation: seg.y,
                fog: fogT,
                clip: clip
            });
        }

        projected.horizonDx = x;
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

        // Camera elevation: smoothly follow the road surface
        const followRate = CONFIG.road.hill.cameraFollow;
        STATE.cameraElevation += (seg.y - STATE.cameraElevation) * followRate;

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
