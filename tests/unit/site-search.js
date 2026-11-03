// The integrated search's section plan (services/site-search.js): the owner's
// order (writings, courses, events, documents, people, terms), writings only
// in the site scope, and in English only menus config/menu-languages.js marks
// as having English. Also keeps menu-languages in step with the menu table.
const assert = require('node:assert');
const { MENUS } = require('../../services/menu-views');
const { MENU_ENGLISH } = require('../../config/menu-languages');
const { sectionsFor } = require('../../services/site-search');
const { highlightTerms, searchTerms } = require('../../utils/text-search');

assert.deepStrictEqual(Object.keys(MENU_ENGLISH).sort(), MENUS.map(([menu]) => menu).sort(),
    'config/menu-languages.js lists exactly the menus of services/menu-views.js');
assert.ok(Object.values(MENU_ENGLISH).every(value => ['full', 'per-item', 'none'].includes(value)));

const keys = (scope, lang) => sectionsFor(scope, lang).map(section => section.key);
assert.deepStrictEqual(keys('all', 'ko'), ['reports', 'hub', 'diary', 'posts', 'courses', 'events', 'docs', 'people', 'terms']);
assert.deepStrictEqual(keys('commulingo', 'ko'), ['courses', 'events', 'docs', 'people', 'terms']);
// Reference documents are per-item in English (those with a published original).
assert.deepStrictEqual(keys('commulingo', 'en'), ['courses', 'events', 'docs', 'people', 'terms']);
for (const section of sectionsFor('all', 'ko')) assert.ok(section.menu in MENU_ENGLISH, `${section.key} names a menu`);
// Result marks: escaped text, every word marked case-insensitively, the longer
// word first where two overlap.
const mark = text => `<mark class="ui-search-hl">${text}</mark>`;
assert.strictEqual(highlightTerms('Lenin <b> & lenin', searchTerms('LENIN')), `${mark('Lenin')} &lt;b&gt; &amp; ${mark('lenin')}`);
assert.strictEqual(highlightTerms('레닌주의와 레닌', searchTerms('레닌 레닌주의')), `${mark('레닌주의')}와 ${mark('레닌')}`);
assert.strictEqual(highlightTerms('a.b (c)', searchTerms('a.b (c)')), `${mark('a.b')} ${mark('(c)')}`);
assert.strictEqual(highlightTerms('"x"', []), '&quot;x&quot;');
assert.strictEqual(highlightTerms(null, ['x']), '');
console.log('site search ok');
