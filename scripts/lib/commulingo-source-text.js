// HTML-to-text normalization for verifying question source excerpts
// (question.source.quote) against the text they claim to quote. Two flavours:
// the site's own reference documents (data/commulingo/docs/*.html, Korean) and
// public-domain chapters on marxists.org (English, Moore/Aveling for Capital).
// Both fold whitespace and entities so a quote copied from the rendered page
// matches the markup on disk.

function decodeEntities(text) {
    return String(text || '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&apos;/g, "'")
        .replace(/&#8216;|&lsquo;/g, '‘').replace(/&#8217;|&rsquo;/g, '’')
        .replace(/&#8220;|&ldquo;/g, '“').replace(/&#8221;|&rdquo;/g, '”')
        .replace(/&#8211;|&ndash;/g, '–').replace(/&#8212;|&mdash;/g, '—')
        .replace(/&#8230;|&hellip;/g, '…')
        .replace(/&#(\d+);/g, function(_, code) { return String.fromCodePoint(Number(code)); })
        .replace(/&#x([0-9a-f]+);/gi, function(_, code) { return String.fromCodePoint(parseInt(code, 16)); });
}

// Curly quotes fold to straight ones so an author who typed either form gets
// a match; dashes are left alone because the site's ko prose bans em dashes
// and the check must not hide one.
function foldQuotes(text) {
    return String(text || '')
        .replace(/[‘’‚‛]/g, "'")
        .replace(/[“”„‟]/g, '"');
}

function collapse(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
}

function stripTags(html) {
    return String(html || '')
        .replace(/<\/(?:p|h\d|li|blockquote|div|summary|tr|td|th|dt|dd)>/gi, ' ')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]+>/g, '');
}

// A site document: drop comments and footnote reference anchors (the
// superscript numbers), then flatten.
function normalizeSiteDoc(html) {
    const stripped = String(html || '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<a class="note-ref"[^>]*>[\s\S]*?<\/a>/g, '');
    return collapse(foldQuotes(decodeEntities(stripTags(stripped))));
}

// A marxists.org chapter page: drop the page chrome (information, footer and
// toc paragraphs), footnote markers such as <a name="9" href="#9a">[9]</a>,
// and script/style, then flatten the body text.
function normalizeMarxists(html) {
    let text = String(html || '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<p class="(?:information|footer|toc|title)"[^>]*>[\s\S]*?<\/p>/gi, '')
        .replace(/<a\s+name="[^"]*"\s+href="#[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '')
        .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '');
    text = stripTags(text);
    return collapse(foldQuotes(decodeEntities(text)));
}

// The anchors a quote may point at: every id= and name= attribute value.
function anchorsOf(html) {
    const ids = new Set();
    for (const m of String(html || '').matchAll(/\b(?:id|name)="([^"]+)"/g)) ids.add(m[1]);
    return ids;
}

// A quote may skip text with ' … '; each piece is matched on its own.
function quotePieces(quote) {
    return String(quote || '').split(' … ').map(function(piece) { return collapse(foldQuotes(piece)); }).filter(Boolean);
}

// Verbatim, allowing for quotation marks: an author who copies a passage and
// drops the inner quotes around “an immense accumulation of commodities” has
// still quoted it, so both sides are compared with every quote character
// removed. Words, punctuation and order must still match exactly.
function loose(text) {
    return collapse(String(text || '').replace(/["'“”‘’„‟«»]/g, ''));
}
function containsQuote(text, piece) {
    return text.includes(piece) || loose(text).includes(loose(piece));
}

module.exports = { decodeEntities, foldQuotes, normalizeSiteDoc, normalizeMarxists, anchorsOf, quotePieces, loose, containsQuote };

// --- marxists.org fetch cache ---------------------------------------------
// Chapter pages are cached under temp_dev (gitignored): the text is public
// domain and stable, ~100 KB a page, and nothing that runs in `scripts/test`
// may touch the network. `fetchCached(url)` reads the cache; pass
// { fetch: true } to fill it.
const fs = require('fs');
const path = require('path');
const MARXISTS_CACHE_DIR = path.join(__dirname, '..', '..', 'temp_dev', 'commulingo-rewrite', 'marxists');

function cachePathForUrl(url) {
    const clean = String(url || '').replace(/#.*$/, '').replace(/^https?:\/\/www\.marxists\.org\//, '');
    return path.join(MARXISTS_CACHE_DIR, clean.replace(/[^A-Za-z0-9._-]+/g, '_'));
}

async function fetchCached(url, options) {
    const opts = options || {};
    const file = cachePathForUrl(url);
    if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8');
    if (!opts.fetch) throw new Error('not cached (run with --fetch): ' + url);
    const clean = String(url).replace(/#.*$/, '');
    const res = await fetch(clean, { headers: { 'user-agent': 'cyber-lenin.com CommuLingo source check' } });
    if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + clean);
    const html = await res.text();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file + '.tmp', html);
    fs.renameSync(file + '.tmp', file);
    return html;
}

module.exports.MARXISTS_CACHE_DIR = MARXISTS_CACHE_DIR;
module.exports.cachePathForUrl = cachePathForUrl;
module.exports.fetchCached = fetchCached;
