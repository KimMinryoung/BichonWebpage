// utils/local-date.js: dates are written on the server in Asia/Seoul, so a
// moment late in the UTC day lands on the next Korean day.
const assert = require('assert');
const path = require('path');
const ejs = require('ejs');
const { localDate, localDateShort } = require('../../utils/local-date');

const lateUtc = '2026-11-01T16:30:00Z'; // 2026-11-02 01:30 in Seoul
assert.strictEqual(localDate(lateUtc, 'ko', '에 작성'), '2026년 11월 2일에 작성');
assert.strictEqual(localDate(new Date(lateUtc), 'en', ', written'), 'November 2, 2026, written');
assert.strictEqual(localDateShort(lateUtc, 'ko'), '2026. 11. 2.');
assert.strictEqual(localDateShort(lateUtc, 'en'), '11/2/2026');
assert.strictEqual(localDate(null, 'ko'), '');
assert.strictEqual(localDate('not a date', 'ko', '에 작성'), '');

// A list partial carries the text inside <time>, not only the attribute.
const file = path.join(__dirname, '../../views/partials/library-hub-items.ejs');
ejs.renderFile(file, {
    lang: 'ko', items: [{ id: 1, published_at: lateUtc, title: 't', slug: 's' }],
    localDate, localDateShort, strings: {}, iconPaths: {}, languageUrl: p => p,
}, (err, html) => {
    if (err) throw err;
    assert.match(html, /<time class="local-date"[^>]*>2026년 11월 2일에 선정<\/time>/);
});
console.log('local-date ok');
