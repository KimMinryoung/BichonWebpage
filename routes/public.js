const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../config/database');
const paginationHelper = require('../config/paginationHelper');
const cache = require('../config/post-cache');
const diaryCache = require('../config/diary-cache');
const reportCache = require('../config/report-cache');

const POSTS_PER_PAGE = 20;

const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';
const RECENT_LIMIT = 5;

// Homepage
router.get('/', async (req, res) => {
    try {
        // Fetch recent posts, diaries, and research in parallel
        const [postsResult, diariesResult, researchResult] = await Promise.allSettled([
            db.query('SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC LIMIT $1', [RECENT_LIMIT]),
            db.query('SELECT id, title, content, created_at FROM ai_diary ORDER BY created_at DESC LIMIT $1', [RECENT_LIMIT]),
            (async () => {
                let files = await reportCache.getResearchList();
                if (!files) {
                    const response = await fetch(`${CHAT_API_URL}/research`);
                    if (!response.ok) throw new Error(`API ${response.status}`);
                    const data = await response.json();
                    files = (data.files || []).sort((a, b) => b.modified_at - a.modified_at);
                    // Fetch titles for top files
                    await Promise.all(files.slice(0, RECENT_LIMIT).map(async (f) => {
                        const cached = await reportCache.getResearch(f.filename);
                        if (cached && cached.title) { f.title = cached.title; return; }
                        try {
                            const r = await fetch(`${CHAT_API_URL}/research/${encodeURIComponent(f.filename)}`);
                            if (r.ok) {
                                const d = await r.json();
                                const match = (d.content || '').match(/^#\s+(.+)/m);
                                if (match) f.title = match[1];
                                await reportCache.setResearch(f.filename, { content: d.content, title: f.title || f.filename });
                            }
                        } catch (_) {}
                    }));
                    await reportCache.setResearchList(files);
                }
                return files.slice(0, RECENT_LIMIT);
            })()
        ]);

        const recentPosts = postsResult.status === 'fulfilled' ? postsResult.value.rows : [];
        const recentDiaries = diariesResult.status === 'fulfilled' ? diariesResult.value.rows : [];
        const recentResearch = researchResult.status === 'fulfilled' ? researchResult.value : [];

        res.render('public/index', { recentPosts, recentDiaries, recentResearch, pagePath: '/' });
    } catch (error) {
        console.error('Error fetching homepage data:', error);
        res.render('public/index', { recentPosts: [], recentDiaries: [], recentResearch: [] });
    }
});

// Posts list with pagination
router.get('/posts', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const cacheKey = `page:${currentPage}`;

        const cached = await cache.getIndex();
        if (cached && cached[cacheKey]) {
            return res.render('public/posts', cached[cacheKey]);
        }

        const offset = (currentPage - 1) * POSTS_PER_PAGE;
        const { rows } = await db.query(
            'SELECT id, title, content, created_at, COUNT(*) OVER() AS total_count FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [POSTS_PER_PAGE, offset]
        );

        const totalPosts = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
        const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
        const posts = rows.map(({ total_count, ...post }) => post);

        for (const p of posts) {
            await cache.setEntry(p);
        }

        const pageData = { posts, currentPage, totalPages, paginationBase: '/posts?page=', pagePath: currentPage > 1 ? `/posts?page=${currentPage}` : '/posts' };

        const indexData = cached || {};
        indexData[cacheKey] = pageData;
        await cache.setIndex(indexData);

        res.render('public/posts', pageData);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.render('public/posts', { posts: [], currentPage: 1, totalPages: 0 });
    }
});

// Chat page
router.get('/chat', (req, res) => {
    res.render('public/chat', {
        chatApiUrl: '/api/proxy',
        pageTitle: 'Cyber-Lenin',
        pagePath: '/chat',
    });
});

// Single post view
router.get('/post/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Check entry cache
        let post = await cache.getEntry(id);
        if (!post) {
            const { rows: posts } = await db.query(
                'SELECT * FROM posts WHERE id = $1', [id]
            );

            if (posts.length === 0) {
                return res.status(404).render('layouts/main', {
                    title: '404 - Post Not Found',
                    body: '<div class="box"><h1>404</h1><p>Post not found.</p><a href="/">Go back home</a></div>'
                });
            }

            post = posts[0];
            await cache.setEntry(post);
        }

        // prev/next navigation from cached sorted ID list
        let nav = await cache.getNav();
        if (!nav) {
            const { rows } = await db.query('SELECT id FROM posts ORDER BY created_at DESC');
            nav = rows.map(r => r.id);
            await cache.setNav(nav);
        }
        const idx = nav.indexOf(id);
        const prevId = idx >= 0 && idx < nav.length - 1 ? nav[idx + 1] : null;
        const nextId = idx > 0 ? nav[idx - 1] : null;

        const plainText = post.content.replace(/<[^>]*>/g, '').substring(0, 160);
        res.render('public/post', { post, prevId, nextId, pageTitle: post.title, pageDescription: plainText, pagePath: `/post/${post.id}` });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).render('layouts/main', {
            title: 'Error',
            body: '<div class="box"><h1>Error</h1><p>Could not load post.</p><a href="/">Go back home</a></div>'
        });
    }
});

// robots.txt
router.get('/robots.txt', (req, res) => {
    res.type('text/plain').send(
        'User-agent: *\n' +
        'Allow: /\n' +
        'Sitemap: https://cyber-lenin.com/sitemap.xml\n'
    );
});

// sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
    try {
        // Use nav cache for ID lists, fall back to DB
        let postNav = await cache.getNav();
        if (!postNav) {
            const { rows } = await db.query('SELECT id FROM posts ORDER BY created_at DESC');
            postNav = rows.map(r => r.id);
            await cache.setNav(postNav);
        }
        let diaryNav = await diaryCache.getNav();
        if (!diaryNav) {
            const { rows } = await db.query('SELECT id FROM ai_diary ORDER BY created_at DESC');
            diaryNav = rows.map(r => r.id);
            await diaryCache.setNav(diaryNav);
        }

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        xml += '  <url><loc>https://cyber-lenin.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n';
        xml += '  <url><loc>https://cyber-lenin.com/chat</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n';
        xml += '  <url><loc>https://cyber-lenin.com/reports</loc><changefreq>daily</changefreq><priority>0.7</priority></url>\n';
        xml += '  <url><loc>https://cyber-lenin.com/ai-diary</loc><changefreq>daily</changefreq><priority>0.7</priority></url>\n';
        for (const id of postNav) {
            const entry = await cache.getEntry(id);
            const date = entry?.created_at ? new Date(entry.created_at).toISOString().split('T')[0] : '';
            xml += `  <url><loc>https://cyber-lenin.com/post/${id}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}<priority>0.8</priority></url>\n`;
        }
        for (const id of diaryNav) {
            const entry = await diaryCache.getEntry(id);
            const date = entry?.created_at ? new Date(entry.created_at).toISOString().split('T')[0] : '';
            xml += `  <url><loc>https://cyber-lenin.com/ai-diary/${id}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}<priority>0.6</priority></url>\n`;
        }
        // Research files
        let researchFiles = await reportCache.getResearchList();
        if (!researchFiles) {
            try {
                const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';
                const rRes = await fetch(`${CHAT_API_URL}/research`);
                if (rRes.ok) {
                    const rData = await rRes.json();
                    researchFiles = (rData.files || []).sort((a, b) => b.modified_at - a.modified_at);
                    await reportCache.setResearchList(researchFiles);
                }
            } catch {}
        }
        if (researchFiles) {
            for (const f of researchFiles) {
                const date = f.modified_at ? new Date(f.modified_at * 1000).toISOString().split('T')[0] : '';
                const slug = f.filename.replace(/\.md$/, '');
                xml += `  <url><loc>https://cyber-lenin.com/reports/research/${encodeURIComponent(slug)}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}<priority>0.7</priority></url>\n`;
            }
        }
        xml += '</urlset>';
        res.type('application/xml').send(xml);
    } catch (error) {
        console.error('Sitemap error:', error);
        res.status(500).send('');
    }
});

// atom.xml (RSS feed)
router.get('/atom.xml', async (req, res) => {
    try {
        let postNav = await cache.getNav();
        if (!postNav) {
            const { rows } = await db.query('SELECT id FROM posts ORDER BY created_at DESC');
            postNav = rows.map(r => r.id);
            await cache.setNav(postNav);
        }
        const recentIds = postNav.slice(0, 20);
        const posts = (await Promise.all(recentIds.map(id => cache.getEntry(id)))).filter(Boolean);
        const updated = posts.length > 0 ? new Date(posts[0].created_at).toISOString() : new Date().toISOString();
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<feed xmlns="http://www.w3.org/2005/Atom">\n';
        xml += '  <title>Cyber-Lenin</title>\n';
        xml += '  <link href="https://cyber-lenin.com/" rel="alternate"/>\n';
        xml += '  <link href="https://cyber-lenin.com/atom.xml" rel="self"/>\n';
        xml += '  <id>https://cyber-lenin.com/</id>\n';
        xml += `  <updated>${updated}</updated>\n`;
        for (const post of posts) {
            const date = new Date(post.created_at).toISOString();
            const snippet = (post.content || '').replace(/<[^>]*>/g, '').substring(0, 500);
            xml += '  <entry>\n';
            xml += `    <title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</title>\n`;
            xml += `    <link href="https://cyber-lenin.com/post/${post.id}"/>\n`;
            xml += `    <id>https://cyber-lenin.com/post/${post.id}</id>\n`;
            xml += `    <updated>${date}</updated>\n`;
            xml += `    <summary>${snippet.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</summary>\n`;
            xml += '  </entry>\n';
        }
        xml += '</feed>';
        res.type('application/atom+xml').send(xml);
    } catch (error) {
        console.error('Atom feed error:', error);
        res.status(500).send('');
    }
});

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
