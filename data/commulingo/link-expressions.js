const { assertHeadword } = require('./headword-validation');

const ROLES = ['identity', 'short', 'related'];
const POLICIES = ['auto', 'context', 'search'];

function assertLinkExpressions(values) {
    const fail = message => { const err = new Error('linkExpressions: ' + message); err.status = 400; throw err; };
    if (!Array.isArray(values)) fail('array required');
    const seen = new Set();
    for (const value of values) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) fail('each expression must be an object');
        if (Object.keys(value).some(key => !['text', 'lang', 'role', 'policy'].includes(key))) fail('unknown expression field');
        if (!['ko', 'en'].includes(value.lang)) fail('lang must be ko or en');
        if (!ROLES.includes(value.role)) fail('role must be identity, short or related');
        if (!POLICIES.includes(value.policy)) fail('policy must be auto, context or search');
        assertHeadword(value.text, 'linkExpressions.text');
        if (value.policy !== 'search' && [...value.text].length < 2) fail('automatic expressions need at least two characters');
        const key = value.lang + ':' + value.text;
        if (seen.has(key)) fail('duplicate expression ' + key);
        seen.add(key);
    }
}

function expressionsFor(record, lang) {
    return (record.linkExpressions || []).filter(value => value.lang === lang);
}

// Preserve old string aliases for search and old consumers. Explicit metadata
// overrides an existing spelling or introduces a new one; it never reclassifies
// the rest of the dictionary by guessing from string length.
function expressionCandidates(record, lang, legacy) {
    const explicit = new Map(expressionsFor(record, lang).map(value => [value.text, value]));
    return [...new Set([...legacy.filter(value => typeof value === 'string' && value), ...explicit.keys()])]
        .map(text => explicit.get(text) || { text, lang, role: 'legacy', policy: 'auto' });
}

function searchableAliases(record, aliases = { ko: [], en: [] }) {
    return Object.fromEntries(['ko', 'en'].map(lang => [lang,
        [...new Set([...(aliases[lang] || []), ...expressionsFor(record, lang).map(value => value.text)])],
    ]));
}

module.exports = { assertLinkExpressions, expressionsFor, expressionCandidates, searchableAliases };
