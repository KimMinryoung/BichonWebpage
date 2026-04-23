// WebAuthn (Passkey) service layer
// Wraps @simplewebauthn/server v13 with our DB persistence and session-bound challenges.

const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const db = require('../config/database');

function rpID() {
    return process.env.RP_ID || 'cyber-lenin.com';
}

function rpOrigin() {
    // Multiple origins accepted so testing on localhost still works when configured.
    const raw = process.env.RP_ORIGIN || `https://${rpID()}`;
    return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function rpName() {
    return process.env.RP_NAME || 'Cyber-Lenin';
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

async function buildRegistrationOptions({ user, session }) {
    const existing = await listCredentialsForUser(user.id);
    const options = await generateRegistrationOptions({
        rpName: rpName(),
        rpID: rpID(),
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

async function confirmRegistration({ response, session, deviceName }) {
    const state = session.webauthn;
    if (!state || state.mode !== 'register') {
        throw new Error('No pending registration challenge');
    }
    const verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: state.challenge,
        expectedOrigin: rpOrigin(),
        expectedRPID: rpID(),
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

async function buildAuthenticationOptions({ session }) {
    // Discoverable-credential flow: no allowCredentials, client picks.
    const options = await generateAuthenticationOptions({
        rpID: rpID(),
        userVerification: 'preferred',
    });
    session.webauthn = {
        mode: 'authenticate',
        challenge: options.challenge,
    };
    return options;
}

async function confirmAuthentication({ response, session }) {
    const state = session.webauthn;
    if (!state || state.mode !== 'authenticate') {
        throw new Error('No pending authentication challenge');
    }

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
        expectedOrigin: rpOrigin(),
        expectedRPID: rpID(),
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
    listPasskeys,
    deletePasskey,
};
