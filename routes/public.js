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

        // 단일 쿼리로 게시물 + 총 개수 조회
        const { rows } = await db.query(
            'SELECT id, title, content, created_at, COUNT(*) OVER() AS total_count FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [POSTS_PER_PAGE, offset]
        );

        const totalPosts = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
        const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
        const posts = rows.map(({ total_count, ...post }) => post);

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
        chatApiUrl: '/api/proxy'
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

        const post = posts[0];

        // 이전 글 (더 오래된 글) / 다음 글 (더 새로운 글) 조회
        // AND id != $2: JS Date의 밀리초 정밀도와 PostgreSQL 마이크로초 정밀도 차이로 자기 자신이 매칭되는 것을 방지
        const [prevResult, nextResult] = await Promise.all([
            db.query('SELECT id FROM posts WHERE created_at < $1 AND id != $2 ORDER BY created_at DESC LIMIT 1', [post.created_at, post.id]),
            db.query('SELECT id FROM posts WHERE created_at > $1 AND id != $2 ORDER BY created_at ASC LIMIT 1', [post.created_at, post.id])
        ]);

        const prevId = prevResult.rows.length > 0 ? prevResult.rows[0].id : null;
        const nextId = nextResult.rows.length > 0 ? nextResult.rows[0].id : null;

        res.render('public/post', { post, prevId, nextId });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).render('layouts/main', {
            title: 'Error',
            body: '<div class="box"><h1>Error</h1><p>Could not load post.</p><a href="/">Go back home</a></div>'
        });
    }
});

module.exports = router;
