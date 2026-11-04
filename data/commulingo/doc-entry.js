// The manifest entry of a reference document (commulingo_docs.entry): which
// keys it may carry and what shape the structured ones take.
//
// canonicalEntry (docs-import.js) rebuilds the fields it knows and validates
// their syntax; until 2026-11-04 the rest of the entry was stored as given, so
// a misspelt key (`excerpt`, `alias`), a kind label a letter off the README's
// list, a missing date or a malformed `anchors` map went in silently and
// surfaced only on the page (a twelfth chip, a document at the end of every
// list, an alias linking the document's top). inspectDocEntry reports those
// as structure issues, so writeDocs's ratchet applies: a new document has to
// be clean, a stored one may not get worse (doc-structure.js).
const { docKind } = require('./doc-kinds');

// Fields canonicalEntry writes.
const CANONICAL_FIELDS = ['id', 'docLang', 'title', 'description', 'summary', 'editorialNotes', 'kind', 'source', 'linkExpressions',
    'aliases', 'noAutoLink', 'date', 'updatedAt', 'tocExclude', 'people', 'terms', 'events', 'addedAt', 'personLinks'];
// Fields the README documents that canonicalEntry leaves as they are
// (mergeDocMeta keeps them across a PATCH): excerpts lent to entry pages,
// anchored aliases, and a collection's member list.
const KEPT_FIELDS = ['excerpts', 'anchors', 'members'];
const ENTRY_FIELDS = new Set([...CANONICAL_FIELDS, ...KEPT_FIELDS]);

const ID = /^[a-z0-9-]+$/;
const DATE = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;
const EXCERPT_KINDS = new Set(['people', 'terms', 'events']);

const ERROR_CODES = {
    'entry-unknown-key': 'entry에 README가 모르는 키가 있습니다',
    'date-invalid': 'entry.date가 없거나 YYYY[-MM[-DD]] 형식이 아닙니다(목록·관련 문헌의 순서가 여기서 나옵니다)',
    'summary-missing': 'entry.summary.ko가 없습니다(목록 카드는 이 칸만 보여 줍니다)',
    'doclang-invalid': 'entry.docLang이 ko/en이 아닙니다',
    'kind-unknown': 'entry.kind가 없거나 README의 열한 가지 종류가 아닙니다(doc-kinds.js)',
    'excerpts-invalid': 'entry.excerpts의 형태가 틀렸습니다({people|terms|events: {id: 제목id | "*" | "toc" | {heading, lead} | [...]}})',
    'anchors-invalid': 'entry.anchors의 형태가 틀렸습니다({제목id: {ko: [...], en: [...]}})',
};

const isObject = value => value && typeof value === 'object' && !Array.isArray(value);

function excerptRefValid(ref) {
    if (typeof ref === 'string') return ref === '*' || ref === 'toc' || /^[A-Za-z0-9_-]+$/.test(ref);
    return isObject(ref) && typeof ref.heading === 'string' && /^[A-Za-z0-9_-]+$/.test(ref.heading)
        && (ref.lead === undefined || typeof ref.lead === 'boolean')
        && Object.keys(ref).every(key => key === 'heading' || key === 'lead');
}

// Issues of the entry alone (the body's are inspectDocStructure's). Each
// issue: { code, message }. `id` and the derived fields are never stored, so
// they are not keys here (docs-db.js storedEntry).
function inspectDocEntry(entry) {
    const errors = [];
    const add = (code, detail) => errors.push({ code, message: detail ? `${ERROR_CODES[code]}: ${detail}` : ERROR_CODES[code] });
    if (!isObject(entry)) return { errors: [{ code: 'entry-unknown-key', message: 'entry가 객체가 아닙니다' }], warnings: [] };
    const unknown = Object.keys(entry).filter(key => !ENTRY_FIELDS.has(key));
    if (unknown.length) add('entry-unknown-key', unknown.join(', '));
    if (!DATE.test(typeof entry.date === 'string' ? entry.date.trim() : '')) add('date-invalid', entry.date === undefined ? '없음' : JSON.stringify(entry.date));
    if (!(isObject(entry.summary) && typeof entry.summary.ko === 'string' && entry.summary.ko.trim())) add('summary-missing');
    if (entry.docLang !== undefined && !['ko', 'en'].includes(entry.docLang)) add('doclang-invalid', JSON.stringify(entry.docLang));
    if (!docKind(entry.kind)) add('kind-unknown', entry.kind === undefined ? '없음' : JSON.stringify(entry.kind));
    if (entry.excerpts !== undefined) {
        const bad = [];
        if (!isObject(entry.excerpts)) bad.push('excerpts');
        else for (const [kind, byId] of Object.entries(entry.excerpts)) {
            if (!EXCERPT_KINDS.has(kind) || !isObject(byId)) { bad.push(kind); continue; }
            for (const [id, declared] of Object.entries(byId)) {
                if (!ID.test(id) || ![].concat(declared ?? []).length || ![].concat(declared).every(excerptRefValid)) bad.push(`${kind}.${id}`);
            }
        }
        if (bad.length) add('excerpts-invalid', bad.join(', '));
    }
    if (entry.anchors !== undefined) {
        const bad = [];
        if (!isObject(entry.anchors)) bad.push('anchors');
        else for (const [anchor, aliases] of Object.entries(entry.anchors)) {
            const ok = /^[A-Za-z0-9_-]+$/.test(anchor) && isObject(aliases)
                && Object.keys(aliases).every(lang => lang === 'ko' || lang === 'en')
                && Object.values(aliases).every(list => Array.isArray(list) && list.every(text => typeof text === 'string' && text.trim()));
            if (!ok) bad.push(anchor);
        }
        if (bad.length) add('anchors-invalid', bad.join(', '));
    }
    return { errors, warnings: [] };
}

// Ids the entry points at outside the document: people/terms/events it is
// filed under, and the entries it lends excerpts to. `known` is
// { people: Set, terms: Set, events: Set, personTarget?: id => id|'' } from the
// dictionaries (docs-db.js loadKnownRefs); an id a person merge redirected
// counts as known (docs-refs.js follows the redirect when it renders).
function entryRefs(entry) {
    const out = [];
    for (const kind of EXCERPT_KINDS) {
        for (const ref of Array.isArray(entry?.[kind]) ? entry[kind] : []) {
            const id = typeof ref === 'string' ? ref : ref && typeof ref.id === 'string' ? ref.id : '';
            if (id) out.push({ kind, id, via: kind });
        }
        for (const id of Object.keys(isObject(entry?.excerpts?.[kind]) ? entry.excerpts[kind] : {})) out.push({ kind, id, via: `excerpts.${kind}` });
    }
    return out;
}

function inspectDocRefs(entry, known) {
    const errors = [];
    if (!known) return { errors, warnings: [] };
    const missing = entryRefs(entry).filter(({ kind, id }) => {
        if (known[kind]?.has(id)) return false;
        return !(kind === 'people' && known.personTarget && known.personTarget(id));
    });
    if (missing.length) {
        errors.push({ code: 'ref-unknown', message: `사전에 없는 id를 가리킵니다: ${missing.map(ref => `${ref.via}:${ref.id}`).join(', ')}` });
    }
    return { errors, warnings: [] };
}

module.exports = { CANONICAL_FIELDS, KEPT_FIELDS, ENTRY_FIELDS, ERROR_CODES, inspectDocEntry, inspectDocRefs, entryRefs };
