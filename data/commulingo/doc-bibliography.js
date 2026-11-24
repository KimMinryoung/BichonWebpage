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
// reader never parses dates out of the text. List fields take several: the
// dated ones one per piece of a document with n pieces (two letters, two
// dates; owner, 2026-11-20). A single value stored before then still reads.
const { badRequest } = require('./people-admin-fields');

const FIELDS = [
    { key: 'originalTitle', ko: '원제', en: 'Original title' },
    { key: 'alsoKnownAs', ko: '통칭', en: 'Also known as' },
    { key: 'author', ko: '지은이', en: 'Author' },
    { key: 'created', ko: '집필', en: 'Written', dated: true, list: true },
    { key: 'adopted', ko: '채택', en: 'Adopted', dated: true, list: true },
    { key: 'published', ko: '최초 발표', en: 'First published', dated: true, list: true },
    { key: 'sourceText', ko: '번역 저본', en: 'Translated from', list: true },
    { key: 'scope', ko: '번역 범위', en: 'Scope', list: true },
    // A translation value may also state the record as fields (TRANSLATION_KEYS).
    { key: 'translation', ko: '번역', en: 'Translation', list: true, record: true },
    { key: 'translatorNotes', ko: '옮긴이 일러두기', en: "Translator's notes", list: true },
    // An original's own editing (spelling kept, marks, OCR corrections).
    { key: 'editing', ko: '편집', en: 'Editing', list: true },
    // A rights value may also state its status as fields (RIGHTS_KEYS).
    { key: 'rights', ko: '저작권', en: 'Rights', rights: true },
];
const FIELD = new Map(FIELDS.map(field => [field.key, field]));
// On a published original's page the same fields describe the original text.
const ORIGINAL_LABELS = { sourceText: { ko: '원문 저본', en: 'Source text' }, scope: { ko: '수록 범위', en: 'Scope' } };
const SUMMARY = { translation: { ko: '번역·편집 정보', en: 'Translation and editing' }, original: { ko: '원문·편집 정보', en: 'Source and editing' } };
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

// The translation record a 번역 value states beside its sentence
// (2026-11-24): from = the language translated from, via = the language of
// an intermediate translation it was made from (absent: from the original
// directly), by = who did what, in order. The sentence stays what the box
// shows; the fields are what checks and lists read.
const LANG_CODE = /^[a-z]{2,3}$/;
const RECORD_ROLES = new Set(['translation', 'revision']);
const TRANSLATION_KEYS = ['from', 'via', 'by'];

function normalizeRecord(value, where) {
    const out = {};
    for (const key of ['from', 'via']) {
        if (value[key] === undefined) continue;
        if (typeof value[key] !== 'string' || !LANG_CODE.test(value[key])) throw badRequest(`${where}.${key} must be a language code (ISO 639, e.g. ru, de, zh)`);
        out[key] = value[key];
    }
    if (out.via && !out.from) throw badRequest(`${where}.via needs from`);
    if (out.via && out.via === out.from) throw badRequest(`${where}.via must differ from from`);
    if (value.by !== undefined) {
        if (!Array.isArray(value.by) || !value.by.length) throw badRequest(`${where}.by must be a non-empty list of { name, role, date? }`);
        out.by = value.by.map((step, i) => {
            const at = `${where}.by[${i}]`;
            if (!isObject(step)) throw badRequest(`${at} must be { name, role, date? }`);
            const unknown = Object.keys(step).filter(key => !['name', 'role', 'date'].includes(key));
            if (unknown.length) throw badRequest(`${at} has unknown keys: ${unknown.join(', ')}`);
            if (typeof step.name !== 'string' || !step.name.trim() || [...step.name].length > 60 || /[<>]/.test(step.name)) {
                throw badRequest(`${at}.name must be plain text of at most 60 characters`);
            }
            if (!RECORD_ROLES.has(step.role)) throw badRequest(`${at}.role must be one of ${[...RECORD_ROLES].join(', ')}`);
            const date = normalizeDate(step.date, at);
            return { name: step.name.trim(), role: step.role, ...(date ? { date } : {}) };
        });
    }
    return out;
}

// The status a 저작권 value states beside its sentence (2026-11-24): why the
// text may be published. publicDomain = the term ran out (authorDied: the
// year it counts from, when it is a death); notCopyrightable = a statute,
// treaty or official document; licensed = an open licence (license: its
// URL); permission = the holder allowed it; ownerDecision = published on
// 비숑's decision whatever the term (decided: the day), e.g. party documents,
// declarations and Mao's writings (2026-11-15) or 1988-89 Soviet articles.
const RIGHTS_STATUS = new Set(['publicDomain', 'notCopyrightable', 'licensed', 'permission', 'ownerDecision']);
const RIGHTS_KEYS = ['status', 'authorDied', 'license', 'decided'];

function normalizeRights(value, where) {
    if (value.status === undefined) {
        if (RIGHTS_KEYS.some(key => value[key] !== undefined)) throw badRequest(`${where} needs status with ${RIGHTS_KEYS.slice(1).join('/')}`);
        return {};
    }
    if (!RIGHTS_STATUS.has(value.status)) throw badRequest(`${where}.status must be one of ${[...RIGHTS_STATUS].join(', ')}`);
    const out = { status: value.status };
    if (value.authorDied !== undefined) {
        if (value.status !== 'publicDomain' || !Number.isInteger(value.authorDied) || value.authorDied < 1 || value.authorDied > 2100) {
            throw badRequest(`${where}.authorDied is a year, for publicDomain`);
        }
        out.authorDied = value.authorDied;
    }
    if (value.license !== undefined) {
        if (value.status !== 'licensed' || typeof value.license !== 'string' || !/^https?:\/\/\S+$/.test(value.license)) {
            throw badRequest(`${where}.license is the licence URL, for licensed`);
        }
        out.license = value.license;
    }
    if (value.status === 'licensed' && !out.license) throw badRequest(`${where}: licensed needs license (its URL)`);
    if (value.decided !== undefined) {
        if (value.status !== 'ownerDecision') throw badRequest(`${where}.decided is for ownerDecision`);
        out.decided = normalizeDate(value.decided, `${where}.decided`.replace(/\.decided$/, ''));
    }
    return out;
}

// One value: a text, or { text, label?, date? } (a translation value also
// from/via/by, a rights value status/…). Stored in the smallest form.
function normalizeValue(value, field, where) {
    if (typeof value === 'string') {
        assertInline(value, where);
        return value.trim();
    }
    if (!isObject(value)) throw badRequest(`${where} must be text or { text, label${field.dated ? ', date' : ''} }`);
    const allowedKeys = new Set(['text', 'label', ...(field.dated ? ['date'] : []), ...(field.record ? TRANSLATION_KEYS : []), ...(field.rights ? RIGHTS_KEYS : [])]);
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
    if (field.record) Object.assign(out, normalizeRecord(value, where));
    if (field.rights) Object.assign(out, normalizeRights(value, where));
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

// A published original's bibliography: one per site language, each a
// bibliography as above whose texts are in that language (labels in English
// are used only where a value has none of its own).
function normalizeOriginalBibliography(value) {
    if (value === undefined || value === null) return null;
    if (!isObject(value) || !Object.keys(value).length) throw badRequest('original bibliography must be { ko: {parts}, en: {parts} }');
    const out = {};
    for (const [lang, bib] of Object.entries(value)) {
        if (!['ko', 'en'].includes(lang)) throw badRequest(`original bibliography: unknown language ${lang}`);
        out[lang] = normalizeBibliography(bib);
    }
    return out;
}

// Anchors the parts point at that are not heading ids of the body (a typo
// would silently drop that piece's box). `headingIds` is a Set.
function missingAnchors(bibliography, headingIds) {
    return (bibliography?.parts || []).map(part => part.anchor).filter(anchor => anchor && !headingIds.has(anchor));
}

const escapeText = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const valueText = value => (typeof value === 'string' ? value : value.text);

function renderPart(part, lang, role = 'translation', { citation = '' } = {}) {
    const en = lang === 'en';
    // Rows of [label, texts]: values in a row with the label of the row
    // before it join that row, one line each, so a label is not repeated.
    const rows = [];
    for (const field of FIELDS) {
        const value = part[field.key];
        if (value === undefined) continue;
        for (const item of Array.isArray(value) ? value : [value]) {
            // A document's own wording is Korean; the English page names the field.
            const names = (role === 'original' && ORIGINAL_LABELS[field.key]) || field;
            // A translation's texts (and own labels) are Korean, so its English
            // page names the field; an original's bibliography is written per
            // language, so its own label stands on either page.
            const own = typeof item === 'object' && item.label && (role === 'original' || !en) ? item.label : null;
            const label = own || (en ? names.en : names.ko);
            const last = rows[rows.length - 1];
            if (last && last[0] === label) last[1].push(valueText(item));
            else rows.push([label, [valueText(item)]]);
        }
    }
    const items = rows.map(([label, texts]) => `<tr><th scope="row">${escapeText(label)}</th><td>${texts.join('<br>')}</td></tr>`);
    // 「이 문헌 인용하기」: the page as a reader would cite it, plain text.
    if (citation) items.push(`<tr class="doc-edition-cite"><th scope="row">${en ? 'Cite as' : '인용'}</th><td>${escapeText(citation)}</td></tr>`);
    const notes = (part.notes || []).map(note => `<p>${note}</p>`).join('');
    // A two-column table (label | text) reads better than 「label: text」 lines
    // when the texts run long (owner, 2026-11-20).
    const list = items.length ? `<table class="doc-edition-fields"><tbody>${items.join('')}</tbody></table>` : '';
    return `<details class="doc-edition"><summary>${SUMMARY[role][en ? 'en' : 'ko']}</summary>${notes}${list}</details>`;
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

function applyBibliography(html, bibliography, { lang = 'ko', opening = true, role = 'translation', citation = '' } = {}) {
    let parts = bibliography?.parts;
    if (!parts?.length || typeof html !== 'string') return html;
    // A collection whose pieces carry all its lines has no document part; the
    // opening box still gets the 「인용」 line, drawn from an empty part.
    if (citation && !parts.some(part => !part.anchor)) parts = [{}, ...parts];
    let out = html;
    for (const part of parts) {
        const box = renderPart(part, lang, role, { citation: part.anchor ? '' : citation });
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

// How a reader cites the page: its title, the site and its address. The
// title already names the author (「마르크스, 『고타강령 비판』」).
function citationText({ title, url, lang = 'ko' }) {
    return `${title}. CommuLingo ${lang === 'en' ? 'Reference Library' : '참고 문헌'}. ${url}`;
}

function isoDate(date) {
    if (!Array.isArray(date) || !date.length) return undefined;
    return date.map((n, i) => String(n).padStart(i ? 2 : 4, '0')).join('-');
}

function plain(text) {
    const value = typeof text === 'object' && text ? text.text : text;
    return typeof value === 'string' ? value.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim() : '';
}

// schema.org CreativeWork for a reader page, from the document part of the
// bibliography it shows. `work` is the page's own text; `other` the version it
// is a translation of (translation page) or that translates it (original page).
// authors: [{ name, url }] from entry.authors (person cards); a work with
// none keeps the bibliography's free-text author as creditText only.
function documentJsonLd(part, { title, description, url, inLanguage, other = null, isOriginal = false, publisherId, authors = [] }) {
    const data = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: title, url, inLanguage };
    if (description) data.description = description;
    if (authors.length) data.author = authors.map(({ name, url: personUrl }) => ({ '@type': 'Person', name, url: personUrl }));
    if (part) {
        // The original-language title only: the box glosses it in Korean
        // (「… (독일 노동자당 강령에 대한 여백 논평)」), which is not a name.
        const originalTitle = plain(part.originalTitle).replace(/\s*[(（][^()（）]*[\uac00-\ud7a3][^()（）]*[)）]\s*$/, '');
        if (originalTitle && originalTitle !== title && !/[\uac00-\ud7a3]/.test(originalTitle)) data.alternateName = originalTitle;
        const author = plain(part.author);
        if (author) data.creditText = author;
        const first = value => (Array.isArray(value) ? value : value ? [value] : []).find(item => item?.date)?.date;
        const created = isoDate(first(part.created) || first(part.adopted));
        if (created) data.dateCreated = created;
        const published = isoDate(first(part.published));
        if (published) data.datePublished = published;
        const rights = plain(part.rights);
        if (rights) data.copyrightNotice = rights;
        if (part.rights?.license) data.license = part.rights.license;
    }
    if (publisherId) data.publisher = { '@id': publisherId };
    if (other) data[isOriginal ? 'workTranslation' : 'translationOfWork'] = { '@type': 'CreativeWork', url: other.url, inLanguage: other.inLanguage };
    return data;
}

module.exports = { citationText, documentJsonLd, FIELDS, normalizeBibliography, normalizeOriginalBibliography, missingAnchors, renderPart, applyBibliography, documentPart, assertInline };
