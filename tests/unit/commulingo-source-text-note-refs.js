#!/usr/bin/env node
// normalizeSiteDoc drops note markers from a document body however the anchor
// is written: the stored body has <a class="note-ref" …>, the served one (the
// text the course write gate reads) has role="doc-noteref" stamped before the
// class by doc-outline.js labelNotes. A passage that runs across a note marker
// must be verbatim in both.
const assert = require('node:assert/strict');
const text = require('../../scripts/lib/commulingo-source-text');

const stored = '<p>메테르니히<a class="note-ref" id="ref-t1" href="#note-t1">(1)</a>와 기조<a id="ref-t2" class="note-ref extra" href="#note-t2">(2)</a>가</p>';
const quote = '메테르니히와 기조가';
assert(text.containsQuote(text.normalizeSiteDoc(stored), quote));
assert(text.containsQuote(text.normalizeSiteDoc('<p>메테르니히<a role="doc-noteref" class="note-ref" href="#n">(1)</a>와 기조가</p>'), quote));
console.log('ok');
