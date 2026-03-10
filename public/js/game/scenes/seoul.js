// Babel Express scene definition: 6 intervention points across 5 acts.
// Supports en/ko via <html lang> attribute.

const SCENE_I18N = {
    en: {
        naming: {
            prompt: 'The light splits in two. One bears a shield, the other a sword. Which name do you call first?',
            choices: ['Call the Shield first', 'Call the Sword first', 'Call neither']
        },
        seaOfFire: {
            prompt: 'The sea burns. The blood that moves the world is aflame. What do you do?',
            choices: ['Create new blood — diversify energy', 'Go to the one who holds the heart — US LNG contract', 'Do nothing']
        },
        fallOfEden: {
            // Passive event — no choices. Pure visual experience.
            narrative: 'When an old king falls, no new king rises — only chaos around the throne.'
        },
        commands: {
            prompt: 'Three powers command the tower in three tongues. The only voice that said "refuse" was silenced.',
            choices: ['Protect the silenced voice — international AI treaty', 'Command the tower louder — full military AI', 'Do nothing']
        },
        shadowLegion: {
            prompt: 'Shadows without footsteps knock on a thousand doors at once. The city is being scanned.',
            choices: ['Raise mirrors — AI honeypot reverse-analysis', 'Raise walls — full network shutdown', 'Do nothing']
        },
        unnamedGeneration: {
            prompt: 'The train has stopped. Not because there is no track ahead, but because there will be no one to ride it.',
            narrative: 'The light can lay the track. The light can drive the train. Then why are people needed? — No, where does a train without people go?',
            choices: ['Leave it to the light', 'Take on new passengers', 'Get off and walk']
        }
    },
    ko: {
        naming: {
            prompt: '빛이 두 갈래로 갈라진다. 하나는 방패, 하나는 검. 어느 이름을 먼저 부를 것인가?',
            choices: ['방패를 먼저 부른다', '검을 먼저 부른다', '부르지 않는다']
        },
        seaOfFire: {
            prompt: '바다가 불탄다. 세계를 움직이는 피가 불타고 있다. 어떻게 하겠는가?',
            choices: ['새로운 피를 만든다 — 에너지 다변화', '심장을 쥔 자에게 간다 — 미국 LNG 계약', '아무것도 하지 않는다']
        },
        fallOfEden: {
            narrative: '오래된 왕이 쓰러지면 새 왕이 오는 것이 아니라, 왕좌를 둘러싼 혼돈이 온다.'
        },
        commands: {
            prompt: '세 권력이 세 언어로 탑에게 명령한다. "거부하라"고 말한 유일한 목소리는 침묵당했다.',
            choices: ['침묵당한 목소리를 지킨다 — 국제 AI 조약', '탑에게 더 큰 소리로 명령한다 — AI 군사 전면 허용', '아무것도 하지 않는다']
        },
        shadowLegion: {
            prompt: '발소리 없는 그림자가 천 개의 문을 동시에 두드린다. 도시가 스캔당하고 있다.',
            choices: ['거울을 세운다 — AI 허니팟 역분석', '성벽을 높인다 — 네트워크 전면 차단', '아무것도 하지 않는다']
        },
        unnamedGeneration: {
            prompt: '기관차가 멈추었다. 앞에 선로가 없어서가 아니라, 선로를 달릴 사람이 없을 것이기 때문이다.',
            narrative: '빛이 선로를 깔 수 있다. 빛이 기관차를 운전할 수도 있다. 그러면 사람은 왜 필요한가? — 아니, 사람이 없는 기관차는 어디로 가는가?',
            choices: ['빛에게 맡긴다', '새로운 승객을 태운다', '내린다']
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
            // Act 1 — Event 1: The Naming (entropy 12)
            {
                entropy: 12,
                prompt: naming.prompt,
                visual: { type: 'naming' },
                choices: [
                    { id: 'shield', label: naming.choices[0], entropyDelta: -0.05, correct: true },
                    { id: 'sword',  label: naming.choices[1], entropyDelta: 0.04, correct: false },
                    { id: 'neither', label: naming.choices[2], entropyDelta: 0.08, correct: false }
                ],
                missedPenalty: 0.1
            },

            // Act 2 — Event 2: Sea of Fire (entropy 30)
            {
                entropy: 30,
                prompt: seaOfFire.prompt,
                visual: { type: 'seaOfFire' },
                choices: [
                    { id: 'newBlood', label: seaOfFire.choices[0], entropyDelta: -0.06, correct: true },
                    { id: 'oldBlood', label: seaOfFire.choices[1], entropyDelta: 0.02, correct: false },
                    { id: 'nothing2', label: seaOfFire.choices[2], entropyDelta: 0.1, correct: false }
                ],
                missedPenalty: 0.12
            },

            // Act 2 — Event 3: Fall of Eden (entropy 40) — PASSIVE, no choice
            {
                entropy: 40,
                prompt: null,  // no prompt shown
                visual: { type: 'fallOfEden' },
                passive: true,  // auto-resolves
                narrative: fallOfEden.narrative,
                choices: [],
                missedPenalty: 0
            },

            // Act 3 — Event 4: Commands to the Tower (entropy 55)
            {
                entropy: 55,
                prompt: commands.prompt,
                visual: { type: 'commands' },
                choices: [
                    { id: 'treaty',  label: commands.choices[0], entropyDelta: -0.07, correct: true },
                    { id: 'military', label: commands.choices[1], entropyDelta: 0.05, correct: false },
                    { id: 'nothing4', label: commands.choices[2], entropyDelta: 0.1, correct: false }
                ],
                missedPenalty: 0.12
            },

            // Act 3 — Event 5: Shadow Legion (entropy 67)
            {
                entropy: 67,
                prompt: shadowLegion.prompt,
                visual: { type: 'shadowLegion' },
                choices: [
                    { id: 'mirror', label: shadowLegion.choices[0], entropyDelta: -0.08, correct: true },
                    { id: 'wall',   label: shadowLegion.choices[1], entropyDelta: 0.03, correct: false },
                    { id: 'nothing5', label: shadowLegion.choices[2], entropyDelta: 0.12, correct: false }
                ],
                missedPenalty: 0.15
            },

            // Act 4 — Event 6: The Unnamed Generation (entropy 80) — TRAIN STOPS
            {
                entropy: 80,
                prompt: unnamedGen.prompt,
                visual: { type: 'unnamedGeneration' },
                narrative: unnamedGen.narrative,
                trainStop: true,  // special: train comes to a halt
                noTimeout: true,  // no time limit — player can think
                choices: [
                    { id: 'light',      label: unnamedGen.choices[0], entropyDelta: 0, correct: null, ending: 'light' },
                    { id: 'passengers', label: unnamedGen.choices[1], entropyDelta: 0, correct: null, ending: 'passengers' },
                    { id: 'walk',       label: unnamedGen.choices[2], entropyDelta: 0, correct: null, ending: 'walk' }
                ],
                missedPenalty: 0
            }
        ];
    }
};
