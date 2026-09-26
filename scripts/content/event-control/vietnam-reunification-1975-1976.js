// Territorial control in South Vietnam from the Paris agreement to the fall
// of Saigon, for the reunification event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/vietnam-reunification-1975-1976.json.
// Drawn by hand from the campaign record of the 1975 spring offensive; no
// map is traced.
//
// How a phase is built: the North and the Provisional Revolutionary
// Government are the remainder (red); the Saigon government's territory is
// laid over it.
//
// Coordinates are [lat, lng].

// The inner edge of the Saigon government's land in 1973: the DMZ, then
// short of the Laotian and Cambodian borders, where the PRG held the hills,
// and round Phu Quoc.
const WEST_1973 = [[16.7, 106.95], [16.0, 107.4], [15.3, 107.75], [14.6, 107.75], [14.0, 107.85],
    [13.3, 107.8], [12.5, 107.85], [12.0, 107.35], [11.6, 106.75], [11.2, 106.1], [10.9, 105.3], [10.3, 104.4],
    [10.6, 103.7], [8, 103.5]];
const SAIGON_1973 = [[17.05, 110], [17.05, 107.15], ...WEST_1973, [8, 110]];
// Phuoc Long, lost in January 1975, and Ban Me Thuot, taken on 10–11 March.
const PHUOC_LONG = [[12.15, 106.6], [12.05, 107.3], [11.55, 107.15], [11.5, 106.75]];
const BAN_ME_THUOT = { circle: [12.67, 108.04, 0.35] };
// 1 April: the highlands, Hue, Da Nang and Qui Nhon gone; the government
// holds the coast from Nha Trang and the south.
const SAIGON_1975_04_01 = [[12.45, 110], [12.45, 109.3], [12.2, 108.8], [11.95, 108.45], [11.8, 107.6],
    [11.5, 106.9], [11.2, 106.1], [10.9, 105.3], [10.3, 104.4], [10.6, 103.7], [8, 103.5], [8, 110]];
// 21 April: Xuan Loc falls; Saigon, Vung Tau and the Mekong delta remain.
const SAIGON_1975_04_21 = [[11.15, 105.9], [11.15, 106.6], [10.95, 107.25], [10.5, 107.6], [8, 107.6],
    [8, 103.5], [10.6, 103.7], [10.3, 104.4], [10.9, 105.1]];

module.exports = {
    eventId: 'vietnam-reunification-1975-1976',
    region: ['VNM'],
    base: 'north',
    precedence: ['saigon'],
    // The map's own markers are Hanoi alone; take in the south.
    focus: [[10.78, 106.7], [12.67, 108.04]],
    sides: [
        { id: 'north', label: { ko: '베트남 민주공화국과 남베트남 임시혁명정부', en: 'North Vietnam and the Provisional Revolutionary Government' }, tone: 'red' },
        { id: 'saigon', label: { ko: '베트남 공화국 (사이공 정부)', en: 'The Republic of Vietnam (the Saigon government)' }, tone: 'blue' },
    ],
    note: {
        ko: '경계는 근사치이며 1975년 봄 공세의 작전 기록을 바탕으로 개략적으로 그렸습니다. 1973년 휴전 뒤의 장악 지역은 실제로는 점점이 뒤섞여 있었으나, 국경 산지의 임시혁명정부 지역만 나타냈습니다.',
        en: 'Boundaries are approximate, sketched from the record of the 1975 spring offensive. After the 1973 ceasefire control was in fact a patchwork; only the Provisional Revolutionary Government\'s border highlands are shown.',
    },
    sources: [],
    phases: [
        { date: '1973.01', label: { ko: '파리 협정 직후', en: 'After the Paris agreement' }, saigon: [SAIGON_1973] },
        { date: '1975.03', label: { ko: '푹롱 상실과 부온마투옷 함락', en: 'Phuoc Long lost, Ban Me Thuot taken' },
            saigon: [{ area: SAIGON_1973, minus: [PHUOC_LONG, BAN_ME_THUOT] }] },
        { date: '1975.04.01', label: { ko: '중부 고원·후에·다낭 상실', en: 'The highlands, Hue and Da Nang lost' },
            saigon: [{ area: SAIGON_1975_04_01, minus: [PHUOC_LONG] }] },
        { date: '1975.04.21', label: { ko: '쑤언록 함락: 사이공과 메콩 삼각주만 남음', en: 'Xuan Loc falls: only Saigon and the Mekong delta left' },
            saigon: [SAIGON_1975_04_21] },
        { date: '1975.04.30', label: { ko: '사이공 함락', en: 'The fall of Saigon' } },
    ],
};
