async function fetchWithTimeout(url, options = {}) {
    const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : 5000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const { timeoutMs: _timeoutMs, signal, ...fetchOptions } = options;

    if (signal) {
        if (signal.aborted) controller.abort();
        else signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    try {
        return await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timer);
    }
}

function clampInteger(value, { fallback, min, max }) {
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
}

// Responses that must never be cached anywhere (redirect hops that set a
// cookie, the nonogram page, the writer 404).
function setNoStore(res) {
    res.removeHeader('Cloudflare-CDN-Cache-Control');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
}

// A list page rendered after one of its sources failed. Nothing may cache
// it (the next request should retry), and when nothing at all could be shown
// it is a 503 rather than a 200 page claiming the list is empty.
function markDegraded(res, { empty }) {
    setNoStore(res);
    if (empty) {
        res.status(503);
        res.setHeader('Retry-After', '30');
    }
}

module.exports = {
    fetchWithTimeout,
    clampInteger,
    setNoStore,
    markDegraded,
};
