#!/usr/bin/env node
// Isolated review tables + synthetic corpus, never the production content mount.
if (process.env.COMMULINGO_ISOLATED_TEST !== '1' || process.env.DB_NAME !== 'commulingo_integrity_test'
    || !process.env.DB_HOST || !process.env.COMMULINGO_LINK_REVIEWS_SNAPSHOT?.startsWith('/tmp/')) {
    throw new Error('Explicit isolated DB and /tmp review snapshot required');
}
const assert = require('assert');
const db = require('../config/database');
function stub(file, value) { require.cache[require.resolve(file)] = { id: require.resolve(file), filename: require.resolve(file), loaded: true, exports: value }; }
const term = [{ id: 'fixture-link', term: { ko: '1917년 러시아 7월 사태', en: 'Russian July Days (1917)' }, aliases: { ko: ['7월 위기'], en: ['July Crisis'] }, body: { ko: '1917년 러시아 7월 사태와 7월 위기.' } }];
const event = [{ id: 'fixture-wwi', title: { ko: '제1차 세계대전' }, body: { ko: '1914년 7월 위기가 전쟁으로 이어졌다.' } }];
stub('../data/commulingo/terms-store', { loadCommuLingoTerms: async () => term });
stub('../data/commulingo/history-events-store', { loadCommuLingoHistoryEvents: async () => event });
stub('../data/commulingo/docs-store', { listCommuLingoDocs: () => [], getCommuLingoDocContent: () => null });
stub('../data/commulingo/people-store', { loadCommuLingoPeople: async () => ({ data: { people: [], sections: {} } }) });
// Keep the real createLinker/renderLinkedContent; only avoid loading production indexes.
const linking = require('../data/commulingo/linkify');
linking.getLinkIndexes = async () => ({});
const { installLinkBlocklist } = require('../data/commulingo/link-blocklist');
installLinkBlocklist([]);
const service = require('../data/commulingo/link-review-service');
(async () => {
    await db.query('CREATE TABLE IF NOT EXISTS research_documents(slug text,markdown text,status text)');
    await db.query('TRUNCATE commulingo_link_reviews,commulingo_link_review_history,research_documents');
    let list = await service.listReviews({ pending: true });
    assert(list.total >= 4);
    const input = { kind: 'term', id: 'fixture-link', lang: 'ko', text: '1917년 러시아 7월 사태', role: 'identity', policy: 'auto', note: '러시아와 1917년을 명시하여 다른 사건과 구분합니다.' };
    const first = await service.previewLinks(input);
    assert(first.token && first.samples.length);
    await service.saveReview(first.token, 'isolated-test');
    assert.strictEqual((await db.query('SELECT count(*) FROM commulingo_link_review_history')).rows[0].count, '1');
    await assert.rejects(service.saveReview(first.token, 'isolated-test'), { status: 409 });
    const generic = { ...input, text: '7월 위기', role: 'short' };
    await assert.rejects(service.previewLinks(generic), { status: 400 });
    const safe = await service.previewLinks({ ...generic, policy: 'context' });
    const wwi = safe.samples.find(sample => sample.where === 'event:fixture-wwi/body');
    assert(wwi && wwi.after.length === 0, '1914 stays unlinked in actual renderer');
    await service.saveReview(safe.token, 'isolated-test');
    const pending = await service.previewLinks({ ...generic, policy: 'search' });
    event[0].body.ko += ' 본문 수정';
    await assert.rejects(service.saveReview(pending.token, 'isolated-test'), { status: 409 });
    const a = await service.previewLinks({ ...generic, policy: 'search' });
    const b = await service.previewLinks({ ...generic, policy: 'search' });
    const results = await Promise.allSettled([service.saveReview(a.token, 'isolated-test'), service.saveReview(b.token, 'isolated-test')]);
    assert.strictEqual(results.filter(r => r.status === 'fulfilled').length, 1);
    assert.strictEqual(results.find(r => r.status === 'rejected').reason.status, 409);
    // Transaction rollback: force the audit insert to fail after the current-row upsert.
    const rollback = await service.previewLinks({ ...generic, policy: 'context' });
    await db.query("CREATE FUNCTION reject_link_history() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture audit failure'; END $$");
    await db.query('CREATE TRIGGER reject_history BEFORE INSERT ON commulingo_link_review_history FOR EACH ROW EXECUTE FUNCTION reject_link_history()');
    await assert.rejects(service.saveReview(rollback.token, 'isolated-test'), /fixture audit failure/);
    assert.strictEqual((await db.query('SELECT policy FROM commulingo_link_reviews WHERE expression=$1', ['7월 위기'])).rows[0].policy, 'search');
    await db.query('DROP TRIGGER reject_history ON commulingo_link_review_history');

    term[0].term.ko = '새로운 표제어';
    list = await service.listReviews({ pending: true });
    assert(list.rows.some(row => row.text === '7월 위기' && !row.reviewed));
    term.push({ id: 'fixture-dup-a', term: { ko: '중복 검증 A' }, aliases: { ko: ['공유 별칭'] } },
        { id: 'fixture-dup-b', term: { ko: '중복 검증 B' }, aliases: { ko: ['공유 별칭'] } });
    const duplicateA = { kind: 'term', id: 'fixture-dup-a', lang: 'ko', text: '공유 별칭', role: 'identity', policy: 'auto', note: '동명이의 표현을 대조하여 이 항목을 대표 연결 대상으로 선정합니다.' };
    await assert.rejects(service.previewLinks(duplicateA), { status: 400 });
    const duplicateB = { ...duplicateA, id: 'fixture-dup-b', policy: 'search' };
    await service.saveReview((await service.previewLinks(duplicateB)).token, 'isolated-test');
    await service.saveReview((await service.previewLinks(duplicateA)).token, 'isolated-test');
    await assert.rejects(service.previewLinks({ ...duplicateB, policy: 'auto' }), { status: 400 });
    const currentPolicies = (await db.query("SELECT entity_id, policy FROM commulingo_link_reviews WHERE expression='공유 별칭' ORDER BY entity_id")).rows;
    assert.deepStrictEqual(currentPolicies.map(r => r.policy), ['auto', 'search']);
    term.find(r => r.id === 'fixture-dup-a').body = { ko: '공유 별칭을 설명하는 본문이다.' };
    await assert.rejects(service.previewReviews([duplicateA, { ...duplicateB, policy: 'auto' }]), { status: 400 });
    const batch = await service.previewReviews([{ ...duplicateA, policy: 'search' }, { ...duplicateB, policy: 'auto' }]);
    assert(batch.results.every(r => r.sampledPassages === 1));
    assert(batch.results[0].samples[0].after.some(link => link.id === 'fixture-dup-b'));
    assert.strictEqual((await service.saveReviews(batch.token, 'isolated-test')).length, 2);
    await assert.rejects(service.saveReviews(batch.token, 'isolated-test'), { status: 409 });
    const staleBatch = await service.previewReviews([duplicateA, duplicateB]);
    term[0].body.ko += ' 일괄 미리보기 뒤 변경';
    await assert.rejects(service.saveReviews(staleBatch.token, 'isolated-test'), { status: 409 });
    const failedBatch = await service.previewReviews([duplicateA, duplicateB]);
    await db.query("CREATE TRIGGER reject_history BEFORE INSERT ON commulingo_link_review_history FOR EACH ROW EXECUTE FUNCTION reject_link_history()");
    await assert.rejects(service.saveReviews(failedBatch.token, 'isolated-test'), /fixture audit failure/);
    assert.deepStrictEqual((await db.query("SELECT policy FROM commulingo_link_reviews WHERE expression='공유 별칭' ORDER BY entity_id")).rows.map(r => r.policy), ['search', 'auto']);
    await db.query('DROP TRIGGER reject_history ON commulingo_link_review_history');
    await db.query('DROP FUNCTION reject_link_history()');
    console.log('isolated DB: batch final-state collisions, renderer preview, replay, stale corpus and atomic rollback passed');
    console.log('isolated DB: unique collision destination approved only after explicit competitor review');
    console.log('isolated DB: preview, approval, replay, stale prose, concurrent approval and atomic history rollback passed');
})().then(() => db.end()).catch(error => { console.error(error); process.exitCode = 1; return db.end(); });
