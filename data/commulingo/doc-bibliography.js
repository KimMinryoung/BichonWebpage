// A reference document's bibliography (entry.bibliography): the 「번역·편집
// 정보」 a reader unfolds under the 해제 box. Until 2026-11-20 it lived only as
// a hand-written <details class="doc-edition"> list in the body, worded
// differently from document to document, beside a free-text
// entry.editorialNotes the reader merged in and a bare entry.source line in
// the colophon (folded into the 번역 저본 line when the two were merged). The entry now holds it as fields; the reader draws the box
// from them (applyBibliography) and the body keeps only the 해제 paragraphs.
// Design and migration: dev_docs/commulingo-doc-bibliography.md.
//
// Shape: { parts: [part, ...] }. parts[0] without `anchor` is the document's
// own; a collection adds one part per piece, `anchor` naming the id of the
// heading the piece's 해제 box follows.
//   part = { anchor?, originalTitle?, alsoKnownAs?, author?, created?,
//            adopted?, published?, sourceText?, scope?,
//            translation?, translatorNotes?, rights?, notes? }
// A text is inline HTML (links and emphasis only, see INLINE_TAGS). A field
// takes a text, or { text, label } when the document words the line its own
// way (「공포」 for a decree the default 「채택」 would misname). Dated fields
// add `date: [year, month?, day?]`, the structured date the text states; the
// reader never parses dates out of the text. List fields take several.
const { badRequest } = require('./people-admin-fields');

const FIELDS = [
    { key: 'originalTitle', ko: '원제', en: 'Original title' },
    { key: 'alsoKnownAs', ko: '통칭', en: 'Also known as' },
    { key: 'author', ko: '지은이', en: 'Author' },
    { key: 'created', ko: '집필', en: 'Written', dated: true },
    { key: 'adopted', ko: '채택', en: 'Adopted', dated: true },
    { key: 'published', ko: '최초 발표', en: 'First published', dated: true },
    { key: 'sourceText', ko: '번역 저본', en: 'Translated from', list: true },
    { key: 'scope', ko: '번역 범위', en: 'Scope', list: true },
    { key: 'translation', ko: '번역', en: 'Translation', list: true },
    { key: 'translatorNotes', ko: '옮긴이 일러두기', en: "Translator's notes", list: true },
    { key: 'rights', ko: '저작권', en: 'Rights' },
];
const FIELD = new Map(FIELDS.map(field => [field.key, field]));
const PART_KEYS = new Set(['anchor', 'notes', ...FIELD.keys()]);

// Tags a bibliography text may carry, with their attributes. Footnote
// references (a.noteref with id/aria-label) appear in a few boxes.
const INLINE_TAGS = {
    a: new Set(['href', 'class', 'id', 'aria-label', 'title']),
    em: new Set(), i: new Set(), b: new Set(), strong: new Set(), cite: new Set(),
    code: new Set(), sup: new Set(), sub: new Set(), br: new Set(), span: new Set(['lang']),
};
const SAFE_HREF = /^(?:https?:\/\/|\/(?!\/)|#)/i;

const isObject = value => value && typeof value === 'object' && !Array.isArray(value);

function assertInline(html, where) {
    if (typeof html !== 'string' || !html.trim()) throw badRequest(`${where} must be non-empty text`);
    if ([...html].length > 4000) throw badRequest(`${where} is longer than 4000 characters`);
    const open = [];
    for (const match of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g)) {
        const [, closing, rawName, attrs] = match;
        const name = rawName.toLowerCase();
        const allowed = INLINE_TAGS[name];
        if (!allowed) throw badRequest(`${where}: <${name}> is not allowed (links and emphasis only)`);
        if (closing) {
            if (open.pop() !== name) throw badRequest(`${where}: </${name}> does not close the open tag`);
            continue;
        }
        for (const attr of attrs.matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g)) {
            if (!allowed.has(attr[1].toLowerCase())) throw badRequest(`${where}: <${name} ${attr[1]}> is not allowed`);
            if (attr[1].toLowerCase() === 'href' && !SAFE_HREF.test(attr[2])) throw badRequest(`${where}: link ${attr[2]} must be http(s), / or #`);
        }
        if (/\son[a-z]+\s*=|\sstyle\s*=/i.test(attrs)) throw badRequest(`${where}: event or style attributes are not allowed`);
        if (name !== 'br' && !/\/\s*$/.test(attrs)) open.push(name);
    }
    if (open.length) throw badRequest(`${where}: <${open[open.length - 1]}> is not closed`);
    if (/<(?![a-zA-Z/])/.test(html.replace(/<!--[\s\S]*?-->/g, ''))) throw badRequest(`${where}: a bare "<" must be written &lt;`);
}

function normalizeDate(date, where) {
    if (date === undefined || date === null) return undefined;
    if (!Array.isArray(date) || date.length < 1 || date.length > 3 || !date.every(Number.isInteger)) {
        throw badRequest(`${where}.date must be [year, month?, day?]`);
    }
    const [year, month, day] = date;
    if (year < 1 || year > 2100 || (month !== undefined && (month < 1 || month > 12)) || (day !== undefined && (day < 1 || day > 31))) {
        throw badRequest(`${where}.date is out of range`);
    }
    return date;
}

// One value: a text, or { text, label?, date? }. Stored in the smallest form.
function normalizeValue(value, field, where) {
    if (typeof value === 'string') {
        assertInline(value, where);
        return value.trim();
    }
    if (!isObject(value)) throw badRequest(`${where} must be text or { text, label${field.dated ? ', date' : ''} }`);
    const allowedKeys = new Set(['text', 'label', ...(field.dated ? ['date'] : [])]);
    const unknown = Object.keys(value).filter(key => !allowedKeys.has(key));
    if (unknown.length) throw badRequest(`${where} has unknown keys: ${unknown.join(', ')}`);
    assertInline(value.text, `${where}.text`);
    const out = { text: value.text.trim() };
    if (value.label !== undefined) {
        if (typeof value.label !== 'string' || !value.label.trim() || [...value.label].length > 20 || /[<>:]/.test(value.label)) {
            throw badRequest(`${where}.label must be a short plain word (at most 20 characters)`);
        }
        if (value.label.trim() !== field.ko) out.label = value.label.trim();
    }
    const date = normalizeDate(value.date, where);
    if (date) out.date = date;
    return Object.keys(out).length === 1 ? out.text : out;
}

function normalizePart(part, index) {
    const where = `bibliography.parts[${index}]`;
    if (!isObject(part)) throw badRequest(`${where} must be an object`);
    const unknown = Object.keys(part).filter(key => !PART_KEYS.has(key));
    if (unknown.length) throw badRequest(`${where} has unknown keys: ${unknown.join(', ')}`);
    const out = {};
    if (part.anchor !== undefined && part.anchor !== null) {
        if (typeof part.anchor !== 'string' || !/^[A-Za-z0-9_-]+$/.test(part.anchor)) throw badRequest(`${where}.anchor must be a heading id`);
        out.anchor = part.anchor;
    }
    for (const field of FIELDS) {
        const value = part[field.key];
        if (value === undefined || value === null) continue;
        if (field.list) {
            const list = Array.isArray(value) ? value : [value];
            if (!list.length) continue;
            out[field.key] = list.map((item, i) => normalizeValue(item, field, `${where}.${field.key}[${i}]`));
        } else {
            out[field.key] = normalizeValue(value, field, `${where}.${field.key}`);
        }
    }
    if (part.notes !== undefined && part.notes !== null) {
        const notes = Array.isArray(part.notes) ? part.notes : [part.notes];
        notes.forEach((note, i) => assertInline(note, `${where}.notes[${i}]`));
        if (notes.length) out.notes = notes.map(note => note.trim());
    }
    if (!Object.keys(out).some(key => key !== 'anchor')) throw badRequest(`${where} is empty`);
    return out;
}

// Validates and returns the stored form; throws a 400 on any fault.
function normalizeBibliography(value) {
    if (!isObject(value) || !Array.isArray(value.parts) || !value.parts.length) {
        throw badRequest('bibliography must be { parts: [ ... ] } with at least one part');
    }
    const unknown = Object.keys(value).filter(key => key !== 'parts');
    if (unknown.length) throw badRequest(`bibliography has unknown keys: ${unknown.join(', ')}`);
    const parts = value.parts.map(normalizePart);
    const anchors = new Set();
    parts.forEach((part, i) => {
        const key = part.anchor || '';
        if (anchors.has(key)) throw badRequest(`bibliography.parts[${i}] repeats ${key ? `anchor ${key}` : 'the document part (no anchor)'}`);
        anchors.add(key);
    });
    return { parts };
}

// Anchors the parts point at that are not heading ids of the body (a typo
// would silently drop that piece's box). `headingIds` is a Set.
function missingAnchors(bibliography, headingIds) {
    return (bibliography?.parts || []).map(part => part.anchor).filter(anchor => anchor && !headingIds.has(anchor));
}

const escapeText = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const valueText = value => (typeof value === 'string' ? value : value.text);

function renderPart(part, lang) {
    const en = lang === 'en';
    // Rows of [label, texts]: values in a row with the label of the row
    // before it join that row, one line each, so a label is not repeated.
    const rows = [];
    for (const field of FIELDS) {
        const value = part[field.key];
        if (value === undefined) continue;
        for (const item of field.list ? value : [value]) {
            // A document's own wording is Korean; the English page names the field.
            const label = en ? field.en : (typeof item === 'object' && item.label) || field.ko;
            const last = rows[rows.length - 1];
            if (last && last[0] === label) last[1].push(valueText(item));
            else rows.push([label, [valueText(item)]]);
        }
    }
    const items = rows.map(([label, texts]) => `<tr><th scope="row">${escapeText(label)}</th><td>${texts.join('<br>')}</td></tr>`);
    const notes = (part.notes || []).map(note => `<p>${note}</p>`).join('');
    // A two-column table (label | text) reads better than 「label: text」 lines
    // when the texts run long (owner, 2026-11-20).
    const list = items.length ? `<table class="doc-edition-fields"><tbody>${items.join('')}</tbody></table>` : '';
    return `<details class="doc-edition"><summary>${en ? 'Translation and editing' : '번역·편집 정보'}</summary>${notes}${list}</details>`;
}

// Puts each part's box into the 해제 box it belongs to in this page's html:
// the document part into the first aside.doc-editorial when `opening` (the
// page that carries the document's opening), a piece's part into the first
// aside.doc-editorial after the heading with its anchor id. A box the body
// still holds there is replaced, so a document reads the same before and
// after its body box is removed. Parts whose place is not on this page are
// left for the page that has it.
const EDITORIAL = /<aside\b[^>]*class="[^"]*\bdoc-editorial\b[^"]*"[^>]*>[\s\S]*?<\/aside>/g;
const EDITION = /<details class="doc-edition">[\s\S]*?<\/details>/;

function placeBox(aside, box) {
    if (EDITION.test(aside)) return aside.replace(EDITION, () => box);
    return aside.replace(/<\/aside>$/, () => `${box}</aside>`);
}

function applyBibliography(html, bibliography, { lang = 'ko', opening = true } = {}) {
    const parts = bibliography?.parts;
    if (!parts?.length || typeof html !== 'string') return html;
    let out = html;
    for (const part of parts) {
        const box = renderPart(part, lang);
        let from = 0;
        if (part.anchor) {
            const heading = out.search(new RegExp(`<h[1-6]\\b[^>]*\\bid="${part.anchor}"`));
            if (heading === -1) continue;
            from = heading;
        } else if (!opening) continue;
        EDITORIAL.lastIndex = from;
        const match = EDITORIAL.exec(out);
        if (!match) continue;
        out = out.slice(0, match.index) + placeBox(match[0], box) + out.slice(match.index + match[0].length);
    }
    return out;
}

// The document's own part (no anchor), for structured data.
function documentPart(bibliography) {
    return (bibliography?.parts || []).find(part => !part.anchor) || null;
}

module.exports = { FIELDS, normalizeBibliography, missingAnchors, renderPart, applyBibliography, documentPart, assertInline };
