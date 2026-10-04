#!/usr/bin/env node
// Imported reference documents go through data/commulingo/doc-sanitize.js.
// Pinned here: event handlers, script URLs and active elements are removed,
// and every stored document keeps all of its elements and attributes (the
// allowlist output equals an allow-everything pass over the same parser).
//   node scripts/smoke-commulingo-doc-sanitize.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const { sanitizeDocHtml } = require('../data/commulingo/doc-sanitize');
const { extractFragment } = require('../data/commulingo/docs-import');

const hostile = [
    '<p onclick="alert(1)">a</p>',
    '<img src="x" onerror="alert(1)">',
    '<a href="javascript:alert(1)">b</a>',
    '<a href=" JaVaScRiPt:alert(1)">c</a>',
    '<a href="//evil.example/">d</a>',
    '<iframe src="https://evil.example/">e</iframe>',
    '<svg><script>alert(1)</script></svg>',
    '<form action="/x"><input name="y"></form>',
    '<object data="x"></object><embed src="x">',
    '<p>ok</p><script>alert(1)</script>',
].join('\n');
const clean = sanitizeDocHtml(hostile);
assert.ok(!/\son[a-z]+=|javascript:|<(iframe|svg|script|form|input|object|embed)\b|alert|evil/i.test(clean), clean);
assert.ok(clean.includes('<p>ok</p>'));
assert.ok(sanitizeDocHtml('<img src="data:image/png;base64,AAAA" alt="x">').includes('data:image/png'));
assert.ok(!sanitizeDocHtml('<a href="data:text/html,x">x</a>').includes('data:'));

const fragment = extractFragment('<html><body><p onmouseover="x()">t</p></body></html>');
assert.ok(!fragment.html.includes('onmouseover'));
assert.ok(fragment.warnings.some(w => w.includes('active-content')));

const loose = {
    allowedTags: false,
    allowedAttributes: false,
    allowVulnerableTags: true,
    allowedSchemesAppliedToAttributes: [],
};
const dir = path.join(__dirname, '..', 'data', 'commulingo', 'docs');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    assert.strictEqual(sanitizeDocHtml(raw), sanitizeHtml(raw, loose), `${file}: the allowlist drops content`);
}
console.log(`ok: commulingo doc sanitize (${files.length} stored docs unchanged)`);
