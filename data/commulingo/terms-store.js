const db = require('../../config/database');
const path = require('path');
const { createDictionarySnapshotStore } = require('./snapshot-store');

// Glossary terms served from an in-memory copy, mirroring people-store: the
// hot path never awaits the DB. Serving (snapshot, background refresh,
// reference-stable unchanged refreshes) comes from the shared snapshot-store
// scaffold.

function t(ko, en) {
    return { ko: ko || '', en: en || '' };
}

// Headwords are compared case-insensitively and without the article the event
// titles carry — the glossary writes 'Great Purge', the history dictionary
// 'The Great Purge', and they are the same name.
function normalizeHeadword(value) {
    return String(value || '').trim().toLowerCase().replace(/^the\s+/, '');
}

async function fetchTerms() {
    const [terms, aliases, people, events, relations] = await Promise.all([
        db.query(
            `SELECT id, term_ko, term_en, original, period_label,
                    period_ko, period_en, start_year, end_year, category,
                    definition_ko, definition_en, body_ko, body_en, sources,
                    parent_id, updated_at
             FROM commulingo_terms
             ORDER BY sort_order, id`
        ),
        db.query(
            `SELECT term_id, lang, alias
             FROM commulingo_term_aliases
             ORDER BY term_id, lang, sort_order, alias`
        ),
        db.query(
            `SELECT tp.term_id, tp.person_id, p.name_ko, p.name_en
             FROM commulingo_term_people tp
             JOIN commulingo_people p ON p.id = tp.person_id
             ORDER BY tp.term_id, tp.sort_order, tp.person_id`
        ),
        db.query(
            `SELECT te.term_id, te.event_id, te.same_subject,
                    e.period_label, e.title_ko, e.title_en
             FROM commulingo_term_events te
             JOIN commulingo_history_events e ON e.id = te.event_id
             ORDER BY te.term_id, te.sort_order, te.event_id`
        ),
        db.query(
            `SELECT term_id, related_id
             FROM commulingo_term_relations
             ORDER BY term_id, sort_order, related_id`
        ),
    ]);
    const aliasesByTerm = {};
    aliases.rows.forEach(row => {
        const entry = aliasesByTerm[row.term_id] || (aliasesByTerm[row.term_id] = { ko: [], en: [] });
        if (entry[row.lang]) entry[row.lang].push(row.alias);
    });
    const peopleByTerm = {};
    people.rows.forEach(row => {
        (peopleByTerm[row.term_id] || (peopleByTerm[row.term_id] = [])).push({
            id: row.person_id,
            name: t(row.name_ko, row.name_en),
        });
    });
    const eventsByTerm = {};
    // The one event that is the same subject as the term rather than merely
    // related to it, which is what puts the two entries behind tabs on one page.
    //
    // Decided by name: the two dictionaries printing the same headword is the
    // statement that they are writing up the same thing, so it does not need a
    // second statement in a flag column. Only an entry already linked to the
    // event is considered, so two pages cannot be joined by a coincidence of
    // wording. same_subject overrides in both directions when the names are
    // wrong about it — TRUE pairs anyway, FALSE never pairs.
    const sameSubjectByTerm = {};
    const headwords = {};
    terms.rows.forEach(row => {
        headwords[row.id] = [row.term_ko, row.term_en].map(normalizeHeadword).filter(Boolean);
    });
    events.rows.forEach(row => {
        const entry = {
            id: row.event_id,
            period: row.period_label || '',
            title: t(row.title_ko, row.title_en),
        };
        (eventsByTerm[row.term_id] || (eventsByTerm[row.term_id] = [])).push(entry);
        if (row.same_subject === false) return;
        const named = (headwords[row.term_id] || []).some(word =>
            word === normalizeHeadword(row.title_ko) || word === normalizeHeadword(row.title_en));
        if (row.same_subject === true || named) sameSubjectByTerm[row.term_id] = entry;
    });
    // Relations are stored one way round and mirrored here, so a single
    // ('nep','nepman') row shows up on both entries.
    const termLabels = {};
    terms.rows.forEach(row => {
        termLabels[row.id] = { id: row.id, term: t(row.term_ko, row.term_en) };
    });
    const relatedByTerm = {};
    const addRelation = (from, to) => {
        const label = termLabels[to];
        if (!label || from === to) return;
        const list = relatedByTerm[from] || (relatedByTerm[from] = []);
        if (!list.some(entry => entry.id === to)) list.push(label);
    };
    relations.rows.forEach(row => {
        addRelation(row.term_id, row.related_id);
        addRelation(row.related_id, row.term_id);
    });

    // parent_id nests one level (예조프시나 under 대숙청). Both directions are
    // resolved here so a page renders from the term alone: the child carries its
    // parent, the parent carries its children in chronological order.
    const childrenByTerm = {};
    terms.rows.forEach(row => {
        if (!row.parent_id || !termLabels[row.parent_id] || row.parent_id === row.id) return;
        (childrenByTerm[row.parent_id] || (childrenByTerm[row.parent_id] = [])).push({
            id: row.id,
            term: t(row.term_ko, row.term_en),
            period: t(row.period_ko || row.period_label, row.period_en || row.period_label),
            startYear: Number.isInteger(row.start_year) ? row.start_year : null,
        });
    });
    Object.values(childrenByTerm).forEach(list => list.sort((a, b) => {
        const ay = a.startYear, by = b.startYear;
        if (ay !== by) return (ay === null) - (by === null) || (ay || 0) - (by || 0);
        return a.id.localeCompare(b.id);
    }));

    return terms.rows.map(row => ({
        id: row.id,
        term: t(row.term_ko, row.term_en),
        original: row.original || '',
        // period_label is the frozen pre-071 column; rows added since then may
        // still arrive with only period_ko/en, and rows added by hand may have
        // only the legacy label, so either one can stand in for the other.
        period: t(row.period_ko || row.period_label, row.period_en || row.period_label),
        startYear: Number.isInteger(row.start_year) ? row.start_year : null,
        endYear: Number.isInteger(row.end_year) ? row.end_year : null,
        category: row.category || '',
        definition: t(row.definition_ko, row.definition_en),
        body: t(row.body_ko, row.body_en),
        sources: Array.isArray(row.sources) ? row.sources : [],
        aliases: aliasesByTerm[row.id] || { ko: [], en: [] },
        people: peopleByTerm[row.id] || [],
        events: eventsByTerm[row.id] || [],
        sameSubjectEvent: sameSubjectByTerm[row.id] || null,
        related: relatedByTerm[row.id] || [],
        updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
        parent: (row.parent_id && termLabels[row.parent_id] && row.parent_id !== row.id)
            ? termLabels[row.parent_id]
            : null,
        children: childrenByTerm[row.id] || [],
    }));
}

const store = createDictionarySnapshotStore({
    label: 'commulingo terms',
    refreshMs: Number.parseInt(process.env.COMMULINGO_TERMS_CACHE_MS || '60000', 10),
    snapshotPath: process.env.COMMULINGO_TERMS_SNAPSHOT
        || path.join(__dirname, 'terms-snapshot.json'),
    fetchData: fetchTerms,
    isEmpty: data => !data.length,
    emptyErrorMessage: 'commulingo_terms has no rows',
    emptyErrorCode: 'COMMULINGO_TERMS_EMPTY',
    validateSnapshot: data => Array.isArray(data) && data.length > 0,
    emptyFallback: [],
});

async function loadCommuLingoTerms(options = {}) {
    return (await store.load(options)).data;
}

module.exports = {
    loadCommuLingoTerms,
    SNAPSHOT_PATH: store.snapshotPath,
};
