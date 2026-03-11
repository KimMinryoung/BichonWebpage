// Act transitions and GSAP timeline sequences driven by entropy.
// 5-act structure: Genesis → Deluge → Babel → Empty Cradle → Endings

let currentAct = 'act1';
let actTween = null;

const Timeline = {
    check() {
        if (STATE.ended) return;

        const e = STATE.entropy;
        let newAct = 'act1';

        if (e >= CONFIG.phases.act5.min) {
            newAct = 'act5';
        } else if (e >= CONFIG.phases.act4.min) {
            newAct = 'act4';
        } else if (e >= CONFIG.phases.act3.min) {
            newAct = 'act3';
        } else if (e >= CONFIG.phases.act2.min) {
            newAct = 'act2';
        }

        STATE.act = newAct;
        STATE.phase = newAct;  // keep in sync for sound/effects

        if (newAct !== currentAct) {
            this._transitionTo(newAct);

            // Biome transitions (fire once on act change, not every frame)
            if (newAct === 'act1') {
                STATE.biome = 'city';
                tweenBiomeGround('city', 'act1', 4);
            } else if (newAct === 'act2') {
                STATE.biome = 'sea';
                tweenBiomeGround('sea', 'act2', 5);
            } else if (newAct === 'act3') {
                STATE.biome = 'city';
                tweenBiomeGround('city', 'act3', 5);
            } else if (newAct === 'act4') {
                STATE.biome = 'desolate';
                tweenBiomeGround('desolate', 'act4', 6);
            }

            currentAct = newAct;
        }

        // Track crack level increases with entropy
        STATE.trackCrackLevel = Math.max(0, (e - 30) / 70);

        // AI beam grows with acts
        if (newAct === 'act1') {
            STATE.aiBeamWidth = 1.0;
        } else if (newAct === 'act2') {
            STATE.aiBeamWidth = 1.5;
        } else if (newAct === 'act3') {
            STATE.aiBeamWidth = 2.5;
        } else if (newAct === 'act4') {
            STATE.aiBeamWidth = 1.0;
            STATE.aiBeamAlpha = Math.max(0.1, 0.6 - (e - 73) / 17 * 0.5);
        }

        // Check ending conditions in Act 5
        if (newAct === 'act5' && !STATE.ended) {
            this._triggerEnding();
        }
    },

    _transitionTo(act) {
        const actData = CONFIG.acts[act];
        const visuals = CONFIG.phaseVisuals[act];

        if (!actData || !visuals) return;

        if (actTween) actTween.kill();

        const sky = actData.sky;
        const fog = actData.fogColor;
        const edge = actData.edge;
        const edgeR = (edge >> 16) & 0xFF;
        const edgeG = (edge >> 8) & 0xFF;
        const edgeB = edge & 0xFF;

        // Update AI beam color
        STATE.aiBeamColor = actData.ai.core;

        actTween = gsap.to(STATE, {
            speed: visuals.speed,
            focalLength: visuals.focalLength,
            shake: visuals.shake,
            motionBlur: visuals.motionBlur,
            // Sky gradient
            skyTopR: sky.top.r, skyTopG: sky.top.g, skyTopB: sky.top.b,
            skyMidR: sky.mid.r, skyMidG: sky.mid.g, skyMidB: sky.mid.b,
            skyBotR: sky.glow.r, skyBotG: sky.glow.g, skyBotB: sky.glow.b,
            // Fog
            fogR: fog.r, fogG: fog.g, fogB: fog.b,
            // Road edge
            roadEdgeR: edgeR, roadEdgeG: edgeG, roadEdgeB: edgeB,
            duration: 4,
            ease: 'power2.inOut'
        });

        // Show act narrative text
        this._showActNarrative(act);
    },

    _showActNarrative(act) {
        const lang = document.documentElement.lang === 'ko' ? 'ko' : 'en';
        const narratives = ACT_NARRATIVES[lang];
        const text = narratives[act];
        if (!text) return;

        STATE.narrativeText = text;
        gsap.killTweensOf(STATE, 'narrativeAlpha');
        gsap.to(STATE, { narrativeAlpha: 1, duration: 2, ease: 'power2.out' });
        gsap.to(STATE, {
            narrativeAlpha: 0, duration: 2,
            delay: CONFIG.timing.narrativeDuration / 1000,
            ease: 'power2.in'
        });
    },

    // Show narrative text (can be called externally by events)
    showNarrative(text, duration) {
        STATE.narrativeText = text;
        gsap.killTweensOf(STATE, 'narrativeAlpha');
        gsap.to(STATE, { narrativeAlpha: 1, duration: 1.5, ease: 'power2.out' });
        gsap.to(STATE, {
            narrativeAlpha: 0, duration: 1.5,
            delay: (duration || CONFIG.timing.narrativeDuration) / 1000,
            ease: 'power2.in'
        });
    },

    _triggerEnding() {
        STATE.ended = true;

        const choice = STATE.act4Choice;
        const successRate = STATE.totalInterventions > 0
            ? STATE.correctChoices / STATE.totalInterventions : 0;

        if (choice === 'light') {
            // Ending A: Transparent Road
            this._endingTransparentRoad(successRate >= 0.5);
        } else if (choice === 'passengers') {
            // Ending B: New Tongues
            this._endingNewTongues(successRate >= 0.5);
        } else if (choice === 'walk') {
            // Ending C: The Pedestrian
            this._endingPedestrian();
        } else {
            // Ending D: Inertia (default if no choice or failed)
            this._endingInertia();
        }
    },

    _endingTransparentRoad(success) {
        const flash = Renderer.getFlash();
        const pal = CONFIG.endings.transparent;

        // Sky goes pure cyan-white
        gsap.to(STATE, {
            skyTopR: 0x00, skyTopG: 0x38, skyTopB: 0x48,
            skyMidR: 0x00, skyMidG: 0xc8, skyMidB: 0xe8,
            skyBotR: 0xFF, skyBotG: 0xFF, skyBotB: 0xFF,
            speed: 200, shake: 0, aiBeamAlpha: 1, aiBeamWidth: 5,
            duration: 6, ease: 'power2.out'
        });
        STATE.aiBeamColor = 0x00c8e8;

        gsap.to(flash, { alpha: 0.3, duration: 0.5, delay: 4, yoyo: true, repeat: 1 });

        gsap.delayedCall(7, () => {
            Intervention.showEnding('transparent');
        });
    },

    _endingNewTongues(success) {
        const flash = Renderer.getFlash();

        // Sky goes warm mixed colors
        gsap.to(STATE, {
            skyTopR: 0x2a, skyTopG: 0x3a, skyTopB: 0x50,
            skyMidR: 0x4a, skyMidG: 0x7a, skyMidB: 0x3f,
            skyBotR: 0xe0, skyBotG: 0x70, skyBotB: 0x20,
            speed: 25, shake: 0, aiBeamAlpha: 0.3, aiBeamWidth: 1,
            duration: 5, ease: 'power2.out'
        });

        gsap.to(flash, { alpha: 0.15, duration: 0.3, delay: 3, yoyo: true, repeat: 1 });

        gsap.delayedCall(6, () => {
            Intervention.showEnding('newTongues');
        });
    },

    _endingPedestrian() {
        // Train stops, camera descends
        gsap.to(STATE, {
            skyTopR: 0x60, skyTopG: 0x80, skyTopB: 0x50,
            skyMidR: 0x8b, skyMidG: 0x5a, skyMidB: 0x2b,
            skyBotR: 0xc4, skyBotG: 0xa0, skyBotB: 0x60,
            speed: 0, shake: 0, aiBeamAlpha: 0,
            duration: 4, ease: 'power3.out'
        });

        gsap.delayedCall(5, () => {
            Intervention.showEnding('pedestrian');
        });
    },

    _endingInertia() {
        const flash = Renderer.getFlash();

        // Accelerate out of control
        gsap.to(STATE, {
            speed: 300, shake: 40, focalLength: 40,
            aiBeamAlpha: 1, aiBeamWidth: 8,
            duration: 3
        });
        STATE.aiBeamColor = 0x39ff14;

        // Screen goes black
        gsap.to(flash, {
            alpha: 1, duration: 2, delay: 3,
            ease: 'power4.in',
            onComplete: () => {
                Intervention.showEnding('inertia');
            }
        });
    },

    // Called when player makes the correct choice to bring hope
    triggerHopeEnding() {
        // Not used in Babel Express — endings are determined by Act 4 choice
    },

    reset() {
        currentAct = 'act1';
        if (actTween) actTween.kill();
        actTween = null;
    }
};

// Act intro narratives
const ACT_NARRATIVES = {
    ko: {
        act1: '처음에 빛이 있었다. 빛은 스스로 길을 만들었고, 기차는 그 길 위를 달렸다.',
        act2: '대홍수는 물이 아니라 불로 왔다. 불은 기름을 먹고 자랐고, 기름은 세계를 움직이는 피였다.',
        act3: '사람들은 탑을 쌓았다. 탑은 하늘에 닿았다. 그러자 각자의 언어로 탑에게 다른 것을 명령했다.',
        act4: '가장 큰 파국에는 소리가 없다. 아무도 태어나지 않는 세계는 조용히 꺼진다.'
    },
    en: {
        act1: 'In the beginning there was light. The light made its own path, and the train rode upon it.',
        act2: 'The deluge came not as water, but as fire. Fire fed on oil, and oil was the blood that moved the world.',
        act3: 'They built a tower. The tower reached the sky. Then each commanded the tower in a different tongue.',
        act4: 'The greatest catastrophe makes no sound. A world where no one is born simply fades to silence.'
    }
};
