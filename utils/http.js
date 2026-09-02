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
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
}

module.exports = {
    fetchWithTimeout,
    clampInteger,
    setNoStore,
};
