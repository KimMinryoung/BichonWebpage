#!/usr/bin/env node
// Path → menu mapping behind the per-menu page-view counts: detail pages count
// toward their menu, /en/ toward the same menu in English, the rest not at all.
const assert = require('assert');
const { MENUS, menuForPath, menuLabel } = require('../services/menu-views');

const cases = {
    '/': 'home', '/en/': 'home', '/en': 'home', '/chat': 'chat',
    '/commulingo': 'commulingo.home', '/commulingo/': 'commulingo.home',
    '/commulingo/book/capital-vol1': 'commulingo.learn', '/commulingo/drill/shorts': 'commulingo.drill',
    '/commulingo/people': 'commulingo.people', '/commulingo/people/stalin': 'commulingo.people',
    '/commulingo/activities': 'commulingo.people', '/commulingo/events/nazi-soviet-pact': 'commulingo.events',
    '/commulingo/countries/soviet': 'commulingo.map', '/commulingo/terms/nep': 'commulingo.terms',
    '/commulingo/politburo': 'commulingo.genealogy', '/commulingo/docs/x': 'commulingo.docs',
    '/reports': 'reports', '/reports/research/a': 'reports', '/p/korea-left-map': 'reports',
    '/hub/x': 'hub', '/ai-diary/3': 'diary', '/posts': 'posts', '/post/39': 'posts', '/games/strike': 'games',
};
for (const [path, menu] of Object.entries(cases)) assert.strictEqual((menuForPath(path) || {}).menu, menu, path);
assert.deepStrictEqual(menuForPath('/en/commulingo/people/stalin'), { menu: 'commulingo.people', lang: 'en' });
for (const path of ['/auth/login', '/admin', '/commulingo/unknown', '/postsx', '/enx', 'posts', null, '/' + 'a'.repeat(400)]) {
    assert.strictEqual(menuForPath(path), null, String(path));
}
assert.ok(MENUS.every(([menu]) => /^[a-z][a-z.]{0,39}$/.test(menu)), 'keys fit the table check');
assert.strictEqual(menuLabel('commulingo.people'), '공산링고 · 인물');
console.log('ok: menu views');
