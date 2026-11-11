// Write a file so readers see the old content or the new, never a partial
// one: write a temporary file beside it, then rename it into place. The
// temporary name is unique per call, so two processes (the app, its standby
// during a deploy, the admin process) writing the same file cannot rename
// each other's half-written file; a failed write removes its temporary file.
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const temporaryFor = file => `${file}.${process.pid}.${crypto.randomUUID().slice(0, 8)}.tmp`;

function writeFileAtomicSync(file, data, options) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const temporary = temporaryFor(file);
    try {
        fs.writeFileSync(temporary, data, options);
        fs.renameSync(temporary, file);
    } catch (err) {
        try { fs.unlinkSync(temporary); } catch { /* never written */ }
        throw err;
    }
}

async function writeFileAtomic(file, data, options) {
    await fs.promises.mkdir(path.dirname(file), { recursive: true });
    const temporary = temporaryFor(file);
    try {
        await fs.promises.writeFile(temporary, data, options);
        await fs.promises.rename(temporary, file);
    } catch (err) {
        await fs.promises.unlink(temporary).catch(() => {});
        throw err;
    }
}

module.exports = { writeFileAtomicSync, writeFileAtomic };
