// What a reference document's declared people/terms/events are called, read off
// the dictionaries at render time.
//
// The manifest used to keep a copy of every headword beside its id, and the copy
// drifted: the history dictionary renamed its Great Terror entry 대숙청 and three
// documents went on announcing 대테러 in their topbars, because nothing connected
// the two. A manifest entry now says only which entries a document belongs with,
// and the dictionaries stay the one place a name is written.
//
// Person ids run through the merge redirects the person page already follows, so
// a document survives its subject being merged into another entry.

const { loadCommuLingoTerms } = require('./terms-store');
const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { loadCommuLingoPeople, redirectTarget } = require('./people-store');
const { loadCommuLingoCatalog } = require('./shards');
const { standardizedFor } = require('./linkify');
const { docRefId, listCommuLingoDocsFor } = require('./docs-store');
const { localize } = require('./localize');

const KINDS = ['people', 'terms', 'events'];

// Reference documents (참고 문헌) linked to one entry via the docs manifest,
// in the shape the entry pages render. Failure only costs the section, never
// the page. Was previously copied into the person, term, and event routes.
function relatedDocsFor(kind, id, lang) {
    try {
        return listCommuLingoDocsFor(kind, id).map(doc => ({
            id: doc.id,
            title: localize(doc.title, lang),
            kind: localize(doc.kind, lang),
        }));
    } catch (e) {
        console.error(`commulingo ${kind} related docs:`, e);
        return [];
    }
}

// One resolver per request, shared by every document it presents: the label maps
// are built once instead of per document, and the people map is the memoized one
// the linker and the person pages already share.
async function createDocRefResolver(lang) {
    const catalog = loadCommuLingoCatalog();
    const [terms, events, loaded] = await Promise.all([
        loadCommuLingoTerms(),
        loadCommuLingoHistoryEvents(),
        loadCommuLingoPeople(),
    ]);
    const { standardized } = standardizedFor(loaded.data, catalog, lang);

    const labels = { people: new Map(), terms: new Map(), events: new Map() };
    (terms || []).forEach(term => labels.terms.set(term.id, localize(term.term, lang)));
    (events || []).forEach(event => labels.events.set(event.id, localize(event.title, lang)));
    // The short form (니콜라이 예조프), not the display name the person page
    // titles itself with (니콜라이 이바노비치 예조프): this is a one-line list of
    // where a document belongs, and a patronymic per entry buys nothing.
    (standardized.people || []).forEach(person => {
        const names = person.names || {};
        labels.people.set(person.id, names.short || person.displayName || localize(person.name, lang));
    });

    return function resolveDocRefs(doc) {
        const out = {};
        KINDS.forEach(kind => {
            out[kind] = (doc[kind] || []).map(ref => {
                const declared = docRefId(ref);
                const id = kind === 'people'
                    ? (labels.people.has(declared) ? declared
                        : redirectTarget(loaded.data, 'person', declared) || declared)
                    : declared;
                const name = labels[kind].get(id) || '';
                // An id the dictionary no longer carries would only link to a
                // 404, so the topbar drops it — loudly, since it means a
                // manifest entry outlived the entry it points at.
                if (!name && declared) {
                    console.warn(`commulingo docs: ${doc.id} references unknown ${kind} "${declared}"`);
                }
                return { id, name };
            }).filter(ref => ref.name);
        });
        return out;
    };
}

module.exports = { createDocRefResolver, relatedDocsFor };
