// A hidden menu (config/hidden-menus.js) keeps its URLs but loses its
// entrances: the learn tabs and the practice decks on detail pages.
const assert = require('node:assert');
const { HIDDEN_MENUS, menuHidden } = require('../../config/hidden-menus');
const { MENUS } = require('../../services/menu-views');
const { learnTabs } = require('../../data/commulingo/learn-tabs');
const { practiceDecksFor } = require('../../data/commulingo/drill-presentation');

(async () => {
    const known = new Set(MENUS.map(([key]) => key));
    for (const menu of HIDDEN_MENUS) assert.ok(known.has(menu), menu);

    for (const en of [false, true]) {
        const tabs = learnTabs(en);
        assert.ok(tabs.some(tab => tab.key === 'courses'));
        assert.ok(tabs.every(tab => !menuHidden(tab.menu)));
    }
    if (menuHidden('commulingo.drill')) {
        const expected = ['courses', ...(menuHidden('commulingo.shorts') ? [] : ['shorts']), ...(menuHidden('games') ? [] : ['games'])];
        assert.deepStrictEqual(learnTabs(false).map(tab => tab.key), expected);
        assert.ok(!learnTabs(true).some(tab => tab.key === 'games'), 'the games are Korean only');
        assert.deepStrictEqual(await practiceDecksFor(['/commulingo/people/stalin'], 'ko'), []);
    }
    console.log('hidden menus ok');
})().catch(err => { console.error(err); process.exit(1); });
