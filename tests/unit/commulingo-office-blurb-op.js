const assert = require('node:assert/strict');
const txPath = require.resolve('../../data/commulingo/admin-tx');
const dbTxPath = require.resolve('../../utils/db-transaction');
const writes = [];
const client = { query: async (sql, params) => {
    if (/^SELECT/.test(sql)) return { rows: [{ blurb_ko: '가', blurb_en: 'a', tracks: [{ id: 'one', title: { ko: '하나', en: 'One' }, blurb: { ko: '옛', en: 'old' } }, { id: 'two' }] }] };
    writes.push({ sql, params });
    return { rowCount: 1, rows: [] };
} };
require.cache[txPath] = { id: txPath, filename: txPath, loaded: true, exports: { writeRevision: async () => {} } };
require.cache[dbTxPath] = { id: dbTxPath, filename: dbTxPath, loaded: true, exports: { transaction: fn => fn(client) } };
const { applyRegistryEdits } = require('../../data/commulingo/registry-edits');
(async () => {
    const blurb = { ko: '새', en: 'new' };
    const run = op => applyRegistryEdits([{ op: 'office_blurb_set', officeId: 'x', blurb, ...op }], { actor: 'test' });
    assert.equal((await run({ trackId: 'one' })).changed, 1);
    assert.deepEqual(JSON.parse(writes.pop().params[1]), [{ id: 'one', title: { ko: '하나', en: 'One' }, blurb }, { id: 'two' }]);
    await run({});
    assert.deepEqual(writes.pop().params, ['x', '새', 'new']);
    await assert.rejects(run({ trackId: 'none' }), /track not found/);
    console.log('office blurb op ok');
})();
