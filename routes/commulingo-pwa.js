// CommuLingo as an installable app: the web app manifest and the service
// worker (public/js/commulingo-sw.js), per language. Mounted under
// /commulingo, so /en/commulingo/... reaches the same handlers with the
// English language (middleware/language.js strips the prefix).
const fs = require('fs');
const path = require('path');
const express = require('express');
const strings = require('../config/strings');
const { DEV_MODE } = require('../config/env');

const router = express.Router();
const SW_FILE = path.join(__dirname, '..', 'public', 'js', 'commulingo-sw.js');
let swSource = null;

// Revalidated on every fetch and never kept at the edge: a stale worker or
// manifest would outlive a fix by a day.
function noEdgeCache(res) {
    res.removeHeader('Cloudflare-CDN-Cache-Control');
    res.setHeader('Cache-Control', 'no-cache, max-age=0');
}

function scopeFor(req) {
    return req.urlLanguage === 'en' ? '/en/commulingo' : '/commulingo';
}

router.get('/manifest.webmanifest', (req, res) => {
    const lang = req.urlLanguage === 'en' ? 'en' : 'ko';
    const scope = scopeFor(req);
    const c = strings[lang].commuLingo;
    noEdgeCache(res);
    res.type('application/manifest+json').send(JSON.stringify({
        id: scope,
        name: c.name,
        short_name: c.name,
        description: c.description,
        lang,
        start_url: scope,
        scope,
        display: 'standalone',
        background_color: '#010409',
        theme_color: '#010409',
        icons: [
            { src: '/icons/commulingo-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/commulingo-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/commulingo-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
    }));
});

router.get('/sw.js', (req, res, next) => {
    try {
        if (swSource === null || DEV_MODE) swSource = fs.readFileSync(SW_FILE, 'utf8');
    } catch (err) {
        return next(err);
    }
    noEdgeCache(res);
    // The worker lives under /commulingo/ but serves /commulingo itself too.
    res.setHeader('Service-Worker-Allowed', scopeFor(req));
    res.type('application/javascript').send(swSource);
});

module.exports = router;
