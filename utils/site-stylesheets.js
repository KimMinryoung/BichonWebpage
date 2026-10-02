// Modules load before ui.css, in their original relationship: list foundations
// before the homepage refinements, and prose before curation details.
function siteStyleModules(pagePath = '/') {
    const path = pagePath.replace(/^\/en(?=\/|$)/, '').split('?')[0].replace(/\/$/, '') || '/';
    if (path === '/') return ['lists', 'home'];
    if (path === '/chat') return ['chat'];
    if (/^\/admin(?:\/|$)/.test(path)) return ['lists', 'prose', 'auth', 'admin'];
    // The account page lists passkeys in .posts-table, an admin-module rule.
    if (path === '/auth/account') return ['auth', 'admin'];
    if (/^\/(?:auth|account)(?:\/|$)/.test(path)) return ['auth'];
    if (/^\/hub(?:\/|$)/.test(path)) return ['lists', 'prose', 'hub'];
    if (/^\/(?:posts|post|reports|ai-diary|novels|p)(?:\/|$)/.test(path)) return ['lists', 'prose'];
    if (/^\/commulingo(?:\/|$)/.test(path)
        && !/^\/commulingo(?:\/(?:people|events|terms)(?:\/list\/[^/]+)?)?$/.test(path)) return ['prose'];
    return [];
}
module.exports = { siteStyleModules };
