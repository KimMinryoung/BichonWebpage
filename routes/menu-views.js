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

router.post('/', rateLimit({ windowMs: 60000, limit: 120, standardHeaders: true, legacyHeaders: false }), async (req, res) => {
    res.set('Cache-Control', 'private, no-store');
    if (excluded(req)) return res.status(204).end();
    if (!sameOrigin(req)) return res.status(403).end();
    const hit = menuForPath(req.body && req.body.path);
    if (!hit) return res.status(204).end();
    try {
        await db.query(`INSERT INTO site_menu_views (day, menu, lang, views)
                        VALUES ((now() AT TIME ZONE 'Asia/Seoul')::date, $1, $2, 1)
                        ON CONFLICT (day, menu, lang) DO UPDATE SET views = site_menu_views.views + 1`,
        [hit.menu, hit.lang]);
        res.status(204).end();
    } catch (err) {
        console.error('[menu views]', err.code || 'unavailable');
        res.status(503).end();
    }
});

module.exports = router;
