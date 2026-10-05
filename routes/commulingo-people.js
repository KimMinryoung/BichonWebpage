const activitiesModel = require('../data/commulingo/person-activities');
const explorer = require('../data/commulingo/people-explorer');
const { languagePath } = require('../utils/seo');
const express = require('express');
const { setShortPublicCache, commuLingoBreadcrumb, commuLingoLoadError } = require('../data/commulingo/page-helpers');
const errorPage = require('../utils/error-page');
const { localize } = require('../data/commulingo/localize');
const { redirectTarget } = require('../data/commulingo/people-store');
const { loadCommuLingoPersonHistoryEvents } = require('../data/commulingo/history-events-store');
const { relatedDocsFor } = require('../data/commulingo/docs-refs');
const { PAGE_SIZE } = require('../data/commulingo/list-pagination');
const { roleIconSvg, roleHubHref } = require('../data/commulingo/role-icons');
const { genealogyLinksFor } = require('../data/commulingo/genealogy-links');
const { politburoCareerFor } = require('../data/commulingo/politburo-store');
const { otherNames } = require('../data/commulingo/person-other-names');
const { buildNationalityFilter } = require('../data/commulingo/nationality-filter');
const { countryHref } = require('../data/commulingo/country-geography');
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
const { practiceDecksFor } = require('../data/commulingo/drill-presentation');
const { courseChaptersFor } = require('../data/commulingo/book-page');
const RETIRED_ROLE_PAGES = require('../data/commulingo/retired-role-pages');

// The people explorer: search + facets over every person, and the era shelves
// when no condition is set. Every state is a URL; commulingo-people.js swaps
// #people-browser in place, so the same render serves links and script.
router.get('/people', async (req, res) => {
    try {
        const { lang, standardized } = await loadStandardizedPeople(res.locals.lang);
        const state = explorer.parseExplorerQuery(req.query);
        const merged = activitiesModel.catalog.retired?.[state.affiliationId];
        if (merged) return res.redirect(301, languagePath(explorer.explorerHref(state, { affiliationId: merged, officeId: state.officeId, page: state.page }), lang));
        const unknown = explorer.unknownCondition(standardized, state);
        if (unknown) return errorPage.notFound(res, {
            message: lang === 'en' ? 'This people filter does not exist.' : '없는 인물 분류 조건입니다.',
            backHref: '/commulingo/people',
            backLabel: lang === 'en' ? 'People' : '인물 사전',
        });
        const active = explorer.hasConditions(state);
        const explore = explorer.exploreFor(standardized, state, lang);
        setShortPublicCache(res);
        const resultLabel = explore.conditions.map(c => c.label).join(' · ');
        res.render('public/commulingo-people', {
            state,
            active,
            explore,
            explorerHref: explorer.explorerHref,
            offices: standardized.offices,
            groupsMeta: peopleShellFor(standardized).groupsMeta,
            people: active ? explore.pagination.pageItems : [],
            linkifyPersonText: active && explore.view === 'cards' ? await cardTextLinker(res) : null,
            pageSize: PAGE_SIZE,
            roleIconSvg,
            roleHubHref,
            pageTitle: active
                ? (lang === 'en' ? `${resultLabel} — People` : `${resultLabel} — 인물 사전`)
                : (lang === 'en' ? 'People of the Revolution and the USSR' : '인물 사전 — 혁명과 소련의 사람들'),
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
        const { lang, loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        const group = (standardized.groups || []).find(item => item.id === groupId);
        const meta = peopleShellFor(standardized).groupsMeta.find(item => item.id === groupId);
        if (!group) {
            const merged = redirectTarget(loaded.data, 'people-group', groupId);
            if (merged) return res.redirect(301, `/commulingo/people/list/${encodeURIComponent(merged)}${req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`);
        }
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
        const relatedReports = await relatedReportsForTopic('office', office.id, lang);
        setShortPublicCache(res);
        res.render('public/commulingo-office', {
            office,
            relatedReports,
            roleIconSvg,
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

// The former activity browser is the people explorer now; its links keep
// their parameters (function, affiliation, office, q, page).
router.get('/activities', (req, res) => {
    const query = new URLSearchParams(Object.entries(req.query).filter(([, v]) => typeof v === 'string')).toString();
    res.redirect(301, languagePath(`/commulingo/people${query ? `?${query}` : ''}`, res.locals.lang));
});

router.get('/roles/:categoryId', async (req, res) => {
    try {
        const categoryId = typeof req.params.categoryId === 'string' ? req.params.categoryId.trim() : '';
        const mapped = activitiesModel.catalog.legacy[categoryId];
        if (mapped) return res.redirect(301, activitiesModel.activityHref({ functionId: mapped[0], affiliationId: mapped[1] }));
        const retired = RETIRED_ROLE_PAGES[categoryId];
        if (retired) {
            const lang = res.locals.lang === 'en' ? 'en' : 'ko';
            const links = retired.links.map(([kind, id]) => {
                const entry = (kind === 'function' ? activitiesModel.functions : activitiesModel.affiliations).get(id);
                return { label: localize(entry.label, lang), icon: entry.icon, href: activitiesModel.activityHref(kind === 'function' ? { functionId: id } : { affiliationId: id }) };
            });
            setShortPublicCache(res);
            const label = localize(retired.label, lang);
            return res.render('public/commulingo-role-retired', { label, note: localize(retired.note, lang), links, roleIconSvg,
                pageTitle: lang === 'en' ? `${label} — People` : `${label} — 인물 사전`,
                pageDescription: localize(retired.note, lang), pagePath: `/commulingo/roles/${categoryId}` });
        }
        const { lang, loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        // The old role-category URLs: function categories redirect to their
        // activity filter (above), regional ones are pointer pages (above) and
        // political positions are curated collections (migration 213).
        const collection = (standardized.collections || []).find(c => c.id === categoryId);
        const category = collection && { id: collection.id, icon: collection.icon, label: collection.title, intro: collection.intro };
        if (!category) {
            const renamed = redirectTarget(loaded.data, 'role-category', categoryId);
            if (renamed) return res.redirect(301, `/commulingo/roles/${renamed}`);
            return errorPage.notFound(res, {
                message: lang === 'en' ? 'Role category not found.' : '역할 범주를 찾을 수 없습니다.',
                backHref: '/commulingo/people',
                backLabel: lang === 'en' ? 'People' : '인물 사전',
            });
        }
        const people = sortPeopleChronologically(collection.personIds.map(id => standardized.peopleById[id]));
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
            pageDescription: category.intro || (lang === 'en'
                ? `People in the ${category.label} role category.`
                : `${category.label} 역할 범주의 인물들.`),
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
            roleIconSvg,
            roleHubHref,
            linkifyPersonText: await cardTextLinker(res),
            pageTitle: lang === 'en'
                ? `${filter.label}: ${filter.peopleLabel} — World Map`
                : `${filter.label} ${filter.peopleLabel} — 세계 지도`,
            pageDescription: lang === 'en'
                ? `People whose ${filter.kindLabel.toLowerCase()} is ${filter.label}.`
                : `${filter.kindLabel}이(가) ${filter.label}인 인물들.`,
            pagePath: filter.href,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'World Map' : '세계 지도', href: '/commulingo/map' },
                ...(countryHref(code) ? [{ name: filter.label, href: countryHref(code) }] : []),
                { name: filter.peopleLabel, href: filter.href },
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
            otherNames: otherNames(person, lang),
            epithetHtml,
            momentHtml,
            bioHtml,
            sections,
            historyEvents,
            politburo,
            genealogies: genealogyLinksFor('person', personId, lang),
            relatedReports,
            relatedDocs,
            practiceDecks: await practiceDecksFor([`/commulingo/people/${person.id}`], lang),
            courseChapters: await courseChaptersFor([`people:${person.id}`], lang),
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
