// Read projections for the large editorial reads (person_get, term_get,
// event_get, event_raw, doc_get). A full person or 1848 event runs past 100k
// characters, more than an agent client accepts in one result; callers ask
// for the keys, the language and the string length they need. Defaults keep
// the full shape, which leninbot's readers depend on.
const { int, str, arr } = require('./schema');

const viewArgs = {
    fields: arr('Top-level keys to return (id and revision are always kept); omit for all', 50),
    lang: str('Keep only this language of every {ko, en} value', { enum: ['ko', 'en'] }),
    maxChars: int('Cut strings longer than this, marking the cut as …[+N chars] (never send a cut string back as an edit)', 200, 1000000),
};

const VIEW_HINT = ' Large entries exceed 100k characters: pass fields, lang and/or maxChars to narrow the result.';

function isLocalized(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const keys = Object.keys(value);
    return keys.length > 0 && keys.every(key => key === 'ko' || key === 'en');
}

function shape(value, lang, maxChars) {
    if (typeof value === 'string') {
        return maxChars && value.length > maxChars ? `${value.slice(0, maxChars)}…[+${value.length - maxChars} chars]` : value;
    }
    if (Array.isArray(value)) return value.map(item => shape(item, lang, maxChars));
    if (!value || typeof value !== 'object' || value instanceof Date) return value;
    if (lang && isLocalized(value)) return shape(value[lang] ?? null, lang, maxChars);
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item, lang, maxChars)]));
}

function project(entry, { fields, lang, maxChars } = {}) {
    if (!entry || typeof entry !== 'object') return entry;
    if (fields && !fields.every(field => typeof field === 'string')) {
        throw Object.assign(new Error('fields must be strings'), { status: 400 });
    }
    let out = entry;
    if (fields && fields.length) {
        const keep = new Set(['id', 'revision', ...fields]);
        out = Object.fromEntries(Object.entries(entry).filter(([key]) => keep.has(key)));
    }
    return lang || maxChars ? shape(out, lang, maxChars) : out;
}

module.exports = { viewArgs, VIEW_HINT, project };
