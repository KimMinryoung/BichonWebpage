// Territorial control from the Brest armistice to the annulment of the
// treaty, for the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/brest-litovsk.json. The occupation lines
// and the White and neighbouring areas are the Russian Civil War's
// (civil-war.js parts), West Ukraine is the Soviet-Polish War's; only the
// Finnish civil war front and the Rada's last ground are drawn here. Drawn
// by hand from the campaign record; no map is traced.
//
// Coordinates are [lat, lng].

const { SEAS, FINLAND, BESSARABIA, CENTRAL_1917_12, UKRAINE_1917, POLAND_1918_11, CENTRAL_1918_03,
    CENTRAL_1918_08, EAST_1918_08, NORTH_1918, KUBAN_1918_03, SOUTH_1918_08 } = require('./civil-war').parts;
const { ZUNR_1919, BUKOVINA } = require('./soviet-polish-war').parts;

// White Finland in the civil war of 1918: north of the front from above
// Pori through Tampere's approaches and Mikkeli to the Karelian Isthmus.
const WHITE_FINLAND_1918 = [[71, 19], [71, 31.5], [69.5, 31.0], [68.2, 30.0], [66.5, 29.9], [65.0, 30.5],
    [64.0, 30.3], [63.0, 31.4], [62.0, 31.3], [61.0, 30.0], [60.6, 29.4], [61.2, 28.4], [61.4, 27.0], [61.6, 25.5],
    [61.8, 24.3], [61.7, 23.2], [61.6, 21.4], [61.5, 19]];
// February 1918: the Rada driven from Kyiv to Zhytomyr and Sarny.
const UNR_1918_02 = [[51.3, 27.0], [51.0, 28.8], [50.2, 28.8], [49.8, 27.8], [50.5, 26.8]];

module.exports = {
    eventId: 'brest-litovsk',
    region: ['RUS', 'UKR', 'BLR', 'EST', 'LVA', 'LTU', 'POL', 'FIN', 'MDA'],
    bounds: [[44, 14], [70, 52]],
    sea: SEAS,
    simplify: 0.12,
    base: 'red',
    precedence: ['central', 'white', 'ukr', 'national'],
    sides: [
        { id: 'red', label: { ko: '소비에트 정권 (1918년 핀란드 적위대 포함)', en: 'Soviet power (with the Finnish Reds, 1918)' }, tone: 'red' },
        { id: 'central', label: { ko: '동맹국과 그 점령지', en: 'The Central Powers and their occupation' }, tone: 'amber' },
        { id: 'ukr', label: { ko: '우크라이나 정부 (라다, 서우크라이나)', en: 'Ukrainian governments (the Rada, West Ukraine)' }, tone: 'purple' },
        { id: 'white', label: { ko: '백군과 협상국 간섭군', en: 'Whites and Allied intervention' }, tone: 'blue' },
        { id: 'national', label: { ko: '독립 국가와 인접국', en: 'Independent and neighbouring states' }, tone: 'gray' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록을 바탕으로 개략적으로 그렸고, 점령선은 러시아 내전 지도와 같습니다. 1918년 3월 이후 라다와 헤트만국, 발트의 공국 계획은 독일 점령 아래 있었으므로 점령지로 칠했습니다. 루마니아 본토는 표시하지 않았습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record; the occupation lines are those of the Russian Civil War map. From March 1918 the Rada, the Hetmanate and the Baltic duchy schemes stood under German occupation and are coloured as occupied. Romania proper is not shown.',
    },
    sources: [],
    phases: [
        { date: '1917.12.15', label: { ko: '브레스트 휴전: 동부전선의 정지', en: 'The Brest armistice: the Eastern Front halts' },
            central: [CENTRAL_1917_12], ukr: [UKRAINE_1917], white: [SOUTH_1918_08], national: [FINLAND, BESSARABIA] },
        { date: '1918.02.09', label: { ko: '빵의 강화와 소비에트군의 키예프 점령', en: 'The bread peace; Soviet troops in Kyiv' },
            central: [CENTRAL_1917_12], ukr: [UNR_1918_02], white: [SOUTH_1918_08], national: [WHITE_FINLAND_1918, BESSARABIA] },
        { date: '1918.03.03', label: { ko: '조약 조인: 파우스트슐라크 뒤의 점령선', en: 'The treaty signed: the line after Faustschlag' },
            central: [CENTRAL_1918_03], white: [KUBAN_1918_03], national: [WHITE_FINLAND_1918, BESSARABIA] },
        { date: '1918.04.29', label: { ko: '헤트만 쿠데타와 핀란드 내전의 끝', en: 'The Hetman coup and the end of the Finnish civil war' },
            central: [CENTRAL_1918_08], national: [FINLAND, BESSARABIA] },
        { date: '1918.08.27', label: { ko: '베를린 보충조약: 점령의 정점', en: 'The Berlin supplementary treaty: occupation at its height' },
            central: [CENTRAL_1918_08], white: [EAST_1918_08, NORTH_1918, SOUTH_1918_08], national: [FINLAND, BESSARABIA] },
        { date: '1918.11.13', label: { ko: '독일의 항복과 조약 폐기', en: 'Germany\'s surrender and the treaty annulled' },
            central: [{ area: CENTRAL_1918_08, minus: [POLAND_1918_11, ZUNR_1919, BUKOVINA] }], ukr: [ZUNR_1919],
            white: [NORTH_1918, SOUTH_1918_08], national: [FINLAND, BESSARABIA, BUKOVINA, POLAND_1918_11] },
    ],
    parts: { WHITE_FINLAND_1918, UNR_1918_02 },
};
