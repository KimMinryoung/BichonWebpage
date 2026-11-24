// The CommuLingo learning sections — 강좌 (quiz courses), 훈련장 (drills built
// from the dictionaries), 쇼츠 (the swipe-through card feed) and 게임 — under the one
// "학습" menu. The hub (/commulingo) lists them beside the dictionary tabs, and
// each of the three pages carries the same row so the reader can switch
// between them; the list lives here so the two renderings cannot drift.
const { menuHidden } = require('../../config/hidden-menus');

// A tab whose menu is hidden (config/hidden-menus.js) is left out.
function learnTabs(en) {
    return [
        { key: 'courses', href: '/commulingo/learn', icon: 'graduation-cap',
          label: en ? 'Courses' : '강좌', short: en ? 'Courses' : '강좌' },
        { key: 'drill', menu: 'commulingo.drill', href: '/commulingo/drill', icon: 'swords',
          label: en ? 'Training ground' : '훈련장', short: en ? 'Drills' : '훈련장' },
        { key: 'shorts', menu: 'commulingo.shorts', href: '/commulingo/drill/shorts', icon: 'layout-grid',
          label: en ? 'Shorts' : '쇼츠', short: en ? 'Shorts' : '쇼츠' },
        // The history strategy games (/games/, 2026-11-24): outside the
        // CommuLingo pages, but otherwise reachable only from the home card
        // and the footer. Korean only, as the games are.
        ...(en ? [] : [{ key: 'games', menu: 'games', href: '/games/', icon: 'game', label: '게임', short: '게임' }]),
    ].filter(tab => !menuHidden(tab.menu));
}

module.exports = { learnTabs };
