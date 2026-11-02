// POST /metrics/vitals { path, device, lcp, inp, cls } and
// POST /metrics/client-error { source, line, column, message }, from
// public/js/site-vitals.js. Mounted before the session-token CSRF gate like
// the menu-view beacon, with the same exclusions and same-origin check
// (services/measurement-exclusion.js). Stored as daily counts only
// (services/web-vitals.js, migration 375).
const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../config/database');
const { excluded, sameOrigin } = require('../services/measurement-exclusion');
const { menuForPath } = require('../services/menu-views');
const { bucketFor, normalizeError } = require('../services/web-vitals');

const router = express.Router();
const limit = () => rateLimit({ windowMs: 60000, limit: 60, standardHeaders: true, legacyHeaders: false });
const TODAY = `(now() AT TIME ZONE 'Asia/Seoul')::date`;

function gate(req, res) {
    res.set('Cache-Control', 'private, no-store');
    if (excluded(req)) { res.status(204).end(); return false; }
    if (!sameOrigin(req)) { res.status(403).end(); return false; }
    return true;
}

router.post('/vitals', limit(), async (req, res) => {
    if (!gate(req, res)) return;
    const body = req.body || {};
    const hit = menuForPath(body.path);
    const device = body.device === 'mobile' ? 'mobile' : body.device === 'desktop' ? 'desktop' : null;
    if (!hit || !device) return res.status(204).end();
    const rows = ['lcp', 'inp', 'cls']
        .map(metric => [metric, bucketFor(metric, body[metric])])
        .filter(([, bucket]) => bucket !== null);
    if (!rows.length) return res.status(204).end();
    try {
        await db.query(`INSERT INTO site_web_vitals (day, menu, metric, device, bucket, samples)
                        SELECT ${TODAY}, $1, m.metric, $2, m.bucket, 1
                          FROM unnest($3::text[], $4::smallint[]) AS m(metric, bucket)
                        ON CONFLICT (day, menu, metric, device, bucket)
                        DO UPDATE SET samples = site_web_vitals.samples + 1`,
        [hit.menu, device, rows.map(r => r[0]), rows.map(r => r[1])]);
        res.status(204).end();
    } catch (err) {
        console.error('[web vitals]', err.code || 'unavailable');
        res.status(503).end();
    }
});

router.post('/client-error', limit(), async (req, res) => {
    if (!gate(req, res)) return;
    const error = normalizeError(req.body, 'https://' + req.headers.host);
    if (!error) return res.status(204).end();
    try {
        await db.query(`INSERT INTO site_client_errors (day, source, message, hits)
                        VALUES (${TODAY}, $1, $2, 1)
                        ON CONFLICT (day, source, message) DO UPDATE SET hits = site_client_errors.hits + 1`,
        [error.source, error.message]);
        res.status(204).end();
    } catch (err) {
        console.error('[client errors]', err.code || 'unavailable');
        res.status(503).end();
    }
});

module.exports = router;
