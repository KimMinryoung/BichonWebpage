#!/usr/bin/env node
// Three child events of the Russian Civil War (2026-10-04): Central Asia with
// Gilan, Siberia and the Far East, and the Tambov rebellion with the peasant
// uprisings — with their new person cards and glossary terms. Each event lives
// in its own folder (<id>/sec.js for the sections, timeline and relations,
// <id>/people.js, <id>/terms.js); event.js holds the frames. Source of truth for
// ../civil-war-theaters-20261004{,-people,-terms}.json.
const fs = require('fs');
const path = require('path');

const BATCH = 'civil-war-theaters-20261004';
const { events } = require('./event');
const IDS = events.map(e => e.id);
const optional = (id, file) => (fs.existsSync(path.join(__dirname, id, file)) ? require(`./${id}/${file}`) : []);
const people = IDS.flatMap(id => optional(id, 'people.js'));
const { ORIGINAL } = require('./event');
const terms = IDS.flatMap(id => optional(id, 'terms.js')).map(t => ({ ...t, fields: { ...t.fields, original: ORIGINAL[t.id] } }));
for (const [kind, list] of [['person', people], ['term', terms]]) {
    const seen = new Set();
    for (const { id } of list) {
        if (seen.has(id)) throw new Error(`duplicate ${kind} ${id}`);
        seen.add(id);
    }
}
for (const t of terms) if (!t.fields.original) throw new Error(`term ${t.id}: original name missing`);

const out = name => path.join(__dirname, '..', name);
fs.writeFileSync(out(`${BATCH}.json`), JSON.stringify({ id: BATCH, events }, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-people.json`), JSON.stringify({ changedBy: BATCH, people }, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-terms.json`), JSON.stringify({ id: BATCH, terms }, null, 2) + '\n');
for (const e of events) {
    console.log(`event ${e.id}: ${e.sections.length} sections, ${e.sections.reduce((n, s) => n + s.paragraphs.length, 0)} paragraphs, body ko ${e.fields.body_ko.length}, ${e.fields.sources.length} sources, ${e.fields.timeline.length} timeline, ${e.people.length} relations`);
}
console.log(`${people.length} people, ${terms.length} terms`);
