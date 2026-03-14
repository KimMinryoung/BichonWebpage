// Choice UI: show/hide buttons, handle selection, apply consequences.
// Supports passive events, train-stop events, and 4 Babel Express endings.

let choiceContainer, endingOverlay;
let activeTimeout = null;
let preSlowdownSpeed = 0;

const ENDING_I18N = {
    en: {
        transparent: {
            title: 'THE TRANSPARENT ROAD',
            subtitle: 'The tower reached the sky. No one was inside.',
            quote: '"Light carried light. It was beautiful. But there were no passengers."'
        },
        newTongues: {
            title: 'NEW TONGUES',
            subtitle: 'The scattering of tongues at Babel was not a punishment.',
            quote: '"One tongue can give one command. Many tongues can ask many questions."'
        },
        pedestrian: {
            title: 'THE PEDESTRIAN',
            subtitle: 'The one who left the train — fool or sage, no one knows.',
            quote: '"The train does not answer. The train has already left."'
        },
        inertia: {
            title: 'INERTIA',
            subtitle: 'No one pulled the brake.',
            quote: '"Not because no one knew where the brake was. Because everyone knew that braking means slowing down."'
        },
        restart: 'Restart'
    },
    ko: {
        transparent: {
            title: '투명한 길',
            subtitle: '탑은 하늘에 닿았다. 안에 아무도 없었다.',
            quote: '"빛만이 빛을 운반하고 있었다. 아름다웠다. 그러나 승객이 없었다."'
        },
        newTongues: {
            title: '새로운 방언',
            subtitle: '바벨에서 언어가 흩어진 것은 벌이 아니었다.',
            quote: '"하나의 언어는 하나의 명령만 할 수 있다. 많은 언어는 많은 질문을 할 수 있다."'
        },
        pedestrian: {
            title: '보행자',
            subtitle: '기관차를 내린 사람은 바보인가, 현자인가. 아무도 모른다.',
            quote: '"기관차는 대답하지 않는다. 기관차는 이미 떠났으므로."'
        },
        inertia: {
            title: '관성',
            subtitle: '누구도 브레이크를 잡지 않았다.',
            quote: '"브레이크가 어디 있는지 아는 사람이 없었기 때문이 아니다. 브레이크를 잡으면 느려진다는 것을 모두가 알고 있었기 때문이다."'
        },
        restart: '다시 시작'
    }
};

function getEndingLang() {
    return document.documentElement.lang === 'ko' ? 'ko' : 'en';
}

const Intervention = {
    init() {
        choiceContainer = document.getElementById('game-choices');
        endingOverlay = document.getElementById('game-ending');
    },

    check() {
        if (STATE.ended || !STATE.running) return;
        if (!currentScene) return;

        const points = currentScene.interventions;
        if (STATE.interventionIndex >= points.length) return;

        const point = points[STATE.interventionIndex];
        if (STATE.entropy >= point.entropy) {
            STATE.interventionIndex++;
            STATE.totalInterventions++;

            if (point.passive) {
                // Passive event: show visual, no choices
                if (point.visual) Events.show(point.visual);
                if (point.narrative) {
                    Timeline.showNarrative(point.narrative, 4000);
                }
                return;
            }

            this._showChoices(point);
        }
    },

    _showChoices(point) {
        // Show visual event
        if (point.visual) Events.show(point.visual);

        Sound.playAlarm();

        // Train stop only for Act 4 final choice — normal events keep flying
        if (point.trainStop) {
            preSlowdownSpeed = STATE.speed;
            STATE.trainStopped = true;
            gsap.to(STATE, { speed: 0, duration: 3, ease: 'power3.out' });
        }

        // Show narrative if present
        if (point.narrative) {
            Timeline.showNarrative(point.narrative, 6000);
        }

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
            btn.style.animationDelay = (i * 0.1) + 's';
            btnRow.appendChild(btn);
        });
        choiceContainer.classList.add('visible');

        // Timeout (unless noTimeout)
        if (!point.noTimeout) {
            activeTimeout = setTimeout(() => {
                this._missChoice(point);
            }, CONFIG.timing.choiceDuration);
        }
    },

    _selectChoice(choice, point) {
        if (activeTimeout) {
            clearTimeout(activeTimeout);
            activeTimeout = null;
        }

        // Apply entropy effect
        STATE.entropyRate = Math.max(0, STATE.entropyRate + choice.entropyDelta);
        STATE.choices.push(choice.id);
        if (choice.correct) STATE.correctChoices++;

        // Track ending choice from Act 4
        if (choice.ending) {
            STATE.act4Choice = choice.ending;
        }

        // Sound feedback
        if (choice.correct === true) {
            Sound.playResolve();
        } else if (choice.correct === false) {
            Sound.playImpact();
        } else {
            Sound.playClick();
        }
        Sound.playClick();

        // Visual consequence
        if (point.visual) Events.resolve(point.visual, !!choice.correct);

        // Flash
        const flash = Renderer.getFlash();
        gsap.to(flash, { alpha: 0.15, duration: 0.1, yoyo: true, repeat: 1 });

        this._hideChoices(point);
    },

    _missChoice(point) {
        activeTimeout = null;
        STATE.entropyRate += point.missedPenalty;
        Sound.playImpact();
        if (point.visual) Events.resolve(point.visual, false);
        this._hideChoices(point);
    },

    _hideChoices(point) {
        choiceContainer.classList.remove('visible');
        choiceContainer.innerHTML = '';

        // Resume speed only for train-stop events (Act 4 final choice)
        if (point && point.trainStop) {
            STATE.trainStopped = false;
            gsap.to(STATE, {
                speed: CONFIG.phaseVisuals.act4.speed,
                duration: 2, ease: 'power2.in'
            });
            STATE.entropy = Math.max(STATE.entropy, CONFIG.phases.act5.min);
        }
    },

    showEnding(type) {
        STATE.running = false;
        endingOverlay.innerHTML = '';

        const lang = getEndingLang();
        const strings = ENDING_I18N[lang];
        const ending = strings[type] || strings.inertia;

        const msg = document.createElement('div');
        msg.className = 'ending-message';
        msg.innerHTML = '<h2>' + ending.title + '</h2>'
                      + '<p>' + ending.subtitle + '</p>'
                      + '<p class="ending-quote">' + ending.quote + '</p>';

        const restartBtn = document.createElement('button');
        restartBtn.className = 'game-choice-btn ending-restart-btn';
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
