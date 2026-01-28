const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Homepage - List all posts
router.get('/', async (req, res) => {
    try {
        const [posts] = await db.query(
            'SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC'
        );
        res.render('public/index', { posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.render('public/index', { posts: [] });
    }
});

// Single post view
router.get('/post/:id', async (req, res) => {
    try {
        const [posts] = await db.query(
            'SELECT * FROM posts WHERE id = ?',
            [req.params.id]
        );

        if (posts.length === 0) {
            return res.status(404).render('layouts/main', {
                title: '404 - Post Not Found',
                body: '<div class="box"><h1>404</h1><p>Post not found.</p><a href="/">Go back home</a></div>'
            });
        }

        res.render('public/post', { post: posts[0] });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).render('layouts/main', {
            title: 'Error',
            body: '<div class="box"><h1>Error</h1><p>Could not load post.</p><a href="/">Go back home</a></div>'
        });
    }
});

module.exports = router;
