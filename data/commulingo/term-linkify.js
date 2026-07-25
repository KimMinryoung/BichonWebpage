// Auto-links glossary terms inside prose, the term counterpart of
// event-linkify. Index shape ({ pattern, byAlias, en }) and the Korean
// preceding-char guard mirror buildPersonLinkIndex so all indexes share one
// replacer pipeline (see report-links.js).

const {
    WORD_CHAR,
    escapeHtml,
    escapeRegExp,
    mapLinkableText,
} = require('./people-linkify');

// Korean compounds that contain a term alias but must never link.
const BLOCKED_TERM_KO = ['집단농장화'];

// Builds an alias→term index from the terms snapshot
// ({ id, term: {ko,en}, aliases: {ko:[],en:[]}, ... }).
function buildTermLinkIndex(terms, options = {}) {
    const lang = options.lang || 'ko';
    const en = lang === 'en';
    const byAlias = {};
    const tokens = [];
    (terms || []).forEach(term => {
        if (!term || !term.id) return;
        const label = (term.term && (term.term[lang] || term.term.ko || term.term.en)) || '';
        const entry = {
            id: term.id,
            kind: 'term',
            label,
            original: term.original || '',
            href: '/commulingo/terms/' + encodeURIComponent(term.id),
        };
        const candidates = [label].concat((term.aliases && term.aliases[lang]) || []);
        candidates.forEach(raw => {
            const alias = typeof raw === 'string' ? raw.trim() : '';
            if (alias.length < 2 || byAlias[alias]) return;
            byAlias[alias] = entry;
            tokens.push(alias);
        });
    });
    if (!tokens.length) return null;
    const all = (en ? tokens : BLOCKED_TERM_KO.concat(tokens)).slice().sort((a, b) => b.length - a.length);
    const alternation = all.map(escapeRegExp).join('|');
    const pattern = new RegExp(en ? '\\b(' + alternation + ')\\b' : '(' + alternation + ')', 'g');
    return { pattern, byAlias, en };
}

// Replacer for glossary prose: links the FIRST mention of each other term, the
// same restraint linkifyReportHtml uses, so a paragraph naming NEP four times
// gets one link rather than four. excludeId keeps an entry from linking to
// itself, and `seen` is shared across calls so a term linked in the definition
// is not linked again in the body below it.
function makeTermReplacer(index, excludeId, seen) {
    return function replacer(match, _token, offset, source) {
        if (!index.en) {
            const prev = offset > 0 ? source.charAt(offset - 1) : '';
            if (WORD_CHAR.test(prev)) return match;
        }
        const term = index.byAlias[match];
        if (!term || term.id === excludeId || seen.has(term.id)) return match;
        seen.add(term.id);
        const title = escapeHtml(term.original ? term.label + ' · ' + term.original : term.label);
        return '<a class="commu-term-link" href="' + term.href
            + '" title="' + title + '">' + match + '</a>';
    };
}

// Links terms inside already-rendered HTML (a term's markdown body).
function linkifyTermsHtml(html, index, excludeId, seen) {
    if (!html || !index) return html || '';
    const replacer = makeTermReplacer(index, excludeId, seen || new Set());
    return mapLinkableText(html, text => text.replace(index.pattern, replacer));
}

// Escapes raw text, then links terms. Use for plain prose (a definition).
function linkifyTermsPlain(rawText, index, excludeId, seen) {
    const escaped = escapeHtml(rawText || '');
    if (!index) return escaped;
    return escaped.replace(index.pattern, makeTermReplacer(index, excludeId, seen || new Set()));
}

module.exports = {
    BLOCKED_TERM_KO,
    buildTermLinkIndex,
    linkifyTermsHtml,
    linkifyTermsPlain,
};
