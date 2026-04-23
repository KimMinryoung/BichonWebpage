const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isConnectionError } = require('../config/database');
const { requireAuth, redirectIfAuthenticated } = require('../middleware/auth');
const postCache = require('../config/post-cache');
const diaryCache = require('../config/diary-cache');
const reportCache = require('../config/report-cache');

// Login page (Passkey ceremony happens entirely client-side; see routes/webauthn.js)
router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('admin/login');
});

// Passkey management page
router.get('/passkeys', requireAuth, (req, res) => {
    res.render('admin/passkeys');
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

// Clear all caches
router.post('/cache/clear', requireAuth, async (req, res) => {
    await Promise.all([postCache.clearAll(), diaryCache.clearAll(), reportCache.clearAll()]);
    res.json({ cleared: true });
});

// Dashboard
router.get('/', requireAuth, async (req, res) => {
    try {
        const { rows: totalResult } = await db.query('SELECT COUNT(*) as count FROM posts');

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { rows: recentResult } = await db.query(
            'SELECT COUNT(*) as count FROM posts WHERE created_at >= $1',
            [startOfMonth]
        );

        const { rows: recentPosts } = await db.query(
            'SELECT id, title, created_at FROM posts ORDER BY created_at DESC LIMIT 5'
        );

        res.render('admin/dashboard', {
            stats: {
                totalPosts: totalResult[0].count,
                recentPosts: recentResult[0].count
            },
            recentPosts
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('admin/dashboard', {
            stats: { totalPosts: 0, recentPosts: 0 },
            recentPosts: []
        });
    }
});

// Posts management
router.get('/posts', requireAuth, async (req, res) => {
    try {
        const { rows: posts } = await db.query(
            'SELECT * FROM posts ORDER BY created_at DESC'
        );
        res.render('admin/posts', {
            posts,
            message: req.query.message,
            messageType: req.query.type || 'success'
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.render('admin/posts', { posts: [], message: null });
    }
});

// New post form
router.get('/posts/new', requireAuth, (req, res) => {
    res.render('admin/edit-post', { isEdit: false, post: null, error: null });
});

// Create new post
router.post('/posts/new', requireAuth, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.render('admin/edit-post', {
            isEdit: false,
            post: { title, content },
            error: 'Title and content are required'
        });
    }

    try {
        // Prevent duplicate: skip if identical post was created within the last 30 seconds
        const { rows: existing } = await db.query(
            'SELECT id FROM posts WHERE title = $1 AND content = $2 AND created_at > NOW() - INTERVAL \'30 seconds\'',
            [title, content]
        );
        if (existing.length > 0) {
            return res.redirect('/admin/posts?message=Post created successfully');
        }

        await db.query(
            'INSERT INTO posts (title, content) VALUES ($1, $2)',
            [title, content]
        );
        await postCache.invalidateIndex();
        res.redirect('/admin/posts?message=Post created successfully');
    } catch (error) {
        if (isConnectionError(error)) {
            console.error('[DB Connection Failed] Create Post - Database connection failed:', error.message);
            console.error('[DB Connection Failed] Create Post - Error code:', error.code);
        } else {
            console.error('Error creating post:', error);
        }
        res.render('admin/edit-post', {
            isEdit: false,
            post: { title, content },
            error: 'Failed to create post'
        });
    }
});

// Edit post form
router.get('/posts/edit/:id', requireAuth, async (req, res) => {
    try {
        const { rows: posts } = await db.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);

        if (posts.length === 0) {
            return res.redirect('/admin/posts?message=Post not found&type=error');
        }

        res.render('admin/edit-post', { isEdit: true, post: posts[0], error: null });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.redirect('/admin/posts?message=Error loading post&type=error');
    }
});

// Update post
router.post('/posts/edit/:id', requireAuth, async (req, res) => {
    const { title, content } = req.body;
    const postId = req.params.id;

    if (!title || !content) {
        return res.render('admin/edit-post', {
            isEdit: true,
            post: { id: postId, title, content },
            error: 'Title and content are required'
        });
    }

    try {
        const result = await db.query(
            'UPDATE posts SET title = $1, content = $2 WHERE id = $3',
            [title, content, postId]
        );

        if (result.rowCount === 0) {
            return res.redirect('/admin/posts?message=Post not found&type=error');
        }

        await postCache.deleteEntry(parseInt(postId));
        res.redirect('/post/' + postId);
    } catch (error) {
        if (isConnectionError(error)) {
            console.error('[DB Connection Failed] Update Post - Database connection failed:', error.message);
            console.error('[DB Connection Failed] Update Post - Error code:', error.code);
        } else {
            console.error('Error updating post:', error);
        }
        res.render('admin/edit-post', {
            isEdit: true,
            post: { id: postId, title, content },
            error: 'Failed to update post'
        });
    }
});

// Delete post
router.post('/posts/delete/:id', requireAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.query('DELETE FROM posts WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.redirect('/admin/posts?message=Post not found&type=error');
        }

        await postCache.deleteEntry(id);
        res.redirect('/admin/posts?message=Post deleted successfully');
    } catch (error) {
        console.error('Error deleting post:', error);
        res.redirect('/admin/posts?message=Failed to delete post&type=error');
    }
});

// Chat Logs
router.get('/chat-logs', requireAuth, (req, res) => {
    res.render('admin/chat-logs');
});

// Chat Logs API proxy — forwards to LeninBot with admin key
router.get('/api/logs', requireAuth, async (req, res) => {
    const apiUrl = process.env.CHAT_API_URL || 'https://leninbot.duckdns.org';
    const adminKey = process.env.LENINBOT_ADMIN_KEY || '';
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const response = await fetch(
            `${apiUrl}/logs?limit=${limit}&offset=${offset}`,
            { headers: { 'X-Admin-Key': adminKey } }
        );
        if (!response.ok) {
            return res.status(response.status).json({ error: 'LeninBot API error' });
        }
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Chat logs proxy error:', err.message);
        res.status(502).json({ error: 'Failed to fetch logs from LeninBot' });
    }
});

// Story Editor
router.get('/story-editor', requireAuth, (req, res) => {
    res.render('admin/story-editor', {
        title: 'Story Editor',
        adminUser: req.session.adminUser
    });
});

module.exports = router;
