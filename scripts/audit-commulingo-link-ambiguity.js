#!/usr/bin/env node
// Read-only audit; suitable for a scheduled job. --json emits the full queue.
if (process.argv.includes('--json')) { console.info = () => {}; console.debug = () => {}; }
const { db } = require('./lib/bootstrap');
const { loadState } = require('../data/commulingo/link-review-service');
loadState().then(state => {
    const findings = state.rows.filter(row => row.needsReview);
    if (process.argv.includes('--json')) console.log(JSON.stringify(findings, null, 2));
    else {
        console.log(`expressions=${state.rows.length} pending=${state.rows.filter(row => !row.reviewed).length} reviewCandidates=${findings.length}`);
        findings.forEach(row => console.log(`${row.kind}:${row.id} | ${row.lang} | ${row.text} | ${row.policy} | ${!row.reviewed ? '미검토 ' : ''}${row.risks.join(' ')} ${row.collisions.length ? '다른 항목과 중복 ' + row.collisions.length : ''}`));
    }
}).then(() => db.end()).catch(error => { console.error(error); process.exitCode = 1; return db.end(); });
