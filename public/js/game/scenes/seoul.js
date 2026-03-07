// Seoul scene definition: intervention points for the 1-minute demo.

const SceneSeoul = {
    name: 'seoul',

    interventions: [
        {
            entropy: 20,
            choices: [
                { id: 'a1', label: 'Reinforce', entropyDelta: -0.4, correct: true },
                { id: 'a2', label: 'Ignore', entropyDelta: 0.5, correct: false }
            ],
            missedPenalty: 0.6
        },
        {
            entropy: 45,
            choices: [
                { id: 'b1', label: 'Evacuate', entropyDelta: -0.5, correct: true },
                { id: 'b2', label: 'Barricade', entropyDelta: 0.2, correct: false },
                { id: 'b3', label: 'Wait', entropyDelta: 0.6, correct: false }
            ],
            missedPenalty: 0.8
        },
        {
            entropy: 70,
            choices: [
                { id: 'c1', label: 'Restore', entropyDelta: -0.8, correct: true },
                { id: 'c2', label: 'Abandon', entropyDelta: 0.4, correct: false }
            ],
            missedPenalty: 1.0
        }
    ]
};
