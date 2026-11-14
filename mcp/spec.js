// Large payloads (people batches, link-review manifests, document bodies) can be
// read from the gitignored work directories instead of being sent inline:
// specPath "content/<batch>/<file>" or "reviews/<file>". The primary
// container mounts scripts/content and scripts/reviews read-only under
// COMMULINGO_WORK_DIR (scripts/deploy); on the host the same paths resolve
// under scripts/. Nothing outside those two directories is readable.
//
// Read tools can also save their result there (outPath "content/<job>/<file>.json",
// writeExport below) so a job builds its edits from the stored text instead of
// copying it out of a chat result by hand. The admin container mounts
// scripts/content writable for this; an export only ever creates a file or
// replaces an earlier export, never a hand-written work file.
const fs = require('fs');
const path = require('path');
const { str } = require('./schema');

const ROOT = process.env.COMMULINGO_WORK_DIR || path.join(__dirname, '..', 'scripts');
const DIRS = ['content', 'reviews'];
const MAX_BYTES = 20 * 1024 * 1024;

const specPathArg = str('Read the payload from this file instead: content/<path> (scripts/content) or reviews/<path> (scripts/reviews)', { maxLength: 400 });

const { badRequest } = require('./common');

function readSpecFile(specPath) {
    const parts = String(specPath).split('/');
    if (!DIRS.includes(parts[0]) || parts.length < 2 || parts.some(part => !part || part === '.' || part === '..')) {
        throw badRequest('specPath must be content/<path> or reviews/<path> without . or .. segments');
    }
    const dir = path.join(ROOT, parts[0]);
    let real;
    try {
        real = fs.realpathSync(path.join(ROOT, ...parts));
    } catch {
        throw badRequest(`specPath not found: ${specPath}`, 404);
    }
    if (!real.startsWith(fs.realpathSync(dir) + path.sep)) throw badRequest('specPath leaves its work directory');
    const stat = fs.statSync(real);
    if (!stat.isFile() || stat.size > MAX_BYTES) throw badRequest(`specPath must be a file of at most ${MAX_BYTES} bytes`);
    return fs.readFileSync(real, 'utf8');
}

function readSpecJson(specPath) {
    try {
        return JSON.parse(readSpecFile(specPath));
    } catch (err) {
        if (err.status) throw err;
        throw badRequest(`specPath is not valid JSON: ${err.message}`);
    }
}

const outPathArg = str('Save the whole result to this file instead of returning it: content/<job>/<file>.json (scripts/content). '
    + 'Returns {outPath, bytes}; the file holds {mcpExport: {tool, at}, value}. Replaces only an earlier export.', { maxLength: 400 });

function writeExport(outPath, tool, value) {
    const parts = String(outPath).split('/');
    if (parts[0] !== 'content' || parts.length < 3 || parts.some(part => !part || part === '.' || part === '..' || part.startsWith('.'))
        || !/\.json$/.test(parts[parts.length - 1])) {
        throw badRequest('outPath must be content/<job>/<file>.json without . or .. segments');
    }
    const dir = path.join(ROOT, 'content');
    const target = path.join(ROOT, ...parts);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (!fs.realpathSync(path.dirname(target)).startsWith(fs.realpathSync(dir) + path.sep)) throw badRequest('outPath leaves its work directory');
    if (fs.existsSync(target)) {
        let previous = null;
        try { previous = JSON.parse(fs.readFileSync(target, 'utf8')); } catch { /* not an export */ }
        if (!previous || typeof previous !== 'object' || !previous.mcpExport) throw badRequest(`outPath ${outPath} exists and is not an earlier export; choose another name`, 409);
    }
    const text = JSON.stringify({ mcpExport: { tool, at: new Date().toISOString() }, value }, null, 1) + '\n';
    fs.writeFileSync(target, text);
    return { outPath, bytes: Buffer.byteLength(text) };
}

module.exports = { specPathArg, readSpecFile, readSpecJson, outPathArg, writeExport };
