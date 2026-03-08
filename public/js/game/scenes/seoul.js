// Seoul scene definition: intervention points for the 1-minute demo.
// Supports en/ko via <html lang> attribute.

const SCENE_I18N = {
    en: {
        bridge: {
            prompt: 'Cracks are spreading across the old bridge. What do you do?',
            choices: ['Reinforce the bridge', 'Ignore and move on']
        },
        quake: {
            prompt: 'The ground is trembling. Buildings sway in the distance.',
            choices: ['Evacuate the district', 'Barricade the streets', 'Wait and observe']
        },
        blackout: {
            prompt: 'The power grid is failing. Darkness spreads across the city.',
            choices: ['Restore the grid', 'Abandon the city']
        }
    },
    ko: {
        bridge: {
            prompt: '오래된 다리에 균열이 퍼지고 있습니다. 어떻게 하시겠습니까?',
            choices: ['다리를 보강한다', '무시하고 지나간다']
        },
        quake: {
            prompt: '땅이 흔들리고 있습니다. 멀리서 건물들이 흔들립니다.',
            choices: ['주민을 대피시킨다', '거리를 봉쇄한다', '지켜본다']
        },
        blackout: {
            prompt: '전력망이 무너지고 있습니다. 어둠이 도시를 뒤덮습니다.',
            choices: ['전력을 복구한다', '도시를 포기한다']
        }
    }
};

function getSceneText(key) {
    const lang = document.documentElement.lang === 'ko' ? 'ko' : 'en';
    return SCENE_I18N[lang][key];
}

const SceneSeoul = {
    name: 'seoul',

    get interventions() {
        const bridge = getSceneText('bridge');
        const quake = getSceneText('quake');
        const blackout = getSceneText('blackout');

        return [
            {
                entropy: 20,
                prompt: bridge.prompt,
                visual: { type: 'bridge' },
                choices: [
                    { id: 'a1', label: bridge.choices[0], entropyDelta: -0.4, correct: true },
                    { id: 'a2', label: bridge.choices[1], entropyDelta: 0.5, correct: false }
                ],
                missedPenalty: 0.6
            },
            {
                entropy: 45,
                prompt: quake.prompt,
                visual: { type: 'quake' },
                choices: [
                    { id: 'b1', label: quake.choices[0], entropyDelta: -0.5, correct: true },
                    { id: 'b2', label: quake.choices[1], entropyDelta: 0.2, correct: false },
                    { id: 'b3', label: quake.choices[2], entropyDelta: 0.6, correct: false }
                ],
                missedPenalty: 0.8
            },
            {
                entropy: 70,
                prompt: blackout.prompt,
                visual: { type: 'blackout' },
                choices: [
                    { id: 'c1', label: blackout.choices[0], entropyDelta: -0.8, correct: true },
                    { id: 'c2', label: blackout.choices[1], entropyDelta: 0.4, correct: false }
                ],
                missedPenalty: 1.0
            }
        ];
    }
};
