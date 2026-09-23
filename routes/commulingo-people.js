const activitiesModel = require('../data/commulingo/person-activities');
const { localizeHtmlLinks } = require('../utils/seo');
const { searchPeople } = require('../utils/people-search');
const express = require('express');
const allStrings = require('../config/strings');
const { setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const errorPage = require('../utils/error-page');
const { localize } = require('../data/commulingo/localize');
const { redirectTarget } = require('../data/commulingo/people-store');
const { loadCommuLingoPersonHistoryEvents } = require('../data/commulingo/history-events-store');
const { relatedDocsFor } = require('../data/commulingo/docs-refs');
const { renderAppView } = require('../utils/render-app-view');
const { paginateList, PAGE_SIZE } = require('../data/commulingo/list-pagination');
const { getLinkIndexes, createCardTextLinker } = require('../data/commulingo/linkify');
const { roleIconSvg, roleHubHref } = require('../data/commulingo/role-icons');
const { genealogyLinksFor } = require('../data/commulingo/genealogy-links');
const { politburoCareerFor } = require('../data/commulingo/politburo-store');
const { flagImg, flagLabel } = require('../data/commulingo/flag-icons');
const { nationalityHubHref, buildNationalityFilter } = require('../data/commulingo/nationality-filter');
const { countryHref, countryInfo } = require('../data/commulingo/country-geography');
const { renderCountryMapSvg } = require('../data/commulingo/world-map-svg');
const { getReportsForPerson, getReportsForTopic } = require('../services/report-mentions');
const { loadStandardizedPeople, peopleShellFor, sortPeopleChronologically } = require('../data/commulingo/people-view');

// The people dictionary: shell + card fragments, group list pages, office /
// role / nationality hubs, and the person page. Mounted by routes/commulingo.js.

// Public research reports that mention this classification page's curated
// terms (topic-linkify.js). Failure only costs the section, never the page.
async function relatedReportsForTopic(kind, id, lang) {
    try {
        return await getReportsForTopic(kind, id, lang);
    } catch (e) {
        console.error(`commulingo ${kind} related reports:`, e);
        return [];
    }
}

const router = express.Router();

const { cardTextLinker, peopleGroupCardsHtml, personBody } = require('../data/commulingo/people-presentation');

router.get('/people', async (req, res) => {
    try {
        const { lang, standardized } = await loadStandardizedPeople(res.locals.lang);
        setShortPublicCache(res);
        const { roleCategories, groupsMeta } = peopleShellFor(standardized, lang);
        res.render('public/commulingo-people', {
            offices: standardized.offices,
            roleCategories,
            activityFunctions: activitiesModel.catalog.functions.map(f => ({ ...f, label: localize(f.label, lang), count: standardized.people.filter(p => activitiesModel.matchesActivities(p, { functionId: f.id })).length })),
            groupsMeta,
            peopleCount: standardized.people.length,
            pageSize: PAGE_SIZE,
            roleIconSvg,
            roleHubHref,
            pageTitle: lang === 'en' ? 'People of the Revolution and the USSR' : '인물 사전 — 혁명과 소련의 사람들',
            pageDescription: lang === 'en'
                ? 'The people who stood at the forks of the two decision-simulation history books.'
                : '두 권의 결정 시뮬레이션 역사책, 그 갈림길에 서 있던 사람들.',
            pagePath: '/commulingo/people',
        });
    } catch (err) {
        console.error('commulingo people:', err);
        commuLingoLoadError(res, { message: { ko: '인물 사전을 불러올 수 없습니다.', en: 'Failed to load people data.' } });
    }
});

// Search the cached text index before rendering any cards. No DB query or
// full-group HTML download is needed per keystroke. Limit each response to
// one screenful per rank; subsequent pages are requested only on demand.
router.get('/people/search', async (req, res) => {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const bucket = req.query.bucket;
    const offset = Number(req.query.offset || 0);
    if (query.length > 200 || (bucket !== undefined && !['name', 'role', 'desc'].includes(bucket))
        || !Number.isSafeInteger(offset) || offset < 0) return res.status(400).json({ error: 'Invalid search' });
    try {
        const { lang, standardized } = await loadStandardizedPeople(res.locals.lang);
        const hits = searchPeople(standardized, query, sortPeopleChronologically);
        const buckets = {};
        const keys = bucket ? [bucket] : ['name', 'role', 'desc'];
        // Show the strongest matches first. Lower ranks retain their full
        // counts, but their cards are fetched when the reader expands them.
        const initialBucket = bucket || keys.find(key => hits[key].length);
        let indexes;
        for (const key of keys) {
            const people = key === initialBucket ? hits[key].slice(offset, offset + 20) : [];
            let html = '';
            if (people.length) {
                indexes = indexes || await getLinkIndexes(lang);
                html = await renderAppView(req, 'partials/commulingo-people-group-cards', {
                    strings: allStrings[lang], people, groupId: '', en: lang === 'en',
                    roleIconSvg, roleHubHref, flagImg, nationalityHubHref,
                    linkifyPersonText: createCardTextLinker(indexes),
                });
            }
            buckets[key] = { total: hits[key].length, next: offset + people.length, html: lang === 'en' ? localizeHtmlLinks(html, 'en') : html };
        }
        setShortPublicCache(res);
        res.json({ buckets });
    } catch (err) {
        console.error('commulingo people search:', err);
        res.status(500).json({ error: 'Failed to load people' });
    }
});

// Card-grid fragment for one people group. Registered before /people/:personId
// so 'cards' is never taken for a person id.
router.get('/people/cards', async (req, res) => {
    try {
        const groupId = typeof req.query.group === 'string' ? req.query.group.trim() : '';
        const page = req.query.page === undefined ? 0 : Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const { lang, standardized } = await loadStandardizedPeople(res.locals.lang);
        const group = (standardized.groups || []).find(item => item.id === groupId);
        if (!group) return res.status(404).send('');
        setShortPublicCache(res);
        res.type('html').send(await peopleGroupCardsHtml(req, standardized, lang, group, page));
    } catch (err) {
        console.error('commulingo people cards:', err);
        res.status(500).send('');
    }
});

// One group as a plain, server-rendered page of cards with the site's pager:
// the script-less and crawler view of the people dictionary, linked from each
// group's header (「목록으로 보기」). Registered before /people/:personId.
router.get('/people/list/:groupId', async (req, res) => {
    try {
        const groupId = typeof req.params.groupId === 'string' ? req.params.groupId.trim() : '';
        const { lang, standardized } = await loadStandardizedPeople(res.locals.lang);
        const group = (standardized.groups || []).find(item => item.id === groupId);
        const meta = peopleShellFor(standardized, lang).groupsMeta.find(item => item.id === groupId);
        if (!group || !meta) return errorPage.notFound(res, {
            message: lang === 'en' ? 'People group not found.' : '인물 그룹을 찾을 수 없습니다.',
            backHref: '/commulingo/people',
            backLabel: lang === 'en' ? 'People' : '인물 사전',
        });
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const html = await peopleGroupCardsHtml(req, standardized, lang, group, page,
            `/commulingo/people/list/${encodeURIComponent(groupId)}?page=`);
        const cut = html.indexOf('<div data-commu-list-pager');
        const total = Math.ceil(group.people.length / PAGE_SIZE);
        const current = Math.min(page, Math.max(1, total));
        setShortPublicCache(res);
        res.render('public/commulingo-people-list', {
            group: meta,
            cardsHtml: cut === -1 ? html : html.slice(0, cut),
            pagerHtml: cut === -1 ? '' : html.slice(cut),
            current,
            total,
            pageTitle: (lang === 'en' ? `${meta.title} — People` : `${meta.title} — 인물 사전`) + (current > 1 ? ` (${current}/${total})` : ''),
            pageDescription: meta.blurb,
            pagePath: `/commulingo/people/list/${groupId}`,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'People' : '인물 사전', href: '/commulingo/people' },
                { name: meta.title, href: `/commulingo/people/list/${groupId}` },
            ]),
        });
    } catch (err) {
        console.error('commulingo people list:', err);
        commuLingoLoadError(res, { message: { ko: '인물 그룹을 불러올 수 없습니다.', en: 'Failed to load people group.' }, backHref: '/commulingo/people', backLabel: { ko: '인물 사전', en: 'People' } });
    }
});

router.get('/offices/:officeId', async (req, res) => {
    try {
        const officeId = typeof req.params.officeId === 'string' ? req.params.officeId.trim() : '';
        const { lang, loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        const office = standardized.offices.find(item => item.id === officeId);
        if (!office) {
            const renamed = redirectTarget(loaded.data, 'office', officeId);
            if (renamed) return res.redirect(301, `/commulingo/offices/${renamed}`);
            return errorPage.notFound(res, {
                message: lang === 'en' ? 'Office not found.' : '기관을 찾을 수 없습니다.',
                backHref: '/commulingo/people',
                backLabel: lang === 'en' ? 'People' : '인물 사전',
            });
        }
        const people = sortPeopleChronologically(standardized.people.filter(person => person.role && person.role.officeId === office.id));
        const relatedReports = await relatedReportsForTopic('office', office.id, lang);
        setShortPublicCache(res);
        res.render('public/commulingo-office', {
            office,
            people,
            relatedReports,
            roleIconSvg,
            roleHubHref,
            linkifyPersonText: await cardTextLinker(res),
            pageTitle: lang === 'en' ? `${office.title} — People` : `${office.title} — 인물 사전`,
            pageDescription: office.blurb,
            pagePath: `/commulingo/offices/${office.id}`,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'People' : '인물 사전', href: '/commulingo/people' },
                { name: office.title, href: `/commulingo/offices/${office.id}` },
            ]),
        });
    } catch (err) {
        console.error('commulingo office page:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load office data.' : '기관 정보를 불러올 수 없습니다.',
            backHref: '/commulingo/people',
            backLabel: res.locals.lang === 'en' ? 'People' : '인물 사전',
        });
    }
});

router.get('/activities', async (req, res) => {
    try {
        const { lang, standardized } = await loadStandardizedPeople(res.locals.lang);
        const functionId = typeof req.query.function === 'string' ? req.query.function : '';
        const affiliationId = typeof req.query.affiliation === 'string' ? req.query.affiliation : '';
        if ((functionId && !activitiesModel.functions.has(functionId)) || (affiliationId && !activitiesModel.affiliations.has(affiliationId))) {
            return errorPage(res, 404, { message: lang === 'en' ? 'Activity filter not found.' : '활동 분류를 찾을 수 없습니다.' });
        }
        const filter = { functionId, affiliationId };
        const people = sortPeopleChronologically(standardized.people.filter(p => activitiesModel.matchesActivities(p, filter)));
        // Keep active filters visible even when an existing link has no matches.
        const functions = activitiesModel.catalog.functions.map(f => ({ ...f, label: localize(f.label, lang), count: standardized.people.filter(p => activitiesModel.matchesActivities(p, { functionId: f.id, affiliationId })).length }))
            .filter(f => f.count > 0 || f.id === functionId);
        const affiliations = activitiesModel.catalog.affiliations.map(a => ({ ...a, label: localize(a.label, lang), count: standardized.people.filter(p => activitiesModel.matchesActivities(p, { functionId, affiliationId: a.id })).length }))
            .filter(a => a.count > 0 || a.id === affiliationId);
        const groupedAffiliations = new Map();
        for (const a of affiliations) {
            const key = a.countryCode || 'international';
            if (!groupedAffiliations.has(key)) groupedAffiliations.set(key, { label: localize(a.countryLabel, lang) || flagLabel(key, lang) || (lang === 'en' ? 'International organizations' : '국제조직'), items: [] });
            groupedAffiliations.get(key).items.push(a);
        }
        const affiliationGroups = [...groupedAffiliations.values()].sort((a,b) => a.label.localeCompare(b.label, lang));
        const query = new URLSearchParams({ function: functionId, affiliation: affiliationId, lang });
        const pagination = paginateList(people, people, { page: req.query.page || 1 }, `/commulingo/activities?${query}&page=`, { mark: false });
        setShortPublicCache(res);
        res.render('public/commulingo-activities', { filter, functions, affiliations, affiliationGroups, pagination, total: people.length,
            people: pagination.pageItems, roleIconSvg, roleHubHref, flagImg, nationalityHubHref,
            linkifyPersonText: await cardTextLinker(res),
            pageTitle: lang === 'en' ? 'People by activity and affiliation' : '기능·활동과 국가·세력별 인물',
            pageDescription: lang === 'en' ? 'Explore people by what they did and the organizations they served.' : '인물이 수행한 활동과 그 활동의 국가·세력을 함께 살펴봅니다.',
            pagePath: '/commulingo/activities' });
    } catch (err) {
        console.error('commulingo activities:', err);
        commuLingoLoadError(res, { message: { ko: '활동 분류를 불러올 수 없습니다.', en: 'Failed to load activities.' } });
    }
});

router.get('/roles/:categoryId', async (req, res) => {
    try {
        const categoryId = typeof req.params.categoryId === 'string' ? req.params.categoryId.trim() : '';
        const mapped = activitiesModel.catalog.legacy[categoryId];
        if (mapped) return res.redirect(301, activitiesModel.activityHref({ functionId: mapped[0], affiliationId: mapped[1] }));
        const { lang, loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        const category = standardized.roleCategories[categoryId];
        if (!category) {
            const renamed = redirectTarget(loaded.data, 'role-category', categoryId);
            if (renamed) return res.redirect(301, `/commulingo/roles/${renamed}`);
            return errorPage.notFound(res, {
                message: lang === 'en' ? 'Role category not found.' : '역할 범주를 찾을 수 없습니다.',
                backHref: '/commulingo/people',
                backLabel: lang === 'en' ? 'People' : '인물 사전',
            });
        }
        const people = sortPeopleChronologically(standardized.people.filter(person => person.role && person.role.categoryId === category.id));
        const relatedReports = await relatedReportsForTopic('role', category.id, lang);
        setShortPublicCache(res);
        res.render('public/commulingo-role', {
            category,
            people,
            relatedReports,
            roleIconSvg,
            roleHubHref,
            linkifyPersonText: await cardTextLinker(res),
            pageTitle: lang === 'en' ? `${category.label} — People` : `${category.label} — 인물 사전`,
            pageDescription: lang === 'en'
                ? `People in the ${category.label} role category.`
                : `${category.label} 역할 범주의 인물들.`,
            pagePath: `/commulingo/roles/${category.id}`,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'People' : '인물 사전', href: '/commulingo/people' },
                { name: category.label, href: `/commulingo/roles/${category.id}` },
            ]),
        });
    } catch (err) {
        console.error('commulingo role page:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load role data.' : '역할 정보를 불러올 수 없습니다.',
            backHref: '/commulingo/people',
            backLabel: res.locals.lang === 'en' ? 'People' : '인물 사전',
        });
    }
});

async function renderNationalityPeople(req, res, kind) {
    try {
        const code = typeof req.params.code === 'string' ? req.params.code.trim() : '';
        const { lang, standardized } = await loadStandardizedPeople(res.locals.lang);
        const filter = buildNationalityFilter(standardized.people, kind, code, lang);
        if (!filter) {
            return errorPage.notFound(res, {
                message: lang === 'en' ? 'Nationality filter not found.' : '국적·배경 필터를 찾을 수 없습니다.',
                backHref: '/commulingo/people',
                backLabel: lang === 'en' ? 'People' : '인물 사전',
            });
        }
        filter.people = sortPeopleChronologically(filter.people);
        setShortPublicCache(res);
        return res.render('public/commulingo-nationality', {
            filter,
            people: filter.people,
            countryPageHref: countryHref(code),
            mapKind: countryInfo(code, lang).kind,
            mapSvg: renderCountryMapSvg({ selectedCode: code, lang, countryLink: targetCode => nationalityHubHref(kind, targetCode) }),
            roleIconSvg,
            roleHubHref,
            linkifyPersonText: await cardTextLinker(res),
            pageTitle: `${filter.kindLabel}: ${filter.label} — ${lang === 'en' ? 'People' : '인물 사전'}`,
            pageDescription: lang === 'en'
                ? `People whose ${filter.kindLabel.toLowerCase()} is ${filter.label}.`
                : `${filter.kindLabel}이(가) ${filter.label}인 인물들.`,
            pagePath: filter.href,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'People' : '인물 사전', href: '/commulingo/people' },
                { name: filter.label, href: filter.href },
            ]),
        });
    } catch (err) {
        console.error(`commulingo ${kind} page:`, err);
        return errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load nationality data.' : '국적·배경 정보를 불러올 수 없습니다.',
            backHref: '/commulingo/people',
            backLabel: res.locals.lang === 'en' ? 'People' : '인물 사전',
        });
    }
}

router.get('/people/citizenship/:code', (req, res) => renderNationalityPeople(req, res, 'citizenship'));
router.get('/people/national-origin/:code', (req, res) => renderNationalityPeople(req, res, 'nationalOrigin'));

router.get('/people/:personId', async (req, res) => {
    try {
        const personId = typeof req.params.personId === 'string' ? req.params.personId.trim() : '';
        const { lang, loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        const person = standardized.peopleById[personId];
        if (!person) {
            const merged = redirectTarget(loaded.data, 'person', personId);
            if (merged) return res.redirect(301, `/commulingo/people/${merged}`);
            return errorPage.notFound(res, {
                message: lang === 'en' ? 'Person not found.' : '인물을 찾을 수 없습니다.',
                backHref: '/commulingo/people',
                backLabel: lang === 'en' ? 'People' : '인물 사전',
            });
        }
        const { epithetHtml, momentHtml, bioHtml, sections } = await personBody(personId, person, loaded, lang);
        const historyEvents = (await loadCommuLingoPersonHistoryEvents(personId)).map(event => ({
            ...event, title: localize(event.title, lang), relation: localize(event.relation, lang), note: localize(event.note, lang),
        }));
        // Politburo career, when the person sat on the body (politburo.json is
        // keyed by dictionary person id). Renders as one box between the career
        // timeline and the related events.
        let politburo = null;
        try {
            politburo = politburoCareerFor(personId, lang);
        } catch (e) {
            console.error('commulingo person politburo box:', e);
        }
        // Public research reports that mention this person. Failure only costs
        // the section, never the page.
        let relatedReports = [];
        try {
            relatedReports = await getReportsForPerson(personId, lang);
        } catch (e) {
            console.error('commulingo person related reports:', e);
        }
        // Reference documents (참고 문헌) linked to this person via the docs
        // manifest. Failure only costs the section, never the page.
        const relatedDocs = relatedDocsFor('people', personId, lang);
        setShortPublicCache(res);
        res.render('public/commulingo-person', {
            person,
            epithetHtml,
            momentHtml,
            bioHtml,
            sections,
            historyEvents,
            politburo,
            genealogies: genealogyLinksFor('person', personId, lang),
            relatedReports,
            relatedDocs,
            roleIconSvg,
            roleHubHref,
            pageTitle: lang === 'en' ? `${person.displayName} — People` : `${person.displayName} — 인물 사전`,
            pageDescription: person.bio || person.epithet,
            pagePath: `/commulingo/people/${person.id}`,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'People' : '인물 사전', href: '/commulingo/people' },
                { name: person.displayName, href: `/commulingo/people/${person.id}` },
            ]),
        });
    } catch (err) {
        console.error('commulingo person detail:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load person data.' : '인물 정보를 불러올 수 없습니다.',
            backHref: '/commulingo/people',
            backLabel: res.locals.lang === 'en' ? 'People' : '인물 사전',
        });
    }
});

module.exports = router;
