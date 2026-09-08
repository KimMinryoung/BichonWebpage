const { KINDS, key, normalize, signature, risks } = require('./link-review-policy');
const builders = {
    term: require('./term-linkify'), event: require('./event-linkify'), doc: require('./doc-linkify'),
};
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
module.exports = { catalogue, validateDecision, builders };
