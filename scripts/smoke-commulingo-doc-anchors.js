// Anchored document aliases (manifest `anchors`): a report that cites NATO 4조
// and NATO 5조 links each to its article, the whole-document alias still links
// the page top, a repeat stays plain, and the related panel lists the document
// once. Reviews gate anchored expressions like every other one.
const assert = require('assert');
const { buildDocLinkIndex, sourceExpressions } = require('../data/commulingo/doc-linkify');
const { createLinker } = require('../data/commulingo/linkify');
const { catalogue } = require('../data/commulingo/link-review-catalog');
const { reviewMap } = require('../data/commulingo/link-review-policy');
const { installLinkBlocklist } = require('../data/commulingo/link-blocklist');
installLinkBlocklist([]);

const doc = {
    id: 'north-atlantic-treaty-1949',
    title: { ko: '북대서양 조약', en: 'The North Atlantic Treaty' },
    kind: { ko: '조약·협정', en: 'Treaties & agreements' },
    aliases: { ko: ['NATO 조약'], en: ['NATO treaty'] },
    anchors: {
        'art-4': { ko: ['NATO 4조'], en: ['NATO Article 4'] },
        'art-5': { ko: ['NATO 5조', 'NATO 조약'], en: ['NATO Article 5'] },
    },
};
// A plain alias wins over an anchored spelling of the same text.
assert.deepStrictEqual(sourceExpressions(doc, 'ko').map(e => e.text + (e.anchor ? '#' + e.anchor : '')),
    ['NATO 조약', 'NATO 4조#art-4', 'NATO 5조#art-5']);

const linker = createLinker({ doc: buildDocLinkIndex([doc], { lang: 'ko', legacyReview: true }) }, { surface: 'report' });
const html = linker.html('<p>NATO 4조 협의와 NATO 5조 발동, 그리고 NATO 조약 전체. 다시 NATO 5조.</p>');
assert.match(html, /href="\/commulingo\/docs\/north-atlantic-treaty-1949#art-4"[^>]*>NATO 4조<\/a>/);
assert.match(html, /href="\/commulingo\/docs\/north-atlantic-treaty-1949#art-5"[^>]*>NATO 5조<\/a>/);
assert.match(html, /href="\/commulingo\/docs\/north-atlantic-treaty-1949"[^>]*>NATO 조약<\/a>/);
assert.strictEqual((html.match(/<a /g) || []).length, 3, 'a repeated anchored alias stays plain');
assert.deepStrictEqual(linker.found.docs.map(d => d.id + ' ' + d.href), ['north-atlantic-treaty-1949 /commulingo/docs/north-atlantic-treaty-1949']);

// Unreviewed anchored aliases do not link; a review approves them by text.
const rows = catalogue({ term: [], event: [], doc: [doc] }).filter(row => row.lang === 'ko');
assert.deepStrictEqual(rows.map(row => row.text), ['NATO 조약', 'NATO 4조', 'NATO 5조']);
assert(rows.every(row => row.policy === 'search'));
const reviews = reviewMap(rows.filter(row => row.text === 'NATO 5조').map(row => ({ kind: 'doc', entity_id: doc.id, lang: 'ko',
    expression: row.text, source_signature: row.sourceSignature, role: 'related', policy: 'auto' })));
const reviewed = buildDocLinkIndex([doc], { lang: 'ko', reviews });
assert.deepStrictEqual(Object.keys(reviewed.byAlias), ['NATO 5조']);
assert.strictEqual(reviewed.byAlias['NATO 5조'].href, '/commulingo/docs/north-atlantic-treaty-1949#art-5');
console.log('smoke-commulingo-doc-anchors: ok');
