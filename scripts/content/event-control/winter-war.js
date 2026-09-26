// Territorial control in the Winter War, from the 1920 border to the
// Moscow Peace, for the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/winter-war.json. Drawn by hand from the
// campaign record and the Tartu (1920) and Moscow (1940) borders; no map is
// traced. The 1940 border is modern Finland's in the south; Petsamo, still
// Finnish until 1944, is added to it.
//
// How a phase is built: the Soviet Union is the remainder (red); Finland is
// its 1920 extent less what the Red Army held, laid over it.
//
// Coordinates are [lat, lng].

// The Tartu border, north to south: the Rybachy isthmus, Petsamo, Salla,
// the Ladoga Karelia border round Suojärvi to the Ladoga shore, across the
// lake to the Sestra and down the river to the Gulf of Finland.
const BORDER_1920 = [[70.4, 32.0], [69.5, 31.4], [68.4, 30.0], [67.4, 29.7], [67.0, 30.1], [66.4, 30.1],
    [65.8, 29.9], [65.0, 29.9], [64.0, 30.3], [63.0, 31.3], [62.9, 31.6], [62.6, 32.2], [62.2, 32.95],
    [61.6, 32.9], [61.25, 32.7], [60.9, 31.4], [60.55, 30.9], [60.45, 30.35], [60.3, 30.1], [60.12, 29.95]];
// Finland in 1939: everything west of that border.
const FINLAND_1939 = [[72, 32.0], ...BORDER_1920, [59.95, 29.6], [59.8, 26.0], [59.6, 22.0], [59.5, 19.0],
    [72, 19.0]];

// Petsamo, between the Moscow Peace border and the Tartu one: Finnish until
// 1944.
const PETSAMO = [[70.4, 32.0], [69.5, 31.4], [68.4, 30.0], [68.5, 28.6], [69.2, 28.9], [70.2, 29.5]];
// The Hanko peninsula and its islands, leased to the Soviet Union in 1940.
const HANKO = { circle: [59.87, 23.0, 0.17] };

// Gulf of Finland and Gulf of Bothnia waters along the Finnish and Soviet
// coasts, kept clear of Estonia and Sweden.
const SEAS = [
    [[60.1, 21.3], [59.75, 23.0], [59.85, 25.0], [59.95, 27.0], [59.95, 29.0], [60.1, 29.9], [60.6, 28.5],
        [60.5, 26.0], [60.3, 23.5], [60.4, 21.8]],
    [[60.3, 21.2], [61.5, 21.0], [62.5, 21.0], [63.3, 21.3], [63.8, 22.5], [64.5, 24.0], [65.0, 24.8],
        [65.6, 25.0], [65.6, 25.4], [64.0, 24.5], [62.0, 21.8], [60.5, 21.8]],
];

// Early December 1939: the Karelian Isthmus up to the Mannerheim Line
// (Kuolemajärvi, Summa, Muolaa, the Vuoksi, Taipale).
const ISTHMUS_1939_12 = [[60.2, 28.0], [60.37, 28.85], [60.57, 29.05], [60.65, 29.4], [60.72, 29.7],
    [60.68, 30.1], [60.62, 30.55], [60.6, 31.2], [60.0, 31.2], [60.0, 29.5]];
// North of Ladoga: to Kitelä and the Kollaa, and short of Tolvajärvi.
const LADOGA_1939_12 = [[61.25, 32.7], [61.4, 31.9], [61.55, 31.4], [61.7, 31.6], [61.85, 31.9], [62.1, 31.7],
    [62.3, 31.5], [62.4, 31.9], [62.6, 32.2], [62.2, 32.95], [61.6, 32.9]];
// After Tolvajärvi the Soviets were pushed back to Ägläjärvi.
const LADOGA_1940 = [[61.25, 32.7], [61.4, 31.9], [61.55, 31.4], [61.7, 31.6], [61.85, 31.9], [62.2, 32.1],
    [62.6, 32.2], [62.2, 32.95], [61.6, 32.9]];
// Salla: the advance towards Kemijärvi, stopped short of Märkäjärvi.
const SALLA_1939_12 = [[67.4, 29.7], [67.2, 28.3], [66.9, 28.0], [66.6, 28.6], [66.4, 30.1], [67.0, 30.1]];
const SALLA_1940 = [[67.4, 29.7], [67.1, 28.9], [66.8, 28.8], [66.6, 29.3], [66.4, 30.1], [67.0, 30.1]];
// Suomussalmi and the Raate road, held by the 163rd and 44th Divisions
// until the Finnish counter-strokes of late December and early January.
const SUOMUSSALMI = [
    { corridor: [[65.35, 30.0], [65.15, 29.5], [64.95, 29.1], [64.88, 28.91]], width: 0.08 },
    { corridor: [[64.82, 30.25], [64.85, 29.7], [64.87, 29.2], [64.88, 28.95]], width: 0.07 },
];
// Kuhmo: the 54th Division encircled east of the town.
const KUHMO = [{ corridor: [[64.1, 30.55], [64.13, 30.0], [64.15, 29.75]], width: 0.06 }];
// 12 March 1940: the front at the armistice — across Viipuri Bay, at the
// city's edge, over the Vuoksi at Vuosalmi, and still at Taipale.
const ISTHMUS_1940_03 = [[60.2, 27.6], [60.45, 27.9], [60.62, 28.35], [60.7, 28.7], [60.74, 28.85],
    [60.8, 29.1], [60.88, 29.45], [60.9, 29.75], [60.75, 30.2], [60.62, 30.55], [60.6, 31.2], [60.0, 31.2],
    [60.0, 29.5]];

module.exports = {
    eventId: 'winter-war',
    region: ['FIN', 'RUS'],
    bounds: [[56, 19], [70.6, 44]],
    sea: SEAS,
    base: 'soviet',
    precedence: ['finland'],
    sides: [
        { id: 'soviet', label: { ko: '소련과 소련군 점령지', en: 'The Soviet Union and Soviet-held land' }, tone: 'red' },
        { id: 'finland', label: { ko: '핀란드', en: 'Finland' }, tone: 'blue' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록과 1920년 타르투 조약·1940년 모스크바 강화 조약의 국경을 바탕으로 개략적으로 그렸습니다. 섬과 작은 포위 지역은 생략했습니다. 페차모는 1944년까지 핀란드령이었습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record and the borders of the Treaty of Tartu (1920) and the Moscow Peace (1940). Islands and small encirclements are left out. Petsamo stayed Finnish until 1944.',
    },
    sources: [],
    phases: [
        { date: '1939.08', label: { ko: '개전 전 국경 (1920년 타르투 조약)', en: 'The pre-war border (Treaty of Tartu, 1920)' },
            finland: [FINLAND_1939] },
        { date: '1939.12.10', label: { ko: '만네르헤임 선 앞까지: 페차모·살라·수오무살미', en: 'Up to the Mannerheim Line: Petsamo, Salla, Suomussalmi' },
            finland: [{ area: FINLAND_1939,
                minus: [PETSAMO, ISTHMUS_1939_12, LADOGA_1939_12, SALLA_1939_12, ...SUOMUSSALMI] }] },
        { date: '1940.01.08', label: { ko: '수오무살미·라테 도로의 섬멸 뒤', en: 'After Suomussalmi and the Raate road' },
            finland: [{ area: FINLAND_1939, minus: [PETSAMO, ISTHMUS_1939_12, LADOGA_1940, SALLA_1940, ...KUHMO] }] },
        { date: '1940.03.01', label: { ko: '만네르헤임 선 돌파와 비푸리 공방', en: 'The Mannerheim Line breached, Viipuri under attack' },
            finland: [{ area: FINLAND_1939, minus: [PETSAMO, ISTHMUS_1940_03, LADOGA_1940, SALLA_1940, ...KUHMO] }] },
        { date: '1940.03.12', label: { ko: '모스크바 강화: 새 국경과 항코 조차', en: 'The Moscow Peace: the new border and the Hanko lease' },
            finland: [{ units: ['FIN'] }, PETSAMO], soviet: [HANKO] },
    ],
};
