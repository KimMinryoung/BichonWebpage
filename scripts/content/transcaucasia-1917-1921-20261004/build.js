#!/usr/bin/env node
// Revolution and war in Transcaucasia and the North Caucasus, 1917–1921
// (2026-10-04): one new child event of the Russian Civil War, its new person
// cards and glossary terms. Source of truth for
// ../transcaucasia-1917-1921-20261004{,-people,-terms,-relations}.json.
// The sections were drafted in four parts (sec-a … sec-d, each with its own
// sources, timeline rows and person relations); event.js joins them.
// Edit the modules, run `node build.js`, commit the JSON with them.
const fs = require('fs');
const path = require('path');

const BATCH = 'transcaucasia-1917-1921-20261004';
const { event, relationsFix } = require('./event');
const people = require('./people');
// The term page heads with the original-language name (apply-history-terms.js).
const ORIGINAL = {
    'baku-commune': 'Бакинская коммуна',
    'twenty-six-baku-commissars': '26 бакинских комиссаров',
    'transcaucasian-democratic-federative-republic': 'Закавказская демократическая федеративная республика',
    'armenian-revolutionary-federation': 'Հայ Յեղափոխական Դաշնակցութիւն',
    musavat: 'Müsavat Firqəsi',
    'treaty-of-kars': 'Карсский договор',
    'mountainous-republic-of-the-northern-caucasus': 'Горская республика',
};
const terms = require('./terms').map(t => ({ ...t, fields: { ...t.fields, original: ORIGINAL[t.id] } }));
for (const [kind, list] of [['person', people], ['term', terms]]) {
    const seen = new Set();
    for (const { id } of list) {
        if (seen.has(id)) throw new Error(`duplicate ${kind} ${id}`);
        seen.add(id);
    }
}

const out = name => path.join(__dirname, '..', name);
fs.writeFileSync(out(`${BATCH}.json`), JSON.stringify({ id: BATCH, events: [event] }, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-people.json`), JSON.stringify({ changedBy: BATCH, people }, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-terms.json`), JSON.stringify({ id: BATCH, terms }, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-relations.json`), JSON.stringify({ id: BATCH, changes: [relationsFix] }, null, 2) + '\n');
const ko = event.fields.body_ko.length, en = event.fields.body_en.length;
console.log(`event ${event.id}: ${event.sections.length} sections, ${event.sections.reduce((n, s) => n + s.paragraphs.length, 0)} paragraphs, body ko ${ko}/en ${en}, ${event.fields.sources.length} sources, ${event.fields.timeline.length} timeline, ${event.people.length} relations`);
console.log(`${people.length} people, ${terms.length} terms`);
