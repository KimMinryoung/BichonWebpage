// Static pages (/p/:slug) carry author HTML: sections, tables, inline SVG
// diagrams and page-scoped <style> blocks, written by the leninbot publishing
// tools. They used to reach the browser as raw JSON and be cleaned there by
// DOMPurify from a CDN, so the body was blank without JavaScript or the CDN.
// The server now cleans it with the same intent: drop scripts, event
// handlers, script URLs, frames and form controls, keep the structure and the
// SVG. scripts/smoke-static-page-sanitize.js pins the rules.
const sanitizeHtml = require('sanitize-html');

const SVG_TAGS = ['svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
    'text', 'tspan', 'title', 'desc', 'defs', 'marker', 'use', 'lineargradient', 'radialgradient', 'stop'];
const SVG_ATTRIBUTES = ['viewBox', 'xmlns', 'preserveAspectRatio', 'width', 'height', 'x', 'y', 'x1', 'x2', 'y1', 'y2',
    'cx', 'cy', 'r', 'rx', 'ry', 'd', 'points', 'transform', 'dx', 'dy', 'fill', 'fill-opacity', 'opacity',
    'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'stroke-opacity',
    'font-family', 'font-size', 'font-weight', 'text-anchor', 'dominant-baseline', 'offset', 'stop-color',
    'marker-end', 'marker-start', 'markerWidth', 'markerHeight', 'refX', 'refY', 'orient', 'gradientTransform'];

const OPTIONS = {
    allowedTags: [
        'article', 'section', 'aside', 'header', 'footer', 'nav', 'div', 'span', 'style',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'blockquote', 'pre', 'code',
        'em', 'strong', 'b', 'i', 'u', 's', 'small', 'sub', 'sup', 'mark', 'abbr', 'cite', 'q', 'del', 'ins', 'time',
        'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'a', 'img', 'figure', 'figcaption', 'details', 'summary',
        'table', 'caption', 'colgroup', 'col', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
        ...SVG_TAGS,
    ],
    allowedAttributes: {
        '*': ['class', 'id', 'style', 'title', 'lang', 'dir', 'role', 'aria-*', 'data-*', ...SVG_ATTRIBUTES],
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'alt', 'loading', 'width', 'height'],
        ol: ['start', 'type', 'reversed'],
        li: ['value'],
        th: ['scope', 'colspan', 'rowspan', 'headers'],
        td: ['colspan', 'rowspan', 'headers'],
        col: ['span'],
        colgroup: ['span'],
        time: ['datetime'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    allowProtocolRelative: false,
    // Page-scoped <style> blocks were allowed by the old client sanitizer too.
    allowVulnerableTags: true,
    nonTextTags: ['script', 'textarea', 'option', 'noscript', 'iframe', 'object', 'embed', 'template'],
    // SVG attribute names are case-sensitive (viewBox, preserveAspectRatio).
    parser: { lowerCaseAttributeNames: false },
    // Keep style attributes as written (no property filter is configured, so
    // reparsing would only reformat them).
    parseStyleAttributes: false,
};

const cache = new Map();
const CACHE_LIMIT = 200;

// Cached per body text: a page is rendered once per change, not per request.
function renderStaticPageBody(html) {
    const source = String(html || '');
    let out = cache.get(source);
    if (out === undefined) {
        out = sanitizeHtml(source, OPTIONS);
        if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value);
        cache.set(source, out);
    }
    return out;
}

module.exports = { renderStaticPageBody };
