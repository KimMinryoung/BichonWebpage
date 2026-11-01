#!/usr/bin/env node
// The data-document store pulls incrementally: after a write it reads the
// key/revision list and fetches content only for new or changed rows, so a
// change to one small document does not re-read the courses (~10 MB).
// The database is stubbed; nothing touches Postgres.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'commulingo-dd-'));
process.env.COMMULINGO_DATA_DOCUMENTS_SNAPSHOT = path.join(dir, 'snapshot.json');
process.env.COMMULINGO_ACTIVITY_CATALOG_FILE = '';
process.env.COMMULINGO_DATA_DOCUMENTS_REFRESH_MS = '0';

const table = new Map([
    ['activity-catalog', { revision: 1, content: { version: 1, functions: [{ id: 'f' }], affiliations: [{ id: 'a' }] } }],
    ['course/big', { revision: 1, content: { id: 'big', chapters: [] } }],
]);
let writes = 0;
const contentFetches = [];
const dbPath = require.resolve('../config/database');
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: {
    query: async (sql, params) => {
        if (/pg_stat_user_tables/.test(sql)) return { rows: [{ writes: String(writes), tables: 1 }] };
        if (/SELECT key, revision FROM/.test(sql)) {
            return { rows: [...table.keys()].sort().map(key => ({ key, revision: table.get(key).revision })) };
        }
        if (/WHERE key = ANY/.test(sql)) {
            contentFetches.push([...params[0]].sort());
            return { rows: params[0].filter(key => table.has(key)).map(key => ({ key, ...table.get(key), updated_at: '2026-11-01T00:00:00Z' })) };
        }
        throw new Error('unexpected query ' + sql);
    },
} };

(async () => {
    const dd = require('../data/commulingo/data-documents');
    await dd.refreshDataDocuments();
    assert.deepEqual(contentFetches.pop(), ['activity-catalog', 'course/big'], 'first pull reads everything');

    // One small document changes: only it is fetched.
    table.get('activity-catalog').revision = 2;
    table.get('activity-catalog').content = { ...table.get('activity-catalog').content, version: 2 };
    writes += 1;
    await dd.refreshDataDocuments();
    assert.deepEqual(contentFetches.pop(), ['activity-catalog']);
    assert.equal(dd.getDataDocument('activity-catalog').version, 2);
    assert.equal(dd.getDataDocument('course/big').id, 'big');

    // A deleted document disappears without a content fetch.
    table.delete('course/big');
    writes += 1;
    await dd.refreshDataDocuments();
    assert.equal(contentFetches.length, 0);
    assert.equal(dd.getDataDocument('course/big'), null);

    fs.rmSync(dir, { recursive: true, force: true });
    console.log('Data documents: incremental pull fetches only new or changed rows');
    process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });
