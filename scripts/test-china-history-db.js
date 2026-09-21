#!/usr/bin/env node
// Runs the china-history batch against a disposable copy of the dictionary
// (schema + dictionary data from production, no user data) and checks that
//   1. the read-only preflight changes nothing,
//   2. a late failure rolls back every person, section, event and term,
//   3. apply creates everything and a second apply reports it all unchanged,
//   4. a concurrent edit of an existing row is refused and preserved.
// Refuses to run anywhere but the isolated content-test database.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
assert(process.env.COMMULINGO_ISOLATED_TEST === '1' && process.env.DB_HOST === 'commulingo-content-test'
    && process.env.DB_NAME === 'commulingo_integrity_test', 'isolated content-test database required');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const runner = path.join(root, 'scripts/apply-china-history.js');
const specPath = process.env.CONTENT_SPEC || path.join(root, 'scripts/content/china-history-20260921.json');
const db = require(path.join(root, 'config/database'));
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'china-history-test-'));
const run = (file, ...flags) => spawnSync(process.execPath, [runner, file, ...flags], { encoding: 'utf8', env: process.env });
const report = result => JSON.parse(result.stdout.slice(result.stdout.indexOf('{')));

async function inventory() {
    const q = async sql => (await db.query(sql)).rows;
    return {
        people: await q('SELECT id, updated_at FROM commulingo_people ORDER BY id'),
        sections: await q('SELECT person_id, slug FROM commulingo_person_sections ORDER BY person_id, slug'),
        events: await q('SELECT id, updated_at FROM commulingo_history_events ORDER BY id'),
        links: await q('SELECT event_id, person_id FROM commulingo_history_event_people ORDER BY 1, 2'),
        terms: await q('SELECT id, updated_at FROM commulingo_terms ORDER BY id'),
    };
}

(async () => {
    const newPeople = spec.people.map(p => p.id), newEvents = spec.events.map(e => e.id), newTerms = spec.terms.map(t => t.id);
    for (const [table, ids] of [['commulingo_people', newPeople], ['commulingo_history_events', newEvents], ['commulingo_terms', newTerms]]) {
        const { rows } = await db.query(`SELECT id FROM ${table} WHERE id = ANY($1)`, [ids]);
        assert.equal(rows.length, 0, `${table}: batch ids already present — use a fresh copy`);
    }
    const before = await inventory();

    const preflight = run(specPath);
    assert.equal(preflight.status, 0, preflight.stderr);
    assert.deepEqual(await inventory(), before);
    console.log('OK: read-only preflight changes nothing');

    const bad = JSON.parse(JSON.stringify(spec));
    bad.terms.at(-1).fields.people.push('nonexistent-validation-person');
    const badPath = path.join(scratch, 'bad.json');
    fs.writeFileSync(badPath, JSON.stringify(bad));
    const failed = run(badPath, '--apply');
    assert.notEqual(failed.status, 0, 'a missing person must fail the batch');
    assert.match(failed.stderr, /does not exist/);
    assert.deepEqual(await inventory(), before);
    console.log('OK: a late failure rolls back people, sections, events, links and terms');

    const first = run(specPath, '--apply');
    assert.equal(first.status, 0, first.stderr);
    const created = report(first);
    assert(created.committed);
    assert(created.people.every(p => p.status === 'created') && created.people.length === spec.people.length);
    assert(created.events.every(e => e.status === 'created') && created.events.length === spec.events.length);
    assert(created.terms.every(t => t.status === 'created') && created.terms.length === spec.terms.length);
    assert.equal(created.relationsAdded, spec.events.reduce((n, e) => n + e.people.length, 0));
    const after = await inventory();
    assert.equal(after.people.length, before.people.length + spec.people.length);
    assert.equal(after.events.length, before.events.length + spec.events.length);
    assert.equal(after.terms.length, before.terms.length + spec.terms.length);
    for (const key of ['people', 'events', 'terms']) {
        const byId = new Map(after[key].map(r => [r.id, r]));
        for (const row of before[key]) assert.deepEqual(byId.get(row.id), row, `${key}/${row.id} changed`);
    }
    const groups = (await db.query('SELECT group_id, count(*)::int AS n FROM commulingo_people WHERE id = ANY($1) GROUP BY 1', [newPeople])).rows;
    assert(groups.some(g => g.group_id === 'china-revolution'), 'new people sit on the China shelf');
    const roles = (await db.query('SELECT count(*)::int AS n FROM commulingo_person_roles WHERE person_id = ANY($1)', [newPeople])).rows[0].n;
    assert.equal(roles, spec.people.length, 'every new person has a role row');
    const evidence = (await db.query('SELECT count(*)::int AS n FROM commulingo_person_evidence WHERE person_id = ANY($1)', [newPeople])).rows[0].n;
    assert(evidence >= spec.people.length * 4, 'claim evidence recorded for every new person');
    const termLinks = (await db.query('SELECT count(*)::int AS n FROM commulingo_term_people WHERE term_id = ANY($1)', [newTerms])).rows[0].n;
    assert(termLinks > 0, 'term-person links written');
    console.log(`OK: apply created ${spec.people.length} people, ${spec.events.length} events, ${spec.terms.length} terms, ${created.relationsAdded} relations`);

    const second = run(specPath, '--apply');
    assert.equal(second.status, 0, second.stderr);
    const again = report(second);
    for (const key of ['people', 'sections', 'events', 'terms']) assert(again[key].every(r => r.status === 'unchanged'), `${key} not idempotent`);
    assert.equal(again.relationsAdded, 0);
    assert.deepEqual(await inventory(), after);
    console.log('OK: a second apply changes nothing');

    await db.query("UPDATE commulingo_history_events SET title_ko = title_ko || ' (수정)' WHERE id=$1", [newEvents[0]]);
    const conflict = run(specPath, '--apply');
    assert.notEqual(conflict.status, 0);
    assert.match(conflict.stderr, /existing event differs/);
    const edited = (await db.query('SELECT title_ko FROM commulingo_history_events WHERE id=$1', [newEvents[0]])).rows[0];
    assert(edited.title_ko.endsWith(' (수정)'), 'concurrent edit preserved');
    console.log('OK: a changed existing row is refused and preserved');

    const sample = (await db.query('SELECT body_ko FROM commulingo_history_events WHERE id=$1', [newEvents[0]])).rows[0];
    assert(sample.body_ko.startsWith('## '), 'event body is sectioned markdown');
    console.log('PASS');
})().catch(error => { console.error(error.stack); process.exitCode = 1; }).finally(() => db.end());
