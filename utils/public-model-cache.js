// Public data only. Never cache session state, CSRF tokens or complete HTML.
// Age starts before the read so slow reads cannot extend the freshness budget.
function createPublicModelCache({ freshMs = 60000, maxAgeMs = 240000, now = Date.now } = {}) {
    const entries = new Map();
    function get(key, load) {
        let entry = entries.get(key);
        if (!entry) {
            entry = { hasValue: false, pending: null };
            entries.set(key, entry);
        }
        const age = entry.hasValue ? now() - entry.at : Infinity;
        if (age < freshMs) return Promise.resolve(entry.value);
        if (!entry.pending) {
            const startedAt = now();
            entry.pending = Promise.resolve().then(load).then(value => {
                entry.value = value;
                entry.at = startedAt;
                entry.hasValue = true;
                return value;
            }).finally(() => { entry.pending = null; });
        }
        if (age < maxAgeMs) {
            // A failed background refresh must leave both the data and its age intact.
            entry.pending.catch(() => {});
            return Promise.resolve(entry.value);
        }
        return entry.pending;
    }
    return { get };
}
module.exports = { createPublicModelCache };
