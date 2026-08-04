const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isConnectionError } = require('../config/database');
const { requireAuth, redirectIfAuthenticated } = require('../middleware/auth');
const postCache = require('../config/post-cache');
const diaryCache = require('../config/diary-cache');
const reportCache = require('../config/report-cache');
const { fetchWithTimeout, clampInteger } = require('../utils/http');
const { CHAT_API_URL, leninbotAdminHeaders } = require('../config/services');
const { adminApiLimiter } = require('../middleware/rate-limit');

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

// User account management
router.get('/users', requireAuth, (req, res) => {
    res.render('admin/users');
});

// CommuLingo reference documents (참고 문헌) manager
router.get('/commulingo-docs', requireAuth, (req, res) => {
    res.render('admin/commulingo-docs');
});

// Private reports shell
router.get('/private-reports', requireAuth, (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.render('admin/private-reports');
});

// ── LeninBot admin API proxies ─────────────────────────────────────────
// Validation happens per handler; the shared part is fetch → status
// passthrough → 502. passErrorJson forwards the upstream error body (the
// mutating endpoints return actionable messages); the read endpoints keep
// their opaque shape.
async function proxyLeninbot(res, path, { method, body, timeoutMs = 6000, passErrorJson = false, logLabel, failMessage }) {
    try {
        const options = {
            method,
            headers: leninbotAdminHeaders(body ? { 'Content-Type': 'application/json' } : {}),
            timeoutMs,
        };
        if (body) options.body = JSON.stringify(body);
        const response = await fetchWithTimeout(`${CHAT_API_URL}${path}`, options);
        if (passErrorJson) {
            const data = await response.json().catch(() => ({}));
            return res.status(response.ok ? 200 : response.status).json(data);
        }
        if (!response.ok) return res.status(response.status).json({ error: 'LeninBot API error' });
        return res.json(await response.json());
    } catch (err) {
        console.error(`${logLabel} proxy error:`, err.message);
        return res.status(502).json({ error: failMessage });
    }
}

// Chat Logs API proxy — forwards to LeninBot with admin key
router.get('/api/logs', requireAuth, adminApiLimiter, (req, res) => {
    const limit = clampInteger(req.query.limit, { fallback: 50, min: 1, max: 200 });
    const offset = clampInteger(req.query.offset, { fallback: 0, min: 0, max: 100000 });
    return proxyLeninbot(res, `/logs?limit=${limit}&offset=${offset}`, {
        timeoutMs: 5000, logLabel: 'Chat logs', failMessage: 'Failed to fetch logs from LeninBot',
    });
});

// User account API proxies — forward to LeninBot with admin key.
router.get('/api/users', requireAuth, adminApiLimiter, (req, res) => {
    const limit = clampInteger(req.query.limit, { fallback: 50, min: 1, max: 200 });
    const offset = clampInteger(req.query.offset, { fallback: 0, min: 0, max: 100000 });
    const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 80) : '';
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search) params.set('search', search);
    return proxyLeninbot(res, `/admin/users?${params.toString()}`, {
        logLabel: 'Users', failMessage: 'Failed to fetch users from LeninBot',
    });
});

router.get('/api/users/:id', requireAuth, adminApiLimiter, (req, res) => {
    const userId = clampInteger(req.params.id, { fallback: 0, min: 0, max: 2147483647 });
    if (!userId) return res.status(400).json({ error: 'invalid user id' });
    return proxyLeninbot(res, `/admin/users/${userId}`, {
        logLabel: 'User detail', failMessage: 'Failed to fetch user from LeninBot',
    });
});

router.patch('/api/users/:id', requireAuth, adminApiLimiter, (req, res) => {
    const userId = clampInteger(req.params.id, { fallback: 0, min: 0, max: 2147483647 });
    if (!userId) return res.status(400).json({ error: 'invalid user id' });
    return proxyLeninbot(res, `/admin/users/${userId}`, {
        method: 'PATCH', body: { username: req.body && req.body.username }, passErrorJson: true,
        logLabel: 'User rename', failMessage: 'Failed to rename user',
    });
});

router.post('/api/users/:id/merge', requireAuth, adminApiLimiter, (req, res) => {
    const sourceId = clampInteger(req.params.id, { fallback: 0, min: 0, max: 2147483647 });
    const targetUserId = clampInteger(req.body && req.body.targetUserId, { fallback: 0, min: 1, max: 2147483647 });
    if (!sourceId || !targetUserId) return res.status(400).json({ error: 'invalid user id' });
    return proxyLeninbot(res, `/admin/users/${sourceId}/merge`, {
        method: 'POST', body: { target_user_id: targetUserId }, passErrorJson: true,
        logLabel: 'User merge', failMessage: 'Failed to merge user',
    });
});

router.delete('/api/users/:id', requireAuth, adminApiLimiter, (req, res) => {
    const userId = clampInteger(req.params.id, { fallback: 0, min: 0, max: 2147483647 });
    const confirmUsername = typeof req.body?.confirmUsername === 'string' ? req.body.confirmUsername.trim() : '';
    if (!userId || !confirmUsername) return res.status(400).json({ error: 'invalid delete confirmation' });
    const params = new URLSearchParams({ confirm_username: confirmUsername });
    return proxyLeninbot(res, `/admin/users/${userId}?${params.toString()}`, {
        method: 'DELETE', passErrorJson: true,
        logLabel: 'User delete', failMessage: 'Failed to delete user',
    });
});

module.exports = router;
