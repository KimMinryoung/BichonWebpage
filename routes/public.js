const express = require('express');
const router = express.Router();
const db = require('../config/database');
const paginationHelper = require('../config/paginationHelper');
const cache = require('../config/post-cache');

const POSTS_PER_PAGE = 20;

// Homepage - List all posts with pagination
router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const cacheKey = `page:${currentPage}`;

        // Check index cache
        const cached = cache.getIndex();
        if (cached && cached[cacheKey]) {
            return res.render('public/index', cached[cacheKey]);
        }

        const offset = (currentPage - 1) * POSTS_PER_PAGE;

        const { rows } = await db.query(
            'SELECT id, title, content, created_at, COUNT(*) OVER() AS total_count FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [POSTS_PER_PAGE, offset]
        );

        const totalPosts = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
        const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
        const posts = rows.map(({ total_count, ...post }) => post);

        // Cache individual posts
        for (const p of posts) {
            cache.setEntry(p);
        }

        const pageData = { posts, currentPage, totalPages, paginationBase: '/?page=', pagePath: currentPage > 1 ? `/?page=${currentPage}` : '/' };

        // Cache index
        const indexData = cached || {};
        indexData[cacheKey] = pageData;
        cache.setIndex(indexData);

        res.render('public/index', pageData);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.render('public/index', { posts: [], currentPage: 1, totalPages: 0 });
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
        let post = cache.getEntry(id);
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
            cache.setEntry(post);
        }

        // prev/next navigation
        const [prevResult, nextResult] = await Promise.all([
            db.query('SELECT id FROM posts WHERE created_at < $1 AND id != $2 ORDER BY created_at DESC LIMIT 1', [post.created_at, post.id]),
            db.query('SELECT id FROM posts WHERE created_at > $1 AND id != $2 ORDER BY created_at ASC LIMIT 1', [post.created_at, post.id])
        ]);

        const prevId = prevResult.rows.length > 0 ? prevResult.rows[0].id : null;
        const nextId = nextResult.rows.length > 0 ? nextResult.rows[0].id : null;

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
        const { rows } = await db.query(
            'SELECT id, created_at FROM posts ORDER BY created_at DESC'
        );
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        xml += '  <url><loc>https://cyber-lenin.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n';
        xml += '  <url><loc>https://cyber-lenin.com/chat</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n';
        xml += '  <url><loc>https://cyber-lenin.com/reports</loc><changefreq>daily</changefreq><priority>0.7</priority></url>\n';
        for (const post of rows) {
            const date = new Date(post.created_at).toISOString().split('T')[0];
            xml += `  <url><loc>https://cyber-lenin.com/post/${post.id}</loc><lastmod>${date}</lastmod><priority>0.8</priority></url>\n`;
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
        const { rows } = await db.query(
            'SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC LIMIT 20'
        );
        const updated = rows.length > 0 ? new Date(rows[0].created_at).toISOString() : new Date().toISOString();
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<feed xmlns="http://www.w3.org/2005/Atom">\n';
        xml += '  <title>Cyber-Lenin</title>\n';
        xml += '  <link href="https://cyber-lenin.com/" rel="alternate"/>\n';
        xml += '  <link href="https://cyber-lenin.com/atom.xml" rel="self"/>\n';
        xml += '  <id>https://cyber-lenin.com/</id>\n';
        xml += `  <updated>${updated}</updated>\n`;
        for (const post of rows) {
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

// /research → redirect to reports page
router.get('/research', (req, res) => {
    res.redirect(301, '/reports');
});

module.exports = router;
