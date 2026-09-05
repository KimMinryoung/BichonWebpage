// Curator lanes touch a dozen or more people a day, so a plain ORDER BY
// updated_at fills every dictionary slot on the homepage with people and a new
// event or term never reaches it (2026-09-05: three new civil-war-era events
// were written in the same transaction as twenty people and lost the tie).
// Give each kind its most recent row first, newest kind first, ties going to
// the kinds that change rarely since a new event says more than one more bio;
// then fill what is left by recency. Rows carry { kind, updated_at }.
const KIND_TIE_ORDER = { event: 0, term: 1, person: 2 };

function pickAcrossKinds(rows, limit) {
    if (limit <= 0) return [];
    const ts = row => new Date(row.updated_at).getTime();
    const byRecency = (a, b) => (ts(b) - ts(a)) || (KIND_TIE_ORDER[a.kind] - KIND_TIE_ORDER[b.kind]);
    const newestPerKind = new Map();
    rows.forEach(row => {
        const current = newestPerKind.get(row.kind);
        if (!current || ts(row) > ts(current)) newestPerKind.set(row.kind, row);
    });
    const leaders = [...newestPerKind.values()].sort(byRecency).slice(0, limit);
    const picked = new Set(leaders);
    const rest = rows.filter(row => !picked.has(row)).sort(byRecency);
    return [...leaders, ...rest].slice(0, limit);
}

module.exports = { pickAcrossKinds };
