const { KINDS, key, normalize, signature, risks } = require('./link-review-policy');
const builders = {
    term: require('./term-linkify'), event: require('./event-linkify'), doc: require('./doc-linkify'),
};
// Where an expression comes from decides whether rejecting it can remove it:
// aliases and explicit link expressions are data; a headword, an event title
// (and its generated variants) or a document heading are not.
function expressionSource(kind, record, lang, text) {
    if ((record.linkExpressions || []).some(value => value.lang === lang && value.text === text)
        && !(record.aliases?.[lang] || []).includes(text)) return 'expression';
    if (kind === 'term') return text !== (record.term?.[lang] || record.term?.ko || record.term?.en) && (record.aliases?.[lang] || []).includes(text) ? 'alias' : 'headword';
    if (kind === 'doc') return (record.aliases?.[lang] || []).includes(text) ? 'alias' : 'title';
    return 'title';
}
// Display names of people, for collision checks (records.personNames).
function personNameRows(peopleData) {
    const out = [];
    for (const person of peopleData?.people || []) for (const lang of ['ko', 'en']) {
        const text = person.name?.[lang];
        if (typeof text === 'string' && text.trim()) out.push({ id: person.id, lang, text: text.trim() });
    }
    return out;
}
function catalogue(records, reviews = new Map()) {
    const rows = [];
    for (const kind of KINDS) for (const record of records[kind] || []) for (const lang of ['ko', 'en']) {
        for (const expression of builders[kind].sourceExpressions(record, lang)) {
            const sourceSignature = signature(record, expression);
            const review = reviews.get(key(kind, record.id, lang, expression.text));
            const current = review?.source_signature === sourceSignature ? review : null;
            rows.push({ kind, id: record.id, lang, text: expression.text,
                label: (record.term || record.title || {})[lang] || record.id,
                sourceSignature, sourceRole: expression.role, sourcePolicy: expression.policy,
                source: expressionSource(kind, record, lang, expression.text),
                role: current?.role || expression.role, policy: current?.policy || 'search',
                reviewed: !!current, semanticReviewed: !!current?.reviewed_by && current.reviewed_by !== 'migration-178', note: current?.note || '', risks: risks(expression.text, lang) });
        }
    }
    const groups = new Map();
    for (const row of rows) {
        const normalized = row.lang + ':' + normalize(row.text, row.lang);
        if (!groups.has(normalized)) groups.set(normalized, []);
        groups.get(normalized).push(row);
    }
    // People are not review-gated, but a term, event or document claiming a
    // person's whole name takes that name away from the person pass (the
    // dictionary passes run first): 프랜시스 후쿠야마 linked to a book entry.
    // Their names compete like an approved expression.
    for (const person of records.personNames || []) {
        const group = groups.get(person.lang + ':' + normalize(person.text, person.lang));
        if (group && !group.some(other => other.kind === 'person' && other.id === person.id)) {
            group.push({ kind: 'person', id: person.id, text: person.text, label: person.text, policy: 'auto', reviewed: true });
        }
    }
    for (const row of rows) row.collisions = groups.get(row.lang + ':' + normalize(row.text, row.lang))
        .filter(other => other.kind !== row.kind || other.id !== row.id)
        .map(other => ({ kind: other.kind, id: other.id, text: other.text, label: other.label, policy: other.policy, reviewed: other.reviewed }));
    for (const row of rows) {
        const competing = row.policy !== 'search' && row.collisions.some(other => !other.reviewed || other.policy !== 'search');
        row.needsReview = !row.reviewed || ((row.risks.length > 0 || row.collisions.length > 0) && (!row.semanticReviewed || competing));
    }
    return rows;
}
function validateDecision(row, decision, rows) {
    const fail = message => { const error = new Error(message); error.status = 400; throw error; };
    if (!['auto', 'context', 'search'].includes(decision.policy)) fail('올바른 연결 정책을 선택하세요.');
    if (!['identity', 'short', 'related'].includes(decision.role)) fail('표현의 역할을 선택하세요.');
    if (typeof decision.note !== 'string' || decision.note.trim().length < 12 || decision.note.length > 2000) fail('검토 근거를 12~2000자로 작성하세요.');
    if (decision.policy === 'search') return;
    if ([...row.text].length < 2) fail('한 글자 표현은 검색 전용입니다.');
    if (row.collisions.some(other => !other.reviewed || other.policy !== 'search')) fail('다른 항목의 미검토 또는 자동 연결 표현과 겹칩니다. 경쟁 표현을 검색 전용으로 검토하거나 이름을 구체화하세요.');
    if (row.risks.some(reason => reason.startsWith('여러 시대')) && decision.policy === 'auto') fail('일반 표현은 자동 연결할 수 없습니다. 구체적인 이름 또는 문맥 확인을 선택하세요.');
    if (decision.policy === 'context') {
        if (decision.role === 'identity') fail('문맥 확인 표현 자체를 고유 이름으로 사용할 수 없습니다.');
        if (!rows.some(other => other.kind === row.kind && other.id === row.id && other.lang === row.lang && other.text !== row.text && other.policy === 'auto'
            && (other.role === 'identity' || (other.role === 'legacy' && other.text === other.label)))) fail('먼저 이 항목의 구체적인 이름을 자동 연결로 승인하세요.');
    }
}
module.exports = { expressionSource, catalogue, personNameRows, validateDecision, builders };
