// The reader's footnote popover (public/js/commulingo-doc.js) on the seed
// documents (tests/fixtures/commulingo-docs-seed.json), served by the real
// documents route on a test server: hover previews a note that lives on
// another page, a tap pins it instead of leaving the page, Esc closes it, the
// popover's link goes to the notes list and the note's ↩ comes back by
// history, and the DPUB-ARIA roles are on the page. Also the fictionalized
// name popover, on a mark injected into the page.
/* global document, window, sessionStorage */
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
    const { siteStyleModules } = require('../../utils/site-stylesheets');
    app.use((req, res, next) => { Object.assign(res.locals, { roleIconSvg, siteStyleModules }); next(); });
    app.use('/commulingo/docs', require('../../routes/commulingo-docs'));
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

            assert.deepEqual(errors, [], `page errors at ${viewport.width}px`);
            await context.close();
        }
        console.log('doc reader: footnote popover (cross-page and same-page), pin/Esc, jump and ↩ back, roles, name popover');
    } finally {
        if (browser) await browser.close();
        server.close();
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
