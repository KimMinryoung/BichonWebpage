// Site menus taken out of circulation, keyed like services/menu-views.js MENUS.
// A hidden menu keeps its URLs (bookmarks and outside links still open), but
// the site stops leading to it: the learn tabs (data/commulingo/learn-tabs.js),
// the practice decks on dictionary detail pages (drill-presentation.js) and
// the sitemap leave it out, and its pages are served noindex
// (routes/commulingo-drills.js). Remove the key to bring the menu back.
//
// commulingo.drill (훈련장) hidden 2026-11-10 by the owner as the weakest
// CommuLingo content. 쇼츠 (/commulingo/drill/shorts, its own menu
// commulingo.shorts) was hidden with it and came back on 2026-11-23 as the
// read-only story feed.
const HIDDEN_MENUS = new Set(['commulingo.drill']);

function menuHidden(menu) {
    return HIDDEN_MENUS.has(menu);
}

module.exports = { HIDDEN_MENUS, menuHidden };
