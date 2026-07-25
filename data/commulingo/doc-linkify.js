// Auto-links reference-library documents inside prose, the document
// counterpart of term-linkify. Index shape ({ pattern, byAlias, en }) and the
// Korean preceding-char guard mirror buildTermLinkIndex so every index shares
// one replacer pipeline (see report-links.js).
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

// Links the FIRST mention of each document and leaves later ones plain, the
// same restraint the term and report replacers use. excludeId keeps a page from
// linking to itself; `seen` is shared across calls so a document linked in a
// definition is not linked again in the body below it.
function makeDocReplacer(index, excludeId, seen) {
    return function replacer(match, _token, offset, source) {
        if (!index.en) {
            const prev = offset > 0 ? source.charAt(offset - 1) : '';
            if (WORD_CHAR.test(prev)) return match;
        }
        const doc = index.byAlias[match];
        if (!doc || doc.id === excludeId || seen.has(doc.id)) return match;
        seen.add(doc.id);
        const title = escapeHtml(doc.note ? doc.label + ' · ' + doc.note : doc.label);
        return '<a class="commu-doc-link" href="' + doc.href
            + '" title="' + title + '">' + match + '</a>';
    };
}

// Links documents inside already-rendered HTML (a term body, a person section).
// Run this BEFORE the term pass: document aliases are specific work titles and
// the term pass would otherwise claim a shorter alias inside one of them, and
// whichever runs first wins because mapLinkableText skips anchor contents.
function linkifyDocsHtml(html, index, excludeId, seen) {
    if (!html || !index) return html || '';
    const replacer = makeDocReplacer(index, excludeId, seen || new Set());
    return mapLinkableText(html, text => text.replace(index.pattern, replacer));
}

// Escapes raw text, then links documents. Use for plain prose (a definition).
function linkifyDocsPlain(rawText, index, excludeId, seen) {
    const escaped = escapeHtml(rawText || '');
    if (!index) return escaped;
    return escaped.replace(index.pattern, makeDocReplacer(index, excludeId, seen || new Set()));
}

// Index building walks every alias of every document, so memoize it against the
// manifest array the store hands out. docs-store rebuilds that array only when
// manifest.json's mtime changes, so the reference doubles as the cache key
// (same approach as commulingo-terms.js and report-links.js). Lives here rather
// than in each route because both the term and person pages need it.
let indexMemo = { docsRef: null, byLang: {} };

function docLinkIndexFor(docs, lang) {
    if (indexMemo.docsRef !== docs) {
        indexMemo = { docsRef: docs, byLang: {} };
    }
    if (!(lang in indexMemo.byLang)) {
        indexMemo.byLang[lang] = buildDocLinkIndex(docs, { lang });
    }
    return indexMemo.byLang[lang];
}

module.exports = {
    buildDocLinkIndex,
    docLinkIndexFor,
    linkifyDocsHtml,
    linkifyDocsPlain,
};
