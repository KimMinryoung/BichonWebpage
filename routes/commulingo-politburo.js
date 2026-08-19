const express = require('express');
const db = require('../config/database');
const { loadPolitburo, spanParts, endText } = require('../data/commulingo/politburo-store');
const { localize } = require('../data/commulingo/localize');

const router = express.Router();

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
    resigned: { ko: '1991.08 사임', en: 'resigned 1991.08' },
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

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const en = lang === 'en';
        const data = loadPolitburo();
        const names = await personNames(data);

        const eras = data.eras.map(era => ({
            id: era.id,
            title: localize(era.title, lang),
            period: era.period,
            intro: localize(era.intro, lang),
            rows: era.list.map(key => {
                const member = data.members[key];
                const noteParts = [];
                if (member.end) noteParts.push(endText(member.end, lang));
                if (member.note) noteParts.push(localize(member.note, lang));
                return {
                    ...personCell(key, member, names, lang),
                    tenureParts: spanParts(member.spans, lang),
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
                buckets[bucket] = congress.members[bucket].map(m => {
                    const key = m.p || '';
                    const member = key && data.members[key];
                    return {
                        ...personCell(key, member || m, names, lang),
                        in: m.in ? dated(IN_KINDS, m.in, lang) : localize(IN_KINDS.re, lang),
                        out: m.out ? dated(OUT_KINDS, m.out, lang) : '',
                    };
                }).sort((a, b) => a.name.localeCompare(b.name, en ? 'en' : 'ko'));
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

        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-politburo', {
            intro: localize(data.intro, lang),
            sources: localize(data.sources, lang),
            eras,
            congresses,
            pageTitle: en ? 'The Soviet Politburo — CommuLingo' : '소련 정치국 — CommuLingo',
            pageDescription: en
                ? 'Membership of the Politburo and Presidium of the CPSU, 1917–1991, by era and by party congress.'
                : '1917년부터 1991년까지 소련 공산당 정치국·간부회의 구성원을 시기별·당대회 기수별로 정리한 표.',
            pagePath: '/commulingo/politburo',
        });
    } catch (err) {
        console.error('commulingo politburo:', err);
        res.status(500).send('Failed to load the Politburo page');
    }
});

module.exports = router;
