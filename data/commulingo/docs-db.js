// Writes for CommuLingo reference documents (migration 339). The database is
// the source of truth; docs-store.js serves a snapshot of it. Every update or
// delete first copies the version it replaces into commulingo_doc_revisions,
// so any earlier state can be restored (restoreDocRevision).
//
// Validation of entries (headwords, aliases, link expressions) stays in
// docs-import.js; this module only persists what it is given.
const crypto = require('crypto');
const db = require('../../config/database');

const ID = /^[a-z0-9-]+$/;
const sha256 = text => crypto.createHash('sha256').update(text, 'utf8').digest('hex');

function badRequest(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    return err;
}

// The manifest-entry shape callers pass around carries id (the row key) and
// file/modifiedAt/revision (derived when served); none of those is stored.
const DERIVED = new Set(['id', 'file', 'modifiedAt', 'bodySha256', 'revision']);
function storedEntry(entry) {
    const out = {};
    for (const [key, value] of Object.entries(entry || {})) if (!DERIVED.has(key)) out[key] = value;
    return out;
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

// changes: {
//   upserts: [{ id, entry, body?, expectedRevision?, sortOrder? }]  body omitted = keep;
//            a new document needs a body
//   deletes: [id]
//   redirects: { set: { fromId: { id, anchor, note? } }, remove: [fromId] }
// }
// Runs in the caller's transaction when `client` is given, else in its own.
// Returns { written: [{ id, revision, op }], deleted: [id] }.
async function writeDocs(changes, { actor, note, client } = {}) {
    if (!actor) throw badRequest('writeDocs needs an actor');
    const upserts = changes.upserts || [];
    const deletes = changes.deletes || [];
    const redirects = changes.redirects || {};
    const result = await withClient(client, async c => {
        await c.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-docs-write'))");
        const written = [];
        for (const item of upserts) {
            if (!item || typeof item.id !== 'string' || !ID.test(item.id)) throw badRequest('doc id must be lowercase letters, digits, hyphens');
            const entry = storedEntry(item.entry);
            const body = item.body;
            if (body !== undefined && (typeof body !== 'string' || !body.trim())) throw badRequest(`${item.id}: body must be non-empty html`);
            const current = (await c.query('SELECT * FROM commulingo_docs WHERE id = $1 FOR UPDATE', [item.id])).rows[0];
            if (item.expectedRevision !== undefined && (current ? current.revision : 0) !== item.expectedRevision) {
                throw badRequest(`${item.id}: expected revision ${item.expectedRevision}, found ${current ? current.revision : 'none'}`, 409);
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
        return { written, deleted };
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

// Every document as stored, for export and bulk edits.
async function readAllDocRows({ client = db, withBody = true } = {}) {
    const cols = withBody ? '*' : 'id, sort_order, entry, body_sha256, revision, body_updated_at, updated_at, updated_by';
    const docs = (await client.query(`SELECT ${cols} FROM commulingo_docs ORDER BY sort_order, id`)).rows;
    const redirects = (await client.query('SELECT * FROM commulingo_doc_redirects ORDER BY from_id')).rows;
    return { docs, redirects };
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
    return writeDocs({ upserts: [{ id, entry: rows[0].entry, body, expectedRevision: current ? current.revision : 0 }] },
        { actor, note: note || `restore revision ${revision}` });
}

module.exports = { writeDocs, readDocRow, readAllDocRows, listDocRevisions, restoreDocRevision, storedEntry, sha256 };
