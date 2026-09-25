// Front lines for the Battle of Stalingrad event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/stalingrad.json. It reuses the Great
// Patriotic War lines north of Livny (great-patriotic-war.js) and draws the
// southern front for each stage of the campaign: before Blau, the drive to
// the Don, the Volga reached, the eve of Uranus, the pocket closed, Operation
// Ring and the surrender. The Stalingrad pocket and the Millerovo garrison
// are Axis pockets carved out of the Soviet side.

const war = require('./great-patriotic-war');

const { SHARED, phaseOf, LINES, LABELS } = war.parts;

// The 1942 war line down to Livny, shared by every stage here.
const at = (lat, lng) => {
    const i = LINES['1942.11'].findIndex(p => p[0] === lat && p[1] === lng);
    if (i < 0) throw new Error(`stalingrad: ${lat},${lng} is not on the 1942 line`);
    return i;
};
const NORTH = LINES['1942.11'].slice(0, at(52.4, 37.8) + 1);
const CAUCASUS_1942 = LINES['1942.11'].slice(at(46.0, 45.6));

const SEVASTOPOL = { circle: [44.62, 33.6, 0.22] };
// Beketovka, south of the city, stayed with the Soviet 64th Army.
const POCKET_1942 = [[48.95, 43.55], [48.95, 44.45], [48.8, 44.55], [48.66, 44.55], [48.62, 44.4], [48.55, 44.1],
    [48.5, 43.8], [48.7, 43.5]];
const POCKET_1943 = [[48.9, 43.85], [48.9, 44.47], [48.66, 44.55], [48.62, 44.4], [48.56, 44.2], [48.6, 43.9]];
const MILLEROVO = { circle: [48.92, 40.4, 0.15] };

const S = {
    '1942.05': [[52.0, 37.6], [51.6, 37.4], [51.2, 37.3], [50.6, 37.0], [50.3, 36.9], [49.9, 36.9], [49.5, 36.7],
        [49.1, 36.4], [48.9, 36.2], [48.6, 36.6], [48.5, 37.3], [48.3, 38.2], [47.8, 38.8], [47.3, 38.9],
        [46.8, 38.3], [45.6, 36.8], [45.3, 35.5], [44.5, 35.5]],
    '1942.07': [[52.0, 38.3], [51.8, 38.8], [51.67, 39.2], [51.2, 39.4], [50.9, 39.6], [50.3, 40.4], [49.9, 40.8],
        [49.6, 41.5], [49.3, 42.2], [48.9, 42.3], [48.4, 42.4], [47.9, 42.1], [47.5, 41.0], [47.4, 40.3],
        [47.3, 39.8], [47.1, 39.2], [46.5, 38.0], [45.4, 36.65], [44.5, 36.6]],
    '1942.08': [[52.0, 38.3], [51.8, 38.8], [51.67, 39.2], [51.2, 39.4], [50.9, 39.6], [50.3, 40.4], [49.8, 41.3],
        [49.55, 42.7], [49.35, 43.1], [49.0, 43.7], [48.9, 44.1], [48.84, 44.47], [48.78, 44.35], [48.75, 43.9],
        [48.62, 43.75], [48.5, 43.95], [48.3, 44.1], [48.13, 44.25], [47.8, 44.4], [47.0, 44.6], [46.3, 44.6],
        [45.3, 44.3], [44.8, 44.1], [44.3, 44.2], [43.9, 43.2], [44.0, 42.2], [44.2, 41.0], [44.4, 39.7],
        [44.8, 38.3], [44.72, 37.8], [44.5, 37.6]],
    '1942.11.23': [[52.0, 38.4], [51.67, 39.2], [50.9, 39.6], [50.3, 40.4], [49.8, 41.3], [49.62, 41.73],
        [49.3, 42.0], [48.9, 42.2], [48.5, 42.8], [48.35, 43.1], [48.2, 43.4], [47.9, 43.9], [47.5, 44.2],
        [47.0, 44.5], [46.3, 44.7], ...CAUCASUS_1942],
    '1943.01.10': [[52.0, 38.4], [51.67, 39.2], [50.9, 39.6], [50.2, 39.7], [49.5, 39.8], [49.1, 40.1],
        [48.7, 40.9], [48.25, 41.3], [48.1, 41.9], [47.8, 42.0], [47.2, 42.5], [46.6, 42.9], [45.8, 43.3],
        [45.0, 43.5], [44.3, 43.4], [44.6, 42.0], [44.6, 40.1], [44.4, 39.3], [44.72, 37.8], [44.5, 37.6]],
    '1943.02.02': [[52.2, 37.4], [51.9, 37.4], [51.5, 37.9], [50.9, 37.8], [50.21, 38.0], [49.8, 38.0],
        [49.3, 38.4], [48.6, 39.3], [48.0, 39.8], [47.5, 40.0], [47.2, 39.85], [46.5, 39.6], [45.9, 39.5],
        [45.3, 39.3], [44.9, 39.0], [44.6, 38.5], [44.72, 37.8], [44.5, 37.6]],
};

module.exports = {
    eventId: 'stalingrad',
    ...SHARED,
    sides: war.sides,
    note: war.note,
    sources: war.sources,
    phases: [
        phaseOf('1942.05', { ko: '하르코프 공세 직전', en: 'Before the Kharkov offensive' }, [...NORTH, ...S['1942.05']],
            { soviet: [SEVASTOPOL] }),
        phaseOf('1942.07', { ko: '돈강 굽이로 (7.17)', en: 'Into the Don bend (17 July)' }, [...NORTH, ...S['1942.07']]),
        phaseOf('1942.08', { ko: '볼가에 닿은 독일군 (8.23)', en: 'The Germans reach the Volga (23 Aug)' },
            [...NORTH, ...S['1942.08']]),
        phaseOf('1942.11', LABELS['1942.11'], LINES['1942.11']),
        phaseOf('1942.11.23', { ko: '칼라치에서 포위가 닫히다', en: 'The ring closes at Kalach' },
            [...NORTH, ...S['1942.11.23']], { axis: [POCKET_1942] }),
        phaseOf('1943.01.10', { ko: '고리 작전 개시', en: 'Operation Ring begins' }, [...NORTH, ...S['1943.01.10']],
            { axis: [POCKET_1943, MILLEROVO] }),
        phaseOf('1943.02.02', { ko: '제6군의 항복', en: 'The Sixth Army surrenders' }, [...NORTH, ...S['1943.02.02']]),
    ],
};
