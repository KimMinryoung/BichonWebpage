// The glossary alias index: which strings belong to which term. Index shape
// ({ pattern, byAlias, en }) matches the other indexes so linkify.js can run
// them all through one replacer.
//
// The linking exceptions that used to be three arrays here are rows in
// commulingo_link_blocklist since migration 154, the same move the person pass
// made in 116/117 — a glossary entry about one specific situation that uses a
// common word as its headword or alias (휴전협정, 국민전선) poisons every other
// page that uses the word in its plain sense, and the fix should be one INSERT,
// not a deploy. Three kinds, matched case-sensitively in both languages:
//   term-phrase   — a compound containing an alias, consumed ahead of it
//                   (전세계 holds 전세 and must pass through untouched).
//   term-alias    — an ambiguous alias dropped from the index; the entry's own
//                   headword is spared so it stays reachable by its name.
//   term-headword — dropped even as the headword, for entries whose own name
//                   is too common (소비에트) or homonymous (전세) to link bare.
// A per-document escape hatch also exists for strings that are right almost
// everywhere but wrong on one page: `noAutoLink` in docs/manifest.json.

const { buildAliasPattern } = require('./people-linkify');
const { termBlocklist } = require('./link-blocklist');

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
    const blockedPhrases = termBlocklist('term-phrase', lang);
    const neverAlias = new Set(termBlocklist('term-alias', lang));
    const neverHeadword = new Set(termBlocklist('term-headword', lang));
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
            if (neverHeadword.has(alias)) return;
            if (alias !== label && neverAlias.has(alias)) return;
            byAlias[alias] = entry;
            tokens.push(alias);
        });
    });
    Object.entries(LINK_OVERRIDES).forEach(([alias, targetId]) => {
        if (byAlias[alias] && byId[targetId]) byAlias[alias] = byId[targetId];
    });
    if (!tokens.length) return null;
    const pattern = buildAliasPattern(tokens, blockedPhrases, en);
    return { pattern, byAlias, en };
}

module.exports = {
    buildTermLinkIndex,
};
