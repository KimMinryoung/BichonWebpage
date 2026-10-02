// Public data only. Never cache session state, CSRF tokens or complete HTML.
// Once a key has a value it is always served immediately; refreshes run in the
// background, so no visitor waits on a read except the first one after start.
// An entry goes stale when invalidate() is called for it (a change
// notification), when the caller's version token differs (an in-memory
// snapshot was replaced), or after refreshMs as a safety net for missed
// notifications. Age starts before the read so slow reads cannot extend it.
function createPublicModelCache({ refreshMs = 10 * 60000, retryMs = 30000, now = Date.now } = {}) {
    const entries = new Map();

    function stale(entry) {
        return entry.loadedGeneration !== entry.generation
            || entry.version !== entry.wantedVersion
            || now() - entry.at >= refreshMs;
    }

    function refresh(entry) {
        if (entry.pending) return entry.pending;
        const startedAt = now();
        const { generation, wantedVersion: version, load } = entry;
        entry.pending = Promise.resolve().then(load).then(value => {
            Object.assign(entry, { value, version, at: startedAt, hasValue: true, loadedGeneration: generation, failedAt: null });
            return value;
        }, error => {
            // A failed refresh leaves both the data and its age intact.
            entry.failedAt = now();
            throw error;
        }).finally(() => {
            entry.pending = null;
            // A change that arrived during a successful read needs another read.
            if (entry.hasValue && entry.failedAt == null && entry.loadedGeneration !== entry.generation) {
                refresh(entry).catch(() => {});
            }
        });
        return entry.pending;
    }

    function get(key, load, { version } = {}) {
        let entry = entries.get(key);
        if (!entry) {
            entry = { hasValue: false, pending: null, generation: 0, loadedGeneration: -1, failedAt: null };
            entries.set(key, entry);
        }
        entry.load = load;
        entry.wantedVersion = version;
        if (!entry.hasValue) return refresh(entry);
        const retryWait = entry.failedAt != null && now() - entry.failedAt < retryMs;
        if (stale(entry) && !retryWait) refresh(entry).catch(() => {});
        return Promise.resolve(entry.value);
    }

    // Marks matching keys stale and rereads those that already hold a value, so
    // the next visitor sees the change without waiting for it.
    function invalidate(matches = () => true) {
        for (const [key, entry] of entries) {
            if (!matches(key)) continue;
            entry.generation++;
            entry.failedAt = null;
            if (entry.hasValue && entry.load) refresh(entry).catch(() => {});
        }
    }

    return { get, invalidate };
}
module.exports = { createPublicModelCache };
