// Which site menus exist in English, keyed like services/menu-views.js MENUS.
// Logic that should offer only English content in English (the integrated
// search, services/site-search.js; the menu entrances via res.locals.menuShown
// and data/commulingo/dict-tabs.js) reads this. Update it when a menu gains or
// loses its English version; scripts/test-menu-languages.js keeps the keys in
// step with MENUS.
//
//   'full'     every item has English (screen and content)
//   'per-item' English screen; each item's own translation decides, so lists
//              in English leave out the untranslated ones
//   'none'     Korean content only, even under /en/
//
// Surveyed 2026-10-11 against production (/en/ pages and the DB):
// reports 175/175 translated but static pages (/p, filed under reports) 3/14;
// curations 22/22; diary 532/533; posts 36/36; course lessons carry ko+en
// questions. Reference documents have English titles and summaries in the list
// but Korean bodies, and the games are Korean-only (noindex under /en/).
const MENU_ENGLISH = {
    home: 'full',
    chat: 'full',
    'commulingo.home': 'full',
    'commulingo.learn': 'full',
    'commulingo.drill': 'full',
    'commulingo.people': 'full',
    'commulingo.events': 'full',
    'commulingo.map': 'full',
    'commulingo.terms': 'full',
    'commulingo.genealogy': 'full',
    'commulingo.docs': 'none',
    reports: 'per-item',
    hub: 'per-item',
    diary: 'per-item',
    posts: 'per-item',
    games: 'none',
};

// Whether a menu has anything to show in English.
function menuHasEnglish(menu) {
    return MENU_ENGLISH[menu] === 'full' || MENU_ENGLISH[menu] === 'per-item';
}

module.exports = { MENU_ENGLISH, menuHasEnglish };
