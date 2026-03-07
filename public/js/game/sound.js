// Procedural sound effects and ambient audio via Web Audio API.
// No external audio files needed — everything is synthesized.

let ctx;
let masterGain;
let droneOsc, droneGain;
let droneLFO, droneLFOGain;
let currentSoundPhase = null;

const DRONE_PHASES = {
    peace:       { freq: 80,  vol: 0.06, lfo: 0.3,  detune: 0   },
    tension:     { freq: 100, vol: 0.10, lfo: 1.2,  detune: 50  },
    crisis:      { freq: 130, vol: 0.15, lfo: 3.0,  detune: 150 },
    catastrophe: { freq: 160, vol: 0.22, lfo: 8.0,  detune: 400 },
    hope:        { freq: 65,  vol: 0.05, lfo: 0.2,  detune: -50 }
};

const Sound = {
    init() {
        // Create audio context on first user interaction (browser policy)
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
        // Base drone oscillator
        droneOsc = ctx.createOscillator();
        droneOsc.type = 'sawtooth';
        droneOsc.frequency.value = 80;

        droneGain = ctx.createGain();
        droneGain.gain.value = 0;

        // Low-pass filter for warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        filter.Q.value = 2;

        // LFO for pulsing
        droneLFO = ctx.createOscillator();
        droneLFO.type = 'sine';
        droneLFO.frequency.value = 0.3;
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

        const p = DRONE_PHASES[phase] || DRONE_PHASES.peace;
        const t = ctx.currentTime;

        droneOsc.frequency.linearRampToValueAtTime(p.freq, t + 2);
        droneOsc.detune.linearRampToValueAtTime(p.detune, t + 2);
        droneGain.gain.linearRampToValueAtTime(p.vol, t + 2);
        droneLFO.frequency.linearRampToValueAtTime(p.lfo, t + 2);
    },

    // Short UI click sound for choice buttons
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

    // Impact thud for wrong choices / collapses
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

    // Bright chime for correct choices
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

    // Alarm tone for intervention appearance
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

    reset() {
        currentSoundPhase = null;
    }
};
