// Purge edited CommuLingo pages from Cloudflare's edge cache.
//
// Anonymous HTML is kept at the edge for a minute and then served stale for up
// to a day while the edge refetches it (middleware/cache-policy.js), so the
// first reader after an edit would otherwise get the old page. This module
// watches the content tables' updated_at, and once the website's in-memory
// stores have picked an edit up it purges that entry's own pages (Korean and
// English URLs). Pages that only link to the entry keep the edge's normal
// timing. Every write path is covered (admin MCP, admin screens, leninbot),
// because the change is read from the database, not from the writer.
//
// Timing: a purge must come after this process serves the new content, or the
// edge refetches and keeps the old page again. The stores reload at least
// once a minute, so a row is purged when it is AGE_FLOOR_MS old; after a
// stores_refresh notice (store-refresh.js) the stores are already fresh and
// every pending row is purged at once.
//
// Needs CF_CACHE_PURGE_TOKEN (Cache Purge + Zone Read); without it nothing runs.
const SITE = 'https://cyber-lenin.com';
const API = 'https://api.cloudflare.com/client/v4';
const TICK_MS = 30 * 1000;
const AGE_FLOOR_MS = 120 * 1000;
const WINDOW_MS = 30 * 60 * 1000;
const BATCH = 30; // purge_cache accepts up to 30 URLs per request

// table -> [key column, entry id -> page paths under /commulingo]
const SOURCES = [
    ['commulingo_terms', 'id', id => [`/terms/${id}`]],
    ['commulingo_people', 'id', id => [`/people/${id}`]],
    ['commulingo_person_sections', 'person_id', id => [`/people/${id}`]],
    ['commulingo_history_events', 'id', id => [`/events/${id}`]],
    ['commulingo_offices', 'id', id => [`/offices/${id}`]],
    ['commulingo_docs', 'id', id => [`/docs/${id}`, `/docs/${id}/original`]],
    ['commulingo_data_documents', 'key', dataDocumentPaths],
];

function dataDocumentPaths(key) {
    const [kind, id] = String(key).split(/\/(.*)/s);
    if (!id) return [];
    // The hub ('') lists every course too.
    if (kind === 'course') return [`/book/${id}`, '/learn', ''];
    if (kind === 'genealogy') return [`/genealogy/${id}`, '/genealogy'];
    return [];
}

// Full Korean and English URLs for one changed row.
function urlsFor(table, key) {
    const source = SOURCES.find(([name]) => name === table);
    if (!source || key === null || key === undefined || key === '') return [];
    return source[2](String(key)).flatMap(path => [
        `${SITE}/commulingo${path}`,
        `${SITE}/en/commulingo${path}`,
    ]);
}

let zoneId = process.env.CF_ZONE_ID || '';
const purged = new Map(); // `${table}:${key}` -> updated_at (ms) already purged
let running = false;
let timer = null;

async function cf(path, init = {}) {
    const res = await fetch(`${API}${path}`, {
        ...init,
        headers: { Authorization: `Bearer ${process.env.CF_CACHE_PURGE_TOKEN}`, 'Content-Type': 'application/json' },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.success === false) {
        const message = (body.errors || []).map(e => e.message).join('; ') || `HTTP ${res.status}`;
        throw new Error(message);
    }
    return body;
}

async function purgeUrls(urls) {
    if (!zoneId) {
        const name = process.env.CF_ZONE_NAME || 'cyber-lenin.com';
        const body = await cf(`/zones?name=${encodeURIComponent(name)}&status=active&per_page=1`);
        zoneId = body.result && body.result[0] && body.result[0].id;
        if (!zoneId) throw new Error(`zone ${name} not found`);
    }
    for (let i = 0; i < urls.length; i += BATCH) {
        await cf(`/zones/${zoneId}/purge_cache`, { method: 'POST', body: JSON.stringify({ files: urls.slice(i, i + BATCH) }) });
    }
}

// Rows changed within the window, minus those already purged at that
// updated_at; with ageFloorMs, only rows at least that old.
async function pendingRows(db, ageFloorMs) {
    const rows = [];
    for (const [table, column] of SOURCES) {
        const { rows: found } = await db.query(
            `SELECT ${column}::text AS key, updated_at,
                    updated_at <= now() - ($2 || ' milliseconds')::interval AS settled
               FROM ${table}
              WHERE updated_at > now() - ($1 || ' milliseconds')::interval`,
            [String(WINDOW_MS), String(ageFloorMs)]);
        for (const row of found) {
            const at = new Date(row.updated_at).getTime();
            const id = `${table}:${row.key}`;
            if (purged.get(id) === at) continue;
            if (!row.settled) continue;
            rows.push({ table, key: row.key, id, at });
        }
    }
    return rows;
}

function forget() {
    const cutoff = Date.now() - WINDOW_MS - 60 * 1000;
    for (const [id, at] of purged) if (at < cutoff) purged.delete(id);
}

async function purgeChanged({ ageFloorMs = AGE_FLOOR_MS } = {}) {
    if (running || !process.env.CF_CACHE_PURGE_TOKEN) return 0;
    running = true;
    try {
        const db = require('../../config/database');
        const rows = await pendingRows(db, ageFloorMs);
        const urls = [...new Set(rows.flatMap(row => urlsFor(row.table, row.key)))];
        if (urls.length) await purgeUrls(urls);
        for (const row of rows) purged.set(row.id, row.at);
        forget();
        if (urls.length) console.log(`[edge purge] ${rows.length} edited entries, ${urls.length} URLs`);
        return urls.length;
    } catch (err) {
        console.error('[edge purge] failed:', err.message);
        return 0;
    } finally {
        running = false;
    }
}

// Edits made before this process started were served fresh by it from the
// start, but the edge may still hold older pages: the first tick catches them.
function startEdgePurge() {
    if (timer || !process.env.CF_CACHE_PURGE_TOKEN || process.env.NODE_ENV === 'test') return;
    timer = setInterval(() => { purgeChanged(); }, TICK_MS);
    timer.unref();
}

module.exports = { startEdgePurge, purgeChanged, urlsFor, dataDocumentPaths };
