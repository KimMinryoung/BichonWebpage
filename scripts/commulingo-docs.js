#!/usr/bin/env node
// Container side of scripts/commulingo-docs: reference documents in the
// database (commulingo_docs) as a JSON bundle on stdin/stdout. The host
// wrapper turns the bundle into a directory shaped like the old
// data/commulingo/docs/ (manifest.json + <id>.html) and back.
//
//   export [id ...]                      bundle of every (or the named) document
//   put [--dry-run] [--delete-missing] [--actor who] [--note text]   bundle on stdin
//   put-body <id> [--actor who] [--note text]   replace one document's body (stdin)
//   history <id>                         superseded revisions, newest first
//   restore <id> <revision> [--actor who]
//
// Bundle: { docs: [{ id, revision, sortOrder, entry, body }], redirects: { from: { id, anchor } } }
// put writes only documents whose entry or body differ (an edited body is
// sanitized like an import), each guarded by the
// revision it was exported at (a document changed since then is refused). A
// bundle without `redirects` leaves them alone; with it, the set is replaced.
// Docs absent from the bundle stay unless --delete-missing (full exports only).
// stdout carries the export bundle; every log line (the DB pool's included) goes to stderr.
console.log = console.info = console.error;
require('./lib/bootstrap');
const fs = require('fs');
const { readAllDocRows, writeDocs, listDocRevisions, restoreDocRevision, storedEntry, sha256 } = require('../data/commulingo/docs-db');
const { canonicalEntry } = require('../data/commulingo/docs-import');
const { sanitizeDocHtml } = require('../data/commulingo/doc-sanitize');

function option(args, name, fallback) {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : fallback;
}

async function exportDocs(ids) {
    const { docs, redirects } = await readAllDocRows();
    const wanted = ids.length ? new Set(ids) : null;
    const missing = ids.filter(id => !docs.some(row => row.id === id));
    if (missing.length) throw new Error(`no such document(s): ${missing.join(', ')}`);
    return {
        docs: docs.filter(row => !wanted || wanted.has(row.id)).map(row => ({
            id: row.id, revision: row.revision, sortOrder: row.sort_order, entry: row.entry, body: row.body,
        })),
        redirects: wanted ? undefined
            : Object.fromEntries(redirects.map(row => [row.from_id, { id: row.to_id, anchor: row.anchor }])),
        full: !wanted,
    };
}

async function put(bundle, args) {
    const dryRun = args.includes('--dry-run');
    const { docs: current } = await readAllDocRows({ withBody: false });
    const byId = new Map(current.map(row => [row.id, row]));
    const upserts = [];
    const problems = [];
    for (const doc of bundle.docs || []) {
        try {
            canonicalEntry({ id: doc.id, ...doc.entry }); // validation only; the entry is stored as given
            if (typeof doc.body !== 'string' || !doc.body.trim()) throw new Error('empty body');
        } catch (err) {
            problems.push(`${doc.id}: ${err.message}`);
            continue;
        }
        const row = byId.get(doc.id);
        if (row && Number.isInteger(doc.revision) && doc.revision !== row.revision) {
            problems.push(`${doc.id}: changed in the database since export (exported r${doc.revision}, now r${row.revision}); re-export it`);
            continue;
        }
        // An edited body goes through the same sanitizer as an import; an
        // untouched one is not rewritten (the sanitizer reserializes markup).
        const bodyChanged = !row || sha256(doc.body) !== row.body_sha256;
        upserts.push({
            id: doc.id, entry: storedEntry(doc.entry), body: bodyChanged ? sanitizeDocHtml(doc.body) : undefined,
            sortOrder: Number.isInteger(doc.sortOrder) ? doc.sortOrder : undefined,
            expectedRevision: row ? row.revision : 0,
        });
    }
    if (problems.length) throw new Error(`refused, nothing written:\n  ${problems.join('\n  ')}`);

    let deletes = [];
    if (args.includes('--delete-missing')) {
        if (!bundle.full) throw new Error('--delete-missing needs a full export (no ids)');
        const keep = new Set((bundle.docs || []).map(doc => doc.id));
        deletes = current.filter(row => !keep.has(row.id)).map(row => row.id);
    }
    let redirects;
    if (bundle.redirects) {
        const { redirects: existing } = await readAllDocRows({ withBody: false });
        redirects = {
            set: bundle.redirects,
            remove: existing.map(row => row.from_id).filter(id => !Object.hasOwn(bundle.redirects, id)),
        };
    }
    const actor = option(args, '--actor', `commulingo-docs:${process.env.USER || 'cli'}`);
    const note = option(args, '--note', 'scripts/commulingo-docs put');
    if (dryRun) {
        // Run the whole write and roll it back, so a dry run fails where the real one would.
        const db = require('../config/database');
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            return { dryRun: true, ...(await writeDocs({ upserts, deletes, redirects }, { actor, note, client })) };
        } finally {
            await client.query('ROLLBACK').catch(() => {});
            client.release();
        }
    }
    return writeDocs({ upserts, deletes, redirects }, { actor, note });
}

async function main() {
    const [command, ...args] = process.argv.slice(2);
    if (command === 'export') {
        // A pipe takes stdout asynchronously: wait for the flush before main() exits.
        const json = JSON.stringify(await exportDocs(args.filter(a => !a.startsWith('--'))));
        await new Promise(resolve => process.stdout.write(json, resolve));
    } else if (command === 'put') {
        const result = await put(JSON.parse(fs.readFileSync(0, 'utf8')), args);
        const changed = result.written.filter(w => w.op !== 'unchanged');
        for (const w of changed) console.log(`${result.dryRun ? 'would ' : ''}${w.op} ${w.id} → r${w.revision}`);
        for (const id of result.deleted) console.log(`${result.dryRun ? 'would ' : ''}delete ${id}`);
        console.log(`${result.dryRun ? 'dry run: ' : ''}${changed.length} written, ${result.written.length - changed.length} unchanged, ${result.deleted.length} deleted`);
    } else if (command === 'put-body' && args[0]) {
        const { readDocRow } = require('../data/commulingo/docs-db');
        const row = await readDocRow(args[0]);
        if (!row) throw new Error(`no document "${args[0]}"; register a new one with import-commulingo-doc.js or the admin API`);
        const body = fs.readFileSync(0, 'utf8');
        if (!body.trim()) throw new Error('empty body on stdin');
        const result = await writeDocs({ upserts: [{ id: row.id, entry: row.entry, body: sanitizeDocHtml(body), expectedRevision: row.revision }] },
            { actor: option(args, '--actor', `commulingo-docs:${process.env.USER || 'cli'}`), note: option(args, '--note', 'put-body') });
        console.log(JSON.stringify(result.written));
    } else if (command === 'history' && args[0]) {
        for (const r of await listDocRevisions(args[0])) {
            console.log(`r${r.revision}  ${r.superseded_op} ${new Date(r.superseded_at).toISOString()} by ${r.superseded_by}`
                + `${r.note ? ` (${r.note})` : ''}; written ${new Date(r.updated_at).toISOString()} by ${r.updated_by}${r.has_body ? ', body changed' : ''}`);
        }
    } else if (command === 'restore' && args[0] && /^\d+$/.test(args[1] || '')) {
        const result = await restoreDocRevision(args[0], Number(args[1]), { actor: option(args, '--actor', `commulingo-docs:${process.env.USER || 'cli'}`) });
        console.log(JSON.stringify(result.written));
    } else {
        console.error('usage: commulingo-docs.js export [id ...] | put [--dry-run] [--delete-missing] | put-body <id> | history <id> | restore <id> <revision>');
        process.exit(2);
    }
}

main().then(() => process.exit(0), err => { console.error(err.message || err); process.exit(1); });
