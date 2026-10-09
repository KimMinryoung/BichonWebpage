const { assertLinkExpressions } = require('./link-expressions');
const { assertHeadword, assertAliases, assertStringList } = require('./headword-validation');

// Import/registry mutations for CommuLingo reference documents. Shared by
// scripts/import-commulingo-doc.js (CLI), scripts/commulingo-docs.js and the
// admin API, so all produce identical fragments and entries. They are stored
// in the database (docs-db.js); read-side serving lives in docs-store.js;
// format rules in data/commulingo/docs/README.md.
const { docRefId } = require('./docs-store');
const { sanitizeDocHtml } = require('./doc-sanitize');
const { writeDocs, readDocRow } = require('./docs-db');

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

function stripTags(html) {
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// Pull the readable content out of a full HTML document: body inner if
// present, minus styles/scripts/head noise, unwrapped from <main>.
function extractFragment(raw) {
    const warnings = [];
    let html = String(raw).replace(/\r\n/g, '\n');

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) html = bodyMatch[1];

    const drops = [
        [/<style[\s\S]*?<\/style>/gi, 'style block'],
        [/<script[\s\S]*?<\/script>/gi, 'script block'],
        [/<link[^>]*>/gi, 'link tag'],
        [/<meta[^>]*>/gi, 'meta tag'],
    ];
    drops.forEach(([re, label]) => {
        const found = html.match(re);
        if (found) {
            warnings.push(`removed ${found.length} ${label}(s)`);
            html = html.replace(re, '');
        }
    });

    // Unwrap a single top-level <main> (the old static docs used one).
    const mainMatch = html.match(/^\s*<main[^>]*>([\s\S]*)<\/main>\s*$/i);
    if (mainMatch) html = mainMatch[1];

    ['nav', 'header', 'footer'].forEach(tag => {
        if (new RegExp(`<${tag}[\\s>]`, 'i').test(html)) {
            warnings.push(`contains a <${tag}> element — check it belongs to the document, not site chrome`);
        }
    });
    const active = html.match(/\son[a-z]+\s*=|javascript:|<(?:iframe|object|embed|form|input|button|svg|math)\b/gi);
    if (active) warnings.push(`removed ${active.length} active-content item(s) (event handlers, script URLs, embeds, forms)`);
    html = sanitizeDocHtml(html);

    const inlineStyles = html.match(/\sstyle="/g);
    if (inlineStyles) warnings.push(`contains ${inlineStyles.length} inline style attribute(s) — reader CSS may not apply cleanly`);

    html = html.trim();
    if (!/^<article[\s>]/i.test(html)) {
        html = `<article>\n${html}\n</article>`;
        warnings.push('content was not wrapped in <article> — wrapped it');
    }
    return { html: `${html}\n`, warnings };
}

// Preview of what docs-store's TOC builder will harvest (first h1 = title,
// excluded). Lets callers spot junk headings before publishing.
function harvestTocPreview(html) {
    const toc = [];
    let seenTitle = false;
    html.replace(/<h([12])[^>]*>([\s\S]*?)<\/h\1>/g, (match, level, inner) => {
        if (level === '1' && !seenTitle) {
            seenTitle = true;
            return match;
        }
        toc.push({ level: Number(level), text: stripTags(inner) });
        return match;
    });
    return toc;
}

function langPair(value, fallback) {
    const base = fallback || { ko: '', en: '' };
    if (!value || typeof value !== 'object') return { ko: base.ko || '', en: base.en || '' };
    return {
        ko: typeof value.ko === 'string' ? value.ko : base.ko || '',
        en: typeof value.en === 'string' ? value.en : base.en || '',
    };
}

// People, terms and events are stored as bare dictionary ids. A name sent along
// with one ({ id, name }) is accepted and dropped: the dictionaries own their
// headwords and the reader gets them from there (docs-refs.js), so a copy kept
// here could only ever go stale.
function normalizeRefs(refs, label) {
    if (!Array.isArray(refs)) return [];
    return refs.map(ref => {
        const id = docRefId(ref);
        if (!id || !/^[a-z0-9-]+$/.test(id)) {
            throw badRequest(`${label} entries need an id of lowercase letters, digits, hyphens`);
        }
        return id;
    });
}

// Canonical field order for manifest entries, applied on every write.
const CANONICAL_FIELDS = new Set(['id', 'docLang', 'title', 'description', 'kind', 'source', 'linkExpressions',
    'aliases', 'noAutoLink', 'date', 'updatedAt', 'tocExclude', 'people', 'terms', 'events', 'addedAt', 'personLinks']);

function canonicalEntry(entry) {
    const out = {
        id: entry.id,
        docLang: entry.docLang || 'ko',
        title: langPair(entry.title),
        description: langPair(entry.description),
        kind: langPair(entry.kind, { ko: '저작·연설', en: 'Writings & speeches' }),
        source: typeof entry.source === 'string' ? entry.source : '',
    };
    for (const lang of ['ko', 'en']) assertHeadword(out.title[lang], `title.${lang}`, { allowEmpty: lang === 'en' });
    if (entry.linkExpressions !== undefined) {
        assertLinkExpressions(entry.linkExpressions);
        out.linkExpressions = entry.linkExpressions;
    }
    if (entry.aliases !== undefined) {
        assertAliases(entry.aliases);
        out.aliases = entry.aliases;
    }
    if (entry.noAutoLink !== undefined) {
        assertStringList(entry.noAutoLink, 'noAutoLink');
        out.noAutoLink = entry.noAutoLink;
    }
    if (entry.personLinks !== undefined) {
        require('./doc-person-links').validatePersonLinks(entry.personLinks);
        out.personLinks = entry.personLinks;
    }
    for (const field of ['date', 'updatedAt']) {
        if (entry[field] !== undefined) out[field] = entry[field];
    }
    if (Array.isArray(entry.tocExclude) && entry.tocExclude.length) out.tocExclude = entry.tocExclude.map(String);
    out.people = normalizeRefs(entry.people, 'people');
    const terms = normalizeRefs(entry.terms, 'terms');
    if (terms.length) out.terms = terms;
    const events = normalizeRefs(entry.events, 'events');
    if (events.length) out.events = events;
    out.addedAt = entry.addedAt || new Date().toISOString().slice(0, 10);
    return out;
}

// Convert raw HTML into a fragment + entry. Writes both unless dryRun.
// `overrides` may carry any entry fields (title, source, …).
async function importDoc({ rawHtml, id, dryRun, force, overrides = {}, actor = 'unknown', note }) {
    if (typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id)) throw badRequest('id must be lowercase letters, digits, hyphens');
    if (typeof rawHtml !== 'string' || !rawHtml.trim()) throw badRequest('html content is empty');

    const { html, warnings } = extractFragment(rawHtml);

    const titleTag = String(rawHtml).match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const firstH1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const fallbackTitle = titleTag ? stripTags(titleTag[1]) : firstH1 ? stripTags(firstH1[1]) : id;

    const existing = await readDocRow(id);
    if (existing && !force) {
        if (!dryRun) {
            const err = new Error(`doc "${id}" already exists (use force to overwrite)`);
            err.status = 409;
            throw err;
        }
        warnings.push(`doc "${id}" already exists — a real run needs force`);
    }

    const entry = canonicalEntry({
        ...overrides,
        id,
        title: langPair(overrides.title, { ko: fallbackTitle, en: '' }),
    });

    const toc = harvestTocPreview(html);
    const linkAudit = await require('./doc-person-links').inspectDocPersonLinks(html, entry);
    if (!dryRun) await writeDocs({ upserts: [{ id, entry, body: html }] }, { actor, note: note || 'import' });
    return { entry, warnings, toc, linkAudit: { mentions: linkAudit.mentions, warnings: linkAudit.warnings, truncated: linkAudit.truncated }, fragmentBytes: Buffer.byteLength(html), overwrote: Boolean(existing) };
}

// Merge metadata into an entry. {ko,en} fields merge per-language;
// people/tocExclude replace wholesale when provided. Pure: callers persist.
function mergeDocMeta(current, patch = {}) {
    const merged = canonicalEntry({
        ...current,
        linkExpressions: patch.linkExpressions !== undefined ? patch.linkExpressions : current.linkExpressions,
        aliases: patch.aliases !== undefined ? patch.aliases : current.aliases,
        noAutoLink: patch.noAutoLink !== undefined ? patch.noAutoLink : current.noAutoLink,
        personLinks: patch.personLinks !== undefined ? patch.personLinks : current.personLinks,
        date: patch.date !== undefined ? patch.date : current.date,
        updatedAt: patch.updatedAt !== undefined ? patch.updatedAt : current.updatedAt,
        docLang: patch.docLang !== undefined ? patch.docLang : current.docLang,
        title: langPair(patch.title, current.title),
        description: langPair(patch.description, current.description),
        kind: langPair(patch.kind, current.kind),
        source: patch.source !== undefined ? patch.source : current.source,
        tocExclude: patch.tocExclude !== undefined ? patch.tocExclude : current.tocExclude,
        people: patch.people !== undefined ? patch.people : current.people,
        terms: patch.terms !== undefined ? patch.terms : current.terms,
        events: patch.events !== undefined ? patch.events : current.events,
        addedAt: patch.addedAt !== undefined ? patch.addedAt : current.addedAt,
    });
    // canonicalEntry rebuilds only the fields it knows. Keep everything else
    // (excerpts, anchors, members, …) and the entry's key order, so a patch
    // changes exactly what it names; a known field it dropped stays dropped.
    const entry = {};
    for (const key of Object.keys(current)) {
        if (Object.hasOwn(merged, key)) entry[key] = merged[key];
        else if (!CANONICAL_FIELDS.has(key) && key !== 'file') entry[key] = current[key];
    }
    for (const key of Object.keys(merged)) if (!Object.hasOwn(entry, key)) entry[key] = merged[key];
    return entry;
}

// Pass `client` to write inside the caller's transaction (link reviews).
async function updateDocMeta(id, patch = {}, { actor = 'unknown', note, client } = {}) {
    const row = await readDocRow(id, client ? { client, forUpdate: true } : {});
    if (!row) {
        const err = new Error(`doc "${id}" not found`);
        err.status = 404;
        throw err;
    }
    const entry = mergeDocMeta({ id, ...row.entry }, patch);
    await writeDocs({ upserts: [{ id, entry, expectedRevision: row.revision }] }, { actor, note: note || 'metadata', client });
    return entry;
}

async function removeDoc(id, { actor = 'unknown', note } = {}) {
    const row = await readDocRow(id);
    if (!row) {
        const err = new Error(`doc "${id}" not found`);
        err.status = 404;
        throw err;
    }
    await writeDocs({ deletes: [id] }, { actor, note: note || 'remove' });
    return { id, ...row.entry };
}

module.exports = { canonicalEntry, extractFragment, harvestTocPreview, importDoc, mergeDocMeta, updateDocMeta, removeDoc };
