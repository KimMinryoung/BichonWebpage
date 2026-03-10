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
        // Seoul route: winding through the city with roller-coaster terrain

        // Gentle intro — ease the player in
        this._addCurve(30, 60, 0.5);
        this._addHill(40, 60, 50);           // gradual climb

        // First descent — feel the drop
        this._addCurve(100, 80, -1.0);
        this._addHill(110, 50, -70);          // steep dive into valley

        // Roller-coaster sequence: rapid up-down crests
        this._addHill(170, 30, 60);           // quick crest
        this._addHill(205, 25, -55);          // sharp dip
        this._addHill(235, 30, 50);           // another crest
        this._addCurve(200, 100, 1.2);

        // Long sweeping climb with curve
        this._addCurve(320, 60, -0.7);
        this._addHill(300, 120, 90);          // big sustained climb

        // Summit → dramatic plunge
        this._addHill(430, 40, -80);          // steep drop off the summit
        this._addCurve(400, 90, -1.5);
        this._addHill(475, 50, -50);          // continued descent into valley

        // Valley floor — brief flat with curves
        this._addCurve(520, 70, 0.9);
        this._addHill(530, 30, 20);           // gentle undulation

        // Big roller-coaster hill
        this._addHill(570, 100, 110);         // massive climb
        this._addCurve(600, 60, -0.5);

        // Crest and stomach-dropping plunge
        this._addHill(680, 60, -100);         // huge drop
        this._addCurve(660, 80, -0.6);

        // Rapid succession — washboard hills
        this._addHill(750, 25, 45);
        this._addHill(780, 25, -50);
        this._addHill(810, 25, 45);
        this._addHill(840, 25, -40);
        this._addCurve(780, 100, 1.4);

        // Long downhill sweep
        this._addCurve(900, 60, -1.8);
        this._addHill(880, 80, -70);          // extended descent

        // Rising terrain with S-curves
        this._addCurve(970, 50, 0.8);
        this._addHill(960, 90, 80);           // climbing
        this._addCurve(1030, 60, -1.2);

        // Plateau → sudden drop
        this._addHill(1060, 30, -75);         // cliff edge drop
        this._addCurve(1080, 40, 0.6);

        // Rolling hills section
        this._addHill(1100, 50, 60);
        this._addHill(1155, 40, -55);
        this._addHill(1200, 50, 65);
        this._addCurve(1150, 70, -1.1);

        // Grand finale climb
        this._addHill(1260, 130, 120);        // tallest hill on track
        this._addCurve(1280, 100, 1.3);

        // Final descent — thrilling plunge to loop point
        this._addHill(1400, 80, -100);        // massive final drop
        this._addCurve(1420, 60, -0.8);
        this._addHill(1490, 60, -50);         // valley approach
        this._addHill(1555, 40, 30);          // gentle rise back to start elevation
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
        const baseCameraH = CONFIG.road.cameraHeight;

        // Camera rides the road surface: base height + tracked road elevation
        const cameraH = baseCameraH + STATE.cameraElevation;

        // Camera pitch shifts the horizon (positive slope = looking up = horizon moves down)
        const pitchOffset = STATE.cameraPitch;

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
            // Y: camera follows road elevation, so nearby flat segments stay centered
            // but distant segments at different elevations reveal the terrain ahead
            const projY = (screenH / 2) + scale * (cameraH - seg.y) * screenH / 2 + pitchOffset;
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

        // Attach horizon info for background parallax calculations
        projected.horizonDx = dx;       // total accumulated curve offset at draw distance
        projected.horizonZ = visible * segLen;  // world Z of farthest segment

        return projected;
    },

    // Advance camera along track, apply centrifugal force and hill physics
    update(dt) {
        const segLen = CONFIG.road.segmentLength;
        const total = segments.length;
        const hill = CONFIG.road.hill;

        // Current segment index
        const idx = Math.floor(STATE.roadPosition / segLen) % total;
        const seg = segments[idx];

        // --- Hill slope calculation ---
        // Sample a few segments ahead to get a forward-looking slope
        const lookAhead = 3;
        const aheadIdx = (idx + lookAhead) % total;
        const rawSlope = (segments[aheadIdx].y - seg.y) / (lookAhead * segLen);

        // Smooth the slope for natural feel
        STATE.hillSlope += (rawSlope - STATE.hillSlope) * hill.slopeSmoothing;

        // --- Hill speed modulation ---
        // Positive slope = uphill = slower, negative slope = downhill = faster
        const speedMod = 1 - STATE.hillSlope * hill.speedEffect;
        STATE.hillSpeedMod = Math.max(hill.speedMin, Math.min(hill.speedMax, speedMod));

        // --- Advance position with hill-modified speed ---
        STATE.roadPosition += STATE.speed * STATE.hillSpeedMod * dt * 60;
        if (STATE.roadPosition >= trackLength) {
            STATE.roadPosition -= trackLength;
        }

        // --- Camera elevation tracking ---
        // Camera smoothly follows road elevation (like riding the surface)
        STATE.cameraElevation += (seg.y - STATE.cameraElevation) * hill.cameraFollow;

        // --- Camera pitch from slope ---
        // Looking up on uphills, down on downhills
        const targetPitch = STATE.hillSlope * hill.pitchScale;
        STATE.cameraPitch += (targetPitch - STATE.cameraPitch) * hill.pitchSmoothing;

        // --- Curve handling ---
        STATE.curveDelta = seg.curve;

        // Centrifugal drift: curve pushes camera sideways
        STATE.playerX += seg.curve * CONFIG.road.centrifugal * STATE.speed * STATE.hillSpeedMod * dt;
        // Spring back toward center
        STATE.playerX *= 0.97;

        // --- Camera roll (bank into curves like a vehicle on banked track) ---
        const curveConf = CONFIG.road.curve;
        const targetRoll = -seg.curve * curveConf.rollScale;
        STATE.cameraRoll += (targetRoll - STATE.cameraRoll) * curveConf.rollSmoothing;

        // --- Camera yaw (look into the turn direction) ---
        const targetYaw = -seg.curve * curveConf.yawScale;
        STATE.cameraYaw += (targetYaw - STATE.cameraYaw) * curveConf.yawSmoothing;
    },

    getSegment(idx) {
        return segments[((idx % segments.length) + segments.length) % segments.length];
    },

    getSegments() { return segments; },
    getTrackLength() { return trackLength; },
    getSegmentCount() { return segments.length; }
};
