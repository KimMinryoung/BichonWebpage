// What a test needs from the machine it runs on, declared in its header and
// checked by the runner (tests/run.js) before the test starts. A test whose
// needs are not met is skipped with the reason instead of failing:
//
//   // @requires live-data
//   // @requires isolated-db env:DB_HOST=commulingo-activity-test
//
// Tags (several per line, several lines allowed, within the first 40 lines):
//   live-data      the live data-document snapshot, not the frozen seed of a
//                  lone clone (data/commulingo/data-documents-snapshot.json)
//   database       a configured database (.env or DB_HOST) — tests that read
//                  the real database and roll back their writes
//   isolated-db    COMMULINGO_ISOLATED_TEST=1 and DB_NAME=commulingo_integrity_test
//                  (dev_docs/commulingo-database.md)
//   browser        a Chromium Playwright can launch (tests/lib/browser.js)
//   env:NAME       NAME is set; env:NAME=VALUE — set to exactly VALUE
//   server:NAME=URL  the server at $NAME (default URL) answers within 3 s
// An unknown tag fails the test: a typo must not quietly skip it.
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');

function declaredRequirements(file) {
    const tags = [];
    for (const line of fs.readFileSync(file, 'utf8').split('\n', 40)) {
        const match = line.match(/^\s*\/\/\s*@requires\s+(.+?)\s*$/);
        if (match) tags.push(...match[1].split(/\s+/));
    }
    return tags;
}

const NAMED = {
    'live-data': () => {
        const file = process.env.COMMULINGO_DATA_DOCUMENTS_SNAPSHOT
            || path.join(ROOT, 'data', 'commulingo', 'data-documents-snapshot.json');
        return fs.existsSync(file) ? null : 'no live data-document snapshot (this clone reads the frozen seed)';
    },
    database: () => (process.env.DB_HOST || fs.existsSync(path.join(ROOT, '.env'))
        ? null : 'no database configured (.env or DB_HOST)'),
    'isolated-db': () => (process.env.COMMULINGO_ISOLATED_TEST === '1' && process.env.DB_NAME === 'commulingo_integrity_test'
        ? null : 'needs COMMULINGO_ISOLATED_TEST=1 and DB_NAME=commulingo_integrity_test'),
    browser: () => require('./browser').chromiumMissing(),
};

function answers(url) {
    const client = url.startsWith('https:') ? require('node:https') : require('node:http');
    return new Promise(resolve => {
        const request = client.get(url, { timeout: 3000 }, response => { response.resume(); resolve(true); });
        request.on('timeout', () => request.destroy());
        request.on('error', () => resolve(false));
    });
}

// Resolves to null when the tag is met, otherwise the reason. Throws on an
// unknown tag.
async function unmet(tag) {
    if (NAMED[tag]) return NAMED[tag]();
    let match = tag.match(/^env:([A-Z][A-Z0-9_]*)(?:=(.*))?$/);
    if (match) {
        const value = process.env[match[1]];
        if (!value) return match[1] + ' is not set';
        return match[2] !== undefined && value !== match[2] ? match[1] + ' is not ' + match[2] : null;
    }
    match = tag.match(/^server:([A-Z][A-Z0-9_]*)=(\S+)$/);
    if (match) {
        const url = process.env[match[1]] || match[2];
        return (await answers(url)) ? null : 'no server at ' + url + ' (set ' + match[1] + ')';
    }
    throw new Error('unknown @requires tag ' + tag);
}

module.exports = { declaredRequirements, unmet };
