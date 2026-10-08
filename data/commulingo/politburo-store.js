const { localize } = require('./localize');
const { getDataDocument } = require('./data-documents');

// The Central Committee body rosters (party-bodies.js): politburo, secretariat
// and orgburo — a member registry with tenure spans, era sections over it, and
// per-congress tables. Each is a database document (commulingo_data_documents,
// key = body id), so correcting a date or filling in a person id needs no
// commit or deploy.
const { BODIES, BODY_IDS } = require('./party-bodies');

// null when the body has no document yet.
function loadBody(bodyId) {
    if (!BODIES[bodyId]) throw new Error(`unknown party body ${bodyId}`);
    return getDataDocument(bodyId);
}

function loadPolitburo() {
    return loadBody('politburo');
}

// ── Shared label tables ──────────────────────────────────────────────────
// The dataset stores structured spans and end events, not prose; both the
// roster page and the person-page box render from these.
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
    abolished: { ko: '기구 폐지까지 재임', en: 'served until the body was abolished' },
};

function endText(event, lang) {
    const label = localize(END_KINDS[event.t] || END_KINDS.removed, lang);
    return event.d ? `${event.d} ${label}` : label;
}

// One string per stint; callers keep each unbreakable and break lines only
// between stints. Span labels are the body's (정위원 / 서기 / 위원 …).
function spanParts(spans, lang, bodyId = 'politburo') {
    const kinds = BODIES[bodyId].spans;
    return spans.map(span => {
        const kind = localize(kinds[span.k] || kinds.full, lang);
        if (!span.f) return kind;
        return `${kind} ${span.f}–${span.t || ''}`;
    });
}

function careerFor(bodyId, personId, lang) {
    const data = loadBody(bodyId);
    const member = data && data.members[personId];
    if (!member || member.name) return null;
    const noteParts = [];
    if (member.end) noteParts.push(endText(member.end, lang));
    if (member.note) noteParts.push(localize(member.note, lang));
    return {
        parts: spanParts(member.spans, lang, bodyId),
        note: noteParts.join(' · '),
    };
}

// The person-page box: this person's Politburo career, or null when the
// dictionary id never sat on the body.
function politburoCareerFor(personId, lang) {
    return careerFor('politburo', personId, lang);
}

// The person-page boxes for every body the person sat on, in BODIES order.
function bodyCareersFor(personId, lang) {
    return BODY_IDS.map(bodyId => {
        const career = careerFor(bodyId, personId, lang);
        return career && { bodyId, title: localize(BODIES[bodyId].title, lang), href: BODIES[bodyId].path, ...career };
    }).filter(Boolean);
}

module.exports = { loadBody, loadPolitburo, spanParts, endText, politburoCareerFor, bodyCareersFor };

// The roster cards of the office index: bodies whose file is present.
function availableBodies(lang) {
    return BODY_IDS.filter(bodyId => loadBody(bodyId)).map(bodyId => ({
        id: bodyId,
        href: BODIES[bodyId].path,
        officeId: BODIES[bodyId].officeId,
        range: BODIES[bodyId].range,
        title: localize(BODIES[bodyId].title, lang),
        description: localize(BODIES[bodyId].description, lang),
    }));
}

module.exports.availableBodies = availableBodies;
