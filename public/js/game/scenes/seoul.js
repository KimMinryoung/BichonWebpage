// Seoul scene definition: intervention points for the 1-minute demo.

const SceneSeoul = {
    name: 'seoul',

    interventions: [
        {
            entropy: 20,
            prompt: 'Cracks are spreading across the old bridge. What do you do?',
            visual: { type: 'bridge' },
            choices: [
                { id: 'a1', label: 'Reinforce the bridge', entropyDelta: -0.4, correct: true },
                { id: 'a2', label: 'Ignore and move on', entropyDelta: 0.5, correct: false }
            ],
            missedPenalty: 0.6
        },
        {
            entropy: 45,
            prompt: 'The ground is trembling. Buildings sway in the distance.',
            visual: { type: 'quake' },
            choices: [
                { id: 'b1', label: 'Evacuate the district', entropyDelta: -0.5, correct: true },
                { id: 'b2', label: 'Barricade the streets', entropyDelta: 0.2, correct: false },
                { id: 'b3', label: 'Wait and observe', entropyDelta: 0.6, correct: false }
            ],
            missedPenalty: 0.8
        },
        {
            entropy: 70,
            prompt: 'The power grid is failing. Darkness spreads across the city.',
            visual: { type: 'blackout' },
            choices: [
                { id: 'c1', label: 'Restore the grid', entropyDelta: -0.8, correct: true },
                { id: 'c2', label: 'Abandon the city', entropyDelta: 0.4, correct: false }
            ],
            missedPenalty: 1.0
        }
    ]
};
