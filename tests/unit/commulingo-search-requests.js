const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const timers = new Map();
let nextTimer = 0;
const transports = [];
const context = {
    window: {}, AbortController,
    setTimeout(callback) { const id = ++nextTimer; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
    // Intentionally ignores abort, to exercise the stale-response guard.
    fetch(url, options) {
        return new Promise((resolve, reject) => transports.push({ url, options, resolve, reject }));
    },
};
vm.runInNewContext(fs.readFileSync('public/js/commulingo-search-utils.js', 'utf8'), context);
const requests = context.window.__commuSearch.createRequests();
function flush() { const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback()); }
(async () => {
    let calls = 0;
    requests.schedule(() => calls++);
    requests.cancel();
    flush();
    assert.equal(calls, 0, 'cancelled debounce must not run');
    let oldRequest, currentRequest;
    requests.schedule(request => { oldRequest = request; }); flush();
    const old = oldRequest.json('/old');
    const oldRejected = assert.rejects(old, { name: 'AbortError' });
    requests.schedule(request => { currentRequest = request; }); flush();
    assert(transports[0].options.signal.aborted);
    const current = currentRequest.json('/current');
    transports[1].resolve({ ok: true, json: async () => ({ result: 'current' }) });
    assert.equal((await current).result, 'current');
    transports[0].resolve({ ok: true, json: async () => ({ result: 'stale' }) });
    await oldRejected;
    await assert.rejects(oldRequest.json('/stale-next-page'), { name: 'AbortError' });
    assert.equal(transports.length, 2, 'stale pages must not fetch');
    const next = currentRequest.json('/next');
    transports[2].resolve({ ok: false, status: 500 });
    await assert.rejects(next, /HTTP 500/);
    const a = currentRequest.json('/role'), b = currentRequest.json('/description');
    const rejected = Promise.all([assert.rejects(a, { name: 'AbortError' }), assert.rejects(b, { name: 'AbortError' })]);
    requests.cancel();
    assert(transports[3].options.signal.aborted && transports[4].options.signal.aborted);
    transports[3].reject(new Error('late network error'));
    transports[4].resolve({ ok: true, json: async () => ({}) });
    await rejected;
    console.log('shared search requests: debounce, cancellation, stale responses, paging and errors passed');
})().catch(err => { console.error(err); process.exitCode = 1; });
