#!/usr/bin/env node
const { db } = require('./lib/bootstrap');
const days = Number(process.argv[2] || 7);
if (!Number.isInteger(days) || days < 1 || days > 30) {
    console.error('Usage: node scripts/commulingo-learning-report.js [1..30 days]');
    process.exit(2);
}
(async () => {
    const { rows } = await db.query(`SELECT kind, content_id, lang, mode,
        count(*) FILTER (WHERE event = 'started')::int AS starts,
        count(DISTINCT run_id) FILTER (WHERE event = 'answered')::int AS answering_runs,
        count(*) FILTER (WHERE event = 'answered')::int AS answers,
        count(*) FILTER (WHERE event = 'answered' AND correct)::int AS correct_answers,
        count(DISTINCT run_id) FILTER (WHERE event = 'completed')::int AS completed_runs,
        max(received_at) AS latest_activity
        FROM commulingo_learning_events WHERE received_at >= now() - $1::int * interval '1 day'
        GROUP BY kind, content_id, lang, mode ORDER BY answering_runs DESC, starts DESC`, [days]);
    console.log(JSON.stringify({ generatedAt: new Date().toISOString(), days,
        note: 'Observed activity, not unique people. Known test/automation excluded; unmarked tests can remain. Graph/card reading and mixed-lesson review are not measured.', rows }, null, 2));
})().catch(err => { console.error(err.message); process.exitCode = 1; }).finally(() => db.end());
