// Territorial control in the Russian Civil War for the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/civil-war.json. The map spans Petrograd to
// Vladivostok, so every area is coarse (simplify 0.2°, about a pixel).
// Drawn by hand from the campaign record, cross-checked against the fronts
// in the standard atlases; no map is traced.
//
// How a phase is built: the Soviet side starts as the whole former empire;
// White and interventionist regions are carved out of it (they are the base
// side, the remainder); German-Austrian occupation (1918) and the
// independent or neighbouring states (Finland, the Baltic states, Poland,
// Romanian Bessarabia, the Transcaucasian republics, Bukhara and Khiva,
// Japanese Karafuto and the Kurils) are laid over both. Red islands inside
// White territory (besieged Orenburg and Uralsk) are not shown.
//
// Coordinates are [lat, lng].

const { SEAS } = require('./great-patriotic-war').parts;

const EMPIRE = [[85, 14], [85, 180], [30, 180], [30, 14]];

const FINLAND = [[71, 19], [71, 31.5], [69.5, 31.0], [68.2, 30.0], [66.5, 29.9], [65.0, 30.5], [64.0, 30.3],
    [63.0, 31.4], [62.0, 31.3], [60.5, 30.4], [60.12, 29.95], [59.8, 29.5], [59.8, 19]];
const BESSARABIA = [[48.5, 26.5], [48.5, 29.2], [46.3, 30.2], [45.3, 29.7], [45.4, 28.1], [46.5, 28.1], [47.5, 26.9]];
const TRANSCAUCASIA = [[43.4, 40.0], [42.9, 43.0], [42.6, 45.0], [41.9, 46.5], [41.8, 48.6], [41.8, 50.5],
    [38.0, 50.5], [38.0, 40.0], [41.0, 40.0]];
// Georgia and Armenia without Azerbaijan (Soviet from April 1920).
const GEORGIA_ARMENIA = [[43.4, 40.0], [42.9, 43.0], [42.6, 45.0], [41.9, 46.3], [41.2, 45.3], [39.8, 45.9],
    [38.8, 46.2], [38.8, 44.0], [38.0, 40.0], [41.0, 40.0]];
const GEORGIA = [[43.4, 40.0], [42.9, 43.0], [42.6, 45.0], [41.9, 46.3], [41.2, 45.0], [41.1, 43.5], [41.3, 41.5],
    [41.0, 40.0]];
const BUKHARA_KHIVA = [[43.3, 57.5], [42.0, 62.0], [40.5, 63.5], [40.2, 66.2], [39.5, 67.3], [39.5, 70.5],
    [37.0, 72.0], [37.2, 68.0], [37.6, 65.5], [38.8, 63.5], [40.8, 61.5], [41.5, 57.5]];
const BUKHARA = [[40.5, 63.5], [40.2, 66.2], [39.5, 67.3], [39.5, 70.5], [37.0, 72.0], [37.2, 68.0], [37.6, 65.5],
    [38.8, 63.5]];
// Japan's Karafuto and the Kurils, part of Russia's map today.
const JAPAN_NORTH = [[50.0, 140.5], [50.0, 157], [43.0, 157], [43.0, 145.2], [45.8, 145.2], [45.8, 140.5]];

// The western front against the Baltic states and Poland, shared with the
// Soviet-Polish War map (soviet-polish-war.js). Each front runs north to
// south in two stretches: `baltic`, from the Estonian border down to where
// Polish-held ground begins (empty once Latvia and Lithuania hold their own
// lines), and `polish`, from there to the Dniester. westOf() closes a front
// round the west into everything not Soviet.
const BALTIC_EDGE = [[59.8, 19], [59.8, 24], [59.4, 28.1], [57.9, 27.8]];
const WEST_CLOSE = [[46.2, 30.2], [45, 30], [45, 14], [59.8, 14]];
const FRONTS = {
    // First clash: the Soviets hold most of Latvia and eastern Lithuania;
    // the Germans still hold the Grodno-Bialystok zone they are leaving,
    // and the Ukrainian People's Republic Volhynia and Podolia.
    '1919.02': {
        baltic: [[57.52, 27.35], [57.75, 26.0], [57.87, 24.36], [57.6, 21.9], [57.3, 21.9], [56.8, 22.0],
            [56.4, 22.3], [55.95, 22.8], [55.6, 23.3], [55.3, 23.9], [54.95, 24.3], [54.7, 24.5], [54.4, 24.5]],
        polish: [[54.2, 24.6], [53.6, 24.6], [53.2, 24.7], [52.9, 24.8], [52.55, 25.0], [52.1, 25.4], [51.7, 25.5],
            [51.5, 27.0], [51.1, 28.3], [50.5, 29.0], [49.9, 29.3], [49.3, 29.6], [48.7, 30.3], [48.0, 30.5],
            [47.0, 30.8], [46.5, 31.0]],
    },
    // Vilnius taken: Soviet Latvia still holds Riga; the Poles stand before
    // Lida and Pinsk, the Ukrainian republic between Volhynia and the Dniester.
    '1919.04': {
        baltic: [[57.52, 27.35], [57.75, 26.0], [57.87, 24.36], [57.0, 23.6], [56.65, 23.8], [56.4, 24.1],
            [56.0, 24.6], [55.6, 25.2], [55.3, 25.6]],
        polish: [[55.2, 26.3], [54.6, 26.2], [53.9, 25.8], [53.4, 25.9], [53.0, 25.9], [52.5, 26.2], [52.1, 26.3],
            [51.6, 26.3], [51.0, 26.5], [50.6, 26.7], [50.0, 26.7], [49.4, 26.8], [48.6, 27.0], [48.45, 27.0]],
    },
    // Autumn 1919: Latgale still Soviet; the Poles on the Dvina, the Berezina
    // and in Volhynia.
    '1919.10': {
        baltic: [[57.52, 27.35], [57.3, 26.9], [56.8, 26.2], [56.3, 25.9], [55.85, 26.4]],
        polish: [[55.85, 26.6], [55.95, 27.4], [55.7, 28.0], [55.5, 28.0], [54.5, 28.5], [53.4, 29.2], [52.0, 29.0],
            [51.3, 27.6], [50.6, 27.0], [49.5, 26.2], [48.5, 26.5]],
    },
    // March 1920: Latgale Latvian since January, Mozyr Polish.
    '1920.03': {
        baltic: [],
        polish: [[56.1, 28.2], [55.9, 28.0], [55.5, 28.0], [54.5, 28.5], [53.4, 29.2], [52.4, 29.8], [51.9, 29.3],
            [51.3, 27.6], [50.6, 27.0], [49.5, 26.2], [48.5, 26.5]],
    },
    // May 1920: the Poles and Petliura's army on the Dnieper at Kyiv.
    '1920.05': {
        baltic: [],
        polish: [[56.1, 28.2], [55.9, 28.0], [55.5, 28.0], [54.5, 28.5], [53.4, 29.2], [52.6, 30.2], [52.3, 30.6],
            [51.9, 30.6], [51.3, 30.6], [50.8, 30.9], [50.45, 31.0], [50.1, 30.7], [49.8, 30.2], [49.4, 29.9],
            [48.9, 29.7], [48.3, 29.2], [47.9, 29.1]],
    },
    // End of July 1920: Vilnius, Grodno and Bialystok Soviet; the Poles on
    // the Narew and the Bug, Budyonny before Brody.
    '1920.07': {
        baltic: [[56.1, 28.2], [55.95, 27.6], [55.75, 26.9], [55.7, 26.6],
            [55.4, 26.0], [55.1, 25.3], [54.8, 24.9], [54.4, 24.4], [54.0, 23.9]],
        polish: [[53.85, 23.0], [53.45, 22.4], [53.1, 22.1], [52.9, 22.6], [52.6, 22.9], [52.35, 23.2], [52.1, 23.7],
            [51.7, 24.2], [51.2, 24.6], [50.8, 25.0], [50.3, 25.2], [49.6, 25.6], [49.2, 25.5], [48.6, 25.6]],
    },
    // Mid-August 1920: the Red Army along the East Prussian border to the
    // Vistula, before Warsaw and before Lwów.
    '1920.08': {
        baltic: [[56.1, 28.2], [55.95, 27.6], [55.75, 26.9], [55.7, 26.6],
            [55.4, 26.0], [55.1, 25.3], [54.8, 24.9], [54.4, 24.4], [54.0, 23.9]],
        polish: [[53.85, 22.95], [53.55, 22.2], [53.4, 21.9], [53.25, 21.5], [53.2, 20.9], [53.25, 20.4],
            [53.3, 20.1], [53.45, 19.7], [53.4, 19.35], [53.0, 19.0], [52.65, 19.05], [52.55, 19.7], [52.5, 20.2],
            [52.45, 20.8], [52.4, 21.2], [52.2, 21.45], [51.9, 21.6], [51.2, 22.3], [50.8, 23.3], [50.3, 24.2],
            [49.9, 24.4], [49.5, 24.9], [48.9, 25.0], [48.3, 25.5], [48.5, 26.5]],
    },
    // The Riga armistice line of October 1920, which the 1921 treaty kept.
    '1920.10': {
        baltic: [],
        polish: [[56.1, 28.2], [55.9, 27.6], [54.9, 27.4], [54.0, 27.0], [53.3, 26.9], [52.5, 27.2], [51.5, 26.9],
            [50.6, 26.3], [49.5, 26.2], [48.5, 26.5]],
    },
};
const westOf = date => [...BALTIC_EDGE, ...FRONTS[date].baltic, ...FRONTS[date].polish, ...WEST_CLOSE];
// The Ukrainian People's Republic's last ground, between the Poles and Denikin.
const UNR_1919_10 = [[50.1, 26.6], [50.0, 27.8], [49.5, 28.6], [48.3, 28.5], [48.45, 27.0], [48.5, 26.5],
    [49.5, 26.2]];

// German and Austro-Hungarian occupation after Brest-Litovsk.
const CENTRAL_1918_03 = [[59.8, 14], [59.8, 21], [59.4, 28.2], [57.8, 28.4], [56.3, 29.6], [55.5, 28.8],
    [54.5, 30.4], [53.9, 30.3], [52.4, 31.0], [51.5, 31.3], [50.45, 31.0], [49.0, 32.0], [47.5, 33.0],
    [46.5, 32.0], [45, 30], [45, 14]];
const CENTRAL_1918_08 = [[59.8, 14], [59.8, 21], [59.4, 28.2], [57.8, 28.6], [56.3, 29.8], [55.4, 30.9],
    [54.5, 30.6], [53.9, 30.8], [52.6, 31.8], [52.3, 33.0], [52.0, 34.5], [51.3, 35.5], [50.6, 36.8],
    [50.3, 38.0], [49.5, 39.5], [48.0, 39.8], [47.1, 39.9], [46.5, 38.5], [44.3, 34.0], [45, 29.8], [45, 14]];

// White and interventionist regions, carved out of the Soviet side.
// East: the Czechoslovak Legion, Komuch and the Siberian governments, then
// Kolchak; south of the steppe line lies Soviet Turkestan, cut off.
const TURKESTAN_EDGE = [[37.3, 53.9], [37.2, 60.8], [38.5, 60.5], [42.5, 61.0], [44.5, 61.5], [46.0, 61.5],
    [49.5, 57.5], [48.0, 65.0], [46.5, 72.0], [45.5, 78.0], [44.5, 80.5], [30, 80.5], [30, 180], [85, 180]];
const EAST_1918_08 = [[85, 60], [61.0, 60.0], [58.5, 59.5], [58.0, 57.5], [57.0, 55.0], [56.8, 53.2],
    [56.0, 51.5], [55.8, 49.0], [55.2, 48.4], [54.3, 48.1], [53.2, 48.2], [52.0, 47.5], [51.6, 47.0],
    [50.5, 48.3], [49.0, 48.5], [47.5, 49.5], [46.5, 49.8], [44.0, 50.5], [40.0, 52.8], ...TURKESTAN_EDGE];
const EAST_1919_05 = [[85, 58], [64.0, 56.0], [61.5, 53.5], [59.5, 53.0], [58.3, 51.5], [57.2, 51.0],
    [56.0, 50.8], [55.3, 50.3], [54.3, 51.0], [53.7, 51.5], [53.0, 52.0], [51.8, 52.5], [50.6, 51.8],
    [49.0, 50.0], [47.5, 49.5], [46.5, 49.8], [44.0, 50.5], [40.0, 52.8], ...TURKESTAN_EDGE];
// Autumn 1919: Kolchak on the Tobol; the Orenburg–Tashkent line reopened,
// Semirechye still with Annenkov.
const EAST_1919_10 = [[85, 68], [58.2, 68.5], [56.5, 67.0], [55.4, 66.5], [54.5, 65.5], [52.0, 64.5],
    [50.0, 66.0], [48.0, 70.0], [46.5, 74.0], [45.5, 78.0], [44.5, 80.5], [30, 80.5], [30, 180], [85, 180]];
const URAL_COSSACKS_1919 = [[50.3, 51.0], [50.0, 53.0], [48.0, 54.5], [47.0, 53.5], [46.8, 51.5], [48.5, 50.0]];
const TRANSCASPIA_1919 = [[41.5, 52.5], [41.0, 55.0], [38.8, 56.5], [37.5, 55.0], [38.0, 53.5], [40.0, 52.8]];
// 1920: Semyonov at Chita and the Japanese east of Lake Baikal.
const EAST_1920_03 = [[85, 108], [52.0, 108.0], [30, 108], [30, 180], [85, 180]];
const EAST_1920_08 = [[85, 112], [52.5, 112.0], [30, 112], [30, 180], [85, 180]];
// From October 1920: Primorye under the Japanese and the White Merkulov
// government; northern Sakhalin under Japan until 1925.
const PRIMORYE = [[47.8, 130.8], [47.5, 139.5], [42.0, 139.5], [42.0, 130.5]];
const NORTH_SAKHALIN = [[54.5, 141], [54.5, 145], [50.0, 145], [50.0, 141]];

// The North: Arkhangelsk and Murmansk under the Allies and Miller.
const NORTH_1918 = [[70, 30], [70, 52], [65.5, 52], [64.2, 45.5], [63.0, 43.5], [63.5, 40.0], [64.3, 37.0],
    [64.5, 34.8], [65.8, 33.0], [66.5, 29.5]];
const NORTH_1919 = [[70, 30], [70, 58], [65.0, 53.0], [63.5, 50.0], [62.3, 44.5], [62.6, 41.0], [62.9, 40.3],
    [63.2, 37.5], [62.9, 35.0], [62.9, 34.4], [63.3, 33.0], [64.0, 30.3]];

// The South: the Don, Kuban and the Volunteer Army, then Denikin.
const KUBAN_1918_03 = { circle: [45.3, 39.5, 0.8] };
const SOUTH_1918_08 = [[50.4, 40.0], [50.2, 41.5], [49.5, 43.0], [48.9, 44.1], [48.0, 44.0], [47.0, 43.5],
    [46.5, 42.0], [45.8, 40.5], [45.0, 40.7], [44.5, 40.0], [44.3, 38.8], [44.7, 37.8], [45.5, 37.0],
    [47.1, 39.3], [49.5, 39.5]];
const SOUTH_1919_05 = [[48.2, 37.4], [48.5, 38.8], [48.9, 40.0], [48.3, 41.5], [47.5, 42.3], [46.8, 42.8],
    [46.3, 44.5], [45.8, 46.8], [44.8, 47.2], [43.0, 48.0], [41.9, 48.5], [41.5, 41.5], [44.5, 37.0],
    [45.5, 36.4], [46.5, 37.0], [47.0, 37.4]];
const SOUTH_1919_10 = [[48.3, 28.5], [49.5, 28.6], [50.4, 29.5], [51.5, 30.6], [52.0, 32.5], [52.2, 34.5],
    [53.0, 35.9], [52.9, 37.0], [52.2, 38.5], [51.8, 39.0], [51.0, 40.5], [50.5, 42.0], [50.0, 44.0],
    [50.3, 45.5], [48.8, 45.2], [47.5, 46.5], [46.8, 46.8], [46.0, 47.0], [45.0, 47.3], [44.0, 47.5],
    [41.9, 48.5], [41.5, 41.5], [44.5, 30.5], [46.2, 30.2]];
// Yudenich before Petrograd, October 1919.
const YUDENICH_1919 = [[59.95, 29.4], [59.8, 30.1], [59.72, 30.4], [59.55, 30.9], [59.2, 30.5], [58.7, 29.9],
    [58.3, 28.5], [57.8, 27.6], [59.4, 27.9]];
const CRIMEA_1920 = [[46.2, 33.6], [45.9, 34.6], [45.5, 36.3], [45.1, 36.7], [44.3, 35.0], [44.3, 33.3],
    [45.2, 32.4], [46.1, 32.9]];
// Wrangel in Northern Tavria, summer 1920.
const WRANGEL_1920 = [[46.6, 32.6], [46.8, 33.3], [47.5, 34.3], [47.8, 35.1], [47.5, 36.3], [47.0, 37.3],
    [46.4, 37.0], [45.3, 36.6], [44.3, 34.5], [44.4, 33.3], [45.5, 32.4], [46.2, 32.2]];

const phase = (date, label, parts) => ({ date, label, red: [EMPIRE], ...parts });

module.exports = {
    eventId: 'civil-war',
    region: ['RUS', 'UKR', 'BLR', 'MDA', 'EST', 'LVA', 'LTU', 'FIN', 'POL', 'GEO', 'ARM', 'AZE', 'KAZ', 'UZB',
        'TKM', 'KGZ', 'TJK'],
    bounds: [[35, 14], [82, 180]],
    sea: SEAS,
    simplify: 0.2,
    base: 'white',
    precedence: ['national', 'central', 'red'],
    carve: ['red'],
    sides: [
        { id: 'red', label: { ko: '적군 (소비에트 정권)', en: 'Reds (Soviet power)' }, tone: 'red' },
        { id: 'white', label: { ko: '백군과 외국 간섭군', en: 'Whites and foreign intervention' }, tone: 'blue' },
        { id: 'central', label: { ko: '독일·오스트리아 점령', en: 'German and Austrian occupation' }, tone: 'amber' },
        { id: 'national', label: { ko: '독립 국가와 인접국', en: 'Independent and neighbouring states' }, tone: 'gray' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록을 바탕으로 개략적으로 그렸습니다. 전선 뒤의 봉기와 유격 지역, 백군 지역 안에 고립된 적군 거점(오렌부르크·우랄스크 등), 마흐노 지역은 표시하지 않았습니다. 극동공화국(1920~1922)은 소비에트 측으로 칠했습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record. Uprisings and partisan areas behind the lines, besieged Red strongholds inside White territory (Orenburg, Uralsk) and Makhno\'s region are not shown. The Far Eastern Republic (1920–1922) is coloured with the Soviet side.',
    },
    sources: [],
    phases: [
        phase('1918.03', { ko: '브레스트-리토프스크 강화', en: 'The Treaty of Brest-Litovsk' }, {
            white: [KUBAN_1918_03],
            central: [CENTRAL_1918_03],
            national: [FINLAND, BESSARABIA, TRANSCAUCASIA, BUKHARA_KHIVA, JAPAN_NORTH],
        }),
        phase('1918.08', { ko: '체코 군단 반란과 열강의 개입 뒤 (카잔 함락)', en: 'After the Czech revolt and the landings (Kazan falls)' }, {
            white: [EAST_1918_08, NORTH_1918, SOUTH_1918_08],
            central: [CENTRAL_1918_08],
            national: [FINLAND, BESSARABIA, TRANSCAUCASIA, BUKHARA_KHIVA, JAPAN_NORTH],
        }),
        phase('1919.05', { ko: '콜차크 춘계 공세의 정점', en: 'The height of Kolchak\'s spring offensive' }, {
            white: [EAST_1919_05, NORTH_1919, SOUTH_1919_05],
            national: [FINLAND, westOf('1919.04'), TRANSCAUCASIA, BUKHARA_KHIVA, JAPAN_NORTH],
        }),
        phase('1919.10', { ko: '위기의 정점: 오룔과 페트로그라드', en: 'The crisis: Orel and Petrograd' }, {
            white: [EAST_1919_10, URAL_COSSACKS_1919, TRANSCASPIA_1919, NORTH_1919, SOUTH_1919_10, YUDENICH_1919],
            national: [FINLAND, westOf('1919.10'), UNR_1919_10, TRANSCAUCASIA, BUKHARA_KHIVA, JAPAN_NORTH],
        }),
        phase('1920.03', { ko: '콜차크 처형과 노보로시스크 철수 뒤', en: 'After Kolchak\'s death and the Novorossiysk evacuation' }, {
            white: [EAST_1920_03, CRIMEA_1920],
            national: [FINLAND, westOf('1920.03'), TRANSCAUCASIA, BUKHARA, JAPAN_NORTH],
        }),
        phase('1920.08', { ko: '바르샤바 앞의 적군과 브랑겔', en: 'The Red Army before Warsaw; Wrangel' }, {
            white: [EAST_1920_08, WRANGEL_1920],
            national: [FINLAND, westOf('1920.08'), GEORGIA_ARMENIA, BUKHARA, JAPAN_NORTH],
        }),
        phase('1920.11', { ko: '리가 휴전과 크림 철수', en: 'The Riga armistice and the Crimean evacuation' }, {
            white: [PRIMORYE, NORTH_SAKHALIN],
            national: [FINLAND, westOf('1920.10'), GEORGIA_ARMENIA, JAPAN_NORTH],
        }),
        phase('1922.10', { ko: '블라디보스토크와 내전의 종결', en: 'Vladivostok and the end of the war' }, {
            white: [NORTH_SAKHALIN],
            national: [FINLAND, westOf('1920.10'), JAPAN_NORTH],
        }),
    ],
    parts: {
        BALTIC_EDGE, FRONTS, westOf, BESSARABIA, UNR_1919_10, SOUTH_1919_05, SOUTH_1919_10, CRIMEA_1920,
        WRANGEL_1920,
    },
};
