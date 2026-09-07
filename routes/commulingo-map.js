const express = require('express');
const errorPage = require('../utils/error-page');
const { setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const { localize } = require('../data/commulingo/localize');
const { loadStandardizedPeople, sortPeopleChronologically } = require('../data/commulingo/people-view');
const { loadCommuLingoHistoryEvents } = require('../data/commulingo/history-events-store');
const { getLinkIndexes, createCardTextLinker } = require('../data/commulingo/linkify');
const { roleIconSvg, roleHubHref } = require('../data/commulingo/role-icons');
const { flagLabel } = require('../data/commulingo/flag-icons');
const { eventCountries } = require('../data/commulingo/event-countries');
const { countryCodes, countryInfo } = require('../data/commulingo/country-geography');
const { renderWorldMapSvg } = require('../data/commulingo/world-map-svg');

const router = express.Router();
const PREVIEW_LIMIT = 4;
const CONTINENT_ORDER = ['europe', 'asia', 'eurasia', 'africa', 'americas'];

function directEventsFor(events, code, lang) {
    return (events || []).filter(event => eventCountries(event.countries).includes(code)).map(event => ({
        id: event.id,
        period: event.period,
        title: localize(event.title, lang),
        summary: localize(event.summary, lang),
    }));
}

function countryPeople(people, code) {
    return {
        citizenship: sortPeopleChronologically((people || []).filter(person => person.citizenship && person.citizenship.code === code)),
        origin: sortPeopleChronologically((people || []).filter(person => person.origin && person.origin.code === code)),
    };
}

function summaryFor(people, events, code, lang) {
    const info = countryInfo(code, lang);
    if (!info) return null;
    const groupedPeople = countryPeople(people, code);
    const relatedEvents = directEventsFor(events, code, lang);
    return {
        ...info,
        search: `${flagLabel(code, 'ko')} ${flagLabel(code, 'en')} ${code}`.toLowerCase(),
        citizenshipCount: groupedPeople.citizenship.length,
        originCount: groupedPeople.origin.length,
        eventCount: relatedEvents.length,
        totalCount: groupedPeople.citizenship.length + groupedPeople.origin.length + relatedEvents.length,
    };
}

async function loadMapData(lang) {
    const [peopleData, events] = await Promise.all([
        loadStandardizedPeople(lang),
        loadCommuLingoHistoryEvents(),
    ]);
    return { standardized: peopleData.standardized, events };
}

router.get('/map', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const { standardized, events } = await loadMapData(lang);
        const countries = countryCodes().map(code => summaryFor(standardized.people, events, code, lang))
            .filter(country => country && country.totalCount > 0);
        const groups = CONTINENT_ORDER.map(id => ({
            id,
            label: countries.find(country => country.continent === id)?.continentLabel || '',
            countries: countries.filter(country => country.continent === id)
                .sort((a, b) => a.label.localeCompare(b.label, lang === 'en' ? 'en' : 'ko')),
        })).filter(group => group.countries.length);
        setShortPublicCache(res);
        res.render('public/commulingo-map', {
            countries,
            groups,
            mapSvg: renderWorldMapSvg({ codes: countries.map(country => country.code), lang }),
            pageTitle: lang === 'en' ? 'World Map — CommuLingo' : '세계 지도 — CommuLingo',
            pageDescription: lang === 'en'
                ? 'Locate the countries and historical regions represented by CommuLingo people and events.'
                : 'CommuLingo의 인물과 역사 사건에 등장하는 국가·역사의 지역을 세계지도에서 살펴봅니다.',
            pagePath: '/commulingo/map',
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'World Map' : '세계 지도', href: '/commulingo/map' },
            ], res.locals.urlLanguage),
        });
    } catch (err) {
        console.error('commulingo world map:', err);
        commuLingoLoadError(res, { message: { ko: '세계 지도를 불러올 수 없습니다.', en: 'Failed to load the world map.' } });
    }
});

router.get('/countries/:code', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const code = typeof req.params.code === 'string' ? req.params.code.trim() : '';
        const info = countryInfo(code, lang);
        if (!info) return errorPage.notFound(res, {
            message: lang === 'en' ? 'Country or region not found.' : '국가·지역을 찾을 수 없습니다.',
            backHref: '/commulingo/map',
            backLabel: lang === 'en' ? 'World Map' : '세계 지도',
        });
        const { standardized, events } = await loadMapData(lang);
        const people = countryPeople(standardized.people, code);
        const relatedEvents = directEventsFor(events, code, lang);
        const indexes = await getLinkIndexes(lang);
        const country = {
            ...summaryFor(standardized.people, events, code, lang),
            citizenshipPreview: people.citizenship.slice(0, PREVIEW_LIMIT),
            originPreview: people.origin.slice(0, PREVIEW_LIMIT),
            events: relatedEvents,
        };
        setShortPublicCache(res);
        return res.render('public/commulingo-country', {
            country,
            mapSvg: renderWorldMapSvg({ codes: countryCodes(), selectedCode: code, lang, territoryLinks: true }),
            previewLimit: PREVIEW_LIMIT,
            roleIconSvg,
            roleHubHref,
            linkifyPersonText: createCardTextLinker(indexes),
            pageTitle: `${country.label} — ${lang === 'en' ? 'World Map' : '세계 지도'}`,
            pageDescription: lang === 'en'
                ? `People and historical events directly connected with ${country.label}.`
                : `${country.label}의 시민권·민족적 배경 인물과 직접 관련된 역사 사건.`,
            pagePath: country.href,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'World Map' : '세계 지도', href: '/commulingo/map' },
                { name: country.label, href: country.href },
            ], res.locals.urlLanguage),
        });
    } catch (err) {
        console.error('commulingo country page:', err);
        return errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load country data.' : '국가·지역 정보를 불러올 수 없습니다.',
            backHref: '/commulingo/map',
            backLabel: res.locals.lang === 'en' ? 'World Map' : '세계 지도',
        });
    }
});

module.exports = router;
