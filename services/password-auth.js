const crypto = require('crypto');
const { promisify } = require('util');
const db = require('../config/database');

const scryptAsync = promisify(crypto.scrypt);
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, keylen: 64 };
const PASSWORD_SCHEME = 'scrypt';

function validatePassword(raw) {
    if (typeof raw !== 'string') return false;
    return raw.length >= 1 && raw.length <= 128;
}

async function hashPassword(password) {
    if (!validatePassword(password)) {
        throw new Error('invalid password');
    }
    const salt = crypto.randomBytes(16).toString('base64url');
    const key = await scryptAsync(password, salt, SCRYPT_PARAMS.keylen, {
        N: SCRYPT_PARAMS.N,
        r: SCRYPT_PARAMS.r,
        p: SCRYPT_PARAMS.p,
    });
    return [
        PASSWORD_SCHEME,
        SCRYPT_PARAMS.N,
        SCRYPT_PARAMS.r,
        SCRYPT_PARAMS.p,
        salt,
        key.toString('base64url'),
    ].join('$');
}

async function verifyPassword(password, storedHash) {
    if (typeof password !== 'string' || typeof storedHash !== 'string') return false;

    const parts = storedHash.split('$');
    if (parts.length !== 6 || parts[0] !== PASSWORD_SCHEME) return false;

    const N = Number.parseInt(parts[1], 10);
    const r = Number.parseInt(parts[2], 10);
    const p = Number.parseInt(parts[3], 10);
    const salt = parts[4];
    const expected = Buffer.from(parts[5], 'base64url');
    if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p) || expected.length === 0) {
        return false;
    }

    const actual = await scryptAsync(password, salt, expected.length, { N, r, p });
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

async function createRegularUserWithPassword(username, password) {
    const passwordHash = await hashPassword(password);
    const { rows } = await db.query(
        `INSERT INTO users (username, is_admin, password_hash, password_updated_at)
         VALUES ($1, FALSE, $2, NOW())
         RETURNING id, username, is_admin`,
        [username, passwordHash]
    );
    return rows[0];
}

async function findPasswordUserByUsername(username) {
    const { rows } = await db.query(
        'SELECT id, username, is_admin, password_hash FROM users WHERE username = $1',
        [username]
    );
    return rows[0] || null;
}

async function findPasswordUserById(userId) {
    const { rows } = await db.query(
        'SELECT id, username, is_admin, password_hash FROM users WHERE id = $1',
        [userId]
    );
    return rows[0] || null;
}

async function setPasswordForUser(userId, password) {
    const passwordHash = await hashPassword(password);
    await db.query(
        'UPDATE users SET password_hash = $1, password_updated_at = NOW() WHERE id = $2',
        [passwordHash, userId]
    );
}

async function markPasswordLogin(userId) {
    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId]);
}

module.exports = {
    createRegularUserWithPassword,
    findPasswordUserById,
    findPasswordUserByUsername,
    markPasswordLogin,
    setPasswordForUser,
    validatePassword,
    verifyPassword,
};
