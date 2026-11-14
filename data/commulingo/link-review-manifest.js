// A reviewed link-review manifest (scripts/reviews/*.json: { decisions: [{ kind, id,
// lang, text, role, policy, note, sourceSignature?, added? }] }) checked and
// applied in one pass: added expressions are projected onto their entries, every
// decision is validated against the final catalogue, a fixed set of renderer
// regressions must stay unlinked, qualified expressions must link (context ones
// only beside an approved name), then the expressions are written and the
// reviews saved through link-review-service. Shared by
// scripts/review-commulingo-links.js and the MCP tool link_reviews_apply.
const db = require('../../config/database');
const { transaction } = require('../../utils/db-transaction');
const service = require('./link-review-service');
const { catalogue, validateDecision } = require('./link-review-catalog');
const { key } = require('./link-review-policy');
const { assertLinkExpressions } = require('./link-expressions');

const recordKey = r => r.kind + ':' + r.id;
const rowKey = r => key(r.kind, r.id, r.lang, r.text);

const NEGATIVE_CASES = [
    ['ko', '1920년 이탈리아와 유고슬라비아의 라팔로 조약', 'rapallo-treaty'],
    ['en', 'The 1988 Matignon Agreements concern New Caledonia.', 'matignon-agreements'],
    ['ko', '1991년 브리유니 선언은 유고슬라비아 분쟁을 다룬다.', 'brioni-declaration'],
    ['ko', '1938년 헝가리의 블레드 협정', 'bled-agreement-1947'],
    ['ko', '대한민국 임시정부와 프랑스 임시정부', 'russian-provisional-government'],
    ['ko', '베트남의 5개년 계획과 말레이시아 신경제정책', 'five-year-plan'],
    ['ko', '베트남의 5개년 계획과 말레이시아 신경제정책', 'nep'],
    ['en', 'A ceasefire agreement ended the conflict in another country.', 'korean-armistice-agreement'],
    ['ko', '1914년 7월 위기와 1954년 제네바 협정', 'july-days'],
    ['ko', '1914년 7월 위기와 1954년 제네바 협정', 'geneva-accords-1988-on-afghanistan'],
    ['en', 'The Sino-Soviet Treaty of Friendship and Alliance was signed in 1945.', 'sino-soviet-treaty-of-friendship-alliance-and-mutual-assista'],
    ['ko', '중국의 국민혁명과 1848년 프랑스 2월 혁명', 'national-revolution'],
    ['ko', '중국의 국민혁명과 1848년 프랑스 2월 혁명', 'february-revolution'],
];

function fail(message, status = 400, extra = {}) {
    throw Object.assign(new Error(message), { status, ...extra });
}

// A decision whose expression is gone (the title, headword or alias was
// renamed) or whose source changed since the manifest was built. All of them
// are reported at once with what the entry offers now, so the manifest can be
// rebuilt in one pass; a renamed event or document title keeps its approvals
// through link_reviews_carry instead.
function staleProblems(decisions, rows) {
    const problems = [];
    for (const d of decisions) {
        const row = rows.find(r => rowKey(r) === rowKey(d));
        if (row && !(d.sourceSignature && row.sourceSignature !== d.sourceSignature)) continue;
        const current = rows.filter(r => r.kind === d.kind && r.id === d.id && r.lang === d.lang);
        problems.push(row
            ? { decision: rowKey(d), reason: 'source changed since the manifest was built', currentSignature: row.sourceSignature }
            : { decision: rowKey(d), reason: current.length ? 'no such expression any more' : `no ${d.kind} ${d.id} with ${d.lang} expressions`,
                current: current.map(r => ({ text: r.text, reviewed: r.reviewed, policy: r.policy, sourceSignature: r.sourceSignature })) });
    }
    return problems;
}

// Expressions of the entries this manifest touches that stay unreviewed after
// it: the generated forms of a title (an English event title without "The",
// a document's quoted and bare aliases) were often left out when the entry was
// registered, and an unreviewed expression never links (2026-11-14: 32 such
// rows piled up). Reported, not refused, so a one-alias fix still goes through.
function unreviewedSiblings(decisions, rows) {
    const entries = new Set(decisions.map(recordKey));
    const decided = new Set(decisions.map(rowKey));
    return rows.filter(r => entries.has(recordKey(r)) && !r.reviewed && !decided.has(rowKey(r)))
        .map(r => ({ kind: r.kind, id: r.id, lang: r.lang, text: r.text, source: r.source, sourceSignature: r.sourceSignature,
            collisions: r.collisions.map(c => `${c.kind}:${c.id}`) }));
}

function failStale(problems) {
    const lines = problems.map(p => `${p.decision}: ${p.reason}${p.current?.length ? `; now: ${p.current.map(c => JSON.stringify(c.text)).join(', ')}` : ''}`);
    fail(`Source changed for ${problems.length} decision(s); rebuild them from the current expressions `
        + `(a renamed event or document title: link_reviews_carry)\n${lines.join('\n')}`, 409, { problems });
}

function projected(state, decisions, actor) {
    const records = JSON.parse(JSON.stringify(state.records));
    for (const d of decisions.filter(d => d.added)) {
        const record = records[d.kind].find(r => r.id === d.id);
        if (!['term', 'event'].includes(d.kind)) fail(`Invalid added expression target: ${rowKey(d)} (added expressions go on terms and events only)`);
        if (!record) fail(`Invalid added expression target: ${rowKey(d)} (no such ${d.kind})`);
        record.linkExpressions ||= [];
        if (!record.linkExpressions.some(e => e.lang === d.lang && e.text === d.text)) record.linkExpressions.push({ text: d.text, lang: d.lang, role: 'identity', policy: 'search' });
        assertLinkExpressions(record.linkExpressions);
    }
    const sourceRows = catalogue(records);
    const reviews = new Map(state.reviews);
    const stale = staleProblems(decisions, sourceRows);
    if (stale.length) failStale(stale);
    for (const d of decisions) {
        const row = sourceRows.find(r => rowKey(r) === rowKey(d));
        reviews.set(rowKey(d), { kind: d.kind, entity_id: d.id, lang: d.lang, expression: d.text, source_signature: row.sourceSignature, role: d.role, policy: d.policy, note: d.note, reviewed_by: actor });
    }
    const rows = catalogue(records, reviews);
    for (const d of decisions) validateDecision(rows.find(r => rowKey(r) === rowKey(d)), d, rows);
    return { records, rows, reviews };
}

// hooks (all optional): log(object), onPreflight(samples), onBackup(snapshot),
// onEvidence(preview) — the CLI writes these to files; the MCP tool returns counts.
async function runLinkReviewManifest(manifest, { apply = false, actor, hooks = {} } = {}) {
    if (!actor) fail('runLinkReviewManifest needs an actor');
    if (!manifest || !Array.isArray(manifest.decisions) || !manifest.decisions.length) fail('manifest.decisions must be a non-empty list');
    const log = hooks.log || (() => {});
    const decisions = manifest.decisions.map(decision => {
        if (!decision || typeof decision.note !== 'string') fail('every decision needs a note');
        return { ...decision, note: decision.note.trim() };
    });
    const keys = decisions.map(rowKey);
    const duplicates = [...new Set(keys.filter((k, i) => keys.indexOf(k) !== i))];
    if (duplicates.length) fail(`Duplicate decision(s): ${duplicates.join(', ')}`);
    const state = await service.loadState();
    const future = projected(state, decisions, actor);
    const summary = { total: decisions.length, policies: Object.fromEntries(['auto', 'context', 'search'].map(p => [p, decisions.filter(d => d.policy === p).length])) };
    const siblings = unreviewedSiblings(decisions, future.rows);
    if (siblings.length) {
        summary.unreviewed = siblings;
        summary.warning = `${siblings.length} other expression(s) of these entries stay unreviewed and will not link; add a decision for each (see unreviewed)`;
    }
    const { renderLinkedContent } = require('./render-links');
    const { getLinkIndexes } = require('./linkify');
    const indexes = {};
    for (const lang of ['ko', 'en']) indexes[lang] = service.buildIndexes(await getLinkIndexes(lang), future.records, future.reviews, lang);
    for (const [lang, text, forbidden] of NEGATIVE_CASES) {
        const rendered = renderLinkedContent(text, indexes[lang], { surface: 'report' });
        if (rendered.links.some(link => link.id === forbidden)) fail('Negative renderer regression: ' + text);
    }
    for (const d of decisions.filter(d => d.added)) {
        const linksTo = text => renderLinkedContent(text, indexes[d.lang], { surface: 'report' }).links.some(link => link.id === d.id);
        if (d.policy !== 'context') {
            if (!linksTo(d.text)) fail('Qualified expression does not link: ' + d.text);
            continue;
        }
        // A context expression links only beside an approved name of the same entry.
        const identity = future.rows.find(r => r.kind === d.kind && r.id === d.id && r.lang === d.lang && r.text !== d.text
            && r.policy === 'auto' && (r.role === 'identity' || (r.role === 'legacy' && r.text === r.label)));
        if (!identity) fail('Context expression has no approved identity: ' + d.text);
        if (linksTo(d.text)) fail('Context expression links on its own: ' + d.text);
        // Context word first: only the first mention of an entry links.
        const html = renderLinkedContent(d.text + '. ' + identity.text, indexes[d.lang], { surface: 'report' }).html || '';
        if (!html.includes('>' + d.text + '</a>')) fail('Context expression does not link beside its identity: ' + d.text);
    }
    const samples = decisions.filter(d => d.original479 || d.added).map(d => ({ text: d.text, kind: d.kind, id: d.id, policy: d.policy,
        links: renderLinkedContent(d.text, indexes[d.lang], { surface: 'report' }).links }));
    if (hooks.onPreflight) hooks.onPreflight(samples);
    log({ preflight: 'passed', ...summary, negativeRendererCases: NEGATIVE_CASES.length, qualifiedRendererCases: decisions.filter(d => d.added).length });
    if (!apply) return { applied: false, preflight: 'passed', ...summary, samples };
    if (hooks.onBackup) hooks.onBackup({ reviews: [...state.reviews.values()], records: state.records, manifest });
    const addedRecords = new Set(decisions.filter(d => d.added).map(recordKey));
    await transaction(async client => {
        for (const id of addedRecords) {
            const [kind, entityId] = id.split(':');
            const table = kind === 'term' ? 'commulingo_terms' : 'commulingo_history_events';
            const current = (await client.query(`SELECT link_expressions FROM ${table} WHERE id=$1 FOR UPDATE`, [entityId])).rows[0];
            const before = state.records[kind].find(r => r.id === entityId).linkExpressions || [];
            if (JSON.stringify(current.link_expressions || []) !== JSON.stringify(before)) fail('Expressions changed: ' + id, 409);
            const expressions = future.records[kind].find(r => r.id === entityId).linkExpressions;
            await client.query(`UPDATE ${table} SET link_expressions=$2::jsonb, updated_at=NOW() WHERE id=$1`, [entityId, JSON.stringify(expressions)]);
        }
    }, { pool: db, lockTimeout: '3s', lock: 'commulingo-editorial-write' });
    // Preview and save take 20–50 s; a write elsewhere in that window moves the
    // corpus revision and saveReviews refuses (2026-11-14: 14 refusals in one
    // day of parallel jobs). saveReviews re-validates every decision against
    // the state it locks, so the preview is simply redone on the new revision.
    // Each loadState costs about 4 s, so the state read for the preflight is
    // reused when this run wrote no expressions, the preview takes the state
    // just read, and the final check uses the rows saveReviews locked.
    let saved = 0, pendingCount = 0, savedRows = null;
    for (let attempt = 1; ; attempt++) {
        const current = attempt === 1 && !addedRecords.size ? state : await service.loadState();
        const stale = staleProblems(decisions, current.rows);
        if (stale.length) failStale(stale);
        const pending = decisions.filter(d => {
            const row = current.rows.find(r => rowKey(r) === rowKey(d));
            return row.note !== d.note || row.policy !== d.policy || row.role !== d.role;
        });
        pendingCount = pending.length;
        if (!pending.length) { savedRows = current.rows; break; }
        log({ phase: 'batch-preview', pending: pending.length, attempt });
        const preview = await service.previewReviews(pending, { samples: Boolean(hooks.onEvidence), state: current });
        if (hooks.onEvidence) hooks.onEvidence(preview);
        log({ phase: 'batch-preview-complete', expressions: preview.results.length, samples: preview.results.reduce((n, r) => n + r.samples.length, 0) });
        try {
            const result = await service.saveReviews(preview.token, actor, { withRows: true });
            saved = result.values.length;
            savedRows = result.rows;
            break;
        } catch (err) {
            if (!service.isRevisionChanged(err) || attempt >= 3) throw err;
            log({ phase: 'retry', reason: 'corpus changed during preview', attempt });
        }
    }
    log({ completed: saved, alreadySaved: decisions.length - pendingCount });
    const finalRows = savedRows || (await service.loadState()).rows;
    for (const d of decisions) {
        const r = finalRows.find(r => rowKey(r) === rowKey(d));
        if (!r || !r.reviewed || r.note !== d.note || r.policy !== d.policy || r.role !== d.role) fail('Final state mismatch: ' + rowKey(d), 500);
    }
    return { applied: true, status: 'all-reviewed-and-saved', ...summary, saved, alreadySaved: decisions.length - pendingCount };
}

module.exports = { runLinkReviewManifest };
