// Writes for CommuLingo reference documents (migration 339). The database is
// the source of truth; docs-store.js serves a snapshot of it. Every update or
// delete first copies the version it replaces into commulingo_doc_revisions,
// so any earlier state can be restored (restoreDocRevision).
//
// Whatever path writes (import, scripts/commulingo-docs put, MCP doc_put,
// metadata PATCH, person renames, restore), the stored form is made here: a
// body that differs from the stored one is sanitized (doc-sanitize.js), gets
// Korean quotes and frozen heading ids; an entry is canonicalized
// (docs-import.js canonicalizeStoredEntry: known fields validated and
// normalized, the rest kept). Every changed document also passes the reader's
// person-link audit and the structure check (doc-structure.js, entry included):
// a write that adds an error the stored version did not have is refused
// unless the caller passes allowStructureIssues.
const crypto = require('crypto');
const db = require('../../config/database');
const { transaction } = require('../../utils/db-transaction');
const { normalizeKoreanQuotesHtml } = require('./korean-quotes');
const { sanitizeDocHtml } = require('./doc-sanitize');
const { freezeHeadingIds, freezeIds, inspectDocStructure, introducedErrors, linkedDocKeys, bodyIds } = require('./doc-structure');
const { entryRefs } = require('./doc-entry');
const { buildOutline, outlineFits } = require('./doc-outline');

const ID = /^[a-z0-9-]+$/;
const sha256 = text => crypto.createHash('sha256').update(text, 'utf8').digest('hex');

function badRequest(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    return err;
}

// The manifest-entry shape callers pass around carries id (the row key) and
// file/modifiedAt/revision/original (derived when served, docs-store.js
// install); none of those is stored.
const DERIVED = new Set(['id', 'file', 'modifiedAt', 'bodySha256', 'revision', 'original', 'outline']);
function storedEntry(entry) {
    const out = {};
    for (const [key, value] of Object.entries(entry || {})) if (!DERIVED.has(key)) out[key] = value;
    return out;
}

// Structure of one body against the version it replaces. Both sides are read
// with their ids frozen, so a body stored before freezing is compared with
// the same ids the reader serves it under. `known` (loadKnownRefs) lets the
// entry's dictionary ids be checked; without it they are not.
function checkStructure(id, label, { body, entry, role, previousBody, previousEntry, known, docTargets }) {
    const selfKey = role === 'original' ? `${id}/original` : id;
    const after = inspectDocStructure(freezeHeadingIds(body), { role, entry, known, docTargets, selfKey });
    const before = previousBody === undefined ? null : inspectDocStructure(freezeHeadingIds(previousBody), { role, entry: previousEntry, known, docTargets, selfKey });
    return { id, label, errors: after.errors, warnings: after.warnings, introduced: introducedErrors(before, after) };
}

// The documents a body links to (doc-structure.js linkedDocKeys), with their
// ids, for the doc-link-dangling check (A3). Reads only the linked rows.
async function loadDocTargets(client, bodies) {
    const keys = new Set();
    for (const body of bodies) for (const key of linkedDocKeys(body)) keys.add(key);
    const targets = new Map();
    if (!keys.size) return targets;
    const ids = [...new Set([...keys].map(key => key.replace(/\/original$/, '')))];
    for (const row of (await client.query('SELECT id, body FROM commulingo_docs WHERE id = ANY($1)', [ids])).rows) targets.set(row.id, bodyIds(row.body));
    for (const row of (await client.query('SELECT doc_id, body FROM commulingo_doc_originals WHERE public AND doc_id = ANY($1)', [ids])).rows) targets.set(`${row.doc_id}/original`, bodyIds(row.body));
    for (const row of (await client.query('SELECT from_id FROM commulingo_doc_redirects WHERE from_id = ANY($1)', [ids])).rows) targets.set(row.from_id, { redirect: true });
    return targets;
}

// The dictionaries' ids, for the entry's people/terms/events and excerpt
// targets (doc-entry.js inspectDocRefs). null when a dictionary is empty or
// unreachable: an outage must not read as "every reference unknown".
async function loadKnownRefs() {
    try {
        const { loadCommuLingoPeople, redirectTarget } = require('./people-store');
        const [people, terms, events] = await Promise.all([
            loadCommuLingoPeople(),
            require('./terms-store').loadCommuLingoTerms(),
            require('./history-events-store').loadCommuLingoHistoryEvents(),
        ]);
        const list = people?.data?.people || [];
        if (!list.length || !(terms || []).length || !(events || []).length) return null;
        return {
            people: new Set(list.map(person => person.id)),
            terms: new Set(terms.map(term => term.id)),
            events: new Set(events.map(event => event.id)),
            personTarget: id => redirectTarget(people.data, 'person', id),
        };
    } catch (err) {
        console.error('[commulingo docs] dictionaries unavailable, reference ids unchecked:', err.message);
        return null;
    }
}

// The entries a linked body points at, as sorted "kind:id" (L3). The audit's
// html is the reader's linking of the whole body, so every kind is there.
function linkSet(html) {
    const out = new Set();
    for (const [, kind, id] of String(html || '').matchAll(/href="(?:\/en)?\/commulingo\/(people|terms|events|docs)\/([a-z0-9-]+)/g)) {
        out.add(`${{ people: 'person', terms: 'term', events: 'event', docs: 'doc' }[kind]}:${id}`);
    }
    return [...out].sort();
}
const linkAuditOf = audit => ({ at: new Date().toISOString(), links: linkSet(audit.html) });

// The entry fields the person-link audit reads (doc-person-links.js).
const AUDIT_FIELDS = ['date', 'docLang', 'events', 'noAutoLink', 'people', 'personLinks'];

// JSON text with object keys sorted: jsonb keeps its own key order, so the order
// an entry comes back in says nothing about whether it changed.
function stableJson(value) {
    return JSON.stringify(value, (_key, item) => (item && typeof item === 'object' && !Array.isArray(item)
        ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]]))
        : item));
}

// Does this entry say the same as the stored one? The stored side is canonicalized
// too, so sending an entry back untouched is no change even when the stored form
// predates a normalization (an empty list since dropped, a quote since converted).
// A stored entry today's validation refuses cannot equal one that passed it.
function sameStoredEntry(id, entry, storedRow, canonicalized) {
    if (stableJson(entry) === stableJson(storedRow)) return true;
    if (!canonicalized) return false;
    // A retired key (entry source, editorialNotes) the write leaves out is a
    // change, so a write can clear it although canonicalizing drops it too.
    const { RETIRED_FIELDS } = require('./doc-entry');
    if (RETIRED_FIELDS.some(key => Object.hasOwn(storedRow || {}, key) && !Object.hasOwn(entry, key))) return false;
    try {
        return stableJson(entry) === stableJson(require('./docs-import').canonicalizeStoredEntry(id, storedEntry(storedRow)));
    } catch {
        return false;
    }
}

// A body differing from the stored one is sanitized as an import is; an
// untouched one is not rewritten (the sanitizer reserializes markup).
function incomingBody(html, currentSha) {
    if (currentSha && sha256(html) === currentSha) return html;
    return sanitizeDocHtml(html);
}

// Since 2026-11-04 every stored document is free of structural errors, so the
// rule is no longer a ratchet (fewer errors than before) but absolute: a write
// with any error is refused. The report still says which errors are new
// (`introduced`), for the reader of the refusal.
function refuseStructure(reports) {
    const bad = reports.filter(report => report.errors.length);
    if (!bad.length) return;
    const lines = bad.flatMap(report => report.errors.map(issue =>
        `${report.label}: [${issue.code}] ${issue.message}${report.introduced.includes(issue) ? '' : ' (already stored)'}`));
    const err = badRequest(`structure check refused the write (data/commulingo/docs/README.md; pass allowStructureIssues / --allow-structure to store it anyway):\n  ${lines.join('\n  ')}`, 422);
    err.structure = bad;
    throw err;
}

function withClient(client, fn) {
    return transaction(fn, { client, pool: db });
}

async function supersede(client, row, op, actor, note, keepBody) {
    await client.query(
        `INSERT INTO commulingo_doc_revisions
            (doc_id, revision, entry, body, body_sha256, body_updated_at, updated_at, updated_by,
             superseded_op, superseded_by, note)
         VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [row.id, row.revision, JSON.stringify(row.entry), keepBody ? row.body : null, row.body_sha256,
            row.body_updated_at, row.updated_at, row.updated_by, op, actor, note || null]);
}

// Like a document's, an original's revision keeps the body only when the
// write replaces it (or deletes the row); a bibliography-only edit stored a
// full copy until 2026-11-28 (S8, migration 387 lets body be NULL).
async function supersedeOriginal(client, row, op, actor, note, keepBody = true) {
    await client.query(
        `INSERT INTO commulingo_doc_original_revisions
            (doc_id, revision, lang, body, body_sha256, public, updated_at, updated_by,
             superseded_op, superseded_by, note, bibliography)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb)`,
        [row.doc_id, row.revision, row.lang, keepBody ? row.body : null, row.body_sha256, row.public,
            row.updated_at, row.updated_by, op, actor, note || null, row.bibliography ? JSON.stringify(row.bibliography) : null]);
}

// An original (migration 368): { docId, lang, body, public, bibliography?, expectedRevision? }.
// A public one states why in its bibliography's rights.status (the rights
// column went in migration 388).
// Its source line lives in the bibliography's sourceText (the source column went
// in migration 381).
// bibliography (migration 380): { ko, en } bibliographies the reader draws the
// 원문·편집 정보 box from; undefined keeps the stored one, null removes it.
// A changed body is sanitized here, as a translation's is.
async function writeOriginal(c, item, actor, note, structureReports) {
    if (!item || typeof item.docId !== 'string' || !ID.test(item.docId)) throw badRequest('original: doc id must be lowercase letters, digits, hyphens');
    const { docId } = item;
    if (typeof item.lang !== 'string' || !/^[a-z]{2,3}$/.test(item.lang)) throw badRequest(`${docId}: original lang must be a 2-3 letter code`);
    if (typeof item.body !== 'string' || !item.body.trim()) throw badRequest(`${docId}: original body must be non-empty html`);
    const isPublic = item.public === true;
    if (item.rights !== undefined) throw badRequest(`${docId}: original.rights is retired: state it in the bibliography (parts[0].rights { text, status })`);
    const { normalizeOriginalBibliography, publicRightsProblem } = require('./doc-bibliography');
    const givenBibliography = item.bibliography === undefined ? undefined : normalizeOriginalBibliography(item.bibliography);
    const current = (await c.query('SELECT * FROM commulingo_doc_originals WHERE doc_id = $1 FOR UPDATE', [docId])).rows[0];
    if (item.expectedRevision !== undefined && (current ? current.revision : 0) !== item.expectedRevision) {
        throw badRequest(`${docId}: original expected revision ${item.expectedRevision}, found ${current ? current.revision : 'none'}`, 409);
    }
    const body = freezeIds(incomingBody(item.body, current?.body_sha256));
    const bodySha = sha256(body);
    const entry = (await c.query('SELECT entry FROM commulingo_docs WHERE id = $1', [docId])).rows[0]?.entry;
    if (!current || current.body_sha256 !== bodySha) {
        structureReports.push(checkStructure(docId, `${docId} (original)`, {
            body, entry, role: 'original', docTargets: await loadDocTargets(c, [body]), previousBody: current ? current.body : undefined, previousEntry: entry }));
    }
    // The outline follows the body (doc-outline.js); an unchanged body keeps a fitting one.
    const outline = current && current.body_sha256 === bodySha && outlineFits(current.outline, bodySha)
        ? current.outline : buildOutline(body, { tocExclude: entry?.tocExclude, bodySha256: bodySha });
    const bibliography = givenBibliography !== undefined ? givenBibliography : (current?.bibliography || null);
    const bibliographyJson = bibliography ? JSON.stringify(bibliography) : null;
    const rightsProblem = isPublic ? publicRightsProblem(bibliography) : '';
    if (rightsProblem) throw badRequest(`${docId}: ${rightsProblem}`);
    if (!current) {
        const revision = (await c.query(
            'SELECT COALESCE(MAX(revision), 0) + 1 AS n FROM commulingo_doc_original_revisions WHERE doc_id = $1', [docId])).rows[0].n;
        await c.query(
            `INSERT INTO commulingo_doc_originals (doc_id, lang, body, body_sha256, public, revision, updated_by, created_by, outline, bibliography)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8::jsonb, $9::jsonb)`,
            [docId, item.lang, body, bodySha, isPublic, revision, actor, JSON.stringify(outline), bibliographyJson]);
        return { id: docId, revision, op: 'insert' };
    }
    if (current.body_sha256 === bodySha && current.lang === item.lang && current.public === isPublic
        && JSON.stringify(current.bibliography || null) === JSON.stringify(bibliography)) {
        return { id: docId, revision: current.revision, op: 'unchanged' };
    }
    await supersedeOriginal(c, current, 'update', actor, note, current.body_sha256 !== bodySha);
    await c.query(
        `UPDATE commulingo_doc_originals
            SET lang = $2, body = $3, body_sha256 = $4, public = $5,
                revision = revision + 1, updated_at = NOW(), updated_by = $6, outline = $7::jsonb, bibliography = $8::jsonb
          WHERE doc_id = $1`,
        [docId, item.lang, body, bodySha, isPublic, actor, JSON.stringify(outline), bibliographyJson]);
    return { id: docId, revision: current.revision + 1, op: 'update' };
}

async function removeOriginal(c, docId, actor, note) {
    const current = (await c.query('SELECT * FROM commulingo_doc_originals WHERE doc_id = $1 FOR UPDATE', [docId])).rows[0];
    if (!current) return false;
    await supersedeOriginal(c, current, 'delete', actor, note);
    await c.query('DELETE FROM commulingo_doc_originals WHERE doc_id = $1', [docId]);
    return true;
}

// changes: {
//   upserts: [{ id, entry, body?, expectedRevision? }]  (order is the entry's date; sort_order went in migration 388)  body omitted = keep;
//            a new document needs a body
//   deletes: [id]
//   redirects: { set: { fromId: { id, anchor?, note? } }, remove: [fromId] }  no anchor = document head
//   originals: { set: [{ docId, lang, body, public, bibliography?, expectedRevision? }], remove: [docId] }
// }
// Runs in the caller's transaction when `client` is given, else in its own.
// `canonicalizeEntries: false` stores entries as given (restore puts back what
// was once stored, which today's validation might refuse).
// Returns { written: [{ id, revision, op }], deleted: [id] }.
async function writeDocs(changes, { actor, note, client, allowStructureIssues = false, canonicalizeEntries = true } = {}) {
    if (!actor) throw badRequest('writeDocs needs an actor');
    const upserts = changes.upserts || [];
    const deletes = changes.deletes || [];
    const redirects = changes.redirects || {};
    // The dictionaries are read once per write, and only when an entry being
    // written points at them.
    let knownRefs;
    const knownFor = entry => {
        if (knownRefs === undefined) knownRefs = entryRefs(entry).length ? loadKnownRefs() : Promise.resolve(null);
        return knownRefs;
    };
    const result = await withClient(client, async c => {
        await c.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-docs-write'))");
        const written = [];
        const linkAudits = [];
        const structure = [];
        for (const item of upserts) {
            if (!item || typeof item.id !== 'string' || !ID.test(item.id)) throw badRequest('doc id must be lowercase letters, digits, hyphens');
            const entry = canonicalizeEntries
                ? require('./docs-import').canonicalizeStoredEntry(item.id, storedEntry(item.entry))
                : storedEntry(item.entry);
            if (item.body !== undefined && (typeof item.body !== 'string' || !item.body.trim())) throw badRequest(`${item.id}: body must be non-empty html`);
            const current = (await c.query('SELECT * FROM commulingo_docs WHERE id = $1 FOR UPDATE', [item.id])).rows[0];
            if (item.expectedRevision !== undefined && (current ? current.revision : 0) !== item.expectedRevision) {
                throw badRequest(`${item.id}: expected revision ${item.expectedRevision}, found ${current ? current.revision : 'none'}`, 409);
            }
            let body;
            if (item.body !== undefined) {
                // Korean documents follow the NIKL quote rules (korean-quotes.js).
                const normalized = (entry.docLang || 'ko') === 'ko' ? normalizeKoreanQuotesHtml(item.body) : item.body;
                body = freezeIds(incomingBody(normalized, current?.body_sha256));
                if (!body.trim()) throw badRequest(`${item.id}: body must be non-empty html`);
            }
            const entryChanged = Boolean(current) && !sameStoredEntry(item.id, entry, current.entry, canonicalizeEntries);
            const changed = !current || (body !== undefined && sha256(body) !== current.body_sha256) || entryChanged;
            // The person-link audit reads the body and these entry fields only
            // (doc-person-links.js); a write that changes neither (a summary, a
            // bibliography line) skips it instead of walking up to 1.4 MB under
            // the write lock (A4).
            const bodyNew = !current || (body !== undefined && sha256(body) !== current.body_sha256);
            const auditInputsChanged = bodyNew || AUDIT_FIELDS.some(key => stableJson(entry[key] ?? null) !== stableJson(current.entry?.[key] ?? null));
            let linkAudit = null; // null keeps the stored one
            if (changed && auditInputsChanged) {
                const audit = await require('./doc-person-links').inspectDocPersonLinks(body ?? current?.body, { id: item.id, ...entry });
                linkAudits.push({ id: item.id, mentions: audit.mentions, warnings: audit.warnings, truncated: audit.truncated });
                linkAudit = linkAuditOf(audit);
            }
            if (changed) {
                if (body !== undefined || current) {
                    structure.push(checkStructure(item.id, item.id, {
                        body: body ?? current.body, entry, role: 'translation', known: await knownFor(entry),
                        docTargets: await loadDocTargets(c, [body ?? current.body]),
                        previousBody: current ? current.body : undefined, previousEntry: current ? current.entry : undefined }));
                }
            }
            if (!current) {
                if (body === undefined) throw badRequest(`${item.id}: a new document needs a body`);
                // The updates feed lists documents by addedAt (services/commulingo-updates.js):
                // a new document without one would never appear there.
                if (!entry.addedAt) entry.addedAt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
                // A re-created id continues its old numbering, so the history
                // (unique per doc_id, revision) never collides.
                const revision = (await c.query(
                    'SELECT COALESCE(MAX(revision), 0) + 1 AS n FROM commulingo_doc_revisions WHERE doc_id = $1', [item.id])).rows[0].n;
                const outline = buildOutline(body, { tocExclude: entry.tocExclude, bodySha256: sha256(body) });
                await c.query(
                    `INSERT INTO commulingo_docs (id, entry, body, body_sha256, revision, updated_by, created_by, outline, link_audit)
                     VALUES ($1, $2::jsonb, $3, $4, $5, $6, $6, $7::jsonb, $8::jsonb)`,
                    [item.id, JSON.stringify(entry), body, sha256(body), revision, actor, JSON.stringify(outline),
                        linkAudit ? JSON.stringify(linkAudit) : null]);
                written.push({ id: item.id, revision, op: 'insert' });
                continue;
            }
            const bodyChanged = body !== undefined && sha256(body) !== current.body_sha256;
            if (!bodyChanged && !entryChanged) {
                written.push({ id: item.id, revision: current.revision, op: 'unchanged' });
                continue;
            }
            await supersede(c, current, 'update', actor, note, bodyChanged);
            // The outline follows the body and the contents rules (tocExclude);
            // a stale or missing one is rebuilt on any write.
            const nextSha = bodyChanged ? sha256(body) : current.body_sha256;
            const tocRulesChanged = JSON.stringify(entry.tocExclude || null) !== JSON.stringify(current.entry.tocExclude || null);
            const outline = !bodyChanged && !tocRulesChanged && outlineFits(current.outline, nextSha)
                ? current.outline : buildOutline(body ?? current.body, { tocExclude: entry.tocExclude, bodySha256: nextSha });
            await c.query(
                `UPDATE commulingo_docs
                    SET entry = $2::jsonb, revision = revision + 1, updated_at = NOW(), updated_by = $3,
                        body = COALESCE($4, body), body_sha256 = COALESCE($5, body_sha256),
                        body_updated_at = CASE WHEN $4::text IS NULL THEN body_updated_at ELSE NOW() END,
                        outline = $6::jsonb, link_audit = COALESCE($7::jsonb, link_audit)
                  WHERE id = $1`,
                [item.id, JSON.stringify(entry), actor,
                    bodyChanged ? body : null, bodyChanged ? sha256(body) : null, JSON.stringify(outline),
                    linkAudit ? JSON.stringify(linkAudit) : null]);
            written.push({ id: item.id, revision: current.revision + 1, op: 'update' });
        }
        const deleted = [];
        for (const id of deletes) {
            const current = (await c.query('SELECT * FROM commulingo_docs WHERE id = $1 FOR UPDATE', [id])).rows[0];
            if (!current) throw badRequest(`doc "${id}" not found`, 404);
            await supersede(c, current, 'delete', actor, note, true);
            await removeOriginal(c, id, actor, note); // would go with the row (ON DELETE CASCADE) unrecorded
            await c.query('DELETE FROM commulingo_docs WHERE id = $1', [id]);
            deleted.push(id);
        }
        for (const [fromId, target] of Object.entries(redirects.set || {})) {
            if (!ID.test(fromId) || !target || !ID.test(target.id || '')) throw badRequest(`redirect ${fromId}: ids must be lowercase letters, digits, hyphens`);
            // '' (or no anchor) sends the old id to the head of the document.
            target.anchor = target.anchor || '';
            if (target.anchor && !/^[a-z0-9-]+$/.test(target.anchor)) throw badRequest(`redirect ${fromId}: anchor must be a heading id or empty`);
            await c.query(
                `INSERT INTO commulingo_doc_redirects (from_id, to_id, anchor, note) VALUES ($1, $2, $3, $4)
                 ON CONFLICT (from_id) DO UPDATE SET to_id = EXCLUDED.to_id, anchor = EXCLUDED.anchor, note = EXCLUDED.note`,
                [fromId, target.id, target.anchor, target.note || null]);
        }
        for (const fromId of redirects.remove || []) {
            await c.query('DELETE FROM commulingo_doc_redirects WHERE from_id = $1', [fromId]);
        }
        const originals = [];
        for (const item of changes.originals?.set || []) originals.push(await writeOriginal(c, item, actor, note, structure));
        for (const docId of changes.originals?.remove || []) {
            if (await removeOriginal(c, docId, actor, note)) originals.push({ id: docId, op: 'delete' });
        }
        if (!allowStructureIssues) refuseStructure(structure);
        return { written, deleted, linkAudits, originals, structure };
    });
    // Same-process readers see the write at once; other processes within a
    // refresh cycle (docs-store, 60 s).
    if (!client) await require('./docs-store').refreshCommuLingoDocs().catch(err =>
        console.error('[commulingo docs] refresh after write failed:', err.message));
    return result;
}

// Outlines for every row that has none or a stale one (a body stored before
// the column, migration 377; rules changed since, OUTLINE_VERSION). Derived
// data only: no revision, no history, updated_at untouched. Returns the ids
// written, docs and originals apart.
async function refreshDocOutlines({ dryRun = false } = {}) {
    const docs = (await db.query('SELECT id, entry, body, body_sha256, outline FROM commulingo_docs ORDER BY id')).rows;
    const originals = (await db.query('SELECT doc_id, body, body_sha256, outline FROM commulingo_doc_originals ORDER BY doc_id')).rows;
    const entries = new Map(docs.map(row => [row.id, row.entry]));
    const written = { docs: [], originals: [] };
    for (const row of docs) {
        if (outlineFits(row.outline, row.body_sha256)) continue;
        const outline = buildOutline(row.body, { tocExclude: row.entry.tocExclude, bodySha256: row.body_sha256 });
        if (!dryRun) await db.query('UPDATE commulingo_docs SET outline = $2::jsonb WHERE id = $1 AND body_sha256 = $3', [row.id, JSON.stringify(outline), row.body_sha256]);
        written.docs.push(row.id + (outline ? '' : ' (no outline: headings without ids)'));
    }
    for (const row of originals) {
        if (outlineFits(row.outline, row.body_sha256)) continue;
        const outline = buildOutline(row.body, { tocExclude: entries.get(row.doc_id)?.tocExclude, bodySha256: row.body_sha256 });
        if (!dryRun) await db.query('UPDATE commulingo_doc_originals SET outline = $2::jsonb WHERE doc_id = $1 AND body_sha256 = $3', [row.doc_id, JSON.stringify(outline), row.body_sha256]);
        written.originals.push(row.doc_id + (outline ? '' : ' (no outline: headings without ids)'));
    }
    if (!dryRun && (written.docs.length || written.originals.length)) {
        await require('./docs-store').refreshCommuLingoDocs().catch(err => console.error('[commulingo docs] refresh after outlines failed:', err.message));
    }
    return { dryRun, checked: { docs: docs.length, originals: originals.length }, written };
}

// Link drift (L3): the entries each document's body links to now against
// what its last audit recorded. A dictionary change (a new person, an alias,
// a blocklist line) moves links without any write to the document; this is
// where that shows. `record` stores the current set (derived data, no
// revision), as a baseline or after the changes were checked. One document
// at a time: up to 1.4 MB each, minutes for the library.
async function docLinkDrift(ids, { record = false, onDoc } = {}) {
    const { inspectDocPersonLinks } = require('./doc-person-links');
    const list = ids?.length ? ids : (await db.query('SELECT id FROM commulingo_docs ORDER BY id')).rows.map(row => row.id);
    const out = [];
    for (const id of list) {
        const row = (await db.query('SELECT id, entry, body, body_sha256, link_audit FROM commulingo_docs WHERE id = $1', [id])).rows[0];
        if (!row) throw badRequest(`doc "${id}" not found`, 404);
        const now = linkAuditOf(await inspectDocPersonLinks(row.body, { id: row.id, ...row.entry }));
        const before = Array.isArray(row.link_audit?.links) ? new Set(row.link_audit.links) : null;
        const after = new Set(now.links);
        const result = before
            ? { id, since: row.link_audit.at, added: now.links.filter(link => !before.has(link)), removed: [...before].filter(link => !after.has(link)) }
            : { id, since: null, added: [], removed: [], baseline: true };
        if (record && (before === null || result.added.length || result.removed.length)) {
            await db.query('UPDATE commulingo_docs SET link_audit = $2::jsonb WHERE id = $1 AND body_sha256 = $3', [id, JSON.stringify(now), row.body_sha256]);
            result.recorded = true;
        }
        out.push(result);
        if (onDoc) onDoc(result);
        await new Promise(resolve => setImmediate(resolve));
    }
    return out;
}

async function readDocRow(id, { client = db, forUpdate = false } = {}) {
    const sql = `SELECT * FROM commulingo_docs WHERE id = $1${forUpdate ? ' FOR UPDATE' : ''}`;
    return (await client.query(sql, [id])).rows[0] || null;
}

async function readOriginalRow(id, { client = db } = {}) {
    return (await client.query('SELECT * FROM commulingo_doc_originals WHERE doc_id = $1', [id])).rows[0] || null;
}

// Every document as stored, for export and bulk edits.
async function readAllDocRows({ client = db, withBody = true } = {}) {
    const cols = withBody ? '*' : 'id, entry, body_sha256, revision, body_updated_at, updated_at, updated_by';
    const docs = (await client.query(`SELECT ${cols} FROM commulingo_docs ORDER BY id`)).rows;
    const redirects = (await client.query('SELECT * FROM commulingo_doc_redirects ORDER BY from_id')).rows;
    return { docs, redirects };
}

// Every stored original, public or not (export and the admin side only;
// the reader goes through docs-store.js, which reads public ones alone).
async function readAllOriginalRows({ client = db } = {}) {
    return (await client.query('SELECT * FROM commulingo_doc_originals ORDER BY doc_id')).rows;
}

// What the history tables hold (S8): no retention policy yet; the sizes say
// when one is needed. Per table the rows, kept bodies and bytes on disk.
async function revisionSizes({ client = db } = {}) {
    const rows = (await client.query(
        `SELECT t.name, t.rows, t.bodies, t.body_bytes, pg_total_relation_size(t.name::regclass) AS table_bytes
           FROM (SELECT 'commulingo_doc_revisions' AS name, count(*) AS rows, count(body) AS bodies, COALESCE(sum(octet_length(body)), 0) AS body_bytes
                   FROM commulingo_doc_revisions
                 UNION ALL
                 SELECT 'commulingo_doc_original_revisions', count(*), count(body), COALESCE(sum(octet_length(body)), 0)
                   FROM commulingo_doc_original_revisions) t`)).rows;
    const live = (await client.query(
        `SELECT pg_total_relation_size('commulingo_docs') + pg_total_relation_size('commulingo_doc_originals') AS bytes`)).rows[0].bytes;
    return { tables: rows.map(row => ({ name: row.name, rows: Number(row.rows), bodies: Number(row.bodies),
        bodyBytes: Number(row.body_bytes), tableBytes: Number(row.table_bytes) })), liveBytes: Number(live) };
}

async function listDocRevisions(id, { client = db } = {}) {
    return (await client.query(
        `SELECT id, revision, superseded_op, superseded_at, superseded_by, note, updated_by, updated_at,
                body_sha256, body IS NOT NULL AS has_body, octet_length(body) AS body_bytes
           FROM commulingo_doc_revisions WHERE doc_id = $1 ORDER BY revision DESC`, [id])).rows;
}

// Put an earlier revision back as a new version (the current one is kept in
// the history like any other overwrite). Works for deleted documents too.
async function restoreDocRevision(id, revision, { actor, note } = {}) {
    const rows = (await db.query(
        'SELECT * FROM commulingo_doc_revisions WHERE doc_id = $1 AND revision >= $2 ORDER BY revision', [id, revision])).rows;
    if (!rows.length || rows[0].revision !== revision) throw badRequest(`${id}: no revision ${revision}`, 404);
    let body = rows.find(row => row.body !== null)?.body;
    const current = await readDocRow(id);
    if (body === undefined) {
        if (!current) throw badRequest(`${id}: body of revision ${revision} not found`, 404);
        body = current.body;
    }
    // A restore puts back what was once stored, structure, entry and all.
    return writeDocs({ upserts: [{ id, entry: rows[0].entry, body, expectedRevision: current ? current.revision : 0 }] },
        { actor, note: note || `restore revision ${revision}`, allowStructureIssues: true, canonicalizeEntries: false });
}

module.exports = { linkSet, docLinkDrift, checkStructure, loadKnownRefs, loadDocTargets, writeDocs, refreshDocOutlines, readDocRow, readOriginalRow, readAllDocRows, readAllOriginalRows, listDocRevisions, revisionSizes, restoreDocRevision, storedEntry, sha256 };
