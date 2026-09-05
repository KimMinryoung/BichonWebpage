const db = require('../config/database');
const { listCommuLingoDocs } = require('../data/commulingo/docs-store');
const { getLatestCourseMetadata } = require('../data/commulingo/course-metadata');
const { localize } = require('../data/commulingo/localize');

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
            // 같은 날 여러 건이 들어오면 addedAt만으로는 동률이라 목록 순서
            // (문헌 연대 오름차순)가 그대로 남아 가장 오래된 문헌이 계속
            // 1등이 된다 — 2026-08-31에 21건이 들어왔을 때 1905년 재무 선언이
            // 이틀째 메인에 붙어 있었다. 동률은 실제 발행 시각(파일 mtime 등
            // modifiedAt)으로 가른다.
            published: Date.parse(doc.modifiedAt || '') || 0,
        }))
        .filter(item => item.title && Number.isFinite(item.modified))
        .sort((a, b) => (b.modified - a.modified) || (b.published - a.published))
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

const UPDATES_PER_KIND = 10;

async function recentDictionaryItems(lang) {
    const { rows } = await db.query(
        `SELECT * FROM (
            SELECT updates.*, ROW_NUMBER() OVER (
                PARTITION BY kind ORDER BY updated_at DESC NULLS LAST, id
            ) AS update_rank
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
           ) AS ranked
          WHERE update_rank <= $1
          ORDER BY kind, update_rank`,
        [UPDATES_PER_KIND]
    );

    // Select each kind in SQL so frequent person edits cannot hide events or terms.
    return rows.map(row => dictionaryItem(row, lang));
}

// The UNION ALL scan below reads every dictionary row; without this memo it ran
// on every homepage request (44k+ seq scans of commulingo_people observed).
const DICTIONARY_MEMO_MS = Number(process.env.COMMULINGO_UPDATES_CACHE_MS || 60 * 1000);
const dictionaryMemo = new Map();

function recentDictionaryItemsCached(lang) {
    const key = lang;
    const cached = dictionaryMemo.get(key);
    if (cached && Date.now() - cached.at < DICTIONARY_MEMO_MS) return cached.promise;
    const promise = recentDictionaryItems(lang);
    dictionaryMemo.set(key, { at: Date.now(), promise });
    promise.catch(() => {
        const current = dictionaryMemo.get(key);
        if (current && current.promise === promise) dictionaryMemo.delete(key);
    });
    return promise;
}

async function loadCommuLingoUpdateGroups(lang = 'ko') {
    const safeLang = lang === 'en' ? 'en' : 'ko';
    const [dictionaryResult, docsResult, courseResult] = await Promise.allSettled([
        recentDictionaryItemsCached(safeLang),
        Promise.resolve().then(() => recentDocs(safeLang, UPDATES_PER_KIND)),
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

    const results = { person: dictionaryResult, event: dictionaryResult, term: dictionaryResult,
        doc: docsResult, course: courseResult };
    return ['person', 'event', 'term', 'doc', 'course'].map(type => ({
        type,
        label: TYPE_LABELS[safeLang][type],
        unavailable: results[type].status === 'rejected',
        items: results[type].status === 'fulfilled'
            ? results[type].value.filter(item => item.type === type).slice(0, UPDATES_PER_KIND)
            : [],
    }));
}

async function loadRecentCommuLingoItems(lang = 'ko') {
    const groups = await loadCommuLingoUpdateGroups(lang);
    const items = groups.flatMap(group => group.items.slice(0, 1));
    const courseItems = items.filter(item => item.type === 'course');
    const datedItems = items.filter(item => item.type !== 'course')
        .sort((a, b) => b.modified - a.modified);
    return [...courseItems, ...datedItems];
}

module.exports = { loadRecentCommuLingoItems, loadCommuLingoUpdateGroups };
