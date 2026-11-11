// express.static for public/ with the cache policy per asset type. CSS/JS
// carry ?v=<version> (CSS: the CSS release, JS: config/js-versions.js) so
// they can be immutable for a year; the nonogram editor and puzzle JSON are
// edited in place and never cached.
const path = require('path');
const express = require('express');
const { DEV_MODE } = require('./env');
const { safeFile } = require('../scripts/lib/css-release');

const staticAssets = express.static(path.join(__dirname, '..', 'public'), {
    index: false,
    setHeaders: (res, filePath) => {
        const normalized = filePath.split(path.sep).join('/');
        if (DEV_MODE) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
            return;
        }
        const isNonogramPage = normalized.endsWith('/public/nonogram/editor.html');
        const isPuzzleJson = normalized.includes('/public/puzzles/') && normalized.endsWith('.json');
        if (isNonogramPage || isPuzzleJson) {
            res.setHeader('Cache-Control', 'no-store, max-age=0');
            return;
        }
        if (/\.(?:css|js)$/i.test(normalized)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            return;
        }
        if (/\.(?:png|jpe?g|gif|webp|svg|ico|woff2?|ttf)$/i.test(normalized)) {
            res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
            return;
        }
        if (/\.(?:xml|txt)$/i.test(normalized)) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        }
    }
});

// Serve only public payloads, never release metadata, staging or pointers.
// /assets/<id>/<file>: <id> is a file's content ID (content/, schema 2) or,
// for HTML still naming an older release, a release ID (releases/, schema 1).
const releaseRoot = process.env.CSS_RELEASE_DIR;
function releasedAssets(req, res, next) {
    if (!req.path.startsWith('/assets/')) return next();
    const match = req.path.match(/^\/assets\/([a-f0-9]{32})\/(.+)$/);
    if (!releaseRoot || !match || !safeFile(match[2])) {
        return res.status(404).end();
    }
    const roots = [
        path.join(releaseRoot, 'content', match[1]),
        path.join(releaseRoot, 'releases', match[1], 'public'),
    ];
    (function send(index) {
        res.sendFile(match[2], {
            root: roots[index],
            dotfiles: 'deny',
            headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }
        }, err => {
            if (!err || res.headersSent) return;
            if ((err.statusCode || err.status) === 404 && index + 1 < roots.length) return send(index + 1);
            res.status(err.statusCode || 404).end();
        });
    })(0);
}
module.exports = { staticAssets, releasedAssets };
