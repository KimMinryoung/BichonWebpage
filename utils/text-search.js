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

module.exports = { searchTerms, likePatterns, likeClause, plainText, matchSnippet };
