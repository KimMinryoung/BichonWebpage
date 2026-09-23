const { loadCommuLingoLesson, currentVersion } = require('./shards');
const { getLinkIndexes } = require('./linkify');
const { linkifyLessonPayload } = require('./book-page');

const catalogJsonMemo = new WeakMap();
const lessonPayloadMemo = new WeakMap(); // indexes -> Map(lessonId -> { version, payload })

function catalogBody(catalog) {
    let body = catalogJsonMemo.get(catalog);
    if (!body) {
        body = JSON.stringify(catalog);
        catalogJsonMemo.set(catalog, body);
    }
    return body;
}

async function lessonPayload(lessonId) {
    const version = currentVersion();
    const indexes = await getLinkIndexes('ko'); // both languages invalidate together
    let generation = lessonPayloadMemo.get(indexes);
    if (!generation) {
        generation = new Map();
        lessonPayloadMemo.set(indexes, generation);
    }
    const cached = generation.get(lessonId);
    if (cached && cached.version === version) return cached.payload;

    const payload = loadCommuLingoLesson(lessonId);
    if (!payload) return null;
    try {
        await linkifyLessonPayload(payload.lesson);
        generation.set(lessonId, { version, payload });
    } catch (err) {
        // A linking failure must not prevent a lesson from loading; retry later.
        console.error('commulingo lesson linkify:', err);
    }
    return payload;
}

module.exports = { catalogBody, lessonPayload };
