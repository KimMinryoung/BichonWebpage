#!/usr/bin/env node
// Assembles the Chinese-history content batch from its source modules into
// scripts/content/china-history-20260921.json, the canonical batch that
// scripts/apply-china-history.js reads. Run `node build.js` from this
// directory after editing any module; the JSON is committed beside them.
//
// Modules:
//   people-*.js  — arrays of compact person records (see person() below)
//   events-*.js  — arrays of event records with structured sections
//   terms.js     — glossary entries
const fs = require('fs');
const path = require('path');

const BATCH_ID = 'china-history-20260921';

function localizedPair(value, what) {
    if (!value || typeof value.ko !== 'string' || typeof value.en !== 'string' || !value.ko.trim() || !value.en.trim()) {
        throw new Error(`${what}: ko/en text required`);
    }
    return { ko: value.ko.trim(), en: value.en.trim() };
}

// Compact person record → Admin API create payload (+ sections). Evidence for
// the four fact fields the editorial contract requires (bio, years,
// citizenship, nationalOrigin) is derived from the record's primary source.
function person(record) {
    const { id, group, family, given, native, years, citizenship, origin, originLabel, role,
        epithet, bio, fate, aliases, career, sources, locator, sections } = record;
    if (!id || !group || !family || !native || !years || !role || !sources?.length || !locator) {
        throw new Error(`person ${id || '?'}: id, group, family, native, years, role, sources, locator required`);
    }
    const primary = sources[0];
    const bioPair = localizedPair(bio, `${id}.bio`);
    const payload = {
        id,
        groupId: group,
        familyName: localizedPair(family, `${id}.family`),
        givenName: given ? localizedPair(given, `${id}.given`) : { ko: '', en: '' },
        nativeName: native,
        years,
        citizenship: { code: citizenship || 'china' },
        nationalOrigin: originLabel
            ? { code: origin || citizenship || 'china', label: localizedPair(originLabel, `${id}.originLabel`) }
            : { code: origin || citizenship || 'china' },
        role: typeof role === 'string' ? { category: role } : role,
        epithet: localizedPair(epithet, `${id}.epithet`),
        bio: bioPair,
        sources,
        evidence: [
            { field: 'bio', claim: bioPair.en, source: primary, locator },
            { field: 'years', claim: years, source: primary, locator: `${locator}; life dates in the lead` },
            { field: 'citizenship', claim: `${id}: citizenship ${citizenship || 'china'}`, source: primary, locator },
            { field: 'nationalOrigin', claim: `${id}: national background ${origin || citizenship || 'china'}`, source: primary, locator },
        ],
    };
    if (fate) payload.fate = { kind: fate.kind, label: localizedPair(fate.label, `${id}.fate`) };
    if (aliases) payload.aliases = aliases;
    if (career) payload.career = career.map(entry => ({ y: entry.y, r: localizedPair(entry.r, `${id}.career`) }));
    const builtSections = (sections || []).map(section => {
        const body = localizedPair(section.body, `${id}/${section.slug}.body`);
        const sectionSources = section.sources || sources;
        return {
            slug: section.slug,
            sortOrder: section.sortOrder,
            heading: localizedPair(section.heading, `${id}/${section.slug}.heading`),
            body,
            sources: sectionSources,
            evidence: [{ field: 'body', claim: body.en.slice(0, 300), source: sectionSources[0], locator: section.locator || locator }],
        };
    });
    return { ...payload, sections: builtSections };
}

// Event record → history event row fields + curated people relations. Each
// paragraph names its sources; the body cites them as numbered links against
// the event's source list, which is the ordered union of every paragraph's
// sources (the French batch's format).
function event(record) {
    const { id, sortOrder, period, countries, title, question, summary, outcome, locations, timeline, sections, people, related } = record;
    if (!id || !Number.isInteger(sortOrder) || !period || !countries?.length || !sections?.length || !timeline?.length) {
        throw new Error(`event ${id || '?'}: id, sortOrder, period, countries, sections, timeline required`);
    }
    const sources = [];
    const index = url => {
        if (!/^https:\/\//.test(url)) throw new Error(`${id}: source must be https: ${url}`);
        let n = sources.indexOf(url);
        if (n < 0) { sources.push(url); n = sources.length - 1; }
        return n + 1;
    };
    const cite = (urls, lang) => urls.map(u => `[${lang === 'ko' ? '근거' : 'Source'} ${index(u)}](${u})`).join(' · ');
    const body = { ko: '', en: '' };
    for (const lang of ['ko', 'en']) {
        body[lang] = sections.map(section => {
            const heading = localizedPair(section.heading, `${id}.section`);
            if (!section.paragraphs?.length) throw new Error(`${id}/${heading.en}: paragraphs required`);
            return `## ${heading[lang]}\n\n` + section.paragraphs.map(p => {
                const text = localizedPair(p, `${id}/${heading.en}.paragraph`);
                if (!p.sources?.length) throw new Error(`${id}/${heading.en}: paragraph sources required`);
                return `${text[lang]} ${cite(p.sources, lang)}`;
            }).join('\n\n');
        }).join('\n\n');
    }
    const titlePair = localizedPair(title, `${id}.title`);
    const fields = {
        title_ko: titlePair.ko, title_en: titlePair.en,
        period_label: period, sort_order: sortOrder,
        question_ko: localizedPair(question, `${id}.question`).ko, question_en: localizedPair(question, `${id}.question`).en,
        summary_ko: localizedPair(summary, `${id}.summary`).ko, summary_en: localizedPair(summary, `${id}.summary`).en,
        outcome_ko: localizedPair(outcome, `${id}.outcome`).ko, outcome_en: localizedPair(outcome, `${id}.outcome`).en,
        body_ko: body.ko, body_en: body.en,
        timeline: timeline.map(point => {
            const out = { date: point.date, title: localizedPair(point.title, `${id}.timeline`), body: localizedPair(point.body, `${id}.timeline`),
                country: point.country || [countries[0]] };
            if (point.geo) out.geo = point.geo;
            return out;
        }),
        sources,
        locations: locations.map((loc, i) => ({ kind: i === 0 ? 'main' : 'place', lat: loc.lat, lng: loc.lng, label: localizedPair(loc.label, `${id}.location`) })),
        countries,
        relations: related?.length ? { related } : {},
        no_auto_link: record.noAutoLink || [],
        link_expressions: [],
    };
    const peopleRows = (people || []).map((p, i) => ({
        person_id: p.id, sort_order: i, relation_kind: p.kind,
        relation_ko: p.relation.ko, relation_en: p.relation.en,
        note_ko: p.note?.ko || '', note_en: p.note?.en || '',
    }));
    return { id, fields, people: peopleRows };
}

function term(record) {
    const { id, term: name, category, period, startYear, endYear, definition, body, aliases, people, events, sources, locator } = record;
    if (!id || !name || !category || !period || !sources?.length || !locator) throw new Error(`term ${id || '?'}: id, term, category, period, sources, locator required`);
    const def = localizedPair(definition, `${id}.definition`);
    const bodyPair = localizedPair(body, `${id}.body`);
    const periodPair = localizedPair(period, `${id}.period`);
    const evidence = [
        { field: 'definition', claim: def.en, source: sources[0], locator },
        { field: 'body', claim: bodyPair.en.slice(0, 300), source: sources[0], locator },
        { field: 'period', claim: periodPair.en, source: sources[0], locator },
    ];
    const fields = { term: localizedPair(name, `${id}.term`), category, period: periodPair, definition: def, body: bodyPair, evidence };
    if (startYear != null) { fields.startYear = startYear; evidence.push({ field: 'startYear', claim: String(startYear), source: sources[0], locator }); }
    if (endYear != null) { fields.endYear = endYear; evidence.push({ field: 'endYear', claim: String(endYear), source: sources[0], locator }); }
    if (aliases) fields.aliases = aliases;
    if (people) fields.people = people;
    if (events) fields.events = events;
    return { id, fields, sources };
}

function load(prefix) {
    return fs.readdirSync(__dirname).filter(f => f.startsWith(prefix) && f.endsWith('.js')).sort()
        .flatMap(f => require(path.join(__dirname, f)));
}

function build() {
    const people = load('people-').map(person);
    const events = load('events-').map(event);
    const terms = load('terms').map(term);
    const ids = new Set();
    for (const entry of [...people, ...events, ...terms]) {
        if (ids.has(entry.id)) throw new Error(`duplicate id ${entry.id}`);
        ids.add(entry.id);
    }
    const spec = { id: BATCH_ID, people, events, terms };
    return spec;
}

if (require.main === module) {
    const spec = build();
    const out = path.join(__dirname, '..', `${BATCH_ID}.json`);
    fs.writeFileSync(out, JSON.stringify(spec, null, 1) + '\n');
    console.log(`${out}: ${spec.people.length} people, ${spec.events.length} events, ${spec.terms.length} terms`);
}

module.exports = { build, BATCH_ID };
