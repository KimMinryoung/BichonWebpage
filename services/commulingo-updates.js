const { createPublicModelCache } = require('../utils/public-model-cache');
const { sanitizeBasic } = require('../utils/sanitize');
const { truncateHtml } = require('../utils/truncate-html');
const previews = createPublicModelCache();

const db = require('../config/database');
const { listCommuLingoDocs } = require('../data/commulingo/docs-store');
const { getLatestCourseMetadata } = require('../data/commulingo/course-metadata');
const { localize } = require('../data/commulingo/localize');
const { loadCommuLingoPeople } = require('../data/commulingo/people-store');

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

async function recentPeople(lang) {
    const { data, source } = await loadCommuLingoPeople();
    if (source === 'empty') throw new Error('People snapshot unavailable');
    return data.people
        .map(person => ({
            type: 'person',
            typeLabel: TYPE_LABELS[lang].person,
            title: localize(person.name, lang),
            summary: localize(person.epithet, lang),
            moment: localize(person.moment, lang),
            bio: localize(person.bio, lang),
            href: TYPE_PATHS.person + encodeURIComponent(person.id),
            modified: Date.parse(person.updatedAt),
        }))
        .filter(item => item.title && Number.isFinite(item.modified))
        .sort((a, b) => (b.modified - a.modified) || a.href.localeCompare(b.href))
        .slice(0, UPDATES_PER_KIND);
}

async function recentDictionaryItems(lang) {
    const { rows } = await db.query(
        `SELECT * FROM (
            SELECT updates.*, ROW_NUMBER() OVER (
                PARTITION BY kind ORDER BY updated_at DESC NULLS LAST, id
            ) AS update_rank
            FROM (
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

    // Select each DB-backed kind in SQL so frequent edits cannot hide another kind.
    return rows.map(row => dictionaryItem(row, lang));
}

function cachedItems(type, lang, load) {
    return previews.get(`${type}:${lang}`, async () => (await load()).map(item => ({
        ...item,
        excerptHtml: truncateHtml(sanitizeBasic(item.summary), 200),
    })));
}

async function loadCommuLingoUpdateGroups(lang = 'ko') {
    const safeLang = lang === 'en' ? 'en' : 'ko';
    const [peopleResult, dictionaryResult, docsResult, courseResult] = await Promise.allSettled([
        cachedItems('person', safeLang, () => recentPeople(safeLang)),
        cachedItems('dictionary', safeLang, () => recentDictionaryItems(safeLang)),
        cachedItems('doc', safeLang, () => recentDocs(safeLang, UPDATES_PER_KIND)),
        cachedItems('course', safeLang, () => recentCourse(safeLang)),
    ]);

    if (peopleResult.status === 'rejected') {
        console.warn('[CommuLingo updates] People preview unavailable:', peopleResult.reason.message);
    }
    if (dictionaryResult.status === 'rejected') {
        console.warn('[CommuLingo updates] Dictionary preview unavailable:', dictionaryResult.reason.message);
    }
    if (docsResult.status === 'rejected') {
        console.warn('[CommuLingo updates] Reference preview unavailable:', docsResult.reason.message);
    }
    if (courseResult.status === 'rejected') {
        console.warn('[CommuLingo updates] Learning preview unavailable:', courseResult.reason.message);
    }

    const results = { person: peopleResult, event: dictionaryResult, term: dictionaryResult,
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
