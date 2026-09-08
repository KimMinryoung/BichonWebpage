#!/usr/bin/env node
// Run in the app container with a reviewed JSON manifest on stdin. Default: preflight.
const fs = require('fs');
const db = require('../config/database');
const service = require('../data/commulingo/link-review-service');
const { catalogue, validateDecision } = require('../data/commulingo/link-review-catalog');
const { key } = require('../data/commulingo/link-review-policy');
const { assertLinkExpressions } = require('../data/commulingo/link-expressions');
const actor = 'owner-requested-link-review-20260908';
const manifest = JSON.parse(fs.readFileSync(0, 'utf8'));
const decisions = manifest.decisions;
const apply = process.argv.includes('--apply');
const recordKey = r => r.kind + ':' + r.id;
const rowKey = r => key(r.kind, r.id, r.lang, r.text);
function projected(state) {
    const records = JSON.parse(JSON.stringify(state.records));
    for (const d of decisions.filter(d => d.added)) {
        const record = records[d.kind].find(r => r.id === d.id);
        if (!record || !['term', 'event'].includes(d.kind)) throw new Error('Invalid added expression target');
        record.linkExpressions ||= [];
        if (!record.linkExpressions.some(e => e.lang === d.lang && e.text === d.text)) record.linkExpressions.push({ text: d.text, lang: d.lang, role: 'identity', policy: 'search' });
        assertLinkExpressions(record.linkExpressions);
    }
    const sourceRows = catalogue(records);
    const reviews = new Map(state.reviews);
    for (const d of decisions) {
        const row = sourceRows.find(r => rowKey(r) === rowKey(d));
        if (!row || (d.sourceSignature && row.sourceSignature !== d.sourceSignature)) throw new Error('Source changed: ' + rowKey(d));
        reviews.set(rowKey(d), { kind: d.kind, entity_id: d.id, lang: d.lang, expression: d.text, source_signature: row.sourceSignature, role: d.role, policy: d.policy, note: d.note, reviewed_by: actor });
    }
    const rows = catalogue(records, reviews);
    for (const d of decisions) validateDecision(rows.find(r => rowKey(r) === rowKey(d)), d, rows);
    return { records, rows, reviews };
}
(async () => {
    if (new Set(decisions.map(rowKey)).size !== decisions.length) throw new Error('Duplicate decision');
    const state = await service.loadState();
    const future = projected(state);
    const summary = { total: decisions.length, original479: decisions.filter(d => d.original479).length, policies: Object.fromEntries(['auto', 'context', 'search'].map(p => [p, decisions.filter(d => d.policy === p).length])) };
    const { renderLinkedContent } = require('../data/commulingo/render-links');
    const indexes = {};
    for (const lang of ['ko', 'en']) indexes[lang] = service.buildIndexes(await require('../data/commulingo/linkify').getLinkIndexes(lang), future.records, future.reviews, lang);
    const negativeCases = [
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
    for (const [lang, text, forbidden] of negativeCases) {
        const rendered = renderLinkedContent(text, indexes[lang], { surface: 'report' });
        if (rendered.links.some(link => link.id === forbidden)) throw new Error('Negative renderer regression: ' + text);
    }
    for (const d of decisions.filter(d => d.added)) {
        const rendered = renderLinkedContent(d.text, indexes[d.lang], { surface: 'report' });
        if (!rendered.links.length) throw new Error('Qualified expression does not link: ' + d.text);
    }
    const samples = [];
    for (const d of decisions.filter(d => d.original479)) {
        const rendered = renderLinkedContent(d.text, indexes[d.lang], { surface: 'report' });
        samples.push({ text: d.text, kind: d.kind, id: d.id, policy: d.policy, links: rendered.links });
    }
    const preflightFile = '/tmp/commulingo-link-review-preflight.json';
    fs.writeFileSync(preflightFile, JSON.stringify(samples, null, 2));
    console.log(JSON.stringify({ preflight: 'passed', ...summary, negativeRendererCases: negativeCases.length, qualifiedRendererCases: decisions.filter(d => d.added).length, preflightFile }));
    if (!apply) return;
    const backup = '/tmp/commulingo-link-review-before-' + Date.now() + '.json';
    fs.writeFileSync(backup, JSON.stringify({ reviews: [...state.reviews.values()], records: state.records, manifest }, null, 2), { flag: 'wx', mode: 0o600 });
    console.log(JSON.stringify({ backup }));
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query("SET LOCAL lock_timeout = '3s'");
        await client.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-editorial-write'))");
        for (const id of new Set(decisions.filter(d => d.added).map(recordKey))) {
            const [kind, entityId] = id.split(':');
            const table = kind === 'term' ? 'commulingo_terms' : 'commulingo_history_events';
            const current = (await client.query(`SELECT link_expressions FROM ${table} WHERE id=$1 FOR UPDATE`, [entityId])).rows[0];
            const before = state.records[kind].find(r => r.id === entityId).linkExpressions || [];
            if (JSON.stringify(current.link_expressions || []) !== JSON.stringify(before)) throw new Error('Expressions changed: ' + id);
            const expressions = future.records[kind].find(r => r.id === entityId).linkExpressions;
            await client.query(`UPDATE ${table} SET link_expressions=$2::jsonb, updated_at=NOW() WHERE id=$1`, [entityId, JSON.stringify(expressions)]);
        }
        await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
    const evidence = '/tmp/commulingo-link-review-previews-' + Date.now() + '.jsonl';
    console.log(JSON.stringify({ evidence }));
    const current = await service.loadState();
    const pending = decisions.filter(d => {
        const row = current.rows.find(r => rowKey(r) === rowKey(d));
        if (!row || (d.sourceSignature && row.sourceSignature !== d.sourceSignature)) throw new Error('Source changed: ' + rowKey(d));
        return row.note !== d.note || row.policy !== d.policy || row.role !== d.role;
    });
    if (pending.length) {
        console.log(JSON.stringify({ phase: 'batch-preview', pending: pending.length }));
        const preview = await service.previewReviews(pending);
        fs.writeFileSync(evidence, JSON.stringify(preview));
        console.log(JSON.stringify({ phase: 'batch-preview-complete', expressions: preview.results.length, samples: preview.results.reduce((n, r) => n + r.samples.length, 0) }));
        const saved = await service.saveReviews(preview.token, actor);
        console.log(JSON.stringify({ completed: saved.length, alreadySaved: decisions.length - pending.length }));
    }
    const final = await service.loadState();
    for (const d of decisions) {
        const r = final.rows.find(r => rowKey(r) === rowKey(d));
        if (!r || !r.reviewed || r.note !== d.note || r.policy !== d.policy || r.role !== d.role) throw new Error('Final state mismatch: ' + rowKey(d));
    }
    console.log(JSON.stringify({ status: 'all-reviewed-and-saved', ...summary, backup, evidence }));
})().then(() => db.end()).catch(error => { console.error(error); process.exitCode = 1; return db.end(); });
