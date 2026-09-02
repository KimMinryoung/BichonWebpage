// Public passkey signup / login / logout for regular users.
// Mounted at /auth with NO IP whitelist. Uses the user-RP (cyber-lenin.com).
// Admin accounts are not usable here — they flow through /admin/login on the tailnet RP.

const express = require('express');
const { requireUser } = require('../middleware/auth');
const router = express.Router();
const {
    buildRegistrationOptions,
    confirmRegistration,
    buildAuthenticationOptions,
    confirmAuthentication,
    createRegularUser,
    findUserByUsername,
    bindFingerprint,
    listPasskeys,
    deletePasskey,
} = require('../services/webauthn');
const {
    createRegularUserWithPassword,
    findPasswordUserById,
    findPasswordUserByUsername,
    markPasswordLogin,
    setPasswordForUser,
    validatePassword,
    verifyPassword,
} = require('../services/password-auth');

function normalizeUsername(raw) {
    if (typeof raw !== 'string') return '';
    const s = raw.trim();
    const length = Array.from(s).length;
    if (length < 1 || length > 30) return '';
    if (!/^[\p{L}\p{N}_][\p{L}\p{N}_.\- ]*$/u.test(s)) return '';
    return s;
}

function loginUser(req, res, user) {
    req.session.regenerate((err) => {
        if (err) {
            console.error('session regenerate:', err);
            return res.status(500).json({ error: 'session error' });
        }
        req.session.user = { id: user.id, username: user.username };
        res.json({ ok: true, redirect: '/' });
    });
}

// GET /auth/login — passkey sign-in page
router.get('/login', (req, res) => {
    if (req.session.user && req.session.user.id) return res.redirect('/');
    res.render('public/login');
});

// GET /auth/signup — new account + passkey
router.get('/signup', (req, res) => {
    if (req.session.user && req.session.user.id) return res.redirect('/');
    res.render('public/signup');
});

// POST /auth/password/signup
router.post('/password/signup', async (req, res) => {
    try {
        const username = normalizeUsername(req.body && req.body.username);
        const password = req.body && req.body.password;
        if (!username) {
            return res.status(400).json({ error: 'invalid username' });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'password must be 1-128 characters' });
        }
        const existing = await findUserByUsername(username);
        if (existing) {
            return res.status(409).json({ error: 'username taken' });
        }
        const user = await createRegularUserWithPassword(username, password);
        const fingerprint = typeof req.body.fingerprint === 'string' ? req.body.fingerprint.trim() : null;
        if (fingerprint) await bindFingerprint(user.id, fingerprint);
        loginUser(req, res, user);
    } catch (err) {
        if (err && err.code === '23505') {
            return res.status(409).json({ error: 'username taken' });
        }
        console.error('auth password/signup:', err);
        res.status(500).json({ error: 'signup failed' });
    }
});

// POST /auth/password/login
router.post('/password/login', async (req, res) => {
    try {
        const username = normalizeUsername(req.body && req.body.username);
        const password = req.body && req.body.password;
        if (!username || typeof password !== 'string') {
            return res.status(400).json({ error: 'invalid username or password' });
        }

        const user = await findPasswordUserByUsername(username);
        const ok = user && !user.is_admin && await verifyPassword(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ error: 'invalid username or password' });
        }

        await markPasswordLogin(user.id);
        const fingerprint = typeof req.body.fingerprint === 'string' ? req.body.fingerprint.trim() : null;
        if (fingerprint) await bindFingerprint(user.id, fingerprint);
        loginUser(req, res, user);
    } catch (err) {
        console.error('auth password/login:', err);
        res.status(500).json({ error: 'login failed' });
    }
});

// GET /auth/password/status
router.get('/password/status', requireUser, async (req, res) => {
    try {
        const user = await findPasswordUserById(req.session.user.id);
        res.json({ hasPassword: !!(user && user.password_hash) });
    } catch (err) {
        console.error('auth password/status:', err);
        res.status(500).json({ error: 'status failed' });
    }
});

// POST /auth/password/set
router.post('/password/set', requireUser, async (req, res) => {
    try {
        const currentPassword = req.body && req.body.currentPassword;
        const newPassword = req.body && req.body.newPassword;
        if (!validatePassword(newPassword)) {
            return res.status(400).json({ error: 'password must be 1-128 characters' });
        }

        const user = await findPasswordUserById(req.session.user.id);
        if (!user || user.is_admin) {
            return res.status(403).json({ error: 'regular user required' });
        }

        if (user.password_hash) {
            const ok = await verifyPassword(currentPassword, user.password_hash);
            if (!ok) return res.status(401).json({ error: 'current password is incorrect' });
        }

        await setPasswordForUser(user.id, newPassword);
        res.json({ ok: true });
    } catch (err) {
        console.error('auth password/set:', err);
        res.status(500).json({ error: 'password update failed' });
    }
});

// POST /auth/webauthn/register/options
router.post('/webauthn/register/options', async (req, res) => {
    try {
        const username = normalizeUsername(req.body && req.body.username);
        if (!username) {
            return res.status(400).json({ error: 'invalid username' });
        }
        const existing = await findUserByUsername(username);
        if (existing) {
            return res.status(409).json({ error: 'username taken' });
        }
        const user = await createRegularUser(username);
        const options = await buildRegistrationOptions({ user, session: req.session, req });
        res.json(options);
    } catch (err) {
        console.error('auth register/options:', err);
        res.status(500).json({ error: 'failed to build registration options' });
    }
});

// POST /auth/webauthn/register/verify
router.post('/webauthn/register/verify', async (req, res) => {
    try {
        if (!req.session.webauthn || req.session.webauthn.mode !== 'register') {
            return res.status(400).json({ error: 'no pending registration' });
        }
        const deviceName = typeof req.body.deviceName === 'string'
            ? req.body.deviceName.slice(0, 80).trim() || null : null;
        const fingerprint = typeof req.body.fingerprint === 'string' ? req.body.fingerprint.trim() : null;

        const { userId } = await confirmRegistration({
            response: req.body.response,
            session: req.session,
            deviceName,
            req,
        });

        if (fingerprint) await bindFingerprint(userId, fingerprint);

        const user = await findUserByUsername(req.body.username);
        // regenerate session for login
        req.session.regenerate((err) => {
            if (err) {
                console.error('session regenerate:', err);
                return res.status(500).json({ error: 'session error' });
            }
            req.session.user = { id: user.id, username: user.username };
            res.json({ verified: true, redirect: '/' });
        });
    } catch (err) {
        console.error('auth register/verify:', err);
        res.status(400).json({ error: err.message || 'registration failed' });
    }
});

// POST /auth/webauthn/auth/options
router.post('/webauthn/auth/options', async (req, res) => {
    try {
        const username = normalizeUsername(req.body && req.body.username);
        const options = await buildAuthenticationOptions({
            session: req.session,
            req,
            username: username || null,
        });
        res.json(options);
    } catch (err) {
        console.error('auth auth/options:', err);
        res.status(500).json({ error: 'failed to build authentication options' });
    }
});

// POST /auth/webauthn/auth/verify
router.post('/webauthn/auth/verify', async (req, res) => {
    try {
        const fingerprint = typeof req.body.fingerprint === 'string' ? req.body.fingerprint.trim() : null;
        const { user } = await confirmAuthentication({
            response: req.body.response,
            session: req.session,
            req,
        });

        // Admin accounts authenticate via /admin/login. Passkey collision is
        // prevented by different RP_IDs anyway, but reject defensively.
        if (user.isAdmin) {
            return res.status(403).json({ error: 'admin account — use /admin/login' });
        }

        if (fingerprint) await bindFingerprint(user.id, fingerprint);

        req.session.regenerate((err) => {
            if (err) {
                console.error('session regenerate:', err);
                return res.status(500).json({ error: 'session error' });
            }
            req.session.user = { id: user.id, username: user.username };
            res.json({ verified: true, redirect: '/' });
        });
    } catch (err) {
        console.error('auth auth/verify:', err);
        res.status(400).json({ error: err.message || 'authentication failed' });
    }
});

// POST /auth/bind-fingerprint — logged-in user attaches their current browser's fingerprint
router.post('/bind-fingerprint', requireUser, async (req, res) => {
    try {
        const fingerprint = typeof req.body.fingerprint === 'string' ? req.body.fingerprint.trim() : null;
        if (!fingerprint) return res.status(400).json({ error: 'fingerprint required' });
        const bound = await bindFingerprint(req.session.user.id, fingerprint);
        res.json({ bound });
    } catch (err) {
        console.error('bind-fingerprint:', err);
        res.status(500).json({ error: 'bind failed' });
    }
});

// GET /auth/account — combined logout + passkey management for logged-in users
router.get('/account', (req, res) => {
    if (!req.session.user || !req.session.user.id) return res.redirect('/auth/login');
    res.render('public/account');
});

// POST /auth/webauthn/add/options — logged-in user begins registering another passkey
router.post('/webauthn/add/options', requireUser, async (req, res) => {
    try {
        const user = { id: req.session.user.id, username: req.session.user.username };
        const options = await buildRegistrationOptions({ user, session: req.session, req });
        res.json(options);
    } catch (err) {
        console.error('auth add/options:', err);
        res.status(500).json({ error: 'failed to build registration options' });
    }
});

// POST /auth/webauthn/add/verify
router.post('/webauthn/add/verify', requireUser, async (req, res) => {
    try {
        if (!req.session.webauthn || req.session.webauthn.mode !== 'register') {
            return res.status(400).json({ error: 'no pending registration' });
        }
        if (req.session.webauthn.userId !== req.session.user.id) {
            return res.status(400).json({ error: 'user mismatch' });
        }
        const deviceName = typeof req.body.deviceName === 'string'
            ? req.body.deviceName.slice(0, 80).trim() || null : null;
        await confirmRegistration({
            response: req.body.response,
            session: req.session,
            deviceName,
            req,
        });
        res.json({ verified: true });
    } catch (err) {
        console.error('auth add/verify:', err);
        res.status(400).json({ error: err.message || 'registration failed' });
    }
});

// GET /auth/webauthn/passkeys — list current user's passkeys
router.get('/webauthn/passkeys', requireUser, async (req, res) => {
    try {
        const rows = await listPasskeys(req.session.user.id);
        res.json({ passkeys: rows });
    } catch (err) {
        console.error('auth list passkeys:', err);
        res.status(500).json({ error: 'failed to list passkeys' });
    }
});

// POST /auth/webauthn/passkeys/:id/delete
router.post('/webauthn/passkeys/:id/delete', requireUser, async (req, res) => {
    try {
        const passkeyId = parseInt(req.params.id, 10);
        if (!Number.isFinite(passkeyId)) {
            return res.status(400).json({ error: 'invalid id' });
        }
        const ok = await deletePasskey({
            userId: req.session.user.id,
            passkeyId,
        });
        if (!ok) return res.status(404).json({ error: 'not found' });
        res.json({ deleted: true });
    } catch (err) {
        console.error('auth delete passkey:', err);
        res.status(500).json({ error: 'failed to delete passkey' });
    }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('logout:', err);
        res.redirect('/');
    });
});

module.exports = router;
