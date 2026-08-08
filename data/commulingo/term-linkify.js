// The glossary alias index: which strings belong to which term. Index shape
// ({ pattern, byAlias, en }) matches the other indexes so linkify.js can run
// them all through one replacer.

const {
    WORD_CHAR,
    escapeHtml,
    escapeRegExp,
    mapLinkableText,
} = require('./people-linkify');

// Korean compounds that contain a term alias but must never link.
// 전세계 contains 전세 (jeonse) and fired in the Communist Manifesto's
// '전세계의 프롤레타리아여' — the compound never means the housing lease.
const BLOCKED_TERM_KO = ['집단농장화', '전세계'];

// Aliases that are also ordinary Korean words — the term counterpart of
// NEVER_LINK_ALIAS_KO in people-linkify. They surfaced when lesson prose
// started being linked: 『자본론』 using 주체 in the plain sense of "subject"
// was pointed at 주체사상, and 소개 meaning "introduction" at the 1941
// evacuation. Each entry stays reachable by its headword and its longer
// aliases; only the bare ambiguous string is refused, and only when it is not
// the headword itself.
const NEVER_LINK_TERM_ALIAS_KO = ['주체', '소개', '정상화', '호구', '씨밤'];

// Strings refused even when they are the term's own headword. The list above
// spares the headword deliberately — an entry has to stay reachable by its own
// name. This one is for the opposite case: a headword so basic that linking it
// is noise rather than help. 소비에트 names the state, the council, and half
// the adjectives in this corpus; a page of running prose uses it fifty times
// and the one link it earns tells the reader nothing the context has not
// already given them. Excluded strings stay reachable from the glossary index,
// from related-term chips, and from their own longer aliases (노동자대표
// 소비에트, 소비에트 대회), which are specific enough to be worth a link.
// The English side is the same word with the same problem, and worse: most of
// its appearances are the adjective in "the Soviet Union", "Soviet advisers".
// Both languages are kept in step so a reader does not meet a link in one and
// plain text in the other. Matching is case-sensitive, so each casing that the
// alias table registers has to be named.
const NEVER_LINK_TERM_HEADWORD = {
    ko: ['소비에트'],
    en: ['Soviet', 'soviet', 'soviets', 'Soviets'],
};

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
        const neverHeadword = NEVER_LINK_TERM_HEADWORD[en ? 'en' : 'ko'] || [];
        const candidates = [label].concat((term.aliases && term.aliases[lang]) || []);
        candidates.forEach(raw => {
            const alias = typeof raw === 'string' ? raw.trim() : '';
            if (alias.length < 2 || byAlias[alias]) return;
            if (neverHeadword.includes(alias)) return;
            if (!en && alias !== label && NEVER_LINK_TERM_ALIAS_KO.includes(alias)) return;
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

module.exports = {
    BLOCKED_TERM_KO,
    buildTermLinkIndex,
};
