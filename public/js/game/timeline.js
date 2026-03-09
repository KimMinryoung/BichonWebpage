// Phase transitions and GSAP timeline sequences driven by entropy.

let currentPhase = 'peace';
let phaseTween = null;

// Sky color targets per phase (RGB components for smooth tweening)
// Endesga 64 sky color targets per phase
const SKY_COLORS = {
    peace:       { r: 0x4B, g: 0x7D, b: 0xC8 },  // #4b7dc8
    tension:     { r: 0xE6, g: 0x9C, b: 0x69 },  // #e69c69
    crisis:      { r: 0xC6, g: 0x45, b: 0x24 },  // #c64524
    catastrophe: { r: 0x0E, g: 0x07, b: 0x1B },  // #0e071b
    hope:        { r: 0xFF, g: 0xC8, b: 0x25 }   // #ffc825
};

const Timeline = {
    check() {
        let newPhase = 'peace';
        const e = STATE.entropy;

        if (STATE.ended) return;

        if (e >= CONFIG.phases.catastrophe.min) {
            newPhase = 'catastrophe';
        } else if (e >= CONFIG.phases.crisis.min) {
            newPhase = 'crisis';
        } else if (e >= CONFIG.phases.tension.min) {
            newPhase = 'tension';
        }

        if (newPhase !== currentPhase) {
            this._transitionTo(newPhase);
            currentPhase = newPhase;
        }

        // Check for catastrophe ending
        if (STATE.entropy >= 100 && !STATE.ended) {
            this._triggerCatastropheEnding();
        }
    },

    _transitionTo(phase) {
        const visuals = CONFIG.phaseVisuals[phase];
        const sky = SKY_COLORS[phase];

        if (phaseTween) phaseTween.kill();

        phaseTween = gsap.to(STATE, {
            speed: visuals.speed,
            focalLength: visuals.focalLength,
            shake: visuals.shake,
            skyR: sky.r,
            skyG: sky.g,
            skyB: sky.b,
            duration: 3,
            ease: 'power2.inOut'
        });
    },

    triggerHopeEnding() {
        if (STATE.ended) return;
        STATE.ended = true;

        const visuals = CONFIG.phaseVisuals.hope;
        const sky = SKY_COLORS.hope;
        const flash = Renderer.getFlash();

        // Entropy curves downward
        gsap.to(STATE, { entropyRate: -2, duration: 2 });

        // Brief white flash then golden dawn
        gsap.to(flash, { alpha: 0.6, duration: 0.3, yoyo: true, repeat: 1 });

        gsap.to(STATE, {
            speed: visuals.speed,
            focalLength: visuals.focalLength,
            shake: visuals.shake,
            skyR: sky.r,
            skyG: sky.g,
            skyB: sky.b,
            duration: 5,
            ease: 'power2.out',
            onComplete: () => {
                Intervention.showEnding('hope');
            }
        });
    },

    _triggerCatastropheEnding() {
        STATE.ended = true;
        const flash = Renderer.getFlash();

        gsap.to(STATE, { speed: 250, focalLength: 50, shake: 40, duration: 2 });
        gsap.to(flash, {
            alpha: 1,
            duration: 3,
            ease: 'power4.in',
            onComplete: () => {
                Intervention.showEnding('catastrophe');
            }
        });
    },

    reset() {
        currentPhase = 'peace';
        if (phaseTween) phaseTween.kill();
        phaseTween = null;
    }
};
