#!/usr/bin/env node
// utils/atomic-write.js: the file is replaced whole, missing folders are made,
// and a failed write leaves neither a partial file nor a temporary one.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { writeFileAtomicSync, writeFileAtomic } = require('../../utils/atomic-write');

(async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atomic-write-'));
    const file = path.join(dir, 'sub', 'a.json');
    writeFileAtomicSync(file, 'one');
    await writeFileAtomic(file, 'two', { mode: 0o600 });
    assert.equal(fs.readFileSync(file, 'utf8'), 'two');
    assert.equal(fs.statSync(file).mode & 0o777, 0o600);
    // Concurrent writers each rename their own temporary file.
    await Promise.all(Array.from({ length: 8 }, (_, i) => writeFileAtomic(file, String(i).repeat(1000))));
    assert.match(fs.readFileSync(file, 'utf8'), /^(\d)\1{999}$/);
    // The target is a directory: the rename fails, the temporary file goes.
    const target = path.join(dir, 'sub', 'dir');
    fs.mkdirSync(path.join(target, 'x'), { recursive: true });
    assert.throws(() => writeFileAtomicSync(target, 'x'));
    await assert.rejects(writeFileAtomic(target, 'x'));
    assert.deepEqual(fs.readdirSync(path.join(dir, 'sub')).sort(), ['a.json', 'dir']);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('test-atomic-write: ok');
})().catch(err => { console.error(err); process.exitCode = 1; });
