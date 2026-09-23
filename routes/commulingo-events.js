const { dictionarySearchRoute } = require('../utils/dictionary-search-route');
const express = require('express');
const { setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const { paginateList } = require('../data/commulingo/list-pagination');
const errorPage = require('../utils/error-page');
const { loadCommuLingoHistoryEvents } = require('../data/commulingo/history-events-store');
const { eventCountries } = require('../data/commulingo/event-countries');

const { countryInfo } = require('../data/commulingo/country-geography');

const router = express.Router();

const { buildEventPanel, pairedTermIdFor, presentedEventList } = require('../data/commulingo/event-presentation');
const { buildTermPanel } = require('../data/commulingo/term-presentation');

router.get('/search', dictionarySearchRoute({
    kind: 'events', view: 'partials/commulingo-events-cards', target: '#commu-event-list',
    load: async (req, lang) => {
        const raw = await loadCommuLingoHistoryEvents();
        const country = typeof req.query.country === 'string' ? countryInfo(req.query.country, lang) : null;
        return {
            items: presentedEventList(raw, lang),
            accepts: country ? event => eventCountries(event.countries).includes(country.code) : undefined,
            params: country ? { country: country.code } : {},
        };
    },
}));

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const selectedCountry = typeof req.query.country === 'string' ? countryInfo(req.query.country, lang) : null;
        const rawEvents = await loadCommuLingoHistoryEvents();
        const matchingIds = selectedCountry
            ? new Set(rawEvents.filter(event => eventCountries(event.countries).includes(selectedCountry.code)).map(event => event.id))
            : null;
        const events = presentedEventList(rawEvents, lang)
            .filter(event => !matchingIds || matchingIds.has(event.id));
        const pagination = paginateList(events, events, req.query, selectedCountry
            ? `/commulingo/events?country=${encodeURIComponent(selectedCountry.code)}&page=` : '/commulingo/events?page=', { mark: false });
        setShortPublicCache(res);
        res.render('public/commulingo-events', {
            events,
            selectedCountry,
            pagination,
            pageTitle: lang === 'en' ? 'Historical Events — CommuLingo' : '역사 사건 — CommuLingo',
            pageDescription: lang === 'en' ? 'Events, institutions, and people in connected Soviet and revolutionary history.' : '혁명과 소련사의 사건·기관·인물을 연결해 읽는 페이지.',
            pagePath: '/commulingo/events',
        });
    } catch (err) {
        console.error('commulingo events:', err);
        commuLingoLoadError(res, { message: { ko: '역사 사건 목록을 불러올 수 없습니다.', en: 'Failed to load history events.' } });
    }
});

router.get('/:eventId', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const eventId = typeof req.params.eventId === 'string' ? req.params.eventId.trim() : '';
        const panel = await buildEventPanel(eventId, lang);
        if (!panel) return errorPage.notFound(res, {
            message: lang === 'en' ? 'Historical event not found.' : '역사 사건을 찾을 수 없습니다.',
            backHref: '/commulingo/events', backLabel: lang === 'en' ? 'Historical events' : '역사 사건',
        });
        const event = panel.event;
        setShortPublicCache(res);
        // Show the glossary half when the two entries have the same subject.
        const pairedTerm = await pairedTermIdFor(eventId);
        res.render('public/commulingo-event', {
            ...panel,
            event,
            termPanel: pairedTerm ? await buildTermPanel(pairedTerm, lang) : null,
            activePanel: 'event',
            pageTitle: lang === 'en' ? `${event.title} — Historical Events` : `${event.title} — 역사 사건`,
            pageDescription: event.summary,
            pagePath: `/commulingo/events/${event.id}`,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'Historical Events' : '역사 사건', href: '/commulingo/events' },
                { name: event.title, href: `/commulingo/events/${event.id}` },
            ], res.locals.urlLanguage),
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
