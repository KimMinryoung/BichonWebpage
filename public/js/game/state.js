// Mutable runtime state. Everything reads from this, GSAP tweens write to it.

const STATE = {
    // Camera & motion
    speed: 10,
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
    correctChoices: 0
};

function resetState() {
    STATE.speed = 10;
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
}
