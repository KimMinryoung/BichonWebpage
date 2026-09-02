// express.static for public/ with the cache policy per asset type. CSS/JS
// carry ?v=<asset version> so they can be immutable for a year; the
// nonogram page and puzzle JSON are edited in place and never cached.
const path = require('path');
const express = require('express');
const { DEV_MODE } = require('./env');

const staticAssets = express.static(path.join(__dirname, '..', 'public'), {
    index: false,
    setHeaders: (res, filePath) => {
        const normalized = filePath.split(path.sep).join('/');
        if (DEV_MODE) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
            return;
        }
        const isNonogramPage = normalized.endsWith('/public/nonogram/index.html') || normalized.endsWith('/public/nonogram/editor.html');
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

module.exports = { staticAssets };
