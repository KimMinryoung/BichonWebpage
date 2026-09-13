#!/usr/bin/env node
// Disposable database only. Fixture preserves all original event metadata.
const fs = require('fs'), path = require('path'), os = require('os');
const assert = require('assert/strict'), {spawnSync} = require('child_process');
assert(process.env.COMMULINGO_ISOLATED_TEST === '1' && process.env.DB_HOST === 'commulingo-content-test'
    && process.env.DB_NAME === 'commulingo_integrity_test', 'isolated database required');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const db = require(path.join(root, 'config/database'));
const specPath = process.env.CONTENT_SPEC;
const spec = JSON.parse(fs.readFileSync(specPath));
const fixture = JSON.parse(fs.readFileSync(process.env.CONTENT_BASELINE));
const cols = Object.keys(fixture[0]);
for (const c of cols) assert(/^[a-z_]+$/.test(c));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'event-depth-test-'));
const run = (file = specPath, apply = true) => spawnSync(process.execPath, [process.env.CONTENT_RUNNER, file, ...(apply ? ['--apply'] : [])], {env:process.env, encoding:'utf8'});
const rows = async () => (await db.query('SELECT * FROM commulingo_history_events ORDER BY id')).rows;
(async () => {
    assert.equal((await db.query("SELECT to_regclass('commulingo_history_events') AS t")).rows[0].t, null, 'fresh database required');
    await db.query(`CREATE TABLE commulingo_history_events (${cols.map(c => c + (c === 'id' ? ' text PRIMARY KEY' : c === 'updated_at' ? ' timestamptz' : c.startsWith('body_') || c.startsWith('outcome_') || c.startsWith('question_') ? ' text' : ' jsonb')).join(',')})`);
    for (const row of fixture) await db.query(`INSERT INTO commulingo_history_events (${cols.join(',')}) VALUES (${cols.map((c,i)=>'$'+(i+1)).join(',')})`, cols.map(c => c === 'id' || c === 'updated_at' || /^(body|question|outcome)_/.test(c) ? row[c] : JSON.stringify(row[c])));
    const before = await rows();
    let r = run(specPath, false); assert.equal(r.status, 0, r.stderr); assert.deepEqual(await rows(), before);
    console.log('OK: read-only preflight changes no row');
    await db.query('UPDATE commulingo_history_events SET question_ko=$1 WHERE id=$2', [spec.events[0].fields.question_ko, spec.events[0].id]);
    const partial = await rows();
    r = run(specPath, false); assert.equal(r.status, 0, r.stderr); assert.deepEqual(await rows(), partial);
    await db.query('UPDATE commulingo_history_events SET question_ko=$1 WHERE id=$2', [spec.events[0].expected.question_ko, spec.events[0].id]);
    assert.deepEqual(await rows(), before);
    console.log('OK: read-only preflight accepts fields already at their final value');
    // Force a failure at the last UPDATE, after earlier writes in the transaction.
    await db.query(`CREATE FUNCTION reject_last_event() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.id='${spec.events.at(-1).id}' THEN RAISE EXCEPTION 'deliberate late test failure'; END IF; RETURN NEW; END $$`);
    await db.query('CREATE TRIGGER reject_last BEFORE UPDATE ON commulingo_history_events FOR EACH ROW EXECUTE FUNCTION reject_last_event()');
    r = run(); assert.notEqual(r.status, 0); assert.match(r.stderr, /deliberate late test failure/); assert.deepEqual(await rows(), before);
    await db.query('DROP TRIGGER reject_last ON commulingo_history_events');
    console.log('OK: late database failure rolls back all event updates');
    const bad = JSON.parse(JSON.stringify(spec)); bad.events.at(-1).expected.body_ko += ' concurrent edit';
    const badPath = path.join(scratch, 'conflict.json'); fs.writeFileSync(badPath, JSON.stringify(bad));
    r = run(badPath); assert.notEqual(r.status, 0); assert.match(r.stderr, /concurrent change/); assert.deepEqual(await rows(), before);
    console.log('OK: baseline conflict refuses the whole batch');
    r = run(); assert.equal(r.status, 0, r.stderr);
    const after = await rows();
    for (const old of before) {
        const now = after.find(x => x.id === old.id), entry = spec.events.find(e => e.id === old.id);
        if (!entry) { assert.deepEqual(now, old); continue; }
        for (const c of cols) {
            if (c === 'updated_at') continue;
            assert.deepEqual(now[c], Object.hasOwn(entry.fields,c) ? entry.fields[c] : old[c], `${old.id}.${c}`);
        }
    }
    console.log('OK: all 16 bilingual updates correct; other rows and metadata preserved');
    r = run(); assert.equal(r.status, 0, r.stderr); assert.deepEqual(await rows(), after);
    console.log('OK: repeat application performs no writes, including timestamps');
})().catch(e => {console.error(e.stack); process.exitCode = 1;}).finally(async () => {fs.rmSync(scratch,{recursive:true,force:true}); await db.end();});
