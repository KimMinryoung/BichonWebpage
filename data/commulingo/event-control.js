// Territorial-control phases for the event map: who held what, date by date.
//
// Baked by scripts/bake-event-control.js into the database document
// event-control/<eventId> (data-documents.js; see that script for the format).
// Events without one have no layer.
// event-map-svg.js draws the areas; this module loads them, localizes the
// captions and matches timeline rows to phases, so the map can follow the
// row a reader is on.
const { localize } = require('./localize');
const { getDataDocument } = require('./data-documents');
const { formatPeriod } = require('./career-period');

function loadEventControl(eventId) {
    if (typeof eventId !== 'string' || !/^[a-z0-9-]+$/.test(eventId)) return null;
    const control = getDataDocument(`event-control/${eventId}`);
    return control && Array.isArray(control.phases) && control.phases.length ? control : null;
}

// [year, month?, day?] → a comparable day number. A missing month or day
// counts as the first, so a phase dated [1942, 11, 23] follows [1942, 11].
function dayOf(point) {
    if (!Array.isArray(point) || !Number.isInteger(point[0])) return null;
    const [year, month = 1, day = 1] = point;
    return year * 372 + ((month || 1) - 1) * 31 + ((day || 1) - 1);
}

// The phase in force at a date: the latest one that is not after it. Dates
// before the first phase show the first.
function phaseIndexForPoint(phases, point) {
    const at = dayOf(point);
    if (at === null) return null;
    let found = 0;
    phases.forEach((phase, i) => {
        if (dayOf(phase.date) <= at) found = i;
    });
    return found;
}

// A timeline row's period (career-period shape) counts from its start, or
// its end when it has none.
function phaseIndexForPeriod(phases, period) {
    return phaseIndexForPoint(phases, period && (period.start || period.end));
}

// Captions and legend for the page, in the reader's language.
function presentEventControl(control, lang) {
    if (!control) return null;
    return {
        phases: control.phases.map(phase => ({ date: formatPeriod({ start: phase.date }, lang), label: localize(phase.label, lang) })),
        sides: control.sides.map(side => ({
            id: side.id, tone: side.tone || 'gray', overlay: Boolean(side.overlay), label: localize(side.label, lang),
        })),
        note: localize(control.note, lang),
        sources: control.sources || [],
    };
}

module.exports = { loadEventControl, dayOf, phaseIndexForPoint, phaseIndexForPeriod, presentEventControl };
