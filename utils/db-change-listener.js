// Delivers table-change notifications (channel public_cache, sent by the
// statement triggers of migration 256) to in-memory caches. Holds one pool
// connection for LISTEN. While it is down notifications are lost, so every
// (re)connection after the first tells all handlers that anything may have
// changed; the caches' own safety interval covers the gap.
const CHANNEL = 'public_cache';
const handlers = [];
let started = false;

// tables: names as sent by the trigger (TG_TABLE_NAME), or null for "any".
function onTableChange(tables, handler) {
    handlers.push({ tables: tables && new Set(tables), handler });
}

function dispatch(table) {
    for (const { tables, handler } of handlers) {
        if (table && tables && !tables.has(table)) continue;
        Promise.resolve().then(() => handler(table)).catch(err => {
            console.error('[public cache] change handler failed:', err.message);
        });
    }
}

function startDbChangeListener(pool, { retryMs = 5000 } = {}) {
    if (started) return;
    started = true;
    let connectedBefore = false;
    async function connect() {
        let client;
        let dead = false;
        const fail = err => {
            if (dead) return;
            dead = true;
            console.error('[public cache] listener connection lost:', err.message);
            if (client) client.release(err);
            setTimeout(connect, retryMs).unref();
        };
        try {
            client = await pool.connect();
            client.on('notification', message => {
                if (message.channel === CHANNEL) dispatch(message.payload || null);
            });
            client.on('error', fail);
            await client.query(`LISTEN ${CHANNEL}`);
            if (connectedBefore) dispatch(null);
            connectedBefore = true;
        } catch (err) {
            fail(err);
        }
    }
    connect();
}

module.exports = { onTableChange, startDbChangeListener, dispatchTableChange: dispatch };
