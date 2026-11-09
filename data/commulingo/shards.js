// Public CommuLingo payloads: the catalog (every public course with its
// chapter and lesson stubs) and one payload per lesson, built from the course
// bundle (index.js) and kept in memory per bundle version.
//
// A course is public up to its `publicChapterLimit` (a field of the course
// document; 0 or absent keeps it hidden), so publishing a chapter is a data
// write, not a code change. Until 2026-11-01 the limits were a constant here
// and the payloads were files under generated/, which the production, MCP and
// preview processes all rebuilt in one shared directory.
const crypto = require('crypto');
const fs = require('fs');
const { loadCommuLingoBundle } = require('./index');

// This module shapes the payloads, so its own source is part of the version:
// a logic change must not reuse URLs cached as immutable under the old shape.
const CODE_DIGEST = crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex').slice(0, 8);

let built = null; // { bundleVersion, version, catalog, lessons: Map(id -> JSON text) }

function lessonQuestionCount(lesson) {
    return Array.isArray(lesson.questions) ? lesson.questions.length : 0;
}

function publicCollections(bundle) {
    return (bundle.collections || [])
        .filter(collection => collection.visibility !== 'private')
        .map(collection => {
            const chapterLimit = Number(collection.publicChapterLimit) || 0;
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
        format: collection.format,
        noAutoLink: collection.noAutoLink,
        chapterNumber: chapter.chapterNumber,
        chapterTitle: chapter.title,
        title: lesson.title,
        level: lesson.level,
        summary: chapter.summary,
        focus: chapter.learningFocus,
        takeaway: chapter.takeaway,
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
            genealogy: collection.genealogy,
            bookTitle: collection.bookTitle,
            format: collection.format,
            category: collection.category,
            noAutoLink: collection.noAutoLink,
            conceptGraph: collection.conceptGraph,
            decisionTimeline: collection.decisionTimeline,
            factionGuide: collection.factionGuide,
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
                minutes: chapter.minutes,
                readings: chapter.readings,
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

function ensureCommuLingoShards() {
    const loaded = loadCommuLingoBundle();
    if (built && built.bundleVersion === loaded.version) return built;
    const version = crypto.createHash('sha256').update(`${loaded.version}:${CODE_DIGEST}`).digest('hex').slice(0, 16);
    const { catalog, lessons } = buildPayloads(loaded.bundle, version);
    // JSON round trips: callers decorate what they get (linkifyLessonPayload
    // links a lesson in place), which must never reach the bundle objects.
    built = {
        bundleVersion: loaded.version,
        version,
        catalog: JSON.parse(JSON.stringify(catalog)),
        lessons: new Map(lessons.map(lesson => [lesson.id, JSON.stringify({ version, lesson })])),
    };
    return built;
}

function currentVersion() {
    return ensureCommuLingoShards().version;
}

// The same object until a course changes: linkify.js memoizes its link
// indexes against this reference.
function loadCommuLingoCatalog() {
    return ensureCommuLingoShards().catalog;
}

// { version, lesson }, a fresh copy per call; null for an unknown id.
function loadCommuLingoLesson(lessonId) {
    const text = typeof lessonId === 'string' ? ensureCommuLingoShards().lessons.get(lessonId) : undefined;
    return text ? JSON.parse(text) : null;
}

// { [collection id]: ISO time } of each course document's last write
// (sitemap lastmod, book page dates).
function commuLingoBookModifiedTimes() {
    return { ...loadCommuLingoBundle().modifiedAt };
}

module.exports = {
    currentVersion,
    ensureCommuLingoShards,
    loadCommuLingoCatalog,
    loadCommuLingoLesson,
    publicLessonPayload,
    commuLingoBookModifiedTimes,
};
