// Checks a war game's scenario (public/js/war/scenarios/*.js; schema in
// dev_docs/war-engine.md) before it is played: every id it names exists,
// every condition speaks the condition language, every season fits the
// fronts and every battle board can be fought on. Returns the problems as
// strings, none when the scenario is sound.
const Cond = require('../../public/js/war/cond.js');
const Battle = require('../../public/js/war/battle.js');
const Art = require('../../public/js/war/art.js');

const VOICE_WHEN = /^(start|goal|flood|reserve|surrender|air|turn:\d+|turned:[\w-]+|feat:[\w-]+)$/;
const SOURCE = /^https:\/\//;

function checkScenario(D) {
    const problems = [];
    const need = (ok, what) => { if (!ok) problems.push(what); };
    const turnIds = new Set((D.turns || []).map(t => t.id));
    const fronts = D.fronts || {};
    const factions = D.factions || {};
    const cards = D.cards || {};
    const stats = Object.keys((D.economy && D.economy.stats) || {});

    // A condition: known keys only, and the ids it names exist.
    function cond(c, where) {
        if (!c) return;
        for (const [k, v] of Object.entries(c)) {
            if (!Cond.KEYS[k]) { problems.push(`${where}: unknown condition key ${k}`); continue; }
            if (k === 'not') cond(v, where);
            if (k === 'all' || k === 'any') v.forEach(x => cond(x, where));
            if (k === 'turn') [].concat(v).forEach(t => need(turnIds.has(t), `${where}: no season ${t}`));
            if (k === 'card' || k === 'played') need(cards[v], `${where}: no card ${v}`);
            if (k === 'stat') need(stats.includes(v[0]) && Cond.OPS[v[1]], `${where}: stat condition ${JSON.stringify(v)}`);
            if (k === 'reserve' || k === 'historyDiff') need(Cond.OPS[v[0]], `${where}: comparison ${JSON.stringify(v)}`);
        }
    }

    // ── The rules' parts ──
    for (const key of ['texts', 'economy', 'command', 'leaders', 'quality', 'mobilize', 'unrest', 'outcome', 'spoils', 'frontMoves', 'verdict', 'scoring', 'map', 'ui']) {
        need(D[key], `missing ${key}`);
    }
    if (problems.length) return problems;
    for (const k of ['leader', 'moved', 'momentumPart', 'pursuitPart', 'battleLost', 'battleQuick', 'hunger', 'momentumNote', 'pursuitNote']) need(typeof D.texts[k] === 'string', `texts.${k}`);
    need(D.economy.food && D.economy.food.per && stats.includes(D.economy.food.per[0]), 'economy.food.per names a stat');
    for (const p of D.economy.policies || []) for (const k of Object.keys(p.each || {})) need(stats.includes(k), `policy ${p.flag}: stat ${k}`);
    for (const k of D.economy.settleOrder || []) need(k === 'cities' || stats.includes(k), `settleOrder: ${k}`);
    need(stats.includes(D.command.stat), 'command.stat');
    need(D.command.tiers.some(([min]) => min <= 0), 'command.tiers reach 0');
    for (const f of D.leaders.fewer || []) cond(f.when, 'leaders.fewer');
    for (const m of D.quality.mods || []) cond(m.when, 'quality.mods');
    for (const src of D.mobilize.sources) {
        cond(src.when, `mobilize: ${src.label}`);
        if (src.stat) need(stats.includes(src.stat), `mobilize: stat ${src.stat}`);
        else if (src.fallen) need(fronts[src.fallen] && fronts[src.fallen].onLost, `mobilize: ${src.fallen} cannot fall`);
        else if (src.from) need(['deserted', 'unrest', 'captured'].includes(src.from), `mobilize: source ${JSON.stringify(src)}`);
        else need(Number.isInteger(src.n) && src.when, `mobilize: source ${JSON.stringify(src)}`);
    }
    for (const l of D.unrest.levels) cond(l.when, 'unrest');
    for (const k of ['gained', 'lost']) for (const s of Object.keys(D.frontMoves[k])) need(stats.includes(s), `frontMoves.${k}: ${s}`);
    for (const k of ['gained', 'lost']) for (const s of Object.keys((D.frontMoves.net || {})[k] || {})) need(stats.includes(s), `frontMoves.net.${k}: ${s}`);
    for (const u of D.economy.upkeep || []) for (const k of Object.keys(u.each || {})) need(stats.includes(k), `upkeep: stat ${k}`);
    for (const m of D.modifiers || []) {
        cond(m.when, `modifier ${m.label}`);
        for (const f of m.fronts || [m.front]) need(fronts[f], `modifier ${m.label}: front ${f}`);
        need(m.strength || m.pressure, `modifier ${m.label}: strength or pressure`);
    }
    for (const x of D.extraThreats || []) {
        cond(x.when, 'extraThreats');
        need(fronts[x.front], `extraThreats: front ${x.front}`);
        for (const t of Object.keys(x.pressure)) need(turnIds.has(t), `extraThreats: season ${t}`);
        for (const f of x.foes) need(factions[f], `extraThreats: foe ${f}`);
    }
    for (const st of D.scoring.stars) cond(st.when, `star ${st.id}`);
    for (const x of D.epilogue.texts) cond(x.when, 'epilogue');
    need(!D.epilogue.texts[D.epilogue.texts.length - 1].when, 'epilogue: the last text has no condition');

    // ── Fronts ──
    for (const id of D.frontOrder) need(fronts[id], `frontOrder: ${id}`);
    for (const [id, f] of Object.entries(fronts)) {
        need(D.frontOrder.includes(id), `front ${id} not in frontOrder`);
        need(f.history.length === D.turns.length, `front ${id}: history has ${f.history.length} seasons`);
        need(f.holders.length === D.turns.length, `front ${id}: holders has ${f.holders.length} seasons`);
        for (const line of f.history.concat(D.startLines[id])) need(line >= 0 && line <= f.cities.length, `front ${id}: line ${line}`);
        for (const h of f.holders) need(factions[h], `front ${id}: holder ${h}`);
        if (f.cap) {
            need(f.cap.reach < f.cities.length && f.cap.failed && f.cap.reached, `front ${id}: cap`);
            // A cap opened by a battle: a battle on this front, brought by the cap's choice.
            if (f.cap.battle) {
                const def = (D.battles || {})[f.cap.battle.id];
                need(def && def.front === id && !def.final && !def.reward, `front ${id}: cap battle ${f.cap.battle.id}`);
                cond(f.cap.battle.when, `front ${id}: cap battle`);
            }
            const reward = f.cap.reached && f.cap.reached.reward;
            if (reward) {
                cond(reward.when, `front ${id}: cap reward`);
                need(reward.note, `front ${id}: cap reward note`);
            }
        }
    }

    // ── Factions and cards ──
    const art = Art.create(D);
    for (const [id, f] of Object.entries(factions)) {
        need(f.name && f.short, `faction ${id}: name and short`);
        need(f.cries && f.cries.beaten && f.cries.surging, `faction ${id}: cries`);
        if (f.trait) cond(f.trait.when, `faction ${id} trait`);
        if (f.sign) need(Art.SIGNS[f.sign], `faction ${id}: sign ${f.sign}`);
        need(/^<svg class="cw-face"/.test(art.shield(id, f)), `faction ${id}: shield`);
    }
    for (const [id, c] of Object.entries(cards)) {
        for (const f of c.fronts || []) need(fronts[f], `card ${id}: front ${f}`);
        if (c.calm) for (const f of c.calm.fronts) need(fronts[f], `card ${id}: calm front ${f}`);
        if (c.needs) need(c.needs === 'unrest', `card ${id}: needs ${c.needs}`);
        cond(c.when, `card ${id}`);
    }

    // ── Seasons ──
    const drawn = new Set();
    for (const c of Object.values(cards)) if (c.advisor) drawn.add(c.advisor[1]);
    for (const [i, t] of D.turns.entries()) {
        const at = `season ${t.id || i}`;
        need(t.choice && t.choice.options.some(o => o.id === t.choice.history), `${at}: the fork's history`);
        // A season's incidents: one or a list, ids and answers unique within it.
        const incidents = [].concat(t.incident || []);
        const answers = incidents.flatMap(inc => inc.options.map(o => o.id));
        need(new Set(answers).size === answers.length, `${at}: incident answers share an id`);
        need(new Set(incidents.map(inc => inc.id)).size === incidents.length, `${at}: incidents share an id`);
        for (const inc of incidents) {
            need(inc.options.some(o => o.id === inc.history), `${at}: the incident ${inc.id}'s history`);
            cond(inc.when, `${at}: incident ${inc.id}`);
        }
        for (const [fid, th] of Object.entries(t.threats)) {
            need(fronts[fid], `${at}: threat on ${fid}`);
            for (const f of th.foes || []) need(factions[f], `${at}: foe ${f}`);
            if (th.who) drawn.add(th.who[1]);
        }
        for (const id of t.cards) need(cards[id], `${at}: card ${id}`);
        if (t.army) {
            for (const [id] of t.army) need(D.troops[id], `${at}: troop ${id}`);
            need(t.army.reduce((a, [, n]) => a + n, 0) === t.mobilize, `${at}: army adds up to mobilize`);
        }
        if (t.battle) need(D.battles[t.battle], `${at}: battle ${t.battle}`);
        for (const x of [t.choice, ...incidents]) if (x && x.who) drawn.add(x.who[1]);
        // A dilemma's debate: each line names a person (drawn) or a group.
        for (const x of [t.choice, ...incidents]) for (const v of (x && x.talk) || []) {
            need(v.text && (v.who || v.as), `${t.id}: a debate line needs a speaker and words`);
            if (v.who) drawn.add(v.who[1]);
        }
        for (const v of t.voices || []) {
            need(v.at === D.map.hubId || t.threats[v.at], `${at}: voice at ${v.at} does not fight`);
            if (v.by) need(t.threats[v.at] && t.threats[v.at].foes.includes(v.by), `${at}: ${v.by} does not attack ${v.at}`);
            else need(v.who, `${at}: a voice of the player's side names who`);
            if (v.src) need(v.src[0] && SOURCE.test(v.src[1]), `${at}: source of ${v.text}`);
            if (v.who) drawn.add(v.who[1]);
        }
    }

    // ── The map: every railway joins the hub's network ──
    {
        const key = ([lat, lng]) => `${lat},${lng}`;
        const { box, hub, railways = [] } = D.map;
        const reached = new Set([key(hub.slice(1))]);
        let grew = true;
        while (grew) {
            grew = false;
            for (const r of railways) {
                if (r.pts.some(p => reached.has(key(p))) && !r.pts.every(p => reached.has(key(p)))) { r.pts.forEach(p => reached.add(key(p))); grew = true; }
            }
        }
        for (const r of railways) {
            need(r.pts.length >= 2 && r.pts.every(([lat, lng]) => lat >= box.south && lat <= box.north && lng >= box.west && lng <= box.east), `railway ${r.id}: inside the map`);
            need(r.pts.every(p => reached.has(key(p))), `railway ${r.id}: joins the hub's network`);
        }
        // Operations: a season and phase that exist, a choice's flag or a
        // card that can set them off, a speaker with a portrait, and
        // every point inside the map.
        const inside = ([lat, lng]) => lat >= box.south && lat <= box.north && lng >= box.west && lng <= box.east;
        for (const [id, op] of Object.entries(D.map.operations || {})) {
            const at = `operation ${id}`;
            const turn = D.turns.find(t => t.id === op.turn);
            need(turn, `${at}: no season ${op.turn}`);
            need(['plan', 'review'].includes(op.phase), `${at}: phase ${op.phase}`);
            if (op.card) need(cards[op.card] && turn && turn.cards.includes(op.card), `${at}: card ${op.card} not in its season`);
            if (op.flag) need(D.turns.some(t => [t.choice].concat(t.incident || []).some(c => c.options.some(o => o.flag === op.flag))), `${at}: no choice sets ${op.flag}`);
            need(D.portraits[op.who[1]], `${at}: no portrait for ${op.who[1]}`);
            need(op.steps.length > 0, `${at}: no steps`);
            for (const [i, step] of op.steps.entries()) {
                need(step.date && step.text && step.draw.length, `${at} step ${i}: date, text and drawing`);
                for (const d of step.draw) {
                    const pts = d.path || [d.gather || d.clash].filter(Boolean);
                    need(pts.length && pts.every(inside), `${at} step ${i}: a mark outside the map`);
                    if (d.path) need(d.path.length >= 2 && ['strike', 'beaten', 'next'].includes(d.style) && (d.side === 'red' || ['white', 'interv'].includes(d.side)), `${at} step ${i}: arrow ${JSON.stringify(d.style)}`);
                }
            }
        }
        for (const [id, f] of Object.entries(fronts)) {
            for (const [name, lat, lng] of f.cities) need(lat >= box.south && lat <= box.north && lng >= box.west && lng <= box.east, `front ${id}: ${name} inside the map`);
        }
    }

    // ── Battles ──
    for (const [id, def] of Object.entries(D.battles || {})) {
        const at = `battle ${id}`;
        need(def.id === id, `${at}: id`);
        need(def.sides && def.sides.player && def.sides.enemy, `${at}: sides`);
        need(def.front === undefined || fronts[def.front], `${at}: front ${def.front}`);
        // A season's battle moves its front's strength (reward), or opens
        // its front's last cities (a cap's battle) and says what it decides.
        const opens = Object.values(fronts).some(f => f.cap && f.cap.battle && f.cap.battle.id === id);
        need(def.final || def.reward || (opens && def.stakes && def.outcome), `${at}: a season's battle has a reward`);
        cond(def.when, at);
        const rows = def.map.length, cols = def.map[0].length;
        need(def.map.every(r => r.length === cols), `${at}: map rows of one length`);
        for (const row of def.map) for (const ch of row) need(def.terrain[ch], `${at}: terrain ${ch}`);
        const inside = ([r, c]) => r >= 0 && c >= 0 && r < rows && c < cols;
        for (const g of def.goals) need(inside(g.at), `${at}: goal ${g.name}`);
        if (def.protect) need(inside(def.protect.at), `${at}: post ${def.protect.name}`);
        for (const [lid, l] of Object.entries(def.lines || {})) {
            need(l.rear && inside([l.rear.rows[0], l.rear.cols[0]]) && inside([l.rear.rows[1], l.rear.cols[1]]), `${at}: line ${lid} rear`);
            need(inside(l.fallback), `${at}: line ${lid} fallback`);
        }
        for (const [sid, s] of Object.entries(def.sectors || {})) need(s.alarm && ['r', 'c'].includes(s.alarm.axis), `${at}: sector ${sid} alarm`);
        const b = Battle.start(def, Object.fromEntries(def.units.filter(u => u.flag).map(u => [u.flag, true])), null);
        const ids = new Set();
        for (const u of def.units) {
            need(!ids.has(u.id), `${at}: unit ${u.id} twice`);
            ids.add(u.id);
            need(u.side === def.sides.player || u.side === def.sides.enemy, `${at}: ${u.id} side ${u.side}`);
            need(inside(u.at), `${at}: ${u.id} on the board`);
            const placed = b.units.find(x => x.id === u.id);
            need(placed && Battle.enterCost(b, placed, u.at[0], u.at[1]) < Infinity, `${at}: ${u.id} starts on ground it cannot enter`);
            if (u.rail && placed) need(Battle.reachable(b, placed).length > 0, `${at}: ${u.id}'s railway runs somewhere`);
            if (u.role) need(Battle.ROLES[u.role], `${at}: ${u.id} role ${u.role}`);
            if (u.line) need(def.lines[u.line], `${at}: ${u.id} line ${u.line}`);
            if (u.feat) need(Battle.FEATS[u.feat.kind], `${at}: ${u.id} feat kind ${u.feat.kind}`);
            if (u.card) need(cards[u.card], `${at}: ${u.id} card ${u.card}`);
            if (u.person) drawn.add(u.person[1]);
        }
        if (def.air) for (const uid of def.air.units) need(ids.has(uid), `${at}: air raid on ${uid}`);
        const speakers = new Set([...ids].concat(def.units.filter(u => u.feat && u.feat.unit).map(u => u.feat.unit.id)));
        const feats = new Set(def.units.filter(u => u.feat).map(u => u.feat.id));
        for (const v of def.voices || []) {
            need([].concat(v.unit).every(u => speakers.has(u)), `${at}: speaker of ${v.text}`);
            need(VOICE_WHEN.test(v.when), `${at}: voice when ${v.when}`);
            if (v.when.startsWith('feat:')) need(feats.has(v.when.slice(5)), `${at}: voice feat ${v.when}`);
            if (v.when.startsWith('turned:')) need(def.lines[v.when.slice(7)], `${at}: voice line ${v.when}`);
            need(v.who || v.by || v.face, `${at}: a picture for ${v.text}`);
            if (v.by) need(factions[v.by], `${at}: voice faction ${v.by}`);
            if (v.src) need(SOURCE.test(v.src[1]), `${at}: source of ${v.text}`);
            if (v.who) drawn.add(v.who[1]);
            if (v.face) drawn.add(v.face);
        }
    }

    // ── Portraits and the screen's words ──
    for (const id of drawn) need(art.people[id], `portrait for ${id}`);
    for (const h of D.ui.hud) need(stats.includes(h.stat), `ui.hud: stat ${h.stat}`);
    need(D.ui.hud.filter(h => h.command).length === 1, 'ui.hud: one stat sets command');
    for (const k of Object.keys(D.ui.cardStats)) need(stats.includes(k), `ui.cardStats: ${k}`);
    for (const k of ['player', 'playerUnits', 'enemy', 'unit', 'leader', 'food', 'unrest', 'save']) need(D.ui[k], `ui.${k}`);
    need(D.ui.aria && D.ui.aria.calendar && D.ui.aria.stats && D.ui.aria.army, 'ui.aria');
    need(D.map.legend && D.map.historyLegend, 'map legends');
    return problems;
}

module.exports = { checkScenario };
