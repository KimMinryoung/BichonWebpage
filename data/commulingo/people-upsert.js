// Register or update a batch of people (and their sections) through the
// editorial store in ONE transaction. Shared by scripts/commulingo-people-upsert.js
// and the admin MCP `people_upsert` tool; the spec format is documented there.
const db = require('../../config/database');
const { getPersonAdmin } = require('./people-admin-store');
const { submitPersonEdit } = require('./person-editorial-service');
const { listPersonSectionsAdmin } = require('./people-sections-store');
const { clearCommuLingoPeopleCache } = require('./people-store');
const { transaction } = require('../../utils/db-transaction');
const { eachItem } = require('./item-problems');

async function upsertPeople(people, { dryRun = false, changedBy }) {
    if (!Array.isArray(people) || !people.length) throw Object.assign(new Error('people must be a non-empty array'), { status: 400 });
    const results = [];
    // Each person runs in its own savepoint: every rejected person is reported
    // at once (item-problems.js), and any rejection still writes nothing.
    await transaction(client => eachItem(client, people, async entry => {
        const { sections, ...payload } = entry || {};
        if (!payload.id) throw Object.assign(new Error('every person needs an id'), { status: 400 });
        const existing = await getPersonAdmin(payload.id, { client });
        // An update is checked against the revision just read, as a section is.
        const fields = existing ? { expectedRevision: existing.revision, ...payload } : payload;
        const result = await submitPersonEdit({ target: 'person', action: existing ? 'update' : 'create',
            id: payload.id, fields, sources: payload.sources }, { client, changedBy });
        const row = { id: payload.id, status: result.status, suggestionId: result.suggestionId, docHolds: result.docHolds || [], sections: [] };
        if (result.status === 'pending' && sections?.length) {
            throw Object.assign(new Error('review the person edit before adding its sections'), { status: 400 });
        }
        for (const section of sections || []) {
            const current = await getPersonAdmin(payload.id, { client });
            const exists = (await listPersonSectionsAdmin(payload.id, { client })).some(s => s.slug === section.slug);
            const saved = await submitPersonEdit({ target: 'person_section', action: exists ? 'update' : 'create',
                id: payload.id, fields: { ...section, expectedRevision: section.expectedRevision ?? current.revision },
                sources: section.sources || payload.sources }, { client, changedBy })
                .catch(err => { err.message = `section ${section.slug}: ${err.message}`; throw err; });
            row.sections.push({ slug: section.slug, status: saved.status });
        }
        results.push(row);
    }, entry => ({ label: entry?.id || '(no id)' })), { dryRun, pool: db });
    if (!dryRun) clearCommuLingoPeopleCache();
    return { dryRun, results };
}

module.exports = { upsertPeople };
