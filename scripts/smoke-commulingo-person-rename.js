// Pure checks for the person-id rename tool: batch validation and the rewrite
// of host-mounted data files keyed by person id. The DB half is covered by
// scripts/test-commulingo-person-rename-db.js against an isolated database.
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
    validateRenames, renameInPolitburo, renameInDocsManifest, renameInGenealogy,
    renameInDataFiles, findLeftoverReferences,
} = require('../data/commulingo/person-rename');

assert.throws(() => validateRenames([]), /non-empty/);
assert.throws(() => validateRenames([{ from: 'Lech-Wa-sa', to: 'lech-walesa' }]), /invalid rename/);
assert.throws(() => validateRenames([{ from: 'a', to: 'a' }]), /itself/);
assert.throws(() => validateRenames([{ from: 'a', to: 'b' }, { from: 'c', to: 'b' }]), /duplicate/);
assert.throws(() => validateRenames([{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }]), /both a source and a target/);
validateRenames([{ from: 'lech-wa-sa', to: 'lech-walesa' }, { from: 'ern-ger', to: 'erno-gero' }]);

const map = new Map([['lech-wa-sa', 'lech-walesa']]);

const politburo = renameInPolitburo({
    intro: 'lech-wa-sa stays prose',
    members: { 'lech-wa-sa': { spans: [] }, other: { spans: [] } },
    eras: [{ list: ['other', 'lech-wa-sa'] }],
    congresses: [{ members: { full: [{ p: 'lech-wa-sa' }] } }],
}, map);
assert.deepEqual(Object.keys(politburo.members), ['lech-walesa', 'other']);
assert.deepEqual(politburo.eras[0].list, ['other', 'lech-walesa']);
assert.equal(politburo.congresses[0].members.full[0].p, 'lech-walesa');
assert.equal(politburo.intro, 'lech-wa-sa stays prose');

const manifest = renameInDocsManifest({ redirects: { x: {} }, docs: [
    { id: 'd1', people: ['lech-wa-sa', { id: 'lech-wa-sa', name: {} }, 'other'], terms: ['lech-wa-sa'] },
    { id: 'd2' },
] }, map);
assert.deepEqual(manifest.docs[0].people, ['lech-walesa', { id: 'lech-walesa', name: {} }, 'other']);
assert.deepEqual(manifest.docs[0].terms, ['lech-wa-sa'], 'term refs are not person ids');
assert.deepEqual(manifest.docs[1], { id: 'd2' });

const chart = renameInGenealogy({ nodes: [
    { ref: { type: 'person', id: 'lech-wa-sa' } }, { ref: { type: 'term', id: 'lech-wa-sa' } },
] }, map);
assert.equal(chart.nodes[0].ref.id, 'lech-walesa');
assert.equal(chart.nodes[1].ref.id, 'lech-wa-sa');

// File rewrite: own indentation kept, unchanged files untouched, a layout the
// serializer would not reproduce is reported instead of reformatted.
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'person-rename-'));
try {
    fs.mkdirSync(path.join(root, 'genealogy'));
    const write = (rel, text) => fs.writeFileSync(path.join(root, rel), text);
    write('politburo.json', JSON.stringify({ members: { 'lech-wa-sa': {} }, eras: [], congresses: [] }, null, 1) + '\n');
    write('genealogy/hand.json', '{"nodes": [{"ref": {"type": "person", "id": "lech-wa-sa"}}]}\n');
    write('elsewhere.json', '{"see": "lech-wa-sa"}');
    const renames = [{ from: 'lech-wa-sa', to: 'lech-walesa' }];

    const planned = renameInDataFiles(renames, { root, dryRun: true });
    assert.deepEqual(planned.changed, [path.join(root, 'politburo.json')]);
    assert.deepEqual(planned.manual, [path.join(root, 'genealogy/hand.json')]);
    assert.match(fs.readFileSync(path.join(root, 'politburo.json'), 'utf8'), /lech-wa-sa/, 'dry run writes nothing');

    renameInDataFiles(renames, { root });
    assert.equal(fs.readFileSync(path.join(root, 'politburo.json'), 'utf8'),
        JSON.stringify({ members: { 'lech-walesa': {} }, eras: [], congresses: [] }, null, 1) + '\n');
    assert.deepEqual(findLeftoverReferences(renames, { root }).map(h => path.relative(root, h.file)).sort(),
        ['elsewhere.json', 'genealogy/hand.json']);
} finally {
    fs.rmSync(root, { recursive: true, force: true });
}

console.log('person rename smoke: ok');
