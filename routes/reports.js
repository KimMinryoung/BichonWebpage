const express = require('express');
const router = express.Router();
const cache = require('../config/report-cache');
const seo = require('../utils/seo');
const { fetchWithTimeout, clampInteger } = require('../utils/http');
const { renderMarkdown, stripFirstHeading, titleFromMarkdown } = require('../utils/markdown');

const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';
const ADMIN_KEY = process.env.LENINBOT_ADMIN_KEY || '';
const REPORTS_PER_PAGE = 20;

function researchMarkdown(data) {
    return data && (data.content || data.markdown || data.body || data.text || '');
}

function researchHtmlBody(data, markdown) {
    if (data && data.html_body) return data.html_body;
    if (data && data.htmlBody) return data.htmlBody;
    return renderMarkdown(stripFirstHeading(markdown));
}

function renderResearch(res, { filename, slug, pagePath, data }) {
    const markdown = researchMarkdown(data);
    const title = data.title || titleFromMarkdown(markdown, slug.replace(/_/g, ' '));
    const descriptionSource = markdown || data.summary || data.excerpt || data.html_body || data.htmlBody || '';
    const pageDescription = seo.excerpt(descriptionSource, 160);

    return res.render('public/research-view', {
        filename,
        markdown: stripFirstHeading(markdown),
        htmlBody: researchHtmlBody(data, markdown),
        markdownUrl: `${pagePath}.md`,
        pageTitle: title,
        pageDescription,
        pagePath,
        ogType: 'article',
        jsonLd: seo.pageJsonLd({
            type: 'Article',
            title,
            description: pageDescription,
            path: pagePath,
            authorName: 'Cyber-Lenin',
        }),
    });
}

function reportTitle(report) {
    const resultLines = (report.result || '').split('\n');
    for (const line of resultLines) {
        const match = line.match(/^#\s+(.+)/);
        if (match) return match[1];
    }
    return (report.content || `Report #${report.id}`).split('\n')[0].substring(0, 80);
}

// POST /cache/clear — manual cache purge
router.post('/cache/clear', async (req, res) => {
    if (!req.session.isAuthenticated) return res.status(403).send('Forbidden');
    await cache.clearAll();
    res.json({ cleared: true });
});

// 리포트 목록 — public: research only. admin: research + task reports.
router.get('/', async (req, res) => {
    const isAdmin = !!req.session.isAuthenticated;
    const currentPage = clampInteger(req.query.page, { fallback: 1, min: 1, max: 1000 });
    const pagePath = currentPage > 1 ? `/reports?page=${currentPage}` : '/reports';
    try {
        const offset = (currentPage - 1) * REPORTS_PER_PAGE;

        // Task reports — admin-only. Skip the entire fetch (and cache) for public viewers.
        let taskData = {
            reports: [], currentPage: 1, totalPages: 0, paginationBase: '/reports?page='
        };
        if (isAdmin) {
            const cached = await cache.getList(currentPage);
            if (cached) {
                taskData = cached;
            } else {
                const response = await fetchWithTimeout(
                    `${CHAT_API_URL}/reports?limit=${REPORTS_PER_PAGE}&offset=${offset}`,
                    { headers: { 'X-Admin-Key': ADMIN_KEY }, timeoutMs: 5000 }
                );
                if (!response.ok) throw new Error(`API ${response.status}`);

                const data = await response.json();
                const totalPages = Math.ceil(data.total / REPORTS_PER_PAGE);

                for (const r of data.reports || []) {
                    await cache.setReport(r);
                }

                taskData = {
                    reports: data.reports || [],
                    currentPage,
                    totalPages,
                    paginationBase: '/reports?page='
                };
                await cache.setList(currentPage, taskData);
            }
        }

        // Fetch research list (with cache). Title is extracted server-side from each file's
        // H1, so no per-file fetch is needed here — avoids N+1 and the partial-failure state
        // that previously baked filenames into the list cache.
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        let researchFiles = await cache.getResearchList(lang);
        if (!researchFiles) {
            researchFiles = [];
            try {
                const rRes = await fetchWithTimeout(`${CHAT_API_URL}/research?lang=${lang}`, { timeoutMs: 5000 });
                if (rRes.ok) {
                    const rData = await rRes.json();
                    researchFiles = (rData.files || []).sort((a, b) => b.modified_at - a.modified_at);
                    await cache.setResearchList(researchFiles, lang);
                }
            } catch (e) {
                console.error('Error fetching research list:', e);
            }
        }

        // Fetch static-pages list (with cache)
        let pagesList = await cache.getPagesList(lang);
        if (!pagesList) {
            pagesList = [];
            try {
                const pRes = await fetchWithTimeout(`${CHAT_API_URL}/pages?lang=${lang}`, { timeoutMs: 5000 });
                if (pRes.ok) {
                    const pData = await pRes.json();
                    pagesList = pData.items || [];
                    await cache.setPagesList(pagesList, lang);
                }
            } catch (e) {
                console.error('Error fetching pages list:', e);
            }
        }

        // Unified research-tab feed: research files + static pages, sorted by date desc.
        // `summary` is the unified preview field — the EJS template clamps it to 3 lines via CSS.
        const researchItems = [
            ...researchFiles.map(f => ({
                type: 'research',
                title: f.title || f.filename.replace(/\.md$/, '').replace(/_/g, ' '),
                href: `/reports/research/${f.filename.replace(/\.md$/, '')}`,
                modified: (f.modified_at || 0) * 1000,
                size: f.size,
                summary: f.excerpt,
            })),
            ...pagesList.map(p => ({
                type: 'page',
                title: p.title,
                href: `/p/${p.slug}`,
                modified: p.updated_at ? new Date(p.updated_at).getTime() : 0,
                summary: p.summary,
            })),
        ].sort((a, b) => b.modified - a.modified);

        res.render('public/reports', {
            ...taskData,
            researchItems,
            pagePath,
            pageTitle: '사이버-레닌 보고서',
            pageDescription: '사이버-레닌이 작성한 정세 분석, 기술, AI 주권 연구 보고서 목록입니다.',
            jsonLd: seo.itemListJsonLd(researchItems.map(item => ({ title: item.title, href: item.href }))),
            showTasks: isAdmin
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.render('public/reports', {
            reports: [], currentPage: 1, totalPages: 0, researchItems: [], pagePath,
            pageTitle: '사이버-레닌 보고서',
            pageDescription: '사이버-레닌이 작성한 정세 분석, 기술, AI 주권 연구 보고서 목록입니다.',
            showTasks: isAdmin
        });
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

        // Check file cache
        const cached = await cache.getResearch(filename, lang);
        if (cached && (researchMarkdown(cached) || cached.html_body || cached.htmlBody)) {
            if (wantsMarkdown) {
                const cachedMarkdown = researchMarkdown(cached);
                if (!cachedMarkdown) {
                    return res.status(404).render('layouts/main', {
                        pageTitle: '404',
                        body: '<div class="box"><h1>404</h1><p>마크다운 원문을 찾을 수 없습니다.</p><a href="/reports">목록으로</a></div>'
                    });
                }
                res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
                return res.type('text/markdown; charset=utf-8').send(cachedMarkdown);
            }
            return renderResearch(res, {
                filename,
                slug,
                pagePath,
                data: cached,
            });
        }

        const response = await fetchWithTimeout(`${CHAT_API_URL}/research/${encodeURIComponent(filename)}?lang=${lang}`, { timeoutMs: 5000 });
        if (!response.ok) {
            return res.status(404).render('layouts/main', {
                pageTitle: '404',
                body: '<div class="box"><h1>404</h1><p>리서치를 찾을 수 없습니다.</p><a href="/reports">목록으로</a></div>'
            });
        }

        const data = await response.json();
        const markdown = researchMarkdown(data);
        if (wantsMarkdown) {
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            return res.type('text/markdown; charset=utf-8').send(markdown);
        }
        const title = data.title || titleFromMarkdown(markdown, slug.replace(/_/g, ' '));
        await cache.setResearch(filename, {
            content: markdown,
            html_body: data.html_body || data.htmlBody || '',
            summary: data.summary || data.excerpt || '',
            title,
        }, lang);

        renderResearch(res, {
            filename,
            slug,
            pagePath,
            data: { ...data, title },
        });
    } catch (error) {
        console.error('Error fetching research:', error);
        res.status(500).render('layouts/main', {
            pageTitle: 'Error',
            body: '<div class="box"><h1>Error</h1><p>리서치를 불러올 수 없습니다.</p><a href="/reports">목록으로</a></div>'
        });
    }
});

// 리포트 개별 조회 — admin-only
router.get('/:id', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(404).render('layouts/main', {
            pageTitle: '404',
            body: `<div class="box"><h1>404</h1><p>${res.locals.strings.error.notFound}</p><a href="/reports">${res.locals.strings.public.backToList}</a></div>`
        });
    }
    try {
        const id = parseInt(req.params.id);
        const pagePath = `/reports/${id}`;

        // Check file cache (permanent — reports don't change)
        const cached = await cache.getReport(id);
        if (cached) {
            return res.render('public/report-view', {
                report: cached,
                pageTitle: reportTitle(cached),
                pagePath,
                robotsMeta: 'noindex, nofollow'
            });
        }

        const response = await fetchWithTimeout(`${CHAT_API_URL}/reports/${id}`, {
            headers: { 'X-Admin-Key': ADMIN_KEY },
            timeoutMs: 5000
        });
        if (!response.ok) {
            return res.status(404).render('layouts/main', {
                pageTitle: '404',
                body: '<div class="box"><h1>404</h1><p>리포트를 찾을 수 없습니다.</p><a href="/reports">목록으로</a></div>'
            });
        }

        const data = await response.json();
        const report = data.report;
        await cache.setReport(report);

        res.render('public/report-view', {
            report,
            pageTitle: reportTitle(report),
            pagePath,
            robotsMeta: 'noindex, nofollow'
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).render('layouts/main', {
            pageTitle: 'Error',
            body: '<div class="box"><h1>Error</h1><p>리포트를 불러올 수 없습니다.</p><a href="/reports">목록으로</a></div>'
        });
    }
});

module.exports = router;
