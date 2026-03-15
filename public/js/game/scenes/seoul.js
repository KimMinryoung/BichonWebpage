// Babel Express scene definition: 6 intervention points + ending fork.
// Drone observation model: TAP to illuminate, SWIPE to steer.
// Supports en/ko via <html lang> attribute.

const SCENE_I18N = {
    en: {
        naming: {
            narrative: 'A spark on the rooftop. The fire is small — for now. Shine your light to suppress it.'
        },
        seaOfFire: {
            narrative: 'The sea burns. Between the tankers, small lifeboats drift. Touch them — shine a light for rescue.'
        },
        fallOfEden: {
            narrative: 'Two horizons diverge. A burning port to the left. A coast of new energy to the right. Swipe to steer.'
        },
        commands: {
            narrative: 'The infection spreads — window by window, the city turns green. Touch the infected lights to purify them.'
        },
        shadowLegion: {
            narrative: 'Three lights ahead. Olive — the Pentagon. Cyan — the server farms. Red — the Eastern tower. Swipe to choose your path.'
        },
        unnamedGeneration: {
            narrative: 'The city is empty. Nothing responds. Nothing remains — except a rusted swing in a forgotten playground.',
            endingNarrative: 'Three paths on the horizon. A beam of light ahead. A city of many colors to the left. Green grass to the right.'
        }
    },
    ko: {
        naming: {
            narrative: '옥상에서 불꽃이 튄다. 아직은 작은 불. 빛을 비춰 진압하라.'
        },
        seaOfFire: {
            narrative: '바다가 불탄다. 유조선 사이로 작은 구명보트가 떠다닌다. 빛을 비춰 구조 신호를 보내라.'
        },
        fallOfEden: {
            narrative: '두 수평선이 갈라진다. 왼쪽에는 불타는 항구. 오른쪽에는 대체 에너지 해안. 스와이프하여 방향을 정하라.'
        },
        commands: {
            narrative: '감염이 퍼진다 — 창문 하나씩, 도시가 녹색으로 물든다. 감염된 빛을 터치하여 정화하라.'
        },
        shadowLegion: {
            narrative: '앞에 세 줄기 빛이 보인다. 올리브 — 펜타곤. 시안 — 서버팜. 적색 — 동방의 탑. 스와이프하여 길을 고르라.'
        },
        unnamedGeneration: {
            narrative: '도시가 비었다. 아무것도 반응하지 않는다. 아무것도 남지 않았다 — 잊힌 놀이터의 녹슨 그네를 제외하면.',
            endingNarrative: '수평선에 세 가지 길이 보인다. 정면에 빛줄기. 왼쪽에 여러 빛깔의 도시. 오른쪽에 푸른 풀밭.'
        }
    }
};

function getSceneText(key) {
    const lang = document.documentElement.lang === 'ko' ? 'ko' : 'en';
    return SCENE_I18N[lang][key];
}

const SceneSeoul = {
    name: 'babel-express',

    get interventions() {
        const naming = getSceneText('naming');
        const seaOfFire = getSceneText('seaOfFire');
        const fallOfEden = getSceneText('fallOfEden');
        const commands = getSceneText('commands');
        const shadowLegion = getSceneText('shadowLegion');
        const unnamedGen = getSceneText('unnamedGeneration');

        return [
            // ── Act 1 — Event 1: Building Fire (entropy 12) — TAP ──
            {
                entropy: 12,
                interactionType: 'tap',
                visual: { type: 'naming' },
                narrative: naming.narrative,
                duration: 10000,
                tapReward: { entropyDelta: -0.05 },
                missedPenalty: 0.1,
                correctThreshold: 0.5
            },

            // ── Act 2 — Event 2: Lifeboat Rescue (entropy 30) — TAP ──
            {
                entropy: 30,
                interactionType: 'tap',
                visual: { type: 'seaOfFire' },
                narrative: seaOfFire.narrative,
                duration: 10000,
                tapReward: { entropyDelta: -0.04 },
                missedPenalty: 0.08,
                correctThreshold: 0.3
            },

            // ── Act 2 — Event 3: Direction Fork (entropy 40) — SWIPE ──
            {
                entropy: 40,
                interactionType: 'swipe',
                visual: { type: 'fallOfEden' },
                narrative: fallOfEden.narrative,
                duration: 5000,
                swipeResults: {
                    left:   { id: 'warPath',   entropyDelta: 0.04,  correct: false },
                    right:  { id: 'altEnergy', entropyDelta: -0.06, correct: true },
                    center: { id: 'straight',  entropyDelta: 0.08,  correct: false },
                    down:   { id: 'straight',  entropyDelta: 0.08,  correct: false }
                },
                missedPenalty: 0.1
            },

            // ── Act 3 — Event 4: Infection (entropy 55) — INFECTION ──
            {
                entropy: 55,
                interactionType: 'infection',
                visual: { type: 'commands' },
                narrative: commands.narrative,
                duration: 25000,
                tapReward: { entropyDelta: -0.01 },
                missedPenalty: 0.15,
                correctThreshold: 0.4
            },

            // ── Act 3 — Event 5: Three Lights (entropy 67) — SWIPE ──
            {
                entropy: 67,
                interactionType: 'swipe',
                visual: { type: 'shadowLegion' },
                narrative: shadowLegion.narrative,
                duration: 5000,
                swipeResults: {
                    left:   { id: 'pentagon',   entropyDelta: 0.03,  correct: false },
                    right:  { id: 'china',      entropyDelta: 0.05,  correct: false },
                    center: { id: 'serverFarm', entropyDelta: -0.08, correct: true },
                    down:   { id: 'serverFarm', entropyDelta: -0.08, correct: true }
                },
                missedPenalty: 0.12
            },

            // ── Act 4 — Event 6: Empty City (entropy 80) — TAP + ending fork ──
            {
                entropy: 80,
                interactionType: 'tap',
                visual: { type: 'unnamedGeneration' },
                narrative: unnamedGen.narrative,
                duration: 10000,
                trainStop: true,
                tapReward: { entropyDelta: 0 },
                missedPenalty: 0,
                correctThreshold: 0,
                // After tap phase completes, switch to ending fork
                endingFork: true,
                endingNarrative: unnamedGen.endingNarrative,
                endingSwipeResults: {
                    center: { ending: 'light' },       // straight = AI's path
                    left:   { ending: 'passengers' },   // new city = new tongues
                    right:  { ending: 'walk' },          // grassland = pedestrian
                    down:   { ending: 'walk' }           // land = pedestrian
                }
            }
        ];
    }
};
