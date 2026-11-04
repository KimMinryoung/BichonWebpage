const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Exercise merged URLs against a throwaway snapshot and body cache, not the
// production documents (docs-store reads both paths from the environment).
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-redirects-'));
const html = '<article><h1>Collection</h1><h1 id="first-text">First text</h1><p>'
    + 'body '.repeat(21000) + '</p><h1 id="second-text">Second text</h1><p>'
    + 'more '.repeat(4000) + '</p></article>';
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

const store = require('../../data/commulingo/docs-store');
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
    // A notes list prints the number of the reference that calls each note.
    const labelled = store.labelNotes('<p><a class="note-ref" id="ref-26" href="#note-26">[26]</a>'
        + '<a class="note-ref" id="ref-27a" href="#note-27a">[27a]</a><a href="#note-9">[9]</a>'
        + '<a class="note-ref" href="#note-t1">(1)</a><a class="note-ref" href="#note-k-t2">[옮긴이 2]</a></p>'
        + '<ol class="notes-list"><li id="note-26">a</li><li id="note-27a">b</li>'
        + '<li id="note-d0-3">c</li><li id="note-9">d</li><li id="x">e</li>'
        + '<li id="note-t1">g</li><li id="note-k-t2">h</li></ol><ul><li id="note-5">f</li></ul>');
    assert.match(labelled, /<li id="note-t1" data-note="1">/);
    assert.match(labelled, /<li id="note-k-t2" data-note="옮긴이 2">/);
    assert.match(labelled, /<li id="note-26" data-note="26">/);
    assert.match(labelled, /<li id="note-27a" data-note="27a">/);
    assert.match(labelled, /<li id="note-d0-3" data-note="3">/, 'falls back on the id');
    assert.match(labelled, /<li id="note-9" data-note="9">/, 'a plain link is not a note reference');
    assert.match(labelled, /<li id="x">/);
    assert.match(labelled, /<ul><li id="note-5">/, 'other lists keep their markup');
} finally {
    fs.rmSync(dir, { recursive: true, force: true });
}
console.log('Merged document lookup preserves live entries, rejects invalid targets and resolves the destination page.');
process.exit(0);
