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

// A word can name a thing that has its own main entry while a second entry
// exists about the word itself. '예조프시나' is the euphemism the post-Stalin
// USSR used for the 1937–38 campaign: the campaign is 대숙청, and the
// 예조프시나 entry is there to explain the naming. A reader who meets the word
// in prose wants the campaign, so the link points at 대숙청; the entry stays
// reachable from 대숙청's nested list and from the glossary index.
//
// This cannot be expressed in the alias table alone. Headwords are registered
// in the index alongside aliases and the first registration of a string wins,
// so the entry whose headword is the word always claims it first.
//
// Keys are alias strings, values are the term id to point them at. Only strings
// already in the index are repointed: an override never creates a new match.
const LINK_OVERRIDES = {
    '예조프시나': 'great-purge',
    'Yezhovshchina': 'great-purge',
};

// Builds an alias→term index from the terms snapshot
// ({ id, term: {ko,en}, aliases: {ko:[],en:[]}, ... }).
function buildTermLinkIndex(terms, options = {}) {
    const lang = options.lang || 'ko';
    const en = lang === 'en';
    const byAlias = {};
    const byId = {};
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
        byId[term.id] = entry;
        const candidates = [label].concat((term.aliases && term.aliases[lang]) || []);
        candidates.forEach(raw => {
            const alias = typeof raw === 'string' ? raw.trim() : '';
            if (alias.length < 2 || byAlias[alias]) return;
            byAlias[alias] = entry;
            tokens.push(alias);
        });
    });
    Object.entries(LINK_OVERRIDES).forEach(([alias, targetId]) => {
        if (byAlias[alias] && byId[targetId]) byAlias[alias] = byId[targetId];
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
