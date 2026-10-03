// Carry link reviews across a headword or title rename of the same entry.
//
// A review's source_signature includes the entry's name in that language, so
// any rename returns every expression of the entry to search-only until it is
// re-reviewed (link-review-policy.signature). That is right when an entry is
// narrowed or repurposed, and only noise when the name was respelled. For the
// second case the editor says so explicitly, and this re-signs exactly the
// reviews that were valid under the old name; the old name's own review is
// copied to the new name, which inherits its identity role. Everything else
// (reviews already stale before the rename) stays as it was.
const { key, signature } = require('./link-review-policy');
const builders = {
    term: require('./term-linkify'), event: require('./event-linkify'), doc: require('./doc-linkify'),
};
const NAME_FIELD = { term: 'term', event: 'title', doc: 'title' };

// record: the entry AFTER the rename, in the shape the catalogue reads.
// renames: { ko: 'old name', en: 'old name' } for the languages that changed.
async function carryLinkReviews(client, kind, record, renames, actor) {
    const field = NAME_FIELD[kind];
    if (!field || !record?.id) throw new Error('carryLinkReviews: unknown entry');
    const carried = [];
    for (const [lang, oldName] of Object.entries(renames || {})) {
        if (!['ko', 'en'].includes(lang) || typeof oldName !== 'string' || !oldName) continue;
        const before = { ...record, [field]: { ...record[field], [lang]: oldName } };
        const newName = (record[field] || {})[lang];
        if (!newName || newName === oldName) continue;
        const reviews = new Map((await client.query(
            'SELECT * FROM commulingo_link_reviews WHERE kind=$1 AND entity_id=$2 AND lang=$3', [kind, record.id, lang]
        )).rows.map(row => [key(kind, record.id, lang, row.expression), row]));
        const oldExpressions = new Map(builders[kind].sourceExpressions(before, lang).map(e => [e.text, e]));
        const valid = text => {
            const review = reviews.get(key(kind, record.id, lang, text));
            const expression = oldExpressions.get(text);
            return review && expression && review.source_signature === signature(before, expression) ? review : null;
        };
        for (const expression of builders[kind].sourceExpressions(record, lang)) {
            const next = signature(record, expression);
            const current = reviews.get(key(kind, record.id, lang, expression.text));
            if (current?.source_signature === next) continue;
            const from = valid(expression.text) || (expression.text === newName ? valid(oldName) : null);
            if (!from) continue;
            const value = { kind, entity_id: record.id, lang, expression: expression.text, source_signature: next,
                role: from.role, policy: from.policy,
                note: `${from.note || ''}\n[${oldName} → ${newName} 표기 수정으로 이어받음]`.trim(), reviewed_by: actor };
            await client.query(`INSERT INTO commulingo_link_reviews (kind,entity_id,lang,expression,source_signature,role,policy,note,reviewed_by)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (kind,entity_id,lang,expression) DO UPDATE
                SET source_signature=EXCLUDED.source_signature,role=EXCLUDED.role,policy=EXCLUDED.policy,note=EXCLUDED.note,reviewed_by=EXCLUDED.reviewed_by,updated_at=NOW()`,
                [value.kind, value.entity_id, value.lang, value.expression, value.source_signature, value.role, value.policy, value.note, value.reviewed_by]);
            await client.query('INSERT INTO commulingo_link_review_history (kind,entity_id,lang,expression,before_value,after_value) VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb)',
                [kind, record.id, lang, expression.text, JSON.stringify(current || null), JSON.stringify({ ...value, carriedFrom: from.expression })]);
            carried.push({ lang, expression: expression.text, from: from.expression, policy: value.policy });
        }
    }
    return carried;
}

module.exports = { carryLinkReviews };
