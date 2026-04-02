/**
 * report-cache.js — Local file cache for reports and research.
 *
 * Reports and research are immutable once created,
 * so individual entries can be cached permanently.
 * Listings are cached with a short TTL.
 */

const fs = require('fs');
const path = require('path');

const CACHE_DIR = process.env.REPORT_CACHE_DIR || path.join(__dirname, '..', 'data', 'report-cache');
const LIST_TTL_MS = 10 * 60 * 1000; // 10 minutes

fs.mkdirSync(CACHE_DIR, { recursive: true });

function _path(prefix, key) {
    const safe = String(key).replace(/[^a-zA-Z0-9._-]/g, '_');
    return path.join(CACHE_DIR, `${prefix}_${safe}.json`);
}

const LIST_PATH = path.join(CACHE_DIR, '_list.json');
const RESEARCH_LIST_PATH = path.join(CACHE_DIR, '_research_list.json');

// ── Report cache (permanent) ──

function getReport(id) {
    try {
        return JSON.parse(fs.readFileSync(_path('report', id), 'utf8'));
    } catch { return null; }
}

function setReport(report) {
    try {
        fs.writeFileSync(_path('report', report.id), JSON.stringify(report), 'utf8');
    } catch (e) { console.error('[report-cache] write error:', e.message); }
}

// ── Research cache (permanent) ──

function getResearch(filename) {
    try {
        return JSON.parse(fs.readFileSync(_path('research', filename), 'utf8'));
    } catch { return null; }
}

function setResearch(filename, data) {
    try {
        fs.writeFileSync(_path('research', filename), JSON.stringify(data), 'utf8');
    } catch (e) { console.error('[report-cache] research write error:', e.message); }
}

// ── List caches (TTL-based) ──

function _getListFile(filePath) {
    try {
        const stat = fs.statSync(filePath);
        if (Date.now() - stat.mtimeMs > LIST_TTL_MS) return null;
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch { return null; }
}

function _setListFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
    } catch (e) { console.error('[report-cache] list write error:', e.message); }
}

function getList(page) { return _getListFile(LIST_PATH)?.[`page:${page}`] || null; }
function setList(page, data) {
    const existing = _getListFile(LIST_PATH) || {};
    existing[`page:${page}`] = data;
    _setListFile(LIST_PATH, existing);
}

function getResearchList() { return _getListFile(RESEARCH_LIST_PATH); }
function setResearchList(data) { _setListFile(RESEARCH_LIST_PATH, data); }

function clearAll() {
    try {
        const files = fs.readdirSync(CACHE_DIR);
        for (const f of files) fs.unlinkSync(path.join(CACHE_DIR, f));
    } catch {}
}

module.exports = {
    getReport, setReport,
    getResearch, setResearch,
    getList, setList,
    getResearchList, setResearchList,
    clearAll,
};
