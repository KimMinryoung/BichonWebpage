const db = require('../config/database');
const { listCommuLingoDocs } = require('../data/commulingo/docs-store');
const { getLatestCourseMetadata } = require('../data/commulingo/course-metadata');

const TYPE_LABELS = {
    ko: { person: '인물', event: '사건', term: '용어', doc: '참고 문헌', course: '학습 콘텐츠' },
    en: { person: 'Person', event: 'Event', term: 'Term', doc: 'Reference', course: 'Learning' },
};

const TYPE_PATHS = {
    person: '/commulingo/people/',
    event: '/commulingo/events/',
    term: '/commulingo/terms/',
    doc: '/commulingo/docs/',
    course: '/commulingo/book/',
};

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

function dictionaryItem(row, lang) {
    const localized = (ko, en) => lang === 'en' ? (en || ko) : (ko || en);
    return {
        type: row.kind,
        typeLabel: TYPE_LABELS[lang][row.kind],
        title: localized(row.title_ko, row.title_en),
        summary: localized(row.summary_ko, row.summary_en),
        moment: row.kind === 'person' ? localized(row.moment_ko, row.moment_en) : '',
        bio: row.kind === 'person' ? localized(row.bio_ko, row.bio_en) : '',
        href: TYPE_PATHS[row.kind] + encodeURIComponent(row.id),
        modified: new Date(row.updated_at).getTime(),
    };
}

function recentDocs(lang, limit) {
    return listCommuLingoDocs()
        .filter(doc => doc.addedAt)
        .map(doc => ({
            type: 'doc',
            typeLabel: TYPE_LABELS[lang].doc,
            title: localize(doc.title, lang),
            summary: localize(doc.description, lang),
            href: TYPE_PATHS.doc + encodeURIComponent(doc.id),
            modified: Date.parse(`${doc.addedAt}T00:00:00Z`),
        }))
        .filter(item => item.title && Number.isFinite(item.modified))
        .sort((a, b) => b.modified - a.modified)
        .slice(0, limit);
}

function recentCourse(lang) {
    const course = getLatestCourseMetadata();
    if (!course) return [];
    const modified = Date.parse(`${course.releasedAt}T00:00:00Z`);
    if (!Number.isFinite(modified)) return [];
    return [{
        type: 'course',
        typeLabel: TYPE_LABELS[lang].course,
        title: localize(course.title, lang),
        summary: localize(course.description, lang),
        href: TYPE_PATHS.course + encodeURIComponent(course.id),
        modified,
    }];
}

async function recentDictionaryItems(lang, limit) {
    const { rows } = await db.query(
        `SELECT kind, id, title_ko, title_en, summary_ko, summary_en,
                moment_ko, moment_en, bio_ko, bio_en, updated_at
           FROM (
                SELECT 'person' AS kind, id,
                       name_ko AS title_ko, name_en AS title_en,
                       epithet_ko AS summary_ko, epithet_en AS summary_en,
                       moment_ko, moment_en, bio_ko, bio_en,
                       updated_at
                  FROM commulingo_people
                UNION ALL
                SELECT 'event' AS kind, id,
                       title_ko, title_en, summary_ko, summary_en,
                       NULL::text AS moment_ko, NULL::text AS moment_en,
                       NULL::text AS bio_ko, NULL::text AS bio_en,
                       updated_at
                  FROM commulingo_history_events
                UNION ALL
                SELECT 'term' AS kind, id,
                       term_ko AS title_ko, term_en AS title_en,
                       definition_ko AS summary_ko, definition_en AS summary_en,
                       NULL::text AS moment_ko, NULL::text AS moment_en,
                       NULL::text AS bio_ko, NULL::text AS bio_en,
                       updated_at
                  FROM commulingo_terms
           ) AS updates
          ORDER BY updated_at DESC
          LIMIT $1`,
        [Math.max(limit * 3, limit)]
    );

    return rows.map(row => dictionaryItem(row, lang)).slice(0, limit);
}

// The UNION ALL scan below reads every dictionary row; without this memo it ran
// on every homepage request (44k+ seq scans of commulingo_people observed).
const DICTIONARY_MEMO_MS = Number(process.env.COMMULINGO_UPDATES_CACHE_MS || 60 * 1000);
const dictionaryMemo = new Map();

function recentDictionaryItemsCached(lang, limit) {
    const key = `${lang}:${limit}`;
    const cached = dictionaryMemo.get(key);
    if (cached && Date.now() - cached.at < DICTIONARY_MEMO_MS) return cached.promise;
    const promise = recentDictionaryItems(lang, limit);
    dictionaryMemo.set(key, { at: Date.now(), promise });
    promise.catch(() => {
        const current = dictionaryMemo.get(key);
        if (current && current.promise === promise) dictionaryMemo.delete(key);
    });
    return promise;
}

async function loadRecentCommuLingoItems(lang = 'ko', limit = 5) {
    const safeLang = lang === 'en' ? 'en' : 'ko';
    const courseLimit = Math.min(1, limit);
    const dictionaryLimit = Math.min(2, Math.max(0, limit - courseLimit));
    const docsLimit = Math.max(0, limit - courseLimit - dictionaryLimit);
    const [dictionaryResult, docsResult, courseResult] = await Promise.allSettled([
        recentDictionaryItemsCached(safeLang, dictionaryLimit),
        Promise.resolve().then(() => recentDocs(safeLang, docsLimit)),
        Promise.resolve().then(() => recentCourse(safeLang)),
    ]);

    if (dictionaryResult.status === 'rejected') {
        console.warn('[CommuLingo updates] Dictionary preview unavailable:', dictionaryResult.reason.message);
    }
    if (docsResult.status === 'rejected') {
        console.warn('[CommuLingo updates] Reference preview unavailable:', docsResult.reason.message);
    }
    if (courseResult.status === 'rejected') {
        console.warn('[CommuLingo updates] Learning preview unavailable:', courseResult.reason.message);
    }

    const dictionaryItems = dictionaryResult.status === 'fulfilled' ? dictionaryResult.value : [];
    const docItems = docsResult.status === 'fulfilled' ? docsResult.value : [];
    const courseItems = courseResult.status === 'fulfilled' ? courseResult.value : [];
    const datedItems = [...dictionaryItems, ...docItems]
        .sort((a, b) => b.modified - a.modified);
    return [...courseItems, ...datedItems].slice(0, limit);
}

module.exports = { loadRecentCommuLingoItems };
