#!/usr/bin/env node
// The synthetic documents a checkout without snapshot or database serves
// (tests/fixtures/commulingo-docs-seed.json, docs-store.js loadSeed): they meet
// every save-time rule, and the reader's pieces — contents, numbering of
// notes, pagination, excerpts, redirects, the published original, in-document
// search — work on them. On a server the real snapshot is served instead and
// this test skips.
const assert = require('node:assert/strict');
const store = require('../../data/commulingo/docs-store');
const { checkStructure, storedEntry } = require('../../data/commulingo/docs-db');
const { freezeHeadingIds } = require('../../data/commulingo/doc-structure');
const { sanitizeDocHtml } = require('../../data/commulingo/doc-sanitize');
const { searchDocContent } = require('../../data/commulingo/doc-search');
const { presentedDocList, nestToc } = require('../../data/commulingo/doc-presentation');
const { docKindId } = require('../../data/commulingo/doc-kinds');

const docs = store.listCommuLingoDocs();
if (!store.getCommuLingoDoc('seed-land-decree-1917')) {
    console.log(`skip doc seed: this checkout serves ${docs.length} stored documents, not the seed`);
    process.exit(0);
}
assert.equal(docs.length, 4);
assert.deepEqual(docs.map(doc => doc.id), ['seed-theses-1845', 'seed-collection-1871', 'seed-land-decree-1917', 'seed-long-treatise'], 'ordered by date');

// Every seed body and entry passes the save-time check with no error, is
// stable under the sanitizer and already carries its heading ids.
for (const doc of docs) {
    const { html } = store.getCommuLingoDocContent(doc);
    const report = checkStructure(doc.id, doc.id, { body: html, entry: storedEntry(doc), role: 'translation' });
    assert.deepEqual(report.errors, [], doc.id);
    assert.equal(sanitizeDocHtml(html), html, `${doc.id}: sanitizer`);
    assert.equal(freezeHeadingIds(html), html, `${doc.id}: ids frozen`);
    assert.notEqual(docKindId(doc.kind), 'other', `${doc.id}: kind in the table`);
}

// Footnotes are numbered by the reference that calls them; a note called
// twice keeps one label.
{
    const { html, toc } = store.getCommuLingoDocContent(store.getCommuLingoDoc('seed-land-decree-1917'));
    assert.match(html, /<li id="note-1" data-note="1">/);
    assert.match(html, /<li id="note-2" data-note="2">/);
    assert.deepEqual(toc.map(item => item.id), ['art-1', 'art-2', 'art-3', 'notes-heading'], 'the notes heading is a contents line too');
    assert.equal(nestToc(toc)[0].chapters.length, 4);
}

// The long treatise pages: parts and chapters in the contents, a note called
// on an early page reached on the last, the search finding its one word.
{
    const doc = store.getCommuLingoDoc('seed-long-treatise');
    const content = store.getCommuLingoDocContent(doc);
    const { paged, toc } = content;
    assert.ok(paged && paged.pages.length >= 2, 'paged');
    assert.equal(paged.titleHtml, '<article>\n<h1>긴 시험 논설</h1>');
    assert.equal(toc.filter(item => item.level === 1).length, 3);
    assert.equal(toc.filter(item => item.level === 2).length, 10, 'nine chapters and the notes heading');
    assert.ok(toc.some(item => item.id === 'sec-1'), 'frozen chapter ids');
    const last = paged.pages.length;
    assert.equal(paged.idToPage['note-5'], last);
    assert.equal(paged.idToPage['ref-1'], 1);
    assert.match(paged.pages[0].html, new RegExp(`href="\\?p=${last}#note-1"`), 'a reference reaches the notes page');
    assert.match(paged.pages[last - 1].html, /href="\?p=1#ref-1"/, 'and the back link returns');
    const contents = store.getCommuLingoDocContents(doc);
    assert.ok(contents.some(line => line.href.includes('?p=')), 'contents lines name their page');
    const found = searchDocContent(content, '붉은별');
    assert.equal(found.total, 1);
    assert.equal(found.hits[0].section, '제5장 시험 장');
    assert.ok(found.hits[0].page >= 1 && found.hits[0].page <= last);
}

// A collection lends its pieces: the editor's boxes stay behind, the notes a
// piece calls come along, a link into another piece goes to the reader, and
// an old id redirects into the collection.
{
    const doc = store.getCommuLingoDoc('seed-collection-1871');
    const manifesto = store.getCommuLingoDocSection(doc, 'piece-manifesto');
    assert.equal(manifesto.title, '시험 선언 (1871)');
    assert.ok(!manifesto.html.includes('doc-editorial'));
    assert.equal((manifesto.html.match(/<li id="piece-manifesto--note-/g) || []).length, 2);
    assert.ok(!manifesto.html.includes('piece-letter--note'), 'only its own notes');
    assert.match(manifesto.html, /<h3 id="piece-manifesto-sec-1">/, 'headings sit under the page h2');
    const letter = store.getCommuLingoDocSection(doc, 'piece-letter');
    assert.match(letter.html, /href="\/commulingo\/docs\/seed-collection-1871#piece-manifesto-sec-2"/);
    assert.equal(store.getCommuLingoDocSection(doc, 'no-such'), null);
    const excerpts = store.listCommuLingoDocExcerptsFor('events', 'seed-event-1871');
    assert.deepEqual(excerpts.map(excerpt => excerpt.anchor), ['piece-manifesto', 'piece-letter']);
    assert.deepEqual(store.listCommuLingoDocExcerptsFor('terms', 'seed-manifesto').map(excerpt => excerpt.lead), [true]);
    const redirect = store.getCommuLingoDocRedirect('seed-letter-1871');
    assert.equal(redirect.doc.id, 'seed-collection-1871');
    assert.equal(redirect.anchor, 'piece-letter');
}

// The published original: read like the translation, same section ids for
// the version switch, only the ids an editor chose.
{
    const doc = store.getCommuLingoDoc('seed-theses-1845');
    assert.equal(doc.original.lang, 'de');
    const original = store.getCommuLingoDocOriginalContent(doc);
    assert.match(original.html, /<h1>Drei Probethesen<\/h1>/);
    assert.deepEqual(store.getCommuLingoDocAnchorPages(original), { 'thesis-1': 1, 'thesis-2': 1, 'thesis-3': 1 });
    assert.deepEqual(store.getCommuLingoDocAnchorPages(store.getCommuLingoDocContent(doc)), { 'thesis-1': 1, 'thesis-2': 1, 'thesis-3': 1 });
    assert.equal(store.getCommuLingoDocOriginalContent(store.getCommuLingoDoc('seed-land-decree-1917')), null);
}

// The list: cards carry the summary, the kind chips come from the table.
{
    const presented = presentedDocList(docs, 'ko', () => ({ people: [], terms: [], events: [] }));
    assert.equal(presented.docs.length, 4);
    assert.ok(presented.docs.every(doc => doc.summary));
    assert.deepEqual(presented.facets.map(facet => facet.id).sort(), ['constitutions-laws-orders', 'party-government-documents', 'theory-essays']);
    assert.equal(presented.facets.find(facet => facet.id === 'theory-essays').count, 2);
}
console.log('doc seed: four synthetic documents pass the save rules; contents, notes, pages, excerpts, redirect, original, search, list');
