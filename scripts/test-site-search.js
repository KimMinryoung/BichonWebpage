// The integrated search's section plan (services/site-search.js): the owner's
// order (writings, courses, events, documents, people, terms), writings only
// in the site scope, and in English only menus config/menu-languages.js marks
// as having English. Also keeps menu-languages in step with the menu table.
const assert = require('node:assert');
const { MENUS } = require('../services/menu-views');
const { MENU_ENGLISH } = require('../config/menu-languages');
const { sectionsFor } = require('../services/site-search');

assert.deepStrictEqual(Object.keys(MENU_ENGLISH).sort(), MENUS.map(([menu]) => menu).sort(),
    'config/menu-languages.js lists exactly the menus of services/menu-views.js');
assert.ok(Object.values(MENU_ENGLISH).every(value => ['full', 'per-item', 'none'].includes(value)));

const keys = (scope, lang) => sectionsFor(scope, lang).map(section => section.key);
assert.deepStrictEqual(keys('all', 'ko'), ['reports', 'hub', 'diary', 'posts', 'courses', 'events', 'docs', 'people', 'terms']);
assert.deepStrictEqual(keys('commulingo', 'ko'), ['courses', 'events', 'docs', 'people', 'terms']);
// The reference documents are Korean-only.
assert.deepStrictEqual(keys('commulingo', 'en'), ['courses', 'events', 'people', 'terms']);
assert.ok(!keys('all', 'en').includes('docs'));
for (const section of sectionsFor('all', 'ko')) assert.ok(section.menu in MENU_ENGLISH, `${section.key} names a menu`);
console.log('site search ok');
