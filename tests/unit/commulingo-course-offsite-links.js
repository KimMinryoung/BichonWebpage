#!/usr/bin/env node
// A course must not send readers off-site for a work the library hosts
// (2026-11-09: Lenin's Imperialism, Hilferding, Engels and Kollontai were
// linked to marxists.org while their translations were on the site).
// sourceProblems matches 『』/「」 titles in a reading title or source label
// against the documents' Korean titles and aliases; `offsite` keeps a link
// whose part the site document lacks.
const assert = require('node:assert/strict');

const docsStore = require.resolve('../../data/commulingo/docs-store');
require.cache[docsStore] = { id: docsStore, filename: docsStore, loaded: true, exports: {
    getCommuLingoDoc: () => null,
    getCommuLingoDocContent: () => ({ html: '' }),
    listCommuLingoDocs: () => [
        { id: 'lenin-imperialism-1916', title: { ko: '레닌, 『자본주의의 최고 단계로서의 제국주의』' }, aliases: { ko: ['『제국주의론』'] } },
        { id: 'lenin-state-and-revolution-1917', title: { ko: '레닌, 『국가와 혁명』' }, aliases: { ko: ['국가와 혁명'] } },
    ],
} };

const { sourceProblems, validateCourseShape } = require('../../data/commulingo/course-validation');

const course = (readings, source) => ({
    id: 'c', format: 'course', chapters: [{ id: 'c-ch01', readings, lessons: [{ id: 'c-ch01-basic', questions: [{ id: 'q1', source }] }] }],
});
const external = 'https://www.marxists.org/archive/lenin/works/1916/imp-hsc/ch03.htm';

const flagged = sourceProblems(course(
    [{ title: { ko: '『제국주의론』 제3장', en: 'Imperialism, ch. 3' }, year: 1916, url: external }],
    { kind: 'reference', href: 'https://www.marxists.org/archive/lenin/works/1917/staterev/ch05.htm', label: { ko: '레닌, 『국가 와 혁명』 제5장', en: 'Lenin' } },
));
assert.equal(flagged.length, 2, flagged.join('\n'));
assert.match(flagged[0], /readings\[0\].*『제국주의론』.*lenin-imperialism-1916/);
assert.match(flagged[1], /c-ch01-basic\/q1.*\/commulingo\/docs\/lenin-state-and-revolution-1917/);

// Site links, unhosted works and declared exceptions pass.
assert.deepEqual(sourceProblems(course(
    [{ title: { ko: '『독점자본』', en: 'Monopoly Capital' }, year: 1966, url: 'https://example.org/mc' },
     { title: { ko: '『제국주의론』 제2장 별첨', en: 'x' }, year: 1916, url: external, offsite: '사이트 번역에 없는 별첨' }],
    { kind: 'reference', href: '/commulingo/docs/lenin-imperialism-1916', label: { ko: '『제국주의론』', en: 'x' } },
)), []);

// offsite belongs to a url reading and must give a reason.
process.env.COMMULINGO_COURSES_SEED = '1';
const { loadCommuLingoBundle } = require('../../data/commulingo');
const seed = JSON.parse(JSON.stringify(loadCommuLingoBundle().bundle.collections.find(c => c.id === 'capital-vol1')));
const withReading = reading => { seed.chapters[0].readings = [reading]; return seed; };
validateCourseShape(`course/${seed.id}`, withReading({ title: { ko: 'a', en: 'a' }, year: 1916, url: external, offsite: '별첨' }));
assert.throws(() => validateCourseShape(`course/${seed.id}`, withReading({ title: { ko: 'a', en: 'a' }, year: 1916, doc: 'lenin-imperialism-1916', offsite: 'x' })), /offsite needs a url/);
console.log('course off-site links to hosted works are refused OK');
