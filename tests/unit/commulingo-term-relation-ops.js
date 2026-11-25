const assert = require('node:assert/strict');
const txPath = require.resolve('../../data/commulingo/admin-tx');
const dbTxPath = require.resolve('../../utils/db-transaction');
const pairs = [['a', 'b']];
const revisions = [];
const has = (x, y) => pairs.findIndex(([p, q]) => (p === x && q === y) || (p === y && q === x));
const client = { query: async (sql, params) => {
    if (/^SELECT/.test(sql)) return { rowCount: params[0] === 'missing' ? 0 : 1, rows: [{}] };
    const at = has(...params);
    if (/^INSERT/.test(sql)) {
        if (at >= 0) return { rowCount: 0, rows: [] };
        pairs.push(params);
        return { rowCount: 1, rows: [] };
    }
    return { rows: at >= 0 ? pairs.splice(at, 1) : [] };
} };
require.cache[txPath] = { id: txPath, filename: txPath, loaded: true, exports: { writeRevision: async (...args) => { revisions.push(args.slice(1, 4)); } } };
require.cache[dbTxPath] = { id: dbTxPath, filename: dbTxPath, loaded: true, exports: { transaction: fn => fn(client) } };
const { applyRegistryEdits } = require('../../data/commulingo/registry-edits');
(async () => {
    const run = (op, termId, relatedId) => applyRegistryEdits([{ op, termId, relatedId }], { actor: 'test' });
    assert.equal((await run('term_relation_add', 'b', 'a')).changed, 0);
    assert.equal((await run('term_relation_add', 'b', 'c')).changed, 1);
    assert.equal((await run('term_relation_remove', 'c', 'b')).changed, 1);
    assert.equal((await run('term_relation_remove', 'c', 'b')).changed, 0);
    assert.equal(revisions.length, 2);
    await assert.rejects(run('term_relation_add', 'a', 'a'), /itself/);
    await assert.rejects(run('term_relation_add', 'a', 'missing'), /term not found/);
    console.log('term relation ops ok');
})();
