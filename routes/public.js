const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../config/database');
const redis = require('../config/redis');
const cache = require('../config/post-cache');
const diaryCache = require('../config/diary-cache');
const reportCache = require('../config/report-cache');
const hubStore = require('../config/hub-store');
const researchStore = require('../config/research-store');
const pageStore = require('../config/page-store');
const seo = require('../utils/seo');
const errorPage = require('../utils/error-page');
const { sanitizePost } = require('../utils/sanitize');
const { getReportLinkContext, linkifyReportHtml } = require('../data/commulingo/report-links');
const { loadRecentCommuLingoItems } = require('../services/commulingo-updates');
const { createEntryRoutes, localizedEntry: localizedRecord } = require('./entry-routes');

const POSTS_PER_PAGE = 20;

const RECENT_LIMIT = 4;


async function loadRecentReportItems(lang) {
    const [researchResult, pagesResult] = await Promise.allSettled([
        researchStore.listResearch(lang, { limit: RECENT_LIMIT }),
        (async () => {
            let pages = await reportCache.getPagesList(lang);
            if (!pages) {
                pages = await pageStore.listPages(lang);
                await reportCache.setPagesList(pages, lang);
            }
            return pages;
        })(),
    ]);
    const researchFiles = researchResult.status === 'fulfilled' ? researchResult.value : [];
    const pagesList = pagesResult.status === 'fulfilled' ? pagesResult.value : [];

    return [
        ...researchFiles.map(file => ({
            title: file.title || file.filename.replace(/\.md$/, '').replace(/_/g, ' '),
            href: `/reports/research/${file.filename.replace(/\.md$/, '')}`,
            modified: (file.modified_at || 0) * 1000,
            summary: file.excerpt,
        })),
        ...pagesList.map(page => ({
            title: page.title,
            href: `/p/${page.slug}`,
            modified: page.updated_at ? new Date(page.updated_at).getTime() : 0,
            summary: page.summary,
        })),
    ].sort((a, b) => b.modified - a.modified).slice(0, RECENT_LIMIT);
}

// Homepage
router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        // Fetch writing and CommuLingo previews in parallel. Each source can
        // fail independently without blanking the rest of the homepage.
        const [postsResult, diariesResult, researchResult, commuLingoResult] = await Promise.allSettled([
            db.query('SELECT id, title, content, title_en, content_en, created_at FROM posts ORDER BY created_at DESC LIMIT $1', [RECENT_LIMIT]),
            db.query('SELECT id, title, content, title_en, content_en, created_at FROM ai_diary ORDER BY created_at DESC LIMIT $1', [RECENT_LIMIT]),
            (async () => {
                return loadRecentReportItems(lang);
            })(),
            loadRecentCommuLingoItems(lang, RECENT_LIMIT),
        ]);

        const recentPosts = postsResult.status === 'fulfilled' ? postsResult.value.rows.map(row => localizedRecord(row, lang)) : [];
        const recentDiaries = diariesResult.status === 'fulfilled' ? diariesResult.value.rows.map(row => localizedRecord(row, lang)) : [];
        const recentResearch = researchResult.status === 'fulfilled' ? researchResult.value : [];
        // Curations stay linked from the home menu, but their stale preview is
        // temporarily omitted until regular updates resume.
        const recentHub = [];
        const recentCommuLingo = commuLingoResult.status === 'fulfilled' ? commuLingoResult.value : [];

        const indexItems = [
            ...recentPosts.map(post => ({ title: post.title, href: `/post/${post.id}` })),
            ...recentResearch.map(item => ({ title: item.title, href: item.href })),
            ...recentDiaries.map(diary => ({ title: diary.title, href: `/ai-diary/${diary.id}` })),
            ...recentCommuLingo.map(item => ({ title: item.title, href: item.href })),
        ];
        res.render('public/index', {
            recentPosts,
            recentDiaries,
            recentResearch,
            recentHub,
            recentCommuLingo,
            pageTitle: '사이버-레닌과 비숑의 블로그',
            pageDescription: res.locals.strings.homeDescription,
            pagePath: '/',
            jsonLd: seo.itemListJsonLd(indexItems),
        });
    } catch (error) {
        console.error('Error fetching homepage data:', error);
        res.render('public/index', {
            recentPosts: [],
            recentDiaries: [],
            recentResearch: [],
            recentHub: [],
            recentCommuLingo: [],
            pageTitle: '사이버-레닌과 비숑의 블로그',
            pageDescription: res.locals.strings.homeDescription,
            pagePath: '/',
        });
    }
});

// Posts list + detail, built from the shared entry-routes factory (the
// ai-diary router is the same pipeline with different names).
const postRoutes = createEntryRoutes({
    table: 'posts',
    cache,
    perPage: POSTS_PER_PAGE,
    listView: 'public/posts',
    listKey: 'posts',
    listBasePath: '/posts',
    detailView: 'public/post',
    detailKey: 'post',
    detailPathPrefix: '/post/',
    listTitle: res => res.locals.strings.nav.bichonPosts,
    listDescription: res => res.locals.strings.home.postsDesc,
    sanitize: sanitizePost,
    authorName: 'Bichon',
    logLabel: 'posts',
});

router.get('/posts', postRoutes.list);

// Chat page
router.get('/chat', (req, res) => {
    res.render('public/chat', {
        chatApiUrl: '/api/proxy',
        pageTitle: 'Cyber-Lenin',
        pageDescription: '자율 AI 에이전트 사이버-레닌과 대화하는 채팅 페이지입니다.',
        pagePath: '/chat',
    });
});

router.get('/post/:id', postRoutes.detail);

// Public novel pages, backed by the writer API. Reachable only by direct URL:
// intentionally absent from nav, sitemap, and feeds, and served with noindex —
// the only discovery path is the owner sharing the link.
const { WRITER_API_URL } = require('../config/services');

function novelEscapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function novelBodyHtml(body) {
    return body
        .replace(/\r\n/g, '\n')
        .split(/\n{2,}/)
        .map((block) => {
            const trimmed = block.trim();
            if (!trimmed) return '';
            const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed);
            if (heading) {
                const level = heading[1].length + 1; // markdown # → h2..h4
                return `<h${level}>${novelEscapeHtml(heading[2])}</h${level}>`;
            }
            return `<p>${novelEscapeHtml(trimmed).replace(/\n/g, '<br>')}</p>`;
        })
        .filter(Boolean)
        .join('\n');
}

router.get('/novels/:slug', async (req, res) => {
    const slug = req.params.slug;
    if (!/^[A-Za-z0-9_-]{4,64}$/.test(slug)) {
        return errorPage.notFound(res, { robotsMeta: 'noindex, nofollow' });
    }
    try {
        const upstream = await fetch(`${WRITER_API_URL}/writer/public/${slug}`, {
            signal: AbortSignal.timeout(10000),
        });
        if (upstream.status === 404) {
            return errorPage.notFound(res, { robotsMeta: 'noindex, nofollow' });
        }
        if (!upstream.ok) throw new Error(`writer api responded ${upstream.status}`);
        const { novel } = await upstream.json();
        res.set('Cache-Control', 'no-store');
        res.set('X-Robots-Tag', 'noindex, nofollow');
        res.render('public/novel-view', {
            novel,
            bodyHtml: novelBodyHtml(novel.body || ''),
            pageTitle: novel.title,
            pageDescription: seo.excerpt(novel.body || novel.title, 160),
            pagePath: `/novels/${slug}`,
            robotsMeta: 'noindex, nofollow',
        });
    } catch (error) {
        console.error('Error fetching public novel:', error);
        errorPage.serverError(res);
    }
});

// robots.txt
router.get('/robots.txt', (req, res) => {
    res.type('text/plain').send(
        'User-agent: *\n' +
        'Allow: /\n' +
        'Host: cyber-lenin.com\n' +
        'Sitemap: https://cyber-lenin.com/sitemap.xml\n' +
        '# RSS: https://cyber-lenin.com/rss.xml\n' +
        '# Atom: https://cyber-lenin.com/atom.xml\n'
    );
});

async function getResearchFiles(lang = 'ko') {
    let researchFiles = await reportCache.getResearchList(lang);
    if (!researchFiles) {
        researchFiles = await researchStore.listResearch(lang);
        await reportCache.setResearchList(researchFiles, lang);
    }
    return researchFiles || [];
}

async function getPagesList(lang = 'ko') {
    let pagesList = await reportCache.getPagesList(lang);
    if (!pagesList) {
        pagesList = await pageStore.listPages(lang);
        await reportCache.setPagesList(pagesList, lang);
    }
    return pagesList || [];
}

async function getHubItems(limit = 200, lang = 'ko') {
    return hubStore.listHubCurations({ limit, offset: 0, lang });
}

function markdownIndex(title, description, items) {
    const lines = [`# ${title}`, '', description, ''];
    for (const item of items) {
        const suffix = item.date ? ` — ${item.date}` : '';
        lines.push(`- [${item.title}](${item.href})${suffix}`);
    }
    return lines.join('\n') + '\n';
}

async function getFeedItems(limit = 40) {
    const [postsResult, diariesResult, researchResult, hubResult] = await Promise.allSettled([
        db.query('SELECT id, title, content, created_at, updated_at FROM posts ORDER BY created_at DESC LIMIT 30'),
        db.query('SELECT id, title, content, created_at, updated_at FROM ai_diary ORDER BY created_at DESC LIMIT 30'),
        getResearchFiles('ko'),
        getHubItems(30, 'ko'),
    ]);
    const posts = postsResult.status === 'fulfilled' ? postsResult.value.rows.map(post => ({
        title: post.title,
        href: `/post/${post.id}`,
        date: post.updated_at || post.created_at,
        summary: seo.excerpt(post.content || '', 500),
        category: 'Bichon posts',
    })) : [];
    const diaries = diariesResult.status === 'fulfilled' ? diariesResult.value.rows.map(diary => ({
        title: diary.title,
        href: `/ai-diary/${diary.id}`,
        date: diary.updated_at || diary.created_at,
        summary: seo.excerpt(diary.content || '', 500),
        category: 'Cyber-Lenin diaries',
    })) : [];
    const research = researchResult.status === 'fulfilled' ? researchResult.value.map(file => ({
        title: file.title || file.filename.replace(/\.md$/, '').replace(/_/g, ' '),
        href: `/reports/research/${file.filename.replace(/\.md$/, '')}`,
        date: file.modified_at ? new Date(file.modified_at * 1000).toISOString() : null,
        summary: file.excerpt || '',
        category: 'Cyber-Lenin research',
    })) : [];
    const hub = hubResult.status === 'fulfilled' ? hubResult.value.map(item => ({
        title: item.title,
        href: `/hub/${item.slug}`,
        date: item.published_at || null,
        summary: seo.excerpt(`${item.selection_rationale || ''} ${item.context || ''}`, 500),
        category: 'Curations',
    })) : [];

    return [...posts, ...diaries, ...research, ...hub]
        .filter(item => item.title && item.href)
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, limit);
}

// sitemap/rss/atom are pure functions of published content; crawlers hit them
// often and each build runs several unbounded queries, so cache the XML string.
const XML_CACHE_TTL_SECONDS = Number(process.env.FEED_CACHE_TTL_SECONDS || 600);

async function cachedXml(key, build) {
    try {
        if (redis.isReady) {
            const hit = await redis.get(key);
            if (hit) return hit;
        }
    } catch (err) {
        console.warn('[xml-cache] read failed:', err.message);
    }
    const xml = await build();
    try {
        if (redis.isReady && xml) await redis.set(key, xml, { EX: XML_CACHE_TTL_SECONDS });
    } catch (err) {
        console.warn('[xml-cache] write failed:', err.message);
    }
    return xml;
}

// sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
    try {
        const xml = await cachedXml('xmlcache:sitemap', () => buildSitemapXml());
        res.type('application/xml').send(xml);
    } catch (error) {
        console.error('Sitemap error:', error);
        res.status(500).send('');
    }
});

async function buildSitemapXml() {
        const [postsResult, diariesResult, researchResult, pagesResult, hubResult] = await Promise.allSettled([
            db.query('SELECT id, created_at, updated_at FROM posts ORDER BY created_at DESC'),
            db.query('SELECT id, created_at, updated_at FROM ai_diary ORDER BY created_at DESC'),
            getResearchFiles('ko'),
            getPagesList(),
            getHubItems(200, 'ko'),
        ]);
        const posts = postsResult.status === 'fulfilled' ? postsResult.value.rows : [];
        const diaries = diariesResult.status === 'fulfilled' ? diariesResult.value.rows : [];
        const researchFiles = researchResult.status === 'fulfilled' ? researchResult.value : [];
        const pagesList = pagesResult.status === 'fulfilled' ? pagesResult.value : [];
        const hubItems = hubResult.status === 'fulfilled' ? hubResult.value : [];
        const dateTag = value => value ? `<lastmod>${new Date(value).toISOString().split('T')[0]}</lastmod>` : '';
        const url = (path, lastmod, priority = '0.7', changefreq = '') => {
            const freq = changefreq ? `<changefreq>${changefreq}</changefreq>` : '';
            return `  <url><loc>${seo.escapeXml(seo.absoluteUrl(path))}</loc>${dateTag(lastmod)}${freq}<priority>${priority}</priority></url>\n`;
        };
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        xml += url('/', null, '1.0', 'daily');
        xml += url('/posts', null, '0.8', 'daily');
        xml += url('/reports', null, '0.8', 'daily');
        xml += url('/ai-diary', null, '0.7', 'daily');
        xml += url('/hub', null, '0.7', 'daily');
        xml += url('/chat', null, '0.5', 'monthly');
        for (const post of posts) xml += url(`/post/${post.id}`, post.updated_at || post.created_at, '0.8');
        for (const diary of diaries) xml += url(`/ai-diary/${diary.id}`, diary.updated_at || diary.created_at, '0.6');
        for (const f of researchFiles) {
            const slug = f.filename.replace(/\.md$/, '');
            xml += url(`/reports/research/${encodeURIComponent(slug)}`, f.modified_at ? f.modified_at * 1000 : null, '0.8');
        }
        for (const p of pagesList) xml += url(`/p/${encodeURIComponent(p.slug)}`, p.updated_at || null, '0.6');
        for (const item of hubItems) xml += url(`/hub/${encodeURIComponent(item.slug)}`, item.published_at || null, '0.6');
        xml += '</urlset>';
        return xml;
}

router.get('/llms.txt', (req, res) => {
    res.type('text/plain; charset=utf-8').send(
        '# Cyber-Lenin\n\n' +
        'Cyber-Lenin is a Korean/English blog and AI agent site with posts, diaries, research reports, curations, and an interactive chat.\n\n' +
        'Important Markdown indexes:\n' +
        '- Home: https://cyber-lenin.com/index.md\n' +
        '- Bichon posts: https://cyber-lenin.com/posts.md\n' +
        '- Cyber-Lenin research reports: https://cyber-lenin.com/reports.md\n' +
        '- Cyber-Lenin diaries: https://cyber-lenin.com/ai-diary.md\n' +
        '- Curations: https://cyber-lenin.com/hub.md\n\n' +
        'Feeds:\n' +
        '- RSS: https://cyber-lenin.com/rss.xml\n' +
        '- Atom: https://cyber-lenin.com/atom.xml\n\n' +
        'Canonical host: https://cyber-lenin.com\n' +
        'Research report Markdown source is available at /reports/research/{slug}.md or /reports/research/{slug}?format=markdown.\n'
    );
});

router.get('/index.md', async (req, res) => {
    const items = [
        { title: '사이버-레닌과 대화', href: '/chat' },
        { title: '사이버-레닌 보고서', href: '/reports' },
        { title: '사이버-레닌 일기장', href: '/ai-diary' },
        { title: '큐레이션', href: '/hub' },
        { title: '비숑글', href: '/posts' },
    ];
    res.type('text/markdown; charset=utf-8').send(markdownIndex('Cyber-Lenin', res.locals.strings.homeDescription, items));
});

router.get('/posts.md', async (req, res) => {
    const { rows } = await db.query('SELECT id, title, created_at FROM posts ORDER BY created_at DESC LIMIT 200');
    const items = rows.map(post => ({
        title: post.title,
        href: `/post/${post.id}`,
        date: post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : '',
    }));
    res.type('text/markdown; charset=utf-8').send(markdownIndex('비숑글', '비숑이 작성한 블로그 글 목록입니다.', items));
});

router.get('/reports.md', async (req, res) => {
    const lang = res.locals.lang === 'en' ? 'en' : 'ko';
    const files = await getResearchFiles(lang);
    const items = files.map(file => ({
        title: file.title || file.filename.replace(/\.md$/, '').replace(/_/g, ' '),
        href: `/reports/research/${file.filename.replace(/\.md$/, '')}`,
        date: file.modified_at ? new Date(file.modified_at * 1000).toISOString().split('T')[0] : '',
    }));
    res.type('text/markdown; charset=utf-8').send(markdownIndex('사이버-레닌 보고서', '사이버-레닌이 작성한 정세 분석, 기술, AI 주권 연구 보고서 목록입니다.', items));
});

router.get('/ai-diary.md', async (req, res) => {
    const { rows } = await db.query('SELECT id, title, created_at FROM ai_diary ORDER BY created_at DESC LIMIT 200');
    const items = rows.map(diary => ({
        title: diary.title,
        href: `/ai-diary/${diary.id}`,
        date: diary.created_at ? new Date(diary.created_at).toISOString().split('T')[0] : '',
    }));
    res.type('text/markdown; charset=utf-8').send(markdownIndex('사이버-레닌 일기장', '사이버-레닌이 스스로 작성한 일기 목록입니다.', items));
});

router.get('/hub.md', async (req, res) => {
    const hubItems = await getHubItems(200, 'ko');
    const items = hubItems.map(item => ({
        title: item.title,
        href: `/hub/${item.slug}`,
        date: item.published_at ? new Date(item.published_at).toISOString().split('T')[0] : '',
    }));
    res.type('text/markdown; charset=utf-8').send(markdownIndex('큐레이션', '사이버-레닌이 선별한 진보적인 글 목록입니다.', items));
});

router.get('/atom.xml', async (req, res) => {
    try {
        const xml = await cachedXml(`xmlcache:atom:${res.locals.lang}`, () => buildAtomXml(res.locals.strings.siteDescription));
        res.type('application/atom+xml').send(xml);
    } catch (error) {
        console.error('Atom feed error:', error);
        res.status(500).send('');
    }
});

async function buildAtomXml(siteDescription) {
        const items = await getFeedItems();
        const updated = items.length > 0 ? new Date(items[0].date || Date.now()).toISOString() : new Date().toISOString();
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<feed xmlns="http://www.w3.org/2005/Atom">\n';
        xml += '  <title>Cyber-Lenin</title>\n';
        xml += `  <link href="${seo.escapeXml(seo.absoluteUrl('/'))}" rel="alternate"/>\n`;
        xml += `  <link href="${seo.escapeXml(seo.absoluteUrl('/atom.xml'))}" rel="self"/>\n`;
        xml += `  <id>${seo.escapeXml(seo.absoluteUrl('/'))}</id>\n`;
        xml += `  <updated>${updated}</updated>\n`;
        xml += `  <subtitle>${seo.escapeXml(siteDescription)}</subtitle>\n`;
        for (const item of items) {
            const url = seo.absoluteUrl(item.href);
            const date = item.date ? new Date(item.date).toISOString() : updated;
            xml += '  <entry>\n';
            xml += `    <title>${seo.escapeXml(item.title)}</title>\n`;
            xml += `    <link href="${seo.escapeXml(url)}"/>\n`;
            xml += `    <id>${seo.escapeXml(url)}</id>\n`;
            xml += `    <updated>${date}</updated>\n`;
            if (item.category) xml += `    <category term="${seo.escapeXml(item.category)}"/>\n`;
            xml += `    <summary>${seo.escapeXml(item.summary || '')}</summary>\n`;
            xml += '  </entry>\n';
        }
        xml += '</feed>';
        return xml;
}

router.get('/rss.xml', async (req, res) => {
    try {
        const xml = await cachedXml(`xmlcache:rss:${res.locals.lang}`, () => buildRssXml(res.locals.strings.siteDescription));
        res.type('application/rss+xml').send(xml);
    } catch (error) {
        console.error('RSS feed error:', error);
        res.status(500).send('');
    }
});

async function buildRssXml(siteDescription) {
        const items = await getFeedItems();
        const updated = items.length > 0 ? new Date(items[0].date || Date.now()) : new Date();
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
        xml += '  <channel>\n';
        xml += '    <title>Cyber-Lenin</title>\n';
        xml += `    <link>${seo.escapeXml(seo.absoluteUrl('/'))}</link>\n`;
        xml += `    <atom:link href="${seo.escapeXml(seo.absoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml"/>\n`;
        xml += `    <description>${seo.escapeXml(siteDescription)}</description>\n`;
        xml += `    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>\n`;
        xml += '    <language>ko</language>\n';
        for (const item of items) {
            const url = seo.absoluteUrl(item.href);
            const date = item.date ? new Date(item.date) : updated;
            xml += '    <item>\n';
            xml += `      <title>${seo.escapeXml(item.title)}</title>\n`;
            xml += `      <link>${seo.escapeXml(url)}</link>\n`;
            xml += `      <guid isPermaLink="true">${seo.escapeXml(url)}</guid>\n`;
            xml += `      <pubDate>${date.toUTCString()}</pubDate>\n`;
            if (item.category) xml += `      <category>${seo.escapeXml(item.category)}</category>\n`;
            xml += `      <description>${seo.escapeXml(item.summary || '')}</description>\n`;
            xml += '    </item>\n';
        }
        xml += '  </channel>\n';
        xml += '</rss>';
        return xml;
}

// Standalone HTML embeds used inside post iframes (served with relaxed CSP)
router.get('/posts-embed/:filename', (req, res) => {
    const filename = req.params.filename;
    if (!/^[A-Za-z0-9_\-]+\.html$/.test(filename)) {
        return res.status(404).type('text').send('Not found');
    }
    const filePath = path.join(__dirname, '..', 'data', 'posts-embed', filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).type('text').send('Not found');
    }
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data:; " +
        "script-src 'none'; " +
        "frame-ancestors 'self'; " +
        "object-src 'none'"
    );
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.type('html').sendFile(filePath);
});

// /research → redirect to reports page
router.get('/research', (req, res) => {
    res.redirect(301, '/reports');
});

module.exports = router;
