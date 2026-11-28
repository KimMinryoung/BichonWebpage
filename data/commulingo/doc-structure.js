// Structure of a reference-document body, read with a real HTML parser.
//
// data/commulingo/docs/README.md fixes how a body is laid out (title h1,
// byline, 해제 box with its folded 번역·편집 정보, footnotes in
// section.notes > ol.notes-list with paired ref/note ids). Until 2026-10-31
// those rules lived only in the README and broke silently: a missing
// notes-list class, a footnote pointing at nothing, an excerpt naming a
// heading that had been renamed. Every write now goes through
// inspectDocStructure (docs-db.js writeDocs) and is refused when it adds a
// structural error the stored version did not have — a ratchet, so documents
// written before the check keep saving while they are fixed one by one.
//
// freezeHeadingIds gives every h1-h3 a stored id at save time, so a heading's
// address no longer depends on how many idless headings precede it.
//
// blockRanges / removeBlocks cut elements out of the stored string by the
// parser's offsets, nesting included, without reserializing the markup the
// way a DOM round trip would.
const { parseDocument, DomUtils } = require('htmlparser2');
const docEntry = require('./doc-entry');
const { missingAnchors, applyBibliography } = require('./doc-bibliography');

const AUTO_ATTR = 'data-auto-id';

function parse(html) {
    return parseDocument(String(html || ''), { withStartIndices: true, withEndIndices: true });
}

const isTag = node => node && node.type === 'tag';
const hasClass = (node, cls) => isTag(node) && ` ${node.attribs.class || ''} `.replace(/\s+/g, ' ').includes(` ${cls} `);
const isHeading = node => isTag(node) && /^h[1-6]$/.test(node.name);
const elementChildren = node => (node.children || []).filter(isTag);
const textOf = node => DomUtils.textContent(node).replace(/\s+/g, ' ').trim();

function bodyRoot(dom) {
    const top = elementChildren(dom);
    return top.length === 1 && top[0].name === 'article' ? top[0] : dom;
}

// ── heading ids ─────────────────────────────────────────────────────────────

// The reader used to number idless h1/h2 headings sec-1, sec-2… on every
// request (docs-store annotateHeadings), so inserting one heading moved every
// later address. Here the same numbers are written into the body once:
//   - a body never frozen (no data-auto-id anywhere) takes exactly the numbers
//     the reader was serving, so existing #sec-N links keep landing;
//   - a body already frozen gives a new heading the next unused number, so
//     nothing that already has an id moves.
// h3 headings get sub-N. The first h1 is the title and keeps no id, as before.
// Frozen ids carry data-auto-id so the translation/original switch can still
// tell them from ids an editor chose (the same sec-N need not name the same
// section in both versions).
function freezeHeadingIds(html) {
    if (typeof html !== 'string' || !html) return html;
    const used = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    const frozenBefore = new RegExp(`\\b${AUTO_ATTR}\\b`).test(html);
    const next = prefix => {
        let n = 0;
        for (const id of used) {
            const m = id.match(new RegExp(`^${prefix}-(\\d+)$`));
            if (m) n = Math.max(n, Number(m[1]));
        }
        return n + 1;
    };
    let sec = frozenBefore ? next('sec') : 1;
    let sub = next('sub');
    let seenTitle = false;
    return html.replace(/<h([1-3])(\s[^>]*)?>/g, (tag, level, attrs = '') => {
        if (level === '1' && !seenTitle) {
            seenTitle = true;
            return tag;
        }
        if (/\bid="[^"]*"/.test(attrs)) return tag;
        let id;
        if (level === '3') {
            while (used.has(`sub-${sub}`)) sub++;
            id = `sub-${sub++}`;
        } else if (frozenBefore) {
            while (used.has(`sec-${sec}`)) sec++;
            id = `sec-${sec++}`;
        } else {
            // Same count as the reader's: every idless h1/h2, collisions and all.
            id = `sec-${sec++}`;
        }
        used.add(id);
        return `<h${level} id="${id}" ${AUTO_ATTR}${attrs}>`;
    });
}

// Paragraph links (2026-11-24): every p, li and blockquote without an id gets
// a stored `p-N` at save time, numbered on from the highest p-N the body
// already has, so a paragraph keeps its number when others are added before
// it. A link to one is /commulingo/docs/<id>?at=p-N (the route sends it to
// the page that holds it, whatever the pagination by then).
function freezeBlockIds(html) {
    if (typeof html !== 'string' || !html) return html;
    const used = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    let n = 0;
    for (const id of used) {
        const m = id.match(/^p-(\d+)$/);
        if (m) n = Math.max(n, Number(m[1]));
    }
    const give = text => text.replace(/<(p|li|blockquote)(\s[^>]*)?>/g, (tag, name, attrs = '') => {
        if (/\bid="[^"]*"/.test(attrs)) return tag;
        do n++; while (used.has(`p-${n}`));
        used.add(`p-${n}`);
        return `<${name} id="p-${n}"${attrs}>`;
    });
    // Footnote lists are left alone: a note is linked by its own id, and the
    // reader reads a note's number off its id (labelNotes), so a p-N there
    // would show as note N.
    const NOTES = /<ol\b[^>]*\bnotes-list\b[^>]*>[\s\S]*?<\/ol>/g;
    let out = '';
    let last = 0;
    for (const m of html.matchAll(NOTES)) {
        out += give(html.slice(last, m.index)) + m[0];
        last = m.index + m[0].length;
    }
    return out + give(html.slice(last));
}

// What a write stores: heading ids, then paragraph ids.
const freezeIds = html => freezeBlockIds(freezeHeadingIds(html));

// ── cutting blocks ──────────────────────────────────────────────────────────

// [start, end) offsets of the outermost elements matching `predicate`.
function blockRanges(html, predicate) {
    const ranges = [];
    const walk = nodes => nodes.forEach(node => {
        if (!isTag(node)) return;
        if (predicate(node)) {
            ranges.push([node.startIndex, node.endIndex + 1]);
            return;
        }
        walk(node.children || []);
    });
    walk(parse(html).children);
    return ranges;
}

function removeBlocks(html, predicate, replace = () => '') {
    let out = '';
    let at = 0;
    for (const [start, end] of blockRanges(html, predicate)) {
        out += html.slice(at, start) + replace(html.slice(start, end));
        at = end;
    }
    return out + html.slice(at);
}

const isNotesSection = node => node.name === 'section' && hasClass(node, 'notes');
const isEditorial = node => node.name === 'aside' && hasClass(node, 'doc-editorial');

// ── structure check ─────────────────────────────────────────────────────────

// Errors are what break the reader or the README's contract; warnings are
// worth fixing but render. Each issue: { code, message }.
const ERROR_CODES = {
    'title-not-first': '본문이 제목 h1로 시작하지 않습니다',
    'byline-missing': '제목 바로 아래에 p.doc-byline이 없습니다',
    'editorial-missing': '첫 절 제목 전에 aside.doc-editorial(해제)이 없습니다',
    'bibliography-anchor-missing': 'entry.bibliography의 anchor가 본문 제목 id에 없습니다(그 글의 번역·편집 정보가 화면에 나오지 않습니다)',
    'duplicate-id': '같은 id가 두 번 이상 쓰였습니다',
    'notes-list-missing': 'section.notes 안의 목록에 class="notes-list"가 없습니다',
    'nested-block': '해제 상자나 주석 묶음이 같은 종류 안에 겹쳐 있습니다',
    'note-ref-dangling': '주석 번호가 없는 주석을 가리킵니다',
    'back-link-dangling': '주석의 ↩가 없는 자리를 가리킵니다',
    'excerpt-target-missing': 'excerpts가 본문에 없는 제목 id를 가리킵니다',
    'anchor-target-missing': 'anchors(절 별칭)가 본문에 없는 id를 가리킵니다',
    'ref-unknown': 'entry가 사전에 없는 인물·용어·사건 id를 가리킵니다',
    ...docEntry.ERROR_CODES,
};
const WARNING_CODES = {
    'edition-missing': '서두 해제 상자에 details.doc-edition(번역·편집 정보)이 없고 entry.bibliography도 없습니다',
    'hr-after-editorial': '해제 상자 바로 뒤에 <hr>이 있습니다(상자가 경계입니다)',
    'fragment-link-dangling': '본문 안 #링크가 없는 id를 가리킵니다',
    'note-ref-without-id': '주석 번호에 id가 없어 ↩가 돌아올 자리가 없습니다',
    'editorial-lang-missing': '원문 해제가 ko·en 두 벌이 아닙니다',
    'doc-link-dangling': '다른 문헌으로 가는 링크가 없는 문헌이나 그 문헌에 없는 id를 가리킵니다',
    'note-kind-invalid': '주석의 data-note-kind가 author·source-editor·translator·site가 아닙니다',
    'no-auto-link-unused': 'entry.noAutoLink의 글이 본문에 없습니다(지운 대목이면 목록에서도 뺍니다)',
};

// ── links to other documents (A3) ───────────────────────────────────────────

// A hand-written link into another document: /commulingo/docs/<id>, its
// /original, the English path, an old .html address; the place is the
// #fragment or a paragraph link's ?at=. Returns { docId, original, anchor } or null.
const DOC_LINK = /^(?:https?:\/\/(?:www\.)?cyber-lenin\.com)?(?:\/en)?\/commulingo\/docs\/([a-z0-9-]+)(?:\.html)?(\/original)?\/?(?:\?([^#]*))?(?:#(.*))?$/;
function docLinkTarget(href) {
    const m = DOC_LINK.exec(href || '');
    if (!m) return null;
    let anchor = m[4] || '';
    if (!anchor && m[3]) anchor = new URLSearchParams(m[3]).get('at') || '';
    try { anchor = decodeURIComponent(anchor); } catch { /* keep as written */ }
    return { docId: m[1], original: Boolean(m[2]), anchor };
}

// The documents a body links to, as the keys docTargets uses (<id>, <id>/original).
function linkedDocKeys(html) {
    const keys = new Set();
    for (const [, href] of String(html || '').matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
        const target = docLinkTarget(href.replace(/&amp;/g, '&'));
        if (target) keys.add(target.docId + (target.original ? '/original' : ''));
    }
    return keys;
}

// Every id="…" of a body, for docTargets.
const bodyIds = html => new Set([...String(html || '').matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));

function excerptAnchors(entry) {
    const out = [];
    for (const byId of Object.values(entry?.excerpts || {})) {
        for (const declared of Object.values(byId || {})) {
            for (const ref of [].concat(declared ?? [])) {
                const anchor = typeof ref === 'string' ? ref : ref && typeof ref.heading === 'string' ? ref.heading : null;
                if (anchor && anchor !== '*' && anchor !== 'toc') out.push(anchor);
            }
        }
    }
    return [...new Set(out)];
}

// role: 'translation' (the document's own body, held to the full 서두 틀) or
// 'original' (the source-language text: same footnote and id rules, its 해제
// comes in ko and en). entry: the manifest entry, for its excerpts and anchors;
// on the translation the entry itself is checked too (doc-entry.js), and its
// dictionary ids against `known` when the caller loaded the dictionaries.
// docTargets (A3): Map of <id> or <id>/original → Set of its ids, or
// { redirect: true } for a retired id; given, links into other documents are
// checked against it (selfKey names the body's own key, checked against itself).
function inspectDocStructure(html, { role = 'translation', entry, known, docTargets, selfKey } = {}) {
    const errors = [];
    const warnings = [];
    const add = (list, code, detail) => list.push({ code, message: detail ? `${(ERROR_CODES[code] || WARNING_CODES[code])}: ${detail}` : (ERROR_CODES[code] || WARNING_CODES[code]) });
    // Inspect the page as the reader draws it: the 번역·편집 정보 boxes come
    // from entry.bibliography, and their footnote references carry ids the
    // notes' back-links point at.
    if (role === 'translation' && entry?.bibliography) html = applyBibliography(html, entry.bibliography, { lang: 'ko', opening: true });
    const dom = parse(html);
    const root = bodyRoot(dom);
    const all = DomUtils.findAll(() => true, dom.children);

    // ids
    const idCount = new Map();
    all.forEach(node => {
        const id = node.attribs.id;
        if (id) idCount.set(id, (idCount.get(id) || 0) + 1);
    });
    for (const [id, n] of idCount) if (n > 1) add(errors, 'duplicate-id', `${id} ×${n}`);
    const headingIds = new Set(all.filter(isHeading).map(node => node.attribs.id).filter(Boolean));

    // opening layout
    const top = elementChildren(root);
    const title = top[0];
    if (!title || title.name !== 'h1') add(errors, 'title-not-first', title ? `<${title.name}>` : '빈 본문');
    const firstSection = top.findIndex((node, i) => i > 0 && isHeading(node));
    const opening = top.slice(1, firstSection === -1 ? top.length : firstSection);
    const editorials = opening.filter(isEditorial);
    if (role === 'translation') {
        if (title && title.name === 'h1' && !(top[1] && top[1].name === 'p' && hasClass(top[1], 'doc-byline'))) add(errors, 'byline-missing');
        if (!editorials.length) add(errors, 'editorial-missing');
        // The box may come from entry.bibliography instead (doc-bibliography.js).
        // A bibliography of pieces only still draws the opening box (its 「인용」 line).
        else if (!entry?.bibliography?.parts?.length && !DomUtils.findOne(node => node.name === 'details' && hasClass(node, 'doc-edition'), editorials[0].children)) add(warnings, 'edition-missing');
        const lost = missingAnchors(entry?.bibliography, headingIds);
        if (lost.length) add(errors, 'bibliography-anchor-missing', lost.join(', '));
    } else {
        const langs = new Set(editorials.map(node => node.attribs.lang || 'ko'));
        if (editorials.length && !(langs.has('ko') && langs.has('en'))) add(warnings, 'editorial-lang-missing', [...langs].join(','));
    }
    top.forEach((node, i) => {
        if (isEditorial(node) && top[i + 1] && top[i + 1].name === 'hr') add(warnings, 'hr-after-editorial');
    });

    // nesting the reader's cuts cannot survive
    all.filter(node => isEditorial(node) || isNotesSection(node)).forEach(node => {
        const inner = DomUtils.findOne(child => node.name === child.name && (isEditorial(node) ? child.name === 'aside' : isNotesSection(child)), node.children);
        if (inner) add(errors, 'nested-block', `<${node.name} class="${node.attribs.class}">`);
    });

    // footnotes
    all.filter(isNotesSection).forEach(section => {
        DomUtils.findAll(node => node.name === 'ol' || node.name === 'ul', section.children).forEach(list => {
            if (!hasClass(list, 'notes-list') && DomUtils.findOne(li => li.name === 'li' && li.attribs.id, list.children)) {
                add(errors, 'notes-list-missing', section.attribs.id || textOf(DomUtils.findOne(isHeading, section.children) || section).slice(0, 30));
            }
        });
    });
    // A malformed escape (href="#100%") must not abort the check: it would
    // block every later save of the document, the repair included.
    const target = href => {
        if (!(href || '').startsWith('#')) return null;
        try {
            return decodeURIComponent(href.slice(1));
        } catch {
            return href.slice(1);
        }
    };
    all.filter(node => node.name === 'a').forEach(a => {
        const linked = docTargets ? docLinkTarget(a.attribs.href) : null;
        if (linked) {
            const key = linked.docId + (linked.original ? '/original' : '');
            const ids = key === selfKey ? idCount : docTargets.get(key);
            if (!ids) add(warnings, 'doc-link-dangling', `${a.attribs.href} (문헌 없음)`);
            else if (linked.anchor && !ids.redirect && !ids.has(linked.anchor)) add(warnings, 'doc-link-dangling', `${a.attribs.href} (id 없음)`);
            return;
        }
        const id = target(a.attribs.href);
        if (id === null || id === '') return;
        const exists = idCount.has(id);
        if (hasClass(a, 'note-ref')) {
            if (!exists) add(errors, 'note-ref-dangling', `${textOf(a)} → #${id}`);
            if (!a.attribs.id) add(warnings, 'note-ref-without-id', `${textOf(a)} → #${id}`);
        } else if (hasClass(a, 'back-link')) {
            if (!exists) add(errors, 'back-link-dangling', `#${id}`);
        } else if (!exists) {
            add(warnings, 'fragment-link-dangling', `#${id}`);
        }
    });

    // who wrote each footnote (R2)
    all.filter(node => node.name === 'li' && node.attribs['data-note-kind'] !== undefined).forEach(li => {
        if (!docEntry.NOTE_KINDS.includes(li.attribs['data-note-kind'])) add(warnings, 'note-kind-invalid', `${li.attribs.id || ''} ${li.attribs['data-note-kind']}`);
    });

    // a blocked string the body no longer has (L4)
    if (role === 'translation' && entry?.noAutoLink) {
        const text = DomUtils.textContent(dom);
        for (const blocked of docEntry.noAutoLinkStrings(entry.noAutoLink)) {
            if (!text.includes(blocked)) add(warnings, 'no-auto-link-unused', blocked);
        }
    }

    // excerpts name headings by id; anchors (alias → section) name any id
    for (const anchor of excerptAnchors(entry)) {
        if (!headingIds.has(anchor)) add(role === 'translation' ? errors : warnings, 'excerpt-target-missing', anchor);
    }
    const anchors = entry && entry.anchors && typeof entry.anchors === 'object' && !Array.isArray(entry.anchors) ? Object.keys(entry.anchors) : [];
    for (const anchor of anchors) {
        if (!idCount.has(anchor)) add(role === 'translation' ? errors : warnings, 'anchor-target-missing', anchor);
    }
    // The entry belongs to the translation; an original shares it unchecked.
    if (role === 'translation' && entry) {
        errors.push(...docEntry.inspectDocEntry(entry).errors);
        errors.push(...docEntry.inspectDocRefs(entry, known).errors);
    }
    return { errors, warnings };
}

function countByCode(issues) {
    const counts = {};
    for (const { code } of issues) counts[code] = (counts[code] || 0) + 1;
    return counts;
}

// The ratchet: errors of a kind the stored version had fewer of. Compared by
// count per code, since a body edit shifts every position-based key.
function introducedErrors(before, after) {
    const had = countByCode(before ? before.errors : []);
    const now = countByCode(after.errors);
    const seen = {};
    return after.errors.filter(issue => {
        seen[issue.code] = (seen[issue.code] || 0) + 1;
        return now[issue.code] > (had[issue.code] || 0) && seen[issue.code] > (had[issue.code] || 0);
    });
}

module.exports = {
    AUTO_ATTR, ERROR_CODES, WARNING_CODES,
    freezeHeadingIds, freezeBlockIds, freezeIds, inspectDocStructure, introducedErrors,
    docLinkTarget, linkedDocKeys, bodyIds,
    blockRanges, removeBlocks, isNotesSection, isEditorial,
};
