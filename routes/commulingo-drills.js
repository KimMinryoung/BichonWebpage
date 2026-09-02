const express = require('express');
const { setPublicDataCache, setShortPublicCache, commuLingoBreadcrumb } = require('../data/commulingo/page-helpers');
const errorPage = require('../utils/error-page');
const { loadCommuLingoDrills } = require('../data/commulingo/drills');
const { localize } = require('../data/commulingo/localize');

const router = express.Router();

function isSafeDeckId(deckId) {
    return typeof deckId === 'string' && /^[a-z0-9-]+$/.test(deckId);
}

function localizedMeta(meta, lang) {
    return {
        id: meta.id,
        kind: meta.kind,
        mode: meta.mode,
        title: localize(meta.title, lang),
        description: localize(meta.description, lang),
        cardNote: meta.cardNote ? localize(meta.cardNote, lang) : '',
        roundSize: meta.roundSize,
        count: meta.count,
        countUnit: localize(meta.countUnit, lang),
    };
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
const deckJsonMemo = new WeakMap(); // drills.byId -> Map(deckId -> serialized)

router.get('/deck/:deckId', async (req, res) => {
    try {
        const deckId = req.params.deckId;
        if (!isSafeDeckId(deckId)) return res.status(404).json({ error: 'unknown deck' });
        const drills = await loadCommuLingoDrills();
        const deck = drills.byId.get(deckId);
        if (!deck) return res.status(404).json({ error: 'unknown deck' });
        setPublicDataCache(req, res, drills.version);
        let memo = deckJsonMemo.get(drills.byId);
        if (!memo) {
            memo = new Map();
            deckJsonMemo.set(drills.byId, memo);
        }
        let body = memo.get(deckId);
        if (!body) {
            body = JSON.stringify({ version: drills.version, deck });
            memo.set(deckId, body);
        }
        res.type('application/json').send(body);
    } catch (err) {
        console.error('commulingo drill deck:', err);
        res.status(500).json({ error: 'failed to load deck' });
    }
});

router.get('/:deckId', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const deckId = req.params.deckId;
        const drills = isSafeDeckId(deckId) ? await loadCommuLingoDrills() : null;
        const deck = drills ? drills.byId.get(deckId) : null;
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
