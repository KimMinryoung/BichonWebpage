// Korean prose uses the National Institute of Korean Language punctuation
// rules (문장 부호, 2015): “ ” for quotation and ‘ ’ for a quote inside a quote
// or emphasis. Generated text (translation, curator, enrichment) keeps
// arriving with typewriter quotes, so every Korean text write goes through
// here. English prose keeps straight quotes (2026-10-13 decision).
//
// Each straight quote becomes an opening or closing mark by what comes
// before it: start of paragraph, whitespace or an opening bracket/dash opens,
// anything else closes. An apostrophe between two Latin letters or digits
// (Lenin's, d'Estaing, rock'n'roll) is left alone. A paragraph is converted
// for a quote kind only when its marks alternate open/close cleanly; anything
// else ('80년대, a stray mark) is left straight for a person to look at, and
// the audit reports it.

const OPEN_BEFORE = /[\s\u200B\uFEFF([{「『《〈“‘—–\-·/:;*]/u;
const LATIN_OR_DIGIT = /[A-Za-z0-9À-ɏ]/;
const MARKS = { '"': ['“', '”'], "'": ['‘', '’'] };
const SKIP_ELEMENTS = new Set(['code', 'pre', 'script', 'style', 'kbd', 'samp']);
const BLOCK_ELEMENTS = new Set(['p', 'br', 'li', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
    'td', 'th', 'tr', 'table', 'div', 'section', 'article', 'aside', 'header', 'footer', 'figure', 'figcaption',
    'dt', 'dd', 'dl', 'hr', 'nav', 'details', 'summary']);

function tagInfo(s, i) {
    const end = s.indexOf('>', i);
    if (end < 0) return null;
    const m = /^<\/?\s*([A-Za-z][A-Za-z0-9-]*)/.exec(s.slice(i, end + 1));
    return { end, name: m ? m[1].toLowerCase() : '', closing: s[i + 1] === '/' };
}

function entityChar(s, i) {
    const m = /^&(#?[A-Za-z0-9]+);/.exec(s.slice(i, i + 12));
    if (!m) return null;
    return { length: m[0].length, ch: m[1] === 'nbsp' || m[1] === '#160' ? ' ' : '.' };
}

// Paragraphs of { index, quote, prev, next } over the text characters of s.
function scan(s, html) {
    const paragraphs = [];
    let current = [];
    let prev = '';
    let skipDepth = 0;
    // URLs (markdown link targets, bare links) keep their characters as typed.
    const urlEnds = new Map();
    for (const m of s.matchAll(/https?:\/\/[^\s<>"“”]+/g)) urlEnds.set(m.index, m.index + m[0].length);
    const flush = () => { if (current.length) paragraphs.push(current); current = []; prev = ''; };
    const nextText = from => {
        for (let j = from; j < s.length; j++) {
            const c = s[j];
            if (!html) return c === '\n' ? '' : c;
            if (c === '<') {
                const tag = tagInfo(s, j);
                if (!tag) return c;
                if (BLOCK_ELEMENTS.has(tag.name)) return '';
                j = tag.end;
                continue;
            }
            if (c === '&') { const e = entityChar(s, j); if (e) return e.ch; }
            return c;
        }
        return '';
    };
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (html && c === '<') {
            const tag = tagInfo(s, i);
            if (tag) {
                if (SKIP_ELEMENTS.has(tag.name)) skipDepth = Math.max(0, skipDepth + (tag.closing ? -1 : 1));
                if (BLOCK_ELEMENTS.has(tag.name)) flush();
                i = tag.end;
                continue;
            }
        }
        if (html && c === '&') {
            const e = entityChar(s, i);
            if (e) { prev = e.ch; i += e.length - 1; continue; }
        }
        if (urlEnds.has(i)) { i = urlEnds.get(i) - 1; prev = s[i]; continue; }
        if (!html && c === '\n') { flush(); continue; }
        if (skipDepth) { prev = c; continue; }
        if (c === '"' || c === "'") current.push({ index: i, quote: c, prev, next: nextText(i + 1) });
        prev = c;
    }
    flush();
    return paragraphs;
}

function decide(paragraph) {
    const out = new Map();
    const leftovers = [];
    for (const quote of Object.keys(MARKS)) {
        const marks = paragraph.filter(m => m.quote === quote
            && !(quote === "'" && LATIN_OR_DIGIT.test(m.prev) && LATIN_OR_DIGIT.test(m.next)));
        if (!marks.length) continue;
        const roles = marks.map(m => (!m.prev || OPEN_BEFORE.test(m.prev) ? 0 : 1));
        const clean = roles.length % 2 === 0 && roles.every((role, k) => role === k % 2)
            && marks.every((m, k) => (k % 2 === 0 ? m.next && !/\s/.test(m.next) : true));
        if (clean) marks.forEach((m, k) => out.set(m.index, MARKS[quote][roles[k]]));
        else leftovers.push(...marks.map(m => m.index));
    }
    return { out, leftovers };
}

function convert(s, html) {
    if (typeof s !== 'string' || (!s.includes('"') && !s.includes("'"))) return { text: s, leftovers: [] };
    // A backslash before a quote is a JSON/SQL escaping leftover, never prose.
    s = s.replace(/\\+(["'])/g, '$1');
    const replace = new Map();
    const leftovers = [];
    for (const paragraph of scan(s, html)) {
        const result = decide(paragraph);
        for (const [index, mark] of result.out) replace.set(index, mark);
        leftovers.push(...result.leftovers);
    }
    if (!replace.size) return { text: s, leftovers };
    let text = '';
    for (let i = 0; i < s.length; i++) text += replace.get(i) || s[i];
    return { text, leftovers };
}

// Twice: a single quote right after a straight double quote ("'수감자'…")
// only reads as opening once that double quote has become “.
const settle = (s, html) => convert(convert(s, html).text, html);
const normalizeKoreanQuotes = text => settle(text, false).text;
const normalizeKoreanQuotesHtml = html => settle(html, true).text;

// Straight quotes a person still has to resolve, with a little context.
function straightQuoteLeftovers(s, { html = false, context = 24 } = {}) {
    const { text, leftovers } = settle(s, html);
    return leftovers.map(i => text.slice(Math.max(0, i - context), i + context + 1).replace(/\s+/g, ' '));
}

// Normalize the listed Korean fields of a payload in place (string or {ko}).
function normalizeKoreanFields(payload, fields) {
    for (const field of fields) {
        const value = payload?.[field];
        if (typeof value === 'string') payload[field] = normalizeKoreanQuotes(value);
        else if (value && typeof value === 'object' && typeof value.ko === 'string') value.ko = normalizeKoreanQuotes(value.ko);
    }
    return payload;
}

// Every `ko` string in a nested {ko, en} structure (data documents, timelines).
function normalizeKoreanTree(value) {
    if (Array.isArray(value)) return value.map(normalizeKoreanTree);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value).map(([key, v]) =>
        [key, key === 'ko' && typeof v === 'string' ? normalizeKoreanQuotes(v) : normalizeKoreanTree(v)]));
}

module.exports = { normalizeKoreanQuotes, normalizeKoreanQuotesHtml, straightQuoteLeftovers, normalizeKoreanFields, normalizeKoreanTree };
