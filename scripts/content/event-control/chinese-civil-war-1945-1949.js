// Control phases of the Chinese Civil War for the event map's control layer.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/chinese-civil-war-1945-1949.json.
//
// 1945.08–1947.07 use the Communist-controlled areas traced from the State
// Department's 1947 six-panel map (see trace-event-control-maps.js); the
// 1945 Japanese occupation comes from the West Point atlas plate. Later
// phases have no comparable contemporary series, so they are drawn by hand
// from the campaign record: the Communists hold a region, the Nationalists
// the cities and railway corridors carved out of it. Everything is
// approximate — in 1946–1948 control was points and lines, not solid fronts —
// and the page says so.
//
// Coordinates are [lat, lng], like timeline geo. Per phase:
//   ccp:   regions (traced phase names or polygons), minus
//   kmt:   Nationalist pockets and corridors carved out of them;
//   japan / soviet / other: regions of those sides.
// Precedence: other > soviet > ccp > japan > kmt; kmt is also everything left
// over inside China (the Natural Earth CHN + TWN units).

const circle = (lat, lng, r) => ({ circle: [lat, lng, r] });
const corridor = (width, ...points) => ({ corridor: points, width });

// Towns and rail junctions used by the corridors below.
const P = {
    beiping: [39.9, 116.4], tianjin: [39.13, 117.2], tanggu: [39.02, 117.65], tangshan: [39.63, 118.18],
    shanhaiguan: [40.0, 119.75], jinzhou: [41.1, 121.12], huludao: [40.75, 120.85],
    shenyang: [41.8, 123.43], changchun: [43.88, 125.32], baoding: [38.87, 115.46],
    nankou: [40.25, 116.1], zhangjiakou: [40.8, 114.88], datong: [40.08, 113.3], jining: [41.03, 113.1],
    guisui: [40.84, 111.66], baotou: [40.65, 109.84], chengde: [40.95, 117.95],
    taiyuan: [37.87, 112.55], yulin: [38.28, 109.73], anyang: [36.1, 114.35], xinxiang: [35.3, 113.9],
    jinan: [36.67, 117.0], qingdao: [36.1, 120.38], yantai: [37.53, 121.4],
    xuzhou: [34.26, 117.19], shangqiu: [34.41, 115.65], kaifeng: [34.8, 114.31], zhengzhou: [34.75, 113.65],
    bengbu: [32.92, 117.39], xinyang: [32.13, 114.07], hankou: [30.6, 114.28], nanyang: [33.0, 112.53],
    anqing: [30.53, 117.05], pukou: [32.1, 118.62],
};

// Tibet was outside Nationalist and Communist control throughout; the Ili
// "Three Districts" (East Turkestan Republic) until they joined the PRC in
// September 1949. Both lie west of the map frame but are kept for honesty.
const TIBET = [[35.9, 78.5], [35.6, 85], [35.4, 89.5], [34.3, 91.5], [33.4, 94], [32.8, 96.8], [32.3, 98.3],
    [31.0, 98.8], [29.2, 98.95], [28.2, 98.5], [27.5, 98.2], [26.5, 97.5], [26, 90], [26, 78]];
const ILI = [[49.5, 80], [49.5, 91], [46.5, 91], [45.5, 87.5], [44.3, 85.0], [43.3, 84.0], [42.3, 80.0]];

// Manchukuo with Jehol, Taiwan and Hainan: Japanese at the surrender, beyond
// the West Point plate's frame.
const MANCHUKUO = [[39.9, 119.9], [40.2, 118.8], [40.4, 117.6], [40.9, 116.8], [41.9, 116.0], [42.9, 116.2],
    [43.4, 117.5], [45.5, 116.5], [50, 115], [55, 115], [55, 136], [40, 136], [38.6, 121.5], [39.3, 120.5]];
const TAIWAN = [[25.6, 121.2], [25.2, 120.6], [24.2, 119.9], [23.8, 119.2], [23.2, 119.2], [21.7, 120.3],
    [21.7, 121.3], [22.5, 122.0], [25.5, 122.5]];
const HAINAN = [[20.2, 111.4], [20.2, 109.4], [19.4, 108.2], [17.9, 108.3], [17.7, 110.0], [19.0, 111.4]];

// The Qiongya column held Hainan's mountain interior from 1945 to the
// 1950 landing; the Dongjiang column the East River hills until its 1946
// evacuation north. Both sit in the State map's inset, which is not traced.
const QIONGYA = circle(19.2, 109.55, 0.38);
const DONGJIANG = circle(22.95, 114.35, 0.3);

// Soviet Port Arthur naval base area (Lüshun–Dalian), 1945–1955.
const LUDA = [[39.45, 121.2], [39.45, 122.3], [38.6, 122.3], [38.6, 120.9]];

// North of the Yangtze after the three campaigns, less Suiyuan (Nationalist
// until its September 1949 defection) and the Wuhan front of Bai Chongxi.
const NORTH_1949_02 = [
    [37.8, 106.9], [38.6, 107.7], [39.4, 109.2], [39.9, 110.6], [40.3, 112.3], [41.2, 112.9], [42.5, 113.5],
    [44.5, 113.5], [46.5, 114.0], [55, 114], [55, 136], [40, 136], [32.0, 124.0], [31.85, 121.2],
    [32.0, 120.2], [32.25, 119.5], [32.2, 119.0], [31.9, 118.4], [31.5, 118.1], [31.1, 117.7],
    [30.7, 117.2], [30.3, 116.6], [30.0, 116.1], [29.95, 115.6], [30.2, 115.2], [30.6, 114.9],
    [31.1, 114.2], [31.1, 113.4], [31.4, 112.3], [31.6, 111.4], [32.3, 110.6], [33.0, 110.4],
    [33.6, 110.3], [34.3, 110.3], [34.8, 110.1], [35.2, 109.6], [35.5, 108.8], [35.7, 107.8],
    [36.3, 107.0], [37.0, 106.7],
];

// North China and Manchuria before the Liaoshen campaign: everything down to
// the Huai and the Dabie hills that the traced 1947 map does not already
// cover. Nationalist cities and corridors are carved out below.
const NORTH_1948_09 = [
    [37.8, 106.9], [38.6, 107.7], [39.1, 108.6], [39.4, 110.0], [39.9, 110.9], [40.3, 111.8], [40.4, 113.0],
    [40.6, 113.9], [41.8, 114.2], [43.0, 114.5], [45.2, 114.0], [47, 114], [55, 114], [55, 136], [40, 136],
    [38.5, 124], [37.0, 123.5], [35.0, 120.0], [34.3, 120.3], [33.3, 121.0], [32.6, 121.3], [32.7, 120.3],
    [33.0, 119.4], [33.2, 118.8], [33.0, 117.6], [32.8, 116.5], [32.5, 115.6], [31.9, 116.4], [31.3, 116.3],
    [30.9, 115.8], [30.8, 115.0], [31.3, 114.3], [31.7, 113.6], [31.9, 112.3], [32.5, 111.5], [33.3, 110.9],
    [34.0, 110.6], [34.6, 110.3], [35.2, 109.8], [35.5, 108.8], [35.7, 107.8], [36.3, 107.0], [37.0, 106.7],
];

// After the Yangtze crossing (end of June 1949): the line runs from the
// Zhejiang–Fujian border through central Jiangxi, north of Changsha and
// Yichang, across the Qinling east of Baoji, with the Ma armies' Northwest
// and Suiyuan still Nationalist.
const MAIN_1949_06 = [
    [37.8, 106.9], [38.6, 107.7], [39.4, 109.2], [39.9, 110.6], [40.3, 112.3], [41.2, 112.9], [42.5, 113.5],
    [44.5, 113.5], [46.5, 114.0], [55, 114], [55, 136], [40, 136], [32.0, 125.0], [27.2, 121.3],
    [27.2, 120.5], [27.5, 119.6], [28.0, 118.8], [28.3, 118.2], [27.8, 116.8], [27.6, 116.0], [27.8, 115.2],
    [28.0, 114.4], [28.6, 114.0], [29.3, 113.9], [29.6, 113.3], [29.9, 112.8], [30.2, 112.3], [30.8, 111.6],
    [31.4, 110.8], [32.2, 110.3], [32.9, 109.8], [33.6, 109.5], [34.0, 108.4], [34.3, 107.6], [34.6, 107.4],
    [35.0, 107.6], [35.5, 107.3], [36.3, 107.0], [37.0, 106.7],
];

// All of China's mainland; islands still Nationalist are carved as pockets.
const MAINLAND = [[55, 70], [55, 140], [39, 140], [34, 124.5], [31.2, 123.0], [28.5, 122.3], [26.6, 120.9],
    [25.9, 120.35], [25.0, 119.95], [24.3, 119.2], [23.6, 118.4], [22.8, 117.3], [21.8, 114.5], [21.0, 112.5],
    [20.35, 111.2], [20.3, 110.0], [21.0, 108.4], [21.5, 106], [15, 100], [15, 70]];

// The Nationalist south-west on 1 October 1949: Guangdong (Canton fell on
// the 14th), Guangxi, Guizhou, Yunnan, Sichuan, Xikang, southern Shaanxi and
// Gansu, western Hubei and Hunan.
const SOUTHWEST_1949_10 = [
    [23.6, 117.3], [24.3, 116.6], [24.6, 115.7], [25.0, 114.8], [25.5, 114.2], [25.6, 113.4], [26.5, 113.5],
    [27.2, 112.8], [27.5, 111.8], [27.8, 111.0], [28.3, 110.4], [29.3, 110.0], [30.2, 110.2], [30.9, 110.3],
    [31.3, 109.9], [32.0, 109.6], [32.6, 109.3], [33.2, 108.6], [33.7, 107.6], [34.0, 106.6], [34.1, 105.5],
    [33.6, 104.4], [33.9, 103.2], [34.0, 102.0], [33.5, 100.0], [33.3, 98.6], [32.5, 98.4], [32.0, 97.0],
    [26, 97], [20, 97], [15, 107], [15, 118], [22, 118],
];

// Islands the Nationalists kept past 1949 or into 1950.
const ZHOUSHAN = circle(30.1, 122.15, 0.4);
const KINMEN = circle(24.45, 118.35, 0.2);

// China's coastal waters, joined to the region so the areas need not follow
// the coast (the renderer clips them to the drawn land). Kept off Korea,
// the Ryukyus and Vietnam; the bake subtracts foreign land anyway.
const SEA = [[39.9, 124.2], [38.0, 124.0], [36.0, 123.5], [33.0, 123.5], [30.0, 123.3], [27.0, 121.8],
    [25.3, 122.3], [22.0, 121.3], [21.7, 120.2], [22.0, 117.5], [21.0, 113.5], [19.5, 111.5], [18.0, 110.0],
    [17.9, 108.5], [19.0, 108.2], [21.4, 108.2], [22.5, 108.0], [40.5, 121.0], [40.5, 122.0], [40.3, 124.0]];

module.exports = {
    eventId: 'chinese-civil-war-1945-1949',
    traced: 'chinese-civil-war-1945-1949.traced.json',
    region: ['CHN', 'TWN'],
    sea: SEA,
    base: 'kmt',
    precedence: ['other', 'soviet', 'ccp', 'japan'],
    carve: ['ccp'],
    sides: [
        { id: 'kmt', label: { ko: '국민정부', en: 'Nationalist government' }, tone: 'blue' },
        { id: 'ccp', label: { ko: '공산당', en: 'Communists' }, tone: 'red' },
        { id: 'japan', label: { ko: '일본군 점령', en: 'Japanese occupation' }, tone: 'amber' },
        { id: 'soviet', label: { ko: '소련군 점령', en: 'Soviet occupation' }, tone: 'purple' },
        { id: 'other', label: { ko: '양측 통제 밖 (티베트 등)', en: 'Outside both (Tibet etc.)' }, tone: 'gray' },
    ],
    note: {
        ko: '경계는 근사치입니다. 1945~1947년은 1947년 미 국무부 지도, 1948~1949년은 전역 기록을 바탕으로 그렸습니다. 1948년까지 국민당은 주로 도시와 철도를, 공산당은 농촌을 장악했습니다.',
        en: 'Boundaries are approximate. 1945–1947 follow a 1947 US State Department map; 1948–1949 are drawn from the campaign record. Until 1948 the Nationalists mostly held cities and railways, the Communists the countryside.',
    },
    sources: [
        { label: 'US Department of State, Map Division, “China: Communist Controlled Areas, 1945–1947” (no. 10745, Aug. 1947), NARA via Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:China_Communist_Controlled_Areas,_1945-1947_-_DPLA_-_fcf9e57e32bee59c1519defdd8d46e43.jpg' },
        { label: 'US Military Academy, Department of History, “China, 1900–1949: Situation at the End of World War II”', url: 'https://commons.wikimedia.org/wiki/File:Situation_at_the_End_of_World_War_Two.PNG' },
    ],
    phases: [
        {
            date: '1945.08', label: { ko: '일본 항복', en: 'Japan surrenders' }, traced: true,
            ccp: ['traced', DONGJIANG, QIONGYA],
            japan: ['traced', MANCHUKUO, TAIWAN, HAINAN],
            other: [TIBET, ILI],
        },
        {
            date: '1946.01', label: { ko: '정전 협정 · 소련군의 만주 점령', en: 'The ceasefire; Soviet-held Manchuria' }, traced: true,
            ccp: ['traced', DONGJIANG, QIONGYA],
            soviet: ['traced', LUDA],
            other: [TIBET, ILI],
        },
        {
            date: '1946.08', label: { ko: '전면 내전 초기', en: 'Early full-scale war' }, traced: true,
            ccp: ['traced', QIONGYA],
            soviet: [LUDA],
            other: [TIBET, ILI],
        },
        {
            date: '1947.01', label: { ko: '국민당의 공세', en: 'The Nationalist offensive' }, traced: true,
            ccp: ['traced', QIONGYA],
            soviet: [LUDA],
            other: [TIBET, ILI],
        },
        {
            date: '1947.07', label: { ko: '공산당 반격 직전', en: 'Before the Communist counteroffensive' }, traced: true,
            ccp: ['traced', QIONGYA],
            soviet: [LUDA],
            other: [TIBET, ILI],
        },
        {
            date: '1948.09', label: { ko: '랴오선 전역 직전', en: 'Eve of the Liaoshen campaign' },
            ccp: [{ traced: '1947.07' }, NORTH_1948_09, QIONGYA],
            kmt: [
                circle(...P.changchun, 0.35), circle(41.85, 123.6, 0.6), circle(...P.jinzhou, 0.35), circle(...P.chengde, 0.25),
                corridor(0.3, P.jinzhou, P.huludao, P.shanhaiguan, P.tangshan, P.tianjin, P.beiping),
                circle(...P.beiping, 0.6), circle(...P.tianjin, 0.45), corridor(0.2, P.tianjin, P.tanggu),
                corridor(0.25, P.beiping, P.baoding), circle(...P.baoding, 0.25),
                corridor(0.3, P.beiping, P.nankou, P.zhangjiakou, P.datong, P.jining, P.guisui, P.baotou),
                circle(...P.zhangjiakou, 0.3), circle(...P.datong, 0.35), circle(...P.guisui, 0.35), circle(...P.baotou, 0.3),
                circle(...P.taiyuan, 0.45), circle(...P.yulin, 0.3), circle(...P.anyang, 0.2), circle(...P.xinxiang, 0.2),
                circle(...P.jinan, 0.3), circle(...P.qingdao, 0.4), circle(...P.yantai, 0.15),
                circle(...P.xuzhou, 0.7), corridor(0.25, P.xuzhou, P.shangqiu, P.kaifeng, P.zhengzhou),
                circle(...P.zhengzhou, 0.3), circle(...P.kaifeng, 0.2), corridor(0.3, P.xuzhou, P.bengbu), circle(...P.bengbu, 0.3),
                corridor(0.25, P.xinyang, P.hankou), circle(...P.xinyang, 0.3), circle(...P.nanyang, 0.3),
            ],
            soviet: [LUDA],
            other: [TIBET, ILI],
        },
        {
            date: '1949.02', label: { ko: '세 전역 뒤', en: 'After the three campaigns' },
            ccp: [NORTH_1949_02, QIONGYA],
            kmt: [
                circle(...P.taiyuan, 0.4), circle(...P.datong, 0.3), circle(...P.yulin, 0.3), circle(...P.anyang, 0.2),
                circle(...P.xinxiang, 0.2), circle(...P.qingdao, 0.4), circle(...P.anqing, 0.25), circle(...P.pukou, 0.2),
                circle(30.75, 114.2, 0.6),
            ],
            soviet: [LUDA],
            other: [TIBET, ILI],
        },
        {
            date: '1949.06', label: { ko: '창장 도하 뒤', en: 'After the Yangtze crossing' },
            ccp: [MAIN_1949_06, QIONGYA],
            kmt: [ZHOUSHAN],
            soviet: [LUDA],
            other: [TIBET, ILI],
        },
        {
            date: '1949.10', label: { ko: '중화인민공화국 선포', en: 'The People’s Republic proclaimed' },
            ccp: [MAINLAND, QIONGYA],
            kmt: [SOUTHWEST_1949_10, ZHOUSHAN, circle(24.47, 118.15, 0.3), KINMEN],
            soviet: [LUDA],
            other: [TIBET],
        },
        {
            date: '1949.12', label: { ko: '국민정부의 대만 퇴각', en: 'The Nationalist government leaves for Taiwan' },
            ccp: [MAINLAND, QIONGYA],
            kmt: [circle(27.9, 102.26, 0.6), circle(23.4, 103.4, 0.6), ZHOUSHAN, KINMEN],
            soviet: [LUDA],
            other: [TIBET],
        },
    ],
};
