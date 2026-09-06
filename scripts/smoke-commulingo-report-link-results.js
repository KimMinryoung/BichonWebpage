#!/usr/bin/env node
const assert = require('assert');
const { buildPersonLinkIndex } = require('../data/commulingo/people-linkify');
const { buildDocLinkIndex } = require('../data/commulingo/doc-linkify');
const { compileResearchBody } = require('../services/research-body');
const researchStore = require('../config/research-store');
const reportLinks = require('../data/commulingo/report-links');
const series = require('../services/research-series');

const person = (id, given, family) => ({ id, displayName: given + ' ' + family, names: { given, family, short: given + ' ' + family, display: given + ' ' + family } });
const indexes = {
    person: buildPersonLinkIndex([person('ford', '제럴드', '포드'), person('henry', '헨리', '블랙'), person('lenin', '블라디미르', '레닌')]),
    doc: buildDocLinkIndex([{ id: 'lenin-study', title: { ko: '레닌 연구' }, aliases: { ko: ['레닌 연구'] } }]),
};
const rows = [{ filename: 'test.md', slug: 'test', title: '제목', markdown: '# 포드\n\n헨리 포드의 이야기.\n\n`포드`\n\n레닌 연구.\n\n[저자](/commulingo/people/lenin)', updated_at: '2026-09-06' }];
researchStore.listResearchTexts = async () => rows;
reportLinks.getReportLinkContext = async () => indexes;
series.publishedReportSlugs = async () => new Set(['test']);

(async () => {
    const data = researchStore.localizeResearch(rows[0], 'ko');
    const compiled = compileResearchBody(data, indexes, new Set(['test']));
    assert.deepStrictEqual(compiled.people.map(entry => entry.id), ['lenin']);
    assert.deepStrictEqual(compiled.docs.map(entry => entry.id), ['lenin-study']);
    assert.strictEqual(compiled.links.length, 2);
    assert(compiled.html.includes('<code>포드</code>'));
    assert.doesNotMatch(compiled.html, /people\/ford/);
    assert.strictEqual(compiled, compileResearchBody(data, indexes, new Set(['test'])));
    assert.notStrictEqual(compiled, compileResearchBody({ ...data, content: data.content + '\n\n추가' }, indexes, new Set(['test'])));
    assert.notStrictEqual(compiled, compileResearchBody(data, indexes, new Set(['other'])));

    const { renderResearch } = require('../services/research-render');
    let rendered;
    await renderResearch({ locals: { lang: 'ko' }, render: (_view, value) => { rendered = value; } }, {
        filename: 'test.md', slug: 'test', pagePath: '/reports/research/test', data,
    });
    assert.strictEqual(rendered.htmlBody, compiled.html);
    assert.deepStrictEqual(rendered.relatedPeople.map(p => p.id), ['lenin']);
    const mentions = require('../services/report-mentions');
    assert.deepStrictEqual(await mentions.getReportsForPerson('ford', 'ko'), []);
    const related = await mentions.getReportsForPerson('lenin', 'ko');
    assert.strictEqual(related.length, 1);
    const anchor = decodeURIComponent(related[0].href.split('#')[1]);
    assert(compiled.html.includes('id="' + anchor + '"'));
    // No English translation: reverse links must use the same Korean fallback
    // as the rendered English route, including manually supplied entity links.
    assert.strictEqual((await mentions.getReportsForPerson('lenin', 'en')).length, 1);
    console.log('OK — report HTML, panels, reverse links, manual anchors, cache and language fallback agree');
    process.exit(0);
})().catch(error => { console.error(error); process.exit(1); });
