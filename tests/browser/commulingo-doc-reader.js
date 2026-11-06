// The reader's script (public/js/commulingo-doc.js) on the seed documents
// (tests/fixtures/commulingo-docs-seed.json), served by the real documents
// route on a test server: the anchor hop to the page holding the anchor, the
// footnote popover (hover previews a note that lives on another page, a tap
// pins it instead of leaving the page, Esc closes it, the popover's link goes
// to the notes list and the note's ↩ comes back by history), the DPUB-ARIA
// roles, the fictionalized name popover (on a mark injected into the page),
// the contents panel closing on a pick, the page numbers, the version switch
// landing on the section being read, and the reading position: recorded while scrolling,
// offered on the next plain visit, dismissable, marked on the library list,
// forgotten at the end of the last page.
/* global document, window, sessionStorage, localStorage */
const assert = require('node:assert/strict');
const { launchChromium } = require('../lib/browser');
const { createGameTestServer } = require('../lib/game-test-server');
const { getCommuLingoDoc } = require('../../data/commulingo/docs-store');

if (!getCommuLingoDoc('seed-long-treatise')) {
    console.log('skip doc reader: this checkout serves stored documents, not the seed');
    process.exit(0);
}

function routes(app) {
    // The reader's crumb partial reads the role icon helper the site's
    // view-locals middleware provides; the test server sets the rest.
    const { roleIconSvg } = require('../../data/commulingo/role-icons');
    const { dictTabs } = require('../../data/commulingo/dict-tabs');
    const { siteStyleModules } = require('../../utils/site-stylesheets');
    app.use((req, res, next) => { Object.assign(res.locals, { roleIconSvg, dictTabs, siteStyleModules }); next(); });
    app.use('/commulingo/docs', require('../../routes/commulingo-docs'));
    app.post('/metrics/menu-view', (req, res) => res.status(204).end());
}

async function main() {
    const { server, origin } = await createGameTestServer({ routes });
    let browser;
    try {
        browser = await launchChromium({ headless: true });
        for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
            const context = await browser.newContext({ viewport, hasTouch: viewport.width < 500 });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', e => errors.push(e.message));
            await page.route('**/*', r => (r.request().url().startsWith(origin) ? r.continue() : r.abort()));

            // An anchor on another page: the hop, before anything renders.
            await page.goto(origin + '/commulingo/docs/seed-long-treatise?p=1#note-5', { waitUntil: 'load' });
            await page.waitForFunction(() => /[?&]p=3/.test(window.location.search));
            assert.ok(await page.$('li#note-5'), 'landed on the page holding the note');

            // Page 1 of the paged treatise calls note 1, which sits on page 3.
            await page.goto(origin + '/commulingo/docs/seed-long-treatise?p=1', { waitUntil: 'load' });
            assert.equal(await page.getAttribute('a.note-ref', 'role'), 'doc-noteref');
            assert.equal(await page.getAttribute('a.note-ref', 'href'), '?p=3#note-1');
            // A template's content is its own fragment: not matched from the document.
            assert.ok(await page.$eval('template.doc-notes-inline', t => Boolean(t.content.querySelector('li#note-1'))), 'the note rides along in the template');
            assert.equal(await page.$('.notes-list'), null, 'the notes section itself is not on page 1');

            const ref = page.locator('a.note-ref').first();
            if (viewport.width >= 500) {
                await ref.hover();
                await page.waitForSelector('.doc-pop-note');
                const text = await page.textContent('.doc-pop-note');
                assert.match(text, /주석 1/);
                assert.match(text, /첫 장의 주석/);
                assert.ok(!(await page.$('.doc-pop-note .back-link')), 'the ↩ stays out of the popover');
                assert.equal(await ref.getAttribute('aria-expanded'), 'true');
                await page.mouse.move(5, 5);
                await page.waitForSelector('.doc-pop-note', { state: 'detached' });
                assert.equal(await ref.getAttribute('aria-expanded'), null);
            }
            // A tap pins the popover and does not leave the page.
            if (viewport.width < 500) await ref.tap(); else await ref.click();
            await page.waitForSelector('.doc-pop-note');
            await page.waitForTimeout(300);
            assert.match(page.url(), /p=1$/, 'still on page 1');
            await page.mouse.move(5, 5);
            await page.waitForTimeout(400);
            assert.ok(await page.$('.doc-pop-note'), 'pinned: leaving it open');
            const box = await page.$eval('.doc-pop-note', el => el.getBoundingClientRect());
            assert.ok(box.left >= 0 && box.right <= viewport.width && box.width > 100, `inside the viewport: ${JSON.stringify(box)}`);
            await page.keyboard.press('Escape');
            await page.waitForSelector('.doc-pop-note', { state: 'detached' });

            // The popover's link goes to the notes list; the note's ↩ comes
            // back to the reference by history (page 1, not another page's
            // first reference).
            await ref.click();
            await page.waitForSelector('.doc-pop-note .doc-pop-jump');
            await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.click('.doc-pop-note .doc-pop-jump')]);
            assert.match(page.url(), /\?p=3#note-1$/);
            assert.equal(await page.getAttribute('section.notes', 'role'), 'doc-endnotes');
            assert.equal(await page.getAttribute('li#note-1 a.back-link', 'role'), 'doc-backlink');
            await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.click('li#note-1 a.back-link')]);
            assert.match(page.url(), /\?p=1$/, 'back to where the reader was');
            assert.equal(await page.evaluate(() => sessionStorage.getItem('commulingo-doc-note-jump')), null);

            // Same-page notes (the short decree) come from the page itself,
            // including the note called twice.
            await page.goto(origin + '/commulingo/docs/seed-land-decree-1917', { waitUntil: 'load' });
            assert.equal(await page.$('template.doc-notes-inline'), null);
            const second = page.locator('a.note-ref#ref-1-2');
            await second.click();
            await page.waitForSelector('.doc-pop-note');
            assert.match(await page.textContent('.doc-pop-note'), /두 번 불린다/);
            assert.match(page.url(), /seed-land-decree-1917$/, 'no jump to #note-1');
            await page.click('h1');
            await page.waitForSelector('.doc-pop-note', { state: 'detached' });

            // A fictionalized name mark gets the figure popover with its link.
            await page.evaluate(() => {
                const p = document.querySelector('.doc-body p');
                p.insertAdjacentHTML('beforeend', ' <a class="fic-name" data-real="블라디미르 레닌" href="/commulingo/people/lenin">울리야노프</a>');
            });
            await page.locator('a.fic-name').click();
            await page.waitForSelector('.doc-pop-name');
            assert.match(await page.textContent('.doc-pop-name'), /실존 인물.*블라디미르 레닌/s);
            assert.equal(await page.getAttribute('.doc-pop-name a', 'target'), '_blank');
            assert.match(page.url(), /seed-land-decree-1917$/, 'the name itself does not navigate');

            // Contents panel: picking an entry closes it.
            await page.goto(origin + '/commulingo/docs/seed-land-decree-1917', { waitUntil: 'load' });
            await page.click('.doc-toc-nav summary');
            assert.equal(await page.$eval('.doc-toc-nav details', d => d.open), true);
            await page.click('.doc-toc-chapters a[href="#art-2"]');
            assert.equal(await page.$eval('.doc-toc-nav details', d => d.open), false);

            // Page numbers: every page below the text and in the contents
            // panel, the current one a mark rather than a link, any other a
            // jump straight to its page.
            await page.goto(origin + '/commulingo/docs/seed-long-treatise?p=2', { waitUntil: 'load' });
            const pageRow = selector => page.$$eval(`${selector} .doc-page-numbers li`, items => items.map(li => ({
                text: li.textContent.trim(),
                href: li.querySelector('a') ? li.querySelector('a').getAttribute('href') : null,
                current: li.querySelector('[aria-current="page"]') !== null,
            })));
            const pagerRow = await pageRow('.doc-pager');
            assert.ok(pagerRow.length >= 3, 'the seed document runs to at least three pages');
            pagerRow.forEach((item, i) => assert.deepEqual(item, {
                text: String(i + 1),
                href: i === 1 ? null : `?p=${i + 1}`,
                current: i === 1,
            }));
            assert.deepEqual(await pageRow('.doc-toc-panel'), pagerRow);
            await page.click('.doc-toc-nav summary');
            await page.click('.doc-toc-panel .doc-page-numbers a[href="?p=3"]');
            await page.waitForURL(/\?p=3$/);

            // Version switch: at the head of the document the original opens
            // at its head; with a heading passed (a short viewport, so the
            // short document can scroll that far) it opens at that section.
            await page.goto(origin + '/commulingo/docs/seed-theses-1845', { waitUntil: 'load' });
            await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.click('.doc-version-switch')]);
            assert.match(page.url(), /\/original$/);
            assert.equal(await page.getAttribute('html', 'lang'), 'de');
            // A short viewport, so the short document can scroll the section
            // under the bar. The link is clicked from the page (a.click()):
            // Playwright's own click first scrolls the sticky bar's link "into
            // view", which moves the document and loses the section — a real
            // click does no such thing.
            const short = await context.newPage();
            await short.setViewportSize({ width: viewport.width, height: 240 });
            const follow = () => Promise.all([short.waitForNavigation({ waitUntil: 'load' }), short.$eval('.doc-version-switch', a => a.click())]);
            await short.goto(origin + '/commulingo/docs/seed-theses-1845#thesis-2', { waitUntil: 'load' });
            await short.waitForTimeout(300);
            assert.equal(await short.evaluate(() => Math.round(document.getElementById('thesis-2').getBoundingClientRect().top)), 48, 'landed at the scroll margin');
            await follow();
            assert.match(short.url(), /\/original#thesis-2$/);
            await short.waitForTimeout(300);
            await follow();
            assert.match(short.url(), /seed-theses-1845#thesis-2$/, 'and back');
            await short.close();

            // Reading position: scrolling page 2 of the treatise past a chapter
            // records it; a plain visit offers it; the offer goes there.
            await page.evaluate(() => localStorage.clear());
            await page.goto(origin + '/commulingo/docs/seed-long-treatise?p=2', { waitUntil: 'load' });
            assert.equal(await page.$eval('[data-doc-resume]', el => el.hidden), true, 'nothing to resume yet');
            const chapter = await page.$$eval('.doc-body h2[id]', hs => ({ id: hs[1].id, text: hs[1].textContent.trim() }));
            await page.evaluate(id => document.getElementById(id).scrollIntoView(), chapter.id);
            await page.waitForTimeout(300);
            const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('commulingo-doc-reading:/commulingo/docs/seed-long-treatise')));
            assert.equal(stored.page, 2);
            assert.equal(stored.anchor, chapter.id);
            assert.equal(stored.heading, chapter.text);
            await page.goto(origin + '/commulingo/docs/seed-long-treatise', { waitUntil: 'load' });
            assert.equal(await page.$eval('[data-doc-resume]', el => el.hidden), false, 'the offer shows on a plain visit');
            const offer = await page.$eval('.doc-resume-link', a => ({ text: a.textContent, href: a.getAttribute('href') }));
            assert.equal(offer.text, `2쪽 「${chapter.text}」부터 이어 읽기`);
            assert.equal(offer.href, `?p=2#${chapter.id}`);
            // The library list marks the document.
            await page.goto(origin + '/commulingo/docs', { waitUntil: 'load' });
            const badge = await page.$eval('a.commu-event-card[href="/commulingo/docs/seed-long-treatise"] .commu-doc-card-reading', el => el.textContent);
            assert.equal(badge, '읽던 문헌 · 2쪽');
            assert.equal(await page.$('a.commu-event-card[href="/commulingo/docs/seed-land-decree-1917"] .commu-doc-card-reading'), null);
            // Following the offer lands on the chapter; a visit with an address does not nag.
            await page.goto(origin + '/commulingo/docs/seed-long-treatise', { waitUntil: 'load' });
            await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.click('.doc-resume-link')]);
            assert.match(page.url(), new RegExp(`\\?p=2#${chapter.id}$`));
            assert.equal(await page.$eval('[data-doc-resume]', el => el.hidden), true);
            // Dismissing hides the offer until the position changes.
            await page.goto(origin + '/commulingo/docs/seed-long-treatise', { waitUntil: 'load' });
            await page.click('.doc-resume-dismiss');
            await page.goto(origin + '/commulingo/docs/seed-long-treatise', { waitUntil: 'load' });
            assert.equal(await page.$eval('[data-doc-resume]', el => el.hidden), true, 'dismissed');
            // The end of the last page forgets the document.
            await page.goto(origin + '/commulingo/docs/seed-long-treatise?p=3', { waitUntil: 'load' });
            await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
            await page.waitForTimeout(300);
            assert.equal(await page.evaluate(() => localStorage.getItem('commulingo-doc-reading:/commulingo/docs/seed-long-treatise')), null);

            assert.deepEqual(errors, [], `page errors at ${viewport.width}px`);
            await context.close();
        }
        console.log('doc reader: hop, footnote popover (cross-page and same-page), pin/Esc, jump and ↩ back, roles, name popover, contents, switch, reading position');
    } finally {
        if (browser) await browser.close();
        server.close();
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
