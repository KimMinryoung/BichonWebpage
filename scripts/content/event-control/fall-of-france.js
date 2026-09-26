// Territorial control in France from the German offensive of 1940 to the
// liberation of Paris, for the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/fall-of-france.json. Drawn by hand from the
// campaign record and the armistice demarcation line; no map is traced.
//
// How a phase is built: Germany and whatever it occupies is the remainder
// (blue); France and the Allies, Vichy's unoccupied zone and the Italian
// zone are laid over it.
//
// Coordinates are [lat, lng].

// Coastal waters off the Low Countries, the Channel coast, Biscay and the
// Mediterranean coast, kept clear of England, Spain and Italy.
const SEAS = [
    [[54.3, 8.6], [54.0, 6.0], [53.3, 4.3], [52.3, 3.5], [51.6, 2.6], [51.2, 1.7], [50.4, 0.5], [50.1, -1.5],
        [49.6, -4.2], [48.5, -6.0], [46.5, -3.5], [44.5, -2.2], [43.7, -1.9], [43.4, -1.3], [44.5, -0.8],
        [46.5, -0.5], [47.5, -1.5], [48.2, -3.0], [48.9, -1.5], [49.3, 0.5], [50.0, 1.8], [50.8, 2.3], [51.2, 3.5],
        [51.8, 4.8], [52.5, 5.5], [53.2, 6.8], [53.3, 7.8], [53.6, 8.5]],
    [[43.0, 3.4], [42.5, 3.6], [42.6, 4.5], [42.8, 6.0], [43.2, 7.3], [43.6, 7.45], [43.8, 7.0], [43.6, 5.5],
        [43.5, 4.5], [43.4, 3.5], [43.2, 3.1]],
];

// Everything west of the German border of May 1940: the Netherlands,
// Belgium with Eupen-Malmedy, Luxembourg and France with Corsica.
const WEST_1940 = [[55, -6], [54.0, 6.8], [53.5, 7.1], [53.3, 7.2], [52.7, 7.05], [52.2, 7.0], [51.85, 6.1],
    [51.5, 6.2], [51.0, 5.9], [50.75, 6.0], [50.3, 6.35], [50.1, 6.1], [49.8, 6.5], [49.45, 6.35], [49.2, 6.8],
    [49.1, 7.4], [49.05, 8.2], [48.6, 7.8], [48.0, 7.55], [47.6, 7.6], [46.4, 6.8], [44, 8], [42, 10], [41, 10],
    [41, -6]];
const FRANCE_EAST = WEST_1940.slice(WEST_1940.findIndex(([lat, lng]) => lat === 49.45 && lng === 6.35));

// 26 May: the Germans on the Somme and the Aisne, at Sedan and Montmédy;
// the Allies encircled round Dunkirk and Lille, the Belgians on the Lys.
const FRANCE_1940_05_26 = [[50.2, -6], [50.2, 1.6], [50.0, 1.9], [49.9, 2.4], [49.6, 3.0], [49.45, 3.6],
    [49.5, 4.4], [49.6, 5.0], [49.5, 5.4], [49.47, 5.9], ...FRANCE_EAST];
const DUNKIRK_1940 = [[51.1, 2.1], [51.3, 3.2], [51.0, 3.6], [50.8, 3.3], [50.55, 3.1], [50.6, 2.6], [50.75, 2.2]];
// 14 June: the Germans in Paris, Le Havre, Troyes and Saint-Dizier; the
// Maginot Line still manned.
const FRANCE_1940_06_14 = [[50.2, -6], [50.0, -1.0], [49.5, 0.1], [49.0, 0.9], [48.6, 1.8], [48.5, 2.5],
    [48.3, 3.5], [48.5, 4.5], [48.7, 5.2], [49.0, 5.4], [49.3, 5.8], ...FRANCE_EAST];
// The armistice's demarcation line, from the Spanish border past Langon,
// Angoulême, Vierzon, Moulins and Chalon to the Swiss border near Geneva:
// the unoccupied zone and Corsica.
const VICHY_ZONE_1940 = [[43.25, -1.35], [43.35, -0.95], [43.7, -0.4], [44.2, -0.1], [44.55, -0.25], [45.0, 0.2],
    [45.65, 0.35], [45.8, 0.6], [46.3, 0.6], [46.6, 0.9], [47.1, 1.0], [47.2, 2.05], [46.8, 2.4], [46.6, 3.3],
    [46.45, 4.1], [46.8, 4.85], [46.6, 5.4], [46.9, 5.6], [46.4, 5.9], [46.2, 6.1], [46.5, 7.5], [44, 8], [42, 10],
    [41, 10], [41, 3.0], [41, -1.35]];
// Menton, taken by Italy in June 1940.
const MENTON_1940 = { circle: [43.79, 7.47, 0.1] };
// November 1942: Italy east of the Rhône, with Corsica.
const ITALIAN_1942 = [[46.2, 6.1], [45.9, 5.8], [45.75, 5.2], [45.3, 4.9], [44.3, 4.7], [43.6, 5.3], [43.2, 5.7],
    [42, 8], [41, 8], [41, 10], [42.5, 10], [44, 8], [46.5, 7.5]];
// June 1944: the Normandy beachhead at nightfall on D-Day, and Corsica,
// liberated in October 1943.
const BEACHHEAD_1944 = [[49.45, -1.35], [49.4, -0.2], [49.2, -0.25], [49.2, -1.1], [49.3, -1.35]];
const CORSICA = [[43.1, 9.0], [43.1, 9.6], [41.3, 9.6], [41.3, 8.5], [42.3, 8.5]];
// 25 August 1944: the Germans north of the Seine and in the east, down
// the Rhône valley, and in the Atlantic ports.
const GERMAN_1944_08_25 = [[55, 1.5], [55, 9], [47.6, 7.6], [46.4, 6.0], [46.2, 5.8], [45.8, 5.0], [45.2, 4.9],
    [44.6, 4.8], [44.1, 4.7], [44.1, 4.5], [45.0, 4.6], [46.0, 4.4], [46.6, 4.0], [47.0, 3.5], [47.6, 3.2],
    [48.3, 3.6], [48.6, 2.8], [48.85, 2.55], [49.0, 2.3], [49.2, 1.5], [49.45, 0.2], [50.5, 0.2]];
const ATLANTIC_POCKETS = [[48.39, -4.49, 0.2], [47.75, -3.37, 0.2], [47.27, -2.2, 0.25], [46.16, -1.15, 0.15],
    [45.62, -1.03, 0.15]].map(circle => ({ circle }));

module.exports = {
    eventId: 'fall-of-france',
    region: ['FRA', 'BEL', 'NLD', 'LUX', 'DEU'],
    bounds: [[41, -6], [55.5, 16]],
    sea: SEAS,
    base: 'german',
    precedence: ['italian', 'vichy', 'allied'],
    sides: [
        { id: 'german', label: { ko: '독일과 독일 점령지', en: 'Germany and German-occupied land' }, tone: 'blue' },
        { id: 'allied', label: { ko: '프랑스와 연합국 (1944년 해방 지역)', en: 'France and the Allies (liberated, 1944)' }, tone: 'purple' },
        { id: 'vichy', label: { ko: '비시 정부의 비점령 지역', en: 'Vichy\'s unoccupied zone' }, tone: 'amber' },
        { id: 'italian', label: { ko: '이탈리아 점령 지역', en: 'Italian-occupied zone' }, tone: 'gray' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록과 휴전 협정의 분계선을 바탕으로 개략적으로 그렸습니다. 1940년 이후 사실상 병합된 알자스·모젤과 브뤼셀 군정에 붙은 노르·파드칼레, 출입 금지 구역은 모두 독일 점령지로 칠했습니다. 1944년 8월 남서부는 독일군이 철수하며 레지스탕스가 해방한 곳까지 해방 지역으로 칠했습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record and the armistice demarcation line. Alsace-Moselle, annexed in all but name, the Nord and Pas-de-Calais attached to the Brussels command, and the forbidden zone are all coloured as German-occupied. In August 1944 the south-west, which the Resistance freed as the Germans withdrew, is coloured as liberated.',
    },
    sources: [],
    phases: [
        { date: '1940.05.10', label: { ko: '서부 공세 개시', en: 'The western offensive begins' }, allied: [WEST_1940] },
        { date: '1940.05.26', label: { ko: '됭케르크 철수: 해협까지 뚫린 회랑', en: 'The Dunkirk evacuation: the corridor to the Channel' },
            allied: [FRANCE_1940_05_26, DUNKIRK_1940] },
        { date: '1940.06.14', label: { ko: '파리 함락', en: 'The fall of Paris' }, allied: [FRANCE_1940_06_14] },
        { date: '1940.06.22', label: { ko: '콩피에뉴 휴전: 점령 지역과 비점령 지역', en: 'The Compiègne armistice: occupied and unoccupied zones' },
            vichy: [VICHY_ZONE_1940], italian: [MENTON_1940] },
        { date: '1942.11.11', label: { ko: '남부 지역 점령', en: 'The southern zone occupied' }, italian: [ITALIAN_1942] },
        { date: '1944.06.06', label: { ko: '노르망디 상륙 (코르시카는 1943년 해방)', en: 'The Normandy landings (Corsica free since 1943)' },
            allied: [BEACHHEAD_1944, CORSICA] },
        { date: '1944.08.25', label: { ko: '파리 해방', en: 'The liberation of Paris' },
            allied: [{ area: WEST_1940, minus: [GERMAN_1944_08_25, ...ATLANTIC_POCKETS] }] },
    ],
};
