#!/usr/bin/env node
// New history-event batch (scripts/content/<batch>.json). Default: read-only preflight.
// docker exec -i leninbot-frontend node /app/scripts/apply-history-events.js - --production < spec.json
// (`-` reads the spec from stdin; DB_HOST is leninbot-pg inside the container)
// Add --apply --backup=/tmp/unique-before.json to publish. People cards go first
// through scripts/commulingo-people-upsert; this script never edits people.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const crypto = require('crypto');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const { FLAG_NAMES } = require(path.join(root, 'data/commulingo/flag-icons'));
const { canonicalPeriod } = require(path.join(root, 'data/commulingo/career-period'));
const { normalizeKoreanQuotes, normalizeKoreanTree } = require(path.join(root, 'data/commulingo/korean-quotes'));
// The period is year/month/day columns (migrations 362/363), as in career entries.
const periodColumns = ['start_year', 'start_month', 'start_day', 'end_year', 'end_month', 'end_day'];
const columns = ['title_ko', 'title_en', ...periodColumns, 'question_ko', 'question_en',
    'summary_ko', 'summary_en', 'outcome_ko', 'outcome_en', 'body_ko', 'body_en',
    'timeline', 'sources', 'locations', 'countries', 'relations', 'no_auto_link', 'link_expressions', 'focus', 'sides'];
const jsonColumns = new Set(['timeline', 'sources', 'locations', 'countries', 'relations', 'no_auto_link', 'link_expressions', 'focus', 'sides']);
// Specs written before migration 193 have no sides / side; both default to null.
const OPTIONAL = { sides: null };
const fieldValue = (f, c) => (c in f ? f[c] : OPTIONAL[c]);
// jsonb columns get SQL NULL for null, never the JSON value null (193 fixed four rows).
const sqlValue = (c, v) => (jsonColumns.has(c) ? (v === null || v === undefined ? null : JSON.stringify(v)) : v);
const RELATION_KINDS = ['leader', 'executor', 'participant', 'opponent', 'target', 'witness', 'historian'];
const personColumns = ['person_id', 'sort_order', 'relation_kind', 'relation_ko', 'relation_en', 'note_ko', 'note_en', 'side'];
const personValue = (p, c) => (c === 'side' ? p.side ?? null : p[c]);
const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => canonical(a) === canonical(b);
// Every problem in the spec is collected and reported together (status 400),
// each naming the event and row it is about, instead of stopping at the first
// bare assertion.
function specError(problems) {
    return Object.assign(new Error(`history event spec has ${problems.length} problem(s):\n${problems.join('\n')}`), { status: 400, problems });
}
function validate(spec) {
    const problems = [];
    const check = (ok, message) => { if (!ok) problems.push(message); return !!ok; };
    check(/^[a-z0-9-]+-\d{8}$/.test(spec?.id), `batch id must look like <topic>-YYYYMMDD (got ${JSON.stringify(spec?.id)})`);
    if (!check(Array.isArray(spec?.events) && spec.events.length, 'events must be a non-empty list')) throw specError(problems);
    const dupIds = spec.events.map(e => e?.id).filter((id, i, all) => all.indexOf(id) !== i);
    check(!dupIds.length, `duplicate event id(s): ${[...new Set(dupIds)].join(', ')}`);
    for (const [index, e] of spec.events.entries()) {
        const at = `${e?.id || `events[${index}]`}`;
        try {
            validateEvent(e, at, check);
        } catch (err) {
            problems.push(`${at}: malformed spec (${err.message})`);
        }
    }
    if (problems.length) throw specError(problems);
}
function validateEvent(e, at, check) {
    check(e.expected === null, `${at}: expected must be null (this batch only creates new events)`);
    const f = e.fields || {};
    const missing = columns.filter(c => !(c in OPTIONAL) && !(c in f));
    const unknown = Object.keys(f).filter(c => !columns.includes(c));
    check(!missing.length, `${at}: missing field(s) ${missing.join(', ')}`);
    check(!unknown.length, `${at}: unknown field(s) ${unknown.join(', ')}`);
    let period = null;
    try {
        period = canonicalPeriod({ start: [f.start_year, f.start_month, f.start_day].filter(v => v != null),
            ...(f.end_year != null ? { end: [f.end_year, f.end_month, f.end_day].filter(v => v != null) } : {}) }, `${e.id}.period`);
    } catch (err) { check(false, `${at}: ${err.message}`); }
    check(!period || period.start, `${at}: period needs a start year`);
    const countries = Array.isArray(f.countries) ? f.countries : [];
    check(countries.length && new Set(countries).size === countries.length, `${at}: countries must be a non-empty list without repeats`);
    const unknownCountries = countries.filter(code => !FLAG_NAMES[code]);
    check(!unknownCountries.length, `${at}: unknown country code(s) ${unknownCountries.join(', ')}`);
    const locations = f.locations || [];
    const mains = locations.filter(m => m.kind === 'main').length;
    check(mains === 1, `${at}: locations need exactly one kind: main (found ${mains})`);
    locations.forEach((m, i) => {
        check(['main', 'place'].includes(m.kind) && m.label?.ko && m.label?.en, `${at}: locations[${i}] needs kind main|place and label {ko, en}`);
        check(Number.isFinite(m.lat) && Math.abs(m.lat) <= 85 && Number.isFinite(m.lng) && Math.abs(m.lng) <= 180, `${at}: locations[${i}] lat/lng out of range (${m.lat}, ${m.lng})`);
    });
    const sections = e.sections || [];
    check(sections.length >= 6, `${at}: needs at least 6 sections (has ${sections.length})`);
    check(f.focus === null || (f.focus?.ko && f.focus?.en), `${at}: focus is {ko, en} or null`);
    const sides = fieldValue(f, 'sides');
    if (sides !== null) {
        if (check(Array.isArray(sides) && sides.length >= 2, `${at}: sides needs two or more entries`)) {
            check(f.focus === null, `${at}: an event has focus or sides, not both`);
            sides.forEach(side => check(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(side.id) && side.label?.ko && side.label?.en, `${at}: bad side ${JSON.stringify(side)}`));
            check(new Set(sides.map(side => side.id)).size === sides.length, `${at}: duplicate side id`);
        }
    }
    const sideIds = new Set((Array.isArray(sides) ? sides : []).map(side => side.id));
    const sources = Array.isArray(f.sources) ? f.sources : [];
    check(sources.length >= 10, `${at}: needs at least 10 sources (has ${sources.length})`);
    const badUrls = sources.filter(u => !/^https:\/\//.test(u));
    check(!badUrls.length, `${at}: sources must be https URLs: ${badUrls.join(', ')}`);
    check(new Set(sources).size === sources.length, `${at}: duplicate source URL`);
    const relations = f.relations || {};
    check(Object.keys(relations).every(k => ['related', 'parent'].includes(k)), `${at}: relations are related[] and/or parent`);
    check(relations.related === undefined || Array.isArray(relations.related), `${at}: relations.related must be a list`);
    check(relations.parent === undefined || typeof relations.parent === 'string', `${at}: relations.parent must be an event id`);
    for (const lang of ['ko', 'en']) {
        for (const prefix of ['title', 'question', 'summary', 'outcome', 'body']) check(String(f[`${prefix}_${lang}`] || '').trim(), `${at}: ${prefix}_${lang} is empty`);
        const body = String(f[`body_${lang}`] || '');
        check(body.length > 5000, `${at}: body_${lang} must be over 5000 characters (has ${body.length})`);
        const expected = sections.map((s, si) => {
            check(s.heading?.[lang] && s.paragraphs?.length >= 2, `${at}: sections[${si}] needs heading.${lang} and at least 2 paragraphs`);
            return '## ' + s.heading?.[lang] + '\n\n' + (s.paragraphs || []).map((p, pi) => {
                const where = `${at}: sections[${si}].paragraphs[${pi}]`;
                check(p[lang], `${where} has no ${lang} text`);
                check(p.sources?.length, `${where} cites no source`);
                const uncited = (p.sources || []).filter(u => !sources.includes(u));
                check(!uncited.length, `${where} cites URL(s) missing from fields.sources: ${uncited.join(', ')}`);
                return p[lang] + ' ' + (p.sources || []).map(u => `[${sources.indexOf(u) + 1}](${u})`).join(' ');
            }).join('\n\n');
        }).join('\n\n');
        if (body !== expected) {
            const diverge = [...body].findIndex((ch, i) => ch !== expected[i]);
            check(false, `${at}: body_${lang} is not the render of its sections (first difference at character ${diverge < 0 ? Math.min(body.length, expected.length) : diverge}); rebuild the body from the sections`);
        }
        check(!/<(?:script|iframe)\b/i.test(expected), `${at}: body_${lang} contains script/iframe`);
    }
    const timeline = Array.isArray(f.timeline) ? f.timeline : [];
    check(timeline.length >= 12, `${at}: timeline needs at least 12 rows (has ${timeline.length})`);
    timeline.forEach((p, i) => {
        const row = `${at}: timeline[${i}]${p.title?.ko ? ` '${p.title.ko}'` : ''}`;
        let canonicalOk = false;
        try { canonicalOk = p.period?.start && equal(canonicalPeriod(p.period, `${e.id}.timeline`), p.period); } catch { /* reported below */ }
        check(canonicalOk, `${row} period must be canonical {start: [y, m?, d?], end?}`);
        check(p.title?.ko && p.title?.en && p.body?.ko && p.body?.en, `${row} needs title and body in ko and en`);
        const rowCountries = Array.isArray(p.country) ? p.country : [];
        check(rowCountries.length, `${row} needs country (a list of codes)`);
        const outside = rowCountries.filter(code => !countries.includes(code));
        check(!outside.length, `${row} country ${outside.join(', ')} is not in the event's countries [${countries.join(', ')}]; add it there or fix the row`);
    });
    const people = Array.isArray(e.people) ? e.people : [];
    const dupPeople = people.map(p => p.person_id).filter((id, i, all) => all.indexOf(id) !== i);
    check(!dupPeople.length, `${at}: person listed twice: ${[...new Set(dupPeople)].join(', ')}`);
    for (const p of people) {
        const who = `${at}/${p.person_id}`;
        const keys = Object.keys(p).filter(c => c !== 'side');
        const missingKeys = personColumns.filter(c => c !== 'side' && !keys.includes(c));
        const extraKeys = keys.filter(c => !personColumns.includes(c));
        check(!missingKeys.length && !extraKeys.length, `${who}: person row keys must be ${personColumns.join(', ')}${missingKeys.length ? `; missing ${missingKeys.join(', ')}` : ''}${extraKeys.length ? `; unknown ${extraKeys.join(', ')}` : ''}`);
        check(RELATION_KINDS.includes(p.relation_kind), `${who}: relation_kind ${p.relation_kind} must be one of ${RELATION_KINDS.join(', ')}`);
        if (p.side != null) check(sideIds.has(p.side), `${who}: side ${p.side} is not one of the event's sides`);
        if (sideIds.size) check(p.relation_kind !== 'opponent', `${who}: with sides the opposing camp is a side, not opponent`);
        check(p.relation_ko && p.relation_en && p.note_ko && p.note_en, `${who}: needs relation_ko, relation_en, note_ko and note_en`);
    }
}
async function applyBatch(db, spec, { apply = false, backup } = {}) {
    validate(spec);
    // This script writes with raw SQL, so it applies the Korean quote rules
    // (korean-quotes.js) the editorial services apply to every other write.
    for (const e of spec.events) {
        for (const c of ['question_ko', 'summary_ko', 'outcome_ko', 'body_ko']) if (typeof e.fields[c] === 'string') e.fields[c] = normalizeKoreanQuotes(e.fields[c]);
        for (const c of ['timeline', 'focus', 'sides']) if (e.fields[c]) e.fields[c] = normalizeKoreanTree(e.fields[c]);
        for (const p of e.people) for (const c of ['relation_ko', 'note_ko']) if (typeof p[c] === 'string') p[c] = normalizeKoreanQuotes(p[c]);
    }
    const client = await db.connect();
    const report = [], before = { batch: spec.id, specSha256: crypto.createHash('sha256').update(canonical(spec)).digest('hex'), events: [], people: [] };
    try {
        await client.query(apply ? 'BEGIN' : 'BEGIN READ ONLY');
        await client.query("SET LOCAL lock_timeout='3s'");
        await client.query("SET LOCAL statement_timeout='30s'");
        if (apply) await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [spec.id]);
        const problems = [];
        for (const e of spec.events) {
            const old = (await client.query('SELECT * FROM commulingo_history_events WHERE id=$1' + (apply ? ' FOR UPDATE' : ''), [e.id])).rows[0];
            const duplicate = (await client.query('SELECT id FROM commulingo_history_events WHERE id<>$1 AND (lower(title_en)=lower($2) OR title_ko=$3)', [e.id, e.fields.title_en, e.fields.title_ko])).rows;
            if (duplicate.length) problems.push(`${e.id}: an existing event already has this title: ${duplicate.map(r => r.id).join(', ')}`);
            // Related events may be other events of this batch; a parent must already exist.
            for (const id of [...(e.fields.relations.related || []).filter(id => !spec.events.some(other => other.id === id)), ...(e.fields.relations.parent ? [e.fields.relations.parent] : [])]) {
                if ((await client.query('SELECT 1 FROM commulingo_history_events WHERE id=$1', [id])).rowCount !== 1) problems.push(`${e.id}: related event ${id} does not exist`);
            }
            // An existing id passes only when the stored event is exactly this spec.
            const changed = old ? columns.filter(c => !equal(old[c] ?? null, fieldValue(e.fields, c) ?? null)) : [];
            if (changed.length) problems.push(`${e.id}: already exists and differs from the spec in ${changed.join(', ')} (this tool never overwrites; edit it with editorial_store)`);
            if (old) before.events.push(old);
            const links = (await client.query('SELECT * FROM commulingo_history_event_people WHERE event_id=$1 ORDER BY sort_order,person_id', [e.id])).rows;
            before.people.push(...links);
            for (const p of e.people) {
                if ((await client.query('SELECT id FROM commulingo_people WHERE id=$1', [p.person_id])).rowCount !== 1) {
                    problems.push(`${e.id}: person ${p.person_id} does not exist; register it with people_upsert first`);
                }
                const existing = links.find(l => l.person_id === p.person_id);
                const differs = existing ? personColumns.filter(c => !equal(existing[c] ?? null, personValue(p, c))) : [];
                if (differs.length) problems.push(`${e.id}/${p.person_id}: stored event-person row differs in ${differs.join(', ')}`);
            }
            report.push({ id: e.id, status: old ? 'unchanged' : (apply ? 'created' : 'ready'), missingPeople: e.people.filter(p => !links.some(l => l.person_id === p.person_id)).map(p => p.person_id) });
        }
        if (problems.length) throw specError(problems);
        if (apply && backup) fs.writeFileSync(backup, JSON.stringify(before, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
        if (apply) for (const e of spec.events) {
            const entry = report.find(r => r.id === e.id);
            if (entry.status !== 'unchanged') {
                await client.query(`INSERT INTO commulingo_history_events (id,${columns.join(',')}) VALUES ($1,${columns.map((c, i) => '$' + (i + 2) + (jsonColumns.has(c) ? '::jsonb' : '')).join(',')})`,
                    [e.id, ...columns.map(c => sqlValue(c, fieldValue(e.fields, c)))]);
            }
            for (const p of e.people.filter(p => entry.missingPeople.includes(p.person_id))) {
                await client.query(`INSERT INTO commulingo_history_event_people (event_id,${personColumns.join(',')}) VALUES ($1,${personColumns.map((_, i) => '$' + (i + 2)).join(',')})`, [e.id, ...personColumns.map(c => personValue(p, c))]);
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
    const isolated = process.env.COMMULINGO_ISOLATED_TEST === '1' && process.env.DB_HOST === 'commulingo-history-events-test' && process.env.DB_NAME === 'commulingo_integrity_test';
    assert((production && process.env.DB_HOST === 'leninbot-pg') || (!production && isolated), 'explicit production or isolated destination required');
    const apply = args.includes('--apply'), backup = args.find(a => a.startsWith('--backup='))?.slice(9);
    assert(!production || !apply || backup, 'production apply requires a unique backup path');
    const spec = JSON.parse(fs.readFileSync(files[0] === '-' ? 0 : files[0], 'utf8'));
    validate(spec);
    const db = require(path.join(root, 'config/database'));
    try { console.log(JSON.stringify(await applyBatch(db, spec, { apply, backup }), null, 2)); }
    finally { await db.end(); }
}
if (require.main === module) main().catch(error => { console.error(error.stack); process.exitCode = 1; });
module.exports = { applyBatch, validate, columns, personColumns };
