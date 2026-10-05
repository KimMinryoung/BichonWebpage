// Target-scoped commissions that keep the individual editorial topics
// (ported from leninbot commulingo/pipeline/bundles.py).

function topics(job) {
    const payload = job.payload || {};
    return payload.remaining_topics || payload.topics || [job.topic];
}

// A section has its own save/review contract: process it after the card,
// from a new research snapshot, within the same durable job.
function workTopics(job) {
    const pending = topics(job);
    return job.kind === 'person' && pending.length > 1 ? pending.filter(topic => topic !== 'sections') : pending;
}

function advance(job, value) {
    if (!(job.payload || {}).topics) return value;
    const working = new Set(workTopics(job));
    const remaining = topics(job).filter(topic => !working.has(topic));
    return remaining.length ? { ...value, remaining_topics: remaining } : value;
}

function unique(values) {
    return [...new Set(values)];
}

function gapIds(payload = {}) {
    return unique([...(payload.gap_ids || []), ...(payload.gap_id ? [payload.gap_id] : [])]);
}

function bundleCandidates(rows) {
    const grouped = new Map();
    for (const row of [...rows].sort((a, b) => a.priority - b.priority)) {
        const key = row.action === 'update' ? `${row.kind}\u0000${row.target}` : `${row.kind}\u0000${row.target}\u0000${row.topic}`;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(row);
    }
    return [...grouped.values()].map(group => {
        const first = group[0];
        if (first.action !== 'update') return first;
        const commissioned = unique(group.flatMap(topics));
        const payload = {
            ...(first.payload || {}), topics: commissioned, remaining_topics: commissioned,
            gap_ids: unique(group.flatMap(row => gapIds(row.payload || {}))),
            commissions: group.map(row => ({ topic: row.topic, reason: row.reason, baseline: row.baseline, payload: row.payload || {} })),
        };
        return { ...first, topic: 'enrichment', payload, baseline: (group.find(row => row.baseline) || {}).baseline || '',
            reason: `Bundled enrichment: ${commissioned.join(', ')}` };
    });
}

module.exports = { topics, workTopics, advance, gapIds, bundleCandidates };
