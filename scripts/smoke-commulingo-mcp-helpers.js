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

const { project } = require('../mcp/view');
const { getPointer, applyPatches } = require('../mcp/pointer');
const { readSpecJson } = require('../mcp/spec');

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

    // specPath: only content/ and reviews/, no traversal, no symlink out.
    assert.deepEqual(readSpecJson('content/batch/spec.json'), { items: [1] });
    for (const bad of ['secret/key.json', '../secret/key.json', 'content/../secret/key.json', '/etc/passwd', 'content', 'content//x.json']) {
        assert.throws(() => readSpecJson(bad), /specPath must/, bad);
    }
    assert.throws(() => readSpecJson('content/batch/link.json'), /leaves its work directory/);
    assert.throws(() => readSpecJson('content/batch/missing.json'), /not found/);
    assert.throws(() => readSpecJson('content/batch/bad.json'), /not valid JSON/);

    // Write tools refuse malformed requests before opening a transaction.
    const { tools } = require('../mcp');
    const tool = name => tools.find(t => t.name === name);
    const ctx = { client: 'operator' };
    await assert.rejects(tool('editorial_batch').handler({}, ctx), /items or specPath/);
    await assert.rejects(tool('editorial_batch').handler({ items: [], specPath: 'content/batch/spec.json' }, ctx), /not both/);
    await assert.rejects(tool('people_upsert').handler({}, ctx), /people or specPath/);
    await assert.rejects(tool('registry_edit').handler({}, ctx), /ops or specPath/);
    await assert.rejects(tool('link_reviews_apply').handler({}, ctx), /manifest or specPath/);
    await assert.rejects(tool('data_document_put').handler({ key: 'k' }, ctx), /content or patches/);
    await assert.rejects(tool('doc_put').handler({ id: 'd', entry: {}, entryPatch: {} }, ctx), /entry or entryPatch/);
    await assert.rejects(tool('editorial_store').handler({ command: 'submit', target: 'term', request: { id: 'x', action: 'create', directApply: true, fields: {} }, changedBy: 'bad actor' }, ctx), /changedBy/);
    await assert.rejects(tool('sql_read').handler({ sql: 'DELETE FROM commulingo_people' }, ctx), /must start with SELECT/);
    await assert.rejects(tool('sql_read').handler({ sql: 'SELECT 1', params: [{}] }, ctx), /scalars/);
    const audits = await tool('audit_run').handler({}, ctx);
    assert.ok(audits.available.includes('audit-link-fires'), 'audit_run lists the audit scripts');
    await assert.rejects(tool('audit_run').handler({ name: 'deploy' }, ctx), /unknown audit/);
    await assert.rejects(tool('audit_run').handler({ name: 'audit-link-fires', args: ['ko; rm -rf /'] }, ctx), /plain tokens/);
    const { applyRegistryEdits, REGISTRY_OPS } = require('../data/commulingo/registry-edits');
    assert.ok(REGISTRY_OPS.includes('collection_member_add'));
    await assert.rejects(applyRegistryEdits([], { actor: 'x' }), /1–500 edits/);
    await assert.rejects(applyRegistryEdits([{ op: 'x' }]), /needs an actor/);

    fs.rmSync(work, { recursive: true, force: true });
    console.log('commulingo mcp helpers ok');
})().catch(err => { console.error(err); process.exitCode = 1; });
