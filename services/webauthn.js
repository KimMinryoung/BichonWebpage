// WebAuthn (Passkey) service layer
// Wraps @simplewebauthn/server v13 with our DB persistence and session-bound challenges.

const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const db = require('../config/database');

// RPs keyed by Host header. Admin lives on the tailnet domain (IP-gated),
// regular users on the public domain. Each origin is a separate WebAuthn RP —
// credentials registered under one cannot be used to authenticate on the other.
const RP_CONFIGS = [
    {
        id: process.env.ADMIN_RP_ID || 'leninbot.tail6ecbbc.ts.net',
        origins: (process.env.ADMIN_RP_ORIGIN || 'https://leninbot.tail6ecbbc.ts.net:8443')
            .split(',').map(s => s.trim()).filter(Boolean),
        name: process.env.ADMIN_RP_NAME || 'Cyber-Lenin Admin',
    },
    {
        id: process.env.USER_RP_ID || 'cyber-lenin.com',
        origins: (process.env.USER_RP_ORIGIN || 'https://cyber-lenin.com')
            .split(',').map(s => s.trim()).filter(Boolean),
        name: process.env.USER_RP_NAME || 'Cyber-Lenin',
    },
];

function rpFromReq(req) {
    const hostHeader = (req && req.get && req.get('host')) || '';
    const hostname = hostHeader.split(':')[0].toLowerCase();
    const match = RP_CONFIGS.find(c => c.id === hostname);
    // Fall back to the user RP (index 1) so misconfigured Host doesn't crash admin,
    // but registration will fail origin validation if truly wrong.
    return match || RP_CONFIGS[1];
}

function userIdToBytes(userId) {
    return new TextEncoder().encode(String(userId));
}

async function listCredentialsForUser(userId) {
    const { rows } = await db.query(
        'SELECT credential_id, public_key, counter, transports FROM user_passkeys WHERE user_id = $1',
        [userId]
    );
    return rows;
}

async function listCredentialsForUsername(username) {
    const { rows } = await db.query(
        `SELECT p.credential_id, p.public_key, p.counter, p.transports
           FROM user_passkeys p
           JOIN users u ON u.id = p.user_id
          WHERE u.username = $1 AND u.is_admin = FALSE`,
        [username]
    );
    return rows;
}

async function listCredentialsForRegularUsers() {
    const { rows } = await db.query(
        `SELECT p.credential_id, p.public_key, p.counter, p.transports
           FROM user_passkeys p
           JOIN users u ON u.id = p.user_id
          WHERE u.is_admin = FALSE`
    );
    return rows;
}

async function buildRegistrationOptions({ user, session, req }) {
    const rp = rpFromReq(req);
    const existing = await listCredentialsForUser(user.id);
    const options = await generateRegistrationOptions({
        rpName: rp.name,
        rpID: rp.id,
        userID: userIdToBytes(user.id),
        userName: user.username,
        userDisplayName: user.username,
        attestationType: 'none',
        excludeCredentials: existing.map(c => ({
            id: c.credential_id,
            transports: c.transports || undefined,
        })),
        authenticatorSelection: {
            residentKey: 'required',
            userVerification: 'preferred',
        },
    });

    session.webauthn = {
        mode: 'register',
        challenge: options.challenge,
        userId: user.id,
    };
    return options;
}

async function confirmRegistration({ response, session, deviceName, req }) {
    const state = session.webauthn;
    if (!state || state.mode !== 'register') {
        throw new Error('No pending registration challenge');
    }
    const rp = rpFromReq(req);
    const verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: state.challenge,
        expectedOrigin: rp.origins,
        expectedRPID: rp.id,
        requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
        throw new Error('Registration verification failed');
    }

    const { credential, credentialBackedUp } = verification.registrationInfo;
    const transports = Array.isArray(response.response?.transports)
        ? response.response.transports
        : [];

    await db.query(
        `INSERT INTO user_passkeys
            (user_id, credential_id, public_key, counter, transports, device_name, backed_up)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
            state.userId,
            credential.id,
            Buffer.from(credential.publicKey),
            credential.counter || 0,
            transports,
            deviceName || null,
            !!credentialBackedUp,
        ]
    );

    delete session.webauthn;
    return { userId: state.userId };
}

async function buildAuthenticationOptions({ session, req, username }) {
    const rp = rpFromReq(req);
    const credentials = username
        ? await listCredentialsForUsername(username)
        : await listCredentialsForRegularUsers();
    const options = await generateAuthenticationOptions({
        rpID: rp.id,
        userVerification: 'preferred',
        allowCredentials: credentials.length ? credentials.map(c => ({
            id: c.credential_id,
            transports: c.transports || undefined,
        })) : undefined,
    });
    session.webauthn = {
        mode: 'authenticate',
        challenge: options.challenge,
    };
    return options;
}

async function confirmAuthentication({ response, session, req }) {
    const state = session.webauthn;
    if (!state || state.mode !== 'authenticate') {
        throw new Error('No pending authentication challenge');
    }
    const rp = rpFromReq(req);

    const { rows } = await db.query(
        `SELECT p.id AS passkey_id, p.user_id, p.credential_id, p.public_key, p.counter, p.transports,
                u.username, u.is_admin
           FROM user_passkeys p
           JOIN users u ON u.id = p.user_id
          WHERE p.credential_id = $1`,
        [response.id]
    );
    if (rows.length === 0) {
        throw new Error('Unknown credential');
    }
    const row = rows[0];

    const verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge: state.challenge,
        expectedOrigin: rp.origins,
        expectedRPID: rp.id,
        credential: {
            id: row.credential_id,
            publicKey: new Uint8Array(row.public_key),
            counter: Number(row.counter),
            transports: row.transports || undefined,
        },
        requireUserVerification: false,
    });

    if (!verification.verified) {
        throw new Error('Authentication verification failed');
    }

    const newCounter = verification.authenticationInfo.newCounter;
    await db.query(
        'UPDATE user_passkeys SET counter = $1, last_used_at = NOW() WHERE id = $2',
        [newCounter, row.passkey_id]
    );
    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [row.user_id]);

    delete session.webauthn;
    return {
        user: {
            id: row.user_id,
            username: row.username,
            isAdmin: row.is_admin,
        },
    };
}

async function countUsers() {
    const { rows } = await db.query('SELECT COUNT(*)::int AS n FROM users');
    return rows[0].n;
}

async function countPasskeysForUser(userId) {
    const { rows } = await db.query(
        'SELECT COUNT(*)::int AS n FROM user_passkeys WHERE user_id = $1',
        [userId]
    );
    return rows[0].n;
}

async function findOrCreateBootstrapUser(username) {
    const { rows } = await db.query(
        `INSERT INTO users (username, is_admin)
         VALUES ($1, TRUE)
         ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
         RETURNING id, username, is_admin`,
        [username]
    );
    return rows[0];
}

async function createRegularUser(username) {
    const { rows } = await db.query(
        `INSERT INTO users (username, is_admin)
         VALUES ($1, FALSE)
         RETURNING id, username, is_admin`,
        [username]
    );
    return rows[0];
}

async function findUserByUsername(username) {
    const { rows } = await db.query(
        'SELECT id, username, is_admin FROM users WHERE username = $1',
        [username]
    );
    return rows[0] || null;
}

async function bindFingerprint(userId, fingerprint) {
    if (!fingerprint || typeof fingerprint !== 'string') return false;
    const result = await db.query(
        `INSERT INTO user_fingerprints (user_id, fingerprint)
         VALUES ($1, $2)
         ON CONFLICT (user_id, fingerprint) DO NOTHING`,
        [userId, fingerprint]
    );
    return result.rowCount > 0;
}

async function fingerprintsForUser(userId) {
    const { rows } = await db.query(
        'SELECT fingerprint FROM user_fingerprints WHERE user_id = $1',
        [userId]
    );
    return rows.map(r => r.fingerprint);
}

async function listPasskeys(userId) {
    const { rows } = await db.query(
        `SELECT id, device_name, created_at, last_used_at, backed_up
           FROM user_passkeys WHERE user_id = $1
          ORDER BY created_at DESC`,
        [userId]
    );
    return rows;
}

async function deletePasskey({ userId, passkeyId }) {
    const result = await db.query(
        'DELETE FROM user_passkeys WHERE id = $1 AND user_id = $2',
        [passkeyId, userId]
    );
    return result.rowCount > 0;
}

module.exports = {
    buildRegistrationOptions,
    confirmRegistration,
    buildAuthenticationOptions,
    confirmAuthentication,
    countUsers,
    countPasskeysForUser,
    findOrCreateBootstrapUser,
    createRegularUser,
    findUserByUsername,
    bindFingerprint,
    fingerprintsForUser,
    listPasskeys,
    deletePasskey,
};
