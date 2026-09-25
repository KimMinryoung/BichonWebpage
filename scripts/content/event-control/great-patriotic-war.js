// Front lines of the Great Patriotic War for the event map's control layer.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/great-patriotic-war.json. Nothing is
// traced: each phase is one front line from the Arctic to the Black Sea (or
// the Balkans), drawn from the campaign record and checked against the
// "Eastern Front" map series on Wikimedia Commons (Gdr, CC BY-SA 3.0, used
// only as a reference). Everything east of a line is Soviet-held; pockets
// on either side (Leningrad's Oranienbaum bridgehead, Odessa, Sevastopol;
// Crimea in 1943, Courland, East Prussia, Breslau, Budapest) are added or
// carved separately.
//
// Coordinates are [lat, lng], run north to south: the Soviet side is on the
// left of the direction of travel, so a line may fold round a city (it runs
// west across Ladoga, down the Karelian isthmus, then east below Leningrad).

// Soviet-held: left of the line, closed round the east.
const eastOf = line => [[72, line[0][1]], ...line, [34, line[line.length - 1][1]], [34, 70], [72, 70]];

const circle = (lat, lng, r) => ({ circle: [lat, lng, r] });

// The Soviet–Finnish border of 1940, Arctic coast to the Gulf of Finland,
// then the Gulf and the Baltic outside the Baltic states.
const NORTH_1941 = [[70.4, 32.0], [69.5, 31.4], [68.4, 30.0], [67.2, 29.4], [66.4, 29.7], [65.0, 29.9],
    [64.0, 30.3], [63.0, 31.3], [62.2, 30.9], [61.6, 29.9], [61.0, 28.9], [60.6, 27.8], [60.2, 27.5],
    [59.9, 26.0], [59.75, 24.0], [59.4, 22.5], [58.8, 21.4], [57.6, 20.6], [56.4, 20.6], [55.87, 20.95]];

// The Finnish front from autumn 1941 to June 1944: the Svir, Lake Onega,
// the old border on the Karelian isthmus.
const FINNISH_FRONT = [[70.4, 32.3], [69.4, 32.0], [67.0, 30.6], [66.0, 31.6], [64.8, 32.7], [63.6, 33.6],
    [62.9, 34.7], [61.8, 35.4], [61.0, 35.3], [60.9, 34.0], [60.75, 33.4], [60.3, 31.9], [60.2, 30.3],
    [60.12, 29.95]];

// Leningrad under siege: across the Gulf, below the city to the Neva at
// Shlisselburg, and out to the Ladoga shore.
// Shlisselburg and the south bank of the Neva are German; the line runs up
// the river, into the lake and back to the shore east of Lipka.
const LENINGRAD_1941 = [[59.9, 29.95], [59.84, 30.12], [59.77, 30.33], [59.72, 30.62], [59.8, 30.9],
    [59.88, 30.97], [59.955, 31.0], [59.99, 31.2], [59.94, 31.42]];
// January 1943: the land corridor south of Ladoga reopened.
const LENINGRAD_1943 = [[59.9, 29.95], [59.84, 30.12], [59.77, 30.33], [59.72, 30.62], [59.78, 30.95],
    [59.83, 31.25], [59.9, 31.6]];

// The Moscow armistice border of 1944 (Petsamo ceded), then round Estonia.
const NORTH_1944 = [[70.2, 29.5], [69.2, 28.9], [68.5, 28.6], [67.2, 29.4], [66.4, 29.7], [65.0, 29.9],
    [64.0, 30.3], [63.0, 31.3], [62.2, 30.9], [61.6, 29.9], [61.0, 28.9], [60.6, 27.8], [60.2, 27.5],
    [59.9, 26.0], [59.75, 24.0], [59.4, 22.5], [58.8, 21.4], [57.9, 20.9]];

const ORANIENBAUM = circle(59.93, 29.5, 0.2);
const ODESSA = circle(46.5, 30.6, 0.35);
const SEVASTOPOL = circle(44.62, 33.6, 0.22);

const CRIMEA = [[46.1, 32.3], [46.15, 33.8], [45.9, 34.6], [45.6, 35.4], [45.5, 36.3], [45.1, 36.7], [44.3, 35.0],
    [44.3, 33.3], [45.2, 32.4]];
const COURLAND = [[57.8, 21.3], [57.6, 22.8], [57.1, 23.2], [56.6, 22.6], [56.3, 21.5], [56.3, 20.5], [57.5, 20.5]];
const EAST_PRUSSIA_1945 = [[55.0, 19.9], [54.95, 20.9], [54.6, 20.8], [54.35, 20.6], [54.3, 19.7]];

const LINES = {
    '1941.06': [...NORTH_1941, [55.3, 21.4], [55.1, 22.3], [55.05, 22.8], [54.4, 22.8], [54.0, 23.4],
        [53.4, 22.3], [53.0, 21.9], [52.6, 22.1], [52.2, 23.2], [51.6, 23.6], [51.0, 24.0], [50.4, 23.6],
        [50.0, 23.0], [49.6, 22.7], [49.1, 22.6], [48.4, 23.0], [48.0, 24.2], [47.9, 25.2], [48.2, 26.1],
        [48.3, 26.9], [47.8, 27.2], [47.2, 27.9], [46.5, 28.2], [45.5, 28.3], [45.2, 29.7], [44.8, 30.5]],
    '1941.09': [...FINNISH_FRONT, ...LENINGRAD_1941, [59.45, 32.05], [59.0, 31.9], [58.6, 31.55],
        [58.1, 31.9], [57.75, 32.6], [57.3, 32.9], [56.8, 32.5], [56.3, 32.2], [55.8, 32.6], [55.1, 32.75],
        [54.6, 33.3], [54.1, 33.9], [53.5, 34.0], [52.7, 33.9], [52.0, 33.8], [51.3, 33.9], [50.8, 34.6],
        [50.1, 34.4], [49.5, 34.7], [48.9, 34.8], [48.45, 35.1], [48.0, 35.1], [47.4, 35.0], [46.9, 35.2],
        [46.5, 35.0], [46.2, 33.9], [46.1, 33.5], [45.9, 32.5], [44.5, 32.3]],
    '1941.12': [...FINNISH_FRONT, ...LENINGRAD_1941, [59.45, 32.05], [59.0, 31.9], [58.6, 31.55],
        [58.1, 31.9], [57.75, 32.6], [57.3, 33.2], [57.0, 34.5], [56.86, 35.95], [56.35, 36.8], [56.05, 37.35],
        [55.7, 36.9], [55.4, 36.8], [54.9, 37.2], [54.3, 37.3], [54.25, 37.9], [54.3, 38.4], [53.8, 38.6],
        [52.6, 38.3], [51.7, 37.0], [50.8, 37.2], [50.0, 36.9], [49.2, 37.8], [48.5, 38.4], [47.6, 38.9],
        [47.2, 39.0], [46.8, 38.0], [46.3, 36.9], [45.4, 36.65], [44.5, 36.6]],
    '1942.11': [...FINNISH_FRONT, ...LENINGRAD_1941, [59.5, 32.0], [59.1, 31.95], [58.6, 31.6], [58.1, 31.6],
        [57.9, 32.3], [57.7, 33.0], [57.4, 32.6], [57.3, 31.6], [57.1, 31.2], [56.6, 31.3], [56.3, 31.6],
        [55.9, 32.4], [55.8, 33.1], [56.2, 33.5], [56.3, 34.3], [56.15, 34.6], [55.55, 35.0], [55.0, 35.2],
        [54.6, 34.7], [54.2, 34.4], [54.0, 35.0], [53.6, 35.6], [53.4, 36.2], [53.2, 36.7], [52.8, 37.3],
        [52.4, 37.8], [52.0, 38.4], [51.67, 39.2], [50.9, 39.6], [50.3, 40.4], [49.8, 41.3], [49.55, 42.7],
        [49.35, 43.1], [49.0, 43.8], [48.85, 44.4], [48.8, 44.52], [48.7, 44.55], [48.64, 44.5], [48.63, 44.35],
        [48.55, 44.22], [48.4, 44.1], [48.2, 44.0], [47.6, 44.0], [46.8, 45.2], [46.0, 45.6], [45.2, 45.0], [44.3, 44.9], [43.75, 44.95], [43.3, 44.9],
        [43.15, 44.4], [43.25, 43.6], [43.3, 42.6], [43.6, 41.8], [44.0, 40.9], [44.3, 39.9], [44.4, 39.3],
        [44.7, 38.0], [44.7, 37.8], [44.5, 37.6]],
    '1943.07': [...FINNISH_FRONT, ...LENINGRAD_1943, [59.5, 32.0], [59.1, 31.95], [58.6, 31.6], [57.95, 31.5],
        [57.3, 31.0], [56.9, 30.6], [56.2, 30.2], [55.8, 30.9], [55.2, 32.3], [54.8, 33.2], [54.4, 34.0],
        [54.1, 34.5], [53.8, 35.2], [53.5, 36.0], [53.3, 36.7], [52.95, 37.1], [52.5, 36.6], [52.3, 35.6],
        [52.15, 34.4], [51.6, 34.5], [51.2, 35.2], [50.9, 35.8], [50.7, 36.1], [50.55, 36.8], [50.1, 37.0],
        [49.4, 37.4], [48.9, 38.2], [48.2, 38.8], [47.5, 38.9], [47.2, 38.95], [46.6, 38.0], [45.6, 37.3],
        [45.25, 37.45], [44.95, 38.0], [44.72, 37.8], [44.5, 37.6]],
    '1943.12': [...FINNISH_FRONT, ...LENINGRAD_1943, [59.5, 32.0], [59.1, 31.95], [58.6, 31.4], [57.9, 31.1],
        [57.3, 30.2], [56.6, 29.9], [56.1, 29.8], [55.7, 30.5], [55.3, 30.9], [54.7, 31.1], [54.0, 30.9],
        [53.4, 30.3], [52.8, 30.0], [52.3, 29.4], [51.8, 29.0], [51.2, 28.3], [50.6, 28.3], [50.2, 28.6],
        [49.9, 29.4], [49.5, 30.6], [49.4, 31.5], [49.3, 32.1], [48.7, 32.4], [48.1, 33.2], [47.75, 34.0],
        [47.55, 34.2], [47.4, 34.8], [47.15, 34.3], [46.8, 33.4], [46.6, 32.7], [46.4, 32.2], [45.8, 31.5],
        [44.5, 31.5]],
    '1944.06': [...FINNISH_FRONT, [59.45, 28.05], [58.9, 27.7], [58.0, 27.8], [57.9, 28.6], [57.3, 28.6],
        [56.8, 28.8], [56.3, 29.0], [55.9, 29.7], [55.5, 30.4], [55.0, 30.9], [54.5, 30.9], [53.9, 30.6],
        [53.3, 30.2], [52.6, 29.8], [52.0, 28.6], [51.8, 27.0], [51.6, 25.6], [51.3, 24.9], [50.6, 25.0],
        [50.1, 25.1], [49.4, 24.9], [48.6, 25.0], [48.0, 25.2], [47.6, 26.4], [47.2, 27.4], [47.0, 28.3],
        [46.8, 29.3], [46.4, 30.0], [46.0, 30.5], [45.5, 30.8]],
    '1944.12': [...NORTH_1944, [56.1, 20.8], [55.9, 21.2], [55.5, 21.4], [55.1, 22.1], [54.8, 22.4],
        [54.4, 22.3], [54.0, 22.8], [53.7, 22.4], [53.2, 21.9], [52.9, 21.3], [52.6, 21.1], [52.25, 21.05],
        [51.75, 21.2], [51.3, 21.9], [50.8, 21.6], [50.6, 21.3], [50.2, 21.6], [49.6, 21.7], [49.1, 21.8],
        [48.9, 21.9], [48.4, 21.3], [48.1, 20.8], [47.9, 19.9], [47.8, 18.7], [47.2, 18.4], [46.9, 18.0],
        [46.4, 17.6], [45.9, 17.9], [45.7, 18.8], [45.1, 19.3], [44.0, 19.5], [43.0, 20.3], [42.2, 21.3],
        [41.4, 22.3], [41.0, 23.5], [40.5, 24.5]],
    '1945.02': [...NORTH_1944, [56.1, 20.6], [55.4, 20.3], [54.9, 19.6], [54.4, 19.4], [53.9, 18.9],
        [53.4, 18.4], [53.3, 17.5], [53.2, 16.0], [53.3, 15.0], [52.7, 14.6], [52.3, 14.6], [51.9, 14.7],
        [51.3, 15.0], [50.9, 15.9], [50.7, 16.4], [50.4, 17.6], [50.1, 18.3], [49.9, 18.6], [49.4, 19.4],
        [48.9, 19.6], [48.4, 19.2], [47.9, 18.7], [47.2, 18.4], [46.9, 18.0], [46.4, 17.6], [45.9, 17.9],
        [45.7, 18.8], [45.1, 19.3], [44.0, 19.5], [43.0, 20.3], [42.2, 21.3], [41.4, 22.3], [41.0, 23.5],
        [40.5, 24.5]],
    '1945.05': [...NORTH_1944, [56.5, 16.0], [54.6, 12.3], [53.9, 11.45], [53.6, 11.5], [53.3, 11.5],
        [53.05, 11.6], [52.9, 11.8], [52.5, 12.0], [52.1, 11.8], [51.85, 12.2], [51.55, 12.95], [51.2, 12.75],
        [50.9, 12.8], [50.4, 12.9], [50.2, 13.2], [49.75, 13.55], [49.3, 13.9], [48.97, 14.45], [48.6, 14.4],
        [48.2, 14.5], [47.8, 14.5], [47.4, 14.8], [47.07, 15.44], [46.7, 15.9], [46.5, 16.3], [46.4, 16.6],
        [45.8, 17.5], [44.5, 17.5], [42.0, 19.0], [40.5, 20.0]],
};

const LABELS = {
    '1941.06': { ko: '독일의 침공 (6.22)', en: 'The German invasion (22 June)' },
    '1941.09': { ko: '레닌그라드 봉쇄와 키이우 포위 뒤', en: 'Leningrad besieged; after the Kiev encirclement' },
    '1941.12': { ko: '모스크바 앞의 최대 진출선 (12.5)', en: 'The high-water mark before Moscow (5 Dec)' },
    '1942.11': { ko: '스탈린그라드와 캅카스 (우라누스 작전 직전)', en: 'Stalingrad and the Caucasus, before Uranus' },
    '1943.07': { ko: '쿠르스크 전투 직전', en: 'On the eve of Kursk' },
    '1943.12': { ko: '드네프르 도하 뒤', en: 'After the Dnieper crossings' },
    '1944.06': { ko: '바그라티온 작전 직전', en: 'On the eve of Bagration' },
    '1944.12': { ko: '발트해에서 부다페스트까지', en: 'From the Baltic to Budapest' },
    '1945.02': { ko: '오데르강 도달', en: 'On the Oder' },
    '1945.05': { ko: '독일 항복 (5.9)', en: 'Germany surrenders (9 May)' },
};

// Finland, out of the war after the September 1944 armistice.
const FINLAND = [[71, 19], [71, 33], [59.8, 33], [59.8, 19]];
// Where the Western Allies stood in May 1945 (the Soviet side takes
// precedence east of the line).
const WEST_1945 = [[56, 4], [56, 17], [44, 17], [44, 4]];

const EXTRA = {
    '1941.09': { soviet: [ORANIENBAUM, ODESSA] },
    '1941.12': { soviet: [ORANIENBAUM, SEVASTOPOL] },
    '1942.11': { soviet: [ORANIENBAUM] },
    '1943.07': { soviet: [ORANIENBAUM] },
    '1943.12': { soviet: [ORANIENBAUM], axis: [CRIMEA] },
    '1944.12': { axis: [COURLAND, circle(47.5, 19.05, 0.12)], other: [FINLAND] },
    '1945.02': { axis: [COURLAND, EAST_PRUSSIA_1945, circle(51.11, 17.03, 0.14)], other: [FINLAND] },
    '1945.05': { west: [WEST_1945], other: [FINLAND] },
};

// The Baltic and the Black Sea with Azov, so the areas need not follow
// their coasts; foreign land is removed by the bake.
const SEAS = [
    [[66, 20], [66, 26], [61, 30.5], [59.4, 30.6], [57.5, 24.6], [55.6, 21.1], [54.3, 19.3], [54.0, 14.2],
        [54.3, 10.5], [55.5, 10.0], [57.8, 11.3], [59.5, 17.0], [63.5, 18.5]],
    [[47.4, 30.3], [47.4, 39.6], [45.0, 38.5], [43.0, 41.8], [41.0, 41.8], [40.8, 28.0], [43.5, 27.5], [45.5, 29.3]],
];

// The frame of the war shared with its campaign events (siege-of-leningrad,
// stalingrad), which reuse these lines and add their own dates.
const SHARED = {
    region: ['RUS', 'UKR', 'BLR', 'EST', 'LVA', 'LTU', 'MDA', 'FIN', 'POL', 'ROU', 'HUN', 'SVK', 'CZE', 'BGR',
        'DEU', 'AUT', 'GEO', 'ARM', 'AZE'],
    bounds: [[38, 5], [71, 62]],
    sea: SEAS,
    base: 'axis',
    precedence: ['soviet', 'west', 'other'],
    carve: ['soviet'],
};

// One phase from a line and its extras.
const phaseOf = (date, label, line, extra = {}) => ({
    date,
    label,
    soviet: [eastOf(line), ...(extra.soviet || [])],
    ...(extra.axis ? { axis: extra.axis } : {}),
    ...(extra.west ? { west: extra.west } : {}),
    ...(extra.other ? { other: extra.other } : {}),
});

module.exports = {
    eventId: 'great-patriotic-war',
    ...SHARED,
    // Leningrad and the Caucasus lie outside the frame the markers give.
    focus: [[60.3, 30.0], [43.2, 44.5]],
    sides: [
        { id: 'soviet', label: { ko: '소련군', en: 'Soviet forces' }, tone: 'red' },
        { id: 'axis', label: { ko: '독일과 추축국', en: 'Germany and the Axis' }, tone: 'blue' },
        { id: 'west', label: { ko: '서방 연합군', en: 'Western Allies' }, tone: 'purple' },
        { id: 'other', label: { ko: '휴전 (핀란드)', en: 'Out of the war (Finland)' }, tone: 'gray' },
    ],
    note: {
        ko: '전선은 근사치입니다. 주요 날짜의 전선을 작전 기록을 바탕으로 직접 그렸고, 위키미디어 공용의 동부전선 지도 연작(Gdr, CC BY-SA 3.0)과 대조했습니다. 1944년 가을 이후 루마니아·불가리아는 소련 측으로 넘어갔고, 유고슬라비아·그리스·이탈리아는 표시하지 않았습니다.',
        en: 'Front lines are approximate, drawn from the campaign record for key dates and checked against the Wikimedia Commons Eastern Front map series (Gdr, CC BY-SA 3.0). Romania and Bulgaria change sides in autumn 1944; Yugoslavia, Greece and Italy are not shown.',
    },
    sources: [
        { label: 'Gdr, “Eastern Front” map series, Wikimedia Commons (CC BY-SA 3.0), used for reference', url: 'https://commons.wikimedia.org/wiki/File:Eastern_Front_1941-06_to_1941-12.png' },
    ],
    phases: Object.keys(LINES).map(date => phaseOf(date, LABELS[date], LINES[date], EXTRA[date])),
    parts: {
        SHARED, phaseOf, LINES, LABELS, EXTRA,
        NORTH_1941, FINNISH_FRONT, LENINGRAD_1941, LENINGRAD_1943, NORTH_1944, ORANIENBAUM,
    },
};
