// Large payloads (people batches, link-review manifests, document bodies) can be
// read from the gitignored work directories instead of being sent inline:
// specPath "content/<batch>/<file>" or "reviews/<file>". The primary
// container mounts scripts/content and scripts/reviews read-only under
// COMMULINGO_WORK_DIR (scripts/deploy); on the host the same paths resolve
// under scripts/. Nothing outside those two directories is readable.
const fs = require('fs');
const path = require('path');
const { str } = require('./schema');

const ROOT = process.env.COMMULINGO_WORK_DIR || path.join(__dirname, '..', 'scripts');
const DIRS = ['content', 'reviews'];
const MAX_BYTES = 20 * 1024 * 1024;

const specPathArg = str('Read the payload from this file instead: content/<path> (scripts/content) or reviews/<path> (scripts/reviews)', { maxLength: 400 });

function badRequest(message) {
    return Object.assign(new Error(message), { status: 400 });
}

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
        throw Object.assign(new Error(`specPath not found: ${specPath}`), { status: 404 });
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

module.exports = { specPathArg, readSpecFile, readSpecJson };
