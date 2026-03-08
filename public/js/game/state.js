// Mutable runtime state. Everything reads from this, GSAP tweens write to it.

const STATE = {
    // Camera & motion
    speed: 40,
    focalLength: 400,
    shake: 0,

    // Sky color components (tweened individually for smooth interpolation)
    skyR: 0x87, skyG: 0xCE, skyB: 0xEB,

    // Progression
    entropy: 0,
    entropyRate: CONFIG.timing.entropyRate,
    phase: 'peace',
    running: false,
    ended: false,

    // Player
    choices: [],
    interventionIndex: 0,
    correctChoices: 0,

    // Road position
    roadPosition: 0,    // camera Z along track (world units)
    playerX: 0,         // lateral offset from road center
    curveDelta: 0       // current curve intensity (for centrifugal + parallax)
};

function resetState() {
    STATE.speed = 25;
    STATE.focalLength = 400;
    STATE.shake = 0;
    STATE.skyR = 0x87;
    STATE.skyG = 0xCE;
    STATE.skyB = 0xEB;
    STATE.entropy = 0;
    STATE.entropyRate = CONFIG.timing.entropyRate;
    STATE.phase = 'peace';
    STATE.running = false;
    STATE.ended = false;
    STATE.choices = [];
    STATE.interventionIndex = 0;
    STATE.correctChoices = 0;
    STATE.roadPosition = 0;
    STATE.playerX = 0;
    STATE.curveDelta = 0;
}
