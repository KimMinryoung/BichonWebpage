#!/usr/bin/env node
// Targeted text fixes to existing history events. Default: read-only preflight.
// APP_ROOT=/app DB_HOST=leninbot-pg node runner.js spec.json --production
// Add --apply --backup=/tmp/unique-before.json to write.
//
// Spec: { "id": "<batch>", "changes": [
//   { "event": "<id>", "column": "body_ko", "from": "<exact substring>", "to": "<replacement>" },
//   { "event": "<id>", "column": "sources", "expected": <current value>, "value": <new value> } ] }
// A "from" must occur exactly once in the current column; an "expected" must
// equal the current value. Every change is checked before anything is written,
// and all changes commit in one transaction.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const TEXT = new Set(['title_ko', 'title_en', 'question_ko', 'question_en', 'summary_ko', 'summary_en', 'outcome_ko', 'outcome_en', 'body_ko', 'body_en']);
const JSONB = new Set(['timeline', 'sources', 'locations', 'countries', 'relations', 'no_auto_link', 'link_expressions', 'focus']);
const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);

function validate(spec) {
    assert(/^[a-z0-9-]+-\d{8}$/.test(spec.id), 'batch id like <topic>-YYYYMMDD');
    assert(Array.isArray(spec.changes) && spec.changes.length);
    for (const c of spec.changes) {
        assert(typeof c.event === 'string' && (TEXT.has(c.column) || JSONB.has(c.column)), `bad change target: ${c.event}.${c.column}`);
        const replace = 'from' in c, whole = 'expected' in c;
        assert(replace !== whole, 'use from/to or expected/value');
        if (replace) assert(TEXT.has(c.column) && typeof c.from === 'string' && c.from && typeof c.to === 'string' && c.from !== c.to);
        if (whole) assert('value' in c);
    }
}

async function applyFixes(db, spec, { apply = false, backup } = {}) {
    validate(spec);
    const client = await db.connect();
    try {
        await client.query(apply ? 'BEGIN' : 'BEGIN READ ONLY');
        await client.query("SET LOCAL lock_timeout='3s'");
        const rows = new Map();
        for (const id of new Set(spec.changes.map(c => c.event))) {
            const row = (await client.query('SELECT * FROM commulingo_history_events WHERE id=$1' + (apply ? ' FOR UPDATE' : ''), [id])).rows[0];
            assert(row, `missing event: ${id}`);
            rows.set(id, row);
        }
        const before = spec.changes.map(c => ({ event: c.event, column: c.column, value: rows.get(c.event)[c.column] }));
        const next = new Map([...rows].map(([id, row]) => [id, { ...row }]));
        const report = [];
        for (const c of spec.changes) {
            const row = next.get(c.event);
            if ('from' in c) {
                const current = row[c.column];
                const count = current.split(c.from).length - 1;
                if (count === 0 && current.includes(c.to)) { report.push({ event: c.event, column: c.column, status: 'unchanged' }); continue; }
                assert.equal(count, 1, `${c.event}.${c.column}: expected exactly one occurrence, found ${count}`);
                row[c.column] = current.replace(c.from, c.to);
            } else {
                if (canonical(row[c.column]) === canonical(c.value)) { report.push({ event: c.event, column: c.column, status: 'unchanged' }); continue; }
                assert.equal(canonical(row[c.column]), canonical(c.expected), `${c.event}.${c.column}: current value differs from expected`);
                row[c.column] = c.value;
            }
            report.push({ event: c.event, column: c.column, status: apply ? 'updated' : 'ready' });
        }
        if (apply && backup) fs.writeFileSync(backup, JSON.stringify({ batch: spec.id, before }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
        if (apply) for (const [id, row] of next) {
            const columns = [...new Set(spec.changes.filter(c => c.event === id).map(c => c.column))];
            await client.query(`UPDATE commulingo_history_events SET ${columns.map((c, i) => `${c}=$${i + 2}${JSONB.has(c) ? '::jsonb' : ''}`).join(', ')}, updated_at=NOW() WHERE id=$1`,
                [id, ...columns.map(c => JSONB.has(c) ? JSON.stringify(row[c]) : row[c])]);
        }
        await client.query(apply ? 'COMMIT' : 'ROLLBACK');
        return { committed: apply, changes: report };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally { client.release(); }
}

async function main() {
    const args = process.argv.slice(2);
    assert(args.every(a => !a.startsWith('--') || ['--production', '--apply'].includes(a) || a.startsWith('--backup=')), 'unknown argument');
    const files = args.filter(a => !a.startsWith('--'));
    assert.equal(files.length, 1, 'one spec.json required');
    assert(args.includes('--production') && process.env.DB_HOST === 'leninbot-pg', 'explicit production destination required');
    const apply = args.includes('--apply'), backup = args.find(a => a.startsWith('--backup='))?.slice(9);
    assert(!apply || backup, 'apply requires a unique backup path');
    const spec = JSON.parse(fs.readFileSync(files[0], 'utf8'));
    const db = require(path.join(root, 'config/database'));
    try { console.log(JSON.stringify(await applyFixes(db, spec, { apply, backup }), null, 2)); }
    finally { await db.end(); }
}
if (require.main === module) main().catch(error => { console.error(error.stack); process.exitCode = 1; });
module.exports = { applyFixes, validate };
