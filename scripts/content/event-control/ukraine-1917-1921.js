// Territorial control in the Ukrainian revolution and war, 1917–1921, for
// the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/ukraine-1917-1921.json. The Soviet fronts,
// the occupation lines and the White areas are the Russian Civil War's
// (civil-war.js parts); the Ukrainian governments of 1919, West Ukraine and
// the neighbouring states are the Soviet-Polish War's. West of a front lies
// Poland and its neighbours, with the Ukrainian governments laid over it.
// Drawn by hand from the campaign record; no map is traced.
//
// Coordinates are [lat, lng].

const { SEAS, westOf, BESSARABIA, CENTRAL_1917_12, UKRAINE_1917, CENTRAL_1918_03,
    CENTRAL_1918_08, KUBAN_1918_03, SOUTH_1918_08, SOUTH_1919_05, CRIMEA_1920 } = require('./civil-war').parts;
const { OBER_OST_1919, ZUNR_1919, UNR_1919_02, UNR_1919_04, NEIGHBOURS } = require('./soviet-polish-war').parts;
const { UNR_1918_02 } = require('./brest-litovsk').parts;

// December 1918: the Germans still in Belorussia and Lithuania, leaving.
const OBER_OST_1918_12 = [[55.9, 26.2], [55.5, 26.8], [54.9, 27.0], [54.2, 27.1], [53.9, 27.3], [53.3, 27.9],
    [52.7, 28.6], [52.2, 29.3], [51.5, 30.6], [51.9, 28.5], [51.9, 26.0], [51.9, 24.0], [52.2, 23.2], [53.0, 22.6], [53.5, 22.4],
    [54.4, 22.7], [55.3, 21.3], [56.3, 21.0], [56.4, 24.0]];
// The French and the Volunteers at Odesa, December 1918 to April 1919.
const ODESA_1919 = [[46.9, 30.2], [46.9, 31.2], [46.4, 31.6], [46.2, 30.3]];
// The Whites' foothold on the Kerch peninsula, spring 1919.
const KERCH_1919 = [[45.5, 35.4], [45.5, 36.7], [45.1, 36.7], [44.9, 35.4]];
// End of August 1919: the Directory in Podolia and at Kyiv's gates.
const UNR_1919_08 = [[50.6, 27.0], [50.8, 28.3], [50.5, 29.6], [50.2, 30.2], [49.9, 29.8], [49.2, 30.0],
    [48.4, 29.6], [47.8, 29.3], [48.2, 28.3], [48.45, 27.0], [48.5, 26.5], [49.5, 26.2]];
// Denikin at the end of August 1919: Kyiv, Poltava, Kharkiv, Odesa and the
// south, short of Kursk, with Tsaritsyn and the Caucasus behind.
const SOUTH_1919_08 = [[50.35, 30.2], [50.6, 30.6], [50.7, 31.6], [50.8, 33.2], [51.1, 34.7], [51.2, 36.0],
    [51.0, 37.6], [50.9, 39.3], [51.0, 41.0], [50.6, 43.0], [49.8, 45.0], [48.5, 45.5], [46.0, 47.0], [44.0, 47.5],
    [41.9, 48.5], [41.5, 41.5], [44.0, 34.0], [44.3, 32.5], [46.0, 30.6], [46.35, 30.25], [47.0, 29.9], [47.8, 29.3],
    [48.4, 29.6], [49.2, 30.0], [49.9, 29.8]];
// Mid-December 1919: the Whites back to the south of Ukraine and the Don.
const SOUTH_1919_12 = [[48.4, 28.4], [48.8, 30.0], [49.0, 32.0], [49.0, 34.0], [48.6, 35.8], [48.6, 37.8],
    [48.8, 39.8], [49.4, 41.5], [50.0, 43.0], [49.5, 45.0], [46.0, 47.0], [44.0, 47.5], [41.9, 48.5], [41.5, 41.5],
    [44.0, 34.0], [44.3, 32.5], [46.0, 30.6], [46.35, 30.25], [47.0, 29.9], [47.8, 29.3], [48.2, 28.9]];
// May 1920: Petliura's republic behind the Polish-Ukrainian front, between
// the later Riga line and the Dnieper.
const UNR_1920_05 = [[51.5, 26.9], [51.4, 30.6], [50.8, 30.9], [50.45, 31.0], [50.1, 30.7], [49.8, 30.2],
    [49.4, 29.9], [48.9, 29.7], [48.3, 29.2], [47.9, 29.1], [48.2, 28.3], [48.45, 27.0], [48.5, 26.5], [49.5, 26.2],
    [50.6, 26.3]];

module.exports = {
    eventId: 'ukraine-1917-1921',
    region: ['UKR', 'MDA', 'BLR', 'POL', 'RUS'],
    bounds: [[43, 14], [57, 48]],
    sea: [SEAS[1]],
    base: 'red',
    precedence: ['central', 'white', 'ukr', 'national'],
    sides: [
        { id: 'red', label: { ko: '소비에트 정권', en: 'Soviet power' }, tone: 'red' },
        { id: 'ukr', label: { ko: '우크라이나 정부 (라다, 디렉토리아, 서우크라이나)', en: 'Ukrainian governments (the Rada, the Directory, West Ukraine)' }, tone: 'purple' },
        { id: 'central', label: { ko: '동맹국 점령 (1918년 헤트만국 포함)', en: 'Central Powers occupation (with the Hetmanate, 1918)' }, tone: 'amber' },
        { id: 'white', label: { ko: '백군과 협상국 간섭군', en: 'Whites and Allied intervention' }, tone: 'blue' },
        { id: 'national', label: { ko: '폴란드와 인접국', en: 'Poland and neighbouring states' }, tone: 'gray' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록을 바탕으로 개략적으로 그렸고, 전선은 러시아 내전·소비에트-폴란드 전쟁 지도와 같습니다. 1918년의 라다와 헤트만국은 독일·오스트리아 점령 아래 있었으므로 점령지로 칠했습니다. 마흐노와 흐리호리우 같은 농민군의 지역, 전선 뒤의 봉기는 표시하지 않았습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record; the fronts are those of the Russian Civil War and Soviet-Polish War maps. The Rada and the Hetmanate of 1918 stood under German and Austrian occupation and are coloured as occupied. The regions of peasant armies such as Makhno\'s and Hryhoriv\'s, and uprisings behind the lines, are not shown.',
    },
    sources: [],
    phases: [
        { date: '1917.11.20', label: { ko: '우크라이나 인민공화국 선포', en: 'The Ukrainian People\'s Republic proclaimed' },
            central: [CENTRAL_1917_12], ukr: [UKRAINE_1917], white: [SOUTH_1918_08], national: [BESSARABIA] },
        { date: '1918.02.09', label: { ko: '소비에트군의 키예프 점령과 빵의 강화', en: 'Soviet troops take Kyiv; the bread peace' },
            central: [CENTRAL_1917_12], ukr: [UNR_1918_02], white: [SOUTH_1918_08], national: [BESSARABIA] },
        { date: '1918.03.01', label: { ko: '독일군과 함께 돌아온 라다', en: 'The Rada returns with the German army' },
            central: [CENTRAL_1918_03], white: [KUBAN_1918_03], national: [BESSARABIA] },
        { date: '1918.04.29', label: { ko: '헤트만 쿠데타: 점령 아래의 헤트만국', en: 'The Hetman coup: the Hetmanate under occupation' },
            central: [CENTRAL_1918_08], white: [SOUTH_1918_08], national: [BESSARABIA] },
        { date: '1918.12.14', label: { ko: '디렉토리아의 승리와 서우크라이나', en: 'The Directory\'s victory; West Ukraine' },
            central: [OBER_OST_1918_12], ukr: [UKRAINE_1917, ZUNR_1919], white: [SOUTH_1918_08, CRIMEA_1920],
            national: [westOf('1918.12'), ...NEIGHBOURS] },
        { date: '1919.02.05', label: { ko: '키예프의 두 번째 상실', en: 'Kyiv lost a second time' },
            central: [OBER_OST_1919], ukr: [UNR_1919_02, ZUNR_1919], white: [SOUTH_1919_05, CRIMEA_1920, ODESA_1919],
            national: [westOf('1919.02'), ...NEIGHBOURS] },
        { date: '1919.04.06', label: { ko: '흐리호리우의 오데사 입성: 소비에트 우크라이나의 정점', en: 'Hryhoriv in Odesa: Soviet Ukraine at its height' },
            ukr: [UNR_1919_04, ZUNR_1919], white: [SOUTH_1919_05, KERCH_1919], national: [westOf('1919.04'), ...NEIGHBOURS] },
        { date: '1919.08.31', label: { ko: '키예프의 두 군대: 데니킨과 디렉토리아', en: 'Two armies in Kyiv: Denikin and the Directory' },
            ukr: [UNR_1919_08], white: [SOUTH_1919_08], national: [westOf('1919.10'), ...NEIGHBOURS] },
        { date: '1919.12.16', label: { ko: '소비에트군의 키예프 탈환과 백군의 후퇴', en: 'Soviet troops retake Kyiv; the Whites fall back' },
            white: [SOUTH_1919_12], national: [westOf('1919.10'), ...NEIGHBOURS] },
        { date: '1920.05.07', label: { ko: '폴란드-우크라이나군의 키예프 입성', en: 'Polish and Ukrainian troops enter Kyiv' },
            ukr: [UNR_1920_05], white: [CRIMEA_1920], national: [westOf('1920.05'), ...NEIGHBOURS] },
        { date: '1920.11.26', label: { ko: '리가 휴전선과 마흐노 공격', en: 'The Riga line; the attack on the Makhnovists' },
            national: [westOf('1920.10'), ...NEIGHBOURS] },
    ],
};
