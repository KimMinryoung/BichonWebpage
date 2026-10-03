// A respelled headword keeps the link reviews that were valid under the old
// one; reviews that were already stale, and other languages, are left alone.
const assert = require('node:assert/strict');
const path = require('node:path');
const database = require.resolve(path.join(__dirname, '../config/database.js'));
require.cache[database] = { id: database, filename: database, loaded: true, exports: { query: async () => ({ rows: [] }) } };
const { signature } = require('../data/commulingo/link-review-policy');
const { sourceExpressions } = require('../data/commulingo/term-linkify');
const { carryLinkReviews } = require('../data/commulingo/link-review-carry');

const before = { id: 'abm-treaty', term: { ko: 'ABM 조약', en: 'ABM Treaty' },
    aliases: { ko: ['ABM 제한 조약', '반탄도'], en: ['ABMT'] }, linkExpressions: [] };
const after = { ...before, term: { ko: '탄도탄 요격미사일 조약', en: 'ABM Treaty' },
    aliases: { ko: ['ABM 조약', 'ABM 제한 조약', '반탄도'], en: ['ABMT'] } };
const expression = (record, lang, text) => sourceExpressions(record, lang).find(e => e.text === text);
const review = (record, lang, text, policy, signed = record) => ({ kind: 'term', entity_id: 'abm-treaty', lang, expression: text,
    source_signature: signature(signed, expression(record, lang, text)), role: 'identity', policy, note: 'reviewed', reviewed_by: 'owner' });
const rows = [
    review(before, 'ko', 'ABM 조약', 'auto'),
    review(before, 'ko', 'ABM 제한 조약', 'context'),
    { ...review(before, 'ko', '반탄도', 'auto'), source_signature: 'stale' },
    review(before, 'en', 'ABMT', 'auto'),
];
const writes = [];
const client = { async query(sql, params) {
    if (/^SELECT \* FROM commulingo_link_reviews/.test(sql)) return { rows: rows.filter(row => row.lang === params[2]) };
    writes.push({ sql, params });
    return { rows: [] };
} };

(async () => {
    const carried = await carryLinkReviews(client, 'term', after, { ko: 'ABM 조약' }, 'tester');
    assert.deepEqual(carried.map(c => [c.expression, c.from, c.policy]).sort(), [
        ['ABM 조약', 'ABM 조약', 'auto'],
        ['ABM 제한 조약', 'ABM 제한 조약', 'context'],
        ['탄도탄 요격미사일 조약', 'ABM 조약', 'auto'],
    ].sort(), 'valid reviews re-signed; the new headword inherits the old one; the stale one stays');
    const upserts = writes.filter(w => /INSERT INTO commulingo_link_reviews/.test(w.sql));
    for (const upsert of upserts) {
        assert.equal(upsert.params[4], signature(after, expression(after, 'ko', upsert.params[3])), 'signed for the renamed entry');
    }
    assert.equal(writes.filter(w => /link_review_history/.test(w.sql)).length, 3);
    assert.ok(!upserts.some(w => w.params[2] === 'en'), 'other languages untouched');
    writes.length = 0;
    assert.deepEqual(await carryLinkReviews(client, 'term', after, { ko: '탄도탄 요격미사일 조약' }, 'tester'), [], 'no rename, nothing carried');
    console.log('link review carry: valid reviews follow a respelled headword, stale ones do not');
})().catch(err => { console.error(err); process.exitCode = 1; });
