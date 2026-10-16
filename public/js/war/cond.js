/* global module */
/* The conditions of the war games' data (public/js/war/): one small
   language for when a trait bites, a modifier applies, a threat appears,
   unrest breaks out or a star is won. A condition is an object; every key
   in it must hold (an empty or missing condition always holds).

     flag: 'x'              the war's flag x is set (s.flags, set by choices,
                            cards and answers when a season is sent)
     noFlag: 'x'            it is not
     choice: 'id'           this season's fork is answered with option id
     turn: 'id' | ['a','b'] this season is (one of) these
     turnMin: n             the season's index is at least n
     card: 'id'             card id is sent to this front (ctx.front)
     played: 'id'           card id is played this season, wherever it went
     leader: true | false   a leader (commissar) is / is not on this front
     reserve: [op, n]       divisions held back in reserve compare to n
     stat: ['name', op, n]  a stat compares to n
     won: true | false      the war's final battle was won (scoring)
     historyDiff: [op, n]   the lines, season by season, against history's (scoring)
     rules: [op, n]         the save's rules generation compares to n
     not: cond              the condition does not hold
     all: [cond…]           every one holds
     any: [cond…]           at least one holds

   op is one of < <= > >= == !=. ctx carries what the engine knows at the
   point of asking: { turnId, front, free, won, historyDiff }. */
(function (root) {
    'use strict';

    const OPS = {
        '<': (a, b) => a < b, '<=': (a, b) => a <= b, '>': (a, b) => a > b,
        '>=': (a, b) => a >= b, '==': (a, b) => a === b, '!=': (a, b) => a !== b,
    };
    const compare = (a, op, b) => {
        if (!OPS[op]) throw new Error(`unknown comparison ${op}`);
        return OPS[op](a, b);
    };

    const KEYS = {
        flag: (s, v) => Boolean(s.flags[v]),
        noFlag: (s, v) => !s.flags[v],
        choice: (s, v) => Boolean(s.plan) && s.plan.choice === v,
        turn: (s, v, ctx) => [].concat(v).includes(ctx.turnId),
        turnMin: (s, v) => s.turn >= v,
        card: (s, v, ctx) => Boolean(s.plan) && s.plan.cards.some(c => c.id === v && c.target === ctx.front),
        played: (s, v) => Boolean(s.plan) && s.plan.cards.some(c => c.id === v),
        leader: (s, v, ctx) => Boolean(s.plan && s.plan.commissar[ctx.front]) === v,
        reserve: (s, [op, n], ctx) => compare(ctx.free, op, n),
        stat: (s, [name, op, n]) => compare(s.stats[name], op, n),
        won: (s, v, ctx) => Boolean(ctx.won) === v,
        historyDiff: (s, [op, n], ctx) => compare(ctx.historyDiff, op, n),
        rules: (s, [op, n]) => compare(s.rules || 1, op, n),
        not: (s, v, ctx) => !holds(s, v, ctx),
        all: (s, v, ctx) => v.every(c => holds(s, c, ctx)),
        any: (s, v, ctx) => v.some(c => holds(s, c, ctx)),
    };

    // s: the war's state (flags, plan, turn, stats); ctx as above.
    function holds(s, cond, ctx = {}) {
        if (!cond) return true;
        for (const [k, v] of Object.entries(cond)) {
            const test = KEYS[k];
            if (!test) throw new Error(`unknown condition key ${k}`);
            if (!test(s, v, ctx)) return false;
        }
        return true;
    }

    const api = { holds, KEYS, OPS };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.WarCond = api;
})(typeof window !== 'undefined' ? window : globalThis);
