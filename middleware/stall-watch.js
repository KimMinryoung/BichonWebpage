// Names the requests behind a blocked event loop or a memory spike.
// On 2026-11-19 at 02:28 UTC the process stopped answering for about 95 s:
// no restart, no host pressure, a peak RSS of 3.7 GB (VmHWM) against 1.6 GB
// in steady state, and nothing that said which request was running. When the
// loop wakes up after a block, this prints how long it was blocked and the
// requests that were in flight; a request that blocked the loop itself and
// finished before the timer ran is caught by the slow-request line instead.
const { performance, PerformanceObserver } = require('node:perf_hooks');

const MB = 1024 * 1024;
const DEFAULTS = {
    tickMs: 500,        // timer interval; lag is how late a tick fires
    stallMs: 1000,      // log a stall at this much lag
    slowMs: 5000,       // log a finished request that took this long
    gcMs: 500,          // log a garbage-collection pause this long
    rssFloorMb: 1536,   // first memory line at floor + step (steady state ~1.6 GB)
    rssStepMb: 512,     // then one line per new step
    listed: 8,          // most recently started in-flight requests to name
};

const mb = bytes => Math.round(bytes / MB);
function memoryLine() {
    const m = process.memoryUsage();
    return `rss ${mb(m.rss)} MB, heap ${mb(m.heapUsed)}/${mb(m.heapTotal)} MB, external ${mb(m.external)} MB`;
}

function startStallWatch(options = {}) {
    const o = { ...DEFAULTS, ...options };
    const log = o.log || ((line) => console.warn(line));
    const inFlight = new Map();
    let seq = 0;

    const describeInFlight = () => {
        const now = performance.now();
        const recent = [...inFlight.values()].sort((a, b) => b.startedAt - a.startedAt);
        const named = recent.slice(0, o.listed)
            .map(r => `${r.method} ${r.path} (${Math.round(now - r.startedAt)} ms)`);
        const rest = recent.length - named.length;
        return named.length ? named.join(', ') + (rest > 0 ? `, +${rest} more` : '') : 'none';
    };

    function middleware(req, res, next) {
        const id = ++seq;
        const entry = { method: req.method, path: req.originalUrl.split('?')[0], startedAt: performance.now() };
        inFlight.set(id, entry);
        const done = () => {
            if (!inFlight.delete(id)) return;
            const ms = performance.now() - entry.startedAt;
            // Chat and SSE streams stay open by design.
            if (ms < o.slowMs || String(res.getHeader('content-type') || '').startsWith('text/event-stream')) return;
            log(`[slow] ${entry.method} ${entry.path} ${res.statusCode} ${Math.round(ms)} ms; ${memoryLine()}`);
        };
        res.on('finish', done);
        res.on('close', done);
        next();
    }

    let last = performance.now();
    let rssLogged = (o.rssFloorMb) * MB;
    const timer = setInterval(() => {
        const now = performance.now();
        const lag = now - last - o.tickMs;
        last = now;
        if (lag >= o.stallMs) {
            log(`[stall] event loop blocked ${Math.round(lag)} ms; ${memoryLine()}; in flight: ${describeInFlight()}`);
        }
        const rss = process.memoryUsage.rss();
        if (rss >= rssLogged + o.rssStepMb * MB) {
            rssLogged = rss;
            log(`[memory] new high: ${memoryLine()}; in flight: ${describeInFlight()}`);
        }
    }, o.tickMs);
    timer.unref();

    const gcObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
            if (entry.duration >= o.gcMs) log(`[gc] pause ${Math.round(entry.duration)} ms; ${memoryLine()}`);
        }
    });
    gcObserver.observe({ entryTypes: ['gc'] });

    middleware.stop = () => { clearInterval(timer); gcObserver.disconnect(); };
    return middleware;
}

module.exports = { startStallWatch };
