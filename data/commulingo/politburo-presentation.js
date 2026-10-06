const db = require('../../config/database');
const { spanParts, endText } = require('./politburo-store');
const { loadCommuLingoPeople } = require('./people-store');
const { localize } = require('./localize');

// ── Label tables ─────────────────────────────────────────────────────────
// Span/end labels live in politburo-store (the person-page box shares them);
// what stays here is congress-table-only vocabulary.
const IN_KINDS = {
    new: { ko: '선출', en: 'elected' },
    re: { ko: '유임', en: 're-elected' },
    fromCand: { ko: '후보에서 승격', en: 'promoted from candidate' },
    by: { ko: '보선', en: 'by-elected' },
    promoted: { ko: '승격', en: 'promoted' },
    demoted: { ko: '정위원에서 강등', en: 'demoted from full membership' },
};
const OUT_KINDS = {
    nextFull: { ko: '차기 정위원', en: 'full member next term' },
    not: { ko: '차기 미재선', en: 'not re-elected' },
    removed: { ko: '해임', en: 'removed' },
    died: { ko: '사망', en: 'died' },
    assassinated: { ko: '암살', en: 'assassinated' },
    suicide: { ko: '자살', en: 'died by suicide' },
    arrested: { ko: '체포', en: 'arrested' },
    banned: { ko: '1991.11 당 금지', en: 'party banned 1991.11' },
    abolished: { ko: '기구 폐지', en: 'body abolished' },
    resigned: { ko: '사임', en: 'resigned' },
    promotedOut: { ko: '정위원 승격', en: 'promoted to full member' },
    demotedOut: { ko: '후보로 강등', en: 'demoted to candidate' },
};

function dated(labels, event, lang) {
    const label = localize(labels[event.t] || labels.removed, lang);
    return event.d ? `${event.d} ${label}` : label;
}

// One DB round trip for every name on the page; the id set only changes when
// the dataset file does, so the ids are computed from the loaded object.
async function personNames(data) {
    const ids = new Set();
    for (const [key, member] of Object.entries(data.members)) {
        if (!member.name) ids.add(key);
    }
    for (const congress of data.congresses) {
        for (const bucket of ['full', 'candidates']) {
            for (const m of congress.members[bucket]) if (m.p) ids.add(m.p);
        }
    }
    const { rows } = await db.query(
        'SELECT id, name_ko, name_en FROM commulingo_people WHERE id = ANY($1)',
        [[...ids]]
    );
    return new Map(rows.map(row => [row.id, { ko: row.name_ko, en: row.name_en }]));
}

function personCell(key, member, names, lang) {
    const dbName = names.get(key);
    if (dbName) return { name: localize(dbName, lang), href: `/commulingo/people/${key}` };
    const inline = member && member.name;
    return { name: inline ? localize(inline, lang) : key, href: '' };
}

// The roster tables are a pure function of the dataset, the people names,
// and the language; the names come from the people table and are re-read
// only when the people snapshot changes. Both used to be rebuilt (one DB
// query + a full transform of the 96 KB dataset) on every request.
const rosterMemo = new WeakMap(); // body roster data -> { peopleRef, names, byLang: Map(lang -> { eras, congresses }) }

async function rosterFor(data, lang, bodyId = 'politburo') {
    const loaded = await loadCommuLingoPeople();
    let memo = rosterMemo.get(data);
    if (!memo || memo.peopleRef !== loaded.data) {
        memo = { peopleRef: loaded.data, names: await personNames(data), byLang: new Map() };
        rosterMemo.set(data, memo);
    }
    let roster = memo.byLang.get(lang);
    if (!roster) {
        roster = buildRoster(data, memo.names, lang, bodyId);
        memo.byLang.set(lang, roster);
    }
    return roster;
}

function buildRoster(data, names, lang, bodyId) {
    const en = lang === 'en';
    const eras = data.eras.map(era => ({
        id: era.id,
        title: localize(era.title, lang),
        period: era.period,
        intro: localize(era.intro, lang),
        count: era.list.length,
        rows: era.list.map(key => {
            const member = data.members[key];
            const noteParts = [];
            if (member.end) noteParts.push(endText(member.end, lang));
            if (member.note) noteParts.push(localize(member.note, lang));
            return {
                ...personCell(key, member, names, lang),
                tenureParts: spanParts(member.spans, lang, bodyId),
                note: noteParts.join(' · '),
            };
        }),
    }));

    // The header count is the roster as elected at the congress, not the
    // table's row count: a by-elected or mid-term-promoted member joins
    // the table but never sat in the elected composition, and someone
    // demoted mid-term (dated) had left it. At-congress events (elected,
    // re-elected, promoted or demoted at the congress itself) carry no
    // date or are the default.
    const electedAtCongress = m => !m.in
        || ['new', 're', 'fromCand'].includes(m.in.t)
        || (m.in.t === 'demoted' && !m.in.d);

    const congresses = data.congresses.map(congress => {
        const buckets = {};
        const elected = {};
        for (const bucket of ['full', 'candidates']) {
            elected[bucket] = congress.members[bucket].filter(electedAtCongress).length;
            // The members elected at the congress come first, alphabetical;
            // mid-term joiners (by-elected, promoted, demoted from full)
            // follow in the order they joined. Among a candidate table's
            // congress-elected members, those promoted to full membership
            // mid-term lead, earliest promotion first, and are marked so the
            // table tints them in the full-member colour.
            buckets[bucket] = congress.members[bucket].map(m => {
                const key = m.p || '';
                const member = key && data.members[key];
                const cand = bucket === 'candidates';
                const promotedOn = cand && m.out && m.out.t === 'promotedOut' ? (m.out.d || '') : null;
                return {
                    ...personCell(key, member || m, names, lang),
                    in: m.in ? dated(IN_KINDS, m.in, lang) : localize(IN_KINDS.re, lang),
                    out: m.out ? dated(OUT_KINDS, m.out, lang) : '',
                    promoted: promotedOn !== null,
                    promotedOn,
                    joinedOn: electedAtCongress(m) ? null : (m.in.d || ''),
                };
            }).sort((a, b) => {
                const late = (a.joinedOn !== null) - (b.joinedOn !== null);
                if (late) return late;
                if (a.joinedOn !== null && a.joinedOn !== b.joinedOn) return a.joinedOn < b.joinedOn ? -1 : 1;
                if (a.joinedOn === null && a.promoted !== b.promoted) return a.promoted ? -1 : 1;
                if (a.joinedOn === null && a.promoted && a.promotedOn !== b.promotedOn) return a.promotedOn < b.promotedOn ? -1 : 1;
                return a.name.localeCompare(b.name, en ? 'en' : 'ko');
            });
        }
        return {
            n: congress.n,
            title: localize(congress.label, lang),
            date: congress.date,
            note: congress.note ? localize(congress.note, lang) : '',
            full: buckets.full,
            candidates: buckets.candidates,
            electedFull: elected.full,
            electedCandidates: elected.candidates,
        };
    });
    return { eras, congresses, timeline: buildTimeline(data, names, lang, bodyId) };
}

// The tenure chart: one row per member, a bar per stint on a shared year axis.
// Positions are percentages of the body's range, so the chart is plain HTML
// that scales with its container. "YYYY.MM" months become fractional years;
// a stint's end month is included.
function monthValue(text, endOfMonth) {
    const [year, month] = String(text).split('.').map(Number);
    if (!year) return null;
    return year + ((month || 1) - 1) / 12 + (endOfMonth ? 1 / 12 : 0);
}

function buildTimeline(data, names, lang, bodyId) {
    const rows = [];
    let min = Infinity, max = -Infinity;
    for (const [key, member] of Object.entries(data.members)) {
        const stints = (member.spans || []).filter(span => span.f).map(span => ({
            kind: span.k === 'cand' ? 'cand' : 'full',
            from: monthValue(span.f, false),
            to: span.t ? monthValue(span.t, true) : null,
            label: spanParts([span], lang, bodyId)[0],
        }));
        if (!stints.length) continue;
        stints.forEach(stint => {
            min = Math.min(min, stint.from);
            max = Math.max(max, stint.to || stint.from);
        });
        rows.push({ ...personCell(key, member, names, lang), stints, first: stints[0].from });
    }
    const start = Math.floor(min);
    const end = Math.ceil(max);
    const span = end - start || 1;
    const pct = value => Math.round(((value - start) / span) * 10000) / 100;
    const step = span > 40 ? 10 : 5;
    const ticks = [];
    for (let year = Math.ceil(start / step) * step; year <= end; year += step) ticks.push({ year, left: pct(year) });
    rows.sort((a, b) => a.first - b.first || a.name.localeCompare(b.name, lang === 'en' ? 'en' : 'ko'));
    return {
        start,
        end,
        ticks,
        rows: rows.map(row => ({
            name: row.name,
            href: row.href,
            bars: row.stints.map(stint => {
                const left = pct(stint.from);
                const right = pct(stint.to == null ? end : stint.to);
                return { kind: stint.kind, label: `${row.name} · ${stint.label}`, left, width: Math.max(right - left, 0.4) };
            }),
        })),
    };
}

module.exports = { rosterFor };
