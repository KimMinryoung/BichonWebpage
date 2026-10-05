const express = require('express');
const { setPublicDataCache, setShortPublicCache, commuLingoBreadcrumb } = require('../data/commulingo/page-helpers');
const errorPage = require('../utils/error-page');
const seo = require('../utils/seo');
const { loadCommuLingoDrills } = require('../data/commulingo/drills');
const { localize } = require('../data/commulingo/localize');
const { localizedMeta, deckBody } = require('../data/commulingo/drill-presentation');
const { loadCommuLingoShorts } = require('../data/commulingo/shorts');

const router = express.Router();

function isSafeDeckId(deckId) {
    return typeof deckId === 'string' && /^[a-z0-9-]+$/.test(deckId);
}

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const drills = await loadCommuLingoDrills();
        setShortPublicCache(res);
        res.render('public/commulingo-drill-index', {
            groups: drills.groups.map(group => ({
                id: group.id,
                label: localize(group.label, lang),
                decks: group.decks.map(meta => localizedMeta(meta, lang)),
            })),
            pageTitle: res.locals.strings.commuLingo.drill + ' — CommuLingo',
            pageDescription: res.locals.strings.commuLingo.drillDesc,
            pagePath: '/commulingo/drill',
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: res.locals.strings.commuLingo.drill, href: '/commulingo/drill' },
            ], res.locals.urlLanguage),
        });
    } catch (err) {
        console.error('commulingo drill index:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load the training ground.' : '훈련장을 불러올 수 없습니다.',
            backHref: '/commulingo', backLabel: 'CommuLingo',
        });
    }
});

// 덱 전체(이중 언어)를 그대로 준다. 언어 분기·라운드 표본은 클라이언트 몫이라
// 응답이 언어와 세션에 무관해지고, server.js가 이 경로를 세션 없이 캐시한다.
router.get('/deck/:deckId', async (req, res) => {
    try {
        const deckId = req.params.deckId;
        if (!isSafeDeckId(deckId)) return res.status(404).json({ error: 'unknown deck' });
        const drills = await loadCommuLingoDrills();
        const deck = drills.byId.get(deckId);
        if (!deck) return res.status(404).json({ error: 'unknown deck' });
        setPublicDataCache(req, res, drills.version);
        res.type('application/json').send(deckBody(drills, deckId));
    } catch (err) {
        console.error('commulingo drill deck:', err);
        res.status(500).json({ error: 'failed to load deck' });
    }
});

// 쇼츠: 한 화면에 한 장씩 넘기는 카드 피드. '/:deckId'보다 먼저 둔다.
router.get('/shorts', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const shorts = await loadCommuLingoShorts();
        const c = res.locals.strings.commuLingo;
        setShortPublicCache(res);
        res.render('public/commulingo-shorts', {
            shortsMeta: { version: shorts.version, bucketCount: shorts.bucketCount },
            pageTitle: c.shorts + ' — ' + c.drill,
            pageDescription: c.shortsDesc,
            pagePath: '/commulingo/drill/shorts',
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: c.drill, href: '/commulingo/drill' },
                { name: c.shorts, href: '/commulingo/drill/shorts' },
            ], res.locals.urlLanguage),
        });
    } catch (err) {
        console.error('commulingo shorts page:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load Shorts.' : '쇼츠를 불러올 수 없습니다.',
            backHref: '/commulingo/drill', backLabel: res.locals.strings.commuLingo.drill,
        });
    }
});

router.get('/shorts/feed/:bucket', async (req, res) => {
    try {
        const index = /^\d{1,4}$/.test(req.params.bucket) ? Number(req.params.bucket) : -1;
        const shorts = await loadCommuLingoShorts();
        const body = index >= 0 ? shorts.bucketBody(index) : null;
        if (!body) return res.status(404).json({ error: 'unknown bucket' });
        setPublicDataCache(req, res, shorts.version);
        res.type('application/json').send(body);
    } catch (err) {
        console.error('commulingo shorts feed:', err);
        res.status(500).json({ error: 'failed to load cards' });
    }
});

router.get('/:deckId', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const deckId = req.params.deckId;
        const drills = isSafeDeckId(deckId) ? await loadCommuLingoDrills() : null;
        const deck = drills ? drills.byId.get(deckId) : null;
        // Glossary decks follow the category registry ('terms-<category>');
        // a retired category's deck goes back to the hub rather than 404ing.
        if (!deck && drills && deckId.startsWith('terms-')) {
            return res.redirect(301, seo.languagePath('/commulingo/drill', lang));
        }
        if (!deck) return errorPage.notFound(res, {
            message: lang === 'en' ? 'Training deck not found.' : '훈련 덱을 찾을 수 없습니다.',
            backHref: '/commulingo/drill', backLabel: res.locals.strings.commuLingo.drill,
        });
        const title = localize(deck.title, lang);
        setShortPublicCache(res);
        res.render('public/commulingo-drill', {
            deckMeta: { id: deck.id, kind: deck.kind, mode: deck.mode || null, roundSize: deck.roundSize, version: drills.version },
            deckTitle: title,
            deckDescription: localize(deck.description, lang),
            pageTitle: title + ' — ' + res.locals.strings.commuLingo.drill,
            pageDescription: localize(deck.description, lang),
            pagePath: '/commulingo/drill/' + deck.id,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: res.locals.strings.commuLingo.drill, href: '/commulingo/drill' },
                { name: title, href: '/commulingo/drill/' + deck.id },
            ], res.locals.urlLanguage),
        });
    } catch (err) {
        console.error('commulingo drill page:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load the training deck.' : '훈련 덱을 불러올 수 없습니다.',
            backHref: '/commulingo/drill', backLabel: res.locals.strings.commuLingo.drill,
        });
    }
});

module.exports = router;
