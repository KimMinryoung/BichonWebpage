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
const { normalizeKoreanQuotesHtml } = require('./korean-quotes');
const { sanitizeDocHtml } = require('./doc-sanitize');
const { freezeHeadingIds, inspectDocStructure, introducedErrors } = require('./doc-structure');
const { entryRefs } = require('./doc-entry');

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
const DERIVED = new Set(['id', 'file', 'modifiedAt', 'bodySha256', 'revision', 'original']);
function storedEntry(entry) {
    const out = {};
    for (const [key, value] of Object.entries(entry || {})) if (!DERIVED.has(key)) out[key] = value;
    return out;
}

// Structure of one body against the version it replaces. Both sides are read
// with their ids frozen, so a body stored before freezing is compared with
// the same ids the reader serves it under. `known` (loadKnownRefs) lets the
// entry's dictionary ids be checked; without it they are not.
function checkStructure(id, label, { body, entry, role, previousBody, previousEntry, known }) {
    const after = inspectDocStructure(freezeHeadingIds(body), { role, entry, known });
    const before = previousBody === undefined ? null : inspectDocStructure(freezeHeadingIds(previousBody), { role, entry: previousEntry, known });
    return { id, label, errors: after.errors, warnings: after.warnings, introduced: introducedErrors(before, after) };
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

// A body differing from the stored one is sanitized as an import is; an
// untouched one is not rewritten (the sanitizer reserializes markup).
function incomingBody(html, currentSha) {
    if (currentSha && sha256(html) === currentSha) return html;
    return sanitizeDocHtml(html);
}

function refuseStructure(reports) {
    const bad = reports.filter(report => report.introduced.length);
    if (!bad.length) return;
    const lines = bad.flatMap(report => report.introduced.map(issue => `${report.label}: [${issue.code}] ${issue.message}`));
    const err = badRequest(`structure check refused the write (data/commulingo/docs/README.md; pass allowStructureIssues / --allow-structure to store it anyway):\n  ${lines.join('\n  ')}`, 422);
    err.structure = bad;
    throw err;
}

async function withClient(client, fn) {
    if (client) return fn(client);
    const own = await db.connect();
    try {
        await own.query('BEGIN');
        const result = await fn(own);
        await own.query('COMMIT');
        return result;
    } catch (err) {
        await own.query('ROLLBACK');
        throw err;
    } finally {
        own.release();
    }
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

async function supersedeOriginal(client, row, op, actor, note) {
    await client.query(
        `INSERT INTO commulingo_doc_original_revisions
            (doc_id, revision, lang, body, body_sha256, public, rights, source, updated_at, updated_by,
             superseded_op, superseded_by, note)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [row.doc_id, row.revision, row.lang, row.body, row.body_sha256, row.public, row.rights, row.source,
            row.updated_at, row.updated_by, op, actor, note || null]);
}

// An original (migration 368): { docId, lang, body, public, rights, source, expectedRevision? }.
// A changed body is sanitized here, as a translation's is.
async function writeOriginal(c, item, actor, note, structureReports) {
    if (!item || typeof item.docId !== 'string' || !ID.test(item.docId)) throw badRequest('original: doc id must be lowercase letters, digits, hyphens');
    const { docId } = item;
    if (typeof item.lang !== 'string' || !/^[a-z]{2,3}$/.test(item.lang)) throw badRequest(`${docId}: original lang must be a 2-3 letter code`);
    if (typeof item.body !== 'string' || !item.body.trim()) throw badRequest(`${docId}: original body must be non-empty html`);
    const isPublic = item.public === true;
    const rights = typeof item.rights === 'string' ? item.rights.trim() : '';
    const source = typeof item.source === 'string' ? item.source.trim() : '';
    if (isPublic && !rights) throw badRequest(`${docId}: a public original needs rights (why it may be published)`);
    const current = (await c.query('SELECT * FROM commulingo_doc_originals WHERE doc_id = $1 FOR UPDATE', [docId])).rows[0];
    if (item.expectedRevision !== undefined && (current ? current.revision : 0) !== item.expectedRevision) {
        throw badRequest(`${docId}: original expected revision ${item.expectedRevision}, found ${current ? current.revision : 'none'}`, 409);
    }
    const body = freezeHeadingIds(incomingBody(item.body, current?.body_sha256));
    const bodySha = sha256(body);
    if (!current || current.body_sha256 !== bodySha) {
        const entry = (await c.query('SELECT entry FROM commulingo_docs WHERE id = $1', [docId])).rows[0]?.entry;
        structureReports.push(checkStructure(docId, `${docId} (original)`, {
            body, entry, role: 'original', previousBody: current ? current.body : undefined, previousEntry: entry }));
    }
    if (!current) {
        const revision = (await c.query(
            'SELECT COALESCE(MAX(revision), 0) + 1 AS n FROM commulingo_doc_original_revisions WHERE doc_id = $1', [docId])).rows[0].n;
        await c.query(
            `INSERT INTO commulingo_doc_originals (doc_id, lang, body, body_sha256, public, rights, source, revision, updated_by, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)`,
            [docId, item.lang, body, bodySha, isPublic, rights, source, revision, actor]);
        return { id: docId, revision, op: 'insert' };
    }
    if (current.body_sha256 === bodySha && current.lang === item.lang && current.public === isPublic
        && current.rights === rights && current.source === source) {
        return { id: docId, revision: current.revision, op: 'unchanged' };
    }
    await supersedeOriginal(c, current, 'update', actor, note);
    await c.query(
        `UPDATE commulingo_doc_originals
            SET lang = $2, body = $3, body_sha256 = $4, public = $5, rights = $6, source = $7,
                revision = revision + 1, updated_at = NOW(), updated_by = $8
          WHERE doc_id = $1`,
        [docId, item.lang, body, bodySha, isPublic, rights, source, actor]);
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
//   upserts: [{ id, entry, body?, expectedRevision?, sortOrder? }]  body omitted = keep;
//            a new document needs a body
//   deletes: [id]
//   redirects: { set: { fromId: { id, anchor, note? } }, remove: [fromId] }
//   originals: { set: [{ docId, lang, body, public, rights, source, expectedRevision? }], remove: [docId] }
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
                body = freezeHeadingIds(incomingBody(normalized, current?.body_sha256));
                if (!body.trim()) throw badRequest(`${item.id}: body must be non-empty html`);
            }
            const changed = !current || (body !== undefined && sha256(body) !== current.body_sha256)
                || JSON.stringify(entry) !== JSON.stringify(current.entry);
            if (changed) {
                const audit = await require('./doc-person-links').inspectDocPersonLinks(body ?? current?.body, { id: item.id, ...entry });
                linkAudits.push({ id: item.id, mentions: audit.mentions, warnings: audit.warnings, truncated: audit.truncated });
                if (body !== undefined || current) {
                    structure.push(checkStructure(item.id, item.id, {
                        body: body ?? current.body, entry, role: 'translation', known: await knownFor(entry),
                        previousBody: current ? current.body : undefined, previousEntry: current ? current.entry : undefined }));
                }
            }
            if (!current) {
                if (body === undefined) throw badRequest(`${item.id}: a new document needs a body`);
                const sortOrder = Number.isInteger(item.sortOrder) ? item.sortOrder
                    : (await c.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM commulingo_docs')).rows[0].n;
                // A re-created id continues its old numbering, so the history
                // (unique per doc_id, revision) never collides.
                const revision = (await c.query(
                    'SELECT COALESCE(MAX(revision), 0) + 1 AS n FROM commulingo_doc_revisions WHERE doc_id = $1', [item.id])).rows[0].n;
                await c.query(
                    `INSERT INTO commulingo_docs (id, sort_order, entry, body, body_sha256, revision, updated_by, created_by)
                     VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $7)`,
                    [item.id, sortOrder, JSON.stringify(entry), body, sha256(body), revision, actor]);
                written.push({ id: item.id, revision, op: 'insert' });
                continue;
            }
            const bodyChanged = body !== undefined && sha256(body) !== current.body_sha256;
            const entryChanged = JSON.stringify(entry) !== JSON.stringify(current.entry);
            const sortChanged = Number.isInteger(item.sortOrder) && item.sortOrder !== current.sort_order;
            if (!bodyChanged && !entryChanged && !sortChanged) {
                written.push({ id: item.id, revision: current.revision, op: 'unchanged' });
                continue;
            }
            await supersede(c, current, 'update', actor, note, bodyChanged);
            await c.query(
                `UPDATE commulingo_docs
                    SET entry = $2::jsonb, sort_order = $3, revision = revision + 1, updated_at = NOW(), updated_by = $4,
                        body = COALESCE($5, body), body_sha256 = COALESCE($6, body_sha256),
                        body_updated_at = CASE WHEN $5::text IS NULL THEN body_updated_at ELSE NOW() END
                  WHERE id = $1`,
                [item.id, JSON.stringify(entry), sortChanged ? item.sortOrder : current.sort_order, actor,
                    bodyChanged ? body : null, bodyChanged ? sha256(body) : null]);
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

async function readDocRow(id, { client = db, forUpdate = false } = {}) {
    const sql = `SELECT * FROM commulingo_docs WHERE id = $1${forUpdate ? ' FOR UPDATE' : ''}`;
    return (await client.query(sql, [id])).rows[0] || null;
}

async function readOriginalRow(id, { client = db } = {}) {
    return (await client.query('SELECT * FROM commulingo_doc_originals WHERE doc_id = $1', [id])).rows[0] || null;
}

// Every document as stored, for export and bulk edits.
async function readAllDocRows({ client = db, withBody = true } = {}) {
    const cols = withBody ? '*' : 'id, sort_order, entry, body_sha256, revision, body_updated_at, updated_at, updated_by';
    const docs = (await client.query(`SELECT ${cols} FROM commulingo_docs ORDER BY sort_order, id`)).rows;
    const redirects = (await client.query('SELECT * FROM commulingo_doc_redirects ORDER BY from_id')).rows;
    return { docs, redirects };
}

// Every stored original, public or not (export and the admin side only;
// the reader goes through docs-store.js, which reads public ones alone).
async function readAllOriginalRows({ client = db } = {}) {
    return (await client.query('SELECT * FROM commulingo_doc_originals ORDER BY doc_id')).rows;
}

async function listDocRevisions(id, { client = db } = {}) {
    return (await client.query(
        `SELECT id, revision, superseded_op, superseded_at, superseded_by, note, updated_by, updated_at,
                body_sha256, body IS NOT NULL AS has_body
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

module.exports = { checkStructure, loadKnownRefs, writeDocs, readDocRow, readOriginalRow, readAllDocRows, readAllOriginalRows, listDocRevisions, restoreDocRevision, storedEntry, sha256 };
