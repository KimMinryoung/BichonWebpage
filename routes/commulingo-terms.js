const express = require('express');
const errorPage = require('../utils/error-page');
const { renderMarkdown } = require('../utils/markdown');
const { loadCommuLingoTerms } = require('../data/commulingo/terms-store');
const { listCommuLingoDocsFor } = require('../data/commulingo/docs-store');
const { getReportsForTerm } = require('../services/report-mentions');
const { termCategoriesWithCounts } = require('../data/commulingo/term-categories');
const {
    buildTermLinkIndex,
    linkifyTermsHtml,
    linkifyTermsPlain,
} = require('../data/commulingo/term-linkify');

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
        term: localize(raw.term, lang),
        termOther: lang === 'en' ? localize(raw.term, 'ko') : localize(raw.term, 'en'),
        period: localize(raw.period, lang),
        definition: localize(raw.definition, lang),
        body: localize(raw.body, lang),
        people: (raw.people || []).map(person => ({ ...person, name: localize(person.name, lang) })),
        events: (raw.events || []).map(event => ({ ...event, title: localize(event.title, lang) })),
        related: (raw.related || []).map(entry => ({ id: entry.id, term: localize(entry.term, lang) })),
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

// ── In-text term links ─────────────────────────────────────────────────

// Index building walks every alias of every term, so memoize it against the
// snapshot reference the store hands out (same approach as report-links.js).
let indexMemo = { termsRef: null, byLang: {} };

function termLinkIndexFor(allTerms, lang) {
    if (indexMemo.termsRef !== allTerms) {
        indexMemo = { termsRef: allTerms, byLang: {} };
    }
    if (!(lang in indexMemo.byLang)) {
        indexMemo.byLang[lang] = buildTermLinkIndex(allTerms, { lang });
    }
    return indexMemo.byLang[lang];
}

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const en = lang === 'en';
        const sort = req.query.sort === 'chrono' ? 'chrono' : 'name';
        const all = (await loadCommuLingoTerms()).map(term => presentTerm(term, lang));
        const terms = sortTerms(all, sort, lang);
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-terms', {
            terms,
            groups: groupTerms(terms, sort, lang),
            categories: termCategoriesWithCounts(terms, lang),
            sort,
            pageTitle: en ? 'Glossary — CommuLingo' : '용어 사전 — CommuLingo',
            pageDescription: en
                ? 'The concepts of Soviet and revolutionary history, connected to the people, events, and reports that use them.'
                : '혁명과 소련사의 개념들을 인물·사건·보고서와 연결해 읽는 용어 사전.',
            pagePath: '/commulingo/terms',
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
        });
    } catch (err) {
        console.error('commulingo terms:', err);
        res.status(500).send('Failed to load glossary');
    }
});

router.get('/:termId', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const termId = typeof req.params.termId === 'string' ? req.params.termId.trim() : '';
        const allTerms = await loadCommuLingoTerms();
        const raw = allTerms.find(term => term.id === termId);
        if (!raw) return errorPage.notFound(res, {
            message: lang === 'en' ? 'Term not found.' : '용어를 찾을 수 없습니다.',
            backHref: '/commulingo/terms', backLabel: lang === 'en' ? 'Glossary' : '용어 사전',
        });
        const term = presentTerm(raw, lang);
        // One `seen` set across definition and body: the first mention of
        // another term links, later ones stay plain.
        const linkIndex = termLinkIndexFor(allTerms, lang);
        const linked = new Set();
        const definitionHtml = linkifyTermsPlain(term.definition, linkIndex, term.id, linked);
        const bodyHtml = term.body
            ? linkifyTermsHtml(renderMarkdown(term.body), linkIndex, term.id, linked)
            : '';
        // Public research reports that mention this term. Failure only costs
        // the section, never the page.
        let relatedReports = [];
        try {
            relatedReports = await getReportsForTerm(termId, lang);
        } catch (e) {
            console.error('commulingo term related reports:', e);
        }
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-term', {
            term,
            definitionHtml,
            bodyHtml,
            sources: presentSources(term.sources, lang, relatedReports),
            relatedReports,
            relatedDocs: relatedDocsFor('terms', termId, lang),
            pageTitle: lang === 'en' ? `${term.term} — Glossary` : `${term.term} — 용어 사전`,
            pageDescription: term.definition,
            pagePath: `/commulingo/terms/${term.id}`,
            extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
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
