// Legacy URLs and the nonogram page. Mounted before express.static and the
// CSRF gate, exactly where these handlers sat in server.js.
const express = require('express');
const crypto = require('crypto');
const { setNoStore } = require('../utils/http');
const { languagePath } = require('../utils/seo');

const router = express.Router();

function nonogramCanonical(req) {
    const url = new URL(req.originalUrl, 'http://localhost');
    url.searchParams.delete('v');
    const query = url.searchParams.toString();
    return '/nonogram/' + (query ? `?${query}` : '');
}

router.get('/nonogram', (req, res, next) => {
    // Non-strict routing also matches /nonogram/ — that one renders below.
    if (req.path !== '/nonogram') return next();
    setNoStore(res);
    res.redirect(301, nonogramCanonical(req));
});

router.get('/nonogram/', (req, res) => {
    const url = new URL(req.originalUrl, 'http://localhost');
    if (url.searchParams.has('v')) {
        setNoStore(res);
        return res.redirect(301, nonogramCanonical(req));
    }
    if (res.locals.isAuthenticated) {
        req.session.csrfToken = req.session.csrfToken || crypto.randomBytes(32).toString('hex');
        res.locals.csrfToken = req.session.csrfToken;
    }
    setNoStore(res);
    res.render('public/nonogram');
});

router.get('/nonogram/index.html', (req, res) => {
    res.redirect(301, nonogramCanonical(req));
});

// Public games do not need database queries. A war game draws its map
// from the event-control document cached in memory.
const { warMap, SCENARIOS } = require('../services/war-map');
const { battlesOf, battlePage, gamePage } = require('../services/war-promos');
// A war's page: the whole war, or one battle of it (battle: its id) played
// on its own. Each with its title, words and share image.
const warLocals = (id, battle = null) => () => {
    const page = battle ? battlePage(id, battle) : gamePage(id);
    return {
        war: { id, map: warMap(id), scenario: SCENARIOS[id], battle, battles: battlesOf(id) },
        warPage: page,
        pageImage: page ? page.image : null,
    };
};
const gameLocals = { '/games/civil-war/': warLocals('civil-war') };
// One battle on its own (services/war-promos.js): the war before it as
// history went, nothing saved; the page a CommuLingo card or a shared link
// opens. An unknown battle is not found.
router.get('/games/:scenario/battle/:battle', (req, res, next) => {
    const { scenario, battle } = req.params;
    const page = battlePage(scenario, battle);
    if (!page) return next();
    const path = `/games/${scenario}/battle/${battle}/`;
    if (!req.path.endsWith('/')) return res.redirect(301, path + new URL(req.originalUrl, 'http://localhost').search);
    setNoStore(res);
    if (res.locals.isAuthenticated) {
        req.session.csrfToken = req.session.csrfToken || crypto.randomBytes(32).toString('hex');
        res.locals.csrfToken = req.session.csrfToken;
    }
    res.render('public/' + scenario, Object.assign({ pagePath: path, hasEnglishVersion: false, canonicalUrl: res.locals.siteOrigin + path }, warLocals(scenario, battle)()));
});

for (const [path, view] of [['/games/', 'games'], ['/games/strike/', 'strike'], ['/games/civil-war/', 'civil-war']]) {
    router.get(path, (req, res) => {
        setNoStore(res);
        if (!req.path.endsWith('/')) {
            return res.redirect(301, (req.urlLanguage === 'en' ? '/en' : '') + path + new URL(req.originalUrl, 'http://localhost').search);
        }
        if (res.locals.isAuthenticated) {
            req.session.csrfToken = req.session.csrfToken || crypto.randomBytes(32).toString('hex');
            res.locals.csrfToken = req.session.csrfToken;
        }
        res.render('public/' + view, Object.assign({ pagePath: path, hasEnglishVersion: false, canonicalUrl: res.locals.siteOrigin + path }, gameLocals[path] ? gameLocals[path]() : {}));
    });
}

router.get('/favicon.ico', (req, res) => {
    res.redirect(301, 'https://assets.cyber-lenin.com/favicon.ico');
});

router.get(['/apple-touch-icon.png', '/apple-touch-icon-precomposed.png'], (req, res) => {
    res.redirect(301, 'https://assets.cyber-lenin.com/apple-touch-icon.png');
});

router.get(['/img/og-image.jpg', '/img/og-image.png'], (req, res) => {
    res.redirect(301, 'https://assets.cyber-lenin.com/og-image.jpg');
});

router.get('/reports/research/setlog-privacy-audit', (req, res) => {
    res.status(410).type('text/plain').send('Gone');
});

// The drill index is /commulingo/drill; the plural is the guess people type.
router.get(/^\/commulingo\/drills(\/.*)?$/, (req, res) => {
    const url = new URL(req.originalUrl, 'http://localhost');
    const target = '/commulingo/drill' + (req.params[0] || '');
    res.redirect(301, languagePath(target, req.urlLanguage === 'en' ? 'en' : 'ko') + url.search);
});

module.exports = router;
