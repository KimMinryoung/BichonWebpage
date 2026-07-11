const express = require('express');
const errorPage = require('../utils/error-page');
const { loadCommuLingoHistoryEvents } = require('../data/commulingo/history-events-store');

const router = express.Router();

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

function presentEvent(raw, lang) {
    return {
        ...raw,
        title: localize(raw.title, lang),
        question: localize(raw.question, lang),
        summary: localize(raw.summary, lang),
        outcome: localize(raw.outcome, lang),
        timeline: (raw.timeline || []).map(item => ({
            date: item.date || '', title: localize(item.title, lang), body: localize(item.body, lang),
        })),
        people: (raw.people || []).map(person => ({
            ...person,
            name: localize(person.name, lang), relation: localize(person.relation, lang), note: localize(person.note, lang),
        })),
    };
}

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const events = (await loadCommuLingoHistoryEvents()).map(event => presentEvent(event, lang));
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-events', {
            events,
            pageTitle: lang === 'en' ? 'Historical Events — CommuLingo' : '역사 사건 — CommuLingo',
            pageDescription: lang === 'en' ? 'Events, institutions, and people in connected Soviet and revolutionary history.' : '혁명과 소련사의 사건·기관·인물을 연결해 읽는 페이지.',
            pagePath: '/commulingo/events',
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
        });
    } catch (err) {
        console.error('commulingo events:', err);
        res.status(500).send('Failed to load history events');
    }
});

router.get('/:eventId', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const eventId = typeof req.params.eventId === 'string' ? req.params.eventId.trim() : '';
        const raw = (await loadCommuLingoHistoryEvents()).find(event => event.id === eventId);
        if (!raw) return errorPage.notFound(res, {
            message: lang === 'en' ? 'Historical event not found.' : '역사 사건을 찾을 수 없습니다.',
            backHref: '/commulingo/events', backLabel: lang === 'en' ? 'Historical events' : '역사 사건',
        });
        const event = presentEvent(raw, lang);
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-event', {
            event,
            pageTitle: lang === 'en' ? `${event.title} — Historical Events` : `${event.title} — 역사 사건`,
            pageDescription: event.summary,
            pagePath: `/commulingo/events/${event.id}`,
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
        });
    } catch (err) {
        console.error('commulingo event detail:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load historical event.' : '역사 사건 정보를 불러올 수 없습니다.',
            backHref: '/commulingo/events', backLabel: res.locals.lang === 'en' ? 'Historical events' : '역사 사건',
        });
    }
});

module.exports = router;
