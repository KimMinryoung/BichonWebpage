// Play logs of the war games: what a browser sends (routes/war-plays.js) is
// checked here and replayed through the game's own engine, so the stored
// turn, phase and outcome are what the rules decided, not what the browser
// said. The log itself is kept as sent (a replay that stops early, an old
// save's leftovers, is told by decisions > replayed).
const { SCENARIOS } = require('./war-map');
const WarEngine = require('../public/js/war/engine');

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_DECISIONS = 6000;
const engines = new Map();
const engineOf = id => {
    if (!engines.has(id)) engines.set(id, WarEngine.create(SCENARIOS[id]));
    return engines.get(id);
};

// A play report, or null when it is not one: { runId, attempt, seq,
// scenario, save: { version, rules, edition?, log }, narrow }. The
// scenario's data edition (engine.js) has no column: the replay keeps it in
// stats.edition.
function normalize(body) {
    if (!body || typeof body.runId !== 'string' || !UUID.test(body.runId)) return null;
    if (!Number.isInteger(body.attempt) || body.attempt < 0 || body.attempt > 100) return null;
    if (!Number.isInteger(body.seq) || body.seq < 0 || body.seq > 1e6) return null;
    if (typeof body.scenario !== 'string' || !Object.hasOwn(SCENARIOS, body.scenario)) return null;
    const save = body.save;
    if (!save || !Number.isInteger(save.version) || !Number.isInteger(save.rules) || !Array.isArray(save.log)) return null;
    if (save.edition !== undefined && !Number.isInteger(save.edition)) return null;
    if (save.log.length > MAX_DECISIONS || !save.log.every(e => Array.isArray(e) && typeof e[0] === 'string' && e.length <= 8)) return null;
    return { runId: body.runId, attempt: body.attempt, seq: body.seq, scenario: body.scenario,
        save: Object.assign({ version: save.version, rules: save.rules }, save.edition !== undefined ? { edition: save.edition } : {}, { log: save.log }), narrow: body.narrow === true };
}

// What the rules make of the log: null when it does not replay at all.
function replay(play) {
    const G = engineOf(play.scenario);
    if (play.save.rules < 1 || play.save.rules > G.RULES) return null;
    if (play.save.edition !== undefined && (play.save.edition < 1 || play.save.edition > G.EDITION)) return null;
    const s = G.restore(play.save);
    if (!s) return null;
    const ended = s.phase === 'done';
    return {
        replayed: s.log.length, turn: s.turn, phase: s.phase, ended,
        outcome: ended && s.outcome ? s.outcome.kind || null : null,
        stars: ended && s.outcome && Array.isArray(s.outcome.stars) ? s.outcome.stars.filter(x => x.got).length : null,
        stats: Object.assign({}, s.stats, { food: s.food, lines: s.lines }, G.DATA.edition ? { edition: s.edition } : {}),
    };
}

// ── One battle on its own (war_battle_plays) ──

// The rehearsal each battle report replays on, made once per battle and
// rules generation (the engine is deterministic) and kept as a save.
const MAX_MOVES = 1500;
const rehearsals = new Map();
function rehearsalOf(scenario, battle, rules) {
    const key = `${scenario}:${battle}:${rules}`;
    if (!rehearsals.has(key)) {
        const G = engineOf(scenario);
        const s = G.rehearse(battle, rules);
        rehearsals.set(key, s ? G.serialize(s) : null);
    }
    return rehearsals.get(key);
}

// A battle report, or null: { runId, seq, scenario, battle, rules,
// edition?, moves: the battle's own log entries, each 'b:…' }, narrow.
function normalizeBattle(body) {
    if (!body || typeof body.runId !== 'string' || !UUID.test(body.runId)) return null;
    if (!Number.isInteger(body.seq) || body.seq < 0 || body.seq > 1e6) return null;
    if (typeof body.scenario !== 'string' || !Object.hasOwn(SCENARIOS, body.scenario)) return null;
    const D = SCENARIOS[body.scenario];
    if (typeof body.battle !== 'string' || !D.promo || !Object.hasOwn(D.promo.battles, body.battle)) return null;
    if (!Number.isInteger(body.rules)) return null;
    if (body.edition !== undefined && !Number.isInteger(body.edition)) return null;
    const moves = body.moves;
    if (!Array.isArray(moves) || moves.length > MAX_MOVES
        || !moves.every(e => Array.isArray(e) && typeof e[0] === 'string' && e[0].startsWith('b:') && e.length <= 8)) return null;
    return Object.assign({ runId: body.runId, seq: body.seq, scenario: body.scenario, battle: body.battle, rules: body.rules },
        body.edition !== undefined ? { edition: body.edition } : {}, { moves, narrow: body.narrow === true });
}

// The moves played on the battle's rehearsal: null when the rules
// generation is unknown or the battle is not reached under it. A move the
// rules refuse ends the replay there (replayed < decisions).
function replayBattle(play) {
    const G = engineOf(play.scenario);
    if (play.rules < 1 || play.rules > G.RULES) return null;
    if (play.edition !== undefined && play.edition !== (G.DATA.edition ? G.EDITION : undefined)) return null;
    const base = rehearsalOf(play.scenario, play.battle, play.rules);
    const s = base && G.restore(base);
    if (!s || s.phase !== 'battle') return null;
    let replayed = 0;
    for (const move of play.moves) {
        if (s.phase !== 'battle' || !G.act(s, ...move)) break;
        replayed++;
    }
    const fought = s.battles[play.battle];
    const ended = Boolean(fought && !fought.assumed);
    return {
        replayed, turn: ended ? fought.turns : s.battle.turn, ended,
        result: ended ? fought.result : null,
        stats: ended ? fought : null,
    };
}

module.exports = { normalize, replay, normalizeBattle, replayBattle, MAX_DECISIONS, MAX_MOVES };
