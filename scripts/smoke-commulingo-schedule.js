#!/usr/bin/env node
// The review schedule in public/js/commulingo-schedule.js is what decides
// which questions a learner sees again and when, so its rules are pinned
// here: a wrong answer schedules the question at once, correct answers push
// it out 1/3/7 days, three in a row graduate it, a never-missed question is
// never scheduled, and a sync merge keeps the newer record per question.
//   node scripts/smoke-commulingo-schedule.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const store = {};
const sandbox = { localStorage: {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
} };
sandbox.window = sandbox;
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'commulingo-schedule.js'), 'utf8'), sandbox);
const S = sandbox.CommuLingoSchedule;
const DAY = 24 * 60 * 60 * 1000;
const t0 = Date.parse('2026-09-05T00:00:00Z');

// never wrong: never scheduled
let e = S.record(null, true, t0);
assert.strictEqual(e.due, null);
assert.strictEqual(e.right, 1);
assert.strictEqual(S.isDue(e, t0 + 100 * DAY), false);

// wrong: due now
e = S.record(e, false, t0);
assert.strictEqual(e.wrong, 1);
assert.strictEqual(e.streak, 0);
assert.strictEqual(S.isDue(e, t0), true);

// correct after a miss: 1 day, then 3 days, then graduated on the third
e = S.record(e, true, t0);
assert.strictEqual(Date.parse(e.due), t0 + 1 * DAY);
assert.strictEqual(S.isDue(e, t0 + DAY - 1), false);
assert.strictEqual(S.isDue(e, t0 + DAY), true);
e = S.record(e, true, t0 + DAY);
assert.strictEqual(Date.parse(e.due), t0 + DAY + 3 * DAY);
e = S.record(e, true, t0 + 4 * DAY);
assert.strictEqual(e.due, null, 'third consecutive correct graduates the question');
assert.strictEqual(e.streak, 3);

// a miss later re-enters the queue immediately
e = S.record(e, false, t0 + 10 * DAY);
assert.strictEqual(S.isDue(e, t0 + 10 * DAY), true);

// dueList filters by lesson and sorts oldest due first
const map = {
    'les-a/q1': S.record(null, false, t0 + 2 * DAY),
    'les-a/q2': S.record(null, false, t0),
    'les-b/q1': S.record(null, false, t0 + DAY),
    'les-a/q3': S.record(null, true, t0),
};
const due = S.dueList(map, ['les-a'], t0 + 3 * DAY);
assert.strictEqual(due.map(d => d.questionId).join(','), 'q2,q1');
assert.strictEqual(S.dueList(map, null, t0 + 3 * DAY).length, 3);
assert.strictEqual(S.nextDue(map, ['les-b']), t0 + DAY);
assert.strictEqual(S.nextDue({ x: S.record(null, true, t0) }, null), null);

// merge: newer lastAt wins per key, others kept
const local = { 'l/q1': S.record(null, false, t0), 'l/q2': S.record(null, true, t0 + DAY) };
const remote = { 'l/q1': S.record(null, true, t0 + 2 * DAY), 'l/q3': S.record(null, false, t0) };
const merged = S.merge(local, remote);
assert.strictEqual(merged.changed, true);
assert.strictEqual(merged.map['l/q1'].lastCorrect, true);
assert.strictEqual(merged.map['l/q2'].lastCorrect, true);
assert.ok(merged.map['l/q3']);
assert.strictEqual(S.merge(merged.map, remote).changed, false);

// storage round trip
S.save(map);
assert.strictEqual(JSON.stringify(S.load()), JSON.stringify(map));
// account ownership: anonymous records join the first account; signing out
// keeps them for that account; another account drops them; an id-less
// payload decides nothing
const OWNER = 'commulingo-owner-v1';
const PROGRESS = 'commulingo-progress-v1';
store[PROGRESS] = '{"a":{}}';
assert.strictEqual(S.settleOwner({ authenticated: false }), false);
assert.strictEqual(S.settleOwner({ authenticated: true, userId: 7 }), false);
assert.strictEqual(store[OWNER], '7');
assert.ok(store[PROGRESS]);
assert.strictEqual(S.settleOwner({ authenticated: true }), false);
assert.strictEqual(S.settleOwner({ authenticated: true, userId: 7 }), false);
assert.strictEqual(S.settleOwner({ authenticated: true, userId: 8 }), true);
assert.strictEqual(store[OWNER], '8');
assert.ok(!(PROGRESS in store) && !(S.KEY in store));
store[PROGRESS] = '{"b":{}}';
assert.strictEqual(S.settleOwner({ authenticated: false }), false);
assert.strictEqual(store[OWNER], '8');
assert.strictEqual(store[PROGRESS], '{"b":{}}');
assert.strictEqual(S.settleOwner({ authenticated: true, userId: 8 }), false);
assert.strictEqual(store[PROGRESS], '{"b":{}}', 'study while signed out joins the same account');
console.log('ok: commulingo schedule');
