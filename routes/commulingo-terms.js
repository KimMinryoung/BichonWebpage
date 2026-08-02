const express = require('express');
const errorPage = require('../utils/error-page');
const { renderMarkdown } = require('../utils/markdown');
const { loadCommuLingoTerms } = require('../data/commulingo/terms-store');
const { listCommuLingoDocsFor } = require('../data/commulingo/docs-store');
const { getReportsForTerm } = require('../services/report-mentions');
const {
    loadTermCategories,
    termCategoriesRef,
    termCategoriesWithCounts,
    termCategoryLabel,
} = require('../data/commulingo/term-categories');
const { getLinkIndexes, createLinker } = require('../data/commulingo/linkify');
const { genealogyLinksForEntry } = require('../data/commulingo/genealogy-links');
// Retired glossary ids ride the same commulingo_id_redirects table the person
// pages read, so merging two entries stays a DB-only edit. The people snapshot
// is where those rows are loaded (it fetches every entity_type, not just its
// own), which is why the lookup comes from that store rather than terms-store.
const { loadCommuLingoPeople, redirectTarget } = require('../data/commulingo/people-store');

// The entry now serving a retired glossary id, or '' if the id is simply
// unknown. A redirect lookup must never turn a 404 into a 500, so a failure to
// reach the store falls through to the not-found page.
async function mergedTermId(termId) {
    try {
        const loaded = await loadCommuLingoPeople();
        return redirectTarget(loaded.data, 'term', termId);
    } catch (err) {
        console.error('commulingo term redirect lookup:', err.message);
        return '';
    }
}

// Reference documents (참고 문헌) linked to this term/event via the docs
// manifest. Failure only costs the section, never the page.
function relatedDocsFor(kind, id, lang) {
    try {
        return listCommuLingoDocsFor(kind, id).map(doc => ({
            id: doc.id,
            title: localize(doc.title, lang),
            kind: localize(doc.kind, lang),
        }));
    } catch (e) {
        console.error(`commulingo ${kind} related docs:`, e);
        return [];
    }
}

const router = express.Router();

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

function presentTerm(raw, lang) {
    return {
        ...raw,
        aliasSearchText: aliasSearchText(raw),
        // Blank for an entry whose category has not been set yet; the card
        // simply omits the pill rather than showing 'Uncategorized'.
        categoryLabel: raw.category ? termCategoryLabel(raw.category, lang) : '',
        term: localize(raw.term, lang),
        termOther: lang === 'en' ? localize(raw.term, 'ko') : localize(raw.term, 'en'),
        period: localize(raw.period, lang),
        definition: localize(raw.definition, lang),
        body: localize(raw.body, lang),
        people: (raw.people || []).map(person => ({ ...person, name: localize(person.name, lang) })),
        // The paired event is a whole panel of its own on this page.
        events: (raw.events || [])
            .filter(event => !(raw.sameSubjectEvent && event.id === raw.sameSubjectEvent.id))
            .map(event => ({ ...event, title: localize(event.title, lang) })),
        related: (raw.related || []).map(entry => ({ id: entry.id, term: localize(entry.term, lang) })),
        parent: raw.parent ? { id: raw.parent.id, term: localize(raw.parent.term, lang) } : null,
        sameSubjectEvent: raw.sameSubjectEvent
            ? { id: raw.sameSubjectEvent.id, title: localize(raw.sameSubjectEvent.title, lang) }
            : null,
        children: (raw.children || []).map(entry => ({
            id: entry.id,
            term: localize(entry.term, lang),
            period: localize(entry.period, lang),
        })),
    };
}

// Both languages' aliases feed the client-side card search: readers look terms
// up by the spelling they already know ('쿨락', 'prodrazverstka', 'kolkhozy'),
// which is exactly what the alias lists hold.
function aliasSearchText(raw) {
    const aliases = raw.aliases || {};
    return [...(aliases.ko || []), ...(aliases.en || [])].join(' ');
}

// ── Sources ────────────────────────────────────────────────────────────

// Sources are stored as one string per citation, in three shapes:
//   'https://host/path — note'
//   'Publisher, "Title" (https://host/path) — note'
//   'plain text with no URL'
// The old view only linked the first shape and printed the rest verbatim, URL
// and all, under the label 'reference 1'. Pull each apart instead so the list
// says where the claim comes from.
const SOURCE_HOST_LABELS = {
    'en.wikipedia.org': { ko: '위키백과 (영문)', en: 'Wikipedia (EN)' },
    'ru.wikipedia.org': { ko: '위키백과 (러시아어)', en: 'Wikipedia (RU)' },
    'ko.wikipedia.org': { ko: '위키백과 (한국어)', en: 'Wikipedia (KO)' },
    'marxists.org': { ko: '마르크스주의 인터넷 아카이브', en: 'Marxists Internet Archive' },
    'www.marxists.org': { ko: '마르크스주의 인터넷 아카이브', en: 'Marxists Internet Archive' },
    'cyber-lenin.com': { ko: '사이버 레닌', en: 'Cyber-Lenin' },
};

function presentSource(raw, lang) {
    const text = String(raw || '').trim();
    const match = text.match(/https?:\/\/[^\s)]+/);
    const url = match ? match[0] : '';
    const head = (match ? text.slice(0, match.index) : text).replace(/[\s(]+$/, '').trim();
    const note = (match ? text.slice(match.index + url.length) : '')
        .replace(/^[)\s]*[—–-]?\s*/, '').trim();
    let host = '';
    if (url) {
        try { host = new URL(url).hostname; } catch (e) { host = ''; }
    }
    const known = SOURCE_HOST_LABELS[host];
    const fallback = known ? known[lang === 'en' ? 'en' : 'ko'] : host.replace(/^www\./, '');
    return {
        url,
        label: head || fallback || (lang === 'en' ? 'Reference' : '참고 자료'),
        note,
        internal: /(^|\.)cyber-lenin\.com$/.test(host),
    };
}

// Report hrefs arrive relative ('/reports/research/x#mention-term-y') and
// self-citations absolute, so both need a base to compare paths.
function urlPath(url) {
    try {
        return new URL(url, 'https://cyber-lenin.com').pathname.replace(/\/$/, '');
    } catch (e) {
        return '';
    }
}

// Self-citations that the related-reports panel already lists are dropped:
// the same report should not appear twice on one page, once as a link and once
// as its own evidence.
function presentSources(raw, lang, relatedReports) {
    const shown = new Set((relatedReports || []).map(report => urlPath(report.href || '')));
    return (raw || [])
        .map(source => presentSource(source, lang))
        .filter(source => !(source.internal && source.url && shown.has(urlPath(source.url))));
}

// ── List ordering and grouping ─────────────────────────────────────────

const HANGUL_INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
// Korean dictionaries file the doubled consonants under the plain one.
const INITIAL_GROUP = { 'ㄲ': 'ㄱ', 'ㄸ': 'ㄷ', 'ㅃ': 'ㅂ', 'ㅆ': 'ㅅ', 'ㅉ': 'ㅈ' };

// Index-bar key for a display term: Hangul initial consonant, Latin letter, or
// '#' for anything else (digits, as in '1987년 체제').
function initialKey(label) {
    const ch = String(label || '').trim().charAt(0);
    if (!ch) return '#';
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
        const initial = HANGUL_INITIALS[Math.floor((code - 0xac00) / 588)];
        return INITIAL_GROUP[initial] || initial;
    }
    if (/[a-zA-Z]/.test(ch)) return ch.toUpperCase();
    return '#';
}

function decadeKey(startYear) {
    if (!Number.isInteger(startYear)) return null;
    return Math.floor(startYear / 10) * 10;
}

// Groups the sorted list into the sections the index bar jumps to: initial
// letters when sorted by name, decades when sorted chronologically. Ids are
// positional so Hangul never has to survive a round trip through an anchor.
function groupTerms(terms, sort, lang) {
    const en = lang === 'en';
    const groups = [];
    let current = null;
    terms.forEach(term => {
        let key;
        let label;
        if (sort === 'chrono') {
            const decade = decadeKey(term.startYear);
            key = decade === null ? 'undated' : String(decade);
            label = decade === null
                ? (en ? 'Undated' : '연대 미상')
                : (en ? decade + 's' : decade + '년대');
        } else {
            key = initialKey(term.term);
            label = key;
        }
        if (!current || current.key !== key) {
            current = { key, label, id: 'commu-term-group-' + groups.length, terms: [] };
            groups.push(current);
        }
        current.terms.push(term);
    });
    return groups;
}

function sortTerms(terms, sort, lang) {
    const locale = lang === 'en' ? 'en' : 'ko';
    const byName = (a, b) => a.term.localeCompare(b.term, locale);
    if (sort !== 'chrono') return terms.slice().sort(byName);
    return terms.slice().sort((a, b) => {
        const aYear = Number.isInteger(a.startYear) ? a.startYear : Infinity;
        const bYear = Number.isInteger(b.startYear) ? b.startYear : Infinity;
        if (aYear !== bYear) return aYear - bYear;
        return byName(a, b);
    });
}

function renderAppView(req, view, locals) {
    return new Promise((resolve, reject) => {
        req.app.render(view, locals, (err, html) => (err ? reject(err) : resolve(html)));
    });
}

// Presented, sorted, grouped list data and the rendered per-group card
// fragments are pure functions of (terms ref, lang, sort); both are memoized
// against the terms-store reference, so they rebuild only when the glossary
// actually changes. The listing ships as a light shell (toolbar, search,
// chips, jump index, group headings + the first group's cards); the other
// groups' cards are fetched from /commulingo/terms/cards as the reader
// scrolls or searches.
const termListMemo = new WeakMap(); // termsRaw -> Map(`${lang}:${sort}` -> { terms, groups, categories })
const termCardsMemo = new WeakMap(); // termsRaw -> Map(`${lang}:${sort}:${groupId}` -> html)

async function termListData(lang, sort) {
    const raw = await loadCommuLingoTerms();
    await loadTermCategories();
    let byKey = termListMemo.get(raw);
    if (!byKey) {
        byKey = new Map();
        termListMemo.set(raw, byKey);
    }
    const key = `${lang === 'en' ? 'en' : 'ko'}:${sort}`;
    let data = byKey.get(key);
    // The memo is keyed on the terms object, but the category labels rendered
    // into it come from their own registry: a relabelled category must not wait
    // for the next terms refresh to appear.
    const categoriesRef = termCategoriesRef();
    if (data && data.categoriesRef !== categoriesRef) data = undefined;
    if (!data) {
        const terms = sortTerms(raw.map(term => presentTerm(term, lang)), sort, lang);
        data = {
            raw,
            terms,
            groups: groupTerms(terms, sort, lang),
            categories: termCategoriesWithCounts(terms, lang),
            categoriesRef,
        };
        byKey.set(key, data);
    }
    return data;
}

async function termGroupCardsHtml(req, lang, sort, groupId) {
    const data = await termListData(lang, sort);
    const group = data.groups.find(item => item.id === groupId);
    if (!group) return null;
    // Keyed on the list data rather than the raw terms: the rendered cards
    // carry category labels, and termListData builds a fresh object whenever
    // either the terms or the category registry changes.
    let byKey = termCardsMemo.get(data);
    if (!byKey) {
        byKey = new Map();
        termCardsMemo.set(data, byKey);
    }
    const key = `${lang === 'en' ? 'en' : 'ko'}:${sort}:${groupId}`;
    let html = byKey.get(key);
    if (!html) {
        html = await renderAppView(req, 'partials/commulingo-term-cards', { terms: group.terms });
        byKey.set(key, html);
    }
    return html;
}

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const en = lang === 'en';
        const sort = req.query.sort === 'chrono' ? 'chrono' : 'name';
        const data = await termListData(lang, sort);
        const firstGroup = data.groups[0];
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-terms', {
            termCount: data.terms.length,
            groups: data.groups,
            firstGroupId: firstGroup ? firstGroup.id : '',
            firstGroupHtml: firstGroup
                ? await termGroupCardsHtml(req, lang, sort, firstGroup.id)
                : '',
            categories: data.categories,
            sort,
            pageTitle: en ? 'Glossary — CommuLingo' : '용어 사전 — CommuLingo',
            pageDescription: en
                ? 'The concepts of Soviet and revolutionary history, connected to the people, events, and reports that use them.'
                : '혁명과 소련사의 개념들을 인물·사건·보고서와 연결해 읽는 용어 사전.',
            pagePath: '/commulingo/terms',
        });
    } catch (err) {
        console.error('commulingo terms:', err);
        res.status(500).send('Failed to load glossary');
    }
});

// Card fragment for one listing group. Registered before /:termId so 'cards'
// is never taken for a term id.
router.get('/cards', async (req, res) => {
    try {
        const sort = req.query.sort === 'chrono' ? 'chrono' : 'name';
        const groupId = typeof req.query.group === 'string' ? req.query.group.trim() : '';
        const html = await termGroupCardsHtml(req, res.locals.lang, sort, groupId);
        if (html === null) return res.status(404).send('');
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.type('html').send(html);
    } catch (err) {
        console.error('commulingo term cards:', err);
        res.status(500).send('');
    }
});

// Everything the glossary half of a page needs. Exported so the events route
// can render this panel beside its own when the two entries are the same
// subject. Returns null when the id is unknown.
async function buildTermPanel(termId, lang) {
    const allTerms = await loadCommuLingoTerms();
    await loadTermCategories();
    const raw = allTerms.find(item => item.id === termId);
    if (!raw) return null;
    const term = presentTerm(raw, lang);
    // One linker across definition and body: the first mention of an entry
    // links, later ones stay plain. The entry itself is excluded, and so is the
    // history event that is the same subject — the event panel is the other half
    // of this page, so linking its title would point at the tab the reader is
    // already on.
    const link = createLinker(await getLinkIndexes(lang), {
        surface: 'term',
        exclude: { term: term.id, event: term.sameSubjectEvent ? term.sameSubjectEvent.id : '' },
    });
    const definitionHtml = link.plain(term.definition);
    const bodyHtml = term.body ? link.html(renderMarkdown(term.body)) : '';
    // Public research reports that mention this term. Failure only costs the
    // section, never the page.
    let relatedReports = [];
    try {
        relatedReports = await getReportsForTerm(termId, lang);
    } catch (e) {
        console.error('commulingo term related reports:', e);
    }
    // The documents come first: the 계보도 section reaches charts through them
    // as well as through the entry's own nodes.
    const relatedDocs = relatedDocsFor('terms', termId, lang);
    return {
        term,
        definitionHtml,
        bodyHtml,
        sources: presentSources(term.sources, lang, relatedReports),
        relatedReports,
        relatedDocs,
        genealogies: genealogyLinksForEntry('term', termId, relatedDocs, lang),
    };
}

router.get('/:termId', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const termId = typeof req.params.termId === 'string' ? req.params.termId.trim() : '';
        const panel = await buildTermPanel(termId, lang);
        if (!panel) {
            const merged = await mergedTermId(termId);
            if (merged) return res.redirect(301, `/commulingo/terms/${encodeURIComponent(merged)}`);
            return errorPage.notFound(res, {
                message: lang === 'en' ? 'Term not found.' : '용어를 찾을 수 없습니다.',
                backHref: '/commulingo/terms', backLabel: lang === 'en' ? 'Glossary' : '용어 사전',
            });
        }
        const term = panel.term;
        // The narrative half, when the two entries are the same subject. Lazy
        // require: the two routes reach into each other.
        const { buildEventPanel } = require('./commulingo-events');
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-term', {
            ...panel,
            term,
            eventPanel: term.sameSubjectEvent
                ? await buildEventPanel(term.sameSubjectEvent.id, lang)
                : null,
            activePanel: 'term',
            pageTitle: lang === 'en' ? `${term.term} — Glossary` : `${term.term} — 용어 사전`,
            pageDescription: term.definition,
            pagePath: `/commulingo/terms/${term.id}`,
        });
    } catch (err) {
        console.error('commulingo term detail:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load term.' : '용어 정보를 불러올 수 없습니다.',
            backHref: '/commulingo/terms', backLabel: res.locals.lang === 'en' ? 'Glossary' : '용어 사전',
        });
    }
});

module.exports = router;
// Attached to the router so the events route can build this panel. See the lazy
// require in the detail handler for why this is not a shared module.
module.exports.buildTermPanel = buildTermPanel;
