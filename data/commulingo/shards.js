const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { loadCommuLingoBundle } = require('./index');

const LESSONS_PATH = path.join(__dirname, 'lessons.json');
const COURSES_DIR = path.join(__dirname, 'courses');
const GENERATED_DIR = path.join(__dirname, 'generated');
const LESSONS_DIR = path.join(GENERATED_DIR, 'lessons');
const CATALOG_PATH = path.join(GENERATED_DIR, 'catalog.json');
const MANIFEST_PATH = path.join(GENERATED_DIR, 'manifest.json');

const PUBLIC_CHAPTER_LIMITS = {
    'capital-vol1': 33,
    'capital-vol2': 21,
    'capital-vol3': 52,
    'lenin-imperialism': 10,
    'lenin-state-revolution': 6,
    'marx-wage-labour-capital': 6,
    'marx-wages-and-programme': 8,
};

let freshnessCache = null;

function statMtimeMs(filePath) {
    return fs.statSync(filePath).mtimeMs;
}

function sourceFiles() {
    // This module shapes the shard payloads, so its own content is part of the
    // digest: a logic change must invalidate shards built by older code.
    const files = [__filename, LESSONS_PATH];
    if (fs.existsSync(COURSES_DIR)) {
        for (const name of fs.readdirSync(COURSES_DIR).filter(name => name.endsWith('.js')).sort()) {
            files.push(path.join(COURSES_DIR, name));
        }
    }
    return files;
}

function sourceMtimeMs(files = sourceFiles()) {
    return Math.max(...files.map(statMtimeMs));
}

function sourceDigest(files = sourceFiles()) {
    const hash = crypto.createHash('sha256');
    for (const filePath of files) {
        hash.update(filePath);
        hash.update('\0');
        hash.update(fs.readFileSync(filePath));
        hash.update('\0');
    }
    return hash.digest('hex').slice(0, 16);
}

function currentVersion() {
    return ensureCommuLingoShards().version;
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
    fs.writeFileSync(filePath, JSON.stringify(value));
}

function ensureDir() {
    fs.mkdirSync(LESSONS_DIR, { recursive: true });
}

function isSafeLessonId(lessonId) {
    return typeof lessonId === 'string' && /^[A-Za-z0-9_-]+$/.test(lessonId);
}

function lessonPath(lessonId) {
    if (!isSafeLessonId(lessonId)) return null;
    return path.join(LESSONS_DIR, lessonId + '.json');
}

function lessonQuestionCount(lesson) {
    return Array.isArray(lesson.questions) ? lesson.questions.length : 0;
}

function publicCollections(bundle) {
    return (bundle.collections || [])
        .map(collection => {
            const chapterLimit = PUBLIC_CHAPTER_LIMITS[collection.id] || 0;
            return {
                ...collection,
                chapters: (collection.chapters || []).filter(chapter => (
                    chapterLimit > 0 && Number(chapter.chapterNumber) <= chapterLimit
                )),
            };
        })
        .filter(collection => collection.chapters.length > 0 || collection.conceptGraph || collection.decisionTimeline);
}

function publicLessonPayload(collection, chapter, lesson) {
    return {
        id: lesson.id,
        collectionId: collection.id,
        collectionTitle: collection.title,
        chapterNumber: chapter.chapterNumber,
        chapterTitle: chapter.title,
        title: lesson.title,
        level: lesson.level,
        summary: chapter.summary,
        focus: chapter.learningFocus,
        conceptBrief: chapter.conceptBrief,
        conceptMap: chapter.conceptMap,
        diagram: chapter.diagram,
        questions: lesson.questions || [],
    };
}

function buildPayloads(bundle, version) {
    const lessons = [];
    const catalog = {
        version,
        collections: publicCollections(bundle).map(collection => ({
            id: collection.id,
            volumeNumber: collection.volumeNumber,
            title: collection.title,
            badge: collection.badge,
            description: collection.description,
            bookTitle: collection.bookTitle,
            format: collection.format,
            conceptGraph: collection.conceptGraph,
            decisionTimeline: collection.decisionTimeline,
            chapters: (collection.chapters || []).map(chapter => ({
                id: chapter.id,
                volumeNumber: chapter.volumeNumber,
                chapterNumber: chapter.chapterNumber,
                partNumber: chapter.partNumber,
                partTitle: chapter.partTitle,
                title: chapter.title,
                summary: chapter.summary,
                sourceUrl: chapter.sourceUrl,
                learningFocus: chapter.learningFocus,
                lessons: (chapter.lessons || []).map(lesson => {
                    if (lesson && lesson.id) {
                        lessons.push(publicLessonPayload(collection, chapter, lesson));
                    }
                    return {
                        id: lesson.id,
                        level: lesson.level,
                        title: lesson.title,
                        questionCount: lessonQuestionCount(lesson),
                    };
                }),
            })),
        })),
    };
    return { catalog, lessons };
}

function removeStaleLessonFiles(activeIds) {
    if (!fs.existsSync(LESSONS_DIR)) return;
    for (const name of fs.readdirSync(LESSONS_DIR)) {
        if (!name.endsWith('.json')) continue;
        const lessonId = name.slice(0, -5);
        if (!activeIds.has(lessonId)) fs.unlinkSync(path.join(LESSONS_DIR, name));
    }
}

function readManifest() {
    try {
        return readJson(MANIFEST_PATH);
    } catch (err) {
        return null;
    }
}

function generatedFilesExist() {
    return fs.existsSync(CATALOG_PATH) && fs.existsSync(LESSONS_DIR);
}

function buildCommuLingoShards() {
    ensureDir();
    const files = sourceFiles();
    const digest = sourceDigest(files);
    const loaded = loadCommuLingoBundle();
    const version = digest;
    const { catalog, lessons } = buildPayloads(loaded.bundle, version);
    const activeIds = new Set();

    writeJson(CATALOG_PATH, catalog);
    for (const lesson of lessons) {
        if (!isSafeLessonId(lesson.id)) {
            throw new Error('Unsafe CommuLingo lesson id: ' + lesson.id);
        }
        activeIds.add(lesson.id);
        writeJson(lessonPath(lesson.id), { version, lesson });
    }
    removeStaleLessonFiles(activeIds);
    writeJson(MANIFEST_PATH, {
        version,
        sourceDigest: digest,
        sourceMtimeMs: sourceMtimeMs(files),
        lessonCount: lessons.length,
        generatedAt: new Date().toISOString(),
    });
    freshnessCache = { sourceMtimeMs: sourceMtimeMs(files), version, fresh: true, checkedAt: Date.now() };
    return { version, lessonCount: lessons.length, catalogPath: CATALOG_PATH, lessonsDir: LESSONS_DIR };
}

// How long a freshness verdict is trusted before the source files are
// re-stat'ed. Callers hit this several times per request (catalog + link
// indexes), so without the debounce every request pays a readdir + ~9 stats.
const FRESHNESS_RECHECK_MS = 1000;

function ensureCommuLingoShards() {
    if (freshnessCache && freshnessCache.fresh
        && Date.now() - (freshnessCache.checkedAt || 0) < FRESHNESS_RECHECK_MS) {
        return { version: freshnessCache.version };
    }
    const files = sourceFiles();
    const mtimeMs = sourceMtimeMs(files);
    if (freshnessCache && freshnessCache.fresh && freshnessCache.sourceMtimeMs === mtimeMs) {
        freshnessCache.checkedAt = Date.now();
        return { version: freshnessCache.version };
    }

    const manifest = readManifest();
    if (manifest && generatedFilesExist()) {
        if (manifest.sourceMtimeMs === mtimeMs) {
            freshnessCache = { sourceMtimeMs: mtimeMs, version: manifest.version, fresh: true, checkedAt: Date.now() };
            return { version: manifest.version };
        }
        const digest = sourceDigest(files);
        if (manifest.sourceDigest === digest) {
            freshnessCache = { sourceMtimeMs: mtimeMs, version: manifest.version, fresh: true, checkedAt: Date.now() };
            return { version: manifest.version };
        }
    }

    return buildCommuLingoShards();
}

// The parsed catalog is cached by file mtime so repeat callers get the SAME
// object back. Reference identity matters beyond speed: linkify.js memoizes
// its link indexes (and the 1200-person normalization) against the catalog
// reference, so returning a fresh parse per call silently rebuilt all of that
// on every report/person/term request. A regenerated catalog file changes the
// mtime, which invalidates this cache and those memos together.
let catalogCache = null; // { mtimeMs, data }

function loadCommuLingoCatalog() {
    ensureCommuLingoShards();
    const mtimeMs = statMtimeMs(CATALOG_PATH);
    if (!catalogCache || catalogCache.mtimeMs !== mtimeMs) {
        catalogCache = { mtimeMs, data: readJson(CATALOG_PATH) };
    }
    return catalogCache.data;
}

function loadCommuLingoLesson(lessonId) {
    ensureCommuLingoShards();
    const filePath = lessonPath(lessonId);
    if (!filePath || !fs.existsSync(filePath)) return null;
    return readJson(filePath);
}

module.exports = {
    buildCommuLingoShards,
    currentVersion,
    ensureCommuLingoShards,
    loadCommuLingoCatalog,
    loadCommuLingoLesson,
};
