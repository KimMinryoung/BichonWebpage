/* global module, require */
/* The campaign engine of the war games: seasons on a strategic map, fronts
   as chains of cities, divisions, leaders and cards sent against each
   front's pressure, a fork and incidents each season, the war compared
   with history's. Deterministic, no DOM: the same decisions always give
   the same war, so a save is the decision log and restore() replays it.

   WarEngine.create(scenario) gives a game for one scenario (its data and
   rules; schema in dev_docs/war-engine.md, the first one is
   public/js/war/scenarios/civil-war.js). Works in the browser (window.WarEngine)
   and in Node (scripts/test-*.js).

   Rules generations (s.rules, kept in the save so an old save replays as
   it was played): 1 the base; 2 divisions moved by rail between fronts
   bring half their share and the plan opens with last season's placements;
   3 the battles' feats and surrenders, and the spoils of a broken enemy;
   4 a leader goes only to a front with divisions, and is recalled when
   its last division leaves; 5 the season's upkeep (the cities' hunger,
   the party's quarrels), a front's gains move the stats once a season
   by the net, and the data's other `rules` conditions (cond.js); 6 a
   front's last cities (cap) open only to the battle its choice brings,
   and taking them pays the cap's reward; 7 the data's content marked
   rules 7 (a season's second incident, a battle in the first season); 8 a
   threat's own trait for one of its attackers (`traits`: the same army
   under another commander), and its `as` in the trait's name. */
(function (root) {
    'use strict';

    const node = typeof module === 'object' && module.exports;
    const Battle = node ? require('./battle.js') : root.WarBattle;
    const Cond = node ? require('./cond.js') : root.WarCond;

    const RULES = 8;
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
            s.turn = calendar(s)[0];
            enterTurn(s);
            return s;
        }

        function turnData(s) { return D.turns[s.turn]; }

        // The seasons a war plays: those whose condition (when, the rules
        // generation) holds; a newer calendar may split an older season in
        // two, so s.turn is the season's index in D.turns, not its count.
        const calendars = {};
        function calendar(s) {
            const key = s.rules;
            if (!calendars[key]) calendars[key] = D.turns.map((t, i) => i).filter(i => !D.turns[i].when || Cond.holds(s, D.turns[i].when, {}));
            return calendars[key];
        }
        const nextTurn = s => calendar(s).find(i => i > s.turn);
        // The season before, on history's clock: the latest one listed
        // earlier that ended before this one did (a split season's halves
        // and the older whole share their end), -1 for the first.
        const endOf = t => t.end[0] * 12 + t.end[1];
        function prevOf(turn) {
            for (let j = turn - 1; j >= 0; j--) if (endOf(D.turns[j]) < endOf(D.turns[turn])) return j;
            return -1;
        }
        const historyBefore = (id, turn) => (prevOf(turn) < 0 ? D.startLines[id] : D.fronts[id].history[prevOf(turn)]);

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
                if (!when(s, src.when)) continue;
                if (src.stat) {
                    const value = s.stats[src.stat];
                    add(fmt(src.label, { value }), Math.round((value - src.base) / src.per));
                } else if (src.fallen) add(src.label, s.fallen[src.fallen] ? src.n : 0);
                else if (src.from === 'deserted') add(src.label, -s.deserted);
                else if (src.from === 'unrest') add(src.label, -s.unrest);
                else if (src.from === 'captured') add(src.label, s.captured);
                else if (Number.isInteger(src.n)) add(src.label, src.n);
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
                alloc: {}, commissar: {}, cards: [], choice: null, responses: {},
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
                recall(s, top);
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
            recall(s, front);
            return true;
        }

        // Under rules 4 a leader serves with divisions: a front left with
        // none sends its leader back to the pool.
        function recall(s, front) {
            if (s.rules >= 4 && !s.plan.alloc[front]) s.plan.commissar[front] = false;
        }

        function setCommissar(s, front, on) {
            if (s.phase !== 'plan' || !(front in s.plan.commissar)) return false;
            if (on && !s.plan.commissar[front] && commissarsUsed(s) >= s.plan.commissars) return false;
            if (on && s.rules >= 4 && !s.plan.alloc[front]) return false;
            s.plan.commissar[front] = Boolean(on);
            return true;
        }

        function cardOffered(s, id) {
            const card = D.cards[id];
            if (!card || !turnData(s).cards.includes(id)) return false;
            if (card.flag && s.flags[card.flag]) return false;
            if (card.requires && !s.flags[card.requires]) return false;
            if (card.when && !when(s, card.when)) return false;
            if (barred(s, id)) return false;
            return true;
        }

        // A card an incident's answer rules out: for the rest of the war once
        // the season is sent, and already while that answer is chosen.
        function barred(s, id) {
            if (s.flags['bar:' + id]) return true;
            return responsesOf(s).some(r => r.bars && r.bars.includes(id));
        }

        // The season's incidents (one, or a list; one with a condition, when,
        // only while it holds) and the answer chosen to each, if any.
        function incidentsOf(s) {
            return [].concat(turnData(s).incident || []).filter(inc => !inc.when || when(s, inc.when));
        }
        function responseOf(s, inc) {
            const id = s.plan && s.plan.responses[inc.id];
            return id ? inc.options.find(o => o.id === id) : null;
        }
        function responsesOf(s) { return incidentsOf(s).map(inc => responseOf(s, inc)).filter(Boolean); }
        const answered = s => incidentsOf(s).every(inc => Boolean(responseOf(s, inc)));

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
            if (s.phase !== 'plan') return false;
            const inc = incidentsOf(s).find(x => x.options.some(o => o.id === optionId));
            if (!inc) return false;
            const opt = inc.options.find(o => o.id === optionId);
            if ((opt.bars || []).some(id => s.plan.cards.some(c => c.id === id))) return false;
            const prev = responseOf(s, inc);
            const delta = (prev ? -(prev.divisions || 0) : 0) + (opt.divisions || 0);
            if (!trim(s, s.plan.divisions + delta)) return false;
            s.plan.divisions += delta;
            s.plan.responses[inc.id] = optionId;
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
                // The season's incidents, as answered.
                for (const inc of incidentsOf(s)) {
                    const answer = responseOf(s, inc);
                    if (!answer || !answer.pressure || !answer.pressure[id]) continue;
                    pressure += answer.pressure[id];
                    pressureParts.push(`${inc.title} ${signed(answer.pressure[id])}`);
                }
                // The attackers' traits: what each brings, and what blunts it.
                const traits = traitsOn(s, id, threat);
                for (const tr of traits.filter(x => x.on)) {
                    pressure += tr.by;
                    pressureParts.push(`${tr.short} ${signed(tr.by)}`);
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
        // counted. From rules 8 a threat may give one attacker its own trait
        // there (`traits`: the army under that front's commander), named as
        // the threat's `as` names it (「데니킨군(브란겔)」).
        function traitOf(s, f, threat) {
            const own = s.rules >= 8 && threat.traits && threat.traits[f];
            return own || D.factions[f].trait;
        }

        function foeShort(f, threat) {
            const tag = threat.as && threat.as[f];
            return tag ? `${D.factions[f].army || D.factions[f].short}(${tag})` : D.factions[f].short;
        }

        function traitsOn(s, id, threat) {
            return (threat.foes || []).filter(f => traitOf(s, f, threat)).map(f => {
                const tr = traitOf(s, f, threat);
                const on = Boolean(tr.when) && when(s, tr.when, { front: id });
                return { foe: f, short: s.rules >= 8 ? foeShort(f, threat) : D.factions[f].short, name: tr.name, rule: tr.rule || null, by: tr.by || 0, counted: Boolean(tr.when), on };
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
            return outcomeAt(id, s.lines[id], s.turn, margin, s.plan.choice, capBattle(s, id));
        }

        // How a front's last cities (cap) open in season turn: undefined while
        // the choice's margin opens them (before rules 6, or a cap without a
        // battle), else whether that season's battle opening them was won.
        function capBattle(s, id, turn = s.turn) {
            const cap = D.fronts[id].cap;
            if (!cap || !cap.battle || !when(s, cap.battle.when)) return undefined;
            const r = D.turns[turn].battle === cap.battle.id && s.battles[cap.battle.id];
            return Boolean(r && r.result === 'won');
        }

        // won: capBattle's answer for the front.
        function outcomeAt(id, line, turn, margin, choice, won) {
            const front = D.fronts[id];
            const max = front.cities.length;
            const historical = front.history[turn] - historyBefore(id, turn);
            const bonus = margin >= 0 ? Math.min(1, Math.floor(margin / O.step)) : -Math.ceil((-margin - O.slack) / O.step);
            const raw = line + historical + bonus;
            const overflow = bonus < 0 ? Math.min(-bonus, Math.max(0, -raw)) : 0;
            const pursuit = clamp(Math.floor(margin / O.step) - 1, 0, O.chase);
            // A front's last cities may be out of reach (cap.reach): only the
            // choice that unlocks them reaches them, with its margin or, from
            // rules 6, by winning its battle.
            const cap = front.cap;
            if (cap) {
                const open = won === undefined ? choice === cap.unlock.choice && margin >= cap.unlock.margin : won;
                if (open) return { change: max - line, overflow: 0, pursuit };
                return { change: clamp(raw, 0, cap.reach) - line, overflow, pursuit };
            }
            return { change: clamp(raw, 0, max) - line, overflow, pursuit };
        }

        // Every strength at which a front's result changes, from 0 up: bands of
        // { from, to (null for the top), change, overflow, pursuit }, where a
        // strength in [from, to) gives that result. Built from outcomeAt at the
        // margins where its bonus steps (−SLACK − STEP·k, 0, STEP·k, a cap's
        // unlocking margin while a margin opens it), so the card's bar cannot
        // disagree with the settlement. won as for outcomeAt.
        const capMargins = [...new Set(Object.values(D.fronts).filter(f => f.cap).map(f => f.cap.unlock.margin))];
        function outcomeBands(id, line, turn, pressure, choice, won) {
            const cuts = (won === undefined ? capMargins : []).concat(-O.slack);
            for (let k = 1; k <= O.chase + 1; k++) cuts.push(O.step * k);
            for (let m = -O.slack - O.step; m > -pressure; m -= O.step) cuts.push(m);
            const from = [...new Set(cuts.map(m => pressure + m).filter(v => v > 0))].sort((a, b) => a - b);
            from.unshift(0);
            const bands = [];
            for (let i = 0; i < from.length; i++) {
                const r = outcomeAt(id, line, turn, from[i] - pressure, choice, won);
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
            return s.phase === 'plan' && Boolean(s.plan.choice) && answered(s);
        }

        // The result of a battle fought this season, before the settlement, on
        // the front, as a strength: nothing when it went as history did, or
        // for a battle without a reward (one that opens a front's cap).
        function battleResult(s, id) {
            const def = battleOf(s);
            const r = def && !def.final && def.front === id && def.reward && s.battles[def.id];
            if (!r) return null;
            const { quick, quickBy, lostBy } = def.reward;
            if (r.result !== 'won') return { label: fmt(X.battleLost, { title: def.title }), v: lostBy };
            return r.turns !== null && r.turns <= quick ? { label: fmt(X.battleQuick, { title: def.title, quick }), v: quickBy } : null;
        }

        // A front's prize still to win this season: a city whose taking pays
        // (rules 8, `prize: { at, when, food, divisions, what }`, at the line
        // that holds it).
        function prizeOf(s, id) {
            const prize = D.fronts[id].prize;
            if (!prize || s.flags['prize:' + id] || s.lines[id] >= prize.at || !when(s, prize.when)) return null;
            return prize;
        }

        // Adds an option's or a card's stat effects (its keys named after
        // stats) to the season's changes.
        // With a ledger, the change is also kept there under its label, for
        // the review's account of the season.
        function addStats(delta, obj, of = k => obj[k] || 0, ledger, label) {
            const d = {};
            for (const k of STATS) { delta[k] += of(k); if (of(k)) d[k] = of(k); }
            if (ledger && Object.keys(d).length) ledger.push({ label: label || obj.label || '', d });
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
            const statsBefore = Object.assign({}, s.stats);
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
                s.lines[id] = clamp(s.lines[id] + front.history[s.turn] - historyBefore(id, s.turn), 0, front.cities.length);
            }

            // A front's cap: the unlocking choice that fell short of the last
            // cities costs divisions; reaching them is told, and where its
            // reward's condition holds (rules 6) pays it: a flag now, stats
            // with the season's.
            const capGains = [];
            for (const id of D.frontOrder) {
                const cap = D.fronts[id].cap;
                if (!cap || !fronts[id]) continue;
                const max = D.fronts[id].cities.length;
                if (s.plan.choice === cap.unlock.choice && fronts[id].after < max) {
                    s.deserted += cap.failed.deserted;
                    notes.push(cap.failed.note);
                } else if (fronts[id].after === max) {
                    notes.push(cap.reached.note);
                    const reward = cap.reached.reward;
                    if (reward && when(s, reward.when)) {
                        if (reward.flag) s.flags[reward.flag] = true;
                        capGains.push(reward);
                        notes.push(reward.note);
                    }
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
                // A city with a prize (rules 8), taken this season: its stores
                // now, the men who come over next season. Once a war.
                for (const [id, f] of Object.entries(fronts)) {
                    const prize = D.fronts[id].prize;
                    if (!prize || s.flags['prize:' + id] || f.before >= prize.at || f.after < prize.at || !when(s, prize.when)) continue;
                    s.flags['prize:' + id] = true;
                    spoils.push({ front: id, prize: true, what: prize.what, food: prize.food || 0, divisions: prize.divisions || 0 });
                }
            }
            s.captured = Math.min(D.spoils.max, spoils.reduce((a, x) => a + x.divisions, 0));
            s.food += spoils.reduce((a, x) => a + x.food, 0);

            // Stats from cards, the choice, the answer and the season's policies.
            const flagsNow = Object.assign({}, s.flags, choiceFlags(s));
            const delta = Object.fromEntries(STATS.map(k => [k, 0]));
            const ledger = [];
            for (const g of capGains) addStats(delta, g, undefined, ledger);
            for (const c of s.plan.cards) {
                const card = D.cards[c.id];
                addStats(delta, card, k => cardStat(s, card, c.id, k), ledger, card.title);
                s.used[c.id] = (s.used[c.id] || 0) + 1;
                if (card.flag) s.flags[card.flag] = true;
                if (card.calm) s.flags['calm:' + c.id] = nextTurn(s);
            }
            addStats(delta, opt, undefined, ledger, t.choice.title);
            if (opt.flag) s.flags[opt.flag] = true;
            for (const inc of incidentsOf(s)) {
                const answer = responseOf(s, inc);
                if (!answer) continue;
                addStats(delta, answer, undefined, ledger, inc.title);
                if (answer.flag) s.flags[answer.flag] = true;
                for (const id of answer.bars || []) s.flags['bar:' + id] = true;
            }
            for (const p of ECON.policies || []) {
                if (flagsNow[p.flag] && !(p.unless && flagsNow[p.unless]) && when(s, p.when)) addStats(delta, p.each || {}, undefined, ledger, p.label);
            }
            // What every season costs, as the stats stood when it was sent.
            for (const u of ECON.upkeep || []) {
                if (!when(s, u.when)) continue;
                addStats(delta, u.each, undefined, ledger, u.label);
                if (u.note) notes.push(u.note);
            }
            // Each front that gained or lost cities moves its stats; or, when
            // `net` holds, the season's fronts together move them once.
            const moved = Object.values(fronts).map(f => Math.sign(f.after - f.before));
            const net = D.frontMoves.net && when(s, D.frontMoves.net.when) ? D.frontMoves.net : null;
            const moves = net || D.frontMoves;
            for (const m of net ? [Math.sign(moved.reduce((a, m) => a + m, 0))] : moved) {
                if (m > 0) addStats(delta, moves.gained, undefined, ledger);
                if (m < 0) addStats(delta, moves.lost, undefined, ledger);
            }
            // Behind history, the war is argued over; ahead, it quiets.
            const versus = Object.values(fronts).reduce((a, f) => a + f.after - f.history, 0);
            if (versus < 0) { addStats(delta, D.verdict.behind, undefined, ledger); if (D.verdict.behind.note) notes.push(D.verdict.behind.note); }
            if (versus > 0 && when(s, D.verdict.ahead.when)) addStats(delta, D.verdict.ahead, undefined, ledger);

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
                        if (lost.effects) ledger.push({ label: lost.label || '', d: Object.assign({}, lost.effects) });
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
                turn: s.turn, choice: s.plan.choice, history: t.choice.history, responses: Object.assign({}, s.plan.responses), fronts,
                cards: s.plan.cards.map(c => c.id), supply: fc.supply, notes, spoils,
                stats: Object.assign({}, s.stats, { food: s.food }),
                // What moved each stat this season, from where it stood.
                ledger: { from: statsBefore, items: ledger },
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
            if (s.phase !== 'review' || nextTurn(s) === undefined) return false;
            s.turn = nextTurn(s);
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

        // The season's battle, if it has one: a battle with a condition
        // (when) is fought only while it holds (the choice that brings it).
        function battleOf(s) {
            const id = turnData(s).battle;
            const def = id ? D.battles[id] : null;
            return def && (!def.when || when(s, def.when)) ? def : null;
        }

        function finishBattle(s) {
            if (s.phase !== 'battle' || !s.battle || !s.battle.result) return false;
            const won = s.battle.result === 'won';
            s.battles[s.battle.def.id] = {
                result: s.battle.result, turns: s.battle.turn, turned: Object.keys(s.battle.turned).filter(id => s.battle.turned[id]),
                captured: s.battle.captured || 0, feats: Object.keys(s.battle.feats || {}),
            };
            if (s.battle.held) s.battles[s.battle.def.id].held = true;
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
                    // A season sent before it had its incidents: history's answers.
                    const unanswered = s.phase === 'plan' ? incidentsOf(s).filter(inc => !responseOf(s, inc)) : [];
                    if (entry[0] === 'settle' && unanswered.length
                        && unanswered.every(inc => act(s, 'respond', inc.history)) && act(s, ...entry)) continue;
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

        // ── Rehearsal: one battle on its own, for trying its board ──

        // A war played as history chose up to the start of the named battle:
        // history's choices and answers, each plan's free divisions to the
        // front furthest short, every battle before it assumed won as
        // history went. Null when the battle is not reached.
        function rehearse(id, rules = RULES) {
            const s = start(rules);
            for (let guard = 0; guard < 4 * D.turns.length; guard++) {
                if (s.phase === 'battle') {
                    if (s.battle.def.id === id) return s;
                    if (!act(s, 'assume')) return null;
                } else if (s.phase === 'review') {
                    if (!act(s, 'next')) return null;
                } else if (s.phase === 'plan') {
                    act(s, 'choose', turnData(s).choice.history);
                    for (const inc of incidentsOf(s)) if (!responseOf(s, inc)) act(s, 'respond', inc.history);
                    // The train to the heaviest front, the cards the party can
                    // bear, the leaders with a division each to the heaviest
                    // fronts, the rest by need.
                    const threats = threatsOf(s);
                    const fronts = activeFronts(s).sort((a, b) => threats[b].pressure - threats[a].pressure);
                    for (const c of turnData(s).cards) {
                        if (c === 'train') act(s, 'play', c, fronts[0]);
                        else if (c !== 'requisition' && s.stats.cohesion + cardStat(s, D.cards[c], c, 'cohesion') >= 40) act(s, 'play', c);
                    }
                    fronts.forEach(f => act(s, 'alloc', f, 0));
                    fronts.slice(0, s.plan.commissars).forEach(f => { if (free(s) > 0) act(s, 'alloc', f, 1); act(s, 'commissar', f, true); });
                    while (free(s) > 0) {
                        const fc = forecast(s).fronts;
                        const f = fronts.slice().sort((a, b) => fc[a].margin - fc[b].margin)[0];
                        if (!act(s, 'alloc', f, s.plan.alloc[f] + 1)) break;
                    }
                    if (!act(s, 'settle')) return null;
                } else return null;
            }
            return null;
        }

        return {
            calendar, prevOf, DATA: D, VERSION: D.saveVersion, canTakeBack, takeBack, canRetryBattle, retryBattle, rehearse, RULES, TRANSFER: O.transfer, MOMENTUM: O.momentum, PURSUIT: O.pursuit, SPOILS_FOOD: D.spoils.food, SPOILS_MAX: D.spoils.max,
            start, act, restore, serialize, forecast, activeFronts, turnData, when,
            free, allocated, threatsOf, traitsOn, traitOf, prizeOf, battleOf, incidentsOf, responseOf, barred, musterOf, battleResult, cardDivisions, cardStat, commandOf, mobilizeSources, outcomeOf, outcomeBands, capBattle, commissarsUsed, canPlay, cardOffered, canSettle, quality, foodIncome,
        };
    }

    const api = { create, RULES, fmt };
    if (node) module.exports = api;
    else root.WarEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
