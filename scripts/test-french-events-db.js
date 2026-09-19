#!/usr/bin/env node
// Runs only against a disposable database; schema is exported read-only from production.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
assert(process.env.COMMULINGO_ISOLATED_TEST === '1' && process.env.DB_HOST === 'commulingo-french-events-test'
    && process.env.DB_NAME === 'commulingo_integrity_test', 'disposable database required');
const { applyBatch, validate } = require(process.env.CONTENT_RUNNER);
const spec = JSON.parse(fs.readFileSync(process.env.CONTENT_SPEC, 'utf8'));
const schema = JSON.parse(fs.readFileSync(process.env.CONTENT_SCHEMA, 'utf8').split('\n').find(line => line.startsWith('{')));
const db = require(path.join(root, 'config/database'));
async function state() {
    return {
        events: (await db.query('SELECT * FROM commulingo_history_events ORDER BY id')).rows,
        links: (await db.query('SELECT * FROM commulingo_history_event_people ORDER BY event_id,person_id')).rows,
        people: (await db.query('SELECT * FROM commulingo_people ORDER BY id')).rows,
    };
}
(async () => {
    validate(spec);
    assert.equal((await db.query("SELECT to_regclass('commulingo_history_events') AS t")).rows[0].t, null, 'fresh database required');
    for (const ddl of schema.functions) await db.query(ddl);
    await db.query('CREATE TABLE commulingo_people (id text PRIMARY KEY)');
    for (const table of ['commulingo_history_events', 'commulingo_history_event_people']) {
        const declarations = schema[table].map(c => {
            assert(/^[a-z_]+$/.test(c.column_name) && ['text', 'int4', 'jsonb', 'timestamptz'].includes(c.udt_name));
            return c.column_name + ' ' + c.udt_name + (c.column_default === null ? '' : ' DEFAULT ' + c.column_default) + (c.is_nullable === 'NO' ? ' NOT NULL' : '');
        });
        await db.query(`CREATE TABLE ${table} (${declarations.join(',')})`);
    }
    await db.query('ALTER TABLE commulingo_history_events ADD PRIMARY KEY(id), ADD CHECK(commulingo_valid_link_expressions(link_expressions))');
    await db.query('ALTER TABLE commulingo_history_event_people ADD PRIMARY KEY(event_id,person_id), ADD FOREIGN KEY(event_id) REFERENCES commulingo_history_events(id), ADD FOREIGN KEY(person_id) REFERENCES commulingo_people(id)');
    await db.query("CREATE TRIGGER event_headwords BEFORE INSERT OR UPDATE ON commulingo_history_events FOR EACH ROW EXECUTE FUNCTION commulingo_check_headwords('title_ko','title_en')");
    for (const id of new Set(spec.events.flatMap(e => e.people.map(p => p.person_id)))) await db.query('INSERT INTO commulingo_people VALUES ($1)', [id]);
    await db.query("INSERT INTO commulingo_history_events(id,title_ko,title_en,body_ko) VALUES ('unrelated','기존 사건','Existing event','preserve this')");
    const before = await state();
    await applyBatch(db, spec);
    assert.deepEqual(await state(), before);
    console.log('PASS: read-only preflight preserves all rows');
    await db.query(`CREATE FUNCTION reject_last_link() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.event_id='french-revolutionary-wars-1792-1802' AND NEW.person_id='louis-xvi' THEN RAISE EXCEPTION 'deliberate late failure'; END IF; RETURN NEW; END $$`);
    await db.query('CREATE TRIGGER fail_late BEFORE INSERT ON commulingo_history_event_people FOR EACH ROW EXECUTE FUNCTION reject_last_link()');
    await assert.rejects(applyBatch(db, spec, { apply: true }), /deliberate late failure/);
    assert.deepEqual(await state(), before);
    await db.query('DROP TRIGGER fail_late ON commulingo_history_event_people');
    console.log('PASS: late relationship failure rolls back both complete articles');
    await applyBatch(db, spec, { apply: true });
    const after = await state();
    for (const e of spec.events) {
        const actual = after.events.find(r => r.id === e.id);
        for (const [key, value] of Object.entries(e.fields)) assert.deepEqual(actual[key], value, e.id + '.' + key);
        for (const p of e.people) {
            const link = after.links.find(r => r.event_id === e.id && r.person_id === p.person_id);
            for (const [key, value] of Object.entries(p)) assert.deepEqual(link[key], value);
        }
    }
    assert.deepEqual(after.people, before.people);
    assert.deepEqual(after.events.find(e => e.id === 'unrelated'), before.events[0]);
    await applyBatch(db, spec, { apply: true });
    assert.deepEqual(await state(), after);
    console.log('PASS: all fields and links match; people and unrelated content preserved; rerun changes no timestamps');
    await db.query("UPDATE commulingo_history_events SET body_ko='concurrent editor' WHERE id=$1", [spec.events[1].id]);
    const conflict = await state();
    await assert.rejects(applyBatch(db, spec, { apply: true }), /concurrent change/);
    assert.deepEqual(await state(), conflict);
    await db.query('UPDATE commulingo_history_events SET body_ko=$2 WHERE id=$1', [spec.events[1].id, spec.events[1].fields.body_ko]);
    await db.query("UPDATE commulingo_history_event_people SET note_ko='concurrent role edit' WHERE event_id=$1 AND person_id=$2", [spec.events[0].id, spec.events[0].people[0].person_id]);
    const roleConflict = await state();
    await assert.rejects(applyBatch(db, spec, { apply: true }), /relationship conflict/);
    assert.deepEqual(await state(), roleConflict);
    console.log('PASS: concurrent article and relationship edits are preserved and rejected');
})().catch(error => { console.error(error.stack); process.exitCode = 1; }).finally(() => db.end());
