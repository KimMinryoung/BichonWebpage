/**
 * API 키 인증 미들웨어
 * X-API-Key 헤더를 확인하여 인증합니다.
 */
const crypto = require('crypto');

function requireApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.AI_DIARY_API_KEY;

    if (!validApiKey) {
        console.error('[API Key Error] AI_DIARY_API_KEY environment variable is not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!apiKey || !timingSafeEqual(apiKey, validApiKey)) {
        console.warn('[API Key Error] Invalid or missing API key from:', req.ip);
        return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }

    next();
}

function timingSafeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = requireApiKey;
