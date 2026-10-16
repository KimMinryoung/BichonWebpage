/* The play log of a war game, sent to the server (POST /games/plays,
   routes/war-plays.js) so real play can steer the rules. A game is a run
   (an id kept beside the save); a battle retried after a defeat is a new
   attempt of it. The whole decision log goes each time the war moves on
   (a season sent, a phase changed, a battle turn), and once more when the
   page is left. Sending never stands in the game's way: a failure is
   dropped, except at the war's end, which is tried again a few times and,
   if it still did not go, on the next visit. */
(function (root) {
    'use strict';

    const URL = '/games/plays';
    const RETRY_MS = [2000, 5000, 15000, 30000, 60000];
    const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    function uuid() {
        if (root.crypto && root.crypto.randomUUID) return root.crypto.randomUUID();
        const b = new Uint8Array(16);
        root.crypto.getRandomValues(b);
        b[6] = (b[6] & 0x0f) | 0x40;
        b[8] = (b[8] & 0x3f) | 0x80;
        const h = Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
        return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
    }

    // scenario: its id; key: the save's localStorage key (the run is kept
    // under key + '-play').
    function create(scenario, key) {
        const META = key + '-play';
        let meta = null;
        let mark = null;        // what the war looked like at the last send
        let sentLength = -1;    // the log's length at the last send
        let retry = 0;
        try { meta = JSON.parse(localStorage.getItem(META)); } catch (_) { meta = null; }
        if (!meta || !UUID.test(meta.run || '')) meta = null;

        const keep = () => { try { localStorage.setItem(META, JSON.stringify(meta)); } catch (_) { /* sent without a kept run */ } };
        function ensure() {
            if (!meta) { meta = { run: uuid(), attempt: 0, seq: 0, pending: false }; keep(); }
            return meta;
        }

        // Sends a save (its text); resolves true once the server has it or
        // has refused it for good (a log it cannot use), false to try again.
        function post(saveText, keepalive) {
            const m = ensure();
            m.seq += 1;
            keep();
            let save;
            try { save = JSON.parse(saveText); } catch (_) { return Promise.resolve(true); }
            const body = JSON.stringify({
                runId: m.run, attempt: m.attempt, seq: m.seq, scenario, save,
                narrow: root.matchMedia('(max-width: 900px)').matches,
            });
            try {
                return root.fetch(URL, {
                    method: 'POST', credentials: 'same-origin', keepalive: keepalive && body.length < 60000,
                    headers: { 'Content-Type': 'application/json', 'X-War-Play': '1' }, body,
                }).then(r => r.status < 500 && r.status !== 429, () => false);
            } catch (_) {
                return Promise.resolve(false);
            }
        }

        // The war's end: tried until it goes, a few times, and remembered
        // for the next visit until then.
        function sendEnding(saveText) {
            ensure().pending = true;
            keep();
            root.clearTimeout(retry);
            let tries = 0;
            const attempt = () => post(saveText).then(ok => {
                if (ok) { meta.pending = false; keep(); return; }
                if (tries < RETRY_MS.length) retry = root.setTimeout(attempt, RETRY_MS[tries++]);
            });
            attempt();
        }

        // After every saved order: send when the war has moved on.
        function track(s, saveText) {
            const now = [s.records.length, s.phase, s.battle ? s.battle.def.id + ':' + s.battle.turn : '', Object.keys(s.battles).length].join(':');
            if (now === mark) return;
            mark = now;
            sentLength = s.log.length;
            if (s.phase === 'done') sendEnding(saveText);
            else post(saveText);
        }

        // A new game is a new run; a battle tried again, a new attempt.
        function begin() { meta = null; ensure(); mark = null; }
        function retried() { ensure().attempt += 1; meta.pending = false; keep(); mark = null; }

        // Leaving the page mid-season: what was done since the last send.
        function leave(s, saveText) {
            if (!s || s.log.length === sentLength || s.phase === 'done') return;
            sentLength = s.log.length;
            post(saveText, true);
        }

        // An ending that never went: once more, now.
        function resume(saveText) {
            if (meta && meta.pending && saveText) sendEnding(saveText);
        }

        return { track, begin, retried, leave, resume };
    }

    root.WarReport = { create };
})(typeof window !== 'undefined' ? window : globalThis);
