// Drone observation intervention system.
// Replaces choice-button UI with touch-to-illuminate and swipe-to-steer.
// Supports TAP events, SWIPE forks, INFECTION minigame, and ending screen.

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

            this._activateEvent(point);
        }
    },

    // ── Main event activation ──

    _activateEvent(point) {
        // Show visual
        if (point.visual) Events.show(point.visual);

        Sound.playAlarm();

        // Train stop (Act 4 empty city)
        if (point.trainStop) {
            preSlowdownSpeed = STATE.speed;
            STATE.trainStopped = true;
            gsap.to(STATE, { speed: 0, duration: 3, ease: 'power3.out' });
        }

        // Narrative
        if (point.narrative) {
            Timeline.showNarrative(point.narrative, 6000);
        }

        const type = point.interactionType;

        if (type === 'tap' || type === 'infection') {
            this._activateTapEvent(point);
        } else if (type === 'swipe') {
            this._activateSwipeEvent(point);
        }
    },

    // ── TAP / INFECTION events ──

    _activateTapEvent(point) {
        // Get tap targets from the event builder's data
        const eventData = Events.getActiveData();
        const targets = eventData ? (eventData.tapTargets || []) : [];

        Touch.activate(point.interactionType, {
            targets: targets,
            targetTypes: point.targetTypes || null,
            onTap: (entity) => {
                // Per-tap: visual effect via event builder
                if (point.visual) Events.onTap(point.visual, entity);

                // Per-tap entropy reward (floor at 30% base rate so game always progresses)
                if (point.tapReward && point.tapReward.entropyDelta) {
                    const floor = CONFIG.timing.entropyRate * 0.3;
                    STATE.entropyRate = Math.max(floor,
                        STATE.entropyRate + point.tapReward.entropyDelta
                    );
                }
            }
        });

        // Event duration timeout
        const duration = point.duration || CONFIG.timing.choiceDuration;
        activeTimeout = setTimeout(() => {
            this._resolveTapEvent(point);
        }, duration);
    },

    _resolveTapEvent(point) {
        if (activeTimeout) {
            clearTimeout(activeTimeout);
            activeTimeout = null;
        }

        const tapCount = Touch.getTapCount();
        const totalTappable = Touch.getTotalTappable();

        // Determine success
        const threshold = point.correctThreshold || 0;
        const correct = totalTappable > 0
            ? (tapCount / totalTappable) >= threshold
            : true;

        if (correct) {
            STATE.correctChoices++;
            Sound.playResolve();
        } else {
            STATE.entropyRate += point.missedPenalty || 0;
            Sound.playImpact();
        }

        // Track choice
        STATE.choices.push(point.interactionType + ':' + tapCount + '/' + totalTappable);

        // Resolve visual event
        if (point.visual) {
            Events.resolve(point.visual, { correct: correct, tapCount: tapCount });
        }

        // Flash
        const flash = Renderer.getFlash();
        gsap.to(flash, { alpha: 0.1, duration: 0.1, yoyo: true, repeat: 1 });

        Touch.deactivate();

        // If this event has an ending fork, transition to it
        if (point.endingFork) {
            this._activateEndingFork(point);
            return;
        }

        // Resume from train stop if needed
        if (point.trainStop) {
            STATE.trainStopped = false;
            gsap.to(STATE, {
                speed: CONFIG.phaseVisuals.act4.speed,
                duration: 2, ease: 'power2.in'
            });
            STATE.entropy = Math.max(STATE.entropy, CONFIG.phases.act5.min);
        }
    },

    // ── SWIPE events ──

    _activateSwipeEvent(point) {
        Touch.activate('swipe', {
            onSwipe: (direction) => {
                this._resolveSwipeEvent(point, direction);
            }
        });

        // Timeout: if player doesn't swipe, treat as 'center' (straight)
        const duration = point.duration || CONFIG.timing.choiceDuration;
        activeTimeout = setTimeout(() => {
            this._resolveSwipeEvent(point, 'center');
        }, duration);
    },

    _resolveSwipeEvent(point, direction) {
        if (activeTimeout) {
            clearTimeout(activeTimeout);
            activeTimeout = null;
        }

        Touch.deactivate();

        const results = point.swipeResults || {};
        const result = results[direction] || results.center || {};

        // Apply entropy
        if (result.entropyDelta) {
            STATE.entropyRate = Math.max(0, STATE.entropyRate + result.entropyDelta);
        }

        // Track
        if (result.correct) STATE.correctChoices++;
        STATE.choices.push(result.id || direction);

        // Sound
        if (result.correct) {
            Sound.playResolve();
        } else {
            Sound.playImpact();
        }

        // Resolve visual
        if (point.visual) {
            Events.resolve(point.visual, {
                correct: !!result.correct,
                direction: direction
            });
        }

        // Flash
        const flash = Renderer.getFlash();
        gsap.to(flash, { alpha: 0.1, duration: 0.1, yoyo: true, repeat: 1 });

        // Missed penalty if nothing or center
        if (!result.correct && point.missedPenalty) {
            STATE.entropyRate += point.missedPenalty;
        }
    },

    // ── Ending Fork (after Event 6) ──

    _activateEndingFork(point) {
        // Show ending fork visual
        Events.show({ type: 'endingFork' });

        // Show ending narrative
        if (point.endingNarrative) {
            Timeline.showNarrative(point.endingNarrative, 10000);
        }

        // Activate swipe for ending selection (no timeout — player can think)
        Touch.activate('swipe', {
            onSwipe: (direction) => {
                this._resolveEndingFork(point, direction);
            }
        });
    },

    _resolveEndingFork(point, direction) {
        Touch.deactivate();

        const results = point.endingSwipeResults || {};
        const result = results[direction] || results.center || {};

        // Set ending choice
        if (result.ending) {
            STATE.act4Choice = result.ending;
        }

        // Resolve ending fork visual
        Events.resolve({ type: 'endingFork' }, { direction: direction });

        // Resume from train stop
        STATE.trainStopped = false;
        gsap.to(STATE, {
            speed: CONFIG.phaseVisuals.act4.speed,
            duration: 2, ease: 'power2.in'
        });
        STATE.entropy = Math.max(STATE.entropy, CONFIG.phases.act5.min);

        // Flash
        const flash = Renderer.getFlash();
        gsap.to(flash, { alpha: 0.2, duration: 0.15, yoyo: true, repeat: 1 });

        Sound.playResolve();
    },

    // ── Ending Screen ──

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
        Touch.deactivate();
        choiceContainer.classList.remove('visible');
        endingOverlay.classList.remove('visible');
        choiceContainer.innerHTML = '';
        endingOverlay.innerHTML = '';
    }
};
