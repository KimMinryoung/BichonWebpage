// Control phases of the Second Sino-Japanese War for the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/sino-japanese-war-1937-1945.json.
//
// Sources, all US government works in the public domain:
//   - 1938–1944: the Japanese-occupied area traced from West Point atlas
//     plate 4, "Japanese Occupation, 1940" (trace-event-control-maps.js).
//     The line barely moved between the fall of Wuhan and Canton in October
//     1938 and the Ichigo offensive of 1944, so the plate stands for both.
//   - 1944–1945: the Japanese occupation (West Point plate 5) and Communist
//     bases (State Department, 15 Aug 1945) already traced for the Chinese
//     Civil War.
//   - July and December 1937: drawn by hand from West Point plate 37,
//     "Chinese territory seized prior to July 1937 and major Japanese drives
//     in 1937".
// Communist base areas before 1944 are drawn coarsely from the main border
// regions; the note on the page says so. Coordinates are [lat, lng].

const civilWar = require('./chinese-civil-war-1945-1949');

const TRACED_1945 = 'chinese-civil-war-1945-1949.traced.json';

// Manchukuo with Jehol, and Taiwan: Japanese before the war began.
const MANCHUKUO = [[39.9, 119.9], [40.2, 118.8], [40.4, 117.6], [40.9, 116.8], [41.9, 116.0], [42.9, 116.2],
    [43.4, 117.5], [45.5, 116.5], [50, 115], [55, 115], [55, 136], [40, 136], [38.6, 121.5], [39.3, 120.5]];
const TAIWAN = [[25.6, 121.2], [25.2, 120.6], [24.2, 119.9], [23.8, 119.2], [23.2, 119.2], [21.7, 120.3],
    [21.7, 121.3], [22.5, 122.0], [25.5, 122.5]];
// Occupied in February 1939.
const HAINAN = [[20.2, 111.4], [20.2, 109.4], [19.4, 108.2], [17.9, 108.3], [17.7, 110.0], [19.0, 111.4]];
// The East Hebei Autonomous Council (1935) and the Japanese-backed Mongol
// government of northern Chahar (1936).
const EAST_HEBEI = [[40.45, 116.7], [40.4, 118.9], [39.95, 119.8], [39.2, 119.0], [39.1, 117.9], [39.7, 116.65]];
const NORTH_CHAHAR = [[42.9, 113.4], [42.0, 113.8], [41.6, 114.8], [41.8, 116.2], [42.9, 116.2], [44.5, 116.8], [45.2, 114.5]];

// The 1937 drives: North China down to Taiyuan and the Yellow River at
// Jinan, Suiyuan to Baotou; the Shanghai–Nanjing–Hangzhou triangle.
const NORTH_CHINA_1937 = [[45.3, 117.8], [43.5, 113.5], [41.8, 110.8], [40.9, 109.4], [40.4, 109.7], [39.9, 111.2],
    [38.6, 111.4], [37.4, 111.3], [36.6, 111.7], [36.9, 112.8], [37.3, 113.6], [36.7, 114.4], [36.9, 115.8],
    [36.55, 116.9], [37.3, 118.2], [37.8, 119.2], [38.8, 118.2], [39.9, 119.8]];
const LOWER_YANGTZE_1937 = [[32.3, 118.4], [32.35, 119.5], [32.0, 121.0], [31.7, 122.0], [30.4, 122.0],
    [30.1, 120.2], [30.6, 119.6], [31.2, 119.1], [31.7, 118.3]];

// The Shaan-Gan-Ning Border Region around Yan'an.
const SHAAN_GAN_NING = [[38.4, 107.2], [38.6, 108.0], [38.3, 110.2], [37.0, 110.5], [35.8, 110.3], [35.3, 109.3],
    [35.4, 107.8], [36.2, 106.6], [37.5, 106.8]];
// Main base areas behind Japanese lines around 1940, coarsely.
const BASES_1940 = [
    [[39.9, 113.6], [39.8, 115.2], [39.2, 115.6], [38.4, 114.8], [38.0, 113.9], [38.7, 113.3]],   // Jin-Cha-Ji
    [[39.3, 110.9], [39.2, 112.0], [38.2, 112.0], [37.6, 111.3], [38.4, 110.8]],                  // Jin-Sui
    [[37.6, 112.9], [37.5, 113.9], [36.6, 114.0], [35.9, 113.6], [36.2, 112.8], [36.9, 112.6]],   // Taihang
    [[37.4, 115.0], [37.3, 116.0], [36.3, 115.9], [36.2, 115.1], [36.8, 114.8]],                  // South Hebei plain
    [[36.3, 117.7], [36.3, 118.9], [35.5, 119.0], [35.2, 118.2], [35.6, 117.6]],                  // Yimeng, Shandong
    [[37.5, 120.6], [37.4, 121.5], [36.9, 121.4], [36.8, 120.6]],                                 // Jiaodong
    [[33.9, 119.6], [33.6, 120.4], [32.7, 120.6], [32.8, 119.8], [33.4, 119.4]],                  // Northern Jiangsu
    [[32.9, 117.6], [32.8, 118.4], [32.3, 118.5], [32.4, 117.7]],                                 // Huainan
];

const TIBET = [[35.9, 78.5], [35.6, 85], [35.4, 89.5], [34.3, 91.5], [33.4, 94], [32.8, 96.8], [32.3, 98.3],
    [31.0, 98.8], [29.2, 98.95], [28.2, 98.5], [27.5, 98.2], [26.5, 97.5], [26, 90], [26, 78]];

module.exports = {
    eventId: 'sino-japanese-war-1937-1945',
    traced: 'sino-japanese-war-1937-1945.traced.json',
    region: ['CHN', 'TWN'],
    sea: civilWar.sea,
    base: 'kmt',
    precedence: ['other', 'ccp', 'japan'],
    // Canton and Manchuria matter to the story but lie outside the frame
    // the event's own markers give.
    focus: [[22.8, 113.5], [45.8, 126.6]],
    sides: [
        { id: 'kmt', label: { ko: '국민정부', en: 'Nationalist government' }, tone: 'blue' },
        { id: 'japan', label: { ko: '일본군·괴뢰 정권 점령', en: 'Japanese and puppet-held' }, tone: 'amber' },
        { id: 'ccp', label: { ko: '공산당 근거지', en: 'Communist base areas' }, tone: 'red' },
        { id: 'other', label: { ko: '양측 통제 밖 (티베트)', en: 'Outside both (Tibet)' }, tone: 'gray' },
    ],
    note: {
        ko: '경계는 근사치입니다. 점령지는 웨스트포인트 지도책의 1937년·1940년·1945년 도판, 1945년 공산당 근거지는 미 국무부 지도를 바탕으로 그렸습니다. 1944년 이전의 공산당 근거지는 주요 지역만 개략적으로 표시했습니다. 일본군은 주로 도시와 철도를 장악했고, 점령지 안의 농촌 상당 부분은 유격 지역이었습니다.',
        en: 'Boundaries are approximate. Occupied areas follow the West Point atlas plates for 1937, 1940 and 1945; Communist bases in 1945 follow a State Department map. Before 1944 only the main Communist base areas are sketched. The Japanese mostly held cities and railways, and much of the countryside inside the occupied zone was contested.',
    },
    sources: [
        { label: 'US Military Academy, Department of History, “China, 1900–1949: Japanese Occupation, 1940”', url: 'https://commons.wikimedia.org/wiki/File:Japanese_Occupation_-_Map.jpg' },
        { label: 'US Military Academy, “China, 1941: Chinese territory seized prior to July 1937 and major Japanese drives in 1937”', url: 'https://commons.wikimedia.org/wiki/File:Major_Japanese_drives_in_1937.jpg' },
        { label: 'US Military Academy, “China, 1900–1949: Situation at the End of World War II”', url: 'https://commons.wikimedia.org/wiki/File:Situation_at_the_End_of_World_War_Two.PNG' },
        { label: 'US Department of State, “China: Communist Controlled Areas, 1945–1947” (1947)', url: 'https://commons.wikimedia.org/wiki/File:China_Communist_Controlled_Areas,_1945-1947_-_DPLA_-_fcf9e57e32bee59c1519defdd8d46e43.jpg' },
    ],
    phases: [
        {
            date: '1937.07', label: { ko: '루거우차오 사건 직전', en: 'On the eve of the Marco Polo Bridge incident' },
            japan: [MANCHUKUO, EAST_HEBEI, NORTH_CHAHAR, TAIWAN],
            ccp: [SHAAN_GAN_NING],
            other: [TIBET],
        },
        {
            date: '1937.12', label: { ko: '화북 점령과 난징 함락', en: 'North China occupied; Nanjing falls' },
            japan: [MANCHUKUO, NORTH_CHAHAR, NORTH_CHINA_1937, LOWER_YANGTZE_1937, TAIWAN],
            ccp: [SHAAN_GAN_NING],
            other: [TIBET],
        },
        {
            date: '1938.10', label: { ko: '우한·광저우 함락 뒤의 교착 (1938–1944)', en: 'Stalemate after Wuhan and Canton fall (1938–1944)' }, traced: true,
            japan: [{ traced: '1940', side: 'japan' }, MANCHUKUO, TAIWAN, HAINAN],
            ccp: [SHAAN_GAN_NING, ...BASES_1940],
            other: [TIBET],
        },
        {
            date: '1944.12', label: { ko: '이치고 작전 뒤에서 일본 항복까지', en: 'After the Ichigo offensive, to the surrender' }, traced: true,
            japan: [{ traced: '1945.08', side: 'japan', file: TRACED_1945 }, MANCHUKUO, TAIWAN, HAINAN],
            ccp: [{ traced: '1945.08', side: 'ccp', file: TRACED_1945 }],
            other: [TIBET],
        },
    ],
    // Shared with the Pacific War and Manchurian operation maps.
    parts: { MANCHUKUO, TAIWAN, HAINAN, EAST_HEBEI, NORTH_CHAHAR, NORTH_CHINA_1937, LOWER_YANGTZE_1937, TRACED_1945 },
};
