// Cuts a long reference document into pages for the reader.
//
// A page holds about PAGE_TARGET_TEXT characters of reading text: tags and
// embedded image data do not count, because neither is something a reader
// reads. Embedded images still weigh on the download, so PAGE_MAX_HTML caps a
// page's size separately.
//
// A cut goes at the strongest boundary near the target: h1, then h2, then h3,
// then any other top-level block, so a document with few headings still gets
// pages. Nothing inside a table, list, quotation, editorial box or notes
// section is ever cut. Section wrappers open at a cut are closed at the end of
// the page and reopened (without their id) on the next one, so `section`
// styling and ids stay right on both sides.

const { Parser } = require('htmlparser2');
const { decodeEntities } = require('./doc-search');

const PAGE_TARGET_TEXT = 30000;
// Documents up to this much text stay on a single scroll.
const SINGLE_PAGE_TEXT = 40000;
// The window around the target in which a stronger boundary beats a closer one.
const WINDOW_MIN_TEXT = PAGE_TARGET_TEXT * 0.7;
const WINDOW_MAX_TEXT = PAGE_TARGET_TEXT * 1.3;
// An h1 opens a new page once the current one holds this much: a collection's
// next text, without giving every short law or article a page of its own.
const H1_MIN_TEXT = PAGE_TARGET_TEXT / 3;
// A tail shorter than this stays on the page before it.
const MIN_TAIL_TEXT = PAGE_TARGET_TEXT / 4;
const PAGE_MAX_HTML = 2000000;

// Containers a cut may pass through; their children are the page's blocks.
const WRAPPERS = new Set(['article', 'section', 'div', 'main']);
// Other elements a cut may land in front of, kept whole.
const BLOCKS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'table', 'ul', 'ol', 'dl',
    'blockquote', 'figure', 'pre', 'img', 'aside', 'details', 'header', 'footer', 'nav', 'address']);
// Wrappers that are one unit even though they are built like a section.
const WHOLE_CLASS = /(?:^|\s)(?:notes|doc-editorial|doc-edition)(?:\s|$)/;
const HEADING = /^h([1-6])$/;
const VOID = new Set(['area', 'br', 'col', 'embed', 'hr', 'img', 'input', 'wbr']);

// Plain text: whoever shows it escapes it, so an entity must not stay encoded.
function headingText(headingHtml) {
    return decodeEntities(headingHtml.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

// One pass over the HTML. Returns the headings in order, the places a cut may
// go ({ at, level, text, open }; text = reading text before it; open = the
// wrappers open there) and the total reading text.
function scan(html) {
    const stack = [];
    const cuts = [];
    const headings = [];
    let text = 0;
    let wholeDepth = 0; // inside a kept-whole element when > 0
    let fresh = null; // the last cut, while nothing has followed it yet
    const parser = new Parser({
        onopentag(name, attribs) {
            const at = parser.startIndex;
            const match = HEADING.exec(name);
            const level = match ? Number(match[1]) : 0;
            const open = { name, at, headingLevel: level };
            if (level && fresh && fresh.at < at) {
                // <section><h2>: the page opens with the wrapper, at the
                // heading's strength.
                fresh.level = Math.min(fresh.level, level <= 3 ? level : 4);
            }
            if (wholeDepth > 0) {
                wholeDepth += 1;
                open.whole = true;
                if (!level) fresh = null;
            } else {
                const wrapper = WRAPPERS.has(name) && !WHOLE_CLASS.test(attribs.class || '');
                if (wrapper) {
                    if (!(level && fresh)) cuts.push(fresh = { at, level: 4, text, open: stack.filter(e => e.wrapper) });
                    open.wrapper = true;
                    open.tag = html.slice(at, parser.endIndex + 1);
                } else if (BLOCKS.has(name) || WHOLE_CLASS.test(attribs.class || '')) {
                    if (!(level && fresh)) {
                        const cut = { at, level: level && level <= 3 ? level : 4, text, open: stack.filter(e => e.wrapper) };
                        cuts.push(cut);
                        fresh = WHOLE_CLASS.test(attribs.class || '') ? cut : null;
                    } else {
                        fresh = null;
                    }
                    wholeDepth = 1;
                    open.whole = true;
                } else {
                    // Inline at the top level, or an element we know nothing about.
                    wholeDepth = 1;
                    open.whole = true;
                    fresh = null;
                }
            }
            stack.push(open);
            if (VOID.has(name)) fresh = null;
        },
        ontext(chunk) {
            const size = chunk.replace(/\s+/g, ' ').trim().length;
            if (size) fresh = null;
            text += size;
        },
        onclosetag(name) {
            const open = stack.pop();
            if (!open) return;
            if (open.whole) wholeDepth -= 1;
            if (open.headingLevel && open.headingLevel <= 3) {
                const end = parser.endIndex + 1;
                headings.push({
                    at: open.at, end, level: open.headingLevel,
                    text: headingText(html.slice(open.at, end)),
                    id: (html.slice(open.at, end).match(/^<h\d[^>]*\bid="([^"]+)"/) || [])[1] || '',
                });
            }
        },
    }, { decodeEntities: true });
    parser.write(html);
    parser.end();
    return { cuts, headings, text };
}

// Chooses the cuts among those after startIndex; returns their indexes.
function chooseCuts(cuts, startIndex, totalText, htmlLength) {
    const chosen = [];
    let baseText = startIndex.text;
    let baseAt = startIndex.at;
    let index = startIndex.index;
    while (index < cuts.length) {
        let window = [];
        let pick = -1;
        let previous = -1;
        for (let i = index; i < cuts.length; i += 1) {
            const cut = cuts[i];
            const filled = cut.text - baseText;
            if (cut.at - baseAt > PAGE_MAX_HTML) {
                pick = previous >= 0 ? previous : i;
                break;
            }
            if (cut.level === 1 && filled >= H1_MIN_TEXT) {
                pick = i;
                break;
            }
            if (filled > WINDOW_MAX_TEXT) {
                if (window.length) {
                    pick = bestOf(window, cuts, baseText);
                } else if (previous >= 0 && cuts[previous].text - baseText >= PAGE_TARGET_TEXT / 3) {
                    pick = previous;
                } else {
                    pick = i;
                }
                break;
            }
            if (filled >= WINDOW_MIN_TEXT) window.push(i);
            previous = i;
        }
        // The end of the document came first: the rest may still be too long
        // for a page, or the window's best cut may leave a fair last page.
        if (pick < 0 && window.length && totalText - baseText > WINDOW_MAX_TEXT) pick = bestOf(window, cuts, baseText);
        if (pick < 0) break;
        const tail = totalText - cuts[pick].text;
        if (tail < MIN_TAIL_TEXT && htmlLength - baseAt <= PAGE_MAX_HTML) break;
        chosen.push(pick);
        baseText = cuts[pick].text;
        baseAt = cuts[pick].at;
        index = pick + 1;
        window = [];
    }
    return chosen;
}

function bestOf(window, cuts, baseText) {
    let best = window[0];
    const score = i => [cuts[i].level, Math.abs(cuts[i].text - baseText - PAGE_TARGET_TEXT)];
    for (const i of window) {
        const [level, distance] = score(i);
        const [bestLevel, bestDistance] = score(best);
        if (level < bestLevel || (level === bestLevel && distance < bestDistance)) best = i;
    }
    return best;
}

// Returns { titleHtml, pages: [{ html, heading, continued }], idToPage } for a
// long document, or null when it reads fine as a single page. `continued`
// marks a page that opens in the middle of `heading`'s section.
function paginateBody(html) {
    if (html.length <= SINGLE_PAGE_TEXT) return null;
    const { cuts, headings, text } = scan(html);
    if (text <= SINGLE_PAGE_TEXT && html.length <= PAGE_MAX_HTML) return null;

    // The first h1 is the document title (see annotateHeadings); it renders
    // on every page. Without one, whatever precedes the first heading does.
    const firstHeading = headings.find(heading => heading.level <= 2);
    let titleEnd = 0;
    if (firstHeading) titleEnd = firstHeading.level === 1 ? firstHeading.end : firstHeading.at;
    const titleHtml = html.slice(0, titleEnd);

    const firstIndex = cuts.findIndex(cut => cut.at >= titleEnd);
    if (firstIndex < 0) return null;
    // A cut at the first block would leave page 1 empty.
    const start = {
        index: firstIndex + 1,
        at: titleEnd,
        text: cuts[firstIndex].text,
    };
    const chosen = chooseCuts(cuts, start, text, html.length);
    if (!chosen.length) return null;

    const reopened = cut => cut.open.filter(wrapper => wrapper.at >= titleEnd);
    const pages = [];
    const bounds = [titleEnd, ...chosen.map(i => cuts[i].at), html.length];
    // The title is on every page already; it is not the section a page continues.
    const headingBefore = at => {
        let found = null;
        for (const heading of headings) {
            if (heading.at >= at) break;
            if (heading.at >= titleEnd) found = heading;
        }
        return found;
    };
    for (let i = 0; i + 1 < bounds.length; i += 1) {
        const cutHere = i > 0 ? cuts[chosen[i - 1]] : null;
        const cutNext = i + 1 < bounds.length - 1 ? cuts[chosen[i]] : null;
        const body = html.slice(bounds[i], bounds[i + 1]);
        const head = cutHere ? reopened(cutHere).map(wrapper => wrapper.tag.replace(/\s+id="[^"]*"/, '')).join('') : '';
        const tail = cutNext ? reopened(cutNext).reverse().map(wrapper => `</${wrapper.name}>`).join('') : '';
        const own = headings.find(heading => heading.at >= bounds[i] && heading.at < bounds[i + 1]);
        // A heading with no text between the page's start and itself opens the page.
        const opens = own && (i === 0 || !headingText(html.slice(bounds[i], own.at)));
        let heading = '';
        let continued = false;
        if (opens) heading = own.text;
        else if (i === 0) heading = own ? own.text : '';
        else {
            const before = headingBefore(bounds[i]);
            heading = before ? before.text : '';
            continued = Boolean(before);
        }
        pages.push({ html: head + body + tail, heading, continued });
    }
    if (pages.length < 2) return null;

    const idToPage = {};
    pages.forEach((page, i) => {
        for (const m of page.html.matchAll(/<h[1-3]\b[^>]*\bid="([^"]+)"/g)) idToPage[m[1]] = i + 1;
    });
    // Point cross-page fragment links at the page holding their target: a
    // note ref [3] on page 1 must reach the notes section on the last page,
    // and the note's ↩ must come back. idToPage stays headings-only (it is
    // serialized into the reader for anchor arrivals); this map covers every
    // id, notes included.
    const anchorPage = {};
    pages.forEach((page, i) => {
        for (const m of page.html.matchAll(/\bid="([^"]+)"/g)) anchorPage[m[1]] = i + 1;
    });
    pages.forEach((page, i) => {
        page.html = page.html.replace(/href="#([^"]+)"/g, (full, id) =>
            anchorPage[id] && anchorPage[id] !== i + 1 ? `href="?p=${anchorPage[id]}#${id}"` : full);
    });
    return { titleHtml, pages, idToPage };
}

module.exports = { paginateBody, headingText, PAGE_TARGET_TEXT, SINGLE_PAGE_TEXT, PAGE_MAX_HTML };
