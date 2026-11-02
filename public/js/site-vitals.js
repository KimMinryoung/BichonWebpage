// Real-user measurement (routes/site-metrics.js): this page's Core Web Vitals
// once, when it is hidden, and errors thrown by the site's own scripts.
// Loaded first among the deferred scripts (partials/head) so later ones'
// errors are caught. Sends nothing a server-side counter would not see:
// the path, a device class and three numbers, or an error's file and text.
/* global PerformanceObserver */
(function () {
    if (!window.fetch || !window.PerformanceObserver) return;
    function send(url, body) {
        try {
            fetch(url, {
                method: 'POST', credentials: 'same-origin', keepalive: true,
                headers: { 'Content-Type': 'application/json', 'x-commulingo-measurement': '1' },
                body: JSON.stringify(body)
            }).catch(function () {});
        } catch (e) {}
    }

    // Errors: at most five per page, from this origin's scripts only (the
    // server checks the source again).
    var errorsLeft = 5;
    function reportError(message, source, line, column) {
        if (errorsLeft <= 0 || !message || !source || source.indexOf(location.origin + '/') !== 0) return;
        errorsLeft--;
        send('/metrics/client-error', { message: String(message).slice(0, 300), source: source, line: line || 0, column: column || 0 });
    }
    window.addEventListener('error', function (event) {
        if (event.error || event.message) reportError(event.message, event.filename, event.lineno, event.colno);
    });
    window.addEventListener('unhandledrejection', function (event) {
        var reason = event.reason;
        var stack = reason && reason.stack ? String(reason.stack) : '';
        var at = stack.match(/(https?:\/\/[^\s)]+):(\d+):(\d+)/);
        if (!at) return;
        reportError((reason && reason.message) || String(reason), at[1], Number(at[2]), Number(at[3]));
    });

    // A page opened in the background has no meaningful LCP.
    if (document.visibilityState !== 'visible') return;
    var lcp = null;
    var cls = 0;
    var windowValue = 0;
    var windowStart = 0;
    var windowLast = 0;
    var interactions = {};
    function observe(type, handle, options) {
        try {
            new PerformanceObserver(function (list) { list.getEntries().forEach(handle); })
                .observe(Object.assign({ type: type, buffered: true }, options || {}));
        } catch (e) {}
    }
    observe('largest-contentful-paint', function (entry) { lcp = entry.startTime; });
    // CLS: the largest burst of shifts (gaps under 1 s, at most 5 s long).
    observe('layout-shift', function (entry) {
        if (entry.hadRecentInput) return;
        if (windowValue && entry.startTime - windowLast < 1000 && entry.startTime - windowStart < 5000) {
            windowValue += entry.value;
        } else {
            windowValue = entry.value;
            windowStart = entry.startTime;
        }
        windowLast = entry.startTime;
        if (windowValue > cls) cls = windowValue;
    });
    // INP: the slowest interaction, or about the 98th percentile on pages
    // with many (one per 50 dropped from the top).
    observe('event', function (entry) {
        if (!entry.interactionId) return;
        var key = entry.interactionId;
        if (!interactions[key] || entry.duration > interactions[key]) interactions[key] = entry.duration;
    }, { durationThreshold: 40 });
    observe('first-input', function (entry) {
        var key = entry.interactionId || 'first';
        if (!interactions[key] || entry.duration > interactions[key]) interactions[key] = entry.duration;
    });

    var sent = false;
    function flush() {
        if (sent || lcp === null) return;
        sent = true;
        var durations = Object.keys(interactions).map(function (key) { return interactions[key]; })
            .sort(function (a, b) { return b - a; });
        var body = {
            path: location.pathname,
            device: window.matchMedia && window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop',
            lcp: Math.round(lcp),
            cls: Math.round(cls * 1000)
        };
        if (durations.length) body.inp = Math.round(durations[Math.min(Math.floor(durations.length / 50), durations.length - 1)]);
        send('/metrics/vitals', body);
    }
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') flush();
    });
    window.addEventListener('pagehide', flush);
})();
