#!/usr/bin/env node
// Edge purge (data/commulingo/edge-purge.js): which public URLs an edited row
// maps to, that a row is purged only once it is old enough for the stores to
// serve it (or at once after a stores_refresh), and only once per edit. The
// database and Cloudflare are stubbed.
const assert = require('node:assert/strict');
const path = require('node:path');

const dbPath = require.resolve(path.join(__dirname, '../../config/database'));
let rows = {};
require.cache[dbPath] = {
    id: dbPath, filename: dbPath, loaded: true,
    exports: {
        query: async (sql, [windowMs, floorMs]) => {
            const table = /FROM (\w+)/.exec(sql)[1];
            const floor = Number(floorMs);
            return { rows: (rows[table] || []).map(r => ({ key: r.key, updated_at: r.at, settled: Date.now() - r.at.getTime() >= floor })) };
        },
    },
};

const calls = [];
global.fetch = async (url, init = {}) => {
    calls.push({ url, body: init.body ? JSON.parse(init.body) : null });
    const result = url.includes('/zones?') ? [{ id: 'zone1' }] : {};
    return { ok: true, status: 200, json: async () => ({ success: true, result }) };
};
process.env.CF_CACHE_PURGE_TOKEN = 'test';
delete process.env.CF_ZONE_ID;

const { urlsFor, dataDocumentPaths, purgeChanged } = require('../../data/commulingo/edge-purge');

assert.deepEqual(urlsFor('commulingo_terms', 'rapp'), [
    'https://cyber-lenin.com/commulingo/terms/rapp',
    'https://cyber-lenin.com/en/commulingo/terms/rapp',
]);
assert.deepEqual(urlsFor('commulingo_person_sections', 'gyorgy-lukacs').length, 2);
assert.deepEqual(dataDocumentPaths('course/marxist-aesthetics-intro'), ['/book/marxist-aesthetics-intro', '/learn']);
assert.deepEqual(dataDocumentPaths('genealogy/russian-marxism'), ['/genealogy/russian-marxism', '/genealogy']);
assert.deepEqual(dataDocumentPaths('activity-catalog'), []);
assert.deepEqual(dataDocumentPaths('indicator/kr-base-rate'), []);
assert.deepEqual(urlsFor('commulingo_unknown', 'x'), []);

(async () => {
    const old = new Date(Date.now() - 5 * 60 * 1000);
    const fresh = new Date(Date.now() - 10 * 1000);
    rows = { commulingo_terms: [{ key: 'rapp', at: old }, { key: 'pereval', at: fresh }] };

    // The timer path waits until the stores have reloaded: only the old row.
    assert.equal(await purgeChanged(), 2);
    const purge = calls.filter(c => c.url.endsWith('/purge_cache'));
    assert.equal(purge.length, 1);
    assert.deepEqual(purge[0].body.files, [
        'https://cyber-lenin.com/commulingo/terms/rapp',
        'https://cyber-lenin.com/en/commulingo/terms/rapp',
    ]);

    // After a stores_refresh every pending row goes, and nothing twice.
    assert.equal(await purgeChanged({ ageFloorMs: 0 }), 2);
    assert.match(calls[calls.length - 1].body.files[0], /terms\/pereval$/);
    assert.equal(await purgeChanged({ ageFloorMs: 0 }), 0);

    // A later edit of the same entry is purged again.
    rows.commulingo_terms[0].at = new Date(Date.now() - 4 * 60 * 1000);
    assert.equal(await purgeChanged({ ageFloorMs: 0 }), 2);

    // More than 30 URLs go in several requests.
    calls.length = 0;
    rows = { commulingo_terms: Array.from({ length: 20 }, (_, i) => ({ key: `t${i}`, at: old })) };
    assert.equal(await purgeChanged(), 40);
    assert.deepEqual(calls.filter(c => c.url.endsWith('/purge_cache')).map(c => c.body.files.length), [30, 10]);
    console.log('ok commulingo-edge-purge');
})().catch(err => { console.error(err); process.exit(1); });
