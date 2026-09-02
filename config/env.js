// Process-level configuration read once from the environment, plus the boot
// check that turns three silent misconfigurations into loud ones. Modules
// that own a knob (the snapshot stores' *_SNAPSHOT/*_CACHE_MS, the WebAuthn
// RP settings, the upstream URLs in config/services.js) keep reading it
// themselves; what lives here is what server.js and its middleware need.
require('dotenv').config();

function str(name, fallback = '') {
    const value = process.env[name];
    return value === undefined || value === '' ? fallback : value;
}

// Positive integer or the fallback (also for 0, negatives and non-numbers).
// Shared by config/database.js and middleware/rate-limit.js, which each had
// their own copy.
function intFromEnv(name, fallback) {
    const value = Number.parseInt(process.env[name], 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

const NODE_ENV = str('NODE_ENV', 'development');
const IS_PRODUCTION = NODE_ENV === 'production';
const DEV_MODE = process.env.DEV_MODE === '1' || !IS_PRODUCTION;
const PORT = str('PORT', '3000');
// Asset cache-busting: explicit ASSET_VERSION, else the git SHA baked in at
// image build, else boot time (which invalidates the CDN cache on restart).
const ASSET_VERSION = str('ASSET_VERSION') || str('GIT_SHA') || String(Date.now());
const SESSION_SECRET = str('SESSION_SECRET');
const WEBCHAT_PROXY_SECRET = str('WEBCHAT_PROXY_SECRET');
// The tailnet host the owner-only writer UI and admin passkeys answer on.
const ADMIN_HOST = str('ADMIN_RP_ID', 'leninbot.tail6ecbbc.ts.net').toLowerCase();
// Fingerprints change only when a passkey is added/removed, so a short
// session-side cache keeps the DB query off every streamed chat request.
const FINGERPRINT_CACHE_MS = intFromEnv('FINGERPRINT_CACHE_MS', 60 * 1000);

// Fail fast on what cannot work, warn on what silently degrades. Called from
// server.js before any middleware is built.
function validateEnv() {
    if (!SESSION_SECRET) {
        throw new Error('[env] SESSION_SECRET is not set; sessions cannot be signed. Set it in .env.');
    }
    const { LENINBOT_ADMIN_KEY } = require('./services');
    if (!LENINBOT_ADMIN_KEY) {
        console.warn('[env] LENINBOT_ADMIN_KEY is empty: admin proxies to the backend will be rejected upstream.');
    }
    if (!str('ADMIN_ALLOWED_IPS')) {
        console.warn('[env] ADMIN_ALLOWED_IPS is empty: /admin/* is reachable from every IP (allowlist disabled).');
    }
    if (!IS_PRODUCTION) {
        console.info(`[env] NODE_ENV=${NODE_ENV}${DEV_MODE ? ' (DEV_MODE: view/static caching off)' : ''}`);
    }
}

module.exports = {
    str,
    intFromEnv,
    NODE_ENV,
    IS_PRODUCTION,
    DEV_MODE,
    PORT,
    ASSET_VERSION,
    SESSION_SECRET,
    WEBCHAT_PROXY_SECRET,
    ADMIN_HOST,
    FINGERPRINT_CACHE_MS,
    validateEnv,
};
