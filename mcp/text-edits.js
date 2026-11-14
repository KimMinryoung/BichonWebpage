// Small edits without resending a whole text (editorial_store / editorial_batch
// submit update). The caller names what to change; this module reads the stored
// value inside the same transaction and expands the request into the ordinary
// full-field update the editorial services already validate, so evidence,
// revision checks and quote normalization behave exactly as before.
//
//   request.textEdits: [{ field: 'body.ko', find: '1955년 처형', replace: '1956년 7월 처형' }]
//     term:                  term | definition | body | periodNote
//     person:                bio | epithet
//     person_section:        heading | body          (fields.slug names the section)
//     history_event:         title | question | summary | outcome
//     history_event_section: body                    (fields.heading {ko, en} names the section)
//   Each find must occur exactly once in the stored text (and in the text as
//   earlier edits in the list left it).
//
//   request.timelineEdits (history_event): [{ index, set: { country: ['ethiopia', 'somalia'] } }]
//     replaces those keys of that stored timeline row (null removes a key, e.g. geo);
//     the full timeline is then sent as usual.
//
// Until 2026-11-14 a one-phrase correction meant copying a whole section out of a
// read result and back into a write, where a slip in the copy is stored as is.
const { badRequest } = require('./common');

const TEXT_FIELDS = {
    term: ['term', 'definition', 'body', 'periodNote'],
    person: ['bio', 'epithet'],
    person_section: ['heading', 'body'],
    history_event: ['title', 'question', 'summary', 'outcome'],
    history_event_section: ['body'],
};

function replaceOnce(text, find, replace, label) {
    if (typeof find !== 'string' || !find) throw badRequest(`${label}: find must be a non-empty string`);
    if (typeof replace !== 'string') throw badRequest(`${label}: replace must be a string`);
    const count = text.split(find).length - 1;
    if (count !== 1) throw badRequest(`${label}: find occurs ${count} times in the stored text; it must occur exactly once (quote more context)`);
    return text.replace(find, () => replace);
}

async function storedTexts(target, request, client) {
    const id = request.id;
    if (target === 'term') {
        const term = await require('../data/commulingo/term-editorial-service').readTermEditorial(id, { client });
        if (!term) throw badRequest(`term ${id} not found`);
        return term;
    }
    if (target === 'person') {
        const person = await require('../data/commulingo/people-admin-store').getPersonAdmin(id, { client });
        if (!person) throw badRequest(`person ${id} not found`);
        return person;
    }
    if (target === 'person_section') {
        const slug = request.fields?.slug;
        const sections = await require('../data/commulingo/people-sections-store').listPersonSectionsAdmin(id, { client });
        const section = sections.find(s => s.slug === slug);
        if (!section) throw badRequest(`person ${id} has no section ${slug} (fields.slug names it)`);
        return section;
    }
    const { rows } = await client.query(`SELECT title_ko, title_en, question_ko, question_en, summary_ko, summary_en, outcome_ko, outcome_en,
            body_ko, body_en, timeline FROM commulingo_history_events WHERE id = $1`, [id]);
    if (!rows.length) throw badRequest(`history event ${id} not found`);
    const row = rows[0];
    const pair = name => ({ ko: row[`${name}_ko`] || '', en: row[`${name}_en`] || '' });
    if (target === 'history_event') {
        return { title: pair('title'), question: pair('question'), summary: pair('summary'), outcome: pair('outcome'), timeline: row.timeline || [] };
    }
    const heading = request.fields?.heading;
    if (!heading || typeof heading.ko !== 'string' || typeof heading.en !== 'string') {
        throw badRequest('history_event_section textEdits need fields.heading {ko, en} naming the section');
    }
    const { splitBody, findSection } = require('../data/commulingo/content-editorial-service');
    const body = {};
    for (const lang of ['ko', 'en']) {
        const parts = splitBody(row[`body_${lang}`]);
        const at = findSection(parts, heading[lang]);
        if (at < 0) throw badRequest(`event ${id} has no ${lang} section "${heading[lang]}"`);
        body[lang] = parts[at][1].replace(/^## [^\n]*\n*/, '');
    }
    return { body };
}

async function expandTextEdits(target, request, client) {
    const { textEdits, timelineEdits, ...rest } = request;
    if (textEdits === undefined && timelineEdits === undefined) return request;
    if (rest.action !== 'update') throw badRequest('textEdits and timelineEdits apply to an update');
    if (timelineEdits !== undefined && target !== 'history_event') throw badRequest('timelineEdits apply to history_event');
    const allowed = TEXT_FIELDS[target];
    if (textEdits !== undefined && !allowed) throw badRequest(`textEdits are not available for ${target}`);
    for (const [name, list] of [['textEdits', textEdits], ['timelineEdits', timelineEdits]]) {
        if (list !== undefined && (!Array.isArray(list) || !list.length)) throw badRequest(`${name} must be a non-empty list`);
    }
    const stored = await storedTexts(target, rest, client);
    const fields = { ...(rest.fields || {}) };
    const changed = {};
    (textEdits || []).forEach((edit, i) => {
        const label = `textEdits[${i}]`;
        const [field, lang, extra] = String(edit?.field || '').split('.');
        if (!allowed.includes(field) || !['ko', 'en'].includes(lang) || extra !== undefined) {
            throw badRequest(`${label}.field must be <field>.<ko|en> with field one of ${allowed.join(', ')}`);
        }
        if (fields[field] !== undefined && !changed[field]) throw badRequest(`${label}: fields.${field} is also sent; use one or the other`);
        const current = changed[field] || { ko: stored[field]?.ko || '', en: stored[field]?.en || '' };
        changed[field] = { ...current, [lang]: replaceOnce(current[lang], edit.find, edit.replace, `${label} (${field}.${lang})`) };
    });
    Object.assign(fields, changed);
    if (timelineEdits) {
        if (fields.timeline !== undefined) throw badRequest('timelineEdits and fields.timeline cannot both be sent');
        const timeline = JSON.parse(JSON.stringify(stored.timeline));
        timelineEdits.forEach((edit, i) => {
            if (!Number.isInteger(edit?.index) || edit.index < 0 || edit.index >= timeline.length) {
                throw badRequest(`timelineEdits[${i}].index must be 0–${timeline.length - 1}`);
            }
            if (!edit.set || typeof edit.set !== 'object' || Array.isArray(edit.set) || !Object.keys(edit.set).length) {
                throw badRequest(`timelineEdits[${i}].set must be an object of row keys`);
            }
            for (const [key, value] of Object.entries(edit.set)) {
                if (value === null) delete timeline[edit.index][key];
                else timeline[edit.index][key] = value;
            }
        });
        fields.timeline = timeline;
    }
    return { ...rest, fields };
}

module.exports = { expandTextEdits, TEXT_FIELDS };
