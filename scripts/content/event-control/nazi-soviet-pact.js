// Territorial control from the Molotov–Ribbentrop pact to the annexations
// of 1940, for the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/nazi-soviet-pact.json. The Riga border and
// the Baltic states are the Soviet-Polish War's, the Soviet western border
// of June 1941 is the Great Patriotic War's first line; the pre-war Finnish
// border, the German advance of September 1939, the partition line and
// the Karelian cession are drawn here. Drawn by hand from the record; no
// map is traced.
//
// How a phase is built: the remainder is the other states (grey); Poland
// is everything west of the Riga border, Soviet and German areas are laid
// over it, and the Baltic states and Romania are cut out as grey pockets
// while they stay independent.
//
// Coordinates are [lat, lng].

const { SEAS, FRONTS, westOf } = require('./civil-war').parts;
const { GERMANY_WEST, DANZIG, EAST_PRUSSIA, balticOf, LATVIA_POLAND, DEMARCATION } = require('./soviet-polish-war').parts;
const { LINES } = require('./great-patriotic-war').parts;

// Soviet-held: left of a line run north to south, closed round the east.
const eastOf = line => [[72, line[0][1]], ...line, [34, line[line.length - 1][1]], [34, 70], [72, 70]];

// The Soviet western border before the war: Finland's border of 1920
// (Petsamo Finnish, the isthmus on the Sestra), the Estonian and Latvian
// borders, the Riga border, and the Dniester against Romanian Bessarabia.
const LINE_1939 = [[69.95, 31.9], [69.4, 31.1], [68.4, 30.0], [67.2, 29.4], [66.4, 29.7], [65.0, 29.9], [64.0, 30.3],
    [63.0, 31.3], [62.4, 31.2], [61.8, 31.5], [61.3, 31.9], [60.55, 30.35], [60.3, 30.1], [60.12, 29.95],
    [59.95, 28.9], [59.45, 28.05], [57.9, 27.8], ...FRONTS['1920.10'].polish, [48.2, 28.3], [47.8, 29.3],
    [47.0, 29.9], [46.35, 30.25], [45.5, 30.6]];
// Eastern Poland as the Soviets took it in September 1939: from the
// Latvian border round Vilnius to the Pisa, the Narew, the Bug and the San,
// then the Hungarian and Romanian borders, back up the Riga border.
const EAST_POLAND_1939 = [[56.1, 28.2], [55.95, 27.6], [55.75, 26.9], [55.7, 26.6], [55.45, 25.8], [55.3, 25.5],
    [55.1, 25.0], [54.8, 24.6], [54.4, 24.3], [54.05, 23.9], [53.95, 23.5], [53.4, 22.3], [53.0, 21.9], [52.6, 22.1],
    [52.2, 23.2], [51.6, 23.6], [51.0, 24.0], [50.4, 23.6], [50.0, 23.0], [49.6, 22.7], [49.1, 22.6], [48.9, 23.3],
    [48.5, 24.0], [48.1, 24.6], [47.95, 24.9], [48.3, 25.25], [48.6, 25.4], [48.55, 26.25],
    ...FRONTS['1920.10'].polish.slice(1).reverse()];
// Vilnius and its region, handed to Lithuania in October 1939.
const VILNIUS_1939 = [[55.45, 25.8], [55.2, 26.5], [54.8, 26.1], [54.5, 25.9], [54.15, 25.5], [54.05, 23.9],
    [54.4, 24.3], [54.8, 24.6], [55.1, 25.0], [55.3, 25.5]];
// The Karelian Isthmus and Ladoga Karelia, ceded in March 1940.
const FINNISH_CESSION_1940 = [[63.0, 31.3], [62.2, 30.9], [61.6, 29.9], [61.0, 28.9], [60.6, 27.8], [60.2, 27.5],
    [59.95, 28.0], [60.12, 29.95], [60.3, 30.1], [60.55, 30.35], [61.3, 31.9], [61.8, 31.5], [62.4, 31.2]];

// Germany in 1939: the Versailles border with the 1922 partition of Upper
// Silesia (Katowice Polish), East Prussia and the Memel territory, annexed
// from Lithuania in March 1939.
const silesia = GERMANY_WEST.findIndex(([lat, lng]) => lat === 50.9 && lng === 18.75);
const GERMANY_1939 = [...GERMANY_WEST.slice(0, silesia + 1), [50.5, 18.85], [50.3, 18.8], [50.15, 18.55],
    [50.0, 18.35], [49.95, 18.25], [49.9, 17.5], [49.5, 14]];
const MEMEL = [[56.0, 20.9], [55.95, 21.6], [55.6, 21.9], [55.2, 22.2], [55.1, 22.0], [55.3, 21.25]];
// Mid-September 1939: the Germans at Białystok, Brest and before Lwów.
const GERMAN_1939_09_17 = [[55.0, 14], [55.0, 21.2], [55.05, 22.0], [55.05, 22.8], [54.4, 22.8], [54.0, 22.7],
    [53.6, 23.0], [53.4, 23.5], [53.0, 23.7], [52.6, 23.8], [52.1, 23.8], [51.6, 23.4], [51.2, 22.8], [50.7, 22.8],
    [50.3, 23.2], [50.0, 23.6], [49.85, 23.85], [49.5, 23.85], [49.0, 23.5], [48.8, 23.4], [48.8, 14]];
// After 28 September: everything west of the partition line.
const GERMAN_ZONE_1939 = [[55.0, 14], [55.0, 21.2], [55.05, 22.0], [55.05, 22.8], [54.4, 22.8],
    ...EAST_POLAND_1939.slice(EAST_POLAND_1939.findIndex(([lat, lng]) => lat === 53.95 && lng === 23.5),
        EAST_POLAND_1939.findIndex(([lat, lng]) => lat === 49.1 && lng === 22.6) + 1),
    [49.1, 14]];
const GERMANY_1939_ALL = [GERMANY_1939, EAST_PRUSSIA, MEMEL];

// Polish forces still holding out.
const circle = (lat, lng, r) => ({ circle: [lat, lng, r] });
const WARSAW = circle(52.23, 21.0, 0.3);
const MODLIN = circle(52.43, 20.72, 0.12);
const BZURA = circle(52.3, 20.3, 0.25);
const HEL = circle(54.65, 18.75, 0.1);
const KOCK = circle(51.64, 22.45, 0.3);

// Independent neighbours cut out of Poland and the Soviet Union: the
// Baltic states (Lithuania without Vilnius until October 1939) and Romania
// with Bessarabia, northern Bukovina and Hungarian Ruthenia.
const BALTIC_1939 = balticOf('1920.10', [...LATVIA_POLAND, ...DEMARCATION]);
const ROMANIA_1939 = [[48.55, 26.25], [48.6, 25.4], [48.3, 25.25], [47.95, 24.9], [48.1, 24.6], [48.5, 24.0],
    [48.9, 23.3], [49.1, 22.6], [48.8, 22.0], [48.0, 20.0], [46.0, 14], [43, 14], [43, 31], [46.35, 30.25],
    [47.0, 29.9], [47.8, 29.3], [48.2, 28.3], [48.5, 26.5]];

const POLAND = westOf('1920.10');
const USSR_1939 = eastOf(LINE_1939);
const USSR_1940 = eastOf(LINES['1941.06']);

module.exports = {
    eventId: 'nazi-soviet-pact',
    region: ['POL', 'LTU', 'LVA', 'EST', 'BLR', 'UKR', 'MDA', 'RUS', 'FIN', 'ROU'],
    bounds: [[43, 14], [71, 50]],
    sea: SEAS,
    simplify: 0.12,
    base: 'national',
    precedence: ['german', 'soviet', 'poland'],
    carve: ['soviet', 'poland'],
    sides: [
        { id: 'soviet', label: { ko: '소련', en: 'Soviet Union' }, tone: 'red' },
        { id: 'german', label: { ko: '독일과 독일 점령지', en: 'Germany and German-occupied land' }, tone: 'blue' },
        { id: 'poland', label: { ko: '폴란드', en: 'Poland' }, tone: 'purple' },
        { id: 'national', label: { ko: '다른 나라', en: 'Other states' }, tone: 'gray' },
    ],
    note: {
        ko: '경계는 근사치이며 조약과 작전 기록을 바탕으로 개략적으로 그렸고, 리가 국경과 발트 3국은 소비에트-폴란드 전쟁 지도, 1940년 이후의 소련 국경은 대조국전쟁 지도와 같습니다. 독일 본토, 보헤미아·모라비아 보호령과 슬로바키아는 칠하지 않았고, 1939년 10월 발트 3국에 들어선 소련군 기지와 겨울전쟁 때의 살라·리바치 할양은 표시하지 않았습니다.',
        en: 'Boundaries are approximate, sketched from the treaties and the campaign record; the Riga border and the Baltic states are those of the Soviet-Polish War map, the Soviet border from 1940 that of the Great Patriotic War map. Germany proper, the Protectorate of Bohemia and Moravia and Slovakia are not coloured; the Soviet bases placed in the Baltic states in October 1939 and the Salla and Rybachy cessions of the Winter War are not shown.',
    },
    sources: [],
    phases: [
        { date: '1939.08.23', label: { ko: '조약 조인: 전쟁 전의 국경', en: 'The pact signed: the borders before the war' },
            soviet: [USSR_1939], german: GERMANY_1939_ALL, poland: [POLAND], national: [BALTIC_1939, ROMANIA_1939, DANZIG] },
        { date: '1939.09.17', label: { ko: '소련군의 폴란드 침공 개시와 독일군의 진격선', en: 'The Soviet invasion begins; the German advance' },
            soviet: [USSR_1939], poland: [POLAND], national: [BALTIC_1939, ROMANIA_1939],
            german: [{ area: GERMAN_1939_09_17, minus: [WARSAW, MODLIN, BZURA, HEL] }, ...GERMANY_1939_ALL] },
        { date: '1939.09.28', label: { ko: '독소 우호 및 국경 조약: 분할선', en: 'The Boundary and Friendship Treaty: the partition line' },
            soviet: [USSR_1939, EAST_POLAND_1939], poland: [POLAND], national: [BALTIC_1939, ROMANIA_1939],
            german: [{ area: GERMAN_ZONE_1939, minus: [MODLIN, HEL, KOCK] }, MEMEL] },
        { date: '1939.10.10', label: { ko: '발트 상호원조조약과 빌뉴스의 리투아니아 이양', en: 'The Baltic mutual assistance treaties; Vilnius to Lithuania' },
            soviet: [USSR_1939, EAST_POLAND_1939], national: [BALTIC_1939, VILNIUS_1939, ROMANIA_1939],
            german: [GERMAN_ZONE_1939, MEMEL] },
        { date: '1940.03.13', label: { ko: '겨울전쟁 강화: 카렐리야 할양', en: 'The Winter War peace: Karelia ceded' },
            soviet: [USSR_1939, EAST_POLAND_1939, FINNISH_CESSION_1940], national: [BALTIC_1939, VILNIUS_1939, ROMANIA_1939],
            german: [GERMAN_ZONE_1939, MEMEL] },
        { date: '1940.06.15', label: { ko: '발트 3국 점령', en: 'The Baltic states occupied' },
            soviet: [USSR_1940], national: [ROMANIA_1939], german: [GERMAN_ZONE_1939, MEMEL] },
        { date: '1940.06.28', label: { ko: '베사라비아와 북부코비나 점령', en: 'Bessarabia and northern Bukovina occupied' },
            soviet: [USSR_1940], german: [GERMAN_ZONE_1939, MEMEL] },
    ],
};
