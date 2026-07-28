const express = require('express');
const db = require('../config/database');
const errorPage = require('../utils/error-page');
const { renderMarkdown } = require('../utils/markdown');
const { loadCommuLingoCatalog, loadCommuLingoLesson, currentVersion } = require('../data/commulingo/shards');
const { localize: localizeCommuLingoValue } = require('../data/commulingo/people-standard');
const { loadCommuLingoPeople: loadCommuLingoPeopleData } = require('../data/commulingo/people-store');
const { loadCommuLingoPersonHistoryEvents } = require('../data/commulingo/history-events-store');
const { listCommuLingoDocsFor } = require('../data/commulingo/docs-store');
const {
    standardizedFor,
    getLinkIndexes,
    createLinker,
    createCardTextLinker,
    clientPersonLinkPayload,
} = require('../data/commulingo/linkify');
const { roleIconSvg, roleHubHref } = require('../data/commulingo/role-icons');
const { flagImg } = require('../data/commulingo/flag-icons');
const { nationalityHubHref, buildNationalityFilter } = require('../data/commulingo/nationality-filter');
const { getReportsForPerson, getReportsForTopic } = require('../services/report-mentions');

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

const LEGACY_OFFICE_IDS = {
    'heavy-industry-mic': 'heavy-military-industry',
    security: 'state-security',
    government: 'head-of-government',
    planning: 'central-planning',
};

const LEGACY_PERSON_IDS = {
    'stepan-shahumyan': 'stepan-shaumyan',
};

const LEGACY_ROLE_CATEGORY_IDS = {
    writer: 'writer-artist',
    'old-regime': 'imperial-white',
    'intl-revolutionary': 'non-soviet-revolutionary',
    'bloc-reformer': 'socialist-bloc-reform-leader',
};

// Expose the flag and role-icon renderers to every CommuLingo template (and
// their partials — the dictionary switcher nav needs roleIconSvg everywhere).
router.use((req, res, next) => {
    res.locals.flagImg = flagImg;
    res.locals.nationalityHubHref = nationalityHubHref;
    res.locals.roleIconSvg = roleIconSvg;
    next();
});

// People are served from the in-memory copy maintained by people-store.js
// (DB only on refresh/cold-start), so page loads never wait on the DB.
// Returns { data, source }.
async function loadCommuLingoPeople(options = {}) {
    return loadCommuLingoPeopleData(options);
}

// normalizeCommuLingoPeople and the person link index are memoized against the
// snapshot + catalog references in linkify.js, so this route, the report linker,
// and the shared index set all read one copy per refresh.
async function loadStandardizedPeople(req, res, options = {}) {
    const lang = res.locals.lang;
    const catalog = loadCommuLingoCatalog();
    const loaded = await loadCommuLingoPeople(options);
    const { standardized } = standardizedFor(loaded.data, catalog, lang);
    return { lang, catalog, loaded, standardized };
}

// Card prose (epithet, moment, bio) on the list and hub pages. Person names
// only — see the `card` surface in linkify.js — with one seen-set per card, and
// a fresh set of linkers per request.
async function cardTextLinker(res) {
    return createCardTextLinker(await getLinkIndexes(res.locals.lang));
}

function renderAppView(req, view, locals) {
    return new Promise((resolve, reject) => {
        req.app.render(view, locals, (err, html) => (err ? reject(err) : resolve(html)));
    });
}

// The /people groups fragment is ~8MB of markup built from 1200 cards x 3
// linkify passes (~200ms). It is a pure function of the standardized people
// and the link indexes, both of which keep a stable reference until the data
// actually changes — so render it once per refresh per language and serve the
// cached string afterwards.
const peopleGroupsHtmlMemo = new WeakMap(); // standardized -> { indexesRef, html }

// Linkified person-page bodies, keyed by the per-language link-index entry (a
// new entry appears whenever any dictionary changes, dropping the old Map).
const personBodyMemo = new WeakMap(); // indexes -> Map(personId -> { epithetHtml, momentHtml, bioHtml, sections })

async function peopleGroupsHtml(req, standardized, lang) {
    const indexes = await getLinkIndexes(lang);
    const cached = peopleGroupsHtmlMemo.get(standardized);
    if (cached && cached.indexesRef === indexes) return cached.html;
    const html = await renderAppView(req, 'partials/commulingo-people-groups', {
        groups: standardized.groups.map(group => ({
            ...group,
            people: sortPeopleChronologically(group.people),
        })),
        en: lang === 'en',
        roleIconSvg,
        roleHubHref,
        flagImg,
        nationalityHubHref,
        linkifyPersonText: createCardTextLinker(indexes),
    });
    peopleGroupsHtmlMemo.set(standardized, { indexesRef: indexes, html });
    return html;
}

function setPublicDataCache(req, res, version) {
    if (req.query && req.query.v === version) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return;
    }
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
}

function requireUser(req, res, next) {
    if (req.session.user && req.session.user.id) return next();
    return res.status(401).json({ error: 'login required' });
}

function normalizeProgress(raw) {
    const lessonId = typeof raw.lessonId === 'string' ? raw.lessonId.trim() : '';
    const score = Number.parseInt(raw.score, 10);
    const totalQuestions = Number.parseInt(raw.totalQuestions, 10);
    return {
        lessonId,
        completed: raw.completed === true || raw.completed === 'true',
        score: Number.isFinite(score) && score >= 0 ? score : 0,
        totalQuestions: Number.isFinite(totalQuestions) && totalQuestions >= 0 ? totalQuestions : 0,
    };
}

function localize(value, lang) {
    return localizeCommuLingoValue(value, lang);
}

// Chronological order for a person list: by birth year, then death year, then
// name. People without a parsed birth year sort to the end. Returns a new array.
function sortPeopleChronologically(people) {
    return (people || []).slice().sort((a, b) => {
        const ay = a.yearsData && a.yearsData.birthYear;
        const by = b.yearsData && b.yearsData.birthYear;
        if (ay && by && ay !== by) return ay - by;
        if (ay && !by) return -1;
        if (!ay && by) return 1;
        const ad = a.yearsData && a.yearsData.deathYear;
        const bd = b.yearsData && b.yearsData.deathYear;
        if (ad && bd && ad !== bd) return ad - bd;
        return (a.displayName || '').localeCompare(b.displayName || '');
    });
}

function localizedPersonSections(sections, lang) {
    return (sections || []).map(section => {
        const body = localize(section.body, lang);
        if (!body) return null;
        return {
            slug: section.slug,
            heading: localize(section.heading, lang),
            bodyHtml: renderMarkdown(body),
        };
    }).filter(Boolean);
}

function summarizeBooks(catalog) {
    return (catalog.collections || []).map(collection => {
        const chapters = collection.chapters || [];
        const lessonIds = [];
        chapters.forEach(chapter => {
            (chapter.lessons || []).forEach(lesson => {
                if (lesson && lesson.id && Number(lesson.questionCount) > 0) lessonIds.push(lesson.id);
            });
        });
        const graph = collection.conceptGraph;
        const timeline = collection.decisionTimeline;
        const episodeCount = timeline && Array.isArray(timeline.eras)
            ? timeline.eras.reduce((sum, era) => sum + (Array.isArray(era.episodes) ? era.episodes.length : 0), 0)
            : 0;
        return {
            id: collection.id,
            volumeNumber: collection.volumeNumber,
            title: collection.title,
            badge: collection.badge,
            description: collection.description,
            format: collection.format,
            chapterCount: chapters.length,
            nodeCount: graph && Array.isArray(graph.nodes) ? graph.nodes.length : 0,
            episodeCount,
            lessonIds,
        };
    });
}

router.get('/', (req, res) => {
    const catalog = loadCommuLingoCatalog();
    res.render('public/commulingo-index', {
        books: { version: catalog.version, collections: summarizeBooks(catalog) },
        pageTitle: res.locals.strings.commuLingo.title,
        pageDescription: res.locals.strings.commuLingo.description,
        pagePath: '/commulingo',
        extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
    });
});

router.use('/events', require('./commulingo-events'));
router.use('/terms', require('./commulingo-terms'));
router.use('/docs', require('./commulingo-docs'));

router.get('/people', async (req, res) => {
    try {
        const { lang, standardized } = await loadStandardizedPeople(req, res);
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        const roleCategories = Object.values(standardized.roleCategories || {}).map(category => ({
            ...category,
            label: category.id === 'non-soviet-revolutionary'
                ? (lang === 'en' ? 'Revolutionaries beyond the Soviet Union' : '소련 밖의 혁명가들')
                : category.label,
            peopleCount: standardized.people.filter(person => person.role && person.role.categoryId === category.id).length,
        })).filter(category => category.peopleCount > 0);
        res.render('public/commulingo-people', {
            offices: standardized.offices,
            roleCategories,
            groupsHtml: await peopleGroupsHtml(req, standardized, lang),
            peopleCount: standardized.people.length,
            roleIconSvg,
            roleHubHref,
            pageTitle: lang === 'en' ? 'People of the Revolution and the USSR' : '인물 사전 — 혁명과 소련의 사람들',
            pageDescription: lang === 'en'
                ? 'The people who stood at the forks of the two decision-simulation history books.'
                : '두 권의 결정 시뮬레이션 역사책, 그 갈림길에 서 있던 사람들.',
            pagePath: '/commulingo/people',
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
        });
    } catch (err) {
        console.error('commulingo people:', err);
        res.status(500).send('Failed to load people data');
    }
});

router.get('/offices/:officeId', async (req, res) => {
    try {
        const officeId = typeof req.params.officeId === 'string' ? req.params.officeId.trim() : '';
        if (LEGACY_OFFICE_IDS[officeId]) {
            return res.redirect(301, `/commulingo/offices/${LEGACY_OFFICE_IDS[officeId]}`);
        }
        const { lang, standardized } = await loadStandardizedPeople(req, res);
        const office = standardized.offices.find(item => item.id === officeId);
        if (!office) {
            return errorPage.notFound(res, {
                message: lang === 'en' ? 'Office not found.' : '기관을 찾을 수 없습니다.',
                backHref: '/commulingo/people',
                backLabel: lang === 'en' ? 'People' : '인물 사전',
            });
        }
        const people = sortPeopleChronologically(standardized.people.filter(person => person.role && person.role.officeId === office.id));
        const relatedReports = await relatedReportsForTopic('office', office.id, lang);
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
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
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
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
        if (LEGACY_ROLE_CATEGORY_IDS[categoryId]) {
            return res.redirect(301, `/commulingo/roles/${LEGACY_ROLE_CATEGORY_IDS[categoryId]}`);
        }
        const { lang, standardized } = await loadStandardizedPeople(req, res);
        const category = standardized.roleCategories[categoryId];
        if (!category) {
            return errorPage.notFound(res, {
                message: lang === 'en' ? 'Role category not found.' : '역할 범주를 찾을 수 없습니다.',
                backHref: '/commulingo/people',
                backLabel: lang === 'en' ? 'People' : '인물 사전',
            });
        }
        const people = sortPeopleChronologically(standardized.people.filter(person => person.role && person.role.categoryId === category.id));
        const relatedReports = await relatedReportsForTopic('role', category.id, lang);
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
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
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
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
        const { lang, standardized } = await loadStandardizedPeople(req, res);
        const filter = buildNationalityFilter(standardized.people, kind, code, lang);
        if (!filter) {
            return errorPage.notFound(res, {
                message: lang === 'en' ? 'Nationality filter not found.' : '국적·배경 필터를 찾을 수 없습니다.',
                backHref: '/commulingo/people',
                backLabel: lang === 'en' ? 'People' : '인물 사전',
            });
        }
        filter.people = sortPeopleChronologically(filter.people);
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
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
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
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
        if (LEGACY_PERSON_IDS[personId]) {
            return res.redirect(301, `/commulingo/people/${LEGACY_PERSON_IDS[personId]}`);
        }
        const { lang, loaded, standardized } = await loadStandardizedPeople(req, res);
        const person = standardized.peopleById[personId];
        if (!person) {
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
        let relatedDocs = [];
        try {
            relatedDocs = listCommuLingoDocsFor('people', personId).map(doc => ({
                id: doc.id,
                title: localize(doc.title, lang),
                kind: localize(doc.kind, lang),
            }));
        } catch (e) {
            console.error('commulingo person related docs:', e);
        }
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-person', {
            person,
            epithetHtml,
            momentHtml,
            bioHtml,
            sections,
            historyEvents,
            relatedReports,
            relatedDocs,
            roleIconSvg,
            roleHubHref,
            pageTitle: lang === 'en' ? `${person.displayName} — People` : `${person.displayName} — 인물 사전`,
            pageDescription: person.bio || person.epithet,
            pagePath: `/commulingo/people/${person.id}`,
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
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

function setShortPeopleApiCache(res) {
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
}

router.get('/api/people', async (req, res) => {
    try {
        const { loaded, standardized } = await loadStandardizedPeople(req, res, { fresh: req.query.fresh === '1' });
        setShortPeopleApiCache(res);
        res.json({
            schemaVersion: standardized.schemaVersion,
            source: loaded.source,
            lang: standardized.lang,
            peopleCount: standardized.people.length,
            people: standardized.people,
            groups: standardized.groups.map(group => ({
                id: group.id,
                range: group.range,
                title: group.title,
                blurb: group.blurb,
                people: group.people.map(person => person.id),
            })),
        });
    } catch (err) {
        console.error('commulingo people api:', err);
        res.status(500).json({ error: 'failed to load people data' });
    }
});

router.get('/api/people/:personId', async (req, res) => {
    try {
        const personId = typeof req.params.personId === 'string' ? req.params.personId.trim() : '';
        if (LEGACY_PERSON_IDS[personId]) {
            return res.redirect(301, `/commulingo/api/people/${LEGACY_PERSON_IDS[personId]}`);
        }
        const { loaded, standardized } = await loadStandardizedPeople(req, res, { fresh: req.query.fresh === '1' });
        const person = standardized.peopleById[personId];
        if (!person) return res.status(404).json({ error: 'person not found' });
        const sections = localizedPersonSections((loaded.data.sections || {})[personId] || [], standardized.lang);
        setShortPeopleApiCache(res);
        res.json({ schemaVersion: standardized.schemaVersion, source: loaded.source, lang: standardized.lang, person, sections });
    } catch (err) {
        console.error('commulingo person api:', err);
        res.status(500).json({ error: 'failed to load person data' });
    }
});

router.get('/api/offices', async (req, res) => {
    try {
        const { loaded, standardized } = await loadStandardizedPeople(req, res, { fresh: req.query.fresh === '1' });
        setShortPeopleApiCache(res);
        res.json({
            schemaVersion: standardized.schemaVersion,
            source: loaded.source,
            lang: standardized.lang,
            offices: standardized.offices,
        });
    } catch (err) {
        console.error('commulingo offices api:', err);
        res.status(500).json({ error: 'failed to load offices data' });
    }
});

router.get('/api/offices/:officeId', async (req, res) => {
    try {
        const officeId = typeof req.params.officeId === 'string' ? req.params.officeId.trim() : '';
        const { loaded, standardized } = await loadStandardizedPeople(req, res, { fresh: req.query.fresh === '1' });
        const office = standardized.offices.find(item => item.id === officeId);
        if (!office) return res.status(404).json({ error: 'office not found' });
        setShortPeopleApiCache(res);
        res.json({ schemaVersion: standardized.schemaVersion, source: loaded.source, lang: standardized.lang, office });
    } catch (err) {
        console.error('commulingo office api:', err);
        res.status(500).json({ error: 'failed to load office data' });
    }
});

router.get('/book/:collectionId', async (req, res) => {
    try {
        const collectionId = typeof req.params.collectionId === 'string' ? req.params.collectionId.trim() : '';
        const catalog = loadCommuLingoCatalog();
        const collection = (catalog.collections || []).find(item => item.id === collectionId);
        if (!collection) return res.redirect('/commulingo');

        // Linked chapters, dictionary chips, and the decision-link payload are
        // pure functions of (collection, link indexes, lang); the chip list
        // alone walks every lesson shard (~104 files, ~225ms measured for
        // capital-vol3), so rebuild only when those references change and
        // serve the memoized result otherwise. On a linkify failure the page
        // renders plain and uncached, so the next request retries.
        let pageData;
        try {
            pageData = await bookPageData(collection, res.locals.lang);
        } catch (err) {
            console.error('commulingo book linkify:', err);
            pageData = {
                linked: collection,
                dictionaryEntries: { people: [], terms: [], events: [], docs: [] },
                decisionLinks: { blocked: [], people: [] },
            };
        }

        const bookTitle = localize(collection.title, res.locals.lang);
        res.render('public/commulingo-book', {
            lessons: { version: catalog.version, collections: [pageData.linked] },
            dictionaryEntries: pageData.dictionaryEntries,
            decisionLinks: pageData.decisionLinks,
            bookFormat: collection.format || 'quiz',
            bookTitle,
            bookDescription: localize(collection.description, res.locals.lang),
            pageTitle: bookTitle,
            pageDescription: localize(collection.description, res.locals.lang) || res.locals.strings.commuLingo.description,
            pagePath: `/commulingo/book/${collection.id}`,
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
        });
    } catch (err) {
        console.error('commulingo book:', err);
        res.status(500).send('Failed to load book data');
    }
});

// The catalog is a ~300KB object; serialize it once per catalog reference
// instead of on every request.
const catalogJsonMemo = new WeakMap(); // catalog -> serialized body

router.get('/catalog.json', (req, res) => {
    const catalog = loadCommuLingoCatalog();
    setPublicDataCache(req, res, catalog.version);
    let body = catalogJsonMemo.get(catalog);
    if (!body) {
        body = JSON.stringify(catalog);
        catalogJsonMemo.set(catalog, body);
    }
    res.type('application/json').send(body);
});

// Lessons speak the same vocabulary as the three dictionaries — 마르크스,
// 라살레, 임금철칙, 노동전수익권 — and said it in plain text, so a reader who
// met a name or a term in a concept brief had to go looking for it. The payload
// keeps its bilingual shape and gains *Html siblings; the client renders those
// where it has them and escapes the plain text where it does not, so a payload
// cached before this change still displays.
//
// Prompts and choices are deliberately left unlinked. A link inside a question
// invites the reader out of it mid-answer, and on a multiple-choice item it can
// point at the answer.
//
// One set of indexes per language, shared by the book page and the lesson
// payload. Each returned factory opens a fresh linker, so a passage links an
// entry at its first mention and leaves the rest plain. Everything else about
// the pass — which dictionaries, in what order, and the new tab a lesson's links
// open in — is the `learning` surface in linkify.js.
// Memoized per-book page data: the decision-history payload, the linked
// chapter prose, and the dictionary chips. Keyed by the collection and
// link-index references, which stay stable until the catalog or one of the
// dictionaries actually changes.
const bookPageMemo = new Map(); // `${collectionId}:${lang}` -> { collectionRef, indexesRef, ... }

async function bookPageData(collection, langRaw) {
    const lang = langRaw === 'en' ? 'en' : 'ko';
    const indexes = await getLinkIndexes(lang);
    const key = `${collection.id}:${lang}`;
    const cached = bookPageMemo.get(key);
    if (cached && cached.collectionRef === collection && cached.indexesRef === indexes) return cached;

    // The decision-history book renders its episodes in the browser, so the
    // person index goes with the payload instead of a linker: the aliases are
    // the ones buildPersonLinkIndex kept, so the client applies the shared
    // policy rather than a hand-synced copy of it.
    const decisionLinks = collection.format === 'decision-history'
        ? clientPersonLinkPayload(indexes)
        : { blocked: [], people: [] };

    // Chapter summaries and learning focuses are the prose the book's own
    // page shows before a lesson is ever opened, so they carry the same
    // dictionary links the concept briefs do.
    const linkers = await commuLingoLinkers();
    const linked = {
        ...collection,
        chapters: (collection.chapters || []).map(chapter => ({
            ...chapter,
            summaryHtml: linkLocalized(linkers, chapter.summary),
            focusHtml: linkLocalized(linkers, chapter.learningFocus),
        })),
    };
    const dictionaryEntries = await bookDictionaryEntries(collection, lang);

    const entry = { collectionRef: collection, indexesRef: indexes, linked, dictionaryEntries, decisionLinks };
    bookPageMemo.set(key, entry);
    return entry;
}

async function commuLingoLinkers() {
    const byLang = {};
    for (const lang of ['ko', 'en']) {
        const indexes = await getLinkIndexes(lang);
        byLang[lang] = () => {
            const link = createLinker(indexes, { surface: 'learning' });
            return value => (typeof value === 'string' && value ? link.plain(value) : '');
        };
    }
    return byLang;
}

// {ko, en} of prose in, {ko, en} of linked HTML out, each language with its own
// seen-set. Returns null for anything that is not a bilingual object, so the
// client keeps falling back to the plain field.
function linkLocalized(linkers, value) {
    if (!value || typeof value !== 'object') return null;
    const out = {};
    for (const lang of ['ko', 'en']) out[lang] = linkers[lang]()(value[lang] || '');
    return out;
}

// Which dictionary entries a book actually talks about, read off what the
// linker found rather than curated by hand — a chapter list of one-line
// summaries shows almost none of them, so the book page would otherwise give no
// sign that the entries exist. Walks every lesson shard of the collection, so
// it only runs from bookPageData's memo miss, not per request.
//
// A chip carries the entry's headword, not whichever alias the prose happened to
// use: prose saying 맬서스 인구론 or 감소되지 않은 노동수익 lists 맬서스주의 and
// 노동전수익권, the names those entries are filed under. The index entries carry
// exactly those labels, so no second lookup table is needed.
async function bookDictionaryEntries(collection, lang) {
    const indexes = await getLinkIndexes(lang);
    const found = { people: new Map(), terms: new Map(), events: new Map(), docs: new Map() };
    const LABELS = {
        people: entry => entry.displayName || localize(entry.name, lang),
        terms: entry => entry.label,
        events: entry => entry.title,
        docs: entry => entry.label,
    };
    const collect = value => {
        if (!value) return;
        // A fresh linker per passage, the same restraint the reader sees: an
        // entry linked once in a passage, and the book's chip list is the union.
        const link = createLinker(indexes, { surface: 'learning' });
        link.plain(value);
        Object.keys(found).forEach(kind => {
            link.found[kind].forEach(entry => {
                const label = LABELS[kind](entry);
                if (label && !found[kind].has(entry.id)) found[kind].set(entry.id, { id: entry.id, label });
            });
        });
    };
    for (const chapter of collection.chapters || []) {
        collect(chapter.summary && chapter.summary[lang]);
        collect(chapter.learningFocus && chapter.learningFocus[lang]);
        for (const stub of chapter.lessons || []) {
            const payload = loadCommuLingoLesson(stub.id);
            if (!payload) continue;
            const lesson = payload.lesson;
            ((lesson.conceptBrief && lesson.conceptBrief[lang]) || []).forEach(section => {
                collect(section.text);
                (section.items || []).forEach(collect);
            });
            ((lesson.conceptMap && lesson.conceptMap[lang]) || []).forEach(node => collect(node.text));
            (lesson.questions || []).forEach(question => {
                collect(question.explanation && question.explanation[lang]);
            });
        }
    }
    return {
        people: [...found.people.values()],
        terms: [...found.terms.values()],
        events: [...found.events.values()],
        docs: [...found.docs.values()],
    };
}

async function linkifyLessonPayload(lesson) {
    const linkers = await commuLingoLinkers();
    // The chapter summary and focus shown above the brief, linked the same way
    // the book page links them so the two screens do not disagree.
    lesson.summaryHtml = linkLocalized(linkers, lesson.summary);
    lesson.focusHtml = linkLocalized(linkers, lesson.focus);
    for (const lang of ['ko', 'en']) {
        const linker = linkers[lang];
        // The brief and the map are one passage and share a set. Each
        // explanation gets its own, because the reader meets it on its own card
        // after answering — sharing the brief's set would leave the quiz almost
        // link-free for anyone who read the brief first.
        const linkBrief = linker();
        ((lesson.conceptBrief && lesson.conceptBrief[lang]) || []).forEach(section => {
            if (section.text) section.textHtml = linkBrief(section.text);
            if (Array.isArray(section.items)) section.itemsHtml = section.items.map(linkBrief);
        });
        ((lesson.conceptMap && lesson.conceptMap[lang]) || []).forEach(node => {
            if (node.text) node.textHtml = linkBrief(node.text);
        });
        (lesson.questions || []).forEach(question => {
            const explanation = question.explanation && question.explanation[lang];
            if (!explanation) return;
            question.explanationHtml = question.explanationHtml || {};
            question.explanationHtml[lang] = linker()(explanation);
        });
    }
    return lesson;
}

// Linkified lesson payloads (~58ms each to build: shard parse + ko/en linkify
// of every brief/map/explanation), memoized until the shards version or the
// link indexes change. A linkify failure is served plain and left uncached so
// the next request retries.
const lessonPayloadMemo = new Map(); // lessonId -> { version, indexesRef, payload }

router.get('/lesson/:lessonId', async (req, res) => {
    const lessonId = typeof req.params.lessonId === 'string' ? req.params.lessonId.trim() : '';
    const version = currentVersion();
    const indexes = await getLinkIndexes('ko'); // both langs invalidate together
    const cached = lessonPayloadMemo.get(lessonId);
    let payload;
    if (cached && cached.version === version && cached.indexesRef === indexes) {
        payload = cached.payload;
    } else {
        payload = loadCommuLingoLesson(lessonId);
        if (!payload) return res.status(404).json({ error: 'lesson not found' });
        try {
            await linkifyLessonPayload(payload.lesson);
            lessonPayloadMemo.set(lessonId, { version, indexesRef: indexes, payload });
        } catch (err) {
            // Losing the links costs a hyperlink; losing the payload costs the
            // quiz. Serve it plain.
            console.error('commulingo lesson linkify:', err);
        }
    }
    // Deliberately not setPublicDataCache: the payload is no longer a pure
    // function of the course sources, so its year-long immutable branch would
    // freeze the links against dictionaries that keep changing. Thirty seconds
    // is what the glossary and people pages already serve.
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
    res.json(payload);
});

router.get('/progress', async (req, res) => {
    if (!req.session.user || !req.session.user.id) {
        return res.json({ authenticated: false, progress: [] });
    }

    try {
        const { rows } = await db.query(
            `SELECT lesson_id, completed, score, total_questions, updated_at
             FROM commulingo_progress
             WHERE user_id = $1
             ORDER BY updated_at DESC`,
            [req.session.user.id]
        );
        res.json({
            authenticated: true,
            progress: rows.map(row => ({
                lessonId: row.lesson_id,
                completed: row.completed,
                score: row.score,
                totalQuestions: row.total_questions,
                updatedAt: row.updated_at,
            })),
        });
    } catch (err) {
        console.error('commulingo progress:', err);
        res.status(500).json({ error: 'failed to load progress' });
    }
});

router.post('/progress', requireUser, async (req, res) => {
    const progress = normalizeProgress(req.body || {});
    if (!progress.lessonId || progress.lessonId.length > 120) {
        return res.status(400).json({ error: 'invalid lesson id' });
    }
    if (progress.score > progress.totalQuestions && progress.totalQuestions > 0) {
        return res.status(400).json({ error: 'invalid score' });
    }

    try {
        await db.query(
            `INSERT INTO commulingo_progress
                (user_id, lesson_id, completed, score, total_questions, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (user_id, lesson_id)
             DO UPDATE SET
                completed = commulingo_progress.completed OR EXCLUDED.completed,
                score = GREATEST(commulingo_progress.score, EXCLUDED.score),
                total_questions = GREATEST(commulingo_progress.total_questions, EXCLUDED.total_questions),
                updated_at = NOW()`,
            [
                req.session.user.id,
                progress.lessonId,
                progress.completed,
                progress.score,
                progress.totalQuestions,
            ]
        );
        res.json({ saved: true });
    } catch (err) {
        console.error('commulingo save progress:', err);
        res.status(500).json({ error: 'failed to save progress' });
    }
});

module.exports = router;
