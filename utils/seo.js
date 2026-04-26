const SITE_ORIGIN = (process.env.SITE_ORIGIN || 'https://cyber-lenin.com').replace(/\/+$/, '');
const SITE_HOST = new URL(SITE_ORIGIN).host;

function absoluteUrl(pathname = '/') {
    const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${SITE_ORIGIN}${path}`;
}

function canonicalPath(pathname = '/') {
    if (!pathname || pathname === '/') return '/';
    const [base, query] = String(pathname).split('?');
    const normalized = base.length > 1 ? base.replace(/\/+$/, '') : '/';
    return query ? `${normalized}?${query}` : normalized;
}

function plainText(input = '') {
    return String(input)
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
        .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
        .replace(/[#*_`>|~-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function excerpt(input = '', maxLen = 160) {
    const text = plainText(input);
    return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}

function jsonLdScript(data) {
    return JSON.stringify(data).replace(/</g, '\\u003c');
}

function pageJsonLd({ type = 'WebPage', title, description, path = '/', datePublished, dateModified, authorName = 'Cyber-Lenin' }) {
    const url = absoluteUrl(path);
    const data = {
        '@context': 'https://schema.org',
        '@type': type,
        headline: title,
        name: title,
        description,
        url,
        mainEntityOfPage: url,
        author: { '@type': 'Person', name: authorName },
        publisher: {
            '@type': 'Organization',
            name: 'Cyber-Lenin',
            url: SITE_ORIGIN,
        },
    };
    if (datePublished) data.datePublished = new Date(datePublished).toISOString();
    if (dateModified) data.dateModified = new Date(dateModified).toISOString();
    return data;
}

function itemListJsonLd(items = []) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title || item.name,
            url: absoluteUrl(item.href || item.url || '/'),
        })).filter(item => item.name && item.url),
    };
}

function escapeXml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function canonicalHostRedirect(req, res, next) {
    const host = req.headers.host;
    const hostname = host ? host.split(':')[0] : '';
    if (!hostname || hostname === SITE_HOST) return next();
    if (hostname === `www.${SITE_HOST}`) {
        return res.redirect(301, `${SITE_ORIGIN}${req.originalUrl}`);
    }
    return next();
}

module.exports = {
    SITE_ORIGIN,
    SITE_HOST,
    absoluteUrl,
    canonicalPath,
    plainText,
    excerpt,
    jsonLdScript,
    pageJsonLd,
    itemListJsonLd,
    escapeXml,
    canonicalHostRedirect,
};
