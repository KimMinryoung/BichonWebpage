// Per-question answer history and the review schedule built on it. Loaded by
// the book page and the hub before their own scripts; pure functions with a
// localStorage wrapper so scripts/smoke-commulingo-schedule.js can run it.
//
// A question enters review the first time it is answered wrong. From then on
// each correct answer pushes its next due date out (1, 3, 7, 14, 30 days for
// consecutive correct answers) and a wrong answer makes it due at once. Three
// correct answers in a row graduate it: `due` becomes null and it leaves the
// queue. A question never answered wrong is never scheduled.
(function(global) {
    var KEY = 'commulingo-answers-v1';
    var INTERVAL_DAYS = [1, 3, 7, 14, 30];
    var GRADUATE_STREAK = 3;
    var DAY_MS = 24 * 60 * 60 * 1000;

    function load() {
        try {
            var parsed = JSON.parse(global.localStorage.getItem(KEY) || '{}');
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (err) {
            return {};
        }
    }

    function save(map) {
        try { global.localStorage.setItem(KEY, JSON.stringify(map)); } catch (err) {}
    }

    function key(lessonId, questionId) {
        return lessonId + '/' + questionId;
    }

    function splitKey(k) {
        var at = k.lastIndexOf('/');
        return { lessonId: k.slice(0, at), questionId: k.slice(at + 1) };
    }

    // Returns the updated entry for one answer. `now` is a timestamp (ms).
    function record(entry, correct, now) {
        now = now || Date.now();
        var next = {
            right: Number(entry && entry.right) || 0,
            wrong: Number(entry && entry.wrong) || 0,
            streak: Number(entry && entry.streak) || 0,
            due: entry && entry.due ? entry.due : null,
            lastCorrect: Boolean(entry && entry.lastCorrect),
            lastAt: null
        };
        if (correct) {
            next.right += 1;
            next.streak += 1;
            if (next.wrong > 0 && next.streak < GRADUATE_STREAK) {
                var days = INTERVAL_DAYS[Math.min(next.streak - 1, INTERVAL_DAYS.length - 1)];
                next.due = new Date(now + days * DAY_MS).toISOString();
            } else {
                next.due = null;
            }
        } else {
            next.wrong += 1;
            next.streak = 0;
            next.due = new Date(now).toISOString();
        }
        next.lastCorrect = correct;
        next.lastAt = new Date(now).toISOString();
        return next;
    }

    function isDue(entry, now) {
        if (!entry || !entry.due) return false;
        var due = Date.parse(entry.due);
        return isFinite(due) && due <= (now || Date.now());
    }

    // Due questions among the given lesson ids (or all when lessonIds is null),
    // oldest due first.
    function dueList(map, lessonIds, now) {
        var allowed = lessonIds ? {} : null;
        (lessonIds || []).forEach(function(id) { allowed[id] = true; });
        var out = [];
        Object.keys(map || {}).forEach(function(k) {
            var entry = map[k];
            if (!isDue(entry, now)) return;
            var ref = splitKey(k);
            if (allowed && !allowed[ref.lessonId]) return;
            out.push({ lessonId: ref.lessonId, questionId: ref.questionId, entry: entry });
        });
        out.sort(function(a, b) { return Date.parse(a.entry.due) - Date.parse(b.entry.due); });
        return out;
    }

    // Next due date among the given lesson ids, or null.
    function nextDue(map, lessonIds) {
        var allowed = lessonIds ? {} : null;
        (lessonIds || []).forEach(function(id) { allowed[id] = true; });
        var best = null;
        Object.keys(map || {}).forEach(function(k) {
            var entry = map[k];
            if (!entry || !entry.due) return;
            if (allowed && !allowed[splitKey(k).lessonId]) return;
            var due = Date.parse(entry.due);
            if (isFinite(due) && (best === null || due < best)) best = due;
        });
        return best;
    }

    // Per key the record answered most recently wins; counts are not summed
    // because both sides carry the same history once they have synced once.
    function merge(local, remote) {
        var out = {};
        var changed = false;
        Object.keys(local || {}).forEach(function(k) { out[k] = local[k]; });
        Object.keys(remote || {}).forEach(function(k) {
            var mine = out[k];
            var theirs = remote[k];
            if (!theirs) return;
            if (!mine || Date.parse(theirs.lastAt || 0) > Date.parse(mine.lastAt || 0)) {
                out[k] = theirs;
                changed = true;
            }
        });
        return { map: out, changed: changed };
    }

    global.CommuLingoSchedule = {
        KEY: KEY,
        INTERVAL_DAYS: INTERVAL_DAYS,
        GRADUATE_STREAK: GRADUATE_STREAK,
        load: load,
        save: save,
        key: key,
        splitKey: splitKey,
        record: record,
        isDue: isDue,
        dueList: dueList,
        nextDue: nextDue,
        merge: merge
    };
})(typeof window !== 'undefined' ? window : this);
