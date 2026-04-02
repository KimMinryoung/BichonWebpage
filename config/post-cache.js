/**
 * post-cache.js — Local file cache for blog posts.
 *
 * Posts are rarely modified. Individual posts are cached permanently
 * and invalidated on edit/delete. The listing index uses a short TTL
 * and is also invalidated on any write operation.
 */

const fs = require('fs');
const path = require('path');

const CACHE_DIR = process.env.POST_CACHE_DIR || path.join(__dirname, '..', 'data', 'post-cache');
const INDEX_TTL_MS = 10 * 60 * 1000; // 10 minutes

fs.mkdirSync(CACHE_DIR, { recursive: true });

function _entryPath(id) {
    return path.join(CACHE_DIR, `${id}.json`);
}

const INDEX_PATH = path.join(CACHE_DIR, '_index.json');

// ── Individual post cache (permanent until invalidated) ──

function getEntry(id) {
    try {
        return JSON.parse(fs.readFileSync(_entryPath(id), 'utf8'));
    } catch { return null; }
}

function setEntry(post) {
    try {
        fs.writeFileSync(_entryPath(post.id), JSON.stringify(post), 'utf8');
    } catch (e) { console.error('[post-cache] write error:', e.message); }
}

function deleteEntry(id) {
    try { fs.unlinkSync(_entryPath(id)); } catch {}
    invalidateIndex();
}

// ── Index cache (TTL-based, invalidated on write) ──

function getIndex() {
    try {
        const stat = fs.statSync(INDEX_PATH);
        if (Date.now() - stat.mtimeMs > INDEX_TTL_MS) return null;
        return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
    } catch { return null; }
}

function setIndex(data) {
    try {
        fs.writeFileSync(INDEX_PATH, JSON.stringify(data), 'utf8');
    } catch (e) { console.error('[post-cache] index write error:', e.message); }
}

function invalidateIndex() {
    try { fs.unlinkSync(INDEX_PATH); } catch {}
}

module.exports = { getEntry, setEntry, deleteEntry, getIndex, setIndex, invalidateIndex };
