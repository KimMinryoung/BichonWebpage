#!/usr/bin/env node
// Rename CommuLingo person ids and keep the old URLs alive.
//
// Usage:
//   scripts/commulingo-person-rename <spec.json|-> [--dry-run] [--changed-by who]
//   (wrapper: runs this file inside leninbot-frontend; `-` reads the spec from stdin)
//
// Spec: { "renames": [ { "from": "lech-wa-sa", "to": "lech-walesa", "note": "..." }, ... ] }
//
// Every rename runs in one transaction (data/commulingo/person-rename.js): the
// person row moves and its dependants follow by ON UPDATE CASCADE, loose
// references move by hand, and commulingo_id_redirects gains from → to so
// /commulingo/people/<from> 301s within one people-store refresh (~60s). After
// the commit the host-mounted data files keyed by person id (politburo.json,
// docs/manifest.json, genealogy charts) are rewritten. --dry-run runs every check
// and UPDATE, rolls back, and only reports which data files would change.
const fs = require('fs');
const { db } = require('./lib/bootstrap');
const { renamePersonIds, renameInDataFiles, findLeftoverReferences } = require('../data/commulingo/person-rename');

(async () => {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const cbIndex = args.indexOf('--changed-by');
    const positional = args.filter((a, i) => !a.startsWith('--') && (cbIndex < 0 || i !== cbIndex + 1));
    if (!positional.length) {
        console.error('usage: commulingo-person-rename.js <spec.json|-> [--dry-run] [--changed-by who]');
        process.exit(2);
    }
    let exitCode = 0;
    try {
        const raw = positional[0] === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(positional[0], 'utf8');
        const { renames } = JSON.parse(raw);
        const changedBy = cbIndex >= 0 ? args[cbIndex + 1] : `commulingo-person-rename:${process.env.USER || 'cli'}`;
        const results = await renamePersonIds(renames, { changedBy, dryRun });
        for (const r of results) {
            const moved = Object.entries(r.moved).filter(([, n]) => n).map(([k, n]) => `${k}=${n}`).join(' ');
            console.log(`${dryRun ? 'would rename' : 'renamed'} ${r.from} → ${r.to}${moved ? ` (${moved})` : ''}`);
        }
        const files = renameInDataFiles(renames, { dryRun });
        for (const f of files.changed) console.log(`${dryRun ? 'would rewrite' : 'rewrote'} ${f}`);
        for (const f of files.manual) {
            console.error(`manual: ${f} holds a renamed id but its layout is not machine-serializable; edit it by hand`);
            exitCode = 1;
        }
        if (!dryRun) {
            for (const hit of findLeftoverReferences(renames)) console.error(`leftover: ${hit.file} still contains "${hit.id}"`);
        }
        console.log(dryRun
            ? `dry run: ${results.length} rename(s) validated, nothing written`
            : `committed ${results.length} rename(s); old ids redirect after the next people-store refresh (~60s)`);
    } catch (err) {
        console.error(`rejected: ${err.message}`);
        exitCode = 1;
    } finally {
        await db.end().catch(() => {});
        process.exit(exitCode);
    }
})();
