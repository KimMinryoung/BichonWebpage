const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { requireAuth, redirectIfAuthenticated } = require('../middleware/auth');

// Login page
router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('admin/login', { error: null });
});

// Login handler
router.post('/login', redirectIfAuthenticated, async (req, res) => {
    const { username, password } = req.body;

    try {
        const { rows: admins } = await db.query(
            'SELECT * FROM admins WHERE username = $1',
            [username]
        );

        if (admins.length === 0) {
            return res.render('admin/login', { error: 'Invalid username or password' });
        }

        const admin = admins[0];

        const validPassword = await bcrypt.compare(password, admin.password_hash);

        if (!validPassword) {
            return res.render('admin/login', { error: 'Invalid username or password' });
        }

        req.session.isAuthenticated = true;
        req.session.adminUser = {
            id: admin.id,
            username: admin.username
        };

        res.redirect('/admin');
    } catch (error) {
        console.error('Login error:', error);
        res.render('admin/login', { error: 'An error occurred. Please try again.' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
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
        await db.query(
            'INSERT INTO posts (title, content) VALUES ($1, $2)',
            [title, content]
        );
        res.redirect('/admin/posts?message=Post created successfully');
    } catch (error) {
        console.error('Error creating post:', error);
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

        res.redirect('/admin/posts?message=Post updated successfully');
    } catch (error) {
        console.error('Error updating post:', error);
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
        const result = await db.query('DELETE FROM posts WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.redirect('/admin/posts?message=Post not found&type=error');
        }

        res.redirect('/admin/posts?message=Post deleted successfully');
    } catch (error) {
        console.error('Error deleting post:', error);
        res.redirect('/admin/posts?message=Failed to delete post&type=error');
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
