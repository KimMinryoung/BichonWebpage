const fs = require('fs');
const path = require('path');
const { createHash, randomUUID } = require('crypto');
const db = require('../../config/database');
const { loadCommuLingoTerms } = require('./terms-store');
const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { listCommuLingoDocs, getCommuLingoDocContent } = require('./docs-store');
const { loadCommuLingoPeople } = require('./people-store');
const { getLinkIndexes } = require('./linkify');
const { renderLinkedContent } = require('./render-links');
const { refreshLinkReviews } = require('./link-reviews-store');
const { catalogue, validateDecision, builders } = require('./link-review-catalog');
const { key, normalize, reviewMap } = require('./link-review-policy');
const previews = new Map();
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const fail = (message, status = 400) => { const error = new Error(message); error.status = status; throw error; };
async function loadState(client = db) {
    const [term, event] = await Promise.all([
        loadCommuLingoTerms({ fresh: true }), loadCommuLingoHistoryEvents({ fresh: true }),
    ]);
    const records = { term, event, doc: listCommuLingoDocs() };
    const reviews = reviewMap((await client.query('SELECT * FROM commulingo_link_reviews ORDER BY kind, entity_id, lang, expression')).rows);
    const rows = catalogue(records, reviews);
    // Include prose as well as names: a preview of an old body cannot approve a new one.
    const [people, reportsResult] = await Promise.all([loadCommuLingoPeople({ fresh: true }),
        client.query("SELECT slug, markdown FROM research_documents WHERE status = 'public' ORDER BY slug")]);
    const docVersions = records.doc.map(doc => {
        const stat = fs.statSync(path.join(__dirname, 'docs', doc.file));
        return [doc.id, stat.mtimeMs, stat.size];
    });
    const reports = reportsResult.rows;
    const revision = hash([records, [...reviews.values()], people.data, reports, docVersions]);
    return { records, reviews, rows, revision, people: people.data, reports };
}
async function listReviews({ q = '', kind = '', pending = false, risk = false, offset = 0, limit = 60 } = {}) {
    const state = await loadState();
    const needle = String(q).normalize('NFC').toLowerCase();
    const rows = state.rows.filter(row => (!kind || row.kind === kind) && (!pending || !row.reviewed)
        && (!risk || row.risks.length || row.collisions.length)
        && (!needle || [row.text, row.label, row.id].some(text => text.toLowerCase().includes(needle))));
    return { total: rows.length, rows: rows.slice(offset, offset + Math.min(limit, 100)),
        pending: state.rows.filter(row => !row.reviewed).length, revision: state.revision };
}
function selectRow(state, input) {
    const row = state.rows.find(row => key(row.kind, row.id, row.lang, row.text) === key(input.kind, input.id, input.lang, input.text));
    if (!row) fail('표현이 삭제되거나 변경됐습니다. 목록을 다시 불러오세요.', 409);
    return row;
}
function reviewValue(row, input, actor) {
    return { kind: row.kind, entity_id: row.id, lang: row.lang, expression: row.text,
        source_signature: row.sourceSignature, role: input.role, policy: input.policy,
        note: input.note.trim(), reviewed_by: actor };
}
function buildIndexes(base, records, reviews, lang) {
    return { ...base, term: builders.term.buildTermLinkIndex(records.term, { lang, reviews }),
        event: builders.event.buildEventLinkIndex(records.event, { lang, reviews }),
        doc: builders.doc.buildDocLinkIndex(records.doc, { lang, reviews }) };
}
async function previewLinks(input) {
    const state = await loadState();
    const row = selectRow(state, input);
    validateDecision(row, input, state.rows);
    const value = reviewValue(row, input, 'preview');
    const afterReviews = new Map(state.reviews);
    afterReviews.set(key(row.kind, row.id, row.lang, row.text), value);
    const base = await getLinkIndexes(row.lang);
    const before = buildIndexes(base, state.records, state.reviews, row.lang);
    const after = buildIndexes(base, state.records, afterReviews, row.lang);
    const passages = [];
    function add(where, text, options, url) {
        if (text && normalize(text, row.lang).includes(normalize(row.text, row.lang))) passages.push({ where, text, options, url });
    }
    for (const kind of ['term', 'event']) for (const record of state.records[kind]) {
        const options = { surface: kind, exclude: { [kind]: record.id,
            ...(kind === 'term' && record.sameSubjectEvent ? { event: record.sameSubjectEvent.id } : {}) }, blockStrings: record.noAutoLink };
        const url = '/commulingo/' + (kind === 'term' ? 'terms/' : 'events/') + record.id;
        for (const field of ['definition', 'summary', 'question', 'outcome', 'body']) add(kind + ':' + record.id + '/' + field, record[field]?.[row.lang], options, url);
        for (const [i, item] of (record.timeline || []).entries()) add(kind + ':' + record.id + '/timeline/' + i, item.body?.[row.lang], options, url);
    }
    const people = state.people;
    for (const person of people.people || []) for (const field of ['epithet', 'moment', 'bio']) add('person:' + person.id + '/' + field, person[field]?.[row.lang], { surface: 'person', exclude: { person: person.id } }, '/commulingo/people/' + person.id);
    for (const [id, sections] of Object.entries(people.sections || {})) for (const section of sections) add('person:' + id + '/' + section.slug, section.body?.[row.lang], { surface: 'person', exclude: { person: id } }, '/commulingo/people/' + id);
    for (const doc of state.records.doc) {
        if ((doc.docLang || 'ko') !== row.lang) continue;
        add('doc:' + doc.id, getCommuLingoDocContent(doc)?.html, { surface: 'doc', html: true, exclude: { doc: doc.id }, blockStrings: doc.noAutoLink }, '/commulingo/docs/' + doc.id);
    }
    const reports = state.reports;
    for (const report of reports) add('report:' + report.slug, report.markdown, { surface: 'report' }, '/reports/' + report.slug);
    // Bound rendering work, not silently the declared coverage. Every sample uses
    // the shipping renderer on the whole reading unit, with exclusions intact.
    const samples = passages.slice(0, 12).map(passage => {
        const oldLinks = renderLinkedContent(passage.text, before, passage.options).links;
        const newLinks = renderLinkedContent(passage.text, after, passage.options).links;
        const plain = passage.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        const at = Math.max(0, plain.toLowerCase().indexOf(row.text.toLowerCase()));
        return { where: passage.where, url: passage.url, excerpt: plain.slice(Math.max(0, at - 120), at + row.text.length + 180),
            before: oldLinks, after: newLinks, changed: JSON.stringify(oldLinks) !== JSON.stringify(newLinks) };
    });
    // Drop expired previews; cap memory even when a client never saves.
    for (const [token, item] of previews) if (item.expires < Date.now()) previews.delete(token);
    if (previews.size >= 100) previews.delete(previews.keys().next().value);
    const token = randomUUID();
    previews.set(token, { input: { kind: row.kind, id: row.id, lang: row.lang, text: row.text, role: input.role, policy: input.policy, note: input.note }, revision: state.revision, expires: Date.now() + 15 * 60000 });
    return { token, row, samples, matchedPassages: passages.length, sampledPassages: samples.length,
        coverage: '용어·사건·인물·참고 문헌·공개 보고서. 최대 12개 본문 단위를 표본으로 표시하며 학습 콘텐츠는 포함하지 않습니다.' };
}
async function saveReview(token, actor) {
    const preview = previews.get(token);
    if (!preview || preview.expires < Date.now()) fail('미리보기가 만료됐습니다. 다시 확인하세요.', 409);
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query("SET LOCAL lock_timeout = '3s'");
        await client.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-link-review'))");
        const state = await loadState(client);
        if (state.revision !== preview.revision) fail('미리보기 이후 데이터나 연결 정책이 변경됐습니다. 다시 확인하세요.', 409);
        const row = selectRow(state, preview.input);
        validateDecision(row, preview.input, state.rows);
        const value = reviewValue(row, preview.input, actor);
        const old = state.reviews.get(key(row.kind, row.id, row.lang, row.text)) || null;
        await client.query(`INSERT INTO commulingo_link_reviews (kind,entity_id,lang,expression,source_signature,role,policy,note,reviewed_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (kind,entity_id,lang,expression) DO UPDATE
            SET source_signature=EXCLUDED.source_signature,role=EXCLUDED.role,policy=EXCLUDED.policy,note=EXCLUDED.note,reviewed_by=EXCLUDED.reviewed_by,updated_at=NOW()`,
        [value.kind, value.entity_id, value.lang, value.expression, value.source_signature, value.role, value.policy, value.note, value.reviewed_by]);
        await client.query('INSERT INTO commulingo_link_review_history (kind,entity_id,lang,expression,before_value,after_value) VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb)',
            [row.kind, row.id, row.lang, row.text, JSON.stringify(old), JSON.stringify(value)]);
        await client.query('COMMIT');
        previews.delete(token);
        await refreshLinkReviews();
        return value;
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
}
module.exports = { loadState, listReviews, previewLinks, saveReview, buildIndexes };
