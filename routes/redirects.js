// Legacy URLs and the nonogram page. Mounted before express.static and the
// CSRF gate, exactly where these handlers sat in server.js.
const express = require('express');
const crypto = require('crypto');
const { setNoStore } = require('../utils/http');

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

module.exports = router;
