#!/usr/bin/env node
// Run in the app container with a reviewed JSON manifest on stdin. Default: preflight.
// The checks and the write live in data/commulingo/link-review-manifest.js (also
// the MCP tool link_reviews_apply); this keeps the preflight, backup and
// evidence files under /tmp.
const fs = require('fs');
const db = require('../config/database');
const { runLinkReviewManifest } = require('../data/commulingo/link-review-manifest');
const actor = 'owner-requested-link-review-20260908';
const manifest = JSON.parse(fs.readFileSync(0, 'utf8'));
const apply = process.argv.includes('--apply');
const stamp = Date.now();
const files = {
    preflight: '/tmp/commulingo-link-review-preflight.json',
    backup: '/tmp/commulingo-link-review-before-' + stamp + '.json',
    evidence: '/tmp/commulingo-link-review-previews-' + stamp + '.jsonl',
};
const hooks = {
    log: value => console.log(JSON.stringify(value)),
    onPreflight: samples => fs.writeFileSync(files.preflight, JSON.stringify(samples, null, 2)),
    onBackup: snapshot => {
        fs.writeFileSync(files.backup, JSON.stringify(snapshot, null, 2), { flag: 'wx', mode: 0o600 });
        console.log(JSON.stringify({ backup: files.backup }));
    },
    onEvidence: preview => fs.writeFileSync(files.evidence, JSON.stringify(preview)),
};
(async () => {
    const result = await runLinkReviewManifest(manifest, { apply, actor, hooks });
    delete result.samples;
    console.log(JSON.stringify({ ...result, preflightFile: files.preflight, ...(apply ? { backup: files.backup, evidence: files.evidence } : {}) }));
})().then(() => db.end()).catch(error => { console.error(error); process.exitCode = 1; return db.end(); });
