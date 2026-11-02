// Real-user Core Web Vitals and browser errors (routes/site-metrics.js,
// public/js/site-vitals.js). A sample is stored only as one count in a fixed
// bucket per day, menu, metric and device, so p75 can be read back to the
// bucket's upper edge without keeping samples.

// Upper bucket edges; the last bucket is open-ended. LCP and INP in ms, CLS
// in thousandths. The good/poor thresholds (LCP 2500/4000, INP 200/500, CLS
// 100/250) are edges, so the rating of a p75 is exact.
const EDGES = {
    lcp: [500, 1000, 1500, 2000, 2500, 3000, 4000, 6000, 10000],
    inp: [50, 100, 150, 200, 300, 500, 800, 1500],
    cls: [10, 25, 50, 100, 150, 250, 400, 1000],
};
const THRESHOLDS = { lcp: [2500, 4000], inp: [200, 500], cls: [100, 250] };
const LIMITS = { lcp: 120000, inp: 60000, cls: 50000 };

// A beacon's value → its bucket index, or null for a value out of range.
function bucketFor(metric, value) {
    const edges = EDGES[metric];
    if (!edges || typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > LIMITS[metric]) return null;
    const index = edges.findIndex(edge => value <= edge);
    return index === -1 ? edges.length : index;
}

// [{ bucket, samples }] → { samples, p75 (the bucket's upper edge, or
// '>' + last edge), rating: 'good' | 'needs-improvement' | 'poor' }.
function p75(metric, rows) {
    const edges = EDGES[metric];
    const counts = new Array(edges.length + 1).fill(0);
    for (const row of rows) if (row.bucket >= 0 && row.bucket <= edges.length) counts[row.bucket] += Number(row.samples) || 0;
    const samples = counts.reduce((a, b) => a + b, 0);
    if (!samples) return { samples: 0, p75: null, rating: null };
    let seen = 0;
    let bucket = counts.length - 1;
    for (let i = 0; i < counts.length; i++) {
        seen += counts[i];
        if (seen >= samples * 0.75) { bucket = i; break; }
    }
    const value = bucket < edges.length ? edges[bucket] : null;
    const [good, poor] = THRESHOLDS[metric];
    const rating = value === null || value > poor ? 'poor' : value > good ? 'needs-improvement' : 'good';
    return { samples, p75: value === null ? `>${edges[edges.length - 1]}` : value, rating };
}

// A browser error report → { source, message } or null. Only the site's own
// scripts count (extensions and injected scripts are someone else's errors);
// the source keeps the path and position, never the query.
function normalizeError(body, origin) {
    if (!body || typeof body.message !== 'string' || typeof body.source !== 'string') return null;
    let url;
    try { url = new URL(body.source); } catch { return null; }
    if (url.origin !== origin || !/^\/(?:js|assets)\//.test(url.pathname)) return null;
    const line = Number.isSafeInteger(body.line) && body.line >= 0 ? body.line : 0;
    const column = Number.isSafeInteger(body.column) && body.column >= 0 ? body.column : 0;
    const source = `${url.pathname}:${line}:${column}`.slice(0, 200);
    const message = body.message.replace(/\s+/g, ' ').trim().slice(0, 300);
    return message ? { source, message } : null;
}

module.exports = { EDGES, THRESHOLDS, bucketFor, p75, normalizeError };
