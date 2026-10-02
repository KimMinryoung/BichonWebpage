#!/usr/bin/env node
// First World War split into two clusters (2026-10-02, owner decision): the war
// itself (world-war-i, rewritten in place) and its aftermath (new overview
// world-war-i-aftermath-1918-1923). Edit event-*.js, run `node build.js`, commit
// the outputs:
//   ../world-war-i-20261002.json       new aftermath event, scripts/apply-history-events.js
//   ../world-war-i-text-20261002.json  world-war-i rewrite, scripts/apply-event-text-fixes.js
// The rewrite's `expected` values come from before-world-war-i.json, the row as
// read on 2026-10-02; the fix script refuses to write if the row has changed since.
const fs = require('fs');
const path = require('path');
const { validate } = require('../../apply-history-events');

const BATCH = 'world-war-i-20261002';
const { event: war } = require('./event-war');
const { event: aftermath } = require('./event-aftermath');
const before = require('./before-world-war-i.json');

// Relations belong to migration 247, so the rewrite carries the stored ones.
war.fields.relations = before.relations;
// The rewrite goes through the same checks as a new event.
validate({ id: 'world-war-i-check-20261002', events: [{ ...war, expected: null }] });
validate({ id: BATCH, events: [aftermath] });

const out = name => path.join(__dirname, '..', name);
fs.writeFileSync(out(`${BATCH}.json`), JSON.stringify({ id: BATCH, events: [aftermath] }, null, 2) + '\n');

const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const changes = Object.entries(war.fields)
    .filter(([column, value]) => column in before && canonical(before[column]) !== canonical(value))
    .map(([column, value]) => ({ event: war.id, column, expected: before[column], value }));
for (const column of ['relations', 'sides', 'sort_order', 'period_label']) {
    if (changes.some(c => c.column === column)) throw new Error(`${column} is set by the migration or kept, not rewritten here`);
}
fs.writeFileSync(out('world-war-i-text-20261002.json'), JSON.stringify({ id: 'world-war-i-text-20261002', changes }, null, 2) + '\n');

for (const e of [war, aftermath]) {
    console.log(`event ${e.id}: ${e.sections.length} sections, ${e.fields.sources.length} sources, ${e.fields.timeline.length} timeline, ${e.people.length} relations, body ko ${e.fields.body_ko.length} / en ${e.fields.body_en.length}`);
}
console.log(`world-war-i columns rewritten: ${changes.map(c => c.column).join(', ')}`);
