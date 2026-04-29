const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function normalizeLanguage(value) {
    if (value === 'ko' || value === 'en') return value;
    return null;
}

function headerValue(req, name) {
    const value = req.headers[name];
    return Array.isArray(value) ? value[0] : value;
}

function countryFromHeaders(req) {
    const raw = headerValue(req, 'cf-ipcountry')
        || headerValue(req, 'cloudfront-viewer-country')
        || headerValue(req, 'x-vercel-ip-country')
        || headerValue(req, 'x-country-code');
    return typeof raw === 'string' ? raw.trim().toUpperCase() : '';
}

function browserPreferredLanguage(req) {
    const header = headerValue(req, 'accept-language');
    if (typeof header !== 'string') return null;
    const preferred = header
        .split(',')
        .map((part, index) => {
            const segments = part.trim().toLowerCase().split(';');
            const tag = segments[0];
            const qSegment = segments.find((segment) => segment.trim().startsWith('q='));
            const q = qSegment ? Number(qSegment.split('=')[1]) : 1;
            return {
                lang: tag.split('-')[0],
                q: Number.isFinite(q) ? q : 0,
                index,
            };
        })
        .filter((item) => item.q > 0 && (item.lang === 'ko' || item.lang === 'en'))
        .sort((a, b) => (b.q - a.q) || (a.index - b.index))[0];
    return preferred ? preferred.lang : null;
}

function inferLanguage(req) {
    if (browserPreferredLanguage(req) === 'ko') return 'ko';
    return countryFromHeaders(req) === 'KR' ? 'ko' : 'en';
}

function languageCookieOptions(req) {
    return {
        path: '/',
        maxAge: ONE_YEAR_MS,
        sameSite: 'lax',
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    };
}

function resolveLanguage(req, res) {
    const cookieLang = normalizeLanguage(req.cookies.lang);
    if (cookieLang) return cookieLang;

    const inferredLang = inferLanguage(req);
    res.cookie('lang', inferredLang, languageCookieOptions(req));
    return inferredLang;
}

module.exports = {
    normalizeLanguage,
    inferLanguage,
    resolveLanguage,
};
