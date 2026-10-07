#!/usr/bin/env node
// Queue events batch (2026-10-07): the four history events the curation queue
// asked for (gaps 2061–2064) — the Haitian Revolution, the War in the Vendée,
// the Franco-Prussian War and the Balkan Wars — with their new person cards,
// glossary terms and link-review decisions. Each event has its own modules
// (event-<slug>.js, people-<slug>.js, terms-<slug>.js); this script joins them.
// Edit the modules, run `node build.js`, commit the JSON with them. Output:
//   ../queue-events-20261007.json            (scripts/apply-history-events.js)
//   ../queue-events-20261007-people.json     (scripts/commulingo-people-upsert)
//   ../queue-events-20261007-terms.json      (scripts/apply-history-terms.js)
//   ../queue-events-20261007-links.json      (scripts/review-commulingo-links.js)
//   ../queue-events-20261007-collections.json (person stance collections, migration)
const fs = require('fs');
const path = require('path');

const BATCH = 'queue-events-20261007';
const SLUGS = ['haitian-revolution-1791-1804', 'vendee-war-1793-1796', 'franco-prussian-war-1870-1871', 'balkan-wars-1912-1913'];
const only = process.argv.slice(2).filter(a => !a.startsWith('--'));
const slugs = only.length ? only : SLUGS.filter(slug => fs.existsSync(path.join(__dirname, `event-${slug}.js`)));

const events = [], people = [], terms = [], links = [], collections = {};
for (const slug of slugs) {
    const mod = require(`./event-${slug}`);
    events.push(mod.event);
    links.push(...(mod.links || []));
    const peopleMod = fs.existsSync(path.join(__dirname, `people-${slug}.js`)) ? require(`./people-${slug}`) : [];
    people.push(...peopleMod);
    Object.assign(collections, peopleMod.collections || {});
    if (fs.existsSync(path.join(__dirname, `terms-${slug}.js`))) terms.push(...require(`./terms-${slug}`));
}
for (const [kind, list] of [['event', events], ['person', people], ['term', terms]]) {
    const seen = new Set();
    for (const { id } of list) {
        if (seen.has(id)) throw new Error(`duplicate ${kind} ${id}`);
        seen.add(id);
    }
}
const linkKeys = new Set();
for (const d of links) {
    const k = [d.kind, d.id, d.lang, d.text].join('|');
    if (linkKeys.has(k)) throw new Error(`duplicate link decision ${k}`);
    linkKeys.add(k);
}

const out = name => path.join(__dirname, '..', name);
fs.writeFileSync(out(`${BATCH}.json`), JSON.stringify({ id: BATCH, events }, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-people.json`), JSON.stringify({ changedBy: BATCH, people }, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-terms.json`), JSON.stringify({ id: BATCH, terms }, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-links.json`), JSON.stringify({
    scope: '2026-10-07 queue events (Haitian Revolution, Vendée, Franco-Prussian War, Balkan Wars): event titles and their new glossary terms; owner-requested queue registration',
    references: ['dev_docs/commulingo-queue-events-20261007.md'],
    decisions: links,
}, null, 2) + '\n');
fs.writeFileSync(out(`${BATCH}-collections.json`), JSON.stringify(collections, null, 2) + '\n');
for (const e of events) {
    const f = e.fields;
    console.log(`event ${e.id}: ${e.sections.length} sections, ${e.sections.reduce((n, s) => n + s.paragraphs.length, 0)} paragraphs, body ko ${f.body_ko.length}/en ${f.body_en.length}, ${f.sources.length} sources, ${f.timeline.length} timeline, ${e.people.length} relations`);
}
console.log(`${people.length} people, ${terms.length} terms, ${links.length} link decisions, ${Object.keys(collections).length} collections`);
