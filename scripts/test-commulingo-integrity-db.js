// Destructive test: ONLY an isolated CommuLingo database copy, never production.
// DB_HOST/DB_USER/DB_NAME must be provided explicitly; no .env bootstrap.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
if (process.env.COMMULINGO_ISOLATED_TEST !== '1' || process.env.DB_NAME !== 'commulingo_integrity_test') {
    throw new Error('Requires COMMULINGO_ISOLATED_TEST=1 and DB_NAME=commulingo_integrity_test');
}
const db = require('../config/database');
const admin = require('../data/commulingo/people-admin-store');
const sections = require('../data/commulingo/people-sections-store');
const people = require('../data/commulingo/people-store');
const terms = require('../data/commulingo/terms-store');
const events = require('../data/commulingo/history-events-store');
const graphSQL = `SELECT LEAST(term_id, related_id) a, GREATEST(term_id, related_id) b,
    MIN(sort_order) AS sort_order FROM commulingo_term_relations GROUP BY 1, 2 ORDER BY 1, 2`;
async function migration() {
    const before = (await db.query(graphSQL)).rows;
    const count = (await db.query('SELECT count(*)::int n FROM commulingo_term_relations')).rows[0].n;
    await db.query(fs.readFileSync(path.join(__dirname, 'migrations/175_commulingo_integrity.sql'), 'utf8'));
    assert.deepEqual((await db.query(graphSQL)).rows, before);
    assert.equal((await db.query('SELECT count(*)::int n FROM commulingo_term_relations')).rows[0].n, before.length);
    const edge = (await db.query('SELECT * FROM commulingo_term_relations LIMIT 1')).rows[0];
    await assert.rejects(db.query('INSERT INTO commulingo_term_relations(term_id, related_id) VALUES ($1,$2)', [edge.related_id, edge.term_id]), { code: '23505' });
    await assert.rejects(db.query("UPDATE commulingo_terms SET category='missing-test-category' WHERE id=$1", [edge.term_id]), { code: '23503' });
    const c = await db.connect();
    try {
        await c.query('BEGIN');
        const category = (await c.query('SELECT category FROM commulingo_terms WHERE id=$1', [edge.term_id])).rows[0].category;
        await c.query("UPDATE commulingo_term_categories SET id='test-renamed-category' WHERE id=$1", [category]);
        assert.equal((await c.query('SELECT category FROM commulingo_terms WHERE id=$1', [edge.term_id])).rows[0].category, 'test-renamed-category');
        await assert.rejects(c.query("DELETE FROM commulingo_term_categories WHERE id='test-renamed-category'"), { code: '23503' });
    } finally { await c.query('ROLLBACK'); c.release(); }
    console.log(`migration: ${count - before.length} duplicates removed, ${before.length} edges and minimum sort orders preserved; constraints passed`);
}
async function waitBlocked(pid) {
    for (let i = 0; i < 100; i++) {
        const r = await db.query("SELECT wait_event_type FROM pg_stat_activity WHERE pid=$1", [pid]);
        if (r.rows[0]?.wait_event_type === 'Lock') return;
        await new Promise(resolve => setTimeout(resolve, 20));
    }
    throw new Error('second edit did not wait for person lock');
}
async function edits() {
    const a = await db.connect(), b = await db.connect();
    try {
        await a.query('BEGIN'); await b.query('BEGIN');
        await admin.updatePersonAdmin('lenin', { givenName: { ko: '블라디미르', en: 'Vladimir Test' } }, { client: a });
        const second = admin.updatePersonAdmin('lenin', { familyName: { ko: '레닌', en: 'Lenin Test' } }, { client: b });
        await waitBlocked(b.processID);
        await a.query('COMMIT');
        const result = await second;
        assert.equal(result.givenName.en, 'Vladimir Test');
        assert.equal(result.familyName.en, 'Lenin Test');
        await b.query('COMMIT');
        const revision = (await db.query("SELECT snapshot FROM commulingo_people_revisions WHERE entity_id='lenin' ORDER BY id DESC LIMIT 1")).rows[0].snapshot;
        assert.equal(revision.before.givenName.en, 'Vladimir Test');
        for (const [index, operation] of [
            () => sections.upsertPersonSectionAdmin('lenin', 'integrity-test', { heading: { ko: '검증' }, body: { ko: '검증 본문' } }, { client: b }),
            () => sections.deletePersonSectionAdmin('lenin', 'integrity-test', { client: b }),
            () => admin.deletePersonAdmin('lenin', { client: b }),
        ].entries()) {
            await a.query('BEGIN'); await b.query('BEGIN');
            await a.query("SELECT id FROM commulingo_people WHERE id='lenin' FOR UPDATE");
            const pending = operation();
            await waitBlocked(b.processID);
            await a.query('COMMIT'); await pending;
            // Keep the section for the subsequent deletion check; roll back deletion of the person.
            await b.query(index === 2 ? 'ROLLBACK' : 'COMMIT');
        }
    } finally { await a.query('ROLLBACK'); await b.query('ROLLBACK'); a.release(); b.release(); }
    console.log('concurrent person merge, revision before-state, section and delete locks passed');
}
async function snapshots() {
    // Commit an edit between the first and subsequent SELECTs of each real store.
    for (const [load, mutate] of [
        [() => people.loadCommuLingoPeople({ fresh: true }), c => admin.updatePersonAdmin('stalin', { bio: { ko: '검증 본문', en: 'test biography' } }, { client: c })],
        [() => terms.loadCommuLingoTerms({ fresh: true }), c => c.query("UPDATE commulingo_terms SET definition_en='snapshot test' WHERE id='nep'")],
        [() => events.loadCommuLingoHistoryEvents({ fresh: true }), c => c.query("UPDATE commulingo_history_events SET summary_en='snapshot test' WHERE id=(SELECT id FROM commulingo_history_events WHERE summary_ko<>'' LIMIT 1)")],
    ]) {
        const baseline = await load();
        const original = db.connect.bind(db);
        let intercepted = false, committed = false;
        db.connect = function(callback) {
            if (callback) return original(callback);
            return interceptConnection();
        };
        async function interceptConnection() {
            const client = await original();
            if (intercepted) return client;
            intercepted = true;
            let chain = Promise.resolve();
            return {
                release: () => client.release(),
                query: (...args) => {
                    const next = chain.then(async () => {
                        const result = await client.query(...args);
                        if (!committed && /^\s*SELECT/.test(args[0])) {
                            committed = true;
                            const writer = await original();
                            try { await writer.query('BEGIN'); await mutate(writer); await writer.query('COMMIT'); }
                            finally { writer.release(); }
                        }
                        return result;
                    });
                    chain = next.catch(() => {});
                    return next;
                },
            };
        }
        try {
            const during = await load();
            assert.ok(committed);
            assert.deepEqual(during, baseline, 'snapshot must remain at its first SELECT');
        } finally { db.connect = original; }
        assert.notDeepEqual(await load(), baseline, 'next snapshot sees committed edit');
    }
    console.log('all three dictionary snapshots remain consistent across concurrent commits');
}
async function answers() {
    const express = require('express');
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => { req.session = { user: { id: 999999 } }; next(); });
    app.use(require('../routes/commulingo-progress'));
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const post = answers => fetch(base + '/progress/answers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }) });
    const item = { lessonId: 'integrity-test', questionId: 'q1', right: 2, lastAt: '2026-09-07T00:00:00Z' };
    try {
        await db.query("ALTER TABLE commulingo_question_progress ADD CONSTRAINT test_failure CHECK (lesson_id <> 'integrity-fail')");
        assert.equal((await post([item, { ...item, lessonId: 'integrity-fail' }])).status, 500);
        assert.equal((await db.query('SELECT count(*)::int n FROM commulingo_question_progress WHERE user_id=999999')).rows[0].n, 0);
        assert.deepEqual(await (await post([item])).json(), { saved: 1 });
        await post([{ ...item, right: 0, lastAt: '2025-01-01' }]);
        const data = await (await fetch(base + '/progress')).json();
        assert.equal(data.answers['integrity-test/q1'].right, 2);
        assert.equal((await post([])).status, 400);
        console.log('answer batch failure rolls back all rows; older records cannot overwrite; response shape passed');
    } finally {
        await db.query('ALTER TABLE commulingo_question_progress DROP CONSTRAINT test_failure');
        await new Promise(resolve => server.close(resolve));
    }
}
(async () => { await migration(); await snapshots(); await edits(); await answers(); })()
    .catch(err => { console.error(err); process.exitCode = 1; }).finally(() => db.end());
