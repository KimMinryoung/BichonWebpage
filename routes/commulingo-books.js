const express = require('express');
const { setPublicDataCache, setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const { asyncHandler } = require('../utils/async-handler');
const { loadCommuLingoCatalog } = require('../data/commulingo/shards');
const { localize } = require('../data/commulingo/localize');
const { bookPageData } = require('../data/commulingo/book-page');
const { catalogBody, lessonPayload } = require('../data/commulingo/book-response');

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

router.get('/catalog.json', (req, res) => {
    const catalog = loadCommuLingoCatalog();
    setPublicDataCache(req, res, catalog.version);
    res.type('application/json').send(catalogBody(catalog));
});

router.get('/lesson/:lessonId', asyncHandler(async (req, res) => {
    const lessonId = typeof req.params.lessonId === 'string' ? req.params.lessonId.trim() : '';
    const payload = await lessonPayload(lessonId);
    if (!payload) return res.status(404).json({ error: 'lesson not found' });
    // Deliberately not setPublicDataCache: the payload is no longer a pure
    // function of the course sources, so its year-long immutable branch would
    // freeze the links against dictionaries that keep changing. Thirty seconds
    // is what the glossary and people pages already serve.
    setShortPublicCache(res);
    res.json(payload);
}));

module.exports = router;
