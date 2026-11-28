// @requires server:BASE_URL=http://127.0.0.1:3001
/* global document */
// Read-only browser regression for the link preview on a phone
// (public/js/commulingo-link-preview.js): a tap shows the box, a tap outside
// only closes it, the box opens the page the way the link would — same tab on
// a dictionary page, a new tab on an event page.
const { launchChromium } = require('../lib/browser');
const assert = require('node:assert/strict');
(async () => {
    const browser = await launchChromium({ headless: true });
    try {
        const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'ko-KR' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        const origin = (process.env.BASE_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');
        const LINKS = 'a.commu-person-link, a.commu-event-link, a.commu-term-link, a.commu-doc-link';

        async function firstLink(newTab) {
            const handle = await page.evaluateHandle(([sel, want]) => [...document.querySelectorAll(sel)]
                .find(a => (a.target === '_blank') === want && a.getBoundingClientRect().width > 0), [LINKS, newTab]);
            const el = handle.asElement();
            assert.ok(el, 'a previewed link (newTab=' + newTab + ')');
            await el.scrollIntoViewIfNeeded();
            return el;
        }

        // Dictionary page: same tab.
        await page.goto(origin + '/commulingo/people/lenin', { waitUntil: 'networkidle' });
        let link = await firstLink(false);
        const href = await link.evaluate(a => a.href);
        const before = page.url();
        await link.tap();
        await page.waitForSelector('.link-pop.is-tap');
        assert.equal(page.url(), before, 'tap shows the box, does not navigate');
        // A tap outside closes and goes nowhere.
        await page.touchscreen.tap(5, 840);
        await page.waitForFunction(() => !document.querySelector('.link-pop'));
        assert.equal(page.url(), before);
        await link.tap();
        await page.waitForSelector('.link-pop.is-tap');
        await Promise.all([page.waitForURL(href), page.tap('.link-pop.is-tap')]);
        console.log('same tab ok:', href);

        // Event page: a new tab.
        await page.goto(origin + '/commulingo/events/civil-war', { waitUntil: 'networkidle' });
        link = await firstLink(true);
        const eventUrl = page.url();
        await link.tap();
        await page.waitForSelector('.link-pop.is-tap');
        const [popup] = await Promise.all([context.waitForEvent('page'), page.tap('.link-pop.is-tap')]);
        await popup.waitForLoadState();
        assert.equal(page.url(), eventUrl, 'event page stays');
        console.log('new tab ok:', popup.url());
        await popup.close();

        // A reference-library link gets the same box.
        await page.goto(origin + '/commulingo/people/lenin', { waitUntil: 'networkidle' });
        const docLink = page.locator('a.commu-doc-link').first();
        await docLink.scrollIntoViewIfNeeded();
        await docLink.tap();
        await page.waitForSelector('.link-pop.is-tap');
        console.log('doc box ok:', await page.textContent('.link-pop.is-tap strong'));
        await page.touchscreen.tap(5, 840);
        await page.waitForFunction(() => !document.querySelector('.link-pop'));

        // The reader's fictionalized name: tap shows, a tap outside only
        // closes, the box opens the real person in a new tab.
        await page.goto(origin + '/commulingo/docs/much-of-a-muchness', { waitUntil: 'networkidle' });
        const name = page.locator('a.fic-name[href]').first();
        await name.scrollIntoViewIfNeeded();
        await name.tap();
        await page.waitForSelector('.doc-pop-name.is-link');
        const readerUrl = page.url();
        await page.touchscreen.tap(5, 840);
        await page.waitForFunction(() => !document.querySelector('.doc-pop'));
        assert.equal(page.url(), readerUrl);
        await name.tap();
        await page.waitForSelector('.doc-pop-name.is-link');
        const [real] = await Promise.all([context.waitForEvent('page'), page.tap('.doc-pop-name .doc-pop-label')]);
        await real.waitForLoadState();
        assert.equal(page.url(), readerUrl, 'reader stays');
        console.log('name box ok:', real.url());
        assert.deepEqual(errors, []);
        console.log('link-preview-touch: ok');
    } finally {
        await browser.close();
    }
})().catch(e => { console.error(e); process.exit(1); });
