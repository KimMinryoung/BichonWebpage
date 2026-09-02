// GET /api/proxy/sessions and /api/proxy/history, answered from the local
// chat_logs table. Mounted under /api/proxy ahead of the backend proxy; a DB
// failure falls through (next()) so the upstream can still answer.
const express = require('express');
const { listChatSessions, listChatHistory } = require('../config/chat-log-store');

const router = express.Router();

// Positive integer with a fallback: 0, negatives and non-numbers give the
// fallback (not the minimum), which is what the chat client relies on.
function clampPositiveInteger(value, fallback, max) {
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n) || n < 1) return fallback;
    return Math.min(n, max);
}

function chatLookupFingerprints(req) {
    const values = [];
    if (typeof req.query.fingerprint === 'string' && req.query.fingerprint.trim()) {
        values.push(req.query.fingerprint.trim());
    }
    if (Array.isArray(req.userFingerprints)) {
        for (const fingerprint of req.userFingerprints) {
            if (typeof fingerprint === 'string' && fingerprint.trim()) {
                values.push(fingerprint.trim());
            }
        }
    }
    return [...new Set(values)];
}

function chatAccountUserId(req) {
    const value = req.chatAccountUserId || (req.session && req.session.user && req.session.user.id);
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
}

function requestedPersona(req) {
    return typeof req.query.persona === 'string' && req.query.persona.trim()
        ? req.query.persona.trim()
        : null;
}

router.get('/sessions', async (req, res, next) => {
    const accountUserId = chatAccountUserId(req);
    const fingerprints = chatLookupFingerprints(req);
    if (!accountUserId && !fingerprints.length) return res.json({ sessions: [] });

    try {
        const sessions = await listChatSessions({
            accountUserId,
            fingerprints,
            limit: clampPositiveInteger(req.query.limit, 50, 200),
            persona: requestedPersona(req),
        });
        res.json({ sessions });
    } catch (err) {
        console.error('local chat sessions:', err.message);
        next();
    }
});

router.get('/history', async (req, res, next) => {
    const accountUserId = chatAccountUserId(req);
    const fingerprints = chatLookupFingerprints(req);
    if (!accountUserId && !fingerprints.length) return res.json({ history: [] });

    const sessionId = typeof req.query.session_id === 'string' && req.query.session_id.trim()
        ? req.query.session_id.trim()
        : null;

    try {
        const history = await listChatHistory({
            accountUserId,
            fingerprints,
            limit: clampPositiveInteger(req.query.limit, 50, 500),
            persona: requestedPersona(req),
            sessionId,
        });
        res.json({ history });
    } catch (err) {
        console.error('local chat history:', err.message);
        next();
    }
});

module.exports = router;
