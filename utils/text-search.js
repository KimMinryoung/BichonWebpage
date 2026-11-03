// Keyword search over the library lists (reports, curations, diary, posts).
// Every whitespace-separated word must appear somewhere in an entry, case-
// insensitively — the same rule the CommuLingo dictionary search box uses, so
// public/js/commulingo-dict-search.js can drive these lists unchanged.

const MAX_TERMS = 8;

function searchTerms(query) {
    if (typeof query !== 'string') return [];
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return [...new Set(words)].slice(0, MAX_TERMS);
}

// ILIKE operands: LIKE wildcards in the visitor's words match themselves.
function likePatterns(terms) {
    return terms.map(term => `%${term.replace(/[\\%_]/g, '\\$&')}%`);
}

// `AND` of one `<expr> ILIKE $n` per term, numbered after `offset` parameters.
function likeClause(expr, terms, offset = 0) {
    return terms.map((_, i) => `${expr} ILIKE $${offset + i + 1}`).join(' AND ');
}

function plainText(value) {
    return String(value || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[*_`]+/g, '')
        .replace(/[#>|]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// The excerpt a result shows: the opening, or — when no word occurs there —
// a window starting just before the earliest occurrence, so the highlighted
// match is visible in the card.
function matchSnippet(value, terms, length = 200) {
    const text = plainText(value);
    if (!text) return '';
    const lower = text.toLocaleLowerCase();
    const positions = terms.map(term => lower.indexOf(term)).filter(index => index >= 0);
    const first = positions.length ? Math.min(...positions) : -1;
    let start = 0;
    if (first > length * 0.6) {
        start = Math.max(0, first - 60);
        const space = text.indexOf(' ', start);
        if (space >= 0 && space < first) start = space + 1;
    }
    const end = Math.min(text.length, start + length);
    return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = value => value.replace(/[&<>"']/g, char => HTML_ESCAPES[char]);

// Escaped HTML of `value` with each search word marked, the way
// public/js/commulingo-search-utils.js marks the dictionary lists: longer
// words first, case-insensitive. `terms` come from searchTerms().
function highlightTerms(value, terms) {
    const text = String(value == null ? '' : value);
    if (!text || !terms || !terms.length) return escapeHtml(text);
    const words = [...terms].sort((a, b) => b.length - a.length)
        .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    // split() with one capture group puts the matches at the odd indexes.
    return text.split(new RegExp(`(${words.join('|')})`, 'giu'))
        .map((part, i) => (i % 2 ? `<mark class="ui-search-hl">${escapeHtml(part)}</mark>` : escapeHtml(part)))
        .join('');
}

module.exports = { searchTerms, likePatterns, likeClause, plainText, matchSnippet, highlightTerms };
