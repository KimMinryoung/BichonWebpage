// Choice UI: show/hide buttons, handle selection, apply consequences.

let choiceContainer, endingOverlay;
let activeTimeout = null;
let preSlowdownSpeed = 0;

const ENDING_I18N = {
    en: {
        hope:        { title: 'HOPE', subtitle: 'The city endures.' },
        catastrophe: { title: 'CATASTROPHE', subtitle: 'The city falls silent.' },
        restart: 'Restart'
    },
    ko: {
        hope:        { title: '희망', subtitle: '도시는 견뎌냈습니다.' },
        catastrophe: { title: '재앙', subtitle: '도시가 침묵에 잠깁니다.' },
        restart: '다시 시작'
    }
};

function getEndingLang() {
    return document.documentElement.lang === 'ko' ? 'ko' : 'en';
}

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
        // Show visual event on canvas
        if (point.visual) Events.show(point.visual);

        // Play alarm sound
        Sound.playAlarm();

        // Bullet-time slowdown
        preSlowdownSpeed = STATE.speed;
        gsap.to(STATE, {
            speed: preSlowdownSpeed * CONFIG.timing.interventionSlowdown,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Build prompt and choice buttons
        choiceContainer.innerHTML = '';
        if (point.prompt) {
            const promptEl = document.createElement('div');
            promptEl.className = 'game-choice-prompt';
            promptEl.textContent = point.prompt;
            choiceContainer.appendChild(promptEl);
        }
        const btnRow = document.createElement('div');
        btnRow.className = 'game-choice-row';
        choiceContainer.appendChild(btnRow);
        point.choices.forEach((choice, i) => {
            const btn = document.createElement('button');
            btn.className = 'game-choice-btn';
            btn.textContent = choice.label;
            btn.addEventListener('click', () => this._selectChoice(choice, point));
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this._selectChoice(choice, point);
            });
            // Stagger appearance
            btn.style.animationDelay = (i * 0.1) + 's';
            btnRow.appendChild(btn);
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

        // Apply effect (clamp rate >= 0 so entropy only slows, never reverses)
        STATE.entropyRate = Math.max(0, STATE.entropyRate + choice.entropyDelta);
        STATE.choices.push(choice.id);
        if (choice.correct) STATE.correctChoices++;

        // Sound feedback
        if (choice.correct) {
            Sound.playResolve();
        } else {
            Sound.playImpact();
        }
        Sound.playClick();

        // Visual consequence on canvas
        if (point.visual) Events.resolve(point.visual, choice.correct);

        // Visual feedback
        const flash = Renderer.getFlash();
        gsap.to(flash, { alpha: 0.15, duration: 0.1, yoyo: true, repeat: 1 });

        this._hideChoices();
    },

    _missChoice(point) {
        activeTimeout = null;
        // Penalty for not choosing
        STATE.entropyRate += point.missedPenalty;
        Sound.playImpact();
        if (point.visual) Events.resolve(point.visual, false);
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

        const lang = getEndingLang();
        const strings = ENDING_I18N[lang];
        const ending = strings[type] || strings.catastrophe;

        const msg = document.createElement('div');
        msg.className = 'ending-message';
        msg.innerHTML = '<h2>' + ending.title + '</h2><p>' + ending.subtitle + '</p>';

        const restartBtn = document.createElement('button');
        restartBtn.className = 'game-choice-btn';
        restartBtn.textContent = strings.restart;
        restartBtn.addEventListener('click', () => {
            endingOverlay.classList.remove('visible');
            Game.restart();
        });
        restartBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
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
