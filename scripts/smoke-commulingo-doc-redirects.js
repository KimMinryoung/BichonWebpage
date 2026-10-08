const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Exercise merged URLs against a throwaway snapshot and body cache, not the
// production documents (docs-store reads both paths from the environment).
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-redirects-'));
const html = '<article><h1>Collection</h1><h1 id="first-text">First text</h1><p>'
    + 'body '.repeat(21000) + '</p><h1 id="second-text">Second text</h1><p>End.</p></article>';
const sha = crypto.createHash('sha256').update(html).digest('hex');
fs.mkdirSync(path.join(dir, 'cache'));
fs.writeFileSync(path.join(dir, 'cache', `${sha}.html`), html);
const redirect = (from, to, anchor) => ({ kind: 'redirect', from_id: from, to_id: to, anchor });
fs.writeFileSync(path.join(dir, 'snapshot.json'), JSON.stringify([
    { kind: 'doc', id: 'collection', sort_order: 1, entry: { date: '1791' }, body_sha256: sha, body_updated_at: '2026-01-01T00:00:00Z', revision: 1 },
    redirect('retired', 'collection', 'second-text'),
    redirect('missing', 'absent', 'second-text'),
    redirect('unsafe', '../collection', 'second-text'),
    redirect('fragment', 'collection', 'bad#fragment'),
    redirect('collection', 'absent', 'second-text'),
]));
process.env.COMMULINGO_DOCS_SNAPSHOT = path.join(dir, 'snapshot.json');
process.env.COMMULINGO_DOCS_CACHE_DIR = path.join(dir, 'cache');
// No database here: the background refresh fails and the snapshot stays.
process.env.DB_HOST = '127.0.0.1';
process.env.DB_PORT = '9';

const store = require('../data/commulingo/docs-store');
try {
    assert.equal(store.listCommuLingoDocs().length, 1);
    assert.equal(store.getCommuLingoDoc('retired'), null);
    const target = store.getCommuLingoDocRedirect('retired');
    assert.equal(target.doc.id, 'collection');
    assert.equal(store.getCommuLingoDocContent(target.doc).paged.idToPage[target.anchor], 2);
    for (const id of ['missing', 'unsafe', 'fragment', 'collection', 'unknown', '__proto__']) {
        assert.equal(store.getCommuLingoDocRedirect(id), null, id);
    }
    assert.equal(store.getCommuLingoDoc('collection').modifiedAt, '2026-01-01T00:00:00.000Z');
} finally {
    fs.rmSync(dir, { recursive: true, force: true });
}
console.log('Merged document lookup preserves live entries, rejects invalid targets and resolves the destination page.');
process.exit(0);
