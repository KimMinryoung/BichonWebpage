const express = require('express');
const { loadCommuLingoCatalog } = require('../data/commulingo/shards');
const { roleIconSvg } = require('../data/commulingo/role-icons');
const { dictTabs } = require('../data/commulingo/dict-tabs');
const { flagImg } = require('../data/commulingo/flag-icons');
const { nationalityHubHref } = require('../data/commulingo/nationality-filter');

const router = express.Router();

// Retired ids (duplicate cards merged away, ids renamed) live in
// commulingo_id_redirects and ride the people-store snapshot, because a merge is
// a DB operation and should not need a deploy to keep the old URL alive. The
// lookup happens on the not-found path only: a live id never pays for it.

// Expose the flag and role-icon renderers to every CommuLingo template (and
// their partials — the dictionary switcher nav and the crumb bar need
// roleIconSvg and dictTabs everywhere).
router.use((req, res, next) => {
    res.locals.flagImg = flagImg;
    res.locals.nationalityHubHref = nationalityHubHref;
    res.locals.roleIconSvg = roleIconSvg;
    res.locals.dictTabs = dictTabs;
    // Every page under /commulingo wants the same two stylesheets, so they are
    // set once here rather than repeated in fourteen res.render calls. The
    // document reader builds its own <head> and links them itself.
    res.locals.extraCss = [
        `/css/commulingo-crumb.css?v=${res.locals.assetVersion}`,
        `/css/commulingo.css?v=${res.locals.assetVersion}`,
    ];
    next();
});

function summarizeBooks(catalog) {
    return (catalog.collections || []).map(collection => {
        const chapters = collection.chapters || [];
        const lessonIds = [];
        chapters.forEach(chapter => {
            (chapter.lessons || []).forEach(lesson => {
                if (lesson && lesson.id && Number(lesson.questionCount) > 0) lessonIds.push(lesson.id);
            });
        });
        const graph = collection.conceptGraph;
        const timeline = collection.decisionTimeline;
        const episodeCount = timeline && Array.isArray(timeline.eras)
            ? timeline.eras.reduce((sum, era) => sum + (Array.isArray(era.episodes) ? era.episodes.length : 0), 0)
            : 0;
        return {
            id: collection.id,
            volumeNumber: collection.volumeNumber,
            title: collection.title,
            description: collection.description,
            format: collection.format,
            chapterCount: chapters.length,
            nodeCount: graph && Array.isArray(graph.nodes) ? graph.nodes.length : 0,
            episodeCount,
            lessonIds,
        };
    });
}

router.get('/', (req, res) => {
    const catalog = loadCommuLingoCatalog();
    res.render('public/commulingo-index', {
        books: { version: catalog.version, collections: summarizeBooks(catalog) },
        pageTitle: res.locals.strings.commuLingo.title,
        pageDescription: res.locals.strings.commuLingo.description,
        pagePath: '/commulingo',
    });
});

router.use('/events', require('./commulingo-events'));
router.use('/terms', require('./commulingo-terms'));
router.use('/docs', require('./commulingo-docs'));
router.use('/genealogy', require('./commulingo-genealogy'));
router.use('/politburo', require('./commulingo-politburo'));
router.use('/drill', require('./commulingo-drills'));
router.use(require('./commulingo-people'));
router.use(require('./commulingo-people-api'));
router.use(require('./commulingo-books'));
router.use(require('./commulingo-progress'));

module.exports = router;
