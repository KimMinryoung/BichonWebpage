// The kinds a reference document can be (data/commulingo/docs/README.md,
// 「문서 추가 절차」): the list page's filter chips and the card label. A kind is
// stored in the entry as its two labels ({ ko, en }); this table is what the
// labels are checked against at save time (doc-entry.js inspectDocEntry), so a
// label a letter off no longer grows a twelfth chip. The id is the English
// label slugged, which is what the list page's ?kind= already carried.
const DOC_KINDS = [
    { id: 'theory-essays', ko: '이론·논설', en: 'Theory & essays' },
    { id: 'speeches-reports', ko: '연설·보고', en: 'Speeches & reports' },
    { id: 'letters', ko: '편지', en: 'Letters' },
    { id: 'diaries-memoirs', ko: '일기·회고록', en: 'Diaries & memoirs' },
    { id: 'press-articles', ko: '언론 기사', en: 'Press articles' },
    { id: 'constitutions-laws-orders', ko: '헌법·법령·명령', en: 'Constitutions, laws & orders' },
    { id: 'treaties-agreements', ko: '조약·협정', en: 'Treaties & agreements' },
    { id: 'party-government-documents', ko: '정당·정부 문서', en: 'Party & government documents' },
    { id: 'intelligence-investigation-records', ko: '정보·수사 기록', en: 'Intelligence & investigation records' },
    { id: 'scholarship', ko: '연구서·논문', en: 'Scholarship' },
    { id: 'literature', ko: '문학', en: 'Literature' },
];

const byKo = new Map(DOC_KINDS.map(kind => [kind.ko, kind]));
const byEn = new Map(DOC_KINDS.map(kind => [kind.en, kind]));

// The table row an entry's kind labels name, or null when a label given is
// not in the table or the two labels name different rows. One label (the
// other empty, as langPair leaves it) is enough.
function docKind(kind) {
    if (!kind || typeof kind !== 'object') return null;
    const rows = [['ko', byKo], ['en', byEn]]
        .filter(([lang]) => typeof kind[lang] === 'string' && kind[lang] !== '')
        .map(([lang, table]) => table.get(kind[lang]) || null);
    if (!rows.length || rows.some(row => !row)) return null;
    return rows.every(row => row === rows[0]) ? rows[0] : null;
}

function slug(label) {
    return String(label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// The filter id for an entry's kind: the table's id, or, for a label not in
// the table, the slug the list page always derived (so an unfixed document
// still filters, under its own chip).
function docKindId(kind) {
    const known = docKind(kind);
    if (known) return known.id;
    return slug((kind && (kind.en || kind.ko)) || '') || 'other';
}

module.exports = { DOC_KINDS, docKind, docKindId };
