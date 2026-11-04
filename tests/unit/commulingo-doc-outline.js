#!/usr/bin/env node
// The stored outline of a document (data/commulingo/doc-outline.js) serves
// the reader exactly what parsing the body did: contents, generated ids,
// pages (and their links), the version switch's anchors, the note blocks and
// every excerpt. Checked on the seed documents, outline path against parsing
// path, plus the cases the outline must refuse or be refused for.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const store = require('../../data/commulingo/docs-store');
const { buildOutline, outlineFits, withoutRanges, OUTLINE_VERSION } = require('../../data/commulingo/doc-outline');

const docs = store.listCommuLingoDocs();
if (!store.getCommuLingoDoc('seed-land-decree-1917')) {
    console.log(`skip doc outline: this checkout serves ${docs.length} stored documents, not the seed`);
    process.exit(0);
}
const sha = text => crypto.createHash('sha256').update(text, 'utf8').digest('hex');
const pagesOf = content => content.paged && { idToPage: content.paged.idToPage, titleHtml: content.paged.titleHtml,
    pages: content.paged.pages.map(page => ({ html: page.html, heading: page.heading, continued: page.continued, notes: page.notes })) };

let compared = 0;
for (const doc of docs) {
    for (const variant of [{ label: doc.id, item: doc }, doc.original && { label: `${doc.id} (original)`, item: { id: doc.id, bodySha256: doc.original.bodySha256, tocExclude: doc.tocExclude, outline: doc.original.outline } }].filter(Boolean)) {
        const { label, item } = variant;
        const raw = variant.label.endsWith('(original)') ? store.getCommuLingoDocOriginalContent(doc).html : store.getCommuLingoDocContent(doc).html;
        // The served html is the stored body labelled; both paths start from the stored body.
        const stored = require('fs').readFileSync(require('path').join(__dirname, '../fixtures/commulingo-docs-seed.json'), 'utf8');
        const body = JSON.parse(stored).find(row => (row.kind === 'doc' && row.id === item.id && !label.endsWith('(original)')) || (row.kind === 'original' && row.doc_id === item.id && label.endsWith('(original)'))).body;
        assert.equal(sha(body), item.bodySha256, `${label}: seed body`);
        assert.ok(outlineFits(item.outline, item.bodySha256), `${label}: the seed carries a fitting outline`);
        const withOutline = store.buildContent(body, item);
        const parsed = store.buildContent(body, { ...item, outline: null });
        assert.ok(withOutline.outline && !parsed.outline, label);
        assert.equal(withOutline.html, parsed.html, `${label}: served html`);
        assert.equal(withOutline.html, raw, `${label}: the store serves the same`);
        assert.deepEqual(withOutline.toc, parsed.toc, `${label}: contents`);
        // The parsing path numbers h1/h2 only; the outline lists every frozen id (h3 too). Both leave the same anchors out.
        assert.deepEqual([...withOutline.generated].filter(id => !id.startsWith('sub-')).sort(), [...parsed.generated].sort(), `${label}: generated ids`);
        assert.deepEqual(pagesOf(withOutline), pagesOf(parsed), `${label}: pages`);
        assert.deepEqual(store.getCommuLingoDocAnchorPages(withOutline), store.getCommuLingoDocAnchorPages(parsed), `${label}: anchor pages`);
        assert.deepEqual([...store.noteBlocks(withOutline)], [...store.noteBlocks(parsed)], `${label}: note blocks`);
        // Every heading an excerpt could name: the notes block's own heading is
        // not one (the two paths differ only there, the outline cutting the
        // block the heading sits in, which is the right reading of it).
        const inCut = h => withOutline.outline.cut.some(([start, end]) => h.start >= start && h.end <= end);
        const anchors = ['*', ...withOutline.outline.headings.filter(h => h.id && !inCut(h)).map(h => h.id), 'no-such'];
        for (const anchor of anchors) {
            assert.deepEqual(store.sectionFrom(withOutline, item.id, anchor), store.sectionFrom(parsed, item.id, anchor), `${label}: section ${anchor}`);
        }
        compared += 1;
    }
}
assert.equal(compared, 5, 'four documents and one original');

// The outline names what it describes: another body, or older rules, and the
// reader parses instead.
{
    const doc = store.getCommuLingoDoc('seed-long-treatise');
    assert.ok(outlineFits(doc.outline, doc.bodySha256));
    assert.ok(!outlineFits(doc.outline, 'f'.repeat(64)));
    assert.ok(!outlineFits({ ...doc.outline, version: OUTLINE_VERSION + 1 }, doc.bodySha256));
    assert.ok(!outlineFits(null, doc.bodySha256));
    assert.equal(doc.outline.version, OUTLINE_VERSION);
    assert.equal(doc.outline.pages.pages.length, 3);
    assert.ok(doc.outline.notes['note-5'], 'notes by id');
    assert.deepEqual(Object.keys(doc.outline.anchorPages), ['part-1', 'part-2', 'part-3', 'notes-heading'], 'editor-chosen ids only');
    assert.ok(doc.outline.cut.length === 2 && doc.outline.editorials.length === 1, 'the editor\'s box and the notes block');
}

// A body with an unaddressed h2 (stored before ids were frozen) gets no
// outline: the reader numbers those headings on the fly.
assert.equal(buildOutline('<article><h1>T</h1><h2>가</h2><p>x</p></article>'), null);
assert.ok(buildOutline('<article><h1>T</h1><h2 id="a">가</h2><p>x</p></article>'));

// Ranges are clipped to the slice and never overlap.
assert.equal(withoutRanges('abcdefghij', [[2, 4], [6, 8]]), 'abefij');
assert.equal(withoutRanges('abcdefghij', [[2, 4], [6, 8]], 3, 7), 'ef');
assert.equal(withoutRanges('abcdefghij', [[0, 20]], 3, 7), '');
console.log(`doc outline: ${compared} bodies serve the same through the outline as through parsing; stale outlines refused`);
