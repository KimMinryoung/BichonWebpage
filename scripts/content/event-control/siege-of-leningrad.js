// Front lines for the Siege of Leningrad event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/siege-of-leningrad.json. It reuses the
// Great Patriotic War lines (great-patriotic-war.js) and adds the dates the
// siege turns on: the approach at the end of August 1941, the Tikhvin salient
// that cut the rail route to the ice road, and the lifting in January 1944.
// Hanko, the Soviet base leased from Finland, held out until December 1941.

const war = require('./great-patriotic-war');

const { SHARED, phaseOf, LINES, LABELS, EXTRA, FINNISH_FRONT, LENINGRAD_1941, ORANIENBAUM } = war.parts;

const HANKO = { circle: [59.83, 22.95, 0.15] };

// From a point on a war line to its end.
const from = (line, point) => {
    const i = line.findIndex(p => p[0] === point[0] && p[1] === point[1]);
    if (i < 0) throw new Error(`siege-of-leningrad: ${point} is not on the war line`);
    return line.slice(i);
};

const LINE_1941_08 = [[70.4, 32.3], [69.4, 32.0], [67.0, 30.6], [66.0, 31.6], [64.8, 32.7], [63.6, 33.6],
    [62.5, 33.3], [61.6, 33.0], [61.1, 32.85], [60.55, 30.7], [60.3, 30.2], [60.15, 29.95], [60.12, 29.9],
    [59.85, 28.6], [59.6, 28.7], [59.45, 29.6], [59.45, 30.0], [59.5, 30.4], [59.55, 30.8], [59.62, 30.9],
    [59.75, 31.05], [59.7, 31.3], [59.55, 31.7], [59.3, 31.8], [59.12, 31.9], [58.8, 31.8], [58.55, 31.5],
    [58.3, 31.6], [58.0, 31.8], [57.9, 31.9], [57.5, 31.8], [57.2, 31.5], [56.9, 31.4], [56.5, 31.6],
    [56.2, 31.9], ...from(LINES['1941.09'], [55.8, 32.6])];

const LINE_1941_11 = [...FINNISH_FRONT, ...LENINGRAD_1941, [59.85, 31.9], [59.8, 32.0], [59.65, 32.4],
    [59.7, 32.8], [59.75, 33.4], [59.6, 33.7], [59.4, 33.4], [59.3, 32.9], [59.2, 32.6], [59.0, 32.0],
    [58.6, 31.55], ...from(LINES['1941.12'], [58.1, 31.9])];

const LINE_1944_01 = [...FINNISH_FRONT, [59.8, 28.4], [59.55, 28.9], [59.4, 29.4], [59.35, 29.9], [59.3, 30.4],
    [59.25, 30.9], [59.3, 31.2], [59.15, 31.5], [59.0, 31.6], [58.7, 31.3], [58.5, 31.0], [58.2, 31.0],
    [58.0, 31.2], ...from(LINES['1943.12'], [57.3, 30.2])];

module.exports = {
    eventId: 'siege-of-leningrad',
    ...SHARED,
    sides: war.sides,
    note: war.note,
    sources: war.sources,
    phases: [
        phaseOf('1941.06', LABELS['1941.06'], LINES['1941.06'], { soviet: [HANKO] }),
        phaseOf('1941.08', { ko: '루가선 돌파와 므가 함락 (8.30)', en: 'The Luga line broken; Mga falls (30 Aug)' },
            LINE_1941_08, { soviet: [HANKO] }),
        phaseOf('1941.09', { ko: '봉쇄망의 완성', en: 'The ring closes' }, LINES['1941.09'],
            { soviet: [ORANIENBAUM, HANKO] }),
        phaseOf('1941.11', { ko: '티흐빈 함락과 빙상 생명선', en: 'Tikhvin falls; the ice road opens' },
            LINE_1941_11, { soviet: [ORANIENBAUM] }),
        phaseOf('1941.12', { ko: '티흐빈 탈환', en: 'Tikhvin retaken' }, LINES['1941.12'], EXTRA['1941.12']),
        phaseOf('1943.01', { ko: '육상 통로의 개통 (이스크라 작전)', en: 'The land corridor reopened (Operation Iskra)' },
            LINES['1943.07'], EXTRA['1943.07']),
        phaseOf('1944.01', { ko: '봉쇄의 종결 (1.27)', en: 'The siege lifted (27 Jan)' }, LINE_1944_01),
        phaseOf('1944.12', { ko: '핀란드 휴전과 발트 해방 뒤', en: 'After the Finnish armistice and the Baltic offensive' },
            LINES['1944.12'], EXTRA['1944.12']),
    ],
};
