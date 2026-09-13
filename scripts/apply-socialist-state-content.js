#!/usr/bin/env node
// Explicit content batch; never writes person tables directly. See the batch report.
// APP_ROOT=/app node /tmp/apply-socialist-state-content.js spec.json [--apply]
// Validation defaults to an isolated DB. Production writes require --production.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const { db } = require(path.join(root, 'scripts/lib/bootstrap'));
const { submitPersonEdit } = require(path.join(root, 'data/commulingo/person-editorial-service'));
const { getPersonAdmin } = require(path.join(root, 'data/commulingo/people-admin-store'));
const { listPersonSectionsAdmin } = require(path.join(root, 'data/commulingo/people-sections-store'));
const { FLAG_NAMES } = require(path.join(root, 'data/commulingo/flag-icons'));
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const production = args.includes('--production');
const specPath = args.find(a => !a.startsWith('--'));
const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => canonical(a) === canonical(b);
const report = { people: [], sections: [], terms: [], events: [], relationsAdded: 0 };
async function row(client, table, id) {
    return (await client.query(`SELECT * FROM ${table} WHERE id=$1 FOR UPDATE`, [id])).rows[0];
}
async function writeEntity(client, table, entry, fields, kind) {
    const before = await row(client, table, entry.id);
    const desired = Object.fromEntries(fields.map(f => [f, entry[f]]));
    // Existing glossary entries retain their titles, definitions, classifications and all relations.
    if (entry.expected) {
        assert(before, `missing original ${entry.id}`);
        const desiredSources = [...new Set([...(entry.expected.sources || []), ...entry.sources])];
        if (before.body_ko === entry.body_ko && before.body_en === entry.body_en && desiredSources.every(s => before.sources.includes(s))) {
            report[kind].push({ id: entry.id, status: 'unchanged' }); return;
        }
        for (const f of ['body_ko', 'body_en', 'sources']) assert(equal(before[f], entry.expected[f]), `concurrent change: ${entry.id}.${f}`);
        await client.query(`UPDATE ${table} SET body_ko=$2,body_en=$3,sources=$4::jsonb,updated_at=NOW() WHERE id=$1`,
            [entry.id, entry.body_ko, entry.body_en, JSON.stringify(desiredSources)]);
        report[kind].push({ id: entry.id, status: 'enriched' }); return;
    }
    if (before) {
        for (const [f, v] of Object.entries(desired)) assert(equal(before[f], v), `existing content differs: ${entry.id}.${f}`);
        report[kind].push({ id: entry.id, status: 'unchanged' }); return;
    }
    const json = new Set(['sources', 'countries', 'timeline', 'locations']);
    const columns = ['id', ...fields];
    await client.query(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${columns.map((f, i) => '$' + (i + 1) + (json.has(f) ? '::jsonb' : '')).join(',')})`,
        columns.map(f => json.has(f) ? JSON.stringify(entry[f]) : entry[f]));
    report[kind].push({ id: entry.id, status: 'created' });
}
async function pair(client, table, left, right, a, b) {
    const r = await client.query(`INSERT INTO ${table} (${left},${right}) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [a, b]);
    report.relationsAdded += r.rowCount;
}
(async () => {
    assert(specPath, 'spec.json is required');
    const isolated = process.env.COMMULINGO_ISOLATED_TEST === '1' && process.env.DB_NAME === 'commulingo_integrity_test'
        && process.env.DB_HOST === 'commulingo-content-test';
    assert(isolated || (apply && production && process.env.DB_HOST === 'leninbot-pg'), 'use the isolated test DB, or explicit --apply --production');
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    assert(spec.id === 'socialist-states-20260908', 'unexpected content batch');
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query("SET LOCAL lock_timeout='3s'");
        await client.query("SET LOCAL statement_timeout='30s'");
        await client.query("SELECT pg_advisory_xact_lock(hashtext('socialist-states-20260908'))");
        for (const entry of spec.people) {
            const { sections, ...fields } = entry;
            const before = await getPersonAdmin(entry.id, { client });
            if (before) {
                assert.equal(before.citizenship.code, fields.citizenship.code, 'person citizenship conflict: '+entry.id);
                assert.equal(before.nationalOrigin.code, fields.nationalOrigin.code, 'person national origin conflict: '+entry.id);
                if (fields.nationalOrigin.label) assert(equal(before.nationalOrigin.label, fields.nationalOrigin.label), 'person national origin label conflict: '+entry.id);
                assert.equal(before.role?.category, fields.role.category, 'person role conflict: '+entry.id);
                for (const f of ['groupId','nativeName','givenName','familyName','epithet','bio']) {
                    assert(equal(before[f], fields[f]), `person identity/content conflict: ${entry.id}.${f}`);
                }
                assert.equal(before.years, fields.years || '', `person identity/content conflict: ${entry.id}.years`);
                report.people.push({ id: entry.id, status: 'unchanged' });
            } else {
                const result = await submitPersonEdit({ target: 'person', action: 'create', id: entry.id, fields, sources: fields.sources }, { client, changedBy: spec.id });
                assert(result.status === 'approved', `review required: ${entry.id}: ${result.reasons}`);
                report.people.push({ id: entry.id, status: result.status });
            }
            for (const section of sections) {
                const old = (await listPersonSectionsAdmin(entry.id, { client })).find(s => s.slug === section.slug);
                if (old) {
                    for (const f of ['heading','body','sources','sortOrder']) assert(equal(old[f], section[f]), `section conflict: ${entry.id}/${section.slug}.${f}`);
                    report.sections.push({ id: entry.id, status: 'unchanged' }); continue;
                }
                const current = await getPersonAdmin(entry.id, { client });
                const result = await submitPersonEdit({ target: 'person_section', action: 'create', id: entry.id,
                    fields: { ...section, expectedRevision: current.revision }, sources: section.sources }, { client, changedBy: spec.id });
                assert(result.status === 'approved', `section review required: ${entry.id}: ${result.reasons}`);
                report.sections.push({ id: entry.id, status: result.status });
            }
        }
        for (const entry of spec.events) {
            assert(entry.countries.length && new Set(entry.countries).size === entry.countries.length, 'invalid countries');
            assert(entry.locations?.length && entry.locations.filter(m => m.kind === 'main').length === 1, 'one main location required');
            for (const m of entry.locations) assert(Number.isFinite(m.lat) && Number.isFinite(m.lng) && Math.abs(m.lat) <= 85 && Math.abs(m.lng) <= 180 && m.label?.ko && m.label?.en, 'invalid location');
            for (const code of entry.countries) assert(FLAG_NAMES[code], `unknown country ${code}`);
            for (const point of entry.timeline) for (const code of point.country || []) assert(entry.countries.includes(code), 'timeline country mismatch');
            await writeEntity(client, 'commulingo_history_events', entry,
                ['title_ko','title_en','period_label','sort_order','summary_ko','summary_en','body_ko','body_en','countries','timeline','sources','locations'], 'events');
        }
        for (const entry of spec.terms) {
            await writeEntity(client, 'commulingo_terms', entry,
                ['term_ko','term_en','start_year','period_label','category','definition_ko','definition_en','body_ko','body_en','sources'], 'terms');
            for (const id of entry.people) await pair(client, 'commulingo_term_people', 'term_id', 'person_id', entry.id, id);
            if (entry.event) await pair(client, 'commulingo_term_events', 'term_id', 'event_id', entry.id, entry.event);
        }
        for (const entry of spec.events) for (const id of entry.people) {
            const roles = spec.eventRoles?.[entry.id]?.[id];
            assert(roles, `missing curated role: ${entry.id}/${id}`);
            const r = await client.query(`INSERT INTO commulingo_history_event_people
                (event_id,person_id,relation_kind,relation_ko,relation_en) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING`,
                [entry.id,id,roles.kind,roles.ko,roles.en]);
            if (!r.rowCount) {
                const existing = (await client.query(`SELECT relation_kind,relation_ko,relation_en
                    FROM commulingo_history_event_people WHERE event_id=$1 AND person_id=$2`, [entry.id,id])).rows[0];
                for (const [field, value] of Object.entries({ relation_kind: roles.kind, relation_ko: roles.ko, relation_en: roles.en })) {
                    assert.equal(existing?.[field], value, `event-person relation conflict: ${entry.id}/${id}.${field}`);
                }
            }
            report.relationsAdded += r.rowCount;
        }
        for (const c of spec.coverage) {
            const term = (await client.query('SELECT body_ko,body_en FROM commulingo_terms WHERE id=$1',[c.term])).rows[0];
            assert(term?.body_ko && term?.body_en, `missing economy coverage ${c.code}`);
            const event = (await client.query('SELECT summary_ko,countries FROM commulingo_history_events WHERE id=$1',[c.event])).rows[0];
            assert(event?.summary_ko && event.countries.includes(c.code), `missing history coverage ${c.code}`);
            for (const p of c.people) assert((await client.query('SELECT 1 FROM commulingo_people WHERE id=$1 AND bio_ko<>\'\' AND bio_en<>\'\'',[p])).rowCount, `missing person ${p}`);
        }
        await client.query(apply ? 'COMMIT' : 'ROLLBACK');
        console.log(JSON.stringify({ ...report, committed: apply, coverage: spec.coverage.length }, null, 2));
    } catch (e) { await client.query('ROLLBACK'); throw e; }
    finally { client.release(); }
})().catch(e => { console.error(e.stack); process.exitCode = 1; }).finally(() => db.end());
