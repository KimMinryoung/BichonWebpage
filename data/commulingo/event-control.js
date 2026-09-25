// Territorial-control phases for the event map: who held what, date by date.
//
// Baked by scripts/bake-event-control.js into event-control/<eventId>.json
// (see that script for the format). Events without a file have no layer.
// event-map-svg.js draws the areas; this module loads them, localizes the
// captions and matches timeline rows to phases, so the map can follow the
// row a reader is on.
const fs = require('fs');
const path = require('path');
const { localize } = require('./localize');

const DIR = path.join(__dirname, 'event-control');
const cache = new Map();

function loadEventControl(eventId) {
    if (typeof eventId !== 'string' || !/^[a-z0-9-]+$/.test(eventId)) return null;
    if (cache.has(eventId)) return cache.get(eventId);
    let control = null;
    try {
        control = JSON.parse(fs.readFileSync(path.join(DIR, `${eventId}.json`), 'utf8'));
        if (!Array.isArray(control.phases) || !control.phases.length) control = null;
    } catch (e) {
        if (e.code !== 'ENOENT') console.error(`commulingo event control ${eventId}:`, e.message);
        control = null;
    }
    cache.set(eventId, control);
    return control;
}

// 'YYYY.MM.DD…' → a comparable day number; the first date in a range counts
// ('1948.11–1949.01' is November 1948). Missing month or day count as the
// first, so a phase dated '1942.11.23' follows one dated '1942.11'.
function monthOf(date) {
    const m = String(date || '').match(/(\d{4})(?:\.(\d{1,2})(?:\.(\d{1,2}))?)?/);
    if (!m) return null;
    return Number(m[1]) * 372 + (m[2] ? Number(m[2]) - 1 : 0) * 31 + (m[3] ? Number(m[3]) - 1 : 0);
}

// The phase in force at a timeline date: the latest one that is not after
// it. Rows before the first phase show the first.
function phaseIndexForDate(phases, date) {
    const month = monthOf(date);
    if (month === null) return null;
    let found = 0;
    phases.forEach((phase, i) => {
        if (monthOf(phase.date) <= month) found = i;
    });
    return found;
}

// Captions and legend for the page, in the reader's language.
function presentEventControl(control, lang) {
    if (!control) return null;
    return {
        phases: control.phases.map(phase => ({ date: phase.date, label: localize(phase.label, lang) })),
        sides: control.sides.map(side => ({ id: side.id, tone: side.tone || 'gray', label: localize(side.label, lang) })),
        note: localize(control.note, lang),
        sources: control.sources || [],
    };
}

module.exports = { loadEventControl, phaseIndexForDate, presentEventControl, monthOf };
