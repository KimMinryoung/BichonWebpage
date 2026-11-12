const express = require('express');
const seo = require('../utils/seo');
const { courseJsonLd } = require('../data/commulingo/structured-data');
const { summarizeBooks, groupBooks } = require('../data/commulingo/book-summary');
const { setPublicDataCache, setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const { asyncHandler } = require('../utils/async-handler');
const { loadCommuLingoCatalog } = require('../data/commulingo/shards');
const { localize } = require('../data/commulingo/localize');
const { bookPageData, decisionRefs, lessonStoryMap } = require('../data/commulingo/book-page');
const { catalogBody, lessonPayload } = require('../data/commulingo/book-response');
const { getGenealogyChart } = require('../data/commulingo/genealogy-store');
const { loadCommuLingoPeople } = require('../data/commulingo/people-store');
const { collectionPosition } = require('../data/commulingo/person-position');

// Books, the lesson catalog, and lesson payloads. The page data and the
// lesson linkifier live in data/commulingo/book-page.js.

const router = express.Router();

// Books folded into another book keep their old address working.
const MERGED_BOOKS = {
    'french-revolution-documents': 'french-revolution-intro', // part 4 since 2026-09-27
};

// A faction-map group names a person position collection (group.position);
// the map shows that collection's colour, icon and title, as person cards do.
async function factionPositions(guide, lang) {
    const wanted = new Set((guide.layers || []).flatMap(layer => (layer.groups || []).map(group => group.position)).filter(Boolean));
    if (!wanted.size) return {};
    try {
        const { data } = await loadCommuLingoPeople();
        return Object.fromEntries((data.collections || []).filter(c => wanted.has(c.id)).map(c => [c.id, {
            position: collectionPosition(c.id),
            icon: c.icon || '',
            title: localize(c.title, lang),
            href: `/commulingo/people?position=${encodeURIComponent(c.id)}`,
        }]));
    } catch (err) {
        console.error('commulingo faction positions:', err.message);
        return {};
    }
}

router.get('/book/:collectionId', async (req, res) => {
    try {
        const collectionId = typeof req.params.collectionId === 'string' ? req.params.collectionId.trim() : '';
        const catalog = loadCommuLingoCatalog();
        const collection = (catalog.collections || []).find(item => item.id === collectionId);
        if (!collection && MERGED_BOOKS[collectionId]) return res.redirect(301, `/commulingo/book/${MERGED_BOOKS[collectionId]}`);
        if (!collection) return res.redirect('/commulingo/learn');

        // Linked chapters, chapter dictionary chips, and the decision-link payload are
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
                chapterDictionary: {},
                decisionLinks: { blocked: [], people: [] },
            };
        }

        let refs = { docs: {}, events: {} };
        if (collection.format === 'decision-history') {
            try { refs = await decisionRefs(collection, res.locals.lang); } catch (err) { console.error('commulingo decision refs:', err); }
        }

        const bookTitle = localize(collection.title, res.locals.lang);
        // course.genealogy: the site genealogy chart that maps the same story,
        // linked under the description.
        const chart = collection.genealogy ? getGenealogyChart(collection.genealogy) : null;
        const bookGenealogy = chart ? { href: `/commulingo/genealogy/${chart.id}`, title: localize(chart.title, res.locals.lang) } : null;
        // The course after this one in its group on the courses page, offered
        // on the closing screen of the last chapter.
        const group = groupBooks(summarizeBooks(catalog), res.locals.strings.commuLingo, res.locals.lang)
            .find(item => item.books.some(book => book.id === collection.id));
        const after = group ? group.books[group.books.findIndex(book => book.id === collection.id) + 1] : null;
        const nextBook = after ? { href: `/commulingo/book/${after.id}`, title: localize(after.title, res.locals.lang) } : null;
        res.render('public/commulingo-book', {
            nextBook,
            lessons: { version: catalog.version, collections: [pageData.linked] },
            factionPositions: collection.factionGuide ? await factionPositions(collection.factionGuide, res.locals.lang) : {},
            chapterDictionary: pageData.chapterDictionary,
            decisionLinks: pageData.decisionLinks,
            decisionRefs: refs,
            bookFormat: collection.format || 'quiz',
            bookTitle,
            bookDescription: localize(collection.description, res.locals.lang),
            bookGenealogy,
            pageTitle: `${bookTitle} — ${res.locals.strings.commuLingo.name}`,
            pageDescription: localize(collection.description, res.locals.lang) || res.locals.strings.commuLingo.description,
            pagePath: `/commulingo/book/${collection.id}`,
            jsonLd: seo.graphJsonLd(commuLingoBreadcrumb(res.locals.lang, [
                { name: res.locals.strings.commuLingo.courses, href: '/commulingo/learn' },
                { name: bookTitle, href: `/commulingo/book/${collection.id}` },
            ], res.locals.urlLanguage), courseJsonLd(collection, {
                title: bookTitle, text: localize(collection.description, res.locals.lang),
                lang: res.locals.lang, urlLang: res.locals.urlLanguage,
            })),
        });
    } catch (err) {
        console.error('commulingo book:', err);
        commuLingoLoadError(res, { message: { ko: '책 정보를 불러올 수 없습니다.', en: 'Failed to load book data.' } });
    }
});

router.get('/catalog.json', (req, res) => {
    const catalog = loadCommuLingoCatalog();
    // Versioned URLs stay immutable; the bare URL follows course writes
    // (database documents, no deploy-time purge) within thirty seconds.
    if (req.query && req.query.v === catalog.version) setPublicDataCache(req, res, catalog.version);
    else setShortPublicCache(res);
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

// The scene cards' map (book-page.js lessonStoryMap): an SVG of some 70 KB,
// fetched only when a lesson with scene cards opens, so the lesson payload
// stays small.
router.get('/lesson/:lessonId/story-map', asyncHandler(async (req, res) => {
    const lessonId = typeof req.params.lessonId === 'string' ? req.params.lessonId.trim() : '';
    const lang = req.query && req.query.lang === 'en' ? 'en' : 'ko';
    const map = await lessonStoryMap(lessonId, lang);
    if (!map) return res.status(404).json({ error: 'no story map' });
    setShortPublicCache(res);
    res.json(map);
}));

module.exports = router;
