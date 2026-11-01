// The CommuLingo course bundle: every learning course ("collection") the site
// serves, in key order.
//
// Since 2026-11-01 each course is one database data document,
// `course/<collection id>` in commulingo_data_documents (data-documents.js),
// so a correction or a new course is an MCP write (data_document_put, with
// validation, revisions and the audit log) and needs neither a commit nor a
// deploy. Before that they were git files: lessons.json (Capital, volumes
// 1–3) and courses/<id>.js.
//
// Where no course document exists (a lone clone: no database, no snapshot)
// the bundle falls back to the frozen seed in
// tests/fixtures/commulingo-courses-seed.json, a few representative courses
// that are not updated when the courses change. scripts/test always uses the
// seed (COMMULINGO_COURSES_SEED=1) so the tests do not depend on live content;
// a write is checked against the content rules by course-validation.js.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const COURSE_PREFIX = 'course/';
const SEED_PATH = path.join(__dirname, '..', '..', 'tests', 'fixtures', 'commulingo-courses-seed.json');

let seedCache = null;
let bundleCache = null;

function seedEntries() {
    if (!seedCache) {
        let rows = [];
        try {
            rows = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
        } catch (err) {
            console.error('[commulingo courses] no course documents and no seed:', err.message);
        }
        seedCache = rows.map(row => ({ key: row.key, content: row.content, revision: row.revision || 1, updatedAt: row.updatedAt || null }));
    }
    return seedCache;
}

function courseEntries() {
    if (process.env.COMMULINGO_COURSES_SEED === '1') return seedEntries();
    // Required here, not at the top: the seed (tests) needs no database pool.
    const entries = require('./data-documents').listDataDocuments(COURSE_PREFIX);
    return entries.length ? entries : seedEntries();
}

function signatureOf(entries) {
    return entries.map(entry => `${entry.key}:${entry.revision}:${entry.updatedAt || ''}`).join('|');
}

function contentDigest(entries) {
    const hash = crypto.createHash('sha256');
    for (const entry of entries) {
        hash.update(entry.key);
        hash.update('\0');
        hash.update(JSON.stringify(entry.content));
        hash.update('\0');
    }
    return hash.digest('hex').slice(0, 16);
}

// { version, bundle: { version, collections }, modifiedAt: { [id]: ISO } }.
// The same object comes back until a course document changes.
function loadCommuLingoBundle() {
    const entries = courseEntries();
    const signature = signatureOf(entries);
    if (bundleCache && bundleCache.signature === signature) return bundleCache;

    const version = contentDigest(entries);
    const modifiedAt = {};
    const collections = entries.map(entry => {
        const course = entry.content;
        if (course && course.id && entry.updatedAt) modifiedAt[course.id] = entry.updatedAt;
        return course;
    });
    bundleCache = {
        signature,
        version,
        modifiedAt,
        bundle: { version, collections },
    };
    return bundleCache;
}

function courseKey(collectionId) {
    return COURSE_PREFIX + collectionId;
}

module.exports = { loadCommuLingoBundle, courseKey, COURSE_PREFIX };
