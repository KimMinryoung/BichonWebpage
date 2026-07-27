const express = require('express');
const router = express.Router();
const cache = require('../config/report-cache');
const db = require('../config/database');
const researchStore = require('../config/research-store');
const pageStore = require('../config/page-store');
const seo = require('../utils/seo');
const { fetchWithTimeout, clampInteger } = require('../utils/http');
const {
    downgradeUnknownReportLinks,
    renderMarkdown,
    stripFirstHeading,
    titleFromMarkdown,
} = require('../utils/markdown');
const { sanitizeRich } = require('../utils/sanitize');
const { getReportLinkContext, linkifyReportHtml } = require('../data/commulingo/report-links');
const errorPage = require('../utils/error-page');

const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';
const ADMIN_KEY = process.env.LENINBOT_ADMIN_KEY || '';
const REPORTS_PER_PAGE = 20;

function researchMarkdown(data) {
    return data && (data.content || data.markdown || data.body || data.text || '');
}

function researchHtmlBody(data, markdown, knownSlugs) {
    // A report links its predecessors by slug, and slugs get renamed or never
    // published, so an unresolvable one renders as plain text instead of a link
    // that 404s. knownSlugs is undefined when the lookup failed, and then the
    // links are left exactly as written.
    const isKnownReport = knownSlugs ? slug => knownSlugs.has(slug) : undefined;
    const prerendered = data && (data.html_body || data.htmlBody);
    const html = prerendered
        ? downgradeUnknownReportLinks(prerendered, isKnownReport)
        : renderMarkdown(stripFirstHeading(markdown), { isKnownReport });
    return sanitizeRich(html);
}

function timestampSeconds(value) {
    if (!value) return 0;
    const time = new Date(value).getTime();
    return Number.isFinite(time) ? Math.floor(time / 1000) : 0;
}

function stripMarkdown(content) {
    return String(content || '')
        .replace(/^#\s+.+$/m, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^\s*(작성자|작성일|Author|Date)\s*:.*$/gim, '')
        .replace(/^\s*>.*$/gm, '')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^[-*+]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function excerpt(content, limit = 220) {
    const text = stripMarkdown(content);
    return text.length > limit ? text.substring(0, limit) + '...' : text;
}

function privateReportFromRow(row, includeContent = false) {
    if (!row) return null;
    const markdown = row.markdown || '';
    const data = {
        id: row.id,
        slug: row.slug,
        title: row.title || row.slug,
        summary: row.summary || '',
        excerpt: row.summary || (markdown ? excerpt(markdown) : ''),
        size: row.markdown_size || Buffer.byteLength(markdown, 'utf8'),
        modified_at: timestampSeconds(row.updated_at || row.created_at),
        created_at: row.created_at,
        updated_at: row.updated_at,
        content_sha256: row.content_sha256,
        source_task_id: row.source_task_id,
        published_research_id: row.published_research_id,
        private: true,
    };
    if (includeContent) {
        data.content = markdown;
        data.markdown = markdown;
    }
    return data;
}

async function listPrivateReports() {
    const { rows } = await db.query(
        `SELECT id, slug, title, summary, source_task_id,
                NULL::BIGINT AS published_research_id,
                content_sha256, published_at AS created_at, updated_at,
                OCTET_LENGTH(markdown) AS markdown_size
           FROM research_documents
          WHERE status = 'private'
          ORDER BY updated_at DESC, id DESC
          LIMIT 200`
    );
    return rows.map(row => privateReportFromRow(row, false));
}

async function getPrivateReport(slug) {
    const { rows } = await db.query(
        `SELECT id, slug, title, summary, markdown, source_task_id,
                NULL::BIGINT AS published_research_id,
                content_sha256, published_at AS created_at, updated_at
           FROM research_documents
          WHERE slug = $1 AND status = 'private'
          LIMIT 1`,
        [slug]
    );
    return privateReportFromRow(rows[0], true);
}

async function renderResearch(res, { filename, slug, pagePath, data, seriesNav = null }) {
    const markdown = researchMarkdown(data);
    const title = data.title || titleFromMarkdown(markdown, slug.replace(/_/g, ' '));
    const descriptionSource = markdown || data.summary || data.excerpt || data.html_body || data.htmlBody || '';
    const pageDescription = seo.excerpt(descriptionSource, 160);

    // Cross-link CommuLingo entities: first occurrence of each known person /
    // history-event name becomes a dictionary link, and the found entities feed
    // the related-entries panel under the body. Failure only costs the links.
    let htmlBody = researchHtmlBody(
        data, markdown, await publishedReportSlugs(res.locals.lang === 'en' ? 'en' : 'ko')
    );
    let relatedPeople = [];
    let relatedEvents = [];
    let relatedTopics = [];
    let relatedTerms = [];
    let relatedDocs = [];
    try {
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        const linked = linkifyReportHtml(htmlBody, await getReportLinkContext(lang));
        htmlBody = linked.html;
        relatedPeople = linked.people;
        relatedEvents = linked.events;
        relatedTopics = linked.topics;
        relatedTerms = linked.terms;
        relatedDocs = linked.docs;
    } catch (e) {
        console.error('Error linking commulingo entities:', e);
    }

    return res.render('public/research-view', {
        filename,
        isPrivate: Boolean(data.private),
        markdown: stripFirstHeading(markdown),
        htmlBody,
        relatedPeople,
        relatedEvents,
        relatedTopics,
        relatedTerms,
        relatedDocs,
        markdownUrl: `${pagePath}.md`,
        seriesNav,
        pageTitle: title,
        pageDescription,
        pagePath,
        robotsMeta: data.private ? 'noindex, nofollow' : undefined,
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

function researchSeriesIdentity(item) {
    const episode = Number(item && item.series_order);
    if (!item || !item.series_slug || !Number.isInteger(episode) || episode < 1) return null;
    return {
        episode,
        label: item.series_title || item.series_slug,
        key: item.series_slug,
    };
}

function buildResearchSeriesNav({ current, items, lang }) {
    const currentIdentity = researchSeriesIdentity(current);
    if (!currentIdentity) return null;

    const seriesItems = (items || [])
        .map(item => {
            const identity = researchSeriesIdentity(item);
            if (!identity || identity.key !== currentIdentity.key) return null;
            const slug = item.slug || String(item.filename || '').replace(/\.md$/, '');
            return {
                title: item.title || slug.replace(/[-_]+/g, ' '),
                href: `/reports/research/${slug}`,
                episode: identity.episode,
                modified: (item.modified_at || 0) * 1000,
                current: slug === current.slug,
            };
        })
        .filter(Boolean)
        .sort((a, b) => (a.episode - b.episode) || (a.modified - b.modified) || a.title.localeCompare(b.title, lang));

    if (seriesItems.length < 2 || !seriesItems.some(item => item.current)) return null;

    const currentIndex = seriesItems.findIndex(item => item.current);
    return {
        title: currentIdentity.label || (lang === 'en' ? 'Series' : '연재'),
        items: seriesItems,
        previous: currentIndex > 0 ? seriesItems[currentIndex - 1] : null,
        next: currentIndex < seriesItems.length - 1 ? seriesItems[currentIndex + 1] : null,
    };
}

// The full published list, from Redis when it is warm (10 minute TTL, shared
// with the listing page) and from the database otherwise. Three call sites want
// it: the series nav, the listing, and the slug set below.
async function cachedResearchList(lang) {
    const cached = await cache.getResearchList(lang);
    if (cached) return cached;
    const items = await researchStore.listResearch(lang);
    await cache.setResearchList(items, lang);
    return items;
}

// Slugs a report may link to. Reports reference their predecessors by slug and
// slugs get renamed or never published, so the renderer checks against this
// before emitting an anchor. Undefined when the list cannot be loaded, which
// leaves the links exactly as written.
async function publishedReportSlugs(lang) {
    try {
        const items = await cachedResearchList(lang);
        const slugs = new Set();
        (items || []).forEach(item => {
            if (!item) return;
            // Links in the corpus use either form, and the route resolves both.
            if (item.slug) slugs.add(String(item.slug).replace(/\.md$/, ''));
            if (item.filename) slugs.add(String(item.filename).replace(/\.md$/, ''));
        });
        return slugs;
    } catch (err) {
        console.error('[reports] published slug list failed:', err.message);
        return undefined;
    }
}

async function researchSeriesNavFor(current, lang) {
    return buildResearchSeriesNav({ current, items: await cachedResearchList(lang), lang });
}

// POST /cache/clear — manual cache purge
router.post('/cache/clear', async (req, res) => {
    if (!req.session.isAuthenticated) return res.status(403).send('Forbidden');
    await cache.clearAll();
    res.json({ cleared: true });
});

router.get(['/private', '/admin/private-reports'], (req, res) => {
    res.redirect('/reports');
});

// 리포트 목록 — public: research only. admin: research + task reports.
router.get('/', async (req, res) => {
    const isAdmin = !!req.session.adminUser;
    const currentPage = clampInteger(req.query.page, { fallback: 1, min: 1, max: 1000 });
    const pagePath = currentPage > 1 ? `/reports?page=${currentPage}` : '/reports';
    try {
        const offset = (currentPage - 1) * REPORTS_PER_PAGE;

        // Task reports — admin-only. Skip the entire fetch (and cache) for public viewers.
        let taskData = {
            reports: [], currentPage: 1, totalPages: 0, paginationBase: '/reports?page='
        };
        if (isAdmin) {
            try {
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
            } catch (e) {
                console.error('Error loading task reports:', e);
            }
        }

        // Fetch research list directly from the shared database. Title/excerpt are returned
        // with the row, so no per-document request is needed.
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        let researchFiles = [];
        try {
            researchFiles = await cachedResearchList(lang);
        } catch (e) {
            console.error('Error loading research list:', e);
        }

        let privateReports = [];
        if (isAdmin) {
            try {
                privateReports = await listPrivateReports();
            } catch (e) {
                console.error('Error loading private reports:', e);
            }
        }

        // Fetch static-pages list (with cache)
        let pagesList = await cache.getPagesList(lang);
        if (!pagesList) {
            pagesList = [];
            try {
                pagesList = await pageStore.listPages(lang);
                await cache.setPagesList(pagesList, lang);
            } catch (e) {
                console.error('Error loading pages list:', e);
            }
        }

        // Unified research-tab feed: research files + static pages, sorted by date desc.
        // `summary` is the unified preview field — the EJS template clamps it to 3 lines via CSS.
        const researchItems = [
            ...privateReports.map(r => ({
                type: 'private',
                title: r.title || r.slug,
                href: `/reports/private/${r.slug}`,
                modified: (r.modified_at || 0) * 1000,
                size: r.size,
                summary: r.excerpt,
                private: true,
            })),
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
            robotsMeta: isAdmin ? 'noindex, nofollow' : undefined,
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
        let seriesNav = null;

        // Check file cache
        const cached = await cache.getResearch(filename, lang);
        if (cached && (researchMarkdown(cached) || cached.html_body || cached.htmlBody)) {
            if (wantsMarkdown) {
                const cachedMarkdown = researchMarkdown(cached);
                if (!cachedMarkdown) {
                    return errorPage.notFound(res, { message: '마크다운 원문을 찾을 수 없습니다.', backHref: '/reports', backLabel: '목록으로' });
                }
                res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
                return res.type('text/markdown; charset=utf-8').send(cachedMarkdown);
            }
            const cachedMarkdown = researchMarkdown(cached);
            const cachedTitle = cached.title || titleFromMarkdown(cachedMarkdown, slug.replace(/_/g, ' '));
            seriesNav = await researchSeriesNavFor({ filename, slug, title: cachedTitle, ...cached }, lang);
            return await renderResearch(res, {
                filename,
                slug,
                pagePath,
                data: { ...cached, title: cachedTitle },
                seriesNav,
            });
        }

        const data = await researchStore.getResearch(filename, lang);
        if (!data) {
            return errorPage.notFound(res, { message: '리서치를 찾을 수 없습니다.', backHref: '/reports', backLabel: '목록으로' });
        }

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
            series_slug: data.series_slug || '',
            series_title: data.series_title || '',
            series_order: data.series_order || null,
        }, lang);
        seriesNav = await researchSeriesNavFor({ filename, slug, title, ...data }, lang);

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
            return errorPage.notFound(res, { message: '리포트를 찾을 수 없습니다.', backHref: '/reports', backLabel: '목록으로' });
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
        errorPage.serverError(res, { message: '리포트를 불러올 수 없습니다.', backHref: '/reports', backLabel: '목록으로' });
    }
});

module.exports = router;
