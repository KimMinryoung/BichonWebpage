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
const { getLinkIndexes, createLinker, createCardTextLinker } = require('../data/commulingo/linkify');
const { roleIconSvg, roleHubHref } = require('../data/commulingo/role-icons');
const { genealogyLinksFor } = require('../data/commulingo/genealogy-links');
const { politburoCareerFor } = require('../data/commulingo/politburo-store');
const { flagImg } = require('../data/commulingo/flag-icons');
const { nationalityHubHref, buildNationalityFilter } = require('../data/commulingo/nationality-filter');
const { getReportsForPerson, getReportsForTopic } = require('../services/report-mentions');
const { loadStandardizedPeople, peopleShellFor, sortPeopleChronologically, localizedPersonSections } = require('../data/commulingo/people-view');

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

// Card prose (epithet, moment, bio) on the list and hub pages. Person names
// only — see the `card` surface in linkify.js — with one seen-set per card, and
// a fresh set of linkers per request.
async function cardTextLinker(res) {
    return createCardTextLinker(await getLinkIndexes(res.locals.lang));
}

// /people is served as a light shell (search box, institution index, group
// headers) — ~8MB of person-card markup no longer ships with the page. The
// cards load per group on demand from /people/cards?group=<id>; each group
// fragment is memoized per (standardized, link indexes), so it is rendered
// once per data refresh per language, not per request.
const peopleGroupCardsMemo = new WeakMap(); // standardized -> { indexesRef, byGroup: Map }

// Linkified person-page bodies, keyed by the per-language link-index entry (a
// new entry appears whenever any dictionary changes, dropping the old Map).
const personBodyMemo = new WeakMap(); // indexes -> Map(personId -> { epithetHtml, momentHtml, bioHtml, sections })

// `page` cuts the group to one page of cards (list-pagination.js) and appends
// the site's pager, which the people shell redraws the group from; without
// it the whole group is returned, which is what the search corpus needs.
const PEOPLE_CARDS_BASE = group => `/commulingo/people/cards?group=${encodeURIComponent(group.id)}&page=`;

async function peopleGroupCardsHtml(req, standardized, lang, group, page, baseUrl) {
    const indexes = await getLinkIndexes(lang);
    let memo = peopleGroupCardsMemo.get(standardized);
    if (!memo || memo.indexesRef !== indexes) {
        memo = { indexesRef: indexes, byGroup: new Map() };
        peopleGroupCardsMemo.set(standardized, memo);
    }
    const sorted = sortPeopleChronologically(group.people);
    const pagerBase = baseUrl || PEOPLE_CARDS_BASE(group);
    const pagination = page
        ? paginateList(sorted, sorted, { page }, pagerBase, { mark: false })
        : null;
    const key = pagination ? `${group.id}\0${pagination.current}\0${pagerBase}` : group.id;
    let html = memo.byGroup.get(key);
    if (!html) {
        // req.app.render knows app.locals only, so the per-language string
        // table every view otherwise gets from res.locals is passed by hand.
        html = await renderAppView(req, 'partials/commulingo-people-group-cards', {
            strings: allStrings[lang],
            people: pagination ? pagination.pageItems : sorted,
            groupId: group.id,
            en: lang === 'en',
            roleIconSvg,
            roleHubHref,
            flagImg,
            nationalityHubHref,
            linkifyPersonText: createCardTextLinker(indexes),
        });
        if (pagination) {
            html += await renderAppView(req, 'partials/commulingo-list-pager', {
                strings: allStrings[lang],
                pagination,
                target: `.commu-people-group.is-${group.id} .commu-people-grid`,
                en: lang === 'en',
            });
        }
        memo.byGroup.set(key, html);
    }
    return html;
}

router.get('/people', async (req, res) => {
    try {
        const { lang, standardized } = await loadStandardizedPeople(res.locals.lang);
        setShortPublicCache(res);
        const { roleCategories, groupsMeta } = peopleShellFor(standardized, lang);
        res.render('public/commulingo-people', {
            offices: standardized.offices,
            roleCategories,
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

router.get('/roles/:categoryId', async (req, res) => {
    try {
        const categoryId = typeof req.params.categoryId === 'string' ? req.params.categoryId.trim() : '';
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
        // Sections come from the snapshot (loaded.data); history events from their
        // own cached store. The linkified page body (epithet/moment/bio +
        // sections, ~60-80ms for section-heavy people) is a pure function of
        // the snapshot and the link indexes, so it is rendered once per data
        // refresh per person and served from the memo afterwards.
        const indexes = await getLinkIndexes(lang);
        let personPages = personBodyMemo.get(indexes);
        if (!personPages) {
            personPages = new Map();
            personBodyMemo.set(indexes, personPages);
        }
        let body = personPages.get(personId);
        if (!body) {
            const rawSections = (loaded.data.sections || {})[personId] || [];
            const sections = localizedPersonSections(rawSections, lang);
            // One linker for the whole page — bio and every section share its
            // seen-set, so a document, event, term, or colleague named throughout a
            // career is a link at its first mention. The person's own name is
            // excluded so the page never links to itself.
            const link = createLinker(indexes, {
                surface: 'person',
                exclude: { person: person.id },
            });
            // Reading order: epithet, moment, bio, then the sections. The moment is a
            // scene with other people in it — 예조프가 류시코프의 전보를 스탈린에게 —
            // and it printed as plain text here while the same sentence linked on the
            // person's card in the list.
            const epithetHtml = link.plain(person.epithet);
            const momentHtml = link.plain(person.moment);
            const bioHtml = link.plain(person.bio);
            sections.forEach(section => {
                section.bodyHtml = link.html(section.bodyHtml);
            });
            body = { epithetHtml, momentHtml, bioHtml, sections };
            personPages.set(personId, body);
        }
        const { epithetHtml, momentHtml, bioHtml, sections } = body;
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
