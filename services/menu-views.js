// Page views per site menu. Public pages are cached at Cloudflare's edge, so
// the server never sees most visits; instead public/js/nav.js sends one
// beacon per page a browser opens, and this module maps its path to a menu
// (detail pages count toward the menu they belong to) and adds one to that
// day's count. The same exclusions as learning measurement apply: operator
// sessions, test and opt-out cookies, bots, non-production hosts.

// [menu key, path prefixes (exact or followed by "/"), Korean label, English label,
// options], matched in order; the first hit wins. { exact: true } counts only
// the listed paths themselves, not pages below them.
const MENUS = [
    ['home', ['/'], '대문', 'Home', { exact: true }],
    ['chat', ['/chat'], '채팅', 'Chat'],
    ['commulingo.learn', ['/commulingo/learn', '/commulingo/book'], '공산링고 · 강좌', 'CommuLingo · Courses'],
    ['commulingo.drill', ['/commulingo/drill'], '공산링고 · 훈련장', 'CommuLingo · Drills'],
    ['commulingo.people', ['/commulingo/people', '/commulingo/activities', '/commulingo/offices',
        '/commulingo/roles', '/commulingo/internationalist'], '공산링고 · 인물', 'CommuLingo · People'],
    ['commulingo.events', ['/commulingo/events'], '공산링고 · 사건', 'CommuLingo · Events'],
    ['commulingo.map', ['/commulingo/map', '/commulingo/countries'], '공산링고 · 지도', 'CommuLingo · Map'],
    ['commulingo.terms', ['/commulingo/terms'], '공산링고 · 용어', 'CommuLingo · Terms'],
    ['commulingo.genealogy', ['/commulingo/genealogy', '/commulingo/politburo'], '공산링고 · 계보도', 'CommuLingo · Genealogy'],
    ['commulingo.docs', ['/commulingo/docs'], '공산링고 · 문헌', 'CommuLingo · References'],
    ['commulingo.home', ['/commulingo'], '공산링고 · 첫 화면', 'CommuLingo · Home', { exact: true }],
    ['reports', ['/reports', '/p'], '보고서', 'Reports'],
    ['hub', ['/hub'], '큐레이션', 'Curation'],
    ['diary', ['/ai-diary'], '일기장', 'Diary'],
    ['posts', ['/posts', '/post'], '비숑글', 'Posts'],
    ['games', ['/games', '/nonogram'], '게임', 'Games'],
];

function matches(path, prefix) {
    return path === prefix || path.startsWith(prefix + '/');
}

// '/en/commulingo/people/stalin' → { menu: 'commulingo.people', lang: 'en',
// path: '/commulingo/people/stalin' } (path without /en or a trailing slash,
// the key of the per-page count); null for paths outside the menus.
function menuForPath(rawPath) {
    if (typeof rawPath !== 'string' || rawPath.length > 300 || !rawPath.startsWith('/')) return null;
    let path = rawPath.replace(/\/+$/, '') || '/';
    let lang = 'ko';
    if (path === '/en' || path.startsWith('/en/')) {
        lang = 'en';
        path = path.slice(3) || '/';
    }
    // "/commulingo" alone is the hub (exact); deeper unknown CommuLingo paths are not counted.
    for (const [menu, prefixes, , , options] of MENUS) {
        const hit = options?.exact ? prefixes.includes(path) : prefixes.some(prefix => matches(path, prefix));
        if (hit) return { menu, lang, path };
    }
    return null;
}

function menuLabel(menu, lang = 'ko') {
    const row = MENUS.find(([key]) => key === menu);
    return row ? (lang === 'en' ? row[3] : row[2]) : menu;
}

module.exports = { MENUS, menuForPath, menuLabel };
