const express = require('express');
const { setPublicDataCache, setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const { asyncHandler } = require('../utils/async-handler');
const { loadCommuLingoCatalog, loadCommuLingoLesson, currentVersion } = require('../data/commulingo/shards');
const { localize } = require('../data/commulingo/localize');
const { getLinkIndexes } = require('../data/commulingo/linkify');
const { bookPageData, linkifyLessonPayload } = require('../data/commulingo/book-page');

// Books, the lesson catalog, and lesson payloads. The page data and the
// lesson linkifier live in data/commulingo/book-page.js.

const router = express.Router();

router.get('/book/:collectionId', async (req, res) => {
    try {
        const collectionId = typeof req.params.collectionId === 'string' ? req.params.collectionId.trim() : '';
        const catalog = loadCommuLingoCatalog();
        const collection = (catalog.collections || []).find(item => item.id === collectionId);
        if (!collection) return res.redirect('/commulingo');

        // Linked chapters, dictionary chips, and the decision-link payload are
        // pure functions of (collection, link indexes, lang); the chip list
        // alone walks every lesson shard (~104 files, ~225ms measured for
        // capital-vol3), so rebuild only when those references change and
        // serve the memoized result otherwise. On a linkify failure the page
        // renders plain and uncached, so the next request retries.
        let pageData;
        try {
            pageData = await bookPageData(collection, res.locals.lang);
        } catch (err) {
            console.error('commulingo book linkify:', err);
            pageData = {
                linked: collection,
                dictionaryEntries: { people: [], terms: [], events: [], docs: [] },
                decisionLinks: { blocked: [], people: [] },
            };
        }

        const bookTitle = localize(collection.title, res.locals.lang);
        res.render('public/commulingo-book', {
            lessons: { version: catalog.version, collections: [pageData.linked] },
            dictionaryEntries: pageData.dictionaryEntries,
            decisionLinks: pageData.decisionLinks,
            bookFormat: collection.format || 'quiz',
            bookTitle,
            bookDescription: localize(collection.description, res.locals.lang),
            pageTitle: bookTitle,
            pageDescription: localize(collection.description, res.locals.lang) || res.locals.strings.commuLingo.description,
            pagePath: `/commulingo/book/${collection.id}`,
            jsonLd: commuLingoBreadcrumb(res.locals.lang, [
                { name: bookTitle, href: `/commulingo/book/${collection.id}` },
            ]),
        });
    } catch (err) {
        console.error('commulingo book:', err);
        commuLingoLoadError(res, { message: { ko: '책 정보를 불러올 수 없습니다.', en: 'Failed to load book data.' } });
    }
});

// The catalog is a ~300KB object; serialize it once per catalog reference
// instead of on every request.
const catalogJsonMemo = new WeakMap(); // catalog -> serialized body

router.get('/catalog.json', (req, res) => {
    const catalog = loadCommuLingoCatalog();
    setPublicDataCache(req, res, catalog.version);
    let body = catalogJsonMemo.get(catalog);
    if (!body) {
        body = JSON.stringify(catalog);
        catalogJsonMemo.set(catalog, body);
    }
    res.type('application/json').send(body);
});

// Linkified lesson payloads (~58ms each to build: shard parse + ko/en linkify
// of every brief/map/explanation), memoized until the shards version or the
// link indexes change. A linkify failure is served plain and left uncached so
// the next request retries.
// Keyed on the index object so a rotated index set releases the generation
// (a plain Map with indexesRef pinned it until each lesson was next requested).
const lessonPayloadMemo = new WeakMap(); // indexes -> Map(lessonId -> { version, payload })

router.get('/lesson/:lessonId', asyncHandler(async (req, res) => {
    const lessonId = typeof req.params.lessonId === 'string' ? req.params.lessonId.trim() : '';
    const version = currentVersion();
    const indexes = await getLinkIndexes('ko'); // both langs invalidate together
    let generation = lessonPayloadMemo.get(indexes);
    if (!generation) {
        generation = new Map();
        lessonPayloadMemo.set(indexes, generation);
    }
    const cached = generation.get(lessonId);
    let payload;
    if (cached && cached.version === version) {
        payload = cached.payload;
    } else {
        payload = loadCommuLingoLesson(lessonId);
        if (!payload) return res.status(404).json({ error: 'lesson not found' });
        try {
            await linkifyLessonPayload(payload.lesson);
            generation.set(lessonId, { version, payload });
        } catch (err) {
            // Losing the links costs a hyperlink; losing the payload costs the
            // quiz. Serve it plain.
            console.error('commulingo lesson linkify:', err);
        }
    }
    // Deliberately not setPublicDataCache: the payload is no longer a pure
    // function of the course sources, so its year-long immutable branch would
    // freeze the links against dictionaries that keep changing. Thirty seconds
    // is what the glossary and people pages already serve.
    setShortPublicCache(res);
    res.json(payload);
}));

module.exports = router;
