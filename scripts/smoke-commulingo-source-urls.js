const assert = require('node:assert/strict');
const { findUrl } = require('../utils/url-in-text');
const { renderMarkdown } = require('../utils/markdown');

const url = text => (findUrl(text) || {}).url;
// Parentheses that belong to the title stay; the wrapper and punctuation go.
assert.equal(url('https://ru.wikipedia.org/wiki/Краткий_курс_истории_ВКП(б) — note'), 'https://ru.wikipedia.org/wiki/Краткий_курс_истории_ВКП(б)');
assert.equal(url('Pub, "T" (https://a.org/x) — note'), 'https://a.org/x');
assert.equal(url('Pub (https://en.wikipedia.org/wiki/A_(b)).'), 'https://en.wikipedia.org/wiki/A_(b)');
assert.equal(url('see https://a.org/x.'), 'https://a.org/x');
assert.equal(findUrl('no link here'), null);

const html = renderMarkdown('Body[1]\n\n[1]: Wikipedia https://en.wikipedia.org/wiki/History_(Bolsheviks)');
assert(html.includes('href="https://en.wikipedia.org/wiki/History_(Bolsheviks)"'), html);
