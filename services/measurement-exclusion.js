// Who is left out of the site's own counts (menu and page views, learning
// measurement, war plays) and the same-origin check those anonymous beacons
// share. Kept apart from any one feature so each counter applies one rule.

const BOT = /bot|spider|crawl|headless|playwright|puppeteer|curl|wget|python|node-fetch|undici|facebookexternalhit|slurp/i;

// The visitor's address as Cloudflare saw it (nginx passes Cloudflare's edge
// address as the peer). A request sent straight to the origin could forge the
// header, but only to exclude itself from the counts.
function clientIp(req) {
    return String(req.headers['cf-connecting-ip'] || req.ip || '').trim();
}

// MEASUREMENT_EXCLUDED_IPS (.env): comma-separated addresses whose visits are
// not counted: this server's own (agents' checks) and the operator's home
// address (visits without signing in); an entry ending in ':' or '.' is a
// prefix (an IPv6 /64 such as "2a01:4f9:c012:b463:").
function excludedIp(ip, env) {
    if (!ip) return false;
    return String(env.MEASUREMENT_EXCLUDED_IPS || '').split(',').map(s => s.trim()).filter(Boolean)
        .some(entry => (/[:.]$/.test(entry) ? ip.startsWith(entry) : ip === entry));
}

// Not a visitor at all: outside production, another host, a robot or an
// excluded address.
function excludedSource(req, env = process.env) {
    const host = (req.headers.host || '').split(':')[0];
    return env.NODE_ENV !== 'production' || env.DEV_MODE === '1'
        || !['cyber-lenin.com', 'www.cyber-lenin.com'].includes(host)
        || !req.headers['user-agent'] || BOT.test(req.headers['user-agent'])
        || excludedIp(clientIp(req), env);
}

// excludedSource, plus operator sessions and the test and opt-out switches.
function excluded(req, env = process.env) {
    const session = req.session || {};
    return excludedSource(req, env)
        || !!(session.isAuthenticated || session.adminUser || session.user?.is_admin)
        || req.cookies?.commulingo_test === '1' || req.cookies?.commulingo_measurement_off === '1'
        || req.headers['x-commulingo-test'] === '1';
}

// Mounted before the session-token CSRF gate: JSON, the beacon's own custom
// header and the exact Origin keep other sites' pages from writing.
function sameOrigin(req, header = 'x-commulingo-measurement') {
    return req.is('application/json') && req.headers[header] === '1'
        && req.headers.origin === 'https://' + req.headers.host
        && (!req.headers['sec-fetch-site'] || req.headers['sec-fetch-site'] === 'same-origin');
}

module.exports = { BOT, clientIp, excludedIp, excludedSource, excluded, sameOrigin };
