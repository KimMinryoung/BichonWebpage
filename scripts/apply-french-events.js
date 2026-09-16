#!/usr/bin/env node
// Bilingual French history batch. Default: read-only preflight.
// APP_ROOT=/app DB_HOST=leninbot-pg node runner.js spec.json --production
// Add --apply --backup=/tmp/unique-before.json to publish. Never edits people.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const crypto = require('crypto');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const { FLAG_NAMES } = require(path.join(root, 'data/commulingo/flag-icons'));
const columns = ['title_ko', 'title_en', 'period_label', 'sort_order', 'question_ko', 'question_en',
    'summary_ko', 'summary_en', 'outcome_ko', 'outcome_en', 'body_ko', 'body_en',
    'timeline', 'sources', 'locations', 'countries', 'relations', 'no_auto_link', 'link_expressions'];
const jsonColumns = new Set(['timeline', 'sources', 'locations', 'countries', 'relations', 'no_auto_link', 'link_expressions']);
const personColumns = ['person_id', 'sort_order', 'relation_kind', 'relation_ko', 'relation_en', 'note_ko', 'note_en'];
const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => canonical(a) === canonical(b);
function validate(spec) {
    assert.equal(spec.id, 'french-events-20260913');
    assert.deepEqual(spec.events.map(e => e.id), ['french-revolution-1789-1799', 'french-revolutionary-wars-1792-1802']);
    for (const e of spec.events) {
        assert.equal(e.expected, null, 'this batch only creates new events');
        assert.deepEqual(Object.keys(e.fields).sort(), [...columns].sort());
        const f = e.fields;
        assert(Number.isInteger(f.sort_order));
        assert(f.countries.length && new Set(f.countries).size === f.countries.length);
        f.countries.forEach(code => assert(FLAG_NAMES[code], `unknown country: ${code}`));
        assert.equal(f.locations.filter(m => m.kind === 'main').length, 1);
        for (const m of f.locations) {
            assert(['main', 'place'].includes(m.kind) && m.label.ko && m.label.en);
            assert(Number.isFinite(m.lat) && Math.abs(m.lat) <= 85 && Number.isFinite(m.lng) && Math.abs(m.lng) <= 180);
        }
        assert.equal(e.sections.length, 10);
        assert(f.sources.length >= 10 && f.sources.every(u => /^https:\/\//.test(u)));
        assert.equal(new Set(f.sources).size, f.sources.length);
        assert.deepEqual(f.relations, { related: spec.events.filter(other => other.id !== e.id).map(other => other.id) });
        for (const lang of ['ko', 'en']) {
            for (const prefix of ['title', 'question', 'summary', 'outcome', 'body']) assert(f[`${prefix}_${lang}`].trim());
            assert(f[`body_${lang}`].length > 5000);
            const expected = e.sections.map(s => {
                assert(s.heading[lang] && s.paragraphs.length >= 2);
                return '## ' + s.heading[lang] + '\n\n' + s.paragraphs.map(p => {
                    assert(p[lang] && p.sources.length && p.sources.every(u => f.sources.includes(u)));
                    return p[lang] + ' ' + p.sources.map(u => `[${f.sources.indexOf(u) + 1}](${u})`).join(' ');
                }).join('\n\n');
            }).join('\n\n');
            assert.equal(f[`body_${lang}`], expected, `body/section mismatch: ${e.id}/${lang}`);
            assert(!/<(?:script|iframe)\b/i.test(expected));
        }
        assert(f.timeline.length >= 12);
        for (const p of f.timeline) {
            assert(/^\d{4}/.test(p.date) && p.title.ko && p.title.en && p.body.ko && p.body.en);
            assert(p.country.length && p.country.every(code => f.countries.includes(code)));
        }
        assert.equal(new Set(e.people.map(p => p.person_id)).size, e.people.length);
        for (const p of e.people) {
            assert.deepEqual(Object.keys(p).sort(), [...personColumns].sort());
            assert(['leader', 'participant', 'opponent'].includes(p.relation_kind));
            assert(p.relation_ko && p.relation_en && p.note_ko && p.note_en);
        }
    }
}
async function applyBatch(db, spec, { apply = false, backup } = {}) {
    validate(spec);
    const client = await db.connect();
    const report = [], before = { batch: spec.id, specSha256: crypto.createHash('sha256').update(canonical(spec)).digest('hex'), events: [], people: [] };
    try {
        await client.query(apply ? 'BEGIN' : 'BEGIN READ ONLY');
        await client.query("SET LOCAL lock_timeout='3s'");
        await client.query("SET LOCAL statement_timeout='30s'");
        if (apply) await client.query("SELECT pg_advisory_xact_lock(hashtext('french-events-20260913'))");
        for (const e of spec.events) {
            const old = (await client.query('SELECT * FROM commulingo_history_events WHERE id=$1' + (apply ? ' FOR UPDATE' : ''), [e.id])).rows[0];
            const duplicate = (await client.query('SELECT id FROM commulingo_history_events WHERE id<>$1 AND (lower(title_en)=lower($2) OR title_ko=$3)', [e.id, e.fields.title_en, e.fields.title_ko])).rows;
            assert.equal(duplicate.length, 0, `duplicate subject: ${e.id}`);
            if (old) for (const c of columns) assert(equal(old[c], e.fields[c]), `concurrent change: ${e.id}.${c}`);
            if (old) before.events.push(old);
            const links = (await client.query('SELECT * FROM commulingo_history_event_people WHERE event_id=$1 ORDER BY sort_order,person_id', [e.id])).rows;
            before.people.push(...links);
            for (const p of e.people) {
                assert.equal((await client.query('SELECT id FROM commulingo_people WHERE id=$1', [p.person_id])).rowCount, 1, `missing person: ${p.person_id}`);
                const existing = links.find(l => l.person_id === p.person_id);
                if (existing) for (const c of personColumns) assert(equal(existing[c], p[c]), `relationship conflict: ${e.id}/${p.person_id}.${c}`);
            }
            report.push({ id: e.id, status: old ? 'unchanged' : (apply ? 'created' : 'ready'), missingPeople: e.people.filter(p => !links.some(l => l.person_id === p.person_id)).map(p => p.person_id) });
        }
        if (apply && backup) fs.writeFileSync(backup, JSON.stringify(before, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
        if (apply) for (const e of spec.events) {
            const entry = report.find(r => r.id === e.id);
            if (entry.status !== 'unchanged') {
                await client.query(`INSERT INTO commulingo_history_events (id,${columns.join(',')}) VALUES ($1,${columns.map((c, i) => '$' + (i + 2) + (jsonColumns.has(c) ? '::jsonb' : '')).join(',')})`,
                    [e.id, ...columns.map(c => jsonColumns.has(c) ? JSON.stringify(e.fields[c]) : e.fields[c])]);
            }
            for (const p of e.people.filter(p => entry.missingPeople.includes(p.person_id))) {
                await client.query(`INSERT INTO commulingo_history_event_people (event_id,${personColumns.join(',')}) VALUES ($1,${personColumns.map((_, i) => '$' + (i + 2)).join(',')})`, [e.id, ...personColumns.map(c => p[c])]);
            }
        }
        await client.query(apply ? 'COMMIT' : 'ROLLBACK');
        return { committed: apply, events: report };
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
    const production = args.includes('--production');
    const isolated = process.env.COMMULINGO_ISOLATED_TEST === '1' && process.env.DB_HOST === 'commulingo-french-events-test' && process.env.DB_NAME === 'commulingo_integrity_test';
    assert((production && process.env.DB_HOST === 'leninbot-pg') || (!production && isolated), 'explicit production or isolated destination required');
    const apply = args.includes('--apply'), backup = args.find(a => a.startsWith('--backup='))?.slice(9);
    assert(!production || !apply || backup, 'production apply requires a unique backup path');
    const spec = JSON.parse(fs.readFileSync(files[0], 'utf8'));
    validate(spec);
    const db = require(path.join(root, 'config/database'));
    try { console.log(JSON.stringify(await applyBatch(db, spec, { apply, backup }), null, 2)); }
    finally { await db.end(); }
}
if (require.main === module) main().catch(error => { console.error(error.stack); process.exitCode = 1; });
module.exports = { applyBatch, validate, columns, personColumns };
