// Passkey (WebAuthn) ceremony routes, mounted under /admin/webauthn.
// IP whitelist + CSRF are enforced by middleware already wired in server.js.

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const {
    buildRegistrationOptions,
    confirmRegistration,
    buildAuthenticationOptions,
    confirmAuthentication,
    countUsers,
    findOrCreateBootstrapUser,
    listPasskeys,
    deletePasskey,
} = require('../services/webauthn');
const { requireAuth } = require('../middleware/auth');

async function systemHasPasskeys() {
    const { rows } = await db.query('SELECT 1 FROM user_passkeys LIMIT 1');
    return rows.length > 0;
}

async function findAdminWithoutPasskey() {
    const { rows } = await db.query(
        `SELECT u.id, u.username, u.is_admin
           FROM users u
      LEFT JOIN user_passkeys p ON p.user_id = u.id
          WHERE u.is_admin = TRUE AND p.id IS NULL
          ORDER BY u.id ASC
          LIMIT 1`
    );
    return rows[0] || null;
}

// POST /admin/webauthn/register/options
// Auth modes:
//   - session: logged-in user adding a passkey
//   - bootstrap: no passkeys exist in the system yet → IP whitelist is the only gate
router.post('/register/options', async (req, res) => {
    try {
        let targetUser = null;

        if (req.session.isAuthenticated && req.session.adminUser) {
            targetUser = {
                id: req.session.adminUser.id,
                username: req.session.adminUser.username,
            };
        } else if (!(await systemHasPasskeys())) {
            const existingAdmin = await findAdminWithoutPasskey();
            if (existingAdmin) {
                targetUser = existingAdmin;
            } else {
                const requested = (req.body && typeof req.body.username === 'string')
                    ? req.body.username.trim()
                    : '';
                if (!requested) {
                    return res.status(400).json({ error: 'username required for first-time setup' });
                }
                targetUser = await findOrCreateBootstrapUser(requested);
            }
        } else {
            return res.status(401).json({ error: 'authentication required' });
        }

        const options = await buildRegistrationOptions({ user: targetUser, session: req.session });
        res.json(options);
    } catch (err) {
        console.error('register/options error:', err);
        res.status(500).json({ error: 'failed to build registration options' });
    }
});

// POST /admin/webauthn/register/verify
router.post('/register/verify', async (req, res) => {
    try {
        if (!req.session.webauthn || req.session.webauthn.mode !== 'register') {
            return res.status(400).json({ error: 'no pending registration' });
        }

        const deviceName = typeof req.body.deviceName === 'string'
            ? req.body.deviceName.slice(0, 80).trim() || null
            : null;

        const { userId } = await confirmRegistration({
            response: req.body.response,
            session: req.session,
            deviceName,
        });

        // If the user wasn't logged in, log them in now (first passkey = they've proven ownership).
        if (!req.session.isAuthenticated) {
            const { rows } = await db.query(
                'SELECT id, username, is_admin FROM users WHERE id = $1',
                [userId]
            );
            if (rows.length > 0) {
                req.session.regenerate((err) => {
                    if (err) {
                        console.error('session regenerate error:', err);
                        return res.status(500).json({ error: 'session error' });
                    }
                    req.session.isAuthenticated = true;
                    req.session.adminUser = {
                        id: rows[0].id,
                        username: rows[0].username,
                    };
                    res.json({ verified: true, redirect: '/admin' });
                });
                return;
            }
        }
        res.json({ verified: true });
    } catch (err) {
        console.error('register/verify error:', err);
        res.status(400).json({ error: err.message || 'registration failed' });
    }
});

// POST /admin/webauthn/auth/options
router.post('/auth/options', async (req, res) => {
    try {
        const options = await buildAuthenticationOptions({ session: req.session });
        res.json(options);
    } catch (err) {
        console.error('auth/options error:', err);
        res.status(500).json({ error: 'failed to build authentication options' });
    }
});

// POST /admin/webauthn/auth/verify
router.post('/auth/verify', async (req, res) => {
    try {
        const { user } = await confirmAuthentication({
            response: req.body.response,
            session: req.session,
        });

        // Admin-only site for now; enforce until general-user login lands.
        if (!user.isAdmin) {
            return res.status(403).json({ error: 'not an admin account' });
        }

        req.session.regenerate((err) => {
            if (err) {
                console.error('session regenerate error:', err);
                return res.status(500).json({ error: 'session error' });
            }
            req.session.isAuthenticated = true;
            req.session.adminUser = { id: user.id, username: user.username };
            res.json({ verified: true, redirect: '/admin' });
        });
    } catch (err) {
        console.error('auth/verify error:', err);
        res.status(400).json({ error: err.message || 'authentication failed' });
    }
});

// GET /admin/webauthn/passkeys — list for logged-in user
router.get('/passkeys', requireAuth, async (req, res) => {
    try {
        const rows = await listPasskeys(req.session.adminUser.id);
        res.json({ passkeys: rows });
    } catch (err) {
        console.error('list passkeys error:', err);
        res.status(500).json({ error: 'failed to list passkeys' });
    }
});

// POST /admin/webauthn/passkeys/:id/delete
router.post('/passkeys/:id/delete', requireAuth, async (req, res) => {
    try {
        const passkeyId = parseInt(req.params.id, 10);
        if (!Number.isFinite(passkeyId)) {
            return res.status(400).json({ error: 'invalid id' });
        }
        const ok = await deletePasskey({
            userId: req.session.adminUser.id,
            passkeyId,
        });
        if (!ok) return res.status(404).json({ error: 'not found' });
        res.json({ deleted: true });
    } catch (err) {
        console.error('delete passkey error:', err);
        res.status(500).json({ error: 'failed to delete passkey' });
    }
});

// GET /admin/webauthn/status — used by login page to branch (bootstrap vs normal)
router.get('/status', async (req, res) => {
    try {
        const users = await countUsers();
        const hasPasskeys = await systemHasPasskeys();
        res.json({
            hasUsers: users > 0,
            hasPasskeys,
            bootstrap: !hasPasskeys,
        });
    } catch (err) {
        console.error('status error:', err);
        res.status(500).json({ error: 'status failed' });
    }
});

module.exports = router;
