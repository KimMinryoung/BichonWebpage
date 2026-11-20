// stall-watch names the in-flight request when the event loop was blocked,
// and logs a request that blocked the loop itself once it finishes.
const assert = require('node:assert');
const { EventEmitter } = require('node:events');
const { startStallWatch } = require('../../middleware/stall-watch');

const lines = [];
const watch = startStallWatch({ tickMs: 20, stallMs: 150, slowMs: 100, log: line => lines.push(line) });

function request(path) {
    const res = Object.assign(new EventEmitter(), { statusCode: 200, getHeader: () => undefined });
    watch({ method: 'GET', originalUrl: path + '?x=1' }, res, () => {});
    return res;
}
const busy = ms => { const end = Date.now() + ms; while (Date.now() < end); };

(async () => {
    const pending = request('/commulingo/people/pending');
    const blocker = request('/commulingo/genealogy');
    busy(300);
    blocker.emit('finish');
    await new Promise(resolve => setTimeout(resolve, 60));

    const slow = lines.find(l => l.startsWith('[slow] GET /commulingo/genealogy 200'));
    assert.ok(slow, 'slow request logged: ' + lines.join('\n'));
    const stall = lines.find(l => l.startsWith('[stall] event loop blocked'));
    assert.ok(stall, 'stall logged: ' + lines.join('\n'));
    assert.match(stall, /in flight: GET \/commulingo\/people\/pending \(\d+ ms\)/);
    assert.doesNotMatch(stall, /genealogy/);

    pending.emit('close');
    watch.stop();
    console.log('stall-watch ok');
})().catch(err => { console.error(err); process.exit(1); });
