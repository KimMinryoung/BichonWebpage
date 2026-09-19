const assert = require('node:assert/strict');
const { renderMarkdown } = require('../utils/markdown');
const { localizedPersonSections } = require('../data/commulingo/people-view');

// A person section already renders its heading as <h2>; sub-headings the
// writer puts in the body ("## 생애") must nest under it, not sit beside it.
const [section] = localizedPersonSections([{ slug: 'life', heading: { ko: '생애', en: 'Life' },
    body: { ko: '## 어린 시절\n문단.\n### 학교\n문단.', en: 'x' } }], 'ko');
assert.match(section.bodyHtml, /<h3>어린 시절<\/h3>/);
assert.match(section.bodyHtml, /<h4>학교<\/h4>/);
assert.doesNotMatch(section.bodyHtml, /<h2>/);
assert.equal(renderMarkdown('###### 끝', { headingShift: 1 }), '<h6>끝</h6>');
assert.equal(renderMarkdown('## 그대로'), '<h2>그대로</h2>');
console.log('section markdown: body headings nest under the section heading');
