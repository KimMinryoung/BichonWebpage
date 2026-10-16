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
// scenario, save: { version, rules, log }, narrow }.
function normalize(body) {
    if (!body || typeof body.runId !== 'string' || !UUID.test(body.runId)) return null;
    if (!Number.isInteger(body.attempt) || body.attempt < 0 || body.attempt > 100) return null;
    if (!Number.isInteger(body.seq) || body.seq < 0 || body.seq > 1e6) return null;
    if (typeof body.scenario !== 'string' || !Object.hasOwn(SCENARIOS, body.scenario)) return null;
    const save = body.save;
    if (!save || !Number.isInteger(save.version) || !Number.isInteger(save.rules) || !Array.isArray(save.log)) return null;
    if (save.log.length > MAX_DECISIONS || !save.log.every(e => Array.isArray(e) && typeof e[0] === 'string' && e.length <= 8)) return null;
    return { runId: body.runId, attempt: body.attempt, seq: body.seq, scenario: body.scenario,
        save: { version: save.version, rules: save.rules, log: save.log }, narrow: body.narrow === true };
}

// What the rules make of the log: null when it does not replay at all.
function replay(play) {
    const G = engineOf(play.scenario);
    if (play.save.rules < 1 || play.save.rules > G.RULES) return null;
    const s = G.restore(play.save);
    if (!s) return null;
    const ended = s.phase === 'done';
    return {
        replayed: s.log.length, turn: s.turn, phase: s.phase, ended,
        outcome: ended && s.outcome ? s.outcome.kind || null : null,
        stars: ended && s.outcome && Array.isArray(s.outcome.stars) ? s.outcome.stars.filter(x => x.got).length : null,
        stats: Object.assign({}, s.stats, { food: s.food, lines: s.lines }),
    };
}

module.exports = { normalize, replay, MAX_DECISIONS };
