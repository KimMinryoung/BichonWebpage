// Mutable runtime state. Everything reads from this, GSAP tweens write to it.

const STATE = {
    // Camera & motion
    speed: 60,
    focalLength: 400,
    shake: 0,
    motionBlur: 0,

    // Sky gradient (top & bottom RGB, tweened per act)
    skyTopR: 0x14, skyTopG: 0x14, skyTopB: 0x30,
    skyBotR: 0xc4, skyBotG: 0xa0, skyBotB: 0x60,
    // Mid sky (for 3-stop gradient)
    skyMidR: 0x2d, skyMidG: 0x2b, skyMidB: 0x55,

    // Fog/atmospheric color (blends distant objects toward sky)
    fogR: 0x2d, fogG: 0x2b, fogB: 0x55,

    // Progression
    entropy: 0,
    entropyRate: CONFIG.timing.entropyRate,
    act: 'act1',
    phase: 'act1',        // kept for compatibility with sound/effects
    running: false,
    ended: false,
    trainStopped: false,  // Act 4 pause

    // Player
    choices: [],
    interventionIndex: 0,
    correctChoices: 0,
    totalInterventions: 0,
    act4Choice: null,     // which ending path the player chose in Act 4

    // Road position
    roadPosition: 0,
    playerX: 0,
    curveDelta: 0,

    // Camera
    cameraElevation: 0,     // smoothed road elevation the camera sits on
    cameraRoll: 0,          // bank into curves (radians)

    // AI light beam
    aiBeamAlpha: 0.6,
    aiBeamWidth: 1.0,     // multiplier (grows with acts)
    aiBeamColor: 0x00b8d8,

    // Narrative text
    narrativeText: '',
    narrativeAlpha: 0,

    // Road edge color (hex, tweened on act change)
    roadEdgeR: 0xc4, roadEdgeG: 0xa0, roadEdgeB: 0x60,

    // Track state modifiers
    trackCrackLevel: 0,   // 0 = pristine, 1 = fully cracked

    // Infection pixels (Act 3 Shadow Legion aftermath)
    infectionLevel: 0,

    // Landscape biome: 'city', 'sea', 'tehran', 'desolate'
    biome: 'city',

    // Ground colors (tweened for smooth biome transitions)
    groundDarkR: 0x1a, groundDarkG: 0x30, groundDarkB: 0x28,
    groundLightR: 0x2e, groundLightG: 0x58, groundLightB: 0x40
};

function resetState() {
    const s1 = CONFIG.acts.act1.sky;
    STATE.speed = 60;
    STATE.focalLength = 400;
    STATE.shake = 0;
    STATE.motionBlur = 0;
    STATE.skyTopR = s1.top.r; STATE.skyTopG = s1.top.g; STATE.skyTopB = s1.top.b;
    STATE.skyMidR = s1.mid.r; STATE.skyMidG = s1.mid.g; STATE.skyMidB = s1.mid.b;
    STATE.skyBotR = s1.glow.r; STATE.skyBotG = s1.glow.g; STATE.skyBotB = s1.glow.b;
    STATE.fogR = s1.mid.r; STATE.fogG = s1.mid.g; STATE.fogB = s1.mid.b;
    STATE.entropy = 0;
    STATE.entropyRate = CONFIG.timing.entropyRate;
    STATE.act = 'act1';
    STATE.phase = 'act1';
    STATE.running = false;
    STATE.ended = false;
    STATE.trainStopped = false;
    STATE.choices = [];
    STATE.interventionIndex = 0;
    STATE.correctChoices = 0;
    STATE.totalInterventions = 0;
    STATE.act4Choice = null;
    STATE.roadPosition = 0;
    STATE.playerX = 0;
    STATE.curveDelta = 0;
    STATE.cameraElevation = 0;
    STATE.cameraRoll = 0;
    STATE.aiBeamAlpha = 0.6;
    STATE.aiBeamWidth = 1.0;
    STATE.aiBeamColor = 0x00b8d8;
    STATE.narrativeText = '';
    STATE.narrativeAlpha = 0;
    STATE.roadEdgeR = 0xc4; STATE.roadEdgeG = 0xa0; STATE.roadEdgeB = 0x60;
    STATE.trackCrackLevel = 0;
    STATE.infectionLevel = 0;
    STATE.biome = 'city';
    const g1 = CONFIG.acts.act1.grass;
    STATE.groundDarkR = (g1.dark >> 16) & 0xFF;
    STATE.groundDarkG = (g1.dark >> 8) & 0xFF;
    STATE.groundDarkB = g1.dark & 0xFF;
    STATE.groundLightR = (g1.light >> 16) & 0xFF;
    STATE.groundLightG = (g1.light >> 8) & 0xFF;
    STATE.groundLightB = g1.light & 0xFF;
}
