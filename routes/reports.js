const express = require('express');
const researchStore = require('../config/research-store');
const seo = require('../utils/seo');
const { fetchWithTimeout, clampInteger, markDegraded } = require('../utils/http');
const { titleFromMarkdown } = require('../utils/markdown');
const errorPage = require('../utils/error-page');
const { CHAT_API_URL, LENINBOT_ADMIN_KEY: ADMIN_KEY } = require('../config/services');
const { listPrivateReports, getPrivateReport } = require('../config/private-report-store');
const { researchSeriesNavFor } = require('../services/research-series');
const { cachedResearchList, cachedPagesList } = require('../services/public-lists');
const { renderResearch, researchMarkdown } = require('../services/research-render');
const pageStore = require('../config/page-store');
const { searchTerms, matchSnippet } = require('../utils/text-search');
const { librarySearchRoute, libraryPagination } = require('../utils/library-search-route');

const router = express.Router();
const REPORTS_PER_PAGE = 20;

function reportTitle(report) {
    const resultLines = (report.result || '').split('\n');
    for (const line of resultLines) {
        const match = line.match(/^#\s+(.+)/);
        if (match) return match[1];
    }
    return (report.content || `Report #${report.id}`).split('\n')[0].substring(0, 80);
}

router.get(['/private', '/admin/private-reports'], (req, res) => {
    res.redirect('/reports');
});

// The research tab's feed: private reports (admin), research documents and
// static pages, newest first. With a query, only the entries whose title,
// summary or body contains every word, each excerpted around the match. The
// public feed's sources failing is reported on the page (and as a 503 when
// nothing could be listed) rather than shown as "none".
async function researchFeed(lang, isAdmin, query) {
    const terms = searchTerms(query);
    let feedFailed = false;
    const load = async (task, label, { required = true } = {}) => {
        try {
            return await task();
        } catch (e) {
            console.error(`Error loading ${label}:`, e);
            if (required) feedFailed = true;
            return [];
        }
    };
    const [researchFiles, privateReports, pagesList, researchMatches, pageMatches] = await Promise.all([
        load(() => cachedResearchList(lang), 'research list'),
        isAdmin ? load(listPrivateReports, 'private reports', { required: false }) : [],
        load(() => cachedPagesList(lang), 'pages list'),
        terms.length ? load(() => researchStore.searchResearchDocuments(lang, terms, { includePrivate: isAdmin }), 'research search') : [],
        terms.length ? load(() => pageStore.searchPages(lang, terms), 'pages search') : [],
    ]);
    const windows = new Map([
        ...researchMatches.map(row => [row.status === 'private' ? `private:${row.slug}` : `research:${row.filename}`, row.body_window]),
        ...pageMatches.map(row => [`page:${row.slug}`, row.body_window]),
    ]);

    // `summary` is the unified preview field — the EJS template clamps it to 3 lines via CSS.
    let items = [
        ...privateReports.map(r => ({
            key: `private:${r.slug}`,
            type: 'private',
            title: r.title || r.slug,
            href: `/reports/private/${r.slug}`,
            modified: (r.modified_at || 0) * 1000,
            size: r.size,
            summary: r.excerpt,
            private: true,
        })),
        ...researchFiles.map(f => ({
            key: `research:${f.filename}`,
            type: 'research',
            title: f.title || f.filename.replace(/\.md$/, '').replace(/_/g, ' '),
            href: `/reports/research/${f.filename.replace(/\.md$/, '')}`,
            modified: (f.modified_at || 0) * 1000,
            size: f.size,
            summary: f.excerpt,
        })),
        ...pagesList.map(p => ({
            key: `page:${p.slug}`,
            type: 'page',
            title: p.title,
            href: `/p/${p.slug}`,
            modified: p.updated_at ? new Date(p.updated_at).getTime() : 0,
            summary: p.summary,
        })),
    ];
    if (terms.length) {
        items = items.filter(item => windows.has(item.key)).map(item => {
            const summary = String(item.summary || '').toLocaleLowerCase();
            const inSummary = terms.some(term => summary.includes(term));
            return inSummary ? item : { ...item, summary: matchSnippet(windows.get(item.key), terms, 220) };
        });
    }
    return { items: items.sort((a, b) => b.modified - a.modified), feedFailed };
}

// Shared by the success and failure branches of the list render.
function reportsListLocals(res, pagePath, isAdmin, query) {
    return {
        searchValue: query,
        pagePath,
        pageTitle: res.locals.strings.nav.reports,
        pageDescription: res.locals.lang === 'en'
            ? 'Research reports by Cyber-Lenin on current affairs, technology and AI sovereignty.'
            : '사이버-레닌이 작성한 정세 분석, 기술, AI 주권 연구 보고서 목록입니다.',
        showTasks: isAdmin,
    };
}

// 리포트 목록 — public: research only. admin: research + task reports.
router.get('/', async (req, res) => {
    const isAdmin = !!req.session.adminUser;
    const currentPage = clampInteger(req.query.page, { fallback: 1, min: 1, max: 1000 });
    const pagePath = currentPage > 1 ? `/reports?page=${currentPage}` : '/reports';
    const query = typeof req.query.q === 'string' ? req.query.q.slice(0, 200) : '';
    try {
        const offset = (currentPage - 1) * REPORTS_PER_PAGE;

        // Task reports — admin-only. Skip the fetch entirely for public viewers.
        let taskData = {
            reports: [], currentPage: 1, totalPages: 0, paginationBase: '/reports?page='
        };
        if (isAdmin) {
            // Fetched from the backend on every view: an admin-only list on
            // the same host, rarely opened, so a cache would only go stale.
            try {
                const response = await fetchWithTimeout(
                    `${CHAT_API_URL}/reports?limit=${REPORTS_PER_PAGE}&offset=${offset}`,
                    { headers: { 'X-Admin-Key': ADMIN_KEY }, timeoutMs: 5000 }
                );
                if (!response.ok) throw new Error(`API ${response.status}`);
                const data = await response.json();
                taskData = {
                    reports: data.reports || [],
                    currentPage,
                    totalPages: Math.ceil(data.total / REPORTS_PER_PAGE),
                    paginationBase: '/reports?page='
                };
            } catch (e) {
                console.error('Error loading task reports:', e);
            }
        }

        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        const { items: researchItems, feedFailed } = await researchFeed(lang, isAdmin, query);

        // The research feed pages on the same ?page= the task panel uses, so
        // one query param drives both tabs.
        const researchTotalPages = Math.max(1, Math.ceil(researchItems.length / REPORTS_PER_PAGE));
        const pagedResearchItems = researchItems.slice(offset, offset + REPORTS_PER_PAGE);
        if (feedFailed) markDegraded(res, { empty: researchItems.length === 0 });

        res.render('public/reports', {
            ...reportsListLocals(res, pagePath, isAdmin, query),
            ...taskData,
            researchItems: pagedResearchItems,
            researchPagination: libraryPagination('/reports', query, currentPage, researchTotalPages),
            feedFailed,
            robotsMeta: isAdmin ? 'noindex, nofollow' : undefined,
            jsonLd: seo.itemListJsonLd(
                pagedResearchItems.map(item => ({ title: item.title, href: item.href })),
                res.locals.urlLanguage),
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        markDegraded(res, { empty: true });
        res.render('public/reports', {
            ...reportsListLocals(res, pagePath, isAdmin, query),
            reports: [], currentPage: 1, totalPages: 0, researchItems: [], feedFailed: true,
            researchPagination: libraryPagination('/reports', '', 1, 1),
        });
    }
});

router.get('/search', librarySearchRoute({
    view: 'partials/library-report-items',
    target: '#library-list',
    logLabel: 'reports',
    load: async (req, res, { query, page }) => {
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        const { items, feedFailed } = await researchFeed(lang, !!req.session.adminUser, query);
        if (feedFailed && !items.length) throw new Error('research feed unavailable');
        const offset = (page - 1) * REPORTS_PER_PAGE;
        return {
            locals: { researchItems: items.slice(offset, offset + REPORTS_PER_PAGE) },
            pagination: libraryPagination('/reports', query, page, Math.ceil(items.length / REPORTS_PER_PAGE)),
            matched: items.length,
        };
    },
}));

// Private research/report detail — admin-only, integrated into the public reports viewer.
router.get('/private/:slug', async (req, res) => {
    if (!req.session.adminUser) {
        return errorPage.notFound(res, { backHref: '/reports', backLabel: res.locals.strings.public.backToList });
    }
    try {
        res.setHeader('Cache-Control', 'no-store');
        const requestedMarkdownFile = req.params.slug.endsWith('.md');
        const wantsMarkdown = requestedMarkdownFile || req.query.format === 'markdown' || req.query.format === 'md';
        const slug = req.params.slug.replace(/\.md$/, '');
        const pagePath = `/reports/private/${slug}`;
        const data = await getPrivateReport(slug);
        if (!data) {
            return errorPage.notFound(res, { message: '비공개 보고서를 찾을 수 없습니다.', backHref: '/reports', backLabel: '목록으로', robotsMeta: 'noindex, nofollow' });
        }

        const markdown = researchMarkdown(data);
        if (wantsMarkdown) {
            seo.setMarkdownSeoHeaders(res, pagePath, { follow: false });
            res.setHeader('Content-Disposition', `inline; filename="${slug}.md"`);
            return res.type('text/markdown; charset=utf-8').send(markdown);
        }
        return await renderResearch(res, {
            filename: `${slug}.md`,
            slug,
            pagePath,
            data,
        });
    } catch (error) {
        console.error('Error fetching private report:', error);
        errorPage.serverError(res, { message: '비공개 보고서를 불러올 수 없습니다.', backHref: '/reports', backLabel: '목록으로', robotsMeta: 'noindex, nofollow' });
    }
});

// Research 개별 조회 (must be before /:id to avoid conflict)
router.get('/research/:filename', async (req, res) => {
    try {
        const requestedMarkdownFile = req.params.filename.endsWith('.md');
        const wantsMarkdown = requestedMarkdownFile || req.query.format === 'markdown' || req.query.format === 'md';
        const filename = requestedMarkdownFile ? req.params.filename : req.params.filename + '.md';
        const slug = filename.replace(/\.md$/, '');
        const pagePath = `/reports/research/${slug}`;
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';

        const data = await researchStore.getResearch(filename, lang);
        if (!data) {
            return errorPage.notFound(res, { message: '리서치를 찾을 수 없습니다.', backHref: '/reports', backLabel: '목록으로' });
        }

        const markdown = researchMarkdown(data);
        if (wantsMarkdown) {
            seo.setMarkdownSeoHeaders(res, pagePath, {
                lang: data.has_translation && res.locals.urlLanguage === 'en' ? 'en' : 'ko',
            });
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            return res.type('text/markdown; charset=utf-8').send(markdown);
        }
        const title = data.title || titleFromMarkdown(markdown, slug.replace(/_/g, ' '));
        const seriesNav = await researchSeriesNavFor({ filename, slug, title, ...data }, lang);

        await renderResearch(res, {
            filename,
            slug,
            pagePath,
            data: { ...data, title },
            seriesNav,
        });
    } catch (error) {
        console.error('Error fetching research:', error);
        errorPage.serverError(res, { message: '리서치를 불러올 수 없습니다.', backHref: '/reports', backLabel: '목록으로' });
    }
});

// 리포트 개별 조회 — admin-only
router.get('/:id', async (req, res) => {
    if (!req.session.adminUser) {
        return errorPage.notFound(res, { backHref: '/reports', backLabel: res.locals.strings.public.backToList });
    }
    try {
        const id = parseInt(req.params.id);
        const pagePath = `/reports/${id}`;

        const response = await fetchWithTimeout(`${CHAT_API_URL}/reports/${id}`, {
            headers: { 'X-Admin-Key': ADMIN_KEY },
            timeoutMs: 5000
        });
        if (!response.ok) {
            return errorPage.notFound(res, { message: '리포트를 찾을 수 없습니다.', backHref: '/reports', backLabel: '목록으로' });
        }

        const data = await response.json();
        const report = data.report;

        res.render('public/report-view', {
            report,
            pageTitle: reportTitle(report),
            pagePath,
            robotsMeta: 'noindex, nofollow'
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        errorPage.serverError(res, { message: '리포트를 불러올 수 없습니다.', backHref: '/reports', backLabel: '목록으로' });
    }
});

module.exports = router;
