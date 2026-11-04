#!/usr/bin/env node
// Every served reference document (and every published original) passes the
// save-time structure check with no error — the rule writeDocs enforces since
// 2026-11-04, checked here over the whole library (the DB snapshot on a
// server, the synthetic seed in a lone clone) so a document that slipped in
// around the check (restore, --allow-structure, a dictionary id deleted
// later) is reported by the deploy's tests. Warnings are listed, not failed.
//   node tests/unit/commulingo-docs-stored-structure.js
const assert = require('node:assert/strict');
const { listCommuLingoDocs, getCommuLingoDocContent, getCommuLingoDocOriginalContent } = require('../../data/commulingo/docs-store');
const { checkStructure, loadKnownRefs, storedEntry } = require('../../data/commulingo/docs-db');

(async () => {
    const docs = listCommuLingoDocs();
    if (!docs.length) {
        console.log('skip stored structure: no documents in this checkout');
        process.exit(0);
    }
    const known = await loadKnownRefs();
    const failures = [];
    let warnings = 0;
    for (const doc of docs) {
        const entry = storedEntry(doc);
        const reports = [checkStructure(doc.id, doc.id, { body: getCommuLingoDocContent(doc).html, entry, role: 'translation', known })];
        const original = getCommuLingoDocOriginalContent(doc);
        if (original) reports.push(checkStructure(doc.id, `${doc.id} (original)`, { body: original.html, entry, role: 'original', known }));
        for (const report of reports) {
            for (const issue of report.errors) failures.push(`${report.label}: [${issue.code}] ${issue.message}`);
            for (const issue of report.warnings) {
                warnings += 1;
                console.log(`warning ${report.label}: [${issue.code}] ${issue.message}`);
            }
        }
    }
    assert.deepEqual(failures, [], `stored documents with structural errors:\n  ${failures.join('\n  ')}`);
    console.log(`ok stored structure: ${docs.length} documents, 0 errors, ${warnings} warning(s)${known ? '' : ' (dictionaries unavailable: reference ids unchecked)'}`);
    process.exit(0);
})().catch(err => {
    console.error(err);
    process.exit(1);
});
