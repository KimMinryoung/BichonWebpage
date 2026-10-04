// Allowlist for imported reference-document HTML. The import fetches outside
// HTML, so trusting the editor does not make the markup safe: event handler
// attributes, javascript: URLs and active elements are dropped here before a
// fragment is written. The list covers what data/commulingo/docs/*.html uses
// (article structure, tables, footnote anchors, details, figures with inline
// images) and scripts/smoke-commulingo-doc-sanitize.js checks that every
// stored document passes through unchanged.
const sanitizeHtml = require('sanitize-html');

const DOC_SANITIZE_OPTIONS = {
    allowedTags: [
        'article', 'section', 'aside', 'header', 'footer', 'nav', 'main', 'div', 'span',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'blockquote', 'pre', 'code',
        'em', 'strong', 'b', 'i', 'u', 's', 'small', 'sub', 'sup', 'mark', 'abbr', 'cite', 'q', 'del', 'ins', 'time',
        'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'a',
        'table', 'caption', 'colgroup', 'col', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
        'details', 'summary', 'figure', 'figcaption', 'img',
    ],
    allowedAttributes: {
        '*': ['class', 'id', 'lang', 'dir', 'title', 'style', 'role', 'aria-*', 'data-*'],
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'alt', 'loading', 'width', 'height'],
        ol: ['start', 'type', 'reversed'],
        li: ['value'],
        th: ['scope', 'colspan', 'rowspan', 'headers'],
        td: ['colspan', 'rowspan', 'headers'],
        col: ['span'],
        colgroup: ['span'],
        time: ['datetime'],
        blockquote: ['cite'],
        q: ['cite'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    allowProtocolRelative: false,
    // Text inside dropped elements (script, style, iframe…) goes with them.
    nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript', 'iframe', 'object', 'embed', 'template'],
};

function sanitizeDocHtml(html) {
    return sanitizeHtml(String(html), DOC_SANITIZE_OPTIONS);
}

module.exports = { sanitizeDocHtml, DOC_SANITIZE_OPTIONS };
