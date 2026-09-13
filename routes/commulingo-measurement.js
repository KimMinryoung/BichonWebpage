const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../config/database');
const { excluded, sameOrigin, normalize } = require('../services/commulingo-measurement');
const { loadCommuLingoCatalog } = require('../data/commulingo/shards');
const { loadCommuLingoDrills } = require('../data/commulingo/drills');
const router = express.Router();

router.use((req, res, next) => {
    res.set('Cache-Control', 'private, no-store');
    if (excluded(req)) return res.status(204).end();
    next();
});
router.post('/', rateLimit({ windowMs: 60000, limit: 120, standardHeaders: true, legacyHeaders: false }), async (req, res) => {
    // This route is mounted before the session-token CSRF gate. Anonymous
    // cached learning pages have no token. JSON + custom header + exact Origin
    // prevent cross-origin browser writes without minting visitor sessions.
    if (!sameOrigin(req)) return res.status(403).end();
    const event = normalize(req.body);
    if (!event) return res.status(400).json({ error: 'invalid learning event' });
    try {
        const exists = event.kind === 'lesson'
            ? loadCommuLingoCatalog().collections.some(c => (c.chapters || []).some(ch => (ch.lessons || []).some(l => l.id === event.contentId)))
            : (await loadCommuLingoDrills()).byId.has(event.contentId);
        if (!exists) return res.status(400).json({ error: 'unknown learning content' });
        await db.query(`INSERT INTO commulingo_learning_events
            (event_id, run_id, kind, content_id, content_version, lang, mode, event, step, correct)
            SELECT $1::uuid,$2::uuid,$3,$4,$5,$6,$7,$8,$9::integer,$10::boolean
            WHERE $8 = 'started' OR EXISTS (
                SELECT 1 FROM commulingo_learning_events
                WHERE run_id = $2::uuid AND event = 'started' AND kind = $3
                  AND content_id = $4 AND content_version = $5 AND lang = $6 AND mode = $7
            ) ON CONFLICT DO NOTHING`,
        [event.eventId, event.runId, event.kind, event.contentId, event.version, event.lang, event.mode, event.event, event.step, event.correct]);
        res.status(204).end();
    } catch (err) {
        console.error('[learning measurement]', err.code || 'unavailable');
        res.status(503).end();
    }
});
// Retention runs independently of traffic; development must not purge production.
if (process.env.NODE_ENV === 'production' && process.env.DEV_MODE !== '1') {
    const purge = () => db.query("DELETE FROM commulingo_learning_events WHERE received_at < now() - interval '30 days'")
        .catch(err => console.error('[learning retention]', err.code || 'unavailable'));
    purge();
    setInterval(purge, 60 * 60 * 1000).unref();
}
module.exports = router;
