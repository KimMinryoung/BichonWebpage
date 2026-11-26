// Keeps the auto-link indexes (linkify.js getLinkIndexes) built ahead of the
// readers. They are rebuilt lazily whenever a store refresh hands back new
// data, and that rebuild (seconds of CPU, both languages) used to land on the
// first reader of a reference document or event page after a deploy or an
// edit: an occasional 2 s page. This checks every few seconds and rebuilds in
// the background; when nothing changed the check is a few reference compares.
const { getLinkIndexes } = require('./linkify');

let running = false;
async function warmLinkIndexes() {
    if (running) return;
    running = true;
    try {
        await getLinkIndexes('ko');
        await getLinkIndexes('en');
    } catch (err) {
        console.error('[link indexes] warm-up failed:', err.message);
    } finally {
        running = false;
    }
}

function startLinkIndexWarm(intervalMs = 10 * 1000) {
    setTimeout(warmLinkIndexes, 3000).unref();
    setInterval(warmLinkIndexes, intervalMs).unref();
}

module.exports = { startLinkIndexWarm, warmLinkIndexes };
