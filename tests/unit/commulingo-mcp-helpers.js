#!/usr/bin/env node
// MCP helpers with no DB: read projections (mcp/view.js), JSON Pointer
// patches for data documents (mcp/pointer.js), the specPath guard
// (mcp/spec.js) and the argument checks the new write tools make before
// touching the database.
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-work-'));
fs.mkdirSync(path.join(work, 'content', 'batch'), { recursive: true });
fs.mkdirSync(path.join(work, 'reviews'));
fs.mkdirSync(path.join(work, 'secret'));
fs.writeFileSync(path.join(work, 'content', 'batch', 'spec.json'), JSON.stringify({ items: [1] }));
fs.writeFileSync(path.join(work, 'content', 'batch', 'bad.json'), '{');
fs.writeFileSync(path.join(work, 'secret', 'key.json'), '{}');
fs.symlinkSync(path.join(work, 'secret', 'key.json'), path.join(work, 'content', 'batch', 'link.json'));
process.env.COMMULINGO_WORK_DIR = work;

const { project } = require('../../mcp/view');
const { getPointer, applyPatches } = require('../../mcp/pointer');
const { readSpecJson } = require('../../mcp/spec');

(async () => {
    // Projections: full shape by default; fields, lang and maxChars narrow it.
    const person = { id: 'lenin', revision: 'r1', name: { ko: '레닌', en: 'Lenin' }, bio: { ko: '가'.repeat(500), en: 'b' }, sections: [{ slug: 's', body: { ko: 'x', en: 'y' } }], evidence: [1] };
    assert.equal(project(person, {}), person);
    assert.deepEqual(Object.keys(project(person, { fields: ['name'] })), ['id', 'revision', 'name']);
    const ko = project(person, { lang: 'ko', maxChars: 200 });
    assert.equal(ko.name, '레닌');
    assert.equal(ko.sections[0].body, 'x');
    assert.match(ko.bio, /…\[\+300 chars\]$/);
    assert.equal(person.bio.ko.length, 500, 'the source is not modified');
    assert.throws(() => project(person, { fields: [1] }), /fields must be strings/);

    // Pointers: read, set, append, remove; the input stays untouched.
    const doc = { version: 3, affiliations: [{ id: 'a' }, { id: 'b' }], 'x/y': { '~k': 1 } };
    assert.deepEqual(getPointer(doc, '/affiliations/1'), { id: 'b' });
    assert.equal(getPointer(doc, '/x~1y/~0k'), 1);
    assert.equal(getPointer(doc, ''), doc);
    assert.throws(() => getPointer(doc, '/affiliations/9'), /no index 9/);
    assert.throws(() => getPointer(doc, 'affiliations'), /pointer must/);
    const patched = applyPatches(doc, [
        { op: 'set', path: '/version', value: 4 },
        { op: 'set', path: '/affiliations/-', value: { id: 'c' } },
        { op: 'remove', path: '/affiliations/0' },
        { op: 'set', path: '/added', value: [] },
    ]);
    assert.deepEqual(patched.affiliations.map(a => a.id), ['b', 'c']);
    assert.equal(patched.version, 4);
    assert.deepEqual(patched.added, []);
    assert.equal(doc.affiliations.length, 2);
    assert.throws(() => applyPatches(doc, [{ op: 'set', path: '', value: {} }]), /whole document/);
    assert.throws(() => applyPatches(doc, [{ op: 'remove', path: '/nope' }]), /no key/);
    assert.throws(() => applyPatches(doc, [{ op: 'move', path: '/version' }]), /set or remove/);
    assert.throws(() => applyPatches(doc, [{ op: 'set', path: '/version' }]), /value is required/);

    // Patches built on an older revision go onto the current one unless a
    // write since then touched the same path, a parent or a child of it.
    const { changedPaths, patchConflicts } = require('../../mcp/pointer');
    const before = { version: 1, affiliations: [{ id: 'x', periods: [[1, 2]] }, { id: 'y' }], functions: [{ id: 'f' }] };
    const after = { version: 2, affiliations: [{ id: 'x', periods: [[1, 3]] }, { id: 'y' }], functions: [{ id: 'f' }, { id: 'g' }] };
    const changes = changedPaths(before, after);
    assert.deepEqual(changes, [{ path: '/version' }, { path: '/affiliations/0/periods/0/1' }, { path: '/functions', resized: true }]);
    assert.deepEqual(patchConflicts([{ path: '/affiliations/1/name' }, { path: '/functions/-' }], changes), []);
    assert.deepEqual(patchConflicts([{ path: '/functions/0/x' }, { path: '/affiliations/0' }, { path: '/version' }], changes).map(c => c.patch),
        ['/functions/0/x', '/affiliations/0', '/version']);

    // Batches report every rejected item at once and still write nothing.
    const { eachItem } = require('../../data/commulingo/item-problems');
    const statements = [];
    const sqlClient = { query: async sql => { statements.push(sql); } };
    const seenItems = [];
    await assert.rejects(eachItem(sqlClient, ['a', 'b', 'c'], async item => {
        seenItems.push(item);
        if (item !== 'b') throw Object.assign(new Error(`bad ${item}`), { status: 400 });
    }, item => ({ label: item })), err => err.status === 400 && err.problems.length === 2
        && /2 of 3 item\(s\) rejected/.test(err.message) && /items\[2\] c: bad c/.test(err.message));
    assert.deepEqual(seenItems, ['a', 'b', 'c']);
    assert.equal(statements.filter(sql => sql.startsWith('ROLLBACK TO')).length, 2);
    await assert.rejects(eachItem(sqlClient, ['a', 'b'], async () => { throw new Error('connection lost'); }, () => ({})), /connection lost/);

    // A history event spec reports all its problems, each naming the event and row.
    const { validate: validateEventSpec } = require('../../scripts/apply-history-events');
    assert.throws(() => validateEventSpec({ id: 'x', events: [{ id: 'a', expected: null, fields: { countries: ['de'],
        timeline: [{ period: { start: [1900] }, title: { ko: '행', en: 'row' }, body: { ko: 'b', en: 'b' }, country: ['fr'] }] }, sections: [], people: [] }] }),
    err => err.status === 400 && /batch id must look like/.test(err.message)
        && /a: timeline\[0\] '행' country fr is not in the event's countries \[de\]/.test(err.message)
        && /a: needs at least 6 sections \(has 0\)/.test(err.message));

    // specPath: only content/ and reviews/, no traversal, no symlink out.
    assert.deepEqual(readSpecJson('content/batch/spec.json'), { items: [1] });
    for (const bad of ['secret/key.json', '../secret/key.json', 'content/../secret/key.json', '/etc/passwd', 'content', 'content//x.json']) {
        assert.throws(() => readSpecJson(bad), /specPath must/, bad);
    }
    assert.throws(() => readSpecJson('content/batch/link.json'), /leaves its work directory/);
    assert.throws(() => readSpecJson('content/batch/missing.json'), /not found/);
    assert.throws(() => readSpecJson('content/batch/bad.json'), /not valid JSON/);

    // Write tools refuse malformed requests before opening a transaction.
    const { tools } = require('../../mcp');
    const tool = name => tools.find(t => t.name === name);
    const ctx = { client: 'operator' };
    await assert.rejects(tool('editorial_batch').handler({}, ctx), /items or specPath/);
    await assert.rejects(tool('editorial_batch').handler({ items: [], specPath: 'content/batch/spec.json' }, ctx), /not both/);
    await assert.rejects(tool('editorial_batch').handler({ items: [{ command: 'submit', target: 'person_section', request: { id: 'x', action: 'create', fields: { expectedRevision: '@previous' } } }] }, ctx), /needs an earlier item/);
    await assert.rejects(tool('people_upsert').handler({}, ctx), /people or specPath/);
    await assert.rejects(tool('registry_edit').handler({}, ctx), /ops or specPath/);
    await assert.rejects(tool('link_reviews_apply').handler({}, ctx), /manifest or specPath/);
    await assert.rejects(tool('data_document_put').handler({ key: 'k' }, ctx), /content or patches/);
    // Courses are operator-only: the leninbot client has edit scope but no course work.
    await assert.rejects(tool('data_document_put').handler({ key: 'course/capital-vol1', patches: [] }, { client: 'leninbot' }), /may not write learning courses/);
    await assert.rejects(tool('data_document_restore').handler({ key: 'course/capital-vol1', revision: 1 }, { client: 'leninbot' }), /may not write learning courses/);
    await assert.rejects(tool('doc_put').handler({ id: 'd', entry: {}, entryPatch: {} }, ctx), /entry or entryPatch/);
    await assert.rejects(tool('doc_put').handler({ id: 'd', original: { lang: 'de', body: '<p>x</p>' }, removeOriginal: true }, ctx), /original or removeOriginal/);
    await assert.rejects(tool('doc_put').handler({ id: 'd', original: { lang: 'de', body: '<p>x</p>', bodyPath: 'content/x.html' } }, ctx), /original.body or original.bodyPath/);
    await assert.rejects(tool('editorial_store').handler({ command: 'submit', target: 'term', request: { id: 'x', action: 'create', directApply: true, fields: {} }, changedBy: 'bad actor' }, ctx), /changedBy/);
    await assert.rejects(tool('sql_read').handler({ sql: 'DELETE FROM commulingo_people' }, ctx), /must start with SELECT/);
    await assert.rejects(tool('sql_read').handler({ sql: 'SELECT 1', params: [{}] }, ctx), /scalars/);
    await assert.rejects(tool('sql_read').handler({ sql: 'SELECT 1', params: [[{}]] }, ctx), /scalars/);
    const audits = await tool('audit_run').handler({}, ctx);
    assert.ok(audits.available.includes('audit-link-fires'), 'audit_run lists the audit scripts');
    await assert.rejects(tool('audit_run').handler({ name: 'deploy' }, ctx), /unknown audit/);
    await assert.rejects(tool('audit_run').handler({ name: 'audit-link-fires', args: ['ko; rm -rf /'] }, ctx), /plain tokens/);
    const { applyRegistryEdits, REGISTRY_OPS } = require('../../data/commulingo/registry-edits');
    assert.ok(REGISTRY_OPS.includes('collection_member_add'));
    assert.ok(REGISTRY_OPS.includes('person_no_political_position_set'));
    assert.ok(REGISTRY_OPS.includes('term_category_assign'));
    await assert.rejects(applyRegistryEdits([], { actor: 'x' }), /1–500 edits/);
    await assert.rejects(applyRegistryEdits([{ op: 'x' }]), /needs an actor/);

    // project cuts a bare string (doc_get's html), not only object fields.
    assert.equal(project('가'.repeat(300), { maxChars: 200 }), `${'가'.repeat(200)}…[+100 chars]`);

    // outPath exports: only content/<job>/<file>.json, never over a hand-written file.
    const { writeExport } = require('../../mcp/spec');
    const saved = writeExport('content/export-job/event.json', 'event_raw', { event: { id: 'x' } });
    assert.equal(saved.outPath, 'content/export-job/event.json');
    const file = JSON.parse(fs.readFileSync(path.join(work, 'content', 'export-job', 'event.json'), 'utf8'));
    assert.equal(file.mcpExport.tool, 'event_raw');
    assert.deepEqual(file.value, { event: { id: 'x' } });
    writeExport('content/export-job/event.json', 'event_raw', { again: true });
    assert.throws(() => writeExport('content/batch/spec.json', 'event_raw', {}), /not an earlier export/);
    for (const bad of ['reviews/x.json', 'content/x.json', 'content/job/../x.json', 'content/job/x.txt', 'content/.hidden/x.json']) {
        assert.throws(() => writeExport(bad, 'sql_read', {}), /outPath must be/, bad);
    }
    const allTools = require('../../mcp/index').tools;
    assert(allTools.find(t => t.name === 'event_raw').inputSchema.properties.outPath);
    assert(!allTools.find(t => t.name === 'editorial_batch').inputSchema.properties.outPath);

    // textEdits / timelineEdits expand into full-field updates from the stored row.
    const { expandTextEdits } = require('../../mcp/text-edits');
    const eventRow = { title_ko: '사건', title_en: 'Event', question_ko: '', question_en: '', summary_ko: '박헌영은 1955년 처형되었다.',
        summary_en: 'Pak was executed in 1955.', outcome_ko: '', outcome_en: '',
        body_ko: '## 배경\n\n원래 배경. 원래.\n\n## 결과\n\n결과 문단.', body_en: '## Background\n\nOld background.\n\n## Outcome\n\nOutcome text.',
        timeline: [{ title: { ko: 'a', en: 'a' }, country: ['ethiopia'], geo: { kind: 'point' } }, { title: { ko: 'b', en: 'b' }, country: ['ethiopia'] }] };
    const fakeClient = { query: async () => ({ rows: [JSON.parse(JSON.stringify(eventRow))] }) };
    const expanded = await expandTextEdits('history_event', { action: 'update', id: 'e', fields: { expectedRevision: 'r' },
        textEdits: [{ field: 'summary.ko', find: '1955년 처형', replace: '1956년 7월 처형' }],
        timelineEdits: [{ index: 0, set: { country: ['ethiopia', 'somalia'], geo: null } }] }, fakeClient);
    assert.deepEqual(expanded.fields.summary, { ko: '박헌영은 1956년 7월 처형되었다.', en: 'Pak was executed in 1955.' });
    assert.deepEqual(expanded.fields.timeline[0], { title: { ko: 'a', en: 'a' }, country: ['ethiopia', 'somalia'] });
    assert.deepEqual(expanded.fields.timeline[1], eventRow.timeline[1]);
    assert.equal(expanded.textEdits, undefined);
    const section = await expandTextEdits('history_event_section', { action: 'update', id: 'e',
        fields: { heading: { ko: '결과', en: 'Outcome' } }, textEdits: [{ field: 'body.en', find: 'Outcome text', replace: 'New outcome' }] }, fakeClient);
    assert.deepEqual(section.fields.body, { ko: '결과 문단.', en: 'New outcome.' });
    await assert.rejects(expandTextEdits('history_event_section', { action: 'update', id: 'e', fields: { heading: { ko: '배경', en: 'Background' } },
        textEdits: [{ field: 'body.ko', find: '원래', replace: '새' }] }, fakeClient), /occurs 2 times/);
    await assert.rejects(expandTextEdits('history_event', { action: 'update', id: 'e', textEdits: [{ field: 'body.ko', find: 'x', replace: 'y' }] }, fakeClient), /field must be/);
    await assert.rejects(expandTextEdits('history_event', { action: 'update', id: 'e', fields: { summary: { ko: 'x', en: 'y' } },
        textEdits: [{ field: 'summary.ko', find: '1955', replace: '1956' }] }, fakeClient), /also sent/);
    await assert.rejects(expandTextEdits('history_event', { action: 'update', id: 'e', timelineEdits: [{ index: 5, set: { country: [] } }] }, fakeClient), /index must be/);
    await assert.rejects(expandTextEdits('term', { action: 'create', id: 't', textEdits: [{ field: 'body.ko', find: 'a', replace: 'b' }] }, fakeClient), /apply to an update/);
    await assert.rejects(expandTextEdits('person', { action: 'update', id: 'p', timelineEdits: [{ index: 0, set: { a: 1 } }] }, fakeClient), /apply to history_event/);
    const untouched = { action: 'update', id: 'e', fields: {} };
    assert.equal(await expandTextEdits('history_event', untouched, fakeClient), untouched);

    fs.rmSync(work, { recursive: true, force: true });
    console.log('commulingo mcp helpers ok');
})().catch(err => { console.error(err); process.exitCode = 1; });
