// Register or update a batch of people (and their sections) through the
// editorial store in ONE transaction. Shared by scripts/commulingo-people-upsert.js
// and the admin MCP `people_upsert` tool; the spec format is documented there.
const db = require('../../config/database');
const { getPersonAdmin } = require('./people-admin-store');
const { submitPersonEdit } = require('./person-editorial-service');
const { listPersonSectionsAdmin } = require('./people-sections-store');
const { clearCommuLingoPeopleCache } = require('./people-store');

async function upsertPeople(people, { dryRun = false, changedBy }) {
    if (!Array.isArray(people) || !people.length) throw Object.assign(new Error('people must be a non-empty array'), { status: 400 });
    const client = await db.connect();
    const results = [];
    try {
        await client.query('BEGIN');
        for (const entry of people) {
            const { sections, ...payload } = entry || {};
            if (!payload.id) throw Object.assign(new Error('every person needs an id'), { status: 400 });
            const existing = await getPersonAdmin(payload.id, { client });
            // An update is checked against the revision just read, as a section is.
            const fields = existing ? { expectedRevision: existing.revision, ...payload } : payload;
            const result = await submitPersonEdit({ target: 'person', action: existing ? 'update' : 'create',
                id: payload.id, fields, sources: payload.sources }, { client, changedBy });
            const row = { id: payload.id, status: result.status, suggestionId: result.suggestionId, sections: [] };
            results.push(row);
            if (result.status === 'pending' && sections?.length) {
                throw Object.assign(new Error(`${payload.id}: review the person edit before adding its sections`), { status: 400 });
            }
            for (const section of sections || []) {
                const current = await getPersonAdmin(payload.id, { client });
                const exists = (await listPersonSectionsAdmin(payload.id, { client })).some(s => s.slug === section.slug);
                const saved = await submitPersonEdit({ target: 'person_section', action: exists ? 'update' : 'create',
                    id: payload.id, fields: { ...section, expectedRevision: section.expectedRevision ?? current.revision },
                    sources: section.sources || payload.sources }, { client, changedBy });
                row.sections.push({ slug: section.slug, status: saved.status });
            }
        }
        await client.query(dryRun ? 'ROLLBACK' : 'COMMIT');
        if (!dryRun) clearCommuLingoPeopleCache();
        return { dryRun, results };
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { upsertPeople };
