const SITE_ORIGIN = (process.env.SITE_ORIGIN || 'https://cyber-lenin.com').replace(/\/+$/, '');
const SITE_HOST = new URL(SITE_ORIGIN).host;

function absoluteUrl(pathname = '/') {
    const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${SITE_ORIGIN}${path}`;
}

function languagePath(pathname = '/', lang = 'ko') {
    const path = canonicalPath(pathname);
    if (lang !== 'en') return path;
    if (path === '/') return '/en/';
    if (path === '/en' || path.startsWith('/en/')) return path;
    return `/en${path}`;
}

function languageSwitchPath(pathname = '/', lang = 'ko') {
    const localized = languagePath(pathname, lang);
    const url = new URL(localized, 'http://localhost');
    url.searchParams.set('lang', lang === 'en' ? 'en' : 'ko');
    return url.pathname + url.search;
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

function pageJsonLd({
    type = 'WebPage',
    title,
    description,
    path = '/',
    datePublished,
    dateModified,
    authorName = 'Cyber-Lenin',
    authorUrl,
    image,
    lang = 'ko',
}) {
    const url = absoluteUrl(languagePath(path, lang));
    const data = {
        '@context': 'https://schema.org',
        '@type': type,
        headline: title,
        name: title,
        description,
        url,
        mainEntityOfPage: url,
        author: {
            '@type': 'Person',
            name: authorName,
            ...(authorUrl ? { url: authorUrl } : {}),
        },
        publisher: {
            '@type': 'Organization',
            name: 'Cyber-Lenin',
            url: SITE_ORIGIN,
            logo: {
                '@type': 'ImageObject',
                url: 'https://assets.cyber-lenin.com/apple-touch-icon.png',
            },
        },
    };
    if (datePublished) data.datePublished = new Date(datePublished).toISOString();
    if (dateModified) data.dateModified = new Date(dateModified).toISOString();
    if (image) data.image = Array.isArray(image) ? image : [image];
    return data;
}

function setMarkdownSeoHeaders(res, canonicalPath, { follow = true, lang = 'ko' } = {}) {
    res.setHeader('X-Robots-Tag', `noindex, ${follow ? 'follow' : 'nofollow'}`);
    res.setHeader('Link', `<${absoluteUrl(languagePath(canonicalPath, lang))}>; rel="canonical"`);
}

function itemListJsonLd(items = [], lang = 'ko') {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title || item.name,
            url: absoluteUrl(languagePath(item.href || item.url || '/', lang)),
        })).filter(item => item.name && item.url),
    };
}

const ENGLISH_LINK_EXCLUSIONS = [
    '/en', '/css', '/js', '/fonts', '/img', '/flags', '/puzzles',
    '/api', '/auth', '/admin', '/nonogram', '/favicon.ico',
    '/apple-touch-icon.png', '/apple-touch-icon-precomposed.png',
];

function shouldLocalizeHtmlHref(href) {
    if (!href || !href.startsWith('/') || href.startsWith('//')) return false;
    return !ENGLISH_LINK_EXCLUSIONS.some(prefix => href === prefix || href.startsWith(`${prefix}/`) || href.startsWith(`${prefix}?`));
}

function localizeHtmlLinks(html, lang = 'ko') {
    if (lang !== 'en' || typeof html !== 'string') return html;
    return html.replace(/\bhref=(["'])(\/[^"'<>]*)\1/gi, (match, quote, href) => {
        if (!shouldLocalizeHtmlHref(href)) return match;
        return `href=${quote}${languagePath(href, 'en')}${quote}`;
    });
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
    languagePath,
    languageSwitchPath,
    canonicalPath,
    plainText,
    excerpt,
    jsonLdScript,
    pageJsonLd,
    setMarkdownSeoHeaders,
    itemListJsonLd,
    localizeHtmlLinks,
    escapeXml,
    canonicalHostRedirect,
};
