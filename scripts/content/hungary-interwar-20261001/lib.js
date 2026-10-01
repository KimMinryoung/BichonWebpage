// Shared builders for the Hungary 1919–1944 batch (2026-10-01). Each event
// module (event-*.js) exports { event, people, terms } built with these
// helpers; build.js assembles the batch JSON files.
const W = t => 'https://en.wikipedia.org/wiki/' + t;
const HU = t => 'https://hu.wikipedia.org/wiki/' + t;

// sections: [{ heading: {ko,en}, paragraphs: [{ ko, en, sources: [url] }] }]
function sourcesOf(sections) {
    const sources = [];
    for (const s of sections) for (const p of s.paragraphs) for (const u of p.sources) if (!sources.includes(u)) sources.push(u);
    return sources;
}
const bodyOf = (sections, sources, lang) => sections.map(s => '## ' + s.heading[lang] + '\n\n' + s.paragraphs.map(p =>
    p[lang] + ' ' + p.sources.map(u => `[${sources.indexOf(u) + 1}](${u})`).join(' ')).join('\n\n')).join('\n\n');

// timeline rows: [date, titleKo, titleEn, bodyKo, bodyEn, country|[countries], geo?]
const P = (lat, lng, ko, en) => ({ kind: 'point', lat, lng, label: { ko, en } });
const timelineOf = rows => rows.map(([date, tko, ten, bko, ben, country, geo]) => ({
    date, title: { ko: tko, en: ten }, body: { ko: bko, en: ben },
    country: Array.isArray(country) ? country : [country], ...(geo ? { geo } : {}),
}));

// people rows: [personId, relationKind, relationKo, relationEn, noteKo, noteEn, side?]
const relationsOf = rows => rows.map(([person_id, relation_kind, relation_ko, relation_en, note_ko, note_en, side], sort_order) => ({
    person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en, ...(side ? { side } : {}),
}));

// Assemble an event row for scripts/apply-history-events.js.
function event({ id, title, period, sortOrder, question, summary, outcome, sections, timeline, locations, countries,
    relations = {}, noAutoLink = [], linkExpressions = [], focus = null, sides = null, people }) {
    const sources = sourcesOf(sections);
    return {
        id, expected: null,
        fields: {
            title_ko: title.ko, title_en: title.en, period_label: period, sort_order: sortOrder,
            question_ko: question.ko, question_en: question.en, summary_ko: summary.ko, summary_en: summary.en,
            outcome_ko: outcome.ko, outcome_en: outcome.en,
            body_ko: bodyOf(sections, sources, 'ko'), body_en: bodyOf(sections, sources, 'en'),
            timeline: timelineOf(timeline), sources,
            locations: locations.map(([ko, en, lat, lng, kind]) => ({ label: { ko, en }, lat, lng, kind })),
            countries, relations, no_auto_link: noAutoLink, link_expressions: linkExpressions.map(([lang, text]) => ({ text, lang, role: 'identity', policy: 'search' })), focus, sides,
        },
        sections, people: relationsOf(people),
    };
}

// A person card in the scripts/commulingo-people-upsert payload shape.
// Every fact needs a cited excerpt: `facts` gives one { excerpt, locator } per
// fact field (years, citizenship, nationalOrigin, bio may have several), all from `sources`.
// activities: [{ functionId, affiliationId, relation, startYear, endYear, primary, claim, excerpt, locator, source? }]
function person({ id, groupId = 'world-interwar', given, family, nativeName, years, citizenship = 'hungary',
    origin = 'hungary', epithet, bio, fate, aliases, sources, facts, activities, career = [] }) {
    const evidence = [];
    for (const [field, list] of Object.entries(facts)) for (const f of [].concat(list)) {
        evidence.push({ field, claim: f.claim, source: f.source || sources[0], locator: f.locator, excerpt: f.excerpt });
    }
    return {
        id, groupId,
        givenName: { ko: given[0], en: given[1] }, familyName: { ko: family[0], en: family[1] },
        nativeName, years,
        citizenship: typeof citizenship === 'string' ? { code: citizenship } : citizenship,
        nationalOrigin: typeof origin === 'string' ? { code: origin } : origin,
        epithet: { ko: epithet[0], en: epithet[1] },
        bio: { ko: bio[0], en: bio[1] },
        fate: { kind: fate[0], label: { ko: fate[1], en: fate[2] } },
        aliases, sources, evidence,
        activities: activities.map(a => ({
            functionId: a.functionId, affiliationId: a.affiliationId, affiliationStatus: 'confirmed',
            relation: a.relation || 'service', startYear: a.startYear ?? null, endYear: a.endYear ?? null, primary: !!a.primary,
            evidence: [{ source: a.source || sources[0], locator: a.locator, claim: a.claim, excerpt: a.excerpt }],
        })),
        career: career.map(([y, ko, en]) => ({ y, r: { ko, en } })),
    };
}

// A glossary term for term-editorial-service submitTermEdit (category: one of
// contemporary culture economy factions international korea nationalities party-state repression theory).
function term({ id, ko, en, category, period, startYear, endYear, definition, body, aliases, people = [], events = [], sources, locator }) {
    const ev = (field, claim) => ({ field, claim, source: sources[0], locator });
    return {
        id, sources,
        fields: {
            term: { ko, en }, category, period: { ko: period, en: period }, startYear, endYear,
            definition: { ko: definition[0], en: definition[1] }, body: { ko: body[0], en: body[1] },
            aliases, people, events,
            evidence: [ev('definition', definition[1]), ev('body', body[1].slice(0, 300)), ev('period', period),
                ev('startYear', String(startYear)), ev('endYear', String(endYear))],
        },
    };
}

module.exports = { W, HU, P, event, person, term };
