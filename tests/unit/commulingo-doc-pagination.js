const assert = require('node:assert/strict');
const { paginateBody, headingText, PAGE_TARGET_TEXT, PAGE_MAX_HTML } = require('../../data/commulingo/doc-pagination');

const para = (size, word = '가') => `<p>${word.repeat(size)}</p>`;
const paras = (count, size) => Array.from({ length: count }, () => para(size)).join('\n');
const textOf = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
const joined = paged => paged.titleHtml + paged.pages.map(page => page.html).join('');

// Short documents stay on one scroll, however much markup or how many headings.
assert.equal(paginateBody(`<article><h1>T</h1>${paras(10, 1000)}</article>`), null);
assert.equal(paginateBody(`<article><h1>T</h1>${'<p class="long-class-name-here"></p>'.repeat(3000)}${para(100)}</article>`), null);

// No headings at all: long text is still cut, at paragraphs, near the target,
// with nothing lost, and the title on every page rather than in any page.
{
    const html = `<article><h1>Title</h1><aside class="doc-editorial"><p>해제</p></aside>\n${paras(300, 500)}</article>`;
    const paged = paginateBody(html);
    assert.ok(paged.pages.length >= 4 && paged.pages.length <= 7, String(paged.pages.length));
    assert.equal(paged.titleHtml, '<article><h1>Title</h1>');
    assert.equal(textOf(joined(paged)), textOf(html));
    for (const page of paged.pages) assert.ok(textOf(page.html).length <= PAGE_TARGET_TEXT * 1.35);
    assert.match(paged.pages[0].html, /doc-editorial/);
    assert.doesNotMatch(paged.pages[1].html, /doc-editorial/);
    assert.equal(paged.pages[1].continued, false, 'nothing to continue: the title is not a section');
    assert.equal(paged.pages[1].heading, '');
}

// A cut prefers a heading inside the window over a closer paragraph; a page
// that starts inside a section names that section as continued.
{
    const html = `<article><h1>Title</h1><h2 id="a">A</h2>${paras(25, 1000)}<h2 id="b">B</h2>${paras(120, 1000)}</article>`;
    const paged = paginateBody(html);
    assert.equal(paged.idToPage.a, 1);
    assert.equal(paged.idToPage.b, 2);
    assert.equal(paged.pages[1].heading, 'B');
    assert.equal(paged.pages[1].continued, false);
    assert.equal(paged.pages[2].heading, 'B');
    assert.equal(paged.pages[2].continued, true);
}

// A page's heading is plain text, for callers that escape it.
{
    const paged = paginateBody(`<article><h1>T</h1><h2 id="a">&lt;서문&gt;</h2>${paras(120, 1000)}</article>`);
    assert.equal(paged.pages[1].heading, '<서문>');
    assert.equal(paged.pages[1].continued, true);
}

// Tables, lists, quotations and the notes section are never cut inside, and a
// note reference reaches its note across pages.
{
    const rows = Array.from({ length: 200 }, () => `<tr><td>${'나'.repeat(500)}</td></tr>`).join('');
    const items = Array.from({ length: 100 }, () => `<li>${'다'.repeat(500)}</li>`).join('');
    const notes = `<section class="notes" aria-labelledby="notes-heading"><h2 id="notes-heading">주석</h2><ol class="notes-list"><li id="note-1">주 <a href="#ref-1">↩</a></li></ol></section>`;
    const html = `<article><h1>T</h1><p><a id="ref-1" href="#note-1">[1]</a></p>${paras(40, 1000)}<table>${rows}</table>${paras(40, 1000)}<ul>${items}</ul>${paras(40, 1000)}<blockquote>${paras(80, 1000)}</blockquote>${paras(40, 1000)}${notes}</article>`;
    const paged = paginateBody(html);
    assert.equal(textOf(joined(paged)), textOf(html));
    for (const page of paged.pages) {
        for (const tag of ['table', 'ul', 'blockquote', 'section']) {
            const opened = (page.html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
            const closed = (page.html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
            assert.equal(opened, closed, `${tag} balanced on every page`);
        }
    }
    const last = paged.pages.length;
    assert.match(paged.pages[last - 1].html, /<section class="notes"[^>]*><h2 id="notes-heading">/);
    assert.match(paged.pages[0].html, new RegExp(`href="\\?p=${last}#note-1"`));
    assert.match(paged.pages[last - 1].html, /href="\?p=1#ref-1"/);
    // An arrival from elsewhere can hop to any anchor, not only a heading.
    assert.equal(paged.idToPage['note-1'], last);
    assert.equal(paged.idToPage['ref-1'], 1);
}

// A wrapper open at a cut closes and reopens, keeping its class but not its id.
{
    const html = `<article><h1>T</h1><section id="s" class="part">${paras(150, 1000)}</section></article>`;
    const paged = paginateBody(html);
    assert.ok(paged.pages.length > 1);
    assert.match(paged.pages[0].html, /<section id="s" class="part">/);
    assert.match(paged.pages[0].html, /<\/section>$/);
    assert.match(paged.pages[1].html, /^<section class="part">/);
    assert.equal(textOf(joined(paged)), textOf(html));
}

// An h1 opens a page only once the page holds enough, and a short tail stays
// with the page before it.
{
    const short = Array.from({ length: 12 }, (_, i) => `<h1 id="law-${i}">법 ${i}</h1>${para(2000)}`).join('');
    const paged = paginateBody(`<article><h1>T</h1>${para(30000)}${short}</article>`);
    assert.ok(paged.pages.length <= 4, String(paged.pages.length));
    const tail = paginateBody(`<article><h1>T</h1>${paras(45, 1000)}<h1 id="end">끝</h1>${para(300)}</article>`);
    assert.equal(tail.pages.length, 2);
    assert.equal(tail.idToPage.end, 2);
}

// Embedded images count against the page's size, not its reading text.
{
    const image = `<p><img src="data:image/png;base64,${'A'.repeat(900000)}"></p>`;
    const paged = paginateBody(`<article><h1>T</h1>${image.repeat(6)}${para(10)}</article>`);
    assert.ok(paged && paged.pages.length >= 3, 'split by size');
    for (const page of paged.pages) assert.ok(page.html.length <= PAGE_MAX_HTML);
}

// A note reference in a heading stays out of the heading's name.
{
    const ref = '<a class="note-ref" id="ref-1" href="#note-1" aria-label="주석 1">[1]</a>';
    assert.equal(headingText(`<h2 id="a">제1장 부르주아와 프롤레타리아${ref}</h2>`), '제1장 부르주아와 프롤레타리아');
    assert.equal(headingText('<h2><a href="#x">링크 제목</a></h2>'), '링크 제목');
}

console.log('Long documents page at the strongest boundary near the target without cutting blocks.');
