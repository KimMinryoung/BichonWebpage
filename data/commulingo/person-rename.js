const fs = require('fs');
const path = require('path');

// Renaming a person id (a slug that lost its diacritics, a wrong given name) is
// a move, not a merge: every row keyed by the person follows the new id and the
// old URL keeps working through commulingo_id_redirects. Foreign keys to
// commulingo_people cascade on update (migration 190 closed the last gap), so
// the one UPDATE of commulingo_people carries aliases, career, sections, roles,
// scenes, events, terms, office rows and enrichment. The columns below hold a
// person id without a foreign key and are moved by hand. Finished history
// (approved suggestions, done gaps, completed jobs, revisions, tool logs) keeps
// the id it was recorded under.
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOOSE_REFERENCES = [
    { table: 'commulingo_person_evidence', sql: 'UPDATE commulingo_person_evidence SET person_id=$2 WHERE person_id=$1' },
    { table: 'commulingo_editorial_notes', sql: "UPDATE commulingo_editorial_notes SET target_id=$2 WHERE target_type='person' AND target_id=$1" },
    { table: 'commulingo_agent_suggestions', sql: "UPDATE commulingo_agent_suggestions SET target_id=$2 WHERE target_type='person' AND target_id=$1 AND status='pending'" },
    { table: 'commulingo_curation_gaps', sql: "UPDATE commulingo_curation_gaps SET target_id=$2 WHERE kind='person' AND target_id=$1 AND status='pending'" },
    { table: 'commulingo_pipeline_jobs', sql: "UPDATE commulingo_pipeline_jobs SET target=$2 WHERE kind='person' AND target=$1 AND status NOT IN ('complete','cancelled')" },
];

function validateRenames(renames) {
    if (!Array.isArray(renames) || !renames.length) throw new Error('renames must be a non-empty array');
    const froms = new Set(), tos = new Set();
    for (const r of renames) {
        if (!r || !ID_RE.test(r.from || '') || !ID_RE.test(r.to || '')) throw new Error(`invalid rename ${JSON.stringify(r)}`);
        if (r.from === r.to) throw new Error(`rename to itself: ${r.from}`);
        if (froms.has(r.from) || tos.has(r.to)) throw new Error(`duplicate rename involving ${r.from} → ${r.to}`);
        froms.add(r.from); tos.add(r.to);
    }
    // One batch never renames onto an id another entry is vacating: the order of
    // the UPDATEs would decide the outcome.
    for (const r of renames) if (froms.has(r.to)) throw new Error(`${r.to} is both a source and a target`);
}

async function assertCascadingForeignKeys(client) {
    const { rows } = await client.query(`
        SELECT conrelid::regclass::text AS tbl, conname
          FROM pg_constraint
         WHERE contype='f' AND confrelid='commulingo_people'::regclass AND confupdtype <> 'c'`);
    if (rows.length) throw new Error(`foreign keys to commulingo_people without ON UPDATE CASCADE: ${rows.map(r => `${r.tbl}.${r.conname}`).join(', ')}`);
}

async function renameOne(client, { from, to, note }, changedBy) {
    const person = await client.query('SELECT id FROM commulingo_people WHERE id=$1 FOR UPDATE', [from]);
    if (!person.rows.length) throw new Error(`no person ${from}`);
    if ((await client.query('SELECT 1 FROM commulingo_people WHERE id=$1', [to])).rows.length) throw new Error(`person ${to} already exists`);
    // A redirect row for the new id would 301 the live page away once the old
    // card is gone; only a reversal of an earlier rename (to → from) may be dropped.
    const occupied = await client.query("SELECT to_id FROM commulingo_id_redirects WHERE entity_type='person' AND from_id=$1", [to]);
    if (occupied.rows.length && occupied.rows[0].to_id !== from) throw new Error(`${to} already redirects to ${occupied.rows[0].to_id}`);
    await client.query("DELETE FROM commulingo_id_redirects WHERE entity_type='person' AND from_id=$1", [to]);

    await client.query('UPDATE commulingo_people SET id=$2 WHERE id=$1', [from, to]);
    const moved = {};
    for (const ref of LOOSE_REFERENCES) {
        if (!(await client.query('SELECT to_regclass($1) AS t', [ref.table])).rows[0].t) continue;
        moved[ref.table] = (await client.query(ref.sql, [from, to])).rowCount;
    }
    moved.docs = await renameDocPeople(client, from, to, changedBy);
    moved.redirectsRetargeted = (await client.query(
        "UPDATE commulingo_id_redirects SET to_id=$2 WHERE entity_type='person' AND to_id=$1", [from, to])).rowCount;
    await client.query(
        "INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note) VALUES ('person', $1, $2, $3)",
        [from, to, note || 'person id renamed']);
    await require('./admin-tx').writeRevision(client, 'person', to, `id renamed from ${from}`, { renamedFrom: from, renamedTo: to, note: note || '' }, changedBy);
    return { from, to, moved };
}

// Reference documents list their people by id in the entry stored in
// commulingo_docs; rewritten in the same transaction, with a doc revision.
async function renameDocPeople(client, from, to, changedBy) {
    const { rows } = await client.query(
        "SELECT id, entry, revision FROM commulingo_docs WHERE entry->'people' @> to_jsonb($1::text) OR entry->'people' @> jsonb_build_array(jsonb_build_object('id', $1::text))",
        [from]);
    if (!rows.length) return 0;
    const { writeDocs } = require('./docs-db');
    const map = new Map([[from, to]]);
    const upserts = rows.map(row => ({
        id: row.id, expectedRevision: row.revision,
        entry: renameInDocsManifest({ docs: [row.entry] }, map).docs[0],
    }));
    await writeDocs({ upserts }, { actor: changedBy, note: `person id renamed ${from} → ${to}`, client });
    return rows.length;
}

// All renames in one transaction. With dryRun the transaction is rolled back
// after every check and UPDATE has run, so a dry run fails exactly where the
// real one would.
async function renamePersonIds(renames, { client, changedBy = 'commulingo-person-rename', dryRun = false } = {}) {
    validateRenames(renames);
    const run = async tx => {
        await assertCascadingForeignKeys(tx);
        const results = [];
        for (const r of renames) results.push(await renameOne(tx, r, changedBy));
        return results;
    };
    if (client) return run(client);
    // Loaded here so the file helpers below stay usable without a database.
    if (!dryRun) return require('./admin-tx').withTransaction({}, run);
    const db = require('../../config/database');
    const tx = await db.connect();
    try {
        await tx.query('BEGIN');
        await tx.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-editorial-write'))");
        return await run(tx);
    } finally {
        await tx.query('ROLLBACK').catch(() => {});
        tx.release();
    }
}

// ── Host-mounted data files keyed by person id ─────────────────────────────
// These are read by mtime and change with no deploy, so they are rewritten
// after the DB commit. Each rewriter touches only fields that hold person ids.
function renameInPolitburo(data, map) {
    // Every id in the dataset is a person id: member keys, era lists, congress rows.
    const walk = value => {
        if (typeof value === 'string') return map.get(value) ?? value;
        if (Array.isArray(value)) return value.map(walk);
        if (value && typeof value === 'object') {
            return Object.fromEntries(Object.entries(value).map(([k, v]) => [map.get(k) ?? k, walk(v)]));
        }
        return value;
    };
    return { ...data, members: walk(data.members), eras: walk(data.eras), congresses: walk(data.congresses) };
}

function renameInDocsManifest(data, map) {
    return { ...data, docs: (data.docs || []).map(doc => !Array.isArray(doc.people) ? doc : {
        ...doc,
        people: doc.people.map(ref => typeof ref === 'string' ? (map.get(ref) ?? ref)
            : ref && typeof ref.id === 'string' && map.has(ref.id) ? { ...ref, id: map.get(ref.id) } : ref),
    }) };
}

function renameInGenealogy(data, map) {
    const walk = value => {
        if (Array.isArray(value)) return value.map(walk);
        if (!value || typeof value !== 'object') return value;
        const out = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v)]));
        if (out.type === 'person' && map.has(out.id)) out.id = map.get(out.id);
        return out;
    };
    return walk(data);
}

function dataFiles(root) {
    const genealogy = path.join(root, 'genealogy');
    return [
        // The Central Committee body rosters share the Politburo schema (party-bodies.js).
        ...['politburo.json', 'secretariat.json', 'orgburo.json'].map(f => path.join(root, f)).filter(f => fs.existsSync(f))
            .map(file => ({ file, rewrite: renameInPolitburo })),
        ...(fs.existsSync(genealogy) ? fs.readdirSync(genealogy).filter(f => f.endsWith('.json')).sort()
            .map(f => ({ file: path.join(genealogy, f), rewrite: renameInGenealogy })) : []),
    ];
}

function serialize(value, indent, raw) {
    return JSON.stringify(value, null, indent) + (raw.endsWith('\n') ? '\n' : '');
}

// Rewrites the files that changed (temp file + rename, in the file's own
// indentation) and returns { changed, manual }. A file whose layout the
// serializer would not reproduce is left alone and reported in `manual`, so a
// rename never reformats a hand-laid-out chart. With dryRun nothing is written.
function renameInDataFiles(renames, { root = __dirname, dryRun = false } = {}) {
    const map = new Map(renames.map(r => [r.from, r.to]));
    const changed = [], manual = [];
    for (const { file, rewrite } of dataFiles(root)) {
        if (!fs.existsSync(file)) continue;
        const raw = fs.readFileSync(file, 'utf8');
        const parsed = JSON.parse(raw);
        const renamed = rewrite(parsed, map);
        if (JSON.stringify(renamed) === JSON.stringify(parsed)) continue;
        const indent = (raw.match(/\n( +)\S/) || [null, '  '])[1].length;
        if (serialize(parsed, indent, raw) !== raw) { manual.push(file); continue; }
        changed.push(file);
        if (dryRun) continue;
        const next = serialize(renamed, indent, raw);
        const tmp = `${file}.rename-${process.pid}`;
        fs.writeFileSync(tmp, next);
        fs.renameSync(tmp, file);
    }
    return { changed, manual };
}

// Other JSON under data/commulingo that still carries an old id as an exact
// string. Snapshots and generated shards are rebuilt from the DB; anything else
// found here is a reference the tool does not know how to move.
function findLeftoverReferences(renames, { root = __dirname } = {}) {
    const olds = new Set(renames.map(r => r.from));
    const skip = new Set(['generated', 'vendor', 'cache']);
    const hits = [];
    const visit = dir => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) { if (!skip.has(entry.name)) visit(full); continue; }
            if (!entry.name.endsWith('.json') || entry.name.endsWith('-snapshot.json')) continue;
            const text = fs.readFileSync(full, 'utf8');
            for (const id of olds) if (text.includes(`"${id}"`)) hits.push({ file: full, id });
        }
    };
    visit(root);
    return hits;
}

module.exports = {
    renamePersonIds, renameInDataFiles, findLeftoverReferences, validateRenames,
    renameInPolitburo, renameInDocsManifest, renameInGenealogy,
};
