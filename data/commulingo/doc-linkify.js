// The reference-library alias index: which strings belong to which document.
// Index shape ({ pattern, byAlias, en }) matches the other indexes so linkify.js
// can run them all through one replacer.
//
// Unlike terms, a document's aliases are always declared by hand in
// manifest.json. A catalogue title ('레닌, 『현물세』 한국어 번역') is not what
// prose calls the work, and the short form usually is ambiguous: bare 현물세 is
// the tax itself in most sentences and only 『현물세』 is the pamphlet. Guessing
// aliases from titles would produce exactly the wrong links, so a document with
// no aliases simply never auto-links.

const {
    WORD_CHAR,
    escapeHtml,
    escapeRegExp,
    mapLinkableText,
} = require('./people-linkify');

// Builds an alias→document index from the manifest entries
// ({ id, title: {ko,en}, kind: {ko,en}, aliases: {ko:[],en:[]}, ... }).
function buildDocLinkIndex(docs, options = {}) {
    const lang = options.lang || 'ko';
    const en = lang === 'en';
    const byAlias = {};
    const tokens = [];
    (docs || []).forEach(doc => {
        if (!doc || !doc.id) return;
        const label = (doc.title && (doc.title[lang] || doc.title.ko || doc.title.en)) || '';
        const kind = (doc.kind && (doc.kind[lang] || doc.kind.ko || doc.kind.en)) || '';
        const entry = {
            id: doc.id,
            kind: 'doc',
            label,
            note: kind,
            href: '/commulingo/docs/' + encodeURIComponent(doc.id),
        };
        const candidates = (doc.aliases && doc.aliases[lang]) || [];
        candidates.forEach(raw => {
            const alias = typeof raw === 'string' ? raw.trim() : '';
            if (alias.length < 2 || byAlias[alias]) return;
            byAlias[alias] = entry;
            tokens.push(alias);
        });
    });
    if (!tokens.length) return null;
    const all = tokens.slice().sort((a, b) => b.length - a.length);
    const alternation = all.map(escapeRegExp).join('|');
    // Korean aliases carry their own 『』 delimiters, so no word boundary is
    // available or wanted; English ones get \b like every other index.
    const pattern = new RegExp(en ? '\\b(' + alternation + ')\\b' : '(' + alternation + ')', 'g');
    return { pattern, byAlias, en };
}

module.exports = {
    buildDocLinkIndex,
};
