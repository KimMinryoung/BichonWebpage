// Territorial control in the Italian campaign, from the Sicily landings to
// the German surrender, for the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/italian-campaign.json. Drawn by hand from
// the campaign record and the named defensive lines (Volturno, Gustav,
// Gothic); no map is traced.
//
// How a phase is built: the Axis is the remainder (the Kingdom of Italy
// until the armistice, then German-occupied Italy and Salò); the Allies and
// the royal government in the south are laid over it, as everything south
// of a front line plus beachheads.
//
// Coordinates are [lat, lng].

// Coastal waters round Italy, kept clear of France, Corsica, Malta and the
// Yugoslav and Albanian coasts.
const SEAS = [
    [[43.78, 7.55], [43.6, 8.2], [43.7, 9.4], [44.1, 10.0], [44.45, 8.8], [44.2, 8.0]],
    [[43.9, 10.2], [42.9, 9.95], [42.2, 10.5], [41.0, 12.0], [40.0, 13.5], [39.0, 14.8], [38.2, 15.2],
        [38.2, 15.7], [39.0, 16.1], [40.0, 15.6], [40.6, 14.5], [41.2, 13.5], [41.9, 12.2], [42.5, 11.1],
        [43.5, 10.3]],
    [[38.5, 12.2], [37.5, 12.0], [36.5, 14.0], [36.5, 15.2], [37.5, 15.4], [38.3, 15.8], [38.5, 15.5],
        [38.4, 14.0]],
    [[41.25, 8.0], [41.25, 9.9], [39.0, 10.0], [38.7, 8.3], [39.5, 8.0], [40.5, 7.9]],
    [[38.0, 15.8], [37.8, 16.3], [38.5, 17.2], [39.8, 17.2], [40.3, 18.6], [41.0, 17.4], [41.9, 16.5],
        [42.2, 15.5], [43.0, 14.0], [43.6, 13.6], [44.5, 12.6], [45.3, 12.6], [45.5, 13.2], [45.5, 12.3],
        [44.5, 12.2], [43.6, 13.4], [42.3, 14.3], [41.8, 15.5], [41.2, 16.6], [40.6, 17.8], [40.2, 18.4],
        [39.9, 16.8], [39.0, 16.8], [38.2, 16.0]],
];

// Everything south of a front line drawn west to east across the peninsula.
const southOf = line => [[line[0][0], 6], ...line, [line[line.length - 1][0], 19], [35, 19], [35, 6]];

// 10 July 1943: the beachheads from Licata and Gela to Syracuse.
const SICILY_1943_07_10 = [[37.1, 13.8], [37.2, 14.05], [37.15, 14.4], [37.05, 14.7], [37.15, 15.1],
    [37.1, 15.35], [36.5, 15.2], [36.5, 13.8]];
// 24 July: western Sicily and Palermo taken; the Germans on the line from
// Santo Stefano to the plain of Catania.
const SICILY_1943_07_24 = [[38.5, 11.9], [38.5, 14.35], [37.9, 14.4], [37.6, 14.6], [37.45, 15.0],
    [37.35, 15.4], [36.5, 15.4], [36.5, 11.9]];
const SICILY = [[38.5, 11.9], [38.5, 15.7], [37.9, 15.7], [36.5, 15.4], [36.5, 11.9]];
// 8 September: Sicily and the toe of Calabria, landed on on the 3rd.
const CALABRIA_1943_09_08 = [[38.9, 15.6], [38.75, 16.3], [38.4, 16.6], [37.8, 16.3], [37.9, 15.6]];
// 1 October: Naples, Foggia and the Volturno–Termoli line, with the south
// that the royal government held and Sardinia, which the Germans left.
const VOLTURNO_1943_10 = [[41.02, 13.93], [41.15, 14.25], [41.3, 14.6], [41.55, 14.9], [41.95, 15.0]];
// January 1944: the Gustav Line from the Garigliano past Cassino to Ortona,
// and the Anzio beachhead.
const GUSTAV_1944 = [[41.22, 13.77], [41.35, 13.8], [41.49, 13.83], [41.7, 14.05], [41.95, 14.2],
    [42.2, 14.3], [42.35, 14.42]];
const ANZIO_1944 = [[41.43, 12.55], [41.62, 12.55], [41.6, 12.85], [41.4, 12.85]];
// 4 June 1944: past Rome, the Germans falling back from Avezzano and the
// Adriatic coast.
const ROME_1944_06 = [[41.95, 12.15], [42.02, 12.5], [41.98, 13.0], [42.02, 13.6], [42.25, 14.2],
    [42.4, 14.35]];
// 25 August 1944: on the Arno from Pisa to Florence, the Apennines, and
// the Metauro on the Adriatic.
const ARNO_1944_08 = [[43.68, 10.28], [43.72, 10.4], [43.72, 10.9], [43.77, 11.25], [43.7, 11.9],
    [43.65, 12.5], [43.83, 13.05]];
// The winter line of 1944–45: Viareggio, the Apennines south of Bologna,
// the Senio, Ravenna.
const WINTER_1944 = [[43.95, 10.2], [44.15, 10.7], [44.25, 11.25], [44.3, 11.7], [44.4, 11.9],
    [44.55, 12.3]];
// 25 April 1945: the Allies over the Po, Genoa, Milan and Turin freed by the
// partisans' general rising.
const PO_1945_04 = [[44.3, 8.45], [44.6, 9.2], [45.05, 9.7], [45.13, 10.02], [45.05, 11.0], [45.05, 11.6],
    [45.1, 12.45]];
const RISING_1945 = [[45.46, 9.19, 0.25], [45.07, 7.69, 0.25]].map(circle => ({ circle }));

module.exports = {
    eventId: 'italian-campaign',
    region: ['ITA', 'SMR', 'VAT'],
    sea: SEAS,
    base: 'axis',
    precedence: ['allied'],
    sides: [
        { id: 'axis', label: { ko: '추축국 (1943년 9월부터 독일 점령지와 살로 공화국)', en: 'The Axis (from September 1943 German-occupied Italy and Salò)' }, tone: 'blue' },
        { id: 'allied', label: { ko: '연합국과 남부의 왕국 정부', en: 'The Allies and the royal government in the south' }, tone: 'purple' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록과 볼투르노·구스타프·고딕 방어선을 바탕으로 개략적으로 그렸습니다. 1945년 4월에는 파르티잔이 해방한 도시 가운데 밀라노·토리노만 표시했고, 1945년 5월 트리에스테는 유고슬라비아 파르티잔이 먼저 들어갔습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record and the Volturno, Gustav and Gothic lines. In April 1945 only Milan and Turin are shown among the cities the partisans freed; Yugoslav partisans reached Trieste first in May 1945.',
    },
    sources: [],
    phases: [
        { date: '1943.07.09', label: { ko: '시칠리아 상륙', en: 'The Sicily landings' }, allied: [SICILY_1943_07_10] },
        { date: '1943.07.24', label: { ko: '팔레르모 점령: 에트나 전선', en: 'Palermo taken: the Etna line' }, allied: [SICILY_1943_07_24] },
        { date: '1943.08.17', label: { ko: '시칠리아 점령', en: 'Sicily taken' }, allied: [SICILY] },
        { date: '1943.09.08', label: { ko: '휴전 발표: 칼라브리아 상륙', en: 'The armistice announced: Calabria landed on' },
            allied: [SICILY, CALABRIA_1943_09_08] },
        { date: '1943.10.01', label: { ko: '나폴리 점령: 볼투르노 선', en: 'Naples taken: the Volturno line' },
            allied: [southOf(VOLTURNO_1943_10)] },
        { date: '1944.01.22', label: { ko: '구스타프 선과 안치오 교두보', en: 'The Gustav Line and the Anzio beachhead' },
            allied: [southOf(GUSTAV_1944), ANZIO_1944] },
        { date: '1944.06.04', label: { ko: '로마 해방', en: 'Rome liberated' }, allied: [southOf(ROME_1944_06)] },
        { date: '1944.08.25', label: { ko: '아르노 강과 고딕 선', en: 'The Arno and the Gothic Line' }, allied: [southOf(ARNO_1944_08)] },
        { date: '1944.12.31', label: { ko: '겨울 전선', en: 'The winter line' }, allied: [southOf(WINTER_1944)] },
        { date: '1945.04.25', label: { ko: '총봉기: 포 강 도하와 북부 도시 해방', en: 'The general rising: over the Po, the northern cities freed' },
            allied: [southOf(PO_1945_04), ...RISING_1945] },
        { date: '1945.05.02', label: { ko: '독일군 항복', en: 'The German surrender' }, allied: [southOf([[48, 6], [48, 19]])] },
    ],
};
