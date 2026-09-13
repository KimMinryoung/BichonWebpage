#!/usr/bin/env node
// Reviewed bilingual event enrichment. Defaults to read-only preflight.
// APP_ROOT=/app node runner.js spec.json --production [--apply]
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const columns = ['question_ko', 'question_en', 'outcome_ko', 'outcome_en', 'body_ko', 'body_en', 'timeline', 'sources'];
const jsonColumns = new Set(['timeline', 'sources']);
const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => canonical(a) === canonical(b);
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
let db;
(async () => {
    for (const arg of args.filter(a => a.startsWith('--'))) assert(['--production', '--apply'].includes(arg), `unknown option ${arg}`);
    const files = args.filter(a => !a.startsWith('--'));
    assert.equal(files.length, 1, 'one spec.json is required');
    // Check the destination before importing the pool (which opens a connection).
    const isolated = process.env.COMMULINGO_ISOLATED_TEST === '1'
        && process.env.DB_NAME === 'commulingo_integrity_test' && process.env.DB_HOST === 'commulingo-content-test';
    assert(isolated || (args.includes('--production') && process.env.DB_HOST === 'leninbot-pg'), 'explicit production destination or isolated test DB required');
    const spec = JSON.parse(fs.readFileSync(files[0], 'utf8'));
    assert.equal(spec.id, 'socialist-event-depth-20260908');
    assert.equal(spec.events.length, 16);
    assert.equal(new Set(spec.events.map(e => e.id)).size, 16);
    for (const e of spec.events) {
        assert(/^[a-z0-9-]+$/.test(e.id));
        assert(equal(Object.keys(e.fields).sort(), [...columns].sort()), `unexpected columns: ${e.id}`);
        assert(equal(Object.keys(e.expected).sort(), [...columns].sort()), `incomplete baseline: ${e.id}`);
        assert(e.sections.length >= 5 && e.sections.reduce((n, s) => n + s.paragraphs.length, 0) >= 7, `insufficient sections: ${e.id}`);
        for (const lang of ['ko', 'en']) {
            assert(e.fields['question_' + lang] && e.fields['outcome_' + lang]);
            assert(e.fields['body_' + lang].length > e.expected['body_' + lang].length * 3);
            assert.equal((e.fields['body_' + lang].match(/^## /gm) || []).length, e.sections.length);
            for (const section of e.sections) for (const paragraph of section.paragraphs) {
                assert(paragraph[lang] && e.fields['body_' + lang].includes(paragraph[lang]));
                assert(paragraph.sources.length && paragraph.sources.every(u => /^https:\/\//.test(u) && e.fields.sources.includes(u)));
            }
        }
        assert(e.fields.timeline.length >= 5);
        for (const point of e.fields.timeline) assert(point.date && point.title.ko && point.title.en && point.body.ko && point.body.en);
    }
    db = require(path.join(root, 'config/database'));
    const client = await db.connect();
    const report = [];
    try {
        await client.query(apply ? 'BEGIN' : 'BEGIN READ ONLY');
        await client.query("SET LOCAL lock_timeout='3s'");
        await client.query("SET LOCAL statement_timeout='30s'");
        if (apply) await client.query("SELECT pg_advisory_xact_lock(hashtext('socialist-event-depth-20260908'))");
        for (const e of spec.events) {
            const old = (await client.query('SELECT * FROM commulingo_history_events WHERE id=$1' + (apply ? ' FOR UPDATE' : ''), [e.id])).rows[0];
            assert(old, `missing event ${e.id}`);
            assert(e.fields.timeline.every(p => p.country.every(c => old.countries.includes(c))), `timeline country mismatch ${e.id}`);
            if (columns.every(c => equal(old[c], e.fields[c]))) {
                report.push({ id: e.id, status: 'unchanged' }); continue;
            }
            for (const c of columns) {
                if (equal(old[c], e.fields[c])) continue;
                assert(equal(old[c], e.expected[c]), `concurrent change: ${e.id}.${c}`);
            }
            report.push({ id: e.id, status: apply ? 'enriched' : 'ready' });
        }
        // Validate every baseline before the first UPDATE, in the same transaction.
        if (apply) for (const e of spec.events) {
            if (report.find(r => r.id === e.id).status === 'unchanged') continue;
            await client.query(`UPDATE commulingo_history_events SET ${columns.map((c, i) => c + '=$' + (i + 2) + (jsonColumns.has(c) ? '::jsonb' : '')).join(',')},updated_at=NOW() WHERE id=$1`,
                [e.id, ...columns.map(c => jsonColumns.has(c) ? JSON.stringify(e.fields[c]) : e.fields[c])]);
        }
        await client.query(apply ? 'COMMIT' : 'ROLLBACK');
        console.log(JSON.stringify({ committed: apply, events: report }, null, 2));
    } catch (e) { await client.query('ROLLBACK'); throw e; }
    finally { client.release(); }
})().catch(e => { console.error(e.stack); process.exitCode = 1; }).finally(async () => { if (db) await db.end(); });
