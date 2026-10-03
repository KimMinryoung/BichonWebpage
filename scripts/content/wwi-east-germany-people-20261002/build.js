#!/usr/bin/env node
// People named in the First World War, aftermath, East Germany and 1953–1956
// events without a card (queue: dev_docs/commulingo-wwi-east-germany-people-queue-20261002.md).
// Cards live in people-*.js, event links in relations.js. `node build.js` writes
//   ../wwi-east-germany-people-20261002-people.json  scripts/commulingo-people-upsert
//   ../wwi-east-germany-people-20261002.json         scripts/apply-history-events.js
// The event rows are the stored ones (status unchanged); only the new links are added.
const fs = require('fs');
const path = require('path');
const { validate } = require('../../apply-history-events');

const BATCH = 'wwi-east-germany-people-20261002';
const people = ['wwi-a', 'wwi-b', 'gdr-a', 'gdr-b', 'wwi-c', 'wwi-d', 'wwi-e', 'gdr-c', 'gdr-d', 'gdr-e'].flatMap(slug => require(`./people-${slug}`));
const relations = require('./relations');
// Cards registered by other batches that are linked here (Clemenceau: hungary-interwar-20261001).
const EXISTING = ['georges-clemenceau', 'lucjan-zeligowski'];

const seen = new Set();
for (const { id } of people) {
    if (seen.has(id)) throw new Error(`duplicate person ${id}`);
    seen.add(id);
}

const { event: war } = require('../world-war-i-20261002/event-war');
const { event: aftermath } = require('../world-war-i-20261002/event-aftermath');
const { event: gdr } = require('../east-germany-20261002/event-1945');
const { event: uprising } = require('../east-germany-20261002/event-1953');
const { event: crisis } = require('../eastern-europe-1953-1956-20261002/event');
// Migration 247 added the aftermath overview to world-war-i's related list and
// soviet-zone-gdr-1945-1949 to the 1953–1956 overview's.
war.fields.relations = { related: [...require('../world-war-i-20261002/before-world-war-i.json').relations.related, 'world-war-i-aftermath-1918-1923'] };
crisis.fields.relations = { ...crisis.fields.relations, related: [...crisis.fields.relations.related, 'soviet-zone-gdr-1945-1949'] };
// New links sit after the stored ones, except on world-war-i, whose 263 stored
// links put the leaders first (Hindenburg is 1): the new leaders join them there.
const events = [war, aftermath, gdr, uprising, crisis].map(e => ({
    ...e, expected: null,
    people: relations[e.id].map(([person_id, relation_kind, relation_ko, relation_en, note_ko, note_en, side], i) => {
        if (!seen.has(person_id) && !EXISTING.includes(person_id)) throw new Error(`${e.id}: ${person_id} has no card in this batch`);
        const sort_order = e.id === 'world-war-i' ? 1 : e.people.length + i;
        return { person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en, ...(side ? { side } : {}) };
    }),
}));
validate({ id: BATCH, events });

const out = name => path.join(__dirname, '..', name);
fs.writeFileSync(out(`${BATCH}.json`), JSON.stringify({ id: BATCH, events }, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-people.json`), JSON.stringify({ changedBy: BATCH, people }, null, 2) + '\n');
for (const e of events) console.log(`event ${e.id}: ${e.people.length} new links`);
console.log(`${people.length} people, ${people.reduce((n, p) => n + p.evidence.length + p.activities.length, 0)} cited excerpts`);
