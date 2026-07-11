const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const { loadCommuLingoCatalog, loadCommuLingoLesson } = require('../data/commulingo/shards');

const router = express.Router();

const PEOPLE_PATH = path.join(__dirname, '..', 'data', 'commulingo', 'people.js');
let peopleCache = null;

function loadCommuLingoPeople() {
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
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

function composePersonName(name, patronymic) {
    if (!name || !patronymic) return name || '';
    const parts = name.split(' ');
    if (parts.length < 2) return name;
    return [parts[0], patronymic, ...parts.slice(1)].join(' ');
}

const ROLE_OFFICE_TITLES = {
    'party-leadership': { ko: '당 최고 지도자', en: 'Party leadership' },
    'party-secretariat-cadres': { ko: '당 서기국 · 조직인사 지도부', en: 'Party Secretariat and cadres leadership' },
    government: { ko: '정부 수반', en: 'Heads of government' },
    defence: { ko: '군사 · 국방 지도부', en: 'Military and defence leadership' },
    security: { ko: '국가보안 기관 지도부', en: 'State security leadership' },
    'ideology-propaganda': { ko: '이념 · 선전 지도부', en: 'Ideology and propaganda leadership' },
    'culture-literature': { ko: '문화 · 문학예술 통제', en: 'Culture and literary control' },
    'state-head': { ko: '국가원수', en: 'Formal heads of state' },
    'foreign-affairs': { ko: '외교 지도부', en: 'Foreign affairs leadership' },
    'nationalities-federal': { ko: '민족문제 · 연방 관리', en: 'Nationalities and federal management' },
    planning: { ko: '중앙계획 기관 지도부', en: 'Central planning leadership' },
    'economic-management': { ko: '경제 운영 지도부', en: 'Economic management leadership' },
    'heavy-industry-mic': { ko: '중공업 · 군수공업 지도부', en: 'Heavy industry and military-industrial leadership' },
    agriculture: { ko: '농업 지도부', en: 'Agricultural leadership' },
    'science-nuclear-space': { ko: '과학 · 원자력 · 우주 개발', en: 'Science, nuclear and space development' },
    comintern: { ko: '코민테른 지도부', en: 'Comintern leadership' },
};

function personRoleMeta(person, lang) {
    const id = person.id || '';
    const group = person.group || '';
    let officeId = '';
    let icon = '❔';
    if (['beria', 'dzerzhinsky', 'menzhinsky', 'yagoda', 'yezhov', 'merkulov', 'abakumov', 'ignatiev', 'serov', 'shelepin', 'semichastny', 'andropov', 'fedorchuk', 'chebrikov', 'kryuchkov'].includes(id)) { officeId = 'security'; icon = '🕵️'; }
    else if (['trotsky', 'zhukov', 'tukhachevsky', 'chuikov', 'frunze', 'voroshilov', 'timoshenko', 'malinovsky', 'grechko', 'ustinov', 'sokolov', 'yazov', 'kornilov'].includes(id)) { officeId = 'defence'; icon = '🛡️'; }
    else if (['chicherin', 'litvinov', 'molotov', 'vyshinsky', 'gromyko', 'shevardnadze', 'shepilov', 'bessmertnykh', 'pankin', 'kollontai'].includes(id)) { officeId = 'foreign-affairs'; icon = '🤝'; }
    else if (['lunacharsky', 'zhdanov', 'suslov', 'demichev', 'ponomarev', 'yakovlev', 'solzhenitsyn', 'sakharov'].includes(id)) { officeId = 'ideology-propaganda'; icon = '📣'; }
    else if (['fadeyev', 'furtseva', 'gubenko'].includes(id)) { officeId = 'culture-literature'; icon = '🎭'; }
    else if (['ordzhonikidze', 'tevosian', 'malyshev', 'vannikov', 'slavsky', 'afanasyev'].includes(id)) { officeId = 'heavy-industry-mic'; icon = '🏭'; }
    else if (['kurchatov', 'korolev', 'keldysh', 'kerimov', 'gagarin'].includes(id)) { officeId = 'science-nuclear-space'; icon = '⚛️'; }
    else if (['yakov-yakovlev', 'benediktov', 'matskevich', 'polyansky', 'mesyats', 'murakhovsky'].includes(id)) { officeId = 'agriculture'; icon = '🌾'; }
    else if (['kalinin', 'shvernik', 'podgorny'].includes(id)) { officeId = 'state-head'; icon = '🏛️'; }
    else if (['shayakhmetov', 'paleckis', 'nasriddinova', 'voss', 'nishonov'].includes(id)) { officeId = 'nationalities-federal'; icon = '🗺️'; }
    else if (['lenin', 'stalin', 'khrushchev', 'brezhnev', 'chernenko', 'gorbachev'].includes(id)) { officeId = 'party-leadership'; icon = '🚩'; }
    else if (['malenkov', 'stasova', 'sverdlov', 'krestinsky', 'kaganovich', 'kirichenko', 'kirilenko', 'ligachev', 'ivashko'].includes(id)) { officeId = 'party-secretariat-cadres'; icon = '🗂️'; }
    else if (['rykov', 'bulganin', 'kosygin', 'tikhonov', 'ryzhkov', 'pavlov'].includes(id)) { officeId = 'government'; icon = '👔'; }
    else if (['krzhizhanovsky', 'kuibyshev', 'mezhlauk', 'voznesensky', 'saburov', 'baibakov', 'maslyukov'].includes(id)) { officeId = 'planning'; icon = '📊'; }
    else if (['sokolnikov', 'zverev', 'garbuzov', 'alkhimov', 'gerashchenko', 'katushev'].includes(id)) { officeId = 'economic-management'; icon = '📊'; }
    else if (['zinoviev', 'kamenev', 'bukharin', 'manuilsky', 'dimitrov'].includes(id)) { officeId = 'comintern'; icon = '🌍'; }
    else if (group === 'old-regime') { icon = '👑'; }
    return {
        icon,
        officeId,
        label: officeId ? localize(ROLE_OFFICE_TITLES[officeId], lang) : '',
    };
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

router.get('/people', (req, res) => {
    const lang = res.locals.lang;
    const data = loadCommuLingoPeople();
    const catalog = loadCommuLingoCatalog();

    const sceneIndex = {};
    (catalog.collections || []).forEach(collection => {
        const timeline = collection.decisionTimeline;
        if (!timeline) return;
        (timeline.eras || []).forEach(era => {
            (era.episodes || []).forEach(episode => {
                sceneIndex[`${collection.id}/${episode.id}`] = {
                    bookId: collection.id,
                    episodeId: episode.id,
                    title: localize(episode.title, lang),
                    bookTitle: localize(collection.bookTitle || collection.title, lang),
                };
            });
        });
    });

    const people = (data.people || []).map(person => ({
        id: person.id,
        group: person.group,
        initial: person.initial,
        cyrillic: composePersonName(person.cyrillic, (data.cyrillicPatronymics || {})[person.id]),
        name: localize(person.name, lang),
        displayName: composePersonName(localize(person.name, lang), localize((data.patronymics || {})[person.id], lang)),
        role: personRoleMeta(person, lang),
        years: person.years,
        epithet: localize(person.epithet, lang),
        bio: localize(person.bio, lang),
        fateKind: person.fate ? person.fate.kind : '',
        fateLabel: person.fate ? localize(person.fate.label, lang) : '',
        career: ((data.careers || {})[person.id] || []).map(entry => ({
            y: entry.y,
            r: localize(entry.r, lang),
        })),
        scenes: (person.scenes || [])
            .map(scene => sceneIndex[`${scene[0]}/${scene[1]}`])
            .filter(Boolean),
    }));
    const peopleById = people.reduce((index, person) => {
        index[person.id] = person;
        return index;
    }, {});
    const officeDisplayOrder = ['party-leadership', 'party-secretariat-cadres', 'government', 'defence', 'security', 'ideology-propaganda', 'culture-literature', 'state-head', 'foreign-affairs', 'nationalities-federal', 'planning', 'economic-management', 'heavy-industry-mic', 'agriculture', 'science-nuclear-space', 'comintern'];
    const offices = (data.offices || []).map(office => ({
        id: office.id,
        title: localize(office.title, lang),
        range: office.range || '',
        blurb: localize(office.blurb, lang),
        rows: (office.rows || []).map(row => {
            const person = row.personId ? peopleById[row.personId] : null;
            return {
                years: row.years || '',
                body: localize(row.body, lang),
                name: person ? person.name : localize(row.name, lang),
                personId: person ? person.id : '',
                note: localize(row.note, lang),
            };
        }),
    })).filter(office => office.rows.length).sort((a, b) => {
        const aIndex = officeDisplayOrder.indexOf(a.id);
        const bIndex = officeDisplayOrder.indexOf(b.id);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

    const groups = (data.groups || []).map(group => ({
        id: group.id,
        range: group.range || '',
        title: localize(group.title, lang),
        blurb: localize(group.blurb, lang),
        people: people.filter(person => person.group === group.id),
    })).filter(group => group.people.length);

    res.render('public/commulingo-people', {
        offices,
        groups,
        peopleCount: people.length,
        pageTitle: lang === 'en' ? 'People of the Revolution and the USSR' : '인물 사전 — 혁명과 소련의 사람들',
        pageDescription: lang === 'en'
            ? 'The people who stood at the forks of the two decision-simulation history books.'
            : '두 권의 결정 시뮬레이션 역사책, 그 갈림길에 서 있던 사람들.',
        pagePath: '/commulingo/people',
        extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
    });
});

router.get('/book/:collectionId', (req, res) => {
    const collectionId = typeof req.params.collectionId === 'string' ? req.params.collectionId.trim() : '';
    const catalog = loadCommuLingoCatalog();
    const collection = (catalog.collections || []).find(item => item.id === collectionId);
    if (!collection) return res.redirect('/commulingo');

    let decisionPeople = [];
    if (collection.format === 'decision-history') {
        decisionPeople = (loadCommuLingoPeople().people || []).map(person => ({
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
