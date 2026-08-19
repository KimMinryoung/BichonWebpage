const fs = require('fs');
const path = require('path');

// The Politburo membership dataset (data/commulingo/politburo.json): a member
// registry with tenure spans, era sections over it, and per-congress tables.
// Like the genealogy charts it lives under the host-mounted data/ directory
// and is cached by file mtime, so correcting a date or filling in a person id
// needs no image rebuild.
const FILE = path.join(__dirname, 'politburo.json');

let cache = null; // { mtimeMs, data }

function loadPolitburo() {
    const stat = fs.statSync(FILE);
    if (!cache || cache.mtimeMs !== stat.mtimeMs) {
        cache = { mtimeMs: stat.mtimeMs, data: JSON.parse(fs.readFileSync(FILE, 'utf8')) };
    }
    return cache.data;
}

module.exports = { loadPolitburo };
