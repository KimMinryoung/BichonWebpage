// Territorial control in the Soviet-Polish War for the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/soviet-polish-war.json. The Soviet fronts
// are the Russian Civil War's (civil-war.js parts.FRONTS), so the two maps
// never disagree: Poland is everything west of a front, and Germany and the
// other states and forces are laid over it. Drawn by hand from the campaign
// record; no map is traced.
//
// Coordinates are [lat, lng].

const { FRONTS, northOf, westOf, BESSARABIA, UNR_1919_10, SOUTH_1919_05, SOUTH_1919_10, CRIMEA_1920,
    WRANGEL_1920 } = require('./civil-war').parts;

// Coastal waters of the eastern Baltic, kept off Sweden and Bornholm, whose
// coasts the wider shared ring would outline in this frame.
const SEA = [[60.3, 22.0], [60.3, 30.5], [59.5, 30.5], [59.0, 25.0], [57.0, 25.0], [56.0, 22.0], [55.0, 21.0],
    [54.3, 19.5], [54.0, 17.0], [53.8, 14.2], [54.5, 14.2], [54.9, 16.0], [55.0, 18.5], [55.5, 20.5], [56.5, 20.5],
    [57.5, 20.8], [58.2, 21.3], [59.0, 21.8]];

// Germany under the Versailles border, Upper Silesia whole until 1922.
const GERMANY_WEST = [[55.5, 14], [55.5, 17.95], [54.83, 17.95], [54.6, 17.75], [54.35, 17.55], [54.0, 17.45],
    [53.75, 17.3], [53.4, 17.2], [53.05, 17.0], [52.95, 16.5], [52.85, 16.0], [52.55, 15.85], [52.25, 15.9],
    [52.0, 16.0], [51.8, 16.3], [51.65, 16.8], [51.5, 17.2], [51.35, 17.6], [51.2, 17.95], [51.0, 18.2],
    [50.9, 18.75], [50.5, 19.0], [50.25, 19.1], [50.0, 18.9], [49.95, 18.4], [49.9, 17.5], [49.5, 14]];
// Pomerelia, Danzig and the Chelmno land, German until January 1920.
const CORRIDOR_1919 = [[54.83, 17.95], [54.9, 19.0], [54.35, 19.0], [53.9, 18.85], [53.5, 19.3], [53.45, 19.5],
    [53.15, 19.3], [53.0, 18.9], [53.0, 18.3], [52.95, 17.6], [53.05, 17.0], [53.4, 17.2], [54.0, 17.45],
    [54.6, 17.75]];
const DANZIG = [[54.5, 18.45], [54.5, 19.35], [54.2, 19.35], [54.05, 19.0], [54.15, 18.45]];
// East Prussia after the plebiscite of July 1920.
const EAST_PRUSSIA = [[55.35, 21.25], [55.1, 22.0], [55.05, 22.6], [54.9, 22.9], [54.4, 22.8], [54.1, 22.8],
    [53.75, 22.7], [53.55, 22.2], [53.4, 21.9], [53.25, 21.5], [53.2, 20.9], [53.25, 20.4], [53.3, 20.1],
    [53.45, 19.7], [53.5, 19.3], [53.75, 18.95], [54.0, 19.05], [54.4, 19.35], [54.6, 19.9], [55.35, 19.9]];
// Ober Ost, the German zone Grodno-Bialystok-Suwalki being evacuated in
// February 1919, and the Suwalki region the Germans kept until August.
const OBER_OST_1919 = [[54.4, 22.7], [54.2, 23.9], [54.0, 24.3], [53.6, 24.55], [53.2, 24.65], [52.9, 24.3],
    [52.9, 23.3], [53.0, 22.6], [53.5, 22.4], [53.9, 22.5]];
const SUWALKI_1919 = [[54.4, 22.7], [54.3, 23.4], [54.0, 23.5], [53.9, 22.9], [54.1, 22.6]];

// The Baltic states: the part of a front's Baltic stretch west of the
// Soviets, closed back west along the Lithuanian line with the Poles.
const balticOf = (date, south) => [...northOf(date), ...FRONTS[date].baltic, ...south];
const LITHUANIA_WEST = [[54.1, 23.4], [54.3, 23.0], [54.4, 22.8], [54.45, 19]];
// The Polish-Lithuanian demarcation, Vilnius on the Polish side.
const DEMARCATION = [[55.1, 25.0], [54.8, 24.6], [54.4, 24.3], [54.05, 23.9], ...LITHUANIA_WEST];
// The same, from Latgale's edge on the Daugava while it was Soviet (1919).
const LITHUANIA_POLAND_1919 = [[55.7, 26.0], [55.45, 25.8], [55.3, 25.5], ...DEMARCATION];
// Round Latvia (with Abrene, Latvian from 1920) to Polish-held Braslaw.
const LATVIA_POLAND = [[56.1, 28.2], [55.95, 27.6], [55.75, 26.9], [55.7, 26.4], [55.45, 25.8], [55.3, 25.5]];

// The West Ukrainian People's Republic in eastern Galicia, round the Polish
// Przemysl-Lwów corridor, until July 1919.
const ZUNR_1919 = [[50.6, 24.1], [50.45, 24.5], [50.3, 25.0], [50.05, 25.25], [49.75, 25.8], [49.55, 26.15],
    [48.55, 26.25], [48.6, 25.4], [48.3, 25.25], [47.95, 24.9], [48.15, 24.4], [48.55, 23.6], [48.9, 23.0],
    [49.1, 22.6], [49.35, 22.7], [49.55, 23.1], [49.7, 23.5], [49.72, 24.05], [49.85, 24.2], [49.97, 24.05],
    [50.2, 24.0], [50.4, 23.95]];
// The Ukrainian People's Republic (the Directory) and, on the coast, the
// French at Odesa.
const UNR_1919_02 = [[51.2, 24.0], [51.7, 25.5], [51.5, 27.0], [51.1, 28.3], [50.5, 29.0], [49.9, 29.3],
    [49.3, 29.6], [48.7, 30.3], [48.0, 30.5], [47.0, 30.8], [46.5, 31.0], [46.35, 30.25], [47.0, 29.9],
    [47.8, 29.3], [48.2, 28.3], [48.45, 27.0],
    [48.55, 26.25], [49.55, 26.15], [49.75, 25.8], [50.05, 25.25], [50.3, 25.0], [50.45, 24.5], [50.6, 24.1]];
const UNR_1919_04 = [[51.3, 25.1], [51.6, 26.3], [51.0, 26.5], [50.6, 26.7], [50.0, 26.7], [49.4, 26.8],
    [48.6, 27.0], [48.45, 27.0], [48.55, 26.25], [49.55, 26.15], [49.75, 25.8], [50.05, 25.25], [50.3, 25.0],
    [50.45, 24.5], [50.75, 24.9]];
// Romanian Bukovina and Czechoslovak Subcarpathian Ruthenia.
const BUKOVINA = [[48.55, 26.25], [48.6, 25.4], [48.3, 25.25], [47.95, 24.9], [47.7, 25.0], [47.7, 26.5],
    [48.3, 26.8], [48.5, 26.5]];
const RUTHENIA = [[49.1, 22.6], [48.9, 23.0], [48.55, 23.6], [48.15, 24.4], [47.95, 24.9], [47.7, 24.9],
    [47.8, 22.2], [48.4, 22.0], [49.0, 22.1]];
const NEIGHBOURS = [BESSARABIA, BUKOVINA, RUTHENIA];

const phase = (date, front, label, parts) => ({ date, label, poland: [westOf(front)], ...parts });

module.exports = {
    eventId: 'soviet-polish-war',
    region: ['POL', 'LTU', 'LVA', 'EST', 'BLR', 'UKR', 'MDA', 'RUS'],
    bounds: [[44, 14], [61, 42]],
    sea: SEA,
    base: 'red',
    precedence: ['german', 'other', 'poland'],
    sides: [
        { id: 'red', label: { ko: '소비에트 러시아와 소비에트 공화국', en: 'Soviet Russia and the Soviet republics' }, tone: 'red' },
        { id: 'poland', label: { ko: '폴란드 (1920년 동맹 우크라이나군 포함)', en: 'Poland (with allied Ukrainian forces in 1920)' }, tone: 'blue' },
        { id: 'german', label: { ko: '독일과 단치히', en: 'Germany and Danzig' }, tone: 'amber' },
        { id: 'other', label: { ko: '다른 국가와 세력', en: 'Other states and forces' }, tone: 'gray' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록을 바탕으로 개략적으로 그렸고, 소비에트 쪽 전선은 러시아 내전 지도와 같습니다. 회색은 발트 3국, 1919년의 서우크라이나 인민공화국과 우크라이나 인민공화국, 데니킨과 브랑겔의 백군, 루마니아령 베사라비아·부코비나, 체코슬로바키아령 루테니아입니다. 1919년 초의 독일에는 철수 중이던 동부 점령지가 포함되며, 단치히는 1920년 11월 자유시가 되었습니다. 전선 뒤의 봉기와 유격 지역, 마흐노 지역은 표시하지 않았습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record; the Soviet fronts are those of the Russian Civil War map. Grey marks the Baltic states, the West Ukrainian and Ukrainian People\'s Republics of 1919, the White armies of Denikin and Wrangel, Romanian Bessarabia and Bukovina, and Czechoslovak Ruthenia. Germany in early 1919 includes the eastern zone it was evacuating; Danzig became a free city in November 1920. Uprisings and partisan areas behind the lines and Makhno\'s region are not shown.',
    },
    sources: [],
    phases: [
        phase('1919.02.14', '1919.02', { ko: '첫 교전: 독일군이 물러나는 벨로루시', en: 'The first clash, as the Germans leave Belorussia' }, {
            german: [GERMANY_WEST, CORRIDOR_1919, EAST_PRUSSIA, OBER_OST_1919],
            other: [balticOf('1919.02', LITHUANIA_WEST), ZUNR_1919, UNR_1919_02, ...NEIGHBOURS, SOUTH_1919_05],
        }),
        phase('1919.04.19', '1919.04', { ko: '폴란드군의 빌뉴스 점령', en: 'Polish troops take Vilnius' }, {
            german: [GERMANY_WEST, CORRIDOR_1919, EAST_PRUSSIA, SUWALKI_1919],
            other: [balticOf('1919.04', DEMARCATION), ZUNR_1919, UNR_1919_04, ...NEIGHBOURS, SOUTH_1919_05],
        }),
        phase('1919.10', '1919.10', { ko: '전선 동결과 미카셰비체 회담', en: 'The front frozen; the Mikaszewicze talks' }, {
            german: [GERMANY_WEST, CORRIDOR_1919, EAST_PRUSSIA],
            other: [balticOf('1919.10', LITHUANIA_POLAND_1919), UNR_1919_10,
                ...NEIGHBOURS, SOUTH_1919_10],
        }),
        phase('1920.05.07', '1920.05', { ko: '폴란드-우크라이나군의 키예프 입성', en: 'Polish and Ukrainian troops enter Kyiv' }, {
            german: [GERMANY_WEST, DANZIG, EAST_PRUSSIA],
            other: [balticOf('1920.05', [...LATVIA_POLAND, ...DEMARCATION]), ...NEIGHBOURS, CRIMEA_1920],
        }),
        phase('1920.07.30', '1920.07', { ko: '7월 공세 뒤: 비아위스토크의 폴레브콤', en: 'After the July offensive: the Polrevkom at Białystok' }, {
            german: [GERMANY_WEST, DANZIG, EAST_PRUSSIA],
            other: [balticOf('1920.07', LITHUANIA_WEST), ...NEIGHBOURS, WRANGEL_1920],
        }),
        phase('1920.08.13', '1920.08', { ko: '바르샤바 전투: 붉은군대의 최대 진출', en: 'The battle of Warsaw: the Red Army\'s furthest advance' }, {
            german: [GERMANY_WEST, DANZIG, EAST_PRUSSIA],
            other: [balticOf('1920.08', LITHUANIA_WEST), ...NEIGHBOURS, WRANGEL_1920],
        }),
        phase('1920.10.18', '1920.10', { ko: '휴전 발효: 리가 휴전선', en: 'The armistice takes effect: the Riga line' }, {
            german: [GERMANY_WEST, DANZIG, EAST_PRUSSIA],
            other: [balticOf('1920.10', [...LATVIA_POLAND, ...DEMARCATION]), ...NEIGHBOURS, WRANGEL_1920],
        }),
    ],
    parts: {
        SEA, GERMANY_WEST, CORRIDOR_1919, DANZIG, EAST_PRUSSIA, OBER_OST_1919, SUWALKI_1919, balticOf, LITHUANIA_WEST,
        DEMARCATION, LITHUANIA_POLAND_1919, LATVIA_POLAND, ZUNR_1919, UNR_1919_02, UNR_1919_04, BUKOVINA, RUTHENIA,
        NEIGHBOURS,
    },
};
