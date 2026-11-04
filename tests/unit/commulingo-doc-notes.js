#!/usr/bin/env node
// Footnote plumbing in docs-store.js: labelNotes stamps the DPUB-ARIA roles
// beside the note labels, noteBlocks cuts each note by the parser (a note
// holding its own list stays one note), and pageNotes gathers for a page the
// notes it calls from other pages, in call order, and nothing it holds itself.
const assert = require('node:assert/strict');
const { labelNotes, noteBlocks, pageNotes } = require('../../data/commulingo/docs-store');

const html = labelNotes(`<article>
<h1>T</h1>
<p>a<a class="note-ref" id="ref-2" href="#note-2">[2]</a> b<a href="#note-1" class="note-ref" id="ref-1">(1)</a>
 c<a class="note-ref" id="ref-2-2" href="#note-2">[2]</a> d<a class="note-ref" id="ref-x" href="#nowhere">[x]</a></p>
<section class="notes" aria-labelledby="notes-heading"><h2 id="notes-heading">주석</h2>
<ol class="notes-list">
<li id="note-1"><span class="note-text">첫째<ul><li>안쪽 목록</li></ul></span> <a class="back-link" href="#ref-1">↩</a></li>
<li id="note-2" role="listitem"><span class="note-text">둘째.</span> <a class="back-link" href="#ref-2">↩</a></li>
</ol></section>
<ul><li id="not-a-note">본문 목록</li></ul>
</article>`);

// Roles, labels, and a role already written is kept.
assert.match(html, /<a role="doc-noteref" class="note-ref" id="ref-2" href="#note-2">/);
assert.match(html, /<a role="doc-noteref" href="#note-1" class="note-ref" id="ref-1">/);
assert.match(html, /<section role="doc-endnotes" class="notes"/);
assert.match(html, /<li id="note-1" data-note="1">/);
assert.match(html, /<li id="note-2" data-note="2" role="listitem">/);
assert.equal((html.match(/role="doc-backlink"/g) || []).length, 2);

// Parser-cut note blocks: the nested list stays inside note 1; the body's own
// list item is no note.
const content = { html };
const blocks = noteBlocks(content);
assert.deepEqual([...blocks.keys()], ['note-1', 'note-2']);
assert.match(blocks.get('note-1'), /안쪽 목록<\/li><\/ul><\/span> <a role="doc-backlink"[^>]*>↩<\/a><\/li>$/);
assert.equal(noteBlocks(content), blocks, 'cached on the content entry');

// Per-page notes: references rewritten to another page bring their note, in
// call order, once; a reference to this page or to nothing brings none.
const pageHtml = html.replace('href="#note-2"', 'href="?p=3#note-2"').replace('href="#note-1"', 'href="?p=3#note-1"')
    .replace('id="ref-2-2" href="#note-2"', 'id="ref-2-2" href="?p=3#note-2"');
const notes = pageNotes(content, { html: pageHtml }, 0);
assert.deepEqual([...notes.matchAll(/<li id="([^"]+)"/g)].map(m => m[1]), ['note-2', 'note-1']);
assert.equal(pageNotes(content, { html: pageHtml }, 2), '', 'the page that holds the notes brings none');
assert.equal(pageNotes(content, { html: '<p>no refs</p>' }, 0), '');
console.log('doc notes: roles, parser-cut note blocks, per-page notes');
