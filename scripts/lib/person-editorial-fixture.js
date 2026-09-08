// Only fixture data for isolated tests. Production writers never import this file.
if (process.env.COMMULINGO_ISOLATED_TEST !== '1' || process.env.DB_NAME !== 'commulingo_integrity_test') throw new Error('isolated fixture only');
const store = require('../../data/commulingo/people-admin-store');
const sectionStore = require('../../data/commulingo/people-sections-store');
const source = 'Isolated test fixture, p. 1';
function evidence(payload) {
    const ref = Array.isArray(payload.sources) && payload.sources.length ? payload.sources[0] : source;
    return { evidence: Object.keys(payload).filter(field => ['bio','moment','years','citizenship','nationalOrigin','origin','body'].includes(field))
        .map(field => ({ field, claim: `Fixture ${field}`, source: ref, locator: 'p. 1' })), ...payload };
}
const admin = {
    ...store,
    createPersonAdmin: (payload, options) => store.createPersonAdmin(evidence(payload), { sources: [source], requireRevision: false, ...options }),
    updatePersonAdmin: (id, payload, options) => store.updatePersonAdmin(id, evidence(payload), { sources: [source], requireRevision: false, ...options }),
    deletePersonAdmin: (id, options) => store.deletePersonAdmin(id, { reviewed: true, requireRevision: false, ...options }),
};
const sections = {
    ...sectionStore,
    upsertPersonSectionAdmin: (id, slug, payload, options) => sectionStore.upsertPersonSectionAdmin(id, slug, evidence(payload), { sources: [source], requireRevision: false, ...options }),
    deletePersonSectionAdmin: (id, slug, options) => sectionStore.deletePersonSectionAdmin(id, slug, { reviewed: true, requireRevision: false, ...options }),
};
module.exports = { admin, sections };
