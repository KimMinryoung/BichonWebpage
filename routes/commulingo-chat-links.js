// Links CommuLingo entries on their first mention in web chat answers. The chat
// renders markdown in the browser, so it posts the sanitized answer HTML here
// and swaps in the linked copy; the policy itself is linkify.js's.
// Read-only and session-free, so it sits before the CSRF gate like measurement.
const express = require('express');
const rateLimit = require('express-rate-limit');
const { getLinkIndexes, createLinker } = require('../data/commulingo/linkify');
const { localizeHtmlLinks } = require('../utils/seo');
const router = express.Router();
const MAX_ITEMS = 40;
const MAX_ITEM_CHARS = 40000;

router.post('/', rateLimit({ windowMs: 60000, limit: 60, standardHeaders: true, legacyHeaders: false }), async (req, res) => {
    res.set('Cache-Control', 'private, no-store');
    if (!req.is('application/json') || req.headers['x-commulingo-chat-links'] !== '1') return res.status(403).end();
    const items = req.body && req.body.items;
    if (!Array.isArray(items) || !items.length || items.length > MAX_ITEMS
        || items.some(html => typeof html !== 'string' || html.length > MAX_ITEM_CHARS)) {
        return res.status(400).json({ error: 'invalid chat answers' });
    }
    const lang = req.body.lang === 'en' ? 'en' : 'ko';
    try {
        const indexes = await getLinkIndexes(lang);
        // One linker per answer: each answer is its own reading unit.
        res.json({ items: items.map(html => localizeHtmlLinks(createLinker(indexes, { surface: 'chat' }).html(html), lang)) });
    } catch (err) {
        console.error('[chat links]', err.message);
        res.status(503).end();
    }
});

module.exports = router;
