#!/usr/bin/env node
// Turns an edits file ({ add: {personId: [activity]}, patch: {personId: [{ match, set }]} })
// into an apply-person-activities.js spec against the current rows: current
// activities + additions, expectedRevision and the cited sources. Every patch
// must match exactly one stored activity. Run where the DB is reachable (the container).
const fs = require('node:fs');
const { db } = require('./lib/bootstrap');
const { getPersonAdmin } = require('../data/commulingo/people-admin-store');

async function buildSpec(edits, { client }) {
    const ids = [...new Set([...Object.keys(edits.add || {}), ...Object.keys(edits.patch || {})])];
    const items = [];
    for (const id of ids) {
        const current = await getPersonAdmin(id, { client });
        if (!current) throw new Error(`unknown person ${id}`);
        const activities = current.activities.map(a => ({ ...a }));
        for (const { match, set } of edits.patch?.[id] || []) {
            const hits = activities.filter(a => Object.entries(match).every(([k, v]) => (a[k] ?? null) === v));
            if (hits.length !== 1) throw new Error(`${id}: patch ${JSON.stringify(match)} matched ${hits.length} activities`);
            Object.assign(hits[0], set);
        }
        activities.push(...(edits.add?.[id] || []));
        const sources = [...new Set(activities.flatMap(a => a.evidence.map(e => e.source)))];
        items.push({ id, reviewed: true, reviewMethod: edits.reviewMethod, expectedRevision: current.revision, sources, activities });
    }
    return { note: edits.note, items };
}

if (require.main === module) (async () => {
    const [file, out] = process.argv.slice(2);
    if (!file || !out) throw new Error('usage: build-person-activity-edits.js edits.json spec-out.json');
    const client = await db.connect();
    try { fs.writeFileSync(out, JSON.stringify(await buildSpec(JSON.parse(fs.readFileSync(file)), { client }), null, 1), { flag: 'wx' }); }
    finally { client.release(); await db.end(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });

module.exports = { buildSpec };
