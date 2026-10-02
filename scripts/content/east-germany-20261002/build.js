#!/usr/bin/env node
// East Germany 1945–1953 (2026-10-02): the Soviet zone to the GDR, a child of
// eastern-europe-peoples-democracies, and the standalone June 1953 uprising.
// Source of truth for ../east-germany-20261002.json. Edit event-*.js, run
// `node build.js`, commit both.
const fs = require('fs');
const path = require('path');
const { validate } = require('../../apply-history-events');

const BATCH = 'east-germany-20261002';
const events = [require('./event-1945').event, require('./event-1953').event];
const spec = { id: BATCH, events };
validate(spec);
fs.writeFileSync(path.join(__dirname, '..', `${BATCH}.json`), JSON.stringify(spec, null, 2) + '\n');
for (const e of events) {
    console.log(`event ${e.id}: ${e.sections.length} sections, ${e.fields.sources.length} sources, ${e.fields.timeline.length} timeline, ${e.people.length} relations, body ko ${e.fields.body_ko.length} / en ${e.fields.body_en.length}`);
}
