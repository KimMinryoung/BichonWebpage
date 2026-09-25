// Control phases of the Spanish Civil War for the event map.
//
// Baked by scripts/bake-event-control.js into
// data/commulingo/event-control/spanish-civil-war.json. The Republican
// zone of each month is traced (trace-event-control-maps.js) from the
// Wikimedia Commons series "Map of the Spanish Civil War in <month>" by
// NordNordWest, modified by Sting and Grandiose, licensed CC BY-SA 3.0; the
// traced areas are a derivative under the same licence, credited on the
// page. The Nationalist zone is the remainder of Spain; by April 1939 it is
// all of it. Spanish Morocco and the Canaries, Nationalist from the first
// day, lie outside the map.

// Spain's coastal waters, so the areas need not follow the coast (the map
// clips them to the land). Portuguese, French and Moroccan land is removed
// by the bake.
const SEA = [[44.3, -10.0], [44.3, -1.2], [42.6, 3.6], [40.5, 4.8], [38.5, 4.8], [35.95, -2.0], [35.95, -5.3],
    [36.0, -7.5], [37.2, -7.45], [42.0, -9.0]];

module.exports = {
    eventId: 'spanish-civil-war',
    traced: 'spanish-civil-war.traced.json',
    region: ['ESP'],
    sea: SEA,
    base: 'nat',
    // Andalusia and Galicia lie outside the frame the event's markers give.
    focus: [[36.2, -6.0], [43.4, -8.9], [39.6, 3.2]],
    sides: [
        { id: 'rep', label: { ko: '공화국', en: 'Republic' }, tone: 'red' },
        { id: 'nat', label: { ko: '반란군 (국민파)', en: 'Rebels (Nationalists)' }, tone: 'blue' },
    ],
    note: {
        ko: '경계는 근사치입니다. 위키미디어 공용의 월별 스페인 내전 지도 연작(NordNordWest 작성, Sting·Grandiose 수정, CC BY-SA 3.0)에서 추출했으며, 이 영역 자료도 같은 라이선스를 따릅니다.',
        en: 'Boundaries are approximate, traced from the Wikimedia Commons monthly Spanish Civil War maps by NordNordWest, modified by Sting and Grandiose (CC BY-SA 3.0); the traced areas carry the same licence.',
    },
    sources: [
        { label: 'NordNordWest, Sting, Grandiose, “Map of the Spanish Civil War” series (CC BY-SA 3.0)', url: 'https://commons.wikimedia.org/wiki/Category:Maps_of_the_Spanish_Civil_War' },
    ],
    phases: [
        { date: '1936.07', label: { ko: '쿠데타 직후', en: 'After the coup' }, traced: true, rep: ['traced'] },
        { date: '1936.09', label: { ko: '남부군의 북상과 바다호스 함락', en: 'The Army of Africa drives north' }, traced: true, rep: ['traced'] },
        { date: '1937.03', label: { ko: '마드리드 방어 뒤', en: 'After the defence of Madrid' }, traced: true, rep: ['traced'] },
        { date: '1937.10', label: { ko: '북부 전선의 붕괴', en: 'The northern front falls' }, traced: true, rep: ['traced'] },
        { date: '1938.07', label: { ko: '공화국 영토의 양분 (에브로 전투 직전)', en: 'The Republic cut in two, before the Ebro' }, traced: true, rep: ['traced'] },
        { date: '1939.02', label: { ko: '카탈루냐 함락 뒤', en: 'After Catalonia falls' }, traced: true, rep: ['traced'] },
        { date: '1939.04', label: { ko: '전쟁의 끝', en: 'The end of the war' }, rep: [] },
    ],
};
