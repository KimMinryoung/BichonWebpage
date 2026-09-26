// The extent of the Japanese empire and its conquests, from Manchuria to
// the surrender, for the Pacific War event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/pacific-war.json. Occupied China is the
// Sino-Japanese War map's (its hand-drawn 1937 areas and the West Point
// tracings for 1940 and 1945, sino-japanese-war-1937-1945.js parts);
// Southeast Asia and the Pacific are drawn by hand, coarsely, from the
// campaign record. Only land large enough to see at this scale is drawn:
// the Gilberts, Nauru, Wake and the bypassed atolls are left out.
//
// How a phase is built: everything outside Japanese control is the
// remainder (blue); Japan, its colonies and what it occupied or held
// through client states are laid over it.
//
// Coordinates are [lat, lng].

const { MANCHUKUO, TAIWAN, HAINAN, EAST_HEBEI, NORTH_CHAHAR, NORTH_CHINA_1937, LOWER_YANGTZE_1937,
    TRACED_1945 } = require('./sino-japanese-war-1937-1945').parts;

const circle = (lat, lng, r) => ({ circle: [lat, lng, r] });
const CHINA_1940 = { traced: '1940', side: 'japan', file: 'sino-japanese-war-1937-1945.traced.json' };
const CHINA_1945 = { traced: '1945.08', side: 'japan', file: TRACED_1945 };

// Japan, Korea, Taiwan and the South Seas mandate.
const EMPIRE = [{ units: ['JPN', 'KOR', 'PRK', 'PLW', 'FSM', 'MHL'] }, { units: ['MNP'] }, TAIWAN];
// September 1940: northern Indochina (Tonkin).
const TONKIN_1940 = [[23.4, 102.1], [23.2, 106.0], [22.0, 108.3], [21.3, 108.2], [20.0, 106.8], [19.9, 105.5],
    [20.5, 104.0], [21.5, 102.5]];
const INDOCHINA = { units: ['VNM', 'LAO', 'KHM'] };
// Thailand, allied to Japan from December 1941.
const SOUTH_EAST_ASIA = { units: ['PHL', 'MYS', 'SGP', 'BRN', 'IDN', 'TLS', 'THA', 'MMR', 'HKG', 'GUM'] };
// 1942: New Britain, New Ireland, Bougainville and the north coast of New
// Guinea down to Buna and Gona.
const NEW_GUINEA_1942 = [[-1, 140.5], [-1, 157], [-7.2, 157], [-7.2, 152], [-7.0, 150.0], [-8.4, 148.7],
    [-9.0, 148.2], [-8.2, 147.6], [-7.3, 146.9], [-6.2, 146.2], [-5.3, 145.2], [-4.2, 143.5], [-3.4, 141.0], [-3.4, 140.5]];
// End of 1943: Papua, Lae, Salamaua and Finschhafen retaken; the Solomons
// south of Bougainville lost.
const NEW_GUINEA_1943 = [[-1, 140.5], [-1, 157], [-7.2, 157], [-6.2, 152], [-6.3, 149.5], [-6.0, 147.6],
    [-5.7, 146.5], [-5.3, 145.2], [-4.2, 143.5], [-3.4, 141.0], [-3.4, 140.5]];
// June 1944, the leapfrogging along New Guinea: Wewak, Rabaul with New
// Ireland, and Bougainville bypassed and still held.
const NEW_GUINEA_1944 = [
    [[-3.2, 142.5], [-3.2, 145.0], [-4.5, 145.0], [-4.5, 142.5]],
    [[-2.4, 150.5], [-2.4, 153.5], [-5.5, 153.5], [-5.5, 150.5]],
    [[-4.9, 154.4], [-4.9, 156.0], [-7.0, 156.0], [-7.0, 155.3], [-6.2, 155.0], [-6.1, 154.4]],
];
// Allied footholds in Dutch New Guinea and the Moluccas, 1944.
const HOLLANDIA = circle(-2.6, 140.7, 0.6);
const BIAK = circle(-1.05, 136.0, 0.45);
const SANSAPOR = circle(-0.5, 131.9, 0.4);
const MOROTAI = circle(2.3, 128.4, 0.35);
// February 1945, the Philippines: Leyte and Samar, Mindoro, and the
// central Luzon plain from Lingayen to Manila.
const LEYTE_SAMAR = [[12.7, 124.2], [12.7, 126.0], [10.0, 126.0], [9.9, 124.2]];
const MINDORO = [[13.6, 120.2], [13.6, 121.6], [12.2, 121.6], [12.2, 120.2]];
const LUZON_1945_02 = [[16.3, 119.8], [16.3, 120.9], [15.0, 121.3], [14.4, 121.2], [14.2, 120.6], [14.6, 120.3],
    [15.5, 119.8]];
// Northern Burma retaken by February 1945.
const NORTH_BURMA_1945_02 = [[28.6, 93], [28.6, 99], [22.5, 99], [22.5, 93]];
// August 1945: what Japan still held in Burma (east of the Sittang and
// Tenasserim), in the Philippines (the Cordillera and inland Mindanao),
// and in Borneo after the Tarakan, Brunei Bay and Balikpapan landings.
const BURMA_1945_08 = [[20.5, 96.9], [20.5, 99.0], [16.0, 99.0], [10.0, 98.8], [10.0, 98.0], [16.5, 97.4],
    [18.5, 96.8]];
const LUZON_1945_08 = [[17.8, 120.7], [17.8, 121.8], [16.3, 121.6], [16.3, 120.7]];
const MINDANAO_1945_08 = [[8.2, 124.5], [8.2, 126.0], [7.0, 126.0], [7.0, 124.5]];
const BORNEO_LANDINGS = [circle(3.3, 117.6, 0.3), [[5.2, 114.0], [5.2, 115.8], [4.3, 115.8], [4.3, 114.0]],
    circle(-1.25, 116.85, 0.35)];
const OKINAWA = circle(26.4, 127.9, 0.6);

const PHILIPPINES_1945_02 = { area: { units: ['PHL'] }, minus: [LEYTE_SAMAR, MINDORO, LUZON_1945_02] };
const SOUTH_1945_02 = { area: { units: ['MYS', 'SGP', 'BRN', 'IDN', 'TLS', 'THA', 'HKG'] },
    minus: [HOLLANDIA, BIAK, SANSAPOR, MOROTAI] };

module.exports = {
    eventId: 'pacific-war',
    region: ['CHN', 'TWN', 'JPN', 'KOR', 'PRK', 'PHL', 'IDN', 'MYS', 'SGP', 'BRN', 'TLS', 'PNG', 'SLB', 'VNM',
        'LAO', 'KHM', 'THA', 'MMR', 'PLW', 'FSM', 'MHL', 'MNP', 'GUM', 'HKG', 'MAC'],
    bounds: [[-12, 90], [55, 180]],
    simplify: 0.3,
    base: 'outside',
    precedence: ['japan'],
    sides: [
        { id: 'outside', label: { ko: '일본 세력 밖 (연합국·중국·중립국)', en: 'Outside Japanese control (the Allies, China, neutrals)' }, tone: 'blue' },
        { id: 'japan', label: { ko: '일본 제국·점령지와 동맹국 태국', en: 'The Japanese empire, occupied land and allied Thailand' }, tone: 'amber' },
    ],
    note: {
        ko: '경계는 근사치입니다. 중국 점령지는 웨스트포인트 지도책의 1937년·1940년·1945년 도판을, 동남아시아와 태평양은 작전 기록을 바탕으로 개략적으로 그렸습니다. 일본군은 중국과 뉴기니에서 주로 도시·철도·해안을 장악했습니다. 작은 섬과 우회된 환초는 생략했으며, 1945년 8월 소련의 만주 공격은 만주 작전 사건 지도에서 볼 수 있습니다.',
        en: 'Boundaries are approximate. Occupied China follows the West Point atlas plates for 1937, 1940 and 1945; Southeast Asia and the Pacific are sketched from the campaign record. In China and New Guinea the Japanese mostly held cities, railways and coasts. Small islands and bypassed atolls are left out; the Soviet attack on Manchuria in August 1945 is on the Manchurian operation\'s map.',
    },
    sources: [],
    phases: [
        { date: '1931', label: { ko: '만주 침략과 만주국 (1931~1932)', en: 'The seizure of Manchuria and Manchukuo (1931–1932)' },
            japan: [...EMPIRE, MANCHUKUO] },
        { date: '1937.07.07', label: { ko: '루거우차오 사건 직전', en: 'On the eve of the Marco Polo Bridge incident' },
            japan: [...EMPIRE, MANCHUKUO, EAST_HEBEI, NORTH_CHAHAR] },
        { date: '1937.12', label: { ko: '화북 점령과 난징 함락', en: 'North China occupied; Nanjing falls' },
            japan: [...EMPIRE, MANCHUKUO, NORTH_CHAHAR, NORTH_CHINA_1937, LOWER_YANGTZE_1937] },
        { date: '1938.10', label: { ko: '우한·광저우 함락 뒤의 중국 전선', en: 'The China front after Wuhan and Canton fall' },
            japan: [...EMPIRE, MANCHUKUO, CHINA_1940, HAINAN] },
        { date: '1940.09', label: { ko: '북부 인도차이나 진주', en: 'Northern Indochina occupied' },
            japan: [...EMPIRE, MANCHUKUO, CHINA_1940, HAINAN, TONKIN_1940] },
        { date: '1941.07', label: { ko: '남부 인도차이나 진주', en: 'Southern Indochina occupied' },
            japan: [...EMPIRE, MANCHUKUO, CHINA_1940, HAINAN, INDOCHINA] },
        { date: '1942.05', label: { ko: '최대 판도: 동남아시아와 남태평양', en: 'The greatest extent: Southeast Asia and the South Pacific' },
            japan: [...EMPIRE, MANCHUKUO, CHINA_1940, HAINAN, INDOCHINA, SOUTH_EAST_ASIA, NEW_GUINEA_1942,
                { units: ['SLB'] }] },
        { date: '1943.12', label: { ko: '과달카날·파푸아 상실', en: 'Guadalcanal and Papua lost' },
            japan: [...EMPIRE, MANCHUKUO, CHINA_1940, HAINAN, INDOCHINA, SOUTH_EAST_ASIA, NEW_GUINEA_1943] },
        { date: '1944.06', label: { ko: '뉴기니 도약 작전 뒤, 마리아나 상륙 직전', en: 'After the New Guinea leapfrogging, before the Marianas' },
            japan: [...EMPIRE, MANCHUKUO, CHINA_1940, HAINAN, INDOCHINA,
                { area: SOUTH_EAST_ASIA, minus: [HOLLANDIA, BIAK] }, ...NEW_GUINEA_1944] },
        { date: '1945.02', label: { ko: '이치고 작전 뒤의 중국, 필리핀 탈환전', en: 'China after Ichigo; the Philippines retaken' },
            japan: [{ units: ['JPN', 'KOR', 'PRK', 'PLW', 'FSM'] }, TAIWAN, MANCHUKUO, CHINA_1945, HAINAN, INDOCHINA,
                PHILIPPINES_1945_02, SOUTH_1945_02, { area: { units: ['MMR'] }, minus: [NORTH_BURMA_1945_02] },
                ...NEW_GUINEA_1944] },
        { date: '1945.08.06', label: { ko: '오키나와·버마·보르네오 상실 뒤', en: 'After Okinawa, Burma and the Borneo landings' },
            japan: [{ area: { units: ['JPN'] }, minus: [OKINAWA] }, { units: ['KOR', 'PRK', 'FSM'] }, TAIWAN, MANCHUKUO,
                CHINA_1945, HAINAN, INDOCHINA, BURMA_1945_08, LUZON_1945_08, MINDANAO_1945_08,
                { area: SOUTH_1945_02, minus: BORNEO_LANDINGS }, ...NEW_GUINEA_1944.slice(1)] },
        { date: '1945.09.02', label: { ko: '항복 조인', en: 'The surrender signed' } },
    ],
};
