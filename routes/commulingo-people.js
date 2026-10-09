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
const { bodyCareersFor, availableBodies } = require('../data/commulingo/politburo-store');
const { glossaryLinksFor } = require('../data/commulingo/office-term-links');
const { CENTRAL_COMMITTEE_TERM_ID } = require('../data/commulingo/party-bodies');
const { otherNames } = require('../data/commulingo/person-other-names');
const { hasFlag } = require('../data/commulingo/flag-icons');
const { getReportsForPerson, getReportsForTopic } = require('../services/report-mentions');
const { loadStandardizedPeople, peopleShellFor } = require('../data/commulingo/people-view');

// The people dictionary: shell + card fragments, office /
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
        const { lang, loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        const state = explorer.parseExplorerQuery(req.query);
        const merged = activitiesModel.catalog.retired?.[state.affiliationId];
        if (merged) return res.redirect(301, languagePath(explorer.explorerHref(state, { affiliationId: merged, officeId: state.officeId, page: state.page }), lang));
        // A retired position collection (communist → marxism-leninism) keeps its links.
        const position = state.positionId && !(standardized.collections || []).some(c => c.id === state.positionId)
            && redirectTarget(loaded.data, 'role-category', state.positionId);
        if (position) return res.redirect(301, languagePath(explorer.explorerHref(state, { positionId: position, page: state.page }), lang));
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
            bodies: availableBodies(lang),
            groupsMeta: peopleShellFor(standardized).groupsMeta,
            people: active ? explore.pagination.pageItems : [],
            linkifyPersonText: active && explore.view === 'cards' ? await cardTextLinker(res) : null,
            pageSize: PAGE_SIZE,
            roleIconSvg,
            roleHubHref,
            pageTitle: active
                ? (lang === 'en' ? `${resultLabel} — People` : `${resultLabel} — 인물 사전`)
                : (lang === 'en' ? 'People — CommuLingo' : '인물 사전 — 공산링고'),
            pageDescription: lang === 'en'
                ? 'People of revolutionary and socialist history, found by activity, affiliation, era and position.'
                : '혁명과 사회주의 역사의 인물들을 활동·소속·시대·직위로 찾는 인물 사전.',
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

// Retired group pages now enter the people explorer's era filter. Keep old
// bookmarks (including renamed groups) working without rendering a second UI.
router.get('/people/list/:groupId', async (req, res) => {
    try {
        const groupId = typeof req.params.groupId === 'string' ? req.params.groupId.trim() : '';
        const { lang, loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        const groups = standardized.groups || [];
        const canonicalId = redirectTarget(loaded.data, 'people-group', groupId);
        const group = groups.find(item => item.id === groupId)
            || groups.find(item => item.id === canonicalId);
        if (!group) return errorPage.notFound(res, {
            message: lang === 'en' ? 'People group not found.' : '인물 그룹을 찾을 수 없습니다.',
            backHref: '/commulingo/people',
            backLabel: lang === 'en' ? 'People' : '인물 사전',
        });
        const state = explorer.parseExplorerQuery(req.query);
        res.redirect(301, languagePath(explorer.explorerHref(state, { eraId: group.id }), lang));
    } catch (err) {
        console.error('commulingo people list redirect:', err);
        commuLingoLoadError(res, { message: { ko: '인물 그룹을 불러올 수 없습니다.', en: 'Failed to load people group.' }, backHref: '/commulingo/people', backLabel: { ko: '인물 사전', en: 'People' } });
    }
});

// The office index: Central Committee rosters, then the office lineage pages
// in commulingo_offices.sort_order (chronological), not the person-list order.
router.get('/offices', async (req, res) => {
    try {
        const { lang, standardized } = await loadStandardizedPeople(res.locals.lang);
        const order = new Map(standardized.officeOrder.map((id, index) => [id, index]));
        const offices = [...standardized.offices].sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
        const title = lang === 'en' ? 'Soviet offices' : '소련 직책 계보';
        setShortPublicCache(res);
        res.render('public/commulingo-offices', {
            offices,
            bodies: availableBodies(lang),
            rosterGlossary: await glossaryLinksFor([CENTRAL_COMMITTEE_TERM_ID], lang),
            roleIconSvg,
            pageTitle: `${title} — ${lang === 'en' ? 'CommuLingo' : '공산링고'}`,
            pageDescription: res.locals.strings.commuLingoViews.office.lineagesIntro,
            pagePath: '/commulingo/offices',
            jsonLd: commuLingoBreadcrumb(lang, [{ name: title, href: '/commulingo/offices' }]),
        });
    } catch (err) {
        console.error('commulingo office index:', err);
        commuLingoLoadError(res, { message: { ko: '소련 직책 계보를 불러올 수 없습니다.', en: 'Failed to load the office index.' } });
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
        // The people link filters by activity affiliation and officeId: use the
        // affiliation that finds the most people (party and Comintern lines are
        // not mostly state-soviet), and drop the link when none finds anyone.
        const [officeAffiliation] = [...activitiesModel.OFFICE_AFFILIATIONS]
            .map(affiliationId => [affiliationId, standardized.people
                .filter(person => activitiesModel.matchesActivities(person, { affiliationId, officeId: office.id })).length])
            .filter(([, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])[0] || [];
        const officePeopleHref = officeAffiliation ? `/commulingo/people?affiliation=${officeAffiliation}&office=${office.id}` : '';
        res.render('public/commulingo-office', {
            office,
            officePeopleHref,
            glossary: await glossaryLinksFor(office.termIds, lang),
            rosters: availableBodies(lang).filter(body => body.officeId === office.id),
            relatedReports,
            roleIconSvg,
            pageTitle: lang === 'en' ? `${office.title} — Soviet offices` : `${office.title} — 소련 직책 계보`,
            pageDescription: office.blurb,
            pagePath: `/commulingo/offices/${office.id}`,
            jsonLd: commuLingoBreadcrumb(lang, [
                { name: lang === 'en' ? 'Soviet offices' : '소련 직책 계보', href: '/commulingo/offices' },
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
        // political positions are the explorer's position filter.
        const collections = standardized.collections || [];
        const id = collections.some(c => c.id === categoryId) ? categoryId : redirectTarget(loaded.data, 'role-category', categoryId);
        if (id && collections.some(c => c.id === id)) return res.redirect(301, languagePath(explorer.explorerHref({}, { positionId: id }), lang));
        return errorPage.notFound(res, {
            message: lang === 'en' ? 'Role category not found.' : '역할 범주를 찾을 수 없습니다.',
            backHref: '/commulingo/people',
            backLabel: lang === 'en' ? 'People' : '인물 사전',
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

// Keep old nationality-list links working through the searchable people explorer.
function redirectNationalityPeople(req, res, field) {
    const code = req.params.code.trim();
    const lang = res.locals.lang;
    if (!hasFlag(code)) return errorPage.notFound(res, {
        message: lang === 'en' ? 'Nationality filter not found.' : '국적·배경 필터를 찾을 수 없습니다.',
        backHref: '/commulingo/people',
        backLabel: lang === 'en' ? 'People' : '인물 사전',
    });
    const state = explorer.parseExplorerQuery(req.query);
    return res.redirect(301, languagePath(explorer.explorerHref(state, { [field]: code }), lang));
}

router.get('/people/citizenship/:code', (req, res) => redirectNationalityPeople(req, res, 'citizenship'));
router.get('/people/national-origin/:code', (req, res) => redirectNationalityPeople(req, res, 'origin'));

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
        // Central Committee body careers (Politburo, Secretariat, Orgburo), when
        // the person sat on them (the rosters are keyed by dictionary person id).
        // One box each between the career timeline and the related events.
        let bodyCareers = [];
        try {
            bodyCareers = bodyCareersFor(personId, lang);
        } catch (e) {
            console.error('commulingo person party body boxes:', e);
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
            bodyCareers,
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
