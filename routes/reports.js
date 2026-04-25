const express = require('express');
const router = express.Router();
const cache = require('../config/report-cache');

const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';
const ADMIN_KEY = process.env.LENINBOT_ADMIN_KEY || '';
const REPORTS_PER_PAGE = 20;

// POST /cache/clear — manual cache purge
router.post('/cache/clear', async (req, res) => {
    if (!req.session.isAuthenticated) return res.status(403).send('Forbidden');
    await cache.clearAll();
    res.json({ cleared: true });
});

// 리포트 목록 — public: research only. admin: research + task reports.
router.get('/', async (req, res) => {
    const isAdmin = !!req.session.isAuthenticated;
    const currentPage = parseInt(req.query.page) || 1;
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
                const response = await fetch(
                    `${CHAT_API_URL}/reports?limit=${REPORTS_PER_PAGE}&offset=${offset}`,
                    { headers: { 'X-Admin-Key': ADMIN_KEY } }
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
        let researchFiles = await cache.getResearchList();
        if (!researchFiles) {
            researchFiles = [];
            try {
                const rRes = await fetch(`${CHAT_API_URL}/research`);
                if (rRes.ok) {
                    const rData = await rRes.json();
                    researchFiles = (rData.files || []).sort((a, b) => b.modified_at - a.modified_at);
                    await cache.setResearchList(researchFiles);
                }
            } catch (e) {
                console.error('Error fetching research list:', e);
            }
        }

        // Fetch static-pages list (with cache)
        let pagesList = await cache.getPagesList();
        if (!pagesList) {
            pagesList = [];
            try {
                const pRes = await fetch(`${CHAT_API_URL}/pages`);
                if (pRes.ok) {
                    const pData = await pRes.json();
                    pagesList = pData.items || [];
                    await cache.setPagesList(pagesList);
                }
            } catch (e) {
                console.error('Error fetching pages list:', e);
            }
        }

        // Unified research-tab feed: research files + static pages, sorted by date desc
        const researchItems = [
            ...researchFiles.map(f => ({
                type: 'research',
                title: f.title || f.filename.replace(/\.md$/, '').replace(/_/g, ' '),
                href: `/reports/research/${f.filename.replace(/\.md$/, '')}`,
                modified: (f.modified_at || 0) * 1000,
                size: f.size,
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
            showTasks: isAdmin
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.render('public/reports', {
            reports: [], currentPage: 1, totalPages: 0, researchItems: [], pagePath,
            showTasks: isAdmin
        });
    }
});

// Research 개별 조회 (must be before /:id to avoid conflict)
router.get('/research/:filename', async (req, res) => {
    try {
        const filename = req.params.filename.endsWith('.md') ? req.params.filename : req.params.filename + '.md';
        const slug = filename.replace(/\.md$/, '');
        const pagePath = `/reports/research/${slug}`;

        const stripTitle = (md) => md.replace(/^\s*#\s+.+\r?\n+/, '');

        // Check file cache
        const cached = await cache.getResearch(filename);
        if (cached && cached.content) {
            return res.render('public/research-view', {
                filename, markdown: stripTitle(cached.content),
                pageTitle: cached.title || slug.replace(/_/g, ' '),
                pagePath
            });
        }

        const response = await fetch(`${CHAT_API_URL}/research/${encodeURIComponent(filename)}`);
        if (!response.ok) {
            return res.status(404).render('layouts/main', {
                pageTitle: '404',
                body: '<div class="box"><h1>404</h1><p>리서치를 찾을 수 없습니다.</p><a href="/reports">목록으로</a></div>'
            });
        }

        const data = await response.json();
        const markdown = data.content || '';
        const match = markdown.match(/^#\s+(.+)/m);
        const title = data.title || (match ? match[1] : slug.replace(/_/g, ' '));
        await cache.setResearch(filename, { content: markdown, title });

        res.render('public/research-view', { filename, markdown: stripTitle(markdown), pageTitle: title, pagePath });
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
            return res.render('public/report-view', { report: cached, pagePath });
        }

        const response = await fetch(`${CHAT_API_URL}/reports/${id}`, {
            headers: { 'X-Admin-Key': ADMIN_KEY }
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

        res.render('public/report-view', { report, pagePath });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).render('layouts/main', {
            pageTitle: 'Error',
            body: '<div class="box"><h1>Error</h1><p>리포트를 불러올 수 없습니다.</p><a href="/reports">목록으로</a></div>'
        });
    }
});

module.exports = router;
