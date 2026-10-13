// Korean-only menus (config/menu-languages.js 'none') have no English URL:
// /en/<path> redirects to the Korean path, English pages leave their links
// unlocalized, and the dictionary tabs drop them in English. All of it is
// derived from MENU_ENGLISH, so a menu that gains English loses this handling.
const assert = require('node:assert');
const { MENU_ENGLISH, isKoreanOnlyPath } = require('../config/menu-languages');
const { localizeHtmlLinks } = require('../utils/seo');
const { stripEnglishPrefix } = require('../middleware/language');
const { dictTabs } = require('../data/commulingo/dict-tabs');

assert.strictEqual(MENU_ENGLISH.games, 'none');
assert.strictEqual(MENU_ENGLISH['commulingo.docs'], 'none');
for (const path of ['/games/', '/games/strike/', '/games/civil-war/', '/nonogram/', '/commulingo/docs', '/commulingo/docs/manifesto?p=2']) {
    assert.ok(isKoreanOnlyPath(path), path);
}
for (const path of ['/', '/commulingo', '/commulingo/people/stalin', '/reports', '/search']) {
    assert.ok(!isKoreanOnlyPath(path), path);
}

function strip(url) {
    const req = { method: 'GET', url };
    let result = null;
    stripEnglishPrefix(req, { redirect: (status, location) => { result = { status, location }; } },
        () => { result = { next: req.url }; });
    return result;
}
assert.deepStrictEqual(strip('/en/games/'), { status: 302, location: '/games/' });
assert.deepStrictEqual(strip('/en/nonogram/?n=3'), { status: 302, location: '/nonogram/?n=3' });
assert.deepStrictEqual(strip('/en/commulingo/docs/manifesto'), { status: 302, location: '/commulingo/docs/manifesto' });
assert.deepStrictEqual(strip('/en/reports'), { next: '/reports' });

assert.strictEqual(
    localizeHtmlLinks('<a href="/commulingo/docs/x#s">d</a><a href="/games/">g</a><a href="/commulingo/terms/y">t</a>', 'en'),
    '<a href="/commulingo/docs/x#s">d</a><a href="/games/">g</a><a href="/en/commulingo/terms/y">t</a>');

assert.ok(!dictTabs(true).some(tab => tab.key === 'docs'));
assert.ok(dictTabs(false).some(tab => tab.key === 'docs'));

console.log('korean-only menus ok');
