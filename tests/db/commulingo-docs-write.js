#!/usr/bin/env node
// @requires isolated-db
// Reference-document writes against an isolated DB (docs-db.js writeDocs),
// for the 2026-11-28 review follow-ups: a public original states its status
// in the bibliography (no rights column), documents have no sort_order, a
// redirect may name no anchor, an original's revision keeps the body only
// when it changed, the link audit is stored and skipped when its inputs did
// not change, and link drift compares against it. Migrations 387 and 388 are
// applied inside the transaction when the copied schema predates them.
// Everything is rolled back.
if (process.env.COMMULINGO_ISOLATED_TEST !== '1' || process.env.DB_NAME !== 'commulingo_integrity_test') {
    throw new Error('Requires COMMULINGO_ISOLATED_TEST=1 and DB_NAME=commulingo_integrity_test');
}
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..', '..');
const db = require(path.join(root, 'config/database'));
const { writeDocs, linkSet } = require(path.join(root, 'data/commulingo/docs-db'));

const migration = name => fs.readFileSync(path.join(root, 'scripts/migrations', name), 'utf8').replace(/^\s*(BEGIN|COMMIT);\s*$/gm, '');

const BODY = '<article><h1>시험 문헌</h1><p class="doc-byline">지은이</p>'
    + '<aside class="doc-editorial"><p class="doc-editorial-label">해제</p><p>무엇.</p></aside>'
    + '<h2 id="part-1">첫째 절</h2><p>본문.</p></article>';
const ENTRY = {
    docLang: 'ko', title: { ko: '시험 문헌', en: 'Test document' }, description: { ko: '', en: '' },
    summary: { ko: '시험용 문헌.', en: 'A test document.' }, kind: { ko: '이론·논설', en: 'Theory & essays' }, date: '1900',
    bibliography: { parts: [{ sourceText: '시험 저본' }] },
};
const RIGHTS = { text: '저자 1900년 사망.', status: 'publicDomain', authorDied: 1900 };
const ORIGINAL = '<article><h1>Test</h1><aside class="doc-editorial" lang="ko"><p>해제</p></aside>'
    + '<aside class="doc-editorial" lang="en"><p>Note</p></aside><h2 id="part-1">One</h2><p>Text.</p></article>';

(async () => {
    const client = await db.connect();
    const one = async (sql, params) => (await client.query(sql, params)).rows[0];
    const opts = { actor: 'docs-test', client };
    // A refused write may leave the transaction aborted: each runs in a savepoint.
    const refused = async (write, pattern) => {
        await client.query('SAVEPOINT refused');
        await assert.rejects(write(), pattern);
        await client.query('ROLLBACK TO SAVEPOINT refused');
    };
    try {
        await client.query('BEGIN');
        await client.query(migration('387_commulingo_docs_review_relax.sql'));
        await client.query(migration('388_commulingo_docs_review_drop.sql'));

        // A new document: no sort_order, the link audit stored with it.
        const created = await writeDocs({ upserts: [{ id: 'zz-docs-test', entry: ENTRY, body: BODY }] }, opts);
        assert.equal(created.written[0].op, 'insert');
        const row = await one("SELECT link_audit FROM commulingo_docs WHERE id = 'zz-docs-test'");
        assert.ok(Array.isArray(row.link_audit.links), 'audit recorded');

        // A summary edit does not re-run the audit; a people change does.
        const summary = await writeDocs({ upserts: [{ id: 'zz-docs-test', entry: { ...ENTRY, summary: { ko: '고친 요약.', en: 'Edited.' } }, expectedRevision: 1 }] }, opts);
        assert.equal(summary.written[0].op, 'update');
        assert.equal(summary.linkAudits.length, 0, 'audit skipped');
        assert.deepEqual((await one("SELECT link_audit FROM commulingo_docs WHERE id = 'zz-docs-test'")).link_audit.links, row.link_audit.links, 'kept');

        // A public original needs its status in every language.
        const original = bibliography => ({ originals: { set: [{ docId: 'zz-docs-test', lang: 'en', body: ORIGINAL, public: true, bibliography }] } });
        await refused(() => writeDocs(original({ ko: { parts: [{ rights: RIGHTS }] }, en: { parts: [{ rights: 'PD' }] } }), opts), /en\.parts\[0\]\.rights\.status/);
        await refused(() => writeDocs({ originals: { set: [{ docId: 'zz-docs-test', lang: 'en', body: ORIGINAL, public: true, rights: 'PD' }] } }, opts), /original\.rights is retired/);
        const both = { ko: { parts: [{ rights: RIGHTS }] }, en: { parts: [{ rights: RIGHTS }] } };
        const stored = await writeDocs(original(both), opts);
        assert.equal(stored.originals[0].op, 'insert');
        // A bibliography-only edit keeps no copy of the body; a body edit does.
        const edited = { ...both, en: { parts: [{ rights: RIGHTS, scope: 'All.' }] } };
        await writeDocs({ originals: { set: [{ docId: 'zz-docs-test', lang: 'en', body: ORIGINAL, public: true, bibliography: edited, expectedRevision: 1 }] } }, opts);
        await writeDocs({ originals: { set: [{ docId: 'zz-docs-test', lang: 'en', body: ORIGINAL.replace('Text.', 'More text.'), public: true, expectedRevision: 2 }] } }, opts);
        const kept = (await client.query("SELECT revision, body IS NOT NULL AS has_body, rights FROM commulingo_doc_original_revisions WHERE doc_id = 'zz-docs-test' ORDER BY revision")).rows;
        assert.deepEqual(kept.map(r => [r.revision, r.has_body, r.rights]), [[1, false, ''], [2, true, '']]);

        // A redirect may send a retired id to the head of the document.
        await writeDocs({ redirects: { set: { 'zz-docs-old': { id: 'zz-docs-test' } } } }, opts);
        assert.equal((await one("SELECT anchor FROM commulingo_doc_redirects WHERE from_id = 'zz-docs-old'")).anchor, '');
        await refused(() => writeDocs({ redirects: { set: { 'zz-docs-bad': { id: 'zz-docs-test', anchor: 'a#b' } } } }, opts), /anchor must be/);

        assert.deepEqual(linkSet('<a href="/commulingo/people/marx">M</a><a href="/en/commulingo/terms/nep">N</a><a href="/commulingo/people/marx">M</a>'), ['person:marx', 'term:nep']);
        await client.query('ROLLBACK');
        console.log('ok docs writes (rights status, sort order, redirects, original revisions, link audit)');
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
    } finally {
        client.release();
        await db.end?.();
    }
})().catch(err => {
    console.error(err);
    process.exit(1);
});
