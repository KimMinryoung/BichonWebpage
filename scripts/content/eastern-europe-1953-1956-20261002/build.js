#!/usr/bin/env node
// Eastern Europe after Stalin, 1953–1956 overview (2026-10-02). Source of truth for
// ../eastern-europe-1953-1956-20261002.json. Edit event.js, run `node build.js`, commit both.
const fs = require('fs');
const path = require('path');

const BATCH = 'eastern-europe-1953-1956-20261002';
const { event } = require('./event');
// Parent of east-german-uprising-1953 (../east-germany-20261002.json): apply this batch first.
fs.writeFileSync(path.join(__dirname, '..', `${BATCH}.json`), JSON.stringify({ id: BATCH, events: [event] }, null, 2) + '\n');
console.log(`event ${event.id}: ${event.sections.length} sections, ${event.fields.sources.length} sources, ${event.fields.timeline.length} timeline, ${event.people.length} relations, body ko ${event.fields.body_ko.length} / en ${event.fields.body_en.length}`);
