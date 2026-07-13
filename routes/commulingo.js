const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const errorPage = require('../utils/error-page');
const { renderMarkdown } = require('../utils/markdown');
const { loadCommuLingoCatalog, loadCommuLingoLesson } = require('../data/commulingo/shards');
const { localize: localizeCommuLingoValue, normalizeCommuLingoPeople } = require('../data/commulingo/people-standard');
const { loadCommuLingoPeopleFromDb, loadCommuLingoPersonSections } = require('../data/commulingo/people-store');
const { loadCommuLingoHistoryEvents, loadCommuLingoPersonHistoryEvents } = require('../data/commulingo/history-events-store');
const { buildPersonLinkIndex, linkifyPlain, linkifyHtml } = require('../data/commulingo/people-linkify');
const { roleIconSvg, roleHubHref } = require('../data/commulingo/role-icons');

const router = express.Router();

const PEOPLE_PATH = path.join(__dirname, '..', 'data', 'commulingo', 'people.js');
let peopleCache = null;

function loadCommuLingoPeopleFromFile() {
    let mtimeMs = 0;
    try {
        mtimeMs = fs.statSync(PEOPLE_PATH).mtimeMs;
    } catch (err) {
        return { groups: [], people: [] };
    }
    if (peopleCache && peopleCache.mtimeMs === mtimeMs) return peopleCache.data;
    delete require.cache[require.resolve(PEOPLE_PATH)];
    const data = require(PEOPLE_PATH);
    peopleCache = { mtimeMs, data };
    return data;
}

async function loadCommuLingoPeople(options = {}) {
    if (process.env.COMMULINGO_PEOPLE_SOURCE === 'file') {
        return { data: loadCommuLingoPeopleFromFile(), source: 'file' };
    }
    try {
        const data = await loadCommuLingoPeopleFromDb({ fresh: options.fresh });
        return { data, source: 'db' };
    } catch (err) {
        console.error('[commulingo people] DB load failed, falling back to file:', err.message);
        return { data: loadCommuLingoPeopleFromFile(), source: 'file' };
    }
}

async function loadStandardizedPeople(req, res, options = {}) {
    const lang = res.locals.lang;
    const catalog = loadCommuLingoCatalog();
    const loaded = await loadCommuLingoPeople(options);
    const standardized = normalizeCommuLingoPeople(loaded.data, { lang, catalog });
    return { lang, catalog, loaded, standardized };
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

router.get('/people', async (req, res) => {
    try {
        const { lang, standardized } = await loadStandardizedPeople(req, res);
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        const roleCategories = Object.values(standardized.roleCategories || {}).map(category => ({
            ...category,
            label: category.id === 'intl-revolutionary'
                ? (lang === 'en' ? 'Revolutionaries beyond the Soviet Union' : '소련 밖의 혁명가들')
                : category.label,
            peopleCount: standardized.people.filter(person => person.role && person.role.categoryId === category.id).length,
        })).filter(category => category.peopleCount > 0);
        const orderedGroups = standardized.groups.map(group => ({
            ...group,
            people: sortPeopleChronologically(group.people),
        }));
        res.render('public/commulingo-people', {
            offices: standardized.offices,
            roleCategories,
            groups: orderedGroups,
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
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-office', {
            office,
            people,
            roleIconSvg,
            roleHubHref,
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
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-role', {
            category,
            people,
            roleIconSvg,
            roleHubHref,
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

router.get('/people/:personId', async (req, res) => {
    try {
        const personId = typeof req.params.personId === 'string' ? req.params.personId.trim() : '';
        const { lang, loaded, standardized } = await loadStandardizedPeople(req, res);
        const person = standardized.peopleById[personId];
        if (!person) {
            return errorPage.notFound(res, {
                message: lang === 'en' ? 'Person not found.' : '인물을 찾을 수 없습니다.',
                backHref: '/commulingo/people',
                backLabel: lang === 'en' ? 'People' : '인물 사전',
            });
        }
        const rawSections = loaded.source === 'db' ? await loadCommuLingoPersonSections(personId) : [];
        const sections = localizedPersonSections(rawSections, lang);
        // Auto-link mentions of other people in the bio and detail sections.
        const linkIndex = buildPersonLinkIndex(standardized.people, { lang, excludeId: person.id });
        const bioHtml = linkifyPlain(person.bio, linkIndex);
        sections.forEach(section => { section.bodyHtml = linkifyHtml(section.bodyHtml, linkIndex); });
        const historyEvents = loaded.source === 'db'
            ? (await loadCommuLingoPersonHistoryEvents(personId)).map(event => ({
                ...event, title: localize(event.title, lang), relation: localize(event.relation, lang), note: localize(event.note, lang),
            }))
            : [];
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-person', {
            person,
            bioHtml,
            sections,
            historyEvents,
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
        const { loaded, standardized } = await loadStandardizedPeople(req, res, { fresh: req.query.fresh === '1' });
        const person = standardized.peopleById[personId];
        if (!person) return res.status(404).json({ error: 'person not found' });
        const sections = loaded.source === 'db'
            ? localizedPersonSections(await loadCommuLingoPersonSections(personId), standardized.lang)
            : [];
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

        let decisionPeople = [];
        if (collection.format === 'decision-history') {
            const loaded = await loadCommuLingoPeople();
            decisionPeople = (loaded.data.people || []).map(person => ({
                id: person.id,
                name: localize(person.name, res.locals.lang),
                epithet: localize(person.epithet, res.locals.lang),
                aliases: (person.aliases && person.aliases[res.locals.lang]) || [],
            })).filter(person => person.aliases.length);
        }

        const bookTitle = localize(collection.title, res.locals.lang);
        res.render('public/commulingo-book', {
            lessons: { version: catalog.version, collections: [collection] },
            decisionPeople,
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

router.get('/catalog.json', (req, res) => {
    const catalog = loadCommuLingoCatalog();
    setPublicDataCache(req, res, catalog.version);
    res.json(catalog);
});

router.get('/lesson/:lessonId', (req, res) => {
    const lessonId = typeof req.params.lessonId === 'string' ? req.params.lessonId.trim() : '';
    const payload = loadCommuLingoLesson(lessonId);
    if (!payload) return res.status(404).json({ error: 'lesson not found' });
    setPublicDataCache(req, res, payload.version);
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
