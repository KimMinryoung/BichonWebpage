/* global document, innerWidth, location, window */
// Read-only browser regression. BASE_URL selects preview or production.
// Simulated failures are intercepted only in this browser.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
    const browser = await chromium.launch({ headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: 'ko-KR' });
        const errors = [], requests = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('request', r => requests.push(r.url()));
        const origin = (process.env.BASE_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');
        const input = page.locator('[data-commu-dict-search-input]');
        async function goto(path) { await page.goto(origin + path, { waitUntil: 'networkidle' }); }
        async function search(kind, query) {
            const pending = page.waitForResponse(r => r.url().includes('/' + kind + '/search?') && r.status() === 200);
            const start = Date.now();
            await input.fill(query);
            const response = await pending;
            const data = await response.json();
            await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]') && !document.querySelector('[data-commu-dict-search-status]').textContent.includes('불러오는'));
            console.log(JSON.stringify({ kind, query, ms: Date.now() - start, bytes: (await response.body()).length, total: data.total }));
            return data;
        }
        await goto('/commulingo/terms');
        const before = requests.length;
        await input.focus(); await page.waitForTimeout(300);
        assert(!requests.slice(before).some(url => url.includes('/terms/cards') || url.includes('/terms/search')), 'focus must not prefetch corpus');
        let data = await search('terms', 'NEP');
        assert(data.total > 0);
        assert(await page.locator('#commu-term-list').isHidden());
        assert.equal(await page.locator('#commu-term-list-results .commu-event-card').count(), Math.min(24, data.total));
        await input.press('Escape');
        assert(await page.locator('#commu-term-list-results').isHidden());
        assert(await page.locator('#commu-term-list').isVisible());
        const category = await page.locator('[data-category]').evaluateAll(nodes => nodes.find(n => Number(n.querySelector('span')?.textContent) > 24).dataset.category);
        let pending = page.waitForResponse(r => r.url().includes('/terms/search?') && r.status() === 200);
        await page.locator('[data-category="' + category + '"]').click();
        data = await (await pending).json();
        assert(data.total > 24);
        await page.waitForFunction(() => document.querySelectorAll('#commu-term-list-results .commu-event-card').length === 24);
        const firstIds = await page.locator('#commu-term-list-results a').evaluateAll(nodes => nodes.map(n => n.href));
        pending = page.waitForResponse(r => r.url().includes('/terms/search?') && r.url().includes('page=2') && r.status() === 200);
        await page.locator('.pagination a[href*="page=2"]').first().click();
        await pending;
        await page.waitForFunction(first => !document.querySelector('#commu-term-list-results a') || !first.includes(document.querySelector('#commu-term-list-results a').href), firstIds);
        await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'));
        const secondIds = await page.locator('#commu-term-list-results a').evaluateAll(nodes => nodes.map(n => n.href));
        assert(secondIds.length > 0 && secondIds.every(id => !firstIds.includes(id)));
        await page.locator('[data-category="' + category + '"]').click();
        assert(await page.locator('#commu-term-list').isVisible());
        let fail = true;
        await page.route('**/terms/search?*', async route => {
            if (fail) { fail = false; await route.fulfill({ status: 500, body: '{}' }); }
            else await route.continue();
        });
        await input.fill('NEP');
        await page.getByRole('button', { name: '다시 시도', exact: true }).waitFor();
        pending = page.waitForResponse(r => r.url().includes('/terms/search?') && r.status() === 200);
        await page.getByRole('button', { name: '다시 시도', exact: true }).click(); await pending;
        await page.locator('#commu-term-list-results .commu-event-card').first().waitFor();
        await page.unroute('**/terms/search?*');
        await input.fill('zzzznonexistent');
        await input.press('Escape');
        await page.waitForTimeout(300);
        assert(await page.locator('#commu-term-list-results').isHidden());
        const groupId = await page.locator('.commu-term-group-head[data-pending]').last().getAttribute('id');
        let failGroup = true;
        await page.route('**/terms/cards?*', async route => {
            if (new URL(route.request().url()).searchParams.get('group') === groupId && failGroup) {
                await route.fulfill({ status: 500, body: '' });
            } else await route.continue();
        });
        // Start with a fresh page so an earlier browse cannot have the
        // target group already in flight before interception was installed.
        await goto('/commulingo/terms');
        await page.locator('.commu-dict-index a[href="#' + groupId + '"]').click();
        const groupRetry = page.locator('#' + groupId + ' + .commu-people-loading button');
        await groupRetry.waitFor();
        failGroup = false;
        await groupRetry.click();
        await page.waitForFunction(id => !document.getElementById(id).hasAttribute('data-pending'), groupId);
        assert.equal(await page.locator('#' + groupId + ' + .commu-people-loading').count(), 0);
        await page.unroute('**/terms/cards?*');
        await goto('/commulingo/terms?sort=chrono');
        data = await search('terms', 'NEP');
        assert(requests.at(-1).includes('sort=chrono') || requests.some(u => u.includes('/terms/search?') && u.includes('sort=chrono')));
        assert(data.total > 0);
        for (const width of [360, 390, 1280, 1920]) {
            await page.setViewportSize({ width, height: 900 });
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'overflow at ' + width);
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: '/tmp/dictionary-search-mobile.png' });
        await goto('/commulingo/docs');
        assert.equal(await page.locator('#commu-doc-list .commu-event-card').count(), 24);
        pending = page.waitForResponse(r => r.url().includes('/docs/search?') && r.status() === 200);
        await page.locator('.pagination a[href*="page=2"]').first().click(); await pending;
        await page.waitForURL('**/docs?page=2');
        data = await search('docs', '혁명'); assert(data.total > 0);
        data = await search('docs', 'zzzznonexistent'); assert.equal(data.total, 0);
        await input.press('Escape');
        await page.waitForFunction(() => document.querySelectorAll('#commu-doc-list .commu-event-card').length === 24);
        const kind = await page.locator('[data-category]:not([data-category=""])').first().getAttribute('data-category');
        pending = page.waitForResponse(r => r.url().includes('/docs/search?') && r.status() === 200);
        await page.locator('[data-category="' + kind + '"]').click(); await pending;
        await page.waitForURL('**/docs?kind=' + kind);
        await goto('/commulingo/events');
        const countrySummary = page.locator('[data-event-country-filter] summary');
        await countrySummary.click();
        const countryInput = page.locator('[data-country-search]');
        await countryInput.fill('네덜란드');
        assert.equal(await page.locator('[data-country-label]:visible').count(), 1);
        await page.locator('[data-country-label="네덜란드"]').click();
        await page.waitForURL('**/events?country=netherlands');
        assert(await page.locator('.commu-people-condition').isVisible());
        assert(await page.locator('#commu-event-list .commu-event-card').count() > 0);
        await page.locator('.commu-people-condition').click();
        await page.waitForURL('**/commulingo/events');
        await countrySummary.click();
        await page.locator('[data-country-label="프랑스"]').click();
        await page.waitForURL('**/events?country=france');
        data = await search('events', '1789'); assert(data.total > 0);
        assert(requests.some(u => u.includes('/events/search?') && u.includes('country=france')));
        await page.locator('.commu-people-condition').click();
        await page.waitForURL('**/events?q=1789');
        assert.equal(await input.inputValue(), '1789');
        await input.press('Escape');
        await page.waitForURL('**/commulingo/events');
        await countrySummary.click();
        for (const width of [360, 390, 1280, 1920]) {
            await page.setViewportSize({ width, height: 900 });
            for (const theme of ['dark', 'light']) {
                await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'country filter overflow at ' + width);
            }
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: '/tmp/events-country-filter-mobile.png' });
        await countryInput.press('Escape');
        assert(await countrySummary.evaluate(node => node === document.activeElement));
        await goto('/en/commulingo/events?country=netherlands');
        await countrySummary.click();
        await countryInput.fill('France');
        await page.locator('[data-country-label="France"]').click();
        await page.waitForURL('**/en/commulingo/events?country=france');
        await goto('/en/commulingo/docs');
        data = await search('docs', 'revolution'); assert(data.total > 0);
        assert((await page.locator('#commu-doc-list a').first().getAttribute('href')).startsWith('/en/'));
        await goto('/commulingo/map');
        const mapStart = requests.length;
        await input.fill('Russia');
        assert(await page.locator('.commu-country-card:visible').count() > 0);
        assert(!requests.slice(mapStart).some(u => u.includes('/search')));
        await input.press('Escape');
        assert.equal(await page.locator('.commu-country-group[hidden]').count(), 0);
        await goto('/commulingo/people?lang=ko');
        const eraLink = page.locator('.commu-people-group-head[href*="era=china-old-regime"]');
        assert.equal(await eraLink.getAttribute('href'), '/commulingo/people?era=china-old-regime');
        assert.equal(await page.locator('a[href*="/people/list/"]').count(), 0);
        for (const width of [360, 390, 640, 641, 1280, 1920]) {
            await page.setViewportSize({ width, height: 900 });
            await page.evaluate(() => window.scrollTo(0, 0));
            const layout = await page.evaluate(() => {
                const rect = selector => document.querySelector(selector).getBoundingClientRect();
                const crumb = rect('.commu-crumb'), search = rect('[data-people-search]'), filters = rect('.commu-people-filterbar');
                return { crumbGap: search.top - crumb.bottom, filterGap: filters.top - search.bottom,
                    tops: Array.from(document.querySelectorAll('.commu-people-facet > summary'), node => node.getBoundingClientRect().top),
                    overflow: document.documentElement.scrollWidth > innerWidth };
            });
            assert(Math.abs(layout.crumbGap) < 1 && Math.abs(layout.filterGap) < 1, 'people search gaps at ' + width);
            assert(!layout.overflow, 'people filters overflow at ' + width);
            if (width <= 640) {
                assert.equal(layout.tops[0], layout.tops[2]);
                assert.equal(layout.tops[3], layout.tops[5]);
                assert(layout.tops[3] > layout.tops[0]);
            }
        }
        const preview = page.locator('[data-group-id="china-old-regime"]');
        await preview.locator('summary').focus();
        await preview.locator('summary').press('Enter');
        await preview.locator('.commu-person-card').first().waitFor();
        assert(!(new URL(page.url())).searchParams.has('era'), 'preview keeps the era shelves');
        assert(await preview.locator('.commu-person-bio').first().textContent(), 'preview keeps full biographies');
        await preview.locator('summary').press('Enter');
        assert.equal(await preview.getAttribute('open'), null);
        await eraLink.locator('h2').click();
        await page.waitForURL('**/people?era=china-old-regime');
        assert(await page.locator('[data-facet="era"].is-set').count() > 0);
        assert(await page.locator('.commu-people-row').count() > 0);
        for (const prefix of ['', '/en']) {
            const redirect = await page.request.get(origin + prefix + '/commulingo/people/list/china-old-regime', { maxRedirects: 0 });
            assert.equal(redirect.status(), 301);
            assert.equal(redirect.headers().location, prefix + '/commulingo/people?era=china-old-regime');
        }
        await goto('/en/commulingo/people');
        await page.locator('#commu-people-search-input').fill('Lenin');
        await page.locator('#people-results').waitFor();
        await page.locator('.commu-people-row-name mark').first().waitFor();
        assert(page.url().includes('/en/commulingo/people?q=Lenin'));
        assert((await page.locator('.commu-people-row-link').first().getAttribute('href')).startsWith('/en/'));
        // A facet narrows the search in place and keeps the query.
        await page.locator('details[data-facet="function"] > summary').click();
        await page.locator('details[data-facet="function"] .commu-people-chip:not(.is-active)').first().click();
        await page.waitForFunction(() => /function=/.test(location.search) && /q=Lenin/.test(location.search));
        await page.locator('#commu-people-search-input').fill('Stalin');
        await page.locator('#commu-people-search-input').press('Escape');
        await page.waitForFunction(() => !/q=/.test(location.search));
        await page.goBack();
        await page.waitForFunction(() => /q=Lenin/.test(location.search));
        assert.equal(errors.length, 0, errors.join('\n'));
        console.log('filters, paging, clear, retry, sorting, country scope, English, mobile, map and shared person highlighting passed');
    } finally { await browser.close(); }
})().catch(err => { console.error(err); process.exitCode = 1; });
