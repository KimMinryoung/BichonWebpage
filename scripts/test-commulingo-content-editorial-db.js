#!/usr/bin/env node
// Content editorial service against an isolated DB: history event card,
// body sections, event people and office rows — direct apply, staging and
// review, revisions, refusals. Everything runs in one transaction that is
// rolled back. DB_HOST/DB_USER/DB_NAME must be provided explicitly.
if (process.env.COMMULINGO_ISOLATED_TEST !== '1' || process.env.DB_NAME !== 'commulingo_integrity_test') {
    throw new Error('Requires COMMULINGO_ISOLATED_TEST=1 and DB_NAME=commulingo_integrity_test');
}
const assert = require('node:assert/strict');
const path = require('node:path');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');
const db = require(path.join(root, 'config/database'));
const { submitContentEdit, reviewContentSuggestion, splitBody } = require(path.join(root, 'data/commulingo/content-editorial-service'));

const L = (ko, en) => ({ ko, en });

(async () => {
    const client = await db.connect();
    const options = { client, changedBy: 'content-test' };
    const one = async (sql, params) => (await client.query(sql, params)).rows[0];
    const submit = request => submitContentEdit({ sources: ['https://archive.example/1'], ...request }, options);
    try {
        await client.query('BEGIN');
        await client.query("INSERT INTO commulingo_people_groups (id, title_ko, title_en) VALUES ('ct-group', '시험', 'Test')");
        await client.query("INSERT INTO commulingo_people (id, group_id, name_ko, name_en) VALUES ('ct-person', 'ct-group', '시험 인물', 'Test Person')");
        await client.query(`INSERT INTO commulingo_history_events (id, title_ko, title_en, summary_ko, summary_en, body_ko, body_en)
            VALUES ('ct-event', '시험 사건', 'Test event', '요약', 'Summary', '## 배경\n\n원래 배경.\n\n## 결과\n\n원래 결과.', '## Background\n\nOld background.\n\n## Outcome\n\nOld outcome.'),
                   ('ct-skeleton', '뼈대', 'Skeleton', '', '', '', '')`);
        await client.query(`UPDATE commulingo_history_events SET sides = '[{"id":"reds","label":{"ko":"적군","en":"Reds"}},{"id":"whites","label":{"ko":"백군","en":"Whites"}}]'::jsonb
            WHERE id = 'ct-event'`).catch(() => { throw new Error('commulingo_history_events.sides missing (migration 193)'); });
        await client.query("INSERT INTO commulingo_offices (id, title_ko, title_en) VALUES ('ct-office', '시험 직책', 'Test office')");

        // Event card: direct apply writes the row, a revision and an approved suggestion.
        const card = await submit({ target: 'history_event', action: 'update', id: 'ct-event', fields: { question: L('왜?', 'Why?') } });
        assert.equal(card.status, 'approved');
        assert.equal((await one("SELECT question_ko FROM commulingo_history_events WHERE id = 'ct-event'")).question_ko, '왜?');
        const sugg = await one('SELECT status, suggested_by, reviewer FROM commulingo_agent_suggestions WHERE id = $1', [card.suggestionId]);
        assert.deepEqual(sugg, { status: 'approved', suggested_by: 'content-test', reviewer: 'auto:direct_apply' });
        const rev = await one("SELECT snapshot, changed_by FROM commulingo_people_revisions WHERE entity_type = 'history_event' AND entity_id = 'ct-event' ORDER BY id DESC LIMIT 1");
        assert.equal(rev.changed_by, 'content-test');
        assert.equal(rev.snapshot.after.question_ko, '왜?');
        assert.equal(rev.snapshot.before.question_ko, '');

        // Staged: nothing changes until review; review applies; a second review is refused.
        const staged = await submit({ target: 'history_event', action: 'update', id: 'ct-event', directApply: false, fields: { outcome: L('결과', 'Outcome') } });
        assert.equal(staged.status, 'pending');
        assert.equal((await one("SELECT outcome_ko FROM commulingo_history_events WHERE id = 'ct-event'")).outcome_ko, '');
        const reviewed = await reviewContentSuggestion(staged.suggestionId, true, 'checked against source', { client, changedBy: 'reviewer-test' });
        assert.equal(reviewed.status, 'approved');
        assert.equal((await one("SELECT outcome_ko FROM commulingo_history_events WHERE id = 'ct-event'")).outcome_ko, '결과');
        assert.equal((await one('SELECT status, reviewer FROM commulingo_agent_suggestions WHERE id = $1', [staged.suggestionId])).reviewer, 'reviewer-test');
        await client.query('SAVEPOINT s');
        await assert.rejects(reviewContentSuggestion(staged.suggestionId, true, 'again', options), err => err.status === 409);
        await client.query('ROLLBACK TO SAVEPOINT s');
        const rejected = await submit({ target: 'history_event', action: 'update', id: 'ct-event', directApply: false, fields: { outcome: L('버림', 'Drop') } });
        assert.equal((await reviewContentSuggestion(rejected.suggestionId, false, 'no source', options)).status, 'rejected');
        assert.equal((await one("SELECT outcome_ko FROM commulingo_history_events WHERE id = 'ct-event'")).outcome_ko, '결과');

        // dryRun validates and writes nothing.
        const before = await one('SELECT count(*)::int AS n FROM commulingo_agent_suggestions');
        assert.equal((await submit({ target: 'history_event', action: 'update', id: 'ct-event', dryRun: true, fields: { question: L('가', 'A') } })).status, 'validated');
        assert.equal((await one('SELECT count(*)::int AS n FROM commulingo_agent_suggestions')).n, before.n);
        assert.equal((await one("SELECT question_ko FROM commulingo_history_events WHERE id = 'ct-event'")).question_ko, '왜?');

        const refuse = async (request, pattern) => {
            await client.query('SAVEPOINT s');
            await assert.rejects(submit(request), pattern);
            await client.query('ROLLBACK TO SAVEPOINT s');
        };
        await refuse({ target: 'history_event', action: 'update', id: 'ct-skeleton', fields: { summary: L('요약', 'Summary') } }, /skeleton/);
        await refuse({ target: 'history_event', action: 'update', id: 'ct-none', fields: {} }, /not found/);
        await refuse({ target: 'history_event', action: 'update', id: 'ct-event', fields: { question: '문자열' } }, /must be an object/);
        await refuse({ target: 'history_event', action: 'update', id: 'ct-event', fields: { timeline: [{ date: '1917', title: L('가', '') , body: L('나', 'B') }] } }, /needs ko and en/);

        // Body sections: insert after an anchor in both languages, rewrite, refusals.
        await submit({ target: 'history_event_section', action: 'create', id: 'ct-event',
            fields: { heading: L('국제 반응', 'International reaction'), body: L('새 절.', 'New section.'), after: L('배경', 'Background') } });
        let event = await one("SELECT body_ko, body_en FROM commulingo_history_events WHERE id = 'ct-event'");
        assert.deepEqual(splitBody(event.body_ko).map(([h]) => h), ['배경', '국제 반응', '결과']);
        assert.deepEqual(splitBody(event.body_en).map(([h]) => h), ['Background', 'International reaction', 'Outcome']);
        await submit({ target: 'history_event_section', action: 'update', id: 'ct-event',
            fields: { heading: L('결과', 'Outcome'), body: L('고친 결과.', 'New outcome.') } });
        event = await one("SELECT body_ko FROM commulingo_history_events WHERE id = 'ct-event'");
        assert.match(event.body_ko, /## 결과\n\n고친 결과\./);
        assert.doesNotMatch(event.body_ko, /원래 결과/);
        await refuse({ target: 'history_event_section', action: 'create', id: 'ct-event', fields: { heading: L('결  과', 'Outcome!'), body: L('가', 'A') } }, /already has/);
        await refuse({ target: 'history_event_section', action: 'update', id: 'ct-event', fields: { heading: L('없는 절', 'Missing'), body: L('가', 'A') } }, /has no/);
        await refuse({ target: 'history_event_section', action: 'create', id: 'ct-event', fields: { heading: L('새', 'New'), body: L('## 몰래\n\n가', 'A') } }, /markdown heading/);
        await refuse({ target: 'history_event_section', action: 'create', id: 'ct-event', fields: { heading: L('새', 'New'), body: L('가', 'A'), after: L('없음', 'None') } }, /not a heading/);

        // Event people: sides, opponent refusal, keep side on update, null clears it.
        const link = fields => submit({ target: 'history_event_person', action: 'create', id: 'ct-event',
            fields: { personId: 'ct-person', relationKind: 'leader', relation: L('지도자', 'Leader'), note: L('설명', 'Note'), ...fields } });
        await refuse({ target: 'history_event_person', action: 'create', id: 'ct-event', fields: { personId: 'ct-person', relationKind: 'opponent', relation: L('가', 'A'), note: L('나', 'B') } }, /names its sides/);
        await refuse({ target: 'history_event_person', action: 'create', id: 'ct-event', fields: { personId: 'ct-person', relationKind: 'leader', side: 'greens', relation: L('가', 'A'), note: L('나', 'B') } }, /side must be one of/);
        await refuse({ target: 'history_event_person', action: 'create', id: 'ct-event', fields: { personId: 'nobody', relationKind: 'leader', relation: L('가', 'A'), note: L('나', 'B') } }, /not found/);
        await refuse({ target: 'history_event_person', action: 'create', id: 'ct-event', fields: { personId: 'ct-person', relationKind: 'hero', relation: L('가', 'A'), note: L('나', 'B') } }, /relationKind/);
        await link({ side: 'reds' });
        const linkRow = () => one("SELECT side, relation_ko, sort_order FROM commulingo_history_event_people WHERE event_id = 'ct-event' AND person_id = 'ct-person'");
        assert.deepEqual(await linkRow(), { side: 'reds', relation_ko: '지도자', sort_order: 0 });
        await link({ relation: L('최고 지도자', 'Top leader') });
        assert.deepEqual(await linkRow(), { side: 'reds', relation_ko: '최고 지도자', sort_order: 0 }, 'an update without side keeps it and its place');
        await link({ side: null });
        assert.equal((await linkRow()).side, null);
        const noteRow = () => one("SELECT note_ko FROM commulingo_history_event_people WHERE event_id = 'ct-event' AND person_id = 'ct-person'");
        await submit({ target: 'history_event_person', action: 'update', id: 'ct-event',
            fields: { personId: 'ct-person', relationKind: 'leader', relation: L('지도자', 'Leader') } });
        assert.equal((await noteRow()).note_ko, '설명', 'an update without note keeps the caption');
        assert.ok(await one("SELECT 1 AS ok FROM commulingo_people_revisions WHERE entity_type = 'history_event_person' AND entity_id = 'ct-event/ct-person'"));

        // Office rows through the office store, staged creates leave no row.
        const made = await submit({ target: 'office_row', action: 'create', id: 'ct-office', fields: { period: { start: [1917], end: [1924] }, personId: 'ct-person', name: L('시험 인물', 'Test Person') } });
        assert.equal(made.status, 'approved');
        assert.ok(made.rowId);
        await submit({ target: 'office_row', action: 'update', id: String(made.rowId), fields: { note: L('비고', 'Note') } });
        assert.equal((await one('SELECT note_ko FROM commulingo_office_rows WHERE id = $1', [made.rowId])).note_ko, '비고');
        const stagedRow = await submit({ target: 'office_row', action: 'create', id: 'ct-office', directApply: false, fields: { period: { start: [1925] }, name: L('나중', 'Later') } });
        assert.equal(stagedRow.status, 'pending');
        assert.equal((await one("SELECT count(*)::int AS n FROM commulingo_office_rows WHERE office_id = 'ct-office'")).n, 1);
        await refuse({ target: 'office_row', action: 'create', id: 'ct-office', fields: { period: { start: [1930] }, personId: 'nobody' } }, /does not exist/);
        await submit({ target: 'office_row', action: 'delete', id: String(made.rowId), fields: {} });
        assert.equal((await one("SELECT count(*)::int AS n FROM commulingo_office_rows WHERE office_id = 'ct-office'")).n, 0);

        console.log('content editorial db ok');
    } finally {
        await client.query('ROLLBACK');
        client.release();
        await db.end();
    }
})().catch(err => {
    console.error(err);
    process.exit(1);
});
