const express = require('express');
const { asyncHandler } = require('../utils/async-handler');
const { loadCommuLingoUpdateGroups } = require('../services/commulingo-updates');
const { loadCommuLingoCatalog } = require('../data/commulingo/shards');
const { roleIconSvg } = require('../data/commulingo/role-icons');
const { dictTabs } = require('../data/commulingo/dict-tabs');
const { learnTabs } = require('../data/commulingo/learn-tabs');
const { flagImg } = require('../data/commulingo/flag-icons');
const { personFlagHref } = require('../data/commulingo/nationality-filter');

const router = express.Router();

// Retired ids (duplicate cards merged away, ids renamed) live in
// commulingo_id_redirects and ride the people-store snapshot, because a merge is
// a DB operation and should not need a deploy to keep the old URL alive. The
// lookup happens on the not-found path only: a live id never pays for it.

const { PAGE_FEATURES } = require('../config/commulingo-page-css');

// Expose the flag and role-icon renderers to every CommuLingo template (and
// their partials — the dictionary switcher nav and the crumb bar need
// roleIconSvg and dictTabs everywhere).
router.use((req, res, next) => {
    res.locals.flagImg = flagImg;
    res.locals.personFlagHref = personFlagHref;
    res.locals.roleIconSvg = roleIconSvg;
    res.locals.dictTabs = dictTabs;
    res.locals.learnTabs = learnTabs;
    // Home and lists have their own small sheets. Every other page gets the
    // shared core sheet plus the feature sheets of the view it renders
    // (all derived from commulingo.css by scripts/build-commulingo-list-css.js).
    const homePage = /^\/(?:learn\/?)?$/.test(req.path);
    const listPage = /^\/(?:people|events|terms)?\/?$/.test(req.path) || /^\/people\/list\/[^/]+\/?$/.test(req.path);
    const sheet = name => `/css/commulingo-${name}.css?v=${res.locals.assetVersion}`;
    res.locals.extraCss = [sheet('crumb'), sheet(homePage ? 'home' : listPage ? 'lists' : 'core')];
    if (!homePage && !listPage) {
        const render = res.render.bind(res);
        res.render = (view, ...rest) => {
            const features = PAGE_FEATURES[view];
            if (features) res.locals.extraCss = [...res.locals.extraCss, ...features.map(sheet)];
            return render(view, ...rest);
        };
    }
    next();
});

router.use(require('./commulingo-pwa'));

const { summarizeBooks, groupBooks } = require('../data/commulingo/book-summary');
const { commuLingoBreadcrumb } = require('../data/commulingo/page-helpers');

// The hub: the learning sections and the dictionaries side by side, a
// preview listing every course, and the update notes. The course cards with
// progress live on /commulingo/learn.
router.get('/', asyncHandler(async (req, res) => {
    const collections = summarizeBooks(loadCommuLingoCatalog());
    res.render('public/commulingo-index', {
        bookGroups: groupBooks(collections, res.locals.strings.commuLingo, res.locals.lang),
        updateGroups: await loadCommuLingoUpdateGroups(res.locals.lang),
        pageTitle: res.locals.strings.commuLingo.name,
        pageDescription: res.locals.strings.commuLingo.description,
        pagePath: '/commulingo',
    });
}));

router.get('/learn', (req, res) => {
    const catalog = loadCommuLingoCatalog();
    const collections = summarizeBooks(catalog);
    const c = res.locals.strings.commuLingo;
    res.render('public/commulingo-learn', {
        books: { version: catalog.version, collections },
        bookGroups: groupBooks(collections, c, res.locals.lang),
        pageTitle: `${c.courses} — ${c.name}`,
        pageDescription: c.coursesDesc,
        pagePath: '/commulingo/learn',
        jsonLd: commuLingoBreadcrumb(res.locals.lang, [
            { name: c.learn, href: '/commulingo/learn' },
        ]),
    });
});

router.get('/search', require('./search').searchPage('commulingo'));
router.get('/search/suggest', require('./search').suggestRoute('commulingo'));
router.use(require('./commulingo-map'));
router.use('/events', require('./commulingo-events'));
router.use('/terms', require('./commulingo-terms'));
router.use('/docs', require('./commulingo-docs'));
router.use('/genealogy', require('./commulingo-genealogy'));
const { bodyRouter } = require('./commulingo-politburo');
for (const bodyId of require('../data/commulingo/party-bodies').BODY_IDS) router.use(`/${bodyId}`, bodyRouter(bodyId));
router.use('/drill', require('./commulingo-drills'));
router.use(require('./commulingo-people'));
router.use(require('./commulingo-people-api'));
router.use(require('./commulingo-books'));
router.use(require('./commulingo-progress'));

module.exports = router;
