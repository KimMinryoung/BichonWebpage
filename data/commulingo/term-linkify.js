// Auto-links glossary terms inside prose, the term counterpart of
// event-linkify. Index shape ({ pattern, byAlias, en }) and the Korean
// preceding-char guard mirror buildPersonLinkIndex so all indexes share one
// replacer pipeline (see report-links.js).

const { escapeRegExp } = require('./people-linkify');

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

module.exports = {
    BLOCKED_TERM_KO,
    buildTermLinkIndex,
};
