const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../config/database');
const { excludedSource, sameOrigin } = require('../services/measurement-exclusion');
const { normalize, replay } = require('../services/war-plays');
const router = express.Router();

router.use((req, res, next) => {
    res.set('Cache-Control', 'private, no-store');
    next();
});
router.post('/', rateLimit({ windowMs: 60000, limit: 60, standardHeaders: true, legacyHeaders: false }), async (req, res) => {
    if (!sameOrigin(req, 'x-war-play')) return res.status(403).end();
    // Not a player: off the production host, robots, excluded addresses. An
    // operator's own games are kept, marked.
    if (excludedSource(req)) return res.status(204).end();
    const play = normalize(req.body);
    if (!play) return res.status(400).json({ error: 'invalid play' });
    const r = replay(play);
    if (!r) return res.status(400).json({ error: 'log does not replay' });
    const session = req.session || {};
    const operator = Boolean(session.isAuthenticated || session.adminUser || session.user?.is_admin);
    try {
        // A later report of the same attempt replaces the earlier; one that
        // arrives late (a lower seq) changes nothing.
        await db.query(`INSERT INTO war_game_plays
            (run_id, attempt, scenario, seq, save_version, rules, log, decisions, replayed, turn, phase, ended, outcome, stars, stats, narrow, operator, ended_at)
            VALUES ($1::uuid,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16,$17, CASE WHEN $12 THEN now() END)
            ON CONFLICT (run_id, attempt) DO UPDATE SET
                seq = EXCLUDED.seq, save_version = EXCLUDED.save_version, rules = EXCLUDED.rules, log = EXCLUDED.log,
                decisions = EXCLUDED.decisions, replayed = EXCLUDED.replayed, turn = EXCLUDED.turn, phase = EXCLUDED.phase,
                ended = EXCLUDED.ended, outcome = EXCLUDED.outcome, stars = EXCLUDED.stars, stats = EXCLUDED.stats,
                narrow = EXCLUDED.narrow, operator = war_game_plays.operator OR EXCLUDED.operator,
                sends = war_game_plays.sends + 1, updated_at = now(),
                ended_at = CASE WHEN EXCLUDED.ended THEN COALESCE(war_game_plays.ended_at, now()) END
            WHERE war_game_plays.seq < EXCLUDED.seq`,
        [play.runId, play.attempt, play.scenario, play.seq, play.save.version, play.save.rules, JSON.stringify(play.save.log),
            play.save.log.length, r.replayed, r.turn, r.phase, r.ended, r.outcome, r.stars, JSON.stringify(r.stats), play.narrow, operator]);
        res.status(204).end();
    } catch (err) {
        console.error('[war plays]', err.code || 'unavailable');
        res.status(503).end();
    }
});
module.exports = router;
