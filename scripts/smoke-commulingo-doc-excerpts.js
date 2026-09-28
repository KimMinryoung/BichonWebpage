#!/usr/bin/env node
// Entry pages print pieces of reference documents named by the manifest's
// `excerpts` (docs-store.js). Every declared piece must resolve to a heading,
// and a cut piece must stand on its own: its title and editor's note leave the body, headings
// sit under the page's h2, the notes it calls come along, and a fragment link
// to the rest of the document goes to the reader.
//   node scripts/smoke-commulingo-doc-excerpts.js
const assert = require('assert');
const {
    listCommuLingoDocs, getCommuLingoDoc, getCommuLingoDocSection,
} = require('../data/commulingo/docs-store');

let count = 0;
listCommuLingoDocs().forEach(doc => {
    Object.entries(doc.excerpts || {}).forEach(([kind, byId]) => {
        assert.ok(['people', 'terms', 'events'].includes(kind), `${doc.id}: excerpt kind ${kind}`);
        Object.entries(byId).forEach(([id, anchor]) => {
            const section = getCommuLingoDocSection(doc, anchor);
            assert.ok(section && section.html, `${doc.id}: excerpt for ${kind}/${id} has no heading "${anchor}"`);
            count += 1;
        });
    });
});
assert.ok(count > 0, 'no excerpts declared');

const doc = getCommuLingoDoc('france-rights-and-emancipation-1789-1794');
const declaration = getCommuLingoDocSection(doc, 'france-rights-declaration-1789');
assert.strictEqual(declaration.title, '인간과 시민의 권리 선언 (1789)');
assert.ok(!/<h[12]\b/.test(declaration.html), 'headings drop below the page h2');
assert.ok(declaration.html.includes('제17조'), 'runs to the last article');
assert.ok(!declaration.html.includes('doc-editorial'), 'the editor\'s note stays in the reader');
assert.ok(!declaration.html.includes('구주'), 'stops at the next piece');

const gouges = getCommuLingoDocSection(doc, 'gouges-rights-of-woman-1791');
const refs = gouges.html.match(/class="note-ref"/g) || [];
const notes = gouges.html.match(/<li[^>]*id="gouges-rights-of-woman-1791--note-/g) || [];
assert.ok(refs.length > 0 && notes.length === refs.length, 'the notes a piece calls come with it');

assert.strictEqual(getCommuLingoDocSection(doc, 'no-such-heading'), null);
console.log(`ok doc excerpts (${count} declared)`);
