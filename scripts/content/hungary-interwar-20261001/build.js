#!/usr/bin/env node
// Hungary 1919–1944 batch (2026-10-01): the Soviet Republic, the Horthy
// regime and Hungary on the Axis side. Source of truth for
// ../hungary-interwar-20261001.json (events), -people.json and -terms.json.
// Edit the event-*.js modules, run `node build.js`, commit the JSON with them.
const fs = require('fs');
const path = require('path');

const BATCH = 'hungary-interwar-20261001';
const modules = ['1919', 'horthy', 'axis'].map(slug => require(`./event-${slug}`));
const events = modules.map(m => m.event);
const people = modules.flatMap(m => m.people || []);
const terms = modules.flatMap(m => m.terms || []);
for (const [kind, list] of [['person', people], ['term', terms], ['event', events]]) {
    const seen = new Set();
    for (const { id } of list) {
        if (seen.has(id)) throw new Error(`duplicate ${kind} ${id}`);
        seen.add(id);
    }
}

const out = name => path.join(__dirname, '..', name);
fs.writeFileSync(out(`${BATCH}.json`), JSON.stringify({ id: BATCH, events }, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-people.json`), JSON.stringify({ changedBy: BATCH, people }, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-terms.json`), JSON.stringify({ id: BATCH, terms }, null, 2) + '\n');
for (const e of events) {
    console.log(`event ${e.id}: ${e.sections.length} sections, ${e.fields.sources.length} sources, ${e.fields.timeline.length} timeline, ${e.people.length} relations`);
}
console.log(`${people.length} people, ${terms.length} terms`);
