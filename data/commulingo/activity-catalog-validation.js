// Whole-catalog rules for the activity catalog (data document
// `activity-catalog`). They run on every write (data-documents.js) and on the
// stored catalog in tests/unit/commulingo-activities.js, so a bad entry is
// refused when it is written instead of surfacing later as a failed deploy.
// Until 2026-11-14 they lived only in the test: an agent added a South Yemeni
// party without the opposition clause and with a ruling period that overlapped
// its successor's, the write passed, and the next deploy stopped on the test.
//
// A governing party (`governingState`) names the socialist state it ran and the
// years it ran it. Its criteria must send opposition away from that state
// (leninbot's classifier reads them); its ruling years lie inside the party's
// own existence; and two parties ruling the same state may share at most the
// handover year (MDP 1948–1956, then MSzMP 1956–1989).
const { ICON_PATHS } = require('../icons');

const spans = periods => (Array.isArray(periods) ? periods : []);
const covers = (outer, [from, to]) => spans(outer).some(([a, b]) =>
    (a == null || (from != null && a <= from)) && (b == null || (to != null && to <= b)));
const sharedYears = ([a1, b1], [a2, b2]) => {
    const start = Math.max(a1 ?? -Infinity, a2 ?? -Infinity);
    const end = Math.min(b1 ?? Infinity, b2 ?? Infinity);
    return end - start;
};

function activityCatalogProblems(catalog) {
    const problems = [];
    const functions = new Map((catalog.functions || []).map(f => [f.id, f]));
    const affiliations = new Map((catalog.affiliations || []).map(a => [a.id, a]));
    for (const entry of [...functions.values(), ...affiliations.values()]) {
        if (!ICON_PATHS[entry.icon]) problems.push(`${entry.id}: unknown icon "${entry.icon}"`);
    }
    for (const a of affiliations.values()) {
        for (const [from, to] of spans(a.periods)) {
            if (from != null && to != null && from > to) problems.push(`${a.id}: period ${from}–${to} runs backwards`);
        }
        if (a.parentId && !affiliations.has(a.parentId)) problems.push(`${a.id}: unknown parentId ${a.parentId}`);
    }
    for (const [from, to] of Object.entries(catalog.retired || {})) {
        if (affiliations.has(from)) problems.push(`retired id ${from} is still an affiliation`);
        if (!affiliations.has(to)) problems.push(`retired id ${from} points to unknown ${to}`);
    }
    for (const [key, [functionId, affiliationId]] of Object.entries(catalog.legacy || {})) {
        if (!functions.has(functionId)) problems.push(`legacy ${key}: unknown function ${functionId}`);
        if (affiliationId && !affiliations.has(affiliationId)) problems.push(`legacy ${key}: unknown affiliation ${affiliationId}`);
    }
    const rulers = new Map();
    for (const party of affiliations.values()) {
        if (!party.governingState) continue;
        const { id: stateId, periods } = party.governingState;
        const state = affiliations.get(stateId);
        if (!state || state.kind !== 'state' || !state.socialistSystem) {
            problems.push(`${party.id}: governingState ${stateId} must be a state affiliation with socialistSystem`);
        }
        if (!String(party.criteria || '').includes('opposition')) {
            problems.push(`${party.id}: a governing party's criteria must say that opposition is not attributed to ${stateId} (the word "opposition")`);
        }
        if (!spans(periods).length) problems.push(`${party.id}: governingState needs periods`);
        for (const span of spans(periods)) {
            if (party.periods && !covers(party.periods, span)) {
                problems.push(`${party.id}: ruling period ${span[0]}–${span[1] ?? ''} lies outside the party's own periods`);
            }
            for (const [other, otherSpan] of rulers.get(stateId) || []) {
                if (sharedYears(span, otherSpan) > 0) {
                    problems.push(`${party.id} and ${other} both rule ${stateId} in ${Math.max(span[0] ?? -Infinity, otherSpan[0] ?? -Infinity)}–${Math.min(span[1] ?? Infinity, otherSpan[1] ?? Infinity)}; successive parties may share only the handover year`);
                }
            }
        }
        rulers.set(stateId, [...(rulers.get(stateId) || []), ...spans(periods).map(span => [party.id, span])]);
    }
    return problems;
}

module.exports = { activityCatalogProblems };
