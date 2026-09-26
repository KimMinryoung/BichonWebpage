// Territorial control in the Soviet invasion of Manchuria, August 1945, for
// the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/manchurian-operation.json. Drawn by hand
// from the campaign record; no map is traced for the offensive itself.
// Manchukuo, northern Chahar and the Japanese-held part of North China come
// from the Sino-Japanese War map (sino-japanese-war-1937-1945.js parts and
// the West Point "Situation at the End of World War II" tracing).
//
// How a phase is built: the Soviet Union, Mongolia and what their armies
// took are the remainder (red). Japan with Korea, Karafuto and the Kurils,
// Manchukuo, Mengjiang and occupied North China are laid over it (amber),
// and the rest of China (the Nationalist and Communist areas together) below
// that. The Soviet gains of each phase are pockets of the remainder cut out
// of the Japanese area; a Japanese pocket inside them (Hailar) is cut out of
// the gain.
//
// Coordinates are [lat, lng].

const { MANCHUKUO, NORTH_CHAHAR, TRACED_1945 } = require('./sino-japanese-war-1937-1945').parts;

const circle = (lat, lng, r) => ({ circle: [lat, lng, r] });

// All the water in the frame: every coast in it belongs to a side.
const SEA = [[24, 88], [24, 157], [72, 157], [72, 88]];

// Manchukuo on land (with Jehol and the Kwantung Leased Territory).
const MANCHURIA = { area: MANCHUKUO, minus: [{ units: ['RUS', 'MNG', 'PRK', 'KOR', 'JPN'] }] };
// Mengjiang: Chahar, Suiyuan and northern Shanxi under the Japanese-backed
// Mongol government, north of the Great Wall.
const MENGJIANG = { area: [[45.5, 116.5], [43.4, 117.5], [42.9, 116.2], [41.9, 116.0], [40.9, 116.8], [40.4, 116.0],
    [40.0, 115.0], [39.6, 113.5], [39.5, 112.5], [40.2, 111.4], [40.3, 110.0], [40.8, 109.3], [41.9, 108.5],
    [42.6, 107.5], [45, 108], [46, 112]], minus: [{ units: ['MNG'] }] };
const NORTH_CHINA = { traced: '1945.08', side: 'japan', file: TRACED_1945 };
// Japan's home islands and Korea with the seas round them, less Chinese and
// Russian land: the Yalu–Tumen border comes from the Chinese outline.
const JAPAN_KOREA = { area: [[30, 124.0], [37.6, 124.0], [39.6, 124.0], [40.6, 124.3], [41.6, 125.8], [42.5, 127.8],
    [42.9, 129.0], [43.3, 129.8], [42.9, 131.0], [42.0, 131.5], [42.2, 133.5], [43.4, 136.3], [44.6, 138.3],
    [45.6, 140.3], [45.6, 144.0], [44.2, 145.4], [43.3, 146.0], [43.0, 157], [24, 157]], minus: [{ units: ['CHN', 'RUS'] }] };
// Karafuto, south of the 50th parallel, and the Kurils up to Shumshu.
const KARAFUTO = [[45.6, 141.3], [47.0, 141.4], [48.5, 141.3], [50.0, 141.3], [50.0, 144.8], [45.6, 144.0]];
const KURILS = [[43.3, 145.5], [43.9, 145.2], [45.8, 147.8], [48.2, 152.2], [50.4, 155.4], [50.85, 156.0],
    [50.7, 157], [43.3, 157]];
const EMPIRE = [JAPAN_KOREA, KARAFUTO, KURILS, MANCHURIA, MENGJIANG, NORTH_CHAHAR, NORTH_CHINA];

// China outside Japanese hands, in the frame.
const CHINA = { area: [[24, 88], [24, 124.0], [37.6, 124.0], [39.6, 124.0], [42, 125], [46, 120], [46, 88]],
    minus: [MANCHUKUO, { units: ['MNG', 'RUS', 'PRK', 'KOR', 'JPN'] }] };

// Hailar: the town fell on 10 August, its fortified zone held until the 18th.
const HAILAR = circle(49.2, 119.72, 0.2);

// 12 August. Transbaikal Front: the 36th Army over the Argun to Hailar, the
// 6th Guards Tank Army over the Greater Khingan to Lubei, the 39th Army at
// Solun, and the Soviet-Mongol cavalry-mechanized group across the Gobi.
const WEST_08_12 = [[51.0, 117.0], [50.6, 119.5], [49.9, 119.9], [49.45, 120.1], [48.9, 120.1], [48.0, 120.3],
    [47.3, 120.4], [46.8, 121.0], [46.4, 121.3], [45.6, 121.4], [44.6, 121.0], [44.1, 119.8], [43.8, 118.2],
    [43.3, 116.3], [42.9, 114.8], [42.7, 113.0], [42.8, 111.2], [44, 110], [47, 113], [49, 115]];
// 2nd Far Eastern Front: the Amur crossed at Blagoveshchensk–Heihe, and
// Fuyuan and Tongjiang taken at the mouth of the Sungari.
const AMUR_08_12 = [[50.6, 127.0], [50.1, 127.1], [49.95, 127.6], [50.3, 128.0]];
const SUNGARI_08_12 = [[48.5, 134.9], [48.4, 133.9], [48.0, 133.0], [47.7, 132.4], [47.3, 132.0], [47.2, 133.2],
    [47.7, 134.8]];
// 1st Far Eastern Front: through the border fortified zones to Mishan,
// Muling and Dongning, short of Mudanjiang.
const EAST_08_12 = [[46.3, 134.2], [46.1, 133.2], [45.8, 132.5], [45.4, 131.6], [45.0, 130.9], [44.85, 130.3],
    [44.5, 130.35], [44.0, 130.8], [43.4, 130.7], [42.9, 130.5], [42.6, 130.6], [42.3, 131.5], [43, 133], [45, 134.5]];
// Unggi and Najin, taken from the sea on the 11th and 12th.
const KOREA_08_12 = [[42.45, 130.2], [42.2, 130.15], [42.1, 130.5], [42.5, 130.8]];

// 15–16 August. The tank army in the central plain towards Taonan and
// Tongliao; Chifeng and Dolonnur reached; Mudanjiang taken on the 16th; the
// Sungari flotilla up to Jiamusi; Chongjin landed on from the 13th and taken
// on the 16th; a landing at Esutoru on Sakhalin.
const WEST_08_16 = [[53.4, 120.5], [52.5, 121.4], [51.5, 121.3], [50.5, 121.4], [49.4, 121.9], [48.6, 122.3],
    [47.6, 122.6], [46.5, 122.5], [45.5, 123.1], [44.5, 123.2], [43.6, 122.6], [43.2, 121.5], [42.5, 120.2],
    [42.1, 119.0], [42.0, 117.6], [42.0, 116.4], [41.7, 115.0], [41.8, 113.5], [42.2, 112.0], [42.8, 110.5],
    [44, 108], [48, 112], [51, 115]];
// Sunwu's fortified zone held on until the 20th.
const AMUR_08_16 = [[50.8, 126.6], [49.8, 126.8], [49.6, 127.4], [49.6, 128.3], [50.3, 128.4]];
const SUNGARI_08_16 = [[49.2, 130.0], [48.5, 130.2], [47.6, 130.4], [46.9, 130.2], [46.7, 130.6], [46.8, 131.8],
    [46.9, 133.0], [47.2, 134.8], [48.5, 135.0]];
const EAST_08_16 = [[47.0, 134.5], [46.8, 132.0], [46.2, 130.9], [45.6, 130.2], [45.0, 129.7], [44.55, 129.45],
    [44.0, 129.6], [43.3, 129.6], [42.95, 129.8], [42.45, 130.3], [42.3, 131.5], [43.5, 134], [45.5, 135]];
const KOREA_08_16 = [[42.5, 130.2], [42.2, 129.9], [41.9, 129.65], [41.65, 129.5], [41.5, 129.9], [42.0, 130.6]];
const ESUTORU = circle(49.1, 142.05, 0.15);

// 20 August. Airborne landings at Harbin (18th), Changchun, Mukden and
// Jilin (19th); all of Manchuria but the south of Jehol, Liaoxi and the
// Liaodong peninsula with Port Arthur and Dairen (22nd–23rd). Korea's
// northeast to Chongjin and Kyongsong; Sakhalin past Koton to Shikuka, and
// the Maoka landing. The Soviet-Mongol group near Kalgan.
const SOUTH_MANCHURIA_08_20 = [[40.0, 116.5], [41.3, 117.2], [41.6, 119.0], [41.7, 120.6], [41.4, 121.8],
    [41.1, 122.8], [40.9, 123.6], [40.6, 124.4], [40.0, 124.6], [38.5, 121.5], [39.8, 119.5]];
const MONGOL_08_20 = [[45.5, 116.5], [43.4, 117.5], [42.0, 117.6], [41.5, 116.2], [41.1, 115.0], [41.3, 113.8],
    [41.8, 112.2], [42.8, 110.5], [44, 108], [48, 112]];
const KOREA_08_20 = [[43.0, 129.0], [42.0, 128.9], [41.4, 129.2], [41.2, 130.0], [42.5, 131.0]];
const SAKHALIN_08_20 = [[50.1, 141.3], [49.0, 141.3], [48.9, 142.5], [49.0, 143.6], [50.1, 144.6]];
const MAOKA = circle(47.05, 142.05, 0.2);

// 2 September. Korea north of the 38th parallel (Wonsan landing on the
// 21st, Pyongyang and Hamhung on the 24th, the parallel by the 26th); all
// Sakhalin (Toyohara and Otomari on the 25th) and the Kurils (Etorofu and
// Kunashiri at the end of August). The Soviet-Mongol forces reached the
// Great Wall at Kalgan but left the town, taken by the Communists on
// 23 August; the Nationalists took Guisui and Baotou.
const KOREA_NORTH = [[38.0, 123.5], [38.0, 131.5], [43.5, 131.5], [43.5, 123.5]];
const SUIYUAN_KALGAN = [[41.5, 108.8], [41.3, 113.8], [41.1, 115.0], [41.2, 116.0], [40.4, 116.0], [40.0, 115.0],
    [40.3, 113.5], [40.2, 111.4], [40.3, 110.0], [40.8, 109.0]];

module.exports = {
    eventId: 'manchurian-operation',
    region: ['CHN', 'PRK', 'KOR', 'RUS', 'MNG', 'JPN'],
    bounds: [[24, 88], [72, 157]],
    sea: SEA,
    simplify: 0.12,
    base: 'soviet',
    precedence: ['japan', 'china'],
    sides: [
        { id: 'soviet', label: { ko: '소련·몽골과 소련군 점령지', en: 'The Soviet Union, Mongolia and Soviet-held land' }, tone: 'red' },
        { id: 'japan', label: { ko: '일본·조선·만주국과 일본군 점령지', en: 'Japan, Korea, Manchukuo and Japanese-held land' }, tone: 'amber' },
        { id: 'china', label: { ko: '중국 (국민정부·공산당 지역)', en: 'China (Nationalist and Communist areas)' }, tone: 'blue' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록을 바탕으로 개략적으로 그렸습니다. 만주국과 화북 점령지는 중일전쟁 지도와 같은 자료(웨스트포인트 지도책 1945년 도판)를 썼습니다. 소련군은 주로 철도와 도로를 따라 진격했고, 8월 16일 관동군의 항복 명령 뒤에도 일부 요새와 부대는 며칠 더 저항했습니다. 일본군이 남은 화북과 38선 이남 조선은 9월 이후 국민정부·공산당과 미군에 인계되었습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record. Manchukuo and occupied North China follow the same sources as the Sino-Japanese War map (the West Point atlas plate for 1945). Soviet columns advanced mostly along railways and roads, and some fortified zones and units held out for days after the Kwantung Army was ordered to surrender on 16 August. North China and Korea south of the 38th parallel stayed in Japanese hands until they were handed to the Nationalists, the Communists and the Americans from September.',
    },
    sources: [],
    phases: [
        { date: '1945.02', label: { ko: '소련 참전 전 (얄타 회담~8월 8일)', en: 'Before the Soviet entry (Yalta to 8 August)' },
            japan: EMPIRE, china: [CHINA] },
        { date: '1945.08.12', label: { ko: '대싱안링 돌파·하이라얼 포위, 아무르강 도하, 웅기·나진 점령', en: 'Over the Greater Khingan, Hailar besieged, the Amur crossed; Unggi and Najin taken' },
            japan: EMPIRE, china: [CHINA],
            soviet: [{ area: WEST_08_12, minus: [HAILAR] }, AMUR_08_12, SUNGARI_08_12, EAST_08_12, KOREA_08_12] },
        { date: '1945.08.15', label: { ko: '천황 방송 무렵: 만주 평원 진출, 무단장·청진 점령', en: 'Around the broadcast: into the Manchurian plain; Mudanjiang and Chongjin taken' },
            japan: EMPIRE, china: [CHINA],
            soviet: [{ area: WEST_08_16, minus: [HAILAR] }, AMUR_08_16, SUNGARI_08_16, EAST_08_16, KOREA_08_16, ESUTORU] },
        { date: '1945.08.20', label: { ko: '공수부대의 하얼빈·창춘·선양·지린 장악, 남사할린 진격', en: 'Airborne troops in Harbin, Changchun, Mukden and Jilin; the advance into southern Sakhalin' },
            japan: EMPIRE, china: [CHINA],
            soviet: [{ area: MANCHURIA, minus: [SOUTH_MANCHURIA_08_20] }, MONGOL_08_20, KOREA_08_20, SAKHALIN_08_20, MAOKA] },
        { date: '1945.09.02', label: { ko: '항복 조인: 만주·38선 이북 조선·사할린·쿠릴 점령', en: 'The surrender signed: Manchuria, Korea north of the 38th parallel, Sakhalin and the Kurils held' },
            japan: [JAPAN_KOREA, { area: MENGJIANG, minus: [SUIYUAN_KALGAN] }, { area: NORTH_CHINA, minus: [SUIYUAN_KALGAN] }],
            china: [CHINA, SUIYUAN_KALGAN],
            soviet: [MANCHURIA, MONGOL_08_20, NORTH_CHAHAR, KOREA_NORTH, KARAFUTO, KURILS] },
    ],
};
