// Territorial control in France from the defeat of 1940 to the liberation
// of Paris, for the French Resistance event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/french-resistance.json. The 1940 front
// lines, the demarcation line, the Italian zone, the D-Day beachhead and
// the August 1944 German line are the fall-of-France map's parts
// (fall-of-france.js); this map adds Corsica's liberation and the
// mid-August 1944 front after the Normandy breakout and the Provence
// landings. Drawn by hand from the campaign record; no map is traced.
//
// Coordinates are [lat, lng].

const { SEAS, WEST_1940, VICHY_ZONE_1940, MENTON_1940, ITALIAN_1942, BEACHHEAD_1944, CORSICA,
    GERMAN_1944_08_25, ATLANTIC_POCKETS } = require('./fall-of-france').parts;
const france = require('./fall-of-france');

// 15 August 1944: the Allies west of the Falaise pocket and Argentan, at
// Dreux and Chartres, on the Loire from Orléans to Nantes, and in Brittany
// less Brest, Lorient and Saint-Nazaire.
const NORMANDY_1944_08_15 = [[50.0, -6], [49.5, -0.9], [49.3, -0.12], [49.1, -0.2], [48.95, -0.25],
    [48.85, -0.55], [48.72, -0.4], [48.72, 0.0], [48.75, 0.9], [48.5, 1.45], [48.1, 1.7], [47.9, 1.9],
    [47.45, 0.7], [47.35, -0.5], [47.25, -1.5], [47.1, -2.5], [46.8, -6]];
// The Provence beachhead on the evening of 15 August, from Cavalaire to
// Saint-Raphaël and inland to Le Muy.
const PROVENCE_1944_08_15 = [[43.05, 6.3], [43.3, 6.3], [43.5, 6.45], [43.55, 6.75], [43.45, 7.0], [43.2, 7.0]];

module.exports = {
    eventId: 'french-resistance',
    region: france.region,
    bounds: france.bounds,
    sea: SEAS,
    base: 'german',
    precedence: ['italian', 'vichy', 'allied'],
    sides: [
        { id: 'german', label: { ko: '독일과 독일 점령지', en: 'Germany and German-occupied land' }, tone: 'blue' },
        { id: 'allied', label: { ko: '프랑스와 연합국 (1943~1944년 해방 지역)', en: 'France and the Allies (liberated, 1943–1944)' }, tone: 'purple' },
        { id: 'vichy', label: { ko: '비시 정부의 비점령 지역', en: 'Vichy\'s unoccupied zone' }, tone: 'amber' },
        { id: 'italian', label: { ko: '이탈리아 점령 지역', en: 'Italian-occupied zone' }, tone: 'gray' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록과 휴전 협정의 분계선을 바탕으로 개략적으로 그렸습니다. 사실상 병합된 알자스·모젤과 출입 금지 구역은 독일 점령지로 칠했습니다. 레지스탕스가 한때 장악한 베르코르 같은 산악 지대는 표시하지 않았고, 1944년 8월 남서부는 독일군이 철수하며 레지스탕스가 해방한 곳까지 해방 지역으로 칠했습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record and the armistice demarcation line. Alsace-Moselle, annexed in all but name, and the forbidden zone are coloured as German-occupied. Mountain areas the Resistance held for a time, such as the Vercors, are not shown; in August 1944 the south-west, which the Resistance freed as the Germans withdrew, is coloured as liberated.',
    },
    sources: [],
    phases: [
        { date: '1940.05', label: { ko: '서부 공세 개시', en: 'The western offensive begins' }, allied: [WEST_1940] },
        { date: '1940.06.14', label: { ko: '파리 함락', en: 'The fall of Paris' },
            allied: [france.phases.find(p => p.date === '1940.06.14').allied[0]] },
        { date: '1940.06.22', label: { ko: '휴전: 점령 지역과 비점령 지역', en: 'The armistice: occupied and unoccupied zones' },
            vichy: [VICHY_ZONE_1940], italian: [MENTON_1940] },
        { date: '1942.11', label: { ko: '남부 지역 점령', en: 'The southern zone occupied' }, italian: [ITALIAN_1942] },
        { date: '1943.10.04', label: { ko: '코르시카 해방', en: 'Corsica liberated' }, allied: [CORSICA] },
        { date: '1944.06.06', label: { ko: '노르망디 상륙', en: 'The Normandy landings' }, allied: [BEACHHEAD_1944, CORSICA] },
        { date: '1944.08.15', label: { ko: '노르망디 돌파와 프로방스 상륙', en: 'The Normandy breakout and the Provence landings' },
            allied: [{ area: NORMANDY_1944_08_15, minus: ATLANTIC_POCKETS.slice(0, 3) }, PROVENCE_1944_08_15, CORSICA] },
        { date: '1944.08.25', label: { ko: '파리 해방', en: 'The liberation of Paris' },
            allied: [{ area: WEST_1940, minus: [GERMAN_1944_08_25, ...ATLANTIC_POCKETS] }] },
    ],
};
