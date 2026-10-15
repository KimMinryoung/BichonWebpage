/* global module, require */
/* The campaign engine of the war games: seasons on a strategic map, fronts
   as chains of cities, divisions, leaders and cards sent against each
   front's pressure, a fork and an incident each season, the war compared
   with history's. Deterministic, no DOM: the same decisions always give
   the same war, so a save is the decision log and restore() replays it.

   WarEngine.create(scenario) gives a game for one scenario (its data and
   rules; schema in dev_docs/war-engine.md, the first one is
   public/js/war/scenarios/civil-war.js). Works in the browser (window.WarEngine)
   and in Node (scripts/test-*.js).

   Rules generations (s.rules, kept in the save so an old save replays as
   it was played): 1 the base; 2 divisions moved by rail between fronts
   bring half their share and the plan opens with last season's placements;
   3 the battles' feats and surrenders, and the spoils of a broken enemy. */
(function (root) {
    'use strict';

    const node = typeof module === 'object' && module.exports;
    const Battle = node ? require('./battle.js') : root.WarBattle;
    const Cond = node ? require('./cond.js') : root.WarCond;

    const RULES = 3;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const round1 = v => Math.round(v * 10) / 10;
    const signed = n => (n < 0 ? '−' : '+') + Math.abs(n);
    // A text with {name} slots filled from vars.
    const fmt = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));

    function create(D) {
        const X = D.texts;
        const O = D.outcome;
        const ECON = D.economy;
        const FOOD = ECON.food;
        const STATS = Object.keys(ECON.stats);
        const statRange = id => [ECON.stats[id].min ?? 0, ECON.stats[id].max ?? 100];
        // The order the season's stat changes land in; 'cities' is where a
        // city's fall or recapture applies its effects (onLost).
        const SETTLE_ORDER = ECON.settleOrder || STATS.concat('cities');

        function commandOf(value) {
            return D.command.tiers.find(([min]) => value >= min)[1];
        }

        // rules: the save's generation (see above), so its logged orders
        // replay as they were.
        function start(rules = RULES) {
            const stats = {};
            for (const id of STATS) stats[id] = ECON.stats[id].start;
            const s = {
                version: D.saveVersion, rules, turn: 0, phase: 'plan', lastAlloc: {},
                stats, food: FOOD.start,
                flags: {}, lines: Object.assign({}, D.startLines),
                fallen: {}, deserted: 0, unrest: 0, captured: 0, momentum: {}, pursuit: {}, used: {},
                records: [], log: [], battle: null, battles: {}, outcome: null,
            };
            enterTurn(s);
            return s;
        }

        function turnData(s) { return D.turns[s.turn]; }

        // A condition (war/cond.js) asked of the war now.
        function when(s, cond, ctx) {
            return Cond.holds(s, cond, Object.assign({ turnId: turnData(s).id, free: s.plan ? free(s) : 0 }, ctx));
        }

        // The season's threats, plus those a choice brought on (a beaten
        // enemy regrouping where the pursuit stopped): an extra threat
        // fills a front the season leaves quiet, for the seasons it names.
        function threatsOf(s) {
            const t = turnData(s);
            const threats = Object.assign({}, t.threats);
            for (const x of D.extraThreats || []) {
                if (x.pressure[t.id] && !threats[x.front] && when(s, x.when)) {
                    threats[x.front] = { pressure: x.pressure[t.id], foes: x.foes, text: x.text, who: x.who };
                }
            }
            return threats;
        }

        function activeFronts(s) {
            const threats = threatsOf(s);
            return D.frontOrder.filter(id => threats[id]);
        }

        // A division's quality: the base, and what choices made of it.
        function quality(s) {
            let q = D.quality.base;
            for (const m of D.quality.mods || []) q += when(s, m.when) ? m.add : 0;
            return q;
        }

        // Where the season's divisions come from, for the army panel.
        function mobilizeSources(s) {
            const sources = [];
            const add = (label, n) => { if (n) sources.push({ label, n }); };
            for (const src of D.mobilize.sources) {
                if (src.stat) {
                    const value = s.stats[src.stat];
                    add(fmt(src.label, { value }), Math.round((value - src.base) / src.per));
                } else if (src.fallen) add(src.label, s.fallen[src.fallen] ? src.n : 0);
                else if (src.from === 'deserted') add(src.label, -s.deserted);
                else if (src.from === 'unrest') add(src.label, -s.unrest);
                else if (src.from === 'captured') add(src.label, s.captured);
                else throw new Error(`unknown mobilize source ${JSON.stringify(src)}`);
            }
            return sources;
        }

        function leadersOf(s, t) {
            let n = t.commissars;
            for (const f of D.leaders.fewer || []) if (when(s, f.when)) n -= f.n;
            return Math.max(0, n);
        }

        function enterTurn(s) {
            const t = turnData(s);
            const sources = mobilizeSources(s);
            let divisions = t.mobilize + sources.reduce((a, x) => a + x.n, 0);
            if (divisions < D.mobilize.min) { sources.push({ label: D.mobilize.minLabel, n: D.mobilize.min - divisions }); divisions = D.mobilize.min; }
            s.plan = null;
            s.plan = {
                divisions, command: commandOf(s.stats[D.command.stat]), commissars: leadersOf(s, t), sources,
                alloc: {}, commissar: {}, cards: [], choice: null, response: null,
            };
            for (const id of activeFronts(s)) { s.plan.alloc[id] = 0; s.plan.commissar[id] = false; }
            // The divisions stay where they fought last season unless moved:
            // the plan opens with last season's placements on the fronts still
            // fighting, trimmed from the largest when the army shrank.
            if (s.rules >= 2) {
                for (const id of activeFronts(s)) s.plan.alloc[id] = s.lastAlloc[id] || 0;
                trim(s, divisions);
            }
            s.phase = 'plan';
        }

        // Under rules 2 the plan opens full, so a pool that shrinks (a choice,
        // an answer or a card that takes divisions) takes them back from the
        // largest placement first instead of refusing. False when it cannot.
        function trim(s, pool) {
            if (allocated(s) <= pool) return true;
            if (s.rules < 2 || pool < 0) return false;
            while (allocated(s) > pool) {
                const top = Object.keys(s.plan.alloc).sort((a, b) => s.plan.alloc[b] - s.plan.alloc[a])[0];
                s.plan.alloc[top] -= 1;
            }
            return true;
        }

        // Where each front's divisions come from under the plan: kept there
        // from last season (stay), newly raised or out of reserve (fresh), or
        // moved by rail from another front (moved). Fresh divisions go first to
        // the front furthest short (by the margin a moved division would leave),
        // so the player never loses by the order they were placed in.
        function transfersOf(s, margins) {
            const ids = activeFronts(s);
            const out = {};
            for (const id of ids) {
                const d = s.plan.alloc[id];
                const stay = s.rules >= 2 ? Math.min(d, s.lastAlloc[id] || 0) : d;
                out[id] = { stay, fresh: 0, moved: d - stay };
            }
            if (s.rules < 2) return out;
            const held = Object.values(s.lastAlloc).reduce((a, b) => a + b, 0);
            let fresh = Math.max(0, s.plan.divisions - held);
            while (fresh > 0) {
                const open = ids.filter(id => out[id].moved > 0);
                if (!open.length) break;
                open.sort((a, b) => (margins[a] - out[a].moved) - (margins[b] - out[b].moved) || ids.indexOf(a) - ids.indexOf(b));
                out[open[0]].moved -= 1;
                out[open[0]].fresh += 1;
                fresh -= 1;
            }
            return out;
        }

        function allocated(s) {
            return Object.values(s.plan.alloc).reduce((a, b) => a + b, 0);
        }

        function free(s) { return s.plan.divisions - allocated(s); }

        function commissarsUsed(s) {
            return Object.values(s.plan.commissar).filter(Boolean).length;
        }

        // ── Decisions (each is logged; restore replays them) ──

        function setAlloc(s, front, n) {
            if (s.phase !== 'plan' || !(front in s.plan.alloc) || !Number.isInteger(n) || n < 0) return false;
            const others = allocated(s) - s.plan.alloc[front];
            if (others + n > s.plan.divisions) return false;
            s.plan.alloc[front] = n;
            return true;
        }

        function setCommissar(s, front, on) {
            if (s.phase !== 'plan' || !(front in s.plan.commissar)) return false;
            if (on && !s.plan.commissar[front] && commissarsUsed(s) >= s.plan.commissars) return false;
            s.plan.commissar[front] = Boolean(on);
            return true;
        }

        function cardOffered(s, id) {
            const card = D.cards[id];
            if (!card || !turnData(s).cards.includes(id)) return false;
            if (card.flag && s.flags[card.flag]) return false;
            if (card.requires && !s.flags[card.requires]) return false;
            if (barred(s, id)) return false;
            return true;
        }

        // A card an incident's answer rules out: for the rest of the war once
        // the season is sent, and already while that answer is chosen.
        function barred(s, id) {
            if (s.flags['bar:' + id]) return true;
            const r = responseOf(s);
            return Boolean(r && r.bars && r.bars.includes(id));
        }

        // The season's incident and the answer chosen to it, if any.
        function incidentOf(s) { return turnData(s).incident || null; }
        function responseOf(s) {
            const inc = incidentOf(s);
            return inc && s.plan && s.plan.response ? inc.options.find(o => o.id === s.plan.response) : null;
        }

        // A card's effect on a stat; one that escalates costs more each time
        // it is played (an amnesty, as deserters learn that desertion goes
        // unpunished).
        function cardStat(s, card, id, stat) {
            const base = card[stat] || 0;
            return card.escalates ? base * ((s.used[id] || 0) + 1) : base;
        }

        function canPlay(s, id, target) {
            const card = D.cards[id];
            if (s.phase !== 'plan' || !cardOffered(s, id)) return false;
            if (s.plan.cards.some(c => c.id === id)) return false;
            if (s.plan.command < card.cost) return false;
            if (card.target === 'front' && !(target in s.plan.alloc)) return false;
            if (card.fronts && !card.fronts.includes(target)) return false;
            if (card.divisions < 0 && (s.rules < 2 ? free(s) : s.plan.divisions) < -card.divisions) return false;
            if (card.needs === 'unrest' && !s.unrest) return false;
            return true;
        }

        // Divisions a card adds to this season's pool when played: its own,
        // or for one that needs unrest (the Cheka) half of those the risings
        // tie down.
        function cardDivisions(s, card) {
            return card.needs === 'unrest' ? Math.ceil(s.unrest / 2) : (card.divisions || 0);
        }

        function playCard(s, id, target) {
            if (!canPlay(s, id, target)) return false;
            const card = D.cards[id];
            s.plan.command -= card.cost;
            s.plan.divisions += cardDivisions(s, card);
            trim(s, s.plan.divisions);
            s.plan.cards.push({ id, target: card.target === 'front' ? target : null });
            return true;
        }

        function unplayCard(s, id) {
            if (s.phase !== 'plan') return false;
            const i = s.plan.cards.findIndex(c => c.id === id);
            if (i < 0) return false;
            const card = D.cards[id];
            // Taking back recruits the player has already sent to a front would
            // leave the allocation over the pool.
            const added = cardDivisions(s, card);
            if (added > 0 && !trim(s, s.plan.divisions - added)) return false;
            s.plan.cards.splice(i, 1);
            s.plan.command += card.cost;
            s.plan.divisions -= added;
            return true;
        }

        function choose(s, optionId) {
            if (s.phase !== 'plan') return false;
            const opt = turnData(s).choice.options.find(o => o.id === optionId);
            if (!opt) return false;
            const prev = s.plan.choice && turnData(s).choice.options.find(o => o.id === s.plan.choice);
            const delta = (prev ? -(prev.divisions || 0) : 0) + (opt.divisions || 0);
            if (!trim(s, s.plan.divisions + delta)) return false;
            s.plan.divisions += delta;
            s.plan.choice = optionId;
            return true;
        }

        // An incident of the season is answered like the fork: its divisions
        // join or leave the pool, and an answer that rules out a card in play
        // waits until the card is taken back.
        function respond(s, optionId) {
            const inc = incidentOf(s);
            if (s.phase !== 'plan' || !inc) return false;
            const opt = inc.options.find(o => o.id === optionId);
            if (!opt) return false;
            if ((opt.bars || []).some(id => s.plan.cards.some(c => c.id === id))) return false;
            const prev = responseOf(s);
            const delta = (prev ? -(prev.divisions || 0) : 0) + (opt.divisions || 0);
            if (!trim(s, s.plan.divisions + delta)) return false;
            s.plan.divisions += delta;
            s.plan.response = optionId;
            return true;
        }

        // ── Settlement ──

        // The strength each active front would bring, and the pressure against
        // it, under the current plan. Shared by the forecast and the settlement.
        function forecast(s) {
            const supply = supplyOf(s);
            // A division's share: its quality, less what hunger takes.
            const perDivision = quality(s) * (FOOD.fed + (1 - FOOD.fed) * supply.ratio);
            // Fresh divisions go where they matter most, judged on the margin
            // before the railway's cost.
            const before = forecastWith(s, null, perDivision);
            const transfers = transfersOf(s, Object.fromEntries(Object.entries(before).map(([id, f]) => [id, f.margin])));
            return { fronts: forecastWith(s, transfers, perDivision), supply };
        }

        // Cards whose calm (fewer enemies willing to fight on some fronts)
        // holds this season: played now, or played last season.
        function calmCards(s) {
            return Object.keys(D.cards).filter(id => D.cards[id].calm
                && (s.plan.cards.some(c => c.id === id) || s.flags['calm:' + id] === s.turn));
        }

        // transfers: where each front's divisions come from (transfersOf), or
        // null to count every division whole.
        //
        // The order things are added is the order the card lists them:
        // strength — moved divisions, the leader, cards on the front, the
        // scenario's modifiers, the season's battle, the modifiers marked
        // afterBattle; pressure — the threat, the enemy's momentum, the
        // pursuit, the pressure modifiers, the incident's answer, the
        // attackers' traits, a calm.
        function forecastWith(s, transfers, perDivision) {
            const threats = threatsOf(s);
            const out = {};
            for (const id of activeFronts(s)) {
                const threat = threats[id];
                const d = s.plan.alloc[id];
                const tr0 = transfers ? transfers[id] : { stay: d, fresh: 0, moved: 0 };
                let strength = d * perDivision;
                // What else adds to (or takes from) the strength, as words and
                // as { kind, label, v } for the card's marks.
                const parts = [], bonuses = [];
                const add = (kind, label, v) => {
                    strength += v;
                    bonuses.push({ kind, label, v });
                    parts.push(`${label} ${v < 0 ? '−' : '+'}${Math.abs(v)}`);
                };
                // Divisions moved by rail from another front bring a share.
                if (tr0.moved) add('rail', fmt(X.moved, { n: tr0.moved }), -round1(tr0.moved * perDivision * (1 - O.transfer)));
                if (s.plan.commissar[id]) add('commissar', X.leader, D.leaders.strength);
                for (const c of s.plan.cards) {
                    const card = D.cards[c.id];
                    if (card.bonus && c.target === id) add(c.id, card.title, card.bonus);
                }
                let pressure = threat.pressure;
                const pressureParts = [];
                if (s.momentum[id]) { pressure += s.momentum[id]; pressureParts.push(fmt(X.momentumPart, { n: s.momentum[id] })); }
                const pursuitIn = Math.min(pressure, s.pursuit[id] || 0);
                if (pursuitIn) { pressure -= pursuitIn; pressureParts.push(fmt(X.pursuitPart, { n: pursuitIn })); }
                const modify = late => {
                    for (const m of D.modifiers || []) {
                        if (Boolean(m.afterBattle) !== late || !(m.fronts || [m.front]).includes(id) || !when(s, m.when, { front: id })) continue;
                        if (m.strength) add('other', m.label, m.strength);
                        if (m.pressure) { pressure += m.pressure; pressureParts.push(`${m.label} ${signed(m.pressure)}`); }
                    }
                };
                modify(false);
                // A battle fought this season on this front.
                const battle = battleResult(s, id);
                if (battle) add('battle', battle.label, battle.v);
                modify(true);
                // The season's incident, as answered.
                const answer = responseOf(s);
                if (answer && answer.pressure && answer.pressure[id]) {
                    pressure += answer.pressure[id];
                    pressureParts.push(`${incidentOf(s).title} ${signed(answer.pressure[id])}`);
                }
                // The attackers' traits: what each brings, and what blunts it.
                const traits = traitsOn(s, id, threat);
                for (const tr of traits.filter(x => x.on)) {
                    pressure += tr.by;
                    pressureParts.push(`${tr.short}: ${tr.name} ${signed(tr.by)}`);
                }
                // A calm on the front: this season and the next.
                for (const cid of calmCards(s)) {
                    const calm = D.cards[cid].calm;
                    if (!calm.fronts.includes(id) || pressure <= 0) continue;
                    const by = Math.min(pressure, calm.by);
                    pressure -= by;
                    pressureParts.push(`${D.cards[cid].title} −${by}`);
                }
                const margin = strength - pressure;
                const result = outcomeOf(s, id, margin);
                out[id] = {
                    divisions: d, stay: tr0.stay, fresh: tr0.fresh, moved: tr0.moved, perDivision: Math.round(perDivision * 1000) / 1000, bonuses, momentumIn: s.momentum[id] || 0, pursuitIn,
                    strength: round1(strength), pressure, margin: round1(margin), parts, pressureParts, traits,
                    change: result.change, momentum: result.overflow * O.momentum, pursuit: result.pursuit * O.pursuit,
                };
            }
            return out;
        }

        // The traits of a front's attackers under the plan: each with whether
        // its condition (when) holds (on) and the pressure it moves. A trait
        // without a condition (an occupier, Poland's Warsaw) is told, not
        // counted.
        function traitsOn(s, id, threat) {
            return (threat.foes || []).filter(f => D.factions[f].trait).map(f => {
                const tr = D.factions[f].trait;
                const on = Boolean(tr.when) && when(s, tr.when, { front: id });
                return { foe: f, short: D.factions[f].short, name: tr.name, rule: tr.rule || null, by: tr.by || 0, counted: Boolean(tr.when), on };
            });
        }

        // A front moves as it did in history this season when the strength meets
        // the pressure; every STEP above it gains one more city (one at most),
        // every STEP short (beyond SLACK) loses one more. Cities lost beyond the
        // last are the overflow: the enemy's momentum, carried into the front's
        // next fight as MOMENTUM pressure each. Every STEP beyond the one that
        // gains the city is pursuit (CHASE at most): the beaten enemy chased,
        // PURSUIT pressure off the front's next fight each.
        function outcomeOf(s, id, margin) {
            return outcomeAt(id, s.lines[id], s.turn, margin, s.plan.choice);
        }

        function outcomeAt(id, line, turn, margin, choice) {
            const front = D.fronts[id];
            const max = front.cities.length;
            const was = turn ? front.history[turn - 1] : D.startLines[id];
            const historical = front.history[turn] - was;
            const bonus = margin >= 0 ? Math.min(1, Math.floor(margin / O.step)) : -Math.ceil((-margin - O.slack) / O.step);
            const raw = line + historical + bonus;
            const overflow = bonus < 0 ? Math.min(-bonus, Math.max(0, -raw)) : 0;
            const pursuit = clamp(Math.floor(margin / O.step) - 1, 0, O.chase);
            // A front's last cities may be out of reach (cap.reach): only the
            // choice that unlocks them reaches them, and only with its margin.
            const cap = front.cap;
            if (cap) {
                if (choice === cap.unlock.choice && margin >= cap.unlock.margin) return { change: max - line, overflow: 0, pursuit };
                return { change: clamp(raw, 0, cap.reach) - line, overflow, pursuit };
            }
            return { change: clamp(raw, 0, max) - line, overflow, pursuit };
        }

        // Every strength at which a front's result changes, from 0 up: bands of
        // { from, to (null for the top), change, overflow, pursuit }, where a
        // strength in [from, to) gives that result. Built from outcomeAt at the
        // margins where its bonus steps (−SLACK − STEP·k, 0, STEP·k, a cap's
        // unlocking margin), so the card's bar cannot disagree with the
        // settlement.
        const capMargins = [...new Set(Object.values(D.fronts).filter(f => f.cap).map(f => f.cap.unlock.margin))];
        function outcomeBands(id, line, turn, pressure, choice) {
            const cuts = capMargins.concat(-O.slack);
            for (let k = 1; k <= O.chase + 1; k++) cuts.push(O.step * k);
            for (let m = -O.slack - O.step; m > -pressure; m -= O.step) cuts.push(m);
            const from = [...new Set(cuts.map(m => pressure + m).filter(v => v > 0))].sort((a, b) => a - b);
            from.unshift(0);
            const bands = [];
            for (let i = 0; i < from.length; i++) {
                const r = outcomeAt(id, line, turn, from[i] - pressure, choice);
                const last = bands[bands.length - 1];
                if (last && last.change === r.change && last.overflow === r.overflow && last.pursuit === r.pursuit) continue;
                if (last) last.to = from[i];
                bands.push({ from: from[i], to: null, change: r.change, overflow: r.overflow, pursuit: r.pursuit });
            }
            return bands;
        }

        // Divisions kept back in reserve eat less (FOOD.reserveEats).
        function supplyOf(s) {
            const need = allocated(s) + Math.ceil(free(s) * FOOD.reserveEats);
            const income = foodIncome(s, true);
            const have = s.food + income;
            return { need, have, ratio: need ? clamp(have / need, 0, 1) : 1, income };
        }

        // Food this season: a base, a share that grows with a stat (the
        // peasants' trust), and what the season's policies and cards change.
        // withPlan counts this plan's cards and choice.
        function foodIncome(s, withPlan) {
            const flags = Object.assign({}, s.flags);
            if (withPlan) Object.assign(flags, choiceFlags(s));
            let g = FOOD.base + Math.floor(s.stats[FOOD.per[0]] / FOOD.per[1]);
            for (const p of ECON.policies || []) if (flags[p.flag]) g += p.food || 0;
            if (withPlan) {
                for (const c of s.plan.cards) g += D.cards[c.id].food || 0;
            }
            return Math.max(0, g);
        }

        function choiceFlags(s) {
            const opt = s.plan.choice && turnData(s).choice.options.find(o => o.id === s.plan.choice);
            return opt && opt.flag ? { [opt.flag]: true } : {};
        }

        function canSettle(s) {
            return s.phase === 'plan' && Boolean(s.plan.choice) && (!incidentOf(s) || Boolean(s.plan.response));
        }

        // The result of a battle fought this season, before the settlement, on
        // the front, as a strength: nothing when it went as history did.
        function battleResult(s, id) {
            const def = battleOf(s);
            const r = def && !def.final && def.front === id && s.battles[def.id];
            if (!r) return null;
            const { quick, quickBy, lostBy } = def.reward;
            if (r.result !== 'won') return { label: fmt(X.battleLost, { title: def.title }), v: lostBy };
            return r.turns !== null && r.turns <= quick ? { label: fmt(X.battleQuick, { title: def.title, quick }), v: quickBy } : null;
        }

        // Adds an option's or a card's stat effects (its keys named after
        // stats) to the season's changes.
        function addStats(delta, obj, of = k => obj[k] || 0) {
            for (const k of STATS) delta[k] += of(k);
        }

        // Sending a season with a battle on one of its fronts fights it first
        // (the plan, frozen, musters it); its end settles the season.
        function settle(s) {
            if (!canSettle(s)) return false;
            const t = turnData(s);
            const def = battleOf(s);
            if (def && !def.final && !s.battles[def.id]) {
                const m = musterOf(s);
                s.phase = 'battle';
                s.battle = Battle.start(def, Object.assign({}, s.flags, choiceFlags(s)), m ? m.muster : null, { rules: s.rules });
                return true;
            }
            const fc = forecast(s);
            const muster = def && def.final ? musterOf(s, fc).muster : null;
            const opt = t.choice.options.find(o => o.id === s.plan.choice);
            const before = Object.assign({}, s.lines);
            const commandBefore = s.stats[D.command.stat];
            const notes = [];

            // Food: the season's income, then the army eats.
            s.food = Math.max(0, fc.supply.have - fc.supply.need);
            if (fc.supply.ratio < FOOD.hunger) notes.push(X.hunger);
            s.deserted = fc.supply.ratio < FOOD.hunger ? Math.ceil((1 - fc.supply.ratio) * FOOD.desert) : 0;

            // Lines move.
            const fronts = {};
            for (const [id, f] of Object.entries(fc.fronts)) {
                s.lines[id] += f.change;
                s.momentum[id] = f.momentum;
                s.pursuit[id] = f.pursuit;
                if (f.momentum) notes.push(fmt(X.momentumNote, { front: D.fronts[id].name, n: f.momentum }));
                if (f.pursuit) notes.push(fmt(X.pursuitNote, { front: D.fronts[id].name, n: f.pursuit }));
                fronts[id] = Object.assign({}, f, { before: before[id], after: s.lines[id], history: D.fronts[id].history[s.turn] });
            }

            // Fronts not fought this season move as history did.
            for (const id of D.frontOrder) {
                if (fronts[id]) continue;
                const front = D.fronts[id];
                const was = s.turn ? front.history[s.turn - 1] : D.startLines[id];
                s.lines[id] = clamp(s.lines[id] + front.history[s.turn] - was, 0, front.cities.length);
            }

            // A front's cap: the unlocking choice that fell short of the last
            // cities costs divisions; reaching them is told.
            for (const id of D.frontOrder) {
                const cap = D.fronts[id].cap;
                if (!cap || !fronts[id]) continue;
                const max = D.fronts[id].cities.length;
                if (s.plan.choice === cap.unlock.choice && fronts[id].after < max) {
                    s.deserted += cap.failed.deserted;
                    notes.push(cap.failed.note);
                } else if (fronts[id].after === max) {
                    notes.push(cap.reached.note);
                }
            }

            // Spoils: where the enemy broke, what he left behind; the prisoners
            // of a battle's surrenders. Food now, the men next season.
            const spoils = [];
            if (s.rules >= 3) {
                for (const [id, f] of Object.entries(fronts)) {
                    if (!f.pursuit) continue;
                    const foe = (threatsOf(s)[id].foes || [])[0] || null;
                    spoils.push({ front: id, foe, what: foe ? D.factions[foe].spoils : null, food: D.spoils.food, divisions: 1 });
                }
                const fought = def && !def.final && s.battles[def.id];
                if (fought && fought.captured) spoils.push({ battle: def.id, captured: fought.captured, food: 0, divisions: 1 });
            }
            s.captured = Math.min(D.spoils.max, spoils.reduce((a, x) => a + x.divisions, 0));
            s.food += spoils.reduce((a, x) => a + x.food, 0);

            // Stats from cards, the choice, the answer and the season's policies.
            const flagsNow = Object.assign({}, s.flags, choiceFlags(s));
            const delta = Object.fromEntries(STATS.map(k => [k, 0]));
            for (const c of s.plan.cards) {
                const card = D.cards[c.id];
                addStats(delta, card, k => cardStat(s, card, c.id, k));
                s.used[c.id] = (s.used[c.id] || 0) + 1;
                if (card.flag) s.flags[card.flag] = true;
                if (card.calm) s.flags['calm:' + c.id] = s.turn + 1;
            }
            addStats(delta, opt);
            if (opt.flag) s.flags[opt.flag] = true;
            const answer = responseOf(s);
            if (answer) {
                addStats(delta, answer);
                if (answer.flag) s.flags[answer.flag] = true;
                for (const id of answer.bars || []) s.flags['bar:' + id] = true;
            }
            for (const p of ECON.policies || []) {
                if (flagsNow[p.flag] && !(p.unless && flagsNow[p.unless])) addStats(delta, p.each || {});
            }
            // Each front that gained or lost cities moves its stats.
            for (const f of Object.values(fronts)) {
                if (f.after > f.before) addStats(delta, D.frontMoves.gained);
                if (f.after < f.before) addStats(delta, D.frontMoves.lost);
            }
            // Behind history, the war is argued over; ahead, it quiets.
            const versus = Object.values(fronts).reduce((a, f) => a + f.after - f.history, 0);
            if (versus < 0) { addStats(delta, D.verdict.behind); if (D.verdict.behind.note) notes.push(D.verdict.behind.note); }
            if (versus > 0) addStats(delta, D.verdict.ahead);

            // The changes land in SETTLE_ORDER; a city's fall applies its
            // effects to stats already landed directly, and to the rest
            // with the season's changes.
            const landed = new Set();
            const land = k => {
                const [lo, hi] = statRange(k);
                s.stats[k] = clamp(s.stats[k] + delta[k], lo, hi);
                landed.add(k);
            };
            for (const step of SETTLE_ORDER) {
                if (step !== 'cities') { land(step); continue; }
                for (const id of D.frontOrder) {
                    const lost = D.fronts[id].onLost;
                    if (!lost) continue;
                    if (s.lines[id] <= lost.at && !s.fallen[id]) {
                        s.fallen[id] = true;
                        for (const [k, v] of Object.entries(lost.effects || {})) {
                            if (landed.has(k)) { const [lo, hi] = statRange(k); s.stats[k] = clamp(s.stats[k] + v, lo, hi); } else delta[k] += v;
                        }
                        notes.push(lost.note);
                    } else if (s.lines[id] > lost.at && s.fallen[id]) {
                        s.fallen[id] = false;
                        notes.push(lost.regained);
                    }
                }
            }
            for (const k of STATS) if (!landed.has(k)) land(k);

            // Unrest: the countryside answers with risings that tie divisions down.
            s.unrest = 0;
            const level = D.unrest.levels.find(l => when(s, l.when));
            if (level) s.unrest = level.n;
            if (s.unrest) notes.push(fmt(D.unrest.note, { n: s.unrest }));
            const nextCommand = commandOf(s.stats[D.command.stat]);
            if (nextCommand !== commandOf(commandBefore)) notes.push(fmt(D.command.note, { value: s.stats[D.command.stat], n: nextCommand }));
            for (const f of D.leaders.fewer || []) if (when(s, f.when)) notes.push(f.note);

            s.lastAlloc = Object.assign({}, s.plan.alloc);
            const record = {
                turn: s.turn, choice: s.plan.choice, history: t.choice.history, response: s.plan.response, fronts,
                cards: s.plan.cards.map(c => c.id), supply: fc.supply, notes, spoils,
                stats: Object.assign({}, s.stats, { food: s.food }),
            };
            s.records.push(record);

            const defeat = D.frontOrder.find(id => D.fronts[id].defeat && s.lines[id] <= D.fronts[id].defeat.at);
            if (defeat) {
                s.outcome = Object.assign({}, D.fronts[defeat].defeat.outcome);
                s.phase = 'done';
            } else if (def && def.final) {
                s.phase = 'battle';
                s.battle = Battle.start(def, s.flags, muster, { rules: s.rules });
            } else {
                s.phase = 'review';
            }
            return true;
        }

        function next(s) {
            if (s.phase !== 'review') return false;
            s.turn += 1;
            enterTurn(s);
            return true;
        }

        // The season's battle, if it has one, and the units the plan on its
        // front brings to it: each unit with whether it joins and, for one held
        // back by need, the strength it waits for.
        function musterOf(s, fc) {
            const def = battleOf(s);
            if (!def || !def.front) return null;
            const f = (fc || forecast(s)).fronts[def.front];
            if (!f) return null;
            const supply = (fc || forecast(s)).supply;
            const muster = {
                margin: f.margin, fed: round1(FOOD.fed + (1 - FOOD.fed) * supply.ratio), commissar: Boolean(s.plan.commissar[def.front]),
                cards: s.plan.cards.filter(c => c.target === def.front).map(c => c.id),
            };
            const flags = Object.assign({}, s.flags, choiceFlags(s));
            const units = def.units.filter(u => u.side === def.sides.player && (!u.flag || s.flags[u.flag] || choiceFlags(s)[u.flag])).map(u => ({
                id: u.id, name: u.name, tag: u.tag, kind: u.kind, need: u.need, card: u.card || null,
                joins: Battle.joins(u, flags, muster, def),
                at: u.need === undefined ? null : round1(f.pressure + u.need),
            }));
            return { def, muster, units, strength: f.strength };
        }

        // The season's battle, if it has one.
        function battleOf(s) {
            const id = turnData(s).battle;
            return id ? D.battles[id] : null;
        }

        function finishBattle(s) {
            if (s.phase !== 'battle' || !s.battle || !s.battle.result) return false;
            const won = s.battle.result === 'won';
            s.battles[s.battle.def.id] = {
                result: s.battle.result, turns: s.battle.turn, turned: Object.keys(s.battle.turned).filter(id => s.battle.turned[id]),
                captured: s.battle.captured || 0, feats: Object.keys(s.battle.feats || {}),
            };
            if (!s.battle.def.final) {
                s.phase = 'plan';
                return settle(s);
            }
            s.phase = 'done';
            s.outcome = score(s, won);
            return true;
        }

        // The war's end after its final battle: the scenario's stars (each a
        // condition, with won and historyDiff known) and its words.
        function score(s, won) {
            let diff = 0;
            for (const r of s.records) {
                for (const f of Object.values(r.fronts)) diff += f.after - f.history;
            }
            const ctx = { won, historyDiff: diff };
            const stars = D.scoring.stars.map(st => ({ id: st.id, label: st.label, got: Cond.holds(s, st.when, Object.assign({ turnId: turnData(s).id }, ctx)) }));
            const words = won ? D.scoring.won : D.scoring.stalled;
            return { kind: won ? 'won' : 'stalled', diff, stars, stats: Object.assign({}, s.stats), title: words.title, text: words.text };
        }

        // ── Save and restore: replay the log on a new game ──

        // A save from before a battle was added goes on from the season after
        // it as though the battle went as history did. The log keeps it as an
        // 'assume', so the save replays the same way afterwards.
        function assumeBattle(s) {
            const b = s.battle;
            if (s.phase !== 'battle' || !b || b.def.final || b.turn !== 1 || b.units.some(u => u.moved || u.acted)) return false;
            s.battles[b.def.id] = { result: 'won', turns: null, turned: [], assumed: true };
            s.phase = 'plan';
            return settle(s);
        }

        const ACTIONS = { alloc: setAlloc, commissar: setCommissar, play: playCard, unplay: unplayCard, choose, respond, settle, next, assume: assumeBattle };

        function act(s, name, ...args) {
            const fn = name.startsWith('b:') ? null : ACTIONS[name];
            let ok;
            if (fn) ok = fn(s, ...args);
            else {
                if (s.phase !== 'battle') return false;
                ok = Battle.act(s.battle, name.slice(2), ...args);
                if (ok && s.battle.result) finishBattle(s);
            }
            if (ok) s.log.push([name, ...args]);
            return ok;
        }

        function serialize(s) {
            return JSON.stringify({ version: D.saveVersion, rules: s.rules, log: s.log });
        }

        function restore(text) {
            try {
                const saved = typeof text === 'string' ? JSON.parse(text) : text;
                if (!saved || saved.version !== D.saveVersion || !Array.isArray(saved.log)) return null;
                const rules = saved.rules || 1;
                const s = start(rules);
                let season = 0;     // log entries up to the latest season begun
                for (const [i, entry] of saved.log.entries()) {
                    if (!Array.isArray(entry)) return null;
                    if (act(s, ...entry)) { if (entry[0] === 'next') season = i + 1; continue; }
                    // A campaign order where a new battle now opens: the save is
                    // older than the battle, which goes as history did.
                    if (s.phase === 'battle' && !s.battle.def.final && typeof entry[0] === 'string' && !entry[0].startsWith('b:')
                        && act(s, 'assume') && act(s, ...entry)) { if (entry[0] === 'next') season = i + 1; continue; }
                    // A season sent before it had an incident: history's answer.
                    if (entry[0] === 'settle' && s.phase === 'plan' && incidentOf(s) && !s.plan.response
                        && act(s, 'respond', incidentOf(s).history) && act(s, ...entry)) continue;
                    // Battle orders from an older battlefield stop the replay at
                    // the battle's start; the campaign before it stands.
                    if (typeof entry[0] === 'string' && entry[0].startsWith('b:') && s.phase === 'battle') break;
                    // A plan the rules no longer allow (a save from before a rule
                    // change) is planned again from the start of its season.
                    return season ? restore({ version: D.saveVersion, rules, log: saved.log.slice(0, season) }) : null;
                }
                return s;
            } catch (_) {
                return null;
            }
        }

        // ── Taking back battle orders: the log without its last order, replayed ──

        // An order of the turn under way: a battle order since the turn began.
        function canTakeBack(s) {
            const last = s.log[s.log.length - 1];
            return s.phase === 'battle' && Boolean(last) && last[0].startsWith('b:') && last[0] !== 'b:end';
        }

        // The state before the last order, back as far as the turn's start; a
        // halt the screen gave on its own (['b:wait', id, 'auto']) goes with
        // the move before it. Returns { state, order } or null.
        function takeBack(s) {
            if (!canTakeBack(s)) return null;
            const log = s.log.slice();
            let order = log.pop();
            if (order[0] === 'b:wait' && order[2] === 'auto' && log.length && log[log.length - 1][0] === 'b:move') order = log.pop();
            const state = restore({ version: D.saveVersion, rules: s.rules, log });
            return state ? { state, order } : null;
        }

        // A war ended by a lost battle can fight that battle again: the log
        // cut back to the order that opened it (its orders are the last ones).
        function canRetryBattle(s) {
            const last = s.log[s.log.length - 1];
            return s.phase === 'done' && Boolean(s.battle) && s.battle.result === 'lost' && Boolean(last) && last[0].startsWith('b:');
        }

        function retryBattle(s) {
            if (!canRetryBattle(s)) return null;
            let j = s.log.length - 1;
            while (j >= 0 && s.log[j][0].startsWith('b:')) j--;
            const state = restore({ version: D.saveVersion, rules: s.rules, log: s.log.slice(0, j + 1) });
            return state && state.phase === 'battle' ? state : null;
        }

        return {
            DATA: D, VERSION: D.saveVersion, canTakeBack, takeBack, canRetryBattle, retryBattle, RULES, TRANSFER: O.transfer, MOMENTUM: O.momentum, PURSUIT: O.pursuit, SPOILS_FOOD: D.spoils.food, SPOILS_MAX: D.spoils.max,
            start, act, restore, serialize, forecast, activeFronts, turnData, when,
            free, allocated, threatsOf, traitsOn, battleOf, incidentOf, responseOf, barred, musterOf, battleResult, cardDivisions, cardStat, commandOf, outcomeOf, outcomeBands, commissarsUsed, canPlay, cardOffered, canSettle, quality, foodIncome,
        };
    }

    const api = { create, RULES, fmt };
    if (node) module.exports = api;
    else root.WarEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
