const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Exercise merged URLs without changing the host-mounted production manifest.
const modulePath = path.resolve(__dirname, '../data/commulingo/docs-store.js');
const manifest = {
    docs: [{ id: 'collection', file: 'collection.html', date: '1791' }],
    redirects: {
        retired: { id: 'collection', anchor: 'second-text' },
        missing: { id: 'absent', anchor: 'second-text' },
        unsafe: { id: '../collection', anchor: 'second-text' },
        fragment: { id: 'collection', anchor: 'bad#fragment' },
        collection: { id: 'absent', anchor: 'second-text' },
    },
};
const html = '<article><h1>Collection</h1><h1 id="first-text">First text</h1><p>'
    + 'body '.repeat(21000) + '</p><h1 id="second-text">Second text</h1><p>End.</p></article>';
const sandbox = {
    module: { exports: {} }, __dirname: path.dirname(modulePath), console,
    require: name => name === 'fs' ? {
        statSync: () => ({ mtimeMs: 1700000000000 }),
        readFileSync: file => file.endsWith('manifest.json') ? JSON.stringify(manifest) : html,
    } : require(name),
};
vm.runInNewContext(fs.readFileSync(modulePath, 'utf8'), sandbox);
const store = sandbox.module.exports;
assert.equal(store.listCommuLingoDocs().length, 1);
assert.equal(store.getCommuLingoDoc('retired'), null);
const target = store.getCommuLingoDocRedirect('retired');
assert.equal(target.doc.id, 'collection');
assert.equal(store.getCommuLingoDocContent(target.doc).paged.idToPage[target.anchor], 2);
for (const id of ['missing', 'unsafe', 'fragment', 'collection', 'unknown', '__proto__']) {
    assert.equal(store.getCommuLingoDocRedirect(id), null, id);
}
console.log('Merged document lookup preserves live entries, rejects invalid targets and resolves the destination page.');
