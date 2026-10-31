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
    'duplicate-id': '같은 id가 두 번 이상 쓰였습니다',
    'notes-list-missing': 'section.notes 안의 목록에 class="notes-list"가 없습니다',
    'nested-block': '해제 상자나 주석 묶음이 같은 종류 안에 겹쳐 있습니다',
    'note-ref-dangling': '주석 번호가 없는 주석을 가리킵니다',
    'back-link-dangling': '주석의 ↩가 없는 자리를 가리킵니다',
    'excerpt-target-missing': 'excerpts가 본문에 없는 제목 id를 가리킵니다',
};
const WARNING_CODES = {
    'edition-missing': '서두 해제 상자에 details.doc-edition(번역·편집 정보)이 없습니다',
    'hr-after-editorial': '해제 상자 바로 뒤에 <hr>이 있습니다(상자가 경계입니다)',
    'fragment-link-dangling': '본문 안 #링크가 없는 id를 가리킵니다',
    'note-ref-without-id': '주석 번호에 id가 없어 ↩가 돌아올 자리가 없습니다',
    'editorial-lang-missing': '원문 해제가 ko·en 두 벌이 아닙니다',
};

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
// comes in ko and en). entry: the manifest entry, for its excerpts.
function inspectDocStructure(html, { role = 'translation', entry } = {}) {
    const errors = [];
    const warnings = [];
    const add = (list, code, detail) => list.push({ code, message: detail ? `${(ERROR_CODES[code] || WARNING_CODES[code])}: ${detail}` : (ERROR_CODES[code] || WARNING_CODES[code]) });
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
        else if (!DomUtils.findOne(node => node.name === 'details' && hasClass(node, 'doc-edition'), editorials[0].children)) add(warnings, 'edition-missing');
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
        const id = target(a.attribs.href);
        if (id === null || id === '') return;
        const known = idCount.has(id);
        if (hasClass(a, 'note-ref')) {
            if (!known) add(errors, 'note-ref-dangling', `${textOf(a)} → #${id}`);
            if (!a.attribs.id) add(warnings, 'note-ref-without-id', `${textOf(a)} → #${id}`);
        } else if (hasClass(a, 'back-link')) {
            if (!known) add(errors, 'back-link-dangling', `#${id}`);
        } else if (!known) {
            add(warnings, 'fragment-link-dangling', `#${id}`);
        }
    });

    // excerpts name headings by id
    for (const anchor of excerptAnchors(entry)) {
        if (!headingIds.has(anchor)) add(role === 'translation' ? errors : warnings, 'excerpt-target-missing', anchor);
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
    freezeHeadingIds, inspectDocStructure, introducedErrors,
    blockRanges, removeBlocks, isNotesSection, isEditorial,
};
