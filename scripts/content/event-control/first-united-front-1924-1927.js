// The Guangzhou government's reach and the Northern Expedition, for the
// event map's control layer of the first United Front (1923–1927).
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/first-united-front-1924-1927.json (needs
// NE_ADMIN1, see there). Drawn by hand from the campaign record; no map is
// traced. Modern Natural Earth provinces stand in for the Republican ones
// (Sichuan with Chongqing, Guangdong with Hainan, Jiangsu with Shanghai,
// Gansu with Ningxia), and a province is painted once its capital fell or
// its governor changed sides, though fighting often went on in its corners.
// Provinces whose warlords only nominally joined the National Revolutionary
// Army in 1926 (Guizhou, Sichuan, Yunnan) stay with the warlords.
//
// How a phase is built: the warlords (the Beijing government and the
// cliques) are the remainder (blue); the Guangzhou government and the
// National Revolutionary Army are laid over them (red), from April 1927
// split into Wuhan (red) and Nanjing (amber), and Feng Yuxiang's Guominjun,
// which joined in September 1926 (purple).
//
// Coordinates are [lat, lng].

const CHN = provinces => ({ provinces, country: 'CHN' });

// 1923–1925: Sun Yat-sen's base round Guangzhou and the Pearl River delta;
// Chen Jiongming held the east (Huizhou, Shantou) until the Eastern
// Expeditions of 1925, Deng Benyin the south-west until early 1926.
const GUANGZHOU_BASE = [[24.4, 112.8], [24.2, 114.2], [23.3, 114.5], [22.5, 114.2], [21.9, 113.5],
    [22.0, 112.5], [22.8, 111.9], [23.8, 112.2]];

const LIANGGUANG = ['Guangdong', 'Hainan', 'Guangxi'];
// North of the lower Yangtze, from the Hubei border past Anqing, Wuhu,
// Nanjing and Zhenjiang to the estuary: still Sun Chuanfang's and Zhang
// Zongchang's in March 1927.
const NORTH_OF_YANGTZE = [[29.9, 114.5], [29.95, 115.8], [30.35, 116.7], [30.6, 117.2], [31.2, 117.9], [31.5, 118.4],
    [31.9, 118.65], [32.12, 118.85], [32.25, 119.4], [32.1, 119.9], [31.95, 120.4], [31.8, 121.0],
    [31.6, 122.3], [36, 122.3], [36, 114.5]];
const LOWER_YANGTZE = ['Zhejiang', 'Shanghai', 'Jiangsu', 'Anhui'];

const GUOMINJUN_1926 = ['Gansu', 'Ningxia'];
const GUOMINJUN_1927 = ['Gansu', 'Ningxia', 'Shaanxi'];

module.exports = {
    eventId: 'first-united-front-1924-1927',
    region: ['CHN'],
    base: 'warlords',
    precedence: ['guominjun', 'nanjing', 'nra'],
    sides: [
        { id: 'warlords', label: { ko: '북양 군벌 (베이징 정부)과 기타 군벌', en: 'Beiyang warlords (the Beijing government) and others' }, tone: 'blue' },
        { id: 'nra', label: { ko: '광저우 국민정부·국민혁명군 (1927년 4월부터 우한 정부)', en: 'Guangzhou National Government and the National Revolutionary Army (from April 1927 the Wuhan government)' }, tone: 'red' },
        { id: 'nanjing', label: { ko: '난징 국민정부 (장제스)', en: 'Nanjing National Government (Chiang Kai-shek)' }, tone: 'amber' },
        { id: 'guominjun', label: { ko: '펑위샹의 국민군', en: 'Feng Yuxiang’s Guominjun' }, tone: 'purple' },
    ],
    note: {
        ko: '경계는 근사치이며 작전 기록을 바탕으로 현대 성 경계(쓰촨은 충칭 포함, 광둥은 하이난 포함, 간쑤는 닝샤 포함)로 개략적으로 그렸습니다. 성도가 함락되거나 성장이 편을 바꾼 때를 기준으로 성 전체를 칠했으며, 실제로는 성 안에서 전투가 이어졌습니다. 1926년 명목상 국민혁명군에 편입된 구이저우·쓰촨·윈난 군벌은 군벌로 두었습니다.',
        en: 'Boundaries are approximate, sketched from the campaign record on modern provincial borders (Sichuan with Chongqing, Guangdong with Hainan, Gansu with Ningxia). A whole province is painted once its capital fell or its governor changed sides, though fighting often went on inside it. The Guizhou, Sichuan and Yunnan warlords, who joined the National Revolutionary Army only in name in 1926, stay with the warlords.',
    },
    sources: [],
    phases: [
        { date: '1923.01', label: { ko: '광저우 정부: 주장 삼각주 일대', en: 'The Guangzhou government: the Pearl River delta' },
            nra: [GUANGZHOU_BASE] },
        { date: '1926.03', label: { ko: '동정으로 광둥 통일, 광시 합류', en: 'Guangdong unified by the Eastern Expeditions; Guangxi joins' },
            nra: [CHN(LIANGGUANG)] },
        { date: '1926.07', label: { ko: '북벌 개시: 후난 탕성즈 합류, 창사 점령', en: 'The Northern Expedition sets out: Tang Shengzhi’s Hunan joins, Changsha taken' },
            nra: [CHN([...LIANGGUANG, 'Hunan'])] },
        { date: '1926.10.10', label: { ko: '우창 함락: 후베이 장악, 국민군 합류', en: 'Wuchang falls: Hubei taken; the Guominjun joins' },
            nra: [CHN([...LIANGGUANG, 'Hunan', 'Hubei'])], guominjun: [CHN(GUOMINJUN_1926)] },
        { date: '1926.12', label: { ko: '장시(난창)·푸젠 장악, 국민군 시안 해방', en: 'Jiangxi (Nanchang) and Fujian taken; the Guominjun relieves Xi’an' },
            nra: [CHN([...LIANGGUANG, 'Hunan', 'Hubei', 'Jiangxi', 'Fujian'])], guominjun: [CHN(GUOMINJUN_1927)] },
        { date: '1927.03.21', label: { ko: '저장·상하이·난징 장악: 창장 이남', en: 'Zhejiang, Shanghai and Nanjing taken: south of the Yangtze' },
            nra: [CHN([...LIANGGUANG, 'Hunan', 'Hubei', 'Jiangxi', 'Fujian']),
                { area: CHN(LOWER_YANGTZE), minus: [NORTH_OF_YANGTZE] }],
            guominjun: [CHN(GUOMINJUN_1927)] },
        { date: '1927.04.12', label: { ko: '4·12 정변: 난징 정부와 우한 정부의 분열', en: 'The 12 April coup: Nanjing and Wuhan governments split' },
            nra: [CHN(['Hunan', 'Hubei', 'Jiangxi'])],
            nanjing: [CHN([...LIANGGUANG, 'Fujian']), { area: CHN(LOWER_YANGTZE), minus: [NORTH_OF_YANGTZE] }],
            guominjun: [CHN(GUOMINJUN_1927)] },
        { date: '1927.06', label: { ko: '국민군 허난 장악 (정저우), 난징군 쉬저우 점령', en: 'The Guominjun takes Henan (Zhengzhou); Nanjing’s army takes Xuzhou' },
            nra: [CHN(['Hunan', 'Hubei', 'Jiangxi'])],
            nanjing: [CHN([...LIANGGUANG, 'Fujian', ...LOWER_YANGTZE])],
            guominjun: [CHN([...GUOMINJUN_1927, 'Henan'])] },
    ],
};
