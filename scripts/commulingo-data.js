#!/usr/bin/env node
// Container side of scripts/commulingo-data: the CommuLingo data documents
// (commulingo_data_documents — activity catalog, rosters, event-control,
// genealogy charts) as a JSON bundle on stdin/stdout.
//
//   export [key-or-prefix ...]       bundle of every (or the matching) document
//   put [--dry-run] [--actor who] [--note text]   bundle on stdin
//   history <key>                    superseded revisions, newest first
//   restore <key> <revision> [--actor who]
//
// Bundle: { documents: [{ key, revision?, content }] }. put writes only
// documents whose content differs, each guarded by the revision it was
// exported at when the bundle carries one (a document changed since then is
// refused). Every document is validated (data-documents.js) before anything
// is written.
console.log = console.info = console.error; // stdout carries the bundle
require('./lib/bootstrap');
const fs = require('fs');
const {
    readDataDocumentRows, writeDataDocuments, validateDataDocument, listDataDocumentRevisions, restoreDataDocumentRevision,
} = require('../data/commulingo/data-documents');

function option(args, name, fallback) {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : fallback;
}

async function exportDocuments(selectors) {
    const rows = await readDataDocumentRows();
    const picked = selectors.length
        ? rows.filter(row => selectors.some(sel => row.key === sel || row.key.startsWith(sel.endsWith('/') ? sel : `${sel}/`)))
        : rows;
    if (selectors.length && !picked.length) throw new Error(`nothing matches ${selectors.join(', ')}`);
    return { documents: picked.map(row => ({ key: row.key, revision: row.revision, content: JSON.parse(row.content_text) })) };
}

async function put(bundle, args) {
    const rows = new Map((await readDataDocumentRows()).map(row => [row.key, row]));
    const problems = [];
    const upserts = [];
    for (const doc of bundle.documents || []) {
        try {
            validateDataDocument(doc.key, doc.content);
        } catch (err) {
            problems.push(err.message);
            continue;
        }
        const row = rows.get(doc.key);
        if (row && Number.isInteger(doc.revision) && doc.revision !== row.revision) {
            problems.push(`${doc.key}: changed in the database since export (exported r${doc.revision}, now r${row.revision}); re-export it`);
            continue;
        }
        upserts.push({ key: doc.key, content: doc.content, expectedRevision: row ? row.revision : 0 });
    }
    if (problems.length) throw new Error(`refused, nothing written:\n  ${problems.join('\n  ')}`);
    const actor = option(args, '--actor', `commulingo-data:${process.env.USER || 'cli'}`);
    const note = option(args, '--note', 'scripts/commulingo-data put');
    if (args.includes('--dry-run')) {
        const db = require('../config/database');
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            return { dryRun: true, ...(await writeDataDocuments({ upserts }, { actor, note, client })) };
        } finally {
            await client.query('ROLLBACK').catch(() => {});
            client.release();
        }
    }
    return writeDataDocuments({ upserts }, { actor, note });
}

async function main() {
    const [command, ...args] = process.argv.slice(2);
    if (command === 'export') {
        const json = JSON.stringify(await exportDocuments(args.filter(a => !a.startsWith('--'))));
        await new Promise(resolve => process.stdout.write(json, resolve));
    } else if (command === 'put') {
        const result = await put(JSON.parse(fs.readFileSync(0, 'utf8')), args);
        const changed = result.written.filter(w => w.op !== 'unchanged');
        for (const w of changed) console.log(`${result.dryRun ? 'would ' : ''}${w.op} ${w.key} → r${w.revision}`);
        console.log(`${result.dryRun ? 'dry run: ' : ''}${changed.length} written, ${result.written.length - changed.length} unchanged`);
    } else if (command === 'history' && args[0]) {
        for (const r of await listDataDocumentRevisions(args[0])) {
            console.log(`r${r.revision}  ${r.superseded_op} ${new Date(r.superseded_at).toISOString()} by ${r.superseded_by}`
                + `${r.note ? ` (${r.note})` : ''}; written ${new Date(r.updated_at).toISOString()} by ${r.updated_by}`);
        }
    } else if (command === 'restore' && args[0] && /^\d+$/.test(args[1] || '')) {
        const result = await restoreDataDocumentRevision(args[0], Number(args[1]),
            { actor: option(args, '--actor', `commulingo-data:${process.env.USER || 'cli'}`) });
        console.log(JSON.stringify(result.written));
    } else {
        console.error('usage: commulingo-data.js export [key-or-prefix ...] | put [--dry-run] | history <key> | restore <key> <revision>');
        process.exit(2);
    }
}

main().then(() => process.exit(0), err => { console.error(err.message || err); process.exit(1); });
