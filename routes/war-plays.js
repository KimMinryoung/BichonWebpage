const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../config/database');
const { excludedSource, sameOrigin } = require('../services/measurement-exclusion');
const { normalize, replay, normalizeBattle, replayBattle } = require('../services/war-plays');
const router = express.Router();

router.use((req, res, next) => {
    res.set('Cache-Control', 'private, no-store');
    next();
});
const limit = () => rateLimit({ windowMs: 60000, limit: 60, standardHeaders: true, legacyHeaders: false });
const operatorOf = req => {
    const session = req.session || {};
    return Boolean(session.isAuthenticated || session.adminUser || session.user?.is_admin);
};

router.post('/', limit(), async (req, res) => {
    if (!sameOrigin(req, 'x-war-play')) return res.status(403).end();
    // Not a player: off the production host, robots, excluded addresses. An
    // operator's own games are kept, marked.
    if (excludedSource(req)) return res.status(204).end();
    const play = normalize(req.body);
    if (!play) return res.status(400).json({ error: 'invalid play' });
    const r = replay(play);
    if (!r) return res.status(400).json({ error: 'log does not replay' });
    const operator = operatorOf(req);
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

// One battle played on its own page (war_battle_plays): its moves only,
// replayed on the engine's rehearsal of the war before it.
router.post('/battle', limit(), async (req, res) => {
    if (!sameOrigin(req, 'x-war-play')) return res.status(403).end();
    if (excludedSource(req)) return res.status(204).end();
    const play = normalizeBattle(req.body);
    if (!play) return res.status(400).json({ error: 'invalid play' });
    const r = replayBattle(play);
    if (!r) return res.status(400).json({ error: 'moves do not replay' });
    try {
        await db.query(`INSERT INTO war_battle_plays
            (run_id, scenario, battle, seq, rules, edition, moves, decisions, replayed, turn, ended, result, stats, narrow, operator, ended_at)
            VALUES ($1::uuid,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11,$12,$13::jsonb,$14,$15, CASE WHEN $11 THEN now() END)
            ON CONFLICT (run_id) DO UPDATE SET
                seq = EXCLUDED.seq, rules = EXCLUDED.rules, edition = EXCLUDED.edition, moves = EXCLUDED.moves,
                decisions = EXCLUDED.decisions, replayed = EXCLUDED.replayed, turn = EXCLUDED.turn,
                ended = EXCLUDED.ended, result = EXCLUDED.result, stats = EXCLUDED.stats,
                narrow = EXCLUDED.narrow, operator = war_battle_plays.operator OR EXCLUDED.operator,
                sends = war_battle_plays.sends + 1, updated_at = now(),
                ended_at = CASE WHEN EXCLUDED.ended THEN COALESCE(war_battle_plays.ended_at, now()) END
            WHERE war_battle_plays.seq < EXCLUDED.seq
              AND war_battle_plays.scenario = EXCLUDED.scenario AND war_battle_plays.battle = EXCLUDED.battle`,
        [play.runId, play.scenario, play.battle, play.seq, play.rules, play.edition ?? null, JSON.stringify(play.moves),
            play.moves.length, r.replayed, r.turn, r.ended, r.result, r.stats ? JSON.stringify(r.stats) : null, play.narrow, operatorOf(req)]);
        res.status(204).end();
    } catch (err) {
        console.error('[war battle plays]', err.code || 'unavailable');
        res.status(503).end();
    }
});

module.exports = router;
