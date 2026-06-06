const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LESSONS_PATH = path.join(__dirname, 'lessons.json');
const COURSES_DIR = path.join(__dirname, 'courses');

let bundleCache = null;

function statMtimeMs(filePath) {
    return fs.statSync(filePath).mtimeMs;
}

function courseFiles() {
    if (!fs.existsSync(COURSES_DIR)) return [];
    return fs.readdirSync(COURSES_DIR)
        .filter(name => name.endsWith('.js'))
        .sort()
        .map(name => path.join(COURSES_DIR, name));
}

function sourceDigest(files) {
    const hash = crypto.createHash('sha256');
    for (const filePath of files) {
        hash.update(filePath);
        hash.update('\0');
        hash.update(fs.readFileSync(filePath));
        hash.update('\0');
    }
    return hash.digest('hex').slice(0, 16);
}

function loadCourse(filePath) {
    delete require.cache[require.resolve(filePath)];
    const course = require(filePath);
    if (!course || typeof course !== 'object') {
        throw new Error(`CommuLingo course module must export an object: ${filePath}`);
    }
    return course;
}

function loadCommuLingoBundle() {
    const files = [LESSONS_PATH, ...courseFiles()];
    const mtimeMs = Math.max(...files.map(statMtimeMs));
    if (bundleCache && bundleCache.mtimeMs === mtimeMs) return bundleCache;

    const version = sourceDigest(files);
    const base = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));
    const extraCollections = files.slice(1).map(loadCourse);
    const collections = [
        ...(base.collections || []),
        ...extraCollections,
    ];

    bundleCache = {
        mtimeMs,
        version,
        bundle: {
            ...base,
            version,
            collections,
        },
    };
    return bundleCache;
}

module.exports = { loadCommuLingoBundle };
