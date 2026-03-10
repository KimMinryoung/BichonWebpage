// Procedural sound effects and ambient audio via Web Audio API.
// Per-act drone parameters for Babel Express atmosphere.

let ctx;
let masterGain;
let droneOsc, droneGain;
let droneLFO, droneLFOGain;
let currentSoundPhase = null;

const DRONE_PHASES = {
    act1: { freq: 70,  vol: 0.05, lfo: 0.2,  detune: 0   },    // quiet dawn hum
    act2: { freq: 100, vol: 0.10, lfo: 1.5,  detune: 80  },    // rising tension
    act3: { freq: 140, vol: 0.16, lfo: 4.0,  detune: 200 },    // chaotic
    act4: { freq: 50,  vol: 0.04, lfo: 0.1,  detune: -30 },    // near silence, emptiness
    act5: { freq: 180, vol: 0.22, lfo: 8.0,  detune: 500 },    // climax
    hope: { freq: 65,  vol: 0.05, lfo: 0.2,  detune: -50 }
};

const Sound = {
    init() {
        const resume = () => {
            if (!ctx) {
                ctx = new (window.AudioContext || window.webkitAudioContext)();
                masterGain = ctx.createGain();
                masterGain.gain.value = 0.5;
                masterGain.connect(ctx.destination);
                this._startDrone();
            }
            if (ctx.state === 'suspended') ctx.resume();
        };
        document.addEventListener('click', resume, { once: false });
        document.addEventListener('touchstart', resume, { once: false });
    },

    _startDrone() {
        droneOsc = ctx.createOscillator();
        droneOsc.type = 'sawtooth';
        droneOsc.frequency.value = 70;

        droneGain = ctx.createGain();
        droneGain.gain.value = 0;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        filter.Q.value = 2;

        droneLFO = ctx.createOscillator();
        droneLFO.type = 'sine';
        droneLFO.frequency.value = 0.2;
        droneLFOGain = ctx.createGain();
        droneLFOGain.gain.value = 0.03;

        droneLFO.connect(droneLFOGain);
        droneLFOGain.connect(droneGain.gain);

        droneOsc.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(masterGain);

        droneOsc.start();
        droneLFO.start();
    },

    updatePhase(phase) {
        if (!ctx || phase === currentSoundPhase) return;
        currentSoundPhase = phase;

        const p = DRONE_PHASES[phase] || DRONE_PHASES.act1;
        const t = ctx.currentTime;

        droneOsc.frequency.linearRampToValueAtTime(p.freq, t + 2);
        droneOsc.detune.linearRampToValueAtTime(p.detune, t + 2);
        droneGain.gain.linearRampToValueAtTime(p.vol, t + 2);
        droneLFO.frequency.linearRampToValueAtTime(p.lfo, t + 2);
    },

    playClick() {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 800;
        gain.gain.value = 0.08;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    },

    playImpact() {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 60;
        osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.4);
        gain.gain.value = 0.2;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    },

    playResolve() {
        if (!ctx) return;
        [523, 659, 784].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.value = 0.06;
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3 + i * 0.1);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + 0.4 + i * 0.1);
        });
    },

    playAlarm() {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 440;
        gain.gain.value = 0.06;

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 6;
        lfoGain.gain.value = 100;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.connect(gain);
        gain.connect(masterGain);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start();
        lfo.start();
        osc.stop(ctx.currentTime + 0.8);
        lfo.stop(ctx.currentTime + 0.8);
    },

    // Train screech sound for Act 4 stop
    playTrainStop() {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = 2000;
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.5);
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
    },

    reset() {
        currentSoundPhase = null;
    }
};
