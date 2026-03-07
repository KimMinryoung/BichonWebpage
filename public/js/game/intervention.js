// Choice UI: show/hide buttons, handle selection, apply consequences.

let choiceContainer, endingOverlay;
let activeTimeout = null;
let preSlowdownSpeed = 0;

const Intervention = {
    init() {
        // Choice buttons container
        choiceContainer = document.getElementById('game-choices');

        // Ending overlay
        endingOverlay = document.getElementById('game-ending');
    },

    check() {
        if (STATE.ended || !STATE.running) return;
        if (!currentScene) return;

        const points = currentScene.interventions;
        if (STATE.interventionIndex >= points.length) {
            // All interventions passed — if player got enough correct, trigger hope
            if (!STATE.ended && STATE.correctChoices >= Math.ceil(points.length * 0.7)) {
                Timeline.triggerHopeEnding();
            }
            return;
        }

        const point = points[STATE.interventionIndex];
        if (STATE.entropy >= point.entropy) {
            this._showChoices(point);
            STATE.interventionIndex++;
        }
    },

    _showChoices(point) {
        // Bullet-time slowdown
        preSlowdownSpeed = STATE.speed;
        gsap.to(STATE, {
            speed: preSlowdownSpeed * CONFIG.timing.interventionSlowdown,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Build choice buttons
        choiceContainer.innerHTML = '';
        point.choices.forEach((choice, i) => {
            const btn = document.createElement('button');
            btn.className = 'game-choice-btn';
            btn.textContent = choice.label;
            btn.addEventListener('click', () => this._selectChoice(choice, point));
            // Stagger appearance
            btn.style.animationDelay = (i * 0.1) + 's';
            choiceContainer.appendChild(btn);
        });
        choiceContainer.classList.add('visible');

        // Timeout: missed choice penalty
        activeTimeout = setTimeout(() => {
            this._missChoice(point);
        }, CONFIG.timing.choiceDuration);
    },

    _selectChoice(choice, point) {
        if (activeTimeout) {
            clearTimeout(activeTimeout);
            activeTimeout = null;
        }

        // Apply effect
        STATE.entropyRate += choice.entropyDelta;
        STATE.choices.push(choice.id);
        if (choice.correct) STATE.correctChoices++;

        // Visual feedback
        const flash = Renderer.getFlash();
        gsap.to(flash, { alpha: 0.15, duration: 0.1, yoyo: true, repeat: 1 });

        this._hideChoices();
    },

    _missChoice(point) {
        activeTimeout = null;
        // Penalty for not choosing
        STATE.entropyRate += point.missedPenalty;
        this._hideChoices();
    },

    _hideChoices() {
        choiceContainer.classList.remove('visible');
        choiceContainer.innerHTML = '';

        // Resume speed
        gsap.to(STATE, {
            speed: CONFIG.phaseVisuals[STATE.phase] ? CONFIG.phaseVisuals[STATE.phase].speed : preSlowdownSpeed,
            duration: 0.8,
            ease: 'power2.in'
        });
    },

    showEnding(type) {
        STATE.running = false;
        endingOverlay.innerHTML = '';

        const msg = document.createElement('div');
        msg.className = 'ending-message';

        if (type === 'hope') {
            msg.innerHTML = '<h2>HOPE</h2><p>The city endures.</p>';
        } else {
            msg.innerHTML = '<h2>CATASTROPHE</h2><p>The city falls silent.</p>';
        }

        const restartBtn = document.createElement('button');
        restartBtn.className = 'game-choice-btn';
        restartBtn.textContent = 'Restart';
        restartBtn.addEventListener('click', () => {
            endingOverlay.classList.remove('visible');
            Game.restart();
        });

        msg.appendChild(restartBtn);
        endingOverlay.appendChild(msg);
        endingOverlay.classList.add('visible');
    },

    reset() {
        if (activeTimeout) {
            clearTimeout(activeTimeout);
            activeTimeout = null;
        }
        choiceContainer.classList.remove('visible');
        endingOverlay.classList.remove('visible');
        choiceContainer.innerHTML = '';
        endingOverlay.innerHTML = '';
    }
};
