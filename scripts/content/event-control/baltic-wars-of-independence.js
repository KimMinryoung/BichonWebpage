// Territorial control in the Baltic wars of independence, 1918–1920, for
// the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/baltic-wars-of-independence.json. The
// Soviet fronts and the German occupation line are the Russian Civil War's
// (civil-war.js parts); the Baltic states' outline, Germany and Poland are
// the Soviet-Polish War's. Only the German forces inside Latvia and the
// Northwestern Army's ground are drawn here. Drawn by hand from the
// campaign record; no map is traced.
//
// Coordinates are [lat, lng].

const { SEAS, westOf, FINLAND, POLAND_1918_11, CENTRAL_1918_08, YUDENICH_1919 } = require('./civil-war').parts;
const { GERMANY_WEST, CORRIDOR_1919, DANZIG, EAST_PRUSSIA, OBER_OST_1919, SUWALKI_1919, balticOf, LITHUANIA_WEST,
    DEMARCATION, LITHUANIA_POLAND_1919, LATVIA_POLAND } = require('./soviet-polish-war').parts;

// January 1919: the Germans still between Grodno, Lida and Pinsk.
const OBER_OST_1919_01 = [[54.4, 22.7], [54.35, 23.5], [54.1, 25.4], [53.6, 26.0], [53.2, 26.4], [52.8, 26.8],
    [52.3, 27.4], [52.0, 28.2], [51.9, 24.0], [52.2, 23.2], [52.9, 23.3], [53.0, 22.6], [53.5, 22.4]];
// June 1919, before Cēsis: the Landeswehr and the Iron Division in Riga,
// Courland and Zemgale, under Niedra's government.
const GERMAN_LATVIA_1919_06 = [[57.9, 20.8], [57.8, 22.7], [57.3, 23.5], [57.25, 24.35], [57.25, 25.0],
    [57.1, 25.3], [56.9, 25.4], [56.6, 25.6], [56.2, 25.6], [56.35, 24.5], [56.4, 23.0], [56.3, 21.9], [56.1, 21.0]];
// October 1919: Bermondt's West Russian Army across the Daugava from Riga
// and in Zemgale and inner Courland; Liepāja held out.
const BERMONDT_1919_10 = [[56.97, 24.08], [56.85, 24.35], [56.6, 24.4], [56.35, 24.2], [56.35, 23.0],
    [56.4, 21.8], [56.9, 21.6], [57.2, 22.6], [57.0, 23.5], [57.0, 23.9]];
// June 1919: the Northwestern Army and the Estonians round Pskov.
const YUDENICH_1919_06 = [[59.75, 28.1], [59.75, 28.9], [59.5, 29.3], [59.0, 29.2], [58.4, 28.9], [57.9, 28.6],
    [57.6, 28.1], [57.9, 27.8], [58.9, 27.9]];

const GERMANY_1919 = [GERMANY_WEST, CORRIDOR_1919, EAST_PRUSSIA];
const GERMANY_1920 = [GERMANY_WEST, DANZIG, EAST_PRUSSIA];

module.exports = {
    eventId: 'baltic-wars-of-independence',
    region: ['EST', 'LVA', 'LTU', 'BLR', 'POL', 'RUS', 'FIN'],
    bounds: [[50, 14], [66, 46]],
    sea: [SEAS[0]],
    base: 'red',
    precedence: ['german', 'white', 'baltic', 'national'],
    sides: [
        { id: 'red', label: { ko: '소비에트 러시아와 발트의 소비에트 정부', en: 'Soviet Russia and the Baltic Soviet governments' }, tone: 'red' },
        { id: 'baltic', label: { ko: '에스토니아·라트비아·리투아니아', en: 'Estonia, Latvia and Lithuania' }, tone: 'purple' },
        { id: 'german', label: { ko: '독일과 독일군·자유군단 (베르몬트군 포함)', en: 'Germany, its troops and Freikorps (with Bermondt\'s army)' }, tone: 'amber' },
        { id: 'white', label: { ko: '러시아 백군 (북서군)', en: 'Russian Whites (the Northwestern Army)' }, tone: 'blue' },
        { id: 'national', label: { ko: '폴란드와 핀란드', en: 'Poland and Finland' }, tone: 'gray' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록을 바탕으로 개략적으로 그렸고, 전선은 러시아 내전·소비에트-폴란드 전쟁 지도와 같습니다. 1918년 11월의 세 정부는 아직 독일 점령 아래 있었으므로 점령지로 칠했고, 1919년 초 쿠를란트와 리투아니아에서 독일 의용군이 함께 싸운 지역은 각 정부의 영역으로 칠했습니다. 1919년 가을 리투아니아 북부의 베르몬트군은 표시하지 않았습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record; the fronts are those of the Russian Civil War and Soviet-Polish War maps. The three governments of November 1918 still stood under German occupation and are coloured as occupied; where German volunteers fought beside them in Courland and Lithuania in early 1919, the ground is coloured as theirs. Bermondt\'s forces in northern Lithuania in autumn 1919 are not shown.',
    },
    sources: [],
    phases: [
        { date: '1918.11.18', label: { ko: '독일 점령 아래 세 정부의 출발', en: 'Three governments begin under German occupation' },
            german: [{ area: CENTRAL_1918_08, minus: [POLAND_1918_11] }, ...GERMANY_1919], national: [FINLAND, POLAND_1918_11] },
        { date: '1919.01.07', label: { ko: '붉은군대의 최대 진출: 탈린 앞과 리가', en: 'The Red Army\'s furthest advance: before Tallinn, in Riga' },
            german: [OBER_OST_1919_01, ...GERMANY_1919], baltic: [balticOf('1919.01', LITHUANIA_WEST)],
            national: [westOf('1919.01'), FINLAND] },
        { date: '1919.02.24', label: { ko: '에스토니아 해방과 쿠를란트 전선', en: 'Estonia cleared; the Courland front' },
            german: [OBER_OST_1919, ...GERMANY_1919], baltic: [balticOf('1919.02', LITHUANIA_WEST)],
            national: [westOf('1919.02'), FINLAND] },
        { date: '1919.06.19', label: { ko: '체시스 전투: 란데스베어와 에스토니아군', en: 'The battle of Cēsis: the Landeswehr against the Estonians' },
            german: [GERMAN_LATVIA_1919_06, SUWALKI_1919, ...GERMANY_1919], white: [YUDENICH_1919_06],
            baltic: [balticOf('1919.06', LITHUANIA_POLAND_1919)], national: [westOf('1919.06'), FINLAND] },
        { date: '1919.10.20', label: { ko: '유데니치의 페트로그라드 공세와 베르몬트의 리가 공격', en: 'Yudenich before Petrograd; Bermondt at Riga' },
            german: [BERMONDT_1919_10, ...GERMANY_1919], white: [YUDENICH_1919],
            baltic: [balticOf('1919.10', LITHUANIA_POLAND_1919)], national: [westOf('1919.10'), FINLAND] },
        { date: '1920.02.02', label: { ko: '라트갈레 해방과 타르투 조약', en: 'Latgale cleared; the Treaty of Tartu' },
            german: GERMANY_1920, baltic: [balticOf('1920.03', [...LATVIA_POLAND, ...DEMARCATION])],
            national: [westOf('1920.03'), FINLAND] },
        { date: '1920.07.12', label: { ko: '모스크바 조약과 붉은군대의 빌뉴스 점령', en: 'The Moscow treaty; the Red Army in Vilnius' },
            german: GERMANY_1920, baltic: [balticOf('1920.07', LITHUANIA_WEST)], national: [westOf('1920.07'), FINLAND] },
        { date: '1920.10.09', label: { ko: '수바우키 협정과 젤리고프스키의 빌뉴스 점령', en: 'The Suwałki agreement; Żeligowski seizes Vilnius' },
            german: GERMANY_1920, baltic: [balticOf('1920.10', [...LATVIA_POLAND, ...DEMARCATION])],
            national: [westOf('1920.10'), FINLAND] },
    ],
};
