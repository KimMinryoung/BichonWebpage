const fs = require('fs');
const path = require('path');
const { localize } = require('./localize');

// The Politburo membership dataset (data/commulingo/politburo.json): a member
// registry with tenure spans, era sections over it, and per-congress tables.
// Like the genealogy charts it lives under the host-mounted data/ directory
// and is cached by file mtime, so correcting a date or filling in a person id
// needs no image rebuild.
const FILE = path.join(__dirname, 'politburo.json');

let cache = null; // { mtimeMs, data }
// Every person page calls this; re-stat at most twice a second (same
// debounce as the docs manifest) while keeping the mtime live-reload.
const FRESHNESS_MS = 500;
let checkedAt = 0;

function loadPolitburo() {
    if (cache && Date.now() - checkedAt < FRESHNESS_MS) return cache.data;
    const stat = fs.statSync(FILE);
    checkedAt = Date.now();
    if (!cache || cache.mtimeMs !== stat.mtimeMs) {
        cache = { mtimeMs: stat.mtimeMs, data: JSON.parse(fs.readFileSync(FILE, 'utf8')) };
    }
    return cache.data;
}

// ── Shared label tables ──────────────────────────────────────────────────
// The dataset stores structured spans and end events, not prose; both the
// roster page and the person-page box render from these.
const SPAN_KINDS = {
    full: { ko: '정위원', en: 'Full member' },
    cand: { ko: '후보위원', en: 'Candidate' },
    orig: { ko: '1917.10 봉기 정치국', en: 'October 1917 Politburo' },
};
const END_KINDS = {
    died: { ko: '재임 중 사망', en: 'died in office' },
    assassinated: { ko: '암살', en: 'assassinated' },
    suicide: { ko: '자살', en: 'died by suicide' },
    arrested: { ko: '체포', en: 'arrested' },
    removed: { ko: '해임', en: 'removed' },
    retired: { ko: '퇴임', en: 'retired' },
    not: { ko: '미재선', en: 'not re-elected' },
    resigned: { ko: '서기장 사임', en: 'resigned as General Secretary' },
    banned: { ko: '1991.11 당 활동 금지까지 재임', en: 'served until the party ban of 1991.11' },
};

function endText(event, lang) {
    const label = localize(END_KINDS[event.t] || END_KINDS.removed, lang);
    return event.d ? `${event.d} ${label}` : label;
}

// One string per stint; callers keep each unbreakable and break lines only
// between stints.
function spanParts(spans, lang) {
    return spans.map(span => {
        const kind = localize(SPAN_KINDS[span.k] || SPAN_KINDS.full, lang);
        if (!span.f) return kind;
        return `${kind} ${span.f}–${span.t || ''}`;
    });
}

// The person-page box: this person's Politburo career, or null when the
// dictionary id never sat on the body.
function politburoCareerFor(personId, lang) {
    const member = loadPolitburo().members[personId];
    if (!member || member.name) return null;
    const noteParts = [];
    if (member.end) noteParts.push(endText(member.end, lang));
    if (member.note) noteParts.push(localize(member.note, lang));
    return {
        parts: spanParts(member.spans, lang),
        note: noteParts.join(' · '),
    };
}

module.exports = { loadPolitburo, spanParts, endText, politburoCareerFor };
