const express = require('express');
const router = express.Router();
const db = require('../config/database');
const paginationHelper = require('../config/paginationHelper');

const POSTS_PER_PAGE = 20;

// Homepage - List all posts with pagination
router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * POSTS_PER_PAGE;

        // 총 게시물 수 조회
        const { rows: countResult } = await db.query('SELECT COUNT(*) as count FROM posts');
        const totalPosts = parseInt(countResult[0].count);
        const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

        // 게시물 목록 조회 (페이지네이션 적용)
        const { rows: posts } = await db.query(
            'SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [POSTS_PER_PAGE, offset]
        );

        res.render('public/index', {
            posts,
            currentPage,
            totalPages,
            paginationBase: '/?page='
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.render('public/index', { posts: [], currentPage: 1, totalPages: 0 });
    }
});

// Chat page
router.get('/chat', (req, res) => {
    res.render('public/chat', {
        chatApiUrl: process.env.CHAT_API_URL || 'https://cyber-lenin-api.onrender.com'
    });
});

// Single post view
router.get('/post/:id', async (req, res) => {
    try {
        const { rows: posts } = await db.query(
            'SELECT * FROM posts WHERE id = $1',
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
