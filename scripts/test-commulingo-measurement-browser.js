/* global navigator, document, window, innerWidth */
// Run against scripts/dev-preview. All measurement requests are intercepted.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
    const browser = await chromium.launch({ headless: true });
    const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3001';
    try {
        const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
        await context.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
        const page = await context.newPage();
        const events = [], errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.route('**/commulingo/measurement', async route => {
            events.push(route.request().postDataJSON());
            await route.fulfill({ status: 204 });
        });
        await page.goto(base + '/commulingo/book/capital-vol1', { waitUntil: 'networkidle' });
        assert.equal(events.length, 0);
        await page.locator('.commu-lesson-action').first().click();
        await page.locator('#commuNextBtn').click();
        for (let i = 0; i < 5; i++) {
            await page.locator('#commuChoices button').first().click();
            await page.locator('#commuNextBtn').click();
        }
        await page.waitForFunction(() => document.querySelector('#commuNextBtn').hasAttribute('data-finished'));
        await page.waitForTimeout(500);
        assert.equal(events.filter(e => e.event === 'started').length, 1);
        assert.equal(events.filter(e => e.event === 'answered').length, 5);
        assert.equal(events.filter(e => e.event === 'completed').length, 1);
        assert.equal(new Set(events.map(e => e.runId)).size, 1);
        assert(events.every(e => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(e.runId)));
        assert(events.every(e => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(e.eventId)));
        const before = events.length;
        await page.locator('#commuMeasurementOff').check();
        await page.evaluate(() => window.CommuLingoMeasurement.answer(true));
        await page.waitForTimeout(100);
        assert.equal(events.length, before);
        for (const width of [360, 390, 1280]) {
            await page.setViewportSize({ width, height: 844 });
            for (const theme of ['dark', 'light']) {
                await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
                await page.locator('#commuMeasurementOff').scrollIntoViewIfNeeded();
                assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
                await page.screenshot({ path: `/tmp/learning-measurement-${width}-${theme}.png` });
            }
        }
        await page.locator('#commuMeasurementOff').uncheck();
        events.length = 0;
        await page.goto(base + '/commulingo/drill/terms-theory', { waitUntil: 'networkidle' });
        assert.equal(events.length, 0, 'automatic deck fetch is not learning');
        const size = await page.evaluate(() => JSON.parse(document.getElementById('commulingo-drill-meta').textContent).roundSize);
        for (let i = 0; i < size; i++) {
            await page.locator('#drillChoices button').first().click();
            await page.locator('#drillNextBtn').click();
        }
        await page.waitForTimeout(500);
        assert.equal(events.filter(e => e.event === 'started').length, 1);
        assert.equal(events.filter(e => e.event === 'answered').length, size);
        assert.equal(events.filter(e => e.event === 'completed').length, 1);
        events.length = 0;
        await page.goto(base + '/commulingo/drill/timeline-events', { waitUntil: 'networkidle' });
        await page.locator('#drillNextBtn').click();
        await page.waitForTimeout(500);
        assert.deepEqual(events.map(e => e.event), ['started', 'answered', 'completed']);
        events.length = 0;
        await page.goto(base + '/commulingo/book/capital-vol1?learning_test=1', { waitUntil: 'networkidle' });
        await page.locator('.commu-lesson-action').first().click();
        await page.locator('#commuNextBtn').click();
        await page.locator('#commuChoices button').first().click();
        await page.waitForTimeout(100);
        assert.equal(events.length, 0, 'marked test is excluded');
        assert.ok((await context.cookies()).some(c => c.name === 'commulingo_test' && c.value === '1'));
        const automated = await browser.newPage();
        let automatedEvents = 0;
        await automated.route('**/commulingo/measurement', route => { automatedEvents++; return route.fulfill({ status: 204 }); });
        await automated.goto(base + '/commulingo/drill/terms-theory', { waitUntil: 'networkidle' });
        await automated.locator('#drillChoices button').first().click();
        await automated.waitForTimeout(100);
        assert.equal(automatedEvents, 0, 'webdriver is excluded');
        assert.deepEqual(errors, []);
        console.log('Browser: lesson, quiz, timeline, opt-out, test cookie, webdriver and responsive themes passed.');
    } finally {
        await browser.close();
    }
})().catch(err => { console.error(err); process.exitCode = 1; });
