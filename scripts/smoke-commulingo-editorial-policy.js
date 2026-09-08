const assert = require('node:assert/strict');
const { validateEditorial, reviewReasons, recordEvidence } = require('../data/commulingo/person-editorial-policy');
const sources = ['Archive, volume 1'];
const evidence = [{ field: 'bio', claim: 'Documented event', source: sources[0], locator: 'p. 15' }];
validateEditorial({ bio: { ko: '확인한 사실' }, sources, evidence });
assert.throws(() => validateEditorial({ bio: { ko: '주장' }, sources }), /evidence/);
assert.throws(() => validateEditorial({ sources: [] }), /sources/);
assert.throws(() => validateEditorial({ role: null, sources }), /role/);
assert.throws(() => validateEditorial({ fate: { label: { ko: '가'.repeat(23) } }, sources }), /22/);
assert.throws(() => validateEditorial({ bio: { en: 'x'.repeat(901) }, sources, evidence }), /900/);
assert.throws(() => validateEditorial({ sources, evidence: [{ ...evidence[0], locator: '' }] }), /locator/);
assert.deepEqual(reviewReasons('person', 'update', { bio: { ko: '축약' } }, { bio: { ko: '가'.repeat(120) } }), ['large_deletion']);
assert.deepEqual(reviewReasons('person', 'update', { evidence: [{ ...evidence[0], stance: 'disputes' }] }, {}), ['source_conflict']);
(async () => {
    const queries = [];
    await recordEvidence({ query: async (sql, params) => { queries.push({ sql, params }); } }, 'test', '', { evidence }, {}, 'revision');
    assert(queries[0].params[1].includes('bio'), 'new evidence alone reopens its topic');
    console.log('editorial contract: required provenance, shared limits, review gates and new evidence reopening OK');
})().catch(error => { console.error(error); process.exitCode = 1; });
