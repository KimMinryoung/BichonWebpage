// The integrated search behind /search (the whole site) and /commulingo/search
// (CommuLingo only): one query fanned out to every section's own data, each
// section's best few hits, in a fixed order. The section lists keep their own
// search boxes; a result group's "more" link opens that list with the query.
//
// Writings match on what a list shows (title and summary; curations add the
// source and tags; diary entries and posts have no summary, so their text),
// so a long report does not answer every common word. In English only
// sections and items that exist in English are searched: config/menu-languages.js
// decides the sections (the reference documents are Korean-only), and an
// untranslated report, page or entry is left out.
const db = require('../config/database');
const { menuHasEnglish } = require('../config/menu-languages');
const hubStore = require('../config/hub-store');
const { cachedResearchList, cachedPagesList } = require('./public-lists');
const { searchTerms, likePatterns, likeClause, matchSnippet } = require('../utils/text-search');
const { searchDictionary } = require('../utils/dictionary-search');
const { searchPeople } = require('../utils/people-search');
const { loadCommuLingoCatalog } = require('../data/commulingo/shards');
const { localize } = require('../data/commulingo/localize');
const { loadStandardizedPeople, sortPeopleChronologically } = require('../data/commulingo/people-view');
const { termListData } = require('../data/commulingo/term-presentation');
const { presentedEventList } = require('../data/commulingo/event-presentation');
const { loadCommuLingoHistoryEvents } = require('../data/commulingo/history-events-store');
const { listCommuLingoDocs } = require('../data/commulingo/docs-store');
const { createDocRefResolver } = require('../data/commulingo/docs-refs');
const { presentedDocList } = require('../data/commulingo/doc-presentation');

const PER_SECTION = 5;
// A section without a list page of its own (courses) opens in full on the
// search page itself (?more=courses), up to this many.
const EXPANDED = 200;

const lower = value => String(value || '').toLocaleLowerCase();
const hasAll = (text, terms) => terms.every(term => text.includes(term));
const withQuery = (path, query) => `${path}?q=${encodeURIComponent(query)}`;

// Items whose fields hold every term, those with every term in the title first.
function rankByTitle(items, terms, titleOf, textOf) {
    const first = [];
    const rest = [];
    for (const item of items) {
        const title = lower(titleOf(item));
        if (!hasAll(`${title} ${lower(textOf(item))}`, terms)) continue;
        (hasAll(title, terms) ? first : rest).push(item);
    }
    return first.concat(rest);
}

async function reports(lang, terms) {
    const en = lang === 'en';
    const [research, pages] = await Promise.all([cachedResearchList(lang), cachedPagesList(lang)]);
    const items = [
        ...research.map(doc => ({ doc, href: `/reports/research/${doc.filename.replace(/\.md$/, '')}`, time: doc.modified_at * 1000 })),
        ...pages.map(doc => ({ doc, href: `/p/${doc.slug}`, time: doc.updated_at ? new Date(doc.updated_at).getTime() : 0 })),
    ].filter(item => !en || item.doc.has_translation).sort((a, b) => b.time - a.time);
    return rankByTitle(items, terms, item => item.doc.title, item => item.doc.summary)
        .map(({ doc, href }) => ({ title: doc.title, href, excerpt: matchSnippet(doc.summary || doc.excerpt, terms, 160) }));
}

async function curations(lang, terms) {
    const items = (await hubStore.listHubCurations({ limit: 200, lang }))
        .filter(item => lang !== 'en' || item.has_translation);
    const text = item => [item.source_title, item.source_author, item.source_publication, item.tags.join(' '), item.selection_rationale].join(' ');
    return rankByTitle(items, terms, item => item.title, text).map(item => ({
        title: item.title,
        href: `/hub/${item.slug}`,
        meta: [item.source_author, item.source_publication].filter(Boolean).join(' · '),
        excerpt: matchSnippet(item.selection_rationale, terms, 160),
    }));
}

// Diary entries and posts: title or text, newest first, with the count.
async function entries(table, hrefPrefix, lang, terms) {
    const en = lang === 'en';
    const title = en ? "COALESCE(NULLIF(btrim(title_en), ''), title)" : 'title';
    const content = en ? "COALESCE(NULLIF(btrim(content_en), ''), content)" : 'content';
    const params = likePatterns(terms);
    const englishOnly = en ? "AND (btrim(COALESCE(title_en, '')) <> '' OR btrim(COALESCE(content_en, '')) <> '')" : '';
    const { rows } = await db.query(
        `SELECT id, ${title} AS title, ${content} AS content, COUNT(*) OVER() AS total_count
           FROM ${table}
          WHERE ${likeClause(`concat_ws(' ', ${title}, ${content})`, terms)} ${englishOnly}
          ORDER BY (${likeClause(title, terms)}) DESC, created_at DESC, id DESC
          LIMIT ${PER_SECTION}`,
        params
    );
    return {
        total: rows.length ? Number(rows[0].total_count) : 0,
        items: rows.map(row => ({ title: row.title, href: `${hrefPrefix}${row.id}`, excerpt: matchSnippet(row.content, terms, 160) })),
    };
}

// Course titles and their chapter titles; a course hit comes before chapters.
function courses(lang, terms) {
    const books = [];
    const chapters = [];
    for (const collection of (loadCommuLingoCatalog() || {}).collections || []) {
        const bookTitle = localize(collection.title, lang);
        const href = `/commulingo/book/${collection.id}`;
        if (hasAll(lower([bookTitle, localize(collection.bookTitle, lang)].join(' ')), terms)) {
            books.push({ title: bookTitle, href, excerpt: localize(collection.description, lang) });
        }
        for (const chapter of collection.chapters || []) {
            const lesson = (chapter.lessons || [])[0];
            const chapterTitle = localize(chapter.title, lang);
            if (!lesson || !hasAll(lower(chapterTitle), terms)) continue;
            chapters.push({ title: chapterTitle, href: `${href}#lesson=${encodeURIComponent(lesson.id)}`,
                meta: bookTitle, chapterNumber: chapter.chapterNumber });
        }
    }
    return books.concat(chapters);
}

async function events(lang, query) {
    const list = presentedEventList(await loadCommuLingoHistoryEvents(), lang);
    return searchDictionary(list, 'events', query).map(event => ({
        title: event.title, href: `/commulingo/events/${event.id}`, meta: event.period, excerpt: event.summary,
    }));
}

async function docs(lang, query) {
    const list = presentedDocList(listCommuLingoDocs(), lang, await createDocRefResolver(lang)).docs;
    return searchDictionary(list, 'docs', query).map(doc => ({
        title: doc.title, href: `/commulingo/docs/${doc.id}`, meta: doc.kind, excerpt: doc.summary,
    }));
}

async function people(lang, query) {
    const { standardized } = await loadStandardizedPeople(lang);
    const hits = searchPeople(standardized, query, sortPeopleChronologically);
    return [...new Set([...hits.name, ...hits.desc])].map(person => ({
        title: person.displayName || person.name,
        href: `/commulingo/people/${person.id}`,
        meta: [person.years, person.primaryActivity && person.primaryActivity.label].filter(Boolean).join(' · '),
        excerpt: person.epithet,
    }));
}

async function terms(lang, query) {
    const { terms: list } = await termListData(lang, 'name');
    return searchDictionary(list, 'terms', query).map(term => ({
        title: term.term, href: `/commulingo/terms/${term.id}`,
        meta: [term.period, term.original].filter(Boolean).join(' · '), excerpt: term.definition,
    }));
}

// Section order is the owner's (2026-10-11): writings, courses, events,
// documents, people, terms. `menu` is the config/menu-languages.js key.
// `load` resolves to a hit list or { total, items }.
const SECTIONS = [
    { key: 'reports', menu: 'reports', scope: 'all', more: '/reports', load: (lang, q, t) => reports(lang, t) },
    { key: 'hub', menu: 'hub', scope: 'all', more: '/hub', load: (lang, q, t) => curations(lang, t) },
    { key: 'diary', menu: 'diary', scope: 'all', more: '/ai-diary', load: (lang, q, t) => entries('ai_diary', '/ai-diary/', lang, t) },
    { key: 'posts', menu: 'posts', scope: 'all', more: '/posts', load: (lang, q, t) => entries('posts', '/post/', lang, t) },
    { key: 'courses', menu: 'commulingo.learn', scope: 'commulingo', load: (lang, q, t) => courses(lang, t) },
    { key: 'events', menu: 'commulingo.events', scope: 'commulingo', more: '/commulingo/events', load: (lang, q) => events(lang, q) },
    { key: 'docs', menu: 'commulingo.docs', scope: 'commulingo', more: '/commulingo/docs', load: (lang, q) => docs(lang, q) },
    { key: 'people', menu: 'commulingo.people', scope: 'commulingo', more: '/commulingo/people', load: (lang, q) => people(lang, q) },
    { key: 'terms', menu: 'commulingo.terms', scope: 'commulingo', more: '/commulingo/terms', load: (lang, q) => terms(lang, q) },
];

function sectionsFor(scope, lang) {
    return SECTIONS.filter(section => (scope === 'all' || section.scope === 'commulingo')
        && (lang !== 'en' || menuHasEnglish(section.menu)));
}

// `expand` names the section shown in full; `selfPath` is the search page's
// own path, for that link.
// { sections: [{ key, total, items, moreHref }], failed: [key] } — a section
// that fails is reported, not fatal, so the others still answer.
async function siteSearch({ query, lang, scope, expand = '', selfPath = '/search' }) {
    const q = typeof query === 'string' ? query.trim().slice(0, 200) : '';
    const t = searchTerms(q);
    const wanted = sectionsFor(scope, lang);
    if (!t.length) return { query: q, sections: [], failed: [] };
    const settled = await Promise.allSettled(wanted.map(section => section.load(lang, q, t)));
    const sections = [];
    const failed = [];
    settled.forEach((result, i) => {
        const section = wanted[i];
        if (result.status === 'rejected') {
            console.error(`site search ${section.key}:`, result.reason && result.reason.message);
            failed.push(section.key);
            return;
        }
        const value = Array.isArray(result.value) ? { total: result.value.length, items: result.value } : result.value;
        if (!value.total) return;
        const expanded = !section.more && section.key === expand;
        const shown = expanded ? EXPANDED : PER_SECTION;
        const moreHref = section.more ? withQuery(section.more, q) : `${withQuery(selfPath, q)}&more=${section.key}#search-${section.key}`;
        sections.push({
            key: section.key,
            total: value.total,
            items: value.items.slice(0, shown),
            moreHref: value.total > shown ? moreHref : '',
        });
    });
    return { query: q, sections, failed };
}

module.exports = { siteSearch, sectionsFor };
