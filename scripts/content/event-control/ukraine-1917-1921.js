// Territorial control in the Ukrainian revolution and war, 1917–1921, for
// the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/ukraine-1917-1921.json. The Soviet fronts,
// the occupation lines and the White areas are the Russian Civil War's
// (civil-war.js parts); the Ukrainian governments of 1919, West Ukraine and
// the neighbouring states are the Soviet-Polish War's. West of a front lies
// Poland and its neighbours, with the Ukrainian governments laid over it.
// Drawn by hand from the campaign record; no map is traced. The Makhnovist
// and otaman areas and the risings behind the lines are sketched round the
// towns the record names (Huliaipole, Oleksandrivsk, Yelysavethrad,
// Trypillia, the Kholodny Yar); risings are hatched over whoever held the
// ground.
//
// Coordinates are [lat, lng].

const { SEAS, westOf, BESSARABIA, CENTRAL_1917_12, UKRAINE_1917, CENTRAL_1918_03,
    CENTRAL_1918_08, KUBAN_1918_03, SOUTH_1918_08, SOUTH_1919_05, SOUTH_1919_10, UNR_1919_10, CRIMEA_1920,
    WRANGEL_1920, POLAND_1918_11 } = require('./civil-war').parts;
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

// June–August 1918: the Zvenyhorodka–Tarashcha rising against the Hetman
// and the occupiers, between Tarashcha, Kaniv, Zvenyhorodka and Uman.
const ZVENYHORODKA_1918 = [[49.75, 30.15], [49.8, 30.9], [49.5, 31.45], [49.1, 31.4], [48.85, 31.0], [48.9, 30.4],
    [49.3, 30.1]];
// Autumn 1918: Makhno's partisans round Huliaipole and Dibrivka.
const HULIAIPOLE_1918 = [[48.15, 35.9], [48.15, 36.7], [47.8, 37.0], [47.4, 36.8], [47.35, 36.0], [47.7, 35.6]];
// December 1918 to January 1919: the Makhnovist region east of the Dnieper,
// from Huliaipole towards Oleksandrivsk.
const MAKHNO_1918_12 = [[48.25, 35.5], [48.3, 36.6], [48.0, 37.3], [47.4, 37.3], [47.1, 36.6], [47.25, 35.6],
    [47.8, 35.25]];
// February–May 1919: the Makhnovist brigade's ground inside the Soviet
// front, out to Berdiansk and Mariupol.
const MAKHNO_1919 = [[48.3, 35.4], [48.35, 36.7], [48.1, 37.4], [47.1, 37.6], [46.75, 36.8], [46.8, 35.9],
    [47.3, 35.3], [47.85, 35.1]];
// Spring and summer 1919: the otaman Zelenyi round Trypillia, against the
// Soviets on both banks of the Dnieper.
const ZELENYI_1919 = [[50.35, 30.35], [50.3, 31.1], [50.05, 31.6], [49.85, 31.3], [49.85, 30.6], [50.05, 30.3]];
// Mid-May 1919: Hryhoriv's rising, from Cherkasy and Kremenchuk to
// Yelysavethrad, Mykolaiv and Kherson, briefly Yekaterinoslav.
const HRYHORIV_1919_05 = [[49.45, 31.6], [49.45, 32.3], [49.15, 33.4], [48.75, 34.3], [48.5, 35.0], [48.15, 34.6],
    [47.9, 33.8], [47.3, 33.2], [46.6, 32.9], [46.45, 32.3], [46.85, 31.7], [47.6, 31.3], [48.2, 30.6], [48.7, 30.2],
    [49.0, 30.6], [49.3, 31.2]];
// Late June 1919: Denikin through Kharkiv and Yekaterinoslav to the
// Dnieper, Northern Tavria and Crimea, with the Don and Tsaritsyn behind.
const SOUTH_1919_06 = [[50.4, 36.3], [50.6, 37.6], [50.9, 39.3], [51.0, 41.0], [50.6, 43.0], [49.8, 45.0],
    [48.5, 45.5], [46.0, 47.0], [44.0, 47.5], [41.9, 48.5], [41.5, 41.5], [44.0, 34.0], [44.3, 32.5], [45.6, 32.4],
    [46.2, 33.6], [46.8, 34.4], [47.4, 34.6], [47.9, 34.9], [48.5, 34.9], [49.2, 35.2], [49.8, 35.6]];
// October–November 1919: the Makhnovist territory behind Denikin, from
// Yekaterinoslav and Nikopol to Berdiansk and Melitopol.
const MAKHNO_1919_10 = [[48.6, 34.7], [48.55, 35.5], [48.3, 36.3], [47.9, 37.2], [47.15, 37.5], [46.75, 36.8],
    [46.65, 35.8], [46.75, 35.1], [47.2, 34.6], [47.55, 34.2], [48.1, 34.2]];
// Mid-December 1919: what was left round Oleksandrivsk and Nikopol.
const MAKHNO_1919_12 = [[47.95, 34.7], [47.95, 35.6], [47.8, 36.4], [47.4, 36.5], [47.3, 35.6], [47.5, 34.5]];
// 1919–1922: the Kholodny Yar forest republic near Chyhyryn.
const KHOLODNY_YAR = [[49.3, 32.1], [49.3, 32.85], [49.0, 33.0], [48.8, 32.6], [48.85, 32.1]];
// 1920: the outlawed Makhnovists' partisan country round Huliaipole.
const MAKHNO_PARTISAN_1920 = [[48.4, 35.3], [48.5, 36.6], [48.1, 37.4], [47.4, 37.4], [47.2, 36.5], [47.4, 35.4],
    [47.9, 35.1]];
// October–November 1920: the allied Makhnovists' Huliaipole district.
const MAKHNO_1920_10 = [[48.0, 35.7], [48.0, 36.7], [47.6, 36.9], [47.45, 36.4], [47.5, 35.8]];
// 1921: Makhno's raids across the Left Bank, from Poltava to the Donbas.
const MAKHNO_PARTISAN_1921 = [[49.6, 33.5], [49.7, 35.5], [49.1, 37.6], [48.0, 38.0], [47.1, 37.4], [46.9, 35.5],
    [47.6, 34.3], [48.7, 33.2]];

module.exports = {
    eventId: 'ukraine-1917-1921',
    region: ['UKR', 'MDA', 'BLR', 'POL', 'RUS'],
    bounds: [[43, 14], [57, 48]],
    sea: [SEAS[1]],
    base: 'red',
    precedence: ['makhno', 'otaman', 'central', 'white', 'ukr', 'national'],
    overlays: ['makhnoPartisan', 'rising'],
    sides: [
        { id: 'red', label: { ko: '소비에트 정권', en: 'Soviet power' }, tone: 'red' },
        { id: 'ukr', label: { ko: '우크라이나 정부 (라다, 디렉토리아, 서우크라이나)', en: 'Ukrainian governments (the Rada, the Directory, West Ukraine)' }, tone: 'purple' },
        { id: 'central', label: { ko: '동맹국 점령 (1918년 헤트만국 포함)', en: 'Central Powers occupation (with the Hetmanate, 1918)' }, tone: 'amber' },
        { id: 'white', label: { ko: '백군과 협상국 간섭군', en: 'Whites and Allied intervention' }, tone: 'blue' },
        { id: 'national', label: { ko: '폴란드와 인접국', en: 'Poland and neighbouring states' }, tone: 'gray' },
        { id: 'makhno', label: { ko: '마흐노 운동 지역', en: 'Makhnovist territory' }, tone: 'black' },
        { id: 'makhnoPartisan', label: { ko: '마흐노 유격 지역', en: 'Makhnovist partisan country' }, tone: 'black' },
        { id: 'otaman', label: { ko: '흐리호리우 봉기', en: 'Hryhoriv\'s rising' }, tone: 'green' },
        { id: 'rising', label: { ko: '전선 뒤의 농민 봉기', en: 'Peasant risings behind the lines' }, tone: 'green' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록을 바탕으로 개략적으로 그렸고, 전선은 러시아 내전·소비에트-폴란드 전쟁 지도와 같습니다. 1918년의 라다와 헤트만국은 독일·오스트리아 점령 아래 있었으므로 점령지로 칠했습니다. 마흐노군과 흐리호리우의 지역은 기록에 나오는 도시를 둘러 대략 그렸고, 빗금은 전선 뒤의 봉기·유격 지역으로 그 땅을 공식적으로 차지한 세력의 색 위에 겹쳤습니다. 봉기는 대개 몇 주 단위로 번지고 꺼졌으므로 시기 사이의 변화는 표시되지 않습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record; the fronts are those of the Russian Civil War and Soviet-Polish War maps. The Rada and the Hetmanate of 1918 stood under German and Austrian occupation and are coloured as occupied. Makhno\'s and Hryhoriv\'s areas are sketched round the towns the record names; hatching marks risings and partisan country behind the lines, laid over the colour of whoever formally held the ground. Risings spread and died down within weeks, so changes between phases are not shown.',
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
        { date: '1918.06', label: { ko: '점령지 안의 즈베니호로드카–타라샤 봉기', en: 'The Zvenyhorodka–Tarashcha rising inside the occupied zone' },
            central: [CENTRAL_1918_08], white: [SOUTH_1918_08], national: [BESSARABIA], rising: [ZVENYHORODKA_1918] },
        { date: '1918.09.30', label: { ko: '훌랴이폴레의 마흐노 유격대', en: 'Makhno\'s partisans round Huliaipole' },
            central: [CENTRAL_1918_08], white: [SOUTH_1918_08], national: [BESSARABIA], makhnoPartisan: [HULIAIPOLE_1918] },
        { date: '1918.11.01', label: { ko: '오스트리아의 붕괴: 서우크라이나와 폴란드', en: 'Austria collapses: West Ukraine and Poland' },
            central: [{ area: CENTRAL_1918_08, minus: [ZUNR_1919, POLAND_1918_11] }], ukr: [ZUNR_1919], white: [SOUTH_1918_08],
            national: [POLAND_1918_11, BESSARABIA], makhnoPartisan: [HULIAIPOLE_1918] },
        { date: '1918.12.14', label: { ko: '디렉토리아의 승리와 서우크라이나', en: 'The Directory\'s victory; West Ukraine' },
            central: [OBER_OST_1918_12], ukr: [UKRAINE_1917, ZUNR_1919], white: [SOUTH_1918_08, CRIMEA_1920],
            national: [westOf('1918.12'), ...NEIGHBOURS], makhno: [MAKHNO_1918_12] },
        { date: '1919.02.05', label: { ko: '키예프의 두 번째 상실', en: 'Kyiv lost a second time' },
            central: [OBER_OST_1919], ukr: [UNR_1919_02, ZUNR_1919], white: [SOUTH_1919_05, CRIMEA_1920, ODESA_1919],
            national: [westOf('1919.02'), ...NEIGHBOURS], makhno: [MAKHNO_1919] },
        { date: '1919.04.06', label: { ko: '흐리호리우의 오데사 입성: 소비에트 우크라이나의 정점', en: 'Hryhoriv in Odesa: Soviet Ukraine at its height' },
            ukr: [UNR_1919_04, ZUNR_1919], white: [SOUTH_1919_05, KERCH_1919], national: [westOf('1919.04'), ...NEIGHBOURS],
            makhno: [MAKHNO_1919], rising: [ZELENYI_1919] },
        { date: '1919.05.07', label: { ko: '흐리호리우의 반소비에트 봉기', en: 'Hryhoriv rises against Soviet power' },
            ukr: [UNR_1919_04, ZUNR_1919], white: [SOUTH_1919_05, KERCH_1919], national: [westOf('1919.04'), ...NEIGHBOURS],
            makhno: [MAKHNO_1919], otaman: [HRYHORIV_1919_05], rising: [ZELENYI_1919] },
        { date: '1919.06.25', label: { ko: '데니킨의 하리코프·예카테리노슬라프 점령', en: 'Denikin takes Kharkiv and Yekaterinoslav' },
            ukr: [UNR_1919_04], white: [SOUTH_1919_06], national: [westOf('1919.04'), ...NEIGHBOURS], rising: [ZELENYI_1919] },
        { date: '1919.08.31', label: { ko: '키예프의 두 군대: 데니킨과 디렉토리아', en: 'Two armies in Kyiv: Denikin and the Directory' },
            ukr: [UNR_1919_08], white: [SOUTH_1919_08], national: [westOf('1919.10'), ...NEIGHBOURS] },
        { date: '1919.10.05', label: { ko: '백군의 후방에 선 마흐노 해방구', en: 'The Makhnovist territory behind the Whites' },
            ukr: [UNR_1919_10], white: [SOUTH_1919_10], national: [westOf('1919.10'), ...NEIGHBOURS],
            makhno: [MAKHNO_1919_10], rising: [ZELENYI_1919, KHOLODNY_YAR] },
        { date: '1919.12.16', label: { ko: '소비에트군의 키예프 탈환과 백군의 후퇴', en: 'Soviet troops retake Kyiv; the Whites fall back' },
            white: [SOUTH_1919_12], national: [westOf('1919.10'), ...NEIGHBOURS], makhno: [MAKHNO_1919_12], rising: [KHOLODNY_YAR] },
        { date: '1920.05.07', label: { ko: '폴란드-우크라이나군의 키예프 입성', en: 'Polish and Ukrainian troops enter Kyiv' },
            ukr: [UNR_1920_05], white: [WRANGEL_1920], national: [westOf('1920.05'), ...NEIGHBOURS],
            makhnoPartisan: [MAKHNO_PARTISAN_1920], rising: [KHOLODNY_YAR] },
        { date: '1920.10', label: { ko: '스타로벨스크 협정: 훌랴이폴레의 마흐노군', en: 'The Starobilsk agreement: the Makhnovists at Huliaipole' },
            white: [WRANGEL_1920], national: [westOf('1920.10'), ...NEIGHBOURS], makhno: [MAKHNO_1920_10], rising: [KHOLODNY_YAR] },
        { date: '1920.11.08', label: { ko: '크림으로 밀린 브란겔', en: 'Wrangel driven back into Crimea' },
            white: [CRIMEA_1920], national: [westOf('1920.10'), ...NEIGHBOURS], makhno: [MAKHNO_1920_10], rising: [KHOLODNY_YAR] },
        { date: '1920.11.26', label: { ko: '리가 휴전선과 마흐노 공격', en: 'The Riga line; the attack on the Makhnovists' },
            national: [westOf('1920.10'), ...NEIGHBOURS], makhnoPartisan: [MAKHNO_PARTISAN_1920], rising: [KHOLODNY_YAR] },
        { date: '1921.03.18', label: { ko: '리가 조약 뒤의 유격전', en: 'Partisan war after the Treaty of Riga' },
            national: [westOf('1920.10'), ...NEIGHBOURS], makhnoPartisan: [MAKHNO_PARTISAN_1921], rising: [KHOLODNY_YAR] },
    ],
};
