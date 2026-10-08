// CommuLingo data kept as whole JSON documents in the database
// (commulingo_data_documents, migration 341): the activity catalog, the
// Central Committee body rosters, event-map control phases and genealogy
// charts. They used to be git-tracked files; now a correction is a DB write
// with history and needs neither a commit nor a deploy.
//
// Serving is the registry snapshot pattern (memory → disk snapshot → DB,
// refreshed every minute), so getDataDocument() stays synchronous. A cold
// start with neither a snapshot nor the database (a lone clone running the
// tests) falls back to the frozen seed in scripts/fixtures/, which is test
// data and is not updated when the data changes.
//
// The activity catalog is also written out to activity-catalog.json beside
// this file whenever it changes: leninbot reads that path directly
// (ops/paths.py commulingo_data_file).
const fs = require('fs');
const path = require('path');
const db = require('../../config/database');
const { createRegistrySnapshotStore } = require('./snapshot-store');

const SNAPSHOT_PATH = process.env.COMMULINGO_DATA_DOCUMENTS_SNAPSHOT || path.join(__dirname, 'data-documents-snapshot.json');
const SEED_PATH = path.join(__dirname, '..', '..', 'scripts', 'fixtures', 'commulingo-data-documents-seed.json');
const CATALOG_FILE = process.env.COMMULINGO_ACTIVITY_CATALOG_FILE || path.join(__dirname, 'activity-catalog.json');
const KEY = /^[a-z0-9-]+(\/[a-z0-9-]+)?$/;

function badRequest(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    return err;
}

// ── Validation per key family ──────────────────────────────────────────────
// Shape checks only: enough that a put cannot blank a page or crash a loader.
const uniqueIds = (rows, label) => {
    const seen = new Set();
    rows.forEach(row => {
        if (!row || typeof row.id !== 'string' || !row.id) throw badRequest(`${label}: every row needs an id`);
        if (seen.has(row.id)) throw badRequest(`${label}: duplicate id ${row.id}`);
        seen.add(row.id);
    });
};
const VALIDATORS = [
    [/^activity-catalog$/, c => {
        if (!Number.isInteger(c.version)) throw badRequest('activity-catalog: version must be an integer');
        if (!Array.isArray(c.functions) || !c.functions.length) throw badRequest('activity-catalog: functions missing');
        if (!Array.isArray(c.affiliations) || !c.affiliations.length) throw badRequest('activity-catalog: affiliations missing');
        uniqueIds(c.functions, 'activity-catalog functions');
        uniqueIds(c.affiliations, 'activity-catalog affiliations');
    }],
    [/^(politburo|secretariat|orgburo)$/, c => {
        if (!c.members || typeof c.members !== 'object' || Array.isArray(c.members)) throw badRequest('roster: members must be an object');
    }],
    [/^event-control\//, c => {
        if (!Array.isArray(c.phases) || !c.phases.length) throw badRequest('event-control: phases missing');
        if (!Array.isArray(c.sides)) throw badRequest('event-control: sides missing');
    }],
    [/^genealogy\//, (c, key) => {
        if (c.id !== key.slice('genealogy/'.length)) throw badRequest(`${key}: chart id must match the key`);
        if (!Array.isArray(c.columns) || !c.columns.length || !Array.isArray(c.nodes) || !c.nodes.length
            || !Array.isArray(c.edges) || !Number.isFinite(c.timeStart) || !Number.isFinite(c.timeEnd)
            || c.timeEnd <= c.timeStart) throw badRequest(`${key}: chart is missing columns/nodes/edges or a time range`);
    }],
];

function validateDataDocument(key, content) {
    if (typeof key !== 'string' || !KEY.test(key)) throw badRequest(`bad key ${key}`);
    if (!content || typeof content !== 'object' || Array.isArray(content)) throw badRequest(`${key}: content must be a JSON object`);
    const rule = VALIDATORS.find(([re]) => re.test(key));
    if (!rule) throw badRequest(`${key}: unknown key family`);
    rule[1](content, key);
}

// ── Read side ──────────────────────────────────────────────────────────────
function materializeCatalog(entry) {
    if (!entry || process.env.COMMULINGO_ACTIVITY_CATALOG_FILE === '') return;
    const text = `${JSON.stringify(entry.content, null, 2)}\n`;
    try {
        if (fs.existsSync(CATALOG_FILE) && fs.readFileSync(CATALOG_FILE, 'utf8') === text) return;
        const tmp = `${CATALOG_FILE}.${process.pid}.tmp`;
        fs.writeFileSync(tmp, text);
        fs.renameSync(tmp, CATALOG_FILE);
    } catch (err) {
        // A read-only checkout (the test container) cannot write it; harmless.
        if (err.code !== 'EROFS' && err.code !== 'EACCES') console.error('[commulingo data] activity-catalog.json write failed:', err.message);
    }
}

function buildMap(rows) {
    const byKey = new Map();
    rows.forEach(row => {
        if (row && KEY.test(row.key || '') && row.content && typeof row.content === 'object') {
            byKey.set(row.key, { key: row.key, content: row.content, revision: row.revision, updatedAt: row.updated_at || null });
        }
    });
    return byKey;
}

// Live data only: the seed never reaches leninbot's file.
function install(rows) {
    const byKey = buildMap(rows);
    materializeCatalog(byKey.get('activity-catalog'));
    return byKey;
}

const store = createRegistrySnapshotStore({
    label: 'commulingo data documents',
    refreshMs: Number.parseInt(process.env.COMMULINGO_DATA_DOCUMENTS_REFRESH_MS || '60000', 10),
    snapshotPath: SNAPSHOT_PATH,
    fetchRows: async () => (await db.query(
        'SELECT key, content, revision, updated_at FROM commulingo_data_documents ORDER BY key')).rows
        .map(row => ({ ...row, updated_at: row.updated_at && new Date(row.updated_at).toISOString() })),
    install,
    signatureTables: ['commulingo_data_documents'],
    validateSnapshot: rows => Array.isArray(rows) && rows.some(row => row.key === 'activity-catalog'),
});

let seeded = null;
function loadSeed() {
    if (seeded) return seeded;
    try {
        seeded = buildMap(JSON.parse(fs.readFileSync(SEED_PATH, 'utf8')));
    } catch (err) {
        console.error('[commulingo data] no snapshot, no database and no seed:', err.message);
        seeded = new Map();
    }
    return seeded;
}

function documents() {
    const memory = store.loadSync();
    return memory.size ? memory : loadSeed();
}

function getDataDocument(key) {
    const entry = documents().get(key);
    return entry ? entry.content : null;
}

// [{ key, content, revision, updatedAt }] whose key starts with prefix, by key.
function listDataDocuments(prefix) {
    return [...documents().values()].filter(entry => entry.key.startsWith(prefix));
}

// ── Write side ─────────────────────────────────────────────────────────────
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

async function supersede(c, row, op, actor, note) {
    await c.query(
        `INSERT INTO commulingo_data_document_revisions
            (key, revision, content, updated_at, updated_by, superseded_op, superseded_by, note)
         VALUES ($1, $2, $3::json, $4, $5, $6, $7, $8)`,
        [row.key, row.revision, row.content_text, row.updated_at, row.updated_by, op, actor, note || null]);
}

// changes: { upserts: [{ key, content, expectedRevision? }], deletes: [key] }.
// Returns { written: [{ key, revision, op }], deleted: [key] }.
async function writeDataDocuments(changes, { actor, note, client } = {}) {
    if (!actor) throw badRequest('writeDataDocuments needs an actor');
    const result = await withClient(client, async c => {
        await c.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-data-documents-write'))");
        const written = [];
        for (const item of changes.upserts || []) {
            validateDataDocument(item.key, item.content);
            const text = JSON.stringify(item.content);
            const current = (await c.query(
                'SELECT key, content::text AS content_text, revision, updated_at, updated_by FROM commulingo_data_documents WHERE key = $1 FOR UPDATE',
                [item.key])).rows[0];
            if (item.expectedRevision !== undefined && (current ? current.revision : 0) !== item.expectedRevision) {
                throw badRequest(`${item.key}: expected revision ${item.expectedRevision}, found ${current ? current.revision : 'none'}`, 409);
            }
            if (!current) {
                const revision = (await c.query(
                    'SELECT COALESCE(MAX(revision), 0) + 1 AS n FROM commulingo_data_document_revisions WHERE key = $1', [item.key])).rows[0].n;
                await c.query(
                    `INSERT INTO commulingo_data_documents (key, content, revision, updated_by, created_by)
                     VALUES ($1, $2::json, $3, $4, $4)`, [item.key, text, revision, actor]);
                written.push({ key: item.key, revision, op: 'insert' });
                continue;
            }
            if (JSON.stringify(JSON.parse(current.content_text)) === text) {
                written.push({ key: item.key, revision: current.revision, op: 'unchanged' });
                continue;
            }
            await supersede(c, current, 'update', actor, note);
            await c.query(
                `UPDATE commulingo_data_documents SET content = $2::json, revision = revision + 1, updated_at = NOW(), updated_by = $3
                  WHERE key = $1`, [item.key, text, actor]);
            written.push({ key: item.key, revision: current.revision + 1, op: 'update' });
        }
        const deleted = [];
        for (const key of changes.deletes || []) {
            const current = (await c.query(
                'SELECT key, content::text AS content_text, revision, updated_at, updated_by FROM commulingo_data_documents WHERE key = $1 FOR UPDATE',
                [key])).rows[0];
            if (!current) throw badRequest(`${key} not found`, 404);
            await supersede(c, current, 'delete', actor, note);
            await c.query('DELETE FROM commulingo_data_documents WHERE key = $1', [key]);
            deleted.push(key);
        }
        return { written, deleted };
    });
    if (!client) await store.refresh().catch(err => console.error('[commulingo data] refresh after write failed:', err.message));
    return result;
}

async function readDataDocumentRows({ client = db, prefix = '' } = {}) {
    return (await client.query(
        `SELECT key, content::text AS content_text, revision, updated_at, updated_by
           FROM commulingo_data_documents WHERE key LIKE $1 ORDER BY key`, [`${prefix}%`])).rows;
}

async function listDataDocumentRevisions(key, { client = db } = {}) {
    return (await client.query(
        `SELECT revision, superseded_op, superseded_at, superseded_by, note, updated_by, updated_at
           FROM commulingo_data_document_revisions WHERE key = $1 ORDER BY revision DESC`, [key])).rows;
}

async function restoreDataDocumentRevision(key, revision, { actor, note } = {}) {
    const old = (await db.query(
        'SELECT content::text AS content_text FROM commulingo_data_document_revisions WHERE key = $1 AND revision = $2', [key, revision])).rows[0];
    if (!old) throw badRequest(`${key}: no revision ${revision}`, 404);
    const current = (await db.query('SELECT revision FROM commulingo_data_documents WHERE key = $1', [key])).rows[0];
    return writeDataDocuments({ upserts: [{ key, content: JSON.parse(old.content_text), expectedRevision: current ? current.revision : 0 }] },
        { actor, note: note || `restore revision ${revision}` });
}

module.exports = {
    getDataDocument, listDataDocuments, loadDataDocuments: store.load, refreshDataDocuments: () => store.refresh(),
    validateDataDocument, writeDataDocuments, readDataDocumentRows, listDataDocumentRevisions, restoreDataDocumentRevision,
};
