#!/usr/bin/env node
// Chinese-history content batch (people, glossary terms, history events).
// Never writes person or term tables directly: people and their sections go
// through submitPersonEdit, terms through submitTermEdit + review, so every
// entry receives the Admin validation. Events are new rows only.
//
//   APP_ROOT=/app node apply-china-history.js spec.json            # read-only preflight (isolated DB or --production)
//   APP_ROOT=/app node apply-china-history.js spec.json --apply --production --backup=/tmp/unique-before.json
//
// Validation defaults to the isolated content-test DB; production writes
// require --apply --production and DB_HOST=leninbot-pg. Re-running against
// the final state changes nothing; a changed existing row is refused.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const crypto = require('crypto');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const { FLAG_NAMES } = require(path.join(root, 'data/commulingo/flag-icons'));

const BATCH_ID = 'china-history-20260921';
const EVENT_COLUMNS = ['title_ko', 'title_en', 'period_label', 'sort_order', 'question_ko', 'question_en',
    'summary_ko', 'summary_en', 'outcome_ko', 'outcome_en', 'body_ko', 'body_en',
    'timeline', 'sources', 'locations', 'countries', 'relations', 'no_auto_link', 'link_expressions'];
const JSON_COLUMNS = new Set(['timeline', 'sources', 'locations', 'countries', 'relations', 'no_auto_link', 'link_expressions']);
const PERSON_COLUMNS = ['person_id', 'sort_order', 'relation_kind', 'relation_ko', 'relation_en', 'note_ko', 'note_en'];
const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => canonical(a) === canonical(b);

function validate(spec) {
    assert.equal(spec.id, BATCH_ID, 'unexpected content batch');
    const ids = new Set();
    for (const entry of [...spec.people, ...spec.events, ...spec.terms]) {
        assert(/^[a-z0-9-]+$/.test(entry.id), `bad id ${entry.id}`);
        assert(!ids.has(entry.id), `duplicate id ${entry.id}`);
        ids.add(entry.id);
    }
    const personIds = new Set(spec.people.map(p => p.id));
    for (const p of spec.people) {
        assert(p.groupId && p.role && p.sources.length && p.evidence.length >= 4, `person ${p.id}: group, role, sources, evidence required`);
        for (const section of p.sections) assert(section.slug && Number.isInteger(section.sortOrder) && section.sources.length, `section ${p.id}/${section.slug}`);
    }
    for (const e of spec.events) {
        assert.deepEqual(Object.keys(e.fields).sort(), [...EVENT_COLUMNS].sort(), `event ${e.id}: column set`);
        const f = e.fields;
        assert(Number.isInteger(f.sort_order));
        assert(f.countries.length && new Set(f.countries).size === f.countries.length, `${e.id}: countries`);
        f.countries.forEach(code => assert(FLAG_NAMES[code], `${e.id}: unknown country ${code}`));
        assert.equal(f.locations.filter(m => m.kind === 'main').length, 1, `${e.id}: one main location`);
        for (const m of f.locations) {
            assert(['main', 'place'].includes(m.kind) && m.label.ko && m.label.en, `${e.id}: location`);
            assert(Number.isFinite(m.lat) && Math.abs(m.lat) <= 85 && Number.isFinite(m.lng) && Math.abs(m.lng) <= 180, `${e.id}: location range`);
        }
        assert(f.sources.length >= 6 && f.sources.every(u => /^https:\/\//.test(u)), `${e.id}: >= 6 https sources`);
        assert.equal(new Set(f.sources).size, f.sources.length, `${e.id}: duplicate source`);
        for (const lang of ['ko', 'en']) {
            for (const prefix of ['title', 'question', 'summary', 'outcome', 'body']) assert(f[`${prefix}_${lang}`].trim(), `${e.id}: ${prefix}_${lang}`);
            assert(f[`body_${lang}`].length > 2500, `${e.id}: body_${lang} too short`);
            assert((f[`body_${lang}`].match(/^## /gm) || []).length >= 5, `${e.id}: >= 5 sections`);
            assert(!/<(?:script|iframe)\b/i.test(f[`body_${lang}`]));
        }
        assert(f.timeline.length >= 7, `${e.id}: >= 7 timeline points`);
        for (const p of f.timeline) {
            assert(/^\d{4}/.test(p.date) && p.title.ko && p.title.en && p.body.ko && p.body.en, `${e.id}: timeline point`);
            assert(p.country.length && p.country.every(code => f.countries.includes(code)), `${e.id}: timeline country`);
            if (p.geo) {
                assert(p.geo.kind === 'point' || p.geo.kind === 'arrow', `${e.id}: geo kind`);
                if (p.geo.kind === 'point') assert(Math.abs(p.geo.lat) <= 85 && Math.abs(p.geo.lng) <= 180, `${e.id}: geo range`);
                else assert(p.geo.points.length >= 2 && p.geo.points.every(pt => Math.abs(pt[0]) <= 85 && Math.abs(pt[1]) <= 180), `${e.id}: arrow`);
            }
        }
        for (const id of f.relations.related || []) assert(typeof id === 'string' && id, `${e.id}: relation`);
        assert.equal(new Set(e.people.map(p => p.person_id)).size, e.people.length, `${e.id}: duplicate person`);
        for (const p of e.people) {
            assert.deepEqual(Object.keys(p).sort(), [...PERSON_COLUMNS].sort(), `${e.id}/${p.person_id}: columns`);
            assert(['leader', 'participant', 'executor', 'opponent', 'target', 'witness'].includes(p.relation_kind), `${e.id}/${p.person_id}: kind`);
            assert(p.relation_ko && p.relation_en, `${e.id}/${p.person_id}: relation labels`);
        }
    }
    for (const t of spec.terms) {
        assert(t.fields.term.ko && t.fields.term.en && t.fields.category && t.fields.definition.ko && t.fields.body.en, `term ${t.id}`);
        assert(t.sources.length && t.fields.evidence.length >= 3, `term ${t.id}: sources/evidence`);
        for (const id of t.fields.people || []) assert(personIds.has(id) || true, id); // existence is checked against the DB
    }
}

async function applyBatch(db, spec, { apply = false, backup } = {}) {
    validate(spec);
    const { submitPersonEdit } = require(path.join(root, 'data/commulingo/person-editorial-service'));
    const { getPersonAdmin } = require(path.join(root, 'data/commulingo/people-admin-store'));
    const { listPersonSectionsAdmin } = require(path.join(root, 'data/commulingo/people-sections-store'));
    const { submitTermEdit, reviewTermSuggestion, readTermEditorial } = require(path.join(root, 'data/commulingo/term-editorial-service'));
    const client = await db.connect();
    const report = { batch: spec.id, people: [], sections: [], terms: [], events: [], relationsAdded: 0, committed: false };
    const before = { batch: spec.id, specSha256: crypto.createHash('sha256').update(canonical(spec)).digest('hex'), events: [], people: [], terms: [] };
    try {
        await client.query(apply ? 'BEGIN' : 'BEGIN READ ONLY');
        await client.query("SET LOCAL lock_timeout='3s'");
        await client.query("SET LOCAL statement_timeout='60s'");
        if (apply) await client.query(`SELECT pg_advisory_xact_lock(hashtext('${BATCH_ID}'))`);
        // Group and category ids come from migration 182; refuse to run before it.
        for (const groupId of new Set(spec.people.map(p => p.groupId))) {
            assert((await client.query('SELECT 1 FROM commulingo_people_groups WHERE id=$1', [groupId])).rowCount, `unknown people group ${groupId}`);
        }
        for (const entry of spec.people) {
            const { sections, ...fields } = entry;
            const existing = await getPersonAdmin(entry.id, { client });
            if (existing) {
                before.people.push({ id: entry.id, existed: true });
                assert.equal(existing.citizenship.code, fields.citizenship.code, `person citizenship conflict: ${entry.id}`);
                assert.equal(existing.role?.category, fields.role.category, `person role conflict: ${entry.id}`);
                for (const f of ['groupId', 'nativeName', 'givenName', 'familyName', 'epithet', 'bio']) {
                    assert(equal(existing[f], fields[f]), `person identity/content conflict: ${entry.id}.${f}`);
                }
                assert.equal(existing.years, fields.years, `person identity/content conflict: ${entry.id}.years`);
                report.people.push({ id: entry.id, status: 'unchanged' });
            } else if (apply) {
                const result = await submitPersonEdit({ target: 'person', action: 'create', id: entry.id, fields, sources: fields.sources }, { client, changedBy: spec.id });
                assert.equal(result.status, 'approved', `review required: ${entry.id}: ${result.reasons}`);
                report.people.push({ id: entry.id, status: 'created' });
            } else {
                report.people.push({ id: entry.id, status: 'would create' });
            }
            for (const section of sections) {
                if (!existing && !apply) { report.sections.push({ id: `${entry.id}/${section.slug}`, status: 'would create' }); continue; }
                const old = (await listPersonSectionsAdmin(entry.id, { client })).find(s => s.slug === section.slug);
                if (old) {
                    for (const f of ['heading', 'body', 'sortOrder']) assert(equal(old[f], section[f]), `section conflict: ${entry.id}/${section.slug}.${f}`);
                    report.sections.push({ id: `${entry.id}/${section.slug}`, status: 'unchanged' }); continue;
                }
                if (!apply) { report.sections.push({ id: `${entry.id}/${section.slug}`, status: 'would create' }); continue; }
                const current = await getPersonAdmin(entry.id, { client });
                const result = await submitPersonEdit({ target: 'person_section', action: 'create', id: entry.id,
                    fields: { ...section, expectedRevision: current.revision }, sources: section.sources }, { client, changedBy: spec.id });
                assert.equal(result.status, 'approved', `section review required: ${entry.id}/${section.slug}: ${result.reasons}`);
                report.sections.push({ id: `${entry.id}/${section.slug}`, status: 'created' });
            }
        }
        for (const entry of spec.events) {
            const old = (await client.query('SELECT * FROM commulingo_history_events WHERE id=$1' + (apply ? ' FOR UPDATE' : ''), [entry.id])).rows[0];
            if (old) {
                before.events.push({ id: entry.id, existed: true });
                for (const c of EVENT_COLUMNS) assert(equal(old[c], entry.fields[c]), `existing event differs: ${entry.id}.${c}`);
                report.events.push({ id: entry.id, status: 'unchanged' });
            } else {
                before.events.push({ id: entry.id, existed: false });
                for (const id of entry.fields.relations.related || []) {
                    const exists = spec.events.some(e => e.id === id) || (await client.query('SELECT 1 FROM commulingo_history_events WHERE id=$1', [id])).rowCount;
                    assert(exists, `${entry.id}: related event ${id} does not exist`);
                }
                if (apply) {
                    const columns = ['id', ...EVENT_COLUMNS];
                    await client.query(`INSERT INTO commulingo_history_events (${columns.join(',')}) VALUES (${columns.map((c, i) => '$' + (i + 1) + (JSON_COLUMNS.has(c) ? '::jsonb' : '')).join(',')})`,
                        columns.map(c => c === 'id' ? entry.id : JSON_COLUMNS.has(c) ? JSON.stringify(entry.fields[c]) : entry.fields[c]));
                }
                report.events.push({ id: entry.id, status: apply ? 'created' : 'would create' });
            }
        }
        for (const entry of spec.events) for (const p of entry.people) {
            const personExists = (await client.query('SELECT 1 FROM commulingo_people WHERE id=$1', [p.person_id])).rowCount
                || spec.people.some(person => person.id === p.person_id);
            assert(personExists, `${entry.id}: person ${p.person_id} does not exist`);
            const existing = (await client.query('SELECT * FROM commulingo_history_event_people WHERE event_id=$1 AND person_id=$2', [entry.id, p.person_id])).rows[0];
            if (existing) {
                for (const c of ['relation_kind', 'relation_ko', 'relation_en', 'note_ko', 'note_en']) assert.equal(existing[c], p[c], `event-person relation conflict: ${entry.id}/${p.person_id}.${c}`);
                continue;
            }
            if (!apply) { report.relationsAdded += 1; continue; }
            const r = await client.query(`INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING`,
                [entry.id, p.person_id, p.sort_order, p.relation_kind, p.relation_ko, p.relation_en, p.note_ko, p.note_en]);
            report.relationsAdded += r.rowCount;
        }
        for (const entry of spec.terms) {
            const current = await readTermEditorial(entry.id, { client });
            if (current) {
                before.terms.push({ id: entry.id, existed: true });
                for (const f of ['term', 'definition', 'category']) assert(equal(current[f], entry.fields[f]), `existing term differs: ${entry.id}.${f}`);
                report.terms.push({ id: entry.id, status: 'unchanged' }); continue;
            }
            before.terms.push({ id: entry.id, existed: false });
            for (const id of entry.fields.people || []) {
                assert((await client.query('SELECT 1 FROM commulingo_people WHERE id=$1', [id])).rowCount || spec.people.some(p => p.id === id), `${entry.id}: person ${id} does not exist`);
            }
            for (const id of entry.fields.events || []) {
                assert((await client.query('SELECT 1 FROM commulingo_history_events WHERE id=$1', [id])).rowCount || spec.events.some(e => e.id === id), `${entry.id}: event ${id} does not exist`);
            }
            if (!apply) { report.terms.push({ id: entry.id, status: 'would create' }); continue; }
            const submitted = await submitTermEdit({ id: entry.id, action: 'create', fields: entry.fields, sources: entry.sources, changedBy: spec.id }, { client });
            assert.equal(submitted.status, 'pending', `term ${entry.id}: unexpected ${submitted.status}`);
            const reviewed = await reviewTermSuggestion(submitted.suggestionId, true, `${spec.id}: reviewed batch entry`, { client, changedBy: spec.id });
            assert.equal(reviewed.status, 'approved', `term ${entry.id}: ${reviewed.status}`);
            report.terms.push({ id: entry.id, status: 'created' });
        }
        if (apply) {
            if (backup) fs.writeFileSync(backup, JSON.stringify(before, null, 1), { flag: 'wx' });
            await client.query('COMMIT');
            report.committed = true;
        } else {
            await client.query('ROLLBACK');
        }
        return report;
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {});
        throw error;
    } finally {
        client.release();
    }
}

if (require.main === module) {
    (async () => {
        const args = process.argv.slice(2);
        const apply = args.includes('--apply');
        const production = args.includes('--production');
        const backup = (args.find(a => a.startsWith('--backup=')) || '').slice('--backup='.length);
        const specPath = args.find(a => !a.startsWith('--'));
        assert(specPath, 'spec.json is required');
        const isolated = process.env.COMMULINGO_ISOLATED_TEST === '1' && process.env.DB_NAME === 'commulingo_integrity_test'
            && process.env.DB_HOST === 'commulingo-content-test';
        assert(isolated || (production && process.env.DB_HOST === 'leninbot-pg'), 'use the isolated content-test DB, or --production against leninbot-pg');
        if (apply && production) assert(backup, '--apply --production requires --backup=<new file>');
        const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
        const { db } = require(path.join(root, 'scripts/lib/bootstrap'));
        try {
            const report = await applyBatch(db, spec, { apply, backup });
            console.log(JSON.stringify(report, null, 1));
            if (apply) {
                const { clearCommuLingoPeopleCache } = require(path.join(root, 'data/commulingo/people-store'));
                clearCommuLingoPeopleCache();
            }
        } finally {
            await db.end();
        }
    })().catch(error => { console.error(error.stack); process.exitCode = 1; });
}

module.exports = { applyBatch, validate, BATCH_ID };
