// Front lines of the Korean War for the event map's control layer.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/korean-war.json. There is no traced source:
// each phase is one front line across the peninsula, drawn from the US Army
// Center of Military History campaign maps (public domain) — Appleman,
// South to the Naktong (1961) and Mossman, Ebb and Flow (1990) — and the
// armistice line. Everything south of a line is UN Command; guerrilla
// areas behind the lines are not shown.
//
// Coordinates are [lat, lng], west to east.

// UN-held: south of the line, which is padded out to sea on both sides.
const southOf = line => [[line[0][0], 123.0], ...line, [line[line.length - 1][0], 131.5], [32.5, 131.5], [32.5, 123.0]];

// Jeju stayed in UN hands throughout.
const JEJU = [[33.7, 126.0], [33.7, 127.1], [33.1, 127.1], [33.1, 126.0]];

// Korea's coastal waters (the areas may run out to sea; the map clips them
// to the coast). The bake subtracts Chinese, Soviet and Japanese land.
const SEA = [[39.9, 124.0], [37.0, 123.6], [34.5, 124.5], [32.8, 125.5], [32.8, 127.5], [34.3, 129.0],
    [35.6, 129.9], [38.0, 129.8], [40.0, 129.3], [41.6, 130.1], [42.3, 130.8], [42.0, 128.0], [40.5, 124.8]];

const LINES = {
    '1950.06': [[38.0, 124.0], [38.0, 130.0]],
    '1950.07': [[36.2, 126.4], [36.3, 127.3], [36.35, 127.6], [36.55, 128.0], [36.75, 128.4], [36.8, 128.8], [36.6, 129.5]],
    '1950.09': [[34.9, 128.35], [35.2, 128.38], [35.4, 128.45], [35.7, 128.42], [35.95, 128.38], [36.1, 128.45],
        [36.15, 128.7], [36.1, 129.0], [36.05, 129.2], [36.1, 129.45], [36.1, 129.7]],
    '1950.10': [[39.6, 124.7], [39.8, 125.3], [40.0, 125.9], [39.9, 126.5], [39.95, 127.3], [40.2, 127.8],
        [40.5, 128.6], [40.6, 129.2]],
    '1950.11': [[39.6, 124.6], [39.68, 125.25], [39.72, 125.7], [39.73, 126.2], [39.9, 126.6], [40.35, 127.0],
        [40.5, 127.2], [41.1, 127.6], [41.4, 128.25], [41.2, 128.8], [41.4, 129.3], [41.75, 129.75], [41.8, 130.2]],
    '1950.12': [[37.7, 126.3], [37.85, 126.75], [37.98, 127.05], [38.0, 127.4], [37.97, 127.8], [37.85, 128.1],
        [38.0, 128.4], [38.08, 128.7]],
    '1951.01': [[36.95, 126.4], [37.0, 127.1], [37.05, 127.5], [37.12, 128.2], [37.3, 128.8], [37.45, 129.2], [37.45, 129.6]],
    '1951.07': [[37.73, 126.15], [37.85, 126.6], [38.0, 126.9], [38.15, 127.2], [38.25, 127.45], [38.2, 127.85],
        [38.25, 128.05], [38.35, 128.25], [38.5, 128.35], [38.55, 128.6]],
    '1953.07': [[37.73, 126.15], [37.8, 126.55], [37.95, 126.68], [38.0, 126.95], [38.2, 127.25], [38.3, 127.55],
        [38.28, 127.9], [38.3, 128.1], [38.35, 128.3], [38.6, 128.37], [38.62, 128.6]],
};

const LABELS = {
    '1950.06': { ko: '개전 (38선)', en: 'War begins at the 38th parallel' },
    '1950.07': { ko: '대전 함락 무렵', en: 'Around the fall of Taejon' },
    '1950.09': { ko: '낙동강 방어선 (인천 상륙 직전)', en: 'The Pusan Perimeter, before Inchon' },
    '1950.10': { ko: '북진과 중국군 개입', en: 'The UN advance north; China intervenes' },
    '1950.11': { ko: '최대 북진선 (11.24)', en: 'The UN high-water mark (24 Nov)' },
    '1950.12': { ko: '38선 부근으로 후퇴 (12.23)', en: 'Back to the 38th parallel (23 Dec)' },
    '1951.01': { ko: '1·4 후퇴 뒤 (평택–삼척선)', en: 'After Seoul falls again (Pyongtaek–Samchok)' },
    '1951.07': { ko: '전선 고착과 휴전 회담', en: 'Stalemate; armistice talks open' },
    '1953.07': { ko: '정전 협정 (군사분계선)', en: 'The armistice (Military Demarcation Line)' },
};

module.exports = {
    eventId: 'korean-war',
    region: ['KOR', 'PRK'],
    sea: SEA,
    base: 'north',
    sides: [
        { id: 'north', label: { ko: '조선인민군·중국인민지원군', en: 'Korean People’s Army and Chinese volunteers' }, tone: 'red' },
        { id: 'un', label: { ko: '국군·유엔군', en: 'South Korean and UN forces' }, tone: 'blue' },
    ],
    note: {
        ko: '전선은 근사치입니다. 미 육군 군사사연구소의 작전 지도(애플먼 『낙동강에서 압록강까지』, 모스먼 『밀물과 썰물』)와 정전 협정 지도를 바탕으로 그렸고, 전선 뒤의 유격 지역은 표시하지 않았습니다.',
        en: 'Front lines are approximate, drawn from US Army Center of Military History campaign maps (Appleman, South to the Naktong; Mossman, Ebb and Flow) and the armistice line; guerrilla areas behind the lines are not shown.',
    },
    sources: [
        { label: 'US Army Center of Military History, Roy E. Appleman, South to the Naktong, North to the Yalu (1961), Map III', url: 'https://commons.wikimedia.org/wiki/File:The_Front_Moves_South,_14_July_-_1_August_1950.png' },
        { label: 'US Army Center of Military History, Billy C. Mossman, Ebb and Flow (1990), Maps 3 and 13', url: 'https://commons.wikimedia.org/wiki/File:Korean_front_line_23_November_1950.jpg' },
    ],
    phases: Object.keys(LINES).map(date => ({
        date,
        label: LABELS[date],
        un: [southOf(LINES[date]), JEJU],
    })),
};
