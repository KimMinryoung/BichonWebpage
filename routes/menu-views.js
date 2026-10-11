// POST /metrics/menu-view { path } — one page view of a site menu, from
// public/js/nav.js. Mounted before the session-token CSRF gate like learning
// measurement: JSON + custom header + exact Origin keep cross-site browsers
// out without minting sessions for anonymous visitors.
const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../config/database');
const { excluded, sameOrigin } = require('../services/commulingo-measurement');
const { menuForPath } = require('../services/menu-views');

const router = express.Router();

// Set on the first beacon from a browser. Without it the view counts in
// first_views rather than views: scrapers that open every page in a fresh,
// cookie-less browser (2026-10-09) never reach the main count. The cookie
// holds no identifier.
const SEEN = 'menu_view_seen';
const SEEN_MAX_AGE = 400 * 24 * 60 * 60 * 1000;

router.post('/', rateLimit({ windowMs: 60000, limit: 120, standardHeaders: true, legacyHeaders: false }), async (req, res) => {
    res.set('Cache-Control', 'private, no-store');
    if (excluded(req)) return res.status(204).end();
    if (!sameOrigin(req)) return res.status(403).end();
    const hit = menuForPath(req.body && req.body.path);
    if (!hit) return res.status(204).end();
    const seen = req.cookies?.[SEEN] === '1';
    if (!seen) res.cookie(SEEN, '1', { maxAge: SEEN_MAX_AGE, httpOnly: true, secure: true, sameSite: 'lax', path: '/metrics/menu-view' });
    try {
        await db.query(`INSERT INTO site_menu_views (day, menu, lang, views, first_views)
                        VALUES ((now() AT TIME ZONE 'Asia/Seoul')::date, $1, $2, $3, $4)
                        ON CONFLICT (day, menu, lang) DO UPDATE SET views = site_menu_views.views + EXCLUDED.views,
                            first_views = site_menu_views.first_views + EXCLUDED.first_views`,
        [hit.menu, hit.lang, seen ? 1 : 0, seen ? 0 : 1]);
        res.status(204).end();
    } catch (err) {
        console.error('[menu views]', err.code || 'unavailable');
        res.status(503).end();
    }
});

module.exports = router;
