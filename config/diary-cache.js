/**
 * diary-cache.js — Local file cache for AI diary entries.
 *
 * Diary entries are immutable (never updated after creation),
 * so individual entries can be cached permanently.
 * The listing (index) is cached with a short TTL since new entries
 * may be added by leninbot at any time.
 */

const fs = require('fs');
const path = require('path');

const CACHE_DIR = process.env.DIARY_CACHE_DIR || path.join(__dirname, '..', 'data', 'diary-cache');
const INDEX_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Ensure cache directory exists
fs.mkdirSync(CACHE_DIR, { recursive: true });

function _entryPath(id) {
    return path.join(CACHE_DIR, `${id}.json`);
}

const INDEX_PATH = path.join(CACHE_DIR, '_index.json');

// ── Individual entry cache (permanent) ──

function getEntry(id) {
    try {
        const data = fs.readFileSync(_entryPath(id), 'utf8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

function setEntry(diary) {
    try {
        fs.writeFileSync(_entryPath(diary.id), JSON.stringify(diary), 'utf8');
    } catch (e) {
        console.error('[diary-cache] write error:', e.message);
    }
}

function deleteEntry(id) {
    try { fs.unlinkSync(_entryPath(id)); } catch {}
    invalidateIndex();
}

// ── Index cache (TTL-based) ──

function getIndex() {
    try {
        const stat = fs.statSync(INDEX_PATH);
        if (Date.now() - stat.mtimeMs > INDEX_TTL_MS) return null; // expired
        const data = fs.readFileSync(INDEX_PATH, 'utf8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

function setIndex(data) {
    try {
        fs.writeFileSync(INDEX_PATH, JSON.stringify(data), 'utf8');
    } catch (e) {
        console.error('[diary-cache] index write error:', e.message);
    }
}

function invalidateIndex() {
    try { fs.unlinkSync(INDEX_PATH); } catch {}
}

module.exports = { getEntry, setEntry, deleteEntry, getIndex, setIndex, invalidateIndex };
